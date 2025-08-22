import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Home, Zap } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
          <div className="min-h-screen escape-run-body relative overflow-hidden">
        {/* Floating Elements */}
        <div className="floating-elements">
          {[...Array(18)].map((_, i) => (
            <div
              key={i}
              className="floating-element"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 8}s`,
                animationDuration: `${6 + Math.random() * 4}s`,
                width: `${4 + Math.random() * 8}px`,
                height: `${4 + Math.random() * 8}px`
              }}
            />
          ))}
        </div>

      <div className="flex items-center justify-center min-h-screen relative z-10">
        <div className="text-center space-y-8 entrance-animation">
          <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-unimed-primary to-unimed-light text-white text-4xl mb-6 pulse-glow">
            <AlertTriangle className="w-16 h-16" />
          </div>
          
          <div className="space-y-4">
            <h1 className="font-poppins font-bold text-6xl md:text-8xl text-white text-glow">
              404
            </h1>
            <h2 className="font-poppins font-bold text-3xl md:text-4xl text-white/90">
              MISSÃO NÃO ENCONTRADA
            </h2>
            <p className="text-xl text-white/80 max-w-md mx-auto">
              Ops! Esta rota não existe no sistema de navegação.
            </p>
          </div>

          <div className="space-y-4">
            <Button asChild className="escape-run-button">
              <a href="/">
                <Home className="w-5 h-5 mr-2" />
                Voltar ao Centro de Comando
              </a>
            </Button>
            
            <div className="text-sm text-white/60">
              Rota tentada: <code className="bg-white/10 px-2 py-1 rounded">{location.pathname}</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
