import { useState, useEffect } from 'react';

export const screenSize = () => {
  const [width, setWidth] = useState(() => window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    isMobile: width < 640,
    isTablet: width >= 640 && width < 1024,
    isLaptop: width >= 1024 && width < 1280,
    isDesktop: width >= 1280,
  };
};