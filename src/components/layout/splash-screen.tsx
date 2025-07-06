
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';

const bootLogs = [
  "Initializing Zizo_Tuner...",
  "Loading StrategyAI...",
  "Docking Bots...",
  "Calibrating Holo-Metrics...",
  "Establishing Secure Link to Exchange...",
  "System Online. Welcome, Navigator.",
];

export function SplashScreen() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentLog, setCurrentLog] = useState(0);
  const router = useRouter();
  const { user, loading } = useAuth();
  
  useEffect(() => {
    const hasVisited = sessionStorage.getItem('algoXverseVisited');
    if (!hasVisited) {
      setIsVisible(true);
    }
  }, []);

  useEffect(() => {
    if (!isVisible || loading || currentLog >= bootLogs.length) return;
    
    const timeout = setTimeout(() => {
      setCurrentLog(currentLog + 1);
    }, 400 + Math.random() * 300);
    
    return () => clearTimeout(timeout);
  }, [currentLog, isVisible, loading]);

  useEffect(() => {
    // Auto-hide for logged-in users after boot sequence
    if (!loading && user && isVisible) {
        setTimeout(() => {
            sessionStorage.setItem('algoXverseVisited', 'true');
            setIsVisible(false);
        }, 500); // Wait a bit after final log message
    }
  }, [loading, user, isVisible]);

  const handleChoice = (path: string) => {
    sessionStorage.setItem('algoXverseVisited', 'true');
    setIsVisible(false);
    router.push(path);
  };
  
  // Render nothing if not visible
  if (!isVisible && !loading) {
    return null;
  }
  
  // While auth is loading, but we haven't decided to show the splash yet
  if (loading && !isVisible) {
     return null;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5 } }}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-background text-foreground p-4"
        >
          <div className="absolute inset-0 bg-grid-pattern opacity-10 animate-pan"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>

          <div className="z-10 flex flex-col items-center text-center">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.7, type: 'spring', stiffness: 100 }}
            >
              <Logo className="w-24 h-24 text-primary drop-shadow-[0_0_15px_hsl(var(--primary))]" />
            </motion.div>
            <h1 className="font-headline text-5xl font-bold text-primary mt-4">AlgoXverse</h1>
            
            <div className="font-code text-sm text-accent h-32 mt-8 w-full max-w-md text-left overflow-hidden">
                {bootLogs.slice(0, currentLog).map((log, index) => (
                    <motion.p
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                    >
                        &gt; {log}
                    </motion.p>
                ))}
            </div>
            
            <AnimatePresence>
              {(currentLog >= bootLogs.length && !user) && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="flex flex-col sm:flex-row gap-4 mt-8"
                >
                    <Button onClick={() => handleChoice('/auth')} size="lg" className="group transition-all hover:drop-shadow-[0_0_8px_hsl(var(--accent))]">
                        Enter Command Console
                        <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
                    </Button>
                    <Button onClick={() => handleChoice('/')} size="lg" variant="outline">
                        Enter Demo Mode
                    </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
