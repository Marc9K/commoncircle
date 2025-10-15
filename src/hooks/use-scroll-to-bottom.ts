import { useState, useEffect } from 'react';

export function useScrollToBottom() {
  const [isAtBottom, setIsAtBottom] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Check if we're at the bottom (with a small tolerance)
      const isAtBottom = scrollTop + windowHeight >= documentHeight - 10;
      
      // Only trigger if there's enough content to scroll through
      // This prevents triggering on pages with minimal content
      const hasScrollableContent = documentHeight > windowHeight + 1;
      
      setIsAtBottom(isAtBottom && hasScrollableContent);
    };

    // Add scroll listener
    window.addEventListener('scroll', handleScroll);
    
    // Cleanup
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return isAtBottom;
}
