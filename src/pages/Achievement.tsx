
import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SessionGuard } from '@/components/SessionGuard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Download, Share2, ArrowLeft, Trophy } from 'lucide-react';
import { toast } from 'sonner';

const AchievementPage = () => {
  const navigate = useNavigate();
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [nickname, setNickname] = React.useState('');

  React.useEffect(() => {
    // Carregar nickname do localStorage
    const savedNickname = localStorage.getItem('nickname');
    if (savedNickname) {
      setNickname(savedNickname);
    }
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const rotateX = (e.clientY - centerY) / 10;
    const rotateY = (centerX - e.clientX) / 10;
    
    setRotation({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotation({ x: 0, y: 0 });
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-green-900 p-4 flex flex-col items-center justify-center">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-unimed-primary/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-unimed-light/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-unimed-orange/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/pillars')}
              className="text-white hover:text-unimed-primary mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao Centro de Comando
            </Button>
            
            <h1 className="font-poppins font-bold text-4xl md:text-6xl text-white text-glow">
              Conquista Desbloqueada!
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              {nickname}, sua jornada estratégica foi concluída com sucesso!
            </p>
          </div>

          {/* 3D Card */}
          <div className="flex justify-center">
            <div
              ref={cardRef}
              className="relative preserve-3d cursor-pointer"
              style={{
                transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
                transition: isHovered ? 'none' : 'transform 0.3s ease-out',
              }}
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={handleMouseLeave}
            >
              <Card className="w-96 h-64 relative overflow-hidden border-0 shadow-2xl">
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
                <div className="relative z-10 h-full flex flex-col items-center justify-center p-6 text-center">
                  {/* Trophy Icon */}
                  <div className="mb-4">
                    <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                      <Trophy className="w-8 h-8 text-white" />
                    </div>
                  </div>

                  {/* Main Text */}
                  <h2 className="font-poppins font-bold text-2xl text-white mb-2 leading-tight">
                    Missão Concluída!
                  </h2>
                  <p className="text-white/90 text-sm leading-relaxed">
                    Completei a Jornada Estratégica<br />
                    e ganhei esse cartão :D
                  </p>

                  {/* Agent Badge */}
                  <div className="mt-4 px-3 py-1 bg-white/20 rounded-full backdrop-blur-sm">
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
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              onClick={handleSaveImage}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-sm px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105"
              variant="ghost"
            >
              <Download className="w-5 h-5 mr-2" />
              Salvar Imagem
            </Button>
            
            <Button
              onClick={handleShare}
              className="bg-unimed-primary hover:bg-unimed-primary/90 text-white px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
            >
              <Share2 className="w-5 h-5 mr-2" />
              Compartilhar
            </Button>
          </div>

          {/* Additional Info */}
          <div className="text-center">
            <p className="text-white/60 text-sm">
              Parabéns por completar todos os pilares da jornada estratégica!
            </p>
          </div>
        </div>
      </div>
    </SessionGuard>
  );
};

export default AchievementPage;
