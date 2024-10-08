// Source: https://get.webgl.org/
(()=>{
    "use strict";
    window.hasOwnProperty("__REACT_DEVTOOLS_GLOBAL_HOOK__") || (!function(e) {
        if (e.hasOwnProperty("__REACT_DEVTOOLS_GLOBAL_HOOK__"))
            return null;
        let n = console
          , t = {};
        for (const e in console)
            t[e] = console[e];
        let o = null;
        function patchConsoleForInitialRenderInStrictMode({hideConsoleLogsInStrictMode: e, browserTheme: t}) {
            if (null !== o)
                return;
            const r = {};
            o = ()=>{
                for (const e in r)
                    try {
                        n[e] = r[e]
                    } catch (e) {}
            }
            ,
            ["error", "group", "groupCollapsed", "info", "log", "trace", "warn"].forEach((o=>{
                try {
                    const i = r[o] = n[o].__REACT_DEVTOOLS_STRICT_MODE_ORIGINAL_METHOD__ ? n[o].__REACT_DEVTOOLS_STRICT_MODE_ORIGINAL_METHOD__ : n[o]
                      , overrideMethod = (...n)=>{
                        if (!e) {
                            let e;
                            switch (o) {
                            case "warn":
                                e = "light" === t ? "rgba(250, 180, 50, 0.75)" : "rgba(250, 180, 50, 0.5)";
                                break;
                            case "error":
                                e = "light" === t ? "rgba(250, 123, 130, 0.75)" : "rgba(250, 123, 130, 0.5)";
                                break;
                            default:
                                e = "light" === t ? "rgba(125, 125, 125, 0.75)" : "rgba(125, 125, 125, 0.5)"
                            }
                            if (!e)
                                throw Error("Console color is not defined");
                            i(...(r = n,
                            _ = `color: ${e}`,
                            null == r || 0 === r.length || "string" == typeof r[0] && r[0].match(/([^%]|^)(%c)/g) || void 0 === _ ? r : "string" == typeof r[0] && r[0].match(/([^%]|^)((%%)*)(%([oOdisf]))/g) ? [`%c${r[0]}`, _, ...r.slice(1)] : [r.reduce(((e,n,t)=>{
                                switch (t > 0 && (e += " "),
                                typeof n) {
                                case "string":
                                case "boolean":
                                case "symbol":
                                    return e + "%s";
                                case "number":
                                    return e + (Number.isInteger(n) ? "%i" : "%f");
                                default:
                                    return e + "%o"
                                }
                            }
                            ), "%c"), _, ...r]))
                        }
                        var r, _
                    }
                    ;
                    overrideMethod.__REACT_DEVTOOLS_STRICT_MODE_ORIGINAL_METHOD__ = i,
                    i.__REACT_DEVTOOLS_STRICT_MODE_OVERRIDE_METHOD__ = overrideMethod,
                    n[o] = overrideMethod
                } catch (e) {}
            }
            ))
        }
        let r = 0
          , i = !1;
        const _ = []
          , c = [];
        function getTopStackFrameString(e) {
            const n = e.stack.split("\n");
            return n.length > 1 ? n[1] : null
        }
        const l = {}
          , s = new Map
          , u = {}
          , a = new Map
          , d = new Map
          , O = {
            rendererInterfaces: s,
            listeners: u,
            backends: d,
            renderers: a,
            emit: function(e, n) {
                u[e] && u[e].map((e=>e(n)))
            },
            getFiberRoots: function(e) {
                const n = l;
                return n[e] || (n[e] = new Set),
                n[e]
            },
            inject: function(n) {
                const t = ++r;
                a.set(t, n);
                const o = i ? "deadcode" : function(e) {
                    try {
                        if ("string" == typeof e.version)
                            return e.bundleType > 0 ? "development" : "production";
                        const n = Function.prototype.toString;
                        if (e.Mount && e.Mount._renderNewRootComponent) {
                            const t = n.call(e.Mount._renderNewRootComponent);
                            return 0 !== t.indexOf("function") ? "production" : -1 !== t.indexOf("storedMeasure") ? "development" : -1 !== t.indexOf("should be a pure function") ? -1 !== t.indexOf("NODE_ENV") || -1 !== t.indexOf("development") || -1 !== t.indexOf("true") ? "development" : -1 !== t.indexOf("nextElement") || -1 !== t.indexOf("nextComponent") ? "unminified" : "development" : -1 !== t.indexOf("nextElement") || -1 !== t.indexOf("nextComponent") ? "unminified" : "outdated"
                        }
                    } catch (e) {}
                    return "production"
                }(n);
                if (e.hasOwnProperty("__REACT_DEVTOOLS_CONSOLE_FUNCTIONS__")) {
                    const {registerRendererWithConsole: t, patchConsoleUsingWindowValues: o} = e.__REACT_DEVTOOLS_CONSOLE_FUNCTIONS__;
                    "function" == typeof t && "function" == typeof o && (t(n),
                    o())
                }
                const _ = e.__REACT_DEVTOOLS_ATTACH__;
                if ("function" == typeof _) {
                    const o = _(O, t, n, e);
                    O.rendererInterfaces.set(t, o)
                }
                return O.emit("renderer", {
                    id: t,
                    renderer: n,
                    reactBuildType: o
                }),
                t
            },
            on: function(e, n) {
                u[e] || (u[e] = []),
                u[e].push(n)
            },
            off: function(e, n) {
                if (!u[e])
                    return;
                const t = u[e].indexOf(n);
                -1 !== t && u[e].splice(t, 1),
                u[e].length || delete u[e]
            },
            sub: function(e, n) {
                return O.on(e, n),
                ()=>O.off(e, n)
            },
            supportsFiber: !0,
            checkDCE: function(e) {
                try {
                    Function.prototype.toString.call(e).indexOf("^_^") > -1 && (i = !0,
                    setTimeout((function() {
                        throw new Error("React is running in production mode, but dead code elimination has not been applied. Read how to correctly configure React for production: https://react.dev/link/perf-use-production-build")
                    }
                    )))
                } catch (e) {}
            },
            onCommitFiberUnmount: function(e, n) {
                const t = s.get(e);
                null != t && t.handleCommitFiberUnmount(n)
            },
            onCommitFiberRoot: function(e, n, t) {
                const o = O.getFiberRoots(e)
                  , r = n.current
                  , i = o.has(n)
                  , _ = null == r.memoizedState || null == r.memoizedState.element;
                i || _ ? i && _ && o.delete(n) : o.add(n);
                const c = s.get(e);
                null != c && c.handleCommitFiberRoot(n, t)
            },
            onPostCommitFiberRoot: function(e, n) {
                const t = s.get(e);
                null != t && t.handlePostCommitFiberRoot(n)
            },
            setStrictMode: function(e, n) {
                const t = s.get(e);
                null != t ? n ? t.patchConsoleForStrictMode() : t.unpatchConsoleForStrictMode() : n ? patchConsoleForInitialRenderInStrictMode({
                    hideConsoleLogsInStrictMode: !0 === window.__REACT_DEVTOOLS_HIDE_CONSOLE_LOGS_IN_STRICT_MODE__,
                    browserTheme: window.__REACT_DEVTOOLS_BROWSER_THEME__
                }) : null !== o && (o(),
                o = null)
            },
            getInternalModuleRanges: function() {
                return c
            },
            registerInternalModuleStart: function(e) {
                const n = getTopStackFrameString(e);
                null !== n && _.push(n)
            },
            registerInternalModuleStop: function(e) {
                if (_.length > 0) {
                    const n = _.pop()
                      , t = getTopStackFrameString(e);
                    null !== t && c.push([n, t])
                }
            }
        };
        Object.defineProperty(e, "__REACT_DEVTOOLS_GLOBAL_HOOK__", {
            configurable: !1,
            enumerable: !1,
            get: ()=>O
        })
    }(window),
    window.__REACT_DEVTOOLS_GLOBAL_HOOK__.on("renderer", (function({reactBuildType: e}) {
        window.postMessage({
            source: "react-devtools-hook",
            payload: {
                type: "react-renderer-attached",
                reactBuildType: e
            }
        }, "*")
    }
    )),
    window.__REACT_DEVTOOLS_GLOBAL_HOOK__.nativeObjectCreate = Object.create,
    window.__REACT_DEVTOOLS_GLOBAL_HOOK__.nativeMap = Map,
    window.__REACT_DEVTOOLS_GLOBAL_HOOK__.nativeWeakMap = WeakMap,
    window.__REACT_DEVTOOLS_GLOBAL_HOOK__.nativeSet = Set)
}
)();
//# sourceMappingURL=installHook.js.map
