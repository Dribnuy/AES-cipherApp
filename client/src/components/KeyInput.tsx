
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Copy, Check, RefreshCw } from 'lucide-react';

interface KeyInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  onGenerate?: () => void;
}

export function KeyInput({ label, value, onChange, placeholder, onGenerate }: KeyInputProps) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="space-y-2"
    >
      <label className="text-sm font-medium">{label}</label>
      <div className="flex items-center gap-2">
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="bg-input font-mono text-sm"
        />
        {onGenerate && (
          <Button variant="outline" size="icon" onClick={onGenerate} aria-label={t('generateKey')}>
            <RefreshCw className="w-4 h-4" />
          </Button>
        )}
        <Button variant="outline" size="icon" onClick={handleCopy} aria-label={t('copyKey')}>
          {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
        </Button>
      </div>
      {copied && <p className="text-xs text-green-500 text-right">{t('keyCopied')}</p>}
    </motion.div>
  );
}
