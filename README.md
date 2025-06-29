# DEPRECATED

This package is deprecated and you shall not try to use it.

I decided that this is simply not worth all the effort and time, and won't bother with reworking on
it anymore.

This is primarily due to the lack of support for minifying bare css blocks among minifiers like
lightningcss or nanocss (csso did support this, but it is dead for years and doesn't support css
nesting). I had to wrap them in dummy selectors, manually replace the templates, and later trim the
wrappers. It is too awkward and sophisticated.

And all this just to save a few bytes? No.

---

A very basic Rollup plugin to minify CSS in string templates, for users of inline CSS packages e.g.
[Goober](https://github.com/cristianbote/goober) and
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

// with top-level selectors
const globalStyles = `
  div:hover {
    color: blue;
  }
  .example {
    color: red;
    & a {
      color: white;
    }
  }
`;

// no top-level selectors (block styles)
const Icon = styled("div")`
  color: white;
  &:hover {
    color: red;
  }
`;

// with template substitutions
const Dynamic = styled("div")`
  .${class} {
    color: ${color};
  }
`;

// the method styled() came from Goober for demonstration
// the plugin will work without it too
```

> The plugin keeps all ending semi-colons, even if they are not technically needed, for
> compatability with mainstream packages.

> The plugin will TRY to minimize as much as it can, but due to the reliance on RegExp but not AST,
> it WILL miss some.

### Options

> With full TypeScript typing and autocompletion support.

| Property       | Description                                                                                                                                                                                                                                                                                                                                                                                           |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| _exclude_      | Files to exclude from minification, for cases that the plugin _somehow_ broke certain code.<br><br>This is usually not required because the plugin will skip template strings that are not CSS. Though a possible case is if you included sensitive symbols in CSS string values, e.g. `content: "}"` will become `content:";}"` (ending semi-colon insertion), due to the use of RegExp but not AST. |
| _lightningcss_ | [LightningCSS](https://github.com/parcel-bundler/lightningcss) options, for browser compatibility etc., do note that the feature flag CSS nesting is always enabled.                                                                                                                                                                                                                                  |

---

Have fun with this stupid little plugin.
