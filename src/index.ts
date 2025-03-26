import { Plugin } from "rollup";

import CleanCSS from "clean-css";
import MagicString from "magic-string";

//MO TODO add jsdocs
export default function mcss(): Plugin {
	return {
		name: "mcss",
		transform(code, id) {
			if (!/.+\.(?:jsx?|tsx?|cjs|mjs)$/.test(id)) return null;

			const src = new MagicString(code);

			for (const match of code.matchAll(/`##.+?##`/gs)) {
				const start = match.index;
				const end = start + match[0].length;

				const css = match[0].slice(3, -3);
				const min = new CleanCSS({
					level: {
						2: {
							all: true,
						},
					},
				})
					.minify(`-{${css.replaceAll(/\${.+?}/g, '"$&"')}}`)
					.styles.slice(2, -1)
					.replaceAll(/"\${.+?}"/g, (m) => m.slice(1, -1));

				src.update(start, end, `\`${min}\``);
			}

			return {
				code: src.toString(),
				map: src.generateMap(),
			};
		},
	};
}
