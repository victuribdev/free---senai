<?php
// Incluir arquivo de configuração
require_once 'config.php';

// Habilitar CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Se for uma requisição OPTIONS, apenas retornar os headers
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Verificar se é uma requisição POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Obter dados do JSON
    $data = json_decode(file_get_contents("php://input"));
    
    if (!empty($data->nickname) && !empty($data->senha)) {
        $nickname = $conn->real_escape_string($data->nickname);
        $senha = $conn->real_escape_string($data->senha);
        
        // Consultar o banco de dados
        $sql = "SELECT id, nome, email, nickname, foto FROM usuarios WHERE nickname = '$nickname' AND senha = '$senha'";
        $result = $conn->query($sql);
        
        if ($result->num_rows > 0) {
            // Usuário encontrado
            $usuario = $result->fetch_assoc();
            
            // Retornar informações do usuário
            echo json_encode([
                "success" => true,
                "message" => "Login realizado com sucesso",
                "usuario" => $usuario
            ]);
        } else {
            // Usuário não encontrado ou senha incorreta
            echo json_encode([
                "success" => false,
                "message" => "Nickname ou senha incorretos"
            ]);
        }
    } else {
        // Dados incompletos
        echo json_encode([
            "success" => false,
            "message" => "Por favor, forneça nickname e senha"
        ]);
    }
} else {
    // Método inválido
    echo json_encode([
        "success" => false,
        "message" => "Método não permitido"
    ]);
}

// Fechar conexão
$conn->close();
?> 