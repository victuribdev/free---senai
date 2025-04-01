// Estado global da aplicação
let currentUser = null;
let currentPublication = null;
let currentComment = null;

// Configuração da API
const API_URL = 'api';

// Dados estáticos (como backup caso a API não esteja disponível)
const usuarios = [
    { id: 1, nome: "usuario01", email: "usuario01@usuario.com", nickname: "usuario_01", senha: "123456", foto: "usuario_01.jpg" },
    { id: 2, nome: "usuario02", email: "usuario02@usuario.com", nickname: "usuario_02", senha: "654321", foto: "usuario_02.jpg" },
    { id: 3, nome: "usuario03", email: "usuario03@usuario.com", nickname: "usuario_03", senha: "987654", foto: "usuario_03.jpg" }
];

const empresas = [
    { id_empresa: 1, nome: "Sabor do Brasil", logo: "logo_sabor_do_brasil.png" }
];

const publicacoes = [
    { id_publicacao: 1, foto: "publicacao01.png", titulo_prato: "Titulo do Prato 01", local: "Local 01", cidade: "Maceio-AL", empresa_id: 1 },
    { id_publicacao: 2, foto: "publicacao02.png", titulo_prato: "Titulo do Prato 02", local: "Local 02", cidade: "Minas Gerais-MG", empresa_id: 1 },
    { id_publicacao: 3, foto: "publicacao03.png", titulo_prato: "Titulo do Prato 03", local: "Local 03", cidade: "Rio de Janerio-RJ", empresa_id: 1 }
];

// Arrays para armazenar dados da API
let dadosPublicacoes = [];
let likes = [];
let dislikes = [];
let comentarios = [];

// Função para fazer requisições à API
async function fetchAPI(endpoint, method = 'GET', data = null) {
    try {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json'
            }
        };
        
        if (data && (method === 'POST' || method === 'PUT' || method === 'DELETE')) {
            options.body = JSON.stringify(data);
        }
        
        const url = `${API_URL}/${endpoint}${method === 'GET' && data ? '?' + new URLSearchParams(data).toString() : ''}`;
        const response = await fetch(url, options);
        const result = await response.json();
        
        return result;
    } catch (error) {
        console.error('Erro na requisição:', error);
        return { success: false, message: 'Erro na conexão com o servidor' };
    }
}

// Função para carregar dados iniciais
async function carregarDadosIniciais() {
    try {
        // Carregar publicações
        const resultPublicacoes = await fetchAPI('publicacoes.php');
        if (resultPublicacoes.success) {
            dadosPublicacoes = resultPublicacoes.publicacoes;
        } else {
            // Usar dados estáticos se a API falhar
            dadosPublicacoes = publicacoes;
        }
        
        // Carregar likes e dislikes
        const resultLikesDislikes = await fetchAPI('likes.php');
        if (resultLikesDislikes.success) {
            likes = resultLikesDislikes.likes || [];
            dislikes = resultLikesDislikes.dislikes || [];
        }
        
        // Carregar comentários
        const resultComentarios = await fetchAPI('comentarios.php');
        if (resultComentarios.success) {
            comentarios = resultComentarios.comentarios || [];
        }
        
        // Verificar se há um usuário já logado
        const userStorage = localStorage.getItem('sabor_brasil_user');
        if (userStorage) {
            currentUser = JSON.parse(userStorage);
            if (loginButton) {
                loginButton.textContent = 'Sair';
            }
        }
        
        // Atualizar a interface
        updateProfile();
        renderPublications();
    } catch (error) {
        console.error('Erro ao carregar dados iniciais:', error);
        // Fallback para dados estáticos
        dadosPublicacoes = publicacoes;
        updateProfile();
        renderPublications();
    }
}

// Função para realizar login
async function fazerLogin(nickname, senha) {
    try {
        const result = await fetchAPI('auth.php', 'POST', { nickname, senha });
        
        if (result.success) {
            currentUser = result.usuario;
            localStorage.setItem('sabor_brasil_user', JSON.stringify(currentUser));
            return { success: true, usuario: currentUser };
        } else {
            return { success: false, message: result.message };
        }
    } catch (error) {
        console.error('Erro no login:', error);
        
        // Fallback se a API falhar
        const usuario = usuarios.find(u => u.nickname === nickname && u.senha === senha);
        if (usuario) {
            currentUser = usuario;
            localStorage.setItem('sabor_brasil_user', JSON.stringify(currentUser));
            return { success: true, usuario: currentUser };
        }
        
        return { success: false, message: 'Erro na conexão com o servidor' };
    }
}

// Função para gerenciar likes
async function gerenciarLike(publicacaoId, acao = 'adicionar') {
    if (!currentUser) return false;
    
    try {
        const result = await fetchAPI('likes.php', 'POST', {
            usuario_id: currentUser.id,
            publicacao_id: publicacaoId,
            tipo: 'like',
            acao
        });
        
        if (result.success) {
            // Atualizar dados locais
            if (acao === 'adicionar') {
                // Remover dislike se existir
                dislikes = dislikes.filter(d => !(d.usuario_id === currentUser.id && d.publicacao_id === publicacaoId));
                // Adicionar like
                likes.push({ usuario_id: currentUser.id, publicacao_id: publicacaoId });
            } else {
                // Remover like
                likes = likes.filter(l => !(l.usuario_id === currentUser.id && l.publicacao_id === publicacaoId));
            }
            return true;
        }
        return false;
    } catch (error) {
        console.error('Erro ao gerenciar like:', error);
        return false;
    }
}

// Função para gerenciar dislikes
async function gerenciarDislike(publicacaoId, acao = 'adicionar') {
    if (!currentUser) return false;
    
    try {
        const result = await fetchAPI('likes.php', 'POST', {
            usuario_id: currentUser.id,
            publicacao_id: publicacaoId,
            tipo: 'dislike',
            acao
        });
        
        if (result.success) {
            // Atualizar dados locais
            if (acao === 'adicionar') {
                // Remover like se existir
                likes = likes.filter(l => !(l.usuario_id === currentUser.id && l.publicacao_id === publicacaoId));
                // Adicionar dislike
                dislikes.push({ usuario_id: currentUser.id, publicacao_id: publicacaoId });
            } else {
                // Remover dislike
                dislikes = dislikes.filter(d => !(d.usuario_id === currentUser.id && d.publicacao_id === publicacaoId));
            }
            return true;
        }
        return false;
    } catch (error) {
        console.error('Erro ao gerenciar dislike:', error);
        return false;
    }
}

// Função para adicionar comentário
async function adicionarComentario(publicacaoId, texto) {
    if (!currentUser) return false;
    
    try {
        const result = await fetchAPI('comentarios.php', 'POST', {
            usuario_id: currentUser.id,
            publicacao_id: publicacaoId,
            texto
        });
        
        if (result.success) {
            // Adicionar comentário local
            comentarios.push(result.comentario);
            return true;
        }
        return false;
    } catch (error) {
        console.error('Erro ao adicionar comentário:', error);
        return false;
    }
}

// Função para atualizar comentário
async function atualizarComentario(comentarioId, texto) {
    if (!currentUser) return false;
    
    try {
        const result = await fetchAPI('comentarios.php', 'PUT', {
            id: comentarioId,
            usuario_id: currentUser.id,
            texto
        });
        
        if (result.success) {
            // Atualizar comentário local
            const index = comentarios.findIndex(c => c.id === comentarioId);
            if (index !== -1) {
                comentarios[index].texto = texto;
            }
            return true;
        }
        return false;
    } catch (error) {
        console.error('Erro ao atualizar comentário:', error);
        return false;
    }
}

// Função para excluir comentário
async function excluirComentario(comentarioId) {
    if (!currentUser) return false;
    
    try {
        const result = await fetchAPI('comentarios.php', 'DELETE', {
            id: comentarioId,
            usuario_id: currentUser.id
        });
        
        if (result.success) {
            // Remover comentário local
            comentarios = comentarios.filter(c => c.id !== comentarioId);
            return true;
        }
        return false;
    } catch (error) {
        console.error('Erro ao excluir comentário:', error);
        return false;
    }
}

// Elementos do DOM
const loginButton = document.getElementById('login-button');
const loginModal = document.getElementById('login-modal');
const loginForm = document.getElementById('login-form');
const cancelButton = document.getElementById('cancel-button');
const commentModal = document.getElementById('comment-modal');
const commentForm = document.getElementById('comment-form');
const cancelCommentButton = document.getElementById('cancel-comment-button');
const deleteModal = document.getElementById('delete-modal');
const noDeleteButton = document.getElementById('no-delete-button');
const yesDeleteButton = document.getElementById('yes-delete-button');
const publicationsContainer = document.getElementById('publications-container');

// Funções de manipulação de modais
function showModal(modal) {
    modal.style.display = 'block';
}

function hideModal(modal) {
    modal.style.display = 'none';
}

// Função para atualizar o perfil
function updateProfile() {
    const profileCard = document.querySelector('.profile-card');
    const logo = profileCard.querySelector('.logo');
    const companyName = profileCard.querySelector('.company-name');
    const totalLikes = document.getElementById('total-likes');
    const totalDislikes = document.getElementById('total-dislikes');

    if (currentUser) {
        logo.src = `Anexos/foto_usuario/${currentUser.foto}`;
        logo.alt = `Foto de ${currentUser.nome}`;
        companyName.textContent = currentUser.nickname;
        totalLikes.textContent = likes.filter(l => l.usuario_id === currentUser.id).length;
        totalDislikes.textContent = dislikes.filter(d => d.usuario_id === currentUser.id).length;
    } else {
        logo.src = `Anexos/logo/${empresas[0].logo}`;
        logo.alt = 'Logo Sabor do Brasil';
        companyName.textContent = empresas[0].nome;
        totalLikes.textContent = likes.length;
        totalDislikes.textContent = dislikes.length;
    }
}

// Função para renderizar as publicações
function renderPublications() {
    publicationsContainer.innerHTML = '';
    
    dadosPublicacoes.forEach(publication => {
        const publicationCard = document.createElement('div');
        publicationCard.className = 'publication-card';
        
        const likesCount = likes.filter(l => l.publicacao_id == publication.id_publicacao).length;
        const dislikesCount = dislikes.filter(d => d.publicacao_id == publication.id_publicacao).length;
        const commentsCount = comentarios.filter(c => c.publicacao_id == publication.id_publicacao).length;
        
        // Verificar se o usuário atual deu like ou dislike
        const userLiked = currentUser && likes.some(l => l.usuario_id == currentUser.id && l.publicacao_id == publication.id_publicacao);
        const userDisliked = currentUser && dislikes.some(d => d.usuario_id == currentUser.id && d.publicacao_id == publication.id_publicacao);
        
        publicationCard.innerHTML = `
            <h3 class="publication-title">${publication.titulo_prato}</h3>
            <img src="Anexos/publicacao/${publication.foto}" alt="${publication.titulo_prato}" class="publication-image">
            <div class="publication-content">
                <div class="publication-location">
                    <span>${publication.local}</span>
                    <span>${publication.cidade}</span>
                </div>
                <div class="publication-actions">
                    <div class="action-group like-button" data-publication-id="${publication.id_publicacao}">
                        <img src="Anexos/icones/${userLiked ? 'flecha_cima_cheia.svg' : 'flecha_cima_vazia.svg'}" alt="Like">
                        <span>${likesCount}</span>
                    </div>
                    <div class="action-group dislike-button" data-publication-id="${publication.id_publicacao}">
                        <img src="Anexos/icones/${userDisliked ? 'flecha_baixo_cheia.svg' : 'flecha_baixo_vazia.svg'}" alt="Dislike">
                        <span>${dislikesCount}</span>
                    </div>
                    <div class="action-group comment-button" data-publication-id="${publication.id_publicacao}">
                        <img src="Anexos/icones/chat.svg" alt="Comentar">
                        <span>${commentsCount}</span>
                    </div>
                </div>
            </div>
            
            ${commentsCount > 0 ? `
                <div class="publication-comments">
                    <h4>Comentários</h4>
                    ${renderComments(publication.id_publicacao)}
                </div>
            ` : ''}
        `;
        
        publicationsContainer.appendChild(publicationCard);
        
        // Adicionar event listeners para os botões
        const likeButton = publicationCard.querySelector('.like-button');
        const dislikeButton = publicationCard.querySelector('.dislike-button');
        const commentButton = publicationCard.querySelector('.comment-button');
        
        likeButton.addEventListener('click', () => handleLike(publication.id_publicacao));
        dislikeButton.addEventListener('click', () => handleDislike(publication.id_publicacao));
        commentButton.addEventListener('click', () => handleComment(publication.id_publicacao));
        
        // Adicionar event listeners para botões de editar e excluir comentários
        const editButtons = publicationCard.querySelectorAll('.edit-comment');
        const deleteButtons = publicationCard.querySelectorAll('.delete-comment');
        
        editButtons.forEach(button => {
            button.addEventListener('click', () => {
                const commentId = parseInt(button.getAttribute('data-comment-id'));
                const comment = comentarios.find(c => c.id == commentId);
                if (comment) {
                    currentComment = commentId;
                    currentPublication = comment.publicacao_id;
                    document.getElementById('comment-text').value = comment.texto;
                    showModal(commentModal);
                }
            });
        });
        
        deleteButtons.forEach(button => {
            button.addEventListener('click', () => {
                const commentId = parseInt(button.getAttribute('data-comment-id'));
                currentComment = commentId;
                showModal(deleteModal);
            });
        });
    });
}

// Função para renderizar comentários
function renderComments(publicationId) {
    const publicationComments = comentarios.filter(c => c.publicacao_id == publicationId);
    return publicationComments.map(comment => {
        return `
            <div class="comment" data-comment-id="${comment.id}">
                <div class="comment-header">
                    <span class="comment-author">${comment.nome || 'Usuário'}</span>
                    ${currentUser && currentUser.id == comment.usuario_id ? `
                        <div class="comment-actions">
                            <button class="edit-comment" data-comment-id="${comment.id}">
                                <img src="Anexos/icones/lapis_editar.svg" alt="Editar">
                            </button>
                            <button class="delete-comment" data-comment-id="${comment.id}">
                                <img src="Anexos/icones/lixeira_deletar.svg" alt="Excluir">
                            </button>
                        </div>
                    ` : ''}
                </div>
                <p class="comment-text">${comment.texto}</p>
            </div>
        `;
    }).join('');
}

// Event Listeners
loginButton.addEventListener('click', () => {
    if (currentUser) {
        currentUser = null;
        localStorage.removeItem('sabor_brasil_user');
        loginButton.textContent = 'Entrar';
        updateProfile();
        renderPublications();
    } else {
        showModal(loginModal);
    }
});

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nickname = document.getElementById('nickname').value;
    const senha = document.getElementById('senha').value;
    
    const result = await fazerLogin(nickname, senha);
    
    if (result.success) {
        loginButton.textContent = 'Sair';
        hideModal(loginModal);
        loginForm.reset();
        updateProfile();
        renderPublications();
    } else {
        alert(result.message || 'Nickname ou senha incorretos!');
        document.getElementById('nickname').style.borderColor = '#FF0000';
        document.getElementById('senha').style.borderColor = '#FF0000';
    }
});

cancelButton.addEventListener('click', () => {
    hideModal(loginModal);
    loginForm.reset();
    document.getElementById('nickname').style.borderColor = '';
    document.getElementById('senha').style.borderColor = '';
});

cancelCommentButton.addEventListener('click', () => {
    hideModal(commentModal);
    commentForm.reset();
    currentComment = null;
});

noDeleteButton.addEventListener('click', () => {
    hideModal(deleteModal);
    currentComment = null;
});

yesDeleteButton.addEventListener('click', async () => {
    if (currentComment) {
        const success = await excluirComentario(currentComment);
        if (success) {
            hideModal(deleteModal);
            renderPublications();
            currentComment = null;
        } else {
            alert('Erro ao excluir comentário. Tente novamente.');
        }
    }
});

// Função para lidar com likes
async function handleLike(publicationId) {
    if (!currentUser) {
        showModal(loginModal);
        return;
    }
    
    const existingLike = likes.find(l => l.usuario_id == currentUser.id && l.publicacao_id == publicationId);
    
    if (existingLike) {
        // Remove o like
        await gerenciarLike(publicationId, 'remover');
    } else {
        // Adiciona o like
        await gerenciarLike(publicationId, 'adicionar');
    }
    
    renderPublications();
    updateProfile();
}

// Função para lidar com dislikes
async function handleDislike(publicationId) {
    if (!currentUser) {
        showModal(loginModal);
        return;
    }
    
    const existingDislike = dislikes.find(d => d.usuario_id == currentUser.id && d.publicacao_id == publicationId);
    
    if (existingDislike) {
        // Remove o dislike
        await gerenciarDislike(publicationId, 'remover');
    } else {
        // Adiciona o dislike
        await gerenciarDislike(publicationId, 'adicionar');
    }
    
    renderPublications();
    updateProfile();
}

// Função para lidar com comentários
function handleComment(publicationId) {
    if (!currentUser) {
        showModal(loginModal);
        return;
    }
    
    currentPublication = publicationId;
    currentComment = null;
    document.getElementById('comment-text').value = '';
    showModal(commentModal);
}

commentForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const commentText = document.getElementById('comment-text').value;
    
    if (!commentText.trim()) {
        alert('Por favor, digite um comentário.');
        return;
    }
    
    if (currentUser && currentPublication) {
        let success = false;
        
        if (currentComment) {
            // Editar comentário existente
            success = await atualizarComentario(currentComment, commentText);
        } else {
            // Adicionar novo comentário
            success = await adicionarComentario(currentPublication, commentText);
        }
        
        if (success) {
            hideModal(commentModal);
            commentForm.reset();
            renderPublications();
            currentComment = null;
        } else {
            alert('Erro ao salvar comentário. Tente novamente.');
        }
    }
});

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    // Carregar dados
    carregarDadosIniciais();
}); 