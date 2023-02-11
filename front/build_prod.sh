curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh

cd src/utils/PerformanceModules/wasm/calc_lines
wasm-pack build --target web

cd ../calc_points
wasm-pack build --target web

cd ../../../../../
npm run build_react