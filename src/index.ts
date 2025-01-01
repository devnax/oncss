import { style } from "./core";
import { CSSProps, CSSOptionProps } from "./types";
export { CSSFactory, formatCSSProp, formatCSSValue } from './core'
export * from './types'

export const css = <Aliases, BreakpointKeys extends string>(_css: CSSProps<Aliases, BreakpointKeys>, options?: CSSOptionProps<Aliases, BreakpointKeys>): any => style<Aliases, BreakpointKeys>(_css, undefined, options)
export default css