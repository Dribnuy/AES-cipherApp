import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History, Lock, Unlock, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Operation {
  id: string;
  type: 'encrypt' | 'decrypt';
  fileName: string;
  timestamp: number;
}

export function OperationHistory() {
  const [operations, setOperations] = useState<Operation[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Load from localStorage
    const stored = localStorage.getItem('aes-operations-history');
    if (stored) {
      try {
        setOperations(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to load history');
      }
    }

    // Listen for new operations
    const handleNewOperation = (e: CustomEvent<Operation>) => {
      const newOp = e.detail;
      setOperations(prev => {
        const updated = [newOp, ...prev].slice(0, 10); // Keep only last 10
        localStorage.setItem('aes-operations-history', JSON.stringify(updated));
        return updated;
      });
    };

    window.addEventListener('new-operation' as any, handleNewOperation);
    return () => window.removeEventListener('new-operation' as any, handleNewOperation);
  }, []);

  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const clearHistory = () => {
    setOperations([]);
    localStorage.removeItem('aes-operations-history');
  };

  if (operations.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-40">
      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-full shadow-lg bg-card/95 backdrop-blur-sm hover:bg-card border-green-500/20 hover:border-green-500/40"
      >
        <History className="h-5 w-5 text-green-400" />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="absolute bottom-16 right-0 w-80 bg-card/95 backdrop-blur-sm border border-border rounded-xl shadow-2xl overflow-hidden"
          >
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History className="h-4 w-4 text-green-400" />
                <h3 className="font-semibold text-sm">Recent Operations</h3>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={clearHistory}
                className="h-8 w-8"
              >
                <Trash2 className="h-4 w-4 text-red-400" />
              </Button>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {operations.map((op, index) => (
                <motion.div
                  key={op.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-3 border-b border-border/50 last:border-0 hover:bg-secondary/30 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${
                      op.type === 'encrypt' 
                        ? 'bg-green-500/10 text-green-400' 
                        : 'bg-blue-500/10 text-blue-400'
                    }`}>
                      {op.type === 'encrypt' ? (
                        <Lock className="h-4 w-4" />
                      ) : (
                        <Unlock className="h-4 w-4" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {op.fileName}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          op.type === 'encrypt'
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-blue-500/20 text-blue-400'
                        }`}>
                          {op.type === 'encrypt' ? 'Encrypted' : 'Decrypted'}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatTime(op.timestamp)}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Helper function to add operation to history
export function addOperationToHistory(type: 'encrypt' | 'decrypt', fileName: string) {
  const operation: Operation = {
    id: Date.now().toString(),
    type,
    fileName,
    timestamp: Date.now()
  };
  
  window.dispatchEvent(new CustomEvent('new-operation', { detail: operation }));
}