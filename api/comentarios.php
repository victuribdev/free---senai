<?php
// Incluir arquivo de configuração
require_once 'config.php';

// Habilitar CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Se for uma requisição OPTIONS, apenas retornar os headers
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Para obter comentários de uma publicação específica
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['publicacao_id'])) {
    $publicacao_id = $conn->real_escape_string($_GET['publicacao_id']);
    
    // Obter comentários
    $sql = "SELECT c.*, u.nome, u.nickname, u.foto FROM comentarios c 
            JOIN usuarios u ON c.usuario_id = u.id 
            WHERE c.publicacao_id = $publicacao_id 
            ORDER BY c.createdAt DESC";
    $result = $conn->query($sql);
    
    $comentarios = [];
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $comentarios[] = $row;
        }
    }
    
    echo json_encode([
        "success" => true,
        "comentarios" => $comentarios
    ]);
}

// Para adicionar um novo comentário
elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Obter dados do JSON
    $data = json_decode(file_get_contents("php://input"));
    
    if (!empty($data->usuario_id) && !empty($data->publicacao_id) && !empty($data->texto)) {
        $usuario_id = $conn->real_escape_string($data->usuario_id);
        $publicacao_id = $conn->real_escape_string($data->publicacao_id);
        $texto = $conn->real_escape_string($data->texto);
        
        // Inserir comentário
        $sql = "INSERT INTO comentarios (texto, usuario_id, publicacao_id) VALUES ('$texto', $usuario_id, $publicacao_id)";
        
        if ($conn->query($sql) === TRUE) {
            $comentario_id = $conn->insert_id;
            
            // Obter detalhes do comentário inserido
            $sql_get = "SELECT c.*, u.nome, u.nickname, u.foto FROM comentarios c 
                        JOIN usuarios u ON c.usuario_id = u.id 
                        WHERE c.id = $comentario_id";
            $result = $conn->query($sql_get);
            
            if ($result->num_rows > 0) {
                $comentario = $result->fetch_assoc();
                
                echo json_encode([
                    "success" => true,
                    "message" => "Comentário adicionado com sucesso",
                    "comentario" => $comentario
                ]);
            } else {
                echo json_encode([
                    "success" => true,
                    "message" => "Comentário adicionado com sucesso",
                    "comentario_id" => $comentario_id
                ]);
            }
        } else {
            echo json_encode([
                "success" => false,
                "message" => "Erro ao adicionar comentário: " . $conn->error
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

// Para atualizar um comentário existente
elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    // Obter dados do JSON
    $data = json_decode(file_get_contents("php://input"));
    
    if (!empty($data->id) && !empty($data->usuario_id) && !empty($data->texto)) {
        $id = $conn->real_escape_string($data->id);
        $usuario_id = $conn->real_escape_string($data->usuario_id);
        $texto = $conn->real_escape_string($data->texto);
        
        // Verificar se o comentário pertence ao usuário
        $sql_check = "SELECT * FROM comentarios WHERE id = $id AND usuario_id = $usuario_id";
        $result_check = $conn->query($sql_check);
        
        if ($result_check->num_rows > 0) {
            // Atualizar comentário
            $sql = "UPDATE comentarios SET texto = '$texto', updatedAt = CURRENT_TIMESTAMP WHERE id = $id";
            
            if ($conn->query($sql) === TRUE) {
                // Obter detalhes do comentário atualizado
                $sql_get = "SELECT c.*, u.nome, u.nickname, u.foto FROM comentarios c 
                            JOIN usuarios u ON c.usuario_id = u.id 
                            WHERE c.id = $id";
                $result = $conn->query($sql_get);
                
                if ($result->num_rows > 0) {
                    $comentario = $result->fetch_assoc();
                    
                    echo json_encode([
                        "success" => true,
                        "message" => "Comentário atualizado com sucesso",
                        "comentario" => $comentario
                    ]);
                } else {
                    echo json_encode([
                        "success" => true,
                        "message" => "Comentário atualizado com sucesso"
                    ]);
                }
            } else {
                echo json_encode([
                    "success" => false,
                    "message" => "Erro ao atualizar comentário: " . $conn->error
                ]);
            }
        } else {
            echo json_encode([
                "success" => false,
                "message" => "Você não tem permissão para editar este comentário"
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

// Para excluir um comentário
elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    // Obter dados do JSON
    $data = json_decode(file_get_contents("php://input"));
    
    if (!empty($data->id) && !empty($data->usuario_id)) {
        $id = $conn->real_escape_string($data->id);
        $usuario_id = $conn->real_escape_string($data->usuario_id);
        
        // Verificar se o comentário pertence ao usuário
        $sql_check = "SELECT * FROM comentarios WHERE id = $id AND usuario_id = $usuario_id";
        $result_check = $conn->query($sql_check);
        
        if ($result_check->num_rows > 0) {
            // Excluir comentário
            $sql = "DELETE FROM comentarios WHERE id = $id";
            
            if ($conn->query($sql) === TRUE) {
                echo json_encode([
                    "success" => true,
                    "message" => "Comentário excluído com sucesso"
                ]);
            } else {
                echo json_encode([
                    "success" => false,
                    "message" => "Erro ao excluir comentário: " . $conn->error
                ]);
            }
        } else {
            echo json_encode([
                "success" => false,
                "message" => "Você não tem permissão para excluir este comentário"
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

// Para obter todos os comentários
elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Obter todos os comentários
    $sql = "SELECT c.*, u.nome, u.nickname, u.foto, p.titulo_prato FROM comentarios c 
            JOIN usuarios u ON c.usuario_id = u.id 
            JOIN publicacoes p ON c.publicacao_id = p.id_publicacao
            ORDER BY c.createdAt DESC";
    $result = $conn->query($sql);
    
    $comentarios = [];
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $comentarios[] = $row;
        }
    }
    
    echo json_encode([
        "success" => true,
        "comentarios" => $comentarios
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