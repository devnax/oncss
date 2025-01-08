import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import css, { OptionAliases, CSSFactory, CSSOptionProps } from './src'

type Breakpoints = "xs" | "sm" | "md" | "lg"
type Aliases = {
  m: string
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
    }
  }

  const cls = css({
    height: 200,
    m: 100,
    radius: 100,
    background: {
      xs: "orange",
      sm: "red",
      md: "blue",
      lg: "green",
      xl: "yellow",
    },

    "& button": {
      "@media (max-width: 500px)": {
        "& ": {
          height: 100,
        }
      },
      color: {
        xs: "orange",
        sm: "red",
        md: "blue",
        lg: "green",
        xl: "yellow",
      },
      animationName: "fade",
      animationDuration: "3s",
      "@keyframes fade": {
        from: {
          opacity: 0
        },
        to: {
          opacity: 1
        }
      },
    },
    "@global": {
      body: {
        padding: 0,
        margin: 0
      }
    },
  }, {
    ..._options,
  })


  let iterations = 0
  const startJson = performance.now();
  for (let i = 0; i < iterations; i++) {
    css({
      height: 0,
      background: {
        xs: "orange",
        sm: "red",
        md: "blue",
        lg: "green",
        xl: "yellow",
      },
      "& button": {
        "@media (max-width: 500px)": {
          "& ": {
            height: 100,
          }
        },
        color: {
          xs: "orange",
          sm: "red",
          md: "blue",
          lg: "green",
          xl: "yellow",
        },
        animationName: "fade",
        animationDuration: "3s",
        "@keyframes fade": {
          from: {
            opacity: 0
          },
          to: {
            opacity: 1
          }
        },
      },
      "@global": {
        body: {
          padding: 0,
          margin: 0
        }
      },
    }, {
      ..._options,
    })
  }
  const endJson = performance.now();
  // console.log(`JSON.stringify total time: ${((endJson - startJson) / 1000).toFixed(6)} seconds`);



  const options: CSSOptionProps<Aliases, Breakpoints> = {
    aliases: {
      m: (val) => {
        return {
          margin: val
        }
      }
    },
    // getProps: (prop) => {
    //   if (prop == "color") {
    //     return {
    //       color: "green",
    //       background: "yellow",
    //       "& a": {
    //         color: "red"
    //       }
    //     }
    //   }
    // }
  }

  const r = css<Aliases, Breakpoints>({
    color: "red",
    background: "yellow",

    "@container style(-is: true)": {
      color: "yellow",
      "& a": {
        height: "100"
      },
      "@media (max-width: 500px)": {
        "&": {
          height: 100,
        }
      },
    },

    "& a": {
      color: "red"
    }
  }, options)


  return (
    <div className={cls.classname}>
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
