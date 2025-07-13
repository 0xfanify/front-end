'use client';

import React from 'react';

interface FeedbackMessagesProps {
  error: string | null;
  success: string | null;
}

const FeedbackMessages: React.FC<FeedbackMessagesProps> = ({ error, success }) => {
  if (!error && !success) return null;

  return (
    <div className={`p-4 rounded-xl text-center font-medium ${
      error 
        ? 'bg-red-50 border border-red-200 text-red-700' 
        : 'bg-green-50 border border-green-200 text-green-700'
    }`}>
      {error || success}
    </div>
  );
};

export default FeedbackMessages; 