A very basic Rollup plugin to minify CSS in string templates, for users of
inline CSS packages e.g. [Goober](https://github.com/cristianbote/goober) or
[Styled JSX](https://github.com/vercel/styled-jsx).

### Usage

Install this package in your project:

```bash
# via npm
npm add rollup-plugin-minlinecss

# or pnpm
pnpm add rollup-plugin-minlinecss

# or yarn
yarn add rollup-plugin-minlinecss
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

> Use with caution: This plugin relies on RegExp but not AST to match template
> strings, so there's no guarantee. However, this is usually safe.

> This plugin uses [Clean CSS](https://github.com/clean-css/clean-css) with
> level 2 minification.

Have fun with this stupid little plugin.
