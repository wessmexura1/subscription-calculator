import React from 'react';
import { Wallet, Download, Upload, Trash2 } from 'lucide-react';
import { Button } from '../ui';
import styles from './Header.module.css';

interface HeaderProps {
  onExport: () => void;
  onImport: (file: File) => Promise<void>;
  onClear: () => void;
  hasData: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onExport,
  onImport,
  onClear,
  hasData
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        await onImport(file);
      } catch (error) {
        console.error('Import failed:', error);
        alert('Ошибка импорта файла');
      }
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleClear = () => {
    if (window.confirm('Вы уверены, что хотите удалить все данные?')) {
      onClear();
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.brand}>
          <div className={styles.logo}>
            <Wallet size={24} />
          </div>
          <div className={styles.title}>
            <h1>Конструктор подписок</h1>
            <p>Сколько стоит твоя жизнь в месяц</p>
          </div>
        </div>
        
        <div className={styles.actions}>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          
          <Button
            variant="ghost"
            size="sm"
            icon={<Upload size={16} />}
            onClick={handleImportClick}
          >
            Импорт
          </Button>
          
          {hasData && (
            <>
              <Button
                variant="ghost"
                size="sm"
                icon={<Download size={16} />}
                onClick={onExport}
              >
                Экспорт
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                icon={<Trash2 size={16} />}
                onClick={handleClear}
              />
            </>
          )}
        </div>
      </div>
    </header>
  );
};

