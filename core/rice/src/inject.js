(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));
  var __async = (__this, __arguments, generator) => {
    return new Promise((resolve, reject) => {
      var fulfilled = (value) => {
        try {
          step(generator.next(value));
        } catch (e2) {
          reject(e2);
        }
      };
      var rejected = (value) => {
        try {
          step(generator.throw(value));
        } catch (e2) {
          reject(e2);
        }
      };
      var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
      step((generator = generator.apply(__this, __arguments)).next());
    });
  };

  // core/front/node_modules/cuid/lib/pad.js
  var require_pad = __commonJS({
    "core/front/node_modules/cuid/lib/pad.js"(exports, module) {
      module.exports = function pad(num, size) {
        var s2 = "000000000" + num;
        return s2.substr(s2.length - size);
      };
    }
  });

  // core/front/node_modules/cuid/lib/fingerprint.browser.js
  var require_fingerprint_browser = __commonJS({
    "core/front/node_modules/cuid/lib/fingerprint.browser.js"(exports, module) {
      var pad = require_pad();
      var env = typeof window === "object" ? window : self;
      var globalCount = Object.keys(env).length;
      var mimeTypesLength = navigator.mimeTypes ? navigator.mimeTypes.length : 0;
      var clientId = pad((mimeTypesLength + navigator.userAgent.length).toString(36) + globalCount.toString(36), 4);
      module.exports = function fingerprint() {
        return clientId;
      };
    }
  });

  // core/front/node_modules/cuid/lib/getRandomValue.browser.js
  var require_getRandomValue_browser = __commonJS({
    "core/front/node_modules/cuid/lib/getRandomValue.browser.js"(exports, module) {
      var getRandomValue;
      var crypto = typeof window !== "undefined" && (window.crypto || window.msCrypto) || typeof self !== "undefined" && self.crypto;
      if (crypto) {
        lim = Math.pow(2, 32) - 1;
        getRandomValue = function() {
          return Math.abs(crypto.getRandomValues(new Uint32Array(1))[0] / lim);
        };
      } else {
        getRandomValue = Math.random;
      }
      var lim;
      module.exports = getRandomValue;
    }
  });

  // core/front/node_modules/cuid/index.js
  var require_cuid = __commonJS({
    "core/front/node_modules/cuid/index.js"(exports, module) {
      var fingerprint = require_fingerprint_browser();
      var pad = require_pad();
      var getRandomValue = require_getRandomValue_browser();
      var c2 = 0;
      var blockSize = 4;
      var base = 36;
      var discreteValues = Math.pow(base, blockSize);
      function randomBlock() {
        return pad((getRandomValue() * discreteValues << 0).toString(base), blockSize);
      }
      function safeCounter() {
        c2 = c2 < discreteValues ? c2 : 0;
        c2++;
        return c2 - 1;
      }
      function cuid2() {
        var letter = "c", timestamp = (/* @__PURE__ */ new Date()).getTime().toString(base), counter = pad(safeCounter().toString(base), blockSize), print = fingerprint(), random = randomBlock() + randomBlock();
        return letter + timestamp + counter + print + random;
      }
      cuid2.slug = function slug() {
        var date = (/* @__PURE__ */ new Date()).getTime().toString(36), counter = safeCounter().toString(36).slice(-4), print = fingerprint().slice(0, 1) + fingerprint().slice(-1), random = randomBlock().slice(-2);
        return date.slice(-2) + counter + print + random;
      };
      cuid2.isCuid = function isCuid(stringToCheck) {
        if (typeof stringToCheck !== "string")
          return false;
        if (stringToCheck.startsWith("c"))
          return true;
        return false;
      };
      cuid2.isSlug = function isSlug(stringToCheck) {
        if (typeof stringToCheck !== "string")
          return false;
        var stringLength = stringToCheck.length;
        if (stringLength >= 7 && stringLength <= 10)
          return true;
        return false;
      };
      cuid2.fingerprint = fingerprint;
      module.exports = cuid2;
    }
  });

  // core/rice/src/index.tsx
  var src_exports = {};
  __export(src_exports, {
    app: () => app,
    bar: () => bar,
    createApp: () => createApp,
    css: () => u,
    cx: () => cx,
    injectCSS: () => injectCSS,
    preload: () => preload,
    publicURL: () => publicURL,
    readState: () => readState
  });

  // core/rice/node_modules/@qiwi/deep-proxy/target/es6/cache.js
  var cache = { proxies: /* @__PURE__ */ new WeakMap(), traps: /* @__PURE__ */ new WeakMap() };
  var getCache = (e2, t2, a2) => e2.get(t2) || e2.set(t2, new a2()).get(t2);
  var getKey = (e2) => e2.join();
  var addToCache = (e2, t2, a2, c2, o2) => {
    getCache(getCache(cache.traps, e2, WeakMap), t2, Map).set(getKey(a2), c2), cache.proxies.set(c2, o2);
  };
  var getFromCache = (e2, t2, a2) => {
    var c2, o2;
    return cache.proxies.get(null === (o2 = null === (c2 = cache.traps.get(e2)) || void 0 === c2 ? void 0 : c2.get(t2)) || void 0 === o2 ? void 0 : o2.get(getKey(a2)));
  };

  // core/rice/node_modules/@qiwi/deep-proxy/target/es6/proxy.js
  var DEFAULT = Symbol("default");
  var trapNames = Object.keys(Object.getOwnPropertyDescriptors(Reflect));
  var trapsWithKey = ["get", "has", "set", "defineProperty", "deleteProperty", "getOwnPropertyDescriptor"];
  var parseParameters = (e2, r2) => {
    let t2, a2, o2, s2, c2, p2, n2, l2;
    switch (e2) {
      case "get":
        [t2, a2, s2] = r2;
        break;
      case "set":
        [t2, a2, o2, s2] = r2;
        break;
      case "deleteProperty":
      case "defineProperty":
        [t2, p2] = r2;
        break;
      case "has":
      case "getOwnPropertyDescriptor":
        [t2, a2] = r2;
        break;
      case "apply":
        [t2, n2, c2] = r2;
        break;
      case "construct":
        [t2, c2] = r2;
        break;
      case "setPrototypeOf":
        [t2, l2] = r2;
        break;
      default:
        [t2] = r2;
    }
    return { target: t2, name: a2, receiver: s2, val: o2, args: c2, descriptor: p2, thisValue: n2, prototype: l2 };
  };
  var createHandlerContext = (e2, r2) => {
    const { trapName: t2, handler: a2, traps: o2, root: s2, path: c2 } = e2, { target: p2, name: n2, val: l2, receiver: d, args: i2, descriptor: h2, thisValue: y, prototype: u2 } = parseParameters(t2, r2), g2 = trapsWithKey.includes(t2) ? n2 : void 0;
    return { parameters: r2, target: p2, name: n2, val: l2, args: i2, descriptor: h2, receiver: d, thisValue: y, prototype: u2, trapName: t2, traps: o2, path: c2, handler: a2, key: g2, newValue: "set" === t2 ? l2 : void 0, root: s2, get proxy() {
      return getFromCache(s2, p2, c2);
    }, get value() {
      return g2 && p2[g2];
    }, DEFAULT, PROXY: createDeepProxy.bind({ root: s2, handler: a2, path: [...c2, g2] }) };
  };
  var trap = function(...e2) {
    const { trapName: r2, handler: t2 } = this, a2 = createHandlerContext(this, e2), { PROXY: o2, DEFAULT: s2 } = a2, c2 = t2(a2);
    return c2 === o2 ? o2(a2.value) : c2 === s2 ? Reflect[r2](...e2) : c2;
  };
  var createTraps = (e2, r2, t2) => trapNames.reduce((a2, o2) => (a2[o2] = trap.bind({ trapName: o2, handler: e2, traps: a2, root: r2, path: t2 }), a2), {});
  var checkTarget = (e2) => {
    if (null === e2 || "object" != typeof e2 && "function" != typeof e2)
      throw new TypeError("Deep proxy could be applied to objects and functions only");
  };
  var defaultProxyHandler = ({ DEFAULT: e2 }) => e2;
  var createDeepProxy = function(e2, r2, t2, a2) {
    checkTarget(e2);
    const o2 = Object.assign({}, this), s2 = r2 || o2.handler || defaultProxyHandler, c2 = t2 || o2.path || [], p2 = o2.root || a2 || e2, n2 = getFromCache(p2, e2, c2);
    if (n2)
      return n2;
    const l2 = createTraps(s2, p2, c2), d = new Proxy(e2, l2);
    return addToCache(p2, e2, c2, l2, d), d;
  };
  var DeepProxy = class {
    constructor(e2, r2, t2, a2) {
      return createDeepProxy(e2, r2, t2, a2);
    }
  };

  // core/front/src/libs/app-action.ts
  var import_cuid = __toESM(require_cuid());

  // core/rpc/src/createJsonRpcRequest.ts
  var globalRequestId = 1;
  var createJsonRpcRequest = () => (action, ...payload) => {
    const currentRequestId = globalRequestId;
    globalRequestId += 1;
    return {
      // jsonrpc: '2.0',
      method: action,
      params: payload,
      id: currentRequestId.toString()
    };
  };

  // core/rpc/src/createBasicJsonRpcClient.ts
  var createBasicJsonRpcClient = (client) => ({
    send: (action, ...payload) => {
      const request = createJsonRpcRequest()(action, ...payload);
      return client.sendRequest(request);
    }
  });

  // core/rpc/src/createJsonRpcClient.ts
  var createJsonRpcClient = (client) => {
    const basicClient = createBasicJsonRpcClient(client);
    return new Proxy(basicClient, {
      get: (target, methodOrAttributeName) => {
        if (methodOrAttributeName === "then")
          return null;
        return (...rest) => {
          return target.send(methodOrAttributeName, ...rest);
        };
      }
    });
  };

  // core/front/src/libs/app-action.ts
  var createClient = (appName) => {
    const queue = {};
    if (typeof window === "undefined")
      return;
    const eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
    const listenEvent = window[eventMethod];
    const onMessage = eventMethod === "attachEvent" ? "onmessage" : "message";
    listenEvent(onMessage, function(e2) {
      const data = e2.data;
      if (queue[data.id]) {
        if ("result" in data) {
          queue[data.id].resolve(data.result);
        } else {
          queue[data.id].reject(
            data.error ? data.error.message : `Error when calling rpc.${queue[data.id].method} from app ${queue[data.id].appName}. Rice cannot get detailed error. 

(${JSON.stringify(
              data.error,
              null,
              2
            )})`
          );
        }
        delete queue[data.id];
      }
    });
    setTimeout(() => {
      app.rpc.closeApp({ appName: app.name });
      app.start();
    });
    return createJsonRpcClient({
      sendRequest(req) {
        const id = (0, import_cuid.default)();
        return new Promise(async (resolve, reject) => {
          queue[id] = { appName, method: req.method, resolve, reject };
          parent.postMessage({
            type: "app-register",
            method: req.method,
            params: req.params,
            id
          });
        });
      }
    });
  };

  // core/rice/node_modules/goober/dist/goober.modern.js
  var e = { data: "" };
  var t = (t2) => "object" == typeof window ? ((t2 ? t2.querySelector("#_goober") : window._goober) || Object.assign((t2 || document.head).appendChild(document.createElement("style")), { innerHTML: " ", id: "_goober" })).firstChild : t2 || e;
  var r = (e2) => {
    let r2 = t(e2), l2 = r2.data;
    return r2.data = "", l2;
  };
  var l = /(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g;
  var a = /\/\*[^]*?\*\/|  +/g;
  var n = /\n+/g;
  var o = (e2, t2) => {
    let r2 = "", l2 = "", a2 = "";
    for (let n2 in e2) {
      let c2 = e2[n2];
      "@" == n2[0] ? "i" == n2[1] ? r2 = n2 + " " + c2 + ";" : l2 += "f" == n2[1] ? o(c2, n2) : n2 + "{" + o(c2, "k" == n2[1] ? "" : t2) + "}" : "object" == typeof c2 ? l2 += o(c2, t2 ? t2.replace(/([^,])+/g, (e3) => n2.replace(/(^:.*)|([^,])+/g, (t3) => /&/.test(t3) ? t3.replace(/&/g, e3) : e3 ? e3 + " " + t3 : t3)) : n2) : null != c2 && (n2 = /^--/.test(n2) ? n2 : n2.replace(/[A-Z]/g, "-$&").toLowerCase(), a2 += o.p ? o.p(n2, c2) : n2 + ":" + c2 + ";");
    }
    return r2 + (t2 && a2 ? t2 + "{" + a2 + "}" : a2) + l2;
  };
  var c = {};
  var s = (e2) => {
    if ("object" == typeof e2) {
      let t2 = "";
      for (let r2 in e2)
        t2 += r2 + s(e2[r2]);
      return t2;
    }
    return e2;
  };
  var i = (e2, t2, r2, i2, p2) => {
    let u2 = s(e2), d = c[u2] || (c[u2] = ((e3) => {
      let t3 = 0, r3 = 11;
      for (; t3 < e3.length; )
        r3 = 101 * r3 + e3.charCodeAt(t3++) >>> 0;
      return "go" + r3;
    })(u2));
    if (!c[d]) {
      let t3 = u2 !== e2 ? e2 : ((e3) => {
        let t4, r3, o2 = [{}];
        for (; t4 = l.exec(e3.replace(a, "")); )
          t4[4] ? o2.shift() : t4[3] ? (r3 = t4[3].replace(n, " ").trim(), o2.unshift(o2[0][r3] = o2[0][r3] || {})) : o2[0][t4[1]] = t4[2].replace(n, " ").trim();
        return o2[0];
      })(e2);
      c[d] = o(p2 ? { ["@keyframes " + d]: t3 } : t3, r2 ? "" : "." + d);
    }
    let f = r2 && c.g ? c.g : null;
    return r2 && (c.g = c[d]), ((e3, t3, r3, l2) => {
      l2 ? t3.data = t3.data.replace(l2, e3) : -1 === t3.data.indexOf(e3) && (t3.data = r3 ? e3 + t3.data : t3.data + e3);
    })(c[d], t2, i2, f), d;
  };
  var p = (e2, t2, r2) => e2.reduce((e3, l2, a2) => {
    let n2 = t2[a2];
    if (n2 && n2.call) {
      let e4 = n2(r2), t3 = e4 && e4.props && e4.props.className || /^go/.test(e4) && e4;
      n2 = t3 ? "." + t3 : e4 && "object" == typeof e4 ? e4.props ? "" : o(e4, "") : false === e4 ? "" : e4;
    }
    return e3 + l2 + (null == n2 ? "" : n2);
  }, "");
  function u(e2) {
    let r2 = this || {}, l2 = e2.call ? e2(r2.p) : e2;
    return i(l2.unshift ? l2.raw ? p(l2, [].slice.call(arguments, 1), r2.p) : l2.reduce((e3, t2) => Object.assign(e3, t2 && t2.call ? t2(r2.p) : t2), {}) : l2, t(r2.target), r2.g, r2.o, r2.k);
  }
  var b = u.bind({ g: 1 });
  var h = u.bind({ k: 1 });

  // core/front/src/libs/cx.ts
  var cx = (...value) => {
    if (Array.isArray(value))
      return value.filter((e2) => !!e2).join(" ");
    return value;
  };

  // core/rice/src/index.tsx
  var createApp = (arg) => {
    return arg;
  };
  var app = {
    name: "",
    rpc: null,
    start: () => __async(void 0, null, function* () {
    }),
    register(name, fn) {
      this.name = name;
      this.rpc = createClient(name);
      this.start = fn;
    }
  };
  var readState = (fn) => {
    return new Promise((resolve) => __async(void 0, null, function* () {
      const getter = fn(
        new DeepProxy(
          {},
          ({ trapName, PROXY, path, key }) => {
            if (trapName === "set") {
              throw new TypeError("target is immutable");
            }
            if (key === "___READ___")
              return path;
            return PROXY({});
          }
        )
      );
    }));
  };
  var bar = {
    create: (fn) => __async(void 0, null, function* () {
      const barID = yield app.rpc.createBarElement({ appName: app.name });
      const divEl = parent.window.document.getElementById(
        barID
      );
      if (divEl) {
        fn(divEl);
        app.rpc.appendStyle("_goober", r());
      }
    })
  };
  var injectCSS = (path) => {
    app.rpc.importCSS(app.name, path);
  };
  var publicURL = (path) => {
    return `/app/${app.name}/${path}`;
  };
  var preload = (arg) => {
  };

  // core/rice/src/inject.ts
  var g = typeof window !== "undefined" ? window : globalThis;
  for (const [k, v] of Object.entries(src_exports)) {
    g[k] = v;
  }
})();
