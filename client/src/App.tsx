
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { EncryptView } from '@/features/encryption/EncryptView';
import { DecryptView } from '@/features/decryption/DecryptView';
import { Github, Languages } from 'lucide-react';

type View = 'encrypt' | 'decrypt';

function App() {
  const [view, setView] = useState<View>('encrypt');
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'uk' ? 'en' : 'uk';
    i18n.changeLanguage(newLang);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4 font-sans">
      <div className="absolute top-4 right-4 flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={toggleLanguage}>
          <Languages className="h-5 w-5" />
        </Button>
      </div>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-xl"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight">AES FileCrypt</h1>
          <p className="text-muted-foreground mt-2">
            {view === 'encrypt' ? 'Securely encrypt your files' : 'Securely decrypt your files'}
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl shadow-lg overflow-hidden">
          <div className="flex p-1 bg-secondary/50 rounded-t-xl">
            <TabButton
              label="Encrypt"
              isActive={view === 'encrypt'}
              onClick={() => setView('encrypt')}
            />
            <TabButton
              label="Decrypt"
              isActive={view === 'decrypt'}
              onClick={() => setView('decrypt')}
            />
          </div>

          <div className="p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={view}
                initial={{ opacity: 0, x: view === 'encrypt' ? -50 : 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: view === 'encrypt' ? 50 : -50 }}
                transition={{ duration: 0.3 }}
              >
                {view === 'encrypt' ? <EncryptView /> : <DecryptView />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

const TabButton = ({ label, isActive, onClick }) => (
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
