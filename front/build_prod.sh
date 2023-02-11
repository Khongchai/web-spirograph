curl https://sh.rustup.rs -sSf | sh
curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh

cd src/utils/PerformanceModules/wwasm/calc_lines
wasm-pack build --target web

cd ../calc_points
wasm-pack build --target web

cd ../../../../../
react-scripts build