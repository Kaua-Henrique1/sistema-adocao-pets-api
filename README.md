# Sistema de Gestão ONG Pets

> **Nota:** Este é um projeto desenvolvido exclusivamente para fins de estudo e aprendizado prático de desenvolvimento de software.

Uma plataforma desenvolvida para **centralizar e otimizar o gerenciamento de ONGs de proteção animal**.

O sistema facilita o controle de animais resgatados, a gestão de tutores interessados em adoção e o acompanhamento de métricas da instituição, oferecendo uma **interface administrativa**.

---

## Funcionalidades

* **Autenticação de Usuários:** Sistema de login seguro para controle de acesso administrativo.

* **Dashboard de Métricas:** Painel com indicadores em tempo real da quantidade de pets cadastrados e tutores/adotantes registrados.

* **Gestão de Pets:** Cadastro, visualização e edição de animais com sistema embutido de higienização de dados, incluindo formatação automática e remoção de caracteres inválidos.

* **Gestão de Tutores:** Cadastro, gerenciamento e visualização de dados completos de tutores e adotantes.

* **Automação de Endereço:** Integração direta com a API **ViaCEP** para busca e preenchimento automático de endereços nos formulários.

---

## Tecnologias Utilizadas

### Frontend

* **Angular 18+**
* **Tailwind CSS**

### Backend

* **Java 21**
* **OpenJDK Temurin LTS**
* **Spring Boot 3.x**

### Banco de Dados

* **PostgreSQL 16.14**

### Servidor Web & Build

* **Nginx 1.31.4**
* **Node.js 22 (Alpine)**

### Infraestrutura

* **Docker**
* **Docker Compose**

---

## Como Executar o Projeto

O projeto utiliza **Docker** para padronizar e simplificar o ambiente de desenvolvimento.

Para executar a aplicação localmente, você precisará apenas de:

* **Docker**
* **Docker Compose**
* **Git**

---

### 1. 📥 Clone o Repositório

```bash
https://github.com/Kaua-Henrique1/sistema-adocao-pets-api
```

---

### 2. Acesse a Pasta do Projeto

Acesse a pasta raiz do projeto, onde está localizado o arquivo `docker-compose.yml`:

```bash
cd sistema-adocao-pets-api
```

---

### 3. Construa as Imagens e Inicie os Containers

Execute o comando abaixo para construir as imagens e iniciar os containers em segundo plano:

```bash
docker compose up -d --build
```

---

## Acessando a Aplicação

Após os containers iniciarem com sucesso, os serviços estarão disponíveis nos seguintes endereços:

| Serviço              | Endereço                |  Porta |
| -------------------- | ----------------------- | -----: |
| 🌐 **Frontend**      | `http://localhost`      |   `80` |
| ⚙️ **Backend / API** | `http://localhost:8080` | `8080` |
| 🗄️ **PostgreSQL**   | `localhost`             | `5432` |

---

## Parando a Aplicação

Para interromper a execução e remover os containers gerados, execute o comando abaixo na raiz do projeto:

```bash
docker compose down
```