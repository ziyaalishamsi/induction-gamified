import React, { useState, useEffect } from 'react';

interface TrainingTimerProps {
  startTime: string;
  totalHours?: number;
}

function TrainingTimer({ startTime, totalHours = 4.5 }: TrainingTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (!startTime) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const start = new Date(startTime).getTime();
      const totalMs = totalHours * 60 * 60 * 1000; // 4.5 hours in milliseconds
      const elapsed = now - start;
      const remaining = Math.max(0, totalMs - elapsed);

      setTimeRemaining(remaining);
      
      if (remaining === 0) {
        setIsExpired(true);
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, totalHours]);

  const formatTime = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    if (!startTime) return 0;
    const totalMs = totalHours * 60 * 60 * 1000;
    const elapsed = totalMs - timeRemaining;
    return Math.min(100, (elapsed / totalMs) * 100);
  };

  if (isExpired) {
    return (
      <div className="bg-red-100 border border-red-300 rounded-lg p-4">
        <div className="flex items-center space-x-3">
          <div className="text-red-600 text-xl">⏰</div>
          <div>
            <h3 className="text-red-800 font-semibold">Training Time Expired</h3>
            <p className="text-red-700 text-sm">Please contact HR for extension or rescheduling</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600 text-xl">⏱️</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Training Timer</h3>
            <p className="text-sm text-gray-600">Complete all modules within 4.5 hours</p>
          </div>
        </div>
        <div className="text-right">
          <div className={`text-2xl font-bold ${timeRemaining < 1800000 ? 'text-red-600' : 'text-blue-600'}`}>
            {formatTime(timeRemaining)}
          </div>
          <div className="text-sm text-gray-500">remaining</div>
        </div>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
        <div 
          className={`h-3 rounded-full transition-all duration-500 ${
            timeRemaining < 1800000 ? 'bg-red-500' : 'bg-blue-500'
          }`}
          style={{ width: `${getProgressPercentage()}%` }}
        ></div>
      </div>
      
      <div className="flex justify-between text-sm text-gray-600">
        <span>Started</span>
        <span>{getProgressPercentage().toFixed(1)}% elapsed</span>
        <span>4.5 hours total</span>
      </div>
      
      {timeRemaining < 1800000 && timeRemaining > 0 && (
        <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <span className="text-yellow-600">⚠️</span>
            <span className="text-yellow-800 text-sm font-medium">
              Less than 30 minutes remaining! Focus on completing your current module.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default TrainingTimer;