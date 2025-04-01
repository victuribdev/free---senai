# Sistema Sabor do Brasil

Sistema web para divulgação e interação com pratos gastronômicos.

## Requisitos

- MySQL 8.0 ou superior
- Visual Studio Code
- Extensão "Live Server" no VSCode

## Instalação

1. Clone ou baixe este repositório
2. Abra o MySQL e execute os arquivos SQL na seguinte ordem:
   ```sql
   VitorLacerda_DER.sql
   VitorLacerda_NomeBanco.sql
   ```

3. No VSCode:
   - Abra a pasta do projeto
   - Instale a extensão "Live Server" se ainda não tiver
   - Clique com botão direito no `index.html`
   - Selecione "Open with Live Server"

## Estrutura do Projeto

```
saborbrasil/
├── Anexos/
│   ├── foto_usuario/    # Fotos de perfil
│   ├── icones/         # Ícones do sistema
│   ├── logo/           # Logo da empresa
│   └── publicacao/     # Fotos dos pratos
├── css/
│   └── style.css      # Estilos do sistema
├── js/
│   └── app.js         # Lógica do frontend
└── index.html         # Página principal
```

## Como Testar

1. Acesse o sistema pelo navegador (via Live Server)
2. Use as credenciais:
   ```
   Nickname: usuario_01
   Senha: 123456
   ```

3. Funcionalidades disponíveis:
   - Visualização de publicações
   - Sistema de likes/dislikes
   - Comentários (adicionar, editar, excluir)
   - Perfil do usuário

## Banco de Dados

O sistema usa duas bases:
- `sabor_do_brasil`: Banco principal
- `sabor_do_brasil_der`: Banco para o diagrama

### Tabelas Principais
- usuarios
- empresas
- publicacoes
- likes
- dislikes
- comentarios

## Resolução de Problemas

### Site não abre
- Verifique se o MySQL está rodando
- Confira se o Live Server está ativo
- Verifique a estrutura de pastas

### Imagens não aparecem
- Confira se a pasta Anexos está no lugar correto
- Verifique os caminhos no código

### Login não funciona
Teste no MySQL:
```sql
SELECT * FROM usuarios WHERE nickname = 'usuario_01';
```

## Suporte

Em caso de problemas:
1. Verifique os logs do MySQL
2. Confira a console do navegador (F12)
3. Revise a estrutura de arquivos 