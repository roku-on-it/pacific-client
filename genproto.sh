# Path to this plugin
PROTOC_GEN_TS_PATH="C:/Users/trueblue/Projects/angular-electron/node_modules/.bin/protoc-gen-ts.cmd"

# Directory to write generated code to (.js and .d.ts files)
OUT_DIR="./proto/generated"

protoc \
    --plugin="protoc-gen-ts=${PROTOC_GEN_TS_PATH}" \
    --js_out="import_style=commonjs,binary:${OUT_DIR}" \
    --ts_out="service=grpc-node,mode=grpc-js:${OUT_DIR}" \
    ./proto/echo.proto
