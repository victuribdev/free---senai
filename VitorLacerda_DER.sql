-- Criar banco de dados para o diagrama
CREATE DATABASE IF NOT EXISTS sabor_do_brasil_der;
USE sabor_do_brasil_der;

-- Criar tabela de Usuários
CREATE TABLE usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    nickname VARCHAR(50) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    foto VARCHAR(255),
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) COMMENT 'Tabela que armazena os usuários do sistema';

-- Criar tabela de Empresas
CREATE TABLE empresas (
    id_empresa INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    logo VARCHAR(255),
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) COMMENT 'Tabela que armazena as empresas cadastradas';

-- Criar tabela de Publicações
CREATE TABLE publicacoes (
    id_publicacao INT PRIMARY KEY AUTO_INCREMENT,
    foto VARCHAR(255) NOT NULL,
    titulo_prato VARCHAR(100) NOT NULL,
    local VARCHAR(100) NOT NULL,
    cidade VARCHAR(100) NOT NULL,
    empresa_id INT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (empresa_id) REFERENCES empresas(id_empresa)
) COMMENT 'Tabela que armazena as publicações de pratos';

-- Criar tabela de Likes
CREATE TABLE likes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT,
    publicacao_id INT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (publicacao_id) REFERENCES publicacoes(id_publicacao),
    UNIQUE KEY unique_like (usuario_id, publicacao_id)
) COMMENT 'Tabela que armazena os likes dos usuários nas publicações';

-- Criar tabela de Dislikes
CREATE TABLE dislikes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT,
    publicacao_id INT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (publicacao_id) REFERENCES publicacoes(id_publicacao),
    UNIQUE KEY unique_dislike (usuario_id, publicacao_id)
) COMMENT 'Tabela que armazena os dislikes dos usuários nas publicações';

-- Criar tabela de Comentários
CREATE TABLE comentarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    texto TEXT NOT NULL,
    usuario_id INT,
    publicacao_id INT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (publicacao_id) REFERENCES publicacoes(id_publicacao)
) COMMENT 'Tabela que armazena os comentários dos usuários nas publicações';

-- Inserir dados de exemplo
INSERT INTO usuarios (nome, email, nickname, senha, foto) VALUES
('usuario01', 'usuario01@usuario.com', 'usuario_01', '123456', 'usuario_01.jpg'),
('usuario02', 'usuario02@usuario.com', 'usuario_02', '654321', 'usuario_02.jpg'),
('usuario03', 'usuario03@usuario.com', 'usuario_03', '987654', 'usuario_03.jpg');

INSERT INTO empresas (nome, logo) VALUES
('Sabor do Brasil', 'logo_sabor_do_brasil.png');

INSERT INTO publicacoes (foto, titulo_prato, local, cidade, empresa_id) VALUES
('publicacao01.png', 'Titulo do Prato 01', 'Local 01', 'Maceio-AL', 1),
('publicacao02.png', 'Titulo do Prato 02', 'Local 02', 'Minas Gerais-MG', 1),
('publicacao03.png', 'Titulo do Prato 03', 'Local 03', 'Rio de Janerio-RJ', 1); 