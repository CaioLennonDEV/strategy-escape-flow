
import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SessionGuard } from '@/components/SessionGuard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Download, Share2, ArrowLeft, Trophy, Zap, Star, Award } from 'lucide-react';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';

const AchievementPage = () => {
  const navigate = useNavigate();
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [nickname, setNickname] = React.useState('');
  const isMobile = useIsMobile();

  // Gerar posições fixas para as bolinhas flutuantes
  const floatingElements = React.useMemo(() => {
    const count = isMobile ? 8 : 15;
    return [...Array(count)].map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 8}s`,
      animationDuration: `${isMobile ? 8 + Math.random() * 6 : 6 + Math.random() * 4}s`,
      width: `${isMobile ? 2 + Math.random() * 4 : 4 + Math.random() * 8}px`,
      height: `${isMobile ? 2 + Math.random() * 4 : 4 + Math.random() * 8}px`
    }));
  }, [isMobile]);

  React.useEffect(() => {
    // Carregar nickname do localStorage
    const savedNickname = localStorage.getItem('nickname');
    if (savedNickname) {
      setNickname(savedNickname);
    }
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || isMobile) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const rotateX = (e.clientY - centerY) / 10;
    const rotateY = (centerX - e.clientX) / 10;
    
    setRotation({ x: rotateX, y: rotateY });
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!cardRef.current || !isMobile) return;

    const touch = e.touches[0];
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const rotateX = (touch.clientY - centerY) / 8;
    const rotateY = (centerX - touch.clientX) / 8;
    
    setRotation({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotation({ x: 0, y: 0 });
  };

  const handleTouchEnd = () => {
    if (isMobile) {
      setRotation({ x: 0, y: 0 });
    }
  };

  const handleSaveImage = async () => {
    if (!cardRef.current) return;

    try {
      // Reset rotation for screenshot
      setRotation({ x: 0, y: 0 });
      
      // Wait for rotation reset
      await new Promise(resolve => setTimeout(resolve, 300));

      const html2canvas = await import('html2canvas');
      const canvas = await html2canvas.default(cardRef.current, {
        backgroundColor: null,
        scale: 2,
        logging: false,
      });
      
      const link = document.createElement('a');
      link.download = `jornada-estrategica-${nickname}.png`;
      link.href = canvas.toDataURL();
      link.click();
      
      toast.success('Imagem salva com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar imagem:', error);
      toast.error('Erro ao salvar a imagem');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Jornada Estratégica Concluída!',
          text: `Completei a Jornada Estratégica e ganhei esse cartão :D`,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Erro ao compartilhar:', error);
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(
          `Completei a Jornada Estratégica e ganhei esse cartão :D\n${window.location.href}`
        );
        toast.success('Link copiado para a área de transferência!');
      } catch (error) {
        toast.error('Erro ao copiar link');
      }
    }
  };

  return (
    <SessionGuard>
      <div className="min-h-screen escape-run-body relative overflow-hidden">
        {/* Floating Elements - Reduzido para mobile */}
        <div className="floating-elements">
          {floatingElements.map((element) => (
            <div
              key={element.id}
              className="floating-element"
              style={{
                left: element.left,
                top: element.top,
                animationDelay: element.animationDelay,
                animationDuration: element.animationDuration,
                width: element.width,
                height: element.height
              }}
            />
          ))}
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto space-y-4 sm:space-y-6 md:space-y-8 p-3 sm:p-4 flex flex-col items-center justify-center min-h-screen">
          {/* Header */}
          <div className="text-center space-y-3 sm:space-y-4 md:space-y-6 entrance-animation">
            <Button
              onClick={() => navigate('/pillars')}
              className="escape-run-button mb-3 sm:mb-4 text-sm sm:text-base"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao Centro de Comando
            </Button>
            <p></p>
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-unimed-primary to-unimed-light text-white text-xl sm:text-2xl md:text-3xl mb-3 sm:mb-4 md:mb-6 pulse-glow">
              <Award className="w-6 h-6 sm:w-8 sm:h-8 md:w-12 md:h-12" />
            </div>
            
            <h1 className="font-poppins font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-7xl text-white text-glow px-3 sm:px-4 leading-tight">
              CONQUISTA DESBLOQUEADA!
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 max-w-3xl mx-auto font-medium px-3 sm:px-4 leading-relaxed">
              {nickname}, sua jornada estratégica foi concluída com sucesso!
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-2 sm:gap-3 md:gap-6 text-white/80">
              <div className="flex items-center gap-2">
                <Star className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                <span className="text-xs sm:text-sm md:text-lg">Missão Completa</span>
              </div>
            </div>
          </div>

          {/* 3D Card */}
          <div className="flex justify-center entrance-animation stagger-1">
            <div
              ref={cardRef}
              className="relative preserve-3d cursor-pointer touch-manipulation"
              style={{
                transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
                transition: isHovered ? 'none' : 'transform 0.3s ease-out',
              }}
              onMouseMove={handleMouseMove}
              onMouseEnter={() => !isMobile && setIsHovered(true)}
              onMouseLeave={handleMouseLeave}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <Card className="w-72 h-48 sm:w-80 sm:h-52 md:w-96 md:h-64 relative overflow-hidden border-0 shadow-2xl">
                {/* Card Background with Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-unimed-primary via-unimed-light to-unimed-dark">
                  {/* Geometric Pattern Overlay */}
                  <div 
                    className="absolute inset-0 opacity-20"
                    style={{
                      backgroundImage: `
                        linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.1) 50%, transparent 60%),
                        linear-gradient(-45deg, transparent 40%, rgba(255,255,255,0.1) 50%, transparent 60%)
                      `,
                      backgroundSize: '20px 20px'
                    }}
                  ></div>
                  
                  {/* Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/5 to-white/20"></div>
                </div>

                {/* Card Content */}
                <div className="relative z-10 h-full flex flex-col items-center justify-center p-3 sm:p-4 md:p-6 text-center">
                  {/* Trophy Icon */}
                  <div className="mb-2 sm:mb-3 md:mb-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                      <Trophy className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-white" />
                    </div>
                  </div>

                  {/* Main Text */}
                  <h2 className="font-poppins font-bold text-sm sm:text-lg md:text-2xl text-white mb-1 sm:mb-2 leading-tight">
                    Missão Concluída!
                  </h2>
                  <p className="text-white/90 text-xs sm:text-xs md:text-sm leading-relaxed">
                    Completei a Jornada Estratégica<br />
                    e ganhei esse cartão :D
                  </p>

                  {/* Agent Badge */}
                  <div className="mt-2 sm:mt-3 md:mt-4 px-2 md:px-3 py-1 bg-white/20 rounded-full backdrop-blur-sm">
                    <span className="text-white/90 text-xs font-medium">
                      Agente {nickname}
                    </span>
                  </div>
                </div>

                {/* Holographic Border Effect */}
                <div className="absolute inset-0 rounded-lg border-2 border-white/30 pointer-events-none"></div>
                <div 
                  className="absolute inset-0 rounded-lg pointer-events-none"
                  style={{
                    background: `conic-gradient(from 0deg, transparent, rgba(255,255,255,0.3), transparent)`,
                    mask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
                    maskComposite: 'exclude',
                    WebkitMaskComposite: 'xor',
                    padding: '2px'
                  }}
                ></div>
              </Card>

              {/* 3D Shadow */}
              <div 
                className="absolute inset-0 bg-black/40 blur-xl transform translate-y-8 -z-10 rounded-lg scale-95"
                style={{
                  transform: `translateY(${8 + rotation.x * 0.5}px) translateX(${rotation.y * 0.5}px) scale(0.95)`,
                }}
              ></div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center entrance-animation stagger-2">
            <Button
              onClick={handleSaveImage}
              className="escape-run-button text-sm sm:text-base"
            >
              <Download className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Salvar Imagem
            </Button>
            
            <Button
              onClick={handleShare}
              className="escape-run-button text-sm sm:text-base"
            >
              <Share2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Compartilhar
            </Button>
          </div>

          {/* Additional Info */}
          <div className="text-center entrance-animation stagger-3">
            <p className="text-white/70 text-sm sm:text-base md:text-lg font-medium leading-relaxed">
              Parabéns por completar todos os pilares da jornada estratégica!
            </p>
          </div>
        </div>
      </div>
    </SessionGuard>
  );
};

export default AchievementPage;
