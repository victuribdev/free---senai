-- Criação do banco de dados
CREATE DATABASE sabor_do_brasil;
USE sabor_do_brasil;

-- Tabela de Usuários
CREATE TABLE usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    nickname VARCHAR(50) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    foto VARCHAR(255),
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela de Empresas
CREATE TABLE empresas (
    id_empresa INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    logo VARCHAR(255),
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela de Publicações
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
);

-- Tabela de Likes
CREATE TABLE likes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT,
    publicacao_id INT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (publicacao_id) REFERENCES publicacoes(id_publicacao),
    UNIQUE KEY unique_like (usuario_id, publicacao_id)
);

-- Tabela de Dislikes
CREATE TABLE dislikes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT,
    publicacao_id INT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (publicacao_id) REFERENCES publicacoes(id_publicacao),
    UNIQUE KEY unique_dislike (usuario_id, publicacao_id)
);

-- Tabela de Comentários
CREATE TABLE comentarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    texto TEXT NOT NULL,
    usuario_id INT,
    publicacao_id INT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (publicacao_id) REFERENCES publicacoes(id_publicacao)
);

-- Importação dos dados do CSV de usuários
LOAD DATA INFILE 'Anexos/arquivos_CSV/usuario.csv'
INTO TABLE usuarios
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 LINES;

-- Importação dos dados do CSV de empresas
LOAD DATA INFILE 'Anexos/arquivos_CSV/empresa.csv'
INTO TABLE empresas
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 LINES;

-- Importação dos dados do CSV de publicações
LOAD DATA INFILE 'Anexos/arquivos_CSV/publicacao.csv'
INTO TABLE publicacoes
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 LINES; 