const Il = /^(?:(?<prefix>.+?)-,)?(?<textStart>.+?)(?:,(?<textEnd>.+?))?(?:,-(?<suffix>.+?))?$/, si = (e) => {
  const n = e.match(Il);
  if (n) {
    const { prefix: t, textStart: i, textEnd: r, suffix: l } = n.groups;
    return {
      prefix: t,
      textStart: i,
      textEnd: r,
      suffix: l
    };
  }
}, Pl = (e) => {
  const { ignoredByRules: n, value: t } = e, i = /<!--\s*zhlint\s*ignore:\s*(.+?)\s*-->/g;
  let r;
  for (; (r = i.exec(t)) !== null; ) {
    const l = si(r[1]);
    l && n.push(l);
  }
  return e;
}, _l = /\{% ([^ ]+?) [^%]*?%\}(?:\n|\{(?!%)|[^{])*?\{% end(?:\1) %\}/g, Rl = (e) => (e.modifiedValue = e.modifiedValue.replace(
  _l,
  (n, t, i) => {
    const { length: r } = n;
    return e.ignoredByParsers.push({
      name: t,
      meta: `hexo-${t}`,
      index: i,
      length: r,
      originValue: n
    }), "@".repeat(r);
  }
), e);
let mn;
try {
  mn = new RegExp("(?<=^|\\n)(:::.*)\\n([\\s\\S]+?)\\n(:::)(?=\\n|$)", "g");
} catch {
  mn = /(:::.*)\n([\s\S]+?)\n(:::)/g;
}
const Bl = (e) => (e.modifiedValue = e.modifiedValue.replace(
  mn,
  (n, t, i, r, l) => {
    const { length: u } = n, a = t.substring(3).trim().split(" ")[0] || "default";
    return e.ignoredByParsers.push({
      name: a,
      index: l,
      length: t.length,
      originValue: t,
      meta: `vuepress-${a}-start`
    }), e.ignoredByParsers.push({
      name: a,
      index: l + u - 3,
      length: 3,
      originValue: r,
      meta: `vuepress-${a}-end`
    }), "@".repeat(t.length) + `
` + i + `
` + "@".repeat(3);
  }
), e);
function tr(e) {
  if (e)
    throw e;
}
function _t(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
var Ll = function(n) {
  return n != null && n.constructor != null && typeof n.constructor.isBuffer == "function" && n.constructor.isBuffer(n);
};
const oi = /* @__PURE__ */ _t(Ll);
var St = Object.prototype.hasOwnProperty, ci = Object.prototype.toString, nr = Object.defineProperty, rr = Object.getOwnPropertyDescriptor, ir = function(n) {
  return typeof Array.isArray == "function" ? Array.isArray(n) : ci.call(n) === "[object Array]";
}, lr = function(n) {
  if (!n || ci.call(n) !== "[object Object]")
    return !1;
  var t = St.call(n, "constructor"), i = n.constructor && n.constructor.prototype && St.call(n.constructor.prototype, "isPrototypeOf");
  if (n.constructor && !t && !i)
    return !1;
  var r;
  for (r in n)
    ;
  return typeof r > "u" || St.call(n, r);
}, ur = function(n, t) {
  nr && t.name === "__proto__" ? nr(n, t.name, {
    enumerable: !0,
    configurable: !0,
    value: t.newValue,
    writable: !0
  }) : n[t.name] = t.newValue;
}, ar = function(n, t) {
  if (t === "__proto__")
    if (St.call(n, t)) {
      if (rr)
        return rr(n, t).value;
    } else
      return;
  return n[t];
}, vl = function e() {
  var n, t, i, r, l, u, a = arguments[0], s = 1, c = arguments.length, f = !1;
  for (typeof a == "boolean" && (f = a, a = arguments[1] || {}, s = 2), (a == null || typeof a != "object" && typeof a != "function") && (a = {}); s < c; ++s)
    if (n = arguments[s], n != null)
      for (t in n)
        i = ar(a, t), r = ar(n, t), a !== r && (f && r && (lr(r) || (l = ir(r))) ? (l ? (l = !1, u = i && ir(i) ? i : []) : u = i && lr(i) ? i : {}, ur(a, { name: t, newValue: e(f, u, r) })) : typeof r < "u" && ur(a, { name: t, newValue: r }));
  return a;
};
const sr = /* @__PURE__ */ _t(vl);
function yn(e) {
  if (typeof e != "object" || e === null)
    return !1;
  const n = Object.getPrototypeOf(e);
  return (n === null || n === Object.prototype || Object.getPrototypeOf(n) === null) && !(Symbol.toStringTag in e) && !(Symbol.iterator in e);
}
function Dl() {
  const e = [], n = { run: t, use: i };
  return n;
  function t(...r) {
    let l = -1;
    const u = r.pop();
    if (typeof u != "function")
      throw new TypeError("Expected function as last argument, not " + u);
    a(null, ...r);
    function a(s, ...c) {
      const f = e[++l];
      let o = -1;
      if (s) {
        u(s);
        return;
      }
      for (; ++o < r.length; )
        (c[o] === null || c[o] === void 0) && (c[o] = r[o]);
      r = c, f ? Ml(f, a)(...c) : u(null, ...c);
    }
  }
  function i(r) {
    if (typeof r != "function")
      throw new TypeError(
        "Expected `middelware` to be a function, not " + r
      );
    return e.push(r), n;
  }
}
function Ml(e, n) {
  let t;
  return i;
  function i(...u) {
    const a = e.length > u.length;
    let s;
    a && u.push(r);
    try {
      s = e.apply(this, u);
    } catch (c) {
      const f = (
        /** @type {Error} */
        c
      );
      if (a && t)
        throw f;
      return r(f);
    }
    a || (s && s.then && typeof s.then == "function" ? s.then(l, r) : s instanceof Error ? r(s) : l(s));
  }
  function r(u, ...a) {
    t || (t = !0, n(u, ...a));
  }
  function l(u) {
    r(null, u);
  }
}
function lt(e) {
  return !e || typeof e != "object" ? "" : "position" in e || "type" in e ? or(e.position) : "start" in e || "end" in e ? or(e) : "line" in e || "column" in e ? bn(e) : "";
}
function bn(e) {
  return cr(e && e.line) + ":" + cr(e && e.column);
}
function or(e) {
  return bn(e && e.start) + "-" + bn(e && e.end);
}
function cr(e) {
  return e && typeof e == "number" ? e : 1;
}
class oe extends Error {
  /**
   * Create a message for `reason` at `place` from `origin`.
   *
   * When an error is passed in as `reason`, the `stack` is copied.
   *
   * @param {string | Error | VFileMessage} reason
   *   Reason for message, uses the stack and message of the error if given.
   *
   *   > 👉 **Note**: you should use markdown.
   * @param {Node | NodeLike | Position | Point | null | undefined} [place]
   *   Place in file where the message occurred.
   * @param {string | null | undefined} [origin]
   *   Place in code where the message originates (example:
   *   `'my-package:my-rule'` or `'my-rule'`).
   * @returns
   *   Instance of `VFileMessage`.
   */
  // To do: next major: expose `undefined` everywhere instead of `null`.
  constructor(n, t, i) {
    const r = [null, null];
    let l = {
      // @ts-expect-error: we always follows the structure of `position`.
      start: { line: null, column: null },
      // @ts-expect-error: "
      end: { line: null, column: null }
    };
    if (super(), typeof t == "string" && (i = t, t = void 0), typeof i == "string") {
      const u = i.indexOf(":");
      u === -1 ? r[1] = i : (r[0] = i.slice(0, u), r[1] = i.slice(u + 1));
    }
    t && ("type" in t || "position" in t ? t.position && (l = t.position) : "start" in t || "end" in t ? l = t : ("line" in t || "column" in t) && (l.start = t)), this.name = lt(t) || "1:1", this.message = typeof n == "object" ? n.message : n, this.stack = "", typeof n == "object" && n.stack && (this.stack = n.stack), this.reason = this.message, this.fatal, this.line = l.start.line, this.column = l.start.column, this.position = l, this.source = r[0], this.ruleId = r[1], this.file, this.actual, this.expected, this.url, this.note;
  }
}
oe.prototype.file = "";
oe.prototype.name = "";
oe.prototype.reason = "";
oe.prototype.message = "";
oe.prototype.stack = "";
oe.prototype.fatal = null;
oe.prototype.column = null;
oe.prototype.line = null;
oe.prototype.source = null;
oe.prototype.ruleId = null;
oe.prototype.position = null;
const ye = { basename: zl, dirname: Nl, extname: Hl, join: Vl, sep: "/" };
function zl(e, n) {
  if (n !== void 0 && typeof n != "string")
    throw new TypeError('"ext" argument must be a string');
  ft(e);
  let t = 0, i = -1, r = e.length, l;
  if (n === void 0 || n.length === 0 || n.length > e.length) {
    for (; r--; )
      if (e.charCodeAt(r) === 47) {
        if (l) {
          t = r + 1;
          break;
        }
      } else
        i < 0 && (l = !0, i = r + 1);
    return i < 0 ? "" : e.slice(t, i);
  }
  if (n === e)
    return "";
  let u = -1, a = n.length - 1;
  for (; r--; )
    if (e.charCodeAt(r) === 47) {
      if (l) {
        t = r + 1;
        break;
      }
    } else
      u < 0 && (l = !0, u = r + 1), a > -1 && (e.charCodeAt(r) === n.charCodeAt(a--) ? a < 0 && (i = r) : (a = -1, i = u));
  return t === i ? i = u : i < 0 && (i = e.length), e.slice(t, i);
}
function Nl(e) {
  if (ft(e), e.length === 0)
    return ".";
  let n = -1, t = e.length, i;
  for (; --t; )
    if (e.charCodeAt(t) === 47) {
      if (i) {
        n = t;
        break;
      }
    } else
      i || (i = !0);
  return n < 0 ? e.charCodeAt(0) === 47 ? "/" : "." : n === 1 && e.charCodeAt(0) === 47 ? "//" : e.slice(0, n);
}
function Hl(e) {
  ft(e);
  let n = e.length, t = -1, i = 0, r = -1, l = 0, u;
  for (; n--; ) {
    const a = e.charCodeAt(n);
    if (a === 47) {
      if (u) {
        i = n + 1;
        break;
      }
      continue;
    }
    t < 0 && (u = !0, t = n + 1), a === 46 ? r < 0 ? r = n : l !== 1 && (l = 1) : r > -1 && (l = -1);
  }
  return r < 0 || t < 0 || // We saw a non-dot character immediately before the dot.
  l === 0 || // The (right-most) trimmed path component is exactly `..`.
  l === 1 && r === t - 1 && r === i + 1 ? "" : e.slice(r, t);
}
function Vl(...e) {
  let n = -1, t;
  for (; ++n < e.length; )
    ft(e[n]), e[n] && (t = t === void 0 ? e[n] : t + "/" + e[n]);
  return t === void 0 ? "." : jl(t);
}
function jl(e) {
  ft(e);
  const n = e.charCodeAt(0) === 47;
  let t = Ul(e, !n);
  return t.length === 0 && !n && (t = "."), t.length > 0 && e.charCodeAt(e.length - 1) === 47 && (t += "/"), n ? "/" + t : t;
}
function Ul(e, n) {
  let t = "", i = 0, r = -1, l = 0, u = -1, a, s;
  for (; ++u <= e.length; ) {
    if (u < e.length)
      a = e.charCodeAt(u);
    else {
      if (a === 47)
        break;
      a = 47;
    }
    if (a === 47) {
      if (!(r === u - 1 || l === 1))
        if (r !== u - 1 && l === 2) {
          if (t.length < 2 || i !== 2 || t.charCodeAt(t.length - 1) !== 46 || t.charCodeAt(t.length - 2) !== 46) {
            if (t.length > 2) {
              if (s = t.lastIndexOf("/"), s !== t.length - 1) {
                s < 0 ? (t = "", i = 0) : (t = t.slice(0, s), i = t.length - 1 - t.lastIndexOf("/")), r = u, l = 0;
                continue;
              }
            } else if (t.length > 0) {
              t = "", i = 0, r = u, l = 0;
              continue;
            }
          }
          n && (t = t.length > 0 ? t + "/.." : "..", i = 2);
        } else
          t.length > 0 ? t += "/" + e.slice(r + 1, u) : t = e.slice(r + 1, u), i = u - r - 1;
      r = u, l = 0;
    } else
      a === 46 && l > -1 ? l++ : l = -1;
  }
  return t;
}
function ft(e) {
  if (typeof e != "string")
    throw new TypeError(
      "Path must be a string. Received " + JSON.stringify(e)
    );
}
const Wl = { cwd: $l };
function $l() {
  return "/";
}
function xn(e) {
  return e !== null && typeof e == "object" && // @ts-expect-error: indexable.
  e.href && // @ts-expect-error: indexable.
  e.origin;
}
function ql(e) {
  if (typeof e == "string")
    e = new URL(e);
  else if (!xn(e)) {
    const n = new TypeError(
      'The "path" argument must be of type string or an instance of URL. Received `' + e + "`"
    );
    throw n.code = "ERR_INVALID_ARG_TYPE", n;
  }
  if (e.protocol !== "file:") {
    const n = new TypeError("The URL must be of scheme file");
    throw n.code = "ERR_INVALID_URL_SCHEME", n;
  }
  return Gl(e);
}
function Gl(e) {
  if (e.hostname !== "") {
    const i = new TypeError(
      'File URL host must be "localhost" or empty on darwin'
    );
    throw i.code = "ERR_INVALID_FILE_URL_HOST", i;
  }
  const n = e.pathname;
  let t = -1;
  for (; ++t < n.length; )
    if (n.charCodeAt(t) === 37 && n.charCodeAt(t + 1) === 50) {
      const i = n.charCodeAt(t + 2);
      if (i === 70 || i === 102) {
        const r = new TypeError(
          "File URL path must not include encoded / characters"
        );
        throw r.code = "ERR_INVALID_FILE_URL_PATH", r;
      }
    }
  return decodeURIComponent(n);
}
const Ut = ["history", "path", "basename", "stem", "extname", "dirname"];
class Kl {
  /**
   * Create a new virtual file.
   *
   * `options` is treated as:
   *
   * *   `string` or `Buffer` — `{value: options}`
   * *   `URL` — `{path: options}`
   * *   `VFile` — shallow copies its data over to the new file
   * *   `object` — all fields are shallow copied over to the new file
   *
   * Path related fields are set in the following order (least specific to
   * most specific): `history`, `path`, `basename`, `stem`, `extname`,
   * `dirname`.
   *
   * You cannot set `dirname` or `extname` without setting either `history`,
   * `path`, `basename`, or `stem` too.
   *
   * @param {Compatible | null | undefined} [value]
   *   File value.
   * @returns
   *   New instance.
   */
  constructor(n) {
    let t;
    n ? typeof n == "string" || Ql(n) ? t = { value: n } : xn(n) ? t = { path: n } : t = n : t = {}, this.data = {}, this.messages = [], this.history = [], this.cwd = Wl.cwd(), this.value, this.stored, this.result, this.map;
    let i = -1;
    for (; ++i < Ut.length; ) {
      const l = Ut[i];
      l in t && t[l] !== void 0 && t[l] !== null && (this[l] = l === "history" ? [...t[l]] : t[l]);
    }
    let r;
    for (r in t)
      Ut.includes(r) || (this[r] = t[r]);
  }
  /**
   * Get the full path (example: `'~/index.min.js'`).
   *
   * @returns {string}
   */
  get path() {
    return this.history[this.history.length - 1];
  }
  /**
   * Set the full path (example: `'~/index.min.js'`).
   *
   * Cannot be nullified.
   * You can set a file URL (a `URL` object with a `file:` protocol) which will
   * be turned into a path with `url.fileURLToPath`.
   *
   * @param {string | URL} path
   */
  set path(n) {
    xn(n) && (n = ql(n)), $t(n, "path"), this.path !== n && this.history.push(n);
  }
  /**
   * Get the parent path (example: `'~'`).
   */
  get dirname() {
    return typeof this.path == "string" ? ye.dirname(this.path) : void 0;
  }
  /**
   * Set the parent path (example: `'~'`).
   *
   * Cannot be set if there’s no `path` yet.
   */
  set dirname(n) {
    fr(this.basename, "dirname"), this.path = ye.join(n || "", this.basename);
  }
  /**
   * Get the basename (including extname) (example: `'index.min.js'`).
   */
  get basename() {
    return typeof this.path == "string" ? ye.basename(this.path) : void 0;
  }
  /**
   * Set basename (including extname) (`'index.min.js'`).
   *
   * Cannot contain path separators (`'/'` on unix, macOS, and browsers, `'\'`
   * on windows).
   * Cannot be nullified (use `file.path = file.dirname` instead).
   */
  set basename(n) {
    $t(n, "basename"), Wt(n, "basename"), this.path = ye.join(this.dirname || "", n);
  }
  /**
   * Get the extname (including dot) (example: `'.js'`).
   */
  get extname() {
    return typeof this.path == "string" ? ye.extname(this.path) : void 0;
  }
  /**
   * Set the extname (including dot) (example: `'.js'`).
   *
   * Cannot contain path separators (`'/'` on unix, macOS, and browsers, `'\'`
   * on windows).
   * Cannot be set if there’s no `path` yet.
   */
  set extname(n) {
    if (Wt(n, "extname"), fr(this.dirname, "extname"), n) {
      if (n.charCodeAt(0) !== 46)
        throw new Error("`extname` must start with `.`");
      if (n.includes(".", 1))
        throw new Error("`extname` cannot contain multiple dots");
    }
    this.path = ye.join(this.dirname, this.stem + (n || ""));
  }
  /**
   * Get the stem (basename w/o extname) (example: `'index.min'`).
   */
  get stem() {
    return typeof this.path == "string" ? ye.basename(this.path, this.extname) : void 0;
  }
  /**
   * Set the stem (basename w/o extname) (example: `'index.min'`).
   *
   * Cannot contain path separators (`'/'` on unix, macOS, and browsers, `'\'`
   * on windows).
   * Cannot be nullified (use `file.path = file.dirname` instead).
   */
  set stem(n) {
    $t(n, "stem"), Wt(n, "stem"), this.path = ye.join(this.dirname || "", n + (this.extname || ""));
  }
  /**
   * Serialize the file.
   *
   * @param {BufferEncoding | null | undefined} [encoding='utf8']
   *   Character encoding to understand `value` as when it’s a `Buffer`
   *   (default: `'utf8'`).
   * @returns {string}
   *   Serialized file.
   */
  toString(n) {
    return (this.value || "").toString(n || void 0);
  }
  /**
   * Create a warning message associated with the file.
   *
   * Its `fatal` is set to `false` and `file` is set to the current file path.
   * Its added to `file.messages`.
   *
   * @param {string | Error | VFileMessage} reason
   *   Reason for message, uses the stack and message of the error if given.
   * @param {Node | NodeLike | Position | Point | null | undefined} [place]
   *   Place in file where the message occurred.
   * @param {string | null | undefined} [origin]
   *   Place in code where the message originates (example:
   *   `'my-package:my-rule'` or `'my-rule'`).
   * @returns {VFileMessage}
   *   Message.
   */
  message(n, t, i) {
    const r = new oe(n, t, i);
    return this.path && (r.name = this.path + ":" + r.name, r.file = this.path), r.fatal = !1, this.messages.push(r), r;
  }
  /**
   * Create an info message associated with the file.
   *
   * Its `fatal` is set to `null` and `file` is set to the current file path.
   * Its added to `file.messages`.
   *
   * @param {string | Error | VFileMessage} reason
   *   Reason for message, uses the stack and message of the error if given.
   * @param {Node | NodeLike | Position | Point | null | undefined} [place]
   *   Place in file where the message occurred.
   * @param {string | null | undefined} [origin]
   *   Place in code where the message originates (example:
   *   `'my-package:my-rule'` or `'my-rule'`).
   * @returns {VFileMessage}
   *   Message.
   */
  info(n, t, i) {
    const r = this.message(n, t, i);
    return r.fatal = null, r;
  }
  /**
   * Create a fatal error associated with the file.
   *
   * Its `fatal` is set to `true` and `file` is set to the current file path.
   * Its added to `file.messages`.
   *
   * > 👉 **Note**: a fatal error means that a file is no longer processable.
   *
   * @param {string | Error | VFileMessage} reason
   *   Reason for message, uses the stack and message of the error if given.
   * @param {Node | NodeLike | Position | Point | null | undefined} [place]
   *   Place in file where the message occurred.
   * @param {string | null | undefined} [origin]
   *   Place in code where the message originates (example:
   *   `'my-package:my-rule'` or `'my-rule'`).
   * @returns {never}
   *   Message.
   * @throws {VFileMessage}
   *   Message.
   */
  fail(n, t, i) {
    const r = this.message(n, t, i);
    throw r.fatal = !0, r;
  }
}
function Wt(e, n) {
  if (e && e.includes(ye.sep))
    throw new Error(
      "`" + n + "` cannot be a path: did not expect `" + ye.sep + "`"
    );
}
function $t(e, n) {
  if (!e)
    throw new Error("`" + n + "` cannot be empty");
}
function fr(e, n) {
  if (!e)
    throw new Error("Setting `" + n + "` requires `path` to be set too");
}
function Ql(e) {
  return oi(e);
}
const Yl = hi().freeze(), fi = {}.hasOwnProperty;
function hi() {
  const e = Dl(), n = [];
  let t = {}, i, r = -1;
  return l.data = u, l.Parser = void 0, l.Compiler = void 0, l.freeze = a, l.attachers = n, l.use = s, l.parse = c, l.stringify = f, l.run = o, l.runSync = p, l.process = h, l.processSync = d, l;
  function l() {
    const y = hi();
    let x = -1;
    for (; ++x < n.length; )
      y.use(...n[x]);
    return y.data(sr(!0, {}, t)), y;
  }
  function u(y, x) {
    return typeof y == "string" ? arguments.length === 2 ? (Kt("data", i), t[y] = x, l) : fi.call(t, y) && t[y] || null : y ? (Kt("data", i), t = y, l) : t;
  }
  function a() {
    if (i)
      return l;
    for (; ++r < n.length; ) {
      const [y, ...x] = n[r];
      if (x[0] === !1)
        continue;
      x[0] === !0 && (x[0] = void 0);
      const b = y.call(l, ...x);
      typeof b == "function" && e.use(b);
    }
    return i = !0, r = Number.POSITIVE_INFINITY, l;
  }
  function s(y, ...x) {
    let b;
    if (Kt("use", i), y != null)
      if (typeof y == "function")
        _(y, ...x);
      else if (typeof y == "object")
        Array.isArray(y) ? O(y) : w(y);
      else
        throw new TypeError("Expected usable value, not `" + y + "`");
    return b && (t.settings = Object.assign(t.settings || {}, b)), l;
    function C(k) {
      if (typeof k == "function")
        _(k);
      else if (typeof k == "object")
        if (Array.isArray(k)) {
          const [S, ...L] = k;
          _(S, ...L);
        } else
          w(k);
      else
        throw new TypeError("Expected usable value, not `" + k + "`");
    }
    function w(k) {
      O(k.plugins), k.settings && (b = Object.assign(b || {}, k.settings));
    }
    function O(k) {
      let S = -1;
      if (k != null)
        if (Array.isArray(k))
          for (; ++S < k.length; ) {
            const L = k[S];
            C(L);
          }
        else
          throw new TypeError("Expected a list of plugins, not `" + k + "`");
    }
    function _(k, S) {
      let L = -1, N;
      for (; ++L < n.length; )
        if (n[L][0] === k) {
          N = n[L];
          break;
        }
      N ? (yn(N[1]) && yn(S) && (S = sr(!0, N[1], S)), N[1] = S) : n.push([...arguments]);
    }
  }
  function c(y) {
    l.freeze();
    const x = nt(y), b = l.Parser;
    return qt("parse", b), hr(b, "parse") ? new b(String(x), x).parse() : b(String(x), x);
  }
  function f(y, x) {
    l.freeze();
    const b = nt(x), C = l.Compiler;
    return Gt("stringify", C), pr(y), hr(C, "compile") ? new C(y, b).compile() : C(y, b);
  }
  function o(y, x, b) {
    if (pr(y), l.freeze(), !b && typeof x == "function" && (b = x, x = void 0), !b)
      return new Promise(C);
    C(null, b);
    function C(w, O) {
      e.run(y, nt(x), _);
      function _(k, S, L) {
        S = S || y, k ? O(k) : w ? w(S) : b(null, S, L);
      }
    }
  }
  function p(y, x) {
    let b, C;
    return l.run(y, x, w), dr("runSync", "run", C), b;
    function w(O, _) {
      tr(O), b = _, C = !0;
    }
  }
  function h(y, x) {
    if (l.freeze(), qt("process", l.Parser), Gt("process", l.Compiler), !x)
      return new Promise(b);
    b(null, x);
    function b(C, w) {
      const O = nt(y);
      l.run(l.parse(O), O, (k, S, L) => {
        if (k || !S || !L)
          _(k);
        else {
          const N = l.stringify(S, L);
          N == null || (Xl(N) ? L.value = N : L.result = N), _(k, L);
        }
      });
      function _(k, S) {
        k || !S ? w(k) : C ? C(S) : x(null, S);
      }
    }
  }
  function d(y) {
    let x;
    l.freeze(), qt("processSync", l.Parser), Gt("processSync", l.Compiler);
    const b = nt(y);
    return l.process(b, C), dr("processSync", "process", x), b;
    function C(w) {
      x = !0, tr(w);
    }
  }
}
function hr(e, n) {
  return typeof e == "function" && // Prototypes do exist.
  // type-coverage:ignore-next-line
  e.prototype && // A function with keys in its prototype is probably a constructor.
  // Classes’ prototype methods are not enumerable, so we check if some value
  // exists in the prototype.
  // type-coverage:ignore-next-line
  (Jl(e.prototype) || n in e.prototype);
}
function Jl(e) {
  let n;
  for (n in e)
    if (fi.call(e, n))
      return !0;
  return !1;
}
function qt(e, n) {
  if (typeof n != "function")
    throw new TypeError("Cannot `" + e + "` without `Parser`");
}
function Gt(e, n) {
  if (typeof n != "function")
    throw new TypeError("Cannot `" + e + "` without `Compiler`");
}
function Kt(e, n) {
  if (n)
    throw new Error(
      "Cannot call `" + e + "` on a frozen processor.\nCreate a new processor first, by calling it: use `processor()` instead of `processor`."
    );
}
function pr(e) {
  if (!yn(e) || typeof e.type != "string")
    throw new TypeError("Expected node, got `" + e + "`");
}
function dr(e, n, t) {
  if (!t)
    throw new Error(
      "`" + e + "` finished async. Use `" + n + "` instead"
    );
}
function nt(e) {
  return Zl(e) ? e : new Kl(e);
}
function Zl(e) {
  return !!(e && typeof e == "object" && "message" in e && "messages" in e);
}
function Xl(e) {
  return typeof e == "string" || oi(e);
}
const eu = {};
function tu(e, n) {
  const t = n || eu, i = typeof t.includeImageAlt == "boolean" ? t.includeImageAlt : !0, r = typeof t.includeHtml == "boolean" ? t.includeHtml : !0;
  return pi(e, i, r);
}
function pi(e, n, t) {
  if (nu(e)) {
    if ("value" in e)
      return e.type === "html" && !t ? "" : e.value;
    if (n && "alt" in e && e.alt)
      return e.alt;
    if ("children" in e)
      return gr(e.children, n, t);
  }
  return Array.isArray(e) ? gr(e, n, t) : "";
}
function gr(e, n, t) {
  const i = [];
  let r = -1;
  for (; ++r < e.length; )
    i[r] = pi(e[r], n, t);
  return i.join("");
}
function nu(e) {
  return !!(e && typeof e == "object");
}
function re(e, n, t, i) {
  const r = e.length;
  let l = 0, u;
  if (n < 0 ? n = -n > r ? 0 : r + n : n = n > r ? r : n, t = t > 0 ? t : 0, i.length < 1e4)
    u = Array.from(i), u.unshift(n, t), e.splice(...u);
  else
    for (t && e.splice(n, t); l < i.length; )
      u = i.slice(l, l + 1e4), u.unshift(n, 0), e.splice(...u), l += 1e4, n += 1e4;
}
function ue(e, n) {
  return e.length > 0 ? (re(e, e.length, 0, n), e) : n;
}
const mr = {}.hasOwnProperty;
function di(e) {
  const n = {};
  let t = -1;
  for (; ++t < e.length; )
    ru(n, e[t]);
  return n;
}
function ru(e, n) {
  let t;
  for (t in n) {
    const r = (mr.call(e, t) ? e[t] : void 0) || (e[t] = {}), l = n[t];
    let u;
    if (l)
      for (u in l) {
        mr.call(r, u) || (r[u] = []);
        const a = l[u];
        iu(
          // @ts-expect-error Looks like a list.
          r[u],
          Array.isArray(a) ? a : a ? [a] : []
        );
      }
  }
}
function iu(e, n) {
  let t = -1;
  const i = [];
  for (; ++t < n.length; )
    (n[t].add === "after" ? e : i).push(n[t]);
  re(e, 0, 0, i);
}
const lu = /[!-\/:-@\[-`\{-~\xA1\xA7\xAB\xB6\xB7\xBB\xBF\u037E\u0387\u055A-\u055F\u0589\u058A\u05BE\u05C0\u05C3\u05C6\u05F3\u05F4\u0609\u060A\u060C\u060D\u061B\u061D-\u061F\u066A-\u066D\u06D4\u0700-\u070D\u07F7-\u07F9\u0830-\u083E\u085E\u0964\u0965\u0970\u09FD\u0A76\u0AF0\u0C77\u0C84\u0DF4\u0E4F\u0E5A\u0E5B\u0F04-\u0F12\u0F14\u0F3A-\u0F3D\u0F85\u0FD0-\u0FD4\u0FD9\u0FDA\u104A-\u104F\u10FB\u1360-\u1368\u1400\u166E\u169B\u169C\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DA\u1800-\u180A\u1944\u1945\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B5A-\u1B60\u1B7D\u1B7E\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u2010-\u2027\u2030-\u2043\u2045-\u2051\u2053-\u205E\u207D\u207E\u208D\u208E\u2308-\u230B\u2329\u232A\u2768-\u2775\u27C5\u27C6\u27E6-\u27EF\u2983-\u2998\u29D8-\u29DB\u29FC\u29FD\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00-\u2E2E\u2E30-\u2E4F\u2E52-\u2E5D\u3001-\u3003\u3008-\u3011\u3014-\u301F\u3030\u303D\u30A0\u30FB\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA8FC\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAADE\uAADF\uAAF0\uAAF1\uABEB\uFD3E\uFD3F\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE61\uFE63\uFE68\uFE6A\uFE6B\uFF01-\uFF03\uFF05-\uFF0A\uFF0C-\uFF0F\uFF1A\uFF1B\uFF1F\uFF20\uFF3B-\uFF3D\uFF3F\uFF5B\uFF5D\uFF5F-\uFF65]/, X = Le(/[A-Za-z]/), ne = Le(/[\dA-Za-z]/), uu = Le(/[#-'*+\--9=?A-Z^-~]/);
function Ft(e) {
  return (
    // Special whitespace codes (which have negative values), C0 and Control
    // character DEL
    e !== null && (e < 32 || e === 127)
  );
}
const kn = Le(/\d/), au = Le(/[\dA-Fa-f]/), su = Le(/[!-/:-@[-`{-~]/);
function P(e) {
  return e !== null && e < -2;
}
function W(e) {
  return e !== null && (e < 0 || e === 32);
}
function v(e) {
  return e === -2 || e === -1 || e === 32;
}
const Rt = Le(lu), Ne = Le(/\s/);
function Le(e) {
  return n;
  function n(t) {
    return t !== null && e.test(String.fromCharCode(t));
  }
}
function M(e, n, t, i) {
  const r = i ? i - 1 : Number.POSITIVE_INFINITY;
  let l = 0;
  return u;
  function u(s) {
    return v(s) ? (e.enter(t), a(s)) : n(s);
  }
  function a(s) {
    return v(s) && l++ < r ? (e.consume(s), a) : (e.exit(t), n(s));
  }
}
const ou = {
  tokenize: cu
};
function cu(e) {
  const n = e.attempt(
    this.parser.constructs.contentInitial,
    i,
    r
  );
  let t;
  return n;
  function i(a) {
    if (a === null) {
      e.consume(a);
      return;
    }
    return e.enter("lineEnding"), e.consume(a), e.exit("lineEnding"), M(e, n, "linePrefix");
  }
  function r(a) {
    return e.enter("paragraph"), l(a);
  }
  function l(a) {
    const s = e.enter("chunkText", {
      contentType: "text",
      previous: t
    });
    return t && (t.next = s), t = s, u(a);
  }
  function u(a) {
    if (a === null) {
      e.exit("chunkText"), e.exit("paragraph"), e.consume(a);
      return;
    }
    return P(a) ? (e.consume(a), e.exit("chunkText"), l) : (e.consume(a), u);
  }
}
const fu = {
  tokenize: hu
}, yr = {
  tokenize: pu
};
function hu(e) {
  const n = this, t = [];
  let i = 0, r, l, u;
  return a;
  function a(w) {
    if (i < t.length) {
      const O = t[i];
      return n.containerState = O[1], e.attempt(
        O[0].continuation,
        s,
        c
      )(w);
    }
    return c(w);
  }
  function s(w) {
    if (i++, n.containerState._closeFlow) {
      n.containerState._closeFlow = void 0, r && C();
      const O = n.events.length;
      let _ = O, k;
      for (; _--; )
        if (n.events[_][0] === "exit" && n.events[_][1].type === "chunkFlow") {
          k = n.events[_][1].end;
          break;
        }
      b(i);
      let S = O;
      for (; S < n.events.length; )
        n.events[S][1].end = Object.assign({}, k), S++;
      return re(
        n.events,
        _ + 1,
        0,
        n.events.slice(O)
      ), n.events.length = S, c(w);
    }
    return a(w);
  }
  function c(w) {
    if (i === t.length) {
      if (!r)
        return p(w);
      if (r.currentConstruct && r.currentConstruct.concrete)
        return d(w);
      n.interrupt = !!(r.currentConstruct && !r._gfmTableDynamicInterruptHack);
    }
    return n.containerState = {}, e.check(
      yr,
      f,
      o
    )(w);
  }
  function f(w) {
    return r && C(), b(i), p(w);
  }
  function o(w) {
    return n.parser.lazy[n.now().line] = i !== t.length, u = n.now().offset, d(w);
  }
  function p(w) {
    return n.containerState = {}, e.attempt(
      yr,
      h,
      d
    )(w);
  }
  function h(w) {
    return i++, t.push([n.currentConstruct, n.containerState]), p(w);
  }
  function d(w) {
    if (w === null) {
      r && C(), b(0), e.consume(w);
      return;
    }
    return r = r || n.parser.flow(n.now()), e.enter("chunkFlow", {
      contentType: "flow",
      previous: l,
      _tokenizer: r
    }), y(w);
  }
  function y(w) {
    if (w === null) {
      x(e.exit("chunkFlow"), !0), b(0), e.consume(w);
      return;
    }
    return P(w) ? (e.consume(w), x(e.exit("chunkFlow")), i = 0, n.interrupt = void 0, a) : (e.consume(w), y);
  }
  function x(w, O) {
    const _ = n.sliceStream(w);
    if (O && _.push(null), w.previous = l, l && (l.next = w), l = w, r.defineSkip(w.start), r.write(_), n.parser.lazy[w.start.line]) {
      let k = r.events.length;
      for (; k--; )
        if (
          // The token starts before the line ending…
          r.events[k][1].start.offset < u && // …and either is not ended yet…
          (!r.events[k][1].end || // …or ends after it.
          r.events[k][1].end.offset > u)
        )
          return;
      const S = n.events.length;
      let L = S, N, E;
      for (; L--; )
        if (n.events[L][0] === "exit" && n.events[L][1].type === "chunkFlow") {
          if (N) {
            E = n.events[L][1].end;
            break;
          }
          N = !0;
        }
      for (b(i), k = S; k < n.events.length; )
        n.events[k][1].end = Object.assign({}, E), k++;
      re(
        n.events,
        L + 1,
        0,
        n.events.slice(S)
      ), n.events.length = k;
    }
  }
  function b(w) {
    let O = t.length;
    for (; O-- > w; ) {
      const _ = t[O];
      n.containerState = _[1], _[0].exit.call(n, e);
    }
    t.length = w;
  }
  function C() {
    r.write([null]), l = void 0, r = void 0, n.containerState._closeFlow = void 0;
  }
}
function pu(e, n, t) {
  return M(
    e,
    e.attempt(this.parser.constructs.document, n, t),
    "linePrefix",
    this.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4
  );
}
function Ot(e) {
  if (e === null || W(e) || Ne(e))
    return 1;
  if (Rt(e))
    return 2;
}
function Bt(e, n, t) {
  const i = [];
  let r = -1;
  for (; ++r < e.length; ) {
    const l = e[r].resolveAll;
    l && !i.includes(l) && (n = l(n, t), i.push(l));
  }
  return n;
}
const wn = {
  name: "attention",
  tokenize: gu,
  resolveAll: du
};
function du(e, n) {
  let t = -1, i, r, l, u, a, s, c, f;
  for (; ++t < e.length; )
    if (e[t][0] === "enter" && e[t][1].type === "attentionSequence" && e[t][1]._close) {
      for (i = t; i--; )
        if (e[i][0] === "exit" && e[i][1].type === "attentionSequence" && e[i][1]._open && // If the markers are the same:
        n.sliceSerialize(e[i][1]).charCodeAt(0) === n.sliceSerialize(e[t][1]).charCodeAt(0)) {
          if ((e[i][1]._close || e[t][1]._open) && (e[t][1].end.offset - e[t][1].start.offset) % 3 && !((e[i][1].end.offset - e[i][1].start.offset + e[t][1].end.offset - e[t][1].start.offset) % 3))
            continue;
          s = e[i][1].end.offset - e[i][1].start.offset > 1 && e[t][1].end.offset - e[t][1].start.offset > 1 ? 2 : 1;
          const o = Object.assign({}, e[i][1].end), p = Object.assign({}, e[t][1].start);
          br(o, -s), br(p, s), u = {
            type: s > 1 ? "strongSequence" : "emphasisSequence",
            start: o,
            end: Object.assign({}, e[i][1].end)
          }, a = {
            type: s > 1 ? "strongSequence" : "emphasisSequence",
            start: Object.assign({}, e[t][1].start),
            end: p
          }, l = {
            type: s > 1 ? "strongText" : "emphasisText",
            start: Object.assign({}, e[i][1].end),
            end: Object.assign({}, e[t][1].start)
          }, r = {
            type: s > 1 ? "strong" : "emphasis",
            start: Object.assign({}, u.start),
            end: Object.assign({}, a.end)
          }, e[i][1].end = Object.assign({}, u.start), e[t][1].start = Object.assign({}, a.end), c = [], e[i][1].end.offset - e[i][1].start.offset && (c = ue(c, [
            ["enter", e[i][1], n],
            ["exit", e[i][1], n]
          ])), c = ue(c, [
            ["enter", r, n],
            ["enter", u, n],
            ["exit", u, n],
            ["enter", l, n]
          ]), c = ue(
            c,
            Bt(
              n.parser.constructs.insideSpan.null,
              e.slice(i + 1, t),
              n
            )
          ), c = ue(c, [
            ["exit", l, n],
            ["enter", a, n],
            ["exit", a, n],
            ["exit", r, n]
          ]), e[t][1].end.offset - e[t][1].start.offset ? (f = 2, c = ue(c, [
            ["enter", e[t][1], n],
            ["exit", e[t][1], n]
          ])) : f = 0, re(e, i - 1, t - i + 3, c), t = i + c.length - f - 2;
          break;
        }
    }
  for (t = -1; ++t < e.length; )
    e[t][1].type === "attentionSequence" && (e[t][1].type = "data");
  return e;
}
function gu(e, n) {
  const t = this.parser.constructs.attentionMarkers.null, i = this.previous, r = Ot(i);
  let l;
  return u;
  function u(s) {
    return l = s, e.enter("attentionSequence"), a(s);
  }
  function a(s) {
    if (s === l)
      return e.consume(s), a;
    const c = e.exit("attentionSequence"), f = Ot(s), o = !f || f === 2 && r || t.includes(s), p = !r || r === 2 && f || t.includes(i);
    return c._open = !!(l === 42 ? o : o && (r || !p)), c._close = !!(l === 42 ? p : p && (f || !o)), n(s);
  }
}
function br(e, n) {
  e.column += n, e.offset += n, e._bufferIndex += n;
}
const mu = {
  name: "autolink",
  tokenize: yu
};
function yu(e, n, t) {
  let i = 0;
  return r;
  function r(h) {
    return e.enter("autolink"), e.enter("autolinkMarker"), e.consume(h), e.exit("autolinkMarker"), e.enter("autolinkProtocol"), l;
  }
  function l(h) {
    return X(h) ? (e.consume(h), u) : c(h);
  }
  function u(h) {
    return h === 43 || h === 45 || h === 46 || ne(h) ? (i = 1, a(h)) : c(h);
  }
  function a(h) {
    return h === 58 ? (e.consume(h), i = 0, s) : (h === 43 || h === 45 || h === 46 || ne(h)) && i++ < 32 ? (e.consume(h), a) : (i = 0, c(h));
  }
  function s(h) {
    return h === 62 ? (e.exit("autolinkProtocol"), e.enter("autolinkMarker"), e.consume(h), e.exit("autolinkMarker"), e.exit("autolink"), n) : h === null || h === 32 || h === 60 || Ft(h) ? t(h) : (e.consume(h), s);
  }
  function c(h) {
    return h === 64 ? (e.consume(h), f) : uu(h) ? (e.consume(h), c) : t(h);
  }
  function f(h) {
    return ne(h) ? o(h) : t(h);
  }
  function o(h) {
    return h === 46 ? (e.consume(h), i = 0, f) : h === 62 ? (e.exit("autolinkProtocol").type = "autolinkEmail", e.enter("autolinkMarker"), e.consume(h), e.exit("autolinkMarker"), e.exit("autolink"), n) : p(h);
  }
  function p(h) {
    if ((h === 45 || ne(h)) && i++ < 63) {
      const d = h === 45 ? p : o;
      return e.consume(h), d;
    }
    return t(h);
  }
}
const ht = {
  tokenize: bu,
  partial: !0
};
function bu(e, n, t) {
  return i;
  function i(l) {
    return v(l) ? M(e, r, "linePrefix")(l) : r(l);
  }
  function r(l) {
    return l === null || P(l) ? n(l) : t(l);
  }
}
const gi = {
  name: "blockQuote",
  tokenize: xu,
  continuation: {
    tokenize: ku
  },
  exit: wu
};
function xu(e, n, t) {
  const i = this;
  return r;
  function r(u) {
    if (u === 62) {
      const a = i.containerState;
      return a.open || (e.enter("blockQuote", {
        _container: !0
      }), a.open = !0), e.enter("blockQuotePrefix"), e.enter("blockQuoteMarker"), e.consume(u), e.exit("blockQuoteMarker"), l;
    }
    return t(u);
  }
  function l(u) {
    return v(u) ? (e.enter("blockQuotePrefixWhitespace"), e.consume(u), e.exit("blockQuotePrefixWhitespace"), e.exit("blockQuotePrefix"), n) : (e.exit("blockQuotePrefix"), n(u));
  }
}
function ku(e, n, t) {
  const i = this;
  return r;
  function r(u) {
    return v(u) ? M(
      e,
      l,
      "linePrefix",
      i.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4
    )(u) : l(u);
  }
  function l(u) {
    return e.attempt(gi, n, t)(u);
  }
}
function wu(e) {
  e.exit("blockQuote");
}
const mi = {
  name: "characterEscape",
  tokenize: Eu
};
function Eu(e, n, t) {
  return i;
  function i(l) {
    return e.enter("characterEscape"), e.enter("escapeMarker"), e.consume(l), e.exit("escapeMarker"), r;
  }
  function r(l) {
    return su(l) ? (e.enter("characterEscapeValue"), e.consume(l), e.exit("characterEscapeValue"), e.exit("characterEscape"), n) : t(l);
  }
}
const xr = document.createElement("i");
function Mn(e) {
  const n = "&" + e + ";";
  xr.innerHTML = n;
  const t = xr.textContent;
  return t.charCodeAt(t.length - 1) === 59 && e !== "semi" || t === n ? !1 : t;
}
const yi = {
  name: "characterReference",
  tokenize: Au
};
function Au(e, n, t) {
  const i = this;
  let r = 0, l, u;
  return a;
  function a(o) {
    return e.enter("characterReference"), e.enter("characterReferenceMarker"), e.consume(o), e.exit("characterReferenceMarker"), s;
  }
  function s(o) {
    return o === 35 ? (e.enter("characterReferenceMarkerNumeric"), e.consume(o), e.exit("characterReferenceMarkerNumeric"), c) : (e.enter("characterReferenceValue"), l = 31, u = ne, f(o));
  }
  function c(o) {
    return o === 88 || o === 120 ? (e.enter("characterReferenceMarkerHexadecimal"), e.consume(o), e.exit("characterReferenceMarkerHexadecimal"), e.enter("characterReferenceValue"), l = 6, u = au, f) : (e.enter("characterReferenceValue"), l = 7, u = kn, f(o));
  }
  function f(o) {
    if (o === 59 && r) {
      const p = e.exit("characterReferenceValue");
      return u === ne && !Mn(i.sliceSerialize(p)) ? t(o) : (e.enter("characterReferenceMarker"), e.consume(o), e.exit("characterReferenceMarker"), e.exit("characterReference"), n);
    }
    return u(o) && r++ < l ? (e.consume(o), f) : t(o);
  }
}
const kr = {
  tokenize: Cu,
  partial: !0
}, wr = {
  name: "codeFenced",
  tokenize: Su,
  concrete: !0
};
function Su(e, n, t) {
  const i = this, r = {
    tokenize: _,
    partial: !0
  };
  let l = 0, u = 0, a;
  return s;
  function s(k) {
    return c(k);
  }
  function c(k) {
    const S = i.events[i.events.length - 1];
    return l = S && S[1].type === "linePrefix" ? S[2].sliceSerialize(S[1], !0).length : 0, a = k, e.enter("codeFenced"), e.enter("codeFencedFence"), e.enter("codeFencedFenceSequence"), f(k);
  }
  function f(k) {
    return k === a ? (u++, e.consume(k), f) : u < 3 ? t(k) : (e.exit("codeFencedFenceSequence"), v(k) ? M(e, o, "whitespace")(k) : o(k));
  }
  function o(k) {
    return k === null || P(k) ? (e.exit("codeFencedFence"), i.interrupt ? n(k) : e.check(kr, y, O)(k)) : (e.enter("codeFencedFenceInfo"), e.enter("chunkString", {
      contentType: "string"
    }), p(k));
  }
  function p(k) {
    return k === null || P(k) ? (e.exit("chunkString"), e.exit("codeFencedFenceInfo"), o(k)) : v(k) ? (e.exit("chunkString"), e.exit("codeFencedFenceInfo"), M(e, h, "whitespace")(k)) : k === 96 && k === a ? t(k) : (e.consume(k), p);
  }
  function h(k) {
    return k === null || P(k) ? o(k) : (e.enter("codeFencedFenceMeta"), e.enter("chunkString", {
      contentType: "string"
    }), d(k));
  }
  function d(k) {
    return k === null || P(k) ? (e.exit("chunkString"), e.exit("codeFencedFenceMeta"), o(k)) : k === 96 && k === a ? t(k) : (e.consume(k), d);
  }
  function y(k) {
    return e.attempt(r, O, x)(k);
  }
  function x(k) {
    return e.enter("lineEnding"), e.consume(k), e.exit("lineEnding"), b;
  }
  function b(k) {
    return l > 0 && v(k) ? M(
      e,
      C,
      "linePrefix",
      l + 1
    )(k) : C(k);
  }
  function C(k) {
    return k === null || P(k) ? e.check(kr, y, O)(k) : (e.enter("codeFlowValue"), w(k));
  }
  function w(k) {
    return k === null || P(k) ? (e.exit("codeFlowValue"), C(k)) : (e.consume(k), w);
  }
  function O(k) {
    return e.exit("codeFenced"), n(k);
  }
  function _(k, S, L) {
    let N = 0;
    return E;
    function E(z) {
      return k.enter("lineEnding"), k.consume(z), k.exit("lineEnding"), F;
    }
    function F(z) {
      return k.enter("codeFencedFence"), v(z) ? M(
        k,
        I,
        "linePrefix",
        i.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4
      )(z) : I(z);
    }
    function I(z) {
      return z === a ? (k.enter("codeFencedFenceSequence"), j(z)) : L(z);
    }
    function j(z) {
      return z === a ? (N++, k.consume(z), j) : N >= u ? (k.exit("codeFencedFenceSequence"), v(z) ? M(k, G, "whitespace")(z) : G(z)) : L(z);
    }
    function G(z) {
      return z === null || P(z) ? (k.exit("codeFencedFence"), S(z)) : L(z);
    }
  }
}
function Cu(e, n, t) {
  const i = this;
  return r;
  function r(u) {
    return u === null ? t(u) : (e.enter("lineEnding"), e.consume(u), e.exit("lineEnding"), l);
  }
  function l(u) {
    return i.parser.lazy[i.now().line] ? t(u) : n(u);
  }
}
const Qt = {
  name: "codeIndented",
  tokenize: Fu
}, Tu = {
  tokenize: Ou,
  partial: !0
};
function Fu(e, n, t) {
  const i = this;
  return r;
  function r(c) {
    return e.enter("codeIndented"), M(e, l, "linePrefix", 5)(c);
  }
  function l(c) {
    const f = i.events[i.events.length - 1];
    return f && f[1].type === "linePrefix" && f[2].sliceSerialize(f[1], !0).length >= 4 ? u(c) : t(c);
  }
  function u(c) {
    return c === null ? s(c) : P(c) ? e.attempt(Tu, u, s)(c) : (e.enter("codeFlowValue"), a(c));
  }
  function a(c) {
    return c === null || P(c) ? (e.exit("codeFlowValue"), u(c)) : (e.consume(c), a);
  }
  function s(c) {
    return e.exit("codeIndented"), n(c);
  }
}
function Ou(e, n, t) {
  const i = this;
  return r;
  function r(u) {
    return i.parser.lazy[i.now().line] ? t(u) : P(u) ? (e.enter("lineEnding"), e.consume(u), e.exit("lineEnding"), r) : M(e, l, "linePrefix", 5)(u);
  }
  function l(u) {
    const a = i.events[i.events.length - 1];
    return a && a[1].type === "linePrefix" && a[2].sliceSerialize(a[1], !0).length >= 4 ? n(u) : P(u) ? r(u) : t(u);
  }
}
const Iu = {
  name: "codeText",
  tokenize: Ru,
  resolve: Pu,
  previous: _u
};
function Pu(e) {
  let n = e.length - 4, t = 3, i, r;
  if ((e[t][1].type === "lineEnding" || e[t][1].type === "space") && (e[n][1].type === "lineEnding" || e[n][1].type === "space")) {
    for (i = t; ++i < n; )
      if (e[i][1].type === "codeTextData") {
        e[t][1].type = "codeTextPadding", e[n][1].type = "codeTextPadding", t += 2, n -= 2;
        break;
      }
  }
  for (i = t - 1, n++; ++i <= n; )
    r === void 0 ? i !== n && e[i][1].type !== "lineEnding" && (r = i) : (i === n || e[i][1].type === "lineEnding") && (e[r][1].type = "codeTextData", i !== r + 2 && (e[r][1].end = e[i - 1][1].end, e.splice(r + 2, i - r - 2), n -= i - r - 2, i = r + 2), r = void 0);
  return e;
}
function _u(e) {
  return e !== 96 || this.events[this.events.length - 1][1].type === "characterEscape";
}
function Ru(e, n, t) {
  let i = 0, r, l;
  return u;
  function u(o) {
    return e.enter("codeText"), e.enter("codeTextSequence"), a(o);
  }
  function a(o) {
    return o === 96 ? (e.consume(o), i++, a) : (e.exit("codeTextSequence"), s(o));
  }
  function s(o) {
    return o === null ? t(o) : o === 32 ? (e.enter("space"), e.consume(o), e.exit("space"), s) : o === 96 ? (l = e.enter("codeTextSequence"), r = 0, f(o)) : P(o) ? (e.enter("lineEnding"), e.consume(o), e.exit("lineEnding"), s) : (e.enter("codeTextData"), c(o));
  }
  function c(o) {
    return o === null || o === 32 || o === 96 || P(o) ? (e.exit("codeTextData"), s(o)) : (e.consume(o), c);
  }
  function f(o) {
    return o === 96 ? (e.consume(o), r++, f) : r === i ? (e.exit("codeTextSequence"), e.exit("codeText"), n(o)) : (l.type = "codeTextData", c(o));
  }
}
function bi(e) {
  const n = {};
  let t = -1, i, r, l, u, a, s, c;
  for (; ++t < e.length; ) {
    for (; t in n; )
      t = n[t];
    if (i = e[t], t && i[1].type === "chunkFlow" && e[t - 1][1].type === "listItemPrefix" && (s = i[1]._tokenizer.events, l = 0, l < s.length && s[l][1].type === "lineEndingBlank" && (l += 2), l < s.length && s[l][1].type === "content"))
      for (; ++l < s.length && s[l][1].type !== "content"; )
        s[l][1].type === "chunkText" && (s[l][1]._isInFirstContentOfListItem = !0, l++);
    if (i[0] === "enter")
      i[1].contentType && (Object.assign(n, Bu(e, t)), t = n[t], c = !0);
    else if (i[1]._container) {
      for (l = t, r = void 0; l-- && (u = e[l], u[1].type === "lineEnding" || u[1].type === "lineEndingBlank"); )
        u[0] === "enter" && (r && (e[r][1].type = "lineEndingBlank"), u[1].type = "lineEnding", r = l);
      r && (i[1].end = Object.assign({}, e[r][1].start), a = e.slice(r, t), a.unshift(i), re(e, r, t - r + 1, a));
    }
  }
  return !c;
}
function Bu(e, n) {
  const t = e[n][1], i = e[n][2];
  let r = n - 1;
  const l = [], u = t._tokenizer || i.parser[t.contentType](t.start), a = u.events, s = [], c = {};
  let f, o, p = -1, h = t, d = 0, y = 0;
  const x = [y];
  for (; h; ) {
    for (; e[++r][1] !== h; )
      ;
    l.push(r), h._tokenizer || (f = i.sliceStream(h), h.next || f.push(null), o && u.defineSkip(h.start), h._isInFirstContentOfListItem && (u._gfmTasklistFirstContentOfListItem = !0), u.write(f), h._isInFirstContentOfListItem && (u._gfmTasklistFirstContentOfListItem = void 0)), o = h, h = h.next;
  }
  for (h = t; ++p < a.length; )
    // Find a void token that includes a break.
    a[p][0] === "exit" && a[p - 1][0] === "enter" && a[p][1].type === a[p - 1][1].type && a[p][1].start.line !== a[p][1].end.line && (y = p + 1, x.push(y), h._tokenizer = void 0, h.previous = void 0, h = h.next);
  for (u.events = [], h ? (h._tokenizer = void 0, h.previous = void 0) : x.pop(), p = x.length; p--; ) {
    const b = a.slice(x[p], x[p + 1]), C = l.pop();
    s.unshift([C, C + b.length - 1]), re(e, C, 2, b);
  }
  for (p = -1; ++p < s.length; )
    c[d + s[p][0]] = d + s[p][1], d += s[p][1] - s[p][0] - 1;
  return c;
}
const Lu = {
  tokenize: Mu,
  resolve: Du
}, vu = {
  tokenize: zu,
  partial: !0
};
function Du(e) {
  return bi(e), e;
}
function Mu(e, n) {
  let t;
  return i;
  function i(a) {
    return e.enter("content"), t = e.enter("chunkContent", {
      contentType: "content"
    }), r(a);
  }
  function r(a) {
    return a === null ? l(a) : P(a) ? e.check(
      vu,
      u,
      l
    )(a) : (e.consume(a), r);
  }
  function l(a) {
    return e.exit("chunkContent"), e.exit("content"), n(a);
  }
  function u(a) {
    return e.consume(a), e.exit("chunkContent"), t.next = e.enter("chunkContent", {
      contentType: "content",
      previous: t
    }), t = t.next, r;
  }
}
function zu(e, n, t) {
  const i = this;
  return r;
  function r(u) {
    return e.exit("chunkContent"), e.enter("lineEnding"), e.consume(u), e.exit("lineEnding"), M(e, l, "linePrefix");
  }
  function l(u) {
    if (u === null || P(u))
      return t(u);
    const a = i.events[i.events.length - 1];
    return !i.parser.constructs.disable.null.includes("codeIndented") && a && a[1].type === "linePrefix" && a[2].sliceSerialize(a[1], !0).length >= 4 ? n(u) : e.interrupt(i.parser.constructs.flow, t, n)(u);
  }
}
function xi(e, n, t, i, r, l, u, a, s) {
  const c = s || Number.POSITIVE_INFINITY;
  let f = 0;
  return o;
  function o(b) {
    return b === 60 ? (e.enter(i), e.enter(r), e.enter(l), e.consume(b), e.exit(l), p) : b === null || b === 32 || b === 41 || Ft(b) ? t(b) : (e.enter(i), e.enter(u), e.enter(a), e.enter("chunkString", {
      contentType: "string"
    }), y(b));
  }
  function p(b) {
    return b === 62 ? (e.enter(l), e.consume(b), e.exit(l), e.exit(r), e.exit(i), n) : (e.enter(a), e.enter("chunkString", {
      contentType: "string"
    }), h(b));
  }
  function h(b) {
    return b === 62 ? (e.exit("chunkString"), e.exit(a), p(b)) : b === null || b === 60 || P(b) ? t(b) : (e.consume(b), b === 92 ? d : h);
  }
  function d(b) {
    return b === 60 || b === 62 || b === 92 ? (e.consume(b), h) : h(b);
  }
  function y(b) {
    return !f && (b === null || b === 41 || W(b)) ? (e.exit("chunkString"), e.exit(a), e.exit(u), e.exit(i), n(b)) : f < c && b === 40 ? (e.consume(b), f++, y) : b === 41 ? (e.consume(b), f--, y) : b === null || b === 32 || b === 40 || Ft(b) ? t(b) : (e.consume(b), b === 92 ? x : y);
  }
  function x(b) {
    return b === 40 || b === 41 || b === 92 ? (e.consume(b), y) : y(b);
  }
}
function ki(e, n, t, i, r, l) {
  const u = this;
  let a = 0, s;
  return c;
  function c(h) {
    return e.enter(i), e.enter(r), e.consume(h), e.exit(r), e.enter(l), f;
  }
  function f(h) {
    return a > 999 || h === null || h === 91 || h === 93 && !s || // To do: remove in the future once we’ve switched from
    // `micromark-extension-footnote` to `micromark-extension-gfm-footnote`,
    // which doesn’t need this.
    // Hidden footnotes hook.
    /* c8 ignore next 3 */
    h === 94 && !a && "_hiddenFootnoteSupport" in u.parser.constructs ? t(h) : h === 93 ? (e.exit(l), e.enter(r), e.consume(h), e.exit(r), e.exit(i), n) : P(h) ? (e.enter("lineEnding"), e.consume(h), e.exit("lineEnding"), f) : (e.enter("chunkString", {
      contentType: "string"
    }), o(h));
  }
  function o(h) {
    return h === null || h === 91 || h === 93 || P(h) || a++ > 999 ? (e.exit("chunkString"), f(h)) : (e.consume(h), s || (s = !v(h)), h === 92 ? p : o);
  }
  function p(h) {
    return h === 91 || h === 92 || h === 93 ? (e.consume(h), a++, o) : o(h);
  }
}
function wi(e, n, t, i, r, l) {
  let u;
  return a;
  function a(p) {
    return p === 34 || p === 39 || p === 40 ? (e.enter(i), e.enter(r), e.consume(p), e.exit(r), u = p === 40 ? 41 : p, s) : t(p);
  }
  function s(p) {
    return p === u ? (e.enter(r), e.consume(p), e.exit(r), e.exit(i), n) : (e.enter(l), c(p));
  }
  function c(p) {
    return p === u ? (e.exit(l), s(u)) : p === null ? t(p) : P(p) ? (e.enter("lineEnding"), e.consume(p), e.exit("lineEnding"), M(e, c, "linePrefix")) : (e.enter("chunkString", {
      contentType: "string"
    }), f(p));
  }
  function f(p) {
    return p === u || p === null || P(p) ? (e.exit("chunkString"), c(p)) : (e.consume(p), p === 92 ? o : f);
  }
  function o(p) {
    return p === u || p === 92 ? (e.consume(p), f) : f(p);
  }
}
function ut(e, n) {
  let t;
  return i;
  function i(r) {
    return P(r) ? (e.enter("lineEnding"), e.consume(r), e.exit("lineEnding"), t = !0, i) : v(r) ? M(
      e,
      i,
      t ? "linePrefix" : "lineSuffix"
    )(r) : n(r);
  }
}
function de(e) {
  return e.replace(/[\t\n\r ]+/g, " ").replace(/^ | $/g, "").toLowerCase().toUpperCase();
}
const Nu = {
  name: "definition",
  tokenize: Vu
}, Hu = {
  tokenize: ju,
  partial: !0
};
function Vu(e, n, t) {
  const i = this;
  let r;
  return l;
  function l(h) {
    return e.enter("definition"), u(h);
  }
  function u(h) {
    return ki.call(
      i,
      e,
      a,
      // Note: we don’t need to reset the way `markdown-rs` does.
      t,
      "definitionLabel",
      "definitionLabelMarker",
      "definitionLabelString"
    )(h);
  }
  function a(h) {
    return r = de(
      i.sliceSerialize(i.events[i.events.length - 1][1]).slice(1, -1)
    ), h === 58 ? (e.enter("definitionMarker"), e.consume(h), e.exit("definitionMarker"), s) : t(h);
  }
  function s(h) {
    return W(h) ? ut(e, c)(h) : c(h);
  }
  function c(h) {
    return xi(
      e,
      f,
      // Note: we don’t need to reset the way `markdown-rs` does.
      t,
      "definitionDestination",
      "definitionDestinationLiteral",
      "definitionDestinationLiteralMarker",
      "definitionDestinationRaw",
      "definitionDestinationString"
    )(h);
  }
  function f(h) {
    return e.attempt(Hu, o, o)(h);
  }
  function o(h) {
    return v(h) ? M(e, p, "whitespace")(h) : p(h);
  }
  function p(h) {
    return h === null || P(h) ? (e.exit("definition"), i.parser.defined.push(r), n(h)) : t(h);
  }
}
function ju(e, n, t) {
  return i;
  function i(a) {
    return W(a) ? ut(e, r)(a) : t(a);
  }
  function r(a) {
    return wi(
      e,
      l,
      t,
      "definitionTitle",
      "definitionTitleMarker",
      "definitionTitleString"
    )(a);
  }
  function l(a) {
    return v(a) ? M(e, u, "whitespace")(a) : u(a);
  }
  function u(a) {
    return a === null || P(a) ? n(a) : t(a);
  }
}
const Uu = {
  name: "hardBreakEscape",
  tokenize: Wu
};
function Wu(e, n, t) {
  return i;
  function i(l) {
    return e.enter("hardBreakEscape"), e.consume(l), r;
  }
  function r(l) {
    return P(l) ? (e.exit("hardBreakEscape"), n(l)) : t(l);
  }
}
const $u = {
  name: "headingAtx",
  tokenize: Gu,
  resolve: qu
};
function qu(e, n) {
  let t = e.length - 2, i = 3, r, l;
  return e[i][1].type === "whitespace" && (i += 2), t - 2 > i && e[t][1].type === "whitespace" && (t -= 2), e[t][1].type === "atxHeadingSequence" && (i === t - 1 || t - 4 > i && e[t - 2][1].type === "whitespace") && (t -= i + 1 === t ? 2 : 4), t > i && (r = {
    type: "atxHeadingText",
    start: e[i][1].start,
    end: e[t][1].end
  }, l = {
    type: "chunkText",
    start: e[i][1].start,
    end: e[t][1].end,
    contentType: "text"
  }, re(e, i, t - i + 1, [
    ["enter", r, n],
    ["enter", l, n],
    ["exit", l, n],
    ["exit", r, n]
  ])), e;
}
function Gu(e, n, t) {
  let i = 0;
  return r;
  function r(f) {
    return e.enter("atxHeading"), l(f);
  }
  function l(f) {
    return e.enter("atxHeadingSequence"), u(f);
  }
  function u(f) {
    return f === 35 && i++ < 6 ? (e.consume(f), u) : f === null || W(f) ? (e.exit("atxHeadingSequence"), a(f)) : t(f);
  }
  function a(f) {
    return f === 35 ? (e.enter("atxHeadingSequence"), s(f)) : f === null || P(f) ? (e.exit("atxHeading"), n(f)) : v(f) ? M(e, a, "whitespace")(f) : (e.enter("atxHeadingText"), c(f));
  }
  function s(f) {
    return f === 35 ? (e.consume(f), s) : (e.exit("atxHeadingSequence"), a(f));
  }
  function c(f) {
    return f === null || f === 35 || W(f) ? (e.exit("atxHeadingText"), a(f)) : (e.consume(f), c);
  }
}
const Ku = [
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
  "hr",
  "html",
  "iframe",
  "legend",
  "li",
  "link",
  "main",
  "menu",
  "menuitem",
  "nav",
  "noframes",
  "ol",
  "optgroup",
  "option",
  "p",
  "param",
  "search",
  "section",
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
], Er = ["pre", "script", "style", "textarea"], Qu = {
  name: "htmlFlow",
  tokenize: Xu,
  resolveTo: Zu,
  concrete: !0
}, Yu = {
  tokenize: ta,
  partial: !0
}, Ju = {
  tokenize: ea,
  partial: !0
};
function Zu(e) {
  let n = e.length;
  for (; n-- && !(e[n][0] === "enter" && e[n][1].type === "htmlFlow"); )
    ;
  return n > 1 && e[n - 2][1].type === "linePrefix" && (e[n][1].start = e[n - 2][1].start, e[n + 1][1].start = e[n - 2][1].start, e.splice(n - 2, 2)), e;
}
function Xu(e, n, t) {
  const i = this;
  let r, l, u, a, s;
  return c;
  function c(m) {
    return f(m);
  }
  function f(m) {
    return e.enter("htmlFlow"), e.enter("htmlFlowData"), e.consume(m), o;
  }
  function o(m) {
    return m === 33 ? (e.consume(m), p) : m === 47 ? (e.consume(m), l = !0, y) : m === 63 ? (e.consume(m), r = 3, i.interrupt ? n : g) : X(m) ? (e.consume(m), u = String.fromCharCode(m), x) : t(m);
  }
  function p(m) {
    return m === 45 ? (e.consume(m), r = 2, h) : m === 91 ? (e.consume(m), r = 5, a = 0, d) : X(m) ? (e.consume(m), r = 4, i.interrupt ? n : g) : t(m);
  }
  function h(m) {
    return m === 45 ? (e.consume(m), i.interrupt ? n : g) : t(m);
  }
  function d(m) {
    const he = "CDATA[";
    return m === he.charCodeAt(a++) ? (e.consume(m), a === he.length ? i.interrupt ? n : I : d) : t(m);
  }
  function y(m) {
    return X(m) ? (e.consume(m), u = String.fromCharCode(m), x) : t(m);
  }
  function x(m) {
    if (m === null || m === 47 || m === 62 || W(m)) {
      const he = m === 47, He = u.toLowerCase();
      return !he && !l && Er.includes(He) ? (r = 1, i.interrupt ? n(m) : I(m)) : Ku.includes(u.toLowerCase()) ? (r = 6, he ? (e.consume(m), b) : i.interrupt ? n(m) : I(m)) : (r = 7, i.interrupt && !i.parser.lazy[i.now().line] ? t(m) : l ? C(m) : w(m));
    }
    return m === 45 || ne(m) ? (e.consume(m), u += String.fromCharCode(m), x) : t(m);
  }
  function b(m) {
    return m === 62 ? (e.consume(m), i.interrupt ? n : I) : t(m);
  }
  function C(m) {
    return v(m) ? (e.consume(m), C) : E(m);
  }
  function w(m) {
    return m === 47 ? (e.consume(m), E) : m === 58 || m === 95 || X(m) ? (e.consume(m), O) : v(m) ? (e.consume(m), w) : E(m);
  }
  function O(m) {
    return m === 45 || m === 46 || m === 58 || m === 95 || ne(m) ? (e.consume(m), O) : _(m);
  }
  function _(m) {
    return m === 61 ? (e.consume(m), k) : v(m) ? (e.consume(m), _) : w(m);
  }
  function k(m) {
    return m === null || m === 60 || m === 61 || m === 62 || m === 96 ? t(m) : m === 34 || m === 39 ? (e.consume(m), s = m, S) : v(m) ? (e.consume(m), k) : L(m);
  }
  function S(m) {
    return m === s ? (e.consume(m), s = null, N) : m === null || P(m) ? t(m) : (e.consume(m), S);
  }
  function L(m) {
    return m === null || m === 34 || m === 39 || m === 47 || m === 60 || m === 61 || m === 62 || m === 96 || W(m) ? _(m) : (e.consume(m), L);
  }
  function N(m) {
    return m === 47 || m === 62 || v(m) ? w(m) : t(m);
  }
  function E(m) {
    return m === 62 ? (e.consume(m), F) : t(m);
  }
  function F(m) {
    return m === null || P(m) ? I(m) : v(m) ? (e.consume(m), F) : t(m);
  }
  function I(m) {
    return m === 45 && r === 2 ? (e.consume(m), Z) : m === 60 && r === 1 ? (e.consume(m), Y) : m === 62 && r === 4 ? (e.consume(m), fe) : m === 63 && r === 3 ? (e.consume(m), g) : m === 93 && r === 5 ? (e.consume(m), we) : P(m) && (r === 6 || r === 7) ? (e.exit("htmlFlowData"), e.check(
      Yu,
      Ee,
      j
    )(m)) : m === null || P(m) ? (e.exit("htmlFlowData"), j(m)) : (e.consume(m), I);
  }
  function j(m) {
    return e.check(
      Ju,
      G,
      Ee
    )(m);
  }
  function G(m) {
    return e.enter("lineEnding"), e.consume(m), e.exit("lineEnding"), z;
  }
  function z(m) {
    return m === null || P(m) ? j(m) : (e.enter("htmlFlowData"), I(m));
  }
  function Z(m) {
    return m === 45 ? (e.consume(m), g) : I(m);
  }
  function Y(m) {
    return m === 47 ? (e.consume(m), u = "", ce) : I(m);
  }
  function ce(m) {
    if (m === 62) {
      const he = u.toLowerCase();
      return Er.includes(he) ? (e.consume(m), fe) : I(m);
    }
    return X(m) && u.length < 8 ? (e.consume(m), u += String.fromCharCode(m), ce) : I(m);
  }
  function we(m) {
    return m === 93 ? (e.consume(m), g) : I(m);
  }
  function g(m) {
    return m === 62 ? (e.consume(m), fe) : m === 45 && r === 2 ? (e.consume(m), g) : I(m);
  }
  function fe(m) {
    return m === null || P(m) ? (e.exit("htmlFlowData"), Ee(m)) : (e.consume(m), fe);
  }
  function Ee(m) {
    return e.exit("htmlFlow"), n(m);
  }
}
function ea(e, n, t) {
  const i = this;
  return r;
  function r(u) {
    return P(u) ? (e.enter("lineEnding"), e.consume(u), e.exit("lineEnding"), l) : t(u);
  }
  function l(u) {
    return i.parser.lazy[i.now().line] ? t(u) : n(u);
  }
}
function ta(e, n, t) {
  return i;
  function i(r) {
    return e.enter("lineEnding"), e.consume(r), e.exit("lineEnding"), e.attempt(ht, n, t);
  }
}
const na = {
  name: "htmlText",
  tokenize: ra
};
function ra(e, n, t) {
  const i = this;
  let r, l, u;
  return a;
  function a(g) {
    return e.enter("htmlText"), e.enter("htmlTextData"), e.consume(g), s;
  }
  function s(g) {
    return g === 33 ? (e.consume(g), c) : g === 47 ? (e.consume(g), _) : g === 63 ? (e.consume(g), w) : X(g) ? (e.consume(g), L) : t(g);
  }
  function c(g) {
    return g === 45 ? (e.consume(g), f) : g === 91 ? (e.consume(g), l = 0, d) : X(g) ? (e.consume(g), C) : t(g);
  }
  function f(g) {
    return g === 45 ? (e.consume(g), h) : t(g);
  }
  function o(g) {
    return g === null ? t(g) : g === 45 ? (e.consume(g), p) : P(g) ? (u = o, Y(g)) : (e.consume(g), o);
  }
  function p(g) {
    return g === 45 ? (e.consume(g), h) : o(g);
  }
  function h(g) {
    return g === 62 ? Z(g) : g === 45 ? p(g) : o(g);
  }
  function d(g) {
    const fe = "CDATA[";
    return g === fe.charCodeAt(l++) ? (e.consume(g), l === fe.length ? y : d) : t(g);
  }
  function y(g) {
    return g === null ? t(g) : g === 93 ? (e.consume(g), x) : P(g) ? (u = y, Y(g)) : (e.consume(g), y);
  }
  function x(g) {
    return g === 93 ? (e.consume(g), b) : y(g);
  }
  function b(g) {
    return g === 62 ? Z(g) : g === 93 ? (e.consume(g), b) : y(g);
  }
  function C(g) {
    return g === null || g === 62 ? Z(g) : P(g) ? (u = C, Y(g)) : (e.consume(g), C);
  }
  function w(g) {
    return g === null ? t(g) : g === 63 ? (e.consume(g), O) : P(g) ? (u = w, Y(g)) : (e.consume(g), w);
  }
  function O(g) {
    return g === 62 ? Z(g) : w(g);
  }
  function _(g) {
    return X(g) ? (e.consume(g), k) : t(g);
  }
  function k(g) {
    return g === 45 || ne(g) ? (e.consume(g), k) : S(g);
  }
  function S(g) {
    return P(g) ? (u = S, Y(g)) : v(g) ? (e.consume(g), S) : Z(g);
  }
  function L(g) {
    return g === 45 || ne(g) ? (e.consume(g), L) : g === 47 || g === 62 || W(g) ? N(g) : t(g);
  }
  function N(g) {
    return g === 47 ? (e.consume(g), Z) : g === 58 || g === 95 || X(g) ? (e.consume(g), E) : P(g) ? (u = N, Y(g)) : v(g) ? (e.consume(g), N) : Z(g);
  }
  function E(g) {
    return g === 45 || g === 46 || g === 58 || g === 95 || ne(g) ? (e.consume(g), E) : F(g);
  }
  function F(g) {
    return g === 61 ? (e.consume(g), I) : P(g) ? (u = F, Y(g)) : v(g) ? (e.consume(g), F) : N(g);
  }
  function I(g) {
    return g === null || g === 60 || g === 61 || g === 62 || g === 96 ? t(g) : g === 34 || g === 39 ? (e.consume(g), r = g, j) : P(g) ? (u = I, Y(g)) : v(g) ? (e.consume(g), I) : (e.consume(g), G);
  }
  function j(g) {
    return g === r ? (e.consume(g), r = void 0, z) : g === null ? t(g) : P(g) ? (u = j, Y(g)) : (e.consume(g), j);
  }
  function G(g) {
    return g === null || g === 34 || g === 39 || g === 60 || g === 61 || g === 96 ? t(g) : g === 47 || g === 62 || W(g) ? N(g) : (e.consume(g), G);
  }
  function z(g) {
    return g === 47 || g === 62 || W(g) ? N(g) : t(g);
  }
  function Z(g) {
    return g === 62 ? (e.consume(g), e.exit("htmlTextData"), e.exit("htmlText"), n) : t(g);
  }
  function Y(g) {
    return e.exit("htmlTextData"), e.enter("lineEnding"), e.consume(g), e.exit("lineEnding"), ce;
  }
  function ce(g) {
    return v(g) ? M(
      e,
      we,
      "linePrefix",
      i.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4
    )(g) : we(g);
  }
  function we(g) {
    return e.enter("htmlTextData"), u(g);
  }
}
const zn = {
  name: "labelEnd",
  tokenize: oa,
  resolveTo: sa,
  resolveAll: aa
}, ia = {
  tokenize: ca
}, la = {
  tokenize: fa
}, ua = {
  tokenize: ha
};
function aa(e) {
  let n = -1;
  for (; ++n < e.length; ) {
    const t = e[n][1];
    (t.type === "labelImage" || t.type === "labelLink" || t.type === "labelEnd") && (e.splice(n + 1, t.type === "labelImage" ? 4 : 2), t.type = "data", n++);
  }
  return e;
}
function sa(e, n) {
  let t = e.length, i = 0, r, l, u, a;
  for (; t--; )
    if (r = e[t][1], l) {
      if (r.type === "link" || r.type === "labelLink" && r._inactive)
        break;
      e[t][0] === "enter" && r.type === "labelLink" && (r._inactive = !0);
    } else if (u) {
      if (e[t][0] === "enter" && (r.type === "labelImage" || r.type === "labelLink") && !r._balanced && (l = t, r.type !== "labelLink")) {
        i = 2;
        break;
      }
    } else
      r.type === "labelEnd" && (u = t);
  const s = {
    type: e[l][1].type === "labelLink" ? "link" : "image",
    start: Object.assign({}, e[l][1].start),
    end: Object.assign({}, e[e.length - 1][1].end)
  }, c = {
    type: "label",
    start: Object.assign({}, e[l][1].start),
    end: Object.assign({}, e[u][1].end)
  }, f = {
    type: "labelText",
    start: Object.assign({}, e[l + i + 2][1].end),
    end: Object.assign({}, e[u - 2][1].start)
  };
  return a = [
    ["enter", s, n],
    ["enter", c, n]
  ], a = ue(a, e.slice(l + 1, l + i + 3)), a = ue(a, [["enter", f, n]]), a = ue(
    a,
    Bt(
      n.parser.constructs.insideSpan.null,
      e.slice(l + i + 4, u - 3),
      n
    )
  ), a = ue(a, [
    ["exit", f, n],
    e[u - 2],
    e[u - 1],
    ["exit", c, n]
  ]), a = ue(a, e.slice(u + 1)), a = ue(a, [["exit", s, n]]), re(e, l, e.length, a), e;
}
function oa(e, n, t) {
  const i = this;
  let r = i.events.length, l, u;
  for (; r--; )
    if ((i.events[r][1].type === "labelImage" || i.events[r][1].type === "labelLink") && !i.events[r][1]._balanced) {
      l = i.events[r][1];
      break;
    }
  return a;
  function a(p) {
    return l ? l._inactive ? o(p) : (u = i.parser.defined.includes(
      de(
        i.sliceSerialize({
          start: l.end,
          end: i.now()
        })
      )
    ), e.enter("labelEnd"), e.enter("labelMarker"), e.consume(p), e.exit("labelMarker"), e.exit("labelEnd"), s) : t(p);
  }
  function s(p) {
    return p === 40 ? e.attempt(
      ia,
      f,
      u ? f : o
    )(p) : p === 91 ? e.attempt(
      la,
      f,
      u ? c : o
    )(p) : u ? f(p) : o(p);
  }
  function c(p) {
    return e.attempt(
      ua,
      f,
      o
    )(p);
  }
  function f(p) {
    return n(p);
  }
  function o(p) {
    return l._balanced = !0, t(p);
  }
}
function ca(e, n, t) {
  return i;
  function i(o) {
    return e.enter("resource"), e.enter("resourceMarker"), e.consume(o), e.exit("resourceMarker"), r;
  }
  function r(o) {
    return W(o) ? ut(e, l)(o) : l(o);
  }
  function l(o) {
    return o === 41 ? f(o) : xi(
      e,
      u,
      a,
      "resourceDestination",
      "resourceDestinationLiteral",
      "resourceDestinationLiteralMarker",
      "resourceDestinationRaw",
      "resourceDestinationString",
      32
    )(o);
  }
  function u(o) {
    return W(o) ? ut(e, s)(o) : f(o);
  }
  function a(o) {
    return t(o);
  }
  function s(o) {
    return o === 34 || o === 39 || o === 40 ? wi(
      e,
      c,
      t,
      "resourceTitle",
      "resourceTitleMarker",
      "resourceTitleString"
    )(o) : f(o);
  }
  function c(o) {
    return W(o) ? ut(e, f)(o) : f(o);
  }
  function f(o) {
    return o === 41 ? (e.enter("resourceMarker"), e.consume(o), e.exit("resourceMarker"), e.exit("resource"), n) : t(o);
  }
}
function fa(e, n, t) {
  const i = this;
  return r;
  function r(a) {
    return ki.call(
      i,
      e,
      l,
      u,
      "reference",
      "referenceMarker",
      "referenceString"
    )(a);
  }
  function l(a) {
    return i.parser.defined.includes(
      de(
        i.sliceSerialize(i.events[i.events.length - 1][1]).slice(1, -1)
      )
    ) ? n(a) : t(a);
  }
  function u(a) {
    return t(a);
  }
}
function ha(e, n, t) {
  return i;
  function i(l) {
    return e.enter("reference"), e.enter("referenceMarker"), e.consume(l), e.exit("referenceMarker"), r;
  }
  function r(l) {
    return l === 93 ? (e.enter("referenceMarker"), e.consume(l), e.exit("referenceMarker"), e.exit("reference"), n) : t(l);
  }
}
const pa = {
  name: "labelStartImage",
  tokenize: da,
  resolveAll: zn.resolveAll
};
function da(e, n, t) {
  const i = this;
  return r;
  function r(a) {
    return e.enter("labelImage"), e.enter("labelImageMarker"), e.consume(a), e.exit("labelImageMarker"), l;
  }
  function l(a) {
    return a === 91 ? (e.enter("labelMarker"), e.consume(a), e.exit("labelMarker"), e.exit("labelImage"), u) : t(a);
  }
  function u(a) {
    return a === 94 && "_hiddenFootnoteSupport" in i.parser.constructs ? t(a) : n(a);
  }
}
const ga = {
  name: "labelStartLink",
  tokenize: ma,
  resolveAll: zn.resolveAll
};
function ma(e, n, t) {
  const i = this;
  return r;
  function r(u) {
    return e.enter("labelLink"), e.enter("labelMarker"), e.consume(u), e.exit("labelMarker"), e.exit("labelLink"), l;
  }
  function l(u) {
    return u === 94 && "_hiddenFootnoteSupport" in i.parser.constructs ? t(u) : n(u);
  }
}
const Yt = {
  name: "lineEnding",
  tokenize: ya
};
function ya(e, n) {
  return t;
  function t(i) {
    return e.enter("lineEnding"), e.consume(i), e.exit("lineEnding"), M(e, n, "linePrefix");
  }
}
const Ct = {
  name: "thematicBreak",
  tokenize: ba
};
function ba(e, n, t) {
  let i = 0, r;
  return l;
  function l(c) {
    return e.enter("thematicBreak"), u(c);
  }
  function u(c) {
    return r = c, a(c);
  }
  function a(c) {
    return c === r ? (e.enter("thematicBreakSequence"), s(c)) : i >= 3 && (c === null || P(c)) ? (e.exit("thematicBreak"), n(c)) : t(c);
  }
  function s(c) {
    return c === r ? (e.consume(c), i++, s) : (e.exit("thematicBreakSequence"), v(c) ? M(e, a, "whitespace")(c) : a(c));
  }
}
const te = {
  name: "list",
  tokenize: wa,
  continuation: {
    tokenize: Ea
  },
  exit: Sa
}, xa = {
  tokenize: Ca,
  partial: !0
}, ka = {
  tokenize: Aa,
  partial: !0
};
function wa(e, n, t) {
  const i = this, r = i.events[i.events.length - 1];
  let l = r && r[1].type === "linePrefix" ? r[2].sliceSerialize(r[1], !0).length : 0, u = 0;
  return a;
  function a(h) {
    const d = i.containerState.type || (h === 42 || h === 43 || h === 45 ? "listUnordered" : "listOrdered");
    if (d === "listUnordered" ? !i.containerState.marker || h === i.containerState.marker : kn(h)) {
      if (i.containerState.type || (i.containerState.type = d, e.enter(d, {
        _container: !0
      })), d === "listUnordered")
        return e.enter("listItemPrefix"), h === 42 || h === 45 ? e.check(Ct, t, c)(h) : c(h);
      if (!i.interrupt || h === 49)
        return e.enter("listItemPrefix"), e.enter("listItemValue"), s(h);
    }
    return t(h);
  }
  function s(h) {
    return kn(h) && ++u < 10 ? (e.consume(h), s) : (!i.interrupt || u < 2) && (i.containerState.marker ? h === i.containerState.marker : h === 41 || h === 46) ? (e.exit("listItemValue"), c(h)) : t(h);
  }
  function c(h) {
    return e.enter("listItemMarker"), e.consume(h), e.exit("listItemMarker"), i.containerState.marker = i.containerState.marker || h, e.check(
      ht,
      // Can’t be empty when interrupting.
      i.interrupt ? t : f,
      e.attempt(
        xa,
        p,
        o
      )
    );
  }
  function f(h) {
    return i.containerState.initialBlankLine = !0, l++, p(h);
  }
  function o(h) {
    return v(h) ? (e.enter("listItemPrefixWhitespace"), e.consume(h), e.exit("listItemPrefixWhitespace"), p) : t(h);
  }
  function p(h) {
    return i.containerState.size = l + i.sliceSerialize(e.exit("listItemPrefix"), !0).length, n(h);
  }
}
function Ea(e, n, t) {
  const i = this;
  return i.containerState._closeFlow = void 0, e.check(ht, r, l);
  function r(a) {
    return i.containerState.furtherBlankLines = i.containerState.furtherBlankLines || i.containerState.initialBlankLine, M(
      e,
      n,
      "listItemIndent",
      i.containerState.size + 1
    )(a);
  }
  function l(a) {
    return i.containerState.furtherBlankLines || !v(a) ? (i.containerState.furtherBlankLines = void 0, i.containerState.initialBlankLine = void 0, u(a)) : (i.containerState.furtherBlankLines = void 0, i.containerState.initialBlankLine = void 0, e.attempt(ka, n, u)(a));
  }
  function u(a) {
    return i.containerState._closeFlow = !0, i.interrupt = void 0, M(
      e,
      e.attempt(te, n, t),
      "linePrefix",
      i.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4
    )(a);
  }
}
function Aa(e, n, t) {
  const i = this;
  return M(
    e,
    r,
    "listItemIndent",
    i.containerState.size + 1
  );
  function r(l) {
    const u = i.events[i.events.length - 1];
    return u && u[1].type === "listItemIndent" && u[2].sliceSerialize(u[1], !0).length === i.containerState.size ? n(l) : t(l);
  }
}
function Sa(e) {
  e.exit(this.containerState.type);
}
function Ca(e, n, t) {
  const i = this;
  return M(
    e,
    r,
    "listItemPrefixWhitespace",
    i.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 5
  );
  function r(l) {
    const u = i.events[i.events.length - 1];
    return !v(l) && u && u[1].type === "listItemPrefixWhitespace" ? n(l) : t(l);
  }
}
const Ar = {
  name: "setextUnderline",
  tokenize: Fa,
  resolveTo: Ta
};
function Ta(e, n) {
  let t = e.length, i, r, l;
  for (; t--; )
    if (e[t][0] === "enter") {
      if (e[t][1].type === "content") {
        i = t;
        break;
      }
      e[t][1].type === "paragraph" && (r = t);
    } else
      e[t][1].type === "content" && e.splice(t, 1), !l && e[t][1].type === "definition" && (l = t);
  const u = {
    type: "setextHeading",
    start: Object.assign({}, e[r][1].start),
    end: Object.assign({}, e[e.length - 1][1].end)
  };
  return e[r][1].type = "setextHeadingText", l ? (e.splice(r, 0, ["enter", u, n]), e.splice(l + 1, 0, ["exit", e[i][1], n]), e[i][1].end = Object.assign({}, e[l][1].end)) : e[i][1] = u, e.push(["exit", u, n]), e;
}
function Fa(e, n, t) {
  const i = this;
  let r;
  return l;
  function l(c) {
    let f = i.events.length, o;
    for (; f--; )
      if (i.events[f][1].type !== "lineEnding" && i.events[f][1].type !== "linePrefix" && i.events[f][1].type !== "content") {
        o = i.events[f][1].type === "paragraph";
        break;
      }
    return !i.parser.lazy[i.now().line] && (i.interrupt || o) ? (e.enter("setextHeadingLine"), r = c, u(c)) : t(c);
  }
  function u(c) {
    return e.enter("setextHeadingLineSequence"), a(c);
  }
  function a(c) {
    return c === r ? (e.consume(c), a) : (e.exit("setextHeadingLineSequence"), v(c) ? M(e, s, "lineSuffix")(c) : s(c));
  }
  function s(c) {
    return c === null || P(c) ? (e.exit("setextHeadingLine"), n(c)) : t(c);
  }
}
const Oa = {
  tokenize: Ia
};
function Ia(e) {
  const n = this, t = e.attempt(
    // Try to parse a blank line.
    ht,
    i,
    // Try to parse initial flow (essentially, only code).
    e.attempt(
      this.parser.constructs.flowInitial,
      r,
      M(
        e,
        e.attempt(
          this.parser.constructs.flow,
          r,
          e.attempt(Lu, r)
        ),
        "linePrefix"
      )
    )
  );
  return t;
  function i(l) {
    if (l === null) {
      e.consume(l);
      return;
    }
    return e.enter("lineEndingBlank"), e.consume(l), e.exit("lineEndingBlank"), n.currentConstruct = void 0, t;
  }
  function r(l) {
    if (l === null) {
      e.consume(l);
      return;
    }
    return e.enter("lineEnding"), e.consume(l), e.exit("lineEnding"), n.currentConstruct = void 0, t;
  }
}
const Pa = {
  resolveAll: Ai()
}, _a = Ei("string"), Ra = Ei("text");
function Ei(e) {
  return {
    tokenize: n,
    resolveAll: Ai(
      e === "text" ? Ba : void 0
    )
  };
  function n(t) {
    const i = this, r = this.parser.constructs[e], l = t.attempt(r, u, a);
    return u;
    function u(f) {
      return c(f) ? l(f) : a(f);
    }
    function a(f) {
      if (f === null) {
        t.consume(f);
        return;
      }
      return t.enter("data"), t.consume(f), s;
    }
    function s(f) {
      return c(f) ? (t.exit("data"), l(f)) : (t.consume(f), s);
    }
    function c(f) {
      if (f === null)
        return !0;
      const o = r[f];
      let p = -1;
      if (o)
        for (; ++p < o.length; ) {
          const h = o[p];
          if (!h.previous || h.previous.call(i, i.previous))
            return !0;
        }
      return !1;
    }
  }
}
function Ai(e) {
  return n;
  function n(t, i) {
    let r = -1, l;
    for (; ++r <= t.length; )
      l === void 0 ? t[r] && t[r][1].type === "data" && (l = r, r++) : (!t[r] || t[r][1].type !== "data") && (r !== l + 2 && (t[l][1].end = t[r - 1][1].end, t.splice(l + 2, r - l - 2), r = l + 2), l = void 0);
    return e ? e(t, i) : t;
  }
}
function Ba(e, n) {
  let t = 0;
  for (; ++t <= e.length; )
    if ((t === e.length || e[t][1].type === "lineEnding") && e[t - 1][1].type === "data") {
      const i = e[t - 1][1], r = n.sliceStream(i);
      let l = r.length, u = -1, a = 0, s;
      for (; l--; ) {
        const c = r[l];
        if (typeof c == "string") {
          for (u = c.length; c.charCodeAt(u - 1) === 32; )
            a++, u--;
          if (u)
            break;
          u = -1;
        } else if (c === -2)
          s = !0, a++;
        else if (c !== -1) {
          l++;
          break;
        }
      }
      if (a) {
        const c = {
          type: t === e.length || s || a < 2 ? "lineSuffix" : "hardBreakTrailing",
          start: {
            line: i.end.line,
            column: i.end.column - a,
            offset: i.end.offset - a,
            _index: i.start._index + l,
            _bufferIndex: l ? u : i.start._bufferIndex + u
          },
          end: Object.assign({}, i.end)
        };
        i.end = Object.assign({}, c.start), i.start.offset === i.end.offset ? Object.assign(i, c) : (e.splice(
          t,
          0,
          ["enter", c, n],
          ["exit", c, n]
        ), t += 2);
      }
      t++;
    }
  return e;
}
function La(e, n, t) {
  let i = Object.assign(
    t ? Object.assign({}, t) : {
      line: 1,
      column: 1,
      offset: 0
    },
    {
      _index: 0,
      _bufferIndex: -1
    }
  );
  const r = {}, l = [];
  let u = [], a = [];
  const s = {
    consume: C,
    enter: w,
    exit: O,
    attempt: S(_),
    check: S(k),
    interrupt: S(k, {
      interrupt: !0
    })
  }, c = {
    previous: null,
    code: null,
    containerState: {},
    events: [],
    parser: e,
    sliceStream: h,
    sliceSerialize: p,
    now: d,
    defineSkip: y,
    write: o
  };
  let f = n.tokenize.call(c, s);
  return n.resolveAll && l.push(n), c;
  function o(F) {
    return u = ue(u, F), x(), u[u.length - 1] !== null ? [] : (L(n, 0), c.events = Bt(l, c.events, c), c.events);
  }
  function p(F, I) {
    return Da(h(F), I);
  }
  function h(F) {
    return va(u, F);
  }
  function d() {
    const { line: F, column: I, offset: j, _index: G, _bufferIndex: z } = i;
    return {
      line: F,
      column: I,
      offset: j,
      _index: G,
      _bufferIndex: z
    };
  }
  function y(F) {
    r[F.line] = F.column, E();
  }
  function x() {
    let F;
    for (; i._index < u.length; ) {
      const I = u[i._index];
      if (typeof I == "string")
        for (F = i._index, i._bufferIndex < 0 && (i._bufferIndex = 0); i._index === F && i._bufferIndex < I.length; )
          b(I.charCodeAt(i._bufferIndex));
      else
        b(I);
    }
  }
  function b(F) {
    f = f(F);
  }
  function C(F) {
    P(F) ? (i.line++, i.column = 1, i.offset += F === -3 ? 2 : 1, E()) : F !== -1 && (i.column++, i.offset++), i._bufferIndex < 0 ? i._index++ : (i._bufferIndex++, i._bufferIndex === u[i._index].length && (i._bufferIndex = -1, i._index++)), c.previous = F;
  }
  function w(F, I) {
    const j = I || {};
    return j.type = F, j.start = d(), c.events.push(["enter", j, c]), a.push(j), j;
  }
  function O(F) {
    const I = a.pop();
    return I.end = d(), c.events.push(["exit", I, c]), I;
  }
  function _(F, I) {
    L(F, I.from);
  }
  function k(F, I) {
    I.restore();
  }
  function S(F, I) {
    return j;
    function j(G, z, Z) {
      let Y, ce, we, g;
      return Array.isArray(G) ? Ee(G) : "tokenize" in G ? (
        // @ts-expect-error Looks like a construct.
        Ee([G])
      ) : fe(G);
      function fe(J) {
        return Ve;
        function Ve(Ie) {
          const je = Ie !== null && J[Ie], Ue = Ie !== null && J.null, Vt = [
            // To do: add more extension tests.
            /* c8 ignore next 2 */
            ...Array.isArray(je) ? je : je ? [je] : [],
            ...Array.isArray(Ue) ? Ue : Ue ? [Ue] : []
          ];
          return Ee(Vt)(Ie);
        }
      }
      function Ee(J) {
        return Y = J, ce = 0, J.length === 0 ? Z : m(J[ce]);
      }
      function m(J) {
        return Ve;
        function Ve(Ie) {
          return g = N(), we = J, J.partial || (c.currentConstruct = J), J.name && c.parser.constructs.disable.null.includes(J.name) ? He() : J.tokenize.call(
            // If we do have fields, create an object w/ `context` as its
            // prototype.
            // This allows a “live binding”, which is needed for `interrupt`.
            I ? Object.assign(Object.create(c), I) : c,
            s,
            he,
            He
          )(Ie);
        }
      }
      function he(J) {
        return F(we, g), z;
      }
      function He(J) {
        return g.restore(), ++ce < Y.length ? m(Y[ce]) : Z;
      }
    }
  }
  function L(F, I) {
    F.resolveAll && !l.includes(F) && l.push(F), F.resolve && re(
      c.events,
      I,
      c.events.length - I,
      F.resolve(c.events.slice(I), c)
    ), F.resolveTo && (c.events = F.resolveTo(c.events, c));
  }
  function N() {
    const F = d(), I = c.previous, j = c.currentConstruct, G = c.events.length, z = Array.from(a);
    return {
      restore: Z,
      from: G
    };
    function Z() {
      i = F, c.previous = I, c.currentConstruct = j, c.events.length = G, a = z, E();
    }
  }
  function E() {
    i.line in r && i.column < 2 && (i.column = r[i.line], i.offset += r[i.line] - 1);
  }
}
function va(e, n) {
  const t = n.start._index, i = n.start._bufferIndex, r = n.end._index, l = n.end._bufferIndex;
  let u;
  if (t === r)
    u = [e[t].slice(i, l)];
  else {
    if (u = e.slice(t, r), i > -1) {
      const a = u[0];
      typeof a == "string" ? u[0] = a.slice(i) : u.shift();
    }
    l > 0 && u.push(e[r].slice(0, l));
  }
  return u;
}
function Da(e, n) {
  let t = -1;
  const i = [];
  let r;
  for (; ++t < e.length; ) {
    const l = e[t];
    let u;
    if (typeof l == "string")
      u = l;
    else
      switch (l) {
        case -5: {
          u = "\r";
          break;
        }
        case -4: {
          u = `
`;
          break;
        }
        case -3: {
          u = `\r
`;
          break;
        }
        case -2: {
          u = n ? " " : "	";
          break;
        }
        case -1: {
          if (!n && r)
            continue;
          u = " ";
          break;
        }
        default:
          u = String.fromCharCode(l);
      }
    r = l === -2, i.push(u);
  }
  return i.join("");
}
const Ma = {
  42: te,
  43: te,
  45: te,
  48: te,
  49: te,
  50: te,
  51: te,
  52: te,
  53: te,
  54: te,
  55: te,
  56: te,
  57: te,
  62: gi
}, za = {
  91: Nu
}, Na = {
  [-2]: Qt,
  [-1]: Qt,
  32: Qt
}, Ha = {
  35: $u,
  42: Ct,
  45: [Ar, Ct],
  60: Qu,
  61: Ar,
  95: Ct,
  96: wr,
  126: wr
}, Va = {
  38: yi,
  92: mi
}, ja = {
  [-5]: Yt,
  [-4]: Yt,
  [-3]: Yt,
  33: pa,
  38: yi,
  42: wn,
  60: [mu, na],
  91: ga,
  92: [Uu, mi],
  93: zn,
  95: wn,
  96: Iu
}, Ua = {
  null: [wn, Pa]
}, Wa = {
  null: [42, 95]
}, $a = {
  null: []
}, qa = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  attentionMarkers: Wa,
  contentInitial: za,
  disable: $a,
  document: Ma,
  flow: Ha,
  flowInitial: Na,
  insideSpan: Ua,
  string: Va,
  text: ja
}, Symbol.toStringTag, { value: "Module" }));
function Ga(e) {
  const t = (
    /** @type {FullNormalizedExtension} */
    di([qa, ...(e || {}).extensions || []])
  ), i = {
    defined: [],
    lazy: {},
    constructs: t,
    content: r(ou),
    document: r(fu),
    flow: r(Oa),
    string: r(_a),
    text: r(Ra)
  };
  return i;
  function r(l) {
    return u;
    function u(a) {
      return La(i, l, a);
    }
  }
}
const Sr = /[\0\t\n\r]/g;
function Ka() {
  let e = 1, n = "", t = !0, i;
  return r;
  function r(l, u, a) {
    const s = [];
    let c, f, o, p, h;
    for (l = n + l.toString(u), o = 0, n = "", t && (l.charCodeAt(0) === 65279 && o++, t = void 0); o < l.length; ) {
      if (Sr.lastIndex = o, c = Sr.exec(l), p = c && c.index !== void 0 ? c.index : l.length, h = l.charCodeAt(p), !c) {
        n = l.slice(o);
        break;
      }
      if (h === 10 && o === p && i)
        s.push(-3), i = void 0;
      else
        switch (i && (s.push(-5), i = void 0), o < p && (s.push(l.slice(o, p)), e += p - o), h) {
          case 0: {
            s.push(65533), e++;
            break;
          }
          case 9: {
            for (f = Math.ceil(e / 4) * 4, s.push(-2); e++ < f; )
              s.push(-1);
            break;
          }
          case 10: {
            s.push(-4), e = 1;
            break;
          }
          default:
            i = !0, e = 1;
        }
      o = p + 1;
    }
    return a && (i && s.push(-5), n && s.push(n), s.push(null)), s;
  }
}
function Qa(e) {
  for (; !bi(e); )
    ;
  return e;
}
function Si(e, n) {
  const t = Number.parseInt(e, n);
  return (
    // C0 except for HT, LF, FF, CR, space.
    t < 9 || t === 11 || t > 13 && t < 32 || // Control character (DEL) of C0, and C1 controls.
    t > 126 && t < 160 || // Lone high surrogates and low surrogates.
    t > 55295 && t < 57344 || // Noncharacters.
    t > 64975 && t < 65008 || (t & 65535) === 65535 || (t & 65535) === 65534 || // Out of range
    t > 1114111 ? "�" : String.fromCharCode(t)
  );
}
const Ya = /\\([!-/:-@[-`{-~])|&(#(?:\d{1,7}|x[\da-f]{1,6})|[\da-z]{1,31});/gi;
function Ci(e) {
  return e.replace(Ya, Ja);
}
function Ja(e, n, t) {
  if (n)
    return n;
  if (t.charCodeAt(0) === 35) {
    const r = t.charCodeAt(1), l = r === 120 || r === 88;
    return Si(t.slice(l ? 2 : 1), l ? 16 : 10);
  }
  return Mn(t) || e;
}
const Ti = {}.hasOwnProperty, Za = (
  /**
   * @type {(
   *   ((value: Value, encoding: Encoding, options?: Options | null | undefined) => Root) &
   *   ((value: Value, options?: Options | null | undefined) => Root)
   * )}
   */
  /**
   * @param {Value} value
   * @param {Encoding | Options | null | undefined} [encoding]
   * @param {Options | null | undefined} [options]
   * @returns {Root}
   */
  function(e, n, t) {
    return typeof n != "string" && (t = n, n = void 0), Xa(t)(
      Qa(
        Ga(t).document().write(Ka()(e, n, !0))
      )
    );
  }
);
function Xa(e) {
  const n = {
    transforms: [],
    canContainEols: ["emphasis", "fragment", "heading", "paragraph", "strong"],
    enter: {
      autolink: a(Xn),
      autolinkProtocol: F,
      autolinkEmail: F,
      atxHeading: a(Yn),
      blockQuote: a(Vt),
      characterEscape: F,
      characterReference: F,
      codeFenced: a(Qn),
      codeFencedFenceInfo: s,
      codeFencedFenceMeta: s,
      codeIndented: a(Qn, s),
      codeText: a(kl, s),
      codeTextData: F,
      data: F,
      codeFlowValue: F,
      definition: a(wl),
      definitionDestinationString: s,
      definitionLabelString: s,
      definitionTitleString: s,
      emphasis: a(El),
      hardBreakEscape: a(Jn),
      hardBreakTrailing: a(Jn),
      htmlFlow: a(Zn, s),
      htmlFlowData: F,
      htmlText: a(Zn, s),
      htmlTextData: F,
      image: a(Al),
      label: s,
      link: a(Xn),
      listItem: a(Sl),
      listItemValue: d,
      listOrdered: a(er, h),
      listUnordered: a(er),
      paragraph: a(Cl),
      reference: He,
      referenceString: s,
      resourceDestinationString: s,
      resourceTitleString: s,
      setextHeading: a(Yn),
      strong: a(Tl),
      thematicBreak: a(Ol)
    },
    exit: {
      atxHeading: f(),
      atxHeadingSequence: S,
      autolink: f(),
      autolinkEmail: Ue,
      autolinkProtocol: je,
      blockQuote: f(),
      characterEscapeValue: I,
      characterReferenceMarkerHexadecimal: Ve,
      characterReferenceMarkerNumeric: Ve,
      characterReferenceValue: Ie,
      codeFenced: f(C),
      codeFencedFence: b,
      codeFencedFenceInfo: y,
      codeFencedFenceMeta: x,
      codeFlowValue: I,
      codeIndented: f(w),
      codeText: f(Y),
      codeTextData: I,
      data: I,
      definition: f(),
      definitionDestinationString: k,
      definitionLabelString: O,
      definitionTitleString: _,
      emphasis: f(),
      hardBreakEscape: f(G),
      hardBreakTrailing: f(G),
      htmlFlow: f(z),
      htmlFlowData: I,
      htmlText: f(Z),
      htmlTextData: I,
      image: f(we),
      label: fe,
      labelText: g,
      lineEnding: j,
      link: f(ce),
      listItem: f(),
      listOrdered: f(),
      listUnordered: f(),
      paragraph: f(),
      referenceString: J,
      resourceDestinationString: Ee,
      resourceTitleString: m,
      resource: he,
      setextHeading: f(E),
      setextHeadingLineSequence: N,
      setextHeadingText: L,
      strong: f(),
      thematicBreak: f()
    }
  };
  Fi(n, (e || {}).mdastExtensions || []);
  const t = {};
  return i;
  function i(A) {
    let T = {
      type: "root",
      children: []
    };
    const B = {
      stack: [T],
      tokenStack: [],
      config: n,
      enter: c,
      exit: o,
      buffer: s,
      resume: p,
      setData: l,
      getData: u
    }, H = [];
    let U = -1;
    for (; ++U < A.length; )
      if (A[U][1].type === "listOrdered" || A[U][1].type === "listUnordered")
        if (A[U][0] === "enter")
          H.push(U);
        else {
          const pe = H.pop();
          U = r(A, pe, U);
        }
    for (U = -1; ++U < A.length; ) {
      const pe = n[A[U][0]];
      Ti.call(pe, A[U][1].type) && pe[A[U][1].type].call(
        Object.assign(
          {
            sliceSerialize: A[U][2].sliceSerialize
          },
          B
        ),
        A[U][1]
      );
    }
    if (B.tokenStack.length > 0) {
      const pe = B.tokenStack[B.tokenStack.length - 1];
      (pe[1] || Cr).call(B, void 0, pe[0]);
    }
    for (T.position = {
      start: _e(
        A.length > 0 ? A[0][1].start : {
          line: 1,
          column: 1,
          offset: 0
        }
      ),
      end: _e(
        A.length > 0 ? A[A.length - 2][1].end : {
          line: 1,
          column: 1,
          offset: 0
        }
      )
    }, U = -1; ++U < n.transforms.length; )
      T = n.transforms[U](T) || T;
    return T;
  }
  function r(A, T, B) {
    let H = T - 1, U = -1, pe = !1, Pe, Ae, et, tt;
    for (; ++H <= B; ) {
      const K = A[H];
      if (K[1].type === "listUnordered" || K[1].type === "listOrdered" || K[1].type === "blockQuote" ? (K[0] === "enter" ? U++ : U--, tt = void 0) : K[1].type === "lineEndingBlank" ? K[0] === "enter" && (Pe && !tt && !U && !et && (et = H), tt = void 0) : K[1].type === "linePrefix" || K[1].type === "listItemValue" || K[1].type === "listItemMarker" || K[1].type === "listItemPrefix" || K[1].type === "listItemPrefixWhitespace" || (tt = void 0), !U && K[0] === "enter" && K[1].type === "listItemPrefix" || U === -1 && K[0] === "exit" && (K[1].type === "listUnordered" || K[1].type === "listOrdered")) {
        if (Pe) {
          let jt = H;
          for (Ae = void 0; jt--; ) {
            const Se = A[jt];
            if (Se[1].type === "lineEnding" || Se[1].type === "lineEndingBlank") {
              if (Se[0] === "exit")
                continue;
              Ae && (A[Ae][1].type = "lineEndingBlank", pe = !0), Se[1].type = "lineEnding", Ae = jt;
            } else if (!(Se[1].type === "linePrefix" || Se[1].type === "blockQuotePrefix" || Se[1].type === "blockQuotePrefixWhitespace" || Se[1].type === "blockQuoteMarker" || Se[1].type === "listItemIndent"))
              break;
          }
          et && (!Ae || et < Ae) && (Pe._spread = !0), Pe.end = Object.assign(
            {},
            Ae ? A[Ae][1].start : K[1].end
          ), A.splice(Ae || H, 0, ["exit", Pe, K[2]]), H++, B++;
        }
        K[1].type === "listItemPrefix" && (Pe = {
          type: "listItem",
          _spread: !1,
          start: Object.assign({}, K[1].start),
          // @ts-expect-error: we’ll add `end` in a second.
          end: void 0
        }, A.splice(H, 0, ["enter", Pe, K[2]]), H++, B++, et = void 0, tt = !0);
      }
    }
    return A[T][1]._spread = pe, B;
  }
  function l(A, T) {
    t[A] = T;
  }
  function u(A) {
    return t[A];
  }
  function a(A, T) {
    return B;
    function B(H) {
      c.call(this, A(H), H), T && T.call(this, H);
    }
  }
  function s() {
    this.stack.push({
      type: "fragment",
      children: []
    });
  }
  function c(A, T, B) {
    return this.stack[this.stack.length - 1].children.push(A), this.stack.push(A), this.tokenStack.push([T, B]), A.position = {
      start: _e(T.start)
    }, A;
  }
  function f(A) {
    return T;
    function T(B) {
      A && A.call(this, B), o.call(this, B);
    }
  }
  function o(A, T) {
    const B = this.stack.pop(), H = this.tokenStack.pop();
    if (H)
      H[0].type !== A.type && (T ? T.call(this, A, H[0]) : (H[1] || Cr).call(this, A, H[0]));
    else
      throw new Error(
        "Cannot close `" + A.type + "` (" + lt({
          start: A.start,
          end: A.end
        }) + "): it’s not open"
      );
    return B.position.end = _e(A.end), B;
  }
  function p() {
    return tu(this.stack.pop());
  }
  function h() {
    l("expectingFirstListItemValue", !0);
  }
  function d(A) {
    if (u("expectingFirstListItemValue")) {
      const T = this.stack[this.stack.length - 2];
      T.start = Number.parseInt(this.sliceSerialize(A), 10), l("expectingFirstListItemValue");
    }
  }
  function y() {
    const A = this.resume(), T = this.stack[this.stack.length - 1];
    T.lang = A;
  }
  function x() {
    const A = this.resume(), T = this.stack[this.stack.length - 1];
    T.meta = A;
  }
  function b() {
    u("flowCodeInside") || (this.buffer(), l("flowCodeInside", !0));
  }
  function C() {
    const A = this.resume(), T = this.stack[this.stack.length - 1];
    T.value = A.replace(/^(\r?\n|\r)|(\r?\n|\r)$/g, ""), l("flowCodeInside");
  }
  function w() {
    const A = this.resume(), T = this.stack[this.stack.length - 1];
    T.value = A.replace(/(\r?\n|\r)$/g, "");
  }
  function O(A) {
    const T = this.resume(), B = this.stack[this.stack.length - 1];
    B.label = T, B.identifier = de(
      this.sliceSerialize(A)
    ).toLowerCase();
  }
  function _() {
    const A = this.resume(), T = this.stack[this.stack.length - 1];
    T.title = A;
  }
  function k() {
    const A = this.resume(), T = this.stack[this.stack.length - 1];
    T.url = A;
  }
  function S(A) {
    const T = this.stack[this.stack.length - 1];
    if (!T.depth) {
      const B = this.sliceSerialize(A).length;
      T.depth = B;
    }
  }
  function L() {
    l("setextHeadingSlurpLineEnding", !0);
  }
  function N(A) {
    const T = this.stack[this.stack.length - 1];
    T.depth = this.sliceSerialize(A).charCodeAt(0) === 61 ? 1 : 2;
  }
  function E() {
    l("setextHeadingSlurpLineEnding");
  }
  function F(A) {
    const T = this.stack[this.stack.length - 1];
    let B = T.children[T.children.length - 1];
    (!B || B.type !== "text") && (B = Fl(), B.position = {
      start: _e(A.start)
    }, T.children.push(B)), this.stack.push(B);
  }
  function I(A) {
    const T = this.stack.pop();
    T.value += this.sliceSerialize(A), T.position.end = _e(A.end);
  }
  function j(A) {
    const T = this.stack[this.stack.length - 1];
    if (u("atHardBreak")) {
      const B = T.children[T.children.length - 1];
      B.position.end = _e(A.end), l("atHardBreak");
      return;
    }
    !u("setextHeadingSlurpLineEnding") && n.canContainEols.includes(T.type) && (F.call(this, A), I.call(this, A));
  }
  function G() {
    l("atHardBreak", !0);
  }
  function z() {
    const A = this.resume(), T = this.stack[this.stack.length - 1];
    T.value = A;
  }
  function Z() {
    const A = this.resume(), T = this.stack[this.stack.length - 1];
    T.value = A;
  }
  function Y() {
    const A = this.resume(), T = this.stack[this.stack.length - 1];
    T.value = A;
  }
  function ce() {
    const A = this.stack[this.stack.length - 1];
    if (u("inReference")) {
      const T = u("referenceType") || "shortcut";
      A.type += "Reference", A.referenceType = T, delete A.url, delete A.title;
    } else
      delete A.identifier, delete A.label;
    l("referenceType");
  }
  function we() {
    const A = this.stack[this.stack.length - 1];
    if (u("inReference")) {
      const T = u("referenceType") || "shortcut";
      A.type += "Reference", A.referenceType = T, delete A.url, delete A.title;
    } else
      delete A.identifier, delete A.label;
    l("referenceType");
  }
  function g(A) {
    const T = this.sliceSerialize(A), B = this.stack[this.stack.length - 2];
    B.label = Ci(T), B.identifier = de(T).toLowerCase();
  }
  function fe() {
    const A = this.stack[this.stack.length - 1], T = this.resume(), B = this.stack[this.stack.length - 1];
    if (l("inReference", !0), B.type === "link") {
      const H = A.children;
      B.children = H;
    } else
      B.alt = T;
  }
  function Ee() {
    const A = this.resume(), T = this.stack[this.stack.length - 1];
    T.url = A;
  }
  function m() {
    const A = this.resume(), T = this.stack[this.stack.length - 1];
    T.title = A;
  }
  function he() {
    l("inReference");
  }
  function He() {
    l("referenceType", "collapsed");
  }
  function J(A) {
    const T = this.resume(), B = this.stack[this.stack.length - 1];
    B.label = T, B.identifier = de(
      this.sliceSerialize(A)
    ).toLowerCase(), l("referenceType", "full");
  }
  function Ve(A) {
    l("characterReferenceType", A.type);
  }
  function Ie(A) {
    const T = this.sliceSerialize(A), B = u("characterReferenceType");
    let H;
    B ? (H = Si(
      T,
      B === "characterReferenceMarkerNumeric" ? 10 : 16
    ), l("characterReferenceType")) : H = Mn(T);
    const U = this.stack.pop();
    U.value += H, U.position.end = _e(A.end);
  }
  function je(A) {
    I.call(this, A);
    const T = this.stack[this.stack.length - 1];
    T.url = this.sliceSerialize(A);
  }
  function Ue(A) {
    I.call(this, A);
    const T = this.stack[this.stack.length - 1];
    T.url = "mailto:" + this.sliceSerialize(A);
  }
  function Vt() {
    return {
      type: "blockquote",
      children: []
    };
  }
  function Qn() {
    return {
      type: "code",
      lang: null,
      meta: null,
      value: ""
    };
  }
  function kl() {
    return {
      type: "inlineCode",
      value: ""
    };
  }
  function wl() {
    return {
      type: "definition",
      identifier: "",
      label: null,
      title: null,
      url: ""
    };
  }
  function El() {
    return {
      type: "emphasis",
      children: []
    };
  }
  function Yn() {
    return {
      type: "heading",
      depth: void 0,
      children: []
    };
  }
  function Jn() {
    return {
      type: "break"
    };
  }
  function Zn() {
    return {
      type: "html",
      value: ""
    };
  }
  function Al() {
    return {
      type: "image",
      title: null,
      url: "",
      alt: null
    };
  }
  function Xn() {
    return {
      type: "link",
      title: null,
      url: "",
      children: []
    };
  }
  function er(A) {
    return {
      type: "list",
      ordered: A.type === "listOrdered",
      start: null,
      spread: A._spread,
      children: []
    };
  }
  function Sl(A) {
    return {
      type: "listItem",
      spread: A._spread,
      checked: null,
      children: []
    };
  }
  function Cl() {
    return {
      type: "paragraph",
      children: []
    };
  }
  function Tl() {
    return {
      type: "strong",
      children: []
    };
  }
  function Fl() {
    return {
      type: "text",
      value: ""
    };
  }
  function Ol() {
    return {
      type: "thematicBreak"
    };
  }
}
function _e(e) {
  return {
    line: e.line,
    column: e.column,
    offset: e.offset
  };
}
function Fi(e, n) {
  let t = -1;
  for (; ++t < n.length; ) {
    const i = n[t];
    Array.isArray(i) ? Fi(e, i) : es(e, i);
  }
}
function es(e, n) {
  let t;
  for (t in n)
    if (Ti.call(n, t)) {
      if (t === "canContainEols") {
        const i = n[t];
        i && e[t].push(...i);
      } else if (t === "transforms") {
        const i = n[t];
        i && e[t].push(...i);
      } else if (t === "enter" || t === "exit") {
        const i = n[t];
        i && Object.assign(e[t], i);
      }
    }
}
function Cr(e, n) {
  throw e ? new Error(
    "Cannot close `" + e.type + "` (" + lt({
      start: e.start,
      end: e.end
    }) + "): a different token (`" + n.type + "`, " + lt({
      start: n.start,
      end: n.end
    }) + ") is open"
  ) : new Error(
    "Cannot close document, a token (`" + n.type + "`, " + lt({
      start: n.start,
      end: n.end
    }) + ") is still open"
  );
}
function ts(e) {
  Object.assign(this, { Parser: (t) => {
    const i = (
      /** @type {Options} */
      this.data("settings")
    );
    return Za(
      t,
      Object.assign({}, i, e, {
        // Note: these options are not in the readme.
        // The goal is for them to be set by plugins on `data` instead of being
        // passed by users.
        extensions: this.data("micromarkExtensions") || [],
        mdastExtensions: this.data("fromMarkdownExtensions") || []
      })
    );
  } });
}
const ns = {
  tokenize: ss,
  partial: !0
}, Oi = {
  tokenize: os,
  partial: !0
}, Ii = {
  tokenize: cs,
  partial: !0
}, Pi = {
  tokenize: fs,
  partial: !0
}, rs = {
  tokenize: hs,
  partial: !0
}, _i = {
  tokenize: us,
  previous: Bi
}, Ri = {
  tokenize: as,
  previous: Li
}, Fe = {
  tokenize: ls,
  previous: vi
}, ke = {}, is = {
  text: ke
};
let De = 48;
for (; De < 123; )
  ke[De] = Fe, De++, De === 58 ? De = 65 : De === 91 && (De = 97);
ke[43] = Fe;
ke[45] = Fe;
ke[46] = Fe;
ke[95] = Fe;
ke[72] = [Fe, Ri];
ke[104] = [Fe, Ri];
ke[87] = [Fe, _i];
ke[119] = [Fe, _i];
function ls(e, n, t) {
  const i = this;
  let r, l;
  return u;
  function u(o) {
    return !En(o) || !vi.call(i, i.previous) || Nn(i.events) ? t(o) : (e.enter("literalAutolink"), e.enter("literalAutolinkEmail"), a(o));
  }
  function a(o) {
    return En(o) ? (e.consume(o), a) : o === 64 ? (e.consume(o), s) : t(o);
  }
  function s(o) {
    return o === 46 ? e.check(
      rs,
      f,
      c
    )(o) : o === 45 || o === 95 || ne(o) ? (l = !0, e.consume(o), s) : f(o);
  }
  function c(o) {
    return e.consume(o), r = !0, s;
  }
  function f(o) {
    return l && r && X(i.previous) ? (e.exit("literalAutolinkEmail"), e.exit("literalAutolink"), n(o)) : t(o);
  }
}
function us(e, n, t) {
  const i = this;
  return r;
  function r(u) {
    return u !== 87 && u !== 119 || !Bi.call(i, i.previous) || Nn(i.events) ? t(u) : (e.enter("literalAutolink"), e.enter("literalAutolinkWww"), e.check(
      ns,
      e.attempt(Oi, e.attempt(Ii, l), t),
      t
    )(u));
  }
  function l(u) {
    return e.exit("literalAutolinkWww"), e.exit("literalAutolink"), n(u);
  }
}
function as(e, n, t) {
  const i = this;
  let r = "", l = !1;
  return u;
  function u(o) {
    return (o === 72 || o === 104) && Li.call(i, i.previous) && !Nn(i.events) ? (e.enter("literalAutolink"), e.enter("literalAutolinkHttp"), r += String.fromCodePoint(o), e.consume(o), a) : t(o);
  }
  function a(o) {
    if (X(o) && r.length < 5)
      return r += String.fromCodePoint(o), e.consume(o), a;
    if (o === 58) {
      const p = r.toLowerCase();
      if (p === "http" || p === "https")
        return e.consume(o), s;
    }
    return t(o);
  }
  function s(o) {
    return o === 47 ? (e.consume(o), l ? c : (l = !0, s)) : t(o);
  }
  function c(o) {
    return o === null || Ft(o) || W(o) || Ne(o) || Rt(o) ? t(o) : e.attempt(Oi, e.attempt(Ii, f), t)(o);
  }
  function f(o) {
    return e.exit("literalAutolinkHttp"), e.exit("literalAutolink"), n(o);
  }
}
function ss(e, n, t) {
  let i = 0;
  return r;
  function r(u) {
    return (u === 87 || u === 119) && i < 3 ? (i++, e.consume(u), r) : u === 46 && i === 3 ? (e.consume(u), l) : t(u);
  }
  function l(u) {
    return u === null ? t(u) : n(u);
  }
}
function os(e, n, t) {
  let i, r, l;
  return u;
  function u(c) {
    return c === 46 || c === 95 ? e.check(Pi, s, a)(c) : c === null || W(c) || Ne(c) || c !== 45 && Rt(c) ? s(c) : (l = !0, e.consume(c), u);
  }
  function a(c) {
    return c === 95 ? i = !0 : (r = i, i = void 0), e.consume(c), u;
  }
  function s(c) {
    return r || i || !l ? t(c) : n(c);
  }
}
function cs(e, n) {
  let t = 0, i = 0;
  return r;
  function r(u) {
    return u === 40 ? (t++, e.consume(u), r) : u === 41 && i < t ? l(u) : u === 33 || u === 34 || u === 38 || u === 39 || u === 41 || u === 42 || u === 44 || u === 46 || u === 58 || u === 59 || u === 60 || u === 63 || u === 93 || u === 95 || u === 126 ? e.check(Pi, n, l)(u) : u === null || W(u) || Ne(u) ? n(u) : (e.consume(u), r);
  }
  function l(u) {
    return u === 41 && i++, e.consume(u), r;
  }
}
function fs(e, n, t) {
  return i;
  function i(a) {
    return a === 33 || a === 34 || a === 39 || a === 41 || a === 42 || a === 44 || a === 46 || a === 58 || a === 59 || a === 63 || a === 95 || a === 126 ? (e.consume(a), i) : a === 38 ? (e.consume(a), l) : a === 93 ? (e.consume(a), r) : (
      // `<` is an end.
      a === 60 || // So is whitespace.
      a === null || W(a) || Ne(a) ? n(a) : t(a)
    );
  }
  function r(a) {
    return a === null || a === 40 || a === 91 || W(a) || Ne(a) ? n(a) : i(a);
  }
  function l(a) {
    return X(a) ? u(a) : t(a);
  }
  function u(a) {
    return a === 59 ? (e.consume(a), i) : X(a) ? (e.consume(a), u) : t(a);
  }
}
function hs(e, n, t) {
  return i;
  function i(l) {
    return e.consume(l), r;
  }
  function r(l) {
    return ne(l) ? t(l) : n(l);
  }
}
function Bi(e) {
  return e === null || e === 40 || e === 42 || e === 95 || e === 91 || e === 93 || e === 126 || W(e);
}
function Li(e) {
  return !X(e);
}
function vi(e) {
  return !(e === 47 || En(e));
}
function En(e) {
  return e === 43 || e === 45 || e === 46 || e === 95 || ne(e);
}
function Nn(e) {
  let n = e.length, t = !1;
  for (; n--; ) {
    const i = e[n][1];
    if ((i.type === "labelLink" || i.type === "labelImage") && !i._balanced) {
      t = !0;
      break;
    }
    if (i._gfmAutolinkLiteralWalkedInto) {
      t = !1;
      break;
    }
  }
  return e.length > 0 && !t && (e[e.length - 1][1]._gfmAutolinkLiteralWalkedInto = !0), t;
}
const ps = {
  tokenize: ws,
  partial: !0
};
function ds() {
  return {
    document: {
      91: {
        tokenize: bs,
        continuation: {
          tokenize: xs
        },
        exit: ks
      }
    },
    text: {
      91: {
        tokenize: ys
      },
      93: {
        add: "after",
        tokenize: gs,
        resolveTo: ms
      }
    }
  };
}
function gs(e, n, t) {
  const i = this;
  let r = i.events.length;
  const l = i.parser.gfmFootnotes || (i.parser.gfmFootnotes = []);
  let u;
  for (; r--; ) {
    const s = i.events[r][1];
    if (s.type === "labelImage") {
      u = s;
      break;
    }
    if (s.type === "gfmFootnoteCall" || s.type === "labelLink" || s.type === "label" || s.type === "image" || s.type === "link")
      break;
  }
  return a;
  function a(s) {
    if (!u || !u._balanced)
      return t(s);
    const c = de(
      i.sliceSerialize({
        start: u.end,
        end: i.now()
      })
    );
    return c.codePointAt(0) !== 94 || !l.includes(c.slice(1)) ? t(s) : (e.enter("gfmFootnoteCallLabelMarker"), e.consume(s), e.exit("gfmFootnoteCallLabelMarker"), n(s));
  }
}
function ms(e, n) {
  let t = e.length;
  for (; t--; )
    if (e[t][1].type === "labelImage" && e[t][0] === "enter") {
      e[t][1];
      break;
    }
  e[t + 1][1].type = "data", e[t + 3][1].type = "gfmFootnoteCallLabelMarker";
  const i = {
    type: "gfmFootnoteCall",
    start: Object.assign({}, e[t + 3][1].start),
    end: Object.assign({}, e[e.length - 1][1].end)
  }, r = {
    type: "gfmFootnoteCallMarker",
    start: Object.assign({}, e[t + 3][1].end),
    end: Object.assign({}, e[t + 3][1].end)
  };
  r.end.column++, r.end.offset++, r.end._bufferIndex++;
  const l = {
    type: "gfmFootnoteCallString",
    start: Object.assign({}, r.end),
    end: Object.assign({}, e[e.length - 1][1].start)
  }, u = {
    type: "chunkString",
    contentType: "string",
    start: Object.assign({}, l.start),
    end: Object.assign({}, l.end)
  }, a = [
    // Take the `labelImageMarker` (now `data`, the `!`)
    e[t + 1],
    e[t + 2],
    ["enter", i, n],
    // The `[`
    e[t + 3],
    e[t + 4],
    // The `^`.
    ["enter", r, n],
    ["exit", r, n],
    // Everything in between.
    ["enter", l, n],
    ["enter", u, n],
    ["exit", u, n],
    ["exit", l, n],
    // The ending (`]`, properly parsed and labelled).
    e[e.length - 2],
    e[e.length - 1],
    ["exit", i, n]
  ];
  return e.splice(t, e.length - t + 1, ...a), e;
}
function ys(e, n, t) {
  const i = this, r = i.parser.gfmFootnotes || (i.parser.gfmFootnotes = []);
  let l = 0, u;
  return a;
  function a(o) {
    return e.enter("gfmFootnoteCall"), e.enter("gfmFootnoteCallLabelMarker"), e.consume(o), e.exit("gfmFootnoteCallLabelMarker"), s;
  }
  function s(o) {
    return o !== 94 ? t(o) : (e.enter("gfmFootnoteCallMarker"), e.consume(o), e.exit("gfmFootnoteCallMarker"), e.enter("gfmFootnoteCallString"), e.enter("chunkString").contentType = "string", c);
  }
  function c(o) {
    if (
      // Too long.
      l > 999 || // Closing brace with nothing.
      o === 93 && !u || // Space or tab is not supported by GFM for some reason.
      // `\n` and `[` not being supported makes sense.
      o === null || o === 91 || W(o)
    )
      return t(o);
    if (o === 93) {
      e.exit("chunkString");
      const p = e.exit("gfmFootnoteCallString");
      return r.includes(de(i.sliceSerialize(p))) ? (e.enter("gfmFootnoteCallLabelMarker"), e.consume(o), e.exit("gfmFootnoteCallLabelMarker"), e.exit("gfmFootnoteCall"), n) : t(o);
    }
    return W(o) || (u = !0), l++, e.consume(o), o === 92 ? f : c;
  }
  function f(o) {
    return o === 91 || o === 92 || o === 93 ? (e.consume(o), l++, c) : c(o);
  }
}
function bs(e, n, t) {
  const i = this, r = i.parser.gfmFootnotes || (i.parser.gfmFootnotes = []);
  let l, u = 0, a;
  return s;
  function s(d) {
    return e.enter("gfmFootnoteDefinition")._container = !0, e.enter("gfmFootnoteDefinitionLabel"), e.enter("gfmFootnoteDefinitionLabelMarker"), e.consume(d), e.exit("gfmFootnoteDefinitionLabelMarker"), c;
  }
  function c(d) {
    return d === 94 ? (e.enter("gfmFootnoteDefinitionMarker"), e.consume(d), e.exit("gfmFootnoteDefinitionMarker"), e.enter("gfmFootnoteDefinitionLabelString"), e.enter("chunkString").contentType = "string", f) : t(d);
  }
  function f(d) {
    if (
      // Too long.
      u > 999 || // Closing brace with nothing.
      d === 93 && !a || // Space or tab is not supported by GFM for some reason.
      // `\n` and `[` not being supported makes sense.
      d === null || d === 91 || W(d)
    )
      return t(d);
    if (d === 93) {
      e.exit("chunkString");
      const y = e.exit("gfmFootnoteDefinitionLabelString");
      return l = de(i.sliceSerialize(y)), e.enter("gfmFootnoteDefinitionLabelMarker"), e.consume(d), e.exit("gfmFootnoteDefinitionLabelMarker"), e.exit("gfmFootnoteDefinitionLabel"), p;
    }
    return W(d) || (a = !0), u++, e.consume(d), d === 92 ? o : f;
  }
  function o(d) {
    return d === 91 || d === 92 || d === 93 ? (e.consume(d), u++, f) : f(d);
  }
  function p(d) {
    return d === 58 ? (e.enter("definitionMarker"), e.consume(d), e.exit("definitionMarker"), r.includes(l) || r.push(l), M(
      e,
      h,
      "gfmFootnoteDefinitionWhitespace"
    )) : t(d);
  }
  function h(d) {
    return n(d);
  }
}
function xs(e, n, t) {
  return e.check(ht, n, e.attempt(ps, n, t));
}
function ks(e) {
  e.exit("gfmFootnoteDefinition");
}
function ws(e, n, t) {
  const i = this;
  return M(
    e,
    r,
    "gfmFootnoteDefinitionIndent",
    5
  );
  function r(l) {
    const u = i.events[i.events.length - 1];
    return u && u[1].type === "gfmFootnoteDefinitionIndent" && u[2].sliceSerialize(u[1], !0).length === 4 ? n(l) : t(l);
  }
}
function Es(e) {
  let t = (e || {}).singleTilde;
  const i = {
    tokenize: l,
    resolveAll: r
  };
  return t == null && (t = !0), {
    text: {
      126: i
    },
    insideSpan: {
      null: [i]
    },
    attentionMarkers: {
      null: [126]
    }
  };
  function r(u, a) {
    let s = -1;
    for (; ++s < u.length; )
      if (u[s][0] === "enter" && u[s][1].type === "strikethroughSequenceTemporary" && u[s][1]._close) {
        let c = s;
        for (; c--; )
          if (u[c][0] === "exit" && u[c][1].type === "strikethroughSequenceTemporary" && u[c][1]._open && // If the sizes are the same:
          u[s][1].end.offset - u[s][1].start.offset === u[c][1].end.offset - u[c][1].start.offset) {
            u[s][1].type = "strikethroughSequence", u[c][1].type = "strikethroughSequence";
            const f = {
              type: "strikethrough",
              start: Object.assign({}, u[c][1].start),
              end: Object.assign({}, u[s][1].end)
            }, o = {
              type: "strikethroughText",
              start: Object.assign({}, u[c][1].end),
              end: Object.assign({}, u[s][1].start)
            }, p = [
              ["enter", f, a],
              ["enter", u[c][1], a],
              ["exit", u[c][1], a],
              ["enter", o, a]
            ], h = a.parser.constructs.insideSpan.null;
            h && re(
              p,
              p.length,
              0,
              Bt(h, u.slice(c + 1, s), a)
            ), re(p, p.length, 0, [
              ["exit", o, a],
              ["enter", u[s][1], a],
              ["exit", u[s][1], a],
              ["exit", f, a]
            ]), re(u, c - 1, s - c + 3, p), s = c + p.length - 2;
            break;
          }
      }
    for (s = -1; ++s < u.length; )
      u[s][1].type === "strikethroughSequenceTemporary" && (u[s][1].type = "data");
    return u;
  }
  function l(u, a, s) {
    const c = this.previous, f = this.events;
    let o = 0;
    return p;
    function p(d) {
      return c === 126 && f[f.length - 1][1].type !== "characterEscape" ? s(d) : (u.enter("strikethroughSequenceTemporary"), h(d));
    }
    function h(d) {
      const y = Ot(c);
      if (d === 126)
        return o > 1 ? s(d) : (u.consume(d), o++, h);
      if (o < 2 && !t)
        return s(d);
      const x = u.exit("strikethroughSequenceTemporary"), b = Ot(d);
      return x._open = !b || b === 2 && !!y, x._close = !y || y === 2 && !!b, a(d);
    }
  }
}
class As {
  /**
   * Create a new edit map.
   */
  constructor() {
    this.map = [];
  }
  /**
   * Create an edit: a remove and/or add at a certain place.
   *
   * @param {number} index
   * @param {number} remove
   * @param {Array<Event>} add
   * @returns {void}
   */
  add(n, t, i) {
    Ss(this, n, t, i);
  }
  // To do: not used here.
  // /**
  //  * Create an edit: but insert `add` before existing additions.
  //  *
  //  * @param {number} index
  //  * @param {number} remove
  //  * @param {Array<Event>} add
  //  * @returns {void}
  //  */
  // addBefore(index, remove, add) {
  //   addImpl(this, index, remove, add, true)
  // }
  /**
   * Done, change the events.
   *
   * @param {Array<Event>} events
   * @returns {void}
   */
  consume(n) {
    if (this.map.sort((l, u) => l[0] - u[0]), this.map.length === 0)
      return;
    let t = this.map.length;
    const i = [];
    for (; t > 0; )
      t -= 1, i.push(n.slice(this.map[t][0] + this.map[t][1])), i.push(this.map[t][2]), n.length = this.map[t][0];
    i.push([...n]), n.length = 0;
    let r = i.pop();
    for (; r; )
      n.push(...r), r = i.pop();
    this.map.length = 0;
  }
}
function Ss(e, n, t, i) {
  let r = 0;
  if (!(t === 0 && i.length === 0)) {
    for (; r < e.map.length; ) {
      if (e.map[r][0] === n) {
        e.map[r][1] += t, e.map[r][2].push(...i);
        return;
      }
      r += 1;
    }
    e.map.push([n, t, i]);
  }
}
function Cs(e, n) {
  let t = !1;
  const i = [];
  for (; n < e.length; ) {
    const r = e[n];
    if (t) {
      if (r[0] === "enter")
        r[1].type === "tableContent" && i.push(
          e[n + 1][1].type === "tableDelimiterMarker" ? "left" : "none"
        );
      else if (r[1].type === "tableContent") {
        if (e[n - 1][1].type === "tableDelimiterMarker") {
          const l = i.length - 1;
          i[l] = i[l] === "left" ? "center" : "right";
        }
      } else if (r[1].type === "tableDelimiterRow")
        break;
    } else
      r[0] === "enter" && r[1].type === "tableDelimiterRow" && (t = !0);
    n += 1;
  }
  return i;
}
const Ts = {
  flow: {
    null: {
      tokenize: Fs,
      resolveAll: Os
    }
  }
};
function Fs(e, n, t) {
  const i = this;
  let r = 0, l = 0, u;
  return a;
  function a(E) {
    let F = i.events.length - 1;
    for (; F > -1; ) {
      const G = i.events[F][1].type;
      if (G === "lineEnding" || // Note: markdown-rs uses `whitespace` instead of `linePrefix`
      G === "linePrefix")
        F--;
      else
        break;
    }
    const I = F > -1 ? i.events[F][1].type : null, j = I === "tableHead" || I === "tableRow" ? k : s;
    return j === k && i.parser.lazy[i.now().line] ? t(E) : j(E);
  }
  function s(E) {
    return e.enter("tableHead"), e.enter("tableRow"), c(E);
  }
  function c(E) {
    return E === 124 || (u = !0, l += 1), f(E);
  }
  function f(E) {
    return E === null ? t(E) : P(E) ? l > 1 ? (l = 0, i.interrupt = !0, e.exit("tableRow"), e.enter("lineEnding"), e.consume(E), e.exit("lineEnding"), h) : t(E) : v(E) ? M(e, f, "whitespace")(E) : (l += 1, u && (u = !1, r += 1), E === 124 ? (e.enter("tableCellDivider"), e.consume(E), e.exit("tableCellDivider"), u = !0, f) : (e.enter("data"), o(E)));
  }
  function o(E) {
    return E === null || E === 124 || W(E) ? (e.exit("data"), f(E)) : (e.consume(E), E === 92 ? p : o);
  }
  function p(E) {
    return E === 92 || E === 124 ? (e.consume(E), o) : o(E);
  }
  function h(E) {
    return i.interrupt = !1, i.parser.lazy[i.now().line] ? t(E) : (e.enter("tableDelimiterRow"), u = !1, v(E) ? M(
      e,
      d,
      "linePrefix",
      i.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4
    )(E) : d(E));
  }
  function d(E) {
    return E === 45 || E === 58 ? x(E) : E === 124 ? (u = !0, e.enter("tableCellDivider"), e.consume(E), e.exit("tableCellDivider"), y) : _(E);
  }
  function y(E) {
    return v(E) ? M(e, x, "whitespace")(E) : x(E);
  }
  function x(E) {
    return E === 58 ? (l += 1, u = !0, e.enter("tableDelimiterMarker"), e.consume(E), e.exit("tableDelimiterMarker"), b) : E === 45 ? (l += 1, b(E)) : E === null || P(E) ? O(E) : _(E);
  }
  function b(E) {
    return E === 45 ? (e.enter("tableDelimiterFiller"), C(E)) : _(E);
  }
  function C(E) {
    return E === 45 ? (e.consume(E), C) : E === 58 ? (u = !0, e.exit("tableDelimiterFiller"), e.enter("tableDelimiterMarker"), e.consume(E), e.exit("tableDelimiterMarker"), w) : (e.exit("tableDelimiterFiller"), w(E));
  }
  function w(E) {
    return v(E) ? M(e, O, "whitespace")(E) : O(E);
  }
  function O(E) {
    return E === 124 ? d(E) : E === null || P(E) ? !u || r !== l ? _(E) : (e.exit("tableDelimiterRow"), e.exit("tableHead"), n(E)) : _(E);
  }
  function _(E) {
    return t(E);
  }
  function k(E) {
    return e.enter("tableRow"), S(E);
  }
  function S(E) {
    return E === 124 ? (e.enter("tableCellDivider"), e.consume(E), e.exit("tableCellDivider"), S) : E === null || P(E) ? (e.exit("tableRow"), n(E)) : v(E) ? M(e, S, "whitespace")(E) : (e.enter("data"), L(E));
  }
  function L(E) {
    return E === null || E === 124 || W(E) ? (e.exit("data"), S(E)) : (e.consume(E), E === 92 ? N : L);
  }
  function N(E) {
    return E === 92 || E === 124 ? (e.consume(E), L) : L(E);
  }
}
function Os(e, n) {
  let t = -1, i = !0, r = 0, l = [0, 0, 0, 0], u = [0, 0, 0, 0], a = !1, s = 0, c, f, o;
  const p = new As();
  for (; ++t < e.length; ) {
    const h = e[t], d = h[1];
    h[0] === "enter" ? d.type === "tableHead" ? (a = !1, s !== 0 && (Tr(p, n, s, c, f), f = void 0, s = 0), c = {
      type: "table",
      start: Object.assign({}, d.start),
      // Note: correct end is set later.
      end: Object.assign({}, d.end)
    }, p.add(t, 0, [["enter", c, n]])) : d.type === "tableRow" || d.type === "tableDelimiterRow" ? (i = !0, o = void 0, l = [0, 0, 0, 0], u = [0, t + 1, 0, 0], a && (a = !1, f = {
      type: "tableBody",
      start: Object.assign({}, d.start),
      // Note: correct end is set later.
      end: Object.assign({}, d.end)
    }, p.add(t, 0, [["enter", f, n]])), r = d.type === "tableDelimiterRow" ? 2 : f ? 3 : 1) : r && (d.type === "data" || d.type === "tableDelimiterMarker" || d.type === "tableDelimiterFiller") ? (i = !1, u[2] === 0 && (l[1] !== 0 && (u[0] = u[1], o = mt(
      p,
      n,
      l,
      r,
      void 0,
      o
    ), l = [0, 0, 0, 0]), u[2] = t)) : d.type === "tableCellDivider" && (i ? i = !1 : (l[1] !== 0 && (u[0] = u[1], o = mt(
      p,
      n,
      l,
      r,
      void 0,
      o
    )), l = u, u = [l[1], t, 0, 0])) : d.type === "tableHead" ? (a = !0, s = t) : d.type === "tableRow" || d.type === "tableDelimiterRow" ? (s = t, l[1] !== 0 ? (u[0] = u[1], o = mt(
      p,
      n,
      l,
      r,
      t,
      o
    )) : u[1] !== 0 && (o = mt(p, n, u, r, t, o)), r = 0) : r && (d.type === "data" || d.type === "tableDelimiterMarker" || d.type === "tableDelimiterFiller") && (u[3] = t);
  }
  for (s !== 0 && Tr(p, n, s, c, f), p.consume(n.events), t = -1; ++t < n.events.length; ) {
    const h = n.events[t];
    h[0] === "enter" && h[1].type === "table" && (h[1]._align = Cs(n.events, t));
  }
  return e;
}
function mt(e, n, t, i, r, l) {
  const u = i === 1 ? "tableHeader" : i === 2 ? "tableDelimiter" : "tableData", a = "tableContent";
  t[0] !== 0 && (l.end = Object.assign({}, qe(n.events, t[0])), e.add(t[0], 0, [["exit", l, n]]));
  const s = qe(n.events, t[1]);
  if (l = {
    type: u,
    start: Object.assign({}, s),
    // Note: correct end is set later.
    end: Object.assign({}, s)
  }, e.add(t[1], 0, [["enter", l, n]]), t[2] !== 0) {
    const c = qe(n.events, t[2]), f = qe(n.events, t[3]), o = {
      type: a,
      start: Object.assign({}, c),
      end: Object.assign({}, f)
    };
    if (e.add(t[2], 0, [["enter", o, n]]), i !== 2) {
      const p = n.events[t[2]], h = n.events[t[3]];
      if (p[1].end = Object.assign({}, h[1].end), p[1].type = "chunkText", p[1].contentType = "text", t[3] > t[2] + 1) {
        const d = t[2] + 1, y = t[3] - t[2] - 1;
        e.add(d, y, []);
      }
    }
    e.add(t[3] + 1, 0, [["exit", o, n]]);
  }
  return r !== void 0 && (l.end = Object.assign({}, qe(n.events, r)), e.add(r, 0, [["exit", l, n]]), l = void 0), l;
}
function Tr(e, n, t, i, r) {
  const l = [], u = qe(n.events, t);
  r && (r.end = Object.assign({}, u), l.push(["exit", r, n])), i.end = Object.assign({}, u), l.push(["exit", i, n]), e.add(t + 1, 0, l);
}
function qe(e, n) {
  const t = e[n], i = t[0] === "enter" ? "start" : "end";
  return t[1][i];
}
const Is = {
  tokenize: _s
}, Ps = {
  text: {
    91: Is
  }
};
function _s(e, n, t) {
  const i = this;
  return r;
  function r(s) {
    return (
      // Exit if there’s stuff before.
      i.previous !== null || // Exit if not in the first content that is the first child of a list
      // item.
      !i._gfmTasklistFirstContentOfListItem ? t(s) : (e.enter("taskListCheck"), e.enter("taskListCheckMarker"), e.consume(s), e.exit("taskListCheckMarker"), l)
    );
  }
  function l(s) {
    return W(s) ? (e.enter("taskListCheckValueUnchecked"), e.consume(s), e.exit("taskListCheckValueUnchecked"), u) : s === 88 || s === 120 ? (e.enter("taskListCheckValueChecked"), e.consume(s), e.exit("taskListCheckValueChecked"), u) : t(s);
  }
  function u(s) {
    return s === 93 ? (e.enter("taskListCheckMarker"), e.consume(s), e.exit("taskListCheckMarker"), e.exit("taskListCheck"), a) : t(s);
  }
  function a(s) {
    return P(s) ? n(s) : v(s) ? e.check(
      {
        tokenize: Rs
      },
      n,
      t
    )(s) : t(s);
  }
}
function Rs(e, n, t) {
  return M(e, i, "whitespace");
  function i(r) {
    return r === null ? t(r) : n(r);
  }
}
function Bs(e) {
  return di([
    is,
    ds(),
    Es(e),
    Ts,
    Ps
  ]);
}
function Fr(e, n) {
  const t = String(e);
  if (typeof n != "string")
    throw new TypeError("Expected character");
  let i = 0, r = t.indexOf(n);
  for (; r !== -1; )
    i++, r = t.indexOf(n, r + n.length);
  return i;
}
function Ls(e) {
  if (typeof e != "string")
    throw new TypeError("Expected a string");
  return e.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&").replace(/-/g, "\\x2d");
}
const Hn = (
  /**
   * @type {(
   *   (<Kind extends Node>(test: PredicateTest<Kind>) => AssertPredicate<Kind>) &
   *   ((test?: Test) => AssertAnything)
   * )}
   */
  /**
   * @param {Test} [test]
   * @returns {AssertAnything}
   */
  function(e) {
    if (e == null)
      return zs;
    if (typeof e == "string")
      return Ms(e);
    if (typeof e == "object")
      return Array.isArray(e) ? vs(e) : Ds(e);
    if (typeof e == "function")
      return Lt(e);
    throw new Error("Expected function, string, or object as test");
  }
);
function vs(e) {
  const n = [];
  let t = -1;
  for (; ++t < e.length; )
    n[t] = Hn(e[t]);
  return Lt(i);
  function i(...r) {
    let l = -1;
    for (; ++l < n.length; )
      if (n[l].call(this, ...r))
        return !0;
    return !1;
  }
}
function Ds(e) {
  return Lt(n);
  function n(t) {
    let i;
    for (i in e)
      if (t[i] !== e[i])
        return !1;
    return !0;
  }
}
function Ms(e) {
  return Lt(n);
  function n(t) {
    return t && t.type === e;
  }
}
function Lt(e) {
  return n;
  function n(t, ...i) {
    return !!(t && typeof t == "object" && "type" in t && e.call(this, t, ...i));
  }
}
function zs() {
  return !0;
}
const Ns = !0, Or = !1, Hs = "skip", Vs = (
  /**
   * @type {(
   *   (<Tree extends Node, Check extends Test>(tree: Tree, test: Check, visitor: BuildVisitor<Tree, Check>, reverse?: boolean | null | undefined) => void) &
   *   (<Tree extends Node>(tree: Tree, visitor: BuildVisitor<Tree>, reverse?: boolean | null | undefined) => void)
   * )}
   */
  /**
   * @param {Node} tree
   * @param {Test} test
   * @param {Visitor<Node>} visitor
   * @param {boolean | null | undefined} [reverse]
   * @returns {void}
   */
  function(e, n, t, i) {
    typeof n == "function" && typeof t != "function" && (i = t, t = n, n = null);
    const r = Hn(n), l = i ? -1 : 1;
    u(e, void 0, [])();
    function u(a, s, c) {
      const f = a && typeof a == "object" ? a : {};
      if (typeof f.type == "string") {
        const p = (
          // `hast`
          typeof f.tagName == "string" ? f.tagName : (
            // `xast`
            typeof f.name == "string" ? f.name : void 0
          )
        );
        Object.defineProperty(o, "name", {
          value: "node (" + (a.type + (p ? "<" + p + ">" : "")) + ")"
        });
      }
      return o;
      function o() {
        let p = [], h, d, y;
        if ((!n || r(a, s, c[c.length - 1] || null)) && (p = js(t(a, c)), p[0] === Or))
          return p;
        if (a.children && p[0] !== Hs)
          for (d = (i ? a.children.length : -1) + l, y = c.concat(a); d > -1 && d < a.children.length; ) {
            if (h = u(a.children[d], d, y)(), h[0] === Or)
              return h;
            d = typeof h[1] == "number" ? h[1] : d + l;
          }
        return p;
      }
    }
  }
);
function js(e) {
  return Array.isArray(e) ? e : typeof e == "number" ? [Ns, e] : [e];
}
const Us = {}.hasOwnProperty, Ws = (
  /**
   * @type {(
   *   (<Tree extends Node>(tree: Tree, find: Find, replace?: Replace | null | undefined, options?: Options | null | undefined) => Tree) &
   *   (<Tree extends Node>(tree: Tree, schema: FindAndReplaceSchema | FindAndReplaceList, options?: Options | null | undefined) => Tree)
   * )}
   **/
  /**
   * @template {Node} Tree
   * @param {Tree} tree
   * @param {Find | FindAndReplaceSchema | FindAndReplaceList} find
   * @param {Replace | Options | null | undefined} [replace]
   * @param {Options | null | undefined} [options]
   * @returns {Tree}
   */
  function(e, n, t, i) {
    let r, l;
    typeof n == "string" || n instanceof RegExp ? (l = [[n, t]], r = i) : (l = n, r = t), r || (r = {});
    const u = Hn(r.ignore || []), a = $s(l);
    let s = -1;
    for (; ++s < a.length; )
      Vs(e, "text", c);
    return e;
    function c(o, p) {
      let h = -1, d;
      for (; ++h < p.length; ) {
        const y = p[h];
        if (u(
          y,
          // @ts-expect-error: TS doesn’t understand but it’s perfect.
          d ? d.children.indexOf(y) : void 0,
          d
        ))
          return;
        d = y;
      }
      if (d)
        return f(o, p);
    }
    function f(o, p) {
      const h = p[p.length - 1], d = a[s][0], y = a[s][1];
      let x = 0;
      const b = h.children.indexOf(o);
      let C = !1, w = [];
      d.lastIndex = 0;
      let O = d.exec(o.value);
      for (; O; ) {
        const _ = O.index, k = {
          index: O.index,
          input: O.input,
          // @ts-expect-error: stack is fine.
          stack: [...p, o]
        };
        let S = y(...O, k);
        if (typeof S == "string" && (S = S.length > 0 ? { type: "text", value: S } : void 0), S !== !1 && (x !== _ && w.push({
          type: "text",
          value: o.value.slice(x, _)
        }), Array.isArray(S) ? w.push(...S) : S && w.push(S), x = _ + O[0].length, C = !0), !d.global)
          break;
        O = d.exec(o.value);
      }
      return C ? (x < o.value.length && w.push({ type: "text", value: o.value.slice(x) }), h.children.splice(b, 1, ...w)) : w = [o], b + w.length;
    }
  }
);
function $s(e) {
  const n = [];
  if (typeof e != "object")
    throw new TypeError("Expected array or object as schema");
  if (Array.isArray(e)) {
    let t = -1;
    for (; ++t < e.length; )
      n.push([
        Ir(e[t][0]),
        Pr(e[t][1])
      ]);
  } else {
    let t;
    for (t in e)
      Us.call(e, t) && n.push([Ir(t), Pr(e[t])]);
  }
  return n;
}
function Ir(e) {
  return typeof e == "string" ? new RegExp(Ls(e), "g") : e;
}
function Pr(e) {
  return typeof e == "function" ? e : () => e;
}
const Jt = "phrasing", Zt = ["autolink", "link", "image", "label"], qs = {
  transforms: [Xs],
  enter: {
    literalAutolink: Ks,
    literalAutolinkEmail: Xt,
    literalAutolinkHttp: Xt,
    literalAutolinkWww: Xt
  },
  exit: {
    literalAutolink: Zs,
    literalAutolinkEmail: Js,
    literalAutolinkHttp: Qs,
    literalAutolinkWww: Ys
  }
}, Gs = {
  unsafe: [
    {
      character: "@",
      before: "[+\\-.\\w]",
      after: "[\\-.\\w]",
      inConstruct: Jt,
      notInConstruct: Zt
    },
    {
      character: ".",
      before: "[Ww]",
      after: "[\\-.\\w]",
      inConstruct: Jt,
      notInConstruct: Zt
    },
    { character: ":", before: "[ps]", after: "\\/", inConstruct: Jt, notInConstruct: Zt }
  ]
};
function Ks(e) {
  this.enter({ type: "link", title: null, url: "", children: [] }, e);
}
function Xt(e) {
  this.config.enter.autolinkProtocol.call(this, e);
}
function Qs(e) {
  this.config.exit.autolinkProtocol.call(this, e);
}
function Ys(e) {
  this.config.exit.data.call(this, e);
  const n = (
    /** @type {Link} */
    this.stack[this.stack.length - 1]
  );
  n.url = "http://" + this.sliceSerialize(e);
}
function Js(e) {
  this.config.exit.autolinkEmail.call(this, e);
}
function Zs(e) {
  this.exit(e);
}
function Xs(e) {
  Ws(
    e,
    [
      [/(https?:\/\/|www(?=\.))([-.\w]+)([^ \t\r\n]*)/gi, eo],
      [/([-.\w+]+)@([-\w]+(?:\.[-\w]+)+)/g, to]
    ],
    { ignore: ["link", "linkReference"] }
  );
}
function eo(e, n, t, i, r) {
  let l = "";
  if (!Di(r) || (/^w/i.test(n) && (t = n + t, n = "", l = "http://"), !no(t)))
    return !1;
  const u = ro(t + i);
  if (!u[0])
    return !1;
  const a = {
    type: "link",
    title: null,
    url: l + n + u[0],
    children: [{ type: "text", value: n + u[0] }]
  };
  return u[1] ? [a, { type: "text", value: u[1] }] : a;
}
function to(e, n, t, i) {
  return (
    // Not an expected previous character.
    !Di(i, !0) || // Label ends in not allowed character.
    /[-\d_]$/.test(t) ? !1 : {
      type: "link",
      title: null,
      url: "mailto:" + n + "@" + t,
      children: [{ type: "text", value: n + "@" + t }]
    }
  );
}
function no(e) {
  const n = e.split(".");
  return !(n.length < 2 || n[n.length - 1] && (/_/.test(n[n.length - 1]) || !/[a-zA-Z\d]/.test(n[n.length - 1])) || n[n.length - 2] && (/_/.test(n[n.length - 2]) || !/[a-zA-Z\d]/.test(n[n.length - 2])));
}
function ro(e) {
  const n = /[!"&'),.:;<>?\]}]+$/.exec(e);
  if (!n)
    return [e, void 0];
  e = e.slice(0, n.index);
  let t = n[0], i = t.indexOf(")");
  const r = Fr(e, "(");
  let l = Fr(e, ")");
  for (; i !== -1 && r > l; )
    e += t.slice(0, i + 1), t = t.slice(i + 1), i = t.indexOf(")"), l++;
  return [e, t];
}
function Di(e, n) {
  const t = e.input.charCodeAt(e.index - 1);
  return (e.index === 0 || Ne(t) || Rt(t)) && (!n || t !== 47);
}
function Mi(e) {
  return e.label || !e.identifier ? e.label || "" : Ci(e.identifier);
}
function io(e, n, t) {
  const i = n.indexStack, r = e.children || [], l = n.createTracker(t), u = [];
  let a = -1;
  for (i.push(-1); ++a < r.length; ) {
    const s = r[a];
    i[i.length - 1] = a, u.push(
      l.move(
        n.handle(s, e, n, {
          before: `
`,
          after: `
`,
          ...l.current()
        })
      )
    ), s.type !== "list" && (n.bulletLastUsed = void 0), a < r.length - 1 && u.push(
      l.move(lo(s, r[a + 1], e, n))
    );
  }
  return i.pop(), u.join("");
}
function lo(e, n, t, i) {
  let r = i.join.length;
  for (; r--; ) {
    const l = i.join[r](e, n, t, i);
    if (l === !0 || l === 1)
      break;
    if (typeof l == "number")
      return `
`.repeat(1 + l);
    if (l === !1)
      return `

<!---->

`;
  }
  return `

`;
}
const uo = /\r?\n|\r/g;
function ao(e, n) {
  const t = [];
  let i = 0, r = 0, l;
  for (; l = uo.exec(e); )
    u(e.slice(i, l.index)), t.push(l[0]), i = l.index + l[0].length, r++;
  return u(e.slice(i)), t.join("");
  function u(a) {
    t.push(n(a, r, !a));
  }
}
function zi(e) {
  if (!e._compiled) {
    const n = (e.atBreak ? "[\\r\\n][\\t ]*" : "") + (e.before ? "(?:" + e.before + ")" : "");
    e._compiled = new RegExp(
      (n ? "(" + n + ")" : "") + (/[|\\{}()[\]^$+*?.-]/.test(e.character) ? "\\" : "") + e.character + (e.after ? "(?:" + e.after + ")" : ""),
      "g"
    );
  }
  return e._compiled;
}
function so(e, n) {
  return _r(e, n.inConstruct, !0) && !_r(e, n.notInConstruct, !1);
}
function _r(e, n, t) {
  if (typeof n == "string" && (n = [n]), !n || n.length === 0)
    return t;
  let i = -1;
  for (; ++i < n.length; )
    if (e.includes(n[i]))
      return !0;
  return !1;
}
function Ni(e, n, t) {
  const i = (t.before || "") + (n || "") + (t.after || ""), r = [], l = [], u = {};
  let a = -1;
  for (; ++a < e.unsafe.length; ) {
    const f = e.unsafe[a];
    if (!so(e.stack, f))
      continue;
    const o = zi(f);
    let p;
    for (; p = o.exec(i); ) {
      const h = "before" in f || !!f.atBreak, d = "after" in f, y = p.index + (h ? p[1].length : 0);
      r.includes(y) ? (u[y].before && !h && (u[y].before = !1), u[y].after && !d && (u[y].after = !1)) : (r.push(y), u[y] = { before: h, after: d });
    }
  }
  r.sort(oo);
  let s = t.before ? t.before.length : 0;
  const c = i.length - (t.after ? t.after.length : 0);
  for (a = -1; ++a < r.length; ) {
    const f = r[a];
    f < s || f >= c || f + 1 < c && r[a + 1] === f + 1 && u[f].after && !u[f + 1].before && !u[f + 1].after || r[a - 1] === f - 1 && u[f].before && !u[f - 1].before && !u[f - 1].after || (s !== f && l.push(Rr(i.slice(s, f), "\\")), s = f, /[!-/:-@[-`{-~]/.test(i.charAt(f)) && (!t.encode || !t.encode.includes(i.charAt(f))) ? l.push("\\") : (l.push(
      "&#x" + i.charCodeAt(f).toString(16).toUpperCase() + ";"
    ), s++));
  }
  return l.push(Rr(i.slice(s, c), t.after)), l.join("");
}
function oo(e, n) {
  return e - n;
}
function Rr(e, n) {
  const t = /\\(?=[!-/:-@[-`{-~])/g, i = [], r = [], l = e + n;
  let u = -1, a = 0, s;
  for (; s = t.exec(l); )
    i.push(s.index);
  for (; ++u < i.length; )
    a !== i[u] && r.push(e.slice(a, i[u])), r.push("\\"), a = i[u];
  return r.push(e.slice(a)), r.join("");
}
function vt(e) {
  const n = e || {}, t = n.now || {};
  let i = n.lineShift || 0, r = t.line || 1, l = t.column || 1;
  return { move: s, current: u, shift: a };
  function u() {
    return { now: { line: r, column: l }, lineShift: i };
  }
  function a(c) {
    i += c;
  }
  function s(c) {
    const f = c || "", o = f.split(/\r?\n|\r/g), p = o[o.length - 1];
    return r += o.length - 1, l = o.length === 1 ? l + p.length : 1 + p.length + i, f;
  }
}
Hi.peek = wo;
function co() {
  return {
    enter: {
      gfmFootnoteDefinition: ho,
      gfmFootnoteDefinitionLabelString: po,
      gfmFootnoteCall: yo,
      gfmFootnoteCallString: bo
    },
    exit: {
      gfmFootnoteDefinition: mo,
      gfmFootnoteDefinitionLabelString: go,
      gfmFootnoteCall: ko,
      gfmFootnoteCallString: xo
    }
  };
}
function fo() {
  return {
    // This is on by default already.
    unsafe: [{ character: "[", inConstruct: ["phrasing", "label", "reference"] }],
    handlers: { footnoteDefinition: Eo, footnoteReference: Hi }
  };
}
function ho(e) {
  this.enter(
    { type: "footnoteDefinition", identifier: "", label: "", children: [] },
    e
  );
}
function po() {
  this.buffer();
}
function go(e) {
  const n = this.resume(), t = (
    /** @type {FootnoteDefinition} */
    this.stack[this.stack.length - 1]
  );
  t.label = n, t.identifier = de(
    this.sliceSerialize(e)
  ).toLowerCase();
}
function mo(e) {
  this.exit(e);
}
function yo(e) {
  this.enter({ type: "footnoteReference", identifier: "", label: "" }, e);
}
function bo() {
  this.buffer();
}
function xo(e) {
  const n = this.resume(), t = (
    /** @type {FootnoteDefinition} */
    this.stack[this.stack.length - 1]
  );
  t.label = n, t.identifier = de(
    this.sliceSerialize(e)
  ).toLowerCase();
}
function ko(e) {
  this.exit(e);
}
function Hi(e, n, t, i) {
  const r = vt(i);
  let l = r.move("[^");
  const u = t.enter("footnoteReference"), a = t.enter("reference");
  return l += r.move(
    Ni(t, Mi(e), {
      ...r.current(),
      before: l,
      after: "]"
    })
  ), a(), u(), l += r.move("]"), l;
}
function wo() {
  return "[";
}
function Eo(e, n, t, i) {
  const r = vt(i);
  let l = r.move("[^");
  const u = t.enter("footnoteDefinition"), a = t.enter("label");
  return l += r.move(
    Ni(t, Mi(e), {
      ...r.current(),
      before: l,
      after: "]"
    })
  ), a(), l += r.move(
    "]:" + (e.children && e.children.length > 0 ? " " : "")
  ), r.shift(4), l += r.move(
    ao(io(e, t, r.current()), Ao)
  ), u(), l;
}
function Ao(e, n, t) {
  return n === 0 ? e : (t ? "" : "    ") + e;
}
function Vi(e, n, t) {
  const i = n.indexStack, r = e.children || [], l = [];
  let u = -1, a = t.before;
  i.push(-1);
  let s = n.createTracker(t);
  for (; ++u < r.length; ) {
    const c = r[u];
    let f;
    if (i[i.length - 1] = u, u + 1 < r.length) {
      let o = n.handle.handlers[r[u + 1].type];
      o && o.peek && (o = o.peek), f = o ? o(r[u + 1], e, n, {
        before: "",
        after: "",
        ...s.current()
      }).charAt(0) : "";
    } else
      f = t.after;
    l.length > 0 && (a === "\r" || a === `
`) && c.type === "html" && (l[l.length - 1] = l[l.length - 1].replace(
      /(\r?\n|\r)$/,
      " "
    ), a = " ", s = n.createTracker(t), s.move(l.join(""))), l.push(
      s.move(
        n.handle(c, e, n, {
          ...s.current(),
          before: a,
          after: f
        })
      )
    ), a = l[l.length - 1].slice(-1);
  }
  return i.pop(), l.join("");
}
const So = [
  "autolink",
  "destinationLiteral",
  "destinationRaw",
  "reference",
  "titleQuote",
  "titleApostrophe"
];
ji.peek = Io;
const Co = {
  canContainEols: ["delete"],
  enter: { strikethrough: Fo },
  exit: { strikethrough: Oo }
}, To = {
  unsafe: [
    {
      character: "~",
      inConstruct: "phrasing",
      notInConstruct: So
    }
  ],
  handlers: { delete: ji }
};
function Fo(e) {
  this.enter({ type: "delete", children: [] }, e);
}
function Oo(e) {
  this.exit(e);
}
function ji(e, n, t, i) {
  const r = vt(i), l = t.enter("strikethrough");
  let u = r.move("~~");
  return u += Vi(e, t, {
    ...r.current(),
    before: u,
    after: "~"
  }), u += r.move("~~"), l(), u;
}
function Io() {
  return "~";
}
Ui.peek = Po;
function Ui(e, n, t) {
  let i = e.value || "", r = "`", l = -1;
  for (; new RegExp("(^|[^`])" + r + "([^`]|$)").test(i); )
    r += "`";
  for (/[^ \r\n]/.test(i) && (/^[ \r\n]/.test(i) && /[ \r\n]$/.test(i) || /^`|`$/.test(i)) && (i = " " + i + " "); ++l < t.unsafe.length; ) {
    const u = t.unsafe[l], a = zi(u);
    let s;
    if (u.atBreak)
      for (; s = a.exec(i); ) {
        let c = s.index;
        i.charCodeAt(c) === 10 && i.charCodeAt(c - 1) === 13 && c--, i = i.slice(0, c) + " " + i.slice(s.index + 1);
      }
  }
  return r + i + r;
}
function Po() {
  return "`";
}
function _o(e, n = {}) {
  const t = (n.align || []).concat(), i = n.stringLength || Bo, r = [], l = [], u = [], a = [];
  let s = 0, c = -1;
  for (; ++c < e.length; ) {
    const d = [], y = [];
    let x = -1;
    for (e[c].length > s && (s = e[c].length); ++x < e[c].length; ) {
      const b = Ro(e[c][x]);
      if (n.alignDelimiters !== !1) {
        const C = i(b);
        y[x] = C, (a[x] === void 0 || C > a[x]) && (a[x] = C);
      }
      d.push(b);
    }
    l[c] = d, u[c] = y;
  }
  let f = -1;
  if (typeof t == "object" && "length" in t)
    for (; ++f < s; )
      r[f] = Br(t[f]);
  else {
    const d = Br(t);
    for (; ++f < s; )
      r[f] = d;
  }
  f = -1;
  const o = [], p = [];
  for (; ++f < s; ) {
    const d = r[f];
    let y = "", x = "";
    d === 99 ? (y = ":", x = ":") : d === 108 ? y = ":" : d === 114 && (x = ":");
    let b = n.alignDelimiters === !1 ? 1 : Math.max(
      1,
      a[f] - y.length - x.length
    );
    const C = y + "-".repeat(b) + x;
    n.alignDelimiters !== !1 && (b = y.length + b + x.length, b > a[f] && (a[f] = b), p[f] = b), o[f] = C;
  }
  l.splice(1, 0, o), u.splice(1, 0, p), c = -1;
  const h = [];
  for (; ++c < l.length; ) {
    const d = l[c], y = u[c];
    f = -1;
    const x = [];
    for (; ++f < s; ) {
      const b = d[f] || "";
      let C = "", w = "";
      if (n.alignDelimiters !== !1) {
        const O = a[f] - (y[f] || 0), _ = r[f];
        _ === 114 ? C = " ".repeat(O) : _ === 99 ? O % 2 ? (C = " ".repeat(O / 2 + 0.5), w = " ".repeat(O / 2 - 0.5)) : (C = " ".repeat(O / 2), w = C) : w = " ".repeat(O);
      }
      n.delimiterStart !== !1 && !f && x.push("|"), n.padding !== !1 && // Don’t add the opening space if we’re not aligning and the cell is
      // empty: there will be a closing space.
      !(n.alignDelimiters === !1 && b === "") && (n.delimiterStart !== !1 || f) && x.push(" "), n.alignDelimiters !== !1 && x.push(C), x.push(b), n.alignDelimiters !== !1 && x.push(w), n.padding !== !1 && x.push(" "), (n.delimiterEnd !== !1 || f !== s - 1) && x.push("|");
    }
    h.push(
      n.delimiterEnd === !1 ? x.join("").replace(/ +$/, "") : x.join("")
    );
  }
  return h.join(`
`);
}
function Ro(e) {
  return e == null ? "" : String(e);
}
function Bo(e) {
  return e.length;
}
function Br(e) {
  const n = typeof e == "string" ? e.codePointAt(0) : 0;
  return n === 67 || n === 99 ? 99 : n === 76 || n === 108 ? 108 : n === 82 || n === 114 ? 114 : 0;
}
const Lo = {
  enter: {
    table: vo,
    tableData: Lr,
    tableHeader: Lr,
    tableRow: Mo
  },
  exit: {
    codeText: zo,
    table: Do,
    tableData: en,
    tableHeader: en,
    tableRow: en
  }
};
function vo(e) {
  const n = e._align;
  this.enter(
    {
      type: "table",
      align: n.map((t) => t === "none" ? null : t),
      children: []
    },
    e
  ), this.setData("inTable", !0);
}
function Do(e) {
  this.exit(e), this.setData("inTable");
}
function Mo(e) {
  this.enter({ type: "tableRow", children: [] }, e);
}
function en(e) {
  this.exit(e);
}
function Lr(e) {
  this.enter({ type: "tableCell", children: [] }, e);
}
function zo(e) {
  let n = this.resume();
  this.getData("inTable") && (n = n.replace(/\\([\\|])/g, No));
  const t = (
    /** @type {InlineCode} */
    this.stack[this.stack.length - 1]
  );
  t.value = n, this.exit(e);
}
function No(e, n) {
  return n === "|" ? n : e;
}
function Ho(e) {
  const n = e || {}, t = n.tableCellPadding, i = n.tablePipeAlign, r = n.stringLength, l = t ? " " : "|";
  return {
    unsafe: [
      { character: "\r", inConstruct: "tableCell" },
      { character: `
`, inConstruct: "tableCell" },
      // A pipe, when followed by a tab or space (padding), or a dash or colon
      // (unpadded delimiter row), could result in a table.
      { atBreak: !0, character: "|", after: "[	 :-]" },
      // A pipe in a cell must be encoded.
      { character: "|", inConstruct: "tableCell" },
      // A colon must be followed by a dash, in which case it could start a
      // delimiter row.
      { atBreak: !0, character: ":", after: "-" },
      // A delimiter row can also start with a dash, when followed by more
      // dashes, a colon, or a pipe.
      // This is a stricter version than the built in check for lists, thematic
      // breaks, and setex heading underlines though:
      // <https://github.com/syntax-tree/mdast-util-to-markdown/blob/51a2038/lib/unsafe.js#L57>
      { atBreak: !0, character: "-", after: "[:|-]" }
    ],
    handlers: {
      table: u,
      tableRow: a,
      tableCell: s,
      inlineCode: p
    }
  };
  function u(h, d, y, x) {
    return c(
      f(h, y, x),
      h.align
    );
  }
  function a(h, d, y, x) {
    const b = o(h, y, x), C = c([b]);
    return C.slice(0, C.indexOf(`
`));
  }
  function s(h, d, y, x) {
    const b = y.enter("tableCell"), C = y.enter("phrasing"), w = Vi(h, y, {
      ...x,
      before: l,
      after: l
    });
    return C(), b(), w;
  }
  function c(h, d) {
    return _o(h, {
      align: d,
      // @ts-expect-error: `markdown-table` types should support `null`.
      alignDelimiters: i,
      // @ts-expect-error: `markdown-table` types should support `null`.
      padding: t,
      // @ts-expect-error: `markdown-table` types should support `null`.
      stringLength: r
    });
  }
  function f(h, d, y) {
    const x = h.children;
    let b = -1;
    const C = [], w = d.enter("table");
    for (; ++b < x.length; )
      C[b] = o(
        x[b],
        d,
        y
      );
    return w(), C;
  }
  function o(h, d, y) {
    const x = h.children;
    let b = -1;
    const C = [], w = d.enter("tableRow");
    for (; ++b < x.length; )
      C[b] = s(
        x[b],
        h,
        d,
        y
      );
    return w(), C;
  }
  function p(h, d, y) {
    let x = Ui(h, d, y);
    return y.stack.includes("tableCell") && (x = x.replace(/\|/g, "\\$&")), x;
  }
}
function Vo(e) {
  const n = e.options.bullet || "*";
  if (n !== "*" && n !== "+" && n !== "-")
    throw new Error(
      "Cannot serialize items with `" + n + "` for `options.bullet`, expected `*`, `+`, or `-`"
    );
  return n;
}
function jo(e) {
  const n = e.options.listItemIndent || "tab";
  if (n === 1 || n === "1")
    return "one";
  if (n !== "tab" && n !== "one" && n !== "mixed")
    throw new Error(
      "Cannot serialize items with `" + n + "` for `options.listItemIndent`, expected `tab`, `one`, or `mixed`"
    );
  return n;
}
function Uo(e, n, t, i) {
  const r = jo(t);
  let l = t.bulletCurrent || Vo(t);
  n && n.type === "list" && n.ordered && (l = (typeof n.start == "number" && n.start > -1 ? n.start : 1) + (t.options.incrementListMarker === !1 ? 0 : n.children.indexOf(e)) + l);
  let u = l.length + 1;
  (r === "tab" || r === "mixed" && (n && n.type === "list" && n.spread || e.spread)) && (u = Math.ceil(u / 4) * 4);
  const a = t.createTracker(i);
  a.move(l + " ".repeat(u - l.length)), a.shift(u);
  const s = t.enter("listItem"), c = t.indentLines(
    t.containerFlow(e, a.current()),
    f
  );
  return s(), c;
  function f(o, p, h) {
    return p ? (h ? "" : " ".repeat(u)) + o : (h ? l : l + " ".repeat(u - l.length)) + o;
  }
}
const Wo = {
  exit: {
    taskListCheckValueChecked: vr,
    taskListCheckValueUnchecked: vr,
    paragraph: qo
  }
}, $o = {
  unsafe: [{ atBreak: !0, character: "-", after: "[:|-]" }],
  handlers: { listItem: Go }
};
function vr(e) {
  const n = (
    /** @type {ListItem} */
    this.stack[this.stack.length - 2]
  );
  n.checked = e.type === "taskListCheckValueChecked";
}
function qo(e) {
  const n = (
    /** @type {Parents} */
    this.stack[this.stack.length - 2]
  );
  if (n && n.type === "listItem" && typeof n.checked == "boolean") {
    const t = (
      /** @type {Paragraph} */
      this.stack[this.stack.length - 1]
    ), i = t.children[0];
    if (i && i.type === "text") {
      const r = n.children;
      let l = -1, u;
      for (; ++l < r.length; ) {
        const a = r[l];
        if (a.type === "paragraph") {
          u = a;
          break;
        }
      }
      u === t && (i.value = i.value.slice(1), i.value.length === 0 ? t.children.shift() : t.position && i.position && typeof i.position.start.offset == "number" && (i.position.start.column++, i.position.start.offset++, t.position.start = Object.assign({}, i.position.start)));
    }
  }
  this.exit(e);
}
function Go(e, n, t, i) {
  const r = e.children[0], l = typeof e.checked == "boolean" && r && r.type === "paragraph", u = "[" + (e.checked ? "x" : " ") + "] ", a = vt(i);
  l && a.move(u);
  let s = Uo(e, n, t, {
    ...i,
    ...a.current()
  });
  return l && (s = s.replace(/^(?:[*+-]|\d+\.)([\r\n]| {1,3})/, c)), s;
  function c(f) {
    return f + u;
  }
}
function Ko() {
  return [
    qs,
    co(),
    Co,
    Lo,
    Wo
  ];
}
function Qo(e) {
  return {
    extensions: [
      Gs,
      fo(),
      To,
      Ho(e),
      $o
    ]
  };
}
function Yo(e = {}) {
  const n = this.data();
  t("micromarkExtensions", Bs(e)), t("fromMarkdownExtensions", Ko()), t("toMarkdownExtensions", Qo(e));
  function t(i, r) {
    /** @type {unknown[]} */
    // Other extensions
    /* c8 ignore next 2 */
    (n[i] ? n[i] : n[i] = []).push(r);
  }
}
var Wi = { exports: {} };
(function(e) {
  (function() {
    var n;
    n = e.exports = r, n.format = r, n.vsprintf = i, typeof console < "u" && typeof console.log == "function" && (n.printf = t);
    function t() {
      console.log(r.apply(null, arguments));
    }
    function i(l, u) {
      return r.apply(null, [l].concat(u));
    }
    function r(l) {
      for (var u = 1, a = [].slice.call(arguments), s = 0, c = l.length, f = "", o, p = !1, h, d, y = !1, x, b = function() {
        return a[u++];
      }, C = function() {
        for (var w = ""; /\d/.test(l[s]); )
          w += l[s++], o = l[s];
        return w.length > 0 ? parseInt(w) : null;
      }; s < c; ++s)
        if (o = l[s], p)
          switch (p = !1, o == "." ? (y = !1, o = l[++s]) : o == "0" && l[s + 1] == "." ? (y = !0, s += 2, o = l[s]) : y = !0, x = C(), o) {
            case "b":
              f += parseInt(b(), 10).toString(2);
              break;
            case "c":
              h = b(), typeof h == "string" || h instanceof String ? f += h : f += String.fromCharCode(parseInt(h, 10));
              break;
            case "d":
              f += parseInt(b(), 10);
              break;
            case "f":
              d = String(parseFloat(b()).toFixed(x || 6)), f += y ? d : d.replace(/^0/, "");
              break;
            case "j":
              f += JSON.stringify(b());
              break;
            case "o":
              f += "0" + parseInt(b(), 10).toString(8);
              break;
            case "s":
              f += b();
              break;
            case "x":
              f += "0x" + parseInt(b(), 10).toString(16);
              break;
            case "X":
              f += "0x" + parseInt(b(), 10).toString(16).toUpperCase();
              break;
            default:
              f += o;
              break;
          }
        else
          o === "%" ? p = !0 : f += o;
      return f;
    }
  })();
})(Wi);
var Jo = Wi.exports;
const Zo = /* @__PURE__ */ _t(Jo), yt = Object.assign(Me(Error), {
  eval: Me(EvalError),
  range: Me(RangeError),
  reference: Me(ReferenceError),
  syntax: Me(SyntaxError),
  type: Me(TypeError),
  uri: Me(URIError)
});
function Me(e) {
  return n.displayName = e.displayName || e.name, n;
  function n(t, ...i) {
    const r = t && Zo(t, ...i);
    return new e(r);
  }
}
const bt = {}.hasOwnProperty, Dr = {
  yaml: "-",
  toml: "+"
};
function Vn(e) {
  const n = [];
  let t = -1;
  const i = Array.isArray(e) ? e : e ? [e] : ["yaml"];
  for (; ++t < i.length; )
    n[t] = Xo(i[t]);
  return n;
}
function Xo(e) {
  let n = e;
  if (typeof n == "string") {
    if (!bt.call(Dr, n))
      throw yt("Missing matter definition for `%s`", n);
    n = {
      type: n,
      marker: Dr[n]
    };
  } else if (typeof n != "object")
    throw yt("Expected matter to be an object, not `%j`", n);
  if (!bt.call(n, "type"))
    throw yt("Missing `type` in matter `%j`", n);
  if (!bt.call(n, "fence") && !bt.call(n, "marker"))
    throw yt("Missing `marker` or `fence` in matter `%j`", n);
  return n;
}
function ec(e) {
  const n = Vn(e), t = {};
  let i = -1;
  for (; ++i < n.length; ) {
    const r = n[i], l = An(r, "open").charCodeAt(0), u = tc(r), a = t[l];
    Array.isArray(a) ? a.push(u) : t[l] = [u];
  }
  return {
    flow: t
  };
}
function tc(e) {
  const n = e.anywhere, t = (
    /** @type {TokenType} */
    e.type
  ), i = (
    /** @type {TokenType} */
    t + "Fence"
  ), r = (
    /** @type {TokenType} */
    i + "Sequence"
  ), l = (
    /** @type {TokenType} */
    t + "Value"
  ), u = {
    tokenize: f,
    partial: !0
  };
  let a, s = 0;
  return {
    tokenize: c,
    concrete: !0
  };
  function c(o, p, h) {
    const d = this;
    return y;
    function y(S) {
      const L = d.now();
      return (
        // Indent not allowed.
        L.column === 1 && // Normally, only allowed in first line.
        (L.line === 1 || n) && (a = An(e, "open"), s = 0, S === a.charCodeAt(s)) ? (o.enter(t), o.enter(i), o.enter(r), x(S)) : h(S)
      );
    }
    function x(S) {
      return s === a.length ? (o.exit(r), v(S) ? (o.enter("whitespace"), b(S)) : C(S)) : S === a.charCodeAt(s++) ? (o.consume(S), x) : h(S);
    }
    function b(S) {
      return v(S) ? (o.consume(S), b) : (o.exit("whitespace"), C(S));
    }
    function C(S) {
      return P(S) ? (o.exit(i), o.enter("lineEnding"), o.consume(S), o.exit("lineEnding"), a = An(e, "close"), s = 0, o.attempt(u, k, w)) : h(S);
    }
    function w(S) {
      return S === null || P(S) ? _(S) : (o.enter(l), O(S));
    }
    function O(S) {
      return S === null || P(S) ? (o.exit(l), _(S)) : (o.consume(S), O);
    }
    function _(S) {
      return S === null ? h(S) : (o.enter("lineEnding"), o.consume(S), o.exit("lineEnding"), o.attempt(u, k, w));
    }
    function k(S) {
      return o.exit(t), p(S);
    }
  }
  function f(o, p, h) {
    let d = 0;
    return y;
    function y(w) {
      return w === a.charCodeAt(d) ? (o.enter(i), o.enter(r), x(w)) : h(w);
    }
    function x(w) {
      return d === a.length ? (o.exit(r), v(w) ? (o.enter("whitespace"), b(w)) : C(w)) : w === a.charCodeAt(d++) ? (o.consume(w), x) : h(w);
    }
    function b(w) {
      return v(w) ? (o.consume(w), b) : (o.exit("whitespace"), C(w));
    }
    function C(w) {
      return w === null || P(w) ? (o.exit(i), p(w)) : h(w);
    }
  }
}
function An(e, n) {
  return e.marker ? Mr(e.marker, n).repeat(3) : (
    // @ts-expect-error: They’re mutually exclusive.
    Mr(e.fence, n)
  );
}
function Mr(e, n) {
  return typeof e == "string" ? e : e[n];
}
function nc(e) {
  const n = Vn(e), t = {}, i = {};
  let r = -1;
  for (; ++r < n.length; ) {
    const l = n[r];
    t[l.type] = rc(l), i[l.type] = ic, i[l.type + "Value"] = lc;
  }
  return { enter: t, exit: i };
}
function rc(e) {
  return n;
  function n(t) {
    this.enter({ type: e.type, value: "" }, t), this.buffer();
  }
}
function ic(e) {
  const n = this.resume(), t = (
    /** @type {Literal} */
    this.exit(e)
  );
  t.value = n.replace(/^(\r?\n|\r)|(\r?\n|\r)$/g, "");
}
function lc(e) {
  this.config.enter.data.call(this, e), this.config.exit.data.call(this, e);
}
function uc(e) {
  const n = [], t = {}, i = Vn(e);
  let r = -1;
  for (; ++r < i.length; ) {
    const l = i[r];
    t[l.type] = ac(l), n.push({ atBreak: !0, character: Sn(l, "open").charAt(0) });
  }
  return { unsafe: n, handlers: t };
}
function ac(e) {
  const n = Sn(e, "open"), t = Sn(e, "close");
  return i;
  function i(r) {
    return n + (r.value ? `
` + r.value : "") + `
` + t;
  }
}
function Sn(e, n) {
  return e.marker ? zr(e.marker, n).repeat(3) : (
    // @ts-expect-error: They’re mutually exclusive.
    zr(e.fence, n)
  );
}
function zr(e, n) {
  return typeof e == "string" ? e : e[n];
}
function sc(e = "yaml") {
  const n = this.data();
  t("micromarkExtensions", ec(e)), t("fromMarkdownExtensions", nc(e)), t("toMarkdownExtensions", uc(e));
  function t(i, r) {
    /** @type {unknown[]} */
    // Other extensions
    /* c8 ignore next 2 */
    (n[i] ? n[i] : n[i] = []).push(r);
  }
}
var R = /* @__PURE__ */ ((e) => (e.EMPTY = "empty", e.SPACE = "space", e.WESTERN_LETTER = "western-letter", e.CJK_CHAR = "cjk-char", e.HALFWIDTH_PAUSE_OR_STOP = "halfwidth-pause-or-stop", e.FULLWIDTH_PAUSE_OR_STOP = "fullwidth-pause-or-stop", e.HALFWIDTH_QUOTATION = "halfwidth-quotation", e.FULLWIDTH_QUOTATION = "fullwidth-quotation", e.HALFWIDTH_BRACKET = "halfwidth-bracket", e.FULLWIDTH_BRACKET = "fullwidth-bracket", e.HALFWIDTH_OTHER_PUNCTUATION = "halfwidth-other-punctuation", e.FULLWIDTH_OTHER_PUNCTUATION = "fullwidth-other-punctuation", e.UNKNOWN = "unknown", e))(R || {});
const Nr = {
  left: "([{（〔［｛",
  right: ")]}）〕］｝"
}, tn = {
  left: "“‘《〈『「【〖",
  right: "”’》〉』」】〗",
  neutral: `'"`
}, oc = "'’", cc = {
  "'": "'",
  "’": "‘"
}, fc = "“”‘’（）〔〕［］｛｝《》〈〉「」『』【】〖〗", It = (e) => fc.indexOf(e) >= 0;
var ge = /* @__PURE__ */ ((e) => (e.BRACKETS = "brackets", e.HYPER = "hyper", e.RAW = "raw", e))(ge || {}), q = /* @__PURE__ */ ((e) => (e.LEFT = "left", e.RIGHT = "right", e))(q || {});
const hc = (e) => e.code !== void 0;
var $ = /* @__PURE__ */ ((e) => (e.BRACKET_MARK = "bracket-mark", e.HYPER_MARK = "hyper-mark", e.CODE_CONTENT = "code-content", e.HYPER_CONTENT = "hyper-content", e.UNMATCHED = "unmatched", e.INDETERMINATED = "indeterminated", e))($ || {}), ee = /* @__PURE__ */ ((e) => (e.GROUP = "group", e))(ee || {});
const $i = (e) => {
  switch (e) {
    case "cjk-char":
      return "western-letter";
    case "fullwidth-pause-or-stop":
      return "halfwidth-pause-or-stop";
    case "fullwidth-other-punctuation":
      return "halfwidth-other-punctuation";
  }
  return e;
}, pc = (e) => {
  switch (e) {
    case "western-letter":
      return "cjk-char";
    case "halfwidth-pause-or-stop":
      return "fullwidth-pause-or-stop";
    case "halfwidth-other-punctuation":
      return "fullwidth-other-punctuation";
  }
  return e;
}, ae = (e) => e === "western-letter" || e === "cjk-char", jn = (e) => e === "halfwidth-pause-or-stop" || e === "fullwidth-pause-or-stop", qi = (e) => e === "halfwidth-quotation" || e === "fullwidth-quotation", Gi = (e) => e === "halfwidth-bracket" || e === "fullwidth-bracket", Ki = (e) => e === "halfwidth-other-punctuation" || e === "fullwidth-other-punctuation", Cn = (e) => jn(e) || Ki(e), dc = (e) => jn(e) || qi(e) || Gi(e) || Ki(e), Be = (e) => e === "halfwidth-pause-or-stop" || e === "halfwidth-quotation" || e === "halfwidth-bracket" || e === "halfwidth-other-punctuation", Un = (e) => e === "fullwidth-pause-or-stop" || e === "fullwidth-quotation" || e === "fullwidth-bracket" || e === "fullwidth-other-punctuation", gc = (e) => e === "cjk-char" || Un(e), Wn = (e) => ae(e) || Cn(e) || e === "bracket-mark" || e === "group", Qi = (e) => Wn(e) || e === "code-content", Dt = (e) => e === "hyper-mark", mc = {
  [R.HALFWIDTH_PAUSE_OR_STOP]: ",.;:?!",
  [R.FULLWIDTH_PAUSE_OR_STOP]: [
    // normal punctuation marks
    "，。、；：？！",
    // special punctuation marks
    "⁈⁇‼⁉"
  ].join(""),
  [R.HALFWIDTH_QUOTATION]: `'"`,
  [R.FULLWIDTH_QUOTATION]: "‘’“”《》〈〉『』「」【】〖〗",
  [R.HALFWIDTH_BRACKET]: "()[]{}",
  [R.FULLWIDTH_BRACKET]: "（）〔〕［］｛｝",
  [R.HALFWIDTH_OTHER_PUNCTUATION]: [
    // on-keyboard symbols
    "~-+*/\\%=&|`<>@#$^",
    // symbol of death
    "†‡"
  ].join(""),
  [R.FULLWIDTH_OTHER_PUNCTUATION]: [
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
}, Ye = (e) => {
  if (e === "")
    return R.EMPTY;
  if (e.match(/\s/) != null)
    return R.SPACE;
  for (const [n, t] of Object.entries(mc))
    if ((t == null ? void 0 : t.indexOf(e)) >= 0)
      return n;
  return e.match(/[0-9]/) != null || e.match(/[\u0020-\u007F]/) != null || e.match(/[\u00A0-\u00FF]/) != null || e.match(/[\u0100-\u017F]/) != null || e.match(/[\u0180-\u024F]/) != null || e.match(/[\u0370-\u03FF]/) != null ? R.WESTERN_LETTER : e.match(/[\u4E00-\u9FFF]/) != null || e.match(/[\u3400-\u4DBF]/) != null || e.match(/[\ud840-\ud868][\udc00-\udfff]|\ud869[\udc00-\uded6]/) != null || e.match(
    /\ud869[\udf00-\udfff]|[\ud86a-\ud86c][\udc00-\udfff]|\ud86d[\udc00-\udf34]/
  ) != null || e.match(/\ud86d[\udf40-\udfff]|\ud86e[\udc00-\udc1d]/) != null || e.match(/[\uF900-\uFAFF]/) != null || e.match(/[\uFE30-\uFE4F]/) != null || e.match(/[\u2E80-\u2EFF]/) != null || e.match(/[\uE815-\uE864]/) != null || e.match(/[\u{20000}-\u{2A6DF}]/u) != null || e.match(/[\u{2F800}-\u{2FA1F}]/u) != null ? R.CJK_CHAR : e.match(/[\u3000-\u303F]/) != null ? R.FULLWIDTH_OTHER_PUNCTUATION : R.UNKNOWN;
};
var $n = { exports: {} }, nn, Hr;
function yc() {
  return Hr || (Hr = 1, nn = {
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
  }), nn;
}
var rn, Vr;
function Yi() {
  if (Vr)
    return rn;
  Vr = 1;
  const e = yc(), n = {};
  for (const r of Object.keys(e))
    n[e[r]] = r;
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
  rn = t;
  for (const r of Object.keys(t)) {
    if (!("channels" in t[r]))
      throw new Error("missing channels property: " + r);
    if (!("labels" in t[r]))
      throw new Error("missing channel labels property: " + r);
    if (t[r].labels.length !== t[r].channels)
      throw new Error("channel and label counts mismatch: " + r);
    const { channels: l, labels: u } = t[r];
    delete t[r].channels, delete t[r].labels, Object.defineProperty(t[r], "channels", { value: l }), Object.defineProperty(t[r], "labels", { value: u });
  }
  t.rgb.hsl = function(r) {
    const l = r[0] / 255, u = r[1] / 255, a = r[2] / 255, s = Math.min(l, u, a), c = Math.max(l, u, a), f = c - s;
    let o, p;
    c === s ? o = 0 : l === c ? o = (u - a) / f : u === c ? o = 2 + (a - l) / f : a === c && (o = 4 + (l - u) / f), o = Math.min(o * 60, 360), o < 0 && (o += 360);
    const h = (s + c) / 2;
    return c === s ? p = 0 : h <= 0.5 ? p = f / (c + s) : p = f / (2 - c - s), [o, p * 100, h * 100];
  }, t.rgb.hsv = function(r) {
    let l, u, a, s, c;
    const f = r[0] / 255, o = r[1] / 255, p = r[2] / 255, h = Math.max(f, o, p), d = h - Math.min(f, o, p), y = function(x) {
      return (h - x) / 6 / d + 1 / 2;
    };
    return d === 0 ? (s = 0, c = 0) : (c = d / h, l = y(f), u = y(o), a = y(p), f === h ? s = a - u : o === h ? s = 1 / 3 + l - a : p === h && (s = 2 / 3 + u - l), s < 0 ? s += 1 : s > 1 && (s -= 1)), [
      s * 360,
      c * 100,
      h * 100
    ];
  }, t.rgb.hwb = function(r) {
    const l = r[0], u = r[1];
    let a = r[2];
    const s = t.rgb.hsl(r)[0], c = 1 / 255 * Math.min(l, Math.min(u, a));
    return a = 1 - 1 / 255 * Math.max(l, Math.max(u, a)), [s, c * 100, a * 100];
  }, t.rgb.cmyk = function(r) {
    const l = r[0] / 255, u = r[1] / 255, a = r[2] / 255, s = Math.min(1 - l, 1 - u, 1 - a), c = (1 - l - s) / (1 - s) || 0, f = (1 - u - s) / (1 - s) || 0, o = (1 - a - s) / (1 - s) || 0;
    return [c * 100, f * 100, o * 100, s * 100];
  };
  function i(r, l) {
    return (r[0] - l[0]) ** 2 + (r[1] - l[1]) ** 2 + (r[2] - l[2]) ** 2;
  }
  return t.rgb.keyword = function(r) {
    const l = n[r];
    if (l)
      return l;
    let u = 1 / 0, a;
    for (const s of Object.keys(e)) {
      const c = e[s], f = i(r, c);
      f < u && (u = f, a = s);
    }
    return a;
  }, t.keyword.rgb = function(r) {
    return e[r];
  }, t.rgb.xyz = function(r) {
    let l = r[0] / 255, u = r[1] / 255, a = r[2] / 255;
    l = l > 0.04045 ? ((l + 0.055) / 1.055) ** 2.4 : l / 12.92, u = u > 0.04045 ? ((u + 0.055) / 1.055) ** 2.4 : u / 12.92, a = a > 0.04045 ? ((a + 0.055) / 1.055) ** 2.4 : a / 12.92;
    const s = l * 0.4124 + u * 0.3576 + a * 0.1805, c = l * 0.2126 + u * 0.7152 + a * 0.0722, f = l * 0.0193 + u * 0.1192 + a * 0.9505;
    return [s * 100, c * 100, f * 100];
  }, t.rgb.lab = function(r) {
    const l = t.rgb.xyz(r);
    let u = l[0], a = l[1], s = l[2];
    u /= 95.047, a /= 100, s /= 108.883, u = u > 8856e-6 ? u ** (1 / 3) : 7.787 * u + 16 / 116, a = a > 8856e-6 ? a ** (1 / 3) : 7.787 * a + 16 / 116, s = s > 8856e-6 ? s ** (1 / 3) : 7.787 * s + 16 / 116;
    const c = 116 * a - 16, f = 500 * (u - a), o = 200 * (a - s);
    return [c, f, o];
  }, t.hsl.rgb = function(r) {
    const l = r[0] / 360, u = r[1] / 100, a = r[2] / 100;
    let s, c, f;
    if (u === 0)
      return f = a * 255, [f, f, f];
    a < 0.5 ? s = a * (1 + u) : s = a + u - a * u;
    const o = 2 * a - s, p = [0, 0, 0];
    for (let h = 0; h < 3; h++)
      c = l + 1 / 3 * -(h - 1), c < 0 && c++, c > 1 && c--, 6 * c < 1 ? f = o + (s - o) * 6 * c : 2 * c < 1 ? f = s : 3 * c < 2 ? f = o + (s - o) * (2 / 3 - c) * 6 : f = o, p[h] = f * 255;
    return p;
  }, t.hsl.hsv = function(r) {
    const l = r[0];
    let u = r[1] / 100, a = r[2] / 100, s = u;
    const c = Math.max(a, 0.01);
    a *= 2, u *= a <= 1 ? a : 2 - a, s *= c <= 1 ? c : 2 - c;
    const f = (a + u) / 2, o = a === 0 ? 2 * s / (c + s) : 2 * u / (a + u);
    return [l, o * 100, f * 100];
  }, t.hsv.rgb = function(r) {
    const l = r[0] / 60, u = r[1] / 100;
    let a = r[2] / 100;
    const s = Math.floor(l) % 6, c = l - Math.floor(l), f = 255 * a * (1 - u), o = 255 * a * (1 - u * c), p = 255 * a * (1 - u * (1 - c));
    switch (a *= 255, s) {
      case 0:
        return [a, p, f];
      case 1:
        return [o, a, f];
      case 2:
        return [f, a, p];
      case 3:
        return [f, o, a];
      case 4:
        return [p, f, a];
      case 5:
        return [a, f, o];
    }
  }, t.hsv.hsl = function(r) {
    const l = r[0], u = r[1] / 100, a = r[2] / 100, s = Math.max(a, 0.01);
    let c, f;
    f = (2 - u) * a;
    const o = (2 - u) * s;
    return c = u * s, c /= o <= 1 ? o : 2 - o, c = c || 0, f /= 2, [l, c * 100, f * 100];
  }, t.hwb.rgb = function(r) {
    const l = r[0] / 360;
    let u = r[1] / 100, a = r[2] / 100;
    const s = u + a;
    let c;
    s > 1 && (u /= s, a /= s);
    const f = Math.floor(6 * l), o = 1 - a;
    c = 6 * l - f, f & 1 && (c = 1 - c);
    const p = u + c * (o - u);
    let h, d, y;
    switch (f) {
      default:
      case 6:
      case 0:
        h = o, d = p, y = u;
        break;
      case 1:
        h = p, d = o, y = u;
        break;
      case 2:
        h = u, d = o, y = p;
        break;
      case 3:
        h = u, d = p, y = o;
        break;
      case 4:
        h = p, d = u, y = o;
        break;
      case 5:
        h = o, d = u, y = p;
        break;
    }
    return [h * 255, d * 255, y * 255];
  }, t.cmyk.rgb = function(r) {
    const l = r[0] / 100, u = r[1] / 100, a = r[2] / 100, s = r[3] / 100, c = 1 - Math.min(1, l * (1 - s) + s), f = 1 - Math.min(1, u * (1 - s) + s), o = 1 - Math.min(1, a * (1 - s) + s);
    return [c * 255, f * 255, o * 255];
  }, t.xyz.rgb = function(r) {
    const l = r[0] / 100, u = r[1] / 100, a = r[2] / 100;
    let s, c, f;
    return s = l * 3.2406 + u * -1.5372 + a * -0.4986, c = l * -0.9689 + u * 1.8758 + a * 0.0415, f = l * 0.0557 + u * -0.204 + a * 1.057, s = s > 31308e-7 ? 1.055 * s ** (1 / 2.4) - 0.055 : s * 12.92, c = c > 31308e-7 ? 1.055 * c ** (1 / 2.4) - 0.055 : c * 12.92, f = f > 31308e-7 ? 1.055 * f ** (1 / 2.4) - 0.055 : f * 12.92, s = Math.min(Math.max(0, s), 1), c = Math.min(Math.max(0, c), 1), f = Math.min(Math.max(0, f), 1), [s * 255, c * 255, f * 255];
  }, t.xyz.lab = function(r) {
    let l = r[0], u = r[1], a = r[2];
    l /= 95.047, u /= 100, a /= 108.883, l = l > 8856e-6 ? l ** (1 / 3) : 7.787 * l + 16 / 116, u = u > 8856e-6 ? u ** (1 / 3) : 7.787 * u + 16 / 116, a = a > 8856e-6 ? a ** (1 / 3) : 7.787 * a + 16 / 116;
    const s = 116 * u - 16, c = 500 * (l - u), f = 200 * (u - a);
    return [s, c, f];
  }, t.lab.xyz = function(r) {
    const l = r[0], u = r[1], a = r[2];
    let s, c, f;
    c = (l + 16) / 116, s = u / 500 + c, f = c - a / 200;
    const o = c ** 3, p = s ** 3, h = f ** 3;
    return c = o > 8856e-6 ? o : (c - 16 / 116) / 7.787, s = p > 8856e-6 ? p : (s - 16 / 116) / 7.787, f = h > 8856e-6 ? h : (f - 16 / 116) / 7.787, s *= 95.047, c *= 100, f *= 108.883, [s, c, f];
  }, t.lab.lch = function(r) {
    const l = r[0], u = r[1], a = r[2];
    let s;
    s = Math.atan2(a, u) * 360 / 2 / Math.PI, s < 0 && (s += 360);
    const f = Math.sqrt(u * u + a * a);
    return [l, f, s];
  }, t.lch.lab = function(r) {
    const l = r[0], u = r[1], s = r[2] / 360 * 2 * Math.PI, c = u * Math.cos(s), f = u * Math.sin(s);
    return [l, c, f];
  }, t.rgb.ansi16 = function(r, l = null) {
    const [u, a, s] = r;
    let c = l === null ? t.rgb.hsv(r)[2] : l;
    if (c = Math.round(c / 50), c === 0)
      return 30;
    let f = 30 + (Math.round(s / 255) << 2 | Math.round(a / 255) << 1 | Math.round(u / 255));
    return c === 2 && (f += 60), f;
  }, t.hsv.ansi16 = function(r) {
    return t.rgb.ansi16(t.hsv.rgb(r), r[2]);
  }, t.rgb.ansi256 = function(r) {
    const l = r[0], u = r[1], a = r[2];
    return l === u && u === a ? l < 8 ? 16 : l > 248 ? 231 : Math.round((l - 8) / 247 * 24) + 232 : 16 + 36 * Math.round(l / 255 * 5) + 6 * Math.round(u / 255 * 5) + Math.round(a / 255 * 5);
  }, t.ansi16.rgb = function(r) {
    let l = r % 10;
    if (l === 0 || l === 7)
      return r > 50 && (l += 3.5), l = l / 10.5 * 255, [l, l, l];
    const u = (~~(r > 50) + 1) * 0.5, a = (l & 1) * u * 255, s = (l >> 1 & 1) * u * 255, c = (l >> 2 & 1) * u * 255;
    return [a, s, c];
  }, t.ansi256.rgb = function(r) {
    if (r >= 232) {
      const c = (r - 232) * 10 + 8;
      return [c, c, c];
    }
    r -= 16;
    let l;
    const u = Math.floor(r / 36) / 5 * 255, a = Math.floor((l = r % 36) / 6) / 5 * 255, s = l % 6 / 5 * 255;
    return [u, a, s];
  }, t.rgb.hex = function(r) {
    const u = (((Math.round(r[0]) & 255) << 16) + ((Math.round(r[1]) & 255) << 8) + (Math.round(r[2]) & 255)).toString(16).toUpperCase();
    return "000000".substring(u.length) + u;
  }, t.hex.rgb = function(r) {
    const l = r.toString(16).match(/[a-f0-9]{6}|[a-f0-9]{3}/i);
    if (!l)
      return [0, 0, 0];
    let u = l[0];
    l[0].length === 3 && (u = u.split("").map((o) => o + o).join(""));
    const a = parseInt(u, 16), s = a >> 16 & 255, c = a >> 8 & 255, f = a & 255;
    return [s, c, f];
  }, t.rgb.hcg = function(r) {
    const l = r[0] / 255, u = r[1] / 255, a = r[2] / 255, s = Math.max(Math.max(l, u), a), c = Math.min(Math.min(l, u), a), f = s - c;
    let o, p;
    return f < 1 ? o = c / (1 - f) : o = 0, f <= 0 ? p = 0 : s === l ? p = (u - a) / f % 6 : s === u ? p = 2 + (a - l) / f : p = 4 + (l - u) / f, p /= 6, p %= 1, [p * 360, f * 100, o * 100];
  }, t.hsl.hcg = function(r) {
    const l = r[1] / 100, u = r[2] / 100, a = u < 0.5 ? 2 * l * u : 2 * l * (1 - u);
    let s = 0;
    return a < 1 && (s = (u - 0.5 * a) / (1 - a)), [r[0], a * 100, s * 100];
  }, t.hsv.hcg = function(r) {
    const l = r[1] / 100, u = r[2] / 100, a = l * u;
    let s = 0;
    return a < 1 && (s = (u - a) / (1 - a)), [r[0], a * 100, s * 100];
  }, t.hcg.rgb = function(r) {
    const l = r[0] / 360, u = r[1] / 100, a = r[2] / 100;
    if (u === 0)
      return [a * 255, a * 255, a * 255];
    const s = [0, 0, 0], c = l % 1 * 6, f = c % 1, o = 1 - f;
    let p = 0;
    switch (Math.floor(c)) {
      case 0:
        s[0] = 1, s[1] = f, s[2] = 0;
        break;
      case 1:
        s[0] = o, s[1] = 1, s[2] = 0;
        break;
      case 2:
        s[0] = 0, s[1] = 1, s[2] = f;
        break;
      case 3:
        s[0] = 0, s[1] = o, s[2] = 1;
        break;
      case 4:
        s[0] = f, s[1] = 0, s[2] = 1;
        break;
      default:
        s[0] = 1, s[1] = 0, s[2] = o;
    }
    return p = (1 - u) * a, [
      (u * s[0] + p) * 255,
      (u * s[1] + p) * 255,
      (u * s[2] + p) * 255
    ];
  }, t.hcg.hsv = function(r) {
    const l = r[1] / 100, u = r[2] / 100, a = l + u * (1 - l);
    let s = 0;
    return a > 0 && (s = l / a), [r[0], s * 100, a * 100];
  }, t.hcg.hsl = function(r) {
    const l = r[1] / 100, a = r[2] / 100 * (1 - l) + 0.5 * l;
    let s = 0;
    return a > 0 && a < 0.5 ? s = l / (2 * a) : a >= 0.5 && a < 1 && (s = l / (2 * (1 - a))), [r[0], s * 100, a * 100];
  }, t.hcg.hwb = function(r) {
    const l = r[1] / 100, u = r[2] / 100, a = l + u * (1 - l);
    return [r[0], (a - l) * 100, (1 - a) * 100];
  }, t.hwb.hcg = function(r) {
    const l = r[1] / 100, a = 1 - r[2] / 100, s = a - l;
    let c = 0;
    return s < 1 && (c = (a - s) / (1 - s)), [r[0], s * 100, c * 100];
  }, t.apple.rgb = function(r) {
    return [r[0] / 65535 * 255, r[1] / 65535 * 255, r[2] / 65535 * 255];
  }, t.rgb.apple = function(r) {
    return [r[0] / 255 * 65535, r[1] / 255 * 65535, r[2] / 255 * 65535];
  }, t.gray.rgb = function(r) {
    return [r[0] / 100 * 255, r[0] / 100 * 255, r[0] / 100 * 255];
  }, t.gray.hsl = function(r) {
    return [0, 0, r[0]];
  }, t.gray.hsv = t.gray.hsl, t.gray.hwb = function(r) {
    return [0, 100, r[0]];
  }, t.gray.cmyk = function(r) {
    return [0, 0, 0, r[0]];
  }, t.gray.lab = function(r) {
    return [r[0], 0, 0];
  }, t.gray.hex = function(r) {
    const l = Math.round(r[0] / 100 * 255) & 255, a = ((l << 16) + (l << 8) + l).toString(16).toUpperCase();
    return "000000".substring(a.length) + a;
  }, t.rgb.gray = function(r) {
    return [(r[0] + r[1] + r[2]) / 3 / 255 * 100];
  }, rn;
}
var ln, jr;
function bc() {
  if (jr)
    return ln;
  jr = 1;
  const e = Yi();
  function n() {
    const l = {}, u = Object.keys(e);
    for (let a = u.length, s = 0; s < a; s++)
      l[u[s]] = {
        // http://jsperf.com/1-vs-infinity
        // micro-opt, but this is simple.
        distance: -1,
        parent: null
      };
    return l;
  }
  function t(l) {
    const u = n(), a = [l];
    for (u[l].distance = 0; a.length; ) {
      const s = a.pop(), c = Object.keys(e[s]);
      for (let f = c.length, o = 0; o < f; o++) {
        const p = c[o], h = u[p];
        h.distance === -1 && (h.distance = u[s].distance + 1, h.parent = s, a.unshift(p));
      }
    }
    return u;
  }
  function i(l, u) {
    return function(a) {
      return u(l(a));
    };
  }
  function r(l, u) {
    const a = [u[l].parent, l];
    let s = e[u[l].parent][l], c = u[l].parent;
    for (; u[c].parent; )
      a.unshift(u[c].parent), s = i(e[u[c].parent][c], s), c = u[c].parent;
    return s.conversion = a, s;
  }
  return ln = function(l) {
    const u = t(l), a = {}, s = Object.keys(u);
    for (let c = s.length, f = 0; f < c; f++) {
      const o = s[f];
      u[o].parent !== null && (a[o] = r(o, u));
    }
    return a;
  }, ln;
}
var un, Ur;
function xc() {
  if (Ur)
    return un;
  Ur = 1;
  const e = Yi(), n = bc(), t = {}, i = Object.keys(e);
  function r(u) {
    const a = function(...s) {
      const c = s[0];
      return c == null ? c : (c.length > 1 && (s = c), u(s));
    };
    return "conversion" in u && (a.conversion = u.conversion), a;
  }
  function l(u) {
    const a = function(...s) {
      const c = s[0];
      if (c == null)
        return c;
      c.length > 1 && (s = c);
      const f = u(s);
      if (typeof f == "object")
        for (let o = f.length, p = 0; p < o; p++)
          f[p] = Math.round(f[p]);
      return f;
    };
    return "conversion" in u && (a.conversion = u.conversion), a;
  }
  return i.forEach((u) => {
    t[u] = {}, Object.defineProperty(t[u], "channels", { value: e[u].channels }), Object.defineProperty(t[u], "labels", { value: e[u].labels });
    const a = n(u);
    Object.keys(a).forEach((c) => {
      const f = a[c];
      t[u][c] = l(f), t[u][c].raw = r(f);
    });
  }), un = t, un;
}
$n.exports;
(function(e) {
  const n = (f, o) => (...p) => `\x1B[${f(...p) + o}m`, t = (f, o) => (...p) => {
    const h = f(...p);
    return `\x1B[${38 + o};5;${h}m`;
  }, i = (f, o) => (...p) => {
    const h = f(...p);
    return `\x1B[${38 + o};2;${h[0]};${h[1]};${h[2]}m`;
  }, r = (f) => f, l = (f, o, p) => [f, o, p], u = (f, o, p) => {
    Object.defineProperty(f, o, {
      get: () => {
        const h = p();
        return Object.defineProperty(f, o, {
          value: h,
          enumerable: !0,
          configurable: !0
        }), h;
      },
      enumerable: !0,
      configurable: !0
    });
  };
  let a;
  const s = (f, o, p, h) => {
    a === void 0 && (a = xc());
    const d = h ? 10 : 0, y = {};
    for (const [x, b] of Object.entries(a)) {
      const C = x === "ansi16" ? "ansi" : x;
      x === o ? y[C] = f(p, d) : typeof b == "object" && (y[C] = f(b[o], d));
    }
    return y;
  };
  function c() {
    const f = /* @__PURE__ */ new Map(), o = {
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
    o.color.gray = o.color.blackBright, o.bgColor.bgGray = o.bgColor.bgBlackBright, o.color.grey = o.color.blackBright, o.bgColor.bgGrey = o.bgColor.bgBlackBright;
    for (const [p, h] of Object.entries(o)) {
      for (const [d, y] of Object.entries(h))
        o[d] = {
          open: `\x1B[${y[0]}m`,
          close: `\x1B[${y[1]}m`
        }, h[d] = o[d], f.set(y[0], y[1]);
      Object.defineProperty(o, p, {
        value: h,
        enumerable: !1
      });
    }
    return Object.defineProperty(o, "codes", {
      value: f,
      enumerable: !1
    }), o.color.close = "\x1B[39m", o.bgColor.close = "\x1B[49m", u(o.color, "ansi", () => s(n, "ansi16", r, !1)), u(o.color, "ansi256", () => s(t, "ansi256", r, !1)), u(o.color, "ansi16m", () => s(i, "rgb", l, !1)), u(o.bgColor, "ansi", () => s(n, "ansi16", r, !0)), u(o.bgColor, "ansi256", () => s(t, "ansi256", r, !0)), u(o.bgColor, "ansi16m", () => s(i, "rgb", l, !0)), o;
  }
  Object.defineProperty(e, "exports", {
    enumerable: !0,
    get: c
  });
})($n);
var kc = $n.exports, wc = {
  stdout: !1,
  stderr: !1
};
const Ec = (e, n, t) => {
  let i = e.indexOf(n);
  if (i === -1)
    return e;
  const r = n.length;
  let l = 0, u = "";
  do
    u += e.substr(l, i - l) + n + t, l = i + r, i = e.indexOf(n, l);
  while (i !== -1);
  return u += e.substr(l), u;
}, Ac = (e, n, t, i) => {
  let r = 0, l = "";
  do {
    const u = e[i - 1] === "\r";
    l += e.substr(r, (u ? i - 1 : i) - r) + n + (u ? `\r
` : `
`) + t, r = i + 1, i = e.indexOf(`
`, r);
  } while (i !== -1);
  return l += e.substr(r), l;
};
var Sc = {
  stringReplaceAll: Ec,
  stringEncaseCRLFWithFirstIndex: Ac
}, an, Wr;
function Cc() {
  if (Wr)
    return an;
  Wr = 1;
  const e = /(?:\\(u(?:[a-f\d]{4}|\{[a-f\d]{1,6}\})|x[a-f\d]{2}|.))|(?:\{(~)?(\w+(?:\([^)]*\))?(?:\.\w+(?:\([^)]*\))?)*)(?:[ \t]|(?=\r?\n)))|(\})|((?:.|[\r\n\f])+?)/gi, n = /(?:^|\.)(\w+)(?:\(([^)]*)\))?/g, t = /^(['"])((?:\\.|(?!\1)[^\\])*)\1$/, i = /\\(u(?:[a-f\d]{4}|\{[a-f\d]{1,6}\})|x[a-f\d]{2}|.)|([^\\])/gi, r = /* @__PURE__ */ new Map([
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
  function l(c) {
    const f = c[0] === "u", o = c[1] === "{";
    return f && !o && c.length === 5 || c[0] === "x" && c.length === 3 ? String.fromCharCode(parseInt(c.slice(1), 16)) : f && o ? String.fromCodePoint(parseInt(c.slice(2, -1), 16)) : r.get(c) || c;
  }
  function u(c, f) {
    const o = [], p = f.trim().split(/\s*,\s*/g);
    let h;
    for (const d of p) {
      const y = Number(d);
      if (!Number.isNaN(y))
        o.push(y);
      else if (h = d.match(t))
        o.push(h[2].replace(i, (x, b, C) => b ? l(b) : C));
      else
        throw new Error(`Invalid Chalk template style argument: ${d} (in style '${c}')`);
    }
    return o;
  }
  function a(c) {
    n.lastIndex = 0;
    const f = [];
    let o;
    for (; (o = n.exec(c)) !== null; ) {
      const p = o[1];
      if (o[2]) {
        const h = u(p, o[2]);
        f.push([p].concat(h));
      } else
        f.push([p]);
    }
    return f;
  }
  function s(c, f) {
    const o = {};
    for (const h of f)
      for (const d of h.styles)
        o[d[0]] = h.inverse ? null : d.slice(1);
    let p = c;
    for (const [h, d] of Object.entries(o))
      if (Array.isArray(d)) {
        if (!(h in p))
          throw new Error(`Unknown Chalk style: ${h}`);
        p = d.length > 0 ? p[h](...d) : p[h];
      }
    return p;
  }
  return an = (c, f) => {
    const o = [], p = [];
    let h = [];
    if (f.replace(e, (d, y, x, b, C, w) => {
      if (y)
        h.push(l(y));
      else if (b) {
        const O = h.join("");
        h = [], p.push(o.length === 0 ? O : s(c, o)(O)), o.push({ inverse: x, styles: a(b) });
      } else if (C) {
        if (o.length === 0)
          throw new Error("Found extraneous } in Chalk template literal");
        p.push(s(c, o)(h.join(""))), h = [], o.pop();
      } else
        h.push(w);
    }), p.push(h.join("")), o.length > 0) {
      const d = `Chalk template literal is missing ${o.length} closing bracket${o.length === 1 ? "" : "s"} (\`}\`)`;
      throw new Error(d);
    }
    return p.join("");
  }, an;
}
const ct = kc, { stdout: Tn, stderr: Fn } = wc, {
  stringReplaceAll: Tc,
  stringEncaseCRLFWithFirstIndex: Fc
} = Sc, Ji = [
  "ansi",
  "ansi",
  "ansi256",
  "ansi16m"
], Je = /* @__PURE__ */ Object.create(null), Oc = (e, n = {}) => {
  if (n.level > 3 || n.level < 0)
    throw new Error("The `level` option should be an integer from 0 to 3");
  const t = Tn ? Tn.level : 0;
  e.level = n.level === void 0 ? t : n.level;
};
class Ic {
  constructor(n) {
    return Zi(n);
  }
}
const Zi = (e) => {
  const n = {};
  return Oc(n, e), n.template = (...t) => Rc(n.template, ...t), Object.setPrototypeOf(n, Mt.prototype), Object.setPrototypeOf(n.template, n), n.template.constructor = () => {
    throw new Error("`chalk.constructor()` is deprecated. Use `new chalk.Instance()` instead.");
  }, n.template.Instance = Ic, n.template;
};
function Mt(e) {
  return Zi(e);
}
for (const [e, n] of Object.entries(ct))
  Je[e] = {
    get() {
      const t = zt(this, qn(n.open, n.close, this._styler), this._isEmpty);
      return Object.defineProperty(this, e, { value: t }), t;
    }
  };
Je.visible = {
  get() {
    const e = zt(this, this._styler, !0);
    return Object.defineProperty(this, "visible", { value: e }), e;
  }
};
const Xi = ["rgb", "hex", "keyword", "hsl", "hsv", "hwb", "ansi", "ansi256"];
for (const e of Xi)
  Je[e] = {
    get() {
      const { level: n } = this;
      return function(...t) {
        const i = qn(ct.color[Ji[n]][e](...t), ct.color.close, this._styler);
        return zt(this, i, this._isEmpty);
      };
    }
  };
for (const e of Xi) {
  const n = "bg" + e[0].toUpperCase() + e.slice(1);
  Je[n] = {
    get() {
      const { level: t } = this;
      return function(...i) {
        const r = qn(ct.bgColor[Ji[t]][e](...i), ct.bgColor.close, this._styler);
        return zt(this, r, this._isEmpty);
      };
    }
  };
}
const Pc = Object.defineProperties(() => {
}, {
  ...Je,
  level: {
    enumerable: !0,
    get() {
      return this._generator.level;
    },
    set(e) {
      this._generator.level = e;
    }
  }
}), qn = (e, n, t) => {
  let i, r;
  return t === void 0 ? (i = e, r = n) : (i = t.openAll + e, r = n + t.closeAll), {
    open: e,
    close: n,
    openAll: i,
    closeAll: r,
    parent: t
  };
}, zt = (e, n, t) => {
  const i = (...r) => _c(i, r.length === 1 ? "" + r[0] : r.join(" "));
  return i.__proto__ = Pc, i._generator = e, i._styler = n, i._isEmpty = t, i;
}, _c = (e, n) => {
  if (e.level <= 0 || !n)
    return e._isEmpty ? "" : n;
  let t = e._styler;
  if (t === void 0)
    return n;
  const { openAll: i, closeAll: r } = t;
  if (n.indexOf("\x1B") !== -1)
    for (; t !== void 0; )
      n = Tc(n, t.close, t.open), t = t.parent;
  const l = n.indexOf(`
`);
  return l !== -1 && (n = Fc(n, r, i, l)), i + n + r;
};
let sn;
const Rc = (e, ...n) => {
  const [t] = n;
  if (!Array.isArray(t))
    return n.join(" ");
  const i = n.slice(1), r = [t.raw[0]];
  for (let l = 1; l < t.length; l++)
    r.push(
      String(i[l - 1]).replace(/[{}\\]/g, "\\$&"),
      String(t.raw[l])
    );
  return sn === void 0 && (sn = Cc()), sn(e, r.join(""));
};
Object.defineProperties(Mt.prototype, Je);
const pt = Mt();
pt.supportsColor = Tn;
pt.stderr = Mt({ level: Fn ? Fn.level : 0 });
pt.stderr.supportsColor = Fn;
pt.Level = {
  None: 0,
  Basic: 1,
  Ansi256: 2,
  TrueColor: 3,
  0: "None",
  1: "Basic",
  2: "Ansi256",
  3: "TrueColor"
};
var Bc = pt;
const at = /* @__PURE__ */ _t(Bc);
var ui, ai;
const ve = {
  stdout: (ui = globalThis == null ? void 0 : globalThis.process) == null ? void 0 : ui.stdout,
  stderr: (ai = globalThis == null ? void 0 : globalThis.process) == null ? void 0 : ai.stderr,
  defaultLogger: console
}, Lc = (e, n) => {
  const t = e.split(`
`), i = t.map((l) => l.length), r = {
    offset: n,
    row: 0,
    column: 0,
    line: ""
  };
  for (; r.offset >= 0 && t.length; )
    r.row++, r.column = r.offset, r.line = t.shift() || "", r.offset -= (i.shift() || 0) + 1;
  return r;
};
var D = /* @__PURE__ */ ((e) => (e.VALUE = "value", e.START_VALUE = "startValue", e.END_VALUE = "endValue", e.SPACE_AFTER = "spaceAfter", e.INNER_SPACE_BEFORE = "innerSpaceBefore", e))(D || {});
const $r = "“”‘’", vc = (e, n) => {
  const t = e.substring(0, n);
  let i = 0, r = 0;
  for (let l = 0; l < t.length; l++) {
    const u = Ye(t[l]);
    u === R.CJK_CHAR || Un(u) && $r.indexOf(t[l]) === -1 ? i++ : (u === R.WESTERN_LETTER || Be(u) && $r.indexOf(t[l]) !== -1 || u === R.SPACE) && r++;
  }
  return " ".repeat(r) + "　".repeat(i) + `${at.red("^")}`;
}, Dc = (e = "", n, t, i = ve.defaultLogger) => {
  t.forEach(({ index: r, length: l, target: u, message: a }) => {
    const s = u === "spaceAfter" || u === "endValue" ? r + l : r, { row: c, column: f, line: o } = Lc(n, s), p = `${at.blue.bgWhite(e)}${e ? ":" : ""}`, h = `${at.yellow(c)}:${at.yellow(f)}`, d = `${p}${h} - ${a}`, y = 20, x = f - y < 0 ? 0 : f - y, b = f + l + y > o.length - 1 ? o.length : f + l + y, C = o.substring(x, b).replace(/\n/g, "\\n"), w = vc(C, f - x);
    i.error(`${d}

${C}
${w}
`);
  });
}, hh = (e, n = ve.defaultLogger) => {
  let t = 0;
  const i = [];
  if (e.filter(({ file: r, disabled: l }) => l ? (r ? n.log(`${at.blue.bgWhite(r)}: disabled`) : n.log("disabled"), !1) : !0).forEach(({ file: r, origin: l, validations: u }) => {
    Dc(r, l, u, n), t += u.length, r && u.length && i.push(r);
  }), t) {
    const r = [];
    return r.push("Invalid files:"), r.push("- " + i.join(`
- `) + `
`), r.push(`Found ${t} ${t > 1 ? "errors" : "error"}.`), n.error(r.join(`
`)), 1;
  } else
    n.log("No error found.");
}, qr = "括号未闭合", Mc = "括号未匹配", Gr = "引号未闭合", zc = "引号未匹配", Nc = (e, n, t, i) => {
  if (st(i, e), Gi(t)) {
    Nr.left.indexOf(n) >= 0 ? (Uc(i, e, n), Yr(i, e, n, q.LEFT)) : Nr.right.indexOf(n) >= 0 && (!i.lastMark || !i.lastMark.startValue ? (Jr(i, e, n), Ge(i, e, Mc)) : (Yr(i, e, n, q.RIGHT), Wc(i, e, n)));
    return;
  }
  if (qi(t)) {
    tn.neutral.indexOf(n) >= 0 ? i.lastGroup && n === i.lastGroup.startValue ? Xr(i, e, n) : Zr(i, e, n) : tn.left.indexOf(n) >= 0 ? Zr(i, e, n) : tn.right.indexOf(n) >= 0 && (!i.lastGroup || !i.lastGroup.startValue ? (Jr(i, e, n), Ge(i, e, zc)) : Xr(i, e, n));
    return;
  }
  $c(i, e, n, t);
}, Kr = (e, n, t, i) => {
  i.lastToken ? i.lastToken.type !== t ? (st(i, e), ei(i, e, n, t)) : el(i, n) : ei(i, e, n, t);
}, Hc = (e, n) => {
  const t = [];
  return Object.assign(t, {
    type: ee.GROUP,
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
    marks: [...n],
    groups: [],
    markStack: [],
    groupStack: [],
    errors: []
  };
}, st = (e, n) => {
  e.lastToken && (e.lastToken.length = n - e.lastToken.index, e.lastGroup && e.lastGroup.push(e.lastToken), e.lastToken = void 0);
}, dt = (e, n) => {
  e.lastGroup && e.lastGroup.push(n), e.lastToken = void 0;
}, Vc = (e) => {
  switch (e) {
    case ge.HYPER:
      return $.HYPER_MARK;
    case ge.BRACKETS:
      return $.BRACKET_MARK;
    case ge.RAW:
      return $.INDETERMINATED;
  }
}, Qr = (e, n, t, i, r) => {
  const l = {
    type: Vc(t.type),
    index: n,
    length: i.length,
    value: i,
    spaceAfter: "",
    // to be finalized
    mark: t,
    markSide: r
  };
  dt(e, l);
}, jc = (e, n, t) => {
  const i = {
    type: Yc(t),
    index: n,
    length: t.length,
    value: t,
    spaceAfter: ""
    // to be finalized
  };
  dt(e, i);
}, Uc = (e, n, t, i = ge.BRACKETS) => {
  e.lastMark && (e.markStack.push(e.lastMark), e.lastMark = void 0);
  const r = {
    type: i,
    startIndex: n,
    startValue: t,
    endIndex: -1,
    // to be finalized
    endValue: ""
    // to be finalized
  };
  e.marks.push(r), e.lastMark = r;
}, Yr = (e, n, t, i) => {
  const r = {
    type: $.BRACKET_MARK,
    index: n,
    length: 1,
    value: t,
    spaceAfter: "",
    // to be finalized
    mark: e.lastMark,
    markSide: i
  };
  dt(e, r);
}, Wc = (e, n, t) => {
  e.lastMark && (e.lastMark.endIndex = n, e.lastMark.endValue = t, e.markStack.length > 0 ? e.lastMark = e.markStack.pop() : e.lastMark = void 0);
}, $c = (e, n, t, i) => {
  dt(e, {
    type: i,
    index: n,
    length: 1,
    value: t,
    spaceAfter: ""
    // to be finalized
  });
}, Jr = (e, n, t) => {
  const i = {
    type: $.UNMATCHED,
    index: n,
    length: 1,
    value: t,
    spaceAfter: ""
  };
  dt(e, i);
}, Zr = (e, n, t) => {
  e.lastGroup && e.groupStack.push(e.lastGroup);
  const i = [];
  Object.assign(i, {
    type: ee.GROUP,
    index: n,
    spaceAfter: "",
    // to be finalized
    startIndex: n,
    startValue: t,
    endIndex: -1,
    // to be finalized
    endValue: "",
    // to be finalized
    innerSpaceBefore: ""
    // to be finalized
  }), e.groupStack[e.groupStack.length - 1].push(i), e.lastGroup = i, e.groups.push(i);
}, Xr = (e, n, t) => {
  e.lastGroup && (e.lastGroup.endIndex = n, e.lastGroup.endValue = t), e.groupStack.length > 0 ? e.lastGroup = e.groupStack.pop() : e.lastGroup = void 0;
}, ei = (e, n, t, i) => {
  e.lastToken = {
    type: i,
    index: n,
    length: 1,
    // to be finalized
    value: t,
    // to be finalized
    spaceAfter: ""
    // to be finalized
  };
}, el = (e, n) => {
  e.lastToken && (e.lastToken.value += n, e.lastToken.length++);
}, qc = (e, n) => {
  if (Ye(e[n]) !== R.SPACE)
    return 0;
  for (let t = n + 1; t < e.length; t++) {
    const i = e[t];
    if (Ye(i) !== R.SPACE)
      return t - n;
  }
  return e.length - n;
}, Gc = (e) => {
  if (e.lastGroup)
    return e.lastGroup[e.lastGroup.length - 1];
}, Kc = (e) => {
  const n = {};
  return e.forEach((t) => {
    n[t.startIndex] = t, t.type !== ge.RAW && (n[t.endIndex] = t);
  }), n;
}, Qc = (e, n, t, i) => {
  if (oc.indexOf(i) < 0 || !n.lastToken || n.lastToken.type !== R.WESTERN_LETTER || e.length <= t + 1)
    return !1;
  const r = e[t + 1], l = Ye(r);
  return (l === R.WESTERN_LETTER || l === R.SPACE) && (!n.lastGroup || n.lastGroup.startValue !== cc[i]);
}, Yc = (e) => e.match(/\n/) ? $.HYPER_CONTENT : e.match(/^<code.*>.*<\/code.*>$/) ? $.CODE_CONTENT : e.match(/^<.+>$/) ? $.HYPER_CONTENT : $.CODE_CONTENT, Ge = (e, n, t) => {
  e.errors.push({
    name: "",
    index: n,
    length: 0,
    message: t,
    target: D.VALUE
  });
}, Jc = (e) => {
  const n = e.lastMark;
  n && n.type === ge.BRACKETS && !n.endValue && Ge(e, n.startIndex, qr), e.markStack.length > 0 && e.markStack.forEach((i) => {
    i !== n && Ge(e, i.startIndex, qr);
  });
  const t = e.lastGroup;
  t && t.startValue && !t.endValue && Ge(e, t.startIndex, Gr), e.groupStack.length > 0 && e.groupStack.forEach((i) => {
    i !== t && i.startValue && !i.endValue && Ge(e, i.startIndex, Gr);
  });
}, Zc = (e, n = []) => {
  const t = Hc(e, n), i = Kc(n);
  for (let r = 0; r < e.length; r++) {
    const l = e[r], u = Ye(l), a = i[r];
    if (a)
      st(t, r), delete i[r], a.type === ge.RAW ? (jc(
        t,
        r,
        e.substring(a.startIndex, a.endIndex)
      ), r = a.endIndex - 1) : r === a.startIndex ? (Qr(
        t,
        r,
        a,
        a.startValue,
        q.LEFT
      ), r += a.startValue.length - 1) : r === a.endIndex && (Qr(
        t,
        r,
        a,
        a.endValue,
        q.RIGHT
      ), r += a.endValue.length - 1);
    else if (u === R.SPACE) {
      if (st(t, r), t.lastGroup) {
        const s = qc(e, r), c = e.substring(r, r + s);
        if (t.lastGroup.length) {
          const f = Gc(t);
          f && (f.spaceAfter = c);
        } else
          t.lastGroup.innerSpaceBefore = c;
        s - 1 > 0 && (r += s - 1);
      }
    } else
      Qc(e, t, r, l) ? el(t, l) : dc(u) ? Nc(r, l, u, t) : ae(u) ? Kr(r, l, u, t) : u === R.EMPTY || Kr(r, l, R.WESTERN_LETTER, t);
  }
  return st(t, e.length), Jc(t), {
    tokens: t.tokens,
    groups: t.groups,
    marks: t.marks,
    errors: t.errors
  };
}, tl = (e) => {
  if (Array.isArray(e)) {
    const n = e;
    return n.modifiedType = e.type, n.modifiedValue = e.value, n.modifiedSpaceAfter = e.spaceAfter, n.modifiedStartValue = e.startValue, n.modifiedEndValue = e.endValue, n.modifiedInnerSpaceBefore = e.innerSpaceBefore, n.validations = [], e.forEach(tl), n;
  } else {
    const n = e;
    return n.modifiedType = e.type, n.modifiedValue = e.value, n.modifiedSpaceAfter = e.spaceAfter, n.validations = [], n;
  }
}, Xc = (e) => {
  const n = e;
  return n.modifiedStartValue = e.startValue, n.modifiedEndValue = e.endValue, n;
}, ef = (e, n = {}) => (n.noSinglePair || (e.errors.length = 0), tl(e.tokens), e.marks.forEach(Xc), e), nl = (e, n) => {
  for (let t = 0; t < e.length; t++) {
    const i = e[t];
    n(i, t, e), Array.isArray(i) && nl(i, n);
  }
}, tf = (e) => {
  var n, t;
  return {
    start: ((n = e == null ? void 0 : e.start) == null ? void 0 : n.offset) || 0,
    end: ((t = e == null ? void 0 : e.end) == null ? void 0 : t.offset) || 0
  };
}, rl = (e) => e.children !== void 0, nf = ["paragraph", "heading", "table-cell"], rf = (e) => nf.indexOf(e.type) >= 0, lf = [
  "emphasis",
  "strong",
  "delete",
  "link",
  "linkReference"
], uf = (e) => lf.indexOf(e.type) >= 0, af = [
  "inlineCode",
  "break",
  "image",
  "imageReference",
  "footnoteDefinition",
  "html"
], il = (e) => af.indexOf(e.type) >= 0, ll = (e, n) => {
  rl(e) && e.children.forEach((t) => {
    if (t.type !== "yaml")
      if (rf(t)) {
        const i = {
          block: t,
          inlineMarks: [],
          hyperMarks: [],
          value: ""
          // to be initialzed
        };
        n.push(i), ul(t, i);
      } else
        ll(t, n);
  });
}, ul = (e, n) => {
  rl(e) && e.children.forEach((t) => {
    uf(t) && (n.inlineMarks.push({ inline: t, raw: !1 }), ul(t, n)), il(t) && n.inlineMarks.push({ inline: t, raw: !0 });
  });
}, sf = (e, n) => {
  const { block: t, inlineMarks: i } = e;
  if (!t.position)
    return;
  const r = t.position.start.offset || 0, l = [], u = [];
  i.forEach((a) => {
    const { inline: s } = a;
    if (!s.position)
      return;
    const c = s.position.start.offset || 0, f = s.position.end.offset || 0;
    if (il(s)) {
      const o = {
        type: ge.RAW,
        // TODO: typeof RawMark.meta
        meta: s.type,
        startIndex: c - r,
        endIndex: f - r,
        startValue: n.substring(c, f),
        endValue: ""
      };
      if (o.startValue.match(/<code.*>/)) {
        const p = { ...o, code: q.LEFT };
        u.push(p), l.push(p);
        return;
      } else if (o.startValue.match(/<\/code.*>/)) {
        const p = { ...o, code: q.RIGHT }, h = u.pop();
        h && (h.rightPair = p), l.push(p);
        return;
      }
      l.push(o);
    } else {
      const o = s.children[0], p = s.children[s.children.length - 1];
      if (!o.position || !p.position)
        return;
      const h = o.position.start.offset || 0, d = p.position.end.offset || 0, y = {
        type: ge.HYPER,
        // TODO: typeof RawMark.meta
        meta: s.type,
        startIndex: c - r,
        startValue: n.substring(c, h),
        endIndex: d - r,
        endValue: n.substring(d, f)
      };
      l.push(y);
    }
  }), e.value = n.substring(
    t.position.start.offset || 0,
    t.position.end.offset || 0
  ), e.hyperMarks = l.map((a) => {
    if (hc(a)) {
      if (a.code === q.RIGHT)
        return;
      if (a.code === q.LEFT) {
        const { rightPair: s } = a;
        a.startValue = n.substring(
          a.startIndex + r,
          a.endIndex + r
        ), a.endIndex = (s == null ? void 0 : s.endIndex) || 0, a.endValue = "", delete a.rightPair;
      }
    }
    return a;
  }).filter(Boolean);
}, of = (e) => {
  const n = e.value, t = e.modifiedValue, i = e.ignoredByParsers, r = [], l = Yl().use(ts).use(Yo).use(sc).parse(t);
  return ll(l, r), r.forEach((u) => sf(u, n)), e.blocks = r.map((u) => {
    const a = tf(u.block.position);
    return i.forEach(({ index: s, length: c, originValue: f, meta: o }) => {
      a.start <= s && a.end >= s + c && u.hyperMarks && u.hyperMarks.push({
        type: ge.RAW,
        meta: o,
        startIndex: s - a.start,
        startValue: f,
        endIndex: s - a.start + c,
        endValue: ""
      });
    }), {
      value: u.value || "",
      marks: u.hyperMarks || [],
      ...a
    };
  }), e.ignoredByParsers = [], e;
}, cf = "此处内联代码的外部需要一个空格", ff = "此处内联代码的外部不需要空格", on = "此处 Markdown 标记的内部不需要空格", cn = "此处字符需要统一", fn = "此处标点符号需要使用全角", hn = "此处标点符号需要使用半角", hf = "此处标点符号前不需要空格", pf = "此处标点符号后不需要空格", df = "此处标点符号后需要一个空格", ti = "此处括号的内部不需要空格", We = "此处括号的外部不需要空格", pn = "此处括号的外部需要一个空格", gf = "此处半角内容之间需要一个空格", mf = "此处全角内容之间不需要空格", yf = "此处中英文内容之间需要一个空格", bf = "此处中英文内容之间需要一个空格", dn = "此处引号的内部不需要空格", rt = "此处引号的外部不需要空格", xt = "此处引号的外部需要一个空格", it = "此处需要去除外部空格", Te = (e, n) => {
  if (!n)
    return;
  const t = e.indexOf(n);
  if (!(t < 0))
    return e[t - 1];
}, se = (e, n) => {
  if (!n)
    return;
  const t = e.indexOf(n);
  if (!(t < 0))
    return e[t + 1];
}, Gn = (e, n) => {
  if (!n)
    return;
  const t = Te(e, n);
  if (t) {
    if (Dt(t.type) || Xe(t))
      return Gn(e, t);
    if (Wn(t.type))
      return t;
  }
}, Nt = (e, n) => {
  if (!n)
    return;
  const t = se(e, n);
  if (t) {
    if (Dt(t.type) || Xe(t))
      return Nt(e, t);
    if (Wn(t.type))
      return t;
  }
}, gt = (e, n) => {
  if (!n)
    return;
  const t = Te(e, n);
  if (t) {
    if (Dt(t.type) || Xe(t))
      return gt(e, t);
    if (Qi(t.type))
      return t;
  }
}, Ze = (e, n) => {
  if (!n)
    return;
  const t = se(e, n);
  if (t) {
    if (Dt(t.type) || Xe(t))
      return Ze(e, t);
    if (Qi(t.type))
      return t;
  }
}, xf = (e) => e.type !== $.HYPER_CONTENT ? !1 : !!e.value.match(/^<.+>$/), Xe = (e) => {
  if (xf(e) && !e.value.match(/^<code.*>.*<\/code.*>$/) && !e.value.match(/^<[^/].+\/\s*>$/)) {
    if (e.value.match(/^<[^/].+>$/))
      return q.LEFT;
    if (e.value.match(/^<\/.+>$/))
      return q.RIGHT;
  }
}, Re = (e) => e.type === $.HYPER_MARK || !!Xe(e), ot = (e) => e.type === $.HYPER_MARK ? e.markSide : Xe(e), Pt = (e, n, t, i) => {
  if (i) {
    const r = Te(e, n);
    r && Re(r) && (t.unshift(r), Pt(e, r, t, i));
  } else {
    const r = se(e, n);
    r && Re(r) && (t.push(r), Pt(e, r, t, i));
  }
}, On = (e, n) => {
  const t = [n];
  return Pt(e, n, t, !1), Pt(e, n, t, !0), t;
}, kf = (e, n) => {
  if (!n.length)
    return;
  const t = n[0], i = n[n.length - 1], r = ot(t), l = ot(i), u = Te(e, t);
  if (!u || !r || !l)
    return;
  if (r === l)
    return r === q.LEFT ? u : i;
  if (r === q.LEFT)
    return;
  let a = u;
  for (; a && a !== i; ) {
    const s = se(e, a);
    if (s && ot(s) === q.LEFT)
      return a;
    a = s;
  }
  return u;
}, ie = (e, n, t) => {
  if (!n || !t)
    return {
      spaceHost: void 0,
      wrappers: [],
      tokens: []
    };
  const i = se(e, n), r = Ze(e, n);
  if (!i || r !== t)
    return {
      spaceHost: void 0,
      wrappers: [],
      tokens: []
    };
  if (i === t)
    return {
      spaceHost: n,
      wrappers: [],
      tokens: [n]
    };
  const l = On(e, i);
  return {
    spaceHost: kf(e, l),
    wrappers: l,
    tokens: [n, ...l]
  };
}, al = (e, n) => {
  const t = Te(e, n), i = se(e, n);
  return Be(n.type) && t && t.type === R.WESTERN_LETTER && i && i.type === R.WESTERN_LETTER ? !t.spaceAfter && !n.spaceAfter : !1;
}, sl = (e, n) => {
  if (Be(n.type)) {
    const t = Te(e, n), i = se(e, n);
    if (t && Be(t.type) && !t.spaceAfter || i && Be(i.type) && !n.spaceAfter)
      return !0;
  }
  return !1;
}, wf = (e, n, t, i) => {
  const r = {
    index: e.index,
    length: e.length,
    target: n,
    name: i,
    message: t
  };
  return n === D.START_VALUE ? (r.index = e.startIndex, r.length = 0) : n === D.END_VALUE ? (r.index = e.endIndex, r.length = 0) : n === D.INNER_SPACE_BEFORE && (r.index = e.startIndex, r.length = e.startValue.length), r;
}, ol = (e, n, t, i) => {
  const r = wf(e, n, t, i);
  le(e, n), e.validations.push(r);
}, le = (e, n) => {
  e.validations = e.validations.filter(
    (t) => t.target !== n
  );
}, Ht = (e, n) => (t, i, r) => {
  t[e] !== i && (t[e] = i, ol(t, n, r, ""));
}, V = Ht(
  "modifiedSpaceAfter",
  D.SPACE_AFTER
), In = Ht(
  "modifiedStartValue",
  D.START_VALUE
), Pn = Ht(
  "modifiedEndValue",
  D.END_VALUE
), _n = Ht(
  "modifiedInnerSpaceBefore",
  D.INNER_SPACE_BEFORE
), Rn = (e, n, t, i) => {
  e.modifiedValue !== n && (e.modifiedValue = n, t && (e.modifiedType = t), ol(e, D.VALUE, i, ""));
}, Ef = (e) => {
  const n = e == null ? void 0 : e.trimSpace;
  return (t, i, r) => {
    if (n && !r.startValue && i === 0) {
      r.modifiedInnerSpaceBefore && _n(r, "", it), Re(t) && On(r, t).forEach(
        (u) => V(u, "", it)
      );
      const l = r[r.length - 1];
      if (l)
        if (Re(l)) {
          const u = gt(r, t);
          u && (On(r, l).forEach(
            (a) => V(a, "", it)
          ), V(u, "", it));
        } else
          V(l, "", it);
    }
  };
}, Af = [
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
], Sf = [
  ['"', "“", "”"],
  ["'", "‘", "’"]
], Cf = (e, n) => {
  n.indexOf(e.modifiedValue) >= 0 && (e.modifiedType = $i(e.type));
}, Tf = (e) => {
  const n = (e == null ? void 0 : e.halfwidthPunctuation) || "", t = (e == null ? void 0 : e.fullwidthPunctuation) || "", i = (e == null ? void 0 : e.adjustedFullwidthPunctuation) || "", r = {}, l = {}, u = {};
  return Af.forEach(([a, s]) => {
    n.indexOf(a) >= 0 && (r[s] = a), t.indexOf(s) >= 0 && (l[a] = s);
  }), Sf.forEach(([a, s, c]) => {
    n.indexOf(a) >= 0 && (r[s] = a, r[c] = a), (t.indexOf(s) >= 0 || t.indexOf(c) >= 0) && (u[a] = [s, c]);
  }), {
    halfwidthMap: r,
    fullwidthMap: l,
    fullwidthPairMap: u,
    adjusted: i
  };
}, Ff = (e) => {
  const { halfwidthMap: n, fullwidthMap: t, fullwidthPairMap: i, adjusted: r } = Tf(e);
  return (u, a, s) => {
    if (!Cn(u.type) && u.type !== $.BRACKET_MARK && u.type !== ee.GROUP || al(s, u) || sl(s, u))
      return;
    if (Cn(u.type) || u.type === $.BRACKET_MARK) {
      const o = u.modifiedValue;
      t[o] ? (Rn(
        u,
        t[o],
        pc(u.type),
        fn
      ), Cf(u, r)) : n[o] && Rn(
        u,
        n[o],
        $i(u.type),
        hn
      );
      return;
    }
    const c = u.modifiedStartValue, f = u.modifiedEndValue;
    i[c] ? In(
      u,
      i[c][0],
      fn
    ) : n[c] && In(
      u,
      n[c][0],
      hn
    ), i[f] ? Pn(
      u,
      i[f][1],
      fn
    ) : n[f] && Pn(u, n[f][1], hn);
  };
}, gn = {
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
}, Of = {
  "“": ["「"],
  "”": ["」"],
  "‘": ["『"],
  "’": ["』"]
}, If = {
  "「": ["“"],
  "」": ["”"],
  "『": ["‘"],
  "』": ["’"]
}, Pf = (e) => {
  const n = {};
  for (const t in e)
    e[t].forEach((r) => {
      n[r] = t;
    });
  return n;
}, _f = (e) => {
  const n = e == null ? void 0 : e.unifiedPunctuation, t = typeof n == "string" ? n : void 0, i = {};
  return t ? (Object.assign(i, gn), t === "simplified" ? Object.assign(i, Of) : t === "traditional" && Object.assign(i, If)) : typeof n == "object" && (n.default && Object.assign(i, gn), Object.entries(n).forEach(([r, l]) => {
    l === !0 ? i[r] = gn[r] : l === !1 ? delete i[r] : i[r] = l;
  })), Pf(i);
}, Rf = (e) => {
  const n = _f(e);
  return (i) => {
    if (i.type === ee.GROUP) {
      Object.prototype.hasOwnProperty.call(n, i.modifiedStartValue) && In(
        i,
        n[i.modifiedStartValue],
        cn
      ), Object.prototype.hasOwnProperty.call(n, i.modifiedEndValue) && Pn(
        i,
        n[i.modifiedEndValue],
        cn
      );
      return;
    } else
      Object.prototype.hasOwnProperty.call(n, i.modifiedValue) && Rn(
        i,
        n[i.modifiedValue],
        void 0,
        cn
      );
  };
}, Bf = (e) => e.map((n) => n.split(".").reverse().slice(1)), cl = (e, n, t) => {
  const i = Te(n, e);
  if (i && !i.spaceAfter) {
    const r = t.filter(
      (l) => l[0].toLowerCase() === i.value.toLowerCase()
    ).map((l) => l.slice(1));
    if (r.length)
      if (r[r.length - 1].length) {
        const u = Te(n, i);
        if (u && !u.spaceAfter && u.value === "." && cl(u, n, r))
          return !0;
      } else
        return !0;
  }
  return !1;
}, Lf = (e) => {
  const n = Bf(e.skipAbbrs || []);
  return (t, i, r) => {
    if (t.value !== ".")
      return;
    const l = se(r, t);
    l && l.type === R.WESTERN_LETTER && !t.spaceAfter || cl(t, r, n) && (t.modifiedValue = ".", t.modifiedType = t.type, le(t, D.VALUE));
  };
}, vf = (e) => {
  const n = e == null ? void 0 : e.noSpaceInsideHyperMark;
  return (t, i, r) => {
    if (!n)
      return;
    const l = se(r, t);
    if (!l || !Re(t) && !Re(l))
      return;
    const u = ot(t), a = ot(l);
    (u === a || u === q.LEFT && !Re(l) || a === q.RIGHT && !Re(t)) && V(t, "", on);
  };
}, Df = (e) => {
  const n = e == null ? void 0 : e.spaceOutsideCode, t = n ? " " : "", i = n ? cf : ff;
  return (l, u, a) => {
    if (typeof n > "u" || l.type !== $.CODE_CONTENT)
      return;
    const s = gt(a, l), c = Ze(a, l), { spaceHost: f } = ie(
      a,
      s,
      l
    ), { spaceHost: o } = ie(
      a,
      l,
      c
    );
    s && ae(s.type) && f && V(f, t, i), c && (ae(c.type) || c.type === $.CODE_CONTENT) && o && V(o, t, i);
  };
}, Mf = (e) => {
  const n = e == null ? void 0 : e.spaceBetweenHalfwidthContent, t = e == null ? void 0 : e.noSpaceBetweenFullwidthContent, i = e == null ? void 0 : e.spaceBetweenMixedwidthContent;
  return (r, l, u) => {
    if (!ae(r.type))
      return;
    const a = Ze(u, r);
    if (!a || !ae(a.type))
      return;
    const { spaceHost: s, tokens: c } = ie(
      u,
      r,
      a
    );
    if (s)
      if (a.type === r.type) {
        if (r.type === R.WESTERN_LETTER) {
          if (!n || c.length > 1 && c.filter((p) => p.spaceAfter).length === 0)
            return;
        } else if (!t)
          return;
        const f = r.type === R.WESTERN_LETTER ? " " : "", o = r.type === R.WESTERN_LETTER ? gf : mf;
        V(s, f, o);
      } else {
        if (typeof i > "u")
          return;
        V(s, i ? " " : "", i ? yf : bf);
      }
  };
}, zf = (e) => {
  const n = e == null ? void 0 : e.noSpaceBeforePauseOrStop, t = e == null ? void 0 : e.spaceAfterHalfwidthPauseOrStop, i = e == null ? void 0 : e.noSpaceAfterFullwidthPauseOrStop;
  return (r, l, u) => {
    if (jn(r.type) && !al(u, r) && !sl(u, r)) {
      if (n) {
        const a = gt(u, r);
        if (a && // content
        (ae(a.type) || // right-quotation
        a.type === ee.GROUP || // right-bracket
        a.type === $.BRACKET_MARK && a.markSide === q.RIGHT || // code
        a.type === $.CODE_CONTENT)) {
          const { spaceHost: s } = ie(
            u,
            a,
            r
          );
          s && V(s, "", hf);
        }
      }
      if (Un(r.modifiedType) && i || Be(r.modifiedType) && t) {
        const a = Be(r.modifiedType) ? " " : "", s = Be(r.modifiedType) ? df : pf, c = Ze(u, r);
        if (c && // content
        (ae(c.type) || // left-quotation
        c.type === ee.GROUP || // left-bracket
        c.type === $.BRACKET_MARK && c.markSide === q.LEFT || // code
        c.type === $.CODE_CONTENT)) {
          const { spaceHost: f } = ie(
            u,
            r,
            c
          );
          f && V(f, a, s);
        }
      }
    }
  };
}, kt = (e, n) => It(e) && n.indexOf(e) === -1, Nf = (e) => {
  const n = e.noSpaceInsideQuotation, t = e.spaceOutsideHalfwidthQuotation, i = e.noSpaceOutsideFullwidthQuotation, r = e.adjustedFullwidthPunctuation || "";
  return (l, u, a) => {
    if (l.type === ee.GROUP) {
      if (n) {
        const s = l[0];
        s && s.markSide !== q.RIGHT && _n(l, "", dn);
        const c = l[l.length - 1];
        c && c.markSide !== q.LEFT && V(c, "", dn), s || _n(l, "", dn);
      }
      if (typeof t < "u" || i) {
        const s = Nt(a, l);
        if (s && s.type === ee.GROUP) {
          const { spaceHost: f } = ie(
            a,
            l,
            s
          );
          f && (kt(l.modifiedEndValue, r) || kt(
            s.modifiedStartValue,
            r
          ) ? i && V(f, "", xt) : typeof t < "u" && V(f, t ? " " : "", t ? xt : rt));
        }
        const c = Gn(a, l);
        if (c && (ae(c.type) || c.type === $.CODE_CONTENT)) {
          const { spaceHost: f } = ie(
            a,
            c,
            l
          );
          f && (kt(
            l.modifiedStartValue,
            r
          ) ? i && V(f, "", rt) : typeof t < "u" && V(f, t ? " " : "", t ? xt : rt));
        }
        if (s && (ae(s.type) || s.type === $.CODE_CONTENT)) {
          const { spaceHost: f } = ie(
            a,
            l,
            s
          );
          f && (kt(
            l.modifiedEndValue,
            r
          ) ? i && V(f, "", rt) : typeof t < "u" && V(f, t ? " " : "", t ? xt : rt));
        }
      }
    }
  };
}, wt = (e, n) => It(e) && n.indexOf(e) === -1, Hf = (e, n, t, i, r) => !e || !r || It(t.value) || It(t.modifiedValue) || n.filter((l) => l.spaceAfter).length || i.filter((l) => l.spaceAfter).length ? !1 : (
  // x(x
  //  ^
  (e.type === R.WESTERN_LETTER || // x()
  //  ^
  e.value === "(" && t.value === ")") && // x)x
  //  ^
  (r.type === R.WESTERN_LETTER || // ()x
  //  ^
  t.value === "(" && r.value === ")")
), Vf = (e) => {
  const n = e.noSpaceInsideBracket, t = e.spaceOutsideHalfwidthBracket, i = e.noSpaceOutsideFullwidthBracket, r = e.adjustedFullwidthPunctuation || "";
  return (l, u, a) => {
    if (l.type !== $.BRACKET_MARK)
      return;
    if (n)
      if (l.markSide === q.LEFT)
        se(a, l) && V(l, "", ti);
      else {
        const d = Te(a, l);
        d && // dedupe
        d.markSide !== q.LEFT && V(d, "", ti);
      }
    const s = gt(a, l), c = Ze(a, l), { spaceHost: f, tokens: o } = ie(a, s, l), { spaceHost: p, tokens: h } = ie(a, l, c);
    if (!Hf(
      s,
      o,
      l,
      h,
      c
    ) && (typeof t < "u" || i)) {
      const d = wt(
        l.modifiedValue,
        r
      );
      c && l.markSide === q.RIGHT && c.markSide === q.LEFT && p && (d || wt(
        c.modifiedValue,
        r
      ) ? i && V(l, "", We) : h.filter((x) => x.spaceAfter).length > 0 && typeof t < "u" && V(l, t ? " " : "", t ? pn : We)), l.markSide === q.LEFT ? s && (ae(s.type) || s.type === ee.GROUP || s.type === $.CODE_CONTENT) && f && (d || s.type === ee.GROUP && wt(
        s.modifiedEndValue,
        r
      ) ? i && V(f, "", We) : typeof t < "u" && V(f, t ? " " : "", t ? pn : We)) : c && (ae(c.type) || c.type === ee.GROUP || c.type === $.CODE_CONTENT) && p && (d || c.type === ee.GROUP && wt(
        c.modifiedStartValue,
        r
      ) ? i && V(p, "", We) : typeof t < "u" && V(p, t ? " " : "", t ? pn : We));
    }
  };
}, jf = (e) => (n) => {
  n.spaceAfter && n.spaceAfter.match(/\n/) && (le(n, D.SPACE_AFTER), n.modifiedSpaceAfter = n.spaceAfter);
}, Uf = (e) => {
  const t = ((e == null ? void 0 : e.skipZhUnits) || "").split("").filter((r) => Ye(r) === R.CJK_CHAR).join(""), i = new RegExp(`^[${t}]`);
  return (r, l, u) => {
    if (r.type === R.WESTERN_LETTER && r.value.match(/^\d+$/)) {
      const a = Nt(u, r);
      if (Array.isArray(a))
        return;
      if (a && a.value.match(i)) {
        const { spaceHost: s, tokens: c } = ie(u, r, a);
        if (c.some((p) => p.spaceAfter))
          return;
        const o = Gn(u, r);
        if (o) {
          const { spaceHost: p, tokens: h } = ie(u, o, r);
          if (h.some(
            (y) => y.spaceAfter
          ))
            return;
          p && (p.modifiedSpaceAfter = "", le(
            p,
            D.SPACE_AFTER
          ));
        }
        s && (s.modifiedSpaceAfter = "", le(s, D.SPACE_AFTER));
      }
    }
  };
}, Wf = (e) => (n, t, i) => {
  if (n.value !== "&")
    return;
  const r = se(i, n);
  if (!r || r.type !== R.WESTERN_LETTER || n.spaceAfter)
    return;
  const l = se(i, r);
  if (!l || l.value !== ";" || r.spaceAfter)
    return;
  n.modifiedValue = n.value, n.modifiedType = n.type, n.modifiedSpaceAfter = n.spaceAfter, le(n, D.VALUE), le(n, D.SPACE_AFTER), r.modifiedValue = r.value, r.modifiedType = r.type, r.modifiedSpaceAfter = r.spaceAfter, le(r, D.VALUE), le(r, D.SPACE_AFTER), l.modifiedValue = l.value, l.modifiedType = l.type, le(l, D.VALUE), le(l, D.SPACE_AFTER);
  const u = Nt(i, l);
  if (u) {
    const { spaceHost: a } = ie(i, l, u);
    a && (a.modifiedSpaceAfter = a.spaceAfter, le(a, D.SPACE_AFTER));
  }
}, fl = (e) => e.some((n) => {
  if (n.type === ee.GROUP)
    return fl(n);
  if (gc(n.type))
    return !n.value.match(/[‘’“”]/);
}), hl = (e) => {
  e.modifiedSpaceAfter = e.spaceAfter, e.modifiedInnerSpaceBefore = e.innerSpaceBefore, e.modifiedStartValue = e.startValue, e.modifiedEndValue = e.endValue, e.validations.length = 0, e.forEach((n) => {
    n.validations.length = 0, n.modifiedSpaceAfter = n.spaceAfter, n.type === ee.GROUP ? hl(n) : (n.modifiedType = n.type, n.modifiedValue = n.value);
  });
}, $f = (e) => {
  const n = e == null ? void 0 : e.skipPureWestern;
  return (t, i, r) => {
    n && !r.startValue && i === 0 && (fl(r) || hl(r));
  };
}, qf = (e) => [
  Ef(e),
  Ff(e),
  Rf(e),
  Lf(e),
  vf(e),
  Df(e),
  Mf(e),
  zf(e),
  Nf(e),
  Vf(e),
  jf(),
  Uf(e),
  Wf(),
  $f(e)
], pl = {
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
}, Kn = [
  { name: "ignore", value: Pl },
  { name: "hexo", value: Rl },
  { name: "vuepress", value: Bl },
  { name: "markdown", value: of }
], Gf = (e) => e.reduce((n, { name: t, value: i }) => (n[t] = i, n), {}), Bn = Gf(Kn), Kf = (e, n) => e.map((t) => {
  switch (typeof t) {
    case "function":
      return t;
    case "string":
      return n[t];
    default:
      return null;
  }
}).filter(Boolean), ni = {
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
}, Qf = (e, n) => {
  for (const t in ni) {
    const i = ni[t];
    e[t] && (n.warn(`[deprecate] ${t} is deprecated, use ${i} instead`), e[i] = e[i] ?? e[t], delete e[t]);
  }
}, Yf = (e) => {
  const n = e.logger ?? ve.defaultLogger, t = e.rules ?? {}, i = t.preset === "default" ? pl : {};
  Qf(t, n);
  let r;
  return typeof e.hyperParse == "function" ? r = [e.hyperParse] : r = e.hyperParse || Kn.map((u) => u.name), {
    logger: n,
    ignoredCases: e.ignoredCases || [],
    rules: { ...i, ...t },
    hyperParse: Kf(
      r,
      Bn
    )
  };
}, Jf = (e, n = ve.defaultLogger) => {
  const t = {
    logger: n,
    rules: {},
    hyperParse: [],
    ignoredCases: []
  };
  let i = [];
  return e.preset === "default" && (t.rules = { ...pl }, i = Kn.map((r) => r.name)), e.rules && (t.rules = { ...t.rules, ...e.rules }), Array.isArray(e.hyperParsers) && (i = e.hyperParsers), i.forEach((r) => {
    if (!Bn[r]) {
      n.log(`The hyper parser ${r} is invalid.`);
      return;
    }
    t.hyperParse.push(Bn[r]);
  }), e.caseIgnores && e.caseIgnores.forEach((r) => {
    const l = si(r);
    l ? t.ignoredCases.push(l) : n.log(`The format of ignore case: "${r}" is invalid.`);
  }), t;
}, Zf = (e, n = [], t = ve.defaultLogger) => {
  const i = [];
  return n.forEach(({ prefix: r, textStart: l, textEnd: u, suffix: a }) => {
    const s = (r || "") + l, c = (u || "") + (a || ""), f = r ? r.length : 0, o = a ? a.length : 0, p = (h) => {
      const d = e.substring(h).indexOf(s);
      if (d === -1)
        return;
      const y = h + d + f, x = y + l.length;
      if (!c)
        i.push({
          start: y,
          end: x
        }), p(x);
      else {
        const b = e.substring(x).indexOf(c), C = x + b + (u || "").length;
        if (b === -1)
          return;
        i.push({
          start: y,
          end: C
        }), p(C + o);
      }
    };
    p(0);
  }), i.sort((r, l) => r.start - l.start);
}, $e = (e, n, t) => e <= t.end && n >= t.start, ri = (e, n = []) => {
  const t = {
    ignored: !1,
    [D.VALUE]: !1,
    [D.SPACE_AFTER]: !1,
    [D.START_VALUE]: !1,
    [D.END_VALUE]: !1,
    [D.INNER_SPACE_BEFORE]: !1
  };
  return n.forEach((i) => {
    if (Array.isArray(e)) {
      const {
        index: r,
        startValue: l,
        innerSpaceBefore: u,
        endIndex: a = 0,
        endValue: s,
        spaceAfter: c
      } = e;
      $e(r, r + (l || "").length, i) && (t[D.SPACE_AFTER] = t.ignored = !0), $e(
        r + (l || "").length,
        r + (l || "").length + (u || "").length,
        i
      ) && (t[D.INNER_SPACE_BEFORE] = t.ignored = !0), $e(a, a + (s || "").length, i) && (t[D.END_VALUE] = t.ignored = !0), $e(
        a + (s || "").length,
        a + (s || "").length + (c || "").length,
        i
      ) && (t[D.SPACE_AFTER] = t.ignored = !0);
    } else {
      const { index: r, value: l, spaceAfter: u } = e;
      $e(r, r + (l || "").length, i) && (t[D.VALUE] = t.ignored = !0), $e(
        r + (l || "").length,
        r + (l || "").length + (u || "").length,
        i
      ) && (t[D.SPACE_AFTER] = t.ignored = !0);
    }
  }), t;
}, ii = (e, n = 0, t, i = [], r = []) => {
  e.validations.forEach((l) => {
    const u = { ...l, index: l.index + n };
    t[l.target] ? r.push(u) : i.push(u);
  });
}, dl = (e, n = 0, t = [], i = [], r = [], l = [], u) => {
  const a = ri(e, t);
  return !u && a.ignored && i.push(e), u || ii(
    e,
    n,
    a,
    r,
    l
  ), a[D.START_VALUE] && (e.ignoredStartValue = e.modifiedStartValue, e.modifiedStartValue = e.startValue), a[D.INNER_SPACE_BEFORE] && (e.ignoredInnerSpaceBefore = e.modifiedInnerSpaceBefore, e.modifiedInnerSpaceBefore = e.innerSpaceBefore), a[D.END_VALUE] && (e.ignoredEndValue = e.modifiedEndValue, e.modifiedEndValue = e.endValue), a[D.SPACE_AFTER] && (e.ignoredSpaceAfter = e.modifiedSpaceAfter, e.modifiedSpaceAfter = e.spaceAfter), [
    e.modifiedStartValue,
    e.modifiedInnerSpaceBefore,
    ...e.map((s) => {
      const c = ri(s, t);
      return c.ignored && i.push(s), ii(
        s,
        n,
        c,
        r,
        l
      ), Array.isArray(s) ? dl(
        s,
        n,
        t,
        i,
        r,
        l,
        !0
      ) : (c[D.VALUE] && (s.ignoredValue = s.modifiedValue, s.modifiedValue = s.value), c[D.SPACE_AFTER] && (s.ignoredSpaceAfter = s.modifiedSpaceAfter, s.modifiedSpaceAfter = s.spaceAfter), [s.modifiedValue, s.modifiedSpaceAfter].filter(Boolean).join(""));
    }),
    e.modifiedEndValue,
    e.modifiedSpaceAfter
  ].filter(Boolean).join("");
}, Xf = (e, n) => {
  if (n.length === 0)
    return {
      value: e,
      pieces: [{ value: e, start: 0, end: e.length, nonBlock: !0 }]
    };
  const t = n.reduce((r, l, u) => {
    const { start: a, end: s } = l, c = r[r.length - 1], f = c ? c.end : 0;
    if (f < a) {
      const o = {
        nonBlock: !0,
        start: f,
        end: a,
        value: ""
      };
      o.value = e.substring(
        o.start,
        o.end
      ), r.push(o);
    }
    if (r.push(l), u === n.length - 1 && s !== e.length) {
      const o = {
        nonBlock: !0,
        start: s,
        end: e.length,
        value: ""
      };
      o.value = e.substring(
        o.start,
        o.end
      ), r.push(o);
    }
    return r;
  }, []);
  return { value: t.map(({ value: r }) => r).join(""), pieces: t };
}, ph = (e, n = {}) => {
  const t = Yf(n);
  return gl(e, t);
}, dh = (e, n) => {
  const t = Jf(n);
  return gl(e, t);
}, gl = (e, n) => {
  const t = /<!--\s*zhlint\s*disabled\s*-->/g;
  if (e.match(t))
    return { origin: e, result: e, validations: [], disabled: !0 };
  const { logger: i, ignoredCases: r, rules: l, hyperParse: u } = n, a = {
    value: e,
    modifiedValue: e,
    ignoredByRules: r,
    ignoredByParsers: [],
    blocks: [
      {
        value: e,
        marks: [],
        start: 0,
        end: e.length - 1
      }
    ]
  }, s = [], c = [], f = [], o = [], p = u.reduce(
    (b, C) => C(b),
    a
  ), h = qf(l), d = p.blocks.map(
    ({ value: b, marks: C, start: w, end: O }) => {
      let _ = b;
      const k = ef(Zc(b, C), l);
      c.push(...k.errors);
      const S = Zf(
        b,
        a.ignoredByRules,
        i
      );
      return h.forEach((L) => {
        nl(k.tokens, L);
      }), _ = dl(
        k.tokens,
        w,
        S,
        s,
        f,
        o
      ), {
        ...k,
        start: w,
        end: O,
        value: _,
        originValue: b
      };
    }
  ), y = Xf(e, d), x = {
    pieces: y.pieces,
    blocks: d,
    ignoredCases: p.ignoredByRules,
    ignoredByParsers: p.ignoredByParsers,
    ignoredTokens: s,
    parserErrors: c,
    ruleErrors: f,
    ignoredRuleErrors: o
  };
  return {
    origin: e,
    result: y.value,
    validations: [...c, ...f],
    __debug__: x
  };
};
function eh(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var ml = { exports: {} }, Q = ml.exports = {}, be, xe;
function Ln() {
  throw new Error("setTimeout has not been defined");
}
function vn() {
  throw new Error("clearTimeout has not been defined");
}
(function() {
  try {
    typeof setTimeout == "function" ? be = setTimeout : be = Ln;
  } catch {
    be = Ln;
  }
  try {
    typeof clearTimeout == "function" ? xe = clearTimeout : xe = vn;
  } catch {
    xe = vn;
  }
})();
function yl(e) {
  if (be === setTimeout)
    return setTimeout(e, 0);
  if ((be === Ln || !be) && setTimeout)
    return be = setTimeout, setTimeout(e, 0);
  try {
    return be(e, 0);
  } catch {
    try {
      return be.call(null, e, 0);
    } catch {
      return be.call(this, e, 0);
    }
  }
}
function th(e) {
  if (xe === clearTimeout)
    return clearTimeout(e);
  if ((xe === vn || !xe) && clearTimeout)
    return xe = clearTimeout, clearTimeout(e);
  try {
    return xe(e);
  } catch {
    try {
      return xe.call(null, e);
    } catch {
      return xe.call(this, e);
    }
  }
}
var Ce = [], Ke = !1, ze, Tt = -1;
function nh() {
  !Ke || !ze || (Ke = !1, ze.length ? Ce = ze.concat(Ce) : Tt = -1, Ce.length && bl());
}
function bl() {
  if (!Ke) {
    var e = yl(nh);
    Ke = !0;
    for (var n = Ce.length; n; ) {
      for (ze = Ce, Ce = []; ++Tt < n; )
        ze && ze[Tt].run();
      Tt = -1, n = Ce.length;
    }
    ze = null, Ke = !1, th(e);
  }
}
Q.nextTick = function(e) {
  var n = new Array(arguments.length - 1);
  if (arguments.length > 1)
    for (var t = 1; t < arguments.length; t++)
      n[t - 1] = arguments[t];
  Ce.push(new xl(e, n)), Ce.length === 1 && !Ke && yl(bl);
};
function xl(e, n) {
  this.fun = e, this.array = n;
}
xl.prototype.run = function() {
  this.fun.apply(null, this.array);
};
Q.title = "browser";
Q.browser = !0;
Q.env = {};
Q.argv = [];
Q.version = "";
Q.versions = {};
function Oe() {
}
Q.on = Oe;
Q.addListener = Oe;
Q.once = Oe;
Q.off = Oe;
Q.removeListener = Oe;
Q.removeAllListeners = Oe;
Q.emit = Oe;
Q.prependListener = Oe;
Q.prependOnceListener = Oe;
Q.listeners = function(e) {
  return [];
};
Q.binding = function(e) {
  throw new Error("process.binding is not supported");
};
Q.cwd = function() {
  return "/";
};
Q.chdir = function(e) {
  throw new Error("process.chdir is not supported");
};
Q.umask = function() {
  return 0;
};
var rh = ml.exports;
const ih = /* @__PURE__ */ eh(rh);
function me(e) {
  if (typeof e != "string")
    throw new TypeError("Path must be a string. Received " + JSON.stringify(e));
}
function li(e, n) {
  for (var t = "", i = 0, r = -1, l = 0, u, a = 0; a <= e.length; ++a) {
    if (a < e.length)
      u = e.charCodeAt(a);
    else {
      if (u === 47)
        break;
      u = 47;
    }
    if (u === 47) {
      if (!(r === a - 1 || l === 1))
        if (r !== a - 1 && l === 2) {
          if (t.length < 2 || i !== 2 || t.charCodeAt(t.length - 1) !== 46 || t.charCodeAt(t.length - 2) !== 46) {
            if (t.length > 2) {
              var s = t.lastIndexOf("/");
              if (s !== t.length - 1) {
                s === -1 ? (t = "", i = 0) : (t = t.slice(0, s), i = t.length - 1 - t.lastIndexOf("/")), r = a, l = 0;
                continue;
              }
            } else if (t.length === 2 || t.length === 1) {
              t = "", i = 0, r = a, l = 0;
              continue;
            }
          }
          n && (t.length > 0 ? t += "/.." : t = "..", i = 2);
        } else
          t.length > 0 ? t += "/" + e.slice(r + 1, a) : t = e.slice(r + 1, a), i = a - r - 1;
      r = a, l = 0;
    } else
      u === 46 && l !== -1 ? ++l : l = -1;
  }
  return t;
}
function lh(e, n) {
  var t = n.dir || n.root, i = n.base || (n.name || "") + (n.ext || "");
  return t ? t === n.root ? t + i : t + e + i : i;
}
var Qe = {
  // path.resolve([from ...], to)
  resolve: function() {
    for (var n = "", t = !1, i, r = arguments.length - 1; r >= -1 && !t; r--) {
      var l;
      r >= 0 ? l = arguments[r] : (i === void 0 && (i = ih.cwd()), l = i), me(l), l.length !== 0 && (n = l + "/" + n, t = l.charCodeAt(0) === 47);
    }
    return n = li(n, !t), t ? n.length > 0 ? "/" + n : "/" : n.length > 0 ? n : ".";
  },
  normalize: function(n) {
    if (me(n), n.length === 0)
      return ".";
    var t = n.charCodeAt(0) === 47, i = n.charCodeAt(n.length - 1) === 47;
    return n = li(n, !t), n.length === 0 && !t && (n = "."), n.length > 0 && i && (n += "/"), t ? "/" + n : n;
  },
  isAbsolute: function(n) {
    return me(n), n.length > 0 && n.charCodeAt(0) === 47;
  },
  join: function() {
    if (arguments.length === 0)
      return ".";
    for (var n, t = 0; t < arguments.length; ++t) {
      var i = arguments[t];
      me(i), i.length > 0 && (n === void 0 ? n = i : n += "/" + i);
    }
    return n === void 0 ? "." : Qe.normalize(n);
  },
  relative: function(n, t) {
    if (me(n), me(t), n === t || (n = Qe.resolve(n), t = Qe.resolve(t), n === t))
      return "";
    for (var i = 1; i < n.length && n.charCodeAt(i) === 47; ++i)
      ;
    for (var r = n.length, l = r - i, u = 1; u < t.length && t.charCodeAt(u) === 47; ++u)
      ;
    for (var a = t.length, s = a - u, c = l < s ? l : s, f = -1, o = 0; o <= c; ++o) {
      if (o === c) {
        if (s > c) {
          if (t.charCodeAt(u + o) === 47)
            return t.slice(u + o + 1);
          if (o === 0)
            return t.slice(u + o);
        } else
          l > c && (n.charCodeAt(i + o) === 47 ? f = o : o === 0 && (f = 0));
        break;
      }
      var p = n.charCodeAt(i + o), h = t.charCodeAt(u + o);
      if (p !== h)
        break;
      p === 47 && (f = o);
    }
    var d = "";
    for (o = i + f + 1; o <= r; ++o)
      (o === r || n.charCodeAt(o) === 47) && (d.length === 0 ? d += ".." : d += "/..");
    return d.length > 0 ? d + t.slice(u + f) : (u += f, t.charCodeAt(u) === 47 && ++u, t.slice(u));
  },
  _makeLong: function(n) {
    return n;
  },
  dirname: function(n) {
    if (me(n), n.length === 0)
      return ".";
    for (var t = n.charCodeAt(0), i = t === 47, r = -1, l = !0, u = n.length - 1; u >= 1; --u)
      if (t = n.charCodeAt(u), t === 47) {
        if (!l) {
          r = u;
          break;
        }
      } else
        l = !1;
    return r === -1 ? i ? "/" : "." : i && r === 1 ? "//" : n.slice(0, r);
  },
  basename: function(n, t) {
    if (t !== void 0 && typeof t != "string")
      throw new TypeError('"ext" argument must be a string');
    me(n);
    var i = 0, r = -1, l = !0, u;
    if (t !== void 0 && t.length > 0 && t.length <= n.length) {
      if (t.length === n.length && t === n)
        return "";
      var a = t.length - 1, s = -1;
      for (u = n.length - 1; u >= 0; --u) {
        var c = n.charCodeAt(u);
        if (c === 47) {
          if (!l) {
            i = u + 1;
            break;
          }
        } else
          s === -1 && (l = !1, s = u + 1), a >= 0 && (c === t.charCodeAt(a) ? --a === -1 && (r = u) : (a = -1, r = s));
      }
      return i === r ? r = s : r === -1 && (r = n.length), n.slice(i, r);
    } else {
      for (u = n.length - 1; u >= 0; --u)
        if (n.charCodeAt(u) === 47) {
          if (!l) {
            i = u + 1;
            break;
          }
        } else
          r === -1 && (l = !1, r = u + 1);
      return r === -1 ? "" : n.slice(i, r);
    }
  },
  extname: function(n) {
    me(n);
    for (var t = -1, i = 0, r = -1, l = !0, u = 0, a = n.length - 1; a >= 0; --a) {
      var s = n.charCodeAt(a);
      if (s === 47) {
        if (!l) {
          i = a + 1;
          break;
        }
        continue;
      }
      r === -1 && (l = !1, r = a + 1), s === 46 ? t === -1 ? t = a : u !== 1 && (u = 1) : t !== -1 && (u = -1);
    }
    return t === -1 || r === -1 || // We saw a non-dot character immediately before the dot
    u === 0 || // The (right-most) trimmed path component is exactly '..'
    u === 1 && t === r - 1 && t === i + 1 ? "" : n.slice(t, r);
  },
  format: function(n) {
    if (n === null || typeof n != "object")
      throw new TypeError('The "pathObject" argument must be of type Object. Received type ' + typeof n);
    return lh("/", n);
  },
  parse: function(n) {
    me(n);
    var t = { root: "", dir: "", base: "", ext: "", name: "" };
    if (n.length === 0)
      return t;
    var i = n.charCodeAt(0), r = i === 47, l;
    r ? (t.root = "/", l = 1) : l = 0;
    for (var u = -1, a = 0, s = -1, c = !0, f = n.length - 1, o = 0; f >= l; --f) {
      if (i = n.charCodeAt(f), i === 47) {
        if (!c) {
          a = f + 1;
          break;
        }
        continue;
      }
      s === -1 && (c = !1, s = f + 1), i === 46 ? u === -1 ? u = f : o !== 1 && (o = 1) : u !== -1 && (o = -1);
    }
    return u === -1 || s === -1 || // We saw a non-dot character immediately before the dot
    o === 0 || // The (right-most) trimmed path component is exactly '..'
    o === 1 && u === s - 1 && u === a + 1 ? s !== -1 && (a === 0 && r ? t.base = t.name = n.slice(1, s) : t.base = t.name = n.slice(a, s)) : (a === 0 && r ? (t.name = n.slice(1, u), t.base = n.slice(1, s)) : (t.name = n.slice(a, u), t.base = n.slice(a, s)), t.ext = n.slice(u, s)), a > 0 ? t.dir = n.slice(0, a - 1) : r && (t.dir = "/"), t;
  },
  sep: "/",
  delimiter: ":",
  win32: null,
  posix: null
};
Qe.posix = Qe;
var Et = Qe;
const { existsSync: At, readFileSync: Dn } = {}, uh = ".zhlintrc", ah = ".zhlintignore", sh = ".zhlintcaseignore", oh = (e, n, t, i, r = ve.defaultLogger) => {
  const l = {
    config: void 0,
    fileIgnore: void 0,
    caseIgnore: void 0
  };
  return e = Et.resolve(e ?? "."), At(e) ? (n = Et.resolve(e, n ?? uh), At(n) ? l.config = n : r.log(
    `Config file "${n}" does not exist. Will proceed as default.`
  ), t = Et.resolve(e, t ?? ah), At(t) ? l.fileIgnore = t : r.log(
    `Global ignored cases file "${t}" does not exist. Will proceed as none.`
  ), i = Et.resolve(e, i ?? sh), At(i) ? l.caseIgnore = i : r.log(
    `Global ignored cases file "${i}" does not exist. Will proceed as none.`
  ), l) : (r.log(`"${e}" does not exist.`), l);
}, ch = (e) => {
  const n = Dn(e, { encoding: "utf8" });
  return JSON.parse(n);
}, fh = (e, n, t, i = ve.defaultLogger) => {
  const r = {
    preset: "default"
  };
  if (e)
    try {
      const l = ch(e);
      typeof l.preset == "string" && (r.preset = l.preset), typeof l.rules == "object" && (r.rules = l.rules), Array.isArray(l.hyperParsers) && (r.hyperParsers = l.hyperParsers), Array.isArray(l.fileIgnores) && (r.fileIgnores = l.fileIgnores), Array.isArray(l.caseIgnores) && (r.caseIgnores = l.caseIgnores);
    } catch (l) {
      i.log(
        `Failed to read "${e}": ${l.message}`
      );
    }
  if (n)
    try {
      Dn(n, {
        encoding: "utf8"
      }).split(/\n/).map((u) => u.trim()).forEach((u) => {
        u && (r.fileIgnores || (r.fileIgnores = []), r.fileIgnores.indexOf(u) === -1 && r.fileIgnores.push(u));
      });
    } catch (l) {
      i.log(
        `Failed to read "${n}": ${l.message}`
      );
    }
  if (t)
    try {
      Dn(t, {
        encoding: "utf8"
      }).split(/\n/).map((u) => u.trim()).forEach((u) => {
        u && (r.caseIgnores || (r.caseIgnores = []), r.caseIgnores.indexOf(u) === -1 && r.caseIgnores.push(u));
      });
    } catch (l) {
      i.log(
        `Failed to read "${t}": ${l.message}`
      );
    }
  return r;
}, gh = (e, n, t, i, r = ve.defaultLogger) => {
  const {
    config: l,
    fileIgnore: u,
    caseIgnore: a
  } = oh(e, n, t, i, r);
  return fh(
    l,
    u,
    a,
    r
  );
};
export {
  gh as readRc,
  hh as report,
  ph as run,
  dh as runWithConfig
};
//# sourceMappingURL=zhlint.es.js.map
