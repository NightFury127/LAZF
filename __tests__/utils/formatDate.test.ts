import { format } from 'date-fns';

// This is a simple utility function to test
const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'MMMM dd, yyyy');
};

describe('formatDate utility', () => {
  it('formats a Date object correctly', () => {
    const date = new Date(2023, 0, 15); // January 15, 2023
    expect(formatDate(date)).toBe('January 15, 2023');
  });

  it('formats a date string correctly', () => {
    const dateString = '2023-02-20T12:00:00Z';
    expect(formatDate(dateString)).toContain('February 20, 2023');
  });

  it('handles different months correctly', () => {
    const march = new Date(2023, 2, 10); // March 10, 2023
    const october = new Date(2023, 9, 5); // October 5, 2023
    
    expect(formatDate(march)).toBe('March 10, 2023');
    expect(formatDate(october)).toBe('October 05, 2023');
  });
});
