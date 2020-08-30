module.exports = {
  purge: ['./src/**/*.tsx'],
  theme: {
    extend: {
      boxShadow: {
        default: '0 1px 3px rgba(0,0,0,.08)',
      },
      cursor: {
        grab: 'grab',
      },
      borderColor: {
        'blue-dark': '#174e8c',
        'blue-base': '#2d64b3',
        'blue-mid': '#2e75d4',
        'blue-light': '#84b9f5',
        'cf-element': '#d3dce0'
      }
    },
  },
  variants: {},
  plugins: [],
}
