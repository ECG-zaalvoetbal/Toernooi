import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Timer, Play, Pause, RotateCcw, Volume2 } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const MatchTimer = () => {
  const [minutes, setMinutes] = useState(45);
  const [seconds, setSeconds] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(45 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [initialTime, setInitialTime] = useState(45 * 60);
  
  const intervalRef = useRef(null);
  const audioContextRef = useRef(null);
  const { toast } = useToast();

  // Initialize audio context
  useEffect(() => {
    try {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    } catch (error) {
      console.warn('Web Audio API not supported');
    }
  }, []);

  // Timer logic
  useEffect(() => {
    if (isRunning && totalSeconds > 0) {
      intervalRef.current = setInterval(() => {
        setTotalSeconds(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            playFinishSound();
            toast({
              title: "Time's Up! ⏰",
              description: "The match timer has finished!",
              duration: 5000,
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning, totalSeconds, toast]);

  // Play finish sound using Web Audio API
  const playFinishSound = () => {
    if (!audioContextRef.current) return;

    try {
      const audioContext = audioContextRef.current;
      
      // Create a sequence of beeps
      const frequencies = [800, 1000, 1200];
      let startTime = audioContext.currentTime;

      frequencies.forEach((frequency, index) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(frequency, startTime);
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.05);
        gainNode.gain.linearRampToValueAtTime(0, startTime + 0.25);
        
        oscillator.start(startTime);
        oscillator.stop(startTime + 0.25);
        
        startTime += 0.3;
      });
    } catch (error) {
      console.warn('Could not play finish sound:', error);
    }
  };

  const handleStart = () => {
    if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTotalSeconds(initialTime);
  };

  const handleTimeChange = () => {
    const newTotalSeconds = minutes * 60 + seconds;
    setTotalSeconds(newTotalSeconds);
    setInitialTime(newTotalSeconds);
    setIsRunning(false);
  };

  const formatTime = (totalSecs) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    return initialTime > 0 ? ((initialTime - totalSeconds) / initialTime) * 100 : 0;
  };

  const presetTimes = [
    { label: '2 min', value: 2 * 60 },
    { label: '5 min', value: 5 * 60 },
    { label: '10 min', value: 10 * 60 },
    { label: '15 min', value: 15 * 60 },
    { label: '45 min', value: 45 * 60 },
    { label: '90 min', value: 90 * 60 }
  ];

  const setPresetTime = (presetValue) => {
    setMinutes(Math.floor(presetValue / 60));
    setSeconds(presetValue % 60);
    setTotalSeconds(presetValue);
    setInitialTime(presetValue);
    setIsRunning(false);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Match Timer</h2>
        <p className="text-gray-600">Set a timer for matches with audio notification</p>
      </div>

      <div className="max-w-lg mx-auto">
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <CardTitle className="flex items-center gap-2 justify-center">
              <Timer className="w-6 h-6" />
              Match Timer
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-6 space-y-6">
            {/* Timer Display */}
            <div className="text-center">
              <div className={`text-6xl sm:text-7xl font-bold mb-4 ${
                totalSeconds <= 60 && isRunning ? 'text-red-600 animate-pulse' : 'text-gray-800'
              }`}>
                {formatTime(totalSeconds)}
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                <div 
                  className={`h-3 rounded-full transition-all duration-1000 ${
                    totalSeconds <= 60 ? 'bg-red-500' : 'bg-blue-600'
                  }`}
                  style={{ width: `${getProgressPercentage()}%` }}
                />
              </div>
              
              <div className="text-sm text-gray-600">
                {totalSeconds === 0 ? "Time's up!" : 
                 isRunning ? "Timer running..." : "Timer paused"}
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex justify-center gap-3">
              {!isRunning ? (
                <Button 
                  onClick={handleStart}
                  disabled={totalSeconds === 0}
                  className="bg-green-600 hover:bg-green-700"
                  size="lg"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Start
                </Button>
              ) : (
                <Button 
                  onClick={handlePause}
                  className="bg-yellow-600 hover:bg-yellow-700"
                  size="lg"
                >
                  <Pause className="w-5 h-5 mr-2" />
                  Pause
                </Button>
              )}
              
              <Button 
                onClick={handleReset}
                variant="outline"
                size="lg"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Reset
              </Button>
              
              <Button 
                onClick={playFinishSound}
                variant="outline"
                size="lg"
                title="Test sound"
              >
                <Volume2 className="w-5 h-5" />
              </Button>
            </div>

            {/* Time Input */}
            <div className="space-y-4">
              <Label className="text-sm font-medium text-gray-700">Set Custom Time</Label>
              <div className="grid grid-cols-3 gap-3 items-end">
                <div>
                  <Label htmlFor="minutes" className="text-xs text-gray-600">Minutes</Label>
                  <Input
                    id="minutes"
                    type="number"
                    min="0"
                    max="99"
                    value={minutes}
                    onChange={(e) => setMinutes(parseInt(e.target.value) || 0)}
                    className="text-center"
                  />
                </div>
                <div>
                  <Label htmlFor="seconds" className="text-xs text-gray-600">Seconds</Label>
                  <Input
                    id="seconds"
                    type="number"
                    min="0"
                    max="59"
                    value={seconds}
                    onChange={(e) => setSeconds(parseInt(e.target.value) || 0)}
                    className="text-center"
                  />
                </div>
                <Button 
                  onClick={handleTimeChange}
                  variant="outline"
                  disabled={isRunning}
                >
                  Set
                </Button>
              </div>
            </div>

            {/* Preset Times */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700">Quick Presets</Label>
              <div className="grid grid-cols-3 gap-2">
                {presetTimes.map((preset) => (
                  <Button
                    key={preset.value}
                    onClick={() => setPresetTime(preset.value)}
                    variant="outline"
                    size="sm"
                    disabled={isRunning}
                    className="text-xs"
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800">
              <div className="flex items-start gap-2">
                <Volume2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium mb-1">Audio Alert</p>
                  <p>A sound notification will play when the timer reaches zero. Click the speaker button to test the sound.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MatchTimer;