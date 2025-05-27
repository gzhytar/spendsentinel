'use client';

import { useState, useRef, useEffect } from 'react';
import { useI18n } from '@/contexts/i18n-context';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Bold, 
  Italic, 
  List, 
  Heading2, 
  Mic, 
  MicOff, 
  Save,
  Smile
} from 'lucide-react';

// Type declarations for Speech Recognition API
declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
  showVoiceInput?: boolean;
  autoSave?: boolean;
}

export function RichTextEditor({
  content,
  onChange,
  placeholder = '',
  className = '',
  showVoiceInput = true,
  autoSave = true,
}: RichTextEditorProps) {
  const { t } = useI18n();
  const [isRecording, setIsRecording] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);

  // Auto-save functionality
  useEffect(() => {
    if (autoSave && content) {
      const timer = setTimeout(() => {
        setLastSaved(new Date());
      }, 2000); // Save 2 seconds after last change

      return () => clearTimeout(timer);
    }
  }, [content, autoSave]);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US'; // Could be made dynamic based on locale

      recognitionRef.current.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        
        if (transcript.trim()) {
          const newContent = content + (content ? ' ' : '') + transcript;
          onChange(newContent);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [content, onChange]);

  const insertFormatting = (prefix: string, suffix: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    
    const newContent = 
      content.substring(0, start) + 
      prefix + selectedText + suffix + 
      content.substring(end);
    
    onChange(newContent);

    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        end + prefix.length
      );
    }, 0);
  };

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert(t('partsJournal.voiceNotSupported'));
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  const insertEmoji = (emoji: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const newContent = 
      content.substring(0, start) + 
      emoji + 
      content.substring(start);
    
    onChange(newContent);

    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + emoji.length, start + emoji.length);
    }, 0);
  };

  const commonEmojis = ['💭', '❤️', '😊', '😔', '😰', '💪', '🙏', '✨', '🌱', '🤗'];

  return (
    <Card className={`p-4 ${className}`}>
      {/* Formatting Toolbar */}
      <div className="flex flex-wrap items-center gap-2 mb-4 pb-4 border-b">
        <Button
          variant="outline"
          size="sm"
          onClick={() => insertFormatting('**', '**')}
          title={t('partsJournal.formatting.bold')}
        >
          <Bold className="h-4 w-4" />
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => insertFormatting('*', '*')}
          title={t('partsJournal.formatting.italic')}
        >
          <Italic className="h-4 w-4" />
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => insertFormatting('## ', '')}
          title={t('partsJournal.formatting.heading')}
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => insertFormatting('- ', '')}
          title={t('partsJournal.formatting.list')}
        >
          <List className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            title={t('partsJournal.formatting.emoji')}
          >
            <Smile className="h-4 w-4" />
          </Button>
          <div className="flex gap-1">
            {commonEmojis.slice(0, 5).map((emoji) => (
              <button
                key={emoji}
                onClick={() => insertEmoji(emoji)}
                className="text-lg hover:bg-muted rounded px-1"
                title={`Insert ${emoji}`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {showVoiceInput && (
          <Button
            variant={isRecording ? "destructive" : "outline"}
            size="sm"
            onClick={toggleVoiceInput}
            title={isRecording ? t('partsJournal.stopRecording') : t('partsJournal.startRecording')}
          >
            {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>
        )}

        {isRecording && (
          <Badge variant="destructive" className="animate-pulse">
            {t('partsJournal.recording')}
          </Badge>
        )}
      </div>

      {/* Text Area */}
      <Textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-h-[200px] resize-none border-0 focus-visible:ring-0 text-base leading-relaxed"
        style={{ fontFamily: 'inherit' }}
      />

      {/* Status Bar */}
      <div className="flex justify-between items-center mt-4 pt-4 border-t text-sm text-muted-foreground">
        <div className="flex items-center gap-4">
          <span>{content.length} {t('partsJournal.characters')}</span>
          {autoSave && lastSaved && (
            <span className="flex items-center gap-1">
              <Save className="h-3 w-3" />
              {t('partsJournal.lastSaved')} {lastSaved.toLocaleTimeString()}
            </span>
          )}
        </div>
        
        {showVoiceInput && !recognitionRef.current && (
          <span className="text-xs">{t('partsJournal.voiceNotAvailable')}</span>
        )}
      </div>
    </Card>
  );
} 