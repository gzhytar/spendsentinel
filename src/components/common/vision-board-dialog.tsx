'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useI18n } from '@/contexts/i18n-context';

interface VisionBoardDialogProps {
  isOpen: boolean;
  onClose: () => void;
  newVisionItem: {
    type: 'text' | 'image';
    content: string;
    description: string;
  };
  setNewVisionItem: (item: { type: 'text' | 'image'; content: string; description: string }) => void;
  onAddItem: () => void;
}

export function VisionBoardDialog({
  isOpen,
  onClose,
  newVisionItem,
  setNewVisionItem,
  onAddItem,
}: VisionBoardDialogProps) {
  const { t } = useI18n();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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
              value={newVisionItem.type} 
              onChange={(e) => setNewVisionItem({ ...newVisionItem, type: e.target.value as 'text'|'image' })} 
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
            {newVisionItem.type === 'text' ? (
              <Input 
                id="item-content" 
                value={newVisionItem.content} 
                onChange={(e) => setNewVisionItem({ ...newVisionItem, content: e.target.value })} 
                className="col-span-3" 
              />
            ) : (
              <Input 
                id="item-content" 
                type="url" 
                value={newVisionItem.content} 
                onChange={(e) => setNewVisionItem({ ...newVisionItem, content: e.target.value })} 
                className="col-span-3" 
                placeholder="https://..." 
              />
            )}
          </div>
          {newVisionItem.type === 'image' && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="item-description" className="text-right">
                {t('expenseHighlighter.visionBoard.form.description')}
              </Label>
              <Input 
                id="item-description" 
                value={newVisionItem.description} 
                onChange={(e) => setNewVisionItem({ ...newVisionItem, description: e.target.value })} 
                className="col-span-3" 
              />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {t('expenseHighlighter.visionBoard.form.cancel')}
          </Button>
          <Button onClick={onAddItem} disabled={!newVisionItem.content}>
            {t('expenseHighlighter.visionBoard.form.save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 