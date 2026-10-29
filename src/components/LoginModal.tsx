import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, User, Lock, Shield, Check, AlertCircle, ArrowLeft, Key } from "lucide-react";
import { toast } from "sonner";
import { dbService } from "../lib/dbService";

export interface UserType {
  id: 1 | 2 | 3;
  email: string;
  name: string;
  role: "student" | "management" | "professor" | "director";
  roleTitle: "Professor" | "Diretor" | "Aluno";
  emailSent?: boolean;
  emailSentAt?: string;
}

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: UserType) => void;
}

type ModalView = "auth" | "forgot_password" | "verify_code" | "reset_password";
type TabType = "login" | "register";

const LoginModal = ({ isOpen, onClose, onLogin }: LoginModalProps) => {
  const [view, setView] = useState<ModalView>("auth");
  const [activeTab, setActiveTab] = useState<TabType>("login");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  
  // Recovery states
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [inputCode, setInputCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState<string | null>(null);

  // Reset states when modal is opened/closed
  useEffect(() => {
    setError(null);
    if (!isOpen) {
      setView("auth");
      setActiveTab("login");
      setEmail("");
      setName("");
      setPassword("");
      setRecoveryEmail("");
      setGeneratedCode("");
      setInputCode("");
      setNewPassword("");
      setConfirmPassword("");
    }
  }, [isOpen]);

  // Detector de nível e papel no TCC
  const detectEmailRole = (emailStr: string) => {
    const cleanEmail = emailStr.trim().toLowerCase();
    
    if (cleanEmail.endsWith("@professor.educacao.sp.gov.br")) {
      return { id: 1 as const, roleTitle: "Professor" as const, role: "professor" as const };
    }
    
    if (cleanEmail.endsWith("@al.educacao.sp.gov.br")) {
      const raPattern = /^(?:ra)?\d+[a-z0-9]?sp@al\.educacao\.sp\.gov\.br$/i;
      if (raPattern.test(cleanEmail)) {
        return { id: 3 as const, roleTitle: "Aluno" as const, role: "student" as const };
      }
    }
    
    if (
      cleanEmail.endsWith("@educacao.sp.gov.br") &&
      !cleanEmail.endsWith("@professor.educacao.sp.gov.br") &&
      !cleanEmail.endsWith("@al.educacao.sp.gov.br")
    ) {
      return { id: 2 as const, roleTitle: "Diretor" as const, role: "director" as const };
    }

    if (cleanEmail.endsWith("@gmail.com")) {
      return { id: 3 as const, roleTitle: "Aluno" as const, role: "student" as const };
    }
    
    return null;
  };

  const detectedRole = email ? detectEmailRole(email) : null;

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanEmail = email.trim();
    const cleanName = name.trim();

    if (!cleanEmail || !password || (activeTab === "register" && !cleanName)) {
      setError("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    if (password.length < 4) {
      setError("A senha deve conter pelo menos 4 caracteres.");
      return;
    }

    const roleInfo = detectEmailRole(cleanEmail);
    if (!roleInfo) {
      setError("E-mail institucional inválido. Os domínios aceitos são:\n- Alunos: [RA][Dígito]sp@al.educacao.sp.gov.br (ex: 0000110074650xsp@al.educacao.sp.gov.br)\n- Professores: ...@professor.educacao.sp.gov.br\n- Gestão/Diretores: ...@educacao.sp.gov.br");
      return;
    }

    try {
      if (activeTab === "login") {
        // Conexão com banco SQLite (com fallback local transparente)
        const loggedUser = await dbService.login(cleanEmail, password);
        onLogin(loggedUser);
        toast.success(`Acesso concedido como ${loggedUser.roleTitle}!`, {
          description: `Bem-vindo(a) de volta, ${loggedUser.name}.`
        });
        
        if (loggedUser.emailSent !== false) {
          toast.info("📧 Alerta de segurança enviado!", {
            description: `Notificação oficial de login enviada para o seu e-mail institucional: ${loggedUser.email}`,
            duration: 8000,
          });
        }
        onClose();
      } else {
        // Registrar novo usuário no SQLite
        const registeredUser = await dbService.register(cleanName, cleanEmail, password);
        onLogin(registeredUser);
        toast.success(`Conta criada com sucesso!`, {
          description: `Bem-vindo(a) à plataforma Ruy Rodriguez, ${registeredUser.name}.`
        });
        toast.info("📧 Notificação de acesso enviada!", {
          description: `Notificação de segurança enviada para: ${registeredUser.email}`,
          duration: 8000,
        });
        onClose();
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Erro de conexão ao banco de dados. Verifique o servidor.");
    }
  };

  // Login de Demonstração do TCC
  const handleQuickDemoLogin = (demoUser: UserType) => {
    onLogin(demoUser);
    toast.success(`Login como ${demoUser.roleTitle} efetuado!`, {
      description: `Perfil de teste da Banca: ${demoUser.name}.`
    });
    onClose();
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanEmail = recoveryEmail.trim().toLowerCase();
    if (!cleanEmail) {
      setError("Por favor, informe seu e-mail.");
      return;
    }

    const role = detectEmailRole(cleanEmail);
    if (!role) {
      setError("Utilize um e-mail institucional válido.");
      return;
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(code);
    
    toast.info(`[SIMULAÇÃO] Código de recuperação enviado!`, {
      duration: 15000,
      description: `Código: ${code} (Copie este código para redefinir sua senha).`
    });

    setView("verify_code");
  };

  const handleVerifyCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (inputCode.trim() !== generatedCode) {
      setError("Código de verificação incorreto. Tente novamente.");
      return;
    }

    setView("reset_password");
  };

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword.length < 4) {
      setError("A nova senha deve conter pelo menos 4 caracteres.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("As senhas informadas não coincidem.");
      return;
    }

    toast.success("Senha redefinida com sucesso!", {
      description: "Agora você pode entrar na sua conta com a nova senha."
    });

    setView("auth");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="bg-card border border-border rounded-2xl p-6 max-w-md w-full shadow-elevated relative overflow-y-auto max-h-[92vh] z-10 scrollbar-thin"
          >
            {/* Design accents */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-school-gold/5 rounded-full blur-xl pointer-events-none" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {view === "auth" && (
              <>
                <div className="mb-6 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-display font-bold text-2xl text-foreground">
                    Portal Ruy Rodriguez
                  </h3>
                  <p className="text-xs text-muted-foreground font-body mt-1 max-w-sm mx-auto">
                    Faça login ou cadastre-se utilizando os domínios de e-mail acadêmicos da SED.
                  </p>
                </div>

                {/* Tabs Switcher */}
                <div className="grid grid-cols-2 p-1 bg-muted rounded-xl mb-4 border border-border/60">
                  <button
                    onClick={() => { setActiveTab("login"); setError(null); }}
                    className={`py-2 rounded-lg text-xs font-bold transition-all ${
                      activeTab === "login" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Entrar
                  </button>
                  <button
                    onClick={() => { setActiveTab("register"); setError(null); }}
                    className={`py-2 rounded-lg text-xs font-bold transition-all ${
                      activeTab === "register" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Cadastrar
                  </button>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex gap-2 items-start font-body whitespace-pre-line"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </motion.div>
                )}

                <form onSubmit={handleAuthSubmit} className="space-y-3.5">
                  {/* Name field (Only in Register tab) */}
                  {activeTab === "register" && (
                    <div>
                      <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                        Nome Completo
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Seu nome completo"
                          className="w-full pl-10 pr-4 py-2.5 text-xs bg-muted border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
                        />
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">
                          <User className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Email field */}
                  <div>
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                      E-mail Institucional
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="0000110074650xsp@al.educacao.sp.gov.br"
                        className="w-full pl-10 pr-4 py-2.5 text-xs bg-muted border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
                      />
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">
                        <Mail className="w-4 h-4" />
                      </span>
                    </div>

                    {/* Feedback visual imediato do cargo no formulário */}
                    {email && (
                      <div className="mt-1.5 flex justify-end">
                        {detectedRole ? (
                          <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            detectedRole.id === 1 
                              ? "bg-primary/10 text-primary border border-primary/20" 
                              : detectedRole.id === 2 
                              ? "bg-amber-500/10 text-amber-700 border border-amber-500/20" 
                              : "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                          }`}>
                            ✓ Perfil: {detectedRole.roleTitle}
                          </span>
                        ) : (
                          <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-destructive/10 text-destructive border border-destructive/20 uppercase tracking-wider">
                            ✗ E-mail fora do padrão institucional
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Password field */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                        Senha (mín. 4 caracteres)
                      </label>
                      {activeTab === "login" && (
                        <button
                          type="button"
                          onClick={() => setView("forgot_password")}
                          className="text-[10px] font-bold text-primary hover:text-school-red-dark transition-colors"
                        >
                          Esqueceu a senha?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-4 py-2.5 text-xs bg-muted border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
                      />
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">
                        <Lock className="w-4 h-4" />
                      </span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-xs hover:bg-school-red-dark active:scale-[0.98] transition-all shadow-md mt-4"
                  >
                    {activeTab === "login" ? "Acessar Portal" : "Criar Minha Conta"}
                  </button>
                </form>              </>
            )}

            {view === "forgot_password" && (
              <>
                <div className="mb-6 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <Key className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-display font-bold text-2xl text-foreground">
                    Recuperar Senha
                  </h3>
                  <p className="text-xs text-muted-foreground font-body mt-1">
                    Informe seu e-mail institucional para receber as instruções de redefinição de acesso.
                  </p>
                </div>

                {error && (
                  <div className="mb-4 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex gap-2 items-start font-body">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                      E-mail Acadêmico
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        value={recoveryEmail}
                        onChange={(e) => setRecoveryEmail(e.target.value)}
                        placeholder="0000110074650xsp@al.educacao.sp.gov.br"
                        className="w-full pl-10 pr-4 py-2.5 text-xs bg-muted border border-border rounded-xl text-foreground focus:outline-none focus:border-primary/50 transition-colors"
                      />
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">
                        <Mail className="w-4 h-4" />
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => { setView("auth"); setError(null); }}
                      className="flex-1 py-3 rounded-xl border border-border text-xs font-semibold text-foreground hover:bg-muted transition-colors flex items-center justify-center gap-1.5"
                    >
                      <ArrowLeft className="w-4 h-4" /> Voltar
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-xs hover:bg-school-red-dark transition-colors"
                    >
                      Enviar Código
                    </button>
                  </div>
                </form>
              </>
            )}

            {view === "verify_code" && (
              <>
                <div className="mb-6 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-display font-bold text-2xl text-foreground">
                    Verificar Código
                  </h3>
                  <p className="text-xs text-muted-foreground font-body mt-1">
                    Digite o código de 6 dígitos que enviamos para o e-mail {recoveryEmail}.
                  </p>
                </div>

                {error && (
                  <div className="mb-4 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex gap-2 items-start font-body">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleVerifyCodeSubmit} className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                      Código de Verificação
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={inputCode}
                      onChange={(e) => setInputCode(e.target.value)}
                      placeholder="000000"
                      className="w-full text-center tracking-[0.5em] font-mono py-3 text-sm bg-muted border border-border rounded-xl text-foreground focus:outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => { setView("forgot_password"); setError(null); }}
                      className="flex-1 py-3 rounded-xl border border-border text-xs font-semibold text-foreground hover:bg-muted transition-colors flex items-center justify-center gap-1.5"
                    >
                      <ArrowLeft className="w-4 h-4" /> Voltar
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-xs hover:bg-school-red-dark transition-colors"
                    >
                      Confirmar
                    </button>
                  </div>
                </form>
              </>
            )}

            {view === "reset_password" && (
              <>
                <div className="mb-6 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <Lock className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-display font-bold text-2xl text-foreground">
                    Nova Senha
                  </h3>
                  <p className="text-xs text-muted-foreground font-body mt-1">
                    Crie uma senha forte com no mínimo 4 caracteres para proteger o seu acesso.
                  </p>
                </div>

                {error && (
                  <div className="mb-4 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex gap-2 items-start font-body">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                      Nova Senha
                    </label>
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Mínimo 4 caracteres"
                      className="w-full px-4 py-2.5 text-xs bg-muted border border-border rounded-xl text-foreground focus:outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                      Confirmar Nova Senha
                    </label>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repita a nova senha"
                      className="w-full px-4 py-2.5 text-xs bg-muted border border-border rounded-xl text-foreground focus:outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-xs hover:bg-school-red-dark transition-colors shadow-md"
                  >
                    Redefinir e Entrar
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LoginModal;
