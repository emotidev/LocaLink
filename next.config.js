// @ts-check

const { withAxiom } = require('next-axiom')

/** @type {import('next').NextConfig} */
module.exports = withAxiom({
  experimental: {
    appDir: true
  }
})
