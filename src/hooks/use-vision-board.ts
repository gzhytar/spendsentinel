import { useState, useEffect } from 'react';
import { VisionBoardItem } from '@/types';

export function useVisionBoard() {
  const [visionBoardItems, setVisionBoardItems] = useState<VisionBoardItem[]>([]);
  const [isVisionDialogOpen, setIsVisionDialogOpen] = useState(false);
  const [newVisionItem, setNewVisionItem] = useState({ 
    type: 'text' as 'text' | 'image', 
    content: '', 
    description: '' 
  });

  // Load vision board items from localStorage
  useEffect(() => {
    const storedVisionItems = localStorage.getItem('visionBoardItems');
    if (storedVisionItems) {
      setVisionBoardItems(JSON.parse(storedVisionItems));
    }
  }, []);

  const hasVisionBoardItems = () => visionBoardItems.length > 0;

  const handleAddVisionItem = () => {
    if (!newVisionItem.content) return;
    
    const content = newVisionItem.type === 'image' && !newVisionItem.content.startsWith('https://') 
      ? `https://placehold.co/300x200.png` 
      : newVisionItem.content;
      
    const newItem: VisionBoardItem = {
      id: Date.now().toString(),
      type: newVisionItem.type,
      content: content,
      description: newVisionItem.type === 'image' ? newVisionItem.description : undefined,
    };
    
    const updatedItems = [...visionBoardItems, newItem];
    setVisionBoardItems(updatedItems);
    localStorage.setItem('visionBoardItems', JSON.stringify(updatedItems));
    
    // Reset form and close dialog
    setNewVisionItem({ type: 'text', content: '', description: '' });
    setIsVisionDialogOpen(false);
  };

  const handleCloseVisionDialog = () => {
    setNewVisionItem({ type: 'text', content: '', description: '' });
    setIsVisionDialogOpen(false);
  };

  const openVisionDialog = () => {
    setIsVisionDialogOpen(true);
  };

  return {
    visionBoardItems,
    setVisionBoardItems,
    hasVisionBoardItems,
    isVisionDialogOpen,
    setIsVisionDialogOpen,
    newVisionItem,
    setNewVisionItem,
    handleAddVisionItem,
    handleCloseVisionDialog,
    openVisionDialog,
  };
} 