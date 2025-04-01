<?php
// Configuração do banco de dados
$db_host = 'localhost';
$db_name = 'sabor_do_brasil';
$db_user = 'root';
$db_pass = '';

// Criar conexão com o banco de dados
$conn = new mysqli($db_host, $db_user, $db_pass, $db_name);

// Verificar conexão
if ($conn->connect_error) {
    die("Falha na conexão: " . $conn->connect_error);
}

// Configurar charset UTF-8
$conn->set_charset("utf8mb4");
?> 