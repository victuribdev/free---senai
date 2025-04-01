<?php
// Incluir arquivo de configuração
require_once 'config.php';

// Habilitar CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Se for uma requisição OPTIONS, apenas retornar os headers
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Para obter todos os likes de uma publicação
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['publicacao_id'])) {
    $publicacao_id = $conn->real_escape_string($_GET['publicacao_id']);
    
    // Obter likes
    $sql_likes = "SELECT l.*, u.nome, u.nickname, u.foto FROM likes l 
                 JOIN usuarios u ON l.usuario_id = u.id 
                 WHERE l.publicacao_id = $publicacao_id";
    $result_likes = $conn->query($sql_likes);
    
    $likes = [];
    if ($result_likes->num_rows > 0) {
        while ($row = $result_likes->fetch_assoc()) {
            $likes[] = $row;
        }
    }
    
    // Obter dislikes
    $sql_dislikes = "SELECT d.*, u.nome, u.nickname, u.foto FROM dislikes d 
                    JOIN usuarios u ON d.usuario_id = u.id 
                    WHERE d.publicacao_id = $publicacao_id";
    $result_dislikes = $conn->query($sql_dislikes);
    
    $dislikes = [];
    if ($result_dislikes->num_rows > 0) {
        while ($row = $result_dislikes->fetch_assoc()) {
            $dislikes[] = $row;
        }
    }
    
    echo json_encode([
        "success" => true,
        "likes" => $likes,
        "dislikes" => $dislikes
    ]);
}

// Para adicionar ou remover um like
elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Obter dados do JSON
    $data = json_decode(file_get_contents("php://input"));
    
    if (!empty($data->usuario_id) && !empty($data->publicacao_id) && isset($data->tipo)) {
        $usuario_id = $conn->real_escape_string($data->usuario_id);
        $publicacao_id = $conn->real_escape_string($data->publicacao_id);
        $tipo = $conn->real_escape_string($data->tipo); // 'like' ou 'dislike'
        
        // Verificar se é para adicionar ou remover
        $acao = isset($data->acao) ? $conn->real_escape_string($data->acao) : 'adicionar'; // 'adicionar' ou 'remover'
        
        // Verificar se o usuário já deu like ou dislike
        if ($tipo === 'like') {
            $sql_check = "SELECT * FROM likes WHERE usuario_id = $usuario_id AND publicacao_id = $publicacao_id";
            $sql_check_oposto = "SELECT * FROM dislikes WHERE usuario_id = $usuario_id AND publicacao_id = $publicacao_id";
            $tabela = "likes";
            $tabela_oposta = "dislikes";
        } else {
            $sql_check = "SELECT * FROM dislikes WHERE usuario_id = $usuario_id AND publicacao_id = $publicacao_id";
            $sql_check_oposto = "SELECT * FROM likes WHERE usuario_id = $usuario_id AND publicacao_id = $publicacao_id";
            $tabela = "dislikes";
            $tabela_oposta = "likes";
        }
        
        $result_check = $conn->query($sql_check);
        $result_check_oposto = $conn->query($sql_check_oposto);
        
        // Transação para garantir integridade
        $conn->begin_transaction();
        
        try {
            // Se for para adicionar
            if ($acao === 'adicionar') {
                // Se já existe, não precisa fazer nada
                if ($result_check->num_rows === 0) {
                    // Remove o oposto se existir
                    if ($result_check_oposto->num_rows > 0) {
                        $sql_delete_oposto = "DELETE FROM $tabela_oposta WHERE usuario_id = $usuario_id AND publicacao_id = $publicacao_id";
                        $conn->query($sql_delete_oposto);
                    }
                    
                    // Adiciona o novo
                    $sql_insert = "INSERT INTO $tabela (usuario_id, publicacao_id) VALUES ($usuario_id, $publicacao_id)";
                    $conn->query($sql_insert);
                }
            } 
            // Se for para remover
            else {
                $sql_delete = "DELETE FROM $tabela WHERE usuario_id = $usuario_id AND publicacao_id = $publicacao_id";
                $conn->query($sql_delete);
            }
            
            $conn->commit();
            
            // Retornar contagens atualizadas
            $sql_count_likes = "SELECT COUNT(*) as total FROM likes WHERE publicacao_id = $publicacao_id";
            $sql_count_dislikes = "SELECT COUNT(*) as total FROM dislikes WHERE publicacao_id = $publicacao_id";
            
            $result_count_likes = $conn->query($sql_count_likes);
            $result_count_dislikes = $conn->query($sql_count_dislikes);
            
            $count_likes = $result_count_likes->fetch_assoc()['total'];
            $count_dislikes = $result_count_dislikes->fetch_assoc()['total'];
            
            echo json_encode([
                "success" => true,
                "message" => "Operação realizada com sucesso",
                "likes_count" => $count_likes,
                "dislikes_count" => $count_dislikes
            ]);
        } catch (Exception $e) {
            $conn->rollback();
            
            echo json_encode([
                "success" => false,
                "message" => "Erro ao processar operação: " . $e->getMessage()
            ]);
        }
    } else {
        // Dados incompletos
        echo json_encode([
            "success" => false,
            "message" => "Dados incompletos"
        ]);
    }
}

// Para obter todos os likes e dislikes
elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Obter todos os likes
    $sql_likes = "SELECT l.*, u.nome, u.nickname, u.foto, p.titulo_prato 
                 FROM likes l 
                 JOIN usuarios u ON l.usuario_id = u.id 
                 JOIN publicacoes p ON l.publicacao_id = p.id_publicacao";
    $result_likes = $conn->query($sql_likes);
    
    $likes = [];
    if ($result_likes->num_rows > 0) {
        while ($row = $result_likes->fetch_assoc()) {
            $likes[] = $row;
        }
    }
    
    // Obter todos os dislikes
    $sql_dislikes = "SELECT d.*, u.nome, u.nickname, u.foto, p.titulo_prato 
                    FROM dislikes d 
                    JOIN usuarios u ON d.usuario_id = u.id 
                    JOIN publicacoes p ON d.publicacao_id = p.id_publicacao";
    $result_dislikes = $conn->query($sql_dislikes);
    
    $dislikes = [];
    if ($result_dislikes->num_rows > 0) {
        while ($row = $result_dislikes->fetch_assoc()) {
            $dislikes[] = $row;
        }
    }
    
    echo json_encode([
        "success" => true,
        "likes" => $likes,
        "dislikes" => $dislikes
    ]);
}

else {
    // Método inválido
    echo json_encode([
        "success" => false,
        "message" => "Método não permitido ou parâmetros inválidos"
    ]);
}

// Fechar conexão
$conn->close();
?> 