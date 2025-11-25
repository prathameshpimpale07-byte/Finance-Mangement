import { useEffect, useState } from 'react';

const useDarkMode = () => {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('tripsplit-theme') === 'dark';
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('tripsplit-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('tripsplit-theme', 'light');
    }
  }, [isDark]);

  return [isDark, setIsDark];
};

export default useDarkMode;

