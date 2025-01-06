import { CSSOptionProps, CSSFactoryType, CSSProps } from './types';

const _global: any = typeof window !== 'undefined' ? window : global;
_global.Factory = _global.Factory || new Map<string, CSSFactoryType>();
export const CSSFactory = _global.Factory as Map<string, CSSFactoryType>

export const uid = (str: string) => {
    var hash = 0, len = str.length;
    for (var i = 0; i < len; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash |= 0;
    }
    let id = hash.toString(32).slice(-10).replace(/-/g, "");
    if (/^\d/.test(id.charAt(0))) id = 'c' + id;
    return id;
}

const number_val_props = [
    "fontWeight",
    "font-weight",
    "lineHeight",
    "line-height",
    "opacity",
    "zIndex",
    "z-index",
    "flex",
    "order",
    "flexGrow",
    "flex-grow",
    "flexShrink",
    "flex-shrink",
    "flexBasis",
    "flex-basis",
    "columns",
    "perspective",
    "stroke-dashoffset"
]

export const formatCSSProp = (prop: string) => prop.split(/(?=[A-Z])/).join("-").toLowerCase();
export const formatCSSValue = (prop: string, val: any) => typeof val === 'number' && !number_val_props.includes(prop) ? `${val}px` : val

const PREFIXES = ['webkit', 'moz', 'ms', 'o'];
let _declaration: CSSStyleDeclaration;
const PREFIXCACHE = new Map();

export const cssPrefix = (prop: string, value: string): { prop: string, value: string } => {
    value = formatCSSValue(prop, value);
    prop = formatCSSProp(prop);

    if (typeof window === 'undefined') {
        return { prop, value };
    }

    const declaration = _declaration || (_declaration = document.createElement("div").style);
    value = value?.toString();

    // Check if the property and value work as is
    if (declaration.setProperty(prop, value), declaration.getPropertyValue(prop) === value) {
        return { prop, value };
    }

    // Check cached property and value prefix
    const cached = PREFIXCACHE.get(prop);
    if (cached) {
        return { prop: cached._prop, value: `${cached._vprefix}${value}` };
    }

    let _prop = prop;
    let _value = value;
    let _vprefix = '';

    // Try property prefixes
    const camelCaseProp = prop.includes('-') ? prop.replace(/-([a-z])/g, (_, c) => c.toUpperCase()) : prop;
    for (const prefix of PREFIXES) {
        if (declaration[`${prefix}${camelCaseProp}` as any] !== undefined) {
            _prop = `-${prefix}-${prop}`;
            break;
        }
    }

    // Check if prefixed property works with the value
    declaration.setProperty(_prop, value);
    if (!declaration.getPropertyValue(_prop)) {
        for (const prefix of PREFIXES) {
            const prefixedValue = `-${prefix}-${value}`;
            if (declaration.setProperty(_prop, prefixedValue), declaration.getPropertyValue(_prop) === prefixedValue) {
                _value = prefixedValue;
                _vprefix = `-${prefix}-`;
                break;
            }
        }
    }

    PREFIXCACHE.set(prop, { _prop, _vprefix });
    return { prop: _prop, value: _value };
};

export const style = <Aliases, BreakpointKeys extends string>(_css: CSSProps<Aliases, BreakpointKeys>, cls?: string, opt?: CSSOptionProps<Aliases, BreakpointKeys>) => {
    let cachekey
    let classname = cls
    if (!cls) {
        cachekey = JSON.stringify(_css)
        const has = CSSFactory.get(cachekey)
        if (has) {
            has.cache = true
            return has
        }
        classname = (opt?.classPrefix || "") + uid(cachekey)
    } else if (typeof cls !== 'string') {
        throw new Error(`Invalid class name: ${cls}`)
    }

    let stack: any = [`${classname}{`]
    let medias: any = {}
    let skiped: any = {}

    for (let prop in _css) {
        let val = (_css as any)[prop]
        let firstChar = prop.charAt(0)
        if (firstChar === '&') {
            let ncls = prop.replace(/&/g, classname as string)
            const r: any = style(val, ncls, opt)
            if (opt?.skipProps) {
                skiped = {
                    ...skiped,
                    ...r.skiped
                }
            }
            stack.push(r.stack)
        } else if (firstChar === '@') {
            if (prop.startsWith("@global") || prop.startsWith("@keyframes")) {
                let _css = ''
                for (let selector in val) {
                    let r: any = style(val[selector], selector, opt)
                    _css += r.stack
                    if (opt?.skipProps) {
                        skiped = {
                            ...skiped,
                            ...r.skiped
                        }
                    }
                }
                if (prop.startsWith("@keyframes")) {
                    stack.push(`${prop}{${_css}}`)
                } else {
                    stack.push(_css)
                }
            } else {
                let r: any = style(val, classname, opt)
                const atcss = prop + "{" + r.stack + "}"
                stack.push(atcss)
                if (opt?.skipProps) {
                    skiped = {
                        ...skiped,
                        ...r.skiped
                    }
                }
            }
        } else if (typeof val === 'object') {
            for (let media in val) {
                if (typeof val[media] === 'object' || typeof val[media] === 'function' || Array.isArray(val[media])) {
                    throw new Error(`Invalid css value: ${val[media]}`);
                }
                let breakpoint = media
                let isNumber = !isNaN(parseInt(breakpoint))
                if (!isNumber) {
                    if (opt?.breakpoints && !isNaN(parseInt((opt.breakpoints as any)[media]))) {
                        breakpoint = opt.breakpoints[media as BreakpointKeys].toString()
                    } else {
                        throw new Error(`Invalid breakpoint prop: ${media}`);
                    }
                }
                let _css = { [prop]: val[media] }
                let r: any = style(_css, classname, opt)
                let _style = r.stack
                let mediakey = `@media (min-width: ${breakpoint}px)`
                medias[mediakey] = medias[mediakey] ? medias[mediakey] + _style : _style
                if (opt?.skipProps) {
                    skiped = {
                        ...skiped,
                        ...r.skiped
                    }
                }
            }
        } else {
            if (opt?.skipProps && opt.skipProps(prop, val)) {
                if (!skiped[classname as string]) skiped[classname as string] = []
                skiped[classname as string].push(prop)
                continue
            }
            if (opt?.getProps) {
                let _props: any = opt.getProps(prop, val, _css)
                if (_props) {
                    let r: any = style(_props, classname, {
                        ...opt,
                        getProps: undefined
                    })
                    if (opt?.skipProps) {
                        skiped = {
                            ...skiped,
                            ...r.skiped
                        }
                    }
                    stack.push(r.stack)
                    continue;
                }
            }
            if (opt?.getValue) {
                val = opt.getValue(prop, val, _css)
            } else if (opt?.aliases && (opt.aliases as any)[prop]) {
                let _props = (opt.aliases as any)[prop](prop, val)
                if (_props) {
                    let r: any = style(_props, classname, opt)
                    r.stack = r.stack.replace(`${classname}{`, '').replace(`}`, '')
                    stack[0] += r.stack
                    skiped[classname as string] = r.skiped
                    continue;
                }
            }
            let p = cssPrefix(prop, val)
            stack[0] += `${p.prop}:${p.value};`
        }
    }
    stack[0] += "}"
    if (stack[0] === `${classname}{}`) {
        stack[0] = ""
    }
    stack = stack.join('')
    for (let media in medias) {
        stack += `${media}{${medias[media].replace(new RegExp(`}\\${classname}\\{`, 'g'), '')}}`
    }

    if (cachekey) {
        stack = stack.replace(new RegExp(classname as string, 'g'), `.${classname}`)
        const r = {
            cache: false,
            cachekey,
            classname: classname as string,
            css: stack,
            cssraw: _css,
            skiped,
            getStyleTag: () => document?.querySelector(`[data-oncss="${classname}"]`) as HTMLStyleElement | null,
            deleteStyle: () => {
                const tag = document?.querySelector(`[data-oncss="${classname}"]`)
                tag && tag.remove()
            },
        }
        r.toString = () => classname as string
        CSSFactory.set(cachekey, r)
        let inject = opt?.injectStyle || true
        if (inject && typeof window !== 'undefined') {
            if (!document.querySelector(`[data-oncss="${classname}"]`)) {
                const tag = document.createElement("style");
                tag.innerHTML = r.css
                tag.setAttribute(`data-oncss`, classname as string)
                document.head.append(tag)
            }
        }
        return r
    }
    return { stack, skiped }
}