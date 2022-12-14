import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import minify from 'rollup-plugin-babel-minify';
import json from "@rollup/plugin-json";
import builtins from 'rollup-plugin-node-builtins';
import pkg from './package.json';

export default [{
  input: 'dist/index.js',
  output: {
    name: "Nexio",
    file: pkg.browser,
    format: 'iife',
    sourcemap: true,
  },
  plugins: [
    resolve({ preferBuiltins: true, mainFields: ['browser'] }),
    commonjs(),
    minify({ comments: false }),
    json(),
    builtins(),
    
  ],
}];
