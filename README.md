# Escola Estadual Ruy Rodriguez - Redesenho

Este é o repositório do redesign do site da **Escola Estadual Ruy Rodriguez**, localizada em Campinas - SP. 

O site foi desenvolvido com tecnologias modernas de front-end e back-end para fornecer uma experiência visual premium, intuitiva, acessível e totalmente responsiva para a comunidade escolar (estudantes, pais, professores e funcionários).

---

## 🛠️ Tecnologias Utilizadas

### Front-end
* **React + Vite** (com TypeScript)
* **Tailwind CSS** (para estilização responsiva e moderna)
* **Framer Motion** (para micro-animações e efeitos visuais refinados)
* **Lucide React** (para ícones da interface)
* **Radix UI** (para componentes de acessibilidade)

### Back-end & Banco de Dados
* **Node.js** com **Express** (servidor da API)
* **SQLite** (banco de dados local para persistência de dados de login, mural, etc.)
* **Nodemailer** (para envio de emails e notificações)

---

## 🚀 Como Executar o Projeto Localmente

Certifique-se de ter o [Node.js](https://nodejs.org/) instalado em sua máquina.

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/JuMariane/Blog-escola--Ruy-Rodriguez.git
   cd ruy-rodriguez-redesign-main
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Inicie o projeto:**
   Você pode rodar apenas o front-end ou o ambiente completo (front-end + back-end):

   * **Para iniciar apenas o Front-end:**
     ```bash
     npm run dev
     ```
     *O front-end estará disponível em `http://localhost:8080` (ou na porta configurada pelo Vite).*

   * **Para iniciar o Front-end e o Back-end simultaneamente (Recomendado):**
     ```bash
     npm run dev:all
     ```
     *Este comando inicia concorrentemente o servidor Vite e o servidor Express local.*

4. **Gerar a build de produção:**
   ```bash
   npm run build
   ```

---

## 📂 Estrutura de Diretórios

* `src/components/` - Seções modulares da página (Nav, Hero, Sobre, Projetos, Antirracista, Contato, Rodapé, etc.).
* `src/pages/` - Páginas principais da aplicação.
* `src/assets/` - Imagens e recursos visuais estáticos.
* `src/lib/` - Clientes de banco de dados, utilitários e serviços de API.
* `src/index.css` - Estilos globais e tokens de cores baseados em HSL.
* `api/` - Endpoints e funções de API serverless.
* `server.cjs` - Servidor local Express utilizando SQLite.
* `vercel.json` - Configuração para hospedagem SPA sem erros de roteamento na Vercel.
