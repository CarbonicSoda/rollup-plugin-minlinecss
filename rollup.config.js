import resolvePlugin from "@rollup/plugin-node-resolve";
import terserPlugin from "@rollup/plugin-terser";
import deletePlugin from "rollup-plugin-delete";
import dtsPlugin from "rollup-plugin-dts";
import ts2Plugin from "rollup-plugin-typescript2";

export default [
	{
		input: "src/index.ts",
		output: {
			file: "dist/index.esm.js",
			format: "esm",
		},
		external: [/^acorn/, /^escodegen/, "lightningcss"],

		plugins: [
			deletePlugin({ targets: "dist/" }),

			ts2Plugin({
				useTsconfigDeclarationDir: true,
			}),
			resolvePlugin(),

			// terserPlugin(),
		],
	},
	{
		input: "src/index.ts",
		output: {
			file: "dist/index.js",
			format: "cjs",
		},
		external: [/^acorn/],

		plugins: [
			ts2Plugin({
				useTsconfigDeclarationDir: true,
			}),
			resolvePlugin(),

			terserPlugin(),
		],
		watch: false,
	},

	{
		input: "dist/types/index.d.ts",
		output: [{ file: "dist/index.d.ts", format: "es" }],
		external: [/^acorn/],

		plugins: [dtsPlugin()],
		watch: true,
	},
];
