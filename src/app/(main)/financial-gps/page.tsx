"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Map, Pin, History, Eye, PlusCircle, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TimelineEvent {
  id: string;
  type: 'past' | 'present' | 'future';
  title: string;
  date: string;
  description: string;
}

interface VisionBoardItem {
  id: string;
  type: 'text' | 'image';
  content: string; // URL for image, text for text
  description?: string; // Optional description for image
}


export default function FinancialGPSPage() {
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const [visionBoardItems, setVisionBoardItems] = useState<VisionBoardItem[]>([]);
  
  // Form state for adding new timeline event
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDate, setNewEventDate] = useState('');
  const [newEventDescription, setNewEventDescription] = useState('');
  const [newEventtype, setNewEventType] = useState<'past' | 'present' | 'future'>('past');

  // Form state for adding new vision board item
  const [newVisionItemType, setNewVisionItemType] = useState<'text' | 'image'>('text');
  const [newVisionItemContent, setNewVisionItemContent] = useState('');
  const [newVisionItemDescription, setNewVisionItemDescription] = useState('');


  useEffect(() => {
    const storedEvents = localStorage.getItem('timelineEvents');
    if (storedEvents) {
      setTimelineEvents(JSON.parse(storedEvents));
    }
    const storedVisionItems = localStorage.getItem('visionBoardItems');
    if (storedVisionItems) {
      setVisionBoardItems(JSON.parse(storedVisionItems));
    }
  }, []);

  const saveTimelineEvents = (events: TimelineEvent[]) => {
    setTimelineEvents(events);
    localStorage.setItem('timelineEvents', JSON.stringify(events));
  };

  const saveVisionBoardItems = (items: VisionBoardItem[]) => {
    setVisionBoardItems(items);
    localStorage.setItem('visionBoardItems', JSON.stringify(items));
  };
  
  const handleAddTimelineEvent = () => {
    if (!newEventTitle || !newEventDate) return;
    const newEvent: TimelineEvent = {
      id: Date.now().toString(),
      type: newEventtype,
      title: newEventTitle,
      date: newEventDate,
      description: newEventDescription,
    };
    saveTimelineEvents([...timelineEvents, newEvent]);
    setNewEventTitle('');
    setNewEventDate('');
    setNewEventDescription('');
  };

  const handleRemoveTimelineEvent = (id: string) => {
    saveTimelineEvents(timelineEvents.filter(event => event.id !== id));
  };

  const handleAddVisionBoardItem = () => {
    if (!newVisionItemContent) return;
    // For image type, use a placeholder if content is not a URL
    const content = newVisionItemType === 'image' && !newVisionItemContent.startsWith('https://') 
      ? `https://placehold.co/300x200.png` 
      : newVisionItemContent;
      
    const newItem: VisionBoardItem = {
      id: Date.now().toString(),
      type: newVisionItemType,
      content: content,
      description: newVisionItemType === 'image' ? newVisionItemDescription : undefined,
    };
    saveVisionBoardItems([...visionBoardItems, newItem]);
    setNewVisionItemContent('');
    setNewVisionItemDescription('');
  };

  const handleRemoveVisionBoardItem = (id: string) => {
    saveVisionBoardItems(visionBoardItems.filter(item => item.id !== id));
  };

  const renderTimelineNode = (event: TimelineEvent, index: number, total: number) => (
    <div key={event.id} className="relative pl-8 py-4 group">
      {index < total -1 && <div className="absolute left-[10px] top-5 bottom-0 w-0.5 bg-border group-hover:bg-primary transition-colors"></div>}
      <div className="absolute left-0 top-5 transform -translate-x-1/2 w-5 h-5 rounded-full bg-background border-2 border-primary flex items-center justify-center">
        {event.type === 'past' && <History className="w-3 h-3 text-primary" />}
        {event.type === 'present' && <Pin className="w-3 h-3 text-primary" />}
        {event.type === 'future' && <Eye className="w-3 h-3 text-primary" />}
      </div>
      <Card className="ml-4 shadow-md hover:shadow-lg transition-shadow">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg">{event.title}</CardTitle>
              <CardDescription>{new Date(event.date).toLocaleDateString()} - <span className="capitalize">{event.type}</span></CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={() => handleRemoveTimelineEvent(event.id)} className="text-muted-foreground hover:text-destructive">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{event.description}</p>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="container mx-auto py-8 space-y-12">
      <Card className="shadow-xl">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <Map className="w-10 h-10 text-primary" />
            <div>
              <CardTitle className="text-3xl">Financial GPS</CardTitle>
              <CardDescription className="text-lg">Map your financial journey: Past, Present, and Future.</CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Timeline Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <History className="w-7 h-7 text-accent" />
            <CardTitle className="text-2xl">Your Financial Timeline</CardTitle>
          </div>
          <CardDescription>Key moments that shaped your financial landscape and your current standing.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="max-h-[500px]">
            <ScrollArea className="h-full pr-4">
              {timelineEvents.length === 0 && <p className="text-muted-foreground">No timeline events yet. Add one to get started!</p>}
              <div className="relative">
                {timelineEvents
                  .sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                  .map((event, index) => renderTimelineNode(event, index, timelineEvents.length))}
              </div>
            </ScrollArea>
          </div>
        </CardContent>
        <CardFooter>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline"><PlusCircle className="mr-2 h-4 w-4" /> Add Timeline Event</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Timeline Event</DialogTitle>
                <DialogDescription>
                  Document a significant financial moment or your current status.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="event-title" className="text-right">Title</Label>
                  <Input id="event-title" value={newEventTitle} onChange={(e) => setNewEventTitle(e.target.value)} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="event-date" className="text-right">Date</Label>
                  <Input id="event-date" type="date" value={newEventDate} onChange={(e) => setNewEventDate(e.target.value)} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="event-type" className="text-right">Type</Label>
                  <select id="event-type" value={newEventtype} onChange={(e) => setNewEventType(e.target.value as 'past'|'present'|'future')} className="col-span-3 border border-input rounded-md px-3 py-2 text-sm">
                    <option value="past">Past Influence</option>
                    <option value="present">Present Snapshot</option>
                    <option value="future">Future Goal/Vision</option>
                  </select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="event-description" className="text-right">Description</Label>
                  <Textarea id="event-description" value={newEventDescription} onChange={(e) => setNewEventDescription(e.target.value)} className="col-span-3 min-h-[80px]" />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={() => { handleAddTimelineEvent(); }}>Save Event</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>

      {/* Vision Board Section */}
      <Card>
        <CardHeader>
           <div className="flex items-center space-x-3">
            <Eye className="w-7 h-7 text-accent" />
            <CardTitle className="text-2xl">Financial Vision Board</CardTitle>
          </div>
          <CardDescription>Visualize your financial goals and aspirations.</CardDescription>
        </CardHeader>
        <CardContent>
           {visionBoardItems.length === 0 && <p className="text-muted-foreground">Your vision board is empty. Add items to visualize your goals!</p>}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {visionBoardItems.map(item => (
              <Card key={item.id} className="overflow-hidden group relative">
                {item.type === 'image' && (
                  <Image 
                    src={item.content} 
                    alt={item.description || 'Vision board image'} 
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
                 <Button variant="ghost" size="icon" onClick={() => handleRemoveVisionBoardItem(item.id)} className="absolute top-1 right-1 text-muted-foreground hover:text-destructive opacity-50 group-hover:opacity-100 transition-opacity">
                    <Trash2 className="w-4 h-4" />
                 </Button>
              </Card>
            ))}
          </div>
        </CardContent>
        <CardFooter>
           <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline"><PlusCircle className="mr-2 h-4 w-4" /> Add to Vision Board</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add Vision Board Item</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="vision-type" className="text-right">Type</Label>
                  <select id="vision-type" value={newVisionItemType} onChange={(e) => setNewVisionItemType(e.target.value as 'text'|'image')} className="col-span-3 border border-input rounded-md px-3 py-2 text-sm">
                    <option value="text">Text Affirmation</option>
                    <option value="image">Image (URL or Placeholder)</option>
                  </select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="vision-content" className="text-right">{newVisionItemType === 'text' ? 'Text' : 'Image URL'}</Label>
                  <Input id="vision-content" value={newVisionItemContent} onChange={(e) => setNewVisionItemContent(e.target.value)} placeholder={newVisionItemType === 'image' ? 'https://placehold.co/300x200.png or keyword' : 'My financial goal...'} className="col-span-3" />
                </div>
                {newVisionItemType === 'image' && (
                   <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="vision-description" className="text-right">Description</Label>
                    <Input id="vision-description" value={newVisionItemDescription} onChange={(e) => setNewVisionItemDescription(e.target.value)} placeholder="e.g. Dream vacation, new home" className="col-span-3" />
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button onClick={() => { handleAddVisionBoardItem(); }}>Add Item</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>
       <Card>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <Pin className="w-7 h-7 text-destructive" />
            <CardTitle className="text-2xl">You Are Here</CardTitle>
          </div>
          <CardDescription>Reflect on your current financial position based on your timeline.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Based on the timeline events you've added, particularly your 'Present Snapshot' entries, take a moment to consider where you currently stand in your financial journey. This is your 'You Are Here' point. Understanding this clearly is the first step towards navigating to your desired future.</p>
          {/* Could add a summary of 'present' items here */}
        </CardContent>
      </Card>
    </div>
  );
}
