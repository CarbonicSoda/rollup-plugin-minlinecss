import { minifyInlineCss } from "../src/index";

function run(
	src: string,
	min: string | null,
	filename: string = "test.js",
): void {
	expect(minifyInlineCss(src, filename)?.code.trim() ?? null).toBe(min);
}

describe("minify test", () => {
	test("skip files", () => {
		run("", null, "a.txt");

		run("", null, "b.mts");
	});

	test("keep ending semi for props", () => {
		run(
			`
			\`
				color: pink;
			\`
			`,
			"`color:pink;`",
		);
	});

	test("without substitutions", () => {
		run(
			`
			\`
				.test {
					color: pink;
				}

				.test2:hover {
					all: unset;
					all: initial;
				}
			\`
			`,
			"`.test{color:pink}.test2:hover{all:initial}`",
		);

		run(
			`
			\`
				color: pink;
				border: 1em;

				&:hover {
					color: black;
				}
			\`
			`,
			"`color:pink;border:1em;&:hover{color:#000}`",
		);
	});

	test("with substitutions", () => {
		run(
			`
			\`
				content: \${"\`"};
				color: \${"pink"};

				&:\${"hover"} {
					color: black;
				}
			\`
			`,
			'`content:${"`"};color:${"pink"};&:${"hover"}{color:#000}`',
		);
	});

	test("invalid css template", () => {
		run(
			`
			\`aaa\`
			`,
			"`aaa`",
		);

		run(
			`
			\`
				_clr: dsa;
				aaa
			\`
			`,
			`\`
				_clr: dsa;
				aaa
			\``,
		);
	});
});
