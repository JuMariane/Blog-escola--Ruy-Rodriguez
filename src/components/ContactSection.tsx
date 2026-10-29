import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

const ContactSection = () => {
  return (
    <section id="contato" className="py-24 bg-school-cream scroll-mt-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold tracking-widest uppercase text-primary mb-2 block">
            Fale Conosco
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Entre em contato
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {[
            {
              icon: MapPin,
              title: "Endereço",
              info: "Rua Paulo Gliwkoff, 104",
              detail: "Conj. Hab. Parque Itajaí, Campinas - SP",
            },
            {
              icon: Clock,
              title: "Horário",
              info: "Fundamental (6º ao 9º): 07h00 às 14h00",
              detail: "Ensino Médio: 14h30 às 21h30",
            },
            {
              icon: Phone,
              title: "Telefone",
              info: "(19) 3261-1256",
              detail: "Secretaria Escolar",
            },
            {
              icon: Mail,
              title: "E-mail",
              info: "e905471a@educacao.sp.gov.br",
              detail: "Atendimento Institucional",
            },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-card rounded-xl p-6 border border-border text-center"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <item.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-display text-base font-semibold text-foreground mb-1">
                {item.title}
              </h3>
              <p className="text-sm text-muted-foreground">{item.info}</p>
              <p className="text-sm font-medium text-foreground/80 mt-1">{item.detail}</p>
            </motion.div>
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 flex justify-center animate-fade-in"
        >
          <a
            href="https://wa.me/551932611256?text=Ol%C3%A1%21+Gostaria+de+informa%C3%A7%C3%B5es+sobre+a+Escola+Estadual+Ruy+Rodriguez."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-sm shadow-md transition-all active:scale-[0.98] hover:scale-[1.02] cursor-pointer"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.5-5.739-1.453L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.963C16.528 2.019 14.07 1.002 11.45 1.002c-5.41 0-9.816 4.364-9.821 9.795-.002 1.702.462 3.361 1.343 4.8l-.996 3.636 3.681-.977zm12.39-5.132c-.317-.159-1.879-.926-2.196-1.042-.317-.116-.549-.174-.78.174-.23.349-.897 1.134-1.1 1.366-.202.232-.405.261-.722.102-.317-.159-1.34-.493-2.553-1.574-.943-.84-1.58-1.88-1.765-2.196-.185-.317-.02-.489.138-.646.142-.142.317-.37.476-.556.16-.185.212-.317.317-.529.106-.212.053-.397-.026-.556-.079-.159-.78-1.88-1.07-2.573-.282-.679-.57-.587-.78-.598-.201-.01-.433-.012-.665-.012-.232 0-.608.087-.926.435-.317.348-1.216 1.189-1.216 2.902 0 1.712 1.246 3.365 1.42 3.596.174.232 2.453 3.746 5.943 5.253.83.358 1.478.572 1.984.733.833.265 1.593.227 2.193.137.669-.1 1.879-.768 2.143-1.478.264-.71.264-1.32.185-1.449-.079-.13-.29-.188-.607-.348z" />
            </svg>
            <span>Conversar no WhatsApp</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;
