import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import css, { OptionAliases, CSSFactory, CSSOptionProps } from './src'

type Breakpoints = "xs" | "sm" | "md" | "lg"
type Aliases = {
  m: string;
  radius: number;
}

let aliases: OptionAliases<Aliases> = {
  m: (val: string) => {
    return {
      margin: val + "px"
    }
  },
  radius: (val: string) => {
    return {
      borderRadius: val + "px"
    }
  }
}


const App = () => {
  const [count, setCount] = React.useState(0)
  const _options = {
    aliases,
    breakpoints: {
      xs: 0,
      sm: 500,
      md: 700,
      lg: 900,
      xl: 1100,
    },
    getValue: (p: any, v: any, _c: any,) => {
      return v
    },
    skipProps: (p: any, v: any, dept) => {
      console.log(dept, p);

      return false
    }
  }

  const cls = css({
    height: 200,
    radius: 20,
    background: {
      xs: "orange",
      sm: "red",
      md: "blue",
      lg: "green",
      xl: "yellow",
    },
    "&:hover": {
      background: "yellow",
      "& a": {
        color: "red"
      }
    },
  }, _options)


  return (
    <div>
      wellcome
      <button onClick={() => setCount(Math.random())}>up</button>
    </div>
  );
};


const rootEle = document.getElementById('root')
if (rootEle) {
  const root = createRoot(rootEle);
  root.render(<App />);
}
