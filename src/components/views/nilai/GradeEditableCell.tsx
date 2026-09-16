import React, { useState, useRef, useEffect } from 'react';

interface GradeEditableCellProps {
  value?: number;
  onCommit: (val: number) => void;
  className?: string;
  disabled?: boolean;
}

export function GradeEditableCell({
  value,
  onCommit,
  className = '',
  disabled = false,
}: GradeEditableCellProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempVal, setTempVal] = useState<string>(
    value !== undefined && value !== null && value !== 0 ? String(value) : ''
  );
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isEditing) {
      setTempVal(value !== undefined && value !== null && value !== 0 ? String(value) : '');
    }
  }, [value, isEditing]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleCommit = () => {
    setIsEditing(false);
    const parsed = tempVal.trim() === '' ? 0 : Math.min(100, Math.max(0, parseInt(tempVal, 10) || 0));
    if (parsed !== (value || 0)) {
      onCommit(parsed);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommit();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setTempVal(value !== undefined && value !== null && value !== 0 ? String(value) : '');
    }
  };

  if (disabled) {
    return (
      <div className={`w-full h-8 flex items-center justify-center text-xs font-semibold text-slate-400 select-none ${className}`}>
        {value !== undefined && value !== null && value !== 0 ? value : '-'}
      </div>
    );
  }

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        type="number"
        min={0}
        max={100}
        value={tempVal}
        onChange={(e) => setTempVal(e.target.value)}
        onBlur={handleCommit}
        onKeyDown={handleKeyDown}
        className={`w-full h-8 text-center text-xs font-bold bg-amber-50 text-slate-900 outline-none ring-2 ring-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none transition-all ${className}`}
      />
    );
  }

  const hasScore = value !== undefined && value !== null && value !== 0;

  return (
    <button
      type="button"
      onClick={() => setIsEditing(true)}
      className={`w-full h-8 flex items-center justify-center text-xs font-semibold hover:bg-amber-100/70 cursor-pointer select-none transition-colors ${
        hasScore ? 'text-slate-800 font-bold' : 'text-slate-300'
      } ${className}`}
    >
      {hasScore ? value : '-'}
    </button>
  );
}
