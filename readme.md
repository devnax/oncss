<p align="center">
  <img width="120" src="https://raw.githubusercontent.com/devnax/oncss/main/logo.png" alt="ONCSS logo">
</p>

<h1 align="center">ONCSS</h1>

<p align="center">
  <a href="https://oncss.devnax.com"><strong>Website &amp; Documentation</strong></a>
</p>

`oncss` is a small CSS-in-JS library that generates scoped CSS from JavaScript or
TypeScript style objects. It supports nested selectors, custom breakpoints, media
and container queries, keyframes, global rules, aliases, and custom
property/value transforms.

For live examples, interactive playgrounds, and the full guide, visit
[oncss.devnax.com](https://oncss.devnax.com).

## Installation

```bash
npm install oncss
```

```ts
import { css } from 'oncss';
```

## Quick start

```ts
import { css } from 'oncss';

const button = css({
  display: 'inline-flex',
  alignItems: 'center',
  padding: '10px 18px',
  color: 'white',
  backgroundColor: '#2563eb',
  border: 0,
  borderRadius: 8,

  '&:hover': {
    backgroundColor: '#1d4ed8',
  },
});

const element = document.querySelector('button');
element?.classList.add(button.classname);
```

`css()` returns a style factory. By default it generates a class name and injects
the resulting stylesheet into `document.head`.

```ts
button.classname; // generated name, for example "x..."
button.css;       // generated CSS string
button.cssraw;    // original style object
```

> Use `factory.classname` (or `classList.add(factory.classname)`) rather than
> treating the factory as a string.

## How style objects work

Properties use JavaScript CSS names such as `backgroundColor`, `fontSize`, and
`zIndex`. ONCSS converts camel-case names to CSS kebab-case names.

```ts
const card = css({
  maxWidth: 480,
  backgroundColor: '#fff',
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.12)',
});
```

Numeric values become pixels by default:

```ts
css({
  width: 320,      // width:320px
  marginTop: 16,   // margin-top:16px
  fontWeight: 700, // font-weight:700
  opacity: 0.8,    // opacity:0.8
  zIndex: 10,      // z-index:10
});
```

Unitless handling also includes `line-height`, `flex`, `flex-grow`,
`flex-shrink`, `flex-basis`, `order`, `columns`, `perspective`, and
`stroke-dashoffset`. When a unit is not appropriate, provide an explicit string,
such as `'50%'`, `'1.5rem'`, or `'auto'`.

## Selectors

Every nested selector starts with `&`. ONCSS replaces every `&` with the
generated class name before compiling the stylesheet.

### Pseudo-classes and pseudo-elements

```ts
const link = css({
  color: '#2563eb',

  '&:hover': {
    color: '#1d4ed8',
  },

  '&:focus-visible': {
    outline: '2px solid #2563eb',
    outlineOffset: 3,
  },

  '&::before': {
    content: '"→ "',
  },
});
```

### Descendants and combinators

Include a space, combinator, or attribute selector after `&` exactly as you
would in CSS:

```ts
const article = css({
  '& h2': {
    marginTop: 0,
  },

  '& > img': {
    display: 'block',
    width: '100%',
  },

  '& input:checked + span': {
    color: '#16a34a',
  },

  '&[data-size="large"]': {
    padding: 32,
  },
});
```

### Deep selector nesting

Selector blocks can contain other selector blocks. Nesting is useful for
component states that also affect descendants.

```ts
const menu = css({
  color: '#334155',

  '&:hover': {
    color: '#0f172a',

    '& .icon': {
      transform: 'translateX(4px)',
    },

    '&::after': {
      opacity: 1,
    },
  },
});
```

The nested `& .icon` rule is scoped beneath the parent component's `:hover`
state because nested levels continue from the current generated selector.

### Selector mode

The `selector` option controls the prefix applied to the generated name. The
default is a class selector (`"."`).

```ts
const classStyle = css(
  { color: 'red' },
  { selector: '.' },
);
// .x... { color:red; }

const idStyle = css(
  { color: 'red' },
  { selector: '#' },
);
// #x... { color:red; }
```

For ID mode, assign the generated name to `id`:

```tsx
const panel = css({ padding: 20 }, { selector: '#' });

function Panel() {
  return <section id={panel.classname}>Panel</section>;
}
```

You can also provide another selector prefix:

```ts
const dataStyle = css(
  { color: 'rebeccapurple' },
  { selector: 'section.' },
);
// section.x... { color:rebeccapurple; }
```

Use this only when your final generated selector is valid; ONCSS performs no
selector validation. For ordinary styling, keep the default class mode.

## Responsive values and breakpoints

A property value can be an object whose keys are numeric breakpoints or keys
from the `breakpoints` option. These values compile to `min-width` media
queries.

```ts
const layout = css({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: 12,

  gridColumn: {
    480: 'span 1',
    768: 'span 2',
  },
});
```

This generates the equivalent of:

```css
.x... {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

@media (min-width: 480px) {
  .x... {
    grid-column: span 1;
  }
}
```

Named breakpoints are easier to reuse:

```ts
const responsive = css(
  {
    fontSize: {
      sm: 14,
      md: 16,
      lg: 18,
    },
    padding: {
      sm: 12,
      md: 20,
      lg: 28,
    },
  },
  {
    breakpoints: {
      sm: 480,
      md: 768,
      lg: 1024,
    },
  },
);
```

Responsive value rules:

- Every breakpoint is a `min-width` query in pixels.
- Numeric keys are supported directly.
- A named key must exist in `options.breakpoints`.
- Keep breakpoints in ascending order in the object when possible. This makes
  the source and emitted CSS easier to reason about.
- Responsive objects are values for one property. Use an `@media ...` block
  when multiple properties need to change together.

## Explicit media queries

Use an `@media` key when an entire group of declarations should respond to a
condition:

```ts
const hero = css({
  padding: 24,
  textAlign: 'center',

  '@media (min-width: 768px)': {
    padding: 48,
    textAlign: 'left',
  },

  '@media (prefers-reduced-motion: reduce)': {
    animation: 'none',
    scrollBehavior: 'auto',
  },
});
```

Media blocks can also include nested selectors:

```ts
const navigation = css({
  '& .links': {
    display: 'none',
  },

  '@media (min-width: 900px)': {
    '& .links': {
      display: 'flex',
      gap: 20,
    },

    '& .menu-button': {
      display: 'none',
    },
  },
});
```

The at-rule type and condition become the emitted CSS key verbatim:

```ts
'@media screen and (min-width: 1200px)'
```

## Other at-rules

`@container`, `@layer`, and `@supports` blocks use the same shape as media
queries.

### Container queries

```ts
const card = css({
  containerType: 'inline-size',

  '@container (min-width: 420px)': {
    display: 'grid',
    gridTemplateColumns: '120px 1fr',
  },
});
```

### Feature queries

```ts
const grid = css({
  display: 'block',

  '@supports (display: grid)': {
    display: 'grid',
  },
});
```

### Layers

```ts
const component = css({
  '@layer components': {
    padding: 16,
    borderRadius: 8,
  },
});
```

The supported TypeScript at-rule prefixes are `@media`, `@container`, `@layer`,
and `@supports`, each followed by a space and their condition or name.

## Keyframes

Define animations with an `@keyframes <name>` key. Steps can use `from`, `to`,
or percentage keys.

```ts
const toast = css({
  '@keyframes toast-in': {
    from: {
      opacity: 0,
      transform: 'translateY(12px)',
    },
    '60%': {
      opacity: 1,
      transform: 'translateY(-2px)',
    },
    to: {
      opacity: 1,
      transform: 'translateY(0)',
    },
  },

  animation: 'toast-in 240ms ease-out both',
});
```

Generated keyframes are included with each style factory. ONCSS does not scope
or rename the animation name automatically, so choose globally unique names in
shared applications.

A keyframe step accepts regular CSS declarations but not responsive breakpoint
objects:

```ts
const valid = css({
  '@keyframes pulse': {
    from: { opacity: 0.6 },
    to: { opacity: 1 },
  },
});
```

For more complex motion, combine an animation with a media preference:

```ts
const spinner = css({
  animation: 'spin 800ms linear infinite',

  '@keyframes spin': {
    to: {
      transform: 'rotate(360deg)',
    },
  },

  '@media (prefers-reduced-motion: reduce)': {
    animationDuration: '0.001ms',
    animationIterationCount: 1,
  },
});
```

## Global styles

`@global` emits each child selector without class scoping. Use it for resets,
page-level defaults, and non-component styles.

```ts
css({
  '@global': {
    ':root': {
      color: '#0f172a',
      backgroundColor: '#ffffff',
      fontFamily: 'system-ui, sans-serif',
    },

    '*, *::before, *::after': {
      boxSizing: 'border-box',
    },

    body: {
      margin: 0,
    },

    'a:hover': {
      color: '#1d4ed8',
    },
  },
});
```

Global selectors are literal CSS selectors; do not prefix them with `&`.

## Aliases

Aliases expand a custom property into one or more standard properties. The
alias receives the supplied value and returns a style object.

```ts
import { css, type OptionAliases } from 'oncss';

type Aliases = {
  m: number;
  px: number;
};

const aliases: OptionAliases<Aliases> = {
  m: (value) => ({ margin: value }),
  px: (value) => ({
    paddingLeft: value,
    paddingRight: value,
  }),
};

const box = css(
  {
    m: 12,
    px: 20,
    backgroundColor: '#f8fafc',
  },
  { aliases },
);
```

Aliases are expanded before normal declarations are emitted. The recursive
expansion disables aliases for the returned style object, so aliases should
return standard CSS properties or rules rather than other aliases.

## Custom transforms

The options hooks provide low-level control for integrating design tokens,
filtering properties, and adapting values.

### `getValue`

`getValue` receives `(property, value, fullStyleObject, depth)` and returns the
value ONCSS should emit:

```ts
const themed = css(
  {
    color: 'text.primary',
    padding: 'space.4',
  },
  {
    getValue: (property, value) => {
      if (property === 'color' && value === 'text.primary') {
        return '#0f172a';
      }
      if (property === 'padding' && value === 'space.4') {
        return 16;
      }
      return value;
    },
  },
);
```

Because numbers are transformed to pixels later, returning `16` produces
`padding:16px`.

### `getProps`

`getProps` receives `(property, value, fullStyleObject, depth)`. Return a style
object to replace the handling of that property, or return `undefined` to use
normal processing.

```ts
const layout = css(
  {
    inset: 24,
  },
  {
    getProps: (property, value) => {
      if (property === 'inset') {
        return {
          top: value,
          right: value,
          bottom: value,
          left: value,
        };
      }
    },
  },
);
```

When `getProps` returns an object, its recursive expansion does not call
`getProps` again.

### `skipProps`

Return `true` to omit a property. Skipped properties and the selector they
belonged to are available on the returned factory:

```ts
const safeStyle = css(
  {
    color: 'red',
    unsupportedExperimentalProperty: 'value',
  },
  {
    skipProps: (property) =>
      property.startsWith('unsupported'),
  },
);

console.log(safeStyle.skiped);
```

All hooks receive a `dept` (depth) number. Root declarations start at `1`, and
the depth increases as nested selectors or at-rules are processed.

## Configuration reference

The options object is the second argument to `css()`:

```ts
const factory = css(styleObject, options);
```

| Option | Type | Default | Purpose |
| --- | --- | --- | --- |
| `classPrefix` | `string` | `''` | Prefixes the generated `classname`. |
| `selector` | `string` | `'.'` | Prefix added before the generated name in CSS. |
| `breakpoints` | `Record<string, number>` | none | Resolves named responsive property values to pixel widths. |
| `aliases` | alias map | none | Expands custom properties into style objects. |
| `injectStyle` | `boolean` | `true` | Controls automatic style injection. |
| `container` | `Document \| HTMLElement` | `document` | Chooses where the style tag is inserted. |
| `cacheId` | `string` | `'global'` | Selects a named cache group. |
| `skipProps` | function | none | Omits selected declarations. |
| `getValue` | function | none | Transforms declaration values. |
| `getProps` | function | none | Replaces declaration handling with another style object. |

For class naming, `classPrefix` affects the generated name while `selector`
affects how that name is addressed by the stylesheet:

```ts
const button = css(
  { color: 'white' },
  {
    classPrefix: 'button-',
    selector: '.',
  },
);

button.classname.startsWith('button-'); // true
```

## Style factory API

```ts
const factory = css({ color: 'red' });
```

| Property | Description |
| --- | --- |
| `classname` | Generated class or ID name. |
| `css` | Generated CSS string. |
| `cssraw` | Original style object. |
| `cachekey` | Key used to reuse the generated factory. |
| `cacheId` | Name of the cache containing the factory. |
| `cache` | `true` when a previous factory was reused for the request. |
| `skiped` | Properties omitted by `skipProps`, grouped by selector. |
| `inject()` | Append or populate the factory's style tag. |
| `refresh()` | Remove the current style tag and inject the CSS again. |
| `deleteStyle()` | Remove only the injected style tag. |
| `getStyleTag()` | Return the injected `style` element, or `null`. |
| `delete()` | Remove the factory from the cache and remove its style tag. |

### Manual injection

Disable automatic injection when you need to collect or control CSS output:

```ts
const button = css(
  { backgroundColor: '#2563eb' },
  { injectStyle: false },
);

console.log(button.css);
button.inject();
```

### Target document or element

Use `container` to inject into an iframe document, a shadow-root host element,
or another owned HTML element.

```ts
const iframe = document.querySelector('iframe');
const iframeDocument = iframe?.contentDocument;

if (iframeDocument) {
  css(
    { color: 'tomato' },
    { container: iframeDocument },
  );
}
```

```ts
const host = document.querySelector('#shadow-host') as HTMLElement;

css(
  { color: 'tomato' },
  { container: host },
);
```

A `Document` injects into its `<head>`. An `HTMLElement` receives the style tag
directly, allowing styles to be placed in a specific container.

## Caching

ONCSS caches factories by `cacheId` and a generated style key. The key includes
the source style object and `selector`. Repeated equivalent calls can therefore
reuse the same factory.

```ts
const first = css({ color: 'red' }, { cacheId: 'dashboard' });
const second = css({ color: 'red' }, { cacheId: 'dashboard' });

first === second; // true
```

Use different `cacheId` values to isolate groups of generated styles:

```ts
const appStyle = css(
  { color: 'red' },
  { cacheId: 'main-app' },
);

const previewStyle = css(
  { color: 'red' },
  { cacheId: 'preview' },
);
```

The cache API is exported for advanced use:

```ts
import { ONCSS_CACHE } from 'oncss';

const group = ONCSS_CACHE.caches().get('main-app');

ONCSS_CACHE.delete('main-app', appStyle.cachekey);
```

Changing options such as breakpoints, aliases, or transform hooks without
changing the style object or selector can still reuse the prior cache entry.
Use a distinct `cacheId` when the same style source is compiled with materially
different options.

## Server-side rendering

With no browser `window`, ONCSS still generates factories and CSS but cannot
inject a style element. Collect the generated factories from the cache and
render their `css` into your document head.

```tsx
import { renderToString } from 'react-dom/server';
import { css, ONCSS_CACHE } from 'oncss';

const button = css(
  {
    color: 'white',
    backgroundColor: '#2563eb',
    '&:hover': {
      backgroundColor: '#1d4ed8',
    },
  },
  {
    cacheId: 'server-render',
    injectStyle: false,
  },
);

const html = renderToString(
  <button className={button.classname}>Save</button>,
);

const styles = Array.from(
  ONCSS_CACHE.caches().get('server-render')?.values() ?? [],
)
  .map((factory) =>
    `<style data-href="${factory.classname}">${factory.css}</style>`,
  )
  .join('');

const documentHtml = `
  <!doctype html>
  <html>
    <head>${styles}</head>
    <body><div id="root">${html}</div></body>
  </html>
`;
```

Use a request-specific or intentionally scoped `cacheId` if styles should not
leak between SSR requests. Also apply your existing HTML escaping policy before
inserting application-derived content into an HTML response.

## React

Pass `factory.classname` to `className`:

```tsx
import { css } from 'oncss';

const buttonStyle = css({
  padding: '10px 18px',
  color: 'white',
  backgroundColor: '#2563eb',
  border: 0,
  borderRadius: 8,

  '&:hover': {
    backgroundColor: '#1d4ed8',
  },
});

export function Button() {
  return (
    <button type="button" className={buttonStyle.classname}>
      Save
    </button>
  );
}
```

For styles generated at module scope, ONCSS injects and caches them once. For
dynamic styles, call `css()` in response to the relevant state and reuse cache
IDs where appropriate.

## Utility functions

### `formatCSSProp`

```ts
import { formatCSSProp } from 'oncss';

formatCSSProp('backgroundColor'); // 'background-color'
```

### `formatCSSValue`

```ts
import { formatCSSValue } from 'oncss';

formatCSSValue('width', 100); // '100px'
formatCSSValue('opacity', 0.5); // 0.5
```

## TypeScript

The package exports the main CSS and option types:

```ts
import {
  css,
  type CSSOptionProps,
  type CSSProps,
  type OptionAliases,
} from 'oncss';

type Aliases = {
  m: number;
};

type Breakpoint = 'sm' | 'md' | 'lg';

const aliases: OptionAliases<Aliases> = {
  m: (value) => ({ margin: value }),
};

const options: CSSOptionProps<Aliases, Breakpoint> = {
  aliases,
  breakpoints: {
    sm: 480,
    md: 768,
    lg: 1024,
  },
};

const styles: CSSProps<Aliases, Breakpoint> = {
  m: 8,
  color: 'red',
  fontSize: {
    sm: 14,
    lg: 18,
  },
};

const generated = css(styles, options);
```

## Complete example

```tsx
import { css, type OptionAliases } from 'oncss';

type Aliases = {
  px: number;
  radius: number;
};

const aliases: OptionAliases<Aliases> = {
  px: (value) => ({
    paddingLeft: value,
    paddingRight: value,
  }),
  radius: (value) => ({
    borderRadius: value,
  }),
};

const notification = css(
  {
    px: 16,
    radius: 10,
    paddingTop: 12,
    paddingBottom: 12,
    color: '#0f172a',
    backgroundColor: '#f8fafc',
    boxShadow: '0 10px 30px rgba(15, 23, 42, 0.12)',
    animation: 'notification-enter 220ms ease-out both',

    '&:hover': {
      backgroundColor: '#f1f5f9',
    },

    '@media (min-width: 768px)': {
      px: 24,
      '& .actions': {
        display: 'flex',
      },
    },

    '@keyframes notification-enter': {
      from: {
        opacity: 0,
        transform: 'translateY(8px)',
      },
      to: {
        opacity: 1,
        transform: 'translateY(0)',
      },
    },
  },
  {
    aliases,
    breakpoints: {
      md: 768,
    },
  },
);

export function Notification() {
  return (
    <div className={notification.classname}>
      Saved successfully
      <div className="actions">Actions</div>
    </div>
  );
}
```

## Author

<table>
  <tr>
    <td>
      <img src="https://raw.githubusercontent.com/devnax/devnax/main/me-circle-200.png" alt="devnax" width="100" height="100">
    </td>
    <td>
      <strong>Naxrul Ahmed</strong><br>
      <a href="https://github.com/devnax">GitHub Profile</a><br>
      <a href="https://www.npmjs.com/~devnax">npm Profile</a><br>
      <a href="https://github.com/devnax/open-source">Open Source Projects</a>
    </td>
  </tr>
</table>

<h2>Where to find me</h2>

<p><a target="_blank" href="mailto:devnaxrul@gmail.com"><img src="https://img.shields.io/badge/-Email-05122A?style=for-the-badge&logo=gmail&logoColor=white&color=orange" alt="Email" /></a>
<a target="_blank" href="https://twitter.com/devnaxx"><img src="https://img.shields.io/badge/twitter-x?style=for-the-badge&logo=x&logoColor=white&color=%230f1419" alt="Twitter" /></a>
<a target="_blank" href="https://www.linkedin.com/in/devnax"><img src="https://img.shields.io/badge/linkedin-logo?style=for-the-badge&logo=linkedin&logoColor=white&color=%230a77b6" alt="LinkedIn" /></a>
<a target="_blank" href="https://www.facebook.com/devnax"><img src="https://img.shields.io/badge/facebook-logo?style=for-the-badge&logo=facebook&logoColor=white&color=%230866ff" alt="Facebook" /></a>
<a target="_blank" href="https://www.instagram.com/devnaxx"><img src="https://img.shields.io/badge/instagram-logo?style=for-the-badge&logo=instagram&logoColor=white&color=%23F35369" alt="Instagram" /></a></p>
