import React from 'react';

const DateHandler = ({ createdAt }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
      console.error('Invalid date:', dateString);
      return 'Invalid Date';
    }

    return date.toLocaleString(undefined, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  };

  return (
    <p className="text-gray-600">
      Satisfied on: {formatDate(createdAt)}
    </p>
  );
};

export default DateHandler;