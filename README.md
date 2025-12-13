# PROJETO FINAL LIONS DEV 📱🚀

> Projeto final desenvolvido para o curso avançado de programação da Lions (Dez/2025).

![Status do Projeto](https://img.shields.io/badge/Status-Pendente-brightgreen)
![FlutterFlow](https://img.shields.io/badge/Frontend-FlutterFlow-blue) // AINDA NAO CONCLUIDO
![Node.js](https://img.shields.io/badge/Backend-Node.js-green)
![API](https://img.shields.io/badge/API-RESTful-orange)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-green)

## 📋 Sobre o Projeto

Este projeto consiste em uma aplicação completa de **autenticação e gerenciamento de usuários**, desenvolvida para demonstrar a integração entre um front-end *low-code* e uma API robusta desenvolvida manualmente.

O objetivo foi criar uma página de criar e logar usuários, onde a interface foi construída no **FlutterFlow** e toda a regra de negócio e persistência de dados reside em uma **API RESTful** personalizada.

### 📅 Contexto Acadêmico
Projeto apresentado como requisito final do curso avançado de programação (2025), com foco em desenvolvimento de APIs e integração de sistemas.

---

## ⚙️ Arquitetura e Tecnologias

A aplicação segue a arquitetura Cliente-Servidor com separação clara de responsabilidades:

### Stack Tecnológico

* **Front-end (Mobile/Web):** **FlutterFlow** - Responsável pela UI/UX e requisições HTTP
* **Back-end (API):** **Node.js** + **Express** - Servidor RESTful com arquitetura em camadas
* **Banco de Dados:** **MongoDB** (via Mongoose) - Persistência de dados NoSQL
* **Autenticação:** **JWT (JSON Web Tokens)** - Autenticação stateless
* **Segurança:** **Bcrypt** - Criptografia de senhas com hash

### Arquitetura do Backend

O backend segue o padrão de **arquitetura em camadas** (Layered Architecture):

```
backend/
├── src/
│   ├── config/          # Configurações (DB, etc)
│   ├── controllers/     # Controladores (recebem requisições)
│   ├── services/        # Lógica de negócio
│   ├── repositories/    # Acesso ao banco de dados
│   ├── models/          # Schemas do MongoDB
│   ├── middlewares/     # Validações e autenticação
│   ├── routes/          # Definição de rotas
│   ├── utils/           # Utilitários (tratamento de erros)
│   ├── app.js          # Configuração do Express
│   └── server.js       # Inicialização do servidor
```

**Explicação das Camadas:**

1. **Routes** → Define os endpoints e aplica middlewares
2. **Controllers** → Recebe requisições HTTP, chama services e retorna respostas
3. **Services** → Contém a lógica de negócio (validações, criptografia, geração de tokens)
4. **Repositories** → Faz a comunicação direta com o banco de dados
5. **Models** → Define o schema/estrutura dos dados no MongoDB
6. **Middlewares** → Validações, autenticação e tratamento de erros

### Fluxo de Dados
1. Cliente (FlutterFlow) envia requisição HTTP para a API
2. **Route** recebe e encaminha para o **Controller**
3. **Controller** chama o **Service** correspondente
4. **Service** aplica regras de negócio e chama o **Repository**
5. **Repository** consulta/modifica o **MongoDB**
6. Resposta retorna pela mesma cadeia até o cliente

---

## 🚀 Funcionalidades

### Gerenciamento de Usuários

* ✅ **Criar Usuário (Registro):** Cadastro com nome, email e senha (criptografada com bcrypt)
* ✅ **Login:** Autenticação com validação de credenciais e geração de token JWT
* ✅ **Listar Usuários:** Retorna todos os usuários cadastrados
* ✅ **Buscar Usuário por ID:** Retorna dados de um usuário específico
* ✅ **Atualizar Usuário:** Atualiza informações de um usuário
* ✅ **Deletar Usuário:** Remove usuário do sistema
* ✅ **Hello (Autenticado):** Rota protegida que retorna o ID do usuário logado

### Segurança

* 🔒 Senhas criptografadas com **bcrypt** (12 rounds)
* 🔒 Autenticação via **JWT tokens** com expiração de 1 hora
* 🔒 Middleware de autenticação protege rotas sensíveis
* 🔒 Validação de entrada de dados
* 🔒 Tratamento centralizado de erros

---

## 🔌 Documentação da API

**Base URL:** `http://localhost:2323/api`

### Endpoints Públicos (sem autenticação)

| Método | Endpoint | Descrição | Body |
|--------|----------|-----------|------|
| `POST` | `/api/users` | Cria um novo usuário | `{ "name": "string", "email": "string", "password": "string", "roles": "string" }` |
| `POST` | `/api/users/login` | Faz login e retorna token JWT | `{ "email": "string", "password": "string" }` |
| `GET` | `/api/users` | Lista todos os usuários | - |
| `GET` | `/api/users/:id` | Busca usuário por ID | - |
| `PUT` | `/api/users/:id` | Atualiza usuário | `{ "name": "string", "email": "string", "roles": "string" }` |
| `DELETE` | `/api/users/:id` | Remove usuário | - |

### Endpoints Protegidos (requer autenticação)

| Método | Endpoint | Descrição | Headers |
|--------|----------|-----------|---------|
| `GET` | `/api/users/hello` | Retorna ID do usuário autenticado | `Authorization: Bearer {token}` |

### Exemplos de Requisições

**1. Criar Usuário**
```bash
POST /api/users
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "senha123",
  "roles": "USER"
}
```

**Resposta:**
```json
{
  "id": "67...",
  "name": "João Silva",
  "email": "joao@email.com",
  "roles": "USER"
}
```

**2. Login**
```bash
POST /api/users/login
Content-Type: application/json

{
  "email": "joao@email.com",
  "password": "senha123"
}
```

**Resposta:**
```json
{
  "message": "Seu ID é 67...",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "67...",
    "name": "João Silva",
    "email": "joao@email.com",
    "roles": "USER"
  }
}
```

**3. Rota Protegida (Hello)**
```bash
GET /api/users/hello
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Resposta:**
```json
{
  "message": "Seu ID é 67..."
}
```

---

## 🛠️ Como Executar o Projeto

### Pré-requisitos

* **Node.js** v16+ instalado
* **MongoDB** rodando (local ou cloud - MongoDB Atlas)
* **Git** para clonar o repositório
* **Postman** ou similar para testar a API

### Passos para o Back-end

1. **Clone o repositório:**
```bash
git clone https://github.com/LucasSassi/final_project_lions.git
cd final_project_lions/backend
```

2. **Instale as dependências:**
```bash
npm install
```

3. **Configure as variáveis de ambiente:**

Crie um arquivo `.env` na pasta `backend/` com:
```env
MONGODB_URI=mongodb://localhost:27017/lions_dev
JWT_SECRET=sua_chave_secreta_super_segura
```

4. **Inicie o servidor:**
```bash
npm start
# ou para desenvolvimento com hot-reload:
npm run dev
```

5. **Teste a API:**
- API rodando em: `http://localhost:2323`
- Teste: `GET http://localhost:2323/api/test`

---

## 🧪 Testando a API

### Com Postman

1. Importe a collection ou crie requisições manualmente
2. Crie um usuário via `POST /api/users`
3. Faça login via `POST /api/users/login`
4. Copie o token retornado
5. Adicione o token no header `Authorization: Bearer {token}`
6. Teste a rota protegida `GET /api/users/hello`

---

## 📝 Como o Código Funciona

### 1. Criação de Usuário

```javascript
// Controller recebe a requisição
async create(req, res, next) {
  const user = await userService.createUser(req.body);
  res.status(201).json(user);
}

// Service valida e processa
async createUser(data) {
  ensureValidPayload(data); // Valida email, nome, senha
  const existing = await repo.findByEmail(data.email); // Verifica se já existe
  if (existing) throw createError("E-mail já cadastrado.", 409);
  
  const senhaHash = await bcrypt.hash(data.password, 12); // Criptografa
  return repo.create({ ...data, password: senhaHash }); // Salva no DB
}
```

### 2. Login e Autenticação

```javascript
// Verifica credenciais e gera token
async loginUsers({ email, password }) {
  const user = await repo.findByEmail(email);
  if (!user) throw createError("Credenciais inválidas.", 401);
  
  const senhaValida = await bcrypt.compare(password, user.password);
  if (!senhaValida) throw createError("Credenciais inválidas.", 401);
  
  // Gera token JWT válido por 1 hora
  const token = jwt.sign(
    { userId: user._id, roles: user.roles },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
  
  return { message: `Seu ID é ${user._id}`, token, user };
}
```

### 3. Middleware de Autenticação

```javascript
// Protege rotas verificando o token
export function authMiddleware() {
  return (req, res, next) => {
    const token = req.headers.authorization?.slice(7); // Remove "Bearer "
    if (!token) throw createError("Token não informado.", 401);
    
    req.user = jwt.verify(token, process.env.JWT_SECRET); // Valida token
    next(); // Permite acesso à rota
  };
}
```

### 4. Tratamento de Erros

```javascript
// Middleware centralizado captura todos os erros
export default function errorMiddleware(error, req, res, next) {
  const statusCode = error.statusCode || 500;
  const message = error.message || "Erro interno do servidor";
  res.status(statusCode).json({ error: message });
}
```

---

## 🎓 Conceitos Aplicados

* **REST API** - Padrão de arquitetura para APIs web
* **CRUD** - Create, Read, Update, Delete
* **JWT** - Autenticação stateless com tokens
* **Bcrypt** - Hashing seguro de senhas
* **Middleware** - Interceptadores de requisições
* **Arquitetura em Camadas** - Separação de responsabilidades
* **MongoDB** - Banco de dados NoSQL
* **Mongoose** - ODM (Object Document Mapper)
* **Async/Await** - Programação assíncrona moderna
* **Error Handling** - Tratamento centralizado de erros

---

## 👨‍💻 Autor

**Lucas Sassi**

* GitHub: [@LucasSassi](https://github.com/LucasSassi)
* Projeto: Lions Dev - Curso Avançado de Programação (2025)

---

## 📄 Licença

ISC License - Este projeto foi desenvolvido para fins educacionais.