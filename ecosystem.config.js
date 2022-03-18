module.exports = {
  apps: [
    {
      script: 'dist/main.js',
      interpreter_args: ' -r ./tsconfig-paths-bootstrap.js',
      name: 'backend',
    },
  ],
};
