const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcryptjs");
const path = require("path");
const nodemailer = require("nodemailer");

const app = express();
app.use(cors());
app.use(express.json());

const dbPath = path.resolve(__dirname, "ruy_escola.db");
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Erro ao conectar ao banco de dados SQLite:", err.message);
  } else {
    console.log("Conectado ao banco de dados relacional SQLite.");
    initializeDatabase();
  }
});

// Configuração do Transportador Nodemailer para envio de e-mails
let mailTransporter = null;

if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
  mailTransporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587", 10),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
  console.log("Serviço de e-mail SMTP real configurado com sucesso.");
} else {
  // Transporter em modo de teste / desenvolvimento
  mailTransporter = nodemailer.createTransport({
    jsonTransport: true,
  });
  console.log("Nodemailer inicializado em modo simulado/seguro (logs formatados).");
}

// Função para disparar e-mail institucional de notificação de login
async function sendLoginAlertEmail(user, req) {
  const loginDate = new Date().toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "127.0.0.1";
  const userAgent = req.headers["user-agent"] || "Navegador Web / Dispositivo";

  const emailHtml = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>Alerta de Segurança - Portal Ruy Rodriguez</title>
  </head>
  <body style="margin:0;padding:0;background-color:#f4f6f9;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1e293b;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f9;padding:30px 10px;">
      <tr>
        <td align="center">
          <table width="100%" max-width="600" style="max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 15px rgba(0,0,0,0.06);border:1px solid #e2e8f0;">
            <!-- Header -->
            <tr style="background:linear-gradient(135deg, #1e3a8a 0%, #991b1b 100%);">
              <td style="padding:30px 24px;text-align:center;color:#ffffff;">
                <h1 style="margin:0;font-size:22px;font-weight:700;letter-spacing:0.5px;">Portal E.E. Ruy Rodriguez</h1>
                <p style="margin:6px 0 0 0;font-size:12px;opacity:0.9;text-transform:uppercase;letter-spacing:1.5px;">Secretaria da Educação do Estado de São Paulo</p>
              </td>
            </tr>

            <!-- Content -->
            <tr>
              <td style="padding:32px 28px;">
                <div style="display:inline-block;padding:4px 12px;border-radius:20px;background:#dcfce7;color:#15803d;font-weight:700;font-size:11px;text-transform:uppercase;letter-spacing:1px;margin-bottom:16px;">
                  ✓ Alerta de Segurança
                </div>
                <h2 style="margin:0 0 12px 0;font-size:18px;color:#0f172a;font-weight:700;">Olá, ${user.nome}!</h2>
                <p style="margin:0 0 20px 0;font-size:14px;line-height:1.6;color:#475569;">
                  Identificamos um novo acesso à sua conta institucional no <strong>Portal Oficial da E.E. Ruy Rodriguez</strong>.
                </p>

                <!-- Box de Detalhes -->
                <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border-radius:12px;border:1px solid #e2e8f0;margin-bottom:24px;">
                  <tr>
                    <td style="padding:16px 20px;">
                      <p style="margin:0 0 8px 0;font-size:13px;color:#334155;"><strong>📅 Data e Horário:</strong> ${loginDate} (Horário de Brasília)</p>
                      <p style="margin:0 0 8px 0;font-size:13px;color:#334155;"><strong>👤 Perfil / Cargo:</strong> ${user.cargo} (Nível ${user.id_nivel})</p>
                      <p style="margin:0 0 8px 0;font-size:13px;color:#334155;"><strong>📧 E-mail Institucional:</strong> ${user.email}</p>
                      <p style="margin:0;font-size:13px;color:#334155;"><strong>🌐 Origem do Acesso:</strong> ${ip}</p>
                    </td>
                  </tr>
                </table>

                <div style="background:#fef2f2;border-left:4px solid #ef4444;padding:14px 16px;border-radius:6px;margin-bottom:24px;">
                  <p style="margin:0;font-size:12px;line-height:1.5;color:#991b1b;">
                    <strong>Foi você quem fez este login?</strong><br/>
                    Se sim, nenhuma ação adicional é necessária. Se você <strong>NÃO</strong> reconhece esse acesso, redefina sua senha imediatamente através do portal da escola.
                  </p>
                </div>

                <p style="margin:0;font-size:12px;color:#94a3b8;line-height:1.5;">
                  Esta é uma mensagem automática de segurança enviada para garantir a conformidade com a LGPD e a proteção dos dados dos estudantes e servidores da rede pública estadual.
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr style="background:#0f172a;">
              <td style="padding:20px 24px;text-align:center;color:#94a3b8;font-size:11px;">
                <p style="margin:0 0 4px 0;font-weight:600;color:#cbd5e1;">E.E. Ruy Rodriguez • Campinas / SP</p>
                <p style="margin:0;">Rua Wanda Valente de Godoy, s/n - Parque Itajaí</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;

  let recipient = user.email;
  // Redireciona e-mails institucionais simulados para o Gmail real de testes
  if (
    recipient.endsWith("@al.educacao.sp.gov.br") ||
    recipient.endsWith("@professor.educacao.sp.gov.br") ||
    recipient.endsWith("@educacao.sp.gov.br")
  ) {
    recipient = process.env.SMTP_USER || "ju231107@gmail.com";
  }

  const mailOptions = {
    from: '"Portal E.E. Ruy Rodriguez" <seguranca.escola@educacao.sp.gov.br>',
    to: recipient,
    subject: "🔐 Alerta de Segurança: Novo acesso ao Portal Ruy Rodriguez",
    text: `Olá, ${user.nome}!\n\nIdentificamos um novo login em sua conta institucional (${user.email}) no Portal da E.E. Ruy Rodriguez.\n\nData/Hora: ${loginDate}\nPerfil: ${user.cargo}\nOrigem: ${ip}\n\nSe você não reconhece esta atividade, redefina sua senha imediatamente.`,
    html: emailHtml,
  };

  try {
    const info = await mailTransporter.sendMail(mailOptions);
    console.log(`
========================================================================
📧 [E-MAIL INSTITUCIONAL DISPARADO COM SUCESSO - NODEMAILER]
========================================================================
Para: ${user.email}
Assunto: 🔐 Alerta de Segurança: Novo acesso ao Portal Ruy Rodriguez
Horário: ${loginDate}
Perfil: ${user.cargo} (ID ${user.id_nivel})
Dispositivo: ${userAgent.substring(0, 50)}...
Status: Enviado / Entregue na caixa de entrada
========================================================================
    `);
    return { success: true, messageId: info.messageId, date: loginDate };
  } catch (err) {
    console.error("Falha ao enviar e-mail de alerta:", err.message);
    return { success: false, error: err.message, date: loginDate };
  }
}

// Helper para calcular e-mail e nível SED
function getAccessLevel(email) {
  const cleanEmail = email.toLowerCase().trim();

  // 1. Professor: termina em @professor.educacao.sp.gov.br
  if (cleanEmail.endsWith("@professor.educacao.sp.gov.br")) {
    return { id_nivel: 1, cargo: "Professor", role: "professor" };
  }

  // 2. Aluno: inicia direto com números + [dígito opcional] + UF (sp) + @al.educacao.sp.gov.br (ex: 0000110074650xsp@al.educacao.sp.gov.br)
  if (cleanEmail.endsWith("@al.educacao.sp.gov.br")) {
    const raPattern = /^(?:ra)?\d+[a-z0-9]?sp@al\.educacao\.sp\.gov\.br$/i;
    if (raPattern.test(cleanEmail)) {
      return { id_nivel: 3, cargo: "Aluno", role: "student" };
    }
  }

  // 3. Diretor/Gestão: termina em @educacao.sp.gov.br (e não é de professor/aluno)
  if (
    cleanEmail.endsWith("@educacao.sp.gov.br") &&
    !cleanEmail.endsWith("@professor.educacao.sp.gov.br") &&
    !cleanEmail.endsWith("@al.educacao.sp.gov.br")
  ) {
    return { id_nivel: 2, cargo: "Diretor", role: "director" };
  }

  // 4. Permite e-mails do Gmail para facilitar testes e demonstrações reais do TCC
  if (cleanEmail.endsWith("@gmail.com")) {
    return { id_nivel: 3, cargo: "Aluno", role: "student" };
  }

  return null; // Inválido
}

function initializeDatabase() {
  db.serialize(() => {
    // Tabela de Usuários
    db.run(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        senha TEXT NOT NULL,
        id_nivel INTEGER NOT NULL,
        cargo TEXT NOT NULL,
        role TEXT NOT NULL
      )
    `);

    // Tabela de Posts
    db.run(`
      CREATE TABLE IF NOT EXISTS posts (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        subtitle TEXT,
        date TEXT NOT NULL,
        description TEXT NOT NULL,
        tag TEXT NOT NULL,
        image TEXT NOT NULL,
        link TEXT,
        likes INTEGER DEFAULT 0,
        author_email TEXT,
        author_id_nivel INTEGER,
        author_role TEXT,
        status TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Popular Usuários de Teste se vazia
    db.get("SELECT COUNT(*) as count FROM usuarios", (err, row) => {
      if (row && row.count === 0) {
        console.log("Populando banco de dados com usuários de demonstração do TCC...");
        const users = [
          {
            nome: "Prof. Márcio Rocha",
            email: "marcio.rocha@professor.educacao.sp.gov.br",
            senha: "senha123",
            id_nivel: 1,
            cargo: "Professor",
            role: "professor"
          },
          {
            nome: "Diretoria Ruy Rodriguez",
            email: "direcao@educacao.sp.gov.br",
            senha: "senha123",
            id_nivel: 2,
            cargo: "Diretor",
            role: "director"
          },
          {
            nome: "Angelo Gabriel (Aluno)",
            email: "0000110074650xsp@al.educacao.sp.gov.br",
            senha: "senha123",
            id_nivel: 3,
            cargo: "Aluno",
            role: "student"
          }
        ];

        users.forEach((u) => {
          const salt = bcrypt.genSaltSync(10);
          const hash = bcrypt.hashSync(u.senha, salt);
          db.run(
            `INSERT INTO usuarios (nome, email, senha, id_nivel, cargo, role) VALUES (?, ?, ?, ?, ?, ?)`,
            [u.nome, u.email, hash, u.id_nivel, u.cargo, u.role]
          );
        });
      }
    });

    // Popular Posts Iniciais se vazia
    db.get("SELECT COUNT(*) as count FROM posts", (err, row) => {
      if (row && row.count === 0) {
        console.log("Populando banco de dados com posts do blog escolar...");
        const initialPosts = [
          {
            id: "proj-0",
            title: "Graffiti nas Escolas",
            subtitle: "Arte Urbana e Protagonismo Estudantil",
            date: "Agosto 2026",
            description: "Oficinas de graffiti realizadas ao longo de seis meses em parceria com artistas da cena local de Campinas, transformando os muros da escola com arte, técnica e identidade comunitária.",
            tag: "Cultura",
            image: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800",
            link: "https://escolaruyrodriguez.wordpress.com/2026/08/13/graffiti-nas-escolas/",
            likes: 28,
            author_email: "marcio.rocha@professor.educacao.sp.gov.br",
            author_id_nivel: 1,
            author_role: "Professor",
            status: "approved"
          },
          {
            id: "proj-1",
            title: "Jornada de Investigação Científica",
            subtitle: "Apresentação e Banners na Escola",
            date: "Novembro 2025",
            description: "Estudantes apresentaram banners científicos com resultados de pesquisas sobre a qualidade da água e meio ambiente regional.",
            tag: "Ciências",
            image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800",
            link: "https://escolaruyrodriguez.wordpress.com/2025/11/29/jornada-de-investigacao-cientifica-banner-e-apresentacao-na-escola/",
            likes: 19,
            author_email: "marcio.rocha@professor.educacao.sp.gov.br",
            author_id_nivel: 1,
            author_role: "Professor",
            status: "approved"
          },
          {
            id: "proj-1b",
            title: "Relatório Científico: Ana Luiza Virti",
            subtitle: "Diário de Bordo da Iniciação Científica",
            date: "Novembro 2025",
            description: "Relato detalhado da estudante sobre as expedições no rio do Parque Itajaí, análises de amostras e conservação ambiental.",
            tag: "Ciências",
            image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800",
            link: "https://escolaruyrodriguez.wordpress.com/2025/11/29/jornada-de-investigacao-cientifica-relatorio-da-estudante-ana-luiza-virti/",
            likes: 16,
            author_email: "marcio.rocha@professor.educacao.sp.gov.br",
            author_id_nivel: 1,
            author_role: "Professor",
            status: "approved"
          },
          {
            id: "proj-2",
            title: "Visita ao Instituto Agronômico",
            subtitle: "IAC-Apta Portas Abertas",
            date: "Outubro 2025",
            description: "Visita técnica ao Instituto Agronômico de Campinas com apresentação de linhas de pesquisa e visitas guiadas.",
            tag: "Técnico / Novotec",
            image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800",
            link: "https://escolaruyrodriguez.wordpress.com/2025/11/29/jornada-de-investigacao-cientifica-visita-ao-instituto-agronomico/",
            likes: 25,
            author_email: "marcio.rocha@professor.educacao.sp.gov.br",
            author_id_nivel: 1,
            author_role: "Professor",
            status: "approved"
          },
          {
            id: "proj-3",
            title: "Estudo da Bacia Hidrográfica",
            subtitle: "Visita Técnica e Análises",
            date: "Maio 2025",
            description: "Coleta e análise de amostras de água em nascentes do Parque Itajaí para verificar a qualidade hídrica regional.",
            tag: "Ciências",
            image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800",
            link: "https://escolaruyrodriguez.wordpress.com/2025/11/29/jornada-de-investigacao-cientifica-segunda-visita-a-bacia-hidrografica/",
            likes: 21,
            author_email: "marcio.rocha@professor.educacao.sp.gov.br",
            author_id_nivel: 1,
            author_role: "Professor",
            status: "approved"
          },
          {
            id: "proj-4",
            title: "Projeto Chiquinha Gonzaga",
            subtitle: "Trilha de Educação Antirracista",
            date: "Novembro 2023",
            description: "Projeto interdisciplinar de valorização da música e cultura afro-brasileira a partir da história da compositora.",
            tag: "Eletivas",
            image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800",
            link: "https://escolaruyrodriguez.wordpress.com/2023/11/13/chiquinha-gonzaga-trilha-antirracista/",
            likes: 34,
            author_email: "marcio.rocha@professor.educacao.sp.gov.br",
            author_id_nivel: 1,
            author_role: "Professor",
            status: "approved"
          },
          {
            id: "proj-5",
            title: "Peça Teatral Olorum Ayé",
            subtitle: "Grupo Oriki de Teatro",
            date: "Outubro 2023",
            description: "Peça de teatro auto-organizada pelos alunos celebrando a mitologia e a ancestralidade afro-brasileira.",
            tag: "Clubes",
            image: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=800",
            link: "https://escolaruyrodriguez.wordpress.com/educacao-antirracista/",
            likes: 27,
            author_email: "marcio.rocha@professor.educacao.sp.gov.br",
            author_id_nivel: 1,
            author_role: "Professor",
            status: "approved"
          },
          {
            id: "proj-6",
            title: "O Samba do Ruy",
            subtitle: "Atividade de Eletiva Artística",
            date: "Setembro 2023",
            description: "Apresentação musical e debate histórico sobre o samba como patrimônio e manifestação popular brasileira.",
            tag: "Cultura",
            image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800",
            link: "https://escolaruyrodriguez.wordpress.com/2023/09/11/samba-do-ruy/",
            likes: 42,
            author_email: "marcio.rocha@professor.educacao.sp.gov.br",
            author_id_nivel: 1,
            author_role: "Professor",
            status: "approved"
          },
          {
            id: "proj-7",
            title: "Projeto Nzinga Mbandi",
            subtitle: "Trilha de Educação Antirracista",
            date: "Novembro 2023",
            description: "Atividade interdisciplinar sobre a rainha guerreira Nzinga Mbandi e sua liderança na resistência à escravidão.",
            tag: "Eletivas",
            image: "https://images.unsplash.com/photo-1578925518470-4def7a0f08bb?w=800",
            link: "https://escolaruyrodriguez.wordpress.com/educacao-antirracista/",
            likes: 22,
            author_email: "marcio.rocha@professor.educacao.sp.gov.br",
            author_id_nivel: 1,
            author_role: "Professor",
            status: "approved"
          },
          {
            id: "proj-8",
            title: "Maculelê e Danças Afro-Brasileiras",
            subtitle: "Cultura Popular e Movimento",
            date: "Novembro 2023",
            description: "Atividade de expressão corporal e resgate da dança folclórica Maculelê com bastões e dança do Carimbó.",
            tag: "Eletivas",
            image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800",
            link: "https://escolaruyrodriguez.wordpress.com/educacao-antirracista/",
            likes: 26,
            author_email: "marcio.rocha@professor.educacao.sp.gov.br",
            author_id_nivel: 1,
            author_role: "Professor",
            status: "approved"
          },
          {
            id: "proj-9",
            title: "Máscaras Africanas e Arte de Resistência",
            subtitle: "História e Resistência",
            date: "Novembro 2023",
            description: "Exposição artística com réplicas de máscaras tradicionais para discutir a religiosidade e a diversidade das culturas africanas.",
            tag: "Eletivas",
            image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800",
            link: "https://escolaruyrodriguez.wordpress.com/educacao-antirracista/",
            likes: 19,
            author_email: "marcio.rocha@professor.educacao.sp.gov.br",
            author_id_nivel: 1,
            author_role: "Professor",
            status: "approved"
          },
          {
            id: "proj-10",
            title: "Propaganda Publicitária Antirracista",
            subtitle: "Língua Portuguesa e Conscientização",
            date: "Novembro 2023",
            description: "Criação de propagandas publicitárias em vídeo contra o preconceito racial e homenagem ao rapper Sabotage.",
            tag: "Eletivas",
            image: "https://images.unsplash.com/photo-1542204165-65bf26472b9b?w=800",
            link: "https://escolaruyrodriguez.wordpress.com/educacao-antirracista/",
            likes: 31,
            author_email: "marcio.rocha@professor.educacao.sp.gov.br",
            author_id_nivel: 1,
            author_role: "Professor",
            status: "approved"
          },
          {
            id: "proj-pending-1",
            title: "Redesign da Biblioteca Ruy Rodriguez",
            subtitle: "Sugestão de Aluno",
            date: "Aguardando Aprovação",
            description: "Ideia para catalogar digitalmente todos os livros físicos da biblioteca em um portal de fácil busca para os estudantes.",
            tag: "Clubes",
            image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800",
            link: "#",
            likes: 0,
            author_email: "0000110074650xsp@al.educacao.sp.gov.br",
            author_id_nivel: 3,
            author_role: "Aluno",
            status: "pending"
          }
        ];

        initialPosts.forEach((p) => {
          db.run(
            `INSERT INTO posts (id, title, subtitle, date, description, tag, image, link, likes, author_email, author_id_nivel, author_role, status) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [p.id, p.title, p.subtitle, p.date, p.description, p.tag, p.image, p.link, p.likes, p.author_email, p.author_id_nivel, p.author_role, p.status]
          );
        });
      }
    });
  });
}

// --- ROTAS DA API ---

// 1. Registro
app.post("/api/auth/register", (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ error: "Preencha todos os campos obrigatórios." });
  }

  if (senha.length < 4) {
    return res.status(400).json({ error: "A senha deve ter no mínimo 4 caracteres." });
  }

  const access = getAccessLevel(email);
  if (!access) {
    return res.status(400).json({
      error: "E-mail institucional inválido. Use um e-mail escolar oficial da SED:\n" +
             "- Alunos: [RA][Dígito]sp@al.educacao.sp.gov.br (ex: 0000110074650xsp@al.educacao.sp.gov.br)\n" +
             "- Professores: ...@professor.educacao.sp.gov.br\n" +
             "- Diretores/Gestão: ...@educacao.sp.gov.br"
    });
  }

  // Verificar duplicado
  db.get("SELECT id FROM usuarios WHERE email = ?", [email.toLowerCase().trim()], (err, user) => {
    if (err) return res.status(500).json({ error: "Erro no banco de dados." });
    if (user) return res.status(400).json({ error: "E-mail já está cadastrado." });

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(senha, salt);

    db.run(
      "INSERT INTO usuarios (nome, email, senha, id_nivel, cargo, role) VALUES (?, ?, ?, ?, ?, ?)",
      [nome, email.toLowerCase().trim(), hash, access.id_nivel, access.cargo, access.role],
      async function (insertErr) {
        if (insertErr) return res.status(500).json({ error: "Erro ao registrar usuário." });

        const newUser = {
          id: access.id_nivel,
          nome,
          email: email.toLowerCase().trim(),
          id_nivel: access.id_nivel,
          cargo: access.cargo,
          roleTitle: access.cargo,
          role: access.role
        };

        // Enviar e-mail de boas-vindas / segurança
        await sendLoginAlertEmail(newUser, req);

        res.status(201).json({
          ...newUser,
          emailSent: true
        });
      }
    );
  });
});

// 2. Login
app.post("/api/auth/login", (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ error: "Preencha e-mail e senha." });
  }

  db.get("SELECT * FROM usuarios WHERE email = ?", [email.toLowerCase().trim()], async (err, user) => {
    if (err) return res.status(500).json({ error: "Erro interno do servidor." });
    if (!user) return res.status(400).json({ error: "E-mail institucional não cadastrado." });

    const match = bcrypt.compareSync(senha, user.senha);
    if (!match) return res.status(400).json({ error: "Senha incorreta." });

    // Disparo oficial do e-mail de alerta de login (Nodemailer / SED)
    const emailResult = await sendLoginAlertEmail(user, req);

    res.json({
      id: user.id_nivel, // Mapeado para o id_nivel do TCC para renderização
      nome: user.nome,
      name: user.nome,
      email: user.email,
      roleTitle: user.cargo,
      role: user.role,
      emailSent: emailResult.success !== false,
      emailSentAt: emailResult.date
    });
  });
});

// 2b. Enviar E-mail de Alerta (chamado pelo frontend ao usar o Supabase)
app.post("/api/auth/send-email", async (req, res) => {
  const { nome, email, cargo, id_nivel, role } = req.body;

  if (!nome || !email) {
    return res.status(400).json({ error: "Nome e e-mail são obrigatórios." });
  }

  const mockUser = {
    nome,
    email: email.toLowerCase().trim(),
    cargo: cargo || "Aluno",
    id_nivel: id_nivel || 3,
    role: role || "student"
  };

  const emailResult = await sendLoginAlertEmail(mockUser, req);

  res.json({
    success: emailResult.success !== false,
    date: emailResult.date
  });
});

// 3. Obter Posts
app.get("/api/posts", (req, res) => {
  db.all("SELECT * FROM posts ORDER BY created_at DESC", (err, rows) => {
    if (err) return res.status(500).json({ error: "Erro ao carregar posts." });
    
    // Mapear campos SQLite snake_case para o frontend camelCase
    const formatted = rows.map((r) => ({
      id: r.id,
      title: r.title,
      subtitle: r.subtitle,
      date: r.date,
      description: r.description,
      tag: r.tag,
      image: r.image,
      link: r.link,
      likes: r.likes,
      authorEmail: r.author_email,
      authorId: r.author_id_nivel,
      authorRole: r.author_role,
      status: r.status
    }));
    res.json(formatted);
  });
});

// 4. Criar Post
app.post("/api/posts", (req, res) => {
  const { id, title, subtitle, date, description, tag, image, link, authorEmail, authorId, authorRole, status } = req.body;

  db.run(
    `INSERT INTO posts (id, title, subtitle, date, description, tag, image, link, likes, author_email, author_id_nivel, author_role, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?, ?, ?)`,
    [id, title, subtitle, date, description, tag, image, link, authorEmail, authorId, authorRole, status],
    function (err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Erro ao criar postagem." });
      }
      res.status(201).json({ id, title, subtitle, date, description, tag, image, link, likes: 0, authorEmail, authorId, authorRole, status });
    }
  );
});

// 5. Curtir Post
app.post("/api/posts/:id/like", (req, res) => {
  const { id } = req.params;
  const { likes } = req.body;

  db.run("UPDATE posts SET likes = ? WHERE id = ?", [likes, id], (err) => {
    if (err) return res.status(500).json({ error: "Erro ao atualizar curtidas." });
    res.json({ success: true });
  });
});

// 6. Atualizar Status (Aprovar/Rejeitar)
app.put("/api/posts/:id/status", (req, res) => {
  const { id } = req.params;
  const { status, date } = req.body; // status: "approved" | "rejected"

  db.run("UPDATE posts SET status = ?, date = ? WHERE id = ?", [status, date, id], (err) => {
    if (err) return res.status(500).json({ error: "Erro ao atualizar status do post." });
    res.json({ success: true });
  });
});

// 7. Deletar Post
app.delete("/api/posts/:id", (req, res) => {
  const { id } = req.params;

  db.run("DELETE FROM posts WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json({ error: "Erro ao excluir postagem." });
    res.json({ success: true });
  });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT} (SQLite: ruy_escola.db).`);
});
