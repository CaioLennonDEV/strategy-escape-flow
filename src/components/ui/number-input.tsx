import React, { useState, useRef, useEffect } from 'react';
import { Input } from './input';
import { Button } from './button';
import { Check, X, Edit3 } from 'lucide-react';

interface NumberInputProps {
  value: number;
  maxValue: number;
  onSave: (value: number) => void;
  onCancel: () => void;
  disabled?: boolean;
  className?: string;
}

export const NumberInput: React.FC<NumberInputProps> = ({
  value,
  maxValue,
  onSave,
  onCancel,
  disabled = false,
  className = ''
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value.toString());
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleEdit = () => {
    if (disabled) return;
    setIsEditing(true);
    setInputValue(value.toString());
  };

  const handleSave = () => {
    const numValue = parseInt(inputValue, 10);
    if (numValue >= 1 && numValue <= maxValue) {
      onSave(numValue);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setInputValue(value.toString());
    onCancel();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    const numValue = parseInt(newValue, 10);
    
    // Permitir apenas números entre 1 e maxValue
    if (newValue === '' || (numValue >= 1 && numValue <= maxValue)) {
      setInputValue(newValue);
    }
  };

  if (isEditing) {
    return (
      <div className={`flex items-center gap-1 ${className}`}>
        <Input
          ref={inputRef}
          type="number"
          min={1}
          max={maxValue}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="w-12 h-8 text-center text-sm"
        />
        <Button
          size="sm"
          variant="ghost"
          onClick={handleSave}
          className="h-8 w-8 p-0 hover:bg-green-500/20 text-green-400"
        >
          <Check className="h-3 w-3" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={handleCancel}
          className="h-8 w-8 p-0 hover:bg-red-500/20 text-red-400"
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div className="w-12 h-8 flex items-center justify-center text-sm font-medium text-white/90">
        {value}
      </div>
      {!disabled && (
        <Button
          size="sm"
          variant="ghost"
          onClick={handleEdit}
          className="h-8 w-8 p-0 hover:bg-unimed-primary/20 text-white/50 hover:text-unimed-primary"
        >
          <Edit3 className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
}; 