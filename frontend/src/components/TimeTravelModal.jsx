import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Clock, Calendar } from 'lucide-react';
import { format, parseISO } from 'date-fns';

export const TimeTravelModal = ({ 
  isOpen, 
  onClose, 
  currentStartTime,
  onSave 
}) => {
  const [date, setDate] = useState(
    currentStartTime ? format(parseISO(currentStartTime), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd')
  );
  const [time, setTime] = useState(
    currentStartTime ? format(parseISO(currentStartTime), 'HH:mm') : format(new Date(), 'HH:mm')
  );

  const handleSave = () => {
    const newStartTime = new Date(`${date}T${time}`).toISOString();
    onSave(newStartTime);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass border-white/10 max-w-md" data-testid="time-travel-modal">
        <DialogHeader>
          <DialogTitle className="font-orbitron text-xl text-cyan-400 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Time Travel
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            Forgot to start your transmutation? Set the actual start time here.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Date Input */}
          <div className="space-y-2">
            <Label className="text-zinc-300 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-cyan-400" />
              Start Date
            </Label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-black/50 border-zinc-800 text-zinc-100 font-mono focus:border-cyan-400 focus:ring-cyan-400/20"
              data-testid="time-travel-date"
            />
          </div>

          {/* Time Input */}
          <div className="space-y-2">
            <Label className="text-zinc-300 flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              Start Time
            </Label>
            <Input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="bg-black/50 border-zinc-800 text-zinc-100 font-mono focus:border-cyan-400 focus:ring-cyan-400/20"
              data-testid="time-travel-time"
            />
          </div>

          {/* Preview */}
          <div className="p-4 rounded-lg bg-zinc-900/50 border border-zinc-800">
            <div className="text-xs text-zinc-500 mb-1">New Start Time</div>
            <div className="font-mono text-cyan-400 text-lg">
              {format(new Date(`${date}T${time}`), 'MMM dd, yyyy HH:mm')}
            </div>
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
            data-testid="time-travel-cancel"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            className="btn-pathfinder"
            data-testid="time-travel-save"
          >
            Update Start Time
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TimeTravelModal;
