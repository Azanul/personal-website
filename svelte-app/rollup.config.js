import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import css from 'rollup-plugin-css-only';
import rust from "@wasm-tool/rollup-plugin-rust";
import {config} from 'dotenv';
import replace from '@rollup/plugin-replace';
import json from "@rollup/plugin-json";

const production = !process.env.ROLLUP_WATCH;

function serve() {
	let server;

	function toExit() {
		if (server) server.kill(0);
	}

	return {
		writeBundle() {
			if (server) return;
			server = require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
				stdio: ['ignore', 'inherit', 'inherit'],
				shell: true
			});

			process.on('SIGTERM', toExit);
			process.on('exit', toExit);
		}
	};
}

export default {
	input: 'src/main.js',
	output: {
		sourcemap: true,
		// format: 'iife',
		name: 'app',
		// file: 'public/build/bundle.js',
		format: "esm",
  		dir: "public/build"
	},
	plugins: [
		replace({
			// stringify the object       
			__myapp: JSON.stringify({
			  env: {
				isProd: production,
				...config().parsed // attached the .env config
			  }
			}),
		}),

		svelte({
			compilerOptions: {
				// enable run-time checks when not in production
				dev: !production
			}
		}),
		// we'll extract any component CSS out into
		// a separate file - better for performance
		css({ output: 'bundle.css' }),

		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration -
		// consult the documentation for details:
		// https://github.com/rollup/plugins/tree/master/packages/commonjs
		resolve({
			browser: true,
			dedupe: ['svelte']
		}),
		commonjs(),
		json(),

		// Add the configuration for your wasm-tool plugins
		// The generated .wasm file is placed in the /build/ folder.
		// To tell the server where to fetch the .wasm file you have to specify
		// the path otherwise you get a 404 error (.wasm file not found).
		rust({
			verbose: true,
			serverPath: "/build/"
		}),

		// In dev mode, call `npm run start` once
		// the bundle has been generated
		!production && serve(),

		// Watch the `public` directory and refresh the
		// browser on changes when not in production
		!production && livereload('public'),

		// If we're building for production (npm run build
		// instead of npm run dev), minify
		production && terser()
	],
	watch: {
		clearScreen: false
	}
};
