curl https://sh.rustup.rs -sSf | sh -y
curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh

cd src/utils/PerformanceModules/wasm/calc_lines
wasm-pack build --target web

cd ../calc_points
wasm-pack build --target web

cd ../../../../../
react-scripts build