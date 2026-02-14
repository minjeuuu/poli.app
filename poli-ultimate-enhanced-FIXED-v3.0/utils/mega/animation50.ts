export const animation50 = {
  duration: 5000,
  easing: 'ease-in-out',
  
  fadeIn: () => ({
    from: { opacity: 0 },
    to: { opacity: 1 },
    duration: 5000
  }),
  
  slideIn: (direction: 'left' | 'right' | 'up' | 'down' = 'up') => ({
    from: { transform: 'translate' + (direction === 'up' || direction === 'down' ? 'Y' : 'X') + '(20px)' },
    to: { transform: 'translate' + (direction === 'up' || direction === 'down' ? 'Y' : 'X') + '(0)' },
    duration: 5000
  }),
  
  scale: () => ({
    from: { transform: 'scale(0.95)' },
    to: { transform: 'scale(1)' },
    duration: 5000
  })
};
