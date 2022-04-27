// svelte-app/src/main.js
import App from './App.svelte';
// Load the .toml file of your Rust project.
// The wasm-plugin runs `wasm-pack build` and cpoies the output into
// `svelte-app/target` directory.
// The `.wasm` file is located in the `svelte-app/public/build` dir.
import wasm from '../../wasm-game-of-life/Cargo.toml';

// WebAssembly files must be loaded async.
const init = async () => {
    const gameOfLife = await wasm();

    const app = new App({
        target: document.body,
        props: {
          // https://svelte.dev/docs#Creating_a_component
          greet: gameOfLife.greet()
        }
    });
};

init();