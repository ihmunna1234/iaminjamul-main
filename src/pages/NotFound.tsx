import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Home, Search, ArrowLeft, Coffee, Bug, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";

const funnyMessages = [
  "Oops! This page went on vacation... without telling us! 🏖️",
  "404: Page not found. But we found your sense of adventure! 🗺️",
  "This page is playing hide and seek. Spoiler: It's really good at hiding! 🙈",
  "Houston, we have a problem... This page doesn't exist! 🚀",
  "Looks like this page ghosted us... 👻",
  "Error 404: Page not found. Our bad! Want some coffee instead? ☕",
  "This page is on a coffee break and forgot to come back! ☕",
  "Whoops! Our hamster stopped running and the page disappeared! 🐹",
];

const NotFound = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [showEasterEgg, setShowEasterEgg] = useState(false);

  useEffect(() => {
    // Pick a random funny message
    const randomMessage = funnyMessages[Math.floor(Math.random() * funnyMessages.length)];
    setMessage(randomMessage);
  }, []);

  const handleEasterEgg = () => {
    setShowEasterEgg(true);
    setTimeout(() => setShowEasterEgg(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse delay-700" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Animated 404 */}
          <div className="mb-8 relative">
            <h1 
              className="text-[150px] md:text-[200px] font-bold gradient-text leading-none animate-fade-in cursor-pointer select-none"
              onClick={handleEasterEgg}
              style={{
                textShadow: '0 0 80px rgba(var(--primary), 0.3)',
              }}
            >
              404
            </h1>
            {showEasterEgg && (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-fade-in">
                <span className="text-6xl">🎉</span>
              </div>
            )}
          </div>

          {/* Funny Message */}
          <div className="mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <p className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              {message}
            </p>
            <p className="text-lg text-muted-foreground">
              Don't worry, even the best explorers get lost sometimes.
              <br />
              Let's get you back on track! 🧭
            </p>
          </div>

          {/* Animated floating icons */}
          <div className="flex justify-center gap-8 mb-12 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="animate-bounce" style={{ animationDelay: '0s', animationDuration: '2s' }}>
              <Rocket className="w-12 h-12 text-primary/60" />
            </div>
            <div className="animate-bounce" style={{ animationDelay: '0.3s', animationDuration: '2.2s' }}>
              <Coffee className="w-12 h-12 text-primary/60" />
            </div>
            <div className="animate-bounce" style={{ animationDelay: '0.6s', animationDuration: '1.8s' }}>
              <Bug className="w-12 h-12 text-primary/60" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <Button
              size="lg"
              onClick={() => navigate('/')}
              className="gap-2 group"
            >
              <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Take Me Home
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate(-1)}
              className="gap-2 group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Go Back
            </Button>

            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/blogs')}
              className="gap-2 group"
            >
              <Search className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              Read Blogs
            </Button>
          </div>

          {/* Fun fact at the bottom */}
          <div className="mt-16 p-6 bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 animate-fade-in" style={{ animationDelay: '0.8s' }}>
            <p className="text-sm text-muted-foreground italic">
              The first documented 404 error was at CERN in 1992. 
              The internet has been getting lost ever since! 😄
            </p>
          </div>

          
        </div>
      </div>
    </div>
  );
};

export default NotFound;
