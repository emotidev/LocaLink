/** @type {import('tailwindcss').Config} */
module.exports = {
  ...require('kresco/styles/tailwindConfig'),
  content: [
    '{app,pages,components}/**/*.{ts,tsx}',
    'node_modules/kresco/**/*.{js,jsx}'
  ]
}
