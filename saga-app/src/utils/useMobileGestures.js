import { useRef, useState, useEffect } from 'react';

/**
 * Hook to handle common mobile gestures like pull-to-refresh
 */
export const useMobileGestures = ({
  onRefresh,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  refreshThreshold = 80,
  swipeThreshold = 50
}) => {
  const [isPulling, setIsPulling] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  
  const containerRef = useRef(null);
  const touchStartY = useRef(0);
  const touchStartX = useRef(0);
  
  // Handle touch events for pull-to-refresh
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    const handleTouchStart = (e) => {
      touchStartY.current = e.touches[0].clientY;
      touchStartX.current = e.touches[0].clientX;
    };
    
    const handleTouchMove = (e) => {
      if (isRefreshing) return;
      
      const touchY = e.touches[0].clientY;
      const touchX = e.touches[0].clientX;
      const scrollTop = container.scrollTop;
      
      // Only enable pull-to-refresh when at the top of the content
      if (scrollTop <= 0) {
        const distance = touchY - touchStartY.current;
        
        if (distance > 0) {
          setIsPulling(true);
          // Apply resistance to the pull (gets harder the further you pull)
          setPullDistance(Math.pow(distance, 0.8));
          
          // Prevent default to stop regular scrolling
          if (distance > 10) {
            e.preventDefault();
          }
        }
      }
      
      // Handle swipe detection
      const deltaX = touchX - touchStartX.current;
      const deltaY = touchY - touchStartY.current;
      
      // Only detect swipes after a minimum movement to avoid accidental triggers
      if (Math.abs(deltaX) > swipeThreshold || Math.abs(deltaY) > swipeThreshold) {
        // Horizontal swipe is dominant
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          if (deltaX > swipeThreshold && onSwipeRight) {
            // Swiped right
            onSwipeRight();
            touchStartX.current = touchX; // Reset to prevent multiple triggers
          } else if (deltaX < -swipeThreshold && onSwipeLeft) {
            // Swiped left
            onSwipeLeft();
            touchStartX.current = touchX; // Reset to prevent multiple triggers
          }
        } 
        // Vertical swipe is dominant
        else {
          if (deltaY > swipeThreshold && onSwipeDown) {
            // Swiped down
            onSwipeDown();
            touchStartY.current = touchY; // Reset to prevent multiple triggers
          } else if (deltaY < -swipeThreshold && onSwipeUp) {
            // Swiped up
            onSwipeUp();
            touchStartY.current = touchY; // Reset to prevent multiple triggers
          }
        }
      }
    };
    
    const handleTouchEnd = () => {
      if (isPulling && !isRefreshing && pullDistance > refreshThreshold && onRefresh) {
        setIsRefreshing(true);
        onRefresh().finally(() => {
          setIsRefreshing(false);
          setPullDistance(0);
          setIsPulling(false);
        });
      } else {
        setPullDistance(0);
        setIsPulling(false);
      }
    };
    
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });
    
    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [
    isRefreshing, 
    isPulling, 
    pullDistance, 
    onRefresh, 
    onSwipeLeft, 
    onSwipeRight, 
    onSwipeUp, 
    onSwipeDown, 
    refreshThreshold, 
    swipeThreshold
  ]);
  
  // Calculate pull indicator styles based on current pull distance
  const getPullIndicatorStyle = () => {
    if (!isPulling && !isRefreshing) return {};
    
    return {
      height: `${Math.min(pullDistance, 100)}px`,
      opacity: Math.min(pullDistance / refreshThreshold, 1),
    };
  };
  
  // Pull indicator component
  const PullIndicator = () => (
    <div 
      className={`pull-indicator ${isPulling || isRefreshing ? 'visible' : ''} ${isRefreshing ? 'refreshing' : ''}`}
      style={getPullIndicatorStyle()}
    >
      {isRefreshing ? 'Refreshing...' : pullDistance > refreshThreshold ? 'Release to refresh' : 'Pull to refresh'}
    </div>
  );
  
  return {
    containerRef,
    isPulling,
    isRefreshing,
    pullDistance,
    PullIndicator
  };
};

export default useMobileGestures;