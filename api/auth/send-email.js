const nodemailer = require("nodemailer");

module.exports = async (req, res) => {
  // CORS Headers
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { nome, email, cargo, id_nivel, role } = req.body;

  if (!nome || !email) {
    return res.status(400).json({ error: "Nome e e-mail são obrigatórios." });
  }

  // Nodemailer Config
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
  } else {
    mailTransporter = nodemailer.createTransport({
      jsonTransport: true,
    });
  }

  const loginDate = new Date().toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const ip = req.headers["x-forwarded-for"] || "127.0.0.1";

  // Redireciona e-mails institucionais simulados para o Gmail real de testes
  let recipient = email;
  if (
    email.endsWith("@al.educacao.sp.gov.br") ||
    email.endsWith("@professor.educacao.sp.gov.br") ||
    email.endsWith("@educacao.sp.gov.br")
  ) {
    recipient = process.env.SMTP_USER || "ju231107@gmail.com";
  }

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
            <tr style="background:linear-gradient(135deg, #1e3a8a 0%, #991b1b 100%);">
              <td style="padding:30px 24px;text-align:center;color:#ffffff;">
                <h1 style="margin:0;font-size:22px;font-weight:700;letter-spacing:0.5px;">Portal E.E. Ruy Rodriguez</h1>
                <p style="margin:6px 0 0 0;font-size:12px;opacity:0.9;text-transform:uppercase;letter-spacing:1.5px;">Secretaria da Educação do Estado de São Paulo</p>
              </td>
            </tr>
            <tr>
              <td style="padding:32px 28px;">
                <div style="display:inline-block;padding:4px 12px;border-radius:20px;background:#dcfce7;color:#15803d;font-weight:700;font-size:11px;text-transform:uppercase;letter-spacing:1px;margin-bottom:16px;">
                  ✓ Alerta de Segurança
                </div>
                <h2 style="margin:0 0 12px 0;font-size:18px;color:#0f172a;font-weight:700;">Olá, ${nome}!</h2>
                <p style="margin:0 0 20px 0;font-size:14px;line-height:1.6;color:#475569;">
                  Identificamos um novo acesso à sua conta institucional no <strong>Portal Oficial da E.E. Ruy Rodriguez</strong>.
                </p>
                <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border-radius:12px;border:1px solid #e2e8f0;margin-bottom:24px;">
                  <tr>
                    <td style="padding:16px 20px;">
                      <p style="margin:0 0 8px 0;font-size:13px;color:#334155;"><strong>📅 Data e Horário:</strong> ${loginDate} (Horário de Brasília)</p>
                      <p style="margin:0 0 8px 0;font-size:13px;color:#334155;"><strong>👤 Perfil / Cargo:</strong> ${cargo} (Nível ${id_nivel})</p>
                      <p style="margin:0 0 8px 0;font-size:13px;color:#334155;"><strong>📧 E-mail Original:</strong> ${email}</p>
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

  const mailOptions = {
    from: '"Portal E.E. Ruy Rodriguez" <seguranca.escola@educacao.sp.gov.br>',
    to: recipient,
    subject: "🔐 Alerta de Segurança: Novo acesso ao Portal Ruy Rodriguez",
    text: `Olá, ${nome}!\n\nIdentificamos um novo login em sua conta institucional (${email}) no Portal da E.E. Ruy Rodriguez.\n\nData/Hora: ${loginDate}\nPerfil: ${cargo}\nOrigem: ${ip}\n\nSe você não reconhece esta atividade, redefina sua senha imediatamente.`,
    html: emailHtml,
  };

  try {
    const info = await mailTransporter.sendMail(mailOptions);
    return res.status(200).json({ success: true, messageId: info.messageId });
  } catch (err) {
    console.error("Falha ao enviar e-mail de alerta:", err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
};
