# Sabor do Brasil - Sistema Web de Avaliação Culinária

Sistema web desenvolvido para a empresa culinária Sabor do Brasil, permitindo a exibição de pratos gastronômicos e interação do público através de avaliações e comentários.

## Funcionalidades

- Visualização de pratos gastronômicos
- Sistema de login de usuários
- Interação através de likes e dislikes
- Sistema de comentários (adicionar, editar, excluir)
- Persistência de dados em banco MySQL

## Como Executar o Projeto

### Requisitos

- Servidor web com PHP 7.4+ (Apache, Nginx, etc.)
- MySQL 5.7+
- Navegador web moderno

### Configuração Rápida

1. **Clone o repositório**
   ```
   git clone https://github.com/victuribdev/free---senai.git
   cd free---senai
   ```

2. **Configure o banco de dados**
   - Crie um banco de dados chamado `sabor_do_brasil` no MySQL
   - Importe o arquivo `VitorLacerda_NomeBanco.sql` para criar as tabelas
   - Configure as credenciais no arquivo `api/config.php`

3. **Inicie o servidor web**
   - Você pode usar o servidor embutido do PHP:
     ```
     php -S localhost:8000
     ```
   - Ou configure em um servidor Apache/Nginx

4. **Acesse o sistema**
   - Abra o navegador e acesse `http://localhost:8000`

### Usuários de Teste

| Nickname | Senha |
|----------|-------|
| usuario_01 | 123456 |
| usuario_02 | 654321 |
| usuario_03 | 987654 |

## Estrutura do Projeto

```
sabor_do_brasil/
├── api/                  # API REST para comunicação com o banco
│   ├── auth.php          # Autenticação de usuários
│   ├── comentarios.php   # Gerenciamento de comentários
│   ├── config.php        # Configuração do banco de dados
│   ├── likes.php         # Gerenciamento de likes/dislikes
│   └── publicacoes.php   # Gerenciamento de publicações
├── Anexos/               # Arquivos de mídia
│   ├── foto_usuario/     # Fotos de perfil dos usuários
│   ├── icones/           # Ícones do sistema
│   ├── logo/             # Logo da empresa
│   └── publicacao/       # Imagens das publicações
├── css/                  # Estilos CSS
│   └── style.css
├── js/                   # JavaScript
│   └── app.js
├── .htaccess             # Configuração do servidor Apache
├── CONFIGURACAO_BD.md    # Guia para configuração do banco
├── index.html            # Página principal
└── README.md             # Este arquivo
```

## Documentação Adicional

- [Configuração do Banco de Dados](CONFIGURACAO_BD.md)
- Arquivos SQL:
  - `VitorLacerda_DER.sql`: Modelo do diagrama entidade-relacionamento
  - `VitorLacerda_NomeBanco.sql`: Estrutura física do banco de dados

## Solução de Problemas

### Erros de Conexão com o Banco

- Verifique se o MySQL está em execução
- Confirme que as credenciais em `api/config.php` estão corretas
- Verifique se o banco de dados `sabor_do_brasil` foi criado

### Problemas com a API

- Verifique os logs do PHP para mensagens de erro
- Confirme que as extensões PHP necessárias estão habilitadas (mysqli)

## Suporte

Em caso de problemas:
1. Verifique os logs do MySQL
2. Confira a console do navegador (F12)
3. Revise a estrutura de arquivos 