export const animation41 = {
  duration: 4100,
  easing: 'ease-in-out',
  
  fadeIn: () => ({
    from: { opacity: 0 },
    to: { opacity: 1 },
    duration: 4100
  }),
  
  slideIn: (direction: 'left' | 'right' | 'up' | 'down' = 'up') => ({
    from: { transform: 'translate' + (direction === 'up' || direction === 'down' ? 'Y' : 'X') + '(20px)' },
    to: { transform: 'translate' + (direction === 'up' || direction === 'down' ? 'Y' : 'X') + '(0)' },
    duration: 4100
  }),
  
  scale: () => ({
    from: { transform: 'scale(0.95)' },
    to: { transform: 'scale(1)' },
    duration: 4100
  })
};
