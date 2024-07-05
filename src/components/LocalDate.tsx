import React, { useState, useEffect } from 'react';

const LocalDate = ({ utcDate }) => {
  const [localDate, setLocalDate] = useState(null);

  useEffect(() => {
    const date = new Date(utcDate);
    setLocalDate(date.toLocaleString("en-US", { month: 'long', day: 'numeric', hourCycle: "h24", hour:"numeric", minute:"numeric" }));
  }, [utcDate]);

  return (
    <span>
      {localDate ? localDate : 'Loading...'}
    </span>
  );
};

export default LocalDate;
