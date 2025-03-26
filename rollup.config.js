import terser from "@rollup/plugin-terser";
import deleter from "rollup-plugin-delete";
import dts from "rollup-plugin-dts";
import typescript2 from "rollup-plugin-typescript2";

export default [
	{
		input: "src/plugin.ts",
		output: {
			file: "dist/plugin.esm.js",
			format: "esm",
		},
		plugins: [
			deleter({ targets: "dist/" }),
			typescript2({
				useTsconfigDeclarationDir: true,
			}),
			terser(),
		],
	},
	{
		input: "src/plugin.ts",
		output: {
			file: "dist/plugin.js",
			format: "cjs",
		},
		watch: false,
		plugins: [
			typescript2({
				useTsconfigDeclarationDir: true,
			}),
			terser(),
		],
	},
	{
		input: "dist/types/plugin.d.ts",
		output: [{ file: "dist/plugin.d.ts", format: "es" }],
		plugins: [dts()],
	},
];
