import * as CSS from 'csstype'
type CSSProperties = CSS.Properties<number | string>;

type CSSNestedSelectors<Aliases, BreakpointKeys extends string> = {
   [key: `& ${string}`]: CSSPropsWithoutGlobal<Aliases, BreakpointKeys>;
};

type CSSNestedSelectorsWithoutChild<Aliases, BreakpointKeys extends string> = {
   "&": CSSPropsWithoutGlobal<Aliases, BreakpointKeys>;
};

type AtRules = "media" | "container" | "layer" | "supports"
type MediaCSS<Aliases, BreakpointKeys extends string> = {
   [key: `@${AtRules} ${string}`]: CSSProps<Aliases, BreakpointKeys>;
};

type KeyframesCSS<Aliases> = {
   [key: `@keyframes ${string}`]: {
      from?: CSSValueWithoutBreakpoint<Aliases>;
      to?: CSSValueWithoutBreakpoint<Aliases>;
      [key: `${string}%`]: CSSValueWithoutBreakpoint<Aliases>;
   };
};

type GlobalCSS<Aliases, BreakpointKeys extends string> = {
   '@global'?: {
      [key: string]: CSSPropsWithoutGlobal<Aliases, BreakpointKeys>;
   };
};

export type BreakpointTypes<BreakpointKeys extends string, ValueTypes> = {
   [key in number | BreakpointKeys]?: ValueTypes;
};

export type CSSValueWithoutBreakpoint<Aliases> = {
   [Property in keyof (CSSProperties & Aliases)]?: (CSSProperties & Aliases)[Property]
}

type CSSValue<Aliases, BreakpointKeys extends string> = {
   [Property in keyof (CSSProperties & Aliases)]?: (CSSProperties & Aliases)[Property] | BreakpointTypes<BreakpointKeys, (CSSProperties & Aliases)[Property]>
}

export type CSSPropsWithoutGlobal<Aliases, BreakpointKeys extends string> = CSSValue<Aliases, BreakpointKeys> | KeyframesCSS<Aliases> | MediaCSS<Aliases, BreakpointKeys> | CSSNestedSelectors<Aliases, BreakpointKeys> | CSSNestedSelectorsWithoutChild<Aliases, BreakpointKeys>
export type CSSProps<Aliases, BreakpointKeys extends string> = GlobalCSS<Aliases, BreakpointKeys> | CSSPropsWithoutGlobal<Aliases, BreakpointKeys>
export type AliasFn<Aliases> = (value: any) => CSSValueWithoutBreakpoint<Aliases>
export type OptionAliases<Aliases> = {
   [key in keyof Aliases]: AliasFn<Aliases>
}

export interface CSSOptionProps<Aliases, BreakpointKeys extends string> {
   classPrefix?: string;
   breakpoints?: { [key in BreakpointKeys]: number };
   aliases?: OptionAliases<Aliases>;
   injectStyle?: boolean;
   skipProps?: (prop: string, value: string | number) => boolean;
   getValue?: (value: string | number, prop: string, css: CSSProps<Aliases, BreakpointKeys>) => (string | number);
   getProps?: (prop: string, value: string | number, css: CSSProps<Aliases, BreakpointKeys>) => CSSProps<Aliases, BreakpointKeys> | void;
}

export type CSSFactoryType = {
   css: string;
   cachekey: string;
   classname: string;
   cssraw: CSSProps<any, any>;
   cache: boolean;
   skiped: string[];
   getStyleTag: () => HTMLStyleElement | null;
   deleteStyle: () => void;
}
