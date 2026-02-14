export const animation34 = {
  duration: 3400,
  easing: 'ease-in-out',
  
  fadeIn: () => ({
    from: { opacity: 0 },
    to: { opacity: 1 },
    duration: 3400
  }),
  
  slideIn: (direction: 'left' | 'right' | 'up' | 'down' = 'up') => ({
    from: { transform: 'translate' + (direction === 'up' || direction === 'down' ? 'Y' : 'X') + '(20px)' },
    to: { transform: 'translate' + (direction === 'up' || direction === 'down' ? 'Y' : 'X') + '(0)' },
    duration: 3400
  }),
  
  scale: () => ({
    from: { transform: 'scale(0.95)' },
    to: { transform: 'scale(1)' },
    duration: 3400
  })
};
