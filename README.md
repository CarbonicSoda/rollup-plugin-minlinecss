A very basic Rollup plugin to minify CSS in string templates, for users of
inline CSS packages e.g. [Goober](https://github.com/cristianbote/goober) and
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

```js
// rollup.config.js
import minlinecss from "rollup-plugin-minlinecss";

export default {
  plugins: [minlinecss()],
};
```

> Available plugin options are given in [plugin options](#options).

The plugin can minify any string templates that contain CSS:

```ts
// works-with.ts

// with selectors
const globalStyles = `
  .example {
      ...
  }
  ...
`;

// without selectors
const Icon = styled("div")`
  color: white;
  ...
`;

// with template substitutions
const Dynamic = styled("div")`
  .${class} {
    color: ${color};
    ...
  }
  ...
`;
const Colored = styled("div")`
  color: ${color};
  ...
`;

// the method styled() came from Goober for demonstration
// but the plugin will work without it too
```

> The plugin keeps all ending semi-colons, even if they are not technically
> needed, for compatability with mainstream packages.

### Options

> With full TypeScript typing and autocompletion support.

| Property       | Description                                                                                                                                                                                                                                                                                                                                   |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| _exclude_      | Files to exclude from minification, for cases that the plugin _somehow_ broke certain code.<br><br>This is usually not required because the plugin will skip template strings that are not CSS. Though a possible case is if you included sensitive symbols in CSS string values, e.g. `content: "{}";` due to the use of RegExp but not AST. |
| _lightningcss_ | [LightningCSS](https://github.com/parcel-bundler/lightningcss) options, for e.g. browser compatibility, do note that CSS nesting is always enabled.                                                                                                                                                                                           |

---

Have fun with this stupid little plugin.
