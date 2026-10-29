import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "Como funciona o modelo de Ensino Integral?",
    answer: "A nossa escola opera sob o Programa de Ensino Integral (PEI) do Estado de São Paulo, adotando uma jornada diária de 7 horas que visa a formação acadêmica, social e pessoal dos estudantes. Além das disciplinas da Base Nacional Comum Curricular (como Português, Matemática, Ciências, etc.), a grade do PEI conta com componentes inovadores e diversificados:\n\n• Projeto de Vida: Aulas focadas no planejamento do futuro do aluno, orientando suas escolhas profissionais, acadêmicas e pessoais com o suporte integral de professores tutores.\n• Eletivas: Disciplinas temáticas bimestrais escolhidas pelos alunos a partir de seus interesses de pesquisa e sonhos, integrando diferentes áreas do conhecimento.\n• Clubes Juvenis: Grupos organizados e liderados pelos próprios estudantes para discutir e praticar temas como cultura, esportes, tecnologia e artes, estimulando o protagonismo juvenil.\n• Tutoria: Acompanhamento individualizado no qual cada estudante escolhe um professor para ser seu tutor, orientando-o na sua jornada acadêmica e no desenvolvimento do seu Projeto de Vida.\n• Práticas de Ciências: Aulas laboratoriais investigativas voltadas ao aprendizado prático em nossos laboratórios equipados.",
  },
  {
    question: "Quais refeições são servidas?",
    answer: "Garantimos uma alimentação saudável, balanceada e gratuita para todos os nossos estudantes durante o período letivo, sob a supervisão direta de nutricionistas da rede pública de ensino. O cardápio varia conforme o turno:\n\nTurno Matutino (Anos Finais do Ensino Fundamental - 07h00 às 14h00):\n• Recepção/Café da Manhã (às 07h00): Servido logo no acolhimento, contendo opções nutritivas como leite, café, achocolatado, pão com manteiga/frios, frutas ou cereais.\n• Almoço Completo: Uma refeição quente e nutritiva com arroz, feijão, proteína (carne, frango ou peixe), guarnição e saladas frescas variadas.\n\nTurno Vespertino/Noite (Ensino Médio e Técnico Novotec - 14h30 às 21h30):\n• Lanche Vespertino: Servido no intervalo do período vespertino, incluindo pães, bolos, frutas, sucos e iogurtes.\n• Jantar Completo (período da noite): Refeição quente e completa nos mesmos moldes do almoço para assegurar energia e nutrição até o final das aulas às 21h30.",
  },
  {
    question: "A escola oferece cursos técnicos?",
    answer: "Sim! A Escola Estadual Ruy Rodriguez orgulhosamente oferece cursos técnicos integrados ao Ensino Médio por meio do programa Novotec Integrado, do Governo do Estado de São Paulo em parceria com o Centro Paula Souza. Esse modelo proporciona dupla certificação: ao concluir o Ensino Médio, o estudante recebe o diploma regular e o certificado de Técnico Profissionalizante.\n\nAtualmente, oferecemos três cursos de grande demanda no mercado de trabalho no turno vespertino/noite:\n\n• Técnico em Desenvolvimento de Sistemas: Focado em lógica de programação, banco de dados, desenvolvimento web e de aplicativos móveis. Conta com o suporte de nosso Laboratório de Informática equipado com computadores, notebooks portáteis e tablets.\n• Técnico em Vendas: Voltado a estratégias de comércio digital, técnicas de negociação, atendimento ao cliente, marketing e inteligência de mercado.\n• Técnico em Administração: Prepara o estudante para atuar no controle financeiro, gestão de pessoas, logística, rotinas de escritório e empreendedorismo.\n\nTodas as aulas práticas e teóricas são integradas à grade horária regular das 14h30 às 21h30.",
  },
  {
    question: "Como obter documentos ou consultar o calendário?",
    answer: "A secretaria e a gestão escolar oferecem canais facilitados para o atendimento de pais, alunos e comunidade externa:\n\n• Documentos Escolares (Histórico, Declaração de Matrícula, etc.): Podem ser solicitados presencialmente na secretaria da escola durante o horário de atendimento, pelo telefone (19) 3261-1256 ou pelo e-mail institucional e905471a@educacao.sp.gov.br. Muitos documentos de matrícula e boletins também podem ser emitidos de forma 100% digital através da plataforma Secretaria Escolar Digital (SED).\n• Calendário Escolar e Cardápios: Disponibilizamos na nossa aba de Documentos e Downloads do site o arquivo PDF do Calendário Escolar 2026 completo (com reuniões de pais, recessos, exames e conselhos de classe), além do Cardápio Semanal atualizado e a Lista de Materiais básicos recomendados para cada segmento.",
  },
];

const FAQSection = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section id="duvidas" className="py-24 bg-background scroll-mt-16">
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
            Dúvidas Frequentes
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Perguntas e Respostas
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-body">
            Ficou com alguma dúvida sobre a nossa escola? Encontre respostas rápidas para as principais dúvidas.
          </p>
        </motion.div>

        {/* FAQ Accordion List */}
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, i) => {
            const isOpen = activeIndex === i;
            return (
              <motion.div
                key={faq.question}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/20 transition-colors duration-300"
              >
                <button
                  onClick={() => toggleAccordion(i)}
                  className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="font-display font-semibold text-foreground md:text-lg flex items-center gap-3 pr-4">
                    <HelpCircle className="w-5 h-5 text-primary shrink-0" />
                    {faq.question}
                  </span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-muted-foreground"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-6 pt-2 text-sm md:text-base text-muted-foreground font-body leading-relaxed pl-14 border-t border-border/40 bg-school-cream/30 whitespace-pre-line">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
