# Guia de Configuração do Banco de Dados

Este documento explica como configurar o banco de dados MySQL para o projeto Sabor do Brasil.

## Requisitos

- MySQL 5.7 ou superior
- PHP 7.4 ou superior
- Servidor web (Apache, Nginx, etc.)

## Passos para Configuração

### 1. Importar o Banco de Dados

1. Abra o phpMyAdmin ou outra ferramenta de administração MySQL
2. Crie um novo banco de dados chamado `sabor_do_brasil`
3. Selecione o banco de dados criado
4. Importe o arquivo `VitorLacerda_NomeBanco.sql`

### 2. Configurar a Conexão

O arquivo `api/config.php` contém as configurações de conexão com o banco de dados:

```php
<?php
// Configuração do banco de dados
$db_host = 'localhost';
$db_name = 'sabor_do_brasil';
$db_user = 'root';
$db_pass = '';
```

Modifique as variáveis `$db_user` e `$db_pass` de acordo com suas credenciais do MySQL.

### 3. Testar a Conexão

1. Acesse `http://localhost/seu-projeto/api/publicacoes.php` no navegador
2. Se a configuração estiver correta, você verá um JSON com as publicações

## Estrutura do Banco de Dados

O banco de dados contém as seguintes tabelas:

- `usuarios`: Informações sobre os usuários
- `empresas`: Informações sobre as empresas
- `publicacoes`: Publicações de pratos
- `likes`: Registro de curtidas
- `dislikes`: Registro de descurtidas
- `comentarios`: Comentários das publicações

## Problemas Comuns

### Erro de Conexão

Se você encontrar erros de conexão, verifique:

1. Se o serviço MySQL está rodando
2. Se as credenciais (usuário e senha) estão corretas
3. Se o banco de dados `sabor_do_brasil` foi criado

### Permissões

Certifique-se de que o usuário do MySQL tem permissões suficientes para:

- SELECT
- INSERT
- UPDATE
- DELETE

### Importação de Dados

Se houver problemas na importação do arquivo SQL:

1. Verifique se o arquivo não está corrompido
2. Tente importar através da linha de comando:
   ```
   mysql -u seu_usuario -p sabor_do_brasil < VitorLacerda_NomeBanco.sql
   ``` 