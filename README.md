A very basic Rollup plugin to minify CSS in string templates, for users of
inline CSS packages e.g. [Goober](https://github.com/cristianbote/goober) or
[Styled JSX](https://github.com/vercel/styled-jsx).

### Usage

Install this package in your project:

```bash
# via npm
npm add -D rollup-plugin-minlinecss

# or pnpm
pnpm add -D rollup-plugin-minlinecss

# or yarn
yarn add -D rollup-plugin-minlinecss
```

Add the plugin to your Rollup config:

```mjs
// rollup.config.mjs
import minlinecss from "rollup-plugin-minlinecss";

export default {
	plugins: [minlinecss()]
};
```

To instruct the plugin to minify inline CSS, add `##` next to the enclosing
backticks of the string template:

```ts
// demo.ts

// for single elements
const Icon = styled("div")`##

  color: white;
  ...

##`;

// with selectors
document.head.insertAdjacentHTML(
	"beforeend",
	`<style>${`##

    .global {
        ...
    }
    ...

  ##`}</style>`,
);

// with template substitutions
const Colored = styled("div")`##

  color: ${color};
  ...

##`;

// in fact, it works with ANY templates of CSS
```

> Use with caution: The plugin relies on RegExp but not AST to match template
> strings, so there's no guarantee. However, this is usually safe.

> The plugin uses [Clean CSS](https://github.com/clean-css/clean-css) with level
> 2 minification.

Have fun with this stupid little plugin.
