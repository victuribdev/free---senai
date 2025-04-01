<?php
// Incluir arquivo de configuração
require_once 'config.php';

// Habilitar CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Se for uma requisição OPTIONS, apenas retornar os headers
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Para obter uma publicação específica
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['id'])) {
    $id = $conn->real_escape_string($_GET['id']);
    
    // Obter publicação
    $sql = "SELECT p.*, e.nome as empresa_nome, e.logo as empresa_logo FROM publicacoes p 
            JOIN empresas e ON p.empresa_id = e.id_empresa 
            WHERE p.id_publicacao = $id";
    $result = $conn->query($sql);
    
    if ($result->num_rows > 0) {
        $publicacao = $result->fetch_assoc();
        
        // Obter quantidade de likes, dislikes e comentários
        $sql_likes = "SELECT COUNT(*) as total FROM likes WHERE publicacao_id = $id";
        $sql_dislikes = "SELECT COUNT(*) as total FROM dislikes WHERE publicacao_id = $id";
        $sql_comentarios = "SELECT COUNT(*) as total FROM comentarios WHERE publicacao_id = $id";
        
        $result_likes = $conn->query($sql_likes);
        $result_dislikes = $conn->query($sql_dislikes);
        $result_comentarios = $conn->query($sql_comentarios);
        
        $likes_count = $result_likes->fetch_assoc()['total'];
        $dislikes_count = $result_dislikes->fetch_assoc()['total'];
        $comentarios_count = $result_comentarios->fetch_assoc()['total'];
        
        $publicacao['likes_count'] = $likes_count;
        $publicacao['dislikes_count'] = $dislikes_count;
        $publicacao['comentarios_count'] = $comentarios_count;
        
        echo json_encode([
            "success" => true,
            "publicacao" => $publicacao
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Publicação não encontrada"
        ]);
    }
}

// Para obter todas as publicações
elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Obter publicações
    $sql = "SELECT p.*, e.nome as empresa_nome, e.logo as empresa_logo FROM publicacoes p 
            JOIN empresas e ON p.empresa_id = e.id_empresa";
    $result = $conn->query($sql);
    
    $publicacoes = [];
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $id = $row['id_publicacao'];
            
            // Obter quantidade de likes, dislikes e comentários
            $sql_likes = "SELECT COUNT(*) as total FROM likes WHERE publicacao_id = $id";
            $sql_dislikes = "SELECT COUNT(*) as total FROM dislikes WHERE publicacao_id = $id";
            $sql_comentarios = "SELECT COUNT(*) as total FROM comentarios WHERE publicacao_id = $id";
            
            $result_likes = $conn->query($sql_likes);
            $result_dislikes = $conn->query($sql_dislikes);
            $result_comentarios = $conn->query($sql_comentarios);
            
            $likes_count = $result_likes->fetch_assoc()['total'];
            $dislikes_count = $result_dislikes->fetch_assoc()['total'];
            $comentarios_count = $result_comentarios->fetch_assoc()['total'];
            
            $row['likes_count'] = $likes_count;
            $row['dislikes_count'] = $dislikes_count;
            $row['comentarios_count'] = $comentarios_count;
            
            $publicacoes[] = $row;
        }
    }
    
    echo json_encode([
        "success" => true,
        "publicacoes" => $publicacoes
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