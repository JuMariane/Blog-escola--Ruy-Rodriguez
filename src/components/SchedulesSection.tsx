import { motion } from "framer-motion";
import { Sun, Moon, Coffee, Utensils, Clock, Award, BookOpen, GraduationCap } from "lucide-react";

const SchedulesSection = () => {
  return (
    <section id="horarios" className="py-24 bg-school-cream border-y border-border scroll-mt-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold tracking-widest uppercase text-primary mb-2 block">
            Rotina Escolar
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Turnos e Horários (PEI)
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-body">
            Conheça o funcionamento do Programa de Ensino Integral (PEI) e a distribuição dos horários dos nossos estudantes.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 items-stretch">
          {/* Fundamental - Manhã */}
          <motion.div
            id="horarios-fundamental"
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="scroll-mt-20 bg-card rounded-2xl p-8 border border-border shadow-soft flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 font-semibold text-sm">
                  <Sun className="w-4 h-4" /> Turno Matutino
                </div>
                <div className="flex items-center gap-1 text-sm font-bold text-foreground/80">
                  <Clock className="w-4 h-4 text-amber-500" /> 07h00 - 14h00
                </div>
              </div>

              <h3 className="font-display text-2xl font-bold text-foreground mb-3">
                Anos Finais (6º ao 9º ano)
              </h3>
              <p className="text-muted-foreground text-sm font-body leading-relaxed mb-6">
                Uma jornada focada no desenvolvimento integral de crianças e adolescentes na fase de transição escolar, promovendo a autonomia e o acolhimento.
              </p>

              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Coffee className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">Acolhimento e Café da Manhã</h4>
                    <p className="text-xs text-muted-foreground">Início às 07h00 com recepção calorosa dos professores tutores e café da manhã balanceado.</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <BookOpen className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">Rotina de Estudos e Tutoria</h4>
                    <p className="text-xs text-muted-foreground">Aulas dinâmicas da Base Comum combinadas com orientação de estudos e laboratórios práticos.</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Utensils className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">Almoço Saudável</h4>
                    <p className="text-xs text-muted-foreground">Refeição completa servida no refeitório da escola, acompanhada por nutricionistas da rede pública.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-border/60 text-xs text-muted-foreground font-body">
              * A presença diária e a pontualidade são essenciais para o acompanhamento do plano pedagógico integral.
            </div>
          </motion.div>

          {/* Médio - Tarde/Noite */}
          <motion.div
            id="horarios-medio"
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="scroll-mt-20 bg-card rounded-2xl p-8 border border-border shadow-soft flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary font-semibold text-sm">
                  <Moon className="w-4 h-4" /> Turno Vespertino / Noite
                </div>
                <div className="flex items-center gap-1 text-sm font-bold text-foreground/80">
                  <Clock className="w-4 h-4 text-primary" /> 14h30 - 21h30
                </div>
              </div>

              <h3 className="font-display text-2xl font-bold text-foreground mb-3">
                Ensino Médio e Novotec
              </h3>
              <p className="text-muted-foreground text-sm font-body leading-relaxed mb-6">
                Preparação estratégica para o ENEM, vestibulares e formação técnica integrada (Novotec) focada no ingresso imediato ao mercado de trabalho.
              </p>

              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Award className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">Projeto de Vida</h4>
                    <p className="text-xs text-muted-foreground">Disciplinas dedicadas ao planejamento da carreira profissional, ética, vestibular e sonhos de vida do aluno.</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <GraduationCap className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">Novotec (Ensino Técnico Integrado)</h4>
                    <p className="text-xs text-muted-foreground">Cursos em Desenvolvimento de Sistemas, Administração e Vendas integrados à grade escolar.</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Utensils className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">Lanche da Tarde e Jantar</h4>
                    <p className="text-xs text-muted-foreground">Lanche reforçado à tarde e jantar completo e nutritivo oferecidos gratuitamente no período da noite.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-border/60 text-xs text-muted-foreground font-body">
              * O Novotec oferece dupla certificação (Ensino Médio comum + Certificado Técnico Profissionalizante).
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SchedulesSection;
