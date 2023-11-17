/** @type {import('tailwindcss').Config} */

// @see: https://tailwindcss.com/docs/configuration/
// @see: https://github.com/tailwindcss/tailwindcss/blob/master/stubs/defaultConfig.stub.js

// eslint-disable-next-line @typescript-eslint/no-var-requires
const defaultTheme = require('tailwindcss/defaultTheme');

export default {
  content: ['./src/**/*.{js,ts,vue}'],
  media: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Roboto',
          ...defaultTheme.fontFamily.sans,
        ],
      },
      // Tailwinds typography customization
      // @see: https://github.com/tailwindlabs/tailwindcss-typography#customization
      typography: (theme) => ({
        DEFAULT: {
          css: {
            // color: '#0FF',
            a: {
              color: theme('colors.black'),
              '&:hover': {
                color: theme('colors.red.500'),
              },
            },
          },
        },
      }),
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    // eslint-disable-next-line global-require
    require('@tailwindcss/typography'),
  ],
}




