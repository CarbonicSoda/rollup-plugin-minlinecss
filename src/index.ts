import { parse } from "acorn";
import { simple } from "acorn-walk";
import { generate } from "escodegen";

import { CustomAtRules, Features, transform, TransformOptions } from "lightningcss";

export function test(str: string) {
	const ast = parse(str, { ecmaVersion: "latest" });

	simple(ast, {
		TemplateLiteral(node) {
			let candid = generate(node).slice(1, -1);

			// let subIndex = 0;
			// const subValues: string[] = [];
			// let subMatch!: RegExpExecArray | null;
			// while ((subMatch = /\${.+?}/gs.exec(candidCss))) {
			// 	const subValue = subMatch[0];
			// 	const startPos = subMatch.index;
			// 	const endPos = startPos + subValue.length;

			// 	subValues.push(subValue);

			// 	const replacerVar = `--minlinecss-${subIndex}`;
			// 	candidCss = `${replacerVar}:;${candidCss.slice(
			// 		0,
			// 		startPos,
			// 	)}var(${replacerVar})${candidCss.slice(endPos)}`;

			// 	subIndex++;
			// }

			// const isProps = /(?:^[^{]*?:[^{]*?;)|(?:^\s*?&)/s.test(candidCss);
			// if (isProps) candidCss = `minlinecss{${candidCss}}`;

			// console.log("🚀 ~ test ~ candidCss:", candidCss);
			// let min!: string;

			// const candidBuffer = new TextEncoder().encode(candidCss);
			// try {
			// 	const minBuffer = transform({
			// 		minify: true,
			// 		code: candidBuffer,
			// 		filename: candidCss,
			// 		exclude: Features.Nesting,
			// 	}).code;
			// 	min = new TextDecoder().decode(minBuffer);
			// } catch {}

			// if (isProps) {
			// 	min = min.slice(11, -1);
			// }
			// min = min.replaceAll(/(?<![ };])}/g, ";}");

			// min = min
			// 	.replaceAll(
			// 		/var\(--minlinecss-(\d+?)\)/g,
			// 		(_, subIndex) => subValues[subIndex],
			// 	)
			// 	.replaceAll(/--minlinecss-\d+?:;/g, "");

			// console.log(min);
		},
	});

	return ast;
}
