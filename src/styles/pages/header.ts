import { styled } from '..';

export const HeaderContainer = styled('header', {
  padding: '2rem 0',
  width: '100%',
  maxWidth: 1180,
  margin: '0 auto',

  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',

  button: {
    marginLeft: 'auto',
  }
});

export const ButtonCartHeader = styled('button', {
  border: 0,
  backgroundColor: '$gray800',
  cursor: 'pointer',
  transition: 'filter 0.2s',
  padding: '0.75rem',
  borderRadius: 8,
  maxHeight: 48,
  maxWidth: 48,
  position: 'relative',

  '&:hover': {
    filter: 'brightness(1.15)',
  },

  svg: {
    fill: '$gray300',
  }
});

export const CartIndicator = styled('span', {
  position: 'absolute',
  top: -8,
  right: -8,
  color: '$white',
  backgroundColor: '$green300',
  borderRadius: '50%',
  padding: '0.25rem',
  boxShadow: '0 0 0 4px $colors$gray900',

  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',

  minWidth: 24,
  minHeight: 24,
  maxHeight: 24,
})