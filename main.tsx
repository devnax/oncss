import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import css, { OptionAliases, CSSFactory, CSSOptionProps } from './src'

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
    selector: "#",
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
  }

  const cls = css({
    "&:hover": {
      background: "yellow",
      "& a": {
        color: "red"
      }
    },
    height: 200,
    radius: 20,
    background: {
      xs: "orange",
      sm: "red",
      md: "blue",
      lg: "green",
      xl: "yellow",
    },

  }, _options)

  const obj = {
    name: "Test",
    age: 25,
    greet: function () {
      return "Hello!";
    },
    nested: {
      value: 42,
      compute: function () {
        return this.value * 2;
      },
    },
  };

  let length = 10000

  // Plain JSON.stringify
  console.time("Plain stringify");
  for (let i = 0; i < length; i++) {
    css({
      "&:hover": {
        background: "yellow",
        "& a": {
          color: "red"
        }
      },
      height: 200,
      radius: 20,
      background: {
        xs: "orange",
        sm: "red",
        md: "blue",
        lg: "green",
        xl: "yellow",
      },

    }, _options)
  }
  console.timeEnd("Plain stringify");

  return (
    <div id={cls.classname}>
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