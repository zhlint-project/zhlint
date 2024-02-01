const Rs = /^(?:(?<prefix>.+?)-,)?(?<textStart>.+?)(?:,(?<textEnd>.+?))?(?:,-(?<suffix>.+?))?$/, Ca = (e) => {
  const r = e.match(Rs);
  if (r) {
    const { prefix: t, textStart: i, textEnd: n, suffix: a } = r.groups;
    return {
      prefix: t,
      textStart: i,
      textEnd: n,
      suffix: a
    };
  }
}, Is = (e) => {
  const { ignoredByRules: r, value: t } = e, i = /<!--\s*zhlint\s*ignore:\s*(.+?)\s*-->/g;
  let n;
  for (; (n = i.exec(t)) !== null; ) {
    const a = Ca(n[1]);
    a && r.push(a);
  }
  return e;
}, Ps = /\{% ([^ ]+?) [^%]*?%\}(?:\n|\{(?!%)|[^{])*?\{% end(?:\1) %\}/g, _s = (e) => (e.modifiedValue = e.modifiedValue.replace(
  Ps,
  (r, t, i) => {
    const { length: n } = r;
    return e.ignoredByParsers.push({
      name: t,
      meta: `hexo-${t}`,
      index: i,
      length: n,
      originValue: r
    }), "@".repeat(n);
  }
), e);
let Dt;
try {
  Dt = new RegExp("(?<=^|\\n)(:::.*)\\n([\\s\\S]+?)\\n(:::)(?=\\n|$)", "g");
} catch {
  Dt = /(:::.*)\n([\s\S]+?)\n(:::)/g;
}
const Bs = (e) => (e.modifiedValue = e.modifiedValue.replace(
  Dt,
  (r, t, i, n, a) => {
    const { length: s } = r, o = t.substring(3).trim().split(" ")[0] || "default";
    return e.ignoredByParsers.push({
      name: o,
      index: a,
      length: t.length,
      originValue: t,
      meta: `vuepress-${o}-start`
    }), e.ignoredByParsers.push({
      name: o,
      index: a + s - 3,
      length: 3,
      originValue: n,
      meta: `vuepress-${o}-end`
    }), "@".repeat(t.length) + `
` + i + `
` + "@".repeat(3);
  }
), e);
function on(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var gr = Object.prototype.hasOwnProperty, xa = Object.prototype.toString, Rn = Object.defineProperty, In = Object.getOwnPropertyDescriptor, Pn = function(r) {
  return typeof Array.isArray == "function" ? Array.isArray(r) : xa.call(r) === "[object Array]";
}, _n = function(r) {
  if (!r || xa.call(r) !== "[object Object]")
    return !1;
  var t = gr.call(r, "constructor"), i = r.constructor && r.constructor.prototype && gr.call(r.constructor.prototype, "isPrototypeOf");
  if (r.constructor && !t && !i)
    return !1;
  var n;
  for (n in r)
    ;
  return typeof n > "u" || gr.call(r, n);
}, Bn = function(r, t) {
  Rn && t.name === "__proto__" ? Rn(r, t.name, {
    enumerable: !0,
    configurable: !0,
    value: t.newValue,
    writable: !0
  }) : r[t.name] = t.newValue;
}, Nn = function(r, t) {
  if (t === "__proto__")
    if (gr.call(r, t)) {
      if (In)
        return In(r, t).value;
    } else
      return;
  return r[t];
}, Ns = function e() {
  var r, t, i, n, a, s, o = arguments[0], c = 1, l = arguments.length, d = !1;
  for (typeof o == "boolean" && (d = o, o = arguments[1] || {}, c = 2), (o == null || typeof o != "object" && typeof o != "function") && (o = {}); c < l; ++c)
    if (r = arguments[c], r != null)
      for (t in r)
        i = Nn(o, t), n = Nn(r, t), o !== n && (d && n && (_n(n) || (a = Pn(n))) ? (a ? (a = !1, s = i && Pn(i) ? i : []) : s = i && _n(i) ? i : {}, Bn(o, { name: t, newValue: e(d, s, n) })) : typeof n < "u" && Bn(o, { name: t, newValue: n }));
  return o;
}, Ls = Fs;
function Fs(e) {
  if (e)
    throw e;
}
var Ie = {}.hasOwnProperty, Hs = qs;
function qs(e) {
  return !e || typeof e != "object" ? "" : Ie.call(e, "position") || Ie.call(e, "type") ? Ln(e.position) : Ie.call(e, "start") || Ie.call(e, "end") ? Ln(e) : Ie.call(e, "line") || Ie.call(e, "column") ? jt(e) : "";
}
function jt(e) {
  return (!e || typeof e != "object") && (e = {}), Fn(e.line) + ":" + Fn(e.column);
}
function Ln(e) {
  return (!e || typeof e != "object") && (e = {}), jt(e.start) + "-" + jt(e.end);
}
function Fn(e) {
  return e && typeof e == "number" ? e : 1;
}
var $s = Hs, Us = cn;
function Ra() {
}
Ra.prototype = Error.prototype;
cn.prototype = new Ra();
var Te = cn.prototype;
Te.file = "";
Te.name = "";
Te.reason = "";
Te.message = "";
Te.stack = "";
Te.fatal = null;
Te.column = null;
Te.line = null;
function cn(e, r, t) {
  var i, n, a;
  typeof r == "string" && (t = r, r = null), i = Ms(t), n = $s(r) || "1:1", a = {
    start: { line: null, column: null },
    end: { line: null, column: null }
  }, r && r.position && (r = r.position), r && (r.start ? (a = r, r = r.start) : a.start = r), e.stack && (this.stack = e.stack, e = e.message), this.message = e, this.name = n, this.reason = e, this.line = r ? r.line : null, this.column = r ? r.column : null, this.location = a, this.source = i[0], this.ruleId = i[1];
}
function Ms(e) {
  var r = [null, null], t;
  return typeof e == "string" && (t = e.indexOf(":"), t === -1 ? r[1] = e : (r[0] = e.slice(0, t), r[1] = e.slice(t + 1))), r;
}
var Me = {};
Me.basename = Vs;
Me.dirname = Ws;
Me.extname = Ds;
Me.join = js;
Me.sep = "/";
function Vs(e, r) {
  var t = 0, i = -1, n, a, s, o;
  if (r !== void 0 && typeof r != "string")
    throw new TypeError('"ext" argument must be a string');
  if (er(e), n = e.length, r === void 0 || !r.length || r.length > e.length) {
    for (; n--; )
      if (e.charCodeAt(n) === 47) {
        if (s) {
          t = n + 1;
          break;
        }
      } else
        i < 0 && (s = !0, i = n + 1);
    return i < 0 ? "" : e.slice(t, i);
  }
  if (r === e)
    return "";
  for (a = -1, o = r.length - 1; n--; )
    if (e.charCodeAt(n) === 47) {
      if (s) {
        t = n + 1;
        break;
      }
    } else
      a < 0 && (s = !0, a = n + 1), o > -1 && (e.charCodeAt(n) === r.charCodeAt(o--) ? o < 0 && (i = n) : (o = -1, i = a));
  return t === i ? i = a : i < 0 && (i = e.length), e.slice(t, i);
}
function Ws(e) {
  var r, t, i;
  if (er(e), !e.length)
    return ".";
  for (r = -1, i = e.length; --i; )
    if (e.charCodeAt(i) === 47) {
      if (t) {
        r = i;
        break;
      }
    } else
      t || (t = !0);
  return r < 0 ? e.charCodeAt(0) === 47 ? "/" : "." : r === 1 && e.charCodeAt(0) === 47 ? "//" : e.slice(0, r);
}
function Ds(e) {
  var r = -1, t = 0, i = -1, n = 0, a, s, o;
  for (er(e), o = e.length; o--; ) {
    if (s = e.charCodeAt(o), s === 47) {
      if (a) {
        t = o + 1;
        break;
      }
      continue;
    }
    i < 0 && (a = !0, i = o + 1), s === 46 ? r < 0 ? r = o : n !== 1 && (n = 1) : r > -1 && (n = -1);
  }
  return r < 0 || i < 0 || // We saw a non-dot character immediately before the dot.
  n === 0 || // The (right-most) trimmed path component is exactly `..`.
  n === 1 && r === i - 1 && r === t + 1 ? "" : e.slice(r, i);
}
function js() {
  for (var e = -1, r; ++e < arguments.length; )
    er(arguments[e]), arguments[e] && (r = r === void 0 ? arguments[e] : r + "/" + arguments[e]);
  return r === void 0 ? "." : zs(r);
}
function zs(e) {
  var r, t;
  return er(e), r = e.charCodeAt(0) === 47, t = Gs(e, !r), !t.length && !r && (t = "."), t.length && e.charCodeAt(e.length - 1) === 47 && (t += "/"), r ? "/" + t : t;
}
function Gs(e, r) {
  for (var t = "", i = 0, n = -1, a = 0, s = -1, o, c; ++s <= e.length; ) {
    if (s < e.length)
      o = e.charCodeAt(s);
    else {
      if (o === 47)
        break;
      o = 47;
    }
    if (o === 47) {
      if (!(n === s - 1 || a === 1))
        if (n !== s - 1 && a === 2) {
          if (t.length < 2 || i !== 2 || t.charCodeAt(t.length - 1) !== 46 || t.charCodeAt(t.length - 2) !== 46) {
            if (t.length > 2) {
              if (c = t.lastIndexOf("/"), c !== t.length - 1) {
                c < 0 ? (t = "", i = 0) : (t = t.slice(0, c), i = t.length - 1 - t.lastIndexOf("/")), n = s, a = 0;
                continue;
              }
            } else if (t.length) {
              t = "", i = 0, n = s, a = 0;
              continue;
            }
          }
          r && (t = t.length ? t + "/.." : "..", i = 2);
        } else
          t.length ? t += "/" + e.slice(n + 1, s) : t = e.slice(n + 1, s), i = s - n - 1;
      n = s, a = 0;
    } else
      o === 46 && a > -1 ? a++ : a = -1;
  }
  return t;
}
function er(e) {
  if (typeof e != "string")
    throw new TypeError(
      "Path must be a string. Received " + JSON.stringify(e)
    );
}
var Ia = {};
Ia.cwd = Ks;
function Ks() {
  return "/";
}
/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
var Qs = function(r) {
  return r != null && r.constructor != null && typeof r.constructor.isBuffer == "function" && r.constructor.isBuffer(r);
}, he = Me, Ys = Ia, Js = Qs, Xs = ve, Zs = {}.hasOwnProperty, Pr = ["history", "path", "basename", "stem", "extname", "dirname"];
ve.prototype.toString = fo;
Object.defineProperty(ve.prototype, "path", { get: eo, set: ro });
Object.defineProperty(ve.prototype, "dirname", {
  get: to,
  set: no
});
Object.defineProperty(ve.prototype, "basename", {
  get: io,
  set: ao
});
Object.defineProperty(ve.prototype, "extname", {
  get: so,
  set: oo
});
Object.defineProperty(ve.prototype, "stem", { get: co, set: lo });
function ve(e) {
  var r, t;
  if (!e)
    e = {};
  else if (typeof e == "string" || Js(e))
    e = { contents: e };
  else if ("message" in e && "messages" in e)
    return e;
  if (!(this instanceof ve))
    return new ve(e);
  for (this.data = {}, this.messages = [], this.history = [], this.cwd = Ys.cwd(), t = -1; ++t < Pr.length; )
    r = Pr[t], Zs.call(e, r) && (this[r] = e[r]);
  for (r in e)
    Pr.indexOf(r) < 0 && (this[r] = e[r]);
}
function eo() {
  return this.history[this.history.length - 1];
}
function ro(e) {
  fn(e, "path"), this.path !== e && this.history.push(e);
}
function to() {
  return typeof this.path == "string" ? he.dirname(this.path) : void 0;
}
function no(e) {
  Pa(this.path, "dirname"), this.path = he.join(e || "", this.basename);
}
function io() {
  return typeof this.path == "string" ? he.basename(this.path) : void 0;
}
function ao(e) {
  fn(e, "basename"), ln(e, "basename"), this.path = he.join(this.dirname || "", e);
}
function so() {
  return typeof this.path == "string" ? he.extname(this.path) : void 0;
}
function oo(e) {
  if (ln(e, "extname"), Pa(this.path, "extname"), e) {
    if (e.charCodeAt(0) !== 46)
      throw new Error("`extname` must start with `.`");
    if (e.indexOf(".", 1) > -1)
      throw new Error("`extname` cannot contain multiple dots");
  }
  this.path = he.join(this.dirname, this.stem + (e || ""));
}
function co() {
  return typeof this.path == "string" ? he.basename(this.path, this.extname) : void 0;
}
function lo(e) {
  fn(e, "stem"), ln(e, "stem"), this.path = he.join(this.dirname || "", e + (this.extname || ""));
}
function fo(e) {
  return (this.contents || "").toString(e);
}
function ln(e, r) {
  if (e && e.indexOf(he.sep) > -1)
    throw new Error(
      "`" + r + "` cannot be a path: did not expect `" + he.sep + "`"
    );
}
function fn(e, r) {
  if (!e)
    throw new Error("`" + r + "` cannot be empty");
}
function Pa(e, r) {
  if (!e)
    throw new Error("Setting `" + r + "` requires `path` to be set too");
}
var uo = Us, Er = Xs, ho = Er;
Er.prototype.message = po;
Er.prototype.info = go;
Er.prototype.fail = vo;
function po(e, r, t) {
  var i = new uo(e, r, t);
  return this.path && (i.name = this.path + ":" + i.name, i.file = this.path), i.fatal = !1, this.messages.push(i), i;
}
function vo() {
  var e = this.message.apply(this, arguments);
  throw e.fatal = !0, e;
}
function go() {
  var e = this.message.apply(this, arguments);
  return e.fatal = null, e;
}
var mo = ho, Ao = [].slice, yo = wo;
function wo(e, r) {
  var t;
  return i;
  function i() {
    var s = Ao.call(arguments, 0), o = e.length > s.length, c;
    o && s.push(n);
    try {
      c = e.apply(null, s);
    } catch (l) {
      if (o && t)
        throw l;
      return n(l);
    }
    o || (c && typeof c.then == "function" ? c.then(a, n) : c instanceof Error ? n(c) : a(c));
  }
  function n() {
    t || (t = !0, r.apply(null, arguments));
  }
  function a(s) {
    n(null, s);
  }
}
var _a = yo, Eo = Ba;
Ba.wrap = _a;
var Hn = [].slice;
function Ba() {
  var e = [], r = {};
  return r.run = t, r.use = i, r;
  function t() {
    var n = -1, a = Hn.call(arguments, 0, -1), s = arguments[arguments.length - 1];
    if (typeof s != "function")
      throw new Error("Expected function as last argument, not " + s);
    o.apply(null, [null].concat(a));
    function o(c) {
      var l = e[++n], d = Hn.call(arguments, 0), u = d.slice(1), A = a.length, v = -1;
      if (c) {
        s(c);
        return;
      }
      for (; ++v < A; )
        (u[v] === null || u[v] === void 0) && (u[v] = a[v]);
      a = u, l ? _a(l, o).apply(null, a) : s.apply(null, [null].concat(a));
    }
  }
  function i(n) {
    if (typeof n != "function")
      throw new Error("Expected `fn` to be a function, not " + n);
    return e.push(n), r;
  }
}
var To = (e) => {
  if (Object.prototype.toString.call(e) !== "[object Object]")
    return !1;
  const r = Object.getPrototypeOf(e);
  return r === null || r === Object.prototype;
}, ar = Ns, qn = Ls, Ge = mo, Na = Eo, $n = To, bo = La().freeze(), ko = [].slice, So = {}.hasOwnProperty, Oo = Na().use(Co).use(xo).use(Ro);
function Co(e, r) {
  r.tree = e.parse(r.file);
}
function xo(e, r, t) {
  e.run(r.tree, r.file, i);
  function i(n, a, s) {
    n ? t(n) : (r.tree = a, r.file = s, t());
  }
}
function Ro(e, r) {
  r.file.contents = e.stringify(r.tree, r.file);
}
function La() {
  var e = [], r = Na(), t = {}, i = !1, n = -1;
  return a.data = o, a.freeze = s, a.attachers = e, a.use = c, a.parse = d, a.stringify = v, a.run = u, a.runSync = A, a.process = g, a.processSync = w, a;
  function a() {
    for (var f = La(), h = e.length, p = -1; ++p < h; )
      f.use.apply(null, e[p]);
    return f.data(ar(!0, {}, t)), f;
  }
  function s() {
    var f, h, p, m;
    if (i)
      return a;
    for (; ++n < e.length; )
      f = e[n], h = f[0], p = f[1], m = null, p !== !1 && (p === !0 && (f[1] = void 0), m = h.apply(a, f.slice(1)), typeof m == "function" && r.use(m));
    return i = !0, n = 1 / 0, a;
  }
  function o(f, h) {
    return typeof f == "string" ? arguments.length === 2 ? (Nr("data", i), t[f] = h, a) : So.call(t, f) && t[f] || null : f ? (Nr("data", i), t = f, a) : t;
  }
  function c(f) {
    var h;
    if (Nr("use", i), f != null)
      if (typeof f == "function")
        y.apply(null, arguments);
      else if (typeof f == "object")
        "length" in f ? T(f) : p(f);
      else
        throw new Error("Expected usable value, not `" + f + "`");
    return h && (t.settings = ar(t.settings || {}, h)), a;
    function p(b) {
      T(b.plugins), b.settings && (h = ar(h || {}, b.settings));
    }
    function m(b) {
      if (typeof b == "function")
        y(b);
      else if (typeof b == "object")
        "length" in b ? y.apply(null, b) : p(b);
      else
        throw new Error("Expected usable value, not `" + b + "`");
    }
    function T(b) {
      var k, x;
      if (b != null)
        if (typeof b == "object" && "length" in b)
          for (k = b.length, x = -1; ++x < k; )
            m(b[x]);
        else
          throw new Error("Expected a list of plugins, not `" + b + "`");
    }
    function y(b, k) {
      var x = l(b);
      x ? ($n(x[1]) && $n(k) && (k = ar(x[1], k)), x[1] = k) : e.push(ko.call(arguments));
    }
  }
  function l(f) {
    for (var h = e.length, p = -1, m; ++p < h; )
      if (m = e[p], m[0] === f)
        return m;
  }
  function d(f) {
    var h = Ge(f), p;
    return s(), p = a.Parser, _r("parse", p), Un(p, "parse") ? new p(String(h), h).parse() : p(String(h), h);
  }
  function u(f, h, p) {
    if (Mn(f), s(), !p && typeof h == "function" && (p = h, h = null), !p)
      return new Promise(m);
    m(null, p);
    function m(T, y) {
      r.run(f, Ge(h), b);
      function b(k, x, E) {
        x = x || f, k ? y(k) : T ? T(x) : p(null, x, E);
      }
    }
  }
  function A(f, h) {
    var p = !1, m;
    return u(f, h, T), Vn("runSync", "run", p), m;
    function T(y, b) {
      p = !0, qn(y), m = b;
    }
  }
  function v(f, h) {
    var p = Ge(h), m;
    return s(), m = a.Compiler, Br("stringify", m), Mn(f), Un(m, "compile") ? new m(f, p).compile() : m(f, p);
  }
  function g(f, h) {
    if (s(), _r("process", a.Parser), Br("process", a.Compiler), !h)
      return new Promise(p);
    p(null, h);
    function p(m, T) {
      var y = Ge(f);
      Oo.run(a, { file: y }, b);
      function b(k) {
        k ? T(k) : m ? m(y) : h(null, y);
      }
    }
  }
  function w(f) {
    var h = !1, p;
    return s(), _r("processSync", a.Parser), Br("processSync", a.Compiler), p = Ge(f), g(p, m), Vn("processSync", "process", h), p;
    function m(T) {
      h = !0, qn(T);
    }
  }
}
function Un(e, r) {
  return typeof e == "function" && e.prototype && // A function with keys in its prototype is probably a constructor.
  // Classes’ prototype methods are not enumerable, so we check if some value
  // exists in the prototype.
  (Io(e.prototype) || r in e.prototype);
}
function Io(e) {
  var r;
  for (r in e)
    return !0;
  return !1;
}
function _r(e, r) {
  if (typeof r != "function")
    throw new Error("Cannot `" + e + "` without `Parser`");
}
function Br(e, r) {
  if (typeof r != "function")
    throw new Error("Cannot `" + e + "` without `Compiler`");
}
function Nr(e, r) {
  if (r)
    throw new Error(
      "Cannot invoke `" + e + "` on a frozen processor.\nCreate a new processor first, by invoking it: use `processor()` instead of `processor`."
    );
}
function Mn(e) {
  if (!e || typeof e.type != "string")
    throw new Error("Expected node, got `" + e + "`");
}
function Vn(e, r, t) {
  if (!t)
    throw new Error(
      "`" + e + "` finished async. Use `" + r + "` instead"
    );
}
const Po = /* @__PURE__ */ on(bo);
var Re = Bo, _o = Object.prototype.hasOwnProperty;
function Bo() {
  for (var e = {}, r = 0; r < arguments.length; r++) {
    var t = arguments[r];
    for (var i in t)
      _o.call(t, i) && (e[i] = t[i]);
  }
  return e;
}
var zt = { exports: {} };
typeof Object.create == "function" ? zt.exports = function(r, t) {
  t && (r.super_ = t, r.prototype = Object.create(t.prototype, {
    constructor: {
      value: r,
      enumerable: !1,
      writable: !0,
      configurable: !0
    }
  }));
} : zt.exports = function(r, t) {
  if (t) {
    r.super_ = t;
    var i = function() {
    };
    i.prototype = t.prototype, r.prototype = new i(), r.prototype.constructor = r;
  }
};
var No = zt.exports, Lo = Re, Wn = No, Fo = Ho;
function Ho(e) {
  var r, t, i;
  Wn(a, e), Wn(n, a), r = a.prototype;
  for (t in r)
    i = r[t], i && typeof i == "object" && (r[t] = "concat" in i ? i.concat() : Lo(i));
  return a;
  function n(s) {
    return e.apply(this, s);
  }
  function a() {
    return this instanceof a ? e.apply(this, arguments) : new n(arguments);
  }
}
var qo = $o;
function $o(e, r, t) {
  return i;
  function i() {
    var n = t || this, a = n[e];
    return n[e] = !r, s;
    function s() {
      n[e] = a;
    }
  }
}
var Uo = Mo;
function Mo(e) {
  var r = Do(String(e));
  return {
    toPosition: Vo(r),
    toOffset: Wo(r)
  };
}
function Vo(e) {
  return r;
  function r(t) {
    var i = -1, n = e.length;
    if (t < 0)
      return {};
    for (; ++i < n; )
      if (e[i] > t)
        return {
          line: i + 1,
          column: t - (e[i - 1] || 0) + 1,
          offset: t
        };
    return {};
  }
}
function Wo(e) {
  return r;
  function r(t) {
    var i = t && t.line, n = t && t.column;
    return !isNaN(i) && !isNaN(n) && i - 1 in e ? (e[i - 2] || 0) + n - 1 || 0 : -1;
  }
}
function Do(e) {
  for (var r = [], t = e.indexOf(`
`); t !== -1; )
    r.push(t + 1), t = e.indexOf(`
`, t + 1);
  return r.push(e.length + 1), r;
}
var jo = zo, Lr = "\\";
function zo(e, r) {
  return t;
  function t(i) {
    for (var n = 0, a = i.indexOf(Lr), s = e[r], o = [], c; a !== -1; )
      o.push(i.slice(n, a)), n = a + 1, c = i.charAt(n), (!c || s.indexOf(c) === -1) && o.push(Lr), a = i.indexOf(Lr, n + 1);
    return o.push(i.slice(n)), o.join("");
  }
}
const Go = "Æ", Ko = "&", Qo = "Á", Yo = "Â", Jo = "À", Xo = "Å", Zo = "Ã", ec = "Ä", rc = "©", tc = "Ç", nc = "Ð", ic = "É", ac = "Ê", sc = "È", oc = "Ë", cc = ">", lc = "Í", fc = "Î", uc = "Ì", dc = "Ï", hc = "<", pc = "Ñ", vc = "Ó", gc = "Ô", mc = "Ò", Ac = "Ø", yc = "Õ", wc = "Ö", Ec = '"', Tc = "®", bc = "Þ", kc = "Ú", Sc = "Û", Oc = "Ù", Cc = "Ü", xc = "Ý", Rc = "á", Ic = "â", Pc = "´", _c = "æ", Bc = "à", Nc = "&", Lc = "å", Fc = "ã", Hc = "ä", qc = "¦", $c = "ç", Uc = "¸", Mc = "¢", Vc = "©", Wc = "¤", Dc = "°", jc = "÷", zc = "é", Gc = "ê", Kc = "è", Qc = "ð", Yc = "ë", Jc = "½", Xc = "¼", Zc = "¾", el = ">", rl = "í", tl = "î", nl = "¡", il = "ì", al = "¿", sl = "ï", ol = "«", cl = "<", ll = "¯", fl = "µ", ul = "·", dl = " ", hl = "¬", pl = "ñ", vl = "ó", gl = "ô", ml = "ò", Al = "ª", yl = "º", wl = "ø", El = "õ", Tl = "ö", bl = "¶", kl = "±", Sl = "£", Ol = '"', Cl = "»", xl = "®", Rl = "§", Il = "­", Pl = "¹", _l = "²", Bl = "³", Nl = "ß", Ll = "þ", Fl = "×", Hl = "ú", ql = "û", $l = "ù", Ul = "¨", Ml = "ü", Vl = "ý", Wl = "¥", Dl = "ÿ", jl = {
  AElig: Go,
  AMP: Ko,
  Aacute: Qo,
  Acirc: Yo,
  Agrave: Jo,
  Aring: Xo,
  Atilde: Zo,
  Auml: ec,
  COPY: rc,
  Ccedil: tc,
  ETH: nc,
  Eacute: ic,
  Ecirc: ac,
  Egrave: sc,
  Euml: oc,
  GT: cc,
  Iacute: lc,
  Icirc: fc,
  Igrave: uc,
  Iuml: dc,
  LT: hc,
  Ntilde: pc,
  Oacute: vc,
  Ocirc: gc,
  Ograve: mc,
  Oslash: Ac,
  Otilde: yc,
  Ouml: wc,
  QUOT: Ec,
  REG: Tc,
  THORN: bc,
  Uacute: kc,
  Ucirc: Sc,
  Ugrave: Oc,
  Uuml: Cc,
  Yacute: xc,
  aacute: Rc,
  acirc: Ic,
  acute: Pc,
  aelig: _c,
  agrave: Bc,
  amp: Nc,
  aring: Lc,
  atilde: Fc,
  auml: Hc,
  brvbar: qc,
  ccedil: $c,
  cedil: Uc,
  cent: Mc,
  copy: Vc,
  curren: Wc,
  deg: Dc,
  divide: jc,
  eacute: zc,
  ecirc: Gc,
  egrave: Kc,
  eth: Qc,
  euml: Yc,
  frac12: Jc,
  frac14: Xc,
  frac34: Zc,
  gt: el,
  iacute: rl,
  icirc: tl,
  iexcl: nl,
  igrave: il,
  iquest: al,
  iuml: sl,
  laquo: ol,
  lt: cl,
  macr: ll,
  micro: fl,
  middot: ul,
  nbsp: dl,
  not: hl,
  ntilde: pl,
  oacute: vl,
  ocirc: gl,
  ograve: ml,
  ordf: Al,
  ordm: yl,
  oslash: wl,
  otilde: El,
  ouml: Tl,
  para: bl,
  plusmn: kl,
  pound: Sl,
  quot: Ol,
  raquo: Cl,
  reg: xl,
  sect: Rl,
  shy: Il,
  sup1: Pl,
  sup2: _l,
  sup3: Bl,
  szlig: Nl,
  thorn: Ll,
  times: Fl,
  uacute: Hl,
  ucirc: ql,
  ugrave: $l,
  uml: Ul,
  uuml: Ml,
  yacute: Vl,
  yen: Wl,
  yuml: Dl
}, zl = {
  0: "�",
  128: "€",
  130: "‚",
  131: "ƒ",
  132: "„",
  133: "…",
  134: "†",
  135: "‡",
  136: "ˆ",
  137: "‰",
  138: "Š",
  139: "‹",
  140: "Œ",
  142: "Ž",
  145: "‘",
  146: "’",
  147: "“",
  148: "”",
  149: "•",
  150: "–",
  151: "—",
  152: "˜",
  153: "™",
  154: "š",
  155: "›",
  156: "œ",
  158: "ž",
  159: "Ÿ"
};
var Tr = Gl;
function Gl(e) {
  var r = typeof e == "string" ? e.charCodeAt(0) : e;
  return r >= 48 && r <= 57;
}
var Kl = Ql;
function Ql(e) {
  var r = typeof e == "string" ? e.charCodeAt(0) : e;
  return r >= 97 && r <= 102 || r >= 65 && r <= 70 || r >= 48 && r <= 57;
}
var Fr, Dn;
function Fa() {
  if (Dn)
    return Fr;
  Dn = 1, Fr = e;
  function e(r) {
    var t = typeof r == "string" ? r.charCodeAt(0) : r;
    return t >= 97 && t <= 122 || t >= 65 && t <= 90;
  }
  return Fr;
}
var Yl = Fa(), Jl = Tr, Xl = Zl;
function Zl(e) {
  return Yl(e) || Jl(e);
}
var sr, ef = 59, rf = tf;
function tf(e) {
  var r = "&" + e + ";", t;
  return sr = sr || document.createElement("i"), sr.innerHTML = r, t = sr.textContent, t.charCodeAt(t.length - 1) === ef && e !== "semi" || t === r ? !1 : t;
}
var jn = jl, zn = zl, nf = Tr, af = Kl, Ha = Xl, sf = rf, un = yf, of = {}.hasOwnProperty, Pe = String.fromCharCode, cf = Function.prototype, Gn = {
  warning: null,
  reference: null,
  text: null,
  warningContext: null,
  referenceContext: null,
  textContext: null,
  position: {},
  additional: null,
  attribute: !1,
  nonTerminated: !0
}, lf = 9, Kn = 10, ff = 12, uf = 32, Qn = 38, df = 59, hf = 60, pf = 61, vf = 35, gf = 88, mf = 120, Af = 65533, Ne = "named", dn = "hexadecimal", hn = "decimal", pn = {};
pn[dn] = 16;
pn[hn] = 10;
var br = {};
br[Ne] = Ha;
br[hn] = nf;
br[dn] = af;
var qa = 1, $a = 2, Ua = 3, Ma = 4, Va = 5, Gt = 6, Wa = 7, be = {};
be[qa] = "Named character references must be terminated by a semicolon";
be[$a] = "Numeric character references must be terminated by a semicolon";
be[Ua] = "Named character references cannot be empty";
be[Ma] = "Numeric character references cannot be empty";
be[Va] = "Named character references must be known";
be[Gt] = "Numeric character references cannot be disallowed";
be[Wa] = "Numeric character references cannot be outside the permissible Unicode range";
function yf(e, r) {
  var t = {}, i, n;
  r || (r = {});
  for (n in Gn)
    i = r[n], t[n] = i ?? Gn[n];
  return (t.position.indent || t.position.start) && (t.indent = t.position.indent || [], t.position = t.position.start), wf(e, t);
}
function wf(e, r) {
  var t = r.additional, i = r.nonTerminated, n = r.text, a = r.reference, s = r.warning, o = r.textContext, c = r.referenceContext, l = r.warningContext, d = r.position, u = r.indent || [], A = e.length, v = 0, g = -1, w = d.column || 1, f = d.line || 1, h = "", p = [], m, T, y, b, k, x, E, C, O, R, S, I, N, _, q, P, $, M, B;
  for (typeof t == "string" && (t = t.charCodeAt(0)), P = H(), C = s ? Y : cf, v--, A++; ++v < A; )
    if (k === Kn && (w = u[g] || 1), k = e.charCodeAt(v), k === Qn) {
      if (E = e.charCodeAt(v + 1), E === lf || E === Kn || E === ff || E === uf || E === Qn || E === hf || E !== E || t && E === t) {
        h += Pe(k), w++;
        continue;
      }
      for (N = v + 1, I = N, B = N, E === vf ? (B = ++I, E = e.charCodeAt(B), E === gf || E === mf ? (_ = dn, B = ++I) : _ = hn) : _ = Ne, m = "", S = "", b = "", q = br[_], B--; ++B < A && (E = e.charCodeAt(B), !!q(E)); )
        b += Pe(E), _ === Ne && of.call(jn, b) && (m = b, S = jn[b]);
      y = e.charCodeAt(B) === df, y && (B++, T = _ === Ne ? sf(b) : !1, T && (m = b, S = T)), M = 1 + B - N, !y && !i || (b ? _ === Ne ? (y && !S ? C(Va, 1) : (m !== b && (B = I + m.length, M = 1 + B - I, y = !1), y || (O = m ? qa : Ua, r.attribute ? (E = e.charCodeAt(B), E === pf ? (C(O, M), S = null) : Ha(E) ? S = null : C(O, M)) : C(O, M))), x = S) : (y || C($a, M), x = parseInt(b, pn[_]), Ef(x) ? (C(Wa, M), x = Pe(Af)) : x in zn ? (C(Gt, M), x = zn[x]) : (R = "", Tf(x) && C(Gt, M), x > 65535 && (x -= 65536, R += Pe(x >>> 10 | 55296), x = 56320 | x & 1023), x = R + Pe(x))) : _ !== Ne && C(Ma, M)), x ? (L(), P = H(), v = B - 1, w += B - N + 1, p.push(x), $ = H(), $.offset++, a && a.call(
        c,
        x,
        { start: P, end: $ },
        e.slice(N - 1, B)
      ), P = $) : (b = e.slice(N - 1, B), h += b, w += b.length, v = B - 1);
    } else
      k === 10 && (f++, g++, w = 0), k === k ? (h += Pe(k), w++) : L();
  return p.join("");
  function H() {
    return {
      line: f,
      column: w,
      offset: v + (d.offset || 0)
    };
  }
  function Y(J, Q) {
    var ie = H();
    ie.column += Q, ie.offset += Q, s.call(l, be[J], ie, J);
  }
  function L() {
    h && (p.push(h), n && n.call(o, h, { start: P, end: H() }), h = "");
  }
}
function Ef(e) {
  return e >= 55296 && e <= 57343 || e > 1114111;
}
function Tf(e) {
  return e >= 1 && e <= 8 || e === 11 || e >= 13 && e <= 31 || e >= 127 && e <= 159 || e >= 64976 && e <= 65007 || (e & 65535) === 65535 || (e & 65535) === 65534;
}
var bf = Re, Yn = un, kf = Sf;
function Sf(e) {
  return t.raw = i, t;
  function r(a) {
    for (var s = e.offset, o = a.line, c = []; ++o && o in s; )
      c.push((s[o] || 0) + 1);
    return { start: a, indent: c };
  }
  function t(a, s, o) {
    Yn(a, {
      position: r(s),
      warning: n,
      text: o,
      reference: o,
      textContext: e,
      referenceContext: e
    });
  }
  function i(a, s, o) {
    return Yn(
      a,
      bf(o, { position: r(s), warning: n })
    );
  }
  function n(a, s, o) {
    o !== 3 && e.file.message(a, s);
  }
}
var Of = Cf;
function Cf(e) {
  return r;
  function r(t, i) {
    var n = this, a = n.offset, s = [], o = n[e + "Methods"], c = n[e + "Tokenizers"], l = i.line, d = i.column, u, A, v, g, w, f;
    if (!t)
      return s;
    for (x.now = m, x.file = n.file, h(""); t; ) {
      for (u = -1, A = o.length, w = !1; ++u < A && (g = o[u], v = c[g], !(v && /* istanbul ignore next */
      (!v.onlyAtStart || n.atStart) && (!v.notInList || !n.inList) && (!v.notInBlock || !n.inBlock) && (!v.notInLink || !n.inLink) && (f = t.length, v.apply(n, [x, t]), w = f !== t.length, w))); )
        ;
      w || n.file.fail(new Error("Infinite loop"), x.now());
    }
    return n.eof = m(), s;
    function h(E) {
      for (var C = -1, O = E.indexOf(`
`); O !== -1; )
        l++, C = O, O = E.indexOf(`
`, O + 1);
      C === -1 ? d += E.length : d = E.length - C, l in a && (C !== -1 ? d += a[l] : d <= a[l] && (d = a[l] + 1));
    }
    function p() {
      var E = [], C = l + 1;
      return function() {
        for (var O = l + 1; C < O; )
          E.push((a[C] || 0) + 1), C++;
        return E;
      };
    }
    function m() {
      var E = { line: l, column: d };
      return E.offset = n.toOffset(E), E;
    }
    function T(E) {
      this.start = E, this.end = m();
    }
    function y(E) {
      t.slice(0, E.length) !== E && n.file.fail(
        new Error(
          "Incorrectly eaten value: please report this warning on https://git.io/vg5Ft"
        ),
        m()
      );
    }
    function b() {
      var E = m();
      return C;
      function C(O, R) {
        var S = O.position, I = S ? S.start : E, N = [], _ = S && S.end.line, q = E.line;
        if (O.position = new T(I), S && R && S.indent) {
          if (N = S.indent, _ < q) {
            for (; ++_ < q; )
              N.push((a[_] || 0) + 1);
            N.push(E.column);
          }
          R = N.concat(R);
        }
        return O.position.indent = R || [], O;
      }
    }
    function k(E, C) {
      var O = C ? C.children : s, R = O[O.length - 1], S;
      return R && E.type === R.type && (E.type === "text" || E.type === "blockquote") && Jn(R) && Jn(E) && (S = E.type === "text" ? xf : Rf, E = S.call(n, R, E)), E !== R && O.push(E), n.atStart && s.length !== 0 && n.exitStart(), E;
    }
    function x(E) {
      var C = p(), O = b(), R = m();
      return y(E), S.reset = I, I.test = N, S.test = N, t = t.slice(E.length), h(E), C = C(), S;
      function S(_, q) {
        return O(k(O(_), q), C);
      }
      function I() {
        var _ = S.apply(null, arguments);
        return l = R.line, d = R.column, t = E + t, _;
      }
      function N() {
        var _ = O({});
        return l = R.line, d = R.column, t = E + t, _.position;
      }
    }
  }
}
function Jn(e) {
  var r, t;
  return e.type !== "text" || !e.position ? !0 : (r = e.position.start, t = e.position.end, r.line !== t.line || t.column - r.column === e.value.length);
}
function xf(e, r) {
  return e.value += r.value, e;
}
function Rf(e, r) {
  return this.options.commonmark || this.options.gfm ? r : (e.children = e.children.concat(r.children), e);
}
var Hr, Xn;
function If() {
  if (Xn)
    return Hr;
  Xn = 1, Hr = i;
  var e = [
    "\\",
    "`",
    "*",
    "{",
    "}",
    "[",
    "]",
    "(",
    ")",
    "#",
    "+",
    "-",
    ".",
    "!",
    "_",
    ">"
  ], r = e.concat(["~", "|"]), t = r.concat([
    `
`,
    '"',
    "$",
    "%",
    "&",
    "'",
    ",",
    "/",
    ":",
    ";",
    "<",
    "=",
    "?",
    "@",
    "^"
  ]);
  i.default = e, i.gfm = r, i.commonmark = t;
  function i(n) {
    var a = n || {};
    return a.commonmark ? t : a.gfm ? r : e;
  }
  return Hr;
}
var qr, Zn;
function Pf() {
  return Zn || (Zn = 1, qr = [
    "address",
    "article",
    "aside",
    "base",
    "basefont",
    "blockquote",
    "body",
    "caption",
    "center",
    "col",
    "colgroup",
    "dd",
    "details",
    "dialog",
    "dir",
    "div",
    "dl",
    "dt",
    "fieldset",
    "figcaption",
    "figure",
    "footer",
    "form",
    "frame",
    "frameset",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "head",
    "header",
    "hgroup",
    "hr",
    "html",
    "iframe",
    "legend",
    "li",
    "link",
    "main",
    "menu",
    "menuitem",
    "meta",
    "nav",
    "noframes",
    "ol",
    "optgroup",
    "option",
    "p",
    "param",
    "pre",
    "section",
    "source",
    "title",
    "summary",
    "table",
    "tbody",
    "td",
    "tfoot",
    "th",
    "thead",
    "title",
    "tr",
    "track",
    "ul"
  ]), qr;
}
var $r, ei;
function Da() {
  return ei || (ei = 1, $r = {
    position: !0,
    gfm: !0,
    commonmark: !1,
    footnotes: !1,
    pedantic: !1,
    blocks: Pf()
  }), $r;
}
var Ur, ri;
function _f() {
  if (ri)
    return Ur;
  ri = 1;
  var e = Re, r = If(), t = Da();
  Ur = i;
  function i(n) {
    var a = this, s = a.options, o, c;
    if (n == null)
      n = {};
    else if (typeof n == "object")
      n = e(n);
    else
      throw new Error("Invalid value `" + n + "` for setting `options`");
    for (o in t) {
      if (c = n[o], c == null && (c = s[o]), o !== "blocks" && typeof c != "boolean" || o === "blocks" && typeof c != "object")
        throw new Error(
          "Invalid value `" + c + "` for setting `options." + o + "`"
        );
      n[o] = c;
    }
    return a.options = n, a.escape = r(n), a;
  }
  return Ur;
}
var Mr, ti;
function Bf() {
  if (ti)
    return Mr;
  ti = 1, Mr = e;
  function e(s) {
    if (typeof s == "string")
      return n(s);
    if (s == null)
      return a;
    if (typeof s == "object")
      return ("length" in s ? i : t)(s);
    if (typeof s == "function")
      return s;
    throw new Error("Expected function, string, or object as test");
  }
  function r(s) {
    for (var o = [], c = s.length, l = -1; ++l < c; )
      o[l] = e(s[l]);
    return o;
  }
  function t(s) {
    return o;
    function o(c) {
      var l;
      for (l in s)
        if (c[l] !== s[l])
          return !1;
      return !0;
    }
  }
  function i(s) {
    var o = r(s), c = o.length;
    return l;
    function l() {
      for (var d = -1; ++d < c; )
        if (o[d].apply(this, arguments))
          return !0;
      return !1;
    }
  }
  function n(s) {
    return o;
    function o(c) {
      return !!(c && c.type === s);
    }
  }
  function a() {
    return !0;
  }
  return Mr;
}
var Vr, ni;
function Nf() {
  if (ni)
    return Vr;
  ni = 1, Vr = n;
  var e = Bf(), r = !0, t = "skip", i = !1;
  n.CONTINUE = r, n.SKIP = t, n.EXIT = i;
  function n(s, o, c, l) {
    var d;
    typeof o == "function" && typeof c != "function" && (l = c, c = o, o = null), d = e(o), u(s, null, []);
    function u(v, g, w) {
      var f = [], h;
      return (!o || d(v, g, w[w.length - 1] || null)) && (f = a(c(v, w)), f[0] === i) ? f : v.children && f[0] !== t ? (h = a(A(v.children, w.concat(v))), h[0] === i ? h : f) : f;
    }
    function A(v, g) {
      for (var w = -1, f = l ? -1 : 1, h = (l ? v.length : w) + f, p; h > w && h < v.length; ) {
        if (p = u(v[h], h, g), p[0] === i)
          return p;
        h = typeof p[1] == "number" ? p[1] : h + f;
      }
    }
  }
  function a(s) {
    return s !== null && typeof s == "object" && "length" in s ? s : typeof s == "number" ? [r, s] : [s];
  }
  return Vr;
}
var Wr, ii;
function Lf() {
  if (ii)
    return Wr;
  ii = 1, Wr = n;
  var e = Nf(), r = e.CONTINUE, t = e.SKIP, i = e.EXIT;
  n.CONTINUE = r, n.SKIP = t, n.EXIT = i;
  function n(a, s, o, c) {
    typeof s == "function" && typeof o != "function" && (c = o, o = s, s = null), e(a, s, l, c);
    function l(d, u) {
      var A = u[u.length - 1], v = A ? A.children.indexOf(d) : null;
      return o(d, v, A);
    }
  }
  return Wr;
}
var Dr, ai;
function Ff() {
  if (ai)
    return Dr;
  ai = 1;
  var e = Lf();
  Dr = r;
  function r(n, a) {
    return e(n, a ? t : i), n;
  }
  function t(n) {
    delete n.position;
  }
  function i(n) {
    n.position = void 0;
  }
  return Dr;
}
var jr, si;
function Hf() {
  if (si)
    return jr;
  si = 1;
  var e = Re, r = Ff();
  jr = n;
  var t = `
`, i = /\r\n|\r/g;
  function n() {
    var a = this, s = String(a.file), o = { line: 1, column: 1, offset: 0 }, c = e(o), l;
    return s = s.replace(i, t), s.charCodeAt(0) === 65279 && (s = s.slice(1), c.column++, c.offset++), l = {
      type: "root",
      children: a.tokenizeBlock(s, c),
      position: { start: o, end: a.eof || e(o) }
    }, a.options.position || r(l, !0), l;
  }
  return jr;
}
var zr, oi;
function oe() {
  if (oi)
    return zr;
  oi = 1, zr = t;
  var e = String.fromCharCode, r = /\s/;
  function t(i) {
    return r.test(
      typeof i == "number" ? e(i) : i.charAt(0)
    );
  }
  return zr;
}
var Gr, ci;
function qf() {
  if (ci)
    return Gr;
  ci = 1;
  var e = oe();
  Gr = t;
  var r = `
`;
  function t(i, n, a) {
    var s = n.charAt(0), o, c, l, d;
    if (s === r) {
      if (a)
        return !0;
      for (d = 1, o = n.length, c = s, l = ""; d < o && (s = n.charAt(d), !!e(s)); )
        l += s, s === r && (c += l, l = ""), d++;
      i(c);
    }
  }
  return Gr;
}
/*!
 * repeat-string <https://github.com/jonschlinkert/repeat-string>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */
var Kr, li;
function vn() {
  if (li)
    return Kr;
  li = 1;
  var e = "", r;
  Kr = t;
  function t(i, n) {
    if (typeof i != "string")
      throw new TypeError("expected a string");
    if (n === 1)
      return i;
    if (n === 2)
      return i + i;
    var a = i.length * n;
    if (r !== i || typeof r > "u")
      r = i, e = "";
    else if (e.length >= a)
      return e.substr(0, a);
    for (; a > e.length && n > 1; )
      n & 1 && (e += i), n >>= 1, i += i;
    return e += i, e = e.substr(0, a), e;
  }
  return Kr;
}
var Qr, fi;
function ja() {
  if (fi)
    return Qr;
  fi = 1, Qr = e;
  function e(r) {
    return String(r).replace(/\n+$/, "");
  }
  return Qr;
}
var Yr, ui;
function $f() {
  if (ui)
    return Yr;
  ui = 1;
  var e = vn(), r = ja();
  Yr = o;
  var t = `
`, i = "	", n = " ", a = 4, s = e(n, a);
  function o(c, l, d) {
    for (var u = -1, A = l.length, v = "", g = "", w = "", f = "", h, p, m; ++u < A; )
      if (h = l.charAt(u), m)
        if (m = !1, v += w, g += f, w = "", f = "", h === t)
          w = h, f = h;
        else
          for (v += h, g += h; ++u < A; ) {
            if (h = l.charAt(u), !h || h === t) {
              f = h, w = h;
              break;
            }
            v += h, g += h;
          }
      else if (h === n && l.charAt(u + 1) === h && l.charAt(u + 2) === h && l.charAt(u + 3) === h)
        w += s, u += 3, m = !0;
      else if (h === i)
        w += h, m = !0;
      else {
        for (p = ""; h === i || h === n; )
          p += h, h = l.charAt(++u);
        if (h !== t)
          break;
        w += p + h, f += h;
      }
    if (g)
      return d ? !0 : c(v)({
        type: "code",
        lang: null,
        meta: null,
        value: r(g)
      });
  }
  return Yr;
}
var Jr, di;
function Uf() {
  if (di)
    return Jr;
  di = 1, Jr = o;
  var e = `
`, r = "	", t = " ", i = "~", n = "`", a = 3, s = 4;
  function o(c, l, d) {
    var u = this, A = u.options.gfm, v = l.length + 1, g = 0, w = "", f, h, p, m, T, y, b, k, x, E, C, O, R;
    if (A) {
      for (; g < v && (p = l.charAt(g), !(p !== t && p !== r)); )
        w += p, g++;
      if (O = g, p = l.charAt(g), !(p !== i && p !== n)) {
        for (g++, h = p, f = 1, w += p; g < v && (p = l.charAt(g), p === h); )
          w += p, f++, g++;
        if (!(f < a)) {
          for (; g < v && (p = l.charAt(g), !(p !== t && p !== r)); )
            w += p, g++;
          for (m = "", b = ""; g < v && (p = l.charAt(g), !(p === e || h === n && p === h)); )
            p === t || p === r ? b += p : (m += b + p, b = ""), g++;
          if (p = l.charAt(g), !(p && p !== e)) {
            if (d)
              return !0;
            R = c.now(), R.column += w.length, R.offset += w.length, w += m, m = u.decode.raw(u.unescape(m), R), b && (w += b), b = "", E = "", C = "", k = "", x = "";
            for (var S = !0; g < v; ) {
              if (p = l.charAt(g), k += E, x += C, E = "", C = "", p !== e) {
                k += p, C += p, g++;
                continue;
              }
              for (S ? (w += p, S = !1) : (E += p, C += p), b = "", g++; g < v && (p = l.charAt(g), p === t); )
                b += p, g++;
              if (E += b, C += b.slice(O), !(b.length >= s)) {
                for (b = ""; g < v && (p = l.charAt(g), p === h); )
                  b += p, g++;
                if (E += b, C += b, !(b.length < f)) {
                  for (b = ""; g < v && (p = l.charAt(g), !(p !== t && p !== r)); )
                    E += p, C += p, g++;
                  if (!p || p === e)
                    break;
                }
              }
            }
            for (w += k + E, g = -1, v = m.length; ++g < v; )
              if (p = m.charAt(g), p === t || p === r)
                T || (T = m.slice(0, g));
              else if (T) {
                y = m.slice(g);
                break;
              }
            return c(w)({
              type: "code",
              lang: T || m || null,
              meta: y || null,
              value: x
            });
          }
        }
      }
    }
  }
  return Jr;
}
var or = { exports: {} }, hi;
function Ve() {
  return hi || (hi = 1, function(e, r) {
    r = e.exports = t;
    function t(i) {
      return i.replace(/^\s*|\s*$/g, "");
    }
    r.left = function(i) {
      return i.replace(/^\s*/, "");
    }, r.right = function(i) {
      return i.replace(/\s*$/, "");
    };
  }(or, or.exports)), or.exports;
}
var Xr, pi;
function gn() {
  if (pi)
    return Xr;
  pi = 1, Xr = e;
  function e(r, t, i, n) {
    for (var a = r.length, s = -1, o, c; ++s < a; )
      if (o = r[s], c = o[1] || {}, !(c.pedantic !== void 0 && c.pedantic !== i.options.pedantic) && !(c.commonmark !== void 0 && c.commonmark !== i.options.commonmark) && t[o[0]].apply(i, n))
        return !0;
    return !1;
  }
  return Xr;
}
var Zr, vi;
function Mf() {
  if (vi)
    return Zr;
  vi = 1;
  var e = Ve(), r = gn();
  Zr = s;
  var t = `
`, i = "	", n = " ", a = ">";
  function s(o, c, l) {
    for (var d = this, u = d.offset, A = d.blockTokenizers, v = d.interruptBlockquote, g = o.now(), w = g.line, f = c.length, h = [], p = [], m = [], T, y = 0, b, k, x, E, C, O, R, S; y < f && (b = c.charAt(y), !(b !== n && b !== i)); )
      y++;
    if (c.charAt(y) === a) {
      if (l)
        return !0;
      for (y = 0; y < f; ) {
        for (x = c.indexOf(t, y), O = y, R = !1, x === -1 && (x = f); y < f && (b = c.charAt(y), !(b !== n && b !== i)); )
          y++;
        if (c.charAt(y) === a ? (y++, R = !0, c.charAt(y) === n && y++) : y = O, E = c.slice(y, x), !R && !e(E)) {
          y = O;
          break;
        }
        if (!R && (k = c.slice(y), r(v, A, d, [o, k, !0])))
          break;
        C = O === y ? E : c.slice(O, x), m.push(y - O), h.push(C), p.push(E), y = x + 1;
      }
      for (y = -1, f = m.length, T = o(h.join(t)); ++y < f; )
        u[w] = (u[w] || 0) + m[y], w++;
      return S = d.enterBlock(), p = d.tokenizeBlock(p.join(t), g), S(), T({ type: "blockquote", children: p });
    }
  }
  return Zr;
}
var et, gi;
function Vf() {
  if (gi)
    return et;
  gi = 1, et = a;
  var e = `
`, r = "	", t = " ", i = "#", n = 6;
  function a(s, o, c) {
    for (var l = this, d = l.options.pedantic, u = o.length + 1, A = -1, v = s.now(), g = "", w = "", f, h, p; ++A < u; ) {
      if (f = o.charAt(A), f !== t && f !== r) {
        A--;
        break;
      }
      g += f;
    }
    for (p = 0; ++A <= u; ) {
      if (f = o.charAt(A), f !== i) {
        A--;
        break;
      }
      g += f, p++;
    }
    if (!(p > n) && !(!p || !d && o.charAt(A + 1) === i)) {
      for (u = o.length + 1, h = ""; ++A < u; ) {
        if (f = o.charAt(A), f !== t && f !== r) {
          A--;
          break;
        }
        h += f;
      }
      if (!(!d && h.length === 0 && f && f !== e)) {
        if (c)
          return !0;
        for (g += h, h = "", w = ""; ++A < u && (f = o.charAt(A), !(!f || f === e)); ) {
          if (f !== t && f !== r && f !== i) {
            w += h + f, h = "";
            continue;
          }
          for (; f === t || f === r; )
            h += f, f = o.charAt(++A);
          if (!d && w && !h && f === i) {
            w += f;
            continue;
          }
          for (; f === i; )
            h += f, f = o.charAt(++A);
          for (; f === t || f === r; )
            h += f, f = o.charAt(++A);
          A--;
        }
        return v.column += g.length, v.offset += g.length, g += w + h, s(g)({
          type: "heading",
          depth: p,
          children: l.tokenizeInline(w, v)
        });
      }
    }
  }
  return et;
}
var rt, mi;
function Wf() {
  if (mi)
    return rt;
  mi = 1, rt = o;
  var e = "	", r = `
`, t = " ", i = "*", n = "-", a = "_", s = 3;
  function o(c, l, d) {
    for (var u = -1, A = l.length + 1, v = "", g, w, f, h; ++u < A && (g = l.charAt(u), !(g !== e && g !== t)); )
      v += g;
    if (!(g !== i && g !== n && g !== a))
      for (w = g, v += g, f = 1, h = ""; ++u < A; )
        if (g = l.charAt(u), g === w)
          f++, v += h + w, h = "";
        else if (g === t)
          h += g;
        else
          return f >= s && (!g || g === r) ? (v += h, d ? !0 : c(v)({ type: "thematicBreak" })) : void 0;
  }
  return rt;
}
var tt, Ai;
function za() {
  if (Ai)
    return tt;
  Ai = 1, tt = n;
  var e = "	", r = " ", t = 1, i = 4;
  function n(a) {
    for (var s = 0, o = 0, c = a.charAt(s), l = {}, d; c === e || c === r; )
      d = c === e ? i : t, o += d, d > 1 && (o = Math.floor(o / d) * d), l[o] = s, c = a.charAt(++s);
    return { indent: o, stops: l };
  }
  return tt;
}
var nt, yi;
function Df() {
  if (yi)
    return nt;
  yi = 1;
  var e = Ve(), r = vn(), t = za();
  nt = o;
  var i = "	", n = `
`, a = " ", s = "!";
  function o(c, l) {
    var d = c.split(n), u = d.length + 1, A = 1 / 0, v = [], g, w, f, h;
    for (d.unshift(r(a, l) + s); u--; )
      if (w = t(d[u]), v[u] = w.stops, e(d[u]).length !== 0)
        if (w.indent)
          w.indent > 0 && w.indent < A && (A = w.indent);
        else {
          A = 1 / 0;
          break;
        }
    if (A !== 1 / 0)
      for (u = d.length; u--; ) {
        for (f = v[u], g = A; g && !(g in f); )
          g--;
        e(d[u]).length !== 0 && A && g !== A ? h = i : h = "", d[u] = h + d[u].slice(g in f ? f[g] + 1 : 0);
      }
    return d.shift(), d.join(n);
  }
  return nt;
}
var it, wi;
function jf() {
  if (wi)
    return it;
  wi = 1;
  var e = Ve(), r = vn(), t = Tr, i = za(), n = Df(), a = gn();
  it = b;
  var s = "*", o = "_", c = "+", l = "-", d = ".", u = " ", A = `
`, v = "	", g = ")", w = "x", f = 4, h = /\n\n(?!\s*$)/, p = /^\[([ \t]|x|X)][ \t]/, m = /^([ \t]*)([*+-]|\d+[.)])( {1,4}(?! )| |\t|$|(?=\n))([^\n]*)/, T = /^([ \t]*)([*+-]|\d+[.)])([ \t]+)/, y = /^( {1,4}|\t)?/gm;
  function b(C, O, R) {
    for (var S = this, I = S.options.commonmark, N = S.options.pedantic, _ = S.blockTokenizers, q = S.interruptList, P = 0, $ = O.length, M = null, B = 0, H, Y, L, J, Q, ie, je, ce, kn, ae, xr, Rr, ze, Ae, re, G, Sn, On, Cn = !1, Ir, xn, ir, ye; P < $; ) {
      if (L = O.charAt(P), L === v)
        B += f - B % f;
      else if (L === u)
        B++;
      else
        break;
      P++;
    }
    if (!(B >= f)) {
      if (L = O.charAt(P), L === s || L === c || L === l)
        J = L, Y = !1;
      else {
        for (Y = !0, H = ""; P < $ && (L = O.charAt(P), !!t(L)); )
          H += L, P++;
        if (L = O.charAt(P), !H || !(L === d || I && L === g))
          return;
        M = parseInt(H, 10), J = L;
      }
      if (L = O.charAt(++P), !(L !== u && L !== v && (N || L !== A && L !== ""))) {
        if (R)
          return !0;
        for (P = 0, ze = [], Ae = [], re = []; P < $; ) {
          for (Q = O.indexOf(A, P), ie = P, je = !1, ye = !1, Q === -1 && (Q = $), ir = P + f, B = 0; P < $; ) {
            if (L = O.charAt(P), L === v)
              B += f - B % f;
            else if (L === u)
              B++;
            else
              break;
            P++;
          }
          if (B >= f && (ye = !0), G && B >= G.indent && (ye = !0), L = O.charAt(P), ce = null, !ye) {
            if (L === s || L === c || L === l)
              ce = L, P++, B++;
            else {
              for (H = ""; P < $ && (L = O.charAt(P), !!t(L)); )
                H += L, P++;
              L = O.charAt(P), P++, H && (L === d || I && L === g) && (ce = L, B += H.length + 1);
            }
            if (ce)
              if (L = O.charAt(P), L === v)
                B += f - B % f, P++;
              else if (L === u) {
                for (ir = P + f; P < ir && O.charAt(P) === u; )
                  P++, B++;
                P === ir && O.charAt(P) === u && (P -= f - 1, B -= f - 1);
              } else
                L !== A && L !== "" && (ce = null);
          }
          if (ce) {
            if (!N && J !== ce)
              break;
            je = !0;
          } else
            !I && !ye && O.charAt(ie) === u ? ye = !0 : I && G && (ye = B >= G.indent || B > f), je = !1, P = ie;
          if (ae = O.slice(ie, Q), kn = ie === P ? ae : O.slice(P, Q), (ce === s || ce === o || ce === l) && _.thematicBreak.call(S, C, ae, !0))
            break;
          if (xr = Rr, Rr = !je && !e(kn).length, ye && G)
            G.value = G.value.concat(re, ae), Ae = Ae.concat(re, ae), re = [];
          else if (je)
            re.length !== 0 && (Cn = !0, G.value.push(""), G.trail = re.concat()), G = {
              value: [ae],
              indent: B,
              trail: []
            }, ze.push(G), Ae = Ae.concat(re, ae), re = [];
          else if (Rr) {
            if (xr && !I)
              break;
            re.push(ae);
          } else {
            if (xr || a(q, _, S, [C, ae, !0]))
              break;
            G.value = G.value.concat(re, ae), Ae = Ae.concat(re, ae), re = [];
          }
          P = Q + 1;
        }
        for (Ir = C(Ae.join(A)).reset({
          type: "list",
          ordered: Y,
          start: M,
          spread: Cn,
          children: []
        }), Sn = S.enterList(), On = S.enterBlock(), P = -1, $ = ze.length; ++P < $; )
          G = ze[P].value.join(A), xn = C.now(), C(G)(k(S, G, xn), Ir), G = ze[P].trail.join(A), P !== $ - 1 && (G += A), C(G);
        return Sn(), On(), Ir;
      }
    }
  }
  function k(C, O, R) {
    var S = C.offset, I = C.options.pedantic ? x : E, N = null, _, q;
    return O = I.apply(null, arguments), C.options.gfm && (_ = O.match(p), _ && (q = _[0].length, N = _[1].toLowerCase() === w, S[R.line] += q, O = O.slice(q))), {
      type: "listItem",
      spread: h.test(O),
      checked: N,
      children: C.tokenizeBlock(O, R)
    };
  }
  function x(C, O, R) {
    var S = C.offset, I = R.line;
    return O = O.replace(T, N), I = R.line, O.replace(y, N);
    function N(_) {
      return S[I] = (S[I] || 0) + _.length, I++, "";
    }
  }
  function E(C, O, R) {
    var S = C.offset, I = R.line, N, _, q, P, $, M, B;
    for (O = O.replace(m, H), P = O.split(A), $ = n(O, i(N).indent).split(A), $[0] = q, S[I] = (S[I] || 0) + _.length, I++, M = 0, B = P.length; ++M < B; )
      S[I] = (S[I] || 0) + P[M].length - $[M].length, I++;
    return $.join(A);
    function H(Y, L, J, Q, ie) {
      return _ = L + J + Q, q = ie, Number(J) < 10 && _.length % 2 === 1 && (J = u + J), N = L + r(u, J.length) + Q, N + q;
    }
  }
  return it;
}
var at, Ei;
function zf() {
  if (Ei)
    return at;
  Ei = 1, at = c;
  var e = `
`, r = "	", t = " ", i = "=", n = "-", a = 3, s = 1, o = 2;
  function c(l, d, u) {
    for (var A = this, v = l.now(), g = d.length, w = -1, f = "", h, p, m, T, y; ++w < g; ) {
      if (m = d.charAt(w), m !== t || w >= a) {
        w--;
        break;
      }
      f += m;
    }
    for (h = "", p = ""; ++w < g; ) {
      if (m = d.charAt(w), m === e) {
        w--;
        break;
      }
      m === t || m === r ? p += m : (h += p + m, p = "");
    }
    if (v.column += f.length, v.offset += f.length, f += h + p, m = d.charAt(++w), T = d.charAt(++w), !(m !== e || T !== i && T !== n)) {
      for (f += m, p = T, y = T === i ? s : o; ++w < g; ) {
        if (m = d.charAt(w), m !== T) {
          if (m !== e)
            return;
          w--;
          break;
        }
        p += m;
      }
      return u ? !0 : l(f + p)({
        type: "heading",
        depth: y,
        children: A.tokenizeInline(h, v)
      });
    }
  }
  return at;
}
var cr = {}, Ti;
function Ga() {
  if (Ti)
    return cr;
  Ti = 1;
  var e = "[a-zA-Z_:][a-zA-Z0-9:._-]*", r = "[^\"'=<>`\\u0000-\\u0020]+", t = "'[^']*'", i = '"[^"]*"', n = "(?:" + r + "|" + t + "|" + i + ")", a = "(?:\\s+" + e + "(?:\\s*=\\s*" + n + ")?)", s = "<[A-Za-z][A-Za-z0-9\\-]*" + a + "*\\s*\\/?>", o = "<\\/[A-Za-z][A-Za-z0-9\\-]*\\s*>", c = "<!---->|<!--(?:-?[^>-])(?:-?[^-])*-->", l = "<[?].*?[?]>", d = "<![A-Za-z]+\\s+[^>]*>", u = "<!\\[CDATA\\[[\\s\\S]*?\\]\\]>";
  return cr.openCloseTag = new RegExp("^(?:" + s + "|" + o + ")"), cr.tag = new RegExp(
    "^(?:" + s + "|" + o + "|" + c + "|" + l + "|" + d + "|" + u + ")"
  ), cr;
}
var st, bi;
function Gf() {
  if (bi)
    return st;
  bi = 1;
  var e = Ga().openCloseTag;
  st = h;
  var r = "	", t = " ", i = `
`, n = "<", a = /^<(script|pre|style)(?=(\s|>|$))/i, s = /<\/(script|pre|style)>/i, o = /^<!--/, c = /-->/, l = /^<\?/, d = /\?>/, u = /^<![A-Za-z]/, A = />/, v = /^<!\[CDATA\[/, g = /\]\]>/, w = /^$/, f = new RegExp(e.source + "\\s*$");
  function h(p, m, T) {
    for (var y = this, b = y.options.blocks.join("|"), k = new RegExp(
      "^</?(" + b + ")(?=(\\s|/?>|$))",
      "i"
    ), x = m.length, E = 0, C, O, R, S, I, N, _, q = [
      [a, s, !0],
      [o, c, !0],
      [l, d, !0],
      [u, A, !0],
      [v, g, !0],
      [k, w, !0],
      [f, w, !1]
    ]; E < x && (S = m.charAt(E), !(S !== r && S !== t)); )
      E++;
    if (m.charAt(E) === n) {
      for (C = m.indexOf(i, E + 1), C = C === -1 ? x : C, O = m.slice(E, C), R = -1, I = q.length; ++R < I; )
        if (q[R][0].test(O)) {
          N = q[R];
          break;
        }
      if (N) {
        if (T)
          return N[2];
        if (E = C, !N[1].test(O))
          for (; E < x; ) {
            if (C = m.indexOf(i, E + 1), C = C === -1 ? x : C, O = m.slice(E + 1, C), N[1].test(O)) {
              O && (E = C);
              break;
            }
            E = C;
          }
        return _ = m.slice(0, E), p(_)({ type: "html", value: _ });
      }
    }
  }
  return st;
}
var ot, ki;
function Kf() {
  if (ki)
    return ot;
  ki = 1, ot = e;
  function e(r) {
    return String(r).replace(/\s+/g, " ");
  }
  return ot;
}
var ct, Si;
function mn() {
  if (Si)
    return ct;
  Si = 1;
  var e = Kf();
  ct = r;
  function r(t) {
    return e(t).toLowerCase();
  }
  return ct;
}
var lt, Oi;
function Qf() {
  if (Oi)
    return lt;
  Oi = 1;
  var e = oe(), r = mn();
  lt = u, u.notInList = !0, u.notInBlock = !0;
  var t = "\\", i = `
`, n = "	", a = " ", s = "[", o = "]", c = "^", l = ":", d = /^( {4}|\t)?/gm;
  function u(A, v, g) {
    var w = this, f = w.offset, h, p, m, T, y, b, k, x, E, C, O, R;
    if (w.options.footnotes) {
      for (h = 0, p = v.length, m = "", T = A.now(), y = T.line; h < p && (E = v.charAt(h), !!e(E)); )
        m += E, h++;
      if (!(v.charAt(h) !== s || v.charAt(h + 1) !== c)) {
        for (m += s + c, h = m.length, k = ""; h < p && (E = v.charAt(h), E !== o); )
          E === t && (k += E, h++, E = v.charAt(h)), k += E, h++;
        if (!(!k || v.charAt(h) !== o || v.charAt(h + 1) !== l)) {
          if (g)
            return !0;
          for (C = k, m += k + o + l, h = m.length; h < p && (E = v.charAt(h), !(E !== n && E !== a)); )
            m += E, h++;
          for (T.column += m.length, T.offset += m.length, k = "", b = "", x = ""; h < p; ) {
            if (E = v.charAt(h), E === i) {
              for (x = E, h++; h < p && (E = v.charAt(h), E === i); )
                x += E, h++;
              for (k += x, x = ""; h < p && (E = v.charAt(h), E === a); )
                x += E, h++;
              if (x.length === 0)
                break;
              k += x;
            }
            k && (b += k, k = ""), b += E, h++;
          }
          return m += b, b = b.replace(d, function(S) {
            return f[y] = (f[y] || 0) + S.length, y++, "";
          }), O = A(m), R = w.enterBlock(), b = w.tokenizeBlock(b, T), R(), O({
            type: "footnoteDefinition",
            identifier: r(C),
            label: C,
            children: b
          });
        }
      }
    }
  }
  return lt;
}
var ft, Ci;
function Yf() {
  if (Ci)
    return ft;
  Ci = 1;
  var e = oe(), r = mn();
  ft = w;
  var t = '"', i = "'", n = "\\", a = `
`, s = "	", o = " ", c = "[", l = "]", d = "(", u = ")", A = ":", v = "<", g = ">";
  function w(p, m, T) {
    for (var y = this, b = y.options.commonmark, k = 0, x = m.length, E = "", C, O, R, S, I, N, _, q; k < x && (S = m.charAt(k), !(S !== o && S !== s)); )
      E += S, k++;
    if (S = m.charAt(k), S === c) {
      for (k++, E += S, R = ""; k < x && (S = m.charAt(k), S !== l); )
        S === n && (R += S, k++, S = m.charAt(k)), R += S, k++;
      if (!(!R || m.charAt(k) !== l || m.charAt(k + 1) !== A)) {
        for (N = R, E += R + l + A, k = E.length, R = ""; k < x && (S = m.charAt(k), !(S !== s && S !== o && S !== a)); )
          E += S, k++;
        if (S = m.charAt(k), R = "", C = E, S === v) {
          for (k++; k < x && (S = m.charAt(k), !!f(S)); )
            R += S, k++;
          if (S = m.charAt(k), S === f.delimiter)
            E += v + R + S, k++;
          else {
            if (b)
              return;
            k -= R.length + 1, R = "";
          }
        }
        if (!R) {
          for (; k < x && (S = m.charAt(k), !!h(S)); )
            R += S, k++;
          E += R;
        }
        if (R) {
          for (_ = R, R = ""; k < x && (S = m.charAt(k), !(S !== s && S !== o && S !== a)); )
            R += S, k++;
          if (S = m.charAt(k), I = null, S === t ? I = t : S === i ? I = i : S === d && (I = u), !I)
            R = "", k = E.length;
          else if (R) {
            for (E += R + S, k = E.length, R = ""; k < x && (S = m.charAt(k), S !== I); ) {
              if (S === a) {
                if (k++, S = m.charAt(k), S === a || S === I)
                  return;
                R += a;
              }
              R += S, k++;
            }
            if (S = m.charAt(k), S !== I)
              return;
            O = E, E += R + S, k++, q = R, R = "";
          } else
            return;
          for (; k < x && (S = m.charAt(k), !(S !== s && S !== o)); )
            E += S, k++;
          if (S = m.charAt(k), !S || S === a)
            return T ? !0 : (C = p(C).test().end, _ = y.decode.raw(y.unescape(_), C, { nonTerminated: !1 }), q && (O = p(O).test().end, q = y.decode.raw(y.unescape(q), O)), p(E)({
              type: "definition",
              identifier: r(N),
              label: N,
              title: q || null,
              url: _
            }));
        }
      }
    }
  }
  function f(p) {
    return p !== g && p !== c && p !== l;
  }
  f.delimiter = g;
  function h(p) {
    return p !== c && p !== l && !e(p);
  }
  return ft;
}
var ut, xi;
function Jf() {
  if (xi)
    return ut;
  xi = 1;
  var e = oe();
  ut = v;
  var r = "	", t = `
`, i = " ", n = "-", a = ":", s = "\\", o = "|", c = 1, l = 2, d = "left", u = "center", A = "right";
  function v(g, w, f) {
    var h = this, p, m, T, y, b, k, x, E, C, O, R, S, I, N, _, q, P, $, M, B, H, Y;
    if (h.options.gfm) {
      for (p = 0, q = 0, k = w.length + 1, x = []; p < k; ) {
        if (B = w.indexOf(t, p), H = w.indexOf(o, p + 1), B === -1 && (B = w.length), H === -1 || H > B) {
          if (q < l)
            return;
          break;
        }
        x.push(w.slice(p, B)), q++, p = B + 1;
      }
      for (y = x.join(t), m = x.splice(1, 1)[0] || [], p = 0, k = m.length, q--, T = !1, R = []; p < k; ) {
        if (C = m.charAt(p), C === o) {
          if (O = null, T === !1) {
            if (Y === !1)
              return;
          } else
            R.push(T), T = !1;
          Y = !1;
        } else if (C === n)
          O = !0, T = T || null;
        else if (C === a)
          T === d ? T = u : O && T === null ? T = A : T = d;
        else if (!e(C))
          return;
        p++;
      }
      if (T !== !1 && R.push(T), !(R.length < c)) {
        if (f)
          return !0;
        for (_ = -1, $ = [], M = g(y).reset({ type: "table", align: R, children: $ }); ++_ < q; ) {
          for (P = x[_], b = { type: "tableRow", children: [] }, _ && g(t), g(P).reset(b, M), k = P.length + 1, p = 0, E = "", S = "", I = !0; p < k; ) {
            if (C = P.charAt(p), C === r || C === i) {
              S ? E += C : g(C), p++;
              continue;
            }
            C === "" || C === o ? I ? g(C) : ((S || C) && !I && (y = S, E.length > 1 && (C ? (y += E.slice(0, E.length - 1), E = E.charAt(E.length - 1)) : (y += E, E = "")), N = g.now(), g(y)(
              { type: "tableCell", children: h.tokenizeInline(S, N) },
              b
            )), g(E + C), E = "", S = "") : (E && (S += E, E = ""), S += C, C === s && p !== k - 2 && (S += P.charAt(p + 1), p++)), I = !1, p++;
          }
          _ || g(t + m);
        }
        return M;
      }
    }
  }
  return ut;
}
var dt, Ri;
function Xf() {
  if (Ri)
    return dt;
  Ri = 1;
  var e = Ve(), r = Tr, t = ja(), i = gn();
  dt = c;
  var n = "	", a = `
`, s = " ", o = 4;
  function c(l, d, u) {
    for (var A = this, v = A.options, g = v.commonmark, w = v.gfm, f = A.blockTokenizers, h = A.interruptParagraph, p = d.indexOf(a), m = d.length, T, y, b, k, x; p < m; ) {
      if (p === -1) {
        p = m;
        break;
      }
      if (d.charAt(p + 1) === a)
        break;
      if (g) {
        for (k = 0, T = p + 1; T < m; ) {
          if (b = d.charAt(T), b === n) {
            k = o;
            break;
          } else if (b === s)
            k++;
          else
            break;
          T++;
        }
        if (k >= o && b !== a) {
          p = d.indexOf(a, p + 1);
          continue;
        }
      }
      if (y = d.slice(p + 1), i(h, f, A, [l, y, !0]) || f.list.call(A, l, y, !0) && (A.inList || g || w && !r(e.left(y).charAt(0))))
        break;
      if (T = p, p = d.indexOf(a, p + 1), p !== -1 && e(d.slice(T, p)) === "") {
        p = T;
        break;
      }
    }
    return y = d.slice(0, p), e(y) === "" ? (l(y), null) : u ? !0 : (x = l.now(), y = t(y), l(y)({
      type: "paragraph",
      children: A.tokenizeInline(y, x)
    }));
  }
  return dt;
}
var ht, Ii;
function Zf() {
  if (Ii)
    return ht;
  Ii = 1, ht = e;
  function e(r, t) {
    return r.indexOf("\\", t);
  }
  return ht;
}
var pt, Pi;
function eu() {
  if (Pi)
    return pt;
  Pi = 1;
  var e = Zf();
  pt = i, i.locator = e;
  var r = `
`, t = "\\";
  function i(n, a, s) {
    var o = this, c, l;
    if (a.charAt(0) === t && (c = a.charAt(1), o.escape.indexOf(c) !== -1))
      return s ? !0 : (c === r ? l = { type: "break" } : l = { type: "text", value: c }, n(t + c)(l));
  }
  return pt;
}
var vt, _i;
function Ka() {
  if (_i)
    return vt;
  _i = 1, vt = e;
  function e(r, t) {
    return r.indexOf("<", t);
  }
  return vt;
}
var gt, Bi;
function ru() {
  if (Bi)
    return gt;
  Bi = 1;
  var e = oe(), r = un, t = Ka();
  gt = l, l.locator = t, l.notInLink = !0;
  var i = "<", n = ">", a = "@", s = "/", o = "mailto:", c = o.length;
  function l(d, u, A) {
    var v = this, g = "", w = u.length, f = 0, h = "", p = !1, m = "", T, y, b, k, x;
    if (u.charAt(0) === i) {
      for (f++, g = i; f < w && (T = u.charAt(f), !(e(T) || T === n || T === a || T === ":" && u.charAt(f + 1) === s)); )
        h += T, f++;
      if (h) {
        if (m += h, h = "", T = u.charAt(f), m += T, f++, T === a)
          p = !0;
        else {
          if (T !== ":" || u.charAt(f + 1) !== s)
            return;
          m += s, f++;
        }
        for (; f < w && (T = u.charAt(f), !(e(T) || T === n)); )
          h += T, f++;
        if (T = u.charAt(f), !(!h || T !== n))
          return A ? !0 : (m += h, b = m, g += m + T, y = d.now(), y.column++, y.offset++, p && (m.slice(0, c).toLowerCase() === o ? (b = b.slice(c), y.column += c, y.offset += c) : m = o + m), k = v.inlineTokenizers, v.inlineTokenizers = { text: k.text }, x = v.enterLink(), b = v.tokenizeInline(b, y), v.inlineTokenizers = k, x(), d(g)({
            type: "link",
            title: null,
            url: r(m, { nonTerminated: !1 }),
            children: b
          }));
      }
    }
  }
  return gt;
}
var mt, Ni;
function tu() {
  if (Ni)
    return mt;
  Ni = 1, mt = r;
  var e = ["https://", "http://", "mailto:"];
  function r(t, i) {
    var n = e.length, a = -1, s = -1, o;
    if (!this.options.gfm)
      return -1;
    for (; ++a < n; )
      o = t.indexOf(e[a], i), o !== -1 && (o < s || s === -1) && (s = o);
    return s;
  }
  return mt;
}
var At, Li;
function nu() {
  if (Li)
    return At;
  Li = 1;
  var e = un, r = oe(), t = tu();
  At = T, T.locator = t, T.notInLink = !0;
  var i = '"', n = "'", a = "(", s = ")", o = ",", c = ".", l = ":", d = ";", u = "<", A = "@", v = "[", g = "]", w = "http://", f = "https://", h = "mailto:", p = [w, f, h], m = p.length;
  function T(y, b, k) {
    var x = this, E, C, O, R, S, I, N, _, q, P, $, M, B;
    if (x.options.gfm) {
      for (E = "", R = -1; ++R < m; )
        if (I = p[R], N = b.slice(0, I.length), N.toLowerCase() === I) {
          E = N;
          break;
        }
      if (E) {
        for (R = E.length, _ = b.length, q = "", P = 0; R < _ && (O = b.charAt(R), !(r(O) || O === u || (O === c || O === o || O === l || O === d || O === i || O === n || O === s || O === g) && ($ = b.charAt(R + 1), !$ || r($)) || ((O === a || O === v) && P++, (O === s || O === g) && (P--, P < 0)))); )
          q += O, R++;
        if (q) {
          if (E += q, C = E, I === h) {
            if (S = q.indexOf(A), S === -1 || S === _ - 1)
              return;
            C = C.slice(h.length);
          }
          return k ? !0 : (B = x.enterLink(), M = x.inlineTokenizers, x.inlineTokenizers = { text: M.text }, C = x.tokenizeInline(C, y.now()), x.inlineTokenizers = M, B(), y(E)({
            type: "link",
            title: null,
            url: e(E, { nonTerminated: !1 }),
            children: C
          }));
        }
      }
    }
  }
  return At;
}
var yt, Fi;
function iu() {
  if (Fi)
    return yt;
  Fi = 1;
  var e = Fa(), r = Ka(), t = Ga().tag;
  yt = l, l.locator = r;
  var i = "<", n = "?", a = "!", s = "/", o = /^<a /i, c = /^<\/a>/i;
  function l(d, u, A) {
    var v = this, g = u.length, w, f;
    if (!(u.charAt(0) !== i || g < 3) && (w = u.charAt(1), !(!e(w) && w !== n && w !== a && w !== s) && (f = u.match(t), !!f)))
      return A ? !0 : (f = f[0], !v.inLink && o.test(f) ? v.inLink = !0 : v.inLink && c.test(f) && (v.inLink = !1), d(f)({ type: "html", value: f }));
  }
  return yt;
}
var wt, Hi;
function Qa() {
  if (Hi)
    return wt;
  Hi = 1, wt = e;
  function e(r, t) {
    var i = r.indexOf("[", t), n = r.indexOf("![", t);
    return n === -1 || i < n ? i : n;
  }
  return wt;
}
var Et, qi;
function au() {
  if (qi)
    return Et;
  qi = 1;
  var e = oe(), r = Qa();
  Et = g, g.locator = r;
  var t = `
`, i = "!", n = '"', a = "'", s = "(", o = ")", c = "<", l = ">", d = "[", u = "\\", A = "]", v = "`";
  function g(w, f, h) {
    var p = this, m = "", T = 0, y = f.charAt(0), b = p.options.pedantic, k = p.options.commonmark, x = p.options.gfm, E, C, O, R, S, I, N, _, q, P, $, M, B, H, Y, L, J, Q;
    if (y === i && (_ = !0, m = y, y = f.charAt(++T)), y === d && !(!_ && p.inLink)) {
      for (m += y, H = "", T++, $ = f.length, L = w.now(), B = 0, L.column += T, L.offset += T; T < $; ) {
        if (y = f.charAt(T), I = y, y === v) {
          for (C = 1; f.charAt(T + 1) === v; )
            I += y, T++, C++;
          O ? C >= O && (O = 0) : O = C;
        } else if (y === u)
          T++, I += f.charAt(T);
        else if ((!O || x) && y === d)
          B++;
        else if ((!O || x) && y === A)
          if (B)
            B--;
          else {
            if (!b)
              for (; T < $ && (y = f.charAt(T + 1), !!e(y)); )
                I += y, T++;
            if (f.charAt(T + 1) !== s)
              return;
            I += s, E = !0, T++;
            break;
          }
        H += I, I = "", T++;
      }
      if (E) {
        for (q = H, m += H + I, T++; T < $ && (y = f.charAt(T), !!e(y)); )
          m += y, T++;
        if (y = f.charAt(T), H = "", R = m, y === c) {
          for (T++, R += c; T < $ && (y = f.charAt(T), y !== l); ) {
            if (k && y === t)
              return;
            H += y, T++;
          }
          if (f.charAt(T) !== l)
            return;
          m += c + H + l, Y = H, T++;
        } else {
          for (y = null, I = ""; T < $ && (y = f.charAt(T), !(I && (y === n || y === a || k && y === s))); ) {
            if (e(y)) {
              if (!b)
                break;
              I += y;
            } else {
              if (y === s)
                B++;
              else if (y === o) {
                if (B === 0)
                  break;
                B--;
              }
              H += I, I = "", y === u && (H += u, y = f.charAt(++T)), H += y;
            }
            T++;
          }
          m += H, Y = H, T = m.length;
        }
        for (H = ""; T < $ && (y = f.charAt(T), !!e(y)); )
          H += y, T++;
        if (y = f.charAt(T), m += H, H && (y === n || y === a || k && y === s))
          if (T++, m += y, H = "", P = y === s ? o : y, S = m, k) {
            for (; T < $ && (y = f.charAt(T), y !== P); )
              y === u && (H += u, y = f.charAt(++T)), T++, H += y;
            if (y = f.charAt(T), y !== P)
              return;
            for (M = H, m += H + y, T++; T < $ && (y = f.charAt(T), !!e(y)); )
              m += y, T++;
          } else
            for (I = ""; T < $; ) {
              if (y = f.charAt(T), y === P)
                N && (H += P + I, I = ""), N = !0;
              else if (!N)
                H += y;
              else if (y === o) {
                m += H + P + I, M = H;
                break;
              } else
                e(y) ? I += y : (H += P + I + y, I = "", N = !1);
              T++;
            }
        if (f.charAt(T) === o)
          return h ? !0 : (m += o, Y = p.decode.raw(p.unescape(Y), w(R).test().end, {
            nonTerminated: !1
          }), M && (S = w(S).test().end, M = p.decode.raw(p.unescape(M), S)), Q = {
            type: _ ? "image" : "link",
            title: M || null,
            url: Y
          }, _ ? Q.alt = p.decode.raw(p.unescape(q), L) || null : (J = p.enterLink(), Q.children = p.tokenizeInline(q, L), J()), w(m)(Q));
      }
    }
  }
  return Et;
}
var Tt, $i;
function su() {
  if ($i)
    return Tt;
  $i = 1;
  var e = oe(), r = Qa(), t = mn();
  Tt = w, w.locator = r;
  var i = "link", n = "image", a = "footnote", s = "shortcut", o = "collapsed", c = "full", l = " ", d = "!", u = "[", A = "\\", v = "]", g = "^";
  function w(f, h, p) {
    var m = this, T = m.options.commonmark, y = m.options.footnotes, b = h.charAt(0), k = 0, x = h.length, E = "", C = "", O = i, R = s, S, I, N, _, q, P, $, M;
    if (b === d && (O = n, C = b, b = h.charAt(++k)), b === u) {
      if (k++, C += b, P = "", y && h.charAt(k) === g) {
        if (O === n)
          return;
        C += g, k++, O = a;
      }
      for (M = 0; k < x; ) {
        if (b = h.charAt(k), b === u)
          $ = !0, M++;
        else if (b === v) {
          if (!M)
            break;
          M--;
        }
        b === A && (P += A, b = h.charAt(++k)), P += b, k++;
      }
      if (E = P, S = P, b = h.charAt(k), b === v) {
        if (k++, E += b, P = "", !T)
          for (; k < x && (b = h.charAt(k), !!e(b)); )
            P += b, k++;
        if (b = h.charAt(k), O !== a && b === u && (!y || h.charAt(k + 1) !== g)) {
          for (I = "", P += b, k++; k < x && (b = h.charAt(k), !(b === u || b === v)); )
            b === A && (I += A, b = h.charAt(++k)), I += b, k++;
          b = h.charAt(k), b === v ? (R = I ? c : o, P += I + b, k++) : I = "", E += P, P = "";
        } else {
          if (!S)
            return;
          I = S;
        }
        if (!(R !== c && $))
          return E = C + E, O === i && m.inLink ? null : p ? !0 : O === a && S.indexOf(l) !== -1 ? f(E)({
            type: a,
            children: this.tokenizeInline(S, f.now())
          }) : (N = f.now(), N.column += C.length, N.offset += C.length, I = R === c ? I : S, _ = {
            type: O + "Reference",
            identifier: t(I),
            label: I
          }, (O === i || O === n) && (_.referenceType = R), O === i ? (q = m.enterLink(), _.children = m.tokenizeInline(S, N), q()) : O === n && (_.alt = m.decode.raw(m.unescape(S), N) || null), f(E)(_));
      }
    }
  }
  return Tt;
}
var bt, Ui;
function ou() {
  if (Ui)
    return bt;
  Ui = 1, bt = e;
  function e(r, t) {
    var i = r.indexOf("**", t), n = r.indexOf("__", t);
    return n === -1 ? i : i === -1 || n < i ? n : i;
  }
  return bt;
}
var kt, Mi;
function cu() {
  if (Mi)
    return kt;
  Mi = 1;
  var e = Ve(), r = oe(), t = ou();
  kt = s, s.locator = t;
  var i = "\\", n = "*", a = "_";
  function s(o, c, l) {
    var d = this, u = 0, A = c.charAt(u), v, g, w, f, h, p, m;
    if (!(A !== n && A !== a || c.charAt(++u) !== A) && (g = d.options.pedantic, w = A, h = w + w, p = c.length, u++, f = "", A = "", !(g && r(c.charAt(u)))))
      for (; u < p; ) {
        if (m = A, A = c.charAt(u), A === w && c.charAt(u + 1) === w && (!g || !r(m)) && (A = c.charAt(u + 2), A !== w))
          return e(f) ? l ? !0 : (v = o.now(), v.column += 2, v.offset += 2, o(h + f + h)({
            type: "strong",
            children: d.tokenizeInline(f, v)
          })) : void 0;
        !g && A === i && (f += A, A = c.charAt(++u)), f += A, u++;
      }
  }
  return kt;
}
var St, Vi;
function lu() {
  if (Vi)
    return St;
  Vi = 1, St = t;
  var e = String.fromCharCode, r = /\w/;
  function t(i) {
    return r.test(
      typeof i == "number" ? e(i) : i.charAt(0)
    );
  }
  return St;
}
var Ot, Wi;
function fu() {
  if (Wi)
    return Ot;
  Wi = 1, Ot = e;
  function e(r, t) {
    var i = r.indexOf("*", t), n = r.indexOf("_", t);
    return n === -1 ? i : i === -1 || n < i ? n : i;
  }
  return Ot;
}
var Ct, Di;
function uu() {
  if (Di)
    return Ct;
  Di = 1;
  var e = Ve(), r = lu(), t = oe(), i = fu();
  Ct = o, o.locator = i;
  var n = "*", a = "_", s = "\\";
  function o(c, l, d) {
    var u = this, A = 0, v = l.charAt(A), g, w, f, h, p, m, T;
    if (!(v !== n && v !== a) && (w = u.options.pedantic, p = v, f = v, m = l.length, A++, h = "", v = "", !(w && t(l.charAt(A)))))
      for (; A < m; ) {
        if (T = v, v = l.charAt(A), v === f && (!w || !t(T))) {
          if (v = l.charAt(++A), v !== f) {
            if (!e(h) || T === f)
              return;
            if (!w && f === a && r(v)) {
              h += f;
              continue;
            }
            return d ? !0 : (g = c.now(), g.column++, g.offset++, c(p + h + f)({
              type: "emphasis",
              children: u.tokenizeInline(h, g)
            }));
          }
          h += f;
        }
        !w && v === s && (h += v, v = l.charAt(++A)), h += v, A++;
      }
  }
  return Ct;
}
var xt, ji;
function du() {
  if (ji)
    return xt;
  ji = 1, xt = e;
  function e(r, t) {
    return r.indexOf("~~", t);
  }
  return xt;
}
var Rt, zi;
function hu() {
  if (zi)
    return Rt;
  zi = 1;
  var e = oe(), r = du();
  Rt = n, n.locator = r;
  var t = "~", i = "~~";
  function n(a, s, o) {
    var c = this, l = "", d = "", u = "", A = "", v, g, w;
    if (!(!c.options.gfm || s.charAt(0) !== t || s.charAt(1) !== t || e(s.charAt(2))))
      for (v = 1, g = s.length, w = a.now(), w.column += 2, w.offset += 2; ++v < g; ) {
        if (l = s.charAt(v), l === t && d === t && (!u || !e(u)))
          return o ? !0 : a(i + A + i)({
            type: "delete",
            children: c.tokenizeInline(A, w)
          });
        A += d, u = d, d = l;
      }
  }
  return Rt;
}
var It, Gi;
function pu() {
  if (Gi)
    return It;
  Gi = 1, It = e;
  function e(r, t) {
    return r.indexOf("`", t);
  }
  return It;
}
var Pt, Ki;
function vu() {
  if (Ki)
    return Pt;
  Ki = 1;
  var e = pu();
  Pt = n, n.locator = e;
  var r = 10, t = 32, i = 96;
  function n(a, s, o) {
    for (var c = s.length, l = 0, d, u, A, v, g, w; l < c && s.charCodeAt(l) === i; )
      l++;
    if (!(l === 0 || l === c)) {
      for (d = l, g = s.charCodeAt(l); l < c; ) {
        if (v = g, g = s.charCodeAt(l + 1), v === i) {
          if (u === void 0 && (u = l), A = l + 1, g !== i && A - u === d) {
            w = !0;
            break;
          }
        } else
          u !== void 0 && (u = void 0, A = void 0);
        l++;
      }
      if (w) {
        if (o)
          return !0;
        if (l = d, c = u, v = s.charCodeAt(l), g = s.charCodeAt(c - 1), w = !1, c - l > 2 && (v === t || v === r) && (g === t || g === r)) {
          for (l++, c--; l < c; ) {
            if (v = s.charCodeAt(l), v !== t && v !== r) {
              w = !0;
              break;
            }
            l++;
          }
          w === !0 && (d++, u--);
        }
        return a(s.slice(0, A))({
          type: "inlineCode",
          value: s.slice(d, u)
        });
      }
    }
  }
  return Pt;
}
var _t, Qi;
function gu() {
  if (Qi)
    return _t;
  Qi = 1, _t = e;
  function e(r, t) {
    for (var i = r.indexOf(`
`, t); i > t && r.charAt(i - 1) === " "; )
      i--;
    return i;
  }
  return _t;
}
var Bt, Yi;
function mu() {
  if (Yi)
    return Bt;
  Yi = 1;
  var e = gu();
  Bt = n, n.locator = e;
  var r = " ", t = `
`, i = 2;
  function n(a, s, o) {
    for (var c = s.length, l = -1, d = "", u; ++l < c; ) {
      if (u = s.charAt(l), u === t)
        return l < i ? void 0 : o ? !0 : (d += u, a(d)({ type: "break" }));
      if (u !== r)
        return;
      d += u;
    }
  }
  return Bt;
}
var Nt, Ji;
function Au() {
  if (Ji)
    return Nt;
  Ji = 1, Nt = e;
  function e(r, t, i) {
    var n = this, a, s, o, c, l, d, u, A, v, g;
    if (i)
      return !0;
    for (a = n.inlineMethods, c = a.length, s = n.inlineTokenizers, o = -1, v = t.length; ++o < c; )
      A = a[o], !(A === "text" || !s[A]) && (u = s[A].locator, u || r.file.fail("Missing locator: `" + A + "`"), d = u.call(n, t, 1), d !== -1 && d < v && (v = d));
    l = t.slice(0, v), g = r.now(), n.decode(l, g, w);
    function w(f, h, p) {
      r(p || f)({ type: "text", value: f });
    }
  }
  return Nt;
}
var yu = Re, kr = qo, wu = Uo, Eu = jo, Tu = kf, An = Of, bu = Ya;
function Ya(e, r) {
  this.file = r, this.offset = {}, this.options = yu(this.options), this.setOptions({}), this.inList = !1, this.inBlock = !1, this.inLink = !1, this.atStart = !0, this.toOffset = wu(r).toOffset, this.unescape = Eu(this, "escape"), this.decode = Tu(this);
}
var K = Ya.prototype;
K.setOptions = _f();
K.parse = Hf();
K.options = Da();
K.exitStart = kr("atStart", !0);
K.enterList = kr("inList", !1);
K.enterLink = kr("inLink", !1);
K.enterBlock = kr("inBlock", !1);
K.interruptParagraph = [
  ["thematicBreak"],
  ["atxHeading"],
  ["fencedCode"],
  ["blockquote"],
  ["html"],
  ["setextHeading", { commonmark: !1 }],
  ["definition", { commonmark: !1 }],
  ["footnote", { commonmark: !1 }]
];
K.interruptList = [
  ["atxHeading", { pedantic: !1 }],
  ["fencedCode", { pedantic: !1 }],
  ["thematicBreak", { pedantic: !1 }],
  ["definition", { commonmark: !1 }],
  ["footnote", { commonmark: !1 }]
];
K.interruptBlockquote = [
  ["indentedCode", { commonmark: !0 }],
  ["fencedCode", { commonmark: !0 }],
  ["atxHeading", { commonmark: !0 }],
  ["setextHeading", { commonmark: !0 }],
  ["thematicBreak", { commonmark: !0 }],
  ["html", { commonmark: !0 }],
  ["list", { commonmark: !0 }],
  ["definition", { commonmark: !1 }],
  ["footnote", { commonmark: !1 }]
];
K.blockTokenizers = {
  newline: qf(),
  indentedCode: $f(),
  fencedCode: Uf(),
  blockquote: Mf(),
  atxHeading: Vf(),
  thematicBreak: Wf(),
  list: jf(),
  setextHeading: zf(),
  html: Gf(),
  footnote: Qf(),
  definition: Yf(),
  table: Jf(),
  paragraph: Xf()
};
K.inlineTokenizers = {
  escape: eu(),
  autoLink: ru(),
  url: nu(),
  html: iu(),
  link: au(),
  reference: su(),
  strong: cu(),
  emphasis: uu(),
  deletion: hu(),
  code: vu(),
  break: mu(),
  text: Au()
};
K.blockMethods = Ja(K.blockTokenizers);
K.inlineMethods = Ja(K.inlineTokenizers);
K.tokenizeBlock = An("block");
K.tokenizeInline = An("inline");
K.tokenizeFactory = An;
function Ja(e) {
  var r = [], t;
  for (t in e)
    r.push(t);
  return r;
}
var ku = Fo, Su = Re, Xa = bu, Ou = Za;
Za.Parser = Xa;
function Za(e) {
  var r = this.data("settings"), t = ku(Xa);
  t.prototype.options = Su(t.prototype.options, r, e), this.Parser = t;
}
const Cu = /* @__PURE__ */ on(Ou);
var es = { exports: {} };
(function(e) {
  (function() {
    var r;
    r = e.exports = n, r.format = n, r.vsprintf = i, typeof console < "u" && typeof console.log == "function" && (r.printf = t);
    function t() {
      console.log(n.apply(null, arguments));
    }
    function i(a, s) {
      return n.apply(null, [a].concat(s));
    }
    function n(a) {
      for (var s = 1, o = [].slice.call(arguments), c = 0, l = a.length, d = "", u, A = !1, v, g, w = !1, f, h = function() {
        return o[s++];
      }, p = function() {
        for (var m = ""; /\d/.test(a[c]); )
          m += a[c++], u = a[c];
        return m.length > 0 ? parseInt(m) : null;
      }; c < l; ++c)
        if (u = a[c], A)
          switch (A = !1, u == "." ? (w = !1, u = a[++c]) : u == "0" && a[c + 1] == "." ? (w = !0, c += 2, u = a[c]) : w = !0, f = p(), u) {
            case "b":
              d += parseInt(h(), 10).toString(2);
              break;
            case "c":
              v = h(), typeof v == "string" || v instanceof String ? d += v : d += String.fromCharCode(parseInt(v, 10));
              break;
            case "d":
              d += parseInt(h(), 10);
              break;
            case "f":
              g = String(parseFloat(h()).toFixed(f || 6)), d += w ? g : g.replace(/^0/, "");
              break;
            case "j":
              d += JSON.stringify(h());
              break;
            case "o":
              d += "0" + parseInt(h(), 10).toString(8);
              break;
            case "s":
              d += h();
              break;
            case "x":
              d += "0x" + parseInt(h(), 10).toString(16);
              break;
            case "X":
              d += "0x" + parseInt(h(), 10).toString(16).toUpperCase();
              break;
            default:
              d += u;
              break;
          }
        else
          u === "%" ? A = !0 : d += u;
      return d;
    }
  })();
})(es);
var xu = es.exports, Ru = xu, ke = Se(Error), Iu = ke;
ke.eval = Se(EvalError);
ke.range = Se(RangeError);
ke.reference = Se(ReferenceError);
ke.syntax = Se(SyntaxError);
ke.type = Se(TypeError);
ke.uri = Se(URIError);
ke.create = Se;
function Se(e) {
  return r.displayName = e.displayName || e.name, r;
  function r(t) {
    return t && (t = Ru.apply(null, arguments)), new e(t);
  }
}
var lr = Iu, Pu = _u, fr = {}.hasOwnProperty, Xi = {
  yaml: "-",
  toml: "+"
};
function _u(e) {
  var r = [], t = -1, i;
  for ((typeof e == "string" || !("length" in e)) && (e = [e]), i = e.length; ++t < i; )
    r[t] = Bu(e[t]);
  return r;
}
function Bu(e) {
  var r = e;
  if (typeof r == "string") {
    if (!fr.call(Xi, r))
      throw lr("Missing matter definition for `%s`", r);
    r = { type: r, marker: Xi[r] };
  } else if (typeof r != "object")
    throw lr("Expected matter to be an object, not `%j`", r);
  if (!fr.call(r, "type"))
    throw lr("Missing `type` in matter `%j`", r);
  if (!fr.call(r, "fence") && !fr.call(r, "marker"))
    throw lr("Missing `marker` or `fence` in matter `%j`", r);
  return r;
}
var rs = Nu;
function Nu(e, r) {
  var t;
  return e.marker ? (t = Zi(e.marker, r), t + t + t) : Zi(e.fence, r);
}
function Zi(e, r) {
  return typeof e == "string" ? e : e[r];
}
var ea = rs, Lu = Fu;
function Fu(e) {
  var r = e.type + "FrontMatter", t = ea(e, "open"), i = ea(e, "close"), n = `
`, a = e.anywhere;
  return s.displayName = r, s.onlyAtStart = typeof a == "boolean" ? !a : !0, [r, s];
  function s(o, c, l) {
    var d = t.length, u;
    if (!(c.slice(0, d) !== t || c.charAt(d) !== n)) {
      for (u = c.indexOf(i, d); u !== -1 && c.charAt(u - 1) !== n; )
        d = u + i.length, u = c.indexOf(i, d);
      if (u !== -1)
        return l ? !0 : o(c.slice(0, u + i.length))({
          type: e.type,
          value: c.slice(t.length + 1, u - 1)
        });
    }
  }
}
var ra = rs, Hu = qu;
function qu(e) {
  var r = e.type, t = ra(e, "open"), i = ra(e, "close");
  return n.displayName = r + "FrontMatter", [r, n];
  function n(a) {
    return t + (a.value ? `
` + a.value : "") + `
` + i;
  }
}
var ts = Re, $u = Pu, Uu = Lu, Mu = Hu, Vu = Wu;
function Wu(e) {
  var r = this.Parser, t = this.Compiler, i = $u(e || ["yaml"]);
  zu(r) && Du(r, i), Gu(t) && ju(t, i);
}
function Du(e, r) {
  var t = e.prototype, i = ns(Uu, r), n = [], a;
  for (a in i)
    n.push(a);
  t.blockMethods = n.concat(t.blockMethods), t.blockTokenizers = ts(i, t.blockTokenizers);
}
function ju(e, r) {
  var t = e.prototype;
  t.visitors = ts(ns(Mu, r), t.visitors);
}
function ns(e, r) {
  for (var t = {}, i = r.length, n = -1, a; ++n < i; )
    a = e(r[n]), t[a[0]] = a[1];
  return t;
}
function zu(e) {
  return !!(e && e.prototype && e.prototype.blockTokenizers);
}
function Gu(e) {
  return !!(e && e.prototype && e.prototype.visitors);
}
const Ku = /* @__PURE__ */ on(Vu);
var F = /* @__PURE__ */ ((e) => (e.EMPTY = "empty", e.SPACE = "space", e.WESTERN_LETTER = "western-letter", e.CJK_CHAR = "cjk-char", e.HALFWIDTH_PAUSE_OR_STOP = "halfwidth-pause-or-stop", e.FULLWIDTH_PAUSE_OR_STOP = "fullwidth-pause-or-stop", e.HALFWIDTH_QUOTATION = "halfwidth-quotation", e.FULLWIDTH_QUOTATION = "fullwidth-quotation", e.HALFWIDTH_BRACKET = "halfwidth-bracket", e.FULLWIDTH_BRACKET = "fullwidth-bracket", e.HALFWIDTH_OTHER_PUNCTUATION = "halfwidth-other-punctuation", e.FULLWIDTH_OTHER_PUNCTUATION = "fullwidth-other-punctuation", e.UNKNOWN = "unknown", e))(F || {});
const ta = {
  left: "([{（〔［｛",
  right: ")]}）〕］｝"
}, Lt = {
  left: "“‘《〈『「【〖",
  right: "”’》〉』」】〗",
  neutral: `'"`
}, Qu = "'’", Yu = {
  "'": "'",
  "’": "‘"
}, Ju = "“”‘’（）〔〕［］｛｝《》〈〉「」『』【】〖〗", Ar = (e) => Ju.indexOf(e) >= 0;
var se = /* @__PURE__ */ ((e) => (e.BRACKETS = "brackets", e.HYPER = "hyper", e.RAW = "raw", e))(se || {}), D = /* @__PURE__ */ ((e) => (e.LEFT = "left", e.RIGHT = "right", e))(D || {});
const Xu = (e) => e.code !== void 0;
var W = /* @__PURE__ */ ((e) => (e.BRACKET_MARK = "bracket-mark", e.HYPER_MARK = "hyper-mark", e.CODE_CONTENT = "code-content", e.HYPER_CONTENT = "hyper-content", e.UNMATCHED = "unmatched", e.INDETERMINATED = "indeterminated", e))(W || {}), X = /* @__PURE__ */ ((e) => (e.GROUP = "group", e))(X || {});
const is = (e) => {
  switch (e) {
    case "cjk-char":
      return "western-letter";
    case "fullwidth-pause-or-stop":
      return "halfwidth-pause-or-stop";
    case "fullwidth-other-punctuation":
      return "halfwidth-other-punctuation";
  }
  return e;
}, Zu = (e) => {
  switch (e) {
    case "western-letter":
      return "cjk-char";
    case "halfwidth-pause-or-stop":
      return "fullwidth-pause-or-stop";
    case "halfwidth-other-punctuation":
      return "fullwidth-other-punctuation";
  }
  return e;
}, te = (e) => e === "western-letter" || e === "cjk-char", yn = (e) => e === "halfwidth-pause-or-stop" || e === "fullwidth-pause-or-stop", as = (e) => e === "halfwidth-quotation" || e === "fullwidth-quotation", ss = (e) => e === "halfwidth-bracket" || e === "fullwidth-bracket", os = (e) => e === "halfwidth-other-punctuation" || e === "fullwidth-other-punctuation", Kt = (e) => yn(e) || os(e), ed = (e) => yn(e) || as(e) || ss(e) || os(e), Ee = (e) => e === "halfwidth-pause-or-stop" || e === "halfwidth-quotation" || e === "halfwidth-bracket" || e === "halfwidth-other-punctuation", wn = (e) => e === "fullwidth-pause-or-stop" || e === "fullwidth-quotation" || e === "fullwidth-bracket" || e === "fullwidth-other-punctuation", rd = (e) => e === "cjk-char" || wn(e), En = (e) => te(e) || Kt(e) || e === "bracket-mark" || e === "group", cs = (e) => En(e) || e === "code-content", Sr = (e) => e === "hyper-mark", td = {
  [F.HALFWIDTH_PAUSE_OR_STOP]: ",.;:?!",
  [F.FULLWIDTH_PAUSE_OR_STOP]: [
    // normal punctuation marks
    "，。、；：？！",
    // special punctuation marks
    "⁈⁇‼⁉"
  ].join(""),
  [F.HALFWIDTH_QUOTATION]: `'"`,
  [F.FULLWIDTH_QUOTATION]: "‘’“”《》〈〉『』「」【】〖〗",
  [F.HALFWIDTH_BRACKET]: "()[]{}",
  [F.FULLWIDTH_BRACKET]: "（）〔〕［］｛｝",
  [F.HALFWIDTH_OTHER_PUNCTUATION]: [
    // on-keyboard symbols
    '~-+*/\\%=&|"`<>@#$^',
    // symbol of death
    "†‡"
  ].join(""),
  [F.FULLWIDTH_OTHER_PUNCTUATION]: [
    // U+2E3A TWO-EM DASH, U+2014 EM DASH
    "—⸺",
    // U+2026 HORIZONTAL ELLIPSIS, U+22EF MIDLINE HORIZONTAL ELLIPSIS
    "…⋯",
    // U+FF5E FULLWIDTH TILDE
    "～",
    // U+25CF BLACK CIRCLE, U+2022 BULLET, U+00B7 MIDDLE DOT,
    // U+2027 HYPHENATION POINT, U+30FB KATAKANA MIDDLE DOT
    "●•·‧・"
  ].join("")
}, qe = (e) => {
  if (e === "")
    return F.EMPTY;
  if (e.match(/\s/) != null)
    return F.SPACE;
  for (const [r, t] of Object.entries(td))
    if ((t == null ? void 0 : t.indexOf(e)) >= 0)
      return r;
  return e.match(/[0-9]/) != null || e.match(/[\u0020-\u007F]/) != null || e.match(/[\u00A0-\u00FF]/) != null || e.match(/[\u0100-\u017F]/) != null || e.match(/[\u0180-\u024F]/) != null || e.match(/[\u0370-\u03FF]/) != null ? F.WESTERN_LETTER : e.match(/[\u4E00-\u9FFF]/) != null || e.match(/[\u3400-\u4DBF]/) != null || e.match(/[\ud840-\ud868][\udc00-\udfff]|\ud869[\udc00-\uded6]/) != null || e.match(
    /\ud869[\udf00-\udfff]|[\ud86a-\ud86c][\udc00-\udfff]|\ud86d[\udc00-\udf34]/
  ) != null || e.match(/\ud86d[\udf40-\udfff]|\ud86e[\udc00-\udc1d]/) != null || e.match(/[\uF900-\uFAFF]/) != null || e.match(/[\uFE30-\uFE4F]/) != null || e.match(/[\u2E80-\u2EFF]/) != null || e.match(/[\uE815-\uE864]/) != null || e.match(/[\u{20000}-\u{2A6DF}]/u) != null || e.match(/[\u{2F800}-\u{2FA1F}]/u) != null ? F.CJK_CHAR : e.match(/[\u3000-\u303F]/) != null ? F.FULLWIDTH_OTHER_PUNCTUATION : F.UNKNOWN;
}, Ft = 10, na = (e = 0) => (r) => `\x1B[${r + e}m`, ia = (e = 0) => (r) => `\x1B[${38 + e};5;${r}m`, aa = (e = 0) => (r, t, i) => `\x1B[${38 + e};2;${r};${t};${i}m`, j = {
  modifier: {
    reset: [0, 0],
    // 21 isn't widely supported and 22 does the same thing
    bold: [1, 22],
    dim: [2, 22],
    italic: [3, 23],
    underline: [4, 24],
    overline: [53, 55],
    inverse: [7, 27],
    hidden: [8, 28],
    strikethrough: [9, 29]
  },
  color: {
    black: [30, 39],
    red: [31, 39],
    green: [32, 39],
    yellow: [33, 39],
    blue: [34, 39],
    magenta: [35, 39],
    cyan: [36, 39],
    white: [37, 39],
    // Bright color
    blackBright: [90, 39],
    gray: [90, 39],
    // Alias of `blackBright`
    grey: [90, 39],
    // Alias of `blackBright`
    redBright: [91, 39],
    greenBright: [92, 39],
    yellowBright: [93, 39],
    blueBright: [94, 39],
    magentaBright: [95, 39],
    cyanBright: [96, 39],
    whiteBright: [97, 39]
  },
  bgColor: {
    bgBlack: [40, 49],
    bgRed: [41, 49],
    bgGreen: [42, 49],
    bgYellow: [43, 49],
    bgBlue: [44, 49],
    bgMagenta: [45, 49],
    bgCyan: [46, 49],
    bgWhite: [47, 49],
    // Bright color
    bgBlackBright: [100, 49],
    bgGray: [100, 49],
    // Alias of `bgBlackBright`
    bgGrey: [100, 49],
    // Alias of `bgBlackBright`
    bgRedBright: [101, 49],
    bgGreenBright: [102, 49],
    bgYellowBright: [103, 49],
    bgBlueBright: [104, 49],
    bgMagentaBright: [105, 49],
    bgCyanBright: [106, 49],
    bgWhiteBright: [107, 49]
  }
};
Object.keys(j.modifier);
const nd = Object.keys(j.color), id = Object.keys(j.bgColor);
[...nd, ...id];
function ad() {
  const e = /* @__PURE__ */ new Map();
  for (const [r, t] of Object.entries(j)) {
    for (const [i, n] of Object.entries(t))
      j[i] = {
        open: `\x1B[${n[0]}m`,
        close: `\x1B[${n[1]}m`
      }, t[i] = j[i], e.set(n[0], n[1]);
    Object.defineProperty(j, r, {
      value: t,
      enumerable: !1
    });
  }
  return Object.defineProperty(j, "codes", {
    value: e,
    enumerable: !1
  }), j.color.close = "\x1B[39m", j.bgColor.close = "\x1B[49m", j.color.ansi = na(), j.color.ansi256 = ia(), j.color.ansi16m = aa(), j.bgColor.ansi = na(Ft), j.bgColor.ansi256 = ia(Ft), j.bgColor.ansi16m = aa(Ft), Object.defineProperties(j, {
    rgbToAnsi256: {
      value(r, t, i) {
        return r === t && t === i ? r < 8 ? 16 : r > 248 ? 231 : Math.round((r - 8) / 247 * 24) + 232 : 16 + 36 * Math.round(r / 255 * 5) + 6 * Math.round(t / 255 * 5) + Math.round(i / 255 * 5);
      },
      enumerable: !1
    },
    hexToRgb: {
      value(r) {
        const t = /[a-f\d]{6}|[a-f\d]{3}/i.exec(r.toString(16));
        if (!t)
          return [0, 0, 0];
        let [i] = t;
        i.length === 3 && (i = [...i].map((a) => a + a).join(""));
        const n = Number.parseInt(i, 16);
        return [
          /* eslint-disable no-bitwise */
          n >> 16 & 255,
          n >> 8 & 255,
          n & 255
          /* eslint-enable no-bitwise */
        ];
      },
      enumerable: !1
    },
    hexToAnsi256: {
      value: (r) => j.rgbToAnsi256(...j.hexToRgb(r)),
      enumerable: !1
    },
    ansi256ToAnsi: {
      value(r) {
        if (r < 8)
          return 30 + r;
        if (r < 16)
          return 90 + (r - 8);
        let t, i, n;
        if (r >= 232)
          t = ((r - 232) * 10 + 8) / 255, i = t, n = t;
        else {
          r -= 16;
          const o = r % 36;
          t = Math.floor(r / 36) / 5, i = Math.floor(o / 6) / 5, n = o % 6 / 5;
        }
        const a = Math.max(t, i, n) * 2;
        if (a === 0)
          return 30;
        let s = 30 + (Math.round(n) << 2 | Math.round(i) << 1 | Math.round(t));
        return a === 2 && (s += 60), s;
      },
      enumerable: !1
    },
    rgbToAnsi: {
      value: (r, t, i) => j.ansi256ToAnsi(j.rgbToAnsi256(r, t, i)),
      enumerable: !1
    },
    hexToAnsi: {
      value: (r) => j.ansi256ToAnsi(j.hexToAnsi256(r)),
      enumerable: !1
    }
  }), j;
}
const sd = ad(), fe = sd, ur = (() => {
  if (navigator.userAgentData) {
    const e = navigator.userAgentData.brands.find(({ brand: r }) => r === "Chromium");
    if (e && e.version > 93)
      return 3;
  }
  return /\b(Chrome|Chromium)\//.test(navigator.userAgent) ? 1 : 0;
})(), sa = ur !== 0 && {
  level: ur,
  hasBasic: !0,
  has256: ur >= 2,
  has16m: ur >= 3
}, od = {
  stdout: sa,
  stderr: sa
}, cd = od;
function ld(e, r, t) {
  let i = e.indexOf(r);
  if (i === -1)
    return e;
  const n = r.length;
  let a = 0, s = "";
  do
    s += e.slice(a, i) + r + t, a = i + n, i = e.indexOf(r, a);
  while (i !== -1);
  return s += e.slice(a), s;
}
function fd(e, r, t, i) {
  let n = 0, a = "";
  do {
    const s = e[i - 1] === "\r";
    a += e.slice(n, s ? i - 1 : i) + r + (s ? `\r
` : `
`) + t, n = i + 1, i = e.indexOf(`
`, n);
  } while (i !== -1);
  return a += e.slice(n), a;
}
const { stdout: oa, stderr: ca } = cd, Qt = Symbol("GENERATOR"), $e = Symbol("STYLER"), Ze = Symbol("IS_EMPTY"), la = [
  "ansi",
  "ansi",
  "ansi256",
  "ansi16m"
], Ue = /* @__PURE__ */ Object.create(null), ud = (e, r = {}) => {
  if (r.level && !(Number.isInteger(r.level) && r.level >= 0 && r.level <= 3))
    throw new Error("The `level` option should be an integer from 0 to 3");
  const t = oa ? oa.level : 0;
  e.level = r.level === void 0 ? t : r.level;
}, dd = (e) => {
  const r = (...t) => t.join(" ");
  return ud(r, e), Object.setPrototypeOf(r, rr.prototype), r;
};
function rr(e) {
  return dd(e);
}
Object.setPrototypeOf(rr.prototype, Function.prototype);
for (const [e, r] of Object.entries(fe))
  Ue[e] = {
    get() {
      const t = yr(this, Jt(r.open, r.close, this[$e]), this[Ze]);
      return Object.defineProperty(this, e, { value: t }), t;
    }
  };
Ue.visible = {
  get() {
    const e = yr(this, this[$e], !0);
    return Object.defineProperty(this, "visible", { value: e }), e;
  }
};
const Yt = (e, r, t, ...i) => e === "rgb" ? r === "ansi16m" ? fe[t].ansi16m(...i) : r === "ansi256" ? fe[t].ansi256(fe.rgbToAnsi256(...i)) : fe[t].ansi(fe.rgbToAnsi(...i)) : e === "hex" ? Yt("rgb", r, t, ...fe.hexToRgb(...i)) : fe[t][e](...i), hd = ["rgb", "hex", "ansi256"];
for (const e of hd) {
  Ue[e] = {
    get() {
      const { level: t } = this;
      return function(...i) {
        const n = Jt(Yt(e, la[t], "color", ...i), fe.color.close, this[$e]);
        return yr(this, n, this[Ze]);
      };
    }
  };
  const r = "bg" + e[0].toUpperCase() + e.slice(1);
  Ue[r] = {
    get() {
      const { level: t } = this;
      return function(...i) {
        const n = Jt(Yt(e, la[t], "bgColor", ...i), fe.bgColor.close, this[$e]);
        return yr(this, n, this[Ze]);
      };
    }
  };
}
const pd = Object.defineProperties(() => {
}, {
  ...Ue,
  level: {
    enumerable: !0,
    get() {
      return this[Qt].level;
    },
    set(e) {
      this[Qt].level = e;
    }
  }
}), Jt = (e, r, t) => {
  let i, n;
  return t === void 0 ? (i = e, n = r) : (i = t.openAll + e, n = r + t.closeAll), {
    open: e,
    close: r,
    openAll: i,
    closeAll: n,
    parent: t
  };
}, yr = (e, r, t) => {
  const i = (...n) => vd(i, n.length === 1 ? "" + n[0] : n.join(" "));
  return Object.setPrototypeOf(i, pd), i[Qt] = e, i[$e] = r, i[Ze] = t, i;
}, vd = (e, r) => {
  if (e.level <= 0 || !r)
    return e[Ze] ? "" : r;
  let t = e[$e];
  if (t === void 0)
    return r;
  const { openAll: i, closeAll: n } = t;
  if (r.includes("\x1B"))
    for (; t !== void 0; )
      r = ld(r, t.close, t.open), t = t.parent;
  const a = r.indexOf(`
`);
  return a !== -1 && (r = fd(r, n, i, a)), i + r + n;
};
Object.defineProperties(rr.prototype, Ue);
const Ye = rr();
rr({ level: ca ? ca.level : 0 });
var Sa, Oa;
const Oe = {
  stdout: (Sa = globalThis == null ? void 0 : globalThis.process) == null ? void 0 : Sa.stdout,
  stderr: (Oa = globalThis == null ? void 0 : globalThis.process) == null ? void 0 : Oa.stderr,
  defaultLogger: console
}, gd = (e, r) => {
  const t = e.split(`
`), i = t.map((a) => a.length), n = {
    offset: r,
    row: 0,
    column: 0,
    line: ""
  };
  for (; n.offset >= 0 && t.length; )
    n.row++, n.column = n.offset, n.line = t.shift() || "", n.offset -= (i.shift() || 0) + 1;
  return n;
};
var U = /* @__PURE__ */ ((e) => (e.VALUE = "value", e.START_VALUE = "startValue", e.END_VALUE = "endValue", e.SPACE_AFTER = "spaceAfter", e.INNER_SPACE_BEFORE = "innerSpaceBefore", e))(U || {});
const fa = "“”‘’", md = (e, r) => {
  const t = e.substring(0, r);
  let i = 0, n = 0;
  for (let a = 0; a < t.length; a++) {
    const s = qe(t[a]);
    s === F.CJK_CHAR || wn(s) && fa.indexOf(t[a]) === -1 ? i++ : (s === F.WESTERN_LETTER || Ee(s) && fa.indexOf(t[a]) !== -1 || s === F.SPACE) && n++;
  }
  return " ".repeat(n) + "　".repeat(i) + `${Ye.red("^")}`;
}, Ad = (e = "", r, t, i = Oe.defaultLogger) => {
  t.forEach(({ index: n, length: a, target: s, message: o }) => {
    const c = s === "spaceAfter" || s === "endValue" ? n + a : n, { row: l, column: d, line: u } = gd(r, c), A = `${Ye.blue.bgWhite(e)}${e ? ":" : ""}`, v = `${Ye.yellow(l)}:${Ye.yellow(d)}`, g = `${A}${v} - ${o}`, w = 20, f = d - w < 0 ? 0 : d - w, h = d + a + w > u.length - 1 ? u.length : d + a + w, p = u.substring(f, h).replace(/\n/g, "\\n"), m = md(p, d - f);
    i.error(`${g}

${p}
${m}
`);
  });
}, Kh = (e, r = Oe.defaultLogger) => {
  let t = 0;
  const i = [];
  if (e.filter(({ file: n, disabled: a }) => a ? (n ? r.log(`${Ye.blue.bgWhite(n)}: disabled`) : r.log("disabled"), !1) : !0).forEach(({ file: n, origin: a, validations: s }) => {
    Ad(n, a, s, r), t += s.length, n && s.length && i.push(n);
  }), t) {
    const n = [];
    return n.push("Invalid files:"), n.push("- " + i.join(`
- `) + `
`), n.push(`Found ${t} ${t > 1 ? "errors" : "error"}.`), r.error(n.join(`
`)), 1;
  } else
    r.log("No error found.");
}, ua = "括号未闭合", yd = "括号未匹配", da = "引号未闭合", wd = "引号未匹配", Ed = (e, r, t, i) => {
  if (Je(i, e), ss(t)) {
    ta.left.indexOf(r) >= 0 ? (Sd(i, e, r), va(i, e, r, D.LEFT)) : ta.right.indexOf(r) >= 0 && (!i.lastMark || !i.lastMark.startValue ? (ga(i, e, r), Le(i, e, yd)) : (va(i, e, r, D.RIGHT), Od(i, e, r)));
    return;
  }
  if (as(t)) {
    Lt.neutral.indexOf(r) >= 0 ? i.lastGroup && r === i.lastGroup.startValue ? Aa(i, e, r) : ma(i, e, r) : Lt.left.indexOf(r) >= 0 ? ma(i, e, r) : Lt.right.indexOf(r) >= 0 && (!i.lastGroup || !i.lastGroup.startValue ? (ga(i, e, r), Le(i, e, wd)) : Aa(i, e, r));
    return;
  }
  Cd(i, e, r, t);
}, ha = (e, r, t, i) => {
  i.lastToken ? i.lastToken.type !== t ? (Je(i, e), ya(i, e, r, t)) : ls(i, r) : ya(i, e, r, t);
}, Td = (e, r) => {
  const t = [];
  return Object.assign(t, {
    type: X.GROUP,
    index: 0,
    spaceAfter: "",
    startIndex: 0,
    endIndex: e.length - 1,
    startValue: "",
    endValue: "",
    innerSpaceBefore: ""
  }), {
    lastToken: void 0,
    lastGroup: t,
    lastMark: void 0,
    tokens: t,
    marks: [...r],
    groups: [],
    markStack: [],
    groupStack: [],
    errors: []
  };
}, Je = (e, r) => {
  e.lastToken && (e.lastToken.length = r - e.lastToken.index, e.lastGroup && e.lastGroup.push(e.lastToken), e.lastToken = void 0);
}, tr = (e, r) => {
  e.lastGroup && e.lastGroup.push(r), e.lastToken = void 0;
}, bd = (e) => {
  switch (e) {
    case se.HYPER:
      return W.HYPER_MARK;
    case se.BRACKETS:
      return W.BRACKET_MARK;
    case se.RAW:
      return W.INDETERMINATED;
  }
}, pa = (e, r, t, i, n) => {
  const a = {
    type: bd(t.type),
    index: r,
    length: i.length,
    value: i,
    spaceAfter: "",
    // to be finalized
    mark: t,
    markSide: n
  };
  tr(e, a);
}, kd = (e, r, t) => {
  const i = {
    type: _d(t),
    index: r,
    length: t.length,
    value: t,
    spaceAfter: ""
    // to be finalized
  };
  tr(e, i);
}, Sd = (e, r, t, i = se.BRACKETS) => {
  e.lastMark && (e.markStack.push(e.lastMark), e.lastMark = void 0);
  const n = {
    type: i,
    startIndex: r,
    startValue: t,
    endIndex: -1,
    // to be finalized
    endValue: ""
    // to be finalized
  };
  e.marks.push(n), e.lastMark = n;
}, va = (e, r, t, i) => {
  const n = {
    type: W.BRACKET_MARK,
    index: r,
    length: 1,
    value: t,
    spaceAfter: "",
    // to be finalized
    mark: e.lastMark,
    markSide: i
  };
  tr(e, n);
}, Od = (e, r, t) => {
  e.lastMark && (e.lastMark.endIndex = r, e.lastMark.endValue = t, e.markStack.length > 0 ? e.lastMark = e.markStack.pop() : e.lastMark = void 0);
}, Cd = (e, r, t, i) => {
  tr(e, {
    type: i,
    index: r,
    length: 1,
    value: t,
    spaceAfter: ""
    // to be finalized
  });
}, ga = (e, r, t) => {
  const i = {
    type: W.UNMATCHED,
    index: r,
    length: 1,
    value: t,
    spaceAfter: ""
  };
  tr(e, i);
}, ma = (e, r, t) => {
  e.lastGroup && e.groupStack.push(e.lastGroup);
  const i = [];
  Object.assign(i, {
    type: X.GROUP,
    index: r,
    spaceAfter: "",
    // to be finalized
    startIndex: r,
    startValue: t,
    endIndex: -1,
    // to be finalized
    endValue: "",
    // to be finalized
    innerSpaceBefore: ""
    // to be finalized
  }), e.groupStack[e.groupStack.length - 1].push(i), e.lastGroup = i, e.groups.push(i);
}, Aa = (e, r, t) => {
  e.lastGroup && (e.lastGroup.endIndex = r, e.lastGroup.endValue = t), e.groupStack.length > 0 ? e.lastGroup = e.groupStack.pop() : e.lastGroup = void 0;
}, ya = (e, r, t, i) => {
  e.lastToken = {
    type: i,
    index: r,
    length: 1,
    // to be finalized
    value: t,
    // to be finalized
    spaceAfter: ""
    // to be finalized
  };
}, ls = (e, r) => {
  e.lastToken && (e.lastToken.value += r, e.lastToken.length++);
}, xd = (e, r) => {
  if (qe(e[r]) !== F.SPACE)
    return 0;
  for (let t = r + 1; t < e.length; t++) {
    const i = e[t];
    if (qe(i) !== F.SPACE)
      return t - r;
  }
  return e.length - r;
}, Rd = (e) => {
  if (e.lastGroup)
    return e.lastGroup[e.lastGroup.length - 1];
}, Id = (e) => {
  const r = {};
  return e.forEach((t) => {
    r[t.startIndex] = t, t.type !== se.RAW && (r[t.endIndex] = t);
  }), r;
}, Pd = (e, r, t, i) => {
  if (Qu.indexOf(i) < 0 || !r.lastToken || r.lastToken.type !== F.WESTERN_LETTER || e.length <= t + 1)
    return !1;
  const n = e[t + 1], a = qe(n);
  return (a === F.WESTERN_LETTER || a === F.SPACE) && (!r.lastGroup || r.lastGroup.startValue !== Yu[i]);
}, _d = (e) => e.match(/\n/) ? W.HYPER_CONTENT : e.match(/^<code.*>.*<\/code.*>$/) ? W.CODE_CONTENT : e.match(/^<.+>$/) ? W.HYPER_CONTENT : W.CODE_CONTENT, Le = (e, r, t) => {
  e.errors.push({
    name: "",
    index: r,
    length: 0,
    message: t,
    target: U.VALUE
  });
}, Bd = (e) => {
  const r = e.lastMark;
  r && r.type === se.BRACKETS && !r.endValue && Le(e, r.startIndex, ua), e.markStack.length > 0 && e.markStack.forEach((i) => {
    i !== r && Le(e, i.startIndex, ua);
  });
  const t = e.lastGroup;
  t && t.startValue && !t.endValue && Le(e, t.startIndex, da), e.groupStack.length > 0 && e.groupStack.forEach((i) => {
    i !== t && i.startValue && !i.endValue && Le(e, i.startIndex, da);
  });
}, Nd = (e, r = []) => {
  const t = Td(e, r), i = Id(r);
  for (let n = 0; n < e.length; n++) {
    const a = e[n], s = qe(a), o = i[n];
    if (o)
      Je(t, n), delete i[n], o.type === se.RAW ? (kd(
        t,
        n,
        e.substring(o.startIndex, o.endIndex)
      ), n = o.endIndex - 1) : n === o.startIndex ? (pa(
        t,
        n,
        o,
        o.startValue,
        D.LEFT
      ), n += o.startValue.length - 1) : n === o.endIndex && (pa(
        t,
        n,
        o,
        o.endValue,
        D.RIGHT
      ), n += o.endValue.length - 1);
    else if (s === F.SPACE) {
      if (Je(t, n), t.lastGroup) {
        const c = xd(e, n), l = e.substring(n, n + c);
        if (t.lastGroup.length) {
          const d = Rd(t);
          d && (d.spaceAfter = l);
        } else
          t.lastGroup.innerSpaceBefore = l;
        c - 1 > 0 && (n += c - 1);
      }
    } else
      Pd(e, t, n, a) ? ls(t, a) : ed(s) ? Ed(n, a, s, t) : te(s) ? ha(n, a, s, t) : s === F.EMPTY || ha(n, a, F.WESTERN_LETTER, t);
  }
  return Je(t, e.length), Bd(t), {
    tokens: t.tokens,
    groups: t.groups,
    marks: t.marks,
    errors: t.errors
  };
}, fs = (e) => {
  if (Array.isArray(e)) {
    const r = e;
    return r.modifiedType = e.type, r.modifiedValue = e.value, r.modifiedSpaceAfter = e.spaceAfter, r.modifiedStartValue = e.startValue, r.modifiedEndValue = e.endValue, r.modifiedInnerSpaceBefore = e.innerSpaceBefore, r.validations = [], e.forEach(fs), r;
  } else {
    const r = e;
    return r.modifiedType = e.type, r.modifiedValue = e.value, r.modifiedSpaceAfter = e.spaceAfter, r.validations = [], r;
  }
}, Ld = (e) => {
  const r = e;
  return r.modifiedStartValue = e.startValue, r.modifiedEndValue = e.endValue, r;
}, Fd = (e, r = {}) => (r.noSinglePair || (e.errors.length = 0), fs(e.tokens), e.marks.forEach(Ld), e), us = (e, r) => {
  for (let t = 0; t < e.length; t++) {
    const i = e[t];
    r(i, t, e), Array.isArray(i) && us(i, r);
  }
}, Hd = (e) => {
  var r, t;
  return {
    start: ((r = e == null ? void 0 : e.start) == null ? void 0 : r.offset) || 0,
    end: ((t = e == null ? void 0 : e.end) == null ? void 0 : t.offset) || 0
  };
}, ds = (e) => e.children !== void 0, qd = ["paragraph", "heading", "table-cell"], $d = (e) => qd.indexOf(e.type) >= 0, Ud = [
  "emphasis",
  "strong",
  "delete",
  "footnote",
  "link",
  "linkReference"
], Md = (e) => Ud.indexOf(e.type) >= 0, Vd = [
  "inlineCode",
  "break",
  "image",
  "imageReference",
  "footnoteReference",
  "html"
], hs = (e) => Vd.indexOf(e.type) >= 0, ps = (e, r) => {
  ds(e) && e.children.forEach((t) => {
    if (t.type !== "yaml")
      if ($d(t)) {
        const i = {
          block: t,
          inlineMarks: [],
          hyperMarks: [],
          value: ""
          // to be initialzed
        };
        r.push(i), vs(t, i);
      } else
        ps(t, r);
  });
}, vs = (e, r) => {
  ds(e) && e.children.forEach((t) => {
    Md(t) && (r.inlineMarks.push({ inline: t, raw: !1 }), vs(t, r)), hs(t) && r.inlineMarks.push({ inline: t, raw: !0 });
  });
}, Wd = (e, r) => {
  const { block: t, inlineMarks: i } = e;
  if (!t.position)
    return;
  const n = t.position.start.offset || 0, a = [], s = [];
  i.forEach((o) => {
    const { inline: c } = o;
    if (!c.position)
      return;
    const l = c.position.start.offset || 0, d = c.position.end.offset || 0;
    if (hs(c)) {
      const u = {
        type: se.RAW,
        // TODO: typeof RawMark.meta
        meta: c.type,
        startIndex: l - n,
        endIndex: d - n,
        startValue: r.substring(l, d),
        endValue: ""
      };
      if (u.startValue.match(/<code.*>/)) {
        const A = { ...u, code: D.LEFT };
        s.push(A), a.push(A);
        return;
      } else if (u.startValue.match(/<\/code.*>/)) {
        const A = { ...u, code: D.RIGHT }, v = s.pop();
        v && (v.rightPair = A), a.push(A);
        return;
      }
      a.push(u);
    } else {
      const u = c.children[0], A = c.children[c.children.length - 1];
      if (!u.position || !A.position)
        return;
      const v = u.position.start.offset || 0, g = A.position.end.offset || 0, w = {
        type: se.HYPER,
        // TODO: typeof RawMark.meta
        meta: c.type,
        startIndex: l - n,
        startValue: r.substring(l, v),
        endIndex: g - n,
        endValue: r.substring(g, d)
      };
      a.push(w);
    }
  }), e.value = r.substring(
    t.position.start.offset || 0,
    t.position.end.offset || 0
  ), e.hyperMarks = a.map((o) => {
    if (Xu(o)) {
      if (o.code === D.RIGHT)
        return;
      if (o.code === D.LEFT) {
        const { rightPair: c } = o;
        o.startValue = r.substring(
          o.startIndex + n,
          o.endIndex + n
        ), o.endIndex = (c == null ? void 0 : c.endIndex) || 0, o.endValue = "", delete o.rightPair;
      }
    }
    return o;
  }).filter(Boolean);
}, Dd = (e) => {
  const r = e.value, t = e.modifiedValue, i = e.ignoredByParsers, n = [], a = Po().use(Cu).use(Ku).parse(t);
  return ps(a, n), n.forEach((s) => Wd(s, r)), e.blocks = n.map((s) => {
    const o = Hd(s.block.position);
    return i.forEach(({ index: c, length: l, originValue: d, meta: u }) => {
      o.start <= c && o.end >= c + l && s.hyperMarks && s.hyperMarks.push({
        type: se.RAW,
        meta: u,
        startIndex: c - o.start,
        startValue: d,
        endIndex: c - o.start + l,
        endValue: ""
      });
    }), {
      value: s.value || "",
      marks: s.hyperMarks || [],
      ...o
    };
  }), e.ignoredByParsers = [], e;
}, jd = "此处内联代码的外部需要一个空格", zd = "此处内联代码的外部不需要空格", Ht = "此处 Markdown 标记的内部不需要空格", qt = "此处字符需要统一", $t = "此处标点符号需要使用全角", Ut = "此处标点符号需要使用半角", Gd = "此处标点符号前不需要空格", Kd = "此处标点符号后不需要空格", Qd = "此处标点符号后需要一个空格", wa = "此处括号的内部不需要空格", _e = "此处括号的外部不需要空格", Mt = "此处括号的外部需要一个空格", Yd = "此处半角内容之间需要一个空格", Jd = "此处全角内容之间不需要空格", Xd = "此处中英文内容之间需要一个空格", Zd = "此处中英文内容之间需要一个空格", Vt = "此处引号的内部不需要空格", Ke = "此处引号的外部不需要空格", dr = "此处引号的外部需要一个空格", Qe = "此处需要去除外部空格", ge = (e, r) => {
  if (!r)
    return;
  const t = e.indexOf(r);
  if (!(t < 0))
    return e[t - 1];
}, ne = (e, r) => {
  if (!r)
    return;
  const t = e.indexOf(r);
  if (!(t < 0))
    return e[t + 1];
}, Tn = (e, r) => {
  if (!r)
    return;
  const t = ge(e, r);
  if (t) {
    if (Sr(t.type) || De(t))
      return Tn(e, t);
    if (En(t.type))
      return t;
  }
}, Or = (e, r) => {
  if (!r)
    return;
  const t = ne(e, r);
  if (t) {
    if (Sr(t.type) || De(t))
      return Or(e, t);
    if (En(t.type))
      return t;
  }
}, nr = (e, r) => {
  if (!r)
    return;
  const t = ge(e, r);
  if (t) {
    if (Sr(t.type) || De(t))
      return nr(e, t);
    if (cs(t.type))
      return t;
  }
}, We = (e, r) => {
  if (!r)
    return;
  const t = ne(e, r);
  if (t) {
    if (Sr(t.type) || De(t))
      return We(e, t);
    if (cs(t.type))
      return t;
  }
}, eh = (e) => e.type !== W.HYPER_CONTENT ? !1 : !!e.value.match(/^<.+>$/), De = (e) => {
  if (eh(e) && !e.value.match(/^<code.*>.*<\/code.*>$/) && !e.value.match(/^<[^/].+\/\s*>$/)) {
    if (e.value.match(/^<[^/].+>$/))
      return D.LEFT;
    if (e.value.match(/^<\/.+>$/))
      return D.RIGHT;
  }
}, we = (e) => e.type === W.HYPER_MARK || !!De(e), Xe = (e) => e.type === W.HYPER_MARK ? e.markSide : De(e), wr = (e, r, t, i) => {
  if (i) {
    const n = ge(e, r);
    n && we(n) && (t.unshift(n), wr(e, n, t, i));
  } else {
    const n = ne(e, r);
    n && we(n) && (t.push(n), wr(e, n, t, i));
  }
}, Xt = (e, r) => {
  const t = [r];
  return wr(e, r, t, !1), wr(e, r, t, !0), t;
}, rh = (e, r) => {
  if (!r.length)
    return;
  const t = r[0], i = r[r.length - 1], n = Xe(t), a = Xe(i), s = ge(e, t);
  if (!s || !n || !a)
    return;
  if (n === a)
    return n === D.LEFT ? s : i;
  if (n === D.LEFT)
    return;
  let o = s;
  for (; o && o !== i; ) {
    const c = ne(e, o);
    if (c && Xe(c) === D.LEFT)
      return o;
    o = c;
  }
  return s;
}, ee = (e, r, t) => {
  if (!r || !t)
    return {
      spaceHost: void 0,
      wrappers: [],
      tokens: []
    };
  const i = ne(e, r), n = We(e, r);
  if (!i || n !== t)
    return {
      spaceHost: void 0,
      wrappers: [],
      tokens: []
    };
  if (i === t)
    return {
      spaceHost: r,
      wrappers: [],
      tokens: [r]
    };
  const a = Xt(e, i);
  return {
    spaceHost: rh(e, a),
    wrappers: a,
    tokens: [r, ...a]
  };
}, gs = (e, r) => {
  const t = ge(e, r), i = ne(e, r);
  return Ee(r.type) && t && t.type === F.WESTERN_LETTER && i && i.type === F.WESTERN_LETTER ? !t.spaceAfter && !r.spaceAfter : !1;
}, ms = (e, r) => {
  if (Ee(r.type)) {
    const t = ge(e, r), i = ne(e, r);
    if (t && Ee(t.type) && !t.spaceAfter || i && Ee(i.type) && !r.spaceAfter)
      return !0;
  }
  return !1;
}, th = (e, r, t, i) => {
  const n = {
    index: e.index,
    length: e.length,
    target: r,
    name: i,
    message: t
  };
  return r === U.START_VALUE ? (n.index = e.startIndex, n.length = 0) : r === U.END_VALUE ? (n.index = e.endIndex, n.length = 0) : r === U.INNER_SPACE_BEFORE && (n.index = e.startIndex, n.length = e.startValue.length), n;
}, As = (e, r, t, i) => {
  const n = th(e, r, t, i);
  Z(e, r), e.validations.push(n);
}, Z = (e, r) => {
  e.validations = e.validations.filter(
    (t) => t.target !== r
  );
}, Cr = (e, r) => (t, i, n) => {
  t[e] !== i && (t[e] = i, As(t, r, n, ""));
}, V = Cr(
  "modifiedSpaceAfter",
  U.SPACE_AFTER
), Zt = Cr(
  "modifiedStartValue",
  U.START_VALUE
), en = Cr(
  "modifiedEndValue",
  U.END_VALUE
), rn = Cr(
  "modifiedInnerSpaceBefore",
  U.INNER_SPACE_BEFORE
), tn = (e, r, t, i) => {
  e.modifiedValue !== r && (e.modifiedValue = r, t && (e.modifiedType = t), As(e, U.VALUE, i, ""));
}, nh = (e) => {
  const r = e == null ? void 0 : e.trimSpace;
  return (t, i, n) => {
    if (r && !n.startValue && i === 0) {
      n.modifiedInnerSpaceBefore && rn(n, "", Qe), we(t) && Xt(n, t).forEach(
        (s) => V(s, "", Qe)
      );
      const a = n[n.length - 1];
      if (a)
        if (we(a)) {
          const s = nr(n, t);
          s && (Xt(n, a).forEach(
            (o) => V(o, "", Qe)
          ), V(s, "", Qe));
        } else
          V(a, "", Qe);
    }
  };
}, ih = [
  [",", "，"],
  [".", "。"],
  [";", "；"],
  [":", "："],
  ["?", "？"],
  ["!", "！"],
  ["(", "（"],
  [")", "）"],
  ["[", "［"],
  ["]", "］"],
  ["{", "｛"],
  ["}", "｝"]
], ah = [
  ['"', "“", "”"],
  ["'", "‘", "’"]
], sh = (e, r) => {
  r.indexOf(e.modifiedValue) >= 0 && (e.modifiedType = is(e.type));
}, oh = (e) => {
  const r = (e == null ? void 0 : e.halfwidthPunctuation) || "", t = (e == null ? void 0 : e.fullwidthPunctuation) || "", i = (e == null ? void 0 : e.adjustedFullwidthPunctuation) || "", n = {}, a = {}, s = {};
  return ih.forEach(([o, c]) => {
    r.indexOf(o) >= 0 && (n[c] = o), t.indexOf(c) >= 0 && (a[o] = c);
  }), ah.forEach(([o, c, l]) => {
    r.indexOf(o) >= 0 && (n[c] = o, n[l] = o), (t.indexOf(c) >= 0 || t.indexOf(l) >= 0) && (s[o] = [c, l]);
  }), {
    halfwidthMap: n,
    fullwidthMap: a,
    fullwidthPairMap: s,
    adjusted: i
  };
}, ch = (e) => {
  const { halfwidthMap: r, fullwidthMap: t, fullwidthPairMap: i, adjusted: n } = oh(e);
  return (s, o, c) => {
    if (!Kt(s.type) && s.type !== W.BRACKET_MARK && s.type !== X.GROUP || gs(c, s) || ms(c, s))
      return;
    if (Kt(s.type) || s.type === W.BRACKET_MARK) {
      const u = s.modifiedValue;
      t[u] ? (tn(
        s,
        t[u],
        Zu(s.type),
        $t
      ), sh(s, n)) : r[u] && tn(
        s,
        r[u],
        is(s.type),
        Ut
      );
      return;
    }
    const l = s.modifiedStartValue, d = s.modifiedEndValue;
    i[l] ? Zt(
      s,
      i[l][0],
      $t
    ) : r[l] && Zt(
      s,
      r[l][0],
      Ut
    ), i[d] ? en(
      s,
      i[d][1],
      $t
    ) : r[d] && en(s, r[d][1], Ut);
  };
}, Wt = {
  // U+2047 DOUBLE QUESTION MARK, U+203C DOUBLE EXCLAMATION MARK
  // U+2048 QUESTION EXCLAMATION MARK, U+2049 EXCLAMATION QUESTION MARK
  "？？": ["⁇"],
  "！！": ["‼"],
  "？！": ["⁈"],
  "！？": ["⁉"],
  // U+002F SOLIDUS, U+FF0F FULLWIDTH SOLIDUS
  "/": ["/", "／"],
  // U+FF5E FULLWIDTH TILDE
  "~": ["~", "～"],
  // U+2026 HORIZONTAL ELLIPSIS, U+22EF MIDLINE HORIZONTAL ELLIPSIS
  "…": ["…", "⋯"],
  // U+25CF BLACK CIRCLE, U+2022 BULLET, U+00B7 MIDDLE DOT,
  // U+2027 HYPHENATION POINT, U+30FB KATAKANA MIDDLE DOT
  "·": ["●", "•", "·", "‧", "・"]
}, lh = {
  "“": ["「"],
  "”": ["」"],
  "‘": ["『"],
  "’": ["』"]
}, fh = {
  "「": ["“"],
  "」": ["”"],
  "『": ["‘"],
  "』": ["’"]
}, uh = (e) => {
  const r = {};
  for (const t in e)
    e[t].forEach((n) => {
      r[n] = t;
    });
  return r;
}, dh = (e) => {
  const r = e == null ? void 0 : e.unifiedPunctuation, t = typeof r == "string" ? r : void 0, i = {};
  return t ? (Object.assign(i, Wt), t === "simplified" ? Object.assign(i, lh) : t === "traditional" && Object.assign(i, fh)) : typeof r == "object" && (r.default && Object.assign(i, Wt), Object.entries(r).forEach(([n, a]) => {
    a === !0 ? i[n] = Wt[n] : a === !1 ? delete i[n] : i[n] = a;
  })), uh(i);
}, hh = (e) => {
  const r = dh(e);
  return (i) => {
    if (i.type === X.GROUP) {
      r[i.modifiedStartValue] && Zt(
        i,
        r[i.modifiedStartValue],
        qt
      ), r[i.modifiedEndValue] && en(
        i,
        r[i.modifiedEndValue],
        qt
      );
      return;
    } else
      r[i.modifiedValue] && tn(
        i,
        r[i.modifiedValue],
        void 0,
        qt
      );
  };
}, ph = (e) => e.map((r) => r.split(".").reverse().slice(1)), ys = (e, r, t) => {
  const i = ge(r, e);
  if (i && !i.spaceAfter) {
    const n = t.filter(
      (a) => a[0].toLowerCase() === i.value.toLowerCase()
    ).map((a) => a.slice(1));
    if (n.length)
      if (n[n.length - 1].length) {
        const s = ge(r, i);
        if (s && !s.spaceAfter && s.value === "." && ys(s, r, n))
          return !0;
      } else
        return !0;
  }
  return !1;
}, vh = (e) => {
  const r = ph(e.skipAbbrs || []);
  return (t, i, n) => {
    if (t.value !== ".")
      return;
    const a = ne(n, t);
    a && a.type === F.WESTERN_LETTER && !t.spaceAfter || ys(t, n, r) && (t.modifiedValue = ".", t.modifiedType = t.type, Z(t, U.VALUE));
  };
}, gh = (e) => {
  const r = e == null ? void 0 : e.noSpaceInsideHyperMark;
  return (t, i, n) => {
    if (!r)
      return;
    const a = ne(n, t);
    if (!a || !we(t) && !we(a))
      return;
    const s = Xe(t), o = Xe(a);
    (s === o || s === D.LEFT && !we(a) || o === D.RIGHT && !we(t)) && V(t, "", Ht);
  };
}, mh = (e) => {
  const r = e == null ? void 0 : e.spaceOutsideCode, t = r ? " " : "", i = r ? jd : zd;
  return (a, s, o) => {
    if (typeof r > "u" || a.type !== W.CODE_CONTENT)
      return;
    const c = nr(o, a), l = We(o, a), { spaceHost: d } = ee(
      o,
      c,
      a
    ), { spaceHost: u } = ee(
      o,
      a,
      l
    );
    c && te(c.type) && d && V(d, t, i), l && (te(l.type) || l.type === W.CODE_CONTENT) && u && V(u, t, i);
  };
}, Ah = (e) => {
  const r = e == null ? void 0 : e.spaceBetweenHalfwidthContent, t = e == null ? void 0 : e.noSpaceBetweenFullwidthContent, i = e == null ? void 0 : e.spaceBetweenMixedwidthContent;
  return (n, a, s) => {
    if (!te(n.type))
      return;
    const o = We(s, n);
    if (!o || !te(o.type))
      return;
    const { spaceHost: c, tokens: l } = ee(
      s,
      n,
      o
    );
    if (c)
      if (o.type === n.type) {
        if (n.type === F.WESTERN_LETTER) {
          if (!r || l.length > 1 && l.filter((A) => A.spaceAfter).length === 0)
            return;
        } else if (!t)
          return;
        const d = n.type === F.WESTERN_LETTER ? " " : "", u = n.type === F.WESTERN_LETTER ? Yd : Jd;
        V(c, d, u);
      } else {
        if (typeof i > "u")
          return;
        V(c, i ? " " : "", i ? Xd : Zd);
      }
  };
}, yh = (e) => {
  const r = e == null ? void 0 : e.noSpaceBeforePauseOrStop, t = e == null ? void 0 : e.spaceAfterHalfwidthPauseOrStop, i = e == null ? void 0 : e.noSpaceAfterFullwidthPauseOrStop;
  return (n, a, s) => {
    if (yn(n.type) && !gs(s, n) && !ms(s, n)) {
      if (r) {
        const o = nr(s, n);
        if (o && // content
        (te(o.type) || // right-quotation
        o.type === X.GROUP || // right-bracket
        o.type === W.BRACKET_MARK && o.markSide === D.RIGHT || // code
        o.type === W.CODE_CONTENT)) {
          const { spaceHost: c } = ee(
            s,
            o,
            n
          );
          c && V(c, "", Gd);
        }
      }
      if (wn(n.modifiedType) && i || Ee(n.modifiedType) && t) {
        const o = Ee(n.modifiedType) ? " " : "", c = Ee(n.modifiedType) ? Qd : Kd, l = We(s, n);
        if (l && // content
        (te(l.type) || // left-quotation
        l.type === X.GROUP || // left-bracket
        l.type === W.BRACKET_MARK && l.markSide === D.LEFT || // code
        l.type === W.CODE_CONTENT)) {
          const { spaceHost: d } = ee(
            s,
            n,
            l
          );
          d && V(d, o, c);
        }
      }
    }
  };
}, hr = (e, r) => Ar(e) && r.indexOf(e) === -1, wh = (e) => {
  const r = e.noSpaceInsideQuotation, t = e.spaceOutsideHalfwidthQuotation, i = e.noSpaceOutsideFullwidthQuotation, n = e.adjustedFullwidthPunctuation || "";
  return (a, s, o) => {
    if (a.type === X.GROUP) {
      if (r) {
        const c = a[0];
        c && c.markSide !== D.RIGHT && rn(a, "", Vt);
        const l = a[a.length - 1];
        l && l.markSide !== D.LEFT && V(l, "", Vt), c || rn(a, "", Vt);
      }
      if (typeof t < "u" || i) {
        const c = Or(o, a);
        if (c && c.type === X.GROUP) {
          const { spaceHost: d } = ee(
            o,
            a,
            c
          );
          d && (hr(a.modifiedEndValue, n) || hr(
            c.modifiedStartValue,
            n
          ) ? i && V(d, "", dr) : typeof t < "u" && V(d, t ? " " : "", t ? dr : Ke));
        }
        const l = Tn(o, a);
        if (l && (te(l.type) || l.type === W.CODE_CONTENT)) {
          const { spaceHost: d } = ee(
            o,
            l,
            a
          );
          d && (hr(
            a.modifiedStartValue,
            n
          ) ? i && V(d, "", Ke) : typeof t < "u" && V(d, t ? " " : "", t ? dr : Ke));
        }
        if (c && (te(c.type) || c.type === W.CODE_CONTENT)) {
          const { spaceHost: d } = ee(
            o,
            a,
            c
          );
          d && (hr(
            a.modifiedEndValue,
            n
          ) ? i && V(d, "", Ke) : typeof t < "u" && V(d, t ? " " : "", t ? dr : Ke));
        }
      }
    }
  };
}, pr = (e, r) => Ar(e) && r.indexOf(e) === -1, Eh = (e, r, t, i, n) => !e || !n || Ar(t.value) || Ar(t.modifiedValue) || r.filter((a) => a.spaceAfter).length || i.filter((a) => a.spaceAfter).length ? !1 : (
  // x(x
  //  ^
  (e.type === F.WESTERN_LETTER || // x()
  //  ^
  e.value === "(" && t.value === ")") && // x)x
  //  ^
  (n.type === F.WESTERN_LETTER || // ()x
  //  ^
  t.value === "(" && n.value === ")")
), Th = (e) => {
  const r = e.noSpaceInsideBracket, t = e.spaceOutsideHalfwidthBracket, i = e.noSpaceOutsideFullwidthBracket, n = e.adjustedFullwidthPunctuation || "";
  return (a, s, o) => {
    if (a.type !== W.BRACKET_MARK)
      return;
    if (r)
      if (a.markSide === D.LEFT)
        ne(o, a) && V(a, "", wa);
      else {
        const g = ge(o, a);
        g && // dedupe
        g.markSide !== D.LEFT && V(g, "", wa);
      }
    const c = nr(o, a), l = We(o, a), { spaceHost: d, tokens: u } = ee(o, c, a), { spaceHost: A, tokens: v } = ee(o, a, l);
    if (!Eh(
      c,
      u,
      a,
      v,
      l
    ) && (typeof t < "u" || i)) {
      const g = pr(
        a.modifiedValue,
        n
      );
      l && a.markSide === D.RIGHT && l.markSide === D.LEFT && A && (g || pr(
        l.modifiedValue,
        n
      ) ? i && V(a, "", _e) : v.filter((f) => f.spaceAfter).length > 0 && typeof t < "u" && V(a, t ? " " : "", t ? Mt : _e)), a.markSide === D.LEFT ? c && (te(c.type) || c.type === X.GROUP || c.type === W.CODE_CONTENT) && d && (g || c.type === X.GROUP && pr(
        c.modifiedEndValue,
        n
      ) ? i && V(d, "", _e) : typeof t < "u" && V(d, t ? " " : "", t ? Mt : _e)) : l && (te(l.type) || l.type === X.GROUP || l.type === W.CODE_CONTENT) && A && (g || l.type === X.GROUP && pr(
        l.modifiedStartValue,
        n
      ) ? i && V(A, "", _e) : typeof t < "u" && V(A, t ? " " : "", t ? Mt : _e));
    }
  };
}, bh = (e) => (r) => {
  r.spaceAfter && r.spaceAfter.match(/\n/) && (Z(r, U.SPACE_AFTER), r.modifiedSpaceAfter = r.spaceAfter);
}, kh = (e) => {
  const t = ((e == null ? void 0 : e.skipZhUnits) || "").split("").filter((n) => qe(n) === F.CJK_CHAR).join(""), i = new RegExp(`^[${t}]`);
  return (n, a, s) => {
    if (n.type === F.WESTERN_LETTER && n.value.match(/^\d+$/)) {
      const o = Or(s, n);
      if (Array.isArray(o))
        return;
      if (o && o.value.match(i)) {
        const { spaceHost: c, tokens: l } = ee(s, n, o);
        if (l.some((A) => A.spaceAfter))
          return;
        const u = Tn(s, n);
        if (u) {
          const { spaceHost: A, tokens: v } = ee(s, u, n);
          if (v.some(
            (w) => w.spaceAfter
          ))
            return;
          A && (A.modifiedSpaceAfter = "", Z(
            A,
            U.SPACE_AFTER
          ));
        }
        c && (c.modifiedSpaceAfter = "", Z(c, U.SPACE_AFTER));
      }
    }
  };
}, Sh = (e) => (r, t, i) => {
  if (r.value !== "&")
    return;
  const n = ne(i, r);
  if (!n || n.type !== F.WESTERN_LETTER || r.spaceAfter)
    return;
  const a = ne(i, n);
  if (!a || a.value !== ";" || n.spaceAfter)
    return;
  r.modifiedValue = r.value, r.modifiedType = r.type, r.modifiedSpaceAfter = r.spaceAfter, Z(r, U.VALUE), Z(r, U.SPACE_AFTER), n.modifiedValue = n.value, n.modifiedType = n.type, n.modifiedSpaceAfter = n.spaceAfter, Z(n, U.VALUE), Z(n, U.SPACE_AFTER), a.modifiedValue = a.value, a.modifiedType = a.type, Z(a, U.VALUE), Z(a, U.SPACE_AFTER);
  const s = Or(i, a);
  if (s) {
    const { spaceHost: o } = ee(i, a, s);
    o && (o.modifiedSpaceAfter = o.spaceAfter, Z(o, U.SPACE_AFTER));
  }
}, ws = (e) => e.some((r) => {
  if (r.type === X.GROUP)
    return ws(r);
  if (rd(r.type))
    return !r.value.match(/[‘’“”]/);
}), Es = (e) => {
  e.forEach((r) => {
    for (const t in U)
      Z(r, t);
    r.modifiedSpaceAfter = r.spaceAfter, r.modifiedType = r.type, r.modifiedValue = r.value, r.type === X.GROUP && (r.modifiedInnerSpaceBefore = r.innerSpaceBefore, Es(r));
  });
}, Oh = (e) => {
  const r = e == null ? void 0 : e.skipPureWestern;
  return (t, i, n) => {
    r && !n.startValue && i === 0 && (ws(n) || Es(n));
  };
}, Ch = (e) => [
  nh(e),
  ch(e),
  hh(e),
  vh(e),
  gh(e),
  mh(e),
  Ah(e),
  yh(e),
  wh(e),
  Th(e),
  bh(),
  kh(e),
  Sh(),
  Oh(e)
], Ts = {
  noSinglePair: !0,
  halfwidthPunctuation: "()[]{}",
  fullwidthPunctuation: "，。：；？！“”‘’",
  adjustedFullwidthPunctuation: "“”‘’",
  unifiedPunctuation: "simplified",
  spaceBetweenHalfwidthContent: !0,
  noSpaceBetweenFullwidthContent: !0,
  spaceBetweenMixedwidthContent: !0,
  noSpaceBeforePauseOrStop: !0,
  spaceAfterHalfwidthPauseOrStop: !0,
  noSpaceAfterFullwidthPauseOrStop: !0,
  spaceOutsideHalfwidthQuotation: !0,
  noSpaceOutsideFullwidthQuotation: !0,
  noSpaceInsideQuotation: !0,
  spaceOutsideHalfwidthBracket: !0,
  noSpaceOutsideFullwidthBracket: !0,
  noSpaceInsideBracket: !0,
  spaceOutsideCode: !0,
  noSpaceInsideHyperMark: !0,
  trimSpace: !0,
  skipZhUnits: "年月日天号时分秒",
  skipAbbrs: [
    "Mr.",
    "Mrs.",
    "Dr.",
    "Jr.",
    "Sr.",
    "vs.",
    "etc.",
    "i.e.",
    "e.g.",
    "a.k.a."
  ],
  skipPureWestern: !0
}, bn = [
  { name: "ignore", value: Is },
  { name: "hexo", value: _s },
  { name: "vuepress", value: Bs },
  { name: "markdown", value: Dd }
], xh = (e) => e.reduce((r, { name: t, value: i }) => (r[t] = i, r), {}), nn = xh(bn), Rh = (e, r) => e.map((t) => {
  switch (typeof t) {
    case "function":
      return t;
    case "string":
      return r[t];
    default:
      return null;
  }
}).filter(Boolean), Ea = {
  halfWidthPunctuation: "halfwidthPunctuation",
  fullWidthPunctuation: "fullwidthPunctuation",
  adjustedFullWidthPunctuation: "adjustedFullwidthPunctuation",
  spaceBetweenHalfWidthLetters: "spaceBetweenHalfwidthContent",
  spaceBetweenHalfWidthContent: "spaceBetweenHalfwidthContent",
  noSpaceBetweenFullWidthLetters: "noSpaceBetweenFullwidthContent",
  noSpaceBetweenFullWidthContent: "noSpaceBetweenFullwidthContent",
  spaceBetweenMixedWidthLetters: "spaceBetweenMixedwidthContent",
  spaceBetweenMixedWidthContent: "spaceBetweenMixedwidthContent",
  noSpaceBeforePunctuation: "noSpaceBeforePauseOrStop",
  spaceAfterHalfWidthPunctuation: "spaceAfterHalfwidthPauseOrStop",
  noSpaceAfterFullWidthPunctuation: "noSpaceAfterFullwidthPauseOrStop",
  spaceOutsideHalfQuote: "spaceOutsideHalfwidthQuotation",
  noSpaceOutsideFullQuote: "noSpaceOutsideFullwidthQuotation",
  noSpaceInsideQuote: "noSpaceInsideQuotation",
  spaceOutsideHalfBracket: "spaceOutsideHalfwidthBracket",
  noSpaceOutsideFullBracket: "noSpaceOutsideFullwidthBracket",
  noSpaceInsideWrapper: "noSpaceInsideHyperMark",
  noSpaceInsideMark: "noSpaceInsideHyperMark"
}, Ih = (e, r) => {
  for (const t in Ea) {
    const i = Ea[t];
    e[t] && (r.warn(`[deprecate] ${t} is deprecated, use ${i} instead`), e[i] = e[i] ?? e[t], delete e[t]);
  }
}, Ph = (e) => {
  const r = e.logger ?? Oe.defaultLogger, t = e.rules ?? {}, i = t.preset === "default" ? Ts : {};
  Ih(t, r);
  let n;
  return typeof e.hyperParse == "function" ? n = [e.hyperParse] : n = e.hyperParse || bn.map((s) => s.name), {
    logger: r,
    ignoredCases: e.ignoredCases || [],
    rules: { ...i, ...t },
    hyperParse: Rh(
      n,
      nn
    )
  };
}, _h = (e, r = Oe.defaultLogger) => {
  const t = {
    logger: r,
    rules: {},
    hyperParse: [],
    ignoredCases: []
  };
  let i = [];
  return e.preset === "default" && (t.rules = { ...Ts }, i = bn.map((n) => n.name)), e.rules && (t.rules = { ...t.rules, ...e.rules }), Array.isArray(e.hyperParsers) && (i = e.hyperParsers), i.forEach((n) => {
    if (!nn[n]) {
      r.log(`The hyper parser ${n} is invalid.`);
      return;
    }
    t.hyperParse.push(nn[n]);
  }), e.caseIgnores && e.caseIgnores.forEach((n) => {
    const a = Ca(n);
    a ? t.ignoredCases.push(a) : r.log(`The format of ignore case: "${n}" is invalid.`);
  }), t;
}, Bh = (e, r = [], t = Oe.defaultLogger) => {
  const i = [];
  return r.forEach(({ prefix: n, textStart: a, textEnd: s, suffix: o }) => {
    const c = (n || "") + a, l = (s || "") + (o || ""), d = n ? n.length : 0, u = o ? o.length : 0, A = (v) => {
      const g = e.substring(v).indexOf(c);
      if (g === -1)
        return;
      const w = v + g + d, f = w + a.length;
      if (!l)
        i.push({
          start: w,
          end: f
        }), A(f);
      else {
        const h = e.substring(f).indexOf(l), p = f + h + (s || "").length;
        if (h === -1)
          return;
        i.push({
          start: w,
          end: p
        }), A(p + u);
      }
    };
    A(0);
  }), i.sort((n, a) => n.start - a.start);
}, Be = (e, r, t) => e <= t.end && r >= t.start, Ta = (e, r = []) => {
  const t = {
    ignored: !1,
    [U.VALUE]: !1,
    [U.SPACE_AFTER]: !1,
    [U.START_VALUE]: !1,
    [U.END_VALUE]: !1,
    [U.INNER_SPACE_BEFORE]: !1
  };
  return r.forEach((i) => {
    if (Array.isArray(e)) {
      const {
        index: n,
        startValue: a,
        innerSpaceBefore: s,
        endIndex: o = 0,
        endValue: c,
        spaceAfter: l
      } = e;
      Be(n, n + (a || "").length, i) && (t[U.SPACE_AFTER] = t.ignored = !0), Be(
        n + (a || "").length,
        n + (a || "").length + (s || "").length,
        i
      ) && (t[U.INNER_SPACE_BEFORE] = t.ignored = !0), Be(o, o + (c || "").length, i) && (t[U.END_VALUE] = t.ignored = !0), Be(
        o + (c || "").length,
        o + (c || "").length + (l || "").length,
        i
      ) && (t[U.SPACE_AFTER] = t.ignored = !0);
    } else {
      const { index: n, value: a, spaceAfter: s } = e;
      Be(n, n + (a || "").length, i) && (t[U.VALUE] = t.ignored = !0), Be(
        n + (a || "").length,
        n + (a || "").length + (s || "").length,
        i
      ) && (t[U.SPACE_AFTER] = t.ignored = !0);
    }
  }), t;
}, ba = (e, r = 0, t, i = [], n = []) => {
  e.validations.forEach((a) => {
    const s = { ...a, index: a.index + r };
    t[a.target] ? n.push(s) : i.push(s);
  });
}, bs = (e, r = 0, t = [], i = [], n = [], a = [], s) => {
  const o = Ta(e, t);
  return !s && o.ignored && i.push(e), s || ba(
    e,
    r,
    o,
    n,
    a
  ), o[U.START_VALUE] && (e.ignoredStartValue = e.modifiedStartValue, e.modifiedStartValue = e.startValue), o[U.INNER_SPACE_BEFORE] && (e.ignoredInnerSpaceBefore = e.modifiedInnerSpaceBefore, e.modifiedInnerSpaceBefore = e.innerSpaceBefore), o[U.END_VALUE] && (e.ignoredEndValue = e.modifiedEndValue, e.modifiedEndValue = e.endValue), o[U.SPACE_AFTER] && (e.ignoredSpaceAfter = e.modifiedSpaceAfter, e.modifiedSpaceAfter = e.spaceAfter), [
    e.modifiedStartValue,
    e.modifiedInnerSpaceBefore,
    ...e.map((c) => {
      const l = Ta(c, t);
      return l.ignored && i.push(c), ba(
        c,
        r,
        l,
        n,
        a
      ), Array.isArray(c) ? bs(
        c,
        r,
        t,
        i,
        n,
        a,
        !0
      ) : (l[U.VALUE] && (c.ignoredValue = c.modifiedValue, c.modifiedValue = c.value), l[U.SPACE_AFTER] && (c.ignoredSpaceAfter = c.modifiedSpaceAfter, c.modifiedSpaceAfter = c.spaceAfter), [c.modifiedValue, c.modifiedSpaceAfter].filter(Boolean).join(""));
    }),
    e.modifiedEndValue,
    e.modifiedSpaceAfter
  ].filter(Boolean).join("");
}, Nh = (e, r) => {
  if (r.length === 0)
    return {
      value: e,
      pieces: [{ value: e, start: 0, end: e.length, nonBlock: !0 }]
    };
  const t = r.reduce((n, a, s) => {
    const { start: o, end: c } = a, l = n[n.length - 1], d = l ? l.end : 0;
    if (d < o) {
      const u = {
        nonBlock: !0,
        start: d,
        end: o,
        value: ""
      };
      u.value = e.substring(
        u.start,
        u.end
      ), n.push(u);
    }
    if (n.push(a), s === r.length - 1 && c !== e.length) {
      const u = {
        nonBlock: !0,
        start: c,
        end: e.length,
        value: ""
      };
      u.value = e.substring(
        u.start,
        u.end
      ), n.push(u);
    }
    return n;
  }, []);
  return { value: t.map(({ value: n }) => n).join(""), pieces: t };
}, Qh = (e, r = {}) => {
  const t = Ph(r);
  return ks(e, t);
}, Yh = (e, r) => {
  const t = _h(r);
  return ks(e, t);
}, ks = (e, r) => {
  const t = /<!--\s*zhlint\s*disabled\s*-->/g;
  if (e.match(t))
    return { origin: e, result: e, validations: [], disabled: !0 };
  const { logger: i, ignoredCases: n, rules: a, hyperParse: s } = r, o = {
    value: e,
    modifiedValue: e,
    ignoredByRules: n,
    ignoredByParsers: [],
    blocks: [
      {
        value: e,
        marks: [],
        start: 0,
        end: e.length - 1
      }
    ]
  }, c = [], l = [], d = [], u = [], A = s.reduce(
    (h, p) => p(h),
    o
  ), v = Ch(a), g = A.blocks.map(
    ({ value: h, marks: p, start: m, end: T }) => {
      let y = h;
      const b = Fd(Nd(h, p), a);
      l.push(...b.errors);
      const k = Bh(
        h,
        o.ignoredByRules,
        i
      );
      return v.forEach((x) => {
        us(b.tokens, x);
      }), y = bs(
        b.tokens,
        m,
        k,
        c,
        d,
        u
      ), {
        ...b,
        start: m,
        end: T,
        value: y,
        originValue: h
      };
    }
  ), w = Nh(e, g), f = {
    pieces: w.pieces,
    blocks: g,
    ignoredCases: A.ignoredByRules,
    ignoredByParsers: A.ignoredByParsers,
    ignoredTokens: c,
    parserErrors: l,
    ruleErrors: d,
    ignoredRuleErrors: u
  };
  return {
    origin: e,
    result: w.value,
    validations: [...l, ...d],
    __debug__: f
  };
};
function Lh(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Ss = { exports: {} }, z = Ss.exports = {}, ue, de;
function an() {
  throw new Error("setTimeout has not been defined");
}
function sn() {
  throw new Error("clearTimeout has not been defined");
}
(function() {
  try {
    typeof setTimeout == "function" ? ue = setTimeout : ue = an;
  } catch {
    ue = an;
  }
  try {
    typeof clearTimeout == "function" ? de = clearTimeout : de = sn;
  } catch {
    de = sn;
  }
})();
function Os(e) {
  if (ue === setTimeout)
    return setTimeout(e, 0);
  if ((ue === an || !ue) && setTimeout)
    return ue = setTimeout, setTimeout(e, 0);
  try {
    return ue(e, 0);
  } catch {
    try {
      return ue.call(null, e, 0);
    } catch {
      return ue.call(this, e, 0);
    }
  }
}
function Fh(e) {
  if (de === clearTimeout)
    return clearTimeout(e);
  if ((de === sn || !de) && clearTimeout)
    return de = clearTimeout, clearTimeout(e);
  try {
    return de(e);
  } catch {
    try {
      return de.call(null, e);
    } catch {
      return de.call(this, e);
    }
  }
}
var pe = [], Fe = !1, Ce, mr = -1;
function Hh() {
  !Fe || !Ce || (Fe = !1, Ce.length ? pe = Ce.concat(pe) : mr = -1, pe.length && Cs());
}
function Cs() {
  if (!Fe) {
    var e = Os(Hh);
    Fe = !0;
    for (var r = pe.length; r; ) {
      for (Ce = pe, pe = []; ++mr < r; )
        Ce && Ce[mr].run();
      mr = -1, r = pe.length;
    }
    Ce = null, Fe = !1, Fh(e);
  }
}
z.nextTick = function(e) {
  var r = new Array(arguments.length - 1);
  if (arguments.length > 1)
    for (var t = 1; t < arguments.length; t++)
      r[t - 1] = arguments[t];
  pe.push(new xs(e, r)), pe.length === 1 && !Fe && Os(Cs);
};
function xs(e, r) {
  this.fun = e, this.array = r;
}
xs.prototype.run = function() {
  this.fun.apply(null, this.array);
};
z.title = "browser";
z.browser = !0;
z.env = {};
z.argv = [];
z.version = "";
z.versions = {};
function me() {
}
z.on = me;
z.addListener = me;
z.once = me;
z.off = me;
z.removeListener = me;
z.removeAllListeners = me;
z.emit = me;
z.prependListener = me;
z.prependOnceListener = me;
z.listeners = function(e) {
  return [];
};
z.binding = function(e) {
  throw new Error("process.binding is not supported");
};
z.cwd = function() {
  return "/";
};
z.chdir = function(e) {
  throw new Error("process.chdir is not supported");
};
z.umask = function() {
  return 0;
};
var qh = Ss.exports;
const $h = /* @__PURE__ */ Lh(qh);
function le(e) {
  if (typeof e != "string")
    throw new TypeError("Path must be a string. Received " + JSON.stringify(e));
}
function ka(e, r) {
  for (var t = "", i = 0, n = -1, a = 0, s, o = 0; o <= e.length; ++o) {
    if (o < e.length)
      s = e.charCodeAt(o);
    else {
      if (s === 47)
        break;
      s = 47;
    }
    if (s === 47) {
      if (!(n === o - 1 || a === 1))
        if (n !== o - 1 && a === 2) {
          if (t.length < 2 || i !== 2 || t.charCodeAt(t.length - 1) !== 46 || t.charCodeAt(t.length - 2) !== 46) {
            if (t.length > 2) {
              var c = t.lastIndexOf("/");
              if (c !== t.length - 1) {
                c === -1 ? (t = "", i = 0) : (t = t.slice(0, c), i = t.length - 1 - t.lastIndexOf("/")), n = o, a = 0;
                continue;
              }
            } else if (t.length === 2 || t.length === 1) {
              t = "", i = 0, n = o, a = 0;
              continue;
            }
          }
          r && (t.length > 0 ? t += "/.." : t = "..", i = 2);
        } else
          t.length > 0 ? t += "/" + e.slice(n + 1, o) : t = e.slice(n + 1, o), i = o - n - 1;
      n = o, a = 0;
    } else
      s === 46 && a !== -1 ? ++a : a = -1;
  }
  return t;
}
function Uh(e, r) {
  var t = r.dir || r.root, i = r.base || (r.name || "") + (r.ext || "");
  return t ? t === r.root ? t + i : t + e + i : i;
}
var He = {
  // path.resolve([from ...], to)
  resolve: function() {
    for (var r = "", t = !1, i, n = arguments.length - 1; n >= -1 && !t; n--) {
      var a;
      n >= 0 ? a = arguments[n] : (i === void 0 && (i = $h.cwd()), a = i), le(a), a.length !== 0 && (r = a + "/" + r, t = a.charCodeAt(0) === 47);
    }
    return r = ka(r, !t), t ? r.length > 0 ? "/" + r : "/" : r.length > 0 ? r : ".";
  },
  normalize: function(r) {
    if (le(r), r.length === 0)
      return ".";
    var t = r.charCodeAt(0) === 47, i = r.charCodeAt(r.length - 1) === 47;
    return r = ka(r, !t), r.length === 0 && !t && (r = "."), r.length > 0 && i && (r += "/"), t ? "/" + r : r;
  },
  isAbsolute: function(r) {
    return le(r), r.length > 0 && r.charCodeAt(0) === 47;
  },
  join: function() {
    if (arguments.length === 0)
      return ".";
    for (var r, t = 0; t < arguments.length; ++t) {
      var i = arguments[t];
      le(i), i.length > 0 && (r === void 0 ? r = i : r += "/" + i);
    }
    return r === void 0 ? "." : He.normalize(r);
  },
  relative: function(r, t) {
    if (le(r), le(t), r === t || (r = He.resolve(r), t = He.resolve(t), r === t))
      return "";
    for (var i = 1; i < r.length && r.charCodeAt(i) === 47; ++i)
      ;
    for (var n = r.length, a = n - i, s = 1; s < t.length && t.charCodeAt(s) === 47; ++s)
      ;
    for (var o = t.length, c = o - s, l = a < c ? a : c, d = -1, u = 0; u <= l; ++u) {
      if (u === l) {
        if (c > l) {
          if (t.charCodeAt(s + u) === 47)
            return t.slice(s + u + 1);
          if (u === 0)
            return t.slice(s + u);
        } else
          a > l && (r.charCodeAt(i + u) === 47 ? d = u : u === 0 && (d = 0));
        break;
      }
      var A = r.charCodeAt(i + u), v = t.charCodeAt(s + u);
      if (A !== v)
        break;
      A === 47 && (d = u);
    }
    var g = "";
    for (u = i + d + 1; u <= n; ++u)
      (u === n || r.charCodeAt(u) === 47) && (g.length === 0 ? g += ".." : g += "/..");
    return g.length > 0 ? g + t.slice(s + d) : (s += d, t.charCodeAt(s) === 47 && ++s, t.slice(s));
  },
  _makeLong: function(r) {
    return r;
  },
  dirname: function(r) {
    if (le(r), r.length === 0)
      return ".";
    for (var t = r.charCodeAt(0), i = t === 47, n = -1, a = !0, s = r.length - 1; s >= 1; --s)
      if (t = r.charCodeAt(s), t === 47) {
        if (!a) {
          n = s;
          break;
        }
      } else
        a = !1;
    return n === -1 ? i ? "/" : "." : i && n === 1 ? "//" : r.slice(0, n);
  },
  basename: function(r, t) {
    if (t !== void 0 && typeof t != "string")
      throw new TypeError('"ext" argument must be a string');
    le(r);
    var i = 0, n = -1, a = !0, s;
    if (t !== void 0 && t.length > 0 && t.length <= r.length) {
      if (t.length === r.length && t === r)
        return "";
      var o = t.length - 1, c = -1;
      for (s = r.length - 1; s >= 0; --s) {
        var l = r.charCodeAt(s);
        if (l === 47) {
          if (!a) {
            i = s + 1;
            break;
          }
        } else
          c === -1 && (a = !1, c = s + 1), o >= 0 && (l === t.charCodeAt(o) ? --o === -1 && (n = s) : (o = -1, n = c));
      }
      return i === n ? n = c : n === -1 && (n = r.length), r.slice(i, n);
    } else {
      for (s = r.length - 1; s >= 0; --s)
        if (r.charCodeAt(s) === 47) {
          if (!a) {
            i = s + 1;
            break;
          }
        } else
          n === -1 && (a = !1, n = s + 1);
      return n === -1 ? "" : r.slice(i, n);
    }
  },
  extname: function(r) {
    le(r);
    for (var t = -1, i = 0, n = -1, a = !0, s = 0, o = r.length - 1; o >= 0; --o) {
      var c = r.charCodeAt(o);
      if (c === 47) {
        if (!a) {
          i = o + 1;
          break;
        }
        continue;
      }
      n === -1 && (a = !1, n = o + 1), c === 46 ? t === -1 ? t = o : s !== 1 && (s = 1) : t !== -1 && (s = -1);
    }
    return t === -1 || n === -1 || // We saw a non-dot character immediately before the dot
    s === 0 || // The (right-most) trimmed path component is exactly '..'
    s === 1 && t === n - 1 && t === i + 1 ? "" : r.slice(t, n);
  },
  format: function(r) {
    if (r === null || typeof r != "object")
      throw new TypeError('The "pathObject" argument must be of type Object. Received type ' + typeof r);
    return Uh("/", r);
  },
  parse: function(r) {
    le(r);
    var t = { root: "", dir: "", base: "", ext: "", name: "" };
    if (r.length === 0)
      return t;
    var i = r.charCodeAt(0), n = i === 47, a;
    n ? (t.root = "/", a = 1) : a = 0;
    for (var s = -1, o = 0, c = -1, l = !0, d = r.length - 1, u = 0; d >= a; --d) {
      if (i = r.charCodeAt(d), i === 47) {
        if (!l) {
          o = d + 1;
          break;
        }
        continue;
      }
      c === -1 && (l = !1, c = d + 1), i === 46 ? s === -1 ? s = d : u !== 1 && (u = 1) : s !== -1 && (u = -1);
    }
    return s === -1 || c === -1 || // We saw a non-dot character immediately before the dot
    u === 0 || // The (right-most) trimmed path component is exactly '..'
    u === 1 && s === c - 1 && s === o + 1 ? c !== -1 && (o === 0 && n ? t.base = t.name = r.slice(1, c) : t.base = t.name = r.slice(o, c)) : (o === 0 && n ? (t.name = r.slice(1, s), t.base = r.slice(1, c)) : (t.name = r.slice(o, s), t.base = r.slice(o, c)), t.ext = r.slice(s, c)), o > 0 ? t.dir = r.slice(0, o - 1) : n && (t.dir = "/"), t;
  },
  sep: "/",
  delimiter: ":",
  win32: null,
  posix: null
};
He.posix = He;
var vr = He, Mh = null, xe = Mh;
const Vh = ".zhlintrc", Wh = ".zhlintignore", Dh = ".zhlintcaseignore", jh = (e, r, t, i, n = Oe.defaultLogger) => {
  const a = {
    config: void 0,
    fileIgnore: void 0,
    caseIgnore: void 0
  };
  return e = vr.resolve(e ?? "."), xe.existsSync(e) ? (r = vr.resolve(e, r ?? Vh), xe.existsSync(r) ? a.config = r : n.log(
    `Config file "${r}" does not exist. Will proceed as default.`
  ), t = vr.resolve(e, t ?? Wh), xe.existsSync(t) ? a.fileIgnore = t : n.log(
    `Global ignored cases file "${t}" does not exist. Will proceed as none.`
  ), i = vr.resolve(e, i ?? Dh), xe.existsSync(i) ? a.caseIgnore = i : n.log(
    `Global ignored cases file "${i}" does not exist. Will proceed as none.`
  ), a) : (n.log(`"${e}" does not exist.`), a);
}, zh = (e) => {
  const r = xe.readFileSync(e, { encoding: "utf8" });
  return JSON.parse(r);
}, Gh = (e, r, t, i = Oe.defaultLogger) => {
  const n = {
    preset: "default"
  };
  if (e)
    try {
      const a = zh(e);
      typeof a.preset == "string" && (n.preset = a.preset), typeof a.rules == "object" && (n.rules = a.rules), Array.isArray(a.hyperParsers) && (n.hyperParsers = a.hyperParsers), Array.isArray(a.fileIgnores) && (n.fileIgnores = a.fileIgnores), Array.isArray(a.caseIgnores) && (n.caseIgnores = a.caseIgnores);
    } catch (a) {
      i.log(
        `Failed to read "${e}": ${a.message}`
      );
    }
  if (r)
    try {
      xe.readFileSync(r, { encoding: "utf8" }).split(/\n/).map((s) => s.trim()).forEach((s) => {
        s && (n.fileIgnores || (n.fileIgnores = []), n.fileIgnores.indexOf(s) === -1 && n.fileIgnores.push(s));
      });
    } catch (a) {
      i.log(
        `Failed to read "${r}": ${a.message}`
      );
    }
  if (t)
    try {
      xe.readFileSync(t, { encoding: "utf8" }).split(/\n/).map((s) => s.trim()).forEach((s) => {
        s && (n.caseIgnores || (n.caseIgnores = []), n.caseIgnores.indexOf(s) === -1 && n.caseIgnores.push(s));
      });
    } catch (a) {
      i.log(
        `Failed to read "${t}": ${a.message}`
      );
    }
  return n;
}, Jh = (e, r, t, i, n = Oe.defaultLogger) => {
  const {
    config: a,
    fileIgnore: s,
    caseIgnore: o
  } = jh(e, r, t, i, n);
  return Gh(
    a,
    s,
    o,
    n
  );
};
export {
  Jh as readRc,
  Kh as report,
  Qh as run,
  Yh as runWithConfig
};
//# sourceMappingURL=zhlint.es.js.map
