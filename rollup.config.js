import babel from 'rollup-plugin-babel';

export default {
  entry: 'index.es',
  plugins: [
    babel()
  ],
  targets: [
    {
      format: 'iife',
      moduleName: 'Playah',
      dest: 'dist/playah.js',
    },
    {
      format: 'cjs',
      dest: 'index.js',
    }
  ]
};
