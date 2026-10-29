import projetoBanner from '../assets/projeto-banner.jpg';
import visitaIac from '../assets/visita-iac.jpg';
import baciaHidro from '../assets/bacia-hidrografica.jpg';
import chiquinhaImg from '../assets/chiquinha-gonzaga.jpg';
import teatroOriki from '../assets/teatro-oriki.jpg';
import sambaRuy from '../assets/samba-ruy.jpg';
import nzingaImg from '../assets/nzinga-mbandi.jpg';
import investigacao1 from '../assets/scraped_gallery/investigacao_1.jpg';
import investigacao2 from '../assets/scraped_gallery/investigacao_2.jpg';
import { UserType } from '../components/LoginModal';
import { supabase, isSupabaseConfigured } from "./supabaseClient";
import bcrypt from "bcryptjs";

export interface ProjectPost {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  description: string;
  tag: string;
  image: string;
  link: string;
  likes: number;
  authorEmail?: string;
  authorId?: number;
  authorRole?: string;
  status?: "approved" | "pending" | "rejected";
  created_at?: string;
}

const initialProjects: ProjectPost[] = [
  {
    id: "proj-0",
    title: "Graffiti nas Escolas",
    subtitle: "Arte Urbana e Protagonismo Estudantil",
    date: "Agosto 2026",
    description: "Oficinas de graffiti realizadas ao longo de seis meses em parceria com artistas da cena local de Campinas, transformando os muros da escola com arte, técnica e identidade comunitária.",
    tag: "Cultura",
    image: projetoBanner,
    link: "https://escolaruyrodriguez.wordpress.com/2026/08/13/graffiti-nas-escolas/",
    likes: 28,
    status: "approved"
  },
  {
    id: "proj-1",
    title: "Jornada de Investigação Científica",
    subtitle: "Apresentação e Banners na Escola",
    date: "Novembro 2025",
    description: "Estudantes apresentaram banners científicos com resultados de pesquisas sobre a qualidade da água e meio ambiente regional.",
    tag: "Ciências",
    image: projetoBanner,
    link: "https://escolaruyrodriguez.wordpress.com/2025/11/29/jornada-de-investigacao-cientifica-banner-e-apresentacao-na-escola/",
    likes: 19,
    status: "approved"
  },
  {
    id: "proj-1b",
    title: "Relatório Científico: Ana Luiza Virti",
    subtitle: "Diário de Bordo da Iniciação Científica",
    date: "Novembro 2025",
    description: "Relato detalhado da estudante sobre as expedições no rio do Parque Itajaí, análises de amostras e conservação ambiental.",
    tag: "Ciências",
    image: investigacao1,
    link: "https://escolaruyrodriguez.wordpress.com/2025/11/29/jornada-de-investigacao-cientifica-relatorio-da-estudante-ana-luiza-virti/",
    likes: 16,
    status: "approved"
  },
  {
    id: "proj-2",
    title: "Visita ao Instituto Agronômico",
    subtitle: "IAC-Apta Portas Abertas",
    date: "Outubro 2025",
    description: "Visita técnica ao Instituto Agronômico de Campinas com apresentação de linhas de pesquisa e visitas guiadas.",
    tag: "Técnico / Novotec",
    image: visitaIac,
    link: "https://escolaruyrodriguez.wordpress.com/2025/11/29/jornada-de-investigacao-cientifica-visita-ao-instituto-agronomico/",
    likes: 25,
    status: "approved"
  },
  {
    id: "proj-3",
    title: "Estudo da Bacia Hidrográfica",
    subtitle: "Visita Técnica e Análises",
    date: "Maio 2025",
    description: "Coleta e análise de amostras de água em nascentes do Parque Itajaí para verificar a qualidade hídrica regional.",
    tag: "Ciências",
    image: baciaHidro,
    link: "https://escolaruyrodriguez.wordpress.com/2025/11/29/jornada-de-investigacao-cientifica-segunda-visita-a-bacia-hidrografica/",
    likes: 21,
    status: "approved"
  },
  {
    id: "proj-4",
    title: "Projeto Chiquinha Gonzaga",
    subtitle: "Trilha de Educação Antirracista",
    date: "Novembro 2023",
    description: "Projeto interdisciplinar de valorização da música e cultura afro-brasileira a partir da história da compositora.",
    tag: "Eletivas",
    image: chiquinhaImg,
    link: "https://escolaruyrodriguez.wordpress.com/2023/11/13/chiquinha-gonzaga-trilha-antirracista/",
    likes: 34,
    status: "approved"
  },
  {
    id: "proj-5",
    title: "Peça Teatral Olorum Ayé",
    subtitle: "Grupo Oriki de Teatro",
    date: "Outubro 2023",
    description: "Peça de teatro auto-organizada pelos alunos celebrando a mitologia e a ancestralidade afro-brasileira.",
    tag: "Clubes",
    image: teatroOriki,
    link: "https://escolaruyrodriguez.wordpress.com/educacao-antirracista/",
    likes: 27,
    status: "approved"
  },
  {
    id: "proj-6",
    title: "O Samba do Ruy",
    subtitle: "Atividade de Eletiva Artística",
    date: "Setembro 2023",
    description: "Apresentação musical e debate histórico sobre o samba como patrimônio e manifestação popular brasileira.",
    tag: "Cultura",
    image: sambaRuy,
    link: "https://escolaruyrodriguez.wordpress.com/2023/09/11/samba-do-ruy/",
    likes: 42,
    status: "approved"
  },
  {
    id: "proj-7",
    title: "Projeto Nzinga Mbandi",
    subtitle: "Trilha de Educação Antirracista",
    date: "Novembro 2023",
    description: "Atividade interdisciplinar sobre a rainha guerreira Nzinga Mbandi e sua liderança na resistência à escravidão.",
    tag: "Eletivas",
    image: nzingaImg,
    link: "https://escolaruyrodriguez.wordpress.com/educacao-antirracista/",
    likes: 22,
    status: "approved"
  },
  {
    id: "proj-8",
    title: "Maculelê e Danças Afro-Brasileiras",
    subtitle: "Cultura Popular e Movimento",
    date: "Novembro 2023",
    description: "Atividade de expressão corporal e resgate da dança folclórica Maculelê com bastões e dança do Carimbó.",
    tag: "Eletivas",
    image: projetoBanner,
    link: "https://escolaruyrodriguez.wordpress.com/educacao-antirracista/",
    likes: 26,
    status: "approved"
  },
  {
    id: "proj-9",
    title: "Máscaras Africanas e Arte de Resistência",
    subtitle: "História e Resistência",
    date: "Novembro 2023",
    description: "Exposição artística com réplicas de máscaras tradicionais para discutir a religiosidade e a diversidade das culturas africanas.",
    tag: "Eletivas",
    image: teatroOriki,
    link: "https://escolaruyrodriguez.wordpress.com/educacao-antirracista/",
    likes: 19,
    status: "approved"
  },
  {
    id: "proj-10",
    title: "Propaganda Publicitária Antirracista",
    subtitle: "Língua Portuguesa e Conscientização",
    date: "Novembro 2023",
    description: "Criação de propagandas publicitárias em vídeo contra o preconceito racial e homenagem ao rapper Sabotage.",
    tag: "Eletivas",
    image: sambaRuy,
    link: "https://escolaruyrodriguez.wordpress.com/educacao-antirracista/",
    likes: 31,
    status: "approved"
  },
  {
    id: "proj-pending-1",
    title: "Redesign da Biblioteca Ruy Rodriguez",
    subtitle: "Sugestão de Aluno",
    date: "Aguardando Aprovação",
    description: "Ideia para catalogar digitalmente todos os livros físicos da biblioteca em um portal de fácil busca para os estudantes.",
    tag: "Clubes",
    image: projetoBanner,
    link: "#",
    likes: 0,
    authorEmail: "0000110074650xsp@al.educacao.sp.gov.br",
    authorId: 3,
    authorRole: "Aluno (Editor)",
    status: "pending"
  }
];

const LOCAL_POSTS_KEY = "ruy_mural_posts";

function getLocalPosts(): ProjectPost[] {
  if (typeof window === "undefined") return initialProjects;
  try {
    const data = localStorage.getItem(LOCAL_POSTS_KEY);
    if (!data) {
      localStorage.setItem(LOCAL_POSTS_KEY, JSON.stringify(initialProjects));
      return initialProjects;
    }
    const parsed = JSON.parse(data);
    if (Array.isArray(parsed)) {
      return parsed.map(p => ({
        ...p,
        status: p.status || "approved"
      }));
    }
    return initialProjects;
  } catch {
    return initialProjects;
  }
}

function saveLocalPosts(posts: ProjectPost[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_POSTS_KEY, JSON.stringify(posts));
  } catch (e) {
    console.error("Error saving posts to localStorage:", e);
  }
}

const LOCAL_USERS_KEY = "ruy_usuarios";

interface LocalUser {
  id: 1 | 2 | 3;
  email: string;
  name: string;
  role: "student" | "management" | "professor" | "director";
  roleTitle: "Professor" | "Diretor" | "Aluno";
  passwordHash: string;
  emailSent?: boolean;
}

const defaultUsers: LocalUser[] = [
  {
    id: 1,
    email: "marcio.rocha@professor.educacao.sp.gov.br",
    name: "Prof. Márcio Rocha",
    role: "professor",
    roleTitle: "Professor",
    passwordHash: "senha123",
    emailSent: true
  },
  {
    id: 2,
    email: "direcao@educacao.sp.gov.br",
    name: "Diretoria Ruy Rodriguez",
    role: "director",
    roleTitle: "Diretor",
    passwordHash: "senha123",
    emailSent: true
  },
  {
    id: 3,
    email: "0000110074650xsp@al.educacao.sp.gov.br",
    name: "Angelo Gabriel (Aluno)",
    role: "student",
    roleTitle: "Aluno",
    passwordHash: "senha123",
    emailSent: true
  }
];

function getLocalUsers(): LocalUser[] {
  if (typeof window === "undefined") return defaultUsers;
  try {
    const data = localStorage.getItem(LOCAL_USERS_KEY);
    if (!data) {
      localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(defaultUsers));
      return defaultUsers;
    }
    return JSON.parse(data);
  } catch {
    return defaultUsers;
  }
}

function saveLocalUsers(users: LocalUser[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
  } catch (e) {
    console.error("Error saving users to localStorage:", e);
  }
}

function getLocalAccessLevel(email: string) {
  const cleanEmail = email.toLowerCase().trim();

  if (cleanEmail.endsWith("@professor.educacao.sp.gov.br")) {
    return { id_nivel: 1 as const, roleTitle: "Professor" as const, role: "professor" as const };
  }

  if (cleanEmail.endsWith("@al.educacao.sp.gov.br")) {
    const raPattern = /^(?:ra)?\d+[a-z0-9]?sp@al\.educacao\.sp\.gov\.br$/i;
    if (raPattern.test(cleanEmail)) {
      return { id_nivel: 3 as const, roleTitle: "Aluno" as const, role: "student" as const };
    }
  }

  if (
    cleanEmail.endsWith("@educacao.sp.gov.br") &&
    !cleanEmail.endsWith("@professor.educacao.sp.gov.br") &&
    !cleanEmail.endsWith("@al.educacao.sp.gov.br")
  ) {
    return { id_nivel: 2 as const, roleTitle: "Diretor" as const, role: "director" as const };
  }

  if (cleanEmail.endsWith("@gmail.com")) {
    return { id_nivel: 3 as const, roleTitle: "Aluno" as const, role: "student" as const };
  }

  return null;
}

export const dbService = {
  // --- AUTENTICAÇÃO REAL COM FALLBACK DE SEGURANÇA LOCAL AUTOMÁTICO ---
  async login(email: string, senha: string): Promise<UserType> {
    if (isSupabaseConfigured) {
      try {
        const cleanEmail = email.trim().toLowerCase();
        const { data: user, error } = await supabase
          .from("usuarios")
          .select("*")
          .eq("email", cleanEmail)
          .maybeSingle();

        if (error) {
          throw new Error(error.message);
        }

        if (!user) {
          throw new Error("E-mail institucional não cadastrado.");
        }

        const match = bcrypt.compareSync(senha, user.senha);
        if (!match) {
          throw new Error("Senha incorreta.");
        }

        // Dispara o alerta de e-mail em segundo plano
        fetch("/api/auth/send-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nome: user.nome,
            email: user.email,
            cargo: user.cargo,
            id_nivel: user.id_nivel,
            role: user.role
          })
        }).catch(e => console.warn("Erro ao notificar e-mail no login:", e));

        return {
          id: user.id_nivel as 1 | 2 | 3,
          name: user.nome,
          email: user.email,
          role: user.role as any,
          roleTitle: user.cargo as any,
          emailSent: true
        };
      } catch (err: any) {
        const errMsg = err.message || "";
        if (errMsg.includes("Senha incorreta") || errMsg.includes("não cadastrado")) {
          throw err;
        }
        console.warn("Supabase login falhou, tentando Express API ou Local Storage:", err);
      }
    }

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha })
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Servidor offline");
      }

      if (!response.ok) {
        const errorData = await response.json();
        const error = new Error(errorData.error || "Erro ao efetuar login.");
        (error as any).isValidationError = true;
        throw error;
      }

      return await response.json();
    } catch (err: any) {
      if (err.isValidationError) {
        throw err;
      }
      console.warn("Express API falhou, usando autenticação mock (segurança apenas local):", err);
      
      const cleanEmail = email.trim().toLowerCase();
      const localUsers = getLocalUsers();
      const user = localUsers.find(u => u.email === cleanEmail);
      
      if (!user) {
        throw new Error("E-mail institucional não cadastrado (Modo Simulado).");
      }
      
      if (user.passwordHash !== senha) {
        throw new Error("Senha incorreta (Modo Simulado).");
      }

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        roleTitle: user.roleTitle,
        emailSent: false
      };
    }
  },

  async register(nome: string, email: string, senha: string): Promise<UserType> {
    if (isSupabaseConfigured) {
      try {
        const cleanEmail = email.trim().toLowerCase();
        
        const access = getLocalAccessLevel(cleanEmail);
        if (!access) {
          throw new Error(
            "E-mail institucional inválido. Use um e-mail escolar oficial da SED:\n" +
            "- Alunos: [RA][Dígito]sp@al.educacao.sp.gov.br\n" +
            "- Professores: ...@professor.educacao.sp.gov.br\n" +
            "- Diretores/Gestão: ...@educacao.sp.gov.br"
          );
        }

        const { data: existingUser, error: checkError } = await supabase
          .from("usuarios")
          .select("id")
          .eq("email", cleanEmail)
          .maybeSingle();

        if (checkError) {
          throw new Error(checkError.message);
        }

        if (existingUser) {
          throw new Error("E-mail já está cadastrado.");
        }

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(senha, salt);

        const { data: newUser, error: insertError } = await supabase
          .from("usuarios")
          .insert([{
            nome,
            email: cleanEmail,
            senha: hash,
            id_nivel: access.id_nivel,
            cargo: access.roleTitle,
            role: access.role
          }])
          .select()
          .single();

        if (insertError || !newUser) {
          throw new Error(insertError?.message || "Erro ao registrar no banco de dados.");
        }

        // Dispara o alerta de e-mail em segundo plano
        fetch("/api/auth/send-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nome: newUser.nome,
            email: newUser.email,
            cargo: newUser.cargo,
            id_nivel: newUser.id_nivel,
            role: newUser.role
          })
        }).catch(e => console.warn("Erro ao notificar e-mail no registro:", e));

        return {
          id: newUser.id_nivel as 1 | 2 | 3,
          name: newUser.nome,
          email: newUser.email,
          role: newUser.role as any,
          roleTitle: newUser.cargo as any,
          emailSent: true
        };
      } catch (err: any) {
        const errMsg = err.message || "";
        if (errMsg.includes("já está cadastrado") || errMsg.includes("E-mail institucional inválido")) {
          throw err;
        }
        console.warn("Supabase register falhou, tentando Express API ou Local Storage:", err);
      }
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, senha })
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Servidor offline");
      }

      if (!response.ok) {
        const errorData = await response.json();
        const error = new Error(errorData.error || "Erro ao cadastrar.");
        (error as any).isValidationError = true;
        throw error;
      }

      return await response.json();
    } catch (err: any) {
      if (err.isValidationError) {
        throw err;
      }
      console.warn("Express API falhou no cadastro, salvando localmente no localStorage:", err);
      
      const cleanEmail = email.trim().toLowerCase();
      const localUsers = getLocalUsers();
      
      if (localUsers.some(u => u.email === cleanEmail)) {
        throw new Error("E-mail já está cadastrado (Modo Simulado).");
      }

      const access = getLocalAccessLevel(cleanEmail);
      if (!access) {
        throw new Error(
          "E-mail institucional inválido. Use um e-mail escolar oficial da SED:\n" +
          "- Alunos: [RA][Dígito]sp@al.educacao.sp.gov.br\n" +
          "- Professores: ...@professor.educacao.sp.gov.br\n" +
          "- Diretores/Gestão: ...@educacao.sp.gov.br"
        );
      }

      const newUser: LocalUser = {
        id: access.id_nivel,
        name: nome,
        email: cleanEmail,
        role: access.role,
        roleTitle: access.roleTitle,
        passwordHash: senha,
        emailSent: false
      };

      localUsers.push(newUser);
      saveLocalUsers(localUsers);

      return {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        roleTitle: newUser.roleTitle,
        emailSent: false
      };
    }
  },

  // --- MURAL / POSTS ---
  async getPosts(): Promise<ProjectPost[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from("posts")
          .select("*")
          .order("created_at", { ascending: false });

        if (!error && data) {
          return data.map((r: any) => ({
            id: r.id,
            title: r.title,
            subtitle: r.subtitle,
            date: r.date,
            description: r.description,
            tag: r.tag,
            image: r.image,
            link: r.link,
            likes: r.likes || 0,
            authorEmail: r.author_email,
            authorId: r.author_id_nivel,
            authorRole: r.author_role,
            status: r.status
          }));
        }
      } catch (err) {
        console.warn("Supabase getPosts falhou, usando fallbacks:", err);
      }
    }

    try {
      const response = await fetch("/api/posts");
      if (response.ok) {
        return await response.json();
      }
    } catch (err) {
      console.warn("Servidor backend inativo. Exibindo posts do localStorage:", err);
    }
    return getLocalPosts();
  },

  async createPost(post: ProjectPost): Promise<ProjectPost> {
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase
          .from("posts")
          .insert([{
            id: post.id,
            title: post.title,
            subtitle: post.subtitle,
            date: post.date,
            description: post.description,
            tag: post.tag,
            image: post.image,
            link: post.link,
            likes: post.likes || 0,
            author_email: post.authorEmail,
            author_id_nivel: post.authorId,
            author_role: post.authorRole,
            status: post.status || "pending"
          }]);

        if (!error) {
          return post;
        }
      } catch (err) {
        console.warn("Supabase createPost falhou, usando fallbacks:", err);
      }
    }

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(post)
      });
      if (response.ok) {
        return await response.json();
      }
    } catch (err) {
      console.warn("Servidor backend inativo. Salvando post localmente:", err);
    }

    const localPosts = getLocalPosts();
    const updated = [post, ...localPosts];
    saveLocalPosts(updated);
    return post;
  },

  async approvePost(id: string): Promise<boolean> {
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase
          .from("posts")
          .update({ status: "approved", date: "Recém-Aprovado" })
          .eq("id", id);

        if (!error) {
          return true;
        }
      } catch (err) {
        console.warn("Supabase approvePost falhou, usando fallbacks:", err);
      }
    }

    try {
      const response = await fetch(`/api/posts/${encodeURIComponent(id)}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "approved", date: "Recém-Aprovado" })
      });
      if (response.ok) {
        return true;
      }
    } catch (err) {
      console.warn("Servidor backend inativo. Aprovando localmente:", err);
    }

    const localPosts = getLocalPosts();
    const updated = localPosts.map(p => p.id === id ? { ...p, status: "approved" as const, date: "Recém-Aprovado" } : p);
    saveLocalPosts(updated);
    return true;
  },

  async rejectPost(id: string): Promise<boolean> {
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase
          .from("posts")
          .delete()
          .eq("id", id);

        if (!error) {
          return true;
        }
      } catch (err) {
        console.warn("Supabase rejectPost falhou, usando fallbacks:", err);
      }
    }

    try {
      const response = await fetch(`/api/posts/${encodeURIComponent(id)}`, {
        method: "DELETE"
      });
      if (response.ok) {
        return true;
      }
    } catch (err) {
      console.warn("Servidor backend inativo. Recusando localmente:", err);
    }

    const localPosts = getLocalPosts();
    const updated = localPosts.filter(p => p.id !== id);
    saveLocalPosts(updated);
    return true;
  },

  async updateLikes(id: string, newLikesCount: number): Promise<boolean> {
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase
          .from("posts")
          .update({ likes: newLikesCount })
          .eq("id", id);

        if (!error) {
          return true;
        }
      } catch (err) {
        console.warn("Supabase updateLikes falhou, usando fallbacks:", err);
      }
    }

    try {
      const response = await fetch(`/api/posts/${encodeURIComponent(id)}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ likes: newLikesCount })
      });
      if (response.ok) {
        return true;
      }
    } catch (err) {
      console.warn("Servidor backend inativo. Atualizando likes localmente:", err);
    }

    const localPosts = getLocalPosts();
    const updated = localPosts.map(p => p.id === id ? { ...p, likes: newLikesCount } : p);
    saveLocalPosts(updated);
    return true;
  },

  async deletePost(id: string): Promise<boolean> {
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase
          .from("posts")
          .delete()
          .eq("id", id);

        if (!error) {
          return true;
        }
      } catch (err) {
        console.warn("Supabase deletePost falhou, usando fallbacks:", err);
      }
    }

    try {
      const response = await fetch(`/api/posts/${encodeURIComponent(id)}`, {
        method: "DELETE"
      });
      if (response.ok) {
        return true;
      }
    } catch (err) {
      console.warn("Servidor backend inativo. Excluindo localmente:", err);
    }

    const localPosts = getLocalPosts();
    const updated = localPosts.filter(p => p.id !== id);
    saveLocalPosts(updated);
    return true;
  }
};
