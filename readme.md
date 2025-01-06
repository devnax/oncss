<p align="center">
  <img width="120" src="https://raw.githubusercontent.com/devnax/oncss/main/logo.png" alt="ONCSS Logo">
</p>

<h1 align="center">ONCSS</h1>

`oncss` is a CSS-in-JS library that provides developers with a powerful `css` function to style their web applications. It enables modern styling techniques, including nested selectors, responsive design, and dynamic keyframes, all while offering seamless integration with JavaScript frameworks like React.

---

## Installation

Install the `oncss` package via npm:

```bash
npm install oncss
```

Import the `css` function in your project:

```javascript
import css from 'oncss';
```

---

## Core Concept: The `css` Function

The `css` function is the heart of `oncss`, designed to dynamically generate and inject CSS into your application. It supports:

- **CSS Properties**: Use standard CSS properties and values.
- **Nested Selectors**: Apply styles to child elements or states using `&`.
- **Media Queries**: Implement responsive designs with `@media` rules.
- **Keyframes**: Create animations with `@keyframes`.
- **Global Styles**: Apply styles globally with `@global`.
- **Custom Breakpoints**: Define reusable breakpoints for responsiveness.
- **Other At-Rules**: Utilize additional at-rules like `@container`, `@layer`, and `@supports`.

### Basic Example

```typescript
const buttonStyles = css({
  backgroundColor: 'blue',
  color: 'white',
  padding: '10px 20px',
  borderRadius: '5px',
  '&:hover': {
    backgroundColor: 'darkblue',
  },
  '@media (min-width: 768px)': {
    padding: '15px 30px',
  },
});

console.log(buttonStyles);
```

---

## Configuration Options

The `css` function can be customized through an options object:

### Available Properties

| Property      | Type       | Description                                |
| ------------- | ---------- | ------------------------------------------ |
| `classPrefix` | `string`   | Adds a prefix to generated class names.    |
| `breakpoints` | `object`   | Custom breakpoints for responsive designs. |
| `aliases`     | `object`   | Custom shorthand properties for CSS rules. |
| `injectStyle` | `boolean`  | Controls whether styles are auto-injected. |
| `skipProps`   | `function` | Filters out unwanted properties.           |
| `getValue`    | `function` | Transforms property values dynamically.    |
| `getProps`    | `function` | Customizes specific property handling.     |

### Example with Options

```typescript
const styles = css({
  fontSize: 16,
  padding: 10,
}, {
  classPrefix: 'myprefix',
  breakpoints: {
    sm: 480,
    md: 768,
    lg: 1024,
  },
});
```

### Using Breakpoints

You can use the defined breakpoints in your styles to create responsive designs:

```typescript
const responsiveStyles = css({
  fontSize: 14,
  padding: {
    sm: 12,
    lg: 24
  },
  
}, {
  breakpoints: {
    sm: 480,
    md: 768,
    lg: 1024,
  },
});
```

---

## React Integration

oncss integrates seamlessly with React. Simply pass the generated class name to your component.

### React Example

```typescript
import React from 'react';
import css from 'oncss';

const buttonStyle = css({
  backgroundColor: 'green',
  color: 'white',
  padding: '10px 20px',
  borderRadius: '8px',
  '&:hover': {
    backgroundColor: 'darkgreen',
  },
});

function Button() {
  return <button className={buttonStyle.toString()}>Click Me</button>;
}

export default Button;
```

---

## Advanced Features

### Nested Selectors

Apply styles to child elements or pseudo-classes:

```typescript
const cardStyles = css({
  padding: '20px',
  border: '1px solid #ccc',
  '& h1': {
    fontSize: '24px',
    margin: 0,
  },
  '&:hover': {
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
});
```

### Media Queries

Easily add responsive styles:

```typescript
const responsiveStyles = css({
  fontSize: '14px',
  '@media (min-width: 768px)': {
    fontSize: '18px',
  },
});
```

### Keyframes

Define and use animations:

```typescript
const animationStyles = css({
  '@keyframes fadeIn': {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
  animation: 'fadeIn 2s ease-in-out',
});
```

### Global Styles

Apply global styles effortlessly:

```typescript
const globalStyles = css({
  '@global': {
    body: {
      margin: 0,
      fontFamily: 'Arial, sans-serif',
    },
    a: {
      color: 'blue',
      textDecoration: 'none',
    },
  },
});
```

---

## Supported At-Rules

`oncss` supports various CSS at-rules to enhance your styling capabilities. Here is a list of supported at-rules with descriptions:

| At-Rule      | Description                                                                  |
| ------------ | ---------------------------------------------------------------------------- |
| `@media`     | Used for applying styles based on media queries for responsive design.       |
| `@keyframes` | Defines animations that can be applied to elements.                          |
| `@global`    | Applies styles globally across the entire application.                       |
| `@container` | Used for container queries to apply styles based on container size.          |
| `@layer`     | Defines style layers to control the order of style application.              |
| `@supports`  | Applies styles based on the support of specific CSS features in the browser. |

---

## Server-Side Styling

`oncss` supports server-side rendering (SSR) by utilizing the `CSSFactory` to store and manage generated CSS styles. This allows you to extract and inject styles into your server-rendered HTML.

### Example with React

Here's an example of how to use `oncss` for server-side rendering with React:

```tsx
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import css, { CSSFactory } from 'oncss';

const buttonStyle = css({
  backgroundColor: 'blue',
  color: 'white',
  padding: '10px 20px',
  borderRadius: '5px',
  '&:hover': {
    backgroundColor: 'darkblue',
  },
});

function Button() {
  return <button className={buttonStyle}>Click Me</button>;
}

const App = () => (
  <div>
    <Button />
  </div>
);

// Render the component to a string
const html = ReactDOMServer.renderToString(<App />);

let styles: any = Array.from(CSSFactory.values()).map((style) => {
  return `<style data-oncss="${style.classname}">${style.css}</style>`
});

// Inject the styles into the HTML
const fullHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SSR with oncss</title>
  ${styles}
</head>
<body>
  <div id="root">${html}</div>
</body>
</html>
`;

console.log(fullHtml);
```

In this example, the `CSSFactory` is used to collect all generated CSS styles during the server-side rendering process. These styles are then injected into the HTML document, ensuring that the styles are applied correctly when the page is loaded in the browser.

---

## Utility Functions

### CSSFactory

`CSSFactory` is a global cache for storing generated CSS styles. It helps in reusing styles and avoiding redundant style generation.

### formatCSSProp

`formatCSSProp` is a utility function that converts camelCase CSS property names to kebab-case.

```typescript
import { formatCSSProp } from 'oncss';

const formattedProp = formatCSSProp('backgroundColor');
console.log(formattedProp); // 'background-color'
```

### formatCSSValue

`formatCSSValue` is a utility function that formats CSS values, adding units like `px` where necessary.

```typescript
import { formatCSSValue } from 'oncss';

const formattedValue = formatCSSValue('width', 100);
console.log(formattedValue); // '100px'
```

---

## TypeScript Integration

`oncss` provides full TypeScript support, allowing you to define types for your CSS properties and options.

### Defining CSS Properties

You can define the types for your CSS properties using the `CSSProps` type:

```typescript
import { CSSProps } from 'oncss';

interface MyAliases {
  customColor?: string;
}

const styles: CSSProps<MyAliases, 'sm' | 'md' | 'lg'> = {
  backgroundColor: 'blue',
  customColor: 'red',
  '@media (min-width: 768px)': {
    backgroundColor: 'green',
  },
};
```

### Using Options with Types

You can also define types for the options object:

```typescript
import { CSSOptionProps } from 'oncss';

const options: CSSOptionProps<MyAliases, 'sm' | 'md' | 'lg'> = {
  classPrefix: 'myprefix',
  breakpoints: {
    sm: 480,
    md: 768,
    lg: 1024,
  },
  aliases: {
    customColor: (prop, value) => ({ color: value }),
  },
};

const styles = css({
  fontSize: 16,
  padding: 10,
}, options);
```

---

## Conclusion

`oncss` simplifies styling for modern web applications. Its robust feature set, from responsive design to keyframe animations, makes it an invaluable tool for developers.

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

<h2>⚡️ Where to find me</h2>

<p><a target="_blank" href="mailto:devnaxrul@gmail.com" style="display: inline-block;"><img src="https://img.shields.io/badge/-Email-05122A?style=for-the-badge&logo=gmail&logoColor=white&color=orange" alt="gmail" /></a>
<a target="_blank" href="https://twitter.com/devnaxx" style="display: inline-block;"><img src="https://img.shields.io/badge/twitter-x?style=for-the-badge&logo=x&logoColor=white&color=%230f1419" alt="twitter" /></a>
<a target="_blank" href="https://www.linkedin.com/in/devnax" style="display: inline-block;"><img src="https://img.shields.io/badge/linkedin-logo?style=for-the-badge&logo=linkedin&logoColor=white&color=%230a77b6" alt="linkedin" /></a>
<a target="_blank" href="https://www.facebook.com/devnax" style="display: inline-block;"><img src="https://img.shields.io/badge/facebook-logo?style=for-the-badge&logo=facebook&logoColor=white&color=%230866ff" alt="facebook" /></a>
<a target="_blank" href="https://www.instagram.com/devnaxx" style="display: inline-block;"><img src="https://img.shields.io/badge/instagram-logo?style=for-the-badge&logo=instagram&logoColor=white&color=%23F35369" alt="instagram" /></a></p>
