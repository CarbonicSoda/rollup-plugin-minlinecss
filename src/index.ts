import {
	CustomAtRules,
	Features,
	transform,
	TransformOptions,
} from "lightningcss";
import { default as MagicString } from "magic-string";
import { Plugin } from "rollup";

//MO TODO docs
/**
 * Plugin to minify inline CSS string templates
 * @returns The plugin instance
 */
export default function minlinecss(
	options: {
		endSemi?: boolean;
		lightningcss?: Omit<
			TransformOptions<CustomAtRules>,
			| "code"
			| "cssModules"
			| "filename"
			| "inputSourceMap"
			| "minify"
			| "projectRoot"
			| "sourceMap"
		>;
	} = {
		endSemi: true,
	},
): Plugin {
	return {
		name: "minlinecss",
		transform(code, id) {
			if (!/.+\.(?:jsx?|tsx?|cjs|mjs)$/.test(id)) return null;

			const src = new MagicString(code);

			for (const match of code.matchAll(/`##.+?##`/gs)) {
				const start = match.index;
				const end = start + match[0].length;

				let css = match[0].slice(3, -3);

				let sub;
				const subs: string[] = [];
				let i = 0;
				while ((sub = /\${.+?}/g.exec(css))) {
					subs.push(sub[0]);
					css =
						`--minlinecss-sub-${i}:;` +
						css.slice(0, sub.index) +
						`var(--minlinecss-sub-${i})` +
						css.slice(sub.index + sub[0].length);
					i++;
				}

				let min = new TextDecoder()
					.decode(
						transform({
							filename: "style.css",
							code: new TextEncoder().encode(`*{${css}}`),
							minify: true,
							exclude: Features.Nesting | (options?.lightningcss?.exclude ?? 0),
							...options?.lightningcss,
						}).code,
					)
					.replaceAll(/(?<={|}|;)& /g, "")
					.slice(2, -1);

				if (options.endSemi && !min.endsWith("}")) min += ";";

				min = min
					.replaceAll(/var\(--minlinecss-sub-(\d+)\)/g, (_, i) => subs[+i])
					.replaceAll(/--minlinecss-sub-\d+:;/g, "");

				src.update(start, end, `\`${min}\``);
			}

			return {
				code: src.toString(),
				map: src.generateMap(),
			};
		},
	};
}
