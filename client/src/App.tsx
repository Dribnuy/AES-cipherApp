import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { EncryptView } from '@/features/encryption/EncryptView';
import { DecryptView } from '@/features/decryption/DecryptView';
import { AboutView } from '@/features/about/AboutView';
import { MatrixBackground } from '@/components/MatrixBackground';
import { CursorTrail } from '@/components/CursorTrail';
import { ThemeToggle } from '@/components/ThemeToggle';
import { WelcomeScreen } from '@/components/WelcomeScreen';
import { OperationHistory } from '@/components/OperationHistory';
import { Languages } from 'lucide-react';

type View = 'encrypt' | 'decrypt' | 'about';

function App() {
  const [view, setView] = useState<View>('encrypt');
  const [showWelcome, setShowWelcome] = useState(true);
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'uk' ? 'en' : 'uk';
    i18n.changeLanguage(newLang);
  };

  const getTitle = () => {
    if (view === 'encrypt') return t('encryptViewTitle');
    if (view === 'decrypt') return t('decryptViewTitle');
    return t('aboutAuthor');
  };

  const handleStart = () => {
    setShowWelcome(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans relative overflow-hidden">
        <AnimatePresence mode="wait">
          {showWelcome ? (
            <WelcomeScreen onStart={handleStart} />
          ) : (
            <motion.div
              key="main-app"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="min-h-screen flex flex-col items-center justify-center p-4 relative"
            >
              <MatrixBackground />
              <CursorTrail />
              
              <div className="absolute top-4 right-4 flex items-center gap-2 z-20">
                <Button variant="ghost" size="icon" onClick={toggleLanguage}>
                  <Languages className="h-5 w-5" />
                </Button>
              </div>

              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-xl relative z-10"
              >
                <div className="text-center mb-8">
                  <motion.h1 
                    className="text-4xl font-bold tracking-tight bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent"
                    animate={{ 
                      backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                    }}
                    transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
                    style={{ backgroundSize: '200% 200%' }}
                  >
                    {t('appTitle')}
                  </motion.h1>
                  <p className="text-muted-foreground mt-2">
                    {getTitle()}
                  </p>
                </div>

                <motion.div 
                  className="bg-card/95 backdrop-blur-sm border border-border rounded-xl shadow-lg overflow-hidden"
                  whileHover={{ boxShadow: '0 0 30px rgba(0, 255, 0, 0.1)' }}
                >
                  <div className="flex p-1 bg-secondary/50 rounded-t-xl">
                    <TabButton
                      label={t('encryptTab')}
                      isActive={view === 'encrypt'}
                      onClick={() => setView('encrypt')}
                    />
                    <TabButton
                      label={t('decryptTab')}
                      isActive={view === 'decrypt'}
                      onClick={() => setView('decrypt')}
                    />
                    <TabButton
                      label={t('aboutTab')}
                      isActive={view === 'about'}
                      onClick={() => setView('about')}
                    />
                  </div>

                  <div className="p-6">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={view}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        {view === 'encrypt' && <EncryptView />}
                        {view === 'decrypt' && <DecryptView />}
                        {view === 'about' && <AboutView />}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </motion.div>
              </motion.div>

              <div className="absolute inset-0 pointer-events-none z-0">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-green-500/30 rounded-full"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                      y: [0, -30, 0],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 3 + Math.random() * 2,
                      repeat: Infinity,
                      delay: Math.random() * 2,
                    }}
                  />
                ))}
              </div>

              <OperationHistory />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
  );
}

const TabButton = ({ label, isActive, onClick }: { label: string; isActive: boolean; onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`relative w-full p-2 text-sm font-medium transition-colors rounded-lg ${
      isActive ? 'text-primary-foreground' : 'text-muted-foreground hover:bg-secondary'
    }`}
  >
    {isActive && (
      <motion.div
        layoutId="active-tab-indicator"
        className="absolute inset-0 bg-primary rounded-lg z-0"
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      />
    )}
    <span className="relative z-10">{label}</span>
  </button>
);

export default App;