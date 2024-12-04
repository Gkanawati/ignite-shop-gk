import { styled } from '..';

export const BagButtonContainer = styled('button', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: 'none',
  borderRadius: 8,
  position: 'relative',
  maxHeight: 48,
  maxWidth: 48,
  padding: '0.75rem',
  cursor: 'pointer',
  transition: 'all 0.2s',

  variants: {
    variant: {
      primary: {
        backgroundColor: '$green500',
        color: '$white',

        '&:not(:disabled):hover': {
          backgroundColor: '$green300',
        },
      },
      secondary: {
        backgroundColor: '$gray800',
        color: '$gray500',

        '&:hover': {
          filter: 'brightness(1.15)',
        },    
      },
    },

    disabled: {
      true: {
        opacity: 0.5,
        cursor: 'not-allowed',
      },
    },
  },
  
  defaultVariants: {
    variant: 'primary',
  },
});