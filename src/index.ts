import { style } from "./core";
import { CSSProps, CSSOptionProps, CSSFactoryType } from "./types";
export { ONCSS_CACHE, formatCSSProp, formatCSSValue } from './core'
export * from './types'

export const css = <Aliases, BreakpointKeys extends string>(_css: CSSProps<Aliases, BreakpointKeys>, options?: CSSOptionProps<Aliases, BreakpointKeys>): CSSFactoryType => style<Aliases, BreakpointKeys>(_css, undefined, options) as any