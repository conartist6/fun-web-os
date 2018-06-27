const Funnel = require('broccoli-funnel');
const BroccoliSass = require('broccoli-sass-modular');
const MergeTrees = require('broccoli-merge-trees');
const esTranspiler = require('broccoli-babel-transpiler');

const path = require('path');

const esTranspilerConfig = {
  filterExtensions: ['js'],
  resolveModuleSource: function(source) {
    return source.replace('.scss', '.css');
  },
  plugins: [
    'syntax-jsx',
    'check-es2015-constants',
    ['transform-object-rest-spread', { useBuiltIns: true }],
    'transform-class-properties',
    'transform-react-display-name',
    ['transform-react-jsx', { useBuiltIns: true }],
  ],
};

let mjs = 'src';
mjs = esTranspiler(mjs, esTranspilerConfig);
mjs = new Funnel(mjs, {
  destDir: '',
  include: ['**/*.js'],
  getDestinationPath(relativePath) {
    return relativePath.replace(/\.js$/, '.mjs');
  },
});

let es = 'src';
es = new Funnel(es, {
  destDir: '',
  include: ['**/*.js'],
});
es = esTranspiler(es, {
  ...esTranspilerConfig,
  plugins: [...esTranspilerConfig.plugins, ['transform-es2015-modules-commonjs', { loose: true }]],
});

let css = 'src';
css = new Funnel(css, {
  destDir: '',
  include: ['**/*.scss'],
});

css = new BroccoliSass(css);

let assets = 'src'; // Anything which doesn't need to be transpiled

assets = new Funnel(assets, {
  destDir: '',
  include: ['**/images/**'],
});

module.exports = new MergeTrees([mjs, es, css, assets]);
