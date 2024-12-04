import { globalCss } from '.';

export const globalStyles = globalCss({
  '*': {
    margin: 0,
    padding: 0,
    // prop box-sizing: border-box; 
    // é uma propriedade do CSS que faz com que o padding e a borda de um elemento não sejam contabilizados no cálculo do tamanho do elemento. 
    // isso significa que o tamanho do elemento será o mesmo, independentemente do padding e da borda.
    // o tamanho final será o mesmo definido pelo width e height
    boxSizing: 'border-box',
  },

  body: {
    backgroundColor: '$gray900',
    color: '$gray100',
    '-webkit-font-smoothing': 'antialiased',
  },

  'body, input, textarea, button': {
    fontFamily: 'Roboto, sans-serif',
    fontWeight: 400,
  },

  a: {
    color: 'inherit',
  },

  button: {
    cursor: 'pointer',
  }
})