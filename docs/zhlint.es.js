const qs = /^(?:(?<prefix>.+?)-,)?(?<textStart>.+?)(?:,(?<textEnd>.+?))?(?:,-(?<suffix>.+?))?$/, Ia = (e) => {
  const r = e.match(qs);
  if (r) {
    const { prefix: t, textStart: s, textEnd: n, suffix: i } = r.groups;
    return {
      prefix: t,
      textStart: s,
      textEnd: n,
      suffix: i
    };
  }
}, Hs = (e) => {
  const { ignoredByRules: r, value: t } = e, s = /<!--\s*zhlint\s*ignore:\s*(.+?)\s*-->/g;
  let n;
  for (; (n = s.exec(t)) !== null; ) {
    const i = Ia(n[1]);
    i && r.push(i);
  }
  return e;
}, Ms = /\{% ([^ ]+?) [^%]*?%\}(?:\n|\{(?!%)|[^{])*?\{% end(?:\1) %\}/g, $s = (e) => (e.modifiedValue = e.modifiedValue.replace(
  Ms,
  (r, t, s) => {
    const { length: n } = r;
    return e.ignoredByParsers.push({
      name: t,
      meta: `hexo-${t}`,
      index: s,
      length: n,
      originValue: r
    }), "@".repeat(n);
  }
), e);
let Kt;
try {
  Kt = new RegExp("(?<=^|\\n)(:::.*)\\n([\\s\\S]+?)\\n(:::)(?=\\n|$)", "g");
} catch {
  Kt = /(:::.*)\n([\s\S]+?)\n(:::)/g;
}
const Us = (e) => (e.modifiedValue = e.modifiedValue.replace(
  Kt,
  (r, t, s, n, i) => {
    const { length: a } = r, o = t.substring(3).trim().split(" ")[0] || "default";
    return e.ignoredByParsers.push({
      name: o,
      index: i,
      length: t.length,
      originValue: t,
      meta: `vuepress-${o}-start`
    }), e.ignoredByParsers.push({
      name: o,
      index: i + a - 3,
      length: 3,
      originValue: n,
      meta: `vuepress-${o}-end`
    }), "@".repeat(t.length) + `
` + s + `
` + "@".repeat(3);
  }
), e);
function gr(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var ur = Object.prototype.hasOwnProperty, Pa = Object.prototype.toString, Bn = Object.defineProperty, Nn = Object.getOwnPropertyDescriptor, Fn = function(r) {
  return typeof Array.isArray == "function" ? Array.isArray(r) : Pa.call(r) === "[object Array]";
}, Ln = function(r) {
  if (!r || Pa.call(r) !== "[object Object]")
    return !1;
  var t = ur.call(r, "constructor"), s = r.constructor && r.constructor.prototype && ur.call(r.constructor.prototype, "isPrototypeOf");
  if (r.constructor && !t && !s)
    return !1;
  var n;
  for (n in r)
    ;
  return typeof n > "u" || ur.call(r, n);
}, qn = function(r, t) {
  Bn && t.name === "__proto__" ? Bn(r, t.name, {
    enumerable: !0,
    configurable: !0,
    value: t.newValue,
    writable: !0
  }) : r[t.name] = t.newValue;
}, Hn = function(r, t) {
  if (t === "__proto__")
    if (ur.call(r, t)) {
      if (Nn)
        return Nn(r, t).value;
    } else
      return;
  return r[t];
}, Vs = function e() {
  var r, t, s, n, i, a, o = arguments[0], c = 1, l = arguments.length, u = !1;
  for (typeof o == "boolean" && (u = o, o = arguments[1] || {}, c = 2), (o == null || typeof o != "object" && typeof o != "function") && (o = {}); c < l; ++c)
    if (r = arguments[c], r != null)
      for (t in r)
        s = Hn(o, t), n = Hn(r, t), o !== n && (u && n && (Ln(n) || (i = Fn(n))) ? (i ? (i = !1, a = s && Fn(s) ? s : []) : a = s && Ln(s) ? s : {}, qn(o, { name: t, newValue: e(u, a, n) })) : typeof n < "u" && qn(o, { name: t, newValue: n }));
  return o;
}, js = Ws;
function Ws(e) {
  if (e)
    throw e;
}
var Oe = {}.hasOwnProperty, zs = Ds;
function Ds(e) {
  return !e || typeof e != "object" ? "" : Oe.call(e, "position") || Oe.call(e, "type") ? Mn(e.position) : Oe.call(e, "start") || Oe.call(e, "end") ? Mn(e) : Oe.call(e, "line") || Oe.call(e, "column") ? Qt(e) : "";
}
function Qt(e) {
  return (!e || typeof e != "object") && (e = {}), $n(e.line) + ":" + $n(e.column);
}
function Mn(e) {
  return (!e || typeof e != "object") && (e = {}), Qt(e.start) + "-" + Qt(e.end);
}
function $n(e) {
  return e && typeof e == "number" ? e : 1;
}
var Gs = zs, Ks = fn;
function _a() {
}
_a.prototype = Error.prototype;
fn.prototype = new _a();
var Ae = fn.prototype;
Ae.file = "";
Ae.name = "";
Ae.reason = "";
Ae.message = "";
Ae.stack = "";
Ae.fatal = null;
Ae.column = null;
Ae.line = null;
function fn(e, r, t) {
  var s, n, i;
  typeof r == "string" && (t = r, r = null), s = Qs(t), n = Gs(r) || "1:1", i = {
    start: { line: null, column: null },
    end: { line: null, column: null }
  }, r && r.position && (r = r.position), r && (r.start ? (i = r, r = r.start) : i.start = r), e.stack && (this.stack = e.stack, e = e.message), this.message = e, this.name = n, this.reason = e, this.line = r ? r.line : null, this.column = r ? r.column : null, this.location = i, this.source = s[0], this.ruleId = s[1];
}
function Qs(e) {
  var r = [null, null], t;
  return typeof e == "string" && (t = e.indexOf(":"), t === -1 ? r[1] = e : (r[0] = e.slice(0, t), r[1] = e.slice(t + 1))), r;
}
var qe = {};
qe.basename = Ys;
qe.dirname = Js;
qe.extname = Xs;
qe.join = Zs;
qe.sep = "/";
function Ys(e, r) {
  var t = 0, s = -1, n, i, a, o;
  if (r !== void 0 && typeof r != "string")
    throw new TypeError('"ext" argument must be a string');
  if (Je(e), n = e.length, r === void 0 || !r.length || r.length > e.length) {
    for (; n--; )
      if (e.charCodeAt(n) === 47) {
        if (a) {
          t = n + 1;
          break;
        }
      } else
        s < 0 && (a = !0, s = n + 1);
    return s < 0 ? "" : e.slice(t, s);
  }
  if (r === e)
    return "";
  for (i = -1, o = r.length - 1; n--; )
    if (e.charCodeAt(n) === 47) {
      if (a) {
        t = n + 1;
        break;
      }
    } else
      i < 0 && (a = !0, i = n + 1), o > -1 && (e.charCodeAt(n) === r.charCodeAt(o--) ? o < 0 && (s = n) : (o = -1, s = i));
  return t === s ? s = i : s < 0 && (s = e.length), e.slice(t, s);
}
function Js(e) {
  var r, t, s;
  if (Je(e), !e.length)
    return ".";
  for (r = -1, s = e.length; --s; )
    if (e.charCodeAt(s) === 47) {
      if (t) {
        r = s;
        break;
      }
    } else
      t || (t = !0);
  return r < 0 ? e.charCodeAt(0) === 47 ? "/" : "." : r === 1 && e.charCodeAt(0) === 47 ? "//" : e.slice(0, r);
}
function Xs(e) {
  var r = -1, t = 0, s = -1, n = 0, i, a, o;
  for (Je(e), o = e.length; o--; ) {
    if (a = e.charCodeAt(o), a === 47) {
      if (i) {
        t = o + 1;
        break;
      }
      continue;
    }
    s < 0 && (i = !0, s = o + 1), a === 46 ? r < 0 ? r = o : n !== 1 && (n = 1) : r > -1 && (n = -1);
  }
  return r < 0 || s < 0 || // We saw a non-dot character immediately before the dot.
  n === 0 || // The (right-most) trimmed path component is exactly `..`.
  n === 1 && r === s - 1 && r === t + 1 ? "" : e.slice(r, s);
}
function Zs() {
  for (var e = -1, r; ++e < arguments.length; )
    Je(arguments[e]), arguments[e] && (r = r === void 0 ? arguments[e] : r + "/" + arguments[e]);
  return r === void 0 ? "." : eo(r);
}
function eo(e) {
  var r, t;
  return Je(e), r = e.charCodeAt(0) === 47, t = ro(e, !r), !t.length && !r && (t = "."), t.length && e.charCodeAt(e.length - 1) === 47 && (t += "/"), r ? "/" + t : t;
}
function ro(e, r) {
  for (var t = "", s = 0, n = -1, i = 0, a = -1, o, c; ++a <= e.length; ) {
    if (a < e.length)
      o = e.charCodeAt(a);
    else {
      if (o === 47)
        break;
      o = 47;
    }
    if (o === 47) {
      if (!(n === a - 1 || i === 1))
        if (n !== a - 1 && i === 2) {
          if (t.length < 2 || s !== 2 || t.charCodeAt(t.length - 1) !== 46 || t.charCodeAt(t.length - 2) !== 46) {
            if (t.length > 2) {
              if (c = t.lastIndexOf("/"), c !== t.length - 1) {
                c < 0 ? (t = "", s = 0) : (t = t.slice(0, c), s = t.length - 1 - t.lastIndexOf("/")), n = a, i = 0;
                continue;
              }
            } else if (t.length) {
              t = "", s = 0, n = a, i = 0;
              continue;
            }
          }
          r && (t = t.length ? t + "/.." : "..", s = 2);
        } else
          t.length ? t += "/" + e.slice(n + 1, a) : t = e.slice(n + 1, a), s = a - n - 1;
      n = a, i = 0;
    } else
      o === 46 && i > -1 ? i++ : i = -1;
  }
  return t;
}
function Je(e) {
  if (typeof e != "string")
    throw new TypeError(
      "Path must be a string. Received " + JSON.stringify(e)
    );
}
var Ba = {};
Ba.cwd = to;
function to() {
  return "/";
}
/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
var no = function(r) {
  return r != null && r.constructor != null && typeof r.constructor.isBuffer == "function" && r.constructor.isBuffer(r);
}, ue = qe, io = Ba, ao = no, so = he, oo = {}.hasOwnProperty, Ir = ["history", "path", "basename", "stem", "extname", "dirname"];
he.prototype.toString = bo;
Object.defineProperty(he.prototype, "path", { get: co, set: lo });
Object.defineProperty(he.prototype, "dirname", {
  get: fo,
  set: uo
});
Object.defineProperty(he.prototype, "basename", {
  get: ho,
  set: po
});
Object.defineProperty(he.prototype, "extname", {
  get: vo,
  set: go
});
Object.defineProperty(he.prototype, "stem", { get: mo, set: yo });
function he(e) {
  var r, t;
  if (!e)
    e = {};
  else if (typeof e == "string" || ao(e))
    e = { contents: e };
  else if ("message" in e && "messages" in e)
    return e;
  if (!(this instanceof he))
    return new he(e);
  for (this.data = {}, this.messages = [], this.history = [], this.cwd = io.cwd(), t = -1; ++t < Ir.length; )
    r = Ir[t], oo.call(e, r) && (this[r] = e[r]);
  for (r in e)
    Ir.indexOf(r) < 0 && (this[r] = e[r]);
}
function co() {
  return this.history[this.history.length - 1];
}
function lo(e) {
  dn(e, "path"), this.path !== e && this.history.push(e);
}
function fo() {
  return typeof this.path == "string" ? ue.dirname(this.path) : void 0;
}
function uo(e) {
  Na(this.path, "dirname"), this.path = ue.join(e || "", this.basename);
}
function ho() {
  return typeof this.path == "string" ? ue.basename(this.path) : void 0;
}
function po(e) {
  dn(e, "basename"), un(e, "basename"), this.path = ue.join(this.dirname || "", e);
}
function vo() {
  return typeof this.path == "string" ? ue.extname(this.path) : void 0;
}
function go(e) {
  if (un(e, "extname"), Na(this.path, "extname"), e) {
    if (e.charCodeAt(0) !== 46)
      throw new Error("`extname` must start with `.`");
    if (e.indexOf(".", 1) > -1)
      throw new Error("`extname` cannot contain multiple dots");
  }
  this.path = ue.join(this.dirname, this.stem + (e || ""));
}
function mo() {
  return typeof this.path == "string" ? ue.basename(this.path, this.extname) : void 0;
}
function yo(e) {
  dn(e, "stem"), un(e, "stem"), this.path = ue.join(this.dirname || "", e + (this.extname || ""));
}
function bo(e) {
  return (this.contents || "").toString(e);
}
function un(e, r) {
  if (e && e.indexOf(ue.sep) > -1)
    throw new Error(
      "`" + r + "` cannot be a path: did not expect `" + ue.sep + "`"
    );
}
function dn(e, r) {
  if (!e)
    throw new Error("`" + r + "` cannot be empty");
}
function Na(e, r) {
  if (!e)
    throw new Error("Setting `" + r + "` requires `path` to be set too");
}
var Ao = Ks, mr = so, wo = mr;
mr.prototype.message = Eo;
mr.prototype.info = ko;
mr.prototype.fail = To;
function Eo(e, r, t) {
  var s = new Ao(e, r, t);
  return this.path && (s.name = this.path + ":" + s.name, s.file = this.path), s.fatal = !1, this.messages.push(s), s;
}
function To() {
  var e = this.message.apply(this, arguments);
  throw e.fatal = !0, e;
}
function ko() {
  var e = this.message.apply(this, arguments);
  return e.fatal = null, e;
}
var xo = wo, So = [].slice, Co = Oo;
function Oo(e, r) {
  var t;
  return s;
  function s() {
    var a = So.call(arguments, 0), o = e.length > a.length, c;
    o && a.push(n);
    try {
      c = e.apply(null, a);
    } catch (l) {
      if (o && t)
        throw l;
      return n(l);
    }
    o || (c && typeof c.then == "function" ? c.then(i, n) : c instanceof Error ? n(c) : i(c));
  }
  function n() {
    t || (t = !0, r.apply(null, arguments));
  }
  function i(a) {
    n(null, a);
  }
}
var Fa = Co, Ro = La;
La.wrap = Fa;
var Un = [].slice;
function La() {
  var e = [], r = {};
  return r.run = t, r.use = s, r;
  function t() {
    var n = -1, i = Un.call(arguments, 0, -1), a = arguments[arguments.length - 1];
    if (typeof a != "function")
      throw new Error("Expected function as last argument, not " + a);
    o.apply(null, [null].concat(i));
    function o(c) {
      var l = e[++n], u = Un.call(arguments, 0), f = u.slice(1), d = i.length, h = -1;
      if (c) {
        a(c);
        return;
      }
      for (; ++h < d; )
        (f[h] === null || f[h] === void 0) && (f[h] = i[h]);
      i = f, l ? Fa(l, o).apply(null, i) : a.apply(null, [null].concat(i));
    }
  }
  function s(n) {
    if (typeof n != "function")
      throw new Error("Expected `fn` to be a function, not " + n);
    return e.push(n), r;
  }
}
var Io = (e) => {
  if (Object.prototype.toString.call(e) !== "[object Object]")
    return !1;
  const r = Object.getPrototypeOf(e);
  return r === null || r === Object.prototype;
}, rr = Vs, Vn = js, We = xo, qa = Ro, jn = Io, Po = Ha().freeze(), _o = [].slice, Bo = {}.hasOwnProperty, No = qa().use(Fo).use(Lo).use(qo);
function Fo(e, r) {
  r.tree = e.parse(r.file);
}
function Lo(e, r, t) {
  e.run(r.tree, r.file, s);
  function s(n, i, a) {
    n ? t(n) : (r.tree = i, r.file = a, t());
  }
}
function qo(e, r) {
  r.file.contents = e.stringify(r.tree, r.file);
}
function Ha() {
  var e = [], r = qa(), t = {}, s = !1, n = -1;
  return i.data = o, i.freeze = a, i.attachers = e, i.use = c, i.parse = u, i.stringify = h, i.run = f, i.runSync = d, i.process = m, i.processSync = y, i;
  function i() {
    for (var p = Ha(), v = e.length, g = -1; ++g < v; )
      p.use.apply(null, e[g]);
    return p.data(rr(!0, {}, t)), p;
  }
  function a() {
    var p, v, g, b;
    if (s)
      return i;
    for (; ++n < e.length; )
      p = e[n], v = p[0], g = p[1], b = null, g !== !1 && (g === !0 && (p[1] = void 0), b = v.apply(i, p.slice(1)), typeof b == "function" && r.use(b));
    return s = !0, n = 1 / 0, i;
  }
  function o(p, v) {
    return typeof p == "string" ? arguments.length === 2 ? (Br("data", s), t[p] = v, i) : Bo.call(t, p) && t[p] || null : p ? (Br("data", s), t = p, i) : t;
  }
  function c(p) {
    var v;
    if (Br("use", s), p != null)
      if (typeof p == "function")
        A.apply(null, arguments);
      else if (typeof p == "object")
        "length" in p ? E(p) : g(p);
      else
        throw new Error("Expected usable value, not `" + p + "`");
    return v && (t.settings = rr(t.settings || {}, v)), i;
    function g(T) {
      E(T.plugins), T.settings && (v = rr(v || {}, T.settings));
    }
    function b(T) {
      if (typeof T == "function")
        A(T);
      else if (typeof T == "object")
        "length" in T ? A.apply(null, T) : g(T);
      else
        throw new Error("Expected usable value, not `" + T + "`");
    }
    function E(T) {
      var k, O;
      if (T != null)
        if (typeof T == "object" && "length" in T)
          for (k = T.length, O = -1; ++O < k; )
            b(T[O]);
        else
          throw new Error("Expected a list of plugins, not `" + T + "`");
    }
    function A(T, k) {
      var O = l(T);
      O ? (jn(O[1]) && jn(k) && (k = rr(O[1], k)), O[1] = k) : e.push(_o.call(arguments));
    }
  }
  function l(p) {
    for (var v = e.length, g = -1, b; ++g < v; )
      if (b = e[g], b[0] === p)
        return b;
  }
  function u(p) {
    var v = We(p), g;
    return a(), g = i.Parser, Pr("parse", g), Wn(g, "parse") ? new g(String(v), v).parse() : g(String(v), v);
  }
  function f(p, v, g) {
    if (zn(p), a(), !g && typeof v == "function" && (g = v, v = null), !g)
      return new Promise(b);
    b(null, g);
    function b(E, A) {
      r.run(p, We(v), T);
      function T(k, O, w) {
        O = O || p, k ? A(k) : E ? E(O) : g(null, O, w);
      }
    }
  }
  function d(p, v) {
    var g = !1, b;
    return f(p, v, E), Dn("runSync", "run", g), b;
    function E(A, T) {
      g = !0, Vn(A), b = T;
    }
  }
  function h(p, v) {
    var g = We(v), b;
    return a(), b = i.Compiler, _r("stringify", b), zn(p), Wn(b, "compile") ? new b(p, g).compile() : b(p, g);
  }
  function m(p, v) {
    if (a(), Pr("process", i.Parser), _r("process", i.Compiler), !v)
      return new Promise(g);
    g(null, v);
    function g(b, E) {
      var A = We(p);
      No.run(i, { file: A }, T);
      function T(k) {
        k ? E(k) : b ? b(A) : v(null, A);
      }
    }
  }
  function y(p) {
    var v = !1, g;
    return a(), Pr("processSync", i.Parser), _r("processSync", i.Compiler), g = We(p), m(g, b), Dn("processSync", "process", v), g;
    function b(E) {
      v = !0, Vn(E);
    }
  }
}
function Wn(e, r) {
  return typeof e == "function" && e.prototype && // A function with keys in its prototype is probably a constructor.
  // Classes’ prototype methods are not enumerable, so we check if some value
  // exists in the prototype.
  (Ho(e.prototype) || r in e.prototype);
}
function Ho(e) {
  var r;
  for (r in e)
    return !0;
  return !1;
}
function Pr(e, r) {
  if (typeof r != "function")
    throw new Error("Cannot `" + e + "` without `Parser`");
}
function _r(e, r) {
  if (typeof r != "function")
    throw new Error("Cannot `" + e + "` without `Compiler`");
}
function Br(e, r) {
  if (r)
    throw new Error(
      "Cannot invoke `" + e + "` on a frozen processor.\nCreate a new processor first, by invoking it: use `processor()` instead of `processor`."
    );
}
function zn(e) {
  if (!e || typeof e.type != "string")
    throw new Error("Expected node, got `" + e + "`");
}
function Dn(e, r, t) {
  if (!t)
    throw new Error(
      "`" + e + "` finished async. Use `" + r + "` instead"
    );
}
const Mo = /* @__PURE__ */ gr(Po);
var Ce = Uo, $o = Object.prototype.hasOwnProperty;
function Uo() {
  for (var e = {}, r = 0; r < arguments.length; r++) {
    var t = arguments[r];
    for (var s in t)
      $o.call(t, s) && (e[s] = t[s]);
  }
  return e;
}
var Yt = { exports: {} };
typeof Object.create == "function" ? Yt.exports = function(r, t) {
  t && (r.super_ = t, r.prototype = Object.create(t.prototype, {
    constructor: {
      value: r,
      enumerable: !1,
      writable: !0,
      configurable: !0
    }
  }));
} : Yt.exports = function(r, t) {
  if (t) {
    r.super_ = t;
    var s = function() {
    };
    s.prototype = t.prototype, r.prototype = new s(), r.prototype.constructor = r;
  }
};
var Vo = Yt.exports, jo = Ce, Gn = Vo, Wo = zo;
function zo(e) {
  var r, t, s;
  Gn(i, e), Gn(n, i), r = i.prototype;
  for (t in r)
    s = r[t], s && typeof s == "object" && (r[t] = "concat" in s ? s.concat() : jo(s));
  return i;
  function n(a) {
    return e.apply(this, a);
  }
  function i() {
    return this instanceof i ? e.apply(this, arguments) : new n(arguments);
  }
}
var Do = Go;
function Go(e, r, t) {
  return s;
  function s() {
    var n = t || this, i = n[e];
    return n[e] = !r, a;
    function a() {
      n[e] = i;
    }
  }
}
var Ko = Qo;
function Qo(e) {
  var r = Xo(String(e));
  return {
    toPosition: Yo(r),
    toOffset: Jo(r)
  };
}
function Yo(e) {
  return r;
  function r(t) {
    var s = -1, n = e.length;
    if (t < 0)
      return {};
    for (; ++s < n; )
      if (e[s] > t)
        return {
          line: s + 1,
          column: t - (e[s - 1] || 0) + 1,
          offset: t
        };
    return {};
  }
}
function Jo(e) {
  return r;
  function r(t) {
    var s = t && t.line, n = t && t.column;
    return !isNaN(s) && !isNaN(n) && s - 1 in e ? (e[s - 2] || 0) + n - 1 || 0 : -1;
  }
}
function Xo(e) {
  for (var r = [], t = e.indexOf(`
`); t !== -1; )
    r.push(t + 1), t = e.indexOf(`
`, t + 1);
  return r.push(e.length + 1), r;
}
var Zo = ec, Nr = "\\";
function ec(e, r) {
  return t;
  function t(s) {
    for (var n = 0, i = s.indexOf(Nr), a = e[r], o = [], c; i !== -1; )
      o.push(s.slice(n, i)), n = i + 1, c = s.charAt(n), (!c || a.indexOf(c) === -1) && o.push(Nr), i = s.indexOf(Nr, n + 1);
    return o.push(s.slice(n)), o.join("");
  }
}
const rc = "Æ", tc = "&", nc = "Á", ic = "Â", ac = "À", sc = "Å", oc = "Ã", cc = "Ä", lc = "©", fc = "Ç", uc = "Ð", dc = "É", hc = "Ê", pc = "È", vc = "Ë", gc = ">", mc = "Í", yc = "Î", bc = "Ì", Ac = "Ï", wc = "<", Ec = "Ñ", Tc = "Ó", kc = "Ô", xc = "Ò", Sc = "Ø", Cc = "Õ", Oc = "Ö", Rc = '"', Ic = "®", Pc = "Þ", _c = "Ú", Bc = "Û", Nc = "Ù", Fc = "Ü", Lc = "Ý", qc = "á", Hc = "â", Mc = "´", $c = "æ", Uc = "à", Vc = "&", jc = "å", Wc = "ã", zc = "ä", Dc = "¦", Gc = "ç", Kc = "¸", Qc = "¢", Yc = "©", Jc = "¤", Xc = "°", Zc = "÷", el = "é", rl = "ê", tl = "è", nl = "ð", il = "ë", al = "½", sl = "¼", ol = "¾", cl = ">", ll = "í", fl = "î", ul = "¡", dl = "ì", hl = "¿", pl = "ï", vl = "«", gl = "<", ml = "¯", yl = "µ", bl = "·", Al = " ", wl = "¬", El = "ñ", Tl = "ó", kl = "ô", xl = "ò", Sl = "ª", Cl = "º", Ol = "ø", Rl = "õ", Il = "ö", Pl = "¶", _l = "±", Bl = "£", Nl = '"', Fl = "»", Ll = "®", ql = "§", Hl = "­", Ml = "¹", $l = "²", Ul = "³", Vl = "ß", jl = "þ", Wl = "×", zl = "ú", Dl = "û", Gl = "ù", Kl = "¨", Ql = "ü", Yl = "ý", Jl = "¥", Xl = "ÿ", Zl = {
  AElig: rc,
  AMP: tc,
  Aacute: nc,
  Acirc: ic,
  Agrave: ac,
  Aring: sc,
  Atilde: oc,
  Auml: cc,
  COPY: lc,
  Ccedil: fc,
  ETH: uc,
  Eacute: dc,
  Ecirc: hc,
  Egrave: pc,
  Euml: vc,
  GT: gc,
  Iacute: mc,
  Icirc: yc,
  Igrave: bc,
  Iuml: Ac,
  LT: wc,
  Ntilde: Ec,
  Oacute: Tc,
  Ocirc: kc,
  Ograve: xc,
  Oslash: Sc,
  Otilde: Cc,
  Ouml: Oc,
  QUOT: Rc,
  REG: Ic,
  THORN: Pc,
  Uacute: _c,
  Ucirc: Bc,
  Ugrave: Nc,
  Uuml: Fc,
  Yacute: Lc,
  aacute: qc,
  acirc: Hc,
  acute: Mc,
  aelig: $c,
  agrave: Uc,
  amp: Vc,
  aring: jc,
  atilde: Wc,
  auml: zc,
  brvbar: Dc,
  ccedil: Gc,
  cedil: Kc,
  cent: Qc,
  copy: Yc,
  curren: Jc,
  deg: Xc,
  divide: Zc,
  eacute: el,
  ecirc: rl,
  egrave: tl,
  eth: nl,
  euml: il,
  frac12: al,
  frac14: sl,
  frac34: ol,
  gt: cl,
  iacute: ll,
  icirc: fl,
  iexcl: ul,
  igrave: dl,
  iquest: hl,
  iuml: pl,
  laquo: vl,
  lt: gl,
  macr: ml,
  micro: yl,
  middot: bl,
  nbsp: Al,
  not: wl,
  ntilde: El,
  oacute: Tl,
  ocirc: kl,
  ograve: xl,
  ordf: Sl,
  ordm: Cl,
  oslash: Ol,
  otilde: Rl,
  ouml: Il,
  para: Pl,
  plusmn: _l,
  pound: Bl,
  quot: Nl,
  raquo: Fl,
  reg: Ll,
  sect: ql,
  shy: Hl,
  sup1: Ml,
  sup2: $l,
  sup3: Ul,
  szlig: Vl,
  thorn: jl,
  times: Wl,
  uacute: zl,
  ucirc: Dl,
  ugrave: Gl,
  uml: Kl,
  uuml: Ql,
  yacute: Yl,
  yen: Jl,
  yuml: Xl
}, ef = {
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
var yr = rf;
function rf(e) {
  var r = typeof e == "string" ? e.charCodeAt(0) : e;
  return r >= 48 && r <= 57;
}
var tf = nf;
function nf(e) {
  var r = typeof e == "string" ? e.charCodeAt(0) : e;
  return r >= 97 && r <= 102 || r >= 65 && r <= 70 || r >= 48 && r <= 57;
}
var Fr, Kn;
function Ma() {
  if (Kn)
    return Fr;
  Kn = 1, Fr = e;
  function e(r) {
    var t = typeof r == "string" ? r.charCodeAt(0) : r;
    return t >= 97 && t <= 122 || t >= 65 && t <= 90;
  }
  return Fr;
}
var af = Ma(), sf = yr, of = cf;
function cf(e) {
  return af(e) || sf(e);
}
var tr, lf = 59, ff = uf;
function uf(e) {
  var r = "&" + e + ";", t;
  return tr = tr || document.createElement("i"), tr.innerHTML = r, t = tr.textContent, t.charCodeAt(t.length - 1) === lf && e !== "semi" || t === r ? !1 : t;
}
var Qn = Zl, Yn = ef, df = yr, hf = tf, $a = of, pf = ff, hn = Cf, vf = {}.hasOwnProperty, Re = String.fromCharCode, gf = Function.prototype, Jn = {
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
}, mf = 9, Xn = 10, yf = 12, bf = 32, Zn = 38, Af = 59, wf = 60, Ef = 61, Tf = 35, kf = 88, xf = 120, Sf = 65533, _e = "named", pn = "hexadecimal", vn = "decimal", gn = {};
gn[pn] = 16;
gn[vn] = 10;
var br = {};
br[_e] = $a;
br[vn] = df;
br[pn] = hf;
var Ua = 1, Va = 2, ja = 3, Wa = 4, za = 5, Jt = 6, Da = 7, we = {};
we[Ua] = "Named character references must be terminated by a semicolon";
we[Va] = "Numeric character references must be terminated by a semicolon";
we[ja] = "Named character references cannot be empty";
we[Wa] = "Numeric character references cannot be empty";
we[za] = "Named character references must be known";
we[Jt] = "Numeric character references cannot be disallowed";
we[Da] = "Numeric character references cannot be outside the permissible Unicode range";
function Cf(e, r) {
  var t = {}, s, n;
  r || (r = {});
  for (n in Jn)
    s = r[n], t[n] = s ?? Jn[n];
  return (t.position.indent || t.position.start) && (t.indent = t.position.indent || [], t.position = t.position.start), Of(e, t);
}
function Of(e, r) {
  var t = r.additional, s = r.nonTerminated, n = r.text, i = r.reference, a = r.warning, o = r.textContext, c = r.referenceContext, l = r.warningContext, u = r.position, f = r.indent || [], d = e.length, h = 0, m = -1, y = u.column || 1, p = u.line || 1, v = "", g = [], b, E, A, T, k, O, w, C, S, R, x, I, N, _, H, P, M, U, B;
  for (typeof t == "string" && (t = t.charCodeAt(0)), P = q(), C = a ? Q : gf, h--, d++; ++h < d; )
    if (k === Xn && (y = f[m] || 1), k = e.charCodeAt(h), k === Zn) {
      if (w = e.charCodeAt(h + 1), w === mf || w === Xn || w === yf || w === bf || w === Zn || w === wf || w !== w || t && w === t) {
        v += Re(k), y++;
        continue;
      }
      for (N = h + 1, I = N, B = N, w === Tf ? (B = ++I, w = e.charCodeAt(B), w === kf || w === xf ? (_ = pn, B = ++I) : _ = vn) : _ = _e, b = "", x = "", T = "", H = br[_], B--; ++B < d && (w = e.charCodeAt(B), !!H(w)); )
        T += Re(w), _ === _e && vf.call(Qn, T) && (b = T, x = Qn[T]);
      A = e.charCodeAt(B) === Af, A && (B++, E = _ === _e ? pf(T) : !1, E && (b = T, x = E)), U = 1 + B - N, !A && !s || (T ? _ === _e ? (A && !x ? C(za, 1) : (b !== T && (B = I + b.length, U = 1 + B - I, A = !1), A || (S = b ? Ua : ja, r.attribute ? (w = e.charCodeAt(B), w === Ef ? (C(S, U), x = null) : $a(w) ? x = null : C(S, U)) : C(S, U))), O = x) : (A || C(Va, U), O = parseInt(T, gn[_]), Rf(O) ? (C(Da, U), O = Re(Sf)) : O in Yn ? (C(Jt, U), O = Yn[O]) : (R = "", If(O) && C(Jt, U), O > 65535 && (O -= 65536, R += Re(O >>> 10 | 55296), O = 56320 | O & 1023), O = R + Re(O))) : _ !== _e && C(Wa, U)), O ? (F(), P = q(), h = B - 1, y += B - N + 1, g.push(O), M = q(), M.offset++, i && i.call(
        c,
        O,
        { start: P, end: M },
        e.slice(N - 1, B)
      ), P = M) : (T = e.slice(N - 1, B), v += T, y += T.length, h = B - 1);
    } else
      k === 10 && (p++, m++, y = 0), k === k ? (v += Re(k), y++) : F();
  return g.join("");
  function q() {
    return {
      line: p,
      column: y,
      offset: h + (u.offset || 0)
    };
  }
  function Q(Y, K) {
    var ne = q();
    ne.column += K, ne.offset += K, a.call(l, we[Y], ne, Y);
  }
  function F() {
    v && (g.push(v), n && n.call(o, v, { start: P, end: q() }), v = "");
  }
}
function Rf(e) {
  return e >= 55296 && e <= 57343 || e > 1114111;
}
function If(e) {
  return e >= 1 && e <= 8 || e === 11 || e >= 13 && e <= 31 || e >= 127 && e <= 159 || e >= 64976 && e <= 65007 || (e & 65535) === 65535 || (e & 65535) === 65534;
}
var Pf = Ce, ei = hn, _f = Bf;
function Bf(e) {
  return t.raw = s, t;
  function r(i) {
    for (var a = e.offset, o = i.line, c = []; ++o && o in a; )
      c.push((a[o] || 0) + 1);
    return { start: i, indent: c };
  }
  function t(i, a, o) {
    ei(i, {
      position: r(a),
      warning: n,
      text: o,
      reference: o,
      textContext: e,
      referenceContext: e
    });
  }
  function s(i, a, o) {
    return ei(
      i,
      Pf(o, { position: r(a), warning: n })
    );
  }
  function n(i, a, o) {
    o !== 3 && e.file.message(i, a);
  }
}
var Nf = Ff;
function Ff(e) {
  return r;
  function r(t, s) {
    var n = this, i = n.offset, a = [], o = n[e + "Methods"], c = n[e + "Tokenizers"], l = s.line, u = s.column, f, d, h, m, y, p;
    if (!t)
      return a;
    for (O.now = b, O.file = n.file, v(""); t; ) {
      for (f = -1, d = o.length, y = !1; ++f < d && (m = o[f], h = c[m], !(h && /* istanbul ignore next */
      (!h.onlyAtStart || n.atStart) && (!h.notInList || !n.inList) && (!h.notInBlock || !n.inBlock) && (!h.notInLink || !n.inLink) && (p = t.length, h.apply(n, [O, t]), y = p !== t.length, y))); )
        ;
      y || n.file.fail(new Error("Infinite loop"), O.now());
    }
    return n.eof = b(), a;
    function v(w) {
      for (var C = -1, S = w.indexOf(`
`); S !== -1; )
        l++, C = S, S = w.indexOf(`
`, S + 1);
      C === -1 ? u += w.length : u = w.length - C, l in i && (C !== -1 ? u += i[l] : u <= i[l] && (u = i[l] + 1));
    }
    function g() {
      var w = [], C = l + 1;
      return function() {
        for (var S = l + 1; C < S; )
          w.push((i[C] || 0) + 1), C++;
        return w;
      };
    }
    function b() {
      var w = { line: l, column: u };
      return w.offset = n.toOffset(w), w;
    }
    function E(w) {
      this.start = w, this.end = b();
    }
    function A(w) {
      t.slice(0, w.length) !== w && n.file.fail(
        new Error(
          "Incorrectly eaten value: please report this warning on https://git.io/vg5Ft"
        ),
        b()
      );
    }
    function T() {
      var w = b();
      return C;
      function C(S, R) {
        var x = S.position, I = x ? x.start : w, N = [], _ = x && x.end.line, H = w.line;
        if (S.position = new E(I), x && R && x.indent) {
          if (N = x.indent, _ < H) {
            for (; ++_ < H; )
              N.push((i[_] || 0) + 1);
            N.push(w.column);
          }
          R = N.concat(R);
        }
        return S.position.indent = R || [], S;
      }
    }
    function k(w, C) {
      var S = C ? C.children : a, R = S[S.length - 1], x;
      return R && w.type === R.type && (w.type === "text" || w.type === "blockquote") && ri(R) && ri(w) && (x = w.type === "text" ? Lf : qf, w = x.call(n, R, w)), w !== R && S.push(w), n.atStart && a.length !== 0 && n.exitStart(), w;
    }
    function O(w) {
      var C = g(), S = T(), R = b();
      return A(w), x.reset = I, I.test = N, x.test = N, t = t.slice(w.length), v(w), C = C(), x;
      function x(_, H) {
        return S(k(S(_), H), C);
      }
      function I() {
        var _ = x.apply(null, arguments);
        return l = R.line, u = R.column, t = w + t, _;
      }
      function N() {
        var _ = S({});
        return l = R.line, u = R.column, t = w + t, _.position;
      }
    }
  }
}
function ri(e) {
  var r, t;
  return e.type !== "text" || !e.position ? !0 : (r = e.position.start, t = e.position.end, r.line !== t.line || t.column - r.column === e.value.length);
}
function Lf(e, r) {
  return e.value += r.value, e;
}
function qf(e, r) {
  return this.options.commonmark || this.options.gfm ? r : (e.children = e.children.concat(r.children), e);
}
var Lr, ti;
function Hf() {
  if (ti)
    return Lr;
  ti = 1, Lr = s;
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
  s.default = e, s.gfm = r, s.commonmark = t;
  function s(n) {
    var i = n || {};
    return i.commonmark ? t : i.gfm ? r : e;
  }
  return Lr;
}
var qr, ni;
function Mf() {
  return ni || (ni = 1, qr = [
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
var Hr, ii;
function Ga() {
  return ii || (ii = 1, Hr = {
    position: !0,
    gfm: !0,
    commonmark: !1,
    footnotes: !1,
    pedantic: !1,
    blocks: Mf()
  }), Hr;
}
var Mr, ai;
function $f() {
  if (ai)
    return Mr;
  ai = 1;
  var e = Ce, r = Hf(), t = Ga();
  Mr = s;
  function s(n) {
    var i = this, a = i.options, o, c;
    if (n == null)
      n = {};
    else if (typeof n == "object")
      n = e(n);
    else
      throw new Error("Invalid value `" + n + "` for setting `options`");
    for (o in t) {
      if (c = n[o], c == null && (c = a[o]), o !== "blocks" && typeof c != "boolean" || o === "blocks" && typeof c != "object")
        throw new Error(
          "Invalid value `" + c + "` for setting `options." + o + "`"
        );
      n[o] = c;
    }
    return i.options = n, i.escape = r(n), i;
  }
  return Mr;
}
var $r, si;
function Uf() {
  if (si)
    return $r;
  si = 1, $r = e;
  function e(a) {
    if (typeof a == "string")
      return n(a);
    if (a == null)
      return i;
    if (typeof a == "object")
      return ("length" in a ? s : t)(a);
    if (typeof a == "function")
      return a;
    throw new Error("Expected function, string, or object as test");
  }
  function r(a) {
    for (var o = [], c = a.length, l = -1; ++l < c; )
      o[l] = e(a[l]);
    return o;
  }
  function t(a) {
    return o;
    function o(c) {
      var l;
      for (l in a)
        if (c[l] !== a[l])
          return !1;
      return !0;
    }
  }
  function s(a) {
    var o = r(a), c = o.length;
    return l;
    function l() {
      for (var u = -1; ++u < c; )
        if (o[u].apply(this, arguments))
          return !0;
      return !1;
    }
  }
  function n(a) {
    return o;
    function o(c) {
      return !!(c && c.type === a);
    }
  }
  function i() {
    return !0;
  }
  return $r;
}
var Ur, oi;
function Vf() {
  if (oi)
    return Ur;
  oi = 1, Ur = n;
  var e = Uf(), r = !0, t = "skip", s = !1;
  n.CONTINUE = r, n.SKIP = t, n.EXIT = s;
  function n(a, o, c, l) {
    var u;
    typeof o == "function" && typeof c != "function" && (l = c, c = o, o = null), u = e(o), f(a, null, []);
    function f(h, m, y) {
      var p = [], v;
      return (!o || u(h, m, y[y.length - 1] || null)) && (p = i(c(h, y)), p[0] === s) ? p : h.children && p[0] !== t ? (v = i(d(h.children, y.concat(h))), v[0] === s ? v : p) : p;
    }
    function d(h, m) {
      for (var y = -1, p = l ? -1 : 1, v = (l ? h.length : y) + p, g; v > y && v < h.length; ) {
        if (g = f(h[v], v, m), g[0] === s)
          return g;
        v = typeof g[1] == "number" ? g[1] : v + p;
      }
    }
  }
  function i(a) {
    return a !== null && typeof a == "object" && "length" in a ? a : typeof a == "number" ? [r, a] : [a];
  }
  return Ur;
}
var Vr, ci;
function jf() {
  if (ci)
    return Vr;
  ci = 1, Vr = n;
  var e = Vf(), r = e.CONTINUE, t = e.SKIP, s = e.EXIT;
  n.CONTINUE = r, n.SKIP = t, n.EXIT = s;
  function n(i, a, o, c) {
    typeof a == "function" && typeof o != "function" && (c = o, o = a, a = null), e(i, a, l, c);
    function l(u, f) {
      var d = f[f.length - 1], h = d ? d.children.indexOf(u) : null;
      return o(u, h, d);
    }
  }
  return Vr;
}
var jr, li;
function Wf() {
  if (li)
    return jr;
  li = 1;
  var e = jf();
  jr = r;
  function r(n, i) {
    return e(n, i ? t : s), n;
  }
  function t(n) {
    delete n.position;
  }
  function s(n) {
    n.position = void 0;
  }
  return jr;
}
var Wr, fi;
function zf() {
  if (fi)
    return Wr;
  fi = 1;
  var e = Ce, r = Wf();
  Wr = n;
  var t = `
`, s = /\r\n|\r/g;
  function n() {
    var i = this, a = String(i.file), o = { line: 1, column: 1, offset: 0 }, c = e(o), l;
    return a = a.replace(s, t), a.charCodeAt(0) === 65279 && (a = a.slice(1), c.column++, c.offset++), l = {
      type: "root",
      children: i.tokenizeBlock(a, c),
      position: { start: o, end: i.eof || e(o) }
    }, i.options.position || r(l, !0), l;
  }
  return Wr;
}
var zr, ui;
function se() {
  if (ui)
    return zr;
  ui = 1, zr = t;
  var e = String.fromCharCode, r = /\s/;
  function t(s) {
    return r.test(
      typeof s == "number" ? e(s) : s.charAt(0)
    );
  }
  return zr;
}
var Dr, di;
function Df() {
  if (di)
    return Dr;
  di = 1;
  var e = se();
  Dr = t;
  var r = `
`;
  function t(s, n, i) {
    var a = n.charAt(0), o, c, l, u;
    if (a === r) {
      if (i)
        return !0;
      for (u = 1, o = n.length, c = a, l = ""; u < o && (a = n.charAt(u), !!e(a)); )
        l += a, a === r && (c += l, l = ""), u++;
      s(c);
    }
  }
  return Dr;
}
/*!
 * repeat-string <https://github.com/jonschlinkert/repeat-string>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */
var Gr, hi;
function mn() {
  if (hi)
    return Gr;
  hi = 1;
  var e = "", r;
  Gr = t;
  function t(s, n) {
    if (typeof s != "string")
      throw new TypeError("expected a string");
    if (n === 1)
      return s;
    if (n === 2)
      return s + s;
    var i = s.length * n;
    if (r !== s || typeof r > "u")
      r = s, e = "";
    else if (e.length >= i)
      return e.substr(0, i);
    for (; i > e.length && n > 1; )
      n & 1 && (e += s), n >>= 1, s += s;
    return e += s, e = e.substr(0, i), e;
  }
  return Gr;
}
var Kr, pi;
function Ka() {
  if (pi)
    return Kr;
  pi = 1, Kr = e;
  function e(r) {
    return String(r).replace(/\n+$/, "");
  }
  return Kr;
}
var Qr, vi;
function Gf() {
  if (vi)
    return Qr;
  vi = 1;
  var e = mn(), r = Ka();
  Qr = o;
  var t = `
`, s = "	", n = " ", i = 4, a = e(n, i);
  function o(c, l, u) {
    for (var f = -1, d = l.length, h = "", m = "", y = "", p = "", v, g, b; ++f < d; )
      if (v = l.charAt(f), b)
        if (b = !1, h += y, m += p, y = "", p = "", v === t)
          y = v, p = v;
        else
          for (h += v, m += v; ++f < d; ) {
            if (v = l.charAt(f), !v || v === t) {
              p = v, y = v;
              break;
            }
            h += v, m += v;
          }
      else if (v === n && l.charAt(f + 1) === v && l.charAt(f + 2) === v && l.charAt(f + 3) === v)
        y += a, f += 3, b = !0;
      else if (v === s)
        y += v, b = !0;
      else {
        for (g = ""; v === s || v === n; )
          g += v, v = l.charAt(++f);
        if (v !== t)
          break;
        y += g + v, p += v;
      }
    if (m)
      return u ? !0 : c(h)({
        type: "code",
        lang: null,
        meta: null,
        value: r(m)
      });
  }
  return Qr;
}
var Yr, gi;
function Kf() {
  if (gi)
    return Yr;
  gi = 1, Yr = o;
  var e = `
`, r = "	", t = " ", s = "~", n = "`", i = 3, a = 4;
  function o(c, l, u) {
    var f = this, d = f.options.gfm, h = l.length + 1, m = 0, y = "", p, v, g, b, E, A, T, k, O, w, C, S, R;
    if (d) {
      for (; m < h && (g = l.charAt(m), !(g !== t && g !== r)); )
        y += g, m++;
      if (S = m, g = l.charAt(m), !(g !== s && g !== n)) {
        for (m++, v = g, p = 1, y += g; m < h && (g = l.charAt(m), g === v); )
          y += g, p++, m++;
        if (!(p < i)) {
          for (; m < h && (g = l.charAt(m), !(g !== t && g !== r)); )
            y += g, m++;
          for (b = "", T = ""; m < h && (g = l.charAt(m), !(g === e || v === n && g === v)); )
            g === t || g === r ? T += g : (b += T + g, T = ""), m++;
          if (g = l.charAt(m), !(g && g !== e)) {
            if (u)
              return !0;
            R = c.now(), R.column += y.length, R.offset += y.length, y += b, b = f.decode.raw(f.unescape(b), R), T && (y += T), T = "", w = "", C = "", k = "", O = "";
            for (var x = !0; m < h; ) {
              if (g = l.charAt(m), k += w, O += C, w = "", C = "", g !== e) {
                k += g, C += g, m++;
                continue;
              }
              for (x ? (y += g, x = !1) : (w += g, C += g), T = "", m++; m < h && (g = l.charAt(m), g === t); )
                T += g, m++;
              if (w += T, C += T.slice(S), !(T.length >= a)) {
                for (T = ""; m < h && (g = l.charAt(m), g === v); )
                  T += g, m++;
                if (w += T, C += T, !(T.length < p)) {
                  for (T = ""; m < h && (g = l.charAt(m), !(g !== t && g !== r)); )
                    w += g, C += g, m++;
                  if (!g || g === e)
                    break;
                }
              }
            }
            for (y += k + w, m = -1, h = b.length; ++m < h; )
              if (g = b.charAt(m), g === t || g === r)
                E || (E = b.slice(0, m));
              else if (E) {
                A = b.slice(m);
                break;
              }
            return c(y)({
              type: "code",
              lang: E || b || null,
              meta: A || null,
              value: O
            });
          }
        }
      }
    }
  }
  return Yr;
}
var nr = { exports: {} }, mi;
function He() {
  return mi || (mi = 1, function(e, r) {
    r = e.exports = t;
    function t(s) {
      return s.replace(/^\s*|\s*$/g, "");
    }
    r.left = function(s) {
      return s.replace(/^\s*/, "");
    }, r.right = function(s) {
      return s.replace(/\s*$/, "");
    };
  }(nr, nr.exports)), nr.exports;
}
var Jr, yi;
function yn() {
  if (yi)
    return Jr;
  yi = 1, Jr = e;
  function e(r, t, s, n) {
    for (var i = r.length, a = -1, o, c; ++a < i; )
      if (o = r[a], c = o[1] || {}, !(c.pedantic !== void 0 && c.pedantic !== s.options.pedantic) && !(c.commonmark !== void 0 && c.commonmark !== s.options.commonmark) && t[o[0]].apply(s, n))
        return !0;
    return !1;
  }
  return Jr;
}
var Xr, bi;
function Qf() {
  if (bi)
    return Xr;
  bi = 1;
  var e = He(), r = yn();
  Xr = a;
  var t = `
`, s = "	", n = " ", i = ">";
  function a(o, c, l) {
    for (var u = this, f = u.offset, d = u.blockTokenizers, h = u.interruptBlockquote, m = o.now(), y = m.line, p = c.length, v = [], g = [], b = [], E, A = 0, T, k, O, w, C, S, R, x; A < p && (T = c.charAt(A), !(T !== n && T !== s)); )
      A++;
    if (c.charAt(A) === i) {
      if (l)
        return !0;
      for (A = 0; A < p; ) {
        for (O = c.indexOf(t, A), S = A, R = !1, O === -1 && (O = p); A < p && (T = c.charAt(A), !(T !== n && T !== s)); )
          A++;
        if (c.charAt(A) === i ? (A++, R = !0, c.charAt(A) === n && A++) : A = S, w = c.slice(A, O), !R && !e(w)) {
          A = S;
          break;
        }
        if (!R && (k = c.slice(A), r(h, d, u, [o, k, !0])))
          break;
        C = S === A ? w : c.slice(S, O), b.push(A - S), v.push(C), g.push(w), A = O + 1;
      }
      for (A = -1, p = b.length, E = o(v.join(t)); ++A < p; )
        f[y] = (f[y] || 0) + b[A], y++;
      return x = u.enterBlock(), g = u.tokenizeBlock(g.join(t), m), x(), E({ type: "blockquote", children: g });
    }
  }
  return Xr;
}
var Zr, Ai;
function Yf() {
  if (Ai)
    return Zr;
  Ai = 1, Zr = i;
  var e = `
`, r = "	", t = " ", s = "#", n = 6;
  function i(a, o, c) {
    for (var l = this, u = l.options.pedantic, f = o.length + 1, d = -1, h = a.now(), m = "", y = "", p, v, g; ++d < f; ) {
      if (p = o.charAt(d), p !== t && p !== r) {
        d--;
        break;
      }
      m += p;
    }
    for (g = 0; ++d <= f; ) {
      if (p = o.charAt(d), p !== s) {
        d--;
        break;
      }
      m += p, g++;
    }
    if (!(g > n) && !(!g || !u && o.charAt(d + 1) === s)) {
      for (f = o.length + 1, v = ""; ++d < f; ) {
        if (p = o.charAt(d), p !== t && p !== r) {
          d--;
          break;
        }
        v += p;
      }
      if (!(!u && v.length === 0 && p && p !== e)) {
        if (c)
          return !0;
        for (m += v, v = "", y = ""; ++d < f && (p = o.charAt(d), !(!p || p === e)); ) {
          if (p !== t && p !== r && p !== s) {
            y += v + p, v = "";
            continue;
          }
          for (; p === t || p === r; )
            v += p, p = o.charAt(++d);
          if (!u && y && !v && p === s) {
            y += p;
            continue;
          }
          for (; p === s; )
            v += p, p = o.charAt(++d);
          for (; p === t || p === r; )
            v += p, p = o.charAt(++d);
          d--;
        }
        return h.column += m.length, h.offset += m.length, m += y + v, a(m)({
          type: "heading",
          depth: g,
          children: l.tokenizeInline(y, h)
        });
      }
    }
  }
  return Zr;
}
var et, wi;
function Jf() {
  if (wi)
    return et;
  wi = 1, et = o;
  var e = "	", r = `
`, t = " ", s = "*", n = "-", i = "_", a = 3;
  function o(c, l, u) {
    for (var f = -1, d = l.length + 1, h = "", m, y, p, v; ++f < d && (m = l.charAt(f), !(m !== e && m !== t)); )
      h += m;
    if (!(m !== s && m !== n && m !== i))
      for (y = m, h += m, p = 1, v = ""; ++f < d; )
        if (m = l.charAt(f), m === y)
          p++, h += v + y, v = "";
        else if (m === t)
          v += m;
        else
          return p >= a && (!m || m === r) ? (h += v, u ? !0 : c(h)({ type: "thematicBreak" })) : void 0;
  }
  return et;
}
var rt, Ei;
function Qa() {
  if (Ei)
    return rt;
  Ei = 1, rt = n;
  var e = "	", r = " ", t = 1, s = 4;
  function n(i) {
    for (var a = 0, o = 0, c = i.charAt(a), l = {}, u; c === e || c === r; )
      u = c === e ? s : t, o += u, u > 1 && (o = Math.floor(o / u) * u), l[o] = a, c = i.charAt(++a);
    return { indent: o, stops: l };
  }
  return rt;
}
var tt, Ti;
function Xf() {
  if (Ti)
    return tt;
  Ti = 1;
  var e = He(), r = mn(), t = Qa();
  tt = o;
  var s = "	", n = `
`, i = " ", a = "!";
  function o(c, l) {
    var u = c.split(n), f = u.length + 1, d = 1 / 0, h = [], m, y, p, v;
    for (u.unshift(r(i, l) + a); f--; )
      if (y = t(u[f]), h[f] = y.stops, e(u[f]).length !== 0)
        if (y.indent)
          y.indent > 0 && y.indent < d && (d = y.indent);
        else {
          d = 1 / 0;
          break;
        }
    if (d !== 1 / 0)
      for (f = u.length; f--; ) {
        for (p = h[f], m = d; m && !(m in p); )
          m--;
        e(u[f]).length !== 0 && d && m !== d ? v = s : v = "", u[f] = v + u[f].slice(m in p ? p[m] + 1 : 0);
      }
    return u.shift(), u.join(n);
  }
  return tt;
}
var nt, ki;
function Zf() {
  if (ki)
    return nt;
  ki = 1;
  var e = He(), r = mn(), t = yr, s = Qa(), n = Xf(), i = yn();
  nt = T;
  var a = "*", o = "_", c = "+", l = "-", u = ".", f = " ", d = `
`, h = "	", m = ")", y = "x", p = 4, v = /\n\n(?!\s*$)/, g = /^\[([ \t]|x|X)][ \t]/, b = /^([ \t]*)([*+-]|\d+[.)])( {1,4}(?! )| |\t|$|(?=\n))([^\n]*)/, E = /^([ \t]*)([*+-]|\d+[.)])([ \t]+)/, A = /^( {1,4}|\t)?/gm;
  function T(C, S, R) {
    for (var x = this, I = x.options.commonmark, N = x.options.pedantic, _ = x.blockTokenizers, H = x.interruptList, P = 0, M = S.length, U = null, B = 0, q, Q, F, Y, K, ne, Ve, oe, On, ie, Cr, Or, je, ge, ee, D, Rn, In, Pn = !1, Rr, _n, er, me; P < M; ) {
      if (F = S.charAt(P), F === h)
        B += p - B % p;
      else if (F === f)
        B++;
      else
        break;
      P++;
    }
    if (!(B >= p)) {
      if (F = S.charAt(P), F === a || F === c || F === l)
        Y = F, Q = !1;
      else {
        for (Q = !0, q = ""; P < M && (F = S.charAt(P), !!t(F)); )
          q += F, P++;
        if (F = S.charAt(P), !q || !(F === u || I && F === m))
          return;
        U = parseInt(q, 10), Y = F;
      }
      if (F = S.charAt(++P), !(F !== f && F !== h && (N || F !== d && F !== ""))) {
        if (R)
          return !0;
        for (P = 0, je = [], ge = [], ee = []; P < M; ) {
          for (K = S.indexOf(d, P), ne = P, Ve = !1, me = !1, K === -1 && (K = M), er = P + p, B = 0; P < M; ) {
            if (F = S.charAt(P), F === h)
              B += p - B % p;
            else if (F === f)
              B++;
            else
              break;
            P++;
          }
          if (B >= p && (me = !0), D && B >= D.indent && (me = !0), F = S.charAt(P), oe = null, !me) {
            if (F === a || F === c || F === l)
              oe = F, P++, B++;
            else {
              for (q = ""; P < M && (F = S.charAt(P), !!t(F)); )
                q += F, P++;
              F = S.charAt(P), P++, q && (F === u || I && F === m) && (oe = F, B += q.length + 1);
            }
            if (oe)
              if (F = S.charAt(P), F === h)
                B += p - B % p, P++;
              else if (F === f) {
                for (er = P + p; P < er && S.charAt(P) === f; )
                  P++, B++;
                P === er && S.charAt(P) === f && (P -= p - 1, B -= p - 1);
              } else
                F !== d && F !== "" && (oe = null);
          }
          if (oe) {
            if (!N && Y !== oe)
              break;
            Ve = !0;
          } else
            !I && !me && S.charAt(ne) === f ? me = !0 : I && D && (me = B >= D.indent || B > p), Ve = !1, P = ne;
          if (ie = S.slice(ne, K), On = ne === P ? ie : S.slice(P, K), (oe === a || oe === o || oe === l) && _.thematicBreak.call(x, C, ie, !0))
            break;
          if (Cr = Or, Or = !Ve && !e(On).length, me && D)
            D.value = D.value.concat(ee, ie), ge = ge.concat(ee, ie), ee = [];
          else if (Ve)
            ee.length !== 0 && (Pn = !0, D.value.push(""), D.trail = ee.concat()), D = {
              value: [ie],
              indent: B,
              trail: []
            }, je.push(D), ge = ge.concat(ee, ie), ee = [];
          else if (Or) {
            if (Cr && !I)
              break;
            ee.push(ie);
          } else {
            if (Cr || i(H, _, x, [C, ie, !0]))
              break;
            D.value = D.value.concat(ee, ie), ge = ge.concat(ee, ie), ee = [];
          }
          P = K + 1;
        }
        for (Rr = C(ge.join(d)).reset({
          type: "list",
          ordered: Q,
          start: U,
          spread: Pn,
          children: []
        }), Rn = x.enterList(), In = x.enterBlock(), P = -1, M = je.length; ++P < M; )
          D = je[P].value.join(d), _n = C.now(), C(D)(k(x, D, _n), Rr), D = je[P].trail.join(d), P !== M - 1 && (D += d), C(D);
        return Rn(), In(), Rr;
      }
    }
  }
  function k(C, S, R) {
    var x = C.offset, I = C.options.pedantic ? O : w, N = null, _, H;
    return S = I.apply(null, arguments), C.options.gfm && (_ = S.match(g), _ && (H = _[0].length, N = _[1].toLowerCase() === y, x[R.line] += H, S = S.slice(H))), {
      type: "listItem",
      spread: v.test(S),
      checked: N,
      children: C.tokenizeBlock(S, R)
    };
  }
  function O(C, S, R) {
    var x = C.offset, I = R.line;
    return S = S.replace(E, N), I = R.line, S.replace(A, N);
    function N(_) {
      return x[I] = (x[I] || 0) + _.length, I++, "";
    }
  }
  function w(C, S, R) {
    var x = C.offset, I = R.line, N, _, H, P, M, U, B;
    for (S = S.replace(b, q), P = S.split(d), M = n(S, s(N).indent).split(d), M[0] = H, x[I] = (x[I] || 0) + _.length, I++, U = 0, B = P.length; ++U < B; )
      x[I] = (x[I] || 0) + P[U].length - M[U].length, I++;
    return M.join(d);
    function q(Q, F, Y, K, ne) {
      return _ = F + Y + K, H = ne, Number(Y) < 10 && _.length % 2 === 1 && (Y = f + Y), N = F + r(f, Y.length) + K, N + H;
    }
  }
  return nt;
}
var it, xi;
function eu() {
  if (xi)
    return it;
  xi = 1, it = c;
  var e = `
`, r = "	", t = " ", s = "=", n = "-", i = 3, a = 1, o = 2;
  function c(l, u, f) {
    for (var d = this, h = l.now(), m = u.length, y = -1, p = "", v, g, b, E, A; ++y < m; ) {
      if (b = u.charAt(y), b !== t || y >= i) {
        y--;
        break;
      }
      p += b;
    }
    for (v = "", g = ""; ++y < m; ) {
      if (b = u.charAt(y), b === e) {
        y--;
        break;
      }
      b === t || b === r ? g += b : (v += g + b, g = "");
    }
    if (h.column += p.length, h.offset += p.length, p += v + g, b = u.charAt(++y), E = u.charAt(++y), !(b !== e || E !== s && E !== n)) {
      for (p += b, g = E, A = E === s ? a : o; ++y < m; ) {
        if (b = u.charAt(y), b !== E) {
          if (b !== e)
            return;
          y--;
          break;
        }
        g += b;
      }
      return f ? !0 : l(p + g)({
        type: "heading",
        depth: A,
        children: d.tokenizeInline(v, h)
      });
    }
  }
  return it;
}
var ir = {}, Si;
function Ya() {
  if (Si)
    return ir;
  Si = 1;
  var e = "[a-zA-Z_:][a-zA-Z0-9:._-]*", r = "[^\"'=<>`\\u0000-\\u0020]+", t = "'[^']*'", s = '"[^"]*"', n = "(?:" + r + "|" + t + "|" + s + ")", i = "(?:\\s+" + e + "(?:\\s*=\\s*" + n + ")?)", a = "<[A-Za-z][A-Za-z0-9\\-]*" + i + "*\\s*\\/?>", o = "<\\/[A-Za-z][A-Za-z0-9\\-]*\\s*>", c = "<!---->|<!--(?:-?[^>-])(?:-?[^-])*-->", l = "<[?].*?[?]>", u = "<![A-Za-z]+\\s+[^>]*>", f = "<!\\[CDATA\\[[\\s\\S]*?\\]\\]>";
  return ir.openCloseTag = new RegExp("^(?:" + a + "|" + o + ")"), ir.tag = new RegExp(
    "^(?:" + a + "|" + o + "|" + c + "|" + l + "|" + u + "|" + f + ")"
  ), ir;
}
var at, Ci;
function ru() {
  if (Ci)
    return at;
  Ci = 1;
  var e = Ya().openCloseTag;
  at = v;
  var r = "	", t = " ", s = `
`, n = "<", i = /^<(script|pre|style)(?=(\s|>|$))/i, a = /<\/(script|pre|style)>/i, o = /^<!--/, c = /-->/, l = /^<\?/, u = /\?>/, f = /^<![A-Za-z]/, d = />/, h = /^<!\[CDATA\[/, m = /\]\]>/, y = /^$/, p = new RegExp(e.source + "\\s*$");
  function v(g, b, E) {
    for (var A = this, T = A.options.blocks.join("|"), k = new RegExp(
      "^</?(" + T + ")(?=(\\s|/?>|$))",
      "i"
    ), O = b.length, w = 0, C, S, R, x, I, N, _, H = [
      [i, a, !0],
      [o, c, !0],
      [l, u, !0],
      [f, d, !0],
      [h, m, !0],
      [k, y, !0],
      [p, y, !1]
    ]; w < O && (x = b.charAt(w), !(x !== r && x !== t)); )
      w++;
    if (b.charAt(w) === n) {
      for (C = b.indexOf(s, w + 1), C = C === -1 ? O : C, S = b.slice(w, C), R = -1, I = H.length; ++R < I; )
        if (H[R][0].test(S)) {
          N = H[R];
          break;
        }
      if (N) {
        if (E)
          return N[2];
        if (w = C, !N[1].test(S))
          for (; w < O; ) {
            if (C = b.indexOf(s, w + 1), C = C === -1 ? O : C, S = b.slice(w + 1, C), N[1].test(S)) {
              S && (w = C);
              break;
            }
            w = C;
          }
        return _ = b.slice(0, w), g(_)({ type: "html", value: _ });
      }
    }
  }
  return at;
}
var st, Oi;
function tu() {
  if (Oi)
    return st;
  Oi = 1, st = e;
  function e(r) {
    return String(r).replace(/\s+/g, " ");
  }
  return st;
}
var ot, Ri;
function bn() {
  if (Ri)
    return ot;
  Ri = 1;
  var e = tu();
  ot = r;
  function r(t) {
    return e(t).toLowerCase();
  }
  return ot;
}
var ct, Ii;
function nu() {
  if (Ii)
    return ct;
  Ii = 1;
  var e = se(), r = bn();
  ct = f, f.notInList = !0, f.notInBlock = !0;
  var t = "\\", s = `
`, n = "	", i = " ", a = "[", o = "]", c = "^", l = ":", u = /^( {4}|\t)?/gm;
  function f(d, h, m) {
    var y = this, p = y.offset, v, g, b, E, A, T, k, O, w, C, S, R;
    if (y.options.footnotes) {
      for (v = 0, g = h.length, b = "", E = d.now(), A = E.line; v < g && (w = h.charAt(v), !!e(w)); )
        b += w, v++;
      if (!(h.charAt(v) !== a || h.charAt(v + 1) !== c)) {
        for (b += a + c, v = b.length, k = ""; v < g && (w = h.charAt(v), w !== o); )
          w === t && (k += w, v++, w = h.charAt(v)), k += w, v++;
        if (!(!k || h.charAt(v) !== o || h.charAt(v + 1) !== l)) {
          if (m)
            return !0;
          for (C = k, b += k + o + l, v = b.length; v < g && (w = h.charAt(v), !(w !== n && w !== i)); )
            b += w, v++;
          for (E.column += b.length, E.offset += b.length, k = "", T = "", O = ""; v < g; ) {
            if (w = h.charAt(v), w === s) {
              for (O = w, v++; v < g && (w = h.charAt(v), w === s); )
                O += w, v++;
              for (k += O, O = ""; v < g && (w = h.charAt(v), w === i); )
                O += w, v++;
              if (O.length === 0)
                break;
              k += O;
            }
            k && (T += k, k = ""), T += w, v++;
          }
          return b += T, T = T.replace(u, function(x) {
            return p[A] = (p[A] || 0) + x.length, A++, "";
          }), S = d(b), R = y.enterBlock(), T = y.tokenizeBlock(T, E), R(), S({
            type: "footnoteDefinition",
            identifier: r(C),
            label: C,
            children: T
          });
        }
      }
    }
  }
  return ct;
}
var lt, Pi;
function iu() {
  if (Pi)
    return lt;
  Pi = 1;
  var e = se(), r = bn();
  lt = y;
  var t = '"', s = "'", n = "\\", i = `
`, a = "	", o = " ", c = "[", l = "]", u = "(", f = ")", d = ":", h = "<", m = ">";
  function y(g, b, E) {
    for (var A = this, T = A.options.commonmark, k = 0, O = b.length, w = "", C, S, R, x, I, N, _, H; k < O && (x = b.charAt(k), !(x !== o && x !== a)); )
      w += x, k++;
    if (x = b.charAt(k), x === c) {
      for (k++, w += x, R = ""; k < O && (x = b.charAt(k), x !== l); )
        x === n && (R += x, k++, x = b.charAt(k)), R += x, k++;
      if (!(!R || b.charAt(k) !== l || b.charAt(k + 1) !== d)) {
        for (N = R, w += R + l + d, k = w.length, R = ""; k < O && (x = b.charAt(k), !(x !== a && x !== o && x !== i)); )
          w += x, k++;
        if (x = b.charAt(k), R = "", C = w, x === h) {
          for (k++; k < O && (x = b.charAt(k), !!p(x)); )
            R += x, k++;
          if (x = b.charAt(k), x === p.delimiter)
            w += h + R + x, k++;
          else {
            if (T)
              return;
            k -= R.length + 1, R = "";
          }
        }
        if (!R) {
          for (; k < O && (x = b.charAt(k), !!v(x)); )
            R += x, k++;
          w += R;
        }
        if (R) {
          for (_ = R, R = ""; k < O && (x = b.charAt(k), !(x !== a && x !== o && x !== i)); )
            R += x, k++;
          if (x = b.charAt(k), I = null, x === t ? I = t : x === s ? I = s : x === u && (I = f), !I)
            R = "", k = w.length;
          else if (R) {
            for (w += R + x, k = w.length, R = ""; k < O && (x = b.charAt(k), x !== I); ) {
              if (x === i) {
                if (k++, x = b.charAt(k), x === i || x === I)
                  return;
                R += i;
              }
              R += x, k++;
            }
            if (x = b.charAt(k), x !== I)
              return;
            S = w, w += R + x, k++, H = R, R = "";
          } else
            return;
          for (; k < O && (x = b.charAt(k), !(x !== a && x !== o)); )
            w += x, k++;
          if (x = b.charAt(k), !x || x === i)
            return E ? !0 : (C = g(C).test().end, _ = A.decode.raw(A.unescape(_), C, { nonTerminated: !1 }), H && (S = g(S).test().end, H = A.decode.raw(A.unescape(H), S)), g(w)({
              type: "definition",
              identifier: r(N),
              label: N,
              title: H || null,
              url: _
            }));
        }
      }
    }
  }
  function p(g) {
    return g !== m && g !== c && g !== l;
  }
  p.delimiter = m;
  function v(g) {
    return g !== c && g !== l && !e(g);
  }
  return lt;
}
var ft, _i;
function au() {
  if (_i)
    return ft;
  _i = 1;
  var e = se();
  ft = h;
  var r = "	", t = `
`, s = " ", n = "-", i = ":", a = "\\", o = "|", c = 1, l = 2, u = "left", f = "center", d = "right";
  function h(m, y, p) {
    var v = this, g, b, E, A, T, k, O, w, C, S, R, x, I, N, _, H, P, M, U, B, q, Q;
    if (v.options.gfm) {
      for (g = 0, H = 0, k = y.length + 1, O = []; g < k; ) {
        if (B = y.indexOf(t, g), q = y.indexOf(o, g + 1), B === -1 && (B = y.length), q === -1 || q > B) {
          if (H < l)
            return;
          break;
        }
        O.push(y.slice(g, B)), H++, g = B + 1;
      }
      for (A = O.join(t), b = O.splice(1, 1)[0] || [], g = 0, k = b.length, H--, E = !1, R = []; g < k; ) {
        if (C = b.charAt(g), C === o) {
          if (S = null, E === !1) {
            if (Q === !1)
              return;
          } else
            R.push(E), E = !1;
          Q = !1;
        } else if (C === n)
          S = !0, E = E || null;
        else if (C === i)
          E === u ? E = f : S && E === null ? E = d : E = u;
        else if (!e(C))
          return;
        g++;
      }
      if (E !== !1 && R.push(E), !(R.length < c)) {
        if (p)
          return !0;
        for (_ = -1, M = [], U = m(A).reset({ type: "table", align: R, children: M }); ++_ < H; ) {
          for (P = O[_], T = { type: "tableRow", children: [] }, _ && m(t), m(P).reset(T, U), k = P.length + 1, g = 0, w = "", x = "", I = !0; g < k; ) {
            if (C = P.charAt(g), C === r || C === s) {
              x ? w += C : m(C), g++;
              continue;
            }
            C === "" || C === o ? I ? m(C) : ((x || C) && !I && (A = x, w.length > 1 && (C ? (A += w.slice(0, w.length - 1), w = w.charAt(w.length - 1)) : (A += w, w = "")), N = m.now(), m(A)(
              { type: "tableCell", children: v.tokenizeInline(x, N) },
              T
            )), m(w + C), w = "", x = "") : (w && (x += w, w = ""), x += C, C === a && g !== k - 2 && (x += P.charAt(g + 1), g++)), I = !1, g++;
          }
          _ || m(t + b);
        }
        return U;
      }
    }
  }
  return ft;
}
var ut, Bi;
function su() {
  if (Bi)
    return ut;
  Bi = 1;
  var e = He(), r = yr, t = Ka(), s = yn();
  ut = c;
  var n = "	", i = `
`, a = " ", o = 4;
  function c(l, u, f) {
    for (var d = this, h = d.options, m = h.commonmark, y = h.gfm, p = d.blockTokenizers, v = d.interruptParagraph, g = u.indexOf(i), b = u.length, E, A, T, k, O; g < b; ) {
      if (g === -1) {
        g = b;
        break;
      }
      if (u.charAt(g + 1) === i)
        break;
      if (m) {
        for (k = 0, E = g + 1; E < b; ) {
          if (T = u.charAt(E), T === n) {
            k = o;
            break;
          } else if (T === a)
            k++;
          else
            break;
          E++;
        }
        if (k >= o && T !== i) {
          g = u.indexOf(i, g + 1);
          continue;
        }
      }
      if (A = u.slice(g + 1), s(v, p, d, [l, A, !0]) || p.list.call(d, l, A, !0) && (d.inList || m || y && !r(e.left(A).charAt(0))))
        break;
      if (E = g, g = u.indexOf(i, g + 1), g !== -1 && e(u.slice(E, g)) === "") {
        g = E;
        break;
      }
    }
    return A = u.slice(0, g), e(A) === "" ? (l(A), null) : f ? !0 : (O = l.now(), A = t(A), l(A)({
      type: "paragraph",
      children: d.tokenizeInline(A, O)
    }));
  }
  return ut;
}
var dt, Ni;
function ou() {
  if (Ni)
    return dt;
  Ni = 1, dt = e;
  function e(r, t) {
    return r.indexOf("\\", t);
  }
  return dt;
}
var ht, Fi;
function cu() {
  if (Fi)
    return ht;
  Fi = 1;
  var e = ou();
  ht = s, s.locator = e;
  var r = `
`, t = "\\";
  function s(n, i, a) {
    var o = this, c, l;
    if (i.charAt(0) === t && (c = i.charAt(1), o.escape.indexOf(c) !== -1))
      return a ? !0 : (c === r ? l = { type: "break" } : l = { type: "text", value: c }, n(t + c)(l));
  }
  return ht;
}
var pt, Li;
function Ja() {
  if (Li)
    return pt;
  Li = 1, pt = e;
  function e(r, t) {
    return r.indexOf("<", t);
  }
  return pt;
}
var vt, qi;
function lu() {
  if (qi)
    return vt;
  qi = 1;
  var e = se(), r = hn, t = Ja();
  vt = l, l.locator = t, l.notInLink = !0;
  var s = "<", n = ">", i = "@", a = "/", o = "mailto:", c = o.length;
  function l(u, f, d) {
    var h = this, m = "", y = f.length, p = 0, v = "", g = !1, b = "", E, A, T, k, O;
    if (f.charAt(0) === s) {
      for (p++, m = s; p < y && (E = f.charAt(p), !(e(E) || E === n || E === i || E === ":" && f.charAt(p + 1) === a)); )
        v += E, p++;
      if (v) {
        if (b += v, v = "", E = f.charAt(p), b += E, p++, E === i)
          g = !0;
        else {
          if (E !== ":" || f.charAt(p + 1) !== a)
            return;
          b += a, p++;
        }
        for (; p < y && (E = f.charAt(p), !(e(E) || E === n)); )
          v += E, p++;
        if (E = f.charAt(p), !(!v || E !== n))
          return d ? !0 : (b += v, T = b, m += b + E, A = u.now(), A.column++, A.offset++, g && (b.slice(0, c).toLowerCase() === o ? (T = T.slice(c), A.column += c, A.offset += c) : b = o + b), k = h.inlineTokenizers, h.inlineTokenizers = { text: k.text }, O = h.enterLink(), T = h.tokenizeInline(T, A), h.inlineTokenizers = k, O(), u(m)({
            type: "link",
            title: null,
            url: r(b, { nonTerminated: !1 }),
            children: T
          }));
      }
    }
  }
  return vt;
}
var gt, Hi;
function fu() {
  if (Hi)
    return gt;
  Hi = 1, gt = r;
  var e = ["https://", "http://", "mailto:"];
  function r(t, s) {
    var n = e.length, i = -1, a = -1, o;
    if (!this.options.gfm)
      return -1;
    for (; ++i < n; )
      o = t.indexOf(e[i], s), o !== -1 && (o < a || a === -1) && (a = o);
    return a;
  }
  return gt;
}
var mt, Mi;
function uu() {
  if (Mi)
    return mt;
  Mi = 1;
  var e = hn, r = se(), t = fu();
  mt = E, E.locator = t, E.notInLink = !0;
  var s = '"', n = "'", i = "(", a = ")", o = ",", c = ".", l = ":", u = ";", f = "<", d = "@", h = "[", m = "]", y = "http://", p = "https://", v = "mailto:", g = [y, p, v], b = g.length;
  function E(A, T, k) {
    var O = this, w, C, S, R, x, I, N, _, H, P, M, U, B;
    if (O.options.gfm) {
      for (w = "", R = -1; ++R < b; )
        if (I = g[R], N = T.slice(0, I.length), N.toLowerCase() === I) {
          w = N;
          break;
        }
      if (w) {
        for (R = w.length, _ = T.length, H = "", P = 0; R < _ && (S = T.charAt(R), !(r(S) || S === f || (S === c || S === o || S === l || S === u || S === s || S === n || S === a || S === m) && (M = T.charAt(R + 1), !M || r(M)) || ((S === i || S === h) && P++, (S === a || S === m) && (P--, P < 0)))); )
          H += S, R++;
        if (H) {
          if (w += H, C = w, I === v) {
            if (x = H.indexOf(d), x === -1 || x === _ - 1)
              return;
            C = C.slice(v.length);
          }
          return k ? !0 : (B = O.enterLink(), U = O.inlineTokenizers, O.inlineTokenizers = { text: U.text }, C = O.tokenizeInline(C, A.now()), O.inlineTokenizers = U, B(), A(w)({
            type: "link",
            title: null,
            url: e(w, { nonTerminated: !1 }),
            children: C
          }));
        }
      }
    }
  }
  return mt;
}
var yt, $i;
function du() {
  if ($i)
    return yt;
  $i = 1;
  var e = Ma(), r = Ja(), t = Ya().tag;
  yt = l, l.locator = r;
  var s = "<", n = "?", i = "!", a = "/", o = /^<a /i, c = /^<\/a>/i;
  function l(u, f, d) {
    var h = this, m = f.length, y, p;
    if (!(f.charAt(0) !== s || m < 3) && (y = f.charAt(1), !(!e(y) && y !== n && y !== i && y !== a) && (p = f.match(t), !!p)))
      return d ? !0 : (p = p[0], !h.inLink && o.test(p) ? h.inLink = !0 : h.inLink && c.test(p) && (h.inLink = !1), u(p)({ type: "html", value: p }));
  }
  return yt;
}
var bt, Ui;
function Xa() {
  if (Ui)
    return bt;
  Ui = 1, bt = e;
  function e(r, t) {
    var s = r.indexOf("[", t), n = r.indexOf("![", t);
    return n === -1 || s < n ? s : n;
  }
  return bt;
}
var At, Vi;
function hu() {
  if (Vi)
    return At;
  Vi = 1;
  var e = se(), r = Xa();
  At = m, m.locator = r;
  var t = `
`, s = "!", n = '"', i = "'", a = "(", o = ")", c = "<", l = ">", u = "[", f = "\\", d = "]", h = "`";
  function m(y, p, v) {
    var g = this, b = "", E = 0, A = p.charAt(0), T = g.options.pedantic, k = g.options.commonmark, O = g.options.gfm, w, C, S, R, x, I, N, _, H, P, M, U, B, q, Q, F, Y, K;
    if (A === s && (_ = !0, b = A, A = p.charAt(++E)), A === u && !(!_ && g.inLink)) {
      for (b += A, q = "", E++, M = p.length, F = y.now(), B = 0, F.column += E, F.offset += E; E < M; ) {
        if (A = p.charAt(E), I = A, A === h) {
          for (C = 1; p.charAt(E + 1) === h; )
            I += A, E++, C++;
          S ? C >= S && (S = 0) : S = C;
        } else if (A === f)
          E++, I += p.charAt(E);
        else if ((!S || O) && A === u)
          B++;
        else if ((!S || O) && A === d)
          if (B)
            B--;
          else {
            if (!T)
              for (; E < M && (A = p.charAt(E + 1), !!e(A)); )
                I += A, E++;
            if (p.charAt(E + 1) !== a)
              return;
            I += a, w = !0, E++;
            break;
          }
        q += I, I = "", E++;
      }
      if (w) {
        for (H = q, b += q + I, E++; E < M && (A = p.charAt(E), !!e(A)); )
          b += A, E++;
        if (A = p.charAt(E), q = "", R = b, A === c) {
          for (E++, R += c; E < M && (A = p.charAt(E), A !== l); ) {
            if (k && A === t)
              return;
            q += A, E++;
          }
          if (p.charAt(E) !== l)
            return;
          b += c + q + l, Q = q, E++;
        } else {
          for (A = null, I = ""; E < M && (A = p.charAt(E), !(I && (A === n || A === i || k && A === a))); ) {
            if (e(A)) {
              if (!T)
                break;
              I += A;
            } else {
              if (A === a)
                B++;
              else if (A === o) {
                if (B === 0)
                  break;
                B--;
              }
              q += I, I = "", A === f && (q += f, A = p.charAt(++E)), q += A;
            }
            E++;
          }
          b += q, Q = q, E = b.length;
        }
        for (q = ""; E < M && (A = p.charAt(E), !!e(A)); )
          q += A, E++;
        if (A = p.charAt(E), b += q, q && (A === n || A === i || k && A === a))
          if (E++, b += A, q = "", P = A === a ? o : A, x = b, k) {
            for (; E < M && (A = p.charAt(E), A !== P); )
              A === f && (q += f, A = p.charAt(++E)), E++, q += A;
            if (A = p.charAt(E), A !== P)
              return;
            for (U = q, b += q + A, E++; E < M && (A = p.charAt(E), !!e(A)); )
              b += A, E++;
          } else
            for (I = ""; E < M; ) {
              if (A = p.charAt(E), A === P)
                N && (q += P + I, I = ""), N = !0;
              else if (!N)
                q += A;
              else if (A === o) {
                b += q + P + I, U = q;
                break;
              } else
                e(A) ? I += A : (q += P + I + A, I = "", N = !1);
              E++;
            }
        if (p.charAt(E) === o)
          return v ? !0 : (b += o, Q = g.decode.raw(g.unescape(Q), y(R).test().end, {
            nonTerminated: !1
          }), U && (x = y(x).test().end, U = g.decode.raw(g.unescape(U), x)), K = {
            type: _ ? "image" : "link",
            title: U || null,
            url: Q
          }, _ ? K.alt = g.decode.raw(g.unescape(H), F) || null : (Y = g.enterLink(), K.children = g.tokenizeInline(H, F), Y()), y(b)(K));
      }
    }
  }
  return At;
}
var wt, ji;
function pu() {
  if (ji)
    return wt;
  ji = 1;
  var e = se(), r = Xa(), t = bn();
  wt = y, y.locator = r;
  var s = "link", n = "image", i = "footnote", a = "shortcut", o = "collapsed", c = "full", l = " ", u = "!", f = "[", d = "\\", h = "]", m = "^";
  function y(p, v, g) {
    var b = this, E = b.options.commonmark, A = b.options.footnotes, T = v.charAt(0), k = 0, O = v.length, w = "", C = "", S = s, R = a, x, I, N, _, H, P, M, U;
    if (T === u && (S = n, C = T, T = v.charAt(++k)), T === f) {
      if (k++, C += T, P = "", A && v.charAt(k) === m) {
        if (S === n)
          return;
        C += m, k++, S = i;
      }
      for (U = 0; k < O; ) {
        if (T = v.charAt(k), T === f)
          M = !0, U++;
        else if (T === h) {
          if (!U)
            break;
          U--;
        }
        T === d && (P += d, T = v.charAt(++k)), P += T, k++;
      }
      if (w = P, x = P, T = v.charAt(k), T === h) {
        if (k++, w += T, P = "", !E)
          for (; k < O && (T = v.charAt(k), !!e(T)); )
            P += T, k++;
        if (T = v.charAt(k), S !== i && T === f && (!A || v.charAt(k + 1) !== m)) {
          for (I = "", P += T, k++; k < O && (T = v.charAt(k), !(T === f || T === h)); )
            T === d && (I += d, T = v.charAt(++k)), I += T, k++;
          T = v.charAt(k), T === h ? (R = I ? c : o, P += I + T, k++) : I = "", w += P, P = "";
        } else {
          if (!x)
            return;
          I = x;
        }
        if (!(R !== c && M))
          return w = C + w, S === s && b.inLink ? null : g ? !0 : S === i && x.indexOf(l) !== -1 ? p(w)({
            type: i,
            children: this.tokenizeInline(x, p.now())
          }) : (N = p.now(), N.column += C.length, N.offset += C.length, I = R === c ? I : x, _ = {
            type: S + "Reference",
            identifier: t(I),
            label: I
          }, (S === s || S === n) && (_.referenceType = R), S === s ? (H = b.enterLink(), _.children = b.tokenizeInline(x, N), H()) : S === n && (_.alt = b.decode.raw(b.unescape(x), N) || null), p(w)(_));
      }
    }
  }
  return wt;
}
var Et, Wi;
function vu() {
  if (Wi)
    return Et;
  Wi = 1, Et = e;
  function e(r, t) {
    var s = r.indexOf("**", t), n = r.indexOf("__", t);
    return n === -1 ? s : s === -1 || n < s ? n : s;
  }
  return Et;
}
var Tt, zi;
function gu() {
  if (zi)
    return Tt;
  zi = 1;
  var e = He(), r = se(), t = vu();
  Tt = a, a.locator = t;
  var s = "\\", n = "*", i = "_";
  function a(o, c, l) {
    var u = this, f = 0, d = c.charAt(f), h, m, y, p, v, g, b;
    if (!(d !== n && d !== i || c.charAt(++f) !== d) && (m = u.options.pedantic, y = d, v = y + y, g = c.length, f++, p = "", d = "", !(m && r(c.charAt(f)))))
      for (; f < g; ) {
        if (b = d, d = c.charAt(f), d === y && c.charAt(f + 1) === y && (!m || !r(b)) && (d = c.charAt(f + 2), d !== y))
          return e(p) ? l ? !0 : (h = o.now(), h.column += 2, h.offset += 2, o(v + p + v)({
            type: "strong",
            children: u.tokenizeInline(p, h)
          })) : void 0;
        !m && d === s && (p += d, d = c.charAt(++f)), p += d, f++;
      }
  }
  return Tt;
}
var kt, Di;
function mu() {
  if (Di)
    return kt;
  Di = 1, kt = t;
  var e = String.fromCharCode, r = /\w/;
  function t(s) {
    return r.test(
      typeof s == "number" ? e(s) : s.charAt(0)
    );
  }
  return kt;
}
var xt, Gi;
function yu() {
  if (Gi)
    return xt;
  Gi = 1, xt = e;
  function e(r, t) {
    var s = r.indexOf("*", t), n = r.indexOf("_", t);
    return n === -1 ? s : s === -1 || n < s ? n : s;
  }
  return xt;
}
var St, Ki;
function bu() {
  if (Ki)
    return St;
  Ki = 1;
  var e = He(), r = mu(), t = se(), s = yu();
  St = o, o.locator = s;
  var n = "*", i = "_", a = "\\";
  function o(c, l, u) {
    var f = this, d = 0, h = l.charAt(d), m, y, p, v, g, b, E;
    if (!(h !== n && h !== i) && (y = f.options.pedantic, g = h, p = h, b = l.length, d++, v = "", h = "", !(y && t(l.charAt(d)))))
      for (; d < b; ) {
        if (E = h, h = l.charAt(d), h === p && (!y || !t(E))) {
          if (h = l.charAt(++d), h !== p) {
            if (!e(v) || E === p)
              return;
            if (!y && p === i && r(h)) {
              v += p;
              continue;
            }
            return u ? !0 : (m = c.now(), m.column++, m.offset++, c(g + v + p)({
              type: "emphasis",
              children: f.tokenizeInline(v, m)
            }));
          }
          v += p;
        }
        !y && h === a && (v += h, h = l.charAt(++d)), v += h, d++;
      }
  }
  return St;
}
var Ct, Qi;
function Au() {
  if (Qi)
    return Ct;
  Qi = 1, Ct = e;
  function e(r, t) {
    return r.indexOf("~~", t);
  }
  return Ct;
}
var Ot, Yi;
function wu() {
  if (Yi)
    return Ot;
  Yi = 1;
  var e = se(), r = Au();
  Ot = n, n.locator = r;
  var t = "~", s = "~~";
  function n(i, a, o) {
    var c = this, l = "", u = "", f = "", d = "", h, m, y;
    if (!(!c.options.gfm || a.charAt(0) !== t || a.charAt(1) !== t || e(a.charAt(2))))
      for (h = 1, m = a.length, y = i.now(), y.column += 2, y.offset += 2; ++h < m; ) {
        if (l = a.charAt(h), l === t && u === t && (!f || !e(f)))
          return o ? !0 : i(s + d + s)({
            type: "delete",
            children: c.tokenizeInline(d, y)
          });
        d += u, f = u, u = l;
      }
  }
  return Ot;
}
var Rt, Ji;
function Eu() {
  if (Ji)
    return Rt;
  Ji = 1, Rt = e;
  function e(r, t) {
    return r.indexOf("`", t);
  }
  return Rt;
}
var It, Xi;
function Tu() {
  if (Xi)
    return It;
  Xi = 1;
  var e = Eu();
  It = n, n.locator = e;
  var r = 10, t = 32, s = 96;
  function n(i, a, o) {
    for (var c = a.length, l = 0, u, f, d, h, m, y; l < c && a.charCodeAt(l) === s; )
      l++;
    if (!(l === 0 || l === c)) {
      for (u = l, m = a.charCodeAt(l); l < c; ) {
        if (h = m, m = a.charCodeAt(l + 1), h === s) {
          if (f === void 0 && (f = l), d = l + 1, m !== s && d - f === u) {
            y = !0;
            break;
          }
        } else
          f !== void 0 && (f = void 0, d = void 0);
        l++;
      }
      if (y) {
        if (o)
          return !0;
        if (l = u, c = f, h = a.charCodeAt(l), m = a.charCodeAt(c - 1), y = !1, c - l > 2 && (h === t || h === r) && (m === t || m === r)) {
          for (l++, c--; l < c; ) {
            if (h = a.charCodeAt(l), h !== t && h !== r) {
              y = !0;
              break;
            }
            l++;
          }
          y === !0 && (u++, f--);
        }
        return i(a.slice(0, d))({
          type: "inlineCode",
          value: a.slice(u, f)
        });
      }
    }
  }
  return It;
}
var Pt, Zi;
function ku() {
  if (Zi)
    return Pt;
  Zi = 1, Pt = e;
  function e(r, t) {
    for (var s = r.indexOf(`
`, t); s > t && r.charAt(s - 1) === " "; )
      s--;
    return s;
  }
  return Pt;
}
var _t, ea;
function xu() {
  if (ea)
    return _t;
  ea = 1;
  var e = ku();
  _t = n, n.locator = e;
  var r = " ", t = `
`, s = 2;
  function n(i, a, o) {
    for (var c = a.length, l = -1, u = "", f; ++l < c; ) {
      if (f = a.charAt(l), f === t)
        return l < s ? void 0 : o ? !0 : (u += f, i(u)({ type: "break" }));
      if (f !== r)
        return;
      u += f;
    }
  }
  return _t;
}
var Bt, ra;
function Su() {
  if (ra)
    return Bt;
  ra = 1, Bt = e;
  function e(r, t, s) {
    var n = this, i, a, o, c, l, u, f, d, h, m;
    if (s)
      return !0;
    for (i = n.inlineMethods, c = i.length, a = n.inlineTokenizers, o = -1, h = t.length; ++o < c; )
      d = i[o], !(d === "text" || !a[d]) && (f = a[d].locator, f || r.file.fail("Missing locator: `" + d + "`"), u = f.call(n, t, 1), u !== -1 && u < h && (h = u));
    l = t.slice(0, h), m = r.now(), n.decode(l, m, y);
    function y(p, v, g) {
      r(g || p)({ type: "text", value: p });
    }
  }
  return Bt;
}
var Cu = Ce, Ar = Do, Ou = Ko, Ru = Zo, Iu = _f, An = Nf, Pu = Za;
function Za(e, r) {
  this.file = r, this.offset = {}, this.options = Cu(this.options), this.setOptions({}), this.inList = !1, this.inBlock = !1, this.inLink = !1, this.atStart = !0, this.toOffset = Ou(r).toOffset, this.unescape = Ru(this, "escape"), this.decode = Iu(this);
}
var G = Za.prototype;
G.setOptions = $f();
G.parse = zf();
G.options = Ga();
G.exitStart = Ar("atStart", !0);
G.enterList = Ar("inList", !1);
G.enterLink = Ar("inLink", !1);
G.enterBlock = Ar("inBlock", !1);
G.interruptParagraph = [
  ["thematicBreak"],
  ["atxHeading"],
  ["fencedCode"],
  ["blockquote"],
  ["html"],
  ["setextHeading", { commonmark: !1 }],
  ["definition", { commonmark: !1 }],
  ["footnote", { commonmark: !1 }]
];
G.interruptList = [
  ["atxHeading", { pedantic: !1 }],
  ["fencedCode", { pedantic: !1 }],
  ["thematicBreak", { pedantic: !1 }],
  ["definition", { commonmark: !1 }],
  ["footnote", { commonmark: !1 }]
];
G.interruptBlockquote = [
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
G.blockTokenizers = {
  newline: Df(),
  indentedCode: Gf(),
  fencedCode: Kf(),
  blockquote: Qf(),
  atxHeading: Yf(),
  thematicBreak: Jf(),
  list: Zf(),
  setextHeading: eu(),
  html: ru(),
  footnote: nu(),
  definition: iu(),
  table: au(),
  paragraph: su()
};
G.inlineTokenizers = {
  escape: cu(),
  autoLink: lu(),
  url: uu(),
  html: du(),
  link: hu(),
  reference: pu(),
  strong: gu(),
  emphasis: bu(),
  deletion: wu(),
  code: Tu(),
  break: xu(),
  text: Su()
};
G.blockMethods = es(G.blockTokenizers);
G.inlineMethods = es(G.inlineTokenizers);
G.tokenizeBlock = An("block");
G.tokenizeInline = An("inline");
G.tokenizeFactory = An;
function es(e) {
  var r = [], t;
  for (t in e)
    r.push(t);
  return r;
}
var _u = Wo, Bu = Ce, rs = Pu, Nu = ts;
ts.Parser = rs;
function ts(e) {
  var r = this.data("settings"), t = _u(rs);
  t.prototype.options = Bu(t.prototype.options, r, e), this.Parser = t;
}
const Fu = /* @__PURE__ */ gr(Nu);
var ns = { exports: {} };
(function(e) {
  (function() {
    var r;
    r = e.exports = n, r.format = n, r.vsprintf = s, typeof console < "u" && typeof console.log == "function" && (r.printf = t);
    function t() {
      console.log(n.apply(null, arguments));
    }
    function s(i, a) {
      return n.apply(null, [i].concat(a));
    }
    function n(i) {
      for (var a = 1, o = [].slice.call(arguments), c = 0, l = i.length, u = "", f, d = !1, h, m, y = !1, p, v = function() {
        return o[a++];
      }, g = function() {
        for (var b = ""; /\d/.test(i[c]); )
          b += i[c++], f = i[c];
        return b.length > 0 ? parseInt(b) : null;
      }; c < l; ++c)
        if (f = i[c], d)
          switch (d = !1, f == "." ? (y = !1, f = i[++c]) : f == "0" && i[c + 1] == "." ? (y = !0, c += 2, f = i[c]) : y = !0, p = g(), f) {
            case "b":
              u += parseInt(v(), 10).toString(2);
              break;
            case "c":
              h = v(), typeof h == "string" || h instanceof String ? u += h : u += String.fromCharCode(parseInt(h, 10));
              break;
            case "d":
              u += parseInt(v(), 10);
              break;
            case "f":
              m = String(parseFloat(v()).toFixed(p || 6)), u += y ? m : m.replace(/^0/, "");
              break;
            case "j":
              u += JSON.stringify(v());
              break;
            case "o":
              u += "0" + parseInt(v(), 10).toString(8);
              break;
            case "s":
              u += v();
              break;
            case "x":
              u += "0x" + parseInt(v(), 10).toString(16);
              break;
            case "X":
              u += "0x" + parseInt(v(), 10).toString(16).toUpperCase();
              break;
            default:
              u += f;
              break;
          }
        else
          f === "%" ? d = !0 : u += f;
      return u;
    }
  })();
})(ns);
var Lu = ns.exports, qu = Lu, Ee = Te(Error), Hu = Ee;
Ee.eval = Te(EvalError);
Ee.range = Te(RangeError);
Ee.reference = Te(ReferenceError);
Ee.syntax = Te(SyntaxError);
Ee.type = Te(TypeError);
Ee.uri = Te(URIError);
Ee.create = Te;
function Te(e) {
  return r.displayName = e.displayName || e.name, r;
  function r(t) {
    return t && (t = qu.apply(null, arguments)), new e(t);
  }
}
var ar = Hu, Mu = $u, sr = {}.hasOwnProperty, ta = {
  yaml: "-",
  toml: "+"
};
function $u(e) {
  var r = [], t = -1, s;
  for ((typeof e == "string" || !("length" in e)) && (e = [e]), s = e.length; ++t < s; )
    r[t] = Uu(e[t]);
  return r;
}
function Uu(e) {
  var r = e;
  if (typeof r == "string") {
    if (!sr.call(ta, r))
      throw ar("Missing matter definition for `%s`", r);
    r = { type: r, marker: ta[r] };
  } else if (typeof r != "object")
    throw ar("Expected matter to be an object, not `%j`", r);
  if (!sr.call(r, "type"))
    throw ar("Missing `type` in matter `%j`", r);
  if (!sr.call(r, "fence") && !sr.call(r, "marker"))
    throw ar("Missing `marker` or `fence` in matter `%j`", r);
  return r;
}
var is = Vu;
function Vu(e, r) {
  var t;
  return e.marker ? (t = na(e.marker, r), t + t + t) : na(e.fence, r);
}
function na(e, r) {
  return typeof e == "string" ? e : e[r];
}
var ia = is, ju = Wu;
function Wu(e) {
  var r = e.type + "FrontMatter", t = ia(e, "open"), s = ia(e, "close"), n = `
`, i = e.anywhere;
  return a.displayName = r, a.onlyAtStart = typeof i == "boolean" ? !i : !0, [r, a];
  function a(o, c, l) {
    var u = t.length, f;
    if (!(c.slice(0, u) !== t || c.charAt(u) !== n)) {
      for (f = c.indexOf(s, u); f !== -1 && c.charAt(f - 1) !== n; )
        u = f + s.length, f = c.indexOf(s, u);
      if (f !== -1)
        return l ? !0 : o(c.slice(0, f + s.length))({
          type: e.type,
          value: c.slice(t.length + 1, f - 1)
        });
    }
  }
}
var aa = is, zu = Du;
function Du(e) {
  var r = e.type, t = aa(e, "open"), s = aa(e, "close");
  return n.displayName = r + "FrontMatter", [r, n];
  function n(i) {
    return t + (i.value ? `
` + i.value : "") + `
` + s;
  }
}
var as = Ce, Gu = Mu, Ku = ju, Qu = zu, Yu = Ju;
function Ju(e) {
  var r = this.Parser, t = this.Compiler, s = Gu(e || ["yaml"]);
  ed(r) && Xu(r, s), rd(t) && Zu(t, s);
}
function Xu(e, r) {
  var t = e.prototype, s = ss(Ku, r), n = [], i;
  for (i in s)
    n.push(i);
  t.blockMethods = n.concat(t.blockMethods), t.blockTokenizers = as(s, t.blockTokenizers);
}
function Zu(e, r) {
  var t = e.prototype;
  t.visitors = as(ss(Qu, r), t.visitors);
}
function ss(e, r) {
  for (var t = {}, s = r.length, n = -1, i; ++n < s; )
    i = e(r[n]), t[i[0]] = i[1];
  return t;
}
function ed(e) {
  return !!(e && e.prototype && e.prototype.blockTokenizers);
}
function rd(e) {
  return !!(e && e.prototype && e.prototype.visitors);
}
const td = /* @__PURE__ */ gr(Yu);
var L = /* @__PURE__ */ ((e) => (e.EMPTY = "empty", e.SPACE = "space", e.WESTERN_LETTER = "western-letter", e.CJK_CHAR = "cjk-char", e.HALFWIDTH_PAUSE_OR_STOP = "halfwidth-pause-or-stop", e.FULLWIDTH_PAUSE_OR_STOP = "fullwidth-pause-or-stop", e.HALFWIDTH_QUOTATION = "halfwidth-quotation", e.FULLWIDTH_QUOTATION = "fullwidth-quotation", e.HALFWIDTH_BRACKET = "halfwidth-bracket", e.FULLWIDTH_BRACKET = "fullwidth-bracket", e.HALFWIDTH_OTHER_PUNCTUATION = "halfwidth-other-punctuation", e.FULLWIDTH_OTHER_PUNCTUATION = "fullwidth-other-punctuation", e.UNKNOWN = "unknown", e))(L || {});
const sa = {
  left: "([{（〔［｛",
  right: ")]}）〕］｝"
}, Nt = {
  left: "“‘《〈『「【〖",
  right: "”’》〉』」】〗",
  neutral: `'"`
}, nd = "'’", id = {
  "'": "'",
  "’": "‘"
}, ad = "“”‘’（）〔〕［］｛｝《》〈〉「」『』【】〖〗", hr = (e) => ad.indexOf(e) >= 0;
var ae = /* @__PURE__ */ ((e) => (e.BRACKETS = "brackets", e.HYPER = "hyper", e.RAW = "raw", e))(ae || {}), W = /* @__PURE__ */ ((e) => (e.LEFT = "left", e.RIGHT = "right", e))(W || {});
const sd = (e) => e.code !== void 0;
var j = /* @__PURE__ */ ((e) => (e.BRACKET_MARK = "bracket-mark", e.HYPER_MARK = "hyper-mark", e.CODE_CONTENT = "code-content", e.HYPER_CONTENT = "hyper-content", e.UNMATCHED = "unmatched", e.INDETERMINATED = "indeterminated", e))(j || {}), J = /* @__PURE__ */ ((e) => (e.GROUP = "group", e))(J || {});
const os = (e) => {
  switch (e) {
    case "cjk-char":
      return "western-letter";
    case "fullwidth-pause-or-stop":
      return "halfwidth-pause-or-stop";
    case "fullwidth-other-punctuation":
      return "halfwidth-other-punctuation";
  }
  return e;
}, od = (e) => {
  switch (e) {
    case "western-letter":
      return "cjk-char";
    case "halfwidth-pause-or-stop":
      return "fullwidth-pause-or-stop";
    case "halfwidth-other-punctuation":
      return "fullwidth-other-punctuation";
  }
  return e;
}, re = (e) => e === "western-letter" || e === "cjk-char", wn = (e) => e === "halfwidth-pause-or-stop" || e === "fullwidth-pause-or-stop", cs = (e) => e === "halfwidth-quotation" || e === "fullwidth-quotation", ls = (e) => e === "halfwidth-bracket" || e === "fullwidth-bracket", fs = (e) => e === "halfwidth-other-punctuation" || e === "fullwidth-other-punctuation", Xt = (e) => wn(e) || fs(e), cd = (e) => wn(e) || cs(e) || ls(e) || fs(e), be = (e) => e === "halfwidth-pause-or-stop" || e === "halfwidth-quotation" || e === "halfwidth-bracket" || e === "halfwidth-other-punctuation", En = (e) => e === "fullwidth-pause-or-stop" || e === "fullwidth-quotation" || e === "fullwidth-bracket" || e === "fullwidth-other-punctuation", ld = (e) => e === "cjk-char" || En(e), Tn = (e) => re(e) || Xt(e) || e === "bracket-mark" || e === "group", us = (e) => Tn(e) || e === "code-content", wr = (e) => e === "hyper-mark", fd = {
  [L.HALFWIDTH_PAUSE_OR_STOP]: ",.;:?!",
  [L.FULLWIDTH_PAUSE_OR_STOP]: [
    // normal punctuation marks
    "，。、；：？！",
    // special punctuation marks
    "⁈⁇‼⁉"
  ].join(""),
  [L.HALFWIDTH_QUOTATION]: `'"`,
  [L.FULLWIDTH_QUOTATION]: "‘’“”《》〈〉『』「」【】〖〗",
  [L.HALFWIDTH_BRACKET]: "()[]{}",
  [L.FULLWIDTH_BRACKET]: "（）〔〕［］｛｝",
  [L.HALFWIDTH_OTHER_PUNCTUATION]: [
    // on-keyboard symbols
    '~-+*/\\%=&|"`<>@#$^',
    // symbol of death
    "†‡"
  ].join(""),
  [L.FULLWIDTH_OTHER_PUNCTUATION]: [
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
}, Le = (e) => {
  if (e === "")
    return L.EMPTY;
  if (e.match(/\s/) != null)
    return L.SPACE;
  for (const [r, t] of Object.entries(fd))
    if ((t == null ? void 0 : t.indexOf(e)) >= 0)
      return r;
  return e.match(/[0-9]/) != null || e.match(/[\u0020-\u007F]/) != null || e.match(/[\u00A0-\u00FF]/) != null || e.match(/[\u0100-\u017F]/) != null || e.match(/[\u0180-\u024F]/) != null || e.match(/[\u0370-\u03FF]/) != null ? L.WESTERN_LETTER : e.match(/[\u4E00-\u9FFF]/) != null || e.match(/[\u3400-\u4DBF]/) != null || e.match(/[\ud840-\ud868][\udc00-\udfff]|\ud869[\udc00-\uded6]/) != null || e.match(
    /\ud869[\udf00-\udfff]|[\ud86a-\ud86c][\udc00-\udfff]|\ud86d[\udc00-\udf34]/
  ) != null || e.match(/\ud86d[\udf40-\udfff]|\ud86e[\udc00-\udc1d]/) != null || e.match(/[\uF900-\uFAFF]/) != null || e.match(/[\uFE30-\uFE4F]/) != null || e.match(/[\u2E80-\u2EFF]/) != null || e.match(/[\uE815-\uE864]/) != null || e.match(/[\u{20000}-\u{2A6DF}]/u) != null || e.match(/[\u{2F800}-\u{2FA1F}]/u) != null ? L.CJK_CHAR : e.match(/[\u3000-\u303F]/) != null ? L.FULLWIDTH_OTHER_PUNCTUATION : L.UNKNOWN;
};
var kn = { exports: {} }, Ft, oa;
function ud() {
  return oa || (oa = 1, Ft = {
    aliceblue: [240, 248, 255],
    antiquewhite: [250, 235, 215],
    aqua: [0, 255, 255],
    aquamarine: [127, 255, 212],
    azure: [240, 255, 255],
    beige: [245, 245, 220],
    bisque: [255, 228, 196],
    black: [0, 0, 0],
    blanchedalmond: [255, 235, 205],
    blue: [0, 0, 255],
    blueviolet: [138, 43, 226],
    brown: [165, 42, 42],
    burlywood: [222, 184, 135],
    cadetblue: [95, 158, 160],
    chartreuse: [127, 255, 0],
    chocolate: [210, 105, 30],
    coral: [255, 127, 80],
    cornflowerblue: [100, 149, 237],
    cornsilk: [255, 248, 220],
    crimson: [220, 20, 60],
    cyan: [0, 255, 255],
    darkblue: [0, 0, 139],
    darkcyan: [0, 139, 139],
    darkgoldenrod: [184, 134, 11],
    darkgray: [169, 169, 169],
    darkgreen: [0, 100, 0],
    darkgrey: [169, 169, 169],
    darkkhaki: [189, 183, 107],
    darkmagenta: [139, 0, 139],
    darkolivegreen: [85, 107, 47],
    darkorange: [255, 140, 0],
    darkorchid: [153, 50, 204],
    darkred: [139, 0, 0],
    darksalmon: [233, 150, 122],
    darkseagreen: [143, 188, 143],
    darkslateblue: [72, 61, 139],
    darkslategray: [47, 79, 79],
    darkslategrey: [47, 79, 79],
    darkturquoise: [0, 206, 209],
    darkviolet: [148, 0, 211],
    deeppink: [255, 20, 147],
    deepskyblue: [0, 191, 255],
    dimgray: [105, 105, 105],
    dimgrey: [105, 105, 105],
    dodgerblue: [30, 144, 255],
    firebrick: [178, 34, 34],
    floralwhite: [255, 250, 240],
    forestgreen: [34, 139, 34],
    fuchsia: [255, 0, 255],
    gainsboro: [220, 220, 220],
    ghostwhite: [248, 248, 255],
    gold: [255, 215, 0],
    goldenrod: [218, 165, 32],
    gray: [128, 128, 128],
    green: [0, 128, 0],
    greenyellow: [173, 255, 47],
    grey: [128, 128, 128],
    honeydew: [240, 255, 240],
    hotpink: [255, 105, 180],
    indianred: [205, 92, 92],
    indigo: [75, 0, 130],
    ivory: [255, 255, 240],
    khaki: [240, 230, 140],
    lavender: [230, 230, 250],
    lavenderblush: [255, 240, 245],
    lawngreen: [124, 252, 0],
    lemonchiffon: [255, 250, 205],
    lightblue: [173, 216, 230],
    lightcoral: [240, 128, 128],
    lightcyan: [224, 255, 255],
    lightgoldenrodyellow: [250, 250, 210],
    lightgray: [211, 211, 211],
    lightgreen: [144, 238, 144],
    lightgrey: [211, 211, 211],
    lightpink: [255, 182, 193],
    lightsalmon: [255, 160, 122],
    lightseagreen: [32, 178, 170],
    lightskyblue: [135, 206, 250],
    lightslategray: [119, 136, 153],
    lightslategrey: [119, 136, 153],
    lightsteelblue: [176, 196, 222],
    lightyellow: [255, 255, 224],
    lime: [0, 255, 0],
    limegreen: [50, 205, 50],
    linen: [250, 240, 230],
    magenta: [255, 0, 255],
    maroon: [128, 0, 0],
    mediumaquamarine: [102, 205, 170],
    mediumblue: [0, 0, 205],
    mediumorchid: [186, 85, 211],
    mediumpurple: [147, 112, 219],
    mediumseagreen: [60, 179, 113],
    mediumslateblue: [123, 104, 238],
    mediumspringgreen: [0, 250, 154],
    mediumturquoise: [72, 209, 204],
    mediumvioletred: [199, 21, 133],
    midnightblue: [25, 25, 112],
    mintcream: [245, 255, 250],
    mistyrose: [255, 228, 225],
    moccasin: [255, 228, 181],
    navajowhite: [255, 222, 173],
    navy: [0, 0, 128],
    oldlace: [253, 245, 230],
    olive: [128, 128, 0],
    olivedrab: [107, 142, 35],
    orange: [255, 165, 0],
    orangered: [255, 69, 0],
    orchid: [218, 112, 214],
    palegoldenrod: [238, 232, 170],
    palegreen: [152, 251, 152],
    paleturquoise: [175, 238, 238],
    palevioletred: [219, 112, 147],
    papayawhip: [255, 239, 213],
    peachpuff: [255, 218, 185],
    peru: [205, 133, 63],
    pink: [255, 192, 203],
    plum: [221, 160, 221],
    powderblue: [176, 224, 230],
    purple: [128, 0, 128],
    rebeccapurple: [102, 51, 153],
    red: [255, 0, 0],
    rosybrown: [188, 143, 143],
    royalblue: [65, 105, 225],
    saddlebrown: [139, 69, 19],
    salmon: [250, 128, 114],
    sandybrown: [244, 164, 96],
    seagreen: [46, 139, 87],
    seashell: [255, 245, 238],
    sienna: [160, 82, 45],
    silver: [192, 192, 192],
    skyblue: [135, 206, 235],
    slateblue: [106, 90, 205],
    slategray: [112, 128, 144],
    slategrey: [112, 128, 144],
    snow: [255, 250, 250],
    springgreen: [0, 255, 127],
    steelblue: [70, 130, 180],
    tan: [210, 180, 140],
    teal: [0, 128, 128],
    thistle: [216, 191, 216],
    tomato: [255, 99, 71],
    turquoise: [64, 224, 208],
    violet: [238, 130, 238],
    wheat: [245, 222, 179],
    white: [255, 255, 255],
    whitesmoke: [245, 245, 245],
    yellow: [255, 255, 0],
    yellowgreen: [154, 205, 50]
  }), Ft;
}
var Lt, ca;
function ds() {
  if (ca)
    return Lt;
  ca = 1;
  const e = ud(), r = {};
  for (const n of Object.keys(e))
    r[e[n]] = n;
  const t = {
    rgb: { channels: 3, labels: "rgb" },
    hsl: { channels: 3, labels: "hsl" },
    hsv: { channels: 3, labels: "hsv" },
    hwb: { channels: 3, labels: "hwb" },
    cmyk: { channels: 4, labels: "cmyk" },
    xyz: { channels: 3, labels: "xyz" },
    lab: { channels: 3, labels: "lab" },
    lch: { channels: 3, labels: "lch" },
    hex: { channels: 1, labels: ["hex"] },
    keyword: { channels: 1, labels: ["keyword"] },
    ansi16: { channels: 1, labels: ["ansi16"] },
    ansi256: { channels: 1, labels: ["ansi256"] },
    hcg: { channels: 3, labels: ["h", "c", "g"] },
    apple: { channels: 3, labels: ["r16", "g16", "b16"] },
    gray: { channels: 1, labels: ["gray"] }
  };
  Lt = t;
  for (const n of Object.keys(t)) {
    if (!("channels" in t[n]))
      throw new Error("missing channels property: " + n);
    if (!("labels" in t[n]))
      throw new Error("missing channel labels property: " + n);
    if (t[n].labels.length !== t[n].channels)
      throw new Error("channel and label counts mismatch: " + n);
    const { channels: i, labels: a } = t[n];
    delete t[n].channels, delete t[n].labels, Object.defineProperty(t[n], "channels", { value: i }), Object.defineProperty(t[n], "labels", { value: a });
  }
  t.rgb.hsl = function(n) {
    const i = n[0] / 255, a = n[1] / 255, o = n[2] / 255, c = Math.min(i, a, o), l = Math.max(i, a, o), u = l - c;
    let f, d;
    l === c ? f = 0 : i === l ? f = (a - o) / u : a === l ? f = 2 + (o - i) / u : o === l && (f = 4 + (i - a) / u), f = Math.min(f * 60, 360), f < 0 && (f += 360);
    const h = (c + l) / 2;
    return l === c ? d = 0 : h <= 0.5 ? d = u / (l + c) : d = u / (2 - l - c), [f, d * 100, h * 100];
  }, t.rgb.hsv = function(n) {
    let i, a, o, c, l;
    const u = n[0] / 255, f = n[1] / 255, d = n[2] / 255, h = Math.max(u, f, d), m = h - Math.min(u, f, d), y = function(p) {
      return (h - p) / 6 / m + 1 / 2;
    };
    return m === 0 ? (c = 0, l = 0) : (l = m / h, i = y(u), a = y(f), o = y(d), u === h ? c = o - a : f === h ? c = 1 / 3 + i - o : d === h && (c = 2 / 3 + a - i), c < 0 ? c += 1 : c > 1 && (c -= 1)), [
      c * 360,
      l * 100,
      h * 100
    ];
  }, t.rgb.hwb = function(n) {
    const i = n[0], a = n[1];
    let o = n[2];
    const c = t.rgb.hsl(n)[0], l = 1 / 255 * Math.min(i, Math.min(a, o));
    return o = 1 - 1 / 255 * Math.max(i, Math.max(a, o)), [c, l * 100, o * 100];
  }, t.rgb.cmyk = function(n) {
    const i = n[0] / 255, a = n[1] / 255, o = n[2] / 255, c = Math.min(1 - i, 1 - a, 1 - o), l = (1 - i - c) / (1 - c) || 0, u = (1 - a - c) / (1 - c) || 0, f = (1 - o - c) / (1 - c) || 0;
    return [l * 100, u * 100, f * 100, c * 100];
  };
  function s(n, i) {
    return (n[0] - i[0]) ** 2 + (n[1] - i[1]) ** 2 + (n[2] - i[2]) ** 2;
  }
  return t.rgb.keyword = function(n) {
    const i = r[n];
    if (i)
      return i;
    let a = 1 / 0, o;
    for (const c of Object.keys(e)) {
      const l = e[c], u = s(n, l);
      u < a && (a = u, o = c);
    }
    return o;
  }, t.keyword.rgb = function(n) {
    return e[n];
  }, t.rgb.xyz = function(n) {
    let i = n[0] / 255, a = n[1] / 255, o = n[2] / 255;
    i = i > 0.04045 ? ((i + 0.055) / 1.055) ** 2.4 : i / 12.92, a = a > 0.04045 ? ((a + 0.055) / 1.055) ** 2.4 : a / 12.92, o = o > 0.04045 ? ((o + 0.055) / 1.055) ** 2.4 : o / 12.92;
    const c = i * 0.4124 + a * 0.3576 + o * 0.1805, l = i * 0.2126 + a * 0.7152 + o * 0.0722, u = i * 0.0193 + a * 0.1192 + o * 0.9505;
    return [c * 100, l * 100, u * 100];
  }, t.rgb.lab = function(n) {
    const i = t.rgb.xyz(n);
    let a = i[0], o = i[1], c = i[2];
    a /= 95.047, o /= 100, c /= 108.883, a = a > 8856e-6 ? a ** (1 / 3) : 7.787 * a + 16 / 116, o = o > 8856e-6 ? o ** (1 / 3) : 7.787 * o + 16 / 116, c = c > 8856e-6 ? c ** (1 / 3) : 7.787 * c + 16 / 116;
    const l = 116 * o - 16, u = 500 * (a - o), f = 200 * (o - c);
    return [l, u, f];
  }, t.hsl.rgb = function(n) {
    const i = n[0] / 360, a = n[1] / 100, o = n[2] / 100;
    let c, l, u;
    if (a === 0)
      return u = o * 255, [u, u, u];
    o < 0.5 ? c = o * (1 + a) : c = o + a - o * a;
    const f = 2 * o - c, d = [0, 0, 0];
    for (let h = 0; h < 3; h++)
      l = i + 1 / 3 * -(h - 1), l < 0 && l++, l > 1 && l--, 6 * l < 1 ? u = f + (c - f) * 6 * l : 2 * l < 1 ? u = c : 3 * l < 2 ? u = f + (c - f) * (2 / 3 - l) * 6 : u = f, d[h] = u * 255;
    return d;
  }, t.hsl.hsv = function(n) {
    const i = n[0];
    let a = n[1] / 100, o = n[2] / 100, c = a;
    const l = Math.max(o, 0.01);
    o *= 2, a *= o <= 1 ? o : 2 - o, c *= l <= 1 ? l : 2 - l;
    const u = (o + a) / 2, f = o === 0 ? 2 * c / (l + c) : 2 * a / (o + a);
    return [i, f * 100, u * 100];
  }, t.hsv.rgb = function(n) {
    const i = n[0] / 60, a = n[1] / 100;
    let o = n[2] / 100;
    const c = Math.floor(i) % 6, l = i - Math.floor(i), u = 255 * o * (1 - a), f = 255 * o * (1 - a * l), d = 255 * o * (1 - a * (1 - l));
    switch (o *= 255, c) {
      case 0:
        return [o, d, u];
      case 1:
        return [f, o, u];
      case 2:
        return [u, o, d];
      case 3:
        return [u, f, o];
      case 4:
        return [d, u, o];
      case 5:
        return [o, u, f];
    }
  }, t.hsv.hsl = function(n) {
    const i = n[0], a = n[1] / 100, o = n[2] / 100, c = Math.max(o, 0.01);
    let l, u;
    u = (2 - a) * o;
    const f = (2 - a) * c;
    return l = a * c, l /= f <= 1 ? f : 2 - f, l = l || 0, u /= 2, [i, l * 100, u * 100];
  }, t.hwb.rgb = function(n) {
    const i = n[0] / 360;
    let a = n[1] / 100, o = n[2] / 100;
    const c = a + o;
    let l;
    c > 1 && (a /= c, o /= c);
    const u = Math.floor(6 * i), f = 1 - o;
    l = 6 * i - u, u & 1 && (l = 1 - l);
    const d = a + l * (f - a);
    let h, m, y;
    switch (u) {
      default:
      case 6:
      case 0:
        h = f, m = d, y = a;
        break;
      case 1:
        h = d, m = f, y = a;
        break;
      case 2:
        h = a, m = f, y = d;
        break;
      case 3:
        h = a, m = d, y = f;
        break;
      case 4:
        h = d, m = a, y = f;
        break;
      case 5:
        h = f, m = a, y = d;
        break;
    }
    return [h * 255, m * 255, y * 255];
  }, t.cmyk.rgb = function(n) {
    const i = n[0] / 100, a = n[1] / 100, o = n[2] / 100, c = n[3] / 100, l = 1 - Math.min(1, i * (1 - c) + c), u = 1 - Math.min(1, a * (1 - c) + c), f = 1 - Math.min(1, o * (1 - c) + c);
    return [l * 255, u * 255, f * 255];
  }, t.xyz.rgb = function(n) {
    const i = n[0] / 100, a = n[1] / 100, o = n[2] / 100;
    let c, l, u;
    return c = i * 3.2406 + a * -1.5372 + o * -0.4986, l = i * -0.9689 + a * 1.8758 + o * 0.0415, u = i * 0.0557 + a * -0.204 + o * 1.057, c = c > 31308e-7 ? 1.055 * c ** (1 / 2.4) - 0.055 : c * 12.92, l = l > 31308e-7 ? 1.055 * l ** (1 / 2.4) - 0.055 : l * 12.92, u = u > 31308e-7 ? 1.055 * u ** (1 / 2.4) - 0.055 : u * 12.92, c = Math.min(Math.max(0, c), 1), l = Math.min(Math.max(0, l), 1), u = Math.min(Math.max(0, u), 1), [c * 255, l * 255, u * 255];
  }, t.xyz.lab = function(n) {
    let i = n[0], a = n[1], o = n[2];
    i /= 95.047, a /= 100, o /= 108.883, i = i > 8856e-6 ? i ** (1 / 3) : 7.787 * i + 16 / 116, a = a > 8856e-6 ? a ** (1 / 3) : 7.787 * a + 16 / 116, o = o > 8856e-6 ? o ** (1 / 3) : 7.787 * o + 16 / 116;
    const c = 116 * a - 16, l = 500 * (i - a), u = 200 * (a - o);
    return [c, l, u];
  }, t.lab.xyz = function(n) {
    const i = n[0], a = n[1], o = n[2];
    let c, l, u;
    l = (i + 16) / 116, c = a / 500 + l, u = l - o / 200;
    const f = l ** 3, d = c ** 3, h = u ** 3;
    return l = f > 8856e-6 ? f : (l - 16 / 116) / 7.787, c = d > 8856e-6 ? d : (c - 16 / 116) / 7.787, u = h > 8856e-6 ? h : (u - 16 / 116) / 7.787, c *= 95.047, l *= 100, u *= 108.883, [c, l, u];
  }, t.lab.lch = function(n) {
    const i = n[0], a = n[1], o = n[2];
    let c;
    c = Math.atan2(o, a) * 360 / 2 / Math.PI, c < 0 && (c += 360);
    const u = Math.sqrt(a * a + o * o);
    return [i, u, c];
  }, t.lch.lab = function(n) {
    const i = n[0], a = n[1], c = n[2] / 360 * 2 * Math.PI, l = a * Math.cos(c), u = a * Math.sin(c);
    return [i, l, u];
  }, t.rgb.ansi16 = function(n, i = null) {
    const [a, o, c] = n;
    let l = i === null ? t.rgb.hsv(n)[2] : i;
    if (l = Math.round(l / 50), l === 0)
      return 30;
    let u = 30 + (Math.round(c / 255) << 2 | Math.round(o / 255) << 1 | Math.round(a / 255));
    return l === 2 && (u += 60), u;
  }, t.hsv.ansi16 = function(n) {
    return t.rgb.ansi16(t.hsv.rgb(n), n[2]);
  }, t.rgb.ansi256 = function(n) {
    const i = n[0], a = n[1], o = n[2];
    return i === a && a === o ? i < 8 ? 16 : i > 248 ? 231 : Math.round((i - 8) / 247 * 24) + 232 : 16 + 36 * Math.round(i / 255 * 5) + 6 * Math.round(a / 255 * 5) + Math.round(o / 255 * 5);
  }, t.ansi16.rgb = function(n) {
    let i = n % 10;
    if (i === 0 || i === 7)
      return n > 50 && (i += 3.5), i = i / 10.5 * 255, [i, i, i];
    const a = (~~(n > 50) + 1) * 0.5, o = (i & 1) * a * 255, c = (i >> 1 & 1) * a * 255, l = (i >> 2 & 1) * a * 255;
    return [o, c, l];
  }, t.ansi256.rgb = function(n) {
    if (n >= 232) {
      const l = (n - 232) * 10 + 8;
      return [l, l, l];
    }
    n -= 16;
    let i;
    const a = Math.floor(n / 36) / 5 * 255, o = Math.floor((i = n % 36) / 6) / 5 * 255, c = i % 6 / 5 * 255;
    return [a, o, c];
  }, t.rgb.hex = function(n) {
    const a = (((Math.round(n[0]) & 255) << 16) + ((Math.round(n[1]) & 255) << 8) + (Math.round(n[2]) & 255)).toString(16).toUpperCase();
    return "000000".substring(a.length) + a;
  }, t.hex.rgb = function(n) {
    const i = n.toString(16).match(/[a-f0-9]{6}|[a-f0-9]{3}/i);
    if (!i)
      return [0, 0, 0];
    let a = i[0];
    i[0].length === 3 && (a = a.split("").map((f) => f + f).join(""));
    const o = parseInt(a, 16), c = o >> 16 & 255, l = o >> 8 & 255, u = o & 255;
    return [c, l, u];
  }, t.rgb.hcg = function(n) {
    const i = n[0] / 255, a = n[1] / 255, o = n[2] / 255, c = Math.max(Math.max(i, a), o), l = Math.min(Math.min(i, a), o), u = c - l;
    let f, d;
    return u < 1 ? f = l / (1 - u) : f = 0, u <= 0 ? d = 0 : c === i ? d = (a - o) / u % 6 : c === a ? d = 2 + (o - i) / u : d = 4 + (i - a) / u, d /= 6, d %= 1, [d * 360, u * 100, f * 100];
  }, t.hsl.hcg = function(n) {
    const i = n[1] / 100, a = n[2] / 100, o = a < 0.5 ? 2 * i * a : 2 * i * (1 - a);
    let c = 0;
    return o < 1 && (c = (a - 0.5 * o) / (1 - o)), [n[0], o * 100, c * 100];
  }, t.hsv.hcg = function(n) {
    const i = n[1] / 100, a = n[2] / 100, o = i * a;
    let c = 0;
    return o < 1 && (c = (a - o) / (1 - o)), [n[0], o * 100, c * 100];
  }, t.hcg.rgb = function(n) {
    const i = n[0] / 360, a = n[1] / 100, o = n[2] / 100;
    if (a === 0)
      return [o * 255, o * 255, o * 255];
    const c = [0, 0, 0], l = i % 1 * 6, u = l % 1, f = 1 - u;
    let d = 0;
    switch (Math.floor(l)) {
      case 0:
        c[0] = 1, c[1] = u, c[2] = 0;
        break;
      case 1:
        c[0] = f, c[1] = 1, c[2] = 0;
        break;
      case 2:
        c[0] = 0, c[1] = 1, c[2] = u;
        break;
      case 3:
        c[0] = 0, c[1] = f, c[2] = 1;
        break;
      case 4:
        c[0] = u, c[1] = 0, c[2] = 1;
        break;
      default:
        c[0] = 1, c[1] = 0, c[2] = f;
    }
    return d = (1 - a) * o, [
      (a * c[0] + d) * 255,
      (a * c[1] + d) * 255,
      (a * c[2] + d) * 255
    ];
  }, t.hcg.hsv = function(n) {
    const i = n[1] / 100, a = n[2] / 100, o = i + a * (1 - i);
    let c = 0;
    return o > 0 && (c = i / o), [n[0], c * 100, o * 100];
  }, t.hcg.hsl = function(n) {
    const i = n[1] / 100, o = n[2] / 100 * (1 - i) + 0.5 * i;
    let c = 0;
    return o > 0 && o < 0.5 ? c = i / (2 * o) : o >= 0.5 && o < 1 && (c = i / (2 * (1 - o))), [n[0], c * 100, o * 100];
  }, t.hcg.hwb = function(n) {
    const i = n[1] / 100, a = n[2] / 100, o = i + a * (1 - i);
    return [n[0], (o - i) * 100, (1 - o) * 100];
  }, t.hwb.hcg = function(n) {
    const i = n[1] / 100, o = 1 - n[2] / 100, c = o - i;
    let l = 0;
    return c < 1 && (l = (o - c) / (1 - c)), [n[0], c * 100, l * 100];
  }, t.apple.rgb = function(n) {
    return [n[0] / 65535 * 255, n[1] / 65535 * 255, n[2] / 65535 * 255];
  }, t.rgb.apple = function(n) {
    return [n[0] / 255 * 65535, n[1] / 255 * 65535, n[2] / 255 * 65535];
  }, t.gray.rgb = function(n) {
    return [n[0] / 100 * 255, n[0] / 100 * 255, n[0] / 100 * 255];
  }, t.gray.hsl = function(n) {
    return [0, 0, n[0]];
  }, t.gray.hsv = t.gray.hsl, t.gray.hwb = function(n) {
    return [0, 100, n[0]];
  }, t.gray.cmyk = function(n) {
    return [0, 0, 0, n[0]];
  }, t.gray.lab = function(n) {
    return [n[0], 0, 0];
  }, t.gray.hex = function(n) {
    const i = Math.round(n[0] / 100 * 255) & 255, o = ((i << 16) + (i << 8) + i).toString(16).toUpperCase();
    return "000000".substring(o.length) + o;
  }, t.rgb.gray = function(n) {
    return [(n[0] + n[1] + n[2]) / 3 / 255 * 100];
  }, Lt;
}
var qt, la;
function dd() {
  if (la)
    return qt;
  la = 1;
  const e = ds();
  function r() {
    const i = {}, a = Object.keys(e);
    for (let o = a.length, c = 0; c < o; c++)
      i[a[c]] = {
        // http://jsperf.com/1-vs-infinity
        // micro-opt, but this is simple.
        distance: -1,
        parent: null
      };
    return i;
  }
  function t(i) {
    const a = r(), o = [i];
    for (a[i].distance = 0; o.length; ) {
      const c = o.pop(), l = Object.keys(e[c]);
      for (let u = l.length, f = 0; f < u; f++) {
        const d = l[f], h = a[d];
        h.distance === -1 && (h.distance = a[c].distance + 1, h.parent = c, o.unshift(d));
      }
    }
    return a;
  }
  function s(i, a) {
    return function(o) {
      return a(i(o));
    };
  }
  function n(i, a) {
    const o = [a[i].parent, i];
    let c = e[a[i].parent][i], l = a[i].parent;
    for (; a[l].parent; )
      o.unshift(a[l].parent), c = s(e[a[l].parent][l], c), l = a[l].parent;
    return c.conversion = o, c;
  }
  return qt = function(i) {
    const a = t(i), o = {}, c = Object.keys(a);
    for (let l = c.length, u = 0; u < l; u++) {
      const f = c[u];
      a[f].parent !== null && (o[f] = n(f, a));
    }
    return o;
  }, qt;
}
var Ht, fa;
function hd() {
  if (fa)
    return Ht;
  fa = 1;
  const e = ds(), r = dd(), t = {}, s = Object.keys(e);
  function n(a) {
    const o = function(...c) {
      const l = c[0];
      return l == null ? l : (l.length > 1 && (c = l), a(c));
    };
    return "conversion" in a && (o.conversion = a.conversion), o;
  }
  function i(a) {
    const o = function(...c) {
      const l = c[0];
      if (l == null)
        return l;
      l.length > 1 && (c = l);
      const u = a(c);
      if (typeof u == "object")
        for (let f = u.length, d = 0; d < f; d++)
          u[d] = Math.round(u[d]);
      return u;
    };
    return "conversion" in a && (o.conversion = a.conversion), o;
  }
  return s.forEach((a) => {
    t[a] = {}, Object.defineProperty(t[a], "channels", { value: e[a].channels }), Object.defineProperty(t[a], "labels", { value: e[a].labels });
    const o = r(a);
    Object.keys(o).forEach((l) => {
      const u = o[l];
      t[a][l] = i(u), t[a][l].raw = n(u);
    });
  }), Ht = t, Ht;
}
kn.exports;
(function(e) {
  const r = (u, f) => (...d) => `\x1B[${u(...d) + f}m`, t = (u, f) => (...d) => {
    const h = u(...d);
    return `\x1B[${38 + f};5;${h}m`;
  }, s = (u, f) => (...d) => {
    const h = u(...d);
    return `\x1B[${38 + f};2;${h[0]};${h[1]};${h[2]}m`;
  }, n = (u) => u, i = (u, f, d) => [u, f, d], a = (u, f, d) => {
    Object.defineProperty(u, f, {
      get: () => {
        const h = d();
        return Object.defineProperty(u, f, {
          value: h,
          enumerable: !0,
          configurable: !0
        }), h;
      },
      enumerable: !0,
      configurable: !0
    });
  };
  let o;
  const c = (u, f, d, h) => {
    o === void 0 && (o = hd());
    const m = h ? 10 : 0, y = {};
    for (const [p, v] of Object.entries(o)) {
      const g = p === "ansi16" ? "ansi" : p;
      p === f ? y[g] = u(d, m) : typeof v == "object" && (y[g] = u(v[f], m));
    }
    return y;
  };
  function l() {
    const u = /* @__PURE__ */ new Map(), f = {
      modifier: {
        reset: [0, 0],
        // 21 isn't widely supported and 22 does the same thing
        bold: [1, 22],
        dim: [2, 22],
        italic: [3, 23],
        underline: [4, 24],
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
        bgRedBright: [101, 49],
        bgGreenBright: [102, 49],
        bgYellowBright: [103, 49],
        bgBlueBright: [104, 49],
        bgMagentaBright: [105, 49],
        bgCyanBright: [106, 49],
        bgWhiteBright: [107, 49]
      }
    };
    f.color.gray = f.color.blackBright, f.bgColor.bgGray = f.bgColor.bgBlackBright, f.color.grey = f.color.blackBright, f.bgColor.bgGrey = f.bgColor.bgBlackBright;
    for (const [d, h] of Object.entries(f)) {
      for (const [m, y] of Object.entries(h))
        f[m] = {
          open: `\x1B[${y[0]}m`,
          close: `\x1B[${y[1]}m`
        }, h[m] = f[m], u.set(y[0], y[1]);
      Object.defineProperty(f, d, {
        value: h,
        enumerable: !1
      });
    }
    return Object.defineProperty(f, "codes", {
      value: u,
      enumerable: !1
    }), f.color.close = "\x1B[39m", f.bgColor.close = "\x1B[49m", a(f.color, "ansi", () => c(r, "ansi16", n, !1)), a(f.color, "ansi256", () => c(t, "ansi256", n, !1)), a(f.color, "ansi16m", () => c(s, "rgb", i, !1)), a(f.bgColor, "ansi", () => c(r, "ansi16", n, !0)), a(f.bgColor, "ansi256", () => c(t, "ansi256", n, !0)), a(f.bgColor, "ansi16m", () => c(s, "rgb", i, !0)), f;
  }
  Object.defineProperty(e, "exports", {
    enumerable: !0,
    get: l
  });
})(kn);
var pd = kn.exports, vd = {
  stdout: !1,
  stderr: !1
};
const gd = (e, r, t) => {
  let s = e.indexOf(r);
  if (s === -1)
    return e;
  const n = r.length;
  let i = 0, a = "";
  do
    a += e.substr(i, s - i) + r + t, i = s + n, s = e.indexOf(r, i);
  while (s !== -1);
  return a += e.substr(i), a;
}, md = (e, r, t, s) => {
  let n = 0, i = "";
  do {
    const a = e[s - 1] === "\r";
    i += e.substr(n, (a ? s - 1 : s) - n) + r + (a ? `\r
` : `
`) + t, n = s + 1, s = e.indexOf(`
`, n);
  } while (s !== -1);
  return i += e.substr(n), i;
};
var yd = {
  stringReplaceAll: gd,
  stringEncaseCRLFWithFirstIndex: md
}, Mt, ua;
function bd() {
  if (ua)
    return Mt;
  ua = 1;
  const e = /(?:\\(u(?:[a-f\d]{4}|\{[a-f\d]{1,6}\})|x[a-f\d]{2}|.))|(?:\{(~)?(\w+(?:\([^)]*\))?(?:\.\w+(?:\([^)]*\))?)*)(?:[ \t]|(?=\r?\n)))|(\})|((?:.|[\r\n\f])+?)/gi, r = /(?:^|\.)(\w+)(?:\(([^)]*)\))?/g, t = /^(['"])((?:\\.|(?!\1)[^\\])*)\1$/, s = /\\(u(?:[a-f\d]{4}|{[a-f\d]{1,6}})|x[a-f\d]{2}|.)|([^\\])/gi, n = /* @__PURE__ */ new Map([
    ["n", `
`],
    ["r", "\r"],
    ["t", "	"],
    ["b", "\b"],
    ["f", "\f"],
    ["v", "\v"],
    ["0", "\0"],
    ["\\", "\\"],
    ["e", "\x1B"],
    ["a", "\x07"]
  ]);
  function i(l) {
    const u = l[0] === "u", f = l[1] === "{";
    return u && !f && l.length === 5 || l[0] === "x" && l.length === 3 ? String.fromCharCode(parseInt(l.slice(1), 16)) : u && f ? String.fromCodePoint(parseInt(l.slice(2, -1), 16)) : n.get(l) || l;
  }
  function a(l, u) {
    const f = [], d = u.trim().split(/\s*,\s*/g);
    let h;
    for (const m of d) {
      const y = Number(m);
      if (!Number.isNaN(y))
        f.push(y);
      else if (h = m.match(t))
        f.push(h[2].replace(s, (p, v, g) => v ? i(v) : g));
      else
        throw new Error(`Invalid Chalk template style argument: ${m} (in style '${l}')`);
    }
    return f;
  }
  function o(l) {
    r.lastIndex = 0;
    const u = [];
    let f;
    for (; (f = r.exec(l)) !== null; ) {
      const d = f[1];
      if (f[2]) {
        const h = a(d, f[2]);
        u.push([d].concat(h));
      } else
        u.push([d]);
    }
    return u;
  }
  function c(l, u) {
    const f = {};
    for (const h of u)
      for (const m of h.styles)
        f[m[0]] = h.inverse ? null : m.slice(1);
    let d = l;
    for (const [h, m] of Object.entries(f))
      if (Array.isArray(m)) {
        if (!(h in d))
          throw new Error(`Unknown Chalk style: ${h}`);
        d = m.length > 0 ? d[h](...m) : d[h];
      }
    return d;
  }
  return Mt = (l, u) => {
    const f = [], d = [];
    let h = [];
    if (u.replace(e, (m, y, p, v, g, b) => {
      if (y)
        h.push(i(y));
      else if (v) {
        const E = h.join("");
        h = [], d.push(f.length === 0 ? E : c(l, f)(E)), f.push({ inverse: p, styles: o(v) });
      } else if (g) {
        if (f.length === 0)
          throw new Error("Found extraneous } in Chalk template literal");
        d.push(c(l, f)(h.join(""))), h = [], f.pop();
      } else
        h.push(b);
    }), d.push(h.join("")), f.length > 0) {
      const m = `Chalk template literal is missing ${f.length} closing bracket${f.length === 1 ? "" : "s"} (\`}\`)`;
      throw new Error(m);
    }
    return d.join("");
  }, Mt;
}
const Ye = pd, { stdout: Zt, stderr: en } = vd, {
  stringReplaceAll: Ad,
  stringEncaseCRLFWithFirstIndex: wd
} = yd, { isArray: pr } = Array, hs = [
  "ansi",
  "ansi",
  "ansi256",
  "ansi16m"
], Me = /* @__PURE__ */ Object.create(null), Ed = (e, r = {}) => {
  if (r.level && !(Number.isInteger(r.level) && r.level >= 0 && r.level <= 3))
    throw new Error("The `level` option should be an integer from 0 to 3");
  const t = Zt ? Zt.level : 0;
  e.level = r.level === void 0 ? t : r.level;
};
class Td {
  constructor(r) {
    return ps(r);
  }
}
const ps = (e) => {
  const r = {};
  return Ed(r, e), r.template = (...t) => gs(r.template, ...t), Object.setPrototypeOf(r, Er.prototype), Object.setPrototypeOf(r.template, r), r.template.constructor = () => {
    throw new Error("`chalk.constructor()` is deprecated. Use `new chalk.Instance()` instead.");
  }, r.template.Instance = Td, r.template;
};
function Er(e) {
  return ps(e);
}
for (const [e, r] of Object.entries(Ye))
  Me[e] = {
    get() {
      const t = Tr(this, xn(r.open, r.close, this._styler), this._isEmpty);
      return Object.defineProperty(this, e, { value: t }), t;
    }
  };
Me.visible = {
  get() {
    const e = Tr(this, this._styler, !0);
    return Object.defineProperty(this, "visible", { value: e }), e;
  }
};
const vs = ["rgb", "hex", "keyword", "hsl", "hsv", "hwb", "ansi", "ansi256"];
for (const e of vs)
  Me[e] = {
    get() {
      const { level: r } = this;
      return function(...t) {
        const s = xn(Ye.color[hs[r]][e](...t), Ye.color.close, this._styler);
        return Tr(this, s, this._isEmpty);
      };
    }
  };
for (const e of vs) {
  const r = "bg" + e[0].toUpperCase() + e.slice(1);
  Me[r] = {
    get() {
      const { level: t } = this;
      return function(...s) {
        const n = xn(Ye.bgColor[hs[t]][e](...s), Ye.bgColor.close, this._styler);
        return Tr(this, n, this._isEmpty);
      };
    }
  };
}
const kd = Object.defineProperties(() => {
}, {
  ...Me,
  level: {
    enumerable: !0,
    get() {
      return this._generator.level;
    },
    set(e) {
      this._generator.level = e;
    }
  }
}), xn = (e, r, t) => {
  let s, n;
  return t === void 0 ? (s = e, n = r) : (s = t.openAll + e, n = r + t.closeAll), {
    open: e,
    close: r,
    openAll: s,
    closeAll: n,
    parent: t
  };
}, Tr = (e, r, t) => {
  const s = (...n) => pr(n[0]) && pr(n[0].raw) ? da(s, gs(s, ...n)) : da(s, n.length === 1 ? "" + n[0] : n.join(" "));
  return Object.setPrototypeOf(s, kd), s._generator = e, s._styler = r, s._isEmpty = t, s;
}, da = (e, r) => {
  if (e.level <= 0 || !r)
    return e._isEmpty ? "" : r;
  let t = e._styler;
  if (t === void 0)
    return r;
  const { openAll: s, closeAll: n } = t;
  if (r.indexOf("\x1B") !== -1)
    for (; t !== void 0; )
      r = Ad(r, t.close, t.open), t = t.parent;
  const i = r.indexOf(`
`);
  return i !== -1 && (r = wd(r, n, s, i)), s + r + n;
};
let $t;
const gs = (e, ...r) => {
  const [t] = r;
  if (!pr(t) || !pr(t.raw))
    return r.join(" ");
  const s = r.slice(1), n = [t.raw[0]];
  for (let i = 1; i < t.length; i++)
    n.push(
      String(s[i - 1]).replace(/[{}\\]/g, "\\$&"),
      String(t.raw[i])
    );
  return $t === void 0 && ($t = bd()), $t(e, n.join(""));
};
Object.defineProperties(Er.prototype, Me);
const kr = Er();
kr.supportsColor = Zt;
kr.stderr = Er({ level: en ? en.level : 0 });
kr.stderr.supportsColor = en;
var xd = kr;
const Ge = /* @__PURE__ */ gr(xd);
var Oa, Ra;
const ke = {
  stdout: (Oa = globalThis == null ? void 0 : globalThis.process) == null ? void 0 : Oa.stdout,
  stderr: (Ra = globalThis == null ? void 0 : globalThis.process) == null ? void 0 : Ra.stderr,
  defaultLogger: console
}, Sd = (e, r) => {
  const t = e.split(`
`), s = t.map((i) => i.length), n = {
    offset: r,
    row: 0,
    column: 0,
    line: ""
  };
  for (; n.offset >= 0 && t.length; )
    n.row++, n.column = n.offset, n.line = t.shift() || "", n.offset -= (s.shift() || 0) + 1;
  return n;
};
var $ = /* @__PURE__ */ ((e) => (e.VALUE = "value", e.START_VALUE = "startValue", e.END_VALUE = "endValue", e.SPACE_AFTER = "spaceAfter", e.INNER_SPACE_BEFORE = "innerSpaceBefore", e))($ || {});
const ha = "“”‘’", Cd = (e, r) => {
  const t = e.substring(0, r);
  let s = 0, n = 0;
  for (let i = 0; i < t.length; i++) {
    const a = Le(t[i]);
    a === L.CJK_CHAR || En(a) && ha.indexOf(t[i]) === -1 ? s++ : (a === L.WESTERN_LETTER || be(a) && ha.indexOf(t[i]) !== -1 || a === L.SPACE) && n++;
  }
  return " ".repeat(n) + "　".repeat(s) + `${Ge.red("^")}`;
}, Od = (e = "", r, t, s = ke.defaultLogger) => {
  t.forEach(({ index: n, length: i, target: a, message: o }) => {
    const c = a === "spaceAfter" || a === "endValue" ? n + i : n, { row: l, column: u, line: f } = Sd(r, c), d = `${Ge.blue.bgWhite(e)}${e ? ":" : ""}`, h = `${Ge.yellow(l)}:${Ge.yellow(u)}`, m = `${d}${h} - ${o}`, y = 20, p = u - y < 0 ? 0 : u - y, v = u + i + y > f.length - 1 ? f.length : u + i + y, g = f.substring(p, v).replace(/\n/g, "\\n"), b = Cd(g, u - p);
    s.error(`${m}

${g}
${b}
`);
  });
}, ip = (e, r = ke.defaultLogger) => {
  let t = 0;
  const s = [];
  if (e.filter(({ file: n, disabled: i }) => i ? (n ? r.log(`${Ge.blue.bgWhite(n)}: disabled`) : r.log("disabled"), !1) : !0).forEach(({ file: n, origin: i, validations: a }) => {
    Od(n, i, a, r), t += a.length, n && a.length && s.push(n);
  }), t) {
    const n = [];
    return n.push("Invalid files:"), n.push("- " + s.join(`
- `) + `
`), n.push(`Found ${t} ${t > 1 ? "errors" : "error"}.`), r.error(n.join(`
`)), 1;
  } else
    r.log("No error found.");
}, pa = "括号未闭合", Rd = "括号未匹配", va = "引号未闭合", Id = "引号未匹配", Pd = (e, r, t, s) => {
  if (Ke(s, e), ls(t)) {
    sa.left.indexOf(r) >= 0 ? (Fd(s, e, r), ya(s, e, r, W.LEFT)) : sa.right.indexOf(r) >= 0 && (!s.lastMark || !s.lastMark.startValue ? (ba(s, e, r), Be(s, e, Rd)) : (ya(s, e, r, W.RIGHT), Ld(s, e, r)));
    return;
  }
  if (cs(t)) {
    Nt.neutral.indexOf(r) >= 0 ? s.lastGroup && r === s.lastGroup.startValue ? wa(s, e, r) : Aa(s, e, r) : Nt.left.indexOf(r) >= 0 ? Aa(s, e, r) : Nt.right.indexOf(r) >= 0 && (!s.lastGroup || !s.lastGroup.startValue ? (ba(s, e, r), Be(s, e, Id)) : wa(s, e, r));
    return;
  }
  qd(s, e, r, t);
}, ga = (e, r, t, s) => {
  s.lastToken ? s.lastToken.type !== t ? (Ke(s, e), Ea(s, e, r, t)) : ms(s, r) : Ea(s, e, r, t);
}, _d = (e, r) => {
  const t = [];
  return Object.assign(t, {
    type: J.GROUP,
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
}, Ke = (e, r) => {
  e.lastToken && (e.lastToken.length = r - e.lastToken.index, e.lastGroup && e.lastGroup.push(e.lastToken), e.lastToken = void 0);
}, Xe = (e, r) => {
  e.lastGroup && e.lastGroup.push(r), e.lastToken = void 0;
}, Bd = (e) => {
  switch (e) {
    case ae.HYPER:
      return j.HYPER_MARK;
    case ae.BRACKETS:
      return j.BRACKET_MARK;
    case ae.RAW:
      return j.INDETERMINATED;
  }
}, ma = (e, r, t, s, n) => {
  const i = {
    type: Bd(t.type),
    index: r,
    length: s.length,
    value: s,
    spaceAfter: "",
    // to be finalized
    mark: t,
    markSide: n
  };
  Xe(e, i);
}, Nd = (e, r, t) => {
  const s = {
    type: Vd(t),
    index: r,
    length: t.length,
    value: t,
    spaceAfter: ""
    // to be finalized
  };
  Xe(e, s);
}, Fd = (e, r, t, s = ae.BRACKETS) => {
  e.lastMark && (e.markStack.push(e.lastMark), e.lastMark = void 0);
  const n = {
    type: s,
    startIndex: r,
    startValue: t,
    endIndex: -1,
    // to be finalized
    endValue: ""
    // to be finalized
  };
  e.marks.push(n), e.lastMark = n;
}, ya = (e, r, t, s) => {
  const n = {
    type: j.BRACKET_MARK,
    index: r,
    length: 1,
    value: t,
    spaceAfter: "",
    // to be finalized
    mark: e.lastMark,
    markSide: s
  };
  Xe(e, n);
}, Ld = (e, r, t) => {
  e.lastMark && (e.lastMark.endIndex = r, e.lastMark.endValue = t, e.markStack.length > 0 ? e.lastMark = e.markStack.pop() : e.lastMark = void 0);
}, qd = (e, r, t, s) => {
  Xe(e, {
    type: s,
    index: r,
    length: 1,
    value: t,
    spaceAfter: ""
    // to be finalized
  });
}, ba = (e, r, t) => {
  const s = {
    type: j.UNMATCHED,
    index: r,
    length: 1,
    value: t,
    spaceAfter: ""
  };
  Xe(e, s);
}, Aa = (e, r, t) => {
  e.lastGroup && e.groupStack.push(e.lastGroup);
  const s = [];
  Object.assign(s, {
    type: J.GROUP,
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
  }), e.groupStack[e.groupStack.length - 1].push(s), e.lastGroup = s, e.groups.push(s);
}, wa = (e, r, t) => {
  e.lastGroup && (e.lastGroup.endIndex = r, e.lastGroup.endValue = t), e.groupStack.length > 0 ? e.lastGroup = e.groupStack.pop() : e.lastGroup = void 0;
}, Ea = (e, r, t, s) => {
  e.lastToken = {
    type: s,
    index: r,
    length: 1,
    // to be finalized
    value: t,
    // to be finalized
    spaceAfter: ""
    // to be finalized
  };
}, ms = (e, r) => {
  e.lastToken && (e.lastToken.value += r, e.lastToken.length++);
}, Hd = (e, r) => {
  if (Le(e[r]) !== L.SPACE)
    return 0;
  for (let t = r + 1; t < e.length; t++) {
    const s = e[t];
    if (Le(s) !== L.SPACE)
      return t - r;
  }
  return e.length - r;
}, Md = (e) => {
  if (e.lastGroup)
    return e.lastGroup[e.lastGroup.length - 1];
}, $d = (e) => {
  const r = {};
  return e.forEach((t) => {
    r[t.startIndex] = t, t.type !== ae.RAW && (r[t.endIndex] = t);
  }), r;
}, Ud = (e, r, t, s) => {
  if (nd.indexOf(s) < 0 || !r.lastToken || r.lastToken.type !== L.WESTERN_LETTER || e.length <= t + 1)
    return !1;
  const n = e[t + 1], i = Le(n);
  return (i === L.WESTERN_LETTER || i === L.SPACE) && (!r.lastGroup || r.lastGroup.startValue !== id[s]);
}, Vd = (e) => e.match(/\n/) ? j.HYPER_CONTENT : e.match(/^<code.*>.*<\/code.*>$/) ? j.CODE_CONTENT : e.match(/^<.+>$/) ? j.HYPER_CONTENT : j.CODE_CONTENT, Be = (e, r, t) => {
  e.errors.push({
    name: "",
    index: r,
    length: 0,
    message: t,
    target: $.VALUE
  });
}, jd = (e) => {
  const r = e.lastMark;
  r && r.type === ae.BRACKETS && !r.endValue && Be(e, r.startIndex, pa), e.markStack.length > 0 && e.markStack.forEach((s) => {
    s !== r && Be(e, s.startIndex, pa);
  });
  const t = e.lastGroup;
  t && t.startValue && !t.endValue && Be(e, t.startIndex, va), e.groupStack.length > 0 && e.groupStack.forEach((s) => {
    s !== t && s.startValue && !s.endValue && Be(e, s.startIndex, va);
  });
}, Wd = (e, r = []) => {
  const t = _d(e, r), s = $d(r);
  for (let n = 0; n < e.length; n++) {
    const i = e[n], a = Le(i), o = s[n];
    if (o)
      Ke(t, n), delete s[n], o.type === ae.RAW ? (Nd(
        t,
        n,
        e.substring(o.startIndex, o.endIndex)
      ), n = o.endIndex - 1) : n === o.startIndex ? (ma(
        t,
        n,
        o,
        o.startValue,
        W.LEFT
      ), n += o.startValue.length - 1) : n === o.endIndex && (ma(
        t,
        n,
        o,
        o.endValue,
        W.RIGHT
      ), n += o.endValue.length - 1);
    else if (a === L.SPACE) {
      if (Ke(t, n), t.lastGroup) {
        const c = Hd(e, n), l = e.substring(n, n + c);
        if (t.lastGroup.length) {
          const u = Md(t);
          u && (u.spaceAfter = l);
        } else
          t.lastGroup.innerSpaceBefore = l;
        c - 1 > 0 && (n += c - 1);
      }
    } else
      Ud(e, t, n, i) ? ms(t, i) : cd(a) ? Pd(n, i, a, t) : re(a) ? ga(n, i, a, t) : a === L.EMPTY || ga(n, i, L.WESTERN_LETTER, t);
  }
  return Ke(t, e.length), jd(t), {
    tokens: t.tokens,
    groups: t.groups,
    marks: t.marks,
    errors: t.errors
  };
}, ys = (e) => {
  if (Array.isArray(e)) {
    const r = e;
    return r.modifiedType = e.type, r.modifiedValue = e.value, r.modifiedSpaceAfter = e.spaceAfter, r.modifiedStartValue = e.startValue, r.modifiedEndValue = e.endValue, r.modifiedInnerSpaceBefore = e.innerSpaceBefore, r.validations = [], e.forEach(ys), r;
  } else {
    const r = e;
    return r.modifiedType = e.type, r.modifiedValue = e.value, r.modifiedSpaceAfter = e.spaceAfter, r.validations = [], r;
  }
}, zd = (e) => {
  const r = e;
  return r.modifiedStartValue = e.startValue, r.modifiedEndValue = e.endValue, r;
}, Dd = (e, r = {}) => (r.noSinglePair || (e.errors.length = 0), ys(e.tokens), e.marks.forEach(zd), e), bs = (e, r) => {
  for (let t = 0; t < e.length; t++) {
    const s = e[t];
    r(s, t, e), Array.isArray(s) && bs(s, r);
  }
}, Gd = (e) => {
  var r, t;
  return {
    start: ((r = e == null ? void 0 : e.start) == null ? void 0 : r.offset) || 0,
    end: ((t = e == null ? void 0 : e.end) == null ? void 0 : t.offset) || 0
  };
}, As = (e) => e.children !== void 0, Kd = ["paragraph", "heading", "table-cell"], Qd = (e) => Kd.indexOf(e.type) >= 0, Yd = [
  "emphasis",
  "strong",
  "delete",
  "footnote",
  "link",
  "linkReference"
], Jd = (e) => Yd.indexOf(e.type) >= 0, Xd = [
  "inlineCode",
  "break",
  "image",
  "imageReference",
  "footnoteReference",
  "html"
], ws = (e) => Xd.indexOf(e.type) >= 0, Es = (e, r) => {
  As(e) && e.children.forEach((t) => {
    if (t.type !== "yaml")
      if (Qd(t)) {
        const s = {
          block: t,
          inlineMarks: [],
          hyperMarks: [],
          value: ""
          // to be initialzed
        };
        r.push(s), Ts(t, s);
      } else
        Es(t, r);
  });
}, Ts = (e, r) => {
  As(e) && e.children.forEach((t) => {
    Jd(t) && (r.inlineMarks.push({ inline: t, raw: !1 }), Ts(t, r)), ws(t) && r.inlineMarks.push({ inline: t, raw: !0 });
  });
}, Zd = (e, r) => {
  const { block: t, inlineMarks: s } = e;
  if (!t.position)
    return;
  const n = t.position.start.offset || 0, i = [], a = [];
  s.forEach((o) => {
    const { inline: c } = o;
    if (!c.position)
      return;
    const l = c.position.start.offset || 0, u = c.position.end.offset || 0;
    if (ws(c)) {
      const f = {
        type: ae.RAW,
        // TODO: typeof RawMark.meta
        meta: c.type,
        startIndex: l - n,
        endIndex: u - n,
        startValue: r.substring(l, u),
        endValue: ""
      };
      if (f.startValue.match(/<code.*>/)) {
        const d = { ...f, code: W.LEFT };
        a.push(d), i.push(d);
        return;
      } else if (f.startValue.match(/<\/code.*>/)) {
        const d = { ...f, code: W.RIGHT }, h = a.pop();
        h && (h.rightPair = d), i.push(d);
        return;
      }
      i.push(f);
    } else {
      const f = c.children[0], d = c.children[c.children.length - 1];
      if (!f.position || !d.position)
        return;
      const h = f.position.start.offset || 0, m = d.position.end.offset || 0, y = {
        type: ae.HYPER,
        // TODO: typeof RawMark.meta
        meta: c.type,
        startIndex: l - n,
        startValue: r.substring(l, h),
        endIndex: m - n,
        endValue: r.substring(m, u)
      };
      i.push(y);
    }
  }), e.value = r.substring(
    t.position.start.offset || 0,
    t.position.end.offset || 0
  ), e.hyperMarks = i.map((o) => {
    if (sd(o)) {
      if (o.code === W.RIGHT)
        return;
      if (o.code === W.LEFT) {
        const { rightPair: c } = o;
        o.startValue = r.substring(
          o.startIndex + n,
          o.endIndex + n
        ), o.endIndex = (c == null ? void 0 : c.endIndex) || 0, o.endValue = "", delete o.rightPair;
      }
    }
    return o;
  }).filter(Boolean);
}, eh = (e) => {
  const r = e.value, t = e.modifiedValue, s = e.ignoredByParsers, n = [], i = Mo().use(Fu).use(td).parse(t);
  return Es(i, n), n.forEach((a) => Zd(a, r)), e.blocks = n.map((a) => {
    const o = Gd(a.block.position);
    return s.forEach(({ index: c, length: l, originValue: u, meta: f }) => {
      o.start <= c && o.end >= c + l && a.hyperMarks && a.hyperMarks.push({
        type: ae.RAW,
        meta: f,
        startIndex: c - o.start,
        startValue: u,
        endIndex: c - o.start + l,
        endValue: ""
      });
    }), {
      value: a.value || "",
      marks: a.hyperMarks || [],
      ...o
    };
  }), e.ignoredByParsers = [], e;
}, rh = "此处内联代码的外部需要一个空格", th = "此处内联代码的外部不需要空格", Ut = "此处 Markdown 标记的内部不需要空格", Vt = "此处字符需要统一", jt = "此处标点符号需要使用全角", Wt = "此处标点符号需要使用半角", nh = "此处标点符号前不需要空格", ih = "此处标点符号后不需要空格", ah = "此处标点符号后需要一个空格", Ta = "此处括号的内部不需要空格", Ie = "此处括号的外部不需要空格", zt = "此处括号的外部需要一个空格", sh = "此处半角内容之间需要一个空格", oh = "此处全角内容之间不需要空格", ch = "此处中英文内容之间需要一个空格", lh = "此处中英文内容之间需要一个空格", Dt = "此处引号的内部不需要空格", ze = "此处引号的外部不需要空格", or = "此处引号的外部需要一个空格", De = "此处需要去除外部空格", pe = (e, r) => {
  if (!r)
    return;
  const t = e.indexOf(r);
  if (!(t < 0))
    return e[t - 1];
}, te = (e, r) => {
  if (!r)
    return;
  const t = e.indexOf(r);
  if (!(t < 0))
    return e[t + 1];
}, Sn = (e, r) => {
  if (!r)
    return;
  const t = pe(e, r);
  if (t) {
    if (wr(t.type) || Ue(t))
      return Sn(e, t);
    if (Tn(t.type))
      return t;
  }
}, xr = (e, r) => {
  if (!r)
    return;
  const t = te(e, r);
  if (t) {
    if (wr(t.type) || Ue(t))
      return xr(e, t);
    if (Tn(t.type))
      return t;
  }
}, Ze = (e, r) => {
  if (!r)
    return;
  const t = pe(e, r);
  if (t) {
    if (wr(t.type) || Ue(t))
      return Ze(e, t);
    if (us(t.type))
      return t;
  }
}, $e = (e, r) => {
  if (!r)
    return;
  const t = te(e, r);
  if (t) {
    if (wr(t.type) || Ue(t))
      return $e(e, t);
    if (us(t.type))
      return t;
  }
}, fh = (e) => e.type !== j.HYPER_CONTENT ? !1 : !!e.value.match(/^<.+>$/), Ue = (e) => {
  if (fh(e) && !e.value.match(/^<code.*>.*<\/code.*>$/) && !e.value.match(/^<[^/].+\/\s*>$/)) {
    if (e.value.match(/^<[^/].+>$/))
      return W.LEFT;
    if (e.value.match(/^<\/.+>$/))
      return W.RIGHT;
  }
}, ye = (e) => e.type === j.HYPER_MARK || !!Ue(e), Qe = (e) => e.type === j.HYPER_MARK ? e.markSide : Ue(e), vr = (e, r, t, s) => {
  if (s) {
    const n = pe(e, r);
    n && ye(n) && (t.unshift(n), vr(e, n, t, s));
  } else {
    const n = te(e, r);
    n && ye(n) && (t.push(n), vr(e, n, t, s));
  }
}, rn = (e, r) => {
  const t = [r];
  return vr(e, r, t, !1), vr(e, r, t, !0), t;
}, uh = (e, r) => {
  if (!r.length)
    return;
  const t = r[0], s = r[r.length - 1], n = Qe(t), i = Qe(s), a = pe(e, t);
  if (!a || !n || !i)
    return;
  if (n === i)
    return n === W.LEFT ? a : s;
  if (n === W.LEFT)
    return;
  let o = a;
  for (; o && o !== s; ) {
    const c = te(e, o);
    if (c && Qe(c) === W.LEFT)
      return o;
    o = c;
  }
  return a;
}, Z = (e, r, t) => {
  if (!r || !t)
    return {
      spaceHost: void 0,
      wrappers: [],
      tokens: []
    };
  const s = te(e, r), n = $e(e, r);
  if (!s || n !== t)
    return {
      spaceHost: void 0,
      wrappers: [],
      tokens: []
    };
  if (s === t)
    return {
      spaceHost: r,
      wrappers: [],
      tokens: [r]
    };
  const i = rn(e, s);
  return {
    spaceHost: uh(e, i),
    wrappers: i,
    tokens: [r, ...i]
  };
}, ks = (e, r) => {
  const t = pe(e, r), s = te(e, r);
  return be(r.type) && t && t.type === L.WESTERN_LETTER && s && s.type === L.WESTERN_LETTER ? !t.spaceAfter && !r.spaceAfter : !1;
}, xs = (e, r) => {
  if (be(r.type)) {
    const t = pe(e, r), s = te(e, r);
    if (t && be(t.type) && !t.spaceAfter || s && be(s.type) && !r.spaceAfter)
      return !0;
  }
  return !1;
}, dh = (e, r, t, s) => {
  const n = {
    index: e.index,
    length: e.length,
    target: r,
    name: s,
    message: t
  };
  return r === $.START_VALUE ? (n.index = e.startIndex, n.length = 0) : r === $.END_VALUE ? (n.index = e.endIndex, n.length = 0) : r === $.INNER_SPACE_BEFORE && (n.index = e.startIndex, n.length = e.startValue.length), n;
}, Ss = (e, r, t, s) => {
  const n = dh(e, r, t, s);
  X(e, r), e.validations.push(n);
}, X = (e, r) => {
  e.validations = e.validations.filter(
    (t) => t.target !== r
  );
}, Sr = (e, r) => (t, s, n) => {
  t[e] !== s && (t[e] = s, Ss(t, r, n, ""));
}, V = Sr(
  "modifiedSpaceAfter",
  $.SPACE_AFTER
), tn = Sr(
  "modifiedStartValue",
  $.START_VALUE
), nn = Sr(
  "modifiedEndValue",
  $.END_VALUE
), an = Sr(
  "modifiedInnerSpaceBefore",
  $.INNER_SPACE_BEFORE
), sn = (e, r, t, s) => {
  e.modifiedValue !== r && (e.modifiedValue = r, t && (e.modifiedType = t), Ss(e, $.VALUE, s, ""));
}, hh = (e) => {
  const r = e == null ? void 0 : e.trimSpace;
  return (t, s, n) => {
    if (r && !n.startValue && s === 0) {
      n.modifiedInnerSpaceBefore && an(n, "", De), ye(t) && rn(n, t).forEach(
        (a) => V(a, "", De)
      );
      const i = n[n.length - 1];
      if (i)
        if (ye(i)) {
          const a = Ze(n, t);
          a && (rn(n, i).forEach(
            (o) => V(o, "", De)
          ), V(a, "", De));
        } else
          V(i, "", De);
    }
  };
}, ph = [
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
], vh = [
  ['"', "“", "”"],
  ["'", "‘", "’"]
], gh = (e, r) => {
  r.indexOf(e.modifiedValue) >= 0 && (e.modifiedType = os(e.type));
}, mh = (e) => {
  const r = (e == null ? void 0 : e.halfwidthPunctuation) || "", t = (e == null ? void 0 : e.fullwidthPunctuation) || "", s = (e == null ? void 0 : e.adjustedFullwidthPunctuation) || "", n = {}, i = {}, a = {};
  return ph.forEach(([o, c]) => {
    r.indexOf(o) >= 0 && (n[c] = o), t.indexOf(c) >= 0 && (i[o] = c);
  }), vh.forEach(([o, c, l]) => {
    r.indexOf(o) >= 0 && (n[c] = o, n[l] = o), (t.indexOf(c) >= 0 || t.indexOf(l) >= 0) && (a[o] = [c, l]);
  }), {
    halfwidthMap: n,
    fullwidthMap: i,
    fullwidthPairMap: a,
    adjusted: s
  };
}, yh = (e) => {
  const { halfwidthMap: r, fullwidthMap: t, fullwidthPairMap: s, adjusted: n } = mh(e);
  return (a, o, c) => {
    if (!Xt(a.type) && a.type !== j.BRACKET_MARK && a.type !== J.GROUP || ks(c, a) || xs(c, a))
      return;
    if (Xt(a.type) || a.type === j.BRACKET_MARK) {
      const f = a.modifiedValue;
      t[f] ? (sn(
        a,
        t[f],
        od(a.type),
        jt
      ), gh(a, n)) : r[f] && sn(
        a,
        r[f],
        os(a.type),
        Wt
      );
      return;
    }
    const l = a.modifiedStartValue, u = a.modifiedEndValue;
    s[l] ? tn(
      a,
      s[l][0],
      jt
    ) : r[l] && tn(
      a,
      r[l][0],
      Wt
    ), s[u] ? nn(
      a,
      s[u][1],
      jt
    ) : r[u] && nn(a, r[u][1], Wt);
  };
}, Gt = {
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
}, bh = {
  "“": ["「"],
  "”": ["」"],
  "‘": ["『"],
  "’": ["』"]
}, Ah = {
  "「": ["“"],
  "」": ["”"],
  "『": ["‘"],
  "』": ["’"]
}, wh = (e) => {
  const r = {};
  for (const t in e)
    e[t].forEach((n) => {
      r[n] = t;
    });
  return r;
}, Eh = (e) => {
  const r = e == null ? void 0 : e.unifiedPunctuation, t = typeof r == "string" ? r : void 0, s = {};
  return t ? (Object.assign(s, Gt), t === "simplified" ? Object.assign(s, bh) : t === "traditional" && Object.assign(s, Ah)) : typeof r == "object" && (r.default && Object.assign(s, Gt), Object.entries(r).forEach(([n, i]) => {
    i === !0 ? s[n] = Gt[n] : i === !1 ? delete s[n] : s[n] = i;
  })), wh(s);
}, Th = (e) => {
  const r = Eh(e);
  return (s) => {
    if (s.type === J.GROUP) {
      r[s.modifiedStartValue] && tn(
        s,
        r[s.modifiedStartValue],
        Vt
      ), r[s.modifiedEndValue] && nn(
        s,
        r[s.modifiedEndValue],
        Vt
      );
      return;
    } else
      r[s.modifiedValue] && sn(
        s,
        r[s.modifiedValue],
        void 0,
        Vt
      );
  };
}, kh = (e) => e.map((r) => r.split(".").reverse().slice(1)), Cs = (e, r, t) => {
  const s = pe(r, e);
  if (s && !s.spaceAfter) {
    const n = t.filter(
      (i) => i[0].toLowerCase() === s.value.toLowerCase()
    ).map((i) => i.slice(1));
    if (n.length)
      if (n[n.length - 1].length) {
        const a = pe(r, s);
        if (a && !a.spaceAfter && a.value === "." && Cs(a, r, n))
          return !0;
      } else
        return !0;
  }
  return !1;
}, xh = (e) => {
  const r = kh(e.skipAbbrs || []);
  return (t, s, n) => {
    if (t.value !== ".")
      return;
    const i = te(n, t);
    i && i.type === L.WESTERN_LETTER && !t.spaceAfter || Cs(t, n, r) && (t.modifiedValue = ".", t.modifiedType = t.type, X(t, $.VALUE));
  };
}, Sh = (e) => {
  const r = e == null ? void 0 : e.noSpaceInsideHyperMark;
  return (t, s, n) => {
    if (!r)
      return;
    const i = te(n, t);
    if (!i || !ye(t) && !ye(i))
      return;
    const a = Qe(t), o = Qe(i);
    (a === o || a === W.LEFT && !ye(i) || o === W.RIGHT && !ye(t)) && V(t, "", Ut);
  };
}, Ch = (e) => {
  const r = e == null ? void 0 : e.spaceOutsideCode, t = r ? " " : "", s = r ? rh : th;
  return (i, a, o) => {
    if (typeof r > "u" || i.type !== j.CODE_CONTENT)
      return;
    const c = Ze(o, i), l = $e(o, i), { spaceHost: u } = Z(
      o,
      c,
      i
    ), { spaceHost: f } = Z(
      o,
      i,
      l
    );
    c && re(c.type) && u && V(u, t, s), l && (re(l.type) || l.type === j.CODE_CONTENT) && f && V(f, t, s);
  };
}, Oh = (e) => {
  const r = e == null ? void 0 : e.spaceBetweenHalfwidthContent, t = e == null ? void 0 : e.noSpaceBetweenFullwidthContent, s = e == null ? void 0 : e.spaceBetweenMixedwidthContent;
  return (n, i, a) => {
    if (!re(n.type))
      return;
    const o = $e(a, n);
    if (!o || !re(o.type))
      return;
    const { spaceHost: c, tokens: l } = Z(
      a,
      n,
      o
    );
    if (c)
      if (o.type === n.type) {
        if (n.type === L.WESTERN_LETTER) {
          if (!r || l.length > 1 && l.filter((d) => d.spaceAfter).length === 0)
            return;
        } else if (!t)
          return;
        const u = n.type === L.WESTERN_LETTER ? " " : "", f = n.type === L.WESTERN_LETTER ? sh : oh;
        V(c, u, f);
      } else {
        if (typeof s > "u")
          return;
        V(c, s ? " " : "", s ? ch : lh);
      }
  };
}, Rh = (e) => {
  const r = e == null ? void 0 : e.noSpaceBeforePauseOrStop, t = e == null ? void 0 : e.spaceAfterHalfwidthPauseOrStop, s = e == null ? void 0 : e.noSpaceAfterFullwidthPauseOrStop;
  return (n, i, a) => {
    if (wn(n.type) && !ks(a, n) && !xs(a, n)) {
      if (r) {
        const o = Ze(a, n);
        if (o && // content
        (re(o.type) || // right-quotation
        o.type === J.GROUP || // right-bracket
        o.type === j.BRACKET_MARK && o.markSide === W.RIGHT || // code
        o.type === j.CODE_CONTENT)) {
          const { spaceHost: c } = Z(
            a,
            o,
            n
          );
          c && V(c, "", nh);
        }
      }
      if (En(n.modifiedType) && s || be(n.modifiedType) && t) {
        const o = be(n.modifiedType) ? " " : "", c = be(n.modifiedType) ? ah : ih, l = $e(a, n);
        if (l && // content
        (re(l.type) || // left-quotation
        l.type === J.GROUP || // left-bracket
        l.type === j.BRACKET_MARK && l.markSide === W.LEFT || // code
        l.type === j.CODE_CONTENT)) {
          const { spaceHost: u } = Z(
            a,
            n,
            l
          );
          u && V(u, o, c);
        }
      }
    }
  };
}, cr = (e, r) => hr(e) && r.indexOf(e) === -1, Ih = (e) => {
  const r = e.noSpaceInsideQuotation, t = e.spaceOutsideHalfwidthQuotation, s = e.noSpaceOutsideFullwidthQuotation, n = e.adjustedFullwidthPunctuation || "";
  return (i, a, o) => {
    if (i.type === J.GROUP) {
      if (r) {
        const c = i[0];
        c && c.markSide !== W.RIGHT && an(i, "", Dt);
        const l = i[i.length - 1];
        l && l.markSide !== W.LEFT && V(l, "", Dt), c || an(i, "", Dt);
      }
      if (typeof t < "u" || s) {
        const c = xr(o, i);
        if (c && c.type === J.GROUP) {
          const { spaceHost: u } = Z(
            o,
            i,
            c
          );
          u && (cr(i.modifiedEndValue, n) || cr(
            c.modifiedStartValue,
            n
          ) ? s && V(u, "", or) : typeof t < "u" && V(u, t ? " " : "", t ? or : ze));
        }
        const l = Sn(o, i);
        if (l && (re(l.type) || l.type === j.CODE_CONTENT)) {
          const { spaceHost: u } = Z(
            o,
            l,
            i
          );
          u && (cr(
            i.modifiedStartValue,
            n
          ) ? s && V(u, "", ze) : typeof t < "u" && V(u, t ? " " : "", t ? or : ze));
        }
        if (c && (re(c.type) || c.type === j.CODE_CONTENT)) {
          const { spaceHost: u } = Z(
            o,
            i,
            c
          );
          u && (cr(
            i.modifiedEndValue,
            n
          ) ? s && V(u, "", ze) : typeof t < "u" && V(u, t ? " " : "", t ? or : ze));
        }
      }
    }
  };
}, lr = (e, r) => hr(e) && r.indexOf(e) === -1, Ph = (e, r, t, s, n) => !e || !n || hr(t.value) || hr(t.modifiedValue) || r.filter((i) => i.spaceAfter).length || s.filter((i) => i.spaceAfter).length ? !1 : (
  // x(x
  //  ^
  (e.type === L.WESTERN_LETTER || // x()
  //  ^
  e.value === "(" && t.value === ")") && // x)x
  //  ^
  (n.type === L.WESTERN_LETTER || // ()x
  //  ^
  t.value === "(" && n.value === ")")
), _h = (e) => {
  const r = e.noSpaceInsideBracket, t = e.spaceOutsideHalfwidthBracket, s = e.noSpaceOutsideFullwidthBracket, n = e.adjustedFullwidthPunctuation || "";
  return (i, a, o) => {
    if (i.type !== j.BRACKET_MARK)
      return;
    if (r)
      if (i.markSide === W.LEFT)
        te(o, i) && V(i, "", Ta);
      else {
        const m = pe(o, i);
        m && // dedupe
        m.markSide !== W.LEFT && V(m, "", Ta);
      }
    const c = Ze(o, i), l = $e(o, i), { spaceHost: u, tokens: f } = Z(o, c, i), { spaceHost: d, tokens: h } = Z(o, i, l);
    if (!Ph(
      c,
      f,
      i,
      h,
      l
    ) && (typeof t < "u" || s)) {
      const m = lr(
        i.modifiedValue,
        n
      );
      l && i.markSide === W.RIGHT && l.markSide === W.LEFT && d && (m || lr(
        l.modifiedValue,
        n
      ) ? s && V(i, "", Ie) : h.filter((p) => p.spaceAfter).length > 0 && typeof t < "u" && V(i, t ? " " : "", t ? zt : Ie)), i.markSide === W.LEFT ? c && (re(c.type) || c.type === J.GROUP || c.type === j.CODE_CONTENT) && u && (m || c.type === J.GROUP && lr(
        c.modifiedEndValue,
        n
      ) ? s && V(u, "", Ie) : typeof t < "u" && V(u, t ? " " : "", t ? zt : Ie)) : l && (re(l.type) || l.type === J.GROUP || l.type === j.CODE_CONTENT) && d && (m || l.type === J.GROUP && lr(
        l.modifiedStartValue,
        n
      ) ? s && V(d, "", Ie) : typeof t < "u" && V(d, t ? " " : "", t ? zt : Ie));
    }
  };
}, Bh = (e) => (r) => {
  r.spaceAfter && r.spaceAfter.match(/\n/) && (X(r, $.SPACE_AFTER), r.modifiedSpaceAfter = r.spaceAfter);
}, Nh = (e) => {
  const t = ((e == null ? void 0 : e.skipZhUnits) || "").split("").filter((n) => Le(n) === L.CJK_CHAR).join(""), s = new RegExp(`^[${t}]`);
  return (n, i, a) => {
    if (n.type === L.WESTERN_LETTER && n.value.match(/^\d+$/)) {
      const o = xr(a, n);
      if (Array.isArray(o))
        return;
      if (o && o.value.match(s)) {
        const { spaceHost: c, tokens: l } = Z(a, n, o);
        if (l.some((d) => d.spaceAfter))
          return;
        const f = Sn(a, n);
        if (f) {
          const { spaceHost: d, tokens: h } = Z(a, f, n);
          if (h.some(
            (y) => y.spaceAfter
          ))
            return;
          d && (d.modifiedSpaceAfter = "", X(
            d,
            $.SPACE_AFTER
          ));
        }
        c && (c.modifiedSpaceAfter = "", X(c, $.SPACE_AFTER));
      }
    }
  };
}, Fh = (e) => (r, t, s) => {
  if (r.value !== "&")
    return;
  const n = te(s, r);
  if (!n || n.type !== L.WESTERN_LETTER || r.spaceAfter)
    return;
  const i = te(s, n);
  if (!i || i.value !== ";" || n.spaceAfter)
    return;
  r.modifiedValue = r.value, r.modifiedType = r.type, r.modifiedSpaceAfter = r.spaceAfter, X(r, $.VALUE), X(r, $.SPACE_AFTER), n.modifiedValue = n.value, n.modifiedType = n.type, n.modifiedSpaceAfter = n.spaceAfter, X(n, $.VALUE), X(n, $.SPACE_AFTER), i.modifiedValue = i.value, i.modifiedType = i.type, X(i, $.VALUE), X(i, $.SPACE_AFTER);
  const a = xr(s, i);
  if (a) {
    const { spaceHost: o } = Z(s, i, a);
    o && (o.modifiedSpaceAfter = o.spaceAfter, X(o, $.SPACE_AFTER));
  }
}, Os = (e) => e.some((r) => {
  if (r.type === J.GROUP)
    return Os(r);
  if (ld(r.type))
    return !r.value.match(/[‘’“”]/);
}), Rs = (e) => {
  e.forEach((r) => {
    for (const t in $)
      X(r, t);
    r.modifiedSpaceAfter = r.spaceAfter, r.modifiedType = r.type, r.modifiedValue = r.value, r.type === J.GROUP && (r.modifiedInnerSpaceBefore = r.innerSpaceBefore, Rs(r));
  });
}, Lh = (e) => {
  const r = e == null ? void 0 : e.skipPureWestern;
  return (t, s, n) => {
    r && !n.startValue && s === 0 && (Os(n) || Rs(n));
  };
}, qh = (e) => [
  hh(e),
  yh(e),
  Th(e),
  xh(e),
  Sh(e),
  Ch(e),
  Oh(e),
  Rh(e),
  Ih(e),
  _h(e),
  Bh(),
  Nh(e),
  Fh(),
  Lh(e)
], Is = {
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
}, Cn = [
  { name: "ignore", value: Hs },
  { name: "hexo", value: $s },
  { name: "vuepress", value: Us },
  { name: "markdown", value: eh }
], Hh = (e) => e.reduce((r, { name: t, value: s }) => (r[t] = s, r), {}), on = Hh(Cn), Mh = (e, r) => e.map((t) => {
  switch (typeof t) {
    case "function":
      return t;
    case "string":
      return r[t];
    default:
      return null;
  }
}).filter(Boolean), ka = {
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
}, $h = (e, r) => {
  for (const t in ka) {
    const s = ka[t];
    e[t] && (r.warn(`[deprecate] ${t} is deprecated, use ${s} instead`), e[s] = e[s] ?? e[t], delete e[t]);
  }
}, Uh = (e) => {
  const r = e.logger ?? ke.defaultLogger, t = e.rules ?? {}, s = t.preset === "default" ? Is : {};
  $h(t, r);
  let n;
  return typeof e.hyperParse == "function" ? n = [e.hyperParse] : n = e.hyperParse || Cn.map((a) => a.name), {
    logger: r,
    ignoredCases: e.ignoredCases || [],
    rules: { ...s, ...t },
    hyperParse: Mh(
      n,
      on
    )
  };
}, Vh = (e, r = ke.defaultLogger) => {
  const t = {
    logger: r,
    rules: {},
    hyperParse: [],
    ignoredCases: []
  };
  let s = [];
  return e.preset === "default" && (t.rules = { ...Is }, s = Cn.map((n) => n.name)), e.rules && (t.rules = { ...t.rules, ...e.rules }), Array.isArray(e.hyperParsers) && (s = e.hyperParsers), s.forEach((n) => {
    if (!on[n]) {
      r.log(`The hyper parser ${n} is invalid.`);
      return;
    }
    t.hyperParse.push(on[n]);
  }), e.caseIgnores && e.caseIgnores.forEach((n) => {
    const i = Ia(n);
    i ? t.ignoredCases.push(i) : r.log(`The format of ignore case: "${n}" is invalid.`);
  }), t;
}, jh = (e, r = [], t = ke.defaultLogger) => {
  const s = [];
  return r.forEach(({ prefix: n, textStart: i, textEnd: a, suffix: o }) => {
    const c = (n || "") + i, l = (a || "") + (o || ""), u = n ? n.length : 0, f = o ? o.length : 0, d = (h) => {
      const m = e.substring(h).indexOf(c);
      if (m === -1)
        return;
      const y = h + m + u, p = y + i.length;
      if (!l)
        s.push({
          start: y,
          end: p
        }), d(p);
      else {
        const v = e.substring(p).indexOf(l), g = p + v + (a || "").length;
        if (v === -1)
          return;
        s.push({
          start: y,
          end: g
        }), d(g + f);
      }
    };
    d(0);
  }), s.sort((n, i) => n.start - i.start);
}, Pe = (e, r, t) => e <= t.end && r >= t.start, xa = (e, r = []) => {
  const t = {
    ignored: !1,
    [$.VALUE]: !1,
    [$.SPACE_AFTER]: !1,
    [$.START_VALUE]: !1,
    [$.END_VALUE]: !1,
    [$.INNER_SPACE_BEFORE]: !1
  };
  return r.forEach((s) => {
    if (Array.isArray(e)) {
      const {
        index: n,
        startValue: i,
        innerSpaceBefore: a,
        endIndex: o = 0,
        endValue: c,
        spaceAfter: l
      } = e;
      Pe(n, n + (i || "").length, s) && (t[$.SPACE_AFTER] = t.ignored = !0), Pe(
        n + (i || "").length,
        n + (i || "").length + (a || "").length,
        s
      ) && (t[$.INNER_SPACE_BEFORE] = t.ignored = !0), Pe(o, o + (c || "").length, s) && (t[$.END_VALUE] = t.ignored = !0), Pe(
        o + (c || "").length,
        o + (c || "").length + (l || "").length,
        s
      ) && (t[$.SPACE_AFTER] = t.ignored = !0);
    } else {
      const { index: n, value: i, spaceAfter: a } = e;
      Pe(n, n + (i || "").length, s) && (t[$.VALUE] = t.ignored = !0), Pe(
        n + (i || "").length,
        n + (i || "").length + (a || "").length,
        s
      ) && (t[$.SPACE_AFTER] = t.ignored = !0);
    }
  }), t;
}, Sa = (e, r = 0, t, s = [], n = []) => {
  e.validations.forEach((i) => {
    const a = { ...i, index: i.index + r };
    t[i.target] ? n.push(a) : s.push(a);
  });
}, Ps = (e, r = 0, t = [], s = [], n = [], i = [], a) => {
  const o = xa(e, t);
  return !a && o.ignored && s.push(e), a || Sa(
    e,
    r,
    o,
    n,
    i
  ), o[$.START_VALUE] && (e.ignoredStartValue = e.modifiedStartValue, e.modifiedStartValue = e.startValue), o[$.INNER_SPACE_BEFORE] && (e.ignoredInnerSpaceBefore = e.modifiedInnerSpaceBefore, e.modifiedInnerSpaceBefore = e.innerSpaceBefore), o[$.END_VALUE] && (e.ignoredEndValue = e.modifiedEndValue, e.modifiedEndValue = e.endValue), o[$.SPACE_AFTER] && (e.ignoredSpaceAfter = e.modifiedSpaceAfter, e.modifiedSpaceAfter = e.spaceAfter), [
    e.modifiedStartValue,
    e.modifiedInnerSpaceBefore,
    ...e.map((c) => {
      const l = xa(c, t);
      return l.ignored && s.push(c), Sa(
        c,
        r,
        l,
        n,
        i
      ), Array.isArray(c) ? Ps(
        c,
        r,
        t,
        s,
        n,
        i,
        !0
      ) : (l[$.VALUE] && (c.ignoredValue = c.modifiedValue, c.modifiedValue = c.value), l[$.SPACE_AFTER] && (c.ignoredSpaceAfter = c.modifiedSpaceAfter, c.modifiedSpaceAfter = c.spaceAfter), [c.modifiedValue, c.modifiedSpaceAfter].filter(Boolean).join(""));
    }),
    e.modifiedEndValue,
    e.modifiedSpaceAfter
  ].filter(Boolean).join("");
}, Wh = (e, r) => {
  if (r.length === 0)
    return {
      value: e,
      pieces: [{ value: e, start: 0, end: e.length, nonBlock: !0 }]
    };
  const t = r.reduce((n, i, a) => {
    const { start: o, end: c } = i, l = n[n.length - 1], u = l ? l.end : 0;
    if (u < o) {
      const f = {
        nonBlock: !0,
        start: u,
        end: o,
        value: ""
      };
      f.value = e.substring(
        f.start,
        f.end
      ), n.push(f);
    }
    if (n.push(i), a === r.length - 1 && c !== e.length) {
      const f = {
        nonBlock: !0,
        start: c,
        end: e.length,
        value: ""
      };
      f.value = e.substring(
        f.start,
        f.end
      ), n.push(f);
    }
    return n;
  }, []);
  return { value: t.map(({ value: n }) => n).join(""), pieces: t };
}, ap = (e, r = {}) => {
  const t = Uh(r);
  return _s(e, t);
}, sp = (e, r) => {
  const t = Vh(r);
  return _s(e, t);
}, _s = (e, r) => {
  const t = /<!--\s*zhlint\s*disabled\s*-->/g;
  if (e.match(t))
    return { origin: e, result: e, validations: [], disabled: !0 };
  const { logger: s, ignoredCases: n, rules: i, hyperParse: a } = r, o = {
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
  }, c = [], l = [], u = [], f = [], d = a.reduce(
    (v, g) => g(v),
    o
  ), h = qh(i), m = d.blocks.map(
    ({ value: v, marks: g, start: b, end: E }) => {
      let A = v;
      const T = Dd(Wd(v, g), i);
      l.push(...T.errors);
      const k = jh(
        v,
        o.ignoredByRules,
        s
      );
      return h.forEach((O) => {
        bs(T.tokens, O);
      }), A = Ps(
        T.tokens,
        b,
        k,
        c,
        u,
        f
      ), {
        ...T,
        start: b,
        end: E,
        value: A,
        originValue: v
      };
    }
  ), y = Wh(e, m), p = {
    pieces: y.pieces,
    blocks: m,
    ignoredCases: d.ignoredByRules,
    ignoredByParsers: d.ignoredByParsers,
    ignoredTokens: c,
    parserErrors: l,
    ruleErrors: u,
    ignoredRuleErrors: f
  };
  return {
    origin: e,
    result: y.value,
    validations: [...l, ...u],
    __debug__: p
  };
};
function zh(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Bs = { exports: {} }, z = Bs.exports = {}, le, fe;
function cn() {
  throw new Error("setTimeout has not been defined");
}
function ln() {
  throw new Error("clearTimeout has not been defined");
}
(function() {
  try {
    typeof setTimeout == "function" ? le = setTimeout : le = cn;
  } catch {
    le = cn;
  }
  try {
    typeof clearTimeout == "function" ? fe = clearTimeout : fe = ln;
  } catch {
    fe = ln;
  }
})();
function Ns(e) {
  if (le === setTimeout)
    return setTimeout(e, 0);
  if ((le === cn || !le) && setTimeout)
    return le = setTimeout, setTimeout(e, 0);
  try {
    return le(e, 0);
  } catch {
    try {
      return le.call(null, e, 0);
    } catch {
      return le.call(this, e, 0);
    }
  }
}
function Dh(e) {
  if (fe === clearTimeout)
    return clearTimeout(e);
  if ((fe === ln || !fe) && clearTimeout)
    return fe = clearTimeout, clearTimeout(e);
  try {
    return fe(e);
  } catch {
    try {
      return fe.call(null, e);
    } catch {
      return fe.call(this, e);
    }
  }
}
var de = [], Ne = !1, xe, dr = -1;
function Gh() {
  !Ne || !xe || (Ne = !1, xe.length ? de = xe.concat(de) : dr = -1, de.length && Fs());
}
function Fs() {
  if (!Ne) {
    var e = Ns(Gh);
    Ne = !0;
    for (var r = de.length; r; ) {
      for (xe = de, de = []; ++dr < r; )
        xe && xe[dr].run();
      dr = -1, r = de.length;
    }
    xe = null, Ne = !1, Dh(e);
  }
}
z.nextTick = function(e) {
  var r = new Array(arguments.length - 1);
  if (arguments.length > 1)
    for (var t = 1; t < arguments.length; t++)
      r[t - 1] = arguments[t];
  de.push(new Ls(e, r)), de.length === 1 && !Ne && Ns(Fs);
};
function Ls(e, r) {
  this.fun = e, this.array = r;
}
Ls.prototype.run = function() {
  this.fun.apply(null, this.array);
};
z.title = "browser";
z.browser = !0;
z.env = {};
z.argv = [];
z.version = "";
z.versions = {};
function ve() {
}
z.on = ve;
z.addListener = ve;
z.once = ve;
z.off = ve;
z.removeListener = ve;
z.removeAllListeners = ve;
z.emit = ve;
z.prependListener = ve;
z.prependOnceListener = ve;
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
var Kh = Bs.exports;
const Qh = /* @__PURE__ */ zh(Kh);
function ce(e) {
  if (typeof e != "string")
    throw new TypeError("Path must be a string. Received " + JSON.stringify(e));
}
function Ca(e, r) {
  for (var t = "", s = 0, n = -1, i = 0, a, o = 0; o <= e.length; ++o) {
    if (o < e.length)
      a = e.charCodeAt(o);
    else {
      if (a === 47)
        break;
      a = 47;
    }
    if (a === 47) {
      if (!(n === o - 1 || i === 1))
        if (n !== o - 1 && i === 2) {
          if (t.length < 2 || s !== 2 || t.charCodeAt(t.length - 1) !== 46 || t.charCodeAt(t.length - 2) !== 46) {
            if (t.length > 2) {
              var c = t.lastIndexOf("/");
              if (c !== t.length - 1) {
                c === -1 ? (t = "", s = 0) : (t = t.slice(0, c), s = t.length - 1 - t.lastIndexOf("/")), n = o, i = 0;
                continue;
              }
            } else if (t.length === 2 || t.length === 1) {
              t = "", s = 0, n = o, i = 0;
              continue;
            }
          }
          r && (t.length > 0 ? t += "/.." : t = "..", s = 2);
        } else
          t.length > 0 ? t += "/" + e.slice(n + 1, o) : t = e.slice(n + 1, o), s = o - n - 1;
      n = o, i = 0;
    } else
      a === 46 && i !== -1 ? ++i : i = -1;
  }
  return t;
}
function Yh(e, r) {
  var t = r.dir || r.root, s = r.base || (r.name || "") + (r.ext || "");
  return t ? t === r.root ? t + s : t + e + s : s;
}
var Fe = {
  // path.resolve([from ...], to)
  resolve: function() {
    for (var r = "", t = !1, s, n = arguments.length - 1; n >= -1 && !t; n--) {
      var i;
      n >= 0 ? i = arguments[n] : (s === void 0 && (s = Qh.cwd()), i = s), ce(i), i.length !== 0 && (r = i + "/" + r, t = i.charCodeAt(0) === 47);
    }
    return r = Ca(r, !t), t ? r.length > 0 ? "/" + r : "/" : r.length > 0 ? r : ".";
  },
  normalize: function(r) {
    if (ce(r), r.length === 0)
      return ".";
    var t = r.charCodeAt(0) === 47, s = r.charCodeAt(r.length - 1) === 47;
    return r = Ca(r, !t), r.length === 0 && !t && (r = "."), r.length > 0 && s && (r += "/"), t ? "/" + r : r;
  },
  isAbsolute: function(r) {
    return ce(r), r.length > 0 && r.charCodeAt(0) === 47;
  },
  join: function() {
    if (arguments.length === 0)
      return ".";
    for (var r, t = 0; t < arguments.length; ++t) {
      var s = arguments[t];
      ce(s), s.length > 0 && (r === void 0 ? r = s : r += "/" + s);
    }
    return r === void 0 ? "." : Fe.normalize(r);
  },
  relative: function(r, t) {
    if (ce(r), ce(t), r === t || (r = Fe.resolve(r), t = Fe.resolve(t), r === t))
      return "";
    for (var s = 1; s < r.length && r.charCodeAt(s) === 47; ++s)
      ;
    for (var n = r.length, i = n - s, a = 1; a < t.length && t.charCodeAt(a) === 47; ++a)
      ;
    for (var o = t.length, c = o - a, l = i < c ? i : c, u = -1, f = 0; f <= l; ++f) {
      if (f === l) {
        if (c > l) {
          if (t.charCodeAt(a + f) === 47)
            return t.slice(a + f + 1);
          if (f === 0)
            return t.slice(a + f);
        } else
          i > l && (r.charCodeAt(s + f) === 47 ? u = f : f === 0 && (u = 0));
        break;
      }
      var d = r.charCodeAt(s + f), h = t.charCodeAt(a + f);
      if (d !== h)
        break;
      d === 47 && (u = f);
    }
    var m = "";
    for (f = s + u + 1; f <= n; ++f)
      (f === n || r.charCodeAt(f) === 47) && (m.length === 0 ? m += ".." : m += "/..");
    return m.length > 0 ? m + t.slice(a + u) : (a += u, t.charCodeAt(a) === 47 && ++a, t.slice(a));
  },
  _makeLong: function(r) {
    return r;
  },
  dirname: function(r) {
    if (ce(r), r.length === 0)
      return ".";
    for (var t = r.charCodeAt(0), s = t === 47, n = -1, i = !0, a = r.length - 1; a >= 1; --a)
      if (t = r.charCodeAt(a), t === 47) {
        if (!i) {
          n = a;
          break;
        }
      } else
        i = !1;
    return n === -1 ? s ? "/" : "." : s && n === 1 ? "//" : r.slice(0, n);
  },
  basename: function(r, t) {
    if (t !== void 0 && typeof t != "string")
      throw new TypeError('"ext" argument must be a string');
    ce(r);
    var s = 0, n = -1, i = !0, a;
    if (t !== void 0 && t.length > 0 && t.length <= r.length) {
      if (t.length === r.length && t === r)
        return "";
      var o = t.length - 1, c = -1;
      for (a = r.length - 1; a >= 0; --a) {
        var l = r.charCodeAt(a);
        if (l === 47) {
          if (!i) {
            s = a + 1;
            break;
          }
        } else
          c === -1 && (i = !1, c = a + 1), o >= 0 && (l === t.charCodeAt(o) ? --o === -1 && (n = a) : (o = -1, n = c));
      }
      return s === n ? n = c : n === -1 && (n = r.length), r.slice(s, n);
    } else {
      for (a = r.length - 1; a >= 0; --a)
        if (r.charCodeAt(a) === 47) {
          if (!i) {
            s = a + 1;
            break;
          }
        } else
          n === -1 && (i = !1, n = a + 1);
      return n === -1 ? "" : r.slice(s, n);
    }
  },
  extname: function(r) {
    ce(r);
    for (var t = -1, s = 0, n = -1, i = !0, a = 0, o = r.length - 1; o >= 0; --o) {
      var c = r.charCodeAt(o);
      if (c === 47) {
        if (!i) {
          s = o + 1;
          break;
        }
        continue;
      }
      n === -1 && (i = !1, n = o + 1), c === 46 ? t === -1 ? t = o : a !== 1 && (a = 1) : t !== -1 && (a = -1);
    }
    return t === -1 || n === -1 || // We saw a non-dot character immediately before the dot
    a === 0 || // The (right-most) trimmed path component is exactly '..'
    a === 1 && t === n - 1 && t === s + 1 ? "" : r.slice(t, n);
  },
  format: function(r) {
    if (r === null || typeof r != "object")
      throw new TypeError('The "pathObject" argument must be of type Object. Received type ' + typeof r);
    return Yh("/", r);
  },
  parse: function(r) {
    ce(r);
    var t = { root: "", dir: "", base: "", ext: "", name: "" };
    if (r.length === 0)
      return t;
    var s = r.charCodeAt(0), n = s === 47, i;
    n ? (t.root = "/", i = 1) : i = 0;
    for (var a = -1, o = 0, c = -1, l = !0, u = r.length - 1, f = 0; u >= i; --u) {
      if (s = r.charCodeAt(u), s === 47) {
        if (!l) {
          o = u + 1;
          break;
        }
        continue;
      }
      c === -1 && (l = !1, c = u + 1), s === 46 ? a === -1 ? a = u : f !== 1 && (f = 1) : a !== -1 && (f = -1);
    }
    return a === -1 || c === -1 || // We saw a non-dot character immediately before the dot
    f === 0 || // The (right-most) trimmed path component is exactly '..'
    f === 1 && a === c - 1 && a === o + 1 ? c !== -1 && (o === 0 && n ? t.base = t.name = r.slice(1, c) : t.base = t.name = r.slice(o, c)) : (o === 0 && n ? (t.name = r.slice(1, a), t.base = r.slice(1, c)) : (t.name = r.slice(o, a), t.base = r.slice(o, c)), t.ext = r.slice(a, c)), o > 0 ? t.dir = r.slice(0, o - 1) : n && (t.dir = "/"), t;
  },
  sep: "/",
  delimiter: ":",
  win32: null,
  posix: null
};
Fe.posix = Fe;
var fr = Fe, Jh = null, Se = Jh;
const Xh = ".zhlintrc", Zh = ".zhlintignore", ep = ".zhlintcaseignore", rp = (e, r, t, s, n = ke.defaultLogger) => {
  const i = {
    config: void 0,
    fileIgnore: void 0,
    caseIgnore: void 0
  };
  return e = fr.resolve(e ?? "."), Se.existsSync(e) ? (r = fr.resolve(e, r ?? Xh), Se.existsSync(r) ? i.config = r : n.log(
    `Config file "${r}" does not exist. Will proceed as default.`
  ), t = fr.resolve(e, t ?? Zh), Se.existsSync(t) ? i.fileIgnore = t : n.log(
    `Global ignored cases file "${t}" does not exist. Will proceed as none.`
  ), s = fr.resolve(e, s ?? ep), Se.existsSync(s) ? i.caseIgnore = s : n.log(
    `Global ignored cases file "${s}" does not exist. Will proceed as none.`
  ), i) : (n.log(`"${e}" does not exist.`), i);
}, tp = (e) => {
  const r = Se.readFileSync(e, { encoding: "utf8" });
  return JSON.parse(r);
}, np = (e, r, t, s = ke.defaultLogger) => {
  const n = {
    preset: "default"
  };
  if (e)
    try {
      const i = tp(e);
      typeof i.preset == "string" && (n.preset = i.preset), typeof i.rules == "object" && (n.rules = i.rules), Array.isArray(i.hyperParsers) && (n.hyperParsers = i.hyperParsers), Array.isArray(i.fileIgnores) && (n.fileIgnores = i.fileIgnores), Array.isArray(i.caseIgnores) && (n.caseIgnores = i.caseIgnores);
    } catch (i) {
      s.log(
        `Failed to read "${e}": ${i.message}`
      );
    }
  if (r)
    try {
      Se.readFileSync(r, { encoding: "utf8" }).split(/\n/).map((a) => a.trim()).forEach((a) => {
        a && (n.fileIgnores || (n.fileIgnores = []), n.fileIgnores.indexOf(a) === -1 && n.fileIgnores.push(a));
      });
    } catch (i) {
      s.log(
        `Failed to read "${r}": ${i.message}`
      );
    }
  if (t)
    try {
      Se.readFileSync(t, { encoding: "utf8" }).split(/\n/).map((a) => a.trim()).forEach((a) => {
        a && (n.caseIgnores || (n.caseIgnores = []), n.caseIgnores.indexOf(a) === -1 && n.caseIgnores.push(a));
      });
    } catch (i) {
      s.log(
        `Failed to read "${t}": ${i.message}`
      );
    }
  return n;
}, op = (e, r, t, s, n = ke.defaultLogger) => {
  const {
    config: i,
    fileIgnore: a,
    caseIgnore: o
  } = rp(e, r, t, s, n);
  return np(
    i,
    a,
    o,
    n
  );
};
export {
  op as readRc,
  ip as report,
  ap as run,
  sp as runWithConfig
};
//# sourceMappingURL=zhlint.es.js.map
