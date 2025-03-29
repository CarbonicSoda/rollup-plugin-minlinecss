import {
	CustomAtRules,
	Features,
	transform,
	TransformOptions,
} from "lightningcss";
import { default as MagicString, SourceMap } from "magic-string";
import { Plugin } from "rollup";

type MinlineCssOptions = {
	exclude?: string[];
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
};

/**
 * Plugin to minify inline CSS string templates
 *
 * @param options.exclude files to exclude from minification,
 * for cases that the plugin somehow broke certain code.
 *
 * @param options.lightningcss [lightningcss](https://github.com/parcel-bundler/lightningcss) options,
 * for e.g. browser compatibility, do note that CSS nesting is always enabled.
 *
 * @returns The plugin instance
 */
export default function minlinecss(options?: MinlineCssOptions): Plugin {
	return {
		name: "minlinecss",
		transform: {
			order: "pre",
			handler(src, file) {
				return minifyInlineCss(src, file, options);
			},
		},
	};
}

//MO DEV export for tests
function minifyInlineCss(
	src: string,
	file: string,
	options?: MinlineCssOptions,
): null | { code: string; map: SourceMap } {
	//MO DOC file exclusion
	if (
		options?.exclude?.includes(file) ||
		!/\.(?:cjs|mjs|jsx?|tsx?)$/.test(file)
	) {
		return null;
	}

	//MO DOC for source maps
	const result = new MagicString(src);

	//MO DOC match candidate string templates
	let offset = 0;
	let templateMatch!: RegExpExecArray | null;
	while ((templateMatch = /`.+?:.+?;.*?`/gs.exec(src))) {
		const template = templateMatch[0];
		const startPos = templateMatch.index;
		const endPos = startPos + template.length;

		//MO DOC might not be valid css template
		let candidCss = template.slice(1, -1);

		let subIndex = 0;
		const subValues: string[] = [];
		let subMatch!: RegExpExecArray | null;
		while ((subMatch = /\${.+?}/gs.exec(candidCss))) {
			const subValue = subMatch[0];
			const startPos = subMatch.index;
			const endPos = startPos + subValue.length;

			subValues.push(subValue);

			//MO DOC replace substitutions to get valid css
			const replacerVar = `--minlinecss-sub-${subIndex}`;
			candidCss = `${replacerVar}:;${candidCss.slice(
				0,
				startPos,
			)}var(${replacerVar})${candidCss.slice(endPos)}`;

			subIndex++;
		}

		//MO DOC if css omits selectors, wrap to get valid css
		const isProps = /(?:^[^{]*?:[^{]*?;)|(?:^\s*?&)/s.test(candidCss);
		if (isProps) candidCss = `*{${candidCss}}`;

		let min!: string;

		//MO DOC minify with lightningcss
		const candidBuffer = new TextEncoder().encode(candidCss);
		try {
			const minBuffer = transform({
				...options?.lightningcss,
				minify: true,
				code: candidBuffer,
				filename: candidCss,
				exclude: Features.Nesting | (options?.lightningcss?.exclude ?? 0),
			}).code;
			min = new TextDecoder().decode(minBuffer);
		} catch {
			//MO DOC ignore invalid css template and retry
			src = src.slice(endPos - 1);
			offset += endPos - 1;
			continue;
		}

		//MO DOC unwrap and add ending semi for isProp styles
		if (isProps) {
			min = min.slice(2, -1);
			if (!min.endsWith("}")) min += ";";
		}
		//MO DOC add ending semi for nested blocks
		min = min.replaceAll(/(?<![ };])}/g, ";}");

		//MO DOC undo substitution replacement
		min = min
			.replaceAll(
				/var\(--minlinecss-sub-(\d+?)\)/g,
				(_, subIndex) => subValues[subIndex],
			)
			.replaceAll(/--minlinecss-sub-\d+?:;/g, "");

		//MO DOC replace template with minified
		result.update(startPos + offset, endPos + offset, `\`${min}\``);

		//MO DOC proceed to next match
		src = src.slice(endPos);
		offset += endPos;
	}

	//MO DOC return minified code and updated source map
	return {
		code: result.toString(),
		map: result.generateMap(),
	};
}
