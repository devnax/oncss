# oncss
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

console.log(buttonStyles.toString());
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
