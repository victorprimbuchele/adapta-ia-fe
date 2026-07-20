module.exports = {
  presets: [
    ["@babel/preset-env", { targets: { node: "current" } }],
    ["@babel/preset-react", { runtime: "automatic" }],
    "@babel/preset-typescript",
  ],
  // Traduz `import.meta.env.X` (sintaxe do Vite) para `process.env.X` sob
  // Jest/Babel, que não entende `import.meta` fora de um bundler ESM.
  plugins: ["babel-plugin-transform-vite-meta-env"],
};
