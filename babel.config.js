// babel.config.js
module.exports = {
    presets: [
      ['@babel/preset-env', { targets: { node: 'current' } }], // For Node.js environment
      '@babel/preset-react', // To handle JSX
    ],
  };