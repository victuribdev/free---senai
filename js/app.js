// Estado global da aplicação
let currentUser = null;
let currentPublication = null;
let currentComment = null;

// Dados estáticos (simulando o banco de dados)
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

let usuarioLogado = null;
let likes = {};
let dislikes = {};
let comentarios = {};

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
        totalLikes.textContent = '2';
        totalDislikes.textContent = '1';
    } else {
        logo.src = `Anexos/logo/${empresas[0].logo}`;
        logo.alt = 'Logo Sabor do Brasil';
        companyName.textContent = empresas[0].nome;
        totalLikes.textContent = '12';
        totalDislikes.textContent = '0';
    }
}

// Função para renderizar as publicações
function renderPublications() {
    publicationsContainer.innerHTML = '';
    
    publicacoes.forEach(publication => {
        const publicationCard = document.createElement('div');
        publicationCard.className = 'publication-card';
        
        publicationCard.innerHTML = `
            <h3 class="publication-title">${publication.titulo_prato}</h3>
            <img src="Anexos/publicacao/${publication.foto}" alt="${publication.titulo_prato}" class="publication-image">
            <div class="publication-content">
                <div class="publication-location">
                    <span>${publication.local}</span>
                    <span>${publication.cidade}</span>
                </div>
                <div class="publication-actions">
                    <div class="action-group">
                        <img src="Anexos/icones/flecha_cima_vazia.svg" alt="Like">
                        <span>${Object.values(likes).filter(l => l.publicacao_id === publication.id_publicacao).length}</span>
                    </div>
                    <div class="action-group">
                        <img src="Anexos/icones/flecha_baixo_vazia.svg" alt="Dislike">
                        <span>${Object.values(dislikes).filter(d => d.publicacao_id === publication.id_publicacao).length}</span>
                    </div>
                    <div class="action-group">
                        <img src="Anexos/icones/chat.svg" alt="Comentar">
                        <span>${Object.values(comentarios).filter(c => c.publicacao_id === publication.id_publicacao).length}</span>
                    </div>
                </div>
            </div>
        `;
        
        publicationsContainer.appendChild(publicationCard);
        
        // Adicionar event listeners para os botões
        const actions = publicationCard.querySelectorAll('.action-group');
        actions.forEach(action => {
            action.addEventListener('click', () => {
                if (!currentUser) {
                    showModal(loginModal);
                }
            });
        });
    });
}

// Event Listeners
loginButton.addEventListener('click', () => {
    if (currentUser) {
        currentUser = null;
        loginButton.textContent = 'Entrar';
        updateProfile();
        renderPublications();
    } else {
        showModal(loginModal);
    }
});

cancelButton.addEventListener('click', () => {
    hideModal(loginModal);
    loginForm.reset();
});

cancelCommentButton.addEventListener('click', () => {
    hideModal(commentModal);
    commentForm.reset();
});

noDeleteButton.addEventListener('click', () => {
    hideModal(deleteModal);
});

// Função para renderizar comentários
function renderComments(publicationId) {
    const publicationComments = comentarios.filter(c => c.publicacao_id === publicationId);
    return publicationComments.map(comment => `
        <div class="comment" data-comment-id="${comment.id}">
            <div class="comment-header">
                <span class="comment-author">${usuarios.find(u => u.id === comment.usuario_id)?.nome}</span>
                ${currentUser?.id === comment.usuario_id ? `
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
    `).join('');
}

// Função para lidar com likes
function handleLike(publicationId) {
    if (!currentUser) {
        showModal(loginModal);
        return;
    }
    
    const publication = publicacoes.find(p => p.id_publicacao === publicationId);
    const existingLike = likes.find(l => l.usuario_id === currentUser.id && l.publicacao_id === publicationId);
    const existingDislike = dislikes.find(d => d.usuario_id === currentUser.id && d.publicacao_id === publicationId);
    
    if (existingLike) {
        // Remove o like
        delete likes[publicationId];
        publication.likes_count--;
    } else {
        // Adiciona o like
        if (existingDislike) {
            // Remove o dislike se existir
            delete dislikes[publicationId];
            publication.dislikes_count--;
        }
        likes[publicationId] = { usuario_id: currentUser.id, publicacao_id: publicationId };
        publication.likes_count++;
    }
    
    renderPublications();
    updateUserStats();
}

// Função para lidar com dislikes
function handleDislike(publicationId) {
    if (!currentUser) {
        showModal(loginModal);
        return;
    }
    
    const publication = publicacoes.find(p => p.id_publicacao === publicationId);
    const existingDislike = dislikes.find(d => d.usuario_id === currentUser.id && d.publicacao_id === publicationId);
    const existingLike = likes.find(l => l.usuario_id === currentUser.id && l.publicacao_id === publicationId);
    
    if (existingDislike) {
        // Remove o dislike
        delete dislikes[publicationId];
        publication.dislikes_count--;
    } else {
        // Adiciona o dislike
        if (existingLike) {
            // Remove o like se existir
            delete likes[publicationId];
            publication.likes_count--;
        }
        dislikes[publicationId] = { usuario_id: currentUser.id, publicacao_id: publicationId };
        publication.dislikes_count++;
    }
    
    renderPublications();
    updateUserStats();
}

// Função para lidar com comentários
function handleComment(publicationId) {
    if (!currentUser) {
        showModal(loginModal);
        return;
    }
    
    currentPublication = publicationId;
    showModal(commentModal);
}

// Função para atualizar estatísticas do usuário
function updateUserStats() {
    if (!currentUser) {
        document.getElementById('total-likes').textContent = '0';
        document.getElementById('total-dislikes').textContent = '0';
        return;
    }
    
    const userLikes = Object.values(likes).filter(l => l.usuario_id === currentUser.id).length;
    const userDislikes = Object.values(dislikes).filter(d => d.usuario_id === currentUser.id).length;
    
    document.getElementById('total-likes').textContent = userLikes;
    document.getElementById('total-dislikes').textContent = userDislikes;
}

// Event listener para o formulário de login
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const nickname = document.getElementById('nickname').value;
    const senha = document.getElementById('senha').value;
    
    const user = usuarios.find(u => u.nickname === nickname && u.senha === senha);
    
    if (user) {
        currentUser = user;
        loginButton.textContent = 'Sair';
        hideModal(loginModal);
        loginForm.reset();
        updateProfile();
        renderPublications();
    } else {
        document.getElementById('nickname').style.borderColor = '#FF0000';
        document.getElementById('senha').style.borderColor = '#FF0000';
    }
});

// Event listener para o formulário de comentário
commentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const texto = document.getElementById('comment-text').value;
    
    const newComment = {
        id: Date.now(),
        usuario_id: currentUser.id,
        publicacao_id: currentPublication,
        texto,
        createdAt: new Date()
    };
    
    comentarios[newComment.id] = newComment;
    const publication = publicacoes.find(p => p.id_publicacao === currentPublication);
    publication.comments_count++;
    
    hideModal(commentModal);
    commentForm.reset();
    renderPublications();
});

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    updateProfile();
    renderPublications();
}); 