import { styled } from '..';
import * as Dialog from '@radix-ui/react-dialog';

export const CartContainer = styled(Dialog.Root, {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'center',
  minHeight: '100vh',
  padding: '2rem 0',
  width: '100%',
  maxWidth: 1180,
  margin: '0 auto',
});