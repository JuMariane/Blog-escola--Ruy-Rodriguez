import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

const VideoCard = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  // Monitora o scroll conforme o elemento se aproxima do centro da tela
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 90%", "start 50%"],
  });

  // Animações acopladas ao scroll
  const scale = useTransform(scrollYProgress, [0, 1], [0.75, 1]);
  const borderRadius = useTransform(scrollYProgress, [0, 1], ["24px", "16px"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [0.7, 1]);

  const handlePlayPause = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const handleMuteToggle = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <div ref={containerRef} className="w-full flex justify-center py-6">
      <motion.div
        style={{
          scale,
          borderRadius,
          opacity,
        }}
        className="relative w-full max-w-4xl aspect-video overflow-hidden shadow-elevated border border-border bg-black flex items-center justify-center"
      >
        {/* Vídeo local institucional */}
        <video
          ref={videoRef}
          src="/video-escola.mp4"
          loop
          muted={isMuted}
          playsInline
          autoPlay
          className="w-full h-full object-cover"
        />

        {/* Overlay do player */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

        {/* Legenda inferior esquerdo */}
        <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 text-white z-10 max-w-md pointer-events-none text-left">
          <h3 className="font-display text-sm md:text-lg font-bold drop-shadow-md">
            Vivencie o Ruy Rodriguez
          </h3>
          <p className="text-[10px] md:text-xs text-white/80 font-body mt-0.5 drop-shadow-sm leading-relaxed">
            Descubra nossa infraestrutura integrada, laboratórios e programas técnicos.
          </p>
        </div>

        {/* Controles do player */}
        <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6 flex items-center gap-2 z-10">
          <button
            onClick={handlePlayPause}
            className="p-2 md:p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all border border-white/20 active:scale-95"
            title={isPlaying ? "Pausar" : "Reproduzir"}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 md:w-4 md:h-4" /> : <Play className="w-3.5 h-3.5 md:w-4 md:h-4" />}
          </button>
          <button
            onClick={handleMuteToggle}
            className="p-2 md:p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all border border-white/20 active:scale-95"
            title={isMuted ? "Ativar Som" : "Mutar Som"}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 md:w-4 md:h-4" /> : <Volume2 className="w-3.5 h-3.5 md:w-4 md:h-4" />}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default VideoCard;
