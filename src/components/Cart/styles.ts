
import { styled } from '@/src/styles';
import * as Dialog from '@radix-ui/react-dialog';

export const CartContent = styled(Dialog.Content, {
  position: 'fixed',
  top: 0,
  right: 0,
  bottom: 0,
  width: '30rem',
  background: '$gray800',
  padding: '3rem',
  paddingTop: '4.5rem',
  boxShadow: '-4px 0px 30px rgba(0, 0, 0, 0.8)',
  display: 'flex',
  flexDirection: 'column',

  h2: {
    fontWeight: 700,
    fontSize: '$lg',
    color: '$gray100',
    marginBottom: '2rem',
  },
})

export const CartClose = styled(Dialog.Close, {
  all: 'unset',
  background: 'none',
  color: '$gray300',
  position: 'absolute',
  top: '1.75rem',
  right: '1.75rem',
})

export const CartProductsList = styled('ul', {
  listStyle: 'none',
  width: '100%',
  maxHeight: 'calc(100vh - 23rem)',
  display: 'flex',
  flexDirection: 'column',
  gap: '1.25rem',
  overflow: 'scroll',
})

export const CartProduct = styled('li', {
  width: '100%',
  display: 'flex',
  gap: '1.25rem',
  alignItems: 'center',
  height: '5.8125rem',
})

export const CartProductImage = styled('div', {
  width: '6.3125rem',
  height: '5.8125rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 8,
  background: 'linear-gradient(180deg, #1ea483 0%, #7465d4 100%)',

  img: {
    objectFit: 'cover',
  }
})

export const CartProductDetails = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  height: '100%',

  p: {
    color: '$gray300',
    fontSize: '$md',
  },

  strong: {
    marginTop: 4,
    fontSize: '$md',
    fontWeight: 700,
  },

  button: {
    marginTop: 'auto',
    width: 'max-content',
    border: 'none',
    background: 'none',
    color: '$green500',
    fontSize: '1rem',
    fontWeight: 700,
  },
})

export const CartFinalization = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  marginTop: 'auto',

  button: {
    width: '100%',
    background: '$green500',
    color: '$white',
    fontSize: '$md',
    height: '4.3125rem',
    border: 'none',
    borderRadius: 8,
    fontWeight: 700,

    '&:hover': {
      filter: 'brightness(1.1)',
    },

    '&:disabled': {
      opacity: 0.5,
      cursor: 'not-allowed',
    },

    '&:not(:disabled)': {
      background: '$green500',
    }
  }
})

export const FinalizationDetails = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  marginBottom: 55,

  div: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',

    p: {
      fontSize: '$md',
      color: '$gray300',
    },

    '&:last-child': {
      fontWeight: 'bold',

      span: {
        fontSize: '$md',
      },

      p: {
        color: '$gray100',
        fontSize: '$xl',
      },
    },
  }
})