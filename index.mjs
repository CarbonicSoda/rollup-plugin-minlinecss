import { test } from "./dist/index.esm.js";

const ast = test("`a { color: ${x}; }`");

// console.log(ast.body[0])
