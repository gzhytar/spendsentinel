'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Eye, PlusCircle, Trash2 } from 'lucide-react';
import { useI18n } from '@/contexts/i18n-context';
import { VisionBoardItem } from '@/types';
import Image from 'next/image';

interface VisionBoardProps {
  items: VisionBoardItem[];
  onAddItem: (item: Omit<VisionBoardItem, 'id'>) => void;
  onRemoveItem: (id: string) => void;
}

export function VisionBoard({ items, onAddItem, onRemoveItem }: VisionBoardProps) {
  const { t } = useI18n();
  const [newItemType, setNewItemType] = useState<'text' | 'image'>('text');
  const [newItemContent, setNewItemContent] = useState('');
  const [newItemDescription, setNewItemDescription] = useState('');

  const handleAddItem = () => {
    if (!newItemContent) return;
    
    // For image type, use a placeholder if content is not a URL
    const content = newItemType === 'image' && !newItemContent.startsWith('https://') 
      ? `https://placehold.co/300x200.png` 
      : newItemContent;
      
    const newItem = {
      type: newItemType,
      content: content,
      description: newItemType === 'image' ? newItemDescription : undefined,
    };
    
    onAddItem(newItem);
    setNewItemContent('');
    setNewItemDescription('');
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-3">
          <Eye className="w-7 h-7 text-accent" />
          <CardTitle className="text-2xl">{t('expenseHighlighter.visionBoard.title')}</CardTitle>
        </div>
        <CardDescription>{t('expenseHighlighter.visionBoard.subtitle')}</CardDescription>
      </CardHeader>
      <CardContent>
        {items.length === 0 && (
          <p className="text-muted-foreground">{t('expenseHighlighter.visionBoard.empty')}</p>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map(item => (
            <Card key={item.id} className="overflow-hidden group relative">
              {item.type === 'image' && (
                <Image 
                  src={item.content} 
                  alt={item.description || t('expenseHighlighter.visionBoard.imageAlt')} 
                  width={300} 
                  height={200} 
                  className="w-full h-48 object-cover" 
                  data-ai-hint="abstract goal"
                />
              )}
              {item.type === 'text' && (
                <div className="h-48 p-4 bg-primary/10 flex items-center justify-center">
                  <p className="text-lg font-semibold text-center text-primary-foreground">{item.content}</p>
                </div>
              )}
              {item.description && item.type === 'image' && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-2 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.description}
                </div>
              )}
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => onRemoveItem(item.id)} 
                className="absolute top-1 right-1 text-muted-foreground hover:text-destructive opacity-50 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </Card>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">
              <PlusCircle className="mr-2 h-4 w-4" /> 
              {t('expenseHighlighter.visionBoard.addItem')}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{t('expenseHighlighter.visionBoard.addItem')}</DialogTitle>
              <DialogDescription>
                {t('expenseHighlighter.visionBoard.addItemDescription')}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="item-type" className="text-right">
                  {t('expenseHighlighter.visionBoard.form.type')}
                </Label>
                <select 
                  id="item-type" 
                  value={newItemType} 
                  onChange={(e) => setNewItemType(e.target.value as 'text'|'image')} 
                  className="col-span-3 border border-input rounded-md px-3 py-2 text-sm"
                >
                  <option value="text">{t('expenseHighlighter.visionBoard.form.types.text')}</option>
                  <option value="image">{t('expenseHighlighter.visionBoard.form.types.image')}</option>
                </select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="item-content" className="text-right">
                  {t('expenseHighlighter.visionBoard.form.content')}
                </Label>
                {newItemType === 'text' ? (
                  <Input 
                    id="item-content" 
                    value={newItemContent} 
                    onChange={(e) => setNewItemContent(e.target.value)} 
                    className="col-span-3" 
                  />
                ) : (
                  <Input 
                    id="item-content" 
                    type="url" 
                    value={newItemContent} 
                    onChange={(e) => setNewItemContent(e.target.value)} 
                    className="col-span-3" 
                    placeholder="https://..." 
                  />
                )}
              </div>
              {newItemType === 'image' && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="item-description" className="text-right">
                    {t('expenseHighlighter.visionBoard.form.description')}
                  </Label>
                  <Input 
                    id="item-description" 
                    value={newItemDescription} 
                    onChange={(e) => setNewItemDescription(e.target.value)} 
                    className="col-span-3" 
                  />
                </div>
              )}
            </div>
            <DialogFooter>
              <Button onClick={handleAddItem}>
                {t('expenseHighlighter.visionBoard.form.save')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
} 