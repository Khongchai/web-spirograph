# Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
source $HOME/.cargo/env

# wasm-pack
curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh

# rust wasm module 1
cd src/utils/PerformanceModules/wasm/calc_lines
wasm-pack build --target web

# rust wasm module 2
cd ../calc_points
wasm-pack build --target web

# build react prod
cd ../../../../../
npm run build_react