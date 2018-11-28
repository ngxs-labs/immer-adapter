const { join } = require('path');

const resolve = require('rollup-plugin-node-resolve');
const sourcemaps = require('rollup-plugin-sourcemaps');

const { name } = require('./package.json');

const globals = {
    '@angular/core': 'ng.core',
    'rxjs': 'rxjs',
    'rxjs/operators': 'rxjs.operators',
    '@ngxs/store': 'ngxs.store'
};

const input = join(__dirname, `dist/${name}/fesm5/ngxs-labs-${name}.js`);
const output = {
    file: join(__dirname, `dist/${name}/bundles/ngxs-labs-${name}.umd.js`),
    name: `ngxs-labs.${name}`,
    globals,
    format: 'umd',
    exports: 'named'
};

module.exports = {
    input,
    output,
    plugins: [
        resolve(),
        sourcemaps()
    ],
    external: Object.keys(globals)
};
