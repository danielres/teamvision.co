/* eslint-disable global-require */
module.exports = {
  important: '#root',

  theme: {
    extend: {
      boxShadow: {
        danger: '0 0 0 3px rgba(197,48,48,0.2)',
      },
    },
  },
  variants: {},
  plugins: [require('@tailwindcss/custom-forms')],
};
