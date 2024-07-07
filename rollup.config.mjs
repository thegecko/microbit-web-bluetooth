import { createRequire } from 'node:module';
import del from "rollup-plugin-delete";
import eslint from '@rollup/plugin-eslint';
import nodePolyfills from 'rollup-plugin-polyfill-node';
import typescript from "rollup-plugin-typescript2";
import terser from '@rollup/plugin-terser';
import sourceMaps from "rollup-plugin-sourcemaps"

const name = "microbit";
const require = createRequire(import.meta.url);
const pkg = require('./package.json');

export default {
    input: "src/index.ts",
    output: [
        {
            file: pkg.main,
            format: "umd",
            sourcemap: true,
            name
        },
        {
            file: pkg.module,
            format: "esm",
            sourcemap: true
        }
    ],
    plugins: [
        del({
            targets: [
                "dist/*",
                "types/*"
            ]
        }),
        eslint({
            throwOnError: true
        }),
        nodePolyfills(),
        typescript({
            useTsconfigDeclarationDir: true
        }),
        terser(),
        sourceMaps()
    ]
};
