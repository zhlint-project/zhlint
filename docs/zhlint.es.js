var _a, _b;
const ignoredCaseMatcher = /^(?:(?<prefix>.+?)-,)?(?<textStart>.+?)(?:,(?<textEnd>.+?))?(?:,-(?<suffix>.+?))?$/;
const parseIngoredCase = (text2) => {
  const matchResult = text2.match(ignoredCaseMatcher);
  if (matchResult) {
    const { prefix, textStart, textEnd, suffix } = matchResult.groups;
    return {
      prefix,
      textStart,
      textEnd,
      suffix
    };
  }
};
const parser$4 = (data) => {
  const { ignoredByRules, value: raw } = data;
  const matcher2 = /<!--\s*zhlint\s*ignore:\s*(.+?)\s*-->/g;
  let result;
  while ((result = matcher2.exec(raw)) !== null) {
    const ignoredCase = parseIngoredCase(result[1]);
    if (ignoredCase) {
      ignoredByRules.push(ignoredCase);
    }
  }
  return data;
};
const matcher$1 = /\{% ([^ ]+?) [^%]*?%\}(?:\n|\{(?!%)|[^{])*?\{% end(?:\1) %\}/g;
const parser$3 = (data) => {
  data.modifiedValue = data.modifiedValue.replace(
    matcher$1,
    (raw, name2, index2) => {
      const { length } = raw;
      data.ignoredByParsers.push({
        name: name2,
        meta: `hexo-${name2}`,
        index: index2,
        length,
        originValue: raw
      });
      return "@".repeat(length);
    }
  );
  return data;
};
let matcher;
try {
  matcher = new RegExp("(?<=^|\\n)(:::.*)\\n([\\s\\S]+?)\\n(:::)(?=\\n|$)", "g");
} catch {
  matcher = /(:::.*)\n([\s\S]+?)\n(:::)/g;
}
const parser$2 = (data) => {
  data.modifiedValue = data.modifiedValue.replace(
    matcher,
    (raw, start, value, end, index2) => {
      const { length } = raw;
      const name2 = start.substring(3).trim().split(" ")[0] || "default";
      data.ignoredByParsers.push({
        name: name2,
        index: index2,
        length: start.length,
        originValue: start,
        meta: `vuepress-${name2}-start`
      });
      data.ignoredByParsers.push({
        name: name2,
        index: index2 + length - 3,
        length: 3,
        originValue: end,
        meta: `vuepress-${name2}-end`
      });
      return "@".repeat(start.length) + "\n" + value + "\n" + "@".repeat(3);
    }
  );
  return data;
};
var hasOwn = Object.prototype.hasOwnProperty;
var toStr = Object.prototype.toString;
var defineProperty = Object.defineProperty;
var gOPD = Object.getOwnPropertyDescriptor;
var isArray$1 = function isArray(arr) {
  if (typeof Array.isArray === "function") {
    return Array.isArray(arr);
  }
  return toStr.call(arr) === "[object Array]";
};
var isPlainObject = function isPlainObject2(obj) {
  if (!obj || toStr.call(obj) !== "[object Object]") {
    return false;
  }
  var hasOwnConstructor = hasOwn.call(obj, "constructor");
  var hasIsPrototypeOf = obj.constructor && obj.constructor.prototype && hasOwn.call(obj.constructor.prototype, "isPrototypeOf");
  if (obj.constructor && !hasOwnConstructor && !hasIsPrototypeOf) {
    return false;
  }
  var key;
  for (key in obj) {
  }
  return typeof key === "undefined" || hasOwn.call(obj, key);
};
var setProperty = function setProperty2(target, options) {
  if (defineProperty && options.name === "__proto__") {
    defineProperty(target, options.name, {
      enumerable: true,
      configurable: true,
      value: options.newValue,
      writable: true
    });
  } else {
    target[options.name] = options.newValue;
  }
};
var getProperty = function getProperty2(obj, name2) {
  if (name2 === "__proto__") {
    if (!hasOwn.call(obj, name2)) {
      return void 0;
    } else if (gOPD) {
      return gOPD(obj, name2).value;
    }
  }
  return obj[name2];
};
var extend$2 = function extend() {
  var options, name2, src, copy2, copyIsArray, clone;
  var target = arguments[0];
  var i = 1;
  var length = arguments.length;
  var deep = false;
  if (typeof target === "boolean") {
    deep = target;
    target = arguments[1] || {};
    i = 2;
  }
  if (target == null || typeof target !== "object" && typeof target !== "function") {
    target = {};
  }
  for (; i < length; ++i) {
    options = arguments[i];
    if (options != null) {
      for (name2 in options) {
        src = getProperty(target, name2);
        copy2 = getProperty(options, name2);
        if (target !== copy2) {
          if (deep && copy2 && (isPlainObject(copy2) || (copyIsArray = isArray$1(copy2)))) {
            if (copyIsArray) {
              copyIsArray = false;
              clone = src && isArray$1(src) ? src : [];
            } else {
              clone = src && isPlainObject(src) ? src : {};
            }
            setProperty(target, { name: name2, newValue: extend(deep, clone, copy2) });
          } else if (typeof copy2 !== "undefined") {
            setProperty(target, { name: name2, newValue: copy2 });
          }
        }
      }
    }
  }
  return target;
};
var bail_1 = bail$1;
function bail$1(err) {
  if (err) {
    throw err;
  }
}
var own$4 = {}.hasOwnProperty;
var unistUtilStringifyPosition = stringify$1;
function stringify$1(value) {
  if (!value || typeof value !== "object") {
    return "";
  }
  if (own$4.call(value, "position") || own$4.call(value, "type")) {
    return position(value.position);
  }
  if (own$4.call(value, "start") || own$4.call(value, "end")) {
    return position(value);
  }
  if (own$4.call(value, "line") || own$4.call(value, "column")) {
    return point(value);
  }
  return "";
}
function point(point2) {
  if (!point2 || typeof point2 !== "object") {
    point2 = {};
  }
  return index(point2.line) + ":" + index(point2.column);
}
function position(pos) {
  if (!pos || typeof pos !== "object") {
    pos = {};
  }
  return point(pos.start) + "-" + point(pos.end);
}
function index(value) {
  return value && typeof value === "number" ? value : 1;
}
var stringify = unistUtilStringifyPosition;
var vfileMessage = VMessage$1;
function VMessagePrototype() {
}
VMessagePrototype.prototype = Error.prototype;
VMessage$1.prototype = new VMessagePrototype();
var proto$2 = VMessage$1.prototype;
proto$2.file = "";
proto$2.name = "";
proto$2.reason = "";
proto$2.message = "";
proto$2.stack = "";
proto$2.fatal = null;
proto$2.column = null;
proto$2.line = null;
function VMessage$1(reason, position2, origin) {
  var parts;
  var range;
  var location;
  if (typeof position2 === "string") {
    origin = position2;
    position2 = null;
  }
  parts = parseOrigin(origin);
  range = stringify(position2) || "1:1";
  location = {
    start: { line: null, column: null },
    end: { line: null, column: null }
  };
  if (position2 && position2.position) {
    position2 = position2.position;
  }
  if (position2) {
    if (position2.start) {
      location = position2;
      position2 = position2.start;
    } else {
      location.start = position2;
    }
  }
  if (reason.stack) {
    this.stack = reason.stack;
    reason = reason.message;
  }
  this.message = reason;
  this.name = range;
  this.reason = reason;
  this.line = position2 ? position2.line : null;
  this.column = position2 ? position2.column : null;
  this.location = location;
  this.source = parts[0];
  this.ruleId = parts[1];
}
function parseOrigin(origin) {
  var result = [null, null];
  var index2;
  if (typeof origin === "string") {
    index2 = origin.indexOf(":");
    if (index2 === -1) {
      result[1] = origin;
    } else {
      result[0] = origin.slice(0, index2);
      result[1] = origin.slice(index2 + 1);
    }
  }
  return result;
}
var minpath_browser = {};
minpath_browser.basename = basename;
minpath_browser.dirname = dirname;
minpath_browser.extname = extname;
minpath_browser.join = join$1;
minpath_browser.sep = "/";
function basename(path, ext) {
  var start = 0;
  var end = -1;
  var index2;
  var firstNonSlashEnd;
  var seenNonSlash;
  var extIndex;
  if (ext !== void 0 && typeof ext !== "string") {
    throw new TypeError('"ext" argument must be a string');
  }
  assertPath$2(path);
  index2 = path.length;
  if (ext === void 0 || !ext.length || ext.length > path.length) {
    while (index2--) {
      if (path.charCodeAt(index2) === 47) {
        if (seenNonSlash) {
          start = index2 + 1;
          break;
        }
      } else if (end < 0) {
        seenNonSlash = true;
        end = index2 + 1;
      }
    }
    return end < 0 ? "" : path.slice(start, end);
  }
  if (ext === path) {
    return "";
  }
  firstNonSlashEnd = -1;
  extIndex = ext.length - 1;
  while (index2--) {
    if (path.charCodeAt(index2) === 47) {
      if (seenNonSlash) {
        start = index2 + 1;
        break;
      }
    } else {
      if (firstNonSlashEnd < 0) {
        seenNonSlash = true;
        firstNonSlashEnd = index2 + 1;
      }
      if (extIndex > -1) {
        if (path.charCodeAt(index2) === ext.charCodeAt(extIndex--)) {
          if (extIndex < 0) {
            end = index2;
          }
        } else {
          extIndex = -1;
          end = firstNonSlashEnd;
        }
      }
    }
  }
  if (start === end) {
    end = firstNonSlashEnd;
  } else if (end < 0) {
    end = path.length;
  }
  return path.slice(start, end);
}
function dirname(path) {
  var end;
  var unmatchedSlash;
  var index2;
  assertPath$2(path);
  if (!path.length) {
    return ".";
  }
  end = -1;
  index2 = path.length;
  while (--index2) {
    if (path.charCodeAt(index2) === 47) {
      if (unmatchedSlash) {
        end = index2;
        break;
      }
    } else if (!unmatchedSlash) {
      unmatchedSlash = true;
    }
  }
  return end < 0 ? path.charCodeAt(0) === 47 ? "/" : "." : end === 1 && path.charCodeAt(0) === 47 ? "//" : path.slice(0, end);
}
function extname(path) {
  var startDot = -1;
  var startPart = 0;
  var end = -1;
  var preDotState = 0;
  var unmatchedSlash;
  var code;
  var index2;
  assertPath$2(path);
  index2 = path.length;
  while (index2--) {
    code = path.charCodeAt(index2);
    if (code === 47) {
      if (unmatchedSlash) {
        startPart = index2 + 1;
        break;
      }
      continue;
    }
    if (end < 0) {
      unmatchedSlash = true;
      end = index2 + 1;
    }
    if (code === 46) {
      if (startDot < 0) {
        startDot = index2;
      } else if (preDotState !== 1) {
        preDotState = 1;
      }
    } else if (startDot > -1) {
      preDotState = -1;
    }
  }
  if (startDot < 0 || end < 0 || preDotState === 0 || preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
    return "";
  }
  return path.slice(startDot, end);
}
function join$1() {
  var index2 = -1;
  var joined;
  while (++index2 < arguments.length) {
    assertPath$2(arguments[index2]);
    if (arguments[index2]) {
      joined = joined === void 0 ? arguments[index2] : joined + "/" + arguments[index2];
    }
  }
  return joined === void 0 ? "." : normalize$4(joined);
}
function normalize$4(path) {
  var absolute;
  var value;
  assertPath$2(path);
  absolute = path.charCodeAt(0) === 47;
  value = normalizeString(path, !absolute);
  if (!value.length && !absolute) {
    value = ".";
  }
  if (value.length && path.charCodeAt(path.length - 1) === 47) {
    value += "/";
  }
  return absolute ? "/" + value : value;
}
function normalizeString(path, allowAboveRoot) {
  var result = "";
  var lastSegmentLength = 0;
  var lastSlash = -1;
  var dots = 0;
  var index2 = -1;
  var code;
  var lastSlashIndex;
  while (++index2 <= path.length) {
    if (index2 < path.length) {
      code = path.charCodeAt(index2);
    } else if (code === 47) {
      break;
    } else {
      code = 47;
    }
    if (code === 47) {
      if (lastSlash === index2 - 1 || dots === 1)
        ;
      else if (lastSlash !== index2 - 1 && dots === 2) {
        if (result.length < 2 || lastSegmentLength !== 2 || result.charCodeAt(result.length - 1) !== 46 || result.charCodeAt(result.length - 2) !== 46) {
          if (result.length > 2) {
            lastSlashIndex = result.lastIndexOf("/");
            if (lastSlashIndex !== result.length - 1) {
              if (lastSlashIndex < 0) {
                result = "";
                lastSegmentLength = 0;
              } else {
                result = result.slice(0, lastSlashIndex);
                lastSegmentLength = result.length - 1 - result.lastIndexOf("/");
              }
              lastSlash = index2;
              dots = 0;
              continue;
            }
          } else if (result.length) {
            result = "";
            lastSegmentLength = 0;
            lastSlash = index2;
            dots = 0;
            continue;
          }
        }
        if (allowAboveRoot) {
          result = result.length ? result + "/.." : "..";
          lastSegmentLength = 2;
        }
      } else {
        if (result.length) {
          result += "/" + path.slice(lastSlash + 1, index2);
        } else {
          result = path.slice(lastSlash + 1, index2);
        }
        lastSegmentLength = index2 - lastSlash - 1;
      }
      lastSlash = index2;
      dots = 0;
    } else if (code === 46 && dots > -1) {
      dots++;
    } else {
      dots = -1;
    }
  }
  return result;
}
function assertPath$2(path) {
  if (typeof path !== "string") {
    throw new TypeError(
      "Path must be a string. Received " + JSON.stringify(path)
    );
  }
}
var minproc_browser = {};
minproc_browser.cwd = cwd;
function cwd() {
  return "/";
}
/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
var isBuffer = function isBuffer2(obj) {
  return obj != null && obj.constructor != null && typeof obj.constructor.isBuffer === "function" && obj.constructor.isBuffer(obj);
};
var p = minpath_browser;
var proc = minproc_browser;
var buffer = isBuffer;
var core = VFile$1;
var own$3 = {}.hasOwnProperty;
var order = ["history", "path", "basename", "stem", "extname", "dirname"];
VFile$1.prototype.toString = toString;
Object.defineProperty(VFile$1.prototype, "path", { get: getPath, set: setPath });
Object.defineProperty(VFile$1.prototype, "dirname", {
  get: getDirname,
  set: setDirname
});
Object.defineProperty(VFile$1.prototype, "basename", {
  get: getBasename,
  set: setBasename
});
Object.defineProperty(VFile$1.prototype, "extname", {
  get: getExtname,
  set: setExtname
});
Object.defineProperty(VFile$1.prototype, "stem", { get: getStem, set: setStem });
function VFile$1(options) {
  var prop;
  var index2;
  if (!options) {
    options = {};
  } else if (typeof options === "string" || buffer(options)) {
    options = { contents: options };
  } else if ("message" in options && "messages" in options) {
    return options;
  }
  if (!(this instanceof VFile$1)) {
    return new VFile$1(options);
  }
  this.data = {};
  this.messages = [];
  this.history = [];
  this.cwd = proc.cwd();
  index2 = -1;
  while (++index2 < order.length) {
    prop = order[index2];
    if (own$3.call(options, prop)) {
      this[prop] = options[prop];
    }
  }
  for (prop in options) {
    if (order.indexOf(prop) < 0) {
      this[prop] = options[prop];
    }
  }
}
function getPath() {
  return this.history[this.history.length - 1];
}
function setPath(path) {
  assertNonEmpty(path, "path");
  if (this.path !== path) {
    this.history.push(path);
  }
}
function getDirname() {
  return typeof this.path === "string" ? p.dirname(this.path) : void 0;
}
function setDirname(dirname3) {
  assertPath$1(this.path, "dirname");
  this.path = p.join(dirname3 || "", this.basename);
}
function getBasename() {
  return typeof this.path === "string" ? p.basename(this.path) : void 0;
}
function setBasename(basename3) {
  assertNonEmpty(basename3, "basename");
  assertPart(basename3, "basename");
  this.path = p.join(this.dirname || "", basename3);
}
function getExtname() {
  return typeof this.path === "string" ? p.extname(this.path) : void 0;
}
function setExtname(extname3) {
  assertPart(extname3, "extname");
  assertPath$1(this.path, "extname");
  if (extname3) {
    if (extname3.charCodeAt(0) !== 46) {
      throw new Error("`extname` must start with `.`");
    }
    if (extname3.indexOf(".", 1) > -1) {
      throw new Error("`extname` cannot contain multiple dots");
    }
  }
  this.path = p.join(this.dirname, this.stem + (extname3 || ""));
}
function getStem() {
  return typeof this.path === "string" ? p.basename(this.path, this.extname) : void 0;
}
function setStem(stem) {
  assertNonEmpty(stem, "stem");
  assertPart(stem, "stem");
  this.path = p.join(this.dirname || "", stem + (this.extname || ""));
}
function toString(encoding) {
  return (this.contents || "").toString(encoding);
}
function assertPart(part, name2) {
  if (part && part.indexOf(p.sep) > -1) {
    throw new Error(
      "`" + name2 + "` cannot be a path: did not expect `" + p.sep + "`"
    );
  }
}
function assertNonEmpty(part, name2) {
  if (!part) {
    throw new Error("`" + name2 + "` cannot be empty");
  }
}
function assertPath$1(path, name2) {
  if (!path) {
    throw new Error("Setting `" + name2 + "` requires `path` to be set too");
  }
}
var VMessage = vfileMessage;
var VFile = core;
var lib = VFile;
VFile.prototype.message = message;
VFile.prototype.info = info;
VFile.prototype.fail = fail;
function message(reason, position2, origin) {
  var message2 = new VMessage(reason, position2, origin);
  if (this.path) {
    message2.name = this.path + ":" + message2.name;
    message2.file = this.path;
  }
  message2.fatal = false;
  this.messages.push(message2);
  return message2;
}
function fail() {
  var message2 = this.message.apply(this, arguments);
  message2.fatal = true;
  throw message2;
}
function info() {
  var message2 = this.message.apply(this, arguments);
  message2.fatal = null;
  return message2;
}
var vfile$1 = lib;
var slice$2 = [].slice;
var wrap_1 = wrap$2;
function wrap$2(fn, callback) {
  var invoked;
  return wrapped;
  function wrapped() {
    var params = slice$2.call(arguments, 0);
    var callback2 = fn.length > params.length;
    var result;
    if (callback2) {
      params.push(done);
    }
    try {
      result = fn.apply(null, params);
    } catch (error) {
      if (callback2 && invoked) {
        throw error;
      }
      return done(error);
    }
    if (!callback2) {
      if (result && typeof result.then === "function") {
        result.then(then, done);
      } else if (result instanceof Error) {
        done(result);
      } else {
        then(result);
      }
    }
  }
  function done() {
    if (!invoked) {
      invoked = true;
      callback.apply(null, arguments);
    }
  }
  function then(value) {
    done(null, value);
  }
}
var wrap$1 = wrap_1;
var trough_1 = trough$1;
trough$1.wrap = wrap$1;
var slice$1 = [].slice;
function trough$1() {
  var fns = [];
  var middleware = {};
  middleware.run = run2;
  middleware.use = use;
  return middleware;
  function run2() {
    var index2 = -1;
    var input = slice$1.call(arguments, 0, -1);
    var done = arguments[arguments.length - 1];
    if (typeof done !== "function") {
      throw new Error("Expected function as last argument, not " + done);
    }
    next.apply(null, [null].concat(input));
    function next(err) {
      var fn = fns[++index2];
      var params = slice$1.call(arguments, 0);
      var values = params.slice(1);
      var length = input.length;
      var pos = -1;
      if (err) {
        done(err);
        return;
      }
      while (++pos < length) {
        if (values[pos] === null || values[pos] === void 0) {
          values[pos] = input[pos];
        }
      }
      input = values;
      if (fn) {
        wrap$1(fn, next).apply(null, input);
      } else {
        done.apply(null, [null].concat(input));
      }
    }
  }
  function use(fn) {
    if (typeof fn !== "function") {
      throw new Error("Expected `fn` to be a function, not " + fn);
    }
    fns.push(fn);
    return middleware;
  }
}
var isPlainObj = (value) => {
  if (Object.prototype.toString.call(value) !== "[object Object]") {
    return false;
  }
  const prototype = Object.getPrototypeOf(value);
  return prototype === null || prototype === Object.prototype;
};
var extend$1 = extend$2;
var bail = bail_1;
var vfile = vfile$1;
var trough = trough_1;
var plain = isPlainObj;
var unified_1 = unified().freeze();
var slice = [].slice;
var own$2 = {}.hasOwnProperty;
var pipeline = trough().use(pipelineParse).use(pipelineRun).use(pipelineStringify);
function pipelineParse(p2, ctx) {
  ctx.tree = p2.parse(ctx.file);
}
function pipelineRun(p2, ctx, next) {
  p2.run(ctx.tree, ctx.file, done);
  function done(err, tree, file) {
    if (err) {
      next(err);
    } else {
      ctx.tree = tree;
      ctx.file = file;
      next();
    }
  }
}
function pipelineStringify(p2, ctx) {
  ctx.file.contents = p2.stringify(ctx.tree, ctx.file);
}
function unified() {
  var attachers = [];
  var transformers = trough();
  var namespace = {};
  var frozen = false;
  var freezeIndex = -1;
  processor.data = data;
  processor.freeze = freeze;
  processor.attachers = attachers;
  processor.use = use;
  processor.parse = parse3;
  processor.stringify = stringify2;
  processor.run = run2;
  processor.runSync = runSync;
  processor.process = process2;
  processor.processSync = processSync;
  return processor;
  function processor() {
    var destination = unified();
    var length = attachers.length;
    var index2 = -1;
    while (++index2 < length) {
      destination.use.apply(null, attachers[index2]);
    }
    destination.data(extend$1(true, {}, namespace));
    return destination;
  }
  function freeze() {
    var values;
    var plugin;
    var options;
    var transformer;
    if (frozen) {
      return processor;
    }
    while (++freezeIndex < attachers.length) {
      values = attachers[freezeIndex];
      plugin = values[0];
      options = values[1];
      transformer = null;
      if (options === false) {
        continue;
      }
      if (options === true) {
        values[1] = void 0;
      }
      transformer = plugin.apply(processor, values.slice(1));
      if (typeof transformer === "function") {
        transformers.use(transformer);
      }
    }
    frozen = true;
    freezeIndex = Infinity;
    return processor;
  }
  function data(key, value) {
    if (typeof key === "string") {
      if (arguments.length === 2) {
        assertUnfrozen("data", frozen);
        namespace[key] = value;
        return processor;
      }
      return own$2.call(namespace, key) && namespace[key] || null;
    }
    if (key) {
      assertUnfrozen("data", frozen);
      namespace = key;
      return processor;
    }
    return namespace;
  }
  function use(value) {
    var settings;
    assertUnfrozen("use", frozen);
    if (value === null || value === void 0)
      ;
    else if (typeof value === "function") {
      addPlugin.apply(null, arguments);
    } else if (typeof value === "object") {
      if ("length" in value) {
        addList(value);
      } else {
        addPreset(value);
      }
    } else {
      throw new Error("Expected usable value, not `" + value + "`");
    }
    if (settings) {
      namespace.settings = extend$1(namespace.settings || {}, settings);
    }
    return processor;
    function addPreset(result) {
      addList(result.plugins);
      if (result.settings) {
        settings = extend$1(settings || {}, result.settings);
      }
    }
    function add(value2) {
      if (typeof value2 === "function") {
        addPlugin(value2);
      } else if (typeof value2 === "object") {
        if ("length" in value2) {
          addPlugin.apply(null, value2);
        } else {
          addPreset(value2);
        }
      } else {
        throw new Error("Expected usable value, not `" + value2 + "`");
      }
    }
    function addList(plugins) {
      var length;
      var index2;
      if (plugins === null || plugins === void 0)
        ;
      else if (typeof plugins === "object" && "length" in plugins) {
        length = plugins.length;
        index2 = -1;
        while (++index2 < length) {
          add(plugins[index2]);
        }
      } else {
        throw new Error("Expected a list of plugins, not `" + plugins + "`");
      }
    }
    function addPlugin(plugin, value2) {
      var entry = find(plugin);
      if (entry) {
        if (plain(entry[1]) && plain(value2)) {
          value2 = extend$1(entry[1], value2);
        }
        entry[1] = value2;
      } else {
        attachers.push(slice.call(arguments));
      }
    }
  }
  function find(plugin) {
    var length = attachers.length;
    var index2 = -1;
    var entry;
    while (++index2 < length) {
      entry = attachers[index2];
      if (entry[0] === plugin) {
        return entry;
      }
    }
  }
  function parse3(doc) {
    var file = vfile(doc);
    var Parser2;
    freeze();
    Parser2 = processor.Parser;
    assertParser("parse", Parser2);
    if (newable(Parser2, "parse")) {
      return new Parser2(String(file), file).parse();
    }
    return Parser2(String(file), file);
  }
  function run2(node, file, cb) {
    assertNode(node);
    freeze();
    if (!cb && typeof file === "function") {
      cb = file;
      file = null;
    }
    if (!cb) {
      return new Promise(executor);
    }
    executor(null, cb);
    function executor(resolve2, reject) {
      transformers.run(node, vfile(file), done);
      function done(err, tree, file2) {
        tree = tree || node;
        if (err) {
          reject(err);
        } else if (resolve2) {
          resolve2(tree);
        } else {
          cb(null, tree, file2);
        }
      }
    }
  }
  function runSync(node, file) {
    var complete = false;
    var result;
    run2(node, file, done);
    assertDone("runSync", "run", complete);
    return result;
    function done(err, tree) {
      complete = true;
      bail(err);
      result = tree;
    }
  }
  function stringify2(node, doc) {
    var file = vfile(doc);
    var Compiler;
    freeze();
    Compiler = processor.Compiler;
    assertCompiler("stringify", Compiler);
    assertNode(node);
    if (newable(Compiler, "compile")) {
      return new Compiler(node, file).compile();
    }
    return Compiler(node, file);
  }
  function process2(doc, cb) {
    freeze();
    assertParser("process", processor.Parser);
    assertCompiler("process", processor.Compiler);
    if (!cb) {
      return new Promise(executor);
    }
    executor(null, cb);
    function executor(resolve2, reject) {
      var file = vfile(doc);
      pipeline.run(processor, { file }, done);
      function done(err) {
        if (err) {
          reject(err);
        } else if (resolve2) {
          resolve2(file);
        } else {
          cb(null, file);
        }
      }
    }
  }
  function processSync(doc) {
    var complete = false;
    var file;
    freeze();
    assertParser("processSync", processor.Parser);
    assertCompiler("processSync", processor.Compiler);
    file = vfile(doc);
    process2(file, done);
    assertDone("processSync", "process", complete);
    return file;
    function done(err) {
      complete = true;
      bail(err);
    }
  }
}
function newable(value, name2) {
  return typeof value === "function" && value.prototype && (keys$1(value.prototype) || name2 in value.prototype);
}
function keys$1(value) {
  var key;
  for (key in value) {
    return true;
  }
  return false;
}
function assertParser(name2, Parser2) {
  if (typeof Parser2 !== "function") {
    throw new Error("Cannot `" + name2 + "` without `Parser`");
  }
}
function assertCompiler(name2, Compiler) {
  if (typeof Compiler !== "function") {
    throw new Error("Cannot `" + name2 + "` without `Compiler`");
  }
}
function assertUnfrozen(name2, frozen) {
  if (frozen) {
    throw new Error(
      "Cannot invoke `" + name2 + "` on a frozen processor.\nCreate a new processor first, by invoking it: use `processor()` instead of `processor`."
    );
  }
}
function assertNode(node) {
  if (!node || typeof node.type !== "string") {
    throw new Error("Expected node, got `" + node + "`");
  }
}
function assertDone(name2, asyncName, complete) {
  if (!complete) {
    throw new Error(
      "`" + name2 + "` finished async. Use `" + asyncName + "` instead"
    );
  }
}
var immutable = extend2;
var hasOwnProperty = Object.prototype.hasOwnProperty;
function extend2() {
  var target = {};
  for (var i = 0; i < arguments.length; i++) {
    var source2 = arguments[i];
    for (var key in source2) {
      if (hasOwnProperty.call(source2, key)) {
        target[key] = source2[key];
      }
    }
  }
  return target;
}
var inherits_browser = { exports: {} };
if (typeof Object.create === "function") {
  inherits_browser.exports = function inherits2(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor;
      ctor.prototype = Object.create(superCtor.prototype, {
        constructor: {
          value: ctor,
          enumerable: false,
          writable: true,
          configurable: true
        }
      });
    }
  };
} else {
  inherits_browser.exports = function inherits2(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor;
      var TempCtor = function() {
      };
      TempCtor.prototype = superCtor.prototype;
      ctor.prototype = new TempCtor();
      ctor.prototype.constructor = ctor;
    }
  };
}
var xtend$6 = immutable;
var inherits = inherits_browser.exports;
var unherit_1 = unherit$1;
function unherit$1(Super) {
  var result;
  var key;
  var value;
  inherits(Of, Super);
  inherits(From, Of);
  result = Of.prototype;
  for (key in result) {
    value = result[key];
    if (value && typeof value === "object") {
      result[key] = "concat" in value ? value.concat() : xtend$6(value);
    }
  }
  return Of;
  function From(parameters) {
    return Super.apply(this, parameters);
  }
  function Of() {
    if (!(this instanceof Of)) {
      return new From(arguments);
    }
    return Super.apply(this, arguments);
  }
}
var stateToggle = factory$4;
function factory$4(key, state, ctx) {
  return enter;
  function enter() {
    var context = ctx || this;
    var current = context[key];
    context[key] = !state;
    return exit;
    function exit() {
      context[key] = current;
    }
  }
}
var vfileLocation$1 = factory$3;
function factory$3(file) {
  var contents = indices(String(file));
  return {
    toPosition: offsetToPositionFactory(contents),
    toOffset: positionToOffsetFactory(contents)
  };
}
function offsetToPositionFactory(indices2) {
  return offsetToPosition;
  function offsetToPosition(offset) {
    var index2 = -1;
    var length = indices2.length;
    if (offset < 0) {
      return {};
    }
    while (++index2 < length) {
      if (indices2[index2] > offset) {
        return {
          line: index2 + 1,
          column: offset - (indices2[index2 - 1] || 0) + 1,
          offset
        };
      }
    }
    return {};
  }
}
function positionToOffsetFactory(indices2) {
  return positionToOffset;
  function positionToOffset(position2) {
    var line = position2 && position2.line;
    var column = position2 && position2.column;
    if (!isNaN(line) && !isNaN(column) && line - 1 in indices2) {
      return (indices2[line - 2] || 0) + column - 1 || 0;
    }
    return -1;
  }
}
function indices(value) {
  var result = [];
  var index2 = value.indexOf("\n");
  while (index2 !== -1) {
    result.push(index2 + 1);
    index2 = value.indexOf("\n", index2 + 1);
  }
  result.push(value.length + 1);
  return result;
}
var _unescape = factory$2;
var backslash$8 = "\\";
function factory$2(ctx, key) {
  return unescape2;
  function unescape2(value) {
    var prev = 0;
    var index2 = value.indexOf(backslash$8);
    var escape2 = ctx[key];
    var queue = [];
    var character;
    while (index2 !== -1) {
      queue.push(value.slice(prev, index2));
      prev = index2 + 1;
      character = value.charAt(prev);
      if (!character || escape2.indexOf(character) === -1) {
        queue.push(backslash$8);
      }
      index2 = value.indexOf(backslash$8, prev + 1);
    }
    queue.push(value.slice(prev));
    return queue.join("");
  }
}
const AElig = "\xC6";
const AMP = "&";
const Aacute = "\xC1";
const Acirc = "\xC2";
const Agrave = "\xC0";
const Aring = "\xC5";
const Atilde = "\xC3";
const Auml = "\xC4";
const COPY = "\xA9";
const Ccedil = "\xC7";
const ETH = "\xD0";
const Eacute = "\xC9";
const Ecirc = "\xCA";
const Egrave = "\xC8";
const Euml = "\xCB";
const GT = ">";
const Iacute = "\xCD";
const Icirc = "\xCE";
const Igrave = "\xCC";
const Iuml = "\xCF";
const LT = "<";
const Ntilde = "\xD1";
const Oacute = "\xD3";
const Ocirc = "\xD4";
const Ograve = "\xD2";
const Oslash = "\xD8";
const Otilde = "\xD5";
const Ouml = "\xD6";
const QUOT = '"';
const REG = "\xAE";
const THORN = "\xDE";
const Uacute = "\xDA";
const Ucirc = "\xDB";
const Ugrave = "\xD9";
const Uuml = "\xDC";
const Yacute = "\xDD";
const aacute = "\xE1";
const acirc = "\xE2";
const acute = "\xB4";
const aelig = "\xE6";
const agrave = "\xE0";
const amp = "&";
const aring = "\xE5";
const atilde = "\xE3";
const auml = "\xE4";
const brvbar = "\xA6";
const ccedil = "\xE7";
const cedil = "\xB8";
const cent = "\xA2";
const copy = "\xA9";
const curren = "\xA4";
const deg = "\xB0";
const divide = "\xF7";
const eacute = "\xE9";
const ecirc = "\xEA";
const egrave = "\xE8";
const eth = "\xF0";
const euml = "\xEB";
const frac12 = "\xBD";
const frac14 = "\xBC";
const frac34 = "\xBE";
const gt = ">";
const iacute = "\xED";
const icirc = "\xEE";
const iexcl = "\xA1";
const igrave = "\xEC";
const iquest = "\xBF";
const iuml = "\xEF";
const laquo = "\xAB";
const lt = "<";
const macr = "\xAF";
const micro = "\xB5";
const middot = "\xB7";
const nbsp = "\xA0";
const not = "\xAC";
const ntilde = "\xF1";
const oacute = "\xF3";
const ocirc = "\xF4";
const ograve = "\xF2";
const ordf = "\xAA";
const ordm = "\xBA";
const oslash = "\xF8";
const otilde = "\xF5";
const ouml = "\xF6";
const para = "\xB6";
const plusmn = "\xB1";
const pound = "\xA3";
const quot = '"';
const raquo = "\xBB";
const reg = "\xAE";
const sect = "\xA7";
const shy = "\xAD";
const sup1 = "\xB9";
const sup2 = "\xB2";
const sup3 = "\xB3";
const szlig = "\xDF";
const thorn = "\xFE";
const times = "\xD7";
const uacute = "\xFA";
const ucirc = "\xFB";
const ugrave = "\xF9";
const uml = "\xA8";
const uuml = "\xFC";
const yacute = "\xFD";
const yen = "\xA5";
const yuml = "\xFF";
var require$$0 = {
  AElig,
  AMP,
  Aacute,
  Acirc,
  Agrave,
  Aring,
  Atilde,
  Auml,
  COPY,
  Ccedil,
  ETH,
  Eacute,
  Ecirc,
  Egrave,
  Euml,
  GT,
  Iacute,
  Icirc,
  Igrave,
  Iuml,
  LT,
  Ntilde,
  Oacute,
  Ocirc,
  Ograve,
  Oslash,
  Otilde,
  Ouml,
  QUOT,
  REG,
  THORN,
  Uacute,
  Ucirc,
  Ugrave,
  Uuml,
  Yacute,
  aacute,
  acirc,
  acute,
  aelig,
  agrave,
  amp,
  aring,
  atilde,
  auml,
  brvbar,
  ccedil,
  cedil,
  cent,
  copy,
  curren,
  deg,
  divide,
  eacute,
  ecirc,
  egrave,
  eth,
  euml,
  frac12,
  frac14,
  frac34,
  gt,
  iacute,
  icirc,
  iexcl,
  igrave,
  iquest,
  iuml,
  laquo,
  lt,
  macr,
  micro,
  middot,
  nbsp,
  not,
  ntilde,
  oacute,
  ocirc,
  ograve,
  ordf,
  ordm,
  oslash,
  otilde,
  ouml,
  para,
  plusmn,
  pound,
  quot,
  raquo,
  reg,
  sect,
  shy,
  sup1,
  sup2,
  sup3,
  szlig,
  thorn,
  times,
  uacute,
  ucirc,
  ugrave,
  uml,
  uuml,
  yacute,
  yen,
  yuml
};
var require$$1 = {
  "0": "\uFFFD",
  "128": "\u20AC",
  "130": "\u201A",
  "131": "\u0192",
  "132": "\u201E",
  "133": "\u2026",
  "134": "\u2020",
  "135": "\u2021",
  "136": "\u02C6",
  "137": "\u2030",
  "138": "\u0160",
  "139": "\u2039",
  "140": "\u0152",
  "142": "\u017D",
  "145": "\u2018",
  "146": "\u2019",
  "147": "\u201C",
  "148": "\u201D",
  "149": "\u2022",
  "150": "\u2013",
  "151": "\u2014",
  "152": "\u02DC",
  "153": "\u2122",
  "154": "\u0161",
  "155": "\u203A",
  "156": "\u0153",
  "158": "\u017E",
  "159": "\u0178"
};
var isDecimal = decimal$4;
function decimal$4(character) {
  var code = typeof character === "string" ? character.charCodeAt(0) : character;
  return code >= 48 && code <= 57;
}
var isHexadecimal = hexadecimal$1;
function hexadecimal$1(character) {
  var code = typeof character === "string" ? character.charCodeAt(0) : character;
  return code >= 97 && code <= 102 || code >= 65 && code <= 70 || code >= 48 && code <= 57;
}
var isAlphabetical = alphabetical$2;
function alphabetical$2(character) {
  var code = typeof character === "string" ? character.charCodeAt(0) : character;
  return code >= 97 && code <= 122 || code >= 65 && code <= 90;
}
var alphabetical$1 = isAlphabetical;
var decimal$3 = isDecimal;
var isAlphanumerical = alphanumerical$1;
function alphanumerical$1(character) {
  return alphabetical$1(character) || decimal$3(character);
}
var el;
var semicolon$2 = 59;
var decodeEntity_browser = decodeEntity$1;
function decodeEntity$1(characters) {
  var entity = "&" + characters + ";";
  var char;
  el = el || document.createElement("i");
  el.innerHTML = entity;
  char = el.textContent;
  if (char.charCodeAt(char.length - 1) === semicolon$2 && characters !== "semi") {
    return false;
  }
  return char === entity ? false : char;
}
var legacy = require$$0;
var invalid = require$$1;
var decimal$2 = isDecimal;
var hexadecimal = isHexadecimal;
var alphanumerical = isAlphanumerical;
var decodeEntity = decodeEntity_browser;
var parseEntities_1 = parseEntities;
var own$1 = {}.hasOwnProperty;
var fromCharCode = String.fromCharCode;
var noop = Function.prototype;
var defaults$3 = {
  warning: null,
  reference: null,
  text: null,
  warningContext: null,
  referenceContext: null,
  textContext: null,
  position: {},
  additional: null,
  attribute: false,
  nonTerminated: true
};
var tab$e = 9;
var lineFeed$j = 10;
var formFeed = 12;
var space$h = 32;
var ampersand = 38;
var semicolon$1 = 59;
var lessThan$6 = 60;
var equalsTo$1 = 61;
var numberSign$1 = 35;
var uppercaseX = 88;
var lowercaseX$1 = 120;
var replacementCharacter = 65533;
var name = "named";
var hexa = "hexadecimal";
var deci = "decimal";
var bases = {};
bases[hexa] = 16;
bases[deci] = 10;
var tests = {};
tests[name] = alphanumerical;
tests[deci] = decimal$2;
tests[hexa] = hexadecimal;
var namedNotTerminated = 1;
var numericNotTerminated = 2;
var namedEmpty = 3;
var numericEmpty = 4;
var namedUnknown = 5;
var numericDisallowed = 6;
var numericProhibited = 7;
var messages = {};
messages[namedNotTerminated] = "Named character references must be terminated by a semicolon";
messages[numericNotTerminated] = "Numeric character references must be terminated by a semicolon";
messages[namedEmpty] = "Named character references cannot be empty";
messages[numericEmpty] = "Numeric character references cannot be empty";
messages[namedUnknown] = "Named character references must be known";
messages[numericDisallowed] = "Numeric character references cannot be disallowed";
messages[numericProhibited] = "Numeric character references cannot be outside the permissible Unicode range";
function parseEntities(value, options) {
  var settings = {};
  var option;
  var key;
  if (!options) {
    options = {};
  }
  for (key in defaults$3) {
    option = options[key];
    settings[key] = option === null || option === void 0 ? defaults$3[key] : option;
  }
  if (settings.position.indent || settings.position.start) {
    settings.indent = settings.position.indent || [];
    settings.position = settings.position.start;
  }
  return parse$5(value, settings);
}
function parse$5(value, settings) {
  var additional = settings.additional;
  var nonTerminated = settings.nonTerminated;
  var handleText = settings.text;
  var handleReference = settings.reference;
  var handleWarning = settings.warning;
  var textContext = settings.textContext;
  var referenceContext = settings.referenceContext;
  var warningContext = settings.warningContext;
  var pos = settings.position;
  var indent = settings.indent || [];
  var length = value.length;
  var index2 = 0;
  var lines = -1;
  var column = pos.column || 1;
  var line = pos.line || 1;
  var queue = "";
  var result = [];
  var entityCharacters;
  var namedEntity;
  var terminated;
  var characters;
  var character;
  var reference2;
  var following;
  var warning;
  var reason;
  var output;
  var entity;
  var begin;
  var start;
  var type;
  var test;
  var prev;
  var next;
  var diff;
  var end;
  if (typeof additional === "string") {
    additional = additional.charCodeAt(0);
  }
  prev = now();
  warning = handleWarning ? parseError : noop;
  index2--;
  length++;
  while (++index2 < length) {
    if (character === lineFeed$j) {
      column = indent[lines] || 1;
    }
    character = value.charCodeAt(index2);
    if (character === ampersand) {
      following = value.charCodeAt(index2 + 1);
      if (following === tab$e || following === lineFeed$j || following === formFeed || following === space$h || following === ampersand || following === lessThan$6 || following !== following || additional && following === additional) {
        queue += fromCharCode(character);
        column++;
        continue;
      }
      start = index2 + 1;
      begin = start;
      end = start;
      if (following === numberSign$1) {
        end = ++begin;
        following = value.charCodeAt(end);
        if (following === uppercaseX || following === lowercaseX$1) {
          type = hexa;
          end = ++begin;
        } else {
          type = deci;
        }
      } else {
        type = name;
      }
      entityCharacters = "";
      entity = "";
      characters = "";
      test = tests[type];
      end--;
      while (++end < length) {
        following = value.charCodeAt(end);
        if (!test(following)) {
          break;
        }
        characters += fromCharCode(following);
        if (type === name && own$1.call(legacy, characters)) {
          entityCharacters = characters;
          entity = legacy[characters];
        }
      }
      terminated = value.charCodeAt(end) === semicolon$1;
      if (terminated) {
        end++;
        namedEntity = type === name ? decodeEntity(characters) : false;
        if (namedEntity) {
          entityCharacters = characters;
          entity = namedEntity;
        }
      }
      diff = 1 + end - start;
      if (!terminated && !nonTerminated)
        ;
      else if (!characters) {
        if (type !== name) {
          warning(numericEmpty, diff);
        }
      } else if (type === name) {
        if (terminated && !entity) {
          warning(namedUnknown, 1);
        } else {
          if (entityCharacters !== characters) {
            end = begin + entityCharacters.length;
            diff = 1 + end - begin;
            terminated = false;
          }
          if (!terminated) {
            reason = entityCharacters ? namedNotTerminated : namedEmpty;
            if (settings.attribute) {
              following = value.charCodeAt(end);
              if (following === equalsTo$1) {
                warning(reason, diff);
                entity = null;
              } else if (alphanumerical(following)) {
                entity = null;
              } else {
                warning(reason, diff);
              }
            } else {
              warning(reason, diff);
            }
          }
        }
        reference2 = entity;
      } else {
        if (!terminated) {
          warning(numericNotTerminated, diff);
        }
        reference2 = parseInt(characters, bases[type]);
        if (prohibited(reference2)) {
          warning(numericProhibited, diff);
          reference2 = fromCharCode(replacementCharacter);
        } else if (reference2 in invalid) {
          warning(numericDisallowed, diff);
          reference2 = invalid[reference2];
        } else {
          output = "";
          if (disallowed(reference2)) {
            warning(numericDisallowed, diff);
          }
          if (reference2 > 65535) {
            reference2 -= 65536;
            output += fromCharCode(reference2 >>> (10 & 1023) | 55296);
            reference2 = 56320 | reference2 & 1023;
          }
          reference2 = output + fromCharCode(reference2);
        }
      }
      if (reference2) {
        flush();
        prev = now();
        index2 = end - 1;
        column += end - start + 1;
        result.push(reference2);
        next = now();
        next.offset++;
        if (handleReference) {
          handleReference.call(
            referenceContext,
            reference2,
            { start: prev, end: next },
            value.slice(start - 1, end)
          );
        }
        prev = next;
      } else {
        characters = value.slice(start - 1, end);
        queue += characters;
        column += characters.length;
        index2 = end - 1;
      }
    } else {
      if (character === 10) {
        line++;
        lines++;
        column = 0;
      }
      if (character === character) {
        queue += fromCharCode(character);
        column++;
      } else {
        flush();
      }
    }
  }
  return result.join("");
  function now() {
    return {
      line,
      column,
      offset: index2 + (pos.offset || 0)
    };
  }
  function parseError(code, offset) {
    var position2 = now();
    position2.column += offset;
    position2.offset += offset;
    handleWarning.call(warningContext, messages[code], position2, code);
  }
  function flush() {
    if (queue) {
      result.push(queue);
      if (handleText) {
        handleText.call(textContext, queue, { start: prev, end: now() });
      }
      queue = "";
    }
  }
}
function prohibited(code) {
  return code >= 55296 && code <= 57343 || code > 1114111;
}
function disallowed(code) {
  return code >= 1 && code <= 8 || code === 11 || code >= 13 && code <= 31 || code >= 127 && code <= 159 || code >= 64976 && code <= 65007 || (code & 65535) === 65535 || (code & 65535) === 65534;
}
var xtend$5 = immutable;
var entities = parseEntities_1;
var decode$3 = factory$1;
function factory$1(ctx) {
  decoder.raw = decodeRaw;
  return decoder;
  function normalize3(position2) {
    var offsets = ctx.offset;
    var line = position2.line;
    var result = [];
    while (++line) {
      if (!(line in offsets)) {
        break;
      }
      result.push((offsets[line] || 0) + 1);
    }
    return { start: position2, indent: result };
  }
  function decoder(value, position2, handler) {
    entities(value, {
      position: normalize3(position2),
      warning: handleWarning,
      text: handler,
      reference: handler,
      textContext: ctx,
      referenceContext: ctx
    });
  }
  function decodeRaw(value, position2, options) {
    return entities(
      value,
      xtend$5(options, { position: normalize3(position2), warning: handleWarning })
    );
  }
  function handleWarning(reason, position2, code) {
    if (code !== 3) {
      ctx.file.message(reason, position2);
    }
  }
}
var tokenizer$1 = factory;
function factory(type) {
  return tokenize;
  function tokenize(value, location) {
    var self = this;
    var offset = self.offset;
    var tokens = [];
    var methods = self[type + "Methods"];
    var tokenizers = self[type + "Tokenizers"];
    var line = location.line;
    var column = location.column;
    var index2;
    var length;
    var method;
    var name2;
    var matched;
    var valueLength;
    if (!value) {
      return tokens;
    }
    eat.now = now;
    eat.file = self.file;
    updatePosition("");
    while (value) {
      index2 = -1;
      length = methods.length;
      matched = false;
      while (++index2 < length) {
        name2 = methods[index2];
        method = tokenizers[name2];
        if (method && (!method.onlyAtStart || self.atStart) && (!method.notInList || !self.inList) && (!method.notInBlock || !self.inBlock) && (!method.notInLink || !self.inLink)) {
          valueLength = value.length;
          method.apply(self, [eat, value]);
          matched = valueLength !== value.length;
          if (matched) {
            break;
          }
        }
      }
      if (!matched) {
        self.file.fail(new Error("Infinite loop"), eat.now());
      }
    }
    self.eof = now();
    return tokens;
    function updatePosition(subvalue) {
      var lastIndex = -1;
      var index3 = subvalue.indexOf("\n");
      while (index3 !== -1) {
        line++;
        lastIndex = index3;
        index3 = subvalue.indexOf("\n", index3 + 1);
      }
      if (lastIndex === -1) {
        column += subvalue.length;
      } else {
        column = subvalue.length - lastIndex;
      }
      if (line in offset) {
        if (lastIndex !== -1) {
          column += offset[line];
        } else if (column <= offset[line]) {
          column = offset[line] + 1;
        }
      }
    }
    function getOffset() {
      var indentation2 = [];
      var pos = line + 1;
      return function() {
        var last = line + 1;
        while (pos < last) {
          indentation2.push((offset[pos] || 0) + 1);
          pos++;
        }
        return indentation2;
      };
    }
    function now() {
      var pos = { line, column };
      pos.offset = self.toOffset(pos);
      return pos;
    }
    function Position(start) {
      this.start = start;
      this.end = now();
    }
    function validateEat(subvalue) {
      if (value.slice(0, subvalue.length) !== subvalue) {
        self.file.fail(
          new Error(
            "Incorrectly eaten value: please report this warning on https://git.io/vg5Ft"
          ),
          now()
        );
      }
    }
    function position2() {
      var before = now();
      return update;
      function update(node, indent) {
        var prev = node.position;
        var start = prev ? prev.start : before;
        var combined = [];
        var n = prev && prev.end.line;
        var l = before.line;
        node.position = new Position(start);
        if (prev && indent && prev.indent) {
          combined = prev.indent;
          if (n < l) {
            while (++n < l) {
              combined.push((offset[n] || 0) + 1);
            }
            combined.push(before.column);
          }
          indent = combined.concat(indent);
        }
        node.position.indent = indent || [];
        return node;
      }
    }
    function add(node, parent) {
      var children = parent ? parent.children : tokens;
      var prev = children[children.length - 1];
      var fn;
      if (prev && node.type === prev.type && (node.type === "text" || node.type === "blockquote") && mergeable(prev) && mergeable(node)) {
        fn = node.type === "text" ? mergeText : mergeBlockquote;
        node = fn.call(self, prev, node);
      }
      if (node !== prev) {
        children.push(node);
      }
      if (self.atStart && tokens.length !== 0) {
        self.exitStart();
      }
      return node;
    }
    function eat(subvalue) {
      var indent = getOffset();
      var pos = position2();
      var current = now();
      validateEat(subvalue);
      apply.reset = reset;
      reset.test = test;
      apply.test = test;
      value = value.slice(subvalue.length);
      updatePosition(subvalue);
      indent = indent();
      return apply;
      function apply(node, parent) {
        return pos(add(pos(node), parent), indent);
      }
      function reset() {
        var node = apply.apply(null, arguments);
        line = current.line;
        column = current.column;
        value = subvalue + value;
        return node;
      }
      function test() {
        var result = pos({});
        line = current.line;
        column = current.column;
        value = subvalue + value;
        return result.position;
      }
    }
  }
}
function mergeable(node) {
  var start;
  var end;
  if (node.type !== "text" || !node.position) {
    return true;
  }
  start = node.position.start;
  end = node.position.end;
  return start.line !== end.line || end.column - start.column === node.value.length;
}
function mergeText(prev, node) {
  prev.value += node.value;
  return prev;
}
function mergeBlockquote(prev, node) {
  if (this.options.commonmark || this.options.gfm) {
    return node;
  }
  prev.children = prev.children.concat(node.children);
  return prev;
}
var markdownEscapes = escapes$1;
var defaults$2 = [
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
];
var gfm = defaults$2.concat(["~", "|"]);
var commonmark = gfm.concat([
  "\n",
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
escapes$1.default = defaults$2;
escapes$1.gfm = gfm;
escapes$1.commonmark = commonmark;
function escapes$1(options) {
  var settings = options || {};
  if (settings.commonmark) {
    return commonmark;
  }
  return settings.gfm ? gfm : defaults$2;
}
var blockElements = [
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
];
var defaults$1 = {
  position: true,
  gfm: true,
  commonmark: false,
  footnotes: false,
  pedantic: false,
  blocks: blockElements
};
var xtend$4 = immutable;
var escapes = markdownEscapes;
var defaults = defaults$1;
var setOptions_1 = setOptions;
function setOptions(options) {
  var self = this;
  var current = self.options;
  var key;
  var value;
  if (options == null) {
    options = {};
  } else if (typeof options === "object") {
    options = xtend$4(options);
  } else {
    throw new Error("Invalid value `" + options + "` for setting `options`");
  }
  for (key in defaults) {
    value = options[key];
    if (value == null) {
      value = current[key];
    }
    if (key !== "blocks" && typeof value !== "boolean" || key === "blocks" && typeof value !== "object") {
      throw new Error(
        "Invalid value `" + value + "` for setting `options." + key + "`"
      );
    }
    options[key] = value;
  }
  self.options = options;
  self.escape = escapes(options);
  return self;
}
var convert_1 = convert$3;
function convert$3(test) {
  if (typeof test === "string") {
    return typeFactory(test);
  }
  if (test === null || test === void 0) {
    return ok;
  }
  if (typeof test === "object") {
    return ("length" in test ? anyFactory : matchesFactory)(test);
  }
  if (typeof test === "function") {
    return test;
  }
  throw new Error("Expected function, string, or object as test");
}
function convertAll(tests2) {
  var results = [];
  var length = tests2.length;
  var index2 = -1;
  while (++index2 < length) {
    results[index2] = convert$3(tests2[index2]);
  }
  return results;
}
function matchesFactory(test) {
  return matches;
  function matches(node) {
    var key;
    for (key in test) {
      if (node[key] !== test[key]) {
        return false;
      }
    }
    return true;
  }
}
function anyFactory(tests2) {
  var checks = convertAll(tests2);
  var length = checks.length;
  return matches;
  function matches() {
    var index2 = -1;
    while (++index2 < length) {
      if (checks[index2].apply(this, arguments)) {
        return true;
      }
    }
    return false;
  }
}
function typeFactory(test) {
  return type;
  function type(node) {
    return Boolean(node && node.type === test);
  }
}
function ok() {
  return true;
}
var unistUtilVisitParents = visitParents$1;
var convert$2 = convert_1;
var CONTINUE$1 = true;
var SKIP$1 = "skip";
var EXIT$1 = false;
visitParents$1.CONTINUE = CONTINUE$1;
visitParents$1.SKIP = SKIP$1;
visitParents$1.EXIT = EXIT$1;
function visitParents$1(tree, test, visitor, reverse) {
  var is;
  if (typeof test === "function" && typeof visitor !== "function") {
    reverse = visitor;
    visitor = test;
    test = null;
  }
  is = convert$2(test);
  one(tree, null, []);
  function one(node, index2, parents) {
    var result = [];
    var subresult;
    if (!test || is(node, index2, parents[parents.length - 1] || null)) {
      result = toResult(visitor(node, parents));
      if (result[0] === EXIT$1) {
        return result;
      }
    }
    if (node.children && result[0] !== SKIP$1) {
      subresult = toResult(all(node.children, parents.concat(node)));
      return subresult[0] === EXIT$1 ? subresult : result;
    }
    return result;
  }
  function all(children, parents) {
    var min = -1;
    var step = reverse ? -1 : 1;
    var index2 = (reverse ? children.length : min) + step;
    var result;
    while (index2 > min && index2 < children.length) {
      result = one(children[index2], index2, parents);
      if (result[0] === EXIT$1) {
        return result;
      }
      index2 = typeof result[1] === "number" ? result[1] : index2 + step;
    }
  }
}
function toResult(value) {
  if (value !== null && typeof value === "object" && "length" in value) {
    return value;
  }
  if (typeof value === "number") {
    return [CONTINUE$1, value];
  }
  return [value];
}
var unistUtilVisit = visit$1;
var visitParents = unistUtilVisitParents;
var CONTINUE = visitParents.CONTINUE;
var SKIP = visitParents.SKIP;
var EXIT = visitParents.EXIT;
visit$1.CONTINUE = CONTINUE;
visit$1.SKIP = SKIP;
visit$1.EXIT = EXIT;
function visit$1(tree, test, visitor, reverse) {
  if (typeof test === "function" && typeof visitor !== "function") {
    reverse = visitor;
    visitor = test;
    test = null;
  }
  visitParents(tree, test, overload, reverse);
  function overload(node, parents) {
    var parent = parents[parents.length - 1];
    var index2 = parent ? parent.children.indexOf(node) : null;
    return visitor(node, index2, parent);
  }
}
var visit = unistUtilVisit;
var unistUtilRemovePosition = removePosition$1;
function removePosition$1(node, force) {
  visit(node, force ? hard : soft);
  return node;
}
function hard(node) {
  delete node.position;
}
function soft(node) {
  node.position = void 0;
}
var xtend$3 = immutable;
var removePosition = unistUtilRemovePosition;
var parse_1 = parse$4;
var lineFeed$i = "\n";
var lineBreaksExpression = /\r\n|\r/g;
function parse$4() {
  var self = this;
  var value = String(self.file);
  var start = { line: 1, column: 1, offset: 0 };
  var content = xtend$3(start);
  var node;
  value = value.replace(lineBreaksExpression, lineFeed$i);
  if (value.charCodeAt(0) === 65279) {
    value = value.slice(1);
    content.column++;
    content.offset++;
  }
  node = {
    type: "root",
    children: self.tokenizeBlock(value, content),
    position: { start, end: self.eof || xtend$3(start) }
  };
  if (!self.options.position) {
    removePosition(node, true);
  }
  return node;
}
var isWhitespaceCharacter = whitespace$b;
var fromCode$1 = String.fromCharCode;
var re$1 = /\s/;
function whitespace$b(character) {
  return re$1.test(
    typeof character === "number" ? fromCode$1(character) : character.charAt(0)
  );
}
var whitespace$a = isWhitespaceCharacter;
var newline_1 = newline;
var lineFeed$h = "\n";
function newline(eat, value, silent) {
  var character = value.charAt(0);
  var length;
  var subvalue;
  var queue;
  var index2;
  if (character !== lineFeed$h) {
    return;
  }
  if (silent) {
    return true;
  }
  index2 = 1;
  length = value.length;
  subvalue = character;
  queue = "";
  while (index2 < length) {
    character = value.charAt(index2);
    if (!whitespace$a(character)) {
      break;
    }
    queue += character;
    if (character === lineFeed$h) {
      subvalue += queue;
      queue = "";
    }
    index2++;
  }
  eat(subvalue);
}
/*!
 * repeat-string <https://github.com/jonschlinkert/repeat-string>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */
var res = "";
var cache;
var repeatString = repeat$3;
function repeat$3(str, num) {
  if (typeof str !== "string") {
    throw new TypeError("expected a string");
  }
  if (num === 1)
    return str;
  if (num === 2)
    return str + str;
  var max = str.length * num;
  if (cache !== str || typeof cache === "undefined") {
    cache = str;
    res = "";
  } else if (res.length >= max) {
    return res.substr(0, max);
  }
  while (max > res.length && num > 1) {
    if (num & 1) {
      res += str;
    }
    num >>= 1;
    str += str;
  }
  res += str;
  res = res.substr(0, max);
  return res;
}
var trimTrailingLines_1 = trimTrailingLines$1;
function trimTrailingLines$1(value) {
  return String(value).replace(/\n+$/, "");
}
var repeat$2 = repeatString;
var trim$7 = trimTrailingLines_1;
var codeIndented = indentedCode;
var lineFeed$g = "\n";
var tab$d = "	";
var space$g = " ";
var tabSize$4 = 4;
var codeIndent = repeat$2(space$g, tabSize$4);
function indentedCode(eat, value, silent) {
  var index2 = -1;
  var length = value.length;
  var subvalue = "";
  var content = "";
  var subvalueQueue = "";
  var contentQueue = "";
  var character;
  var blankQueue;
  var indent;
  while (++index2 < length) {
    character = value.charAt(index2);
    if (indent) {
      indent = false;
      subvalue += subvalueQueue;
      content += contentQueue;
      subvalueQueue = "";
      contentQueue = "";
      if (character === lineFeed$g) {
        subvalueQueue = character;
        contentQueue = character;
      } else {
        subvalue += character;
        content += character;
        while (++index2 < length) {
          character = value.charAt(index2);
          if (!character || character === lineFeed$g) {
            contentQueue = character;
            subvalueQueue = character;
            break;
          }
          subvalue += character;
          content += character;
        }
      }
    } else if (character === space$g && value.charAt(index2 + 1) === character && value.charAt(index2 + 2) === character && value.charAt(index2 + 3) === character) {
      subvalueQueue += codeIndent;
      index2 += 3;
      indent = true;
    } else if (character === tab$d) {
      subvalueQueue += character;
      indent = true;
    } else {
      blankQueue = "";
      while (character === tab$d || character === space$g) {
        blankQueue += character;
        character = value.charAt(++index2);
      }
      if (character !== lineFeed$g) {
        break;
      }
      subvalueQueue += blankQueue + character;
      contentQueue += character;
    }
  }
  if (content) {
    if (silent) {
      return true;
    }
    return eat(subvalue)({
      type: "code",
      lang: null,
      meta: null,
      value: trim$7(content)
    });
  }
}
var codeFenced = fencedCode;
var lineFeed$f = "\n";
var tab$c = "	";
var space$f = " ";
var tilde$1 = "~";
var graveAccent$2 = "`";
var minFenceCount = 3;
var tabSize$3 = 4;
function fencedCode(eat, value, silent) {
  var self = this;
  var gfm2 = self.options.gfm;
  var length = value.length + 1;
  var index2 = 0;
  var subvalue = "";
  var fenceCount;
  var marker;
  var character;
  var flag;
  var lang;
  var meta;
  var queue;
  var content;
  var exdentedContent;
  var closing;
  var exdentedClosing;
  var indent;
  var now;
  if (!gfm2) {
    return;
  }
  while (index2 < length) {
    character = value.charAt(index2);
    if (character !== space$f && character !== tab$c) {
      break;
    }
    subvalue += character;
    index2++;
  }
  indent = index2;
  character = value.charAt(index2);
  if (character !== tilde$1 && character !== graveAccent$2) {
    return;
  }
  index2++;
  marker = character;
  fenceCount = 1;
  subvalue += character;
  while (index2 < length) {
    character = value.charAt(index2);
    if (character !== marker) {
      break;
    }
    subvalue += character;
    fenceCount++;
    index2++;
  }
  if (fenceCount < minFenceCount) {
    return;
  }
  while (index2 < length) {
    character = value.charAt(index2);
    if (character !== space$f && character !== tab$c) {
      break;
    }
    subvalue += character;
    index2++;
  }
  flag = "";
  queue = "";
  while (index2 < length) {
    character = value.charAt(index2);
    if (character === lineFeed$f || marker === graveAccent$2 && character === marker) {
      break;
    }
    if (character === space$f || character === tab$c) {
      queue += character;
    } else {
      flag += queue + character;
      queue = "";
    }
    index2++;
  }
  character = value.charAt(index2);
  if (character && character !== lineFeed$f) {
    return;
  }
  if (silent) {
    return true;
  }
  now = eat.now();
  now.column += subvalue.length;
  now.offset += subvalue.length;
  subvalue += flag;
  flag = self.decode.raw(self.unescape(flag), now);
  if (queue) {
    subvalue += queue;
  }
  queue = "";
  closing = "";
  exdentedClosing = "";
  content = "";
  exdentedContent = "";
  var skip = true;
  while (index2 < length) {
    character = value.charAt(index2);
    content += closing;
    exdentedContent += exdentedClosing;
    closing = "";
    exdentedClosing = "";
    if (character !== lineFeed$f) {
      content += character;
      exdentedClosing += character;
      index2++;
      continue;
    }
    if (skip) {
      subvalue += character;
      skip = false;
    } else {
      closing += character;
      exdentedClosing += character;
    }
    queue = "";
    index2++;
    while (index2 < length) {
      character = value.charAt(index2);
      if (character !== space$f) {
        break;
      }
      queue += character;
      index2++;
    }
    closing += queue;
    exdentedClosing += queue.slice(indent);
    if (queue.length >= tabSize$3) {
      continue;
    }
    queue = "";
    while (index2 < length) {
      character = value.charAt(index2);
      if (character !== marker) {
        break;
      }
      queue += character;
      index2++;
    }
    closing += queue;
    exdentedClosing += queue;
    if (queue.length < fenceCount) {
      continue;
    }
    queue = "";
    while (index2 < length) {
      character = value.charAt(index2);
      if (character !== space$f && character !== tab$c) {
        break;
      }
      closing += character;
      exdentedClosing += character;
      index2++;
    }
    if (!character || character === lineFeed$f) {
      break;
    }
  }
  subvalue += content + closing;
  index2 = -1;
  length = flag.length;
  while (++index2 < length) {
    character = flag.charAt(index2);
    if (character === space$f || character === tab$c) {
      if (!lang) {
        lang = flag.slice(0, index2);
      }
    } else if (lang) {
      meta = flag.slice(index2);
      break;
    }
  }
  return eat(subvalue)({
    type: "code",
    lang: lang || flag || null,
    meta: meta || null,
    value: exdentedContent
  });
}
var trim$6 = { exports: {} };
(function(module, exports) {
  exports = module.exports = trim2;
  function trim2(str) {
    return str.replace(/^\s*|\s*$/g, "");
  }
  exports.left = function(str) {
    return str.replace(/^\s*/, "");
  };
  exports.right = function(str) {
    return str.replace(/\s*$/, "");
  };
})(trim$6, trim$6.exports);
var interrupt_1 = interrupt$3;
function interrupt$3(interruptors, tokenizers, ctx, params) {
  var length = interruptors.length;
  var index2 = -1;
  var interruptor;
  var config;
  while (++index2 < length) {
    interruptor = interruptors[index2];
    config = interruptor[1] || {};
    if (config.pedantic !== void 0 && config.pedantic !== ctx.options.pedantic) {
      continue;
    }
    if (config.commonmark !== void 0 && config.commonmark !== ctx.options.commonmark) {
      continue;
    }
    if (tokenizers[interruptor[0]].apply(ctx, params)) {
      return true;
    }
  }
  return false;
}
var trim$5 = trim$6.exports;
var interrupt$2 = interrupt_1;
var blockquote_1 = blockquote;
var lineFeed$e = "\n";
var tab$b = "	";
var space$e = " ";
var greaterThan$3 = ">";
function blockquote(eat, value, silent) {
  var self = this;
  var offsets = self.offset;
  var tokenizers = self.blockTokenizers;
  var interruptors = self.interruptBlockquote;
  var now = eat.now();
  var currentLine = now.line;
  var length = value.length;
  var values = [];
  var contents = [];
  var indents = [];
  var add;
  var index2 = 0;
  var character;
  var rest;
  var nextIndex;
  var content;
  var line;
  var startIndex;
  var prefixed;
  var exit;
  while (index2 < length) {
    character = value.charAt(index2);
    if (character !== space$e && character !== tab$b) {
      break;
    }
    index2++;
  }
  if (value.charAt(index2) !== greaterThan$3) {
    return;
  }
  if (silent) {
    return true;
  }
  index2 = 0;
  while (index2 < length) {
    nextIndex = value.indexOf(lineFeed$e, index2);
    startIndex = index2;
    prefixed = false;
    if (nextIndex === -1) {
      nextIndex = length;
    }
    while (index2 < length) {
      character = value.charAt(index2);
      if (character !== space$e && character !== tab$b) {
        break;
      }
      index2++;
    }
    if (value.charAt(index2) === greaterThan$3) {
      index2++;
      prefixed = true;
      if (value.charAt(index2) === space$e) {
        index2++;
      }
    } else {
      index2 = startIndex;
    }
    content = value.slice(index2, nextIndex);
    if (!prefixed && !trim$5(content)) {
      index2 = startIndex;
      break;
    }
    if (!prefixed) {
      rest = value.slice(index2);
      if (interrupt$2(interruptors, tokenizers, self, [eat, rest, true])) {
        break;
      }
    }
    line = startIndex === index2 ? content : value.slice(startIndex, nextIndex);
    indents.push(index2 - startIndex);
    values.push(line);
    contents.push(content);
    index2 = nextIndex + 1;
  }
  index2 = -1;
  length = indents.length;
  add = eat(values.join(lineFeed$e));
  while (++index2 < length) {
    offsets[currentLine] = (offsets[currentLine] || 0) + indents[index2];
    currentLine++;
  }
  exit = self.enterBlock();
  contents = self.tokenizeBlock(contents.join(lineFeed$e), now);
  exit();
  return add({ type: "blockquote", children: contents });
}
var headingAtx = atxHeading;
var lineFeed$d = "\n";
var tab$a = "	";
var space$d = " ";
var numberSign = "#";
var maxFenceCount = 6;
function atxHeading(eat, value, silent) {
  var self = this;
  var pedantic = self.options.pedantic;
  var length = value.length + 1;
  var index2 = -1;
  var now = eat.now();
  var subvalue = "";
  var content = "";
  var character;
  var queue;
  var depth;
  while (++index2 < length) {
    character = value.charAt(index2);
    if (character !== space$d && character !== tab$a) {
      index2--;
      break;
    }
    subvalue += character;
  }
  depth = 0;
  while (++index2 <= length) {
    character = value.charAt(index2);
    if (character !== numberSign) {
      index2--;
      break;
    }
    subvalue += character;
    depth++;
  }
  if (depth > maxFenceCount) {
    return;
  }
  if (!depth || !pedantic && value.charAt(index2 + 1) === numberSign) {
    return;
  }
  length = value.length + 1;
  queue = "";
  while (++index2 < length) {
    character = value.charAt(index2);
    if (character !== space$d && character !== tab$a) {
      index2--;
      break;
    }
    queue += character;
  }
  if (!pedantic && queue.length === 0 && character && character !== lineFeed$d) {
    return;
  }
  if (silent) {
    return true;
  }
  subvalue += queue;
  queue = "";
  content = "";
  while (++index2 < length) {
    character = value.charAt(index2);
    if (!character || character === lineFeed$d) {
      break;
    }
    if (character !== space$d && character !== tab$a && character !== numberSign) {
      content += queue + character;
      queue = "";
      continue;
    }
    while (character === space$d || character === tab$a) {
      queue += character;
      character = value.charAt(++index2);
    }
    if (!pedantic && content && !queue && character === numberSign) {
      content += character;
      continue;
    }
    while (character === numberSign) {
      queue += character;
      character = value.charAt(++index2);
    }
    while (character === space$d || character === tab$a) {
      queue += character;
      character = value.charAt(++index2);
    }
    index2--;
  }
  now.column += subvalue.length;
  now.offset += subvalue.length;
  subvalue += content + queue;
  return eat(subvalue)({
    type: "heading",
    depth,
    children: self.tokenizeInline(content, now)
  });
}
var thematicBreak_1 = thematicBreak;
var tab$9 = "	";
var lineFeed$c = "\n";
var space$c = " ";
var asterisk$3 = "*";
var dash$3 = "-";
var underscore$3 = "_";
var maxCount = 3;
function thematicBreak(eat, value, silent) {
  var index2 = -1;
  var length = value.length + 1;
  var subvalue = "";
  var character;
  var marker;
  var markerCount;
  var queue;
  while (++index2 < length) {
    character = value.charAt(index2);
    if (character !== tab$9 && character !== space$c) {
      break;
    }
    subvalue += character;
  }
  if (character !== asterisk$3 && character !== dash$3 && character !== underscore$3) {
    return;
  }
  marker = character;
  subvalue += character;
  markerCount = 1;
  queue = "";
  while (++index2 < length) {
    character = value.charAt(index2);
    if (character === marker) {
      markerCount++;
      subvalue += queue + marker;
      queue = "";
    } else if (character === space$c) {
      queue += character;
    } else if (markerCount >= maxCount && (!character || character === lineFeed$c)) {
      subvalue += queue;
      if (silent) {
        return true;
      }
      return eat(subvalue)({ type: "thematicBreak" });
    } else {
      return;
    }
  }
}
var getIndentation = indentation$1;
var tab$8 = "	";
var space$b = " ";
var spaceSize = 1;
var tabSize$2 = 4;
function indentation$1(value) {
  var index2 = 0;
  var indent = 0;
  var character = value.charAt(index2);
  var stops = {};
  var size;
  while (character === tab$8 || character === space$b) {
    size = character === tab$8 ? tabSize$2 : spaceSize;
    indent += size;
    if (size > 1) {
      indent = Math.floor(indent / size) * size;
    }
    stops[indent] = index2;
    character = value.charAt(++index2);
  }
  return { indent, stops };
}
var trim$4 = trim$6.exports;
var repeat$1 = repeatString;
var getIndent$1 = getIndentation;
var removeIndentation = indentation;
var tab$7 = "	";
var lineFeed$b = "\n";
var space$a = " ";
var exclamationMark$3 = "!";
function indentation(value, maximum) {
  var values = value.split(lineFeed$b);
  var position2 = values.length + 1;
  var minIndent = Infinity;
  var matrix = [];
  var index2;
  var indentation2;
  var stops;
  var padding;
  values.unshift(repeat$1(space$a, maximum) + exclamationMark$3);
  while (position2--) {
    indentation2 = getIndent$1(values[position2]);
    matrix[position2] = indentation2.stops;
    if (trim$4(values[position2]).length === 0) {
      continue;
    }
    if (indentation2.indent) {
      if (indentation2.indent > 0 && indentation2.indent < minIndent) {
        minIndent = indentation2.indent;
      }
    } else {
      minIndent = Infinity;
      break;
    }
  }
  if (minIndent !== Infinity) {
    position2 = values.length;
    while (position2--) {
      stops = matrix[position2];
      index2 = minIndent;
      while (index2 && !(index2 in stops)) {
        index2--;
      }
      if (trim$4(values[position2]).length !== 0 && minIndent && index2 !== minIndent) {
        padding = tab$7;
      } else {
        padding = "";
      }
      values[position2] = padding + values[position2].slice(index2 in stops ? stops[index2] + 1 : 0);
    }
  }
  values.shift();
  return values.join(lineFeed$b);
}
var trim$3 = trim$6.exports;
var repeat = repeatString;
var decimal$1 = isDecimal;
var getIndent = getIndentation;
var removeIndent = removeIndentation;
var interrupt$1 = interrupt_1;
var list_1 = list;
var asterisk$2 = "*";
var underscore$2 = "_";
var plusSign = "+";
var dash$2 = "-";
var dot$1 = ".";
var space$9 = " ";
var lineFeed$a = "\n";
var tab$6 = "	";
var rightParenthesis$3 = ")";
var lowercaseX = "x";
var tabSize$1 = 4;
var looseListItemExpression = /\n\n(?!\s*$)/;
var taskItemExpression = /^\[([ \t]|x|X)][ \t]/;
var bulletExpression = /^([ \t]*)([*+-]|\d+[.)])( {1,4}(?! )| |\t|$|(?=\n))([^\n]*)/;
var pedanticBulletExpression = /^([ \t]*)([*+-]|\d+[.)])([ \t]+)/;
var initialIndentExpression = /^( {1,4}|\t)?/gm;
function list(eat, value, silent) {
  var self = this;
  var commonmark2 = self.options.commonmark;
  var pedantic = self.options.pedantic;
  var tokenizers = self.blockTokenizers;
  var interuptors = self.interruptList;
  var index2 = 0;
  var length = value.length;
  var start = null;
  var size = 0;
  var queue;
  var ordered;
  var character;
  var marker;
  var nextIndex;
  var startIndex;
  var prefixed;
  var currentMarker;
  var content;
  var line;
  var prevEmpty;
  var empty2;
  var items;
  var allLines;
  var emptyLines;
  var item;
  var enterTop;
  var exitBlockquote;
  var spread = false;
  var node;
  var now;
  var end;
  var indented;
  while (index2 < length) {
    character = value.charAt(index2);
    if (character === tab$6) {
      size += tabSize$1 - size % tabSize$1;
    } else if (character === space$9) {
      size++;
    } else {
      break;
    }
    index2++;
  }
  if (size >= tabSize$1) {
    return;
  }
  character = value.charAt(index2);
  if (character === asterisk$2 || character === plusSign || character === dash$2) {
    marker = character;
    ordered = false;
  } else {
    ordered = true;
    queue = "";
    while (index2 < length) {
      character = value.charAt(index2);
      if (!decimal$1(character)) {
        break;
      }
      queue += character;
      index2++;
    }
    character = value.charAt(index2);
    if (!queue || !(character === dot$1 || commonmark2 && character === rightParenthesis$3)) {
      return;
    }
    start = parseInt(queue, 10);
    marker = character;
  }
  character = value.charAt(++index2);
  if (character !== space$9 && character !== tab$6 && (pedantic || character !== lineFeed$a && character !== "")) {
    return;
  }
  if (silent) {
    return true;
  }
  index2 = 0;
  items = [];
  allLines = [];
  emptyLines = [];
  while (index2 < length) {
    nextIndex = value.indexOf(lineFeed$a, index2);
    startIndex = index2;
    prefixed = false;
    indented = false;
    if (nextIndex === -1) {
      nextIndex = length;
    }
    end = index2 + tabSize$1;
    size = 0;
    while (index2 < length) {
      character = value.charAt(index2);
      if (character === tab$6) {
        size += tabSize$1 - size % tabSize$1;
      } else if (character === space$9) {
        size++;
      } else {
        break;
      }
      index2++;
    }
    if (size >= tabSize$1) {
      indented = true;
    }
    if (item && size >= item.indent) {
      indented = true;
    }
    character = value.charAt(index2);
    currentMarker = null;
    if (!indented) {
      if (character === asterisk$2 || character === plusSign || character === dash$2) {
        currentMarker = character;
        index2++;
        size++;
      } else {
        queue = "";
        while (index2 < length) {
          character = value.charAt(index2);
          if (!decimal$1(character)) {
            break;
          }
          queue += character;
          index2++;
        }
        character = value.charAt(index2);
        index2++;
        if (queue && (character === dot$1 || commonmark2 && character === rightParenthesis$3)) {
          currentMarker = character;
          size += queue.length + 1;
        }
      }
      if (currentMarker) {
        character = value.charAt(index2);
        if (character === tab$6) {
          size += tabSize$1 - size % tabSize$1;
          index2++;
        } else if (character === space$9) {
          end = index2 + tabSize$1;
          while (index2 < end) {
            if (value.charAt(index2) !== space$9) {
              break;
            }
            index2++;
            size++;
          }
          if (index2 === end && value.charAt(index2) === space$9) {
            index2 -= tabSize$1 - 1;
            size -= tabSize$1 - 1;
          }
        } else if (character !== lineFeed$a && character !== "") {
          currentMarker = null;
        }
      }
    }
    if (currentMarker) {
      if (!pedantic && marker !== currentMarker) {
        break;
      }
      prefixed = true;
    } else {
      if (!commonmark2 && !indented && value.charAt(startIndex) === space$9) {
        indented = true;
      } else if (commonmark2 && item) {
        indented = size >= item.indent || size > tabSize$1;
      }
      prefixed = false;
      index2 = startIndex;
    }
    line = value.slice(startIndex, nextIndex);
    content = startIndex === index2 ? line : value.slice(index2, nextIndex);
    if (currentMarker === asterisk$2 || currentMarker === underscore$2 || currentMarker === dash$2) {
      if (tokenizers.thematicBreak.call(self, eat, line, true)) {
        break;
      }
    }
    prevEmpty = empty2;
    empty2 = !prefixed && !trim$3(content).length;
    if (indented && item) {
      item.value = item.value.concat(emptyLines, line);
      allLines = allLines.concat(emptyLines, line);
      emptyLines = [];
    } else if (prefixed) {
      if (emptyLines.length !== 0) {
        spread = true;
        item.value.push("");
        item.trail = emptyLines.concat();
      }
      item = {
        value: [line],
        indent: size,
        trail: []
      };
      items.push(item);
      allLines = allLines.concat(emptyLines, line);
      emptyLines = [];
    } else if (empty2) {
      if (prevEmpty && !commonmark2) {
        break;
      }
      emptyLines.push(line);
    } else {
      if (prevEmpty) {
        break;
      }
      if (interrupt$1(interuptors, tokenizers, self, [eat, line, true])) {
        break;
      }
      item.value = item.value.concat(emptyLines, line);
      allLines = allLines.concat(emptyLines, line);
      emptyLines = [];
    }
    index2 = nextIndex + 1;
  }
  node = eat(allLines.join(lineFeed$a)).reset({
    type: "list",
    ordered,
    start,
    spread,
    children: []
  });
  enterTop = self.enterList();
  exitBlockquote = self.enterBlock();
  index2 = -1;
  length = items.length;
  while (++index2 < length) {
    item = items[index2].value.join(lineFeed$a);
    now = eat.now();
    eat(item)(listItem(self, item, now), node);
    item = items[index2].trail.join(lineFeed$a);
    if (index2 !== length - 1) {
      item += lineFeed$a;
    }
    eat(item);
  }
  enterTop();
  exitBlockquote();
  return node;
}
function listItem(ctx, value, position2) {
  var offsets = ctx.offset;
  var fn = ctx.options.pedantic ? pedanticListItem : normalListItem;
  var checked = null;
  var task;
  var indent;
  value = fn.apply(null, arguments);
  if (ctx.options.gfm) {
    task = value.match(taskItemExpression);
    if (task) {
      indent = task[0].length;
      checked = task[1].toLowerCase() === lowercaseX;
      offsets[position2.line] += indent;
      value = value.slice(indent);
    }
  }
  return {
    type: "listItem",
    spread: looseListItemExpression.test(value),
    checked,
    children: ctx.tokenizeBlock(value, position2)
  };
}
function pedanticListItem(ctx, value, position2) {
  var offsets = ctx.offset;
  var line = position2.line;
  value = value.replace(pedanticBulletExpression, replacer);
  line = position2.line;
  return value.replace(initialIndentExpression, replacer);
  function replacer($0) {
    offsets[line] = (offsets[line] || 0) + $0.length;
    line++;
    return "";
  }
}
function normalListItem(ctx, value, position2) {
  var offsets = ctx.offset;
  var line = position2.line;
  var max;
  var bullet;
  var rest;
  var lines;
  var trimmedLines;
  var index2;
  var length;
  value = value.replace(bulletExpression, replacer);
  lines = value.split(lineFeed$a);
  trimmedLines = removeIndent(value, getIndent(max).indent).split(lineFeed$a);
  trimmedLines[0] = rest;
  offsets[line] = (offsets[line] || 0) + bullet.length;
  line++;
  index2 = 0;
  length = lines.length;
  while (++index2 < length) {
    offsets[line] = (offsets[line] || 0) + lines[index2].length - trimmedLines[index2].length;
    line++;
  }
  return trimmedLines.join(lineFeed$a);
  function replacer($0, $1, $2, $3, $4) {
    bullet = $1 + $2 + $3;
    rest = $4;
    if (Number($2) < 10 && bullet.length % 2 === 1) {
      $2 = space$9 + $2;
    }
    max = $1 + repeat(space$9, $2.length) + $3;
    return max + rest;
  }
}
var headingSetext = setextHeading;
var lineFeed$9 = "\n";
var tab$5 = "	";
var space$8 = " ";
var equalsTo = "=";
var dash$1 = "-";
var maxIndent = 3;
var equalsToDepth = 1;
var dashDepth = 2;
function setextHeading(eat, value, silent) {
  var self = this;
  var now = eat.now();
  var length = value.length;
  var index2 = -1;
  var subvalue = "";
  var content;
  var queue;
  var character;
  var marker;
  var depth;
  while (++index2 < length) {
    character = value.charAt(index2);
    if (character !== space$8 || index2 >= maxIndent) {
      index2--;
      break;
    }
    subvalue += character;
  }
  content = "";
  queue = "";
  while (++index2 < length) {
    character = value.charAt(index2);
    if (character === lineFeed$9) {
      index2--;
      break;
    }
    if (character === space$8 || character === tab$5) {
      queue += character;
    } else {
      content += queue + character;
      queue = "";
    }
  }
  now.column += subvalue.length;
  now.offset += subvalue.length;
  subvalue += content + queue;
  character = value.charAt(++index2);
  marker = value.charAt(++index2);
  if (character !== lineFeed$9 || marker !== equalsTo && marker !== dash$1) {
    return;
  }
  subvalue += character;
  queue = marker;
  depth = marker === equalsTo ? equalsToDepth : dashDepth;
  while (++index2 < length) {
    character = value.charAt(index2);
    if (character !== marker) {
      if (character !== lineFeed$9) {
        return;
      }
      index2--;
      break;
    }
    queue += character;
  }
  if (silent) {
    return true;
  }
  return eat(subvalue + queue)({
    type: "heading",
    depth,
    children: self.tokenizeInline(content, now)
  });
}
var html = {};
var attributeName = "[a-zA-Z_:][a-zA-Z0-9:._-]*";
var unquoted = "[^\"'=<>`\\u0000-\\u0020]+";
var singleQuoted = "'[^']*'";
var doubleQuoted = '"[^"]*"';
var attributeValue = "(?:" + unquoted + "|" + singleQuoted + "|" + doubleQuoted + ")";
var attribute = "(?:\\s+" + attributeName + "(?:\\s*=\\s*" + attributeValue + ")?)";
var openTag = "<[A-Za-z][A-Za-z0-9\\-]*" + attribute + "*\\s*\\/?>";
var closeTag = "<\\/[A-Za-z][A-Za-z0-9\\-]*\\s*>";
var comment = "<!---->|<!--(?:-?[^>-])(?:-?[^-])*-->";
var processing = "<[?].*?[?]>";
var declaration = "<![A-Za-z]+\\s+[^>]*>";
var cdata = "<!\\[CDATA\\[[\\s\\S]*?\\]\\]>";
html.openCloseTag = new RegExp("^(?:" + openTag + "|" + closeTag + ")");
html.tag = new RegExp(
  "^(?:" + openTag + "|" + closeTag + "|" + comment + "|" + processing + "|" + declaration + "|" + cdata + ")"
);
var openCloseTag = html.openCloseTag;
var htmlBlock = blockHtml;
var tab$4 = "	";
var space$7 = " ";
var lineFeed$8 = "\n";
var lessThan$5 = "<";
var rawOpenExpression = /^<(script|pre|style)(?=(\s|>|$))/i;
var rawCloseExpression = /<\/(script|pre|style)>/i;
var commentOpenExpression = /^<!--/;
var commentCloseExpression = /-->/;
var instructionOpenExpression = /^<\?/;
var instructionCloseExpression = /\?>/;
var directiveOpenExpression = /^<![A-Za-z]/;
var directiveCloseExpression = />/;
var cdataOpenExpression = /^<!\[CDATA\[/;
var cdataCloseExpression = /\]\]>/;
var elementCloseExpression = /^$/;
var otherElementOpenExpression = new RegExp(openCloseTag.source + "\\s*$");
function blockHtml(eat, value, silent) {
  var self = this;
  var blocks = self.options.blocks.join("|");
  var elementOpenExpression = new RegExp(
    "^</?(" + blocks + ")(?=(\\s|/?>|$))",
    "i"
  );
  var length = value.length;
  var index2 = 0;
  var next;
  var line;
  var offset;
  var character;
  var count;
  var sequence;
  var subvalue;
  var sequences = [
    [rawOpenExpression, rawCloseExpression, true],
    [commentOpenExpression, commentCloseExpression, true],
    [instructionOpenExpression, instructionCloseExpression, true],
    [directiveOpenExpression, directiveCloseExpression, true],
    [cdataOpenExpression, cdataCloseExpression, true],
    [elementOpenExpression, elementCloseExpression, true],
    [otherElementOpenExpression, elementCloseExpression, false]
  ];
  while (index2 < length) {
    character = value.charAt(index2);
    if (character !== tab$4 && character !== space$7) {
      break;
    }
    index2++;
  }
  if (value.charAt(index2) !== lessThan$5) {
    return;
  }
  next = value.indexOf(lineFeed$8, index2 + 1);
  next = next === -1 ? length : next;
  line = value.slice(index2, next);
  offset = -1;
  count = sequences.length;
  while (++offset < count) {
    if (sequences[offset][0].test(line)) {
      sequence = sequences[offset];
      break;
    }
  }
  if (!sequence) {
    return;
  }
  if (silent) {
    return sequence[2];
  }
  index2 = next;
  if (!sequence[1].test(line)) {
    while (index2 < length) {
      next = value.indexOf(lineFeed$8, index2 + 1);
      next = next === -1 ? length : next;
      line = value.slice(index2 + 1, next);
      if (sequence[1].test(line)) {
        if (line) {
          index2 = next;
        }
        break;
      }
      index2 = next;
    }
  }
  subvalue = value.slice(0, index2);
  return eat(subvalue)({ type: "html", value: subvalue });
}
var collapseWhiteSpace$1 = collapse;
function collapse(value) {
  return String(value).replace(/\s+/g, " ");
}
var collapseWhiteSpace = collapseWhiteSpace$1;
var normalize_1 = normalize$3;
function normalize$3(value) {
  return collapseWhiteSpace(value).toLowerCase();
}
var whitespace$9 = isWhitespaceCharacter;
var normalize$2 = normalize_1;
var footnoteDefinition_1 = footnoteDefinition;
footnoteDefinition.notInList = true;
footnoteDefinition.notInBlock = true;
var backslash$7 = "\\";
var lineFeed$7 = "\n";
var tab$3 = "	";
var space$6 = " ";
var leftSquareBracket$4 = "[";
var rightSquareBracket$4 = "]";
var caret$1 = "^";
var colon$3 = ":";
var EXPRESSION_INITIAL_TAB = /^( {4}|\t)?/gm;
function footnoteDefinition(eat, value, silent) {
  var self = this;
  var offsets = self.offset;
  var index2;
  var length;
  var subvalue;
  var now;
  var currentLine;
  var content;
  var queue;
  var subqueue;
  var character;
  var identifier;
  var add;
  var exit;
  if (!self.options.footnotes) {
    return;
  }
  index2 = 0;
  length = value.length;
  subvalue = "";
  now = eat.now();
  currentLine = now.line;
  while (index2 < length) {
    character = value.charAt(index2);
    if (!whitespace$9(character)) {
      break;
    }
    subvalue += character;
    index2++;
  }
  if (value.charAt(index2) !== leftSquareBracket$4 || value.charAt(index2 + 1) !== caret$1) {
    return;
  }
  subvalue += leftSquareBracket$4 + caret$1;
  index2 = subvalue.length;
  queue = "";
  while (index2 < length) {
    character = value.charAt(index2);
    if (character === rightSquareBracket$4) {
      break;
    } else if (character === backslash$7) {
      queue += character;
      index2++;
      character = value.charAt(index2);
    }
    queue += character;
    index2++;
  }
  if (!queue || value.charAt(index2) !== rightSquareBracket$4 || value.charAt(index2 + 1) !== colon$3) {
    return;
  }
  if (silent) {
    return true;
  }
  identifier = queue;
  subvalue += queue + rightSquareBracket$4 + colon$3;
  index2 = subvalue.length;
  while (index2 < length) {
    character = value.charAt(index2);
    if (character !== tab$3 && character !== space$6) {
      break;
    }
    subvalue += character;
    index2++;
  }
  now.column += subvalue.length;
  now.offset += subvalue.length;
  queue = "";
  content = "";
  subqueue = "";
  while (index2 < length) {
    character = value.charAt(index2);
    if (character === lineFeed$7) {
      subqueue = character;
      index2++;
      while (index2 < length) {
        character = value.charAt(index2);
        if (character !== lineFeed$7) {
          break;
        }
        subqueue += character;
        index2++;
      }
      queue += subqueue;
      subqueue = "";
      while (index2 < length) {
        character = value.charAt(index2);
        if (character !== space$6) {
          break;
        }
        subqueue += character;
        index2++;
      }
      if (subqueue.length === 0) {
        break;
      }
      queue += subqueue;
    }
    if (queue) {
      content += queue;
      queue = "";
    }
    content += character;
    index2++;
  }
  subvalue += content;
  content = content.replace(EXPRESSION_INITIAL_TAB, function(line) {
    offsets[currentLine] = (offsets[currentLine] || 0) + line.length;
    currentLine++;
    return "";
  });
  add = eat(subvalue);
  exit = self.enterBlock();
  content = self.tokenizeBlock(content, now);
  exit();
  return add({
    type: "footnoteDefinition",
    identifier: normalize$2(identifier),
    label: identifier,
    children: content
  });
}
var whitespace$8 = isWhitespaceCharacter;
var normalize$1 = normalize_1;
var definition_1 = definition;
var quotationMark$2 = '"';
var apostrophe$2 = "'";
var backslash$6 = "\\";
var lineFeed$6 = "\n";
var tab$2 = "	";
var space$5 = " ";
var leftSquareBracket$3 = "[";
var rightSquareBracket$3 = "]";
var leftParenthesis$2 = "(";
var rightParenthesis$2 = ")";
var colon$2 = ":";
var lessThan$4 = "<";
var greaterThan$2 = ">";
function definition(eat, value, silent) {
  var self = this;
  var commonmark2 = self.options.commonmark;
  var index2 = 0;
  var length = value.length;
  var subvalue = "";
  var beforeURL;
  var beforeTitle;
  var queue;
  var character;
  var test;
  var identifier;
  var url2;
  var title;
  while (index2 < length) {
    character = value.charAt(index2);
    if (character !== space$5 && character !== tab$2) {
      break;
    }
    subvalue += character;
    index2++;
  }
  character = value.charAt(index2);
  if (character !== leftSquareBracket$3) {
    return;
  }
  index2++;
  subvalue += character;
  queue = "";
  while (index2 < length) {
    character = value.charAt(index2);
    if (character === rightSquareBracket$3) {
      break;
    } else if (character === backslash$6) {
      queue += character;
      index2++;
      character = value.charAt(index2);
    }
    queue += character;
    index2++;
  }
  if (!queue || value.charAt(index2) !== rightSquareBracket$3 || value.charAt(index2 + 1) !== colon$2) {
    return;
  }
  identifier = queue;
  subvalue += queue + rightSquareBracket$3 + colon$2;
  index2 = subvalue.length;
  queue = "";
  while (index2 < length) {
    character = value.charAt(index2);
    if (character !== tab$2 && character !== space$5 && character !== lineFeed$6) {
      break;
    }
    subvalue += character;
    index2++;
  }
  character = value.charAt(index2);
  queue = "";
  beforeURL = subvalue;
  if (character === lessThan$4) {
    index2++;
    while (index2 < length) {
      character = value.charAt(index2);
      if (!isEnclosedURLCharacter(character)) {
        break;
      }
      queue += character;
      index2++;
    }
    character = value.charAt(index2);
    if (character === isEnclosedURLCharacter.delimiter) {
      subvalue += lessThan$4 + queue + character;
      index2++;
    } else {
      if (commonmark2) {
        return;
      }
      index2 -= queue.length + 1;
      queue = "";
    }
  }
  if (!queue) {
    while (index2 < length) {
      character = value.charAt(index2);
      if (!isUnclosedURLCharacter(character)) {
        break;
      }
      queue += character;
      index2++;
    }
    subvalue += queue;
  }
  if (!queue) {
    return;
  }
  url2 = queue;
  queue = "";
  while (index2 < length) {
    character = value.charAt(index2);
    if (character !== tab$2 && character !== space$5 && character !== lineFeed$6) {
      break;
    }
    queue += character;
    index2++;
  }
  character = value.charAt(index2);
  test = null;
  if (character === quotationMark$2) {
    test = quotationMark$2;
  } else if (character === apostrophe$2) {
    test = apostrophe$2;
  } else if (character === leftParenthesis$2) {
    test = rightParenthesis$2;
  }
  if (!test) {
    queue = "";
    index2 = subvalue.length;
  } else if (queue) {
    subvalue += queue + character;
    index2 = subvalue.length;
    queue = "";
    while (index2 < length) {
      character = value.charAt(index2);
      if (character === test) {
        break;
      }
      if (character === lineFeed$6) {
        index2++;
        character = value.charAt(index2);
        if (character === lineFeed$6 || character === test) {
          return;
        }
        queue += lineFeed$6;
      }
      queue += character;
      index2++;
    }
    character = value.charAt(index2);
    if (character !== test) {
      return;
    }
    beforeTitle = subvalue;
    subvalue += queue + character;
    index2++;
    title = queue;
    queue = "";
  } else {
    return;
  }
  while (index2 < length) {
    character = value.charAt(index2);
    if (character !== tab$2 && character !== space$5) {
      break;
    }
    subvalue += character;
    index2++;
  }
  character = value.charAt(index2);
  if (!character || character === lineFeed$6) {
    if (silent) {
      return true;
    }
    beforeURL = eat(beforeURL).test().end;
    url2 = self.decode.raw(self.unescape(url2), beforeURL, { nonTerminated: false });
    if (title) {
      beforeTitle = eat(beforeTitle).test().end;
      title = self.decode.raw(self.unescape(title), beforeTitle);
    }
    return eat(subvalue)({
      type: "definition",
      identifier: normalize$1(identifier),
      label: identifier,
      title: title || null,
      url: url2
    });
  }
}
function isEnclosedURLCharacter(character) {
  return character !== greaterThan$2 && character !== leftSquareBracket$3 && character !== rightSquareBracket$3;
}
isEnclosedURLCharacter.delimiter = greaterThan$2;
function isUnclosedURLCharacter(character) {
  return character !== leftSquareBracket$3 && character !== rightSquareBracket$3 && !whitespace$8(character);
}
var whitespace$7 = isWhitespaceCharacter;
var table_1 = table;
var tab$1 = "	";
var lineFeed$5 = "\n";
var space$4 = " ";
var dash = "-";
var colon$1 = ":";
var backslash$5 = "\\";
var verticalBar = "|";
var minColumns = 1;
var minRows = 2;
var left = "left";
var center = "center";
var right = "right";
function table(eat, value, silent) {
  var self = this;
  var index2;
  var alignments;
  var alignment;
  var subvalue;
  var row;
  var length;
  var lines;
  var queue;
  var character;
  var hasDash;
  var align;
  var cell;
  var preamble;
  var now;
  var position2;
  var lineCount;
  var line;
  var rows;
  var table2;
  var lineIndex;
  var pipeIndex;
  var first;
  if (!self.options.gfm) {
    return;
  }
  index2 = 0;
  lineCount = 0;
  length = value.length + 1;
  lines = [];
  while (index2 < length) {
    lineIndex = value.indexOf(lineFeed$5, index2);
    pipeIndex = value.indexOf(verticalBar, index2 + 1);
    if (lineIndex === -1) {
      lineIndex = value.length;
    }
    if (pipeIndex === -1 || pipeIndex > lineIndex) {
      if (lineCount < minRows) {
        return;
      }
      break;
    }
    lines.push(value.slice(index2, lineIndex));
    lineCount++;
    index2 = lineIndex + 1;
  }
  subvalue = lines.join(lineFeed$5);
  alignments = lines.splice(1, 1)[0] || [];
  index2 = 0;
  length = alignments.length;
  lineCount--;
  alignment = false;
  align = [];
  while (index2 < length) {
    character = alignments.charAt(index2);
    if (character === verticalBar) {
      hasDash = null;
      if (alignment === false) {
        if (first === false) {
          return;
        }
      } else {
        align.push(alignment);
        alignment = false;
      }
      first = false;
    } else if (character === dash) {
      hasDash = true;
      alignment = alignment || null;
    } else if (character === colon$1) {
      if (alignment === left) {
        alignment = center;
      } else if (hasDash && alignment === null) {
        alignment = right;
      } else {
        alignment = left;
      }
    } else if (!whitespace$7(character)) {
      return;
    }
    index2++;
  }
  if (alignment !== false) {
    align.push(alignment);
  }
  if (align.length < minColumns) {
    return;
  }
  if (silent) {
    return true;
  }
  position2 = -1;
  rows = [];
  table2 = eat(subvalue).reset({ type: "table", align, children: rows });
  while (++position2 < lineCount) {
    line = lines[position2];
    row = { type: "tableRow", children: [] };
    if (position2) {
      eat(lineFeed$5);
    }
    eat(line).reset(row, table2);
    length = line.length + 1;
    index2 = 0;
    queue = "";
    cell = "";
    preamble = true;
    while (index2 < length) {
      character = line.charAt(index2);
      if (character === tab$1 || character === space$4) {
        if (cell) {
          queue += character;
        } else {
          eat(character);
        }
        index2++;
        continue;
      }
      if (character === "" || character === verticalBar) {
        if (preamble) {
          eat(character);
        } else {
          if ((cell || character) && !preamble) {
            subvalue = cell;
            if (queue.length > 1) {
              if (character) {
                subvalue += queue.slice(0, queue.length - 1);
                queue = queue.charAt(queue.length - 1);
              } else {
                subvalue += queue;
                queue = "";
              }
            }
            now = eat.now();
            eat(subvalue)(
              { type: "tableCell", children: self.tokenizeInline(cell, now) },
              row
            );
          }
          eat(queue + character);
          queue = "";
          cell = "";
        }
      } else {
        if (queue) {
          cell += queue;
          queue = "";
        }
        cell += character;
        if (character === backslash$5 && index2 !== length - 2) {
          cell += line.charAt(index2 + 1);
          index2++;
        }
      }
      preamble = false;
      index2++;
    }
    if (!position2) {
      eat(lineFeed$5 + alignments);
    }
  }
  return table2;
}
var trim$2 = trim$6.exports;
var decimal = isDecimal;
var trimTrailingLines = trimTrailingLines_1;
var interrupt = interrupt_1;
var paragraph_1 = paragraph;
var tab = "	";
var lineFeed$4 = "\n";
var space$3 = " ";
var tabSize = 4;
function paragraph(eat, value, silent) {
  var self = this;
  var settings = self.options;
  var commonmark2 = settings.commonmark;
  var gfm2 = settings.gfm;
  var tokenizers = self.blockTokenizers;
  var interruptors = self.interruptParagraph;
  var index2 = value.indexOf(lineFeed$4);
  var length = value.length;
  var position2;
  var subvalue;
  var character;
  var size;
  var now;
  while (index2 < length) {
    if (index2 === -1) {
      index2 = length;
      break;
    }
    if (value.charAt(index2 + 1) === lineFeed$4) {
      break;
    }
    if (commonmark2) {
      size = 0;
      position2 = index2 + 1;
      while (position2 < length) {
        character = value.charAt(position2);
        if (character === tab) {
          size = tabSize;
          break;
        } else if (character === space$3) {
          size++;
        } else {
          break;
        }
        position2++;
      }
      if (size >= tabSize && character !== lineFeed$4) {
        index2 = value.indexOf(lineFeed$4, index2 + 1);
        continue;
      }
    }
    subvalue = value.slice(index2 + 1);
    if (interrupt(interruptors, tokenizers, self, [eat, subvalue, true])) {
      break;
    }
    if (tokenizers.list.call(self, eat, subvalue, true) && (self.inList || commonmark2 || gfm2 && !decimal(trim$2.left(subvalue).charAt(0)))) {
      break;
    }
    position2 = index2;
    index2 = value.indexOf(lineFeed$4, index2 + 1);
    if (index2 !== -1 && trim$2(value.slice(position2, index2)) === "") {
      index2 = position2;
      break;
    }
  }
  subvalue = value.slice(0, index2);
  if (trim$2(subvalue) === "") {
    eat(subvalue);
    return null;
  }
  if (silent) {
    return true;
  }
  now = eat.now();
  subvalue = trimTrailingLines(subvalue);
  return eat(subvalue)({
    type: "paragraph",
    children: self.tokenizeInline(subvalue, now)
  });
}
var _escape$1 = locate$j;
function locate$j(value, fromIndex) {
  return value.indexOf("\\", fromIndex);
}
var locate$i = _escape$1;
var _escape = escape;
escape.locator = locate$i;
var lineFeed$3 = "\n";
var backslash$4 = "\\";
function escape(eat, value, silent) {
  var self = this;
  var character;
  var node;
  if (value.charAt(0) === backslash$4) {
    character = value.charAt(1);
    if (self.escape.indexOf(character) !== -1) {
      if (silent) {
        return true;
      }
      if (character === lineFeed$3) {
        node = { type: "break" };
      } else {
        node = { type: "text", value: character };
      }
      return eat(backslash$4 + character)(node);
    }
  }
}
var tag$1 = locate$h;
function locate$h(value, fromIndex) {
  return value.indexOf("<", fromIndex);
}
var whitespace$6 = isWhitespaceCharacter;
var decode$2 = parseEntities_1;
var locate$g = tag$1;
var autoLink_1 = autoLink;
autoLink.locator = locate$g;
autoLink.notInLink = true;
var lessThan$3 = "<";
var greaterThan$1 = ">";
var atSign$1 = "@";
var slash$1 = "/";
var mailto$1 = "mailto:";
var mailtoLength = mailto$1.length;
function autoLink(eat, value, silent) {
  var self = this;
  var subvalue = "";
  var length = value.length;
  var index2 = 0;
  var queue = "";
  var hasAtCharacter = false;
  var link2 = "";
  var character;
  var now;
  var content;
  var tokenizers;
  var exit;
  if (value.charAt(0) !== lessThan$3) {
    return;
  }
  index2++;
  subvalue = lessThan$3;
  while (index2 < length) {
    character = value.charAt(index2);
    if (whitespace$6(character) || character === greaterThan$1 || character === atSign$1 || character === ":" && value.charAt(index2 + 1) === slash$1) {
      break;
    }
    queue += character;
    index2++;
  }
  if (!queue) {
    return;
  }
  link2 += queue;
  queue = "";
  character = value.charAt(index2);
  link2 += character;
  index2++;
  if (character === atSign$1) {
    hasAtCharacter = true;
  } else {
    if (character !== ":" || value.charAt(index2 + 1) !== slash$1) {
      return;
    }
    link2 += slash$1;
    index2++;
  }
  while (index2 < length) {
    character = value.charAt(index2);
    if (whitespace$6(character) || character === greaterThan$1) {
      break;
    }
    queue += character;
    index2++;
  }
  character = value.charAt(index2);
  if (!queue || character !== greaterThan$1) {
    return;
  }
  if (silent) {
    return true;
  }
  link2 += queue;
  content = link2;
  subvalue += link2 + character;
  now = eat.now();
  now.column++;
  now.offset++;
  if (hasAtCharacter) {
    if (link2.slice(0, mailtoLength).toLowerCase() === mailto$1) {
      content = content.slice(mailtoLength);
      now.column += mailtoLength;
      now.offset += mailtoLength;
    } else {
      link2 = mailto$1 + link2;
    }
  }
  tokenizers = self.inlineTokenizers;
  self.inlineTokenizers = { text: tokenizers.text };
  exit = self.enterLink();
  content = self.tokenizeInline(content, now);
  self.inlineTokenizers = tokenizers;
  exit();
  return eat(subvalue)({
    type: "link",
    title: null,
    url: decode$2(link2, { nonTerminated: false }),
    children: content
  });
}
var url$1 = locate$f;
var protocols$1 = ["https://", "http://", "mailto:"];
function locate$f(value, fromIndex) {
  var length = protocols$1.length;
  var index2 = -1;
  var min = -1;
  var position2;
  if (!this.options.gfm) {
    return -1;
  }
  while (++index2 < length) {
    position2 = value.indexOf(protocols$1[index2], fromIndex);
    if (position2 !== -1 && (position2 < min || min === -1)) {
      min = position2;
    }
  }
  return min;
}
var decode$1 = parseEntities_1;
var whitespace$5 = isWhitespaceCharacter;
var locate$e = url$1;
var url_1 = url;
url.locator = locate$e;
url.notInLink = true;
var quotationMark$1 = '"';
var apostrophe$1 = "'";
var leftParenthesis$1 = "(";
var rightParenthesis$1 = ")";
var comma = ",";
var dot = ".";
var colon = ":";
var semicolon = ";";
var lessThan$2 = "<";
var atSign = "@";
var leftSquareBracket$2 = "[";
var rightSquareBracket$2 = "]";
var http = "http://";
var https = "https://";
var mailto = "mailto:";
var protocols = [http, https, mailto];
var protocolsLength = protocols.length;
function url(eat, value, silent) {
  var self = this;
  var subvalue;
  var content;
  var character;
  var index2;
  var position2;
  var protocol;
  var match;
  var length;
  var queue;
  var parenCount;
  var nextCharacter;
  var tokenizers;
  var exit;
  if (!self.options.gfm) {
    return;
  }
  subvalue = "";
  index2 = -1;
  while (++index2 < protocolsLength) {
    protocol = protocols[index2];
    match = value.slice(0, protocol.length);
    if (match.toLowerCase() === protocol) {
      subvalue = match;
      break;
    }
  }
  if (!subvalue) {
    return;
  }
  index2 = subvalue.length;
  length = value.length;
  queue = "";
  parenCount = 0;
  while (index2 < length) {
    character = value.charAt(index2);
    if (whitespace$5(character) || character === lessThan$2) {
      break;
    }
    if (character === dot || character === comma || character === colon || character === semicolon || character === quotationMark$1 || character === apostrophe$1 || character === rightParenthesis$1 || character === rightSquareBracket$2) {
      nextCharacter = value.charAt(index2 + 1);
      if (!nextCharacter || whitespace$5(nextCharacter)) {
        break;
      }
    }
    if (character === leftParenthesis$1 || character === leftSquareBracket$2) {
      parenCount++;
    }
    if (character === rightParenthesis$1 || character === rightSquareBracket$2) {
      parenCount--;
      if (parenCount < 0) {
        break;
      }
    }
    queue += character;
    index2++;
  }
  if (!queue) {
    return;
  }
  subvalue += queue;
  content = subvalue;
  if (protocol === mailto) {
    position2 = queue.indexOf(atSign);
    if (position2 === -1 || position2 === length - 1) {
      return;
    }
    content = content.slice(mailto.length);
  }
  if (silent) {
    return true;
  }
  exit = self.enterLink();
  tokenizers = self.inlineTokenizers;
  self.inlineTokenizers = { text: tokenizers.text };
  content = self.tokenizeInline(content, eat.now());
  self.inlineTokenizers = tokenizers;
  exit();
  return eat(subvalue)({
    type: "link",
    title: null,
    url: decode$1(subvalue, { nonTerminated: false }),
    children: content
  });
}
var alphabetical = isAlphabetical;
var locate$d = tag$1;
var tag = html.tag;
var htmlInline = inlineHTML;
inlineHTML.locator = locate$d;
var lessThan$1 = "<";
var questionMark = "?";
var exclamationMark$2 = "!";
var slash = "/";
var htmlLinkOpenExpression = /^<a /i;
var htmlLinkCloseExpression = /^<\/a>/i;
function inlineHTML(eat, value, silent) {
  var self = this;
  var length = value.length;
  var character;
  var subvalue;
  if (value.charAt(0) !== lessThan$1 || length < 3) {
    return;
  }
  character = value.charAt(1);
  if (!alphabetical(character) && character !== questionMark && character !== exclamationMark$2 && character !== slash) {
    return;
  }
  subvalue = value.match(tag);
  if (!subvalue) {
    return;
  }
  if (silent) {
    return true;
  }
  subvalue = subvalue[0];
  if (!self.inLink && htmlLinkOpenExpression.test(subvalue)) {
    self.inLink = true;
  } else if (self.inLink && htmlLinkCloseExpression.test(subvalue)) {
    self.inLink = false;
  }
  return eat(subvalue)({ type: "html", value: subvalue });
}
var link$3 = locate$c;
function locate$c(value, fromIndex) {
  var link2 = value.indexOf("[", fromIndex);
  var image2 = value.indexOf("![", fromIndex);
  if (image2 === -1) {
    return link2;
  }
  return link2 < image2 ? link2 : image2;
}
var whitespace$4 = isWhitespaceCharacter;
var locate$b = link$3;
var link_1 = link$2;
link$2.locator = locate$b;
var lineFeed$2 = "\n";
var exclamationMark$1 = "!";
var quotationMark = '"';
var apostrophe = "'";
var leftParenthesis = "(";
var rightParenthesis = ")";
var lessThan = "<";
var greaterThan = ">";
var leftSquareBracket$1 = "[";
var backslash$3 = "\\";
var rightSquareBracket$1 = "]";
var graveAccent$1 = "`";
function link$2(eat, value, silent) {
  var self = this;
  var subvalue = "";
  var index2 = 0;
  var character = value.charAt(0);
  var pedantic = self.options.pedantic;
  var commonmark2 = self.options.commonmark;
  var gfm2 = self.options.gfm;
  var closed;
  var count;
  var opening;
  var beforeURL;
  var beforeTitle;
  var subqueue;
  var hasMarker;
  var isImage;
  var content;
  var marker;
  var length;
  var title;
  var depth;
  var queue;
  var url2;
  var now;
  var exit;
  var node;
  if (character === exclamationMark$1) {
    isImage = true;
    subvalue = character;
    character = value.charAt(++index2);
  }
  if (character !== leftSquareBracket$1) {
    return;
  }
  if (!isImage && self.inLink) {
    return;
  }
  subvalue += character;
  queue = "";
  index2++;
  length = value.length;
  now = eat.now();
  depth = 0;
  now.column += index2;
  now.offset += index2;
  while (index2 < length) {
    character = value.charAt(index2);
    subqueue = character;
    if (character === graveAccent$1) {
      count = 1;
      while (value.charAt(index2 + 1) === graveAccent$1) {
        subqueue += character;
        index2++;
        count++;
      }
      if (!opening) {
        opening = count;
      } else if (count >= opening) {
        opening = 0;
      }
    } else if (character === backslash$3) {
      index2++;
      subqueue += value.charAt(index2);
    } else if ((!opening || gfm2) && character === leftSquareBracket$1) {
      depth++;
    } else if ((!opening || gfm2) && character === rightSquareBracket$1) {
      if (depth) {
        depth--;
      } else {
        if (!pedantic) {
          while (index2 < length) {
            character = value.charAt(index2 + 1);
            if (!whitespace$4(character)) {
              break;
            }
            subqueue += character;
            index2++;
          }
        }
        if (value.charAt(index2 + 1) !== leftParenthesis) {
          return;
        }
        subqueue += leftParenthesis;
        closed = true;
        index2++;
        break;
      }
    }
    queue += subqueue;
    subqueue = "";
    index2++;
  }
  if (!closed) {
    return;
  }
  content = queue;
  subvalue += queue + subqueue;
  index2++;
  while (index2 < length) {
    character = value.charAt(index2);
    if (!whitespace$4(character)) {
      break;
    }
    subvalue += character;
    index2++;
  }
  character = value.charAt(index2);
  queue = "";
  beforeURL = subvalue;
  if (character === lessThan) {
    index2++;
    beforeURL += lessThan;
    while (index2 < length) {
      character = value.charAt(index2);
      if (character === greaterThan) {
        break;
      }
      if (commonmark2 && character === lineFeed$2) {
        return;
      }
      queue += character;
      index2++;
    }
    if (value.charAt(index2) !== greaterThan) {
      return;
    }
    subvalue += lessThan + queue + greaterThan;
    url2 = queue;
    index2++;
  } else {
    character = null;
    subqueue = "";
    while (index2 < length) {
      character = value.charAt(index2);
      if (subqueue && (character === quotationMark || character === apostrophe || commonmark2 && character === leftParenthesis)) {
        break;
      }
      if (whitespace$4(character)) {
        if (!pedantic) {
          break;
        }
        subqueue += character;
      } else {
        if (character === leftParenthesis) {
          depth++;
        } else if (character === rightParenthesis) {
          if (depth === 0) {
            break;
          }
          depth--;
        }
        queue += subqueue;
        subqueue = "";
        if (character === backslash$3) {
          queue += backslash$3;
          character = value.charAt(++index2);
        }
        queue += character;
      }
      index2++;
    }
    subvalue += queue;
    url2 = queue;
    index2 = subvalue.length;
  }
  queue = "";
  while (index2 < length) {
    character = value.charAt(index2);
    if (!whitespace$4(character)) {
      break;
    }
    queue += character;
    index2++;
  }
  character = value.charAt(index2);
  subvalue += queue;
  if (queue && (character === quotationMark || character === apostrophe || commonmark2 && character === leftParenthesis)) {
    index2++;
    subvalue += character;
    queue = "";
    marker = character === leftParenthesis ? rightParenthesis : character;
    beforeTitle = subvalue;
    if (commonmark2) {
      while (index2 < length) {
        character = value.charAt(index2);
        if (character === marker) {
          break;
        }
        if (character === backslash$3) {
          queue += backslash$3;
          character = value.charAt(++index2);
        }
        index2++;
        queue += character;
      }
      character = value.charAt(index2);
      if (character !== marker) {
        return;
      }
      title = queue;
      subvalue += queue + character;
      index2++;
      while (index2 < length) {
        character = value.charAt(index2);
        if (!whitespace$4(character)) {
          break;
        }
        subvalue += character;
        index2++;
      }
    } else {
      subqueue = "";
      while (index2 < length) {
        character = value.charAt(index2);
        if (character === marker) {
          if (hasMarker) {
            queue += marker + subqueue;
            subqueue = "";
          }
          hasMarker = true;
        } else if (!hasMarker) {
          queue += character;
        } else if (character === rightParenthesis) {
          subvalue += queue + marker + subqueue;
          title = queue;
          break;
        } else if (whitespace$4(character)) {
          subqueue += character;
        } else {
          queue += marker + subqueue + character;
          subqueue = "";
          hasMarker = false;
        }
        index2++;
      }
    }
  }
  if (value.charAt(index2) !== rightParenthesis) {
    return;
  }
  if (silent) {
    return true;
  }
  subvalue += rightParenthesis;
  url2 = self.decode.raw(self.unescape(url2), eat(beforeURL).test().end, {
    nonTerminated: false
  });
  if (title) {
    beforeTitle = eat(beforeTitle).test().end;
    title = self.decode.raw(self.unescape(title), beforeTitle);
  }
  node = {
    type: isImage ? "image" : "link",
    title: title || null,
    url: url2
  };
  if (isImage) {
    node.alt = self.decode.raw(self.unescape(content), now) || null;
  } else {
    exit = self.enterLink();
    node.children = self.tokenizeInline(content, now);
    exit();
  }
  return eat(subvalue)(node);
}
var whitespace$3 = isWhitespaceCharacter;
var locate$a = link$3;
var normalize = normalize_1;
var reference_1 = reference;
reference.locator = locate$a;
var link$1 = "link";
var image = "image";
var footnote = "footnote";
var shortcut = "shortcut";
var collapsed = "collapsed";
var full = "full";
var space$2 = " ";
var exclamationMark = "!";
var leftSquareBracket = "[";
var backslash$2 = "\\";
var rightSquareBracket = "]";
var caret = "^";
function reference(eat, value, silent) {
  var self = this;
  var commonmark2 = self.options.commonmark;
  var footnotes = self.options.footnotes;
  var character = value.charAt(0);
  var index2 = 0;
  var length = value.length;
  var subvalue = "";
  var intro = "";
  var type = link$1;
  var referenceType = shortcut;
  var content;
  var identifier;
  var now;
  var node;
  var exit;
  var queue;
  var bracketed;
  var depth;
  if (character === exclamationMark) {
    type = image;
    intro = character;
    character = value.charAt(++index2);
  }
  if (character !== leftSquareBracket) {
    return;
  }
  index2++;
  intro += character;
  queue = "";
  if (footnotes && value.charAt(index2) === caret) {
    if (type === image) {
      return;
    }
    intro += caret;
    index2++;
    type = footnote;
  }
  depth = 0;
  while (index2 < length) {
    character = value.charAt(index2);
    if (character === leftSquareBracket) {
      bracketed = true;
      depth++;
    } else if (character === rightSquareBracket) {
      if (!depth) {
        break;
      }
      depth--;
    }
    if (character === backslash$2) {
      queue += backslash$2;
      character = value.charAt(++index2);
    }
    queue += character;
    index2++;
  }
  subvalue = queue;
  content = queue;
  character = value.charAt(index2);
  if (character !== rightSquareBracket) {
    return;
  }
  index2++;
  subvalue += character;
  queue = "";
  if (!commonmark2) {
    while (index2 < length) {
      character = value.charAt(index2);
      if (!whitespace$3(character)) {
        break;
      }
      queue += character;
      index2++;
    }
  }
  character = value.charAt(index2);
  if (type !== footnote && character === leftSquareBracket && (!footnotes || value.charAt(index2 + 1) !== caret)) {
    identifier = "";
    queue += character;
    index2++;
    while (index2 < length) {
      character = value.charAt(index2);
      if (character === leftSquareBracket || character === rightSquareBracket) {
        break;
      }
      if (character === backslash$2) {
        identifier += backslash$2;
        character = value.charAt(++index2);
      }
      identifier += character;
      index2++;
    }
    character = value.charAt(index2);
    if (character === rightSquareBracket) {
      referenceType = identifier ? full : collapsed;
      queue += identifier + character;
      index2++;
    } else {
      identifier = "";
    }
    subvalue += queue;
    queue = "";
  } else {
    if (!content) {
      return;
    }
    identifier = content;
  }
  if (referenceType !== full && bracketed) {
    return;
  }
  subvalue = intro + subvalue;
  if (type === link$1 && self.inLink) {
    return null;
  }
  if (silent) {
    return true;
  }
  if (type === footnote && content.indexOf(space$2) !== -1) {
    return eat(subvalue)({
      type: footnote,
      children: this.tokenizeInline(content, eat.now())
    });
  }
  now = eat.now();
  now.column += intro.length;
  now.offset += intro.length;
  identifier = referenceType === full ? identifier : content;
  node = {
    type: type + "Reference",
    identifier: normalize(identifier),
    label: identifier
  };
  if (type === link$1 || type === image) {
    node.referenceType = referenceType;
  }
  if (type === link$1) {
    exit = self.enterLink();
    node.children = self.tokenizeInline(content, now);
    exit();
  } else if (type === image) {
    node.alt = self.decode.raw(self.unescape(content), now) || null;
  }
  return eat(subvalue)(node);
}
var strong$1 = locate$9;
function locate$9(value, fromIndex) {
  var asterisk2 = value.indexOf("**", fromIndex);
  var underscore2 = value.indexOf("__", fromIndex);
  if (underscore2 === -1) {
    return asterisk2;
  }
  if (asterisk2 === -1) {
    return underscore2;
  }
  return underscore2 < asterisk2 ? underscore2 : asterisk2;
}
var trim$1 = trim$6.exports;
var whitespace$2 = isWhitespaceCharacter;
var locate$8 = strong$1;
var strong_1 = strong;
strong.locator = locate$8;
var backslash$1 = "\\";
var asterisk$1 = "*";
var underscore$1 = "_";
function strong(eat, value, silent) {
  var self = this;
  var index2 = 0;
  var character = value.charAt(index2);
  var now;
  var pedantic;
  var marker;
  var queue;
  var subvalue;
  var length;
  var prev;
  if (character !== asterisk$1 && character !== underscore$1 || value.charAt(++index2) !== character) {
    return;
  }
  pedantic = self.options.pedantic;
  marker = character;
  subvalue = marker + marker;
  length = value.length;
  index2++;
  queue = "";
  character = "";
  if (pedantic && whitespace$2(value.charAt(index2))) {
    return;
  }
  while (index2 < length) {
    prev = character;
    character = value.charAt(index2);
    if (character === marker && value.charAt(index2 + 1) === marker && (!pedantic || !whitespace$2(prev))) {
      character = value.charAt(index2 + 2);
      if (character !== marker) {
        if (!trim$1(queue)) {
          return;
        }
        if (silent) {
          return true;
        }
        now = eat.now();
        now.column += 2;
        now.offset += 2;
        return eat(subvalue + queue + subvalue)({
          type: "strong",
          children: self.tokenizeInline(queue, now)
        });
      }
    }
    if (!pedantic && character === backslash$1) {
      queue += character;
      character = value.charAt(++index2);
    }
    queue += character;
    index2++;
  }
}
var isWordCharacter = wordCharacter;
var fromCode = String.fromCharCode;
var re = /\w/;
function wordCharacter(character) {
  return re.test(
    typeof character === "number" ? fromCode(character) : character.charAt(0)
  );
}
var emphasis$1 = locate$7;
function locate$7(value, fromIndex) {
  var asterisk2 = value.indexOf("*", fromIndex);
  var underscore2 = value.indexOf("_", fromIndex);
  if (underscore2 === -1) {
    return asterisk2;
  }
  if (asterisk2 === -1) {
    return underscore2;
  }
  return underscore2 < asterisk2 ? underscore2 : asterisk2;
}
var trim = trim$6.exports;
var word = isWordCharacter;
var whitespace$1 = isWhitespaceCharacter;
var locate$6 = emphasis$1;
var emphasis_1 = emphasis;
emphasis.locator = locate$6;
var asterisk = "*";
var underscore = "_";
var backslash = "\\";
function emphasis(eat, value, silent) {
  var self = this;
  var index2 = 0;
  var character = value.charAt(index2);
  var now;
  var pedantic;
  var marker;
  var queue;
  var subvalue;
  var length;
  var prev;
  if (character !== asterisk && character !== underscore) {
    return;
  }
  pedantic = self.options.pedantic;
  subvalue = character;
  marker = character;
  length = value.length;
  index2++;
  queue = "";
  character = "";
  if (pedantic && whitespace$1(value.charAt(index2))) {
    return;
  }
  while (index2 < length) {
    prev = character;
    character = value.charAt(index2);
    if (character === marker && (!pedantic || !whitespace$1(prev))) {
      character = value.charAt(++index2);
      if (character !== marker) {
        if (!trim(queue) || prev === marker) {
          return;
        }
        if (!pedantic && marker === underscore && word(character)) {
          queue += marker;
          continue;
        }
        if (silent) {
          return true;
        }
        now = eat.now();
        now.column++;
        now.offset++;
        return eat(subvalue + queue + marker)({
          type: "emphasis",
          children: self.tokenizeInline(queue, now)
        });
      }
      queue += marker;
    }
    if (!pedantic && character === backslash) {
      queue += character;
      character = value.charAt(++index2);
    }
    queue += character;
    index2++;
  }
}
var _delete$1 = locate$5;
function locate$5(value, fromIndex) {
  return value.indexOf("~~", fromIndex);
}
var whitespace = isWhitespaceCharacter;
var locate$4 = _delete$1;
var _delete = strikethrough;
strikethrough.locator = locate$4;
var tilde = "~";
var fence$3 = "~~";
function strikethrough(eat, value, silent) {
  var self = this;
  var character = "";
  var previous = "";
  var preceding = "";
  var subvalue = "";
  var index2;
  var length;
  var now;
  if (!self.options.gfm || value.charAt(0) !== tilde || value.charAt(1) !== tilde || whitespace(value.charAt(2))) {
    return;
  }
  index2 = 1;
  length = value.length;
  now = eat.now();
  now.column += 2;
  now.offset += 2;
  while (++index2 < length) {
    character = value.charAt(index2);
    if (character === tilde && previous === tilde && (!preceding || !whitespace(preceding))) {
      if (silent) {
        return true;
      }
      return eat(fence$3 + subvalue + fence$3)({
        type: "delete",
        children: self.tokenizeInline(subvalue, now)
      });
    }
    subvalue += previous;
    preceding = previous;
    previous = character;
  }
}
var codeInline$1 = locate$3;
function locate$3(value, fromIndex) {
  return value.indexOf("`", fromIndex);
}
var locate$2 = codeInline$1;
var codeInline = inlineCode;
inlineCode.locator = locate$2;
var lineFeed$1 = 10;
var space$1 = 32;
var graveAccent = 96;
function inlineCode(eat, value, silent) {
  var length = value.length;
  var index2 = 0;
  var openingFenceEnd;
  var closingFenceStart;
  var closingFenceEnd;
  var code;
  var next;
  var found;
  while (index2 < length) {
    if (value.charCodeAt(index2) !== graveAccent) {
      break;
    }
    index2++;
  }
  if (index2 === 0 || index2 === length) {
    return;
  }
  openingFenceEnd = index2;
  next = value.charCodeAt(index2);
  while (index2 < length) {
    code = next;
    next = value.charCodeAt(index2 + 1);
    if (code === graveAccent) {
      if (closingFenceStart === void 0) {
        closingFenceStart = index2;
      }
      closingFenceEnd = index2 + 1;
      if (next !== graveAccent && closingFenceEnd - closingFenceStart === openingFenceEnd) {
        found = true;
        break;
      }
    } else if (closingFenceStart !== void 0) {
      closingFenceStart = void 0;
      closingFenceEnd = void 0;
    }
    index2++;
  }
  if (!found) {
    return;
  }
  if (silent) {
    return true;
  }
  index2 = openingFenceEnd;
  length = closingFenceStart;
  code = value.charCodeAt(index2);
  next = value.charCodeAt(length - 1);
  found = false;
  if (length - index2 > 2 && (code === space$1 || code === lineFeed$1) && (next === space$1 || next === lineFeed$1)) {
    index2++;
    length--;
    while (index2 < length) {
      code = value.charCodeAt(index2);
      if (code !== space$1 && code !== lineFeed$1) {
        found = true;
        break;
      }
      index2++;
    }
    if (found === true) {
      openingFenceEnd++;
      closingFenceStart--;
    }
  }
  return eat(value.slice(0, closingFenceEnd))({
    type: "inlineCode",
    value: value.slice(openingFenceEnd, closingFenceStart)
  });
}
var _break$1 = locate$1;
function locate$1(value, fromIndex) {
  var index2 = value.indexOf("\n", fromIndex);
  while (index2 > fromIndex) {
    if (value.charAt(index2 - 1) !== " ") {
      break;
    }
    index2--;
  }
  return index2;
}
var locate = _break$1;
var _break = hardBreak;
hardBreak.locator = locate;
var space = " ";
var lineFeed = "\n";
var minBreakLength = 2;
function hardBreak(eat, value, silent) {
  var length = value.length;
  var index2 = -1;
  var queue = "";
  var character;
  while (++index2 < length) {
    character = value.charAt(index2);
    if (character === lineFeed) {
      if (index2 < minBreakLength) {
        return;
      }
      if (silent) {
        return true;
      }
      queue += character;
      return eat(queue)({ type: "break" });
    }
    if (character !== space) {
      return;
    }
    queue += character;
  }
}
var text_1 = text;
function text(eat, value, silent) {
  var self = this;
  var methods;
  var tokenizers;
  var index2;
  var length;
  var subvalue;
  var position2;
  var tokenizer2;
  var name2;
  var min;
  var now;
  if (silent) {
    return true;
  }
  methods = self.inlineMethods;
  length = methods.length;
  tokenizers = self.inlineTokenizers;
  index2 = -1;
  min = value.length;
  while (++index2 < length) {
    name2 = methods[index2];
    if (name2 === "text" || !tokenizers[name2]) {
      continue;
    }
    tokenizer2 = tokenizers[name2].locator;
    if (!tokenizer2) {
      eat.file.fail("Missing locator: `" + name2 + "`");
    }
    position2 = tokenizer2.call(self, value, 1);
    if (position2 !== -1 && position2 < min) {
      min = position2;
    }
  }
  subvalue = value.slice(0, min);
  now = eat.now();
  self.decode(subvalue, now, handler);
  function handler(content, position3, source2) {
    eat(source2 || content)({ type: "text", value: content });
  }
}
var xtend$2 = immutable;
var toggle = stateToggle;
var vfileLocation = vfileLocation$1;
var unescape$1 = _unescape;
var decode = decode$3;
var tokenizer = tokenizer$1;
var parser$1 = Parser$1;
function Parser$1(doc, file) {
  this.file = file;
  this.offset = {};
  this.options = xtend$2(this.options);
  this.setOptions({});
  this.inList = false;
  this.inBlock = false;
  this.inLink = false;
  this.atStart = true;
  this.toOffset = vfileLocation(file).toOffset;
  this.unescape = unescape$1(this, "escape");
  this.decode = decode(this);
}
var proto$1 = Parser$1.prototype;
proto$1.setOptions = setOptions_1;
proto$1.parse = parse_1;
proto$1.options = defaults$1;
proto$1.exitStart = toggle("atStart", true);
proto$1.enterList = toggle("inList", false);
proto$1.enterLink = toggle("inLink", false);
proto$1.enterBlock = toggle("inBlock", false);
proto$1.interruptParagraph = [
  ["thematicBreak"],
  ["atxHeading"],
  ["fencedCode"],
  ["blockquote"],
  ["html"],
  ["setextHeading", { commonmark: false }],
  ["definition", { commonmark: false }],
  ["footnote", { commonmark: false }]
];
proto$1.interruptList = [
  ["atxHeading", { pedantic: false }],
  ["fencedCode", { pedantic: false }],
  ["thematicBreak", { pedantic: false }],
  ["definition", { commonmark: false }],
  ["footnote", { commonmark: false }]
];
proto$1.interruptBlockquote = [
  ["indentedCode", { commonmark: true }],
  ["fencedCode", { commonmark: true }],
  ["atxHeading", { commonmark: true }],
  ["setextHeading", { commonmark: true }],
  ["thematicBreak", { commonmark: true }],
  ["html", { commonmark: true }],
  ["list", { commonmark: true }],
  ["definition", { commonmark: false }],
  ["footnote", { commonmark: false }]
];
proto$1.blockTokenizers = {
  newline: newline_1,
  indentedCode: codeIndented,
  fencedCode: codeFenced,
  blockquote: blockquote_1,
  atxHeading: headingAtx,
  thematicBreak: thematicBreak_1,
  list: list_1,
  setextHeading: headingSetext,
  html: htmlBlock,
  footnote: footnoteDefinition_1,
  definition: definition_1,
  table: table_1,
  paragraph: paragraph_1
};
proto$1.inlineTokenizers = {
  escape: _escape,
  autoLink: autoLink_1,
  url: url_1,
  html: htmlInline,
  link: link_1,
  reference: reference_1,
  strong: strong_1,
  emphasis: emphasis_1,
  deletion: _delete,
  code: codeInline,
  break: _break,
  text: text_1
};
proto$1.blockMethods = keys(proto$1.blockTokenizers);
proto$1.inlineMethods = keys(proto$1.inlineTokenizers);
proto$1.tokenizeBlock = tokenizer("block");
proto$1.tokenizeInline = tokenizer("inline");
proto$1.tokenizeFactory = tokenizer;
function keys(value) {
  var result = [];
  var key;
  for (key in value) {
    result.push(key);
  }
  return result;
}
var unherit = unherit_1;
var xtend$1 = immutable;
var Parser = parser$1;
var remarkParse = parse$3;
parse$3.Parser = Parser;
function parse$3(options) {
  var settings = this.data("settings");
  var Local = unherit(Parser);
  Local.prototype.options = xtend$1(Local.prototype.options, settings, options);
  this.Parser = Local;
}
var format = { exports: {} };
(function(module) {
  (function() {
    var namespace;
    {
      namespace = module.exports = format3;
    }
    namespace.format = format3;
    namespace.vsprintf = vsprintf;
    if (typeof console !== "undefined" && typeof console.log === "function") {
      namespace.printf = printf;
    }
    function printf() {
      console.log(format3.apply(null, arguments));
    }
    function vsprintf(fmt, replacements) {
      return format3.apply(null, [fmt].concat(replacements));
    }
    function format3(fmt) {
      var argIndex = 1, args = [].slice.call(arguments), i = 0, n = fmt.length, result = "", c, escaped = false, arg, tmp, leadingZero = false, precision, nextArg = function() {
        return args[argIndex++];
      }, slurpNumber = function() {
        var digits = "";
        while (/\d/.test(fmt[i])) {
          digits += fmt[i++];
          c = fmt[i];
        }
        return digits.length > 0 ? parseInt(digits) : null;
      };
      for (; i < n; ++i) {
        c = fmt[i];
        if (escaped) {
          escaped = false;
          if (c == ".") {
            leadingZero = false;
            c = fmt[++i];
          } else if (c == "0" && fmt[i + 1] == ".") {
            leadingZero = true;
            i += 2;
            c = fmt[i];
          } else {
            leadingZero = true;
          }
          precision = slurpNumber();
          switch (c) {
            case "b":
              result += parseInt(nextArg(), 10).toString(2);
              break;
            case "c":
              arg = nextArg();
              if (typeof arg === "string" || arg instanceof String)
                result += arg;
              else
                result += String.fromCharCode(parseInt(arg, 10));
              break;
            case "d":
              result += parseInt(nextArg(), 10);
              break;
            case "f":
              tmp = String(parseFloat(nextArg()).toFixed(precision || 6));
              result += leadingZero ? tmp : tmp.replace(/^0/, "");
              break;
            case "j":
              result += JSON.stringify(nextArg());
              break;
            case "o":
              result += "0" + parseInt(nextArg(), 10).toString(8);
              break;
            case "s":
              result += nextArg();
              break;
            case "x":
              result += "0x" + parseInt(nextArg(), 10).toString(16);
              break;
            case "X":
              result += "0x" + parseInt(nextArg(), 10).toString(16).toUpperCase();
              break;
            default:
              result += c;
              break;
          }
        } else if (c === "%") {
          escaped = true;
        } else {
          result += c;
        }
      }
      return result;
    }
  })();
})(format);
var formatter = format.exports;
var fault$1 = create$2(Error);
var fault_1 = fault$1;
fault$1.eval = create$2(EvalError);
fault$1.range = create$2(RangeError);
fault$1.reference = create$2(ReferenceError);
fault$1.syntax = create$2(SyntaxError);
fault$1.type = create$2(TypeError);
fault$1.uri = create$2(URIError);
fault$1.create = create$2;
function create$2(EConstructor) {
  FormattedError.displayName = EConstructor.displayName || EConstructor.name;
  return FormattedError;
  function FormattedError(format3) {
    if (format3) {
      format3 = formatter.apply(null, arguments);
    }
    return new EConstructor(format3);
  }
}
var fault = fault_1;
var matters_1 = matters$1;
var own = {}.hasOwnProperty;
var markers = {
  yaml: "-",
  toml: "+"
};
function matters$1(options) {
  var results = [];
  var index2 = -1;
  var length;
  if (typeof options === "string" || !("length" in options)) {
    options = [options];
  }
  length = options.length;
  while (++index2 < length) {
    results[index2] = matter(options[index2]);
  }
  return results;
}
function matter(option) {
  var result = option;
  if (typeof result === "string") {
    if (!own.call(markers, result)) {
      throw fault("Missing matter definition for `%s`", result);
    }
    result = { type: result, marker: markers[result] };
  } else if (typeof result !== "object") {
    throw fault("Expected matter to be an object, not `%j`", result);
  }
  if (!own.call(result, "type")) {
    throw fault("Missing `type` in matter `%j`", result);
  }
  if (!own.call(result, "fence") && !own.call(result, "marker")) {
    throw fault("Missing `marker` or `fence` in matter `%j`", result);
  }
  return result;
}
var fence_1 = fence$2;
function fence$2(matter2, prop) {
  var marker;
  if (matter2.marker) {
    marker = pick(matter2.marker, prop);
    return marker + marker + marker;
  }
  return pick(matter2.fence, prop);
}
function pick(schema, prop) {
  return typeof schema === "string" ? schema : schema[prop];
}
var fence$1 = fence_1;
var parse$2 = create$1;
function create$1(matter2) {
  var name2 = matter2.type + "FrontMatter";
  var open = fence$1(matter2, "open");
  var close = fence$1(matter2, "close");
  var newline2 = "\n";
  var anywhere = matter2.anywhere;
  frontmatter2.displayName = name2;
  frontmatter2.onlyAtStart = typeof anywhere === "boolean" ? !anywhere : true;
  return [name2, frontmatter2];
  function frontmatter2(eat, value, silent) {
    var index2 = open.length;
    var offset;
    if (value.slice(0, index2) !== open || value.charAt(index2) !== newline2) {
      return;
    }
    offset = value.indexOf(close, index2);
    while (offset !== -1 && value.charAt(offset - 1) !== newline2) {
      index2 = offset + close.length;
      offset = value.indexOf(close, index2);
    }
    if (offset !== -1) {
      if (silent) {
        return true;
      }
      return eat(value.slice(0, offset + close.length))({
        type: matter2.type,
        value: value.slice(open.length + 1, offset - 1)
      });
    }
  }
}
var fence = fence_1;
var compile$1 = create;
function create(matter2) {
  var type = matter2.type;
  var open = fence(matter2, "open");
  var close = fence(matter2, "close");
  frontmatter2.displayName = type + "FrontMatter";
  return [type, frontmatter2];
  function frontmatter2(node) {
    return open + (node.value ? "\n" + node.value : "") + "\n" + close;
  }
}
var xtend = immutable;
var matters = matters_1;
var parse$1 = parse$2;
var compile = compile$1;
var remarkFrontmatter = frontmatter;
function frontmatter(options) {
  var parser2 = this.Parser;
  var compiler = this.Compiler;
  var config = matters(options || ["yaml"]);
  if (isRemarkParser(parser2)) {
    attachParser(parser2, config);
  }
  if (isRemarkCompiler(compiler)) {
    attachCompiler(compiler, config);
  }
}
function attachParser(parser2, matters2) {
  var proto2 = parser2.prototype;
  var tokenizers = wrap(parse$1, matters2);
  var names = [];
  var key;
  for (key in tokenizers) {
    names.push(key);
  }
  proto2.blockMethods = names.concat(proto2.blockMethods);
  proto2.blockTokenizers = xtend(tokenizers, proto2.blockTokenizers);
}
function attachCompiler(compiler, matters2) {
  var proto2 = compiler.prototype;
  proto2.visitors = xtend(wrap(compile, matters2), proto2.visitors);
}
function wrap(func, matters2) {
  var result = {};
  var length = matters2.length;
  var index2 = -1;
  var tuple;
  while (++index2 < length) {
    tuple = func(matters2[index2]);
    result[tuple[0]] = tuple[1];
  }
  return result;
}
function isRemarkParser(parser2) {
  return Boolean(parser2 && parser2.prototype && parser2.prototype.blockTokenizers);
}
function isRemarkCompiler(compiler) {
  return Boolean(compiler && compiler.prototype && compiler.prototype.visitors);
}
var CharType = /* @__PURE__ */ ((CharType2) => {
  CharType2["EMPTY"] = "empty";
  CharType2["SPACE"] = "space";
  CharType2["WESTERN_LETTER"] = "western-letter";
  CharType2["CJK_CHAR"] = "cjk-char";
  CharType2["HALFWIDTH_PAUSE_OR_STOP"] = "halfwidth-pause-or-stop";
  CharType2["FULLWIDTH_PAUSE_OR_STOP"] = "fullwidth-pause-or-stop";
  CharType2["HALFWIDTH_QUOTATION"] = "halfwidth-quotation";
  CharType2["FULLWIDTH_QUOTATION"] = "fullwidth-quotation";
  CharType2["HALFWIDTH_BRACKET"] = "halfwidth-bracket";
  CharType2["FULLWIDTH_BRACKET"] = "fullwidth-bracket";
  CharType2["HALFWIDTH_OTHER_PUNCTUATION"] = "halfwidth-other-punctuation";
  CharType2["FULLWIDTH_OTHER_PUNCTUATION"] = "fullwidth-other-punctuation";
  CharType2["UNKNOWN"] = "unknown";
  return CharType2;
})(CharType || {});
const BRACKET_CHAR_SET = {
  left: "([{\uFF08\u3014\uFF3B\uFF5B",
  right: ")]}\uFF09\u3015\uFF3D\uFF5D"
};
const QUOTATION_CHAR_SET = {
  left: `\u201C\u2018\u300A\u3008\u300E\u300C\u3010\u3016`,
  right: `\u201D\u2019\u300B\u3009\u300F\u300D\u3011\u3017`,
  neutral: `'"`
};
const SHORTHAND_CHARS = `'\u2019`;
const SHORTHAND_PAIR_SET = {
  [`'`]: `'`,
  [`\u2019`]: `\u2018`
};
const FULLWIDTH_PAIRS = `\u201C\u201D\u2018\u2019\uFF08\uFF09\u3014\u3015\uFF3B\uFF3D\uFF5B\uFF5D\u300A\u300B\u3008\u3009\u300C\u300D\u300E\u300F\u3010\u3011\u3016\u3017`;
const isFullwidthPair = (str) => FULLWIDTH_PAIRS.indexOf(str) >= 0;
var MarkType = /* @__PURE__ */ ((MarkType2) => {
  MarkType2["BRACKETS"] = "brackets";
  MarkType2["HYPER"] = "hyper";
  MarkType2["RAW"] = "raw";
  return MarkType2;
})(MarkType || {});
var MarkSideType = /* @__PURE__ */ ((MarkSideType2) => {
  MarkSideType2["LEFT"] = "left";
  MarkSideType2["RIGHT"] = "right";
  return MarkSideType2;
})(MarkSideType || {});
const isRawMark = (mark) => {
  return mark.code !== void 0;
};
var HyperTokenType = /* @__PURE__ */ ((HyperTokenType2) => {
  HyperTokenType2["BRACKET_MARK"] = "bracket-mark";
  HyperTokenType2["HYPER_MARK"] = "hyper-mark";
  HyperTokenType2["CODE_CONTENT"] = "code-content";
  HyperTokenType2["HYPER_CONTENT"] = "hyper-content";
  HyperTokenType2["UNMATCHED"] = "unmatched";
  HyperTokenType2["INDETERMINATED"] = "indeterminated";
  return HyperTokenType2;
})(HyperTokenType || {});
var GroupTokenType = /* @__PURE__ */ ((GroupTokenType2) => {
  GroupTokenType2["GROUP"] = "group";
  return GroupTokenType2;
})(GroupTokenType || {});
const getHalfwidthTokenType = (type) => {
  switch (type) {
    case "cjk-char":
      return "western-letter";
    case "fullwidth-pause-or-stop":
      return "halfwidth-pause-or-stop";
    case "fullwidth-other-punctuation":
      return "halfwidth-other-punctuation";
  }
  return type;
};
const getFullwidthTokenType = (type) => {
  switch (type) {
    case "western-letter":
      return "cjk-char";
    case "halfwidth-pause-or-stop":
      return "fullwidth-pause-or-stop";
    case "halfwidth-other-punctuation":
      return "fullwidth-other-punctuation";
  }
  return type;
};
const isLetterType = (type) => {
  return type === "western-letter" || type === "cjk-char";
};
const isPauseOrStopType = (type) => {
  return type === "halfwidth-pause-or-stop" || type === "fullwidth-pause-or-stop";
};
const isQuotationType = (type) => {
  return type === "halfwidth-quotation" || type === "fullwidth-quotation";
};
const isBracketType = (type) => {
  return type === "halfwidth-bracket" || type === "fullwidth-bracket";
};
const isOtherPunctuationType = (type) => {
  return type === "halfwidth-other-punctuation" || type === "fullwidth-other-punctuation";
};
const isSinglePunctuationType = (type) => {
  return isPauseOrStopType(type) || isOtherPunctuationType(type);
};
const isPunctuationType = (type) => {
  return isPauseOrStopType(type) || isQuotationType(type) || isBracketType(type) || isOtherPunctuationType(type);
};
const isHalfwidthPunctuationType = (type) => {
  return type === "halfwidth-pause-or-stop" || type === "halfwidth-quotation" || type === "halfwidth-bracket" || type === "halfwidth-other-punctuation";
};
const isFullwidthPunctuationType = (type) => {
  return type === "fullwidth-pause-or-stop" || type === "fullwidth-quotation" || type === "fullwidth-bracket" || type === "fullwidth-other-punctuation";
};
const isNonCodeVisibleType = (type) => {
  return isLetterType(type) || isSinglePunctuationType(type) || type === "bracket-mark" || type === "group";
};
const isVisibleType = (type) => {
  return isNonCodeVisibleType(type) || type === "code-content";
};
const isInvisibleType = (type) => {
  return type === "hyper-mark";
};
const newCharTypeSet = {
  [CharType.HALFWIDTH_PAUSE_OR_STOP]: ",.;:?!",
  [CharType.FULLWIDTH_PAUSE_OR_STOP]: [
    "\uFF0C\u3002\u3001\uFF1B\uFF1A\uFF1F\uFF01",
    "\u2048\u2047\u203C\u2049"
  ].join(""),
  [CharType.HALFWIDTH_QUOTATION]: `'"`,
  [CharType.FULLWIDTH_QUOTATION]: "\u2018\u2019\u201C\u201D\u300A\u300B\u3008\u3009\u300E\u300F\u300C\u300D\u3010\u3011\u3016\u3017",
  [CharType.HALFWIDTH_BRACKET]: "()[]{}",
  [CharType.FULLWIDTH_BRACKET]: "\uFF08\uFF09\u3014\u3015\uFF3B\uFF3D\uFF5B\uFF5D",
  [CharType.HALFWIDTH_OTHER_PUNCTUATION]: [
    '~-+*/\\%=&|"`<>@#$^',
    "\u2020\u2021"
  ].join(""),
  [CharType.FULLWIDTH_OTHER_PUNCTUATION]: [
    "\u2014\u2E3A",
    "\u2026\u22EF",
    "\uFF5E",
    "\u25CF\u2022\xB7\u2027\u30FB"
  ].join("")
};
const checkCharType = (char) => {
  if (char === "") {
    return CharType.EMPTY;
  }
  if (char.match(/\s/) != null) {
    return CharType.SPACE;
  }
  for (const [charType, charSet] of Object.entries(newCharTypeSet)) {
    if ((charSet == null ? void 0 : charSet.indexOf(char)) >= 0) {
      return charType;
    }
  }
  if (char.match(/[0-9]/) != null) {
    return CharType.WESTERN_LETTER;
  }
  if (char.match(/[\u0020-\u007F]/) != null) {
    return CharType.WESTERN_LETTER;
  }
  if (char.match(/[\u00A0-\u00FF]/) != null) {
    return CharType.WESTERN_LETTER;
  }
  if (char.match(/[\u0100-\u017F]/) != null) {
    return CharType.WESTERN_LETTER;
  }
  if (char.match(/[\u0180-\u024F]/) != null) {
    return CharType.WESTERN_LETTER;
  }
  if (char.match(/[\u0370-\u03FF]/) != null) {
    return CharType.WESTERN_LETTER;
  }
  if (char.match(/[\u4E00-\u9FFF]/) != null) {
    return CharType.CJK_CHAR;
  }
  if (char.match(/[\u3400-\u4DBF]/) != null) {
    return CharType.CJK_CHAR;
  }
  if (char.match(/[\ud840-\ud868][\udc00-\udfff]|\ud869[\udc00-\uded6]/) != null) {
    return CharType.CJK_CHAR;
  }
  if (char.match(
    /\ud869[\udf00-\udfff]|[\ud86a-\ud86c][\udc00-\udfff]|\ud86d[\udc00-\udf34]/
  ) != null) {
    return CharType.CJK_CHAR;
  }
  if (char.match(/\ud86d[\udf40-\udfff]|\ud86e[\udc00-\udc1d]/) != null) {
    return CharType.CJK_CHAR;
  }
  if (char.match(/[\uF900-\uFAFF]/) != null) {
    return CharType.CJK_CHAR;
  }
  if (char.match(/[\uFE30-\uFE4F]/) != null) {
    return CharType.CJK_CHAR;
  }
  if (char.match(/[\u2E80-\u2EFF]/) != null) {
    return CharType.CJK_CHAR;
  }
  if (char.match(/[\uE815-\uE864]/) != null) {
    return CharType.CJK_CHAR;
  }
  if (char.match(/[\u{20000}-\u{2A6DF}]/u) != null) {
    return CharType.CJK_CHAR;
  }
  if (char.match(/[\u{2F800}-\u{2FA1F}]/u) != null) {
    return CharType.CJK_CHAR;
  }
  if (char.match(/[\u3000-\u303F]/) != null) {
    return CharType.FULLWIDTH_OTHER_PUNCTUATION;
  }
  return CharType.UNKNOWN;
};
var ansiStyles$1 = { exports: {} };
var colorName = {
  "aliceblue": [240, 248, 255],
  "antiquewhite": [250, 235, 215],
  "aqua": [0, 255, 255],
  "aquamarine": [127, 255, 212],
  "azure": [240, 255, 255],
  "beige": [245, 245, 220],
  "bisque": [255, 228, 196],
  "black": [0, 0, 0],
  "blanchedalmond": [255, 235, 205],
  "blue": [0, 0, 255],
  "blueviolet": [138, 43, 226],
  "brown": [165, 42, 42],
  "burlywood": [222, 184, 135],
  "cadetblue": [95, 158, 160],
  "chartreuse": [127, 255, 0],
  "chocolate": [210, 105, 30],
  "coral": [255, 127, 80],
  "cornflowerblue": [100, 149, 237],
  "cornsilk": [255, 248, 220],
  "crimson": [220, 20, 60],
  "cyan": [0, 255, 255],
  "darkblue": [0, 0, 139],
  "darkcyan": [0, 139, 139],
  "darkgoldenrod": [184, 134, 11],
  "darkgray": [169, 169, 169],
  "darkgreen": [0, 100, 0],
  "darkgrey": [169, 169, 169],
  "darkkhaki": [189, 183, 107],
  "darkmagenta": [139, 0, 139],
  "darkolivegreen": [85, 107, 47],
  "darkorange": [255, 140, 0],
  "darkorchid": [153, 50, 204],
  "darkred": [139, 0, 0],
  "darksalmon": [233, 150, 122],
  "darkseagreen": [143, 188, 143],
  "darkslateblue": [72, 61, 139],
  "darkslategray": [47, 79, 79],
  "darkslategrey": [47, 79, 79],
  "darkturquoise": [0, 206, 209],
  "darkviolet": [148, 0, 211],
  "deeppink": [255, 20, 147],
  "deepskyblue": [0, 191, 255],
  "dimgray": [105, 105, 105],
  "dimgrey": [105, 105, 105],
  "dodgerblue": [30, 144, 255],
  "firebrick": [178, 34, 34],
  "floralwhite": [255, 250, 240],
  "forestgreen": [34, 139, 34],
  "fuchsia": [255, 0, 255],
  "gainsboro": [220, 220, 220],
  "ghostwhite": [248, 248, 255],
  "gold": [255, 215, 0],
  "goldenrod": [218, 165, 32],
  "gray": [128, 128, 128],
  "green": [0, 128, 0],
  "greenyellow": [173, 255, 47],
  "grey": [128, 128, 128],
  "honeydew": [240, 255, 240],
  "hotpink": [255, 105, 180],
  "indianred": [205, 92, 92],
  "indigo": [75, 0, 130],
  "ivory": [255, 255, 240],
  "khaki": [240, 230, 140],
  "lavender": [230, 230, 250],
  "lavenderblush": [255, 240, 245],
  "lawngreen": [124, 252, 0],
  "lemonchiffon": [255, 250, 205],
  "lightblue": [173, 216, 230],
  "lightcoral": [240, 128, 128],
  "lightcyan": [224, 255, 255],
  "lightgoldenrodyellow": [250, 250, 210],
  "lightgray": [211, 211, 211],
  "lightgreen": [144, 238, 144],
  "lightgrey": [211, 211, 211],
  "lightpink": [255, 182, 193],
  "lightsalmon": [255, 160, 122],
  "lightseagreen": [32, 178, 170],
  "lightskyblue": [135, 206, 250],
  "lightslategray": [119, 136, 153],
  "lightslategrey": [119, 136, 153],
  "lightsteelblue": [176, 196, 222],
  "lightyellow": [255, 255, 224],
  "lime": [0, 255, 0],
  "limegreen": [50, 205, 50],
  "linen": [250, 240, 230],
  "magenta": [255, 0, 255],
  "maroon": [128, 0, 0],
  "mediumaquamarine": [102, 205, 170],
  "mediumblue": [0, 0, 205],
  "mediumorchid": [186, 85, 211],
  "mediumpurple": [147, 112, 219],
  "mediumseagreen": [60, 179, 113],
  "mediumslateblue": [123, 104, 238],
  "mediumspringgreen": [0, 250, 154],
  "mediumturquoise": [72, 209, 204],
  "mediumvioletred": [199, 21, 133],
  "midnightblue": [25, 25, 112],
  "mintcream": [245, 255, 250],
  "mistyrose": [255, 228, 225],
  "moccasin": [255, 228, 181],
  "navajowhite": [255, 222, 173],
  "navy": [0, 0, 128],
  "oldlace": [253, 245, 230],
  "olive": [128, 128, 0],
  "olivedrab": [107, 142, 35],
  "orange": [255, 165, 0],
  "orangered": [255, 69, 0],
  "orchid": [218, 112, 214],
  "palegoldenrod": [238, 232, 170],
  "palegreen": [152, 251, 152],
  "paleturquoise": [175, 238, 238],
  "palevioletred": [219, 112, 147],
  "papayawhip": [255, 239, 213],
  "peachpuff": [255, 218, 185],
  "peru": [205, 133, 63],
  "pink": [255, 192, 203],
  "plum": [221, 160, 221],
  "powderblue": [176, 224, 230],
  "purple": [128, 0, 128],
  "rebeccapurple": [102, 51, 153],
  "red": [255, 0, 0],
  "rosybrown": [188, 143, 143],
  "royalblue": [65, 105, 225],
  "saddlebrown": [139, 69, 19],
  "salmon": [250, 128, 114],
  "sandybrown": [244, 164, 96],
  "seagreen": [46, 139, 87],
  "seashell": [255, 245, 238],
  "sienna": [160, 82, 45],
  "silver": [192, 192, 192],
  "skyblue": [135, 206, 235],
  "slateblue": [106, 90, 205],
  "slategray": [112, 128, 144],
  "slategrey": [112, 128, 144],
  "snow": [255, 250, 250],
  "springgreen": [0, 255, 127],
  "steelblue": [70, 130, 180],
  "tan": [210, 180, 140],
  "teal": [0, 128, 128],
  "thistle": [216, 191, 216],
  "tomato": [255, 99, 71],
  "turquoise": [64, 224, 208],
  "violet": [238, 130, 238],
  "wheat": [245, 222, 179],
  "white": [255, 255, 255],
  "whitesmoke": [245, 245, 245],
  "yellow": [255, 255, 0],
  "yellowgreen": [154, 205, 50]
};
const cssKeywords = colorName;
const reverseKeywords = {};
for (const key of Object.keys(cssKeywords)) {
  reverseKeywords[cssKeywords[key]] = key;
}
const convert$1 = {
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
var conversions$2 = convert$1;
for (const model of Object.keys(convert$1)) {
  if (!("channels" in convert$1[model])) {
    throw new Error("missing channels property: " + model);
  }
  if (!("labels" in convert$1[model])) {
    throw new Error("missing channel labels property: " + model);
  }
  if (convert$1[model].labels.length !== convert$1[model].channels) {
    throw new Error("channel and label counts mismatch: " + model);
  }
  const { channels, labels } = convert$1[model];
  delete convert$1[model].channels;
  delete convert$1[model].labels;
  Object.defineProperty(convert$1[model], "channels", { value: channels });
  Object.defineProperty(convert$1[model], "labels", { value: labels });
}
convert$1.rgb.hsl = function(rgb) {
  const r = rgb[0] / 255;
  const g = rgb[1] / 255;
  const b = rgb[2] / 255;
  const min = Math.min(r, g, b);
  const max = Math.max(r, g, b);
  const delta = max - min;
  let h;
  let s;
  if (max === min) {
    h = 0;
  } else if (r === max) {
    h = (g - b) / delta;
  } else if (g === max) {
    h = 2 + (b - r) / delta;
  } else if (b === max) {
    h = 4 + (r - g) / delta;
  }
  h = Math.min(h * 60, 360);
  if (h < 0) {
    h += 360;
  }
  const l = (min + max) / 2;
  if (max === min) {
    s = 0;
  } else if (l <= 0.5) {
    s = delta / (max + min);
  } else {
    s = delta / (2 - max - min);
  }
  return [h, s * 100, l * 100];
};
convert$1.rgb.hsv = function(rgb) {
  let rdif;
  let gdif;
  let bdif;
  let h;
  let s;
  const r = rgb[0] / 255;
  const g = rgb[1] / 255;
  const b = rgb[2] / 255;
  const v = Math.max(r, g, b);
  const diff = v - Math.min(r, g, b);
  const diffc = function(c) {
    return (v - c) / 6 / diff + 1 / 2;
  };
  if (diff === 0) {
    h = 0;
    s = 0;
  } else {
    s = diff / v;
    rdif = diffc(r);
    gdif = diffc(g);
    bdif = diffc(b);
    if (r === v) {
      h = bdif - gdif;
    } else if (g === v) {
      h = 1 / 3 + rdif - bdif;
    } else if (b === v) {
      h = 2 / 3 + gdif - rdif;
    }
    if (h < 0) {
      h += 1;
    } else if (h > 1) {
      h -= 1;
    }
  }
  return [
    h * 360,
    s * 100,
    v * 100
  ];
};
convert$1.rgb.hwb = function(rgb) {
  const r = rgb[0];
  const g = rgb[1];
  let b = rgb[2];
  const h = convert$1.rgb.hsl(rgb)[0];
  const w = 1 / 255 * Math.min(r, Math.min(g, b));
  b = 1 - 1 / 255 * Math.max(r, Math.max(g, b));
  return [h, w * 100, b * 100];
};
convert$1.rgb.cmyk = function(rgb) {
  const r = rgb[0] / 255;
  const g = rgb[1] / 255;
  const b = rgb[2] / 255;
  const k = Math.min(1 - r, 1 - g, 1 - b);
  const c = (1 - r - k) / (1 - k) || 0;
  const m = (1 - g - k) / (1 - k) || 0;
  const y = (1 - b - k) / (1 - k) || 0;
  return [c * 100, m * 100, y * 100, k * 100];
};
function comparativeDistance(x, y) {
  return (x[0] - y[0]) ** 2 + (x[1] - y[1]) ** 2 + (x[2] - y[2]) ** 2;
}
convert$1.rgb.keyword = function(rgb) {
  const reversed = reverseKeywords[rgb];
  if (reversed) {
    return reversed;
  }
  let currentClosestDistance = Infinity;
  let currentClosestKeyword;
  for (const keyword of Object.keys(cssKeywords)) {
    const value = cssKeywords[keyword];
    const distance = comparativeDistance(rgb, value);
    if (distance < currentClosestDistance) {
      currentClosestDistance = distance;
      currentClosestKeyword = keyword;
    }
  }
  return currentClosestKeyword;
};
convert$1.keyword.rgb = function(keyword) {
  return cssKeywords[keyword];
};
convert$1.rgb.xyz = function(rgb) {
  let r = rgb[0] / 255;
  let g = rgb[1] / 255;
  let b = rgb[2] / 255;
  r = r > 0.04045 ? ((r + 0.055) / 1.055) ** 2.4 : r / 12.92;
  g = g > 0.04045 ? ((g + 0.055) / 1.055) ** 2.4 : g / 12.92;
  b = b > 0.04045 ? ((b + 0.055) / 1.055) ** 2.4 : b / 12.92;
  const x = r * 0.4124 + g * 0.3576 + b * 0.1805;
  const y = r * 0.2126 + g * 0.7152 + b * 0.0722;
  const z = r * 0.0193 + g * 0.1192 + b * 0.9505;
  return [x * 100, y * 100, z * 100];
};
convert$1.rgb.lab = function(rgb) {
  const xyz = convert$1.rgb.xyz(rgb);
  let x = xyz[0];
  let y = xyz[1];
  let z = xyz[2];
  x /= 95.047;
  y /= 100;
  z /= 108.883;
  x = x > 8856e-6 ? x ** (1 / 3) : 7.787 * x + 16 / 116;
  y = y > 8856e-6 ? y ** (1 / 3) : 7.787 * y + 16 / 116;
  z = z > 8856e-6 ? z ** (1 / 3) : 7.787 * z + 16 / 116;
  const l = 116 * y - 16;
  const a = 500 * (x - y);
  const b = 200 * (y - z);
  return [l, a, b];
};
convert$1.hsl.rgb = function(hsl) {
  const h = hsl[0] / 360;
  const s = hsl[1] / 100;
  const l = hsl[2] / 100;
  let t2;
  let t3;
  let val;
  if (s === 0) {
    val = l * 255;
    return [val, val, val];
  }
  if (l < 0.5) {
    t2 = l * (1 + s);
  } else {
    t2 = l + s - l * s;
  }
  const t1 = 2 * l - t2;
  const rgb = [0, 0, 0];
  for (let i = 0; i < 3; i++) {
    t3 = h + 1 / 3 * -(i - 1);
    if (t3 < 0) {
      t3++;
    }
    if (t3 > 1) {
      t3--;
    }
    if (6 * t3 < 1) {
      val = t1 + (t2 - t1) * 6 * t3;
    } else if (2 * t3 < 1) {
      val = t2;
    } else if (3 * t3 < 2) {
      val = t1 + (t2 - t1) * (2 / 3 - t3) * 6;
    } else {
      val = t1;
    }
    rgb[i] = val * 255;
  }
  return rgb;
};
convert$1.hsl.hsv = function(hsl) {
  const h = hsl[0];
  let s = hsl[1] / 100;
  let l = hsl[2] / 100;
  let smin = s;
  const lmin = Math.max(l, 0.01);
  l *= 2;
  s *= l <= 1 ? l : 2 - l;
  smin *= lmin <= 1 ? lmin : 2 - lmin;
  const v = (l + s) / 2;
  const sv = l === 0 ? 2 * smin / (lmin + smin) : 2 * s / (l + s);
  return [h, sv * 100, v * 100];
};
convert$1.hsv.rgb = function(hsv) {
  const h = hsv[0] / 60;
  const s = hsv[1] / 100;
  let v = hsv[2] / 100;
  const hi = Math.floor(h) % 6;
  const f = h - Math.floor(h);
  const p2 = 255 * v * (1 - s);
  const q = 255 * v * (1 - s * f);
  const t = 255 * v * (1 - s * (1 - f));
  v *= 255;
  switch (hi) {
    case 0:
      return [v, t, p2];
    case 1:
      return [q, v, p2];
    case 2:
      return [p2, v, t];
    case 3:
      return [p2, q, v];
    case 4:
      return [t, p2, v];
    case 5:
      return [v, p2, q];
  }
};
convert$1.hsv.hsl = function(hsv) {
  const h = hsv[0];
  const s = hsv[1] / 100;
  const v = hsv[2] / 100;
  const vmin = Math.max(v, 0.01);
  let sl;
  let l;
  l = (2 - s) * v;
  const lmin = (2 - s) * vmin;
  sl = s * vmin;
  sl /= lmin <= 1 ? lmin : 2 - lmin;
  sl = sl || 0;
  l /= 2;
  return [h, sl * 100, l * 100];
};
convert$1.hwb.rgb = function(hwb) {
  const h = hwb[0] / 360;
  let wh = hwb[1] / 100;
  let bl = hwb[2] / 100;
  const ratio = wh + bl;
  let f;
  if (ratio > 1) {
    wh /= ratio;
    bl /= ratio;
  }
  const i = Math.floor(6 * h);
  const v = 1 - bl;
  f = 6 * h - i;
  if ((i & 1) !== 0) {
    f = 1 - f;
  }
  const n = wh + f * (v - wh);
  let r;
  let g;
  let b;
  switch (i) {
    default:
    case 6:
    case 0:
      r = v;
      g = n;
      b = wh;
      break;
    case 1:
      r = n;
      g = v;
      b = wh;
      break;
    case 2:
      r = wh;
      g = v;
      b = n;
      break;
    case 3:
      r = wh;
      g = n;
      b = v;
      break;
    case 4:
      r = n;
      g = wh;
      b = v;
      break;
    case 5:
      r = v;
      g = wh;
      b = n;
      break;
  }
  return [r * 255, g * 255, b * 255];
};
convert$1.cmyk.rgb = function(cmyk) {
  const c = cmyk[0] / 100;
  const m = cmyk[1] / 100;
  const y = cmyk[2] / 100;
  const k = cmyk[3] / 100;
  const r = 1 - Math.min(1, c * (1 - k) + k);
  const g = 1 - Math.min(1, m * (1 - k) + k);
  const b = 1 - Math.min(1, y * (1 - k) + k);
  return [r * 255, g * 255, b * 255];
};
convert$1.xyz.rgb = function(xyz) {
  const x = xyz[0] / 100;
  const y = xyz[1] / 100;
  const z = xyz[2] / 100;
  let r;
  let g;
  let b;
  r = x * 3.2406 + y * -1.5372 + z * -0.4986;
  g = x * -0.9689 + y * 1.8758 + z * 0.0415;
  b = x * 0.0557 + y * -0.204 + z * 1.057;
  r = r > 31308e-7 ? 1.055 * r ** (1 / 2.4) - 0.055 : r * 12.92;
  g = g > 31308e-7 ? 1.055 * g ** (1 / 2.4) - 0.055 : g * 12.92;
  b = b > 31308e-7 ? 1.055 * b ** (1 / 2.4) - 0.055 : b * 12.92;
  r = Math.min(Math.max(0, r), 1);
  g = Math.min(Math.max(0, g), 1);
  b = Math.min(Math.max(0, b), 1);
  return [r * 255, g * 255, b * 255];
};
convert$1.xyz.lab = function(xyz) {
  let x = xyz[0];
  let y = xyz[1];
  let z = xyz[2];
  x /= 95.047;
  y /= 100;
  z /= 108.883;
  x = x > 8856e-6 ? x ** (1 / 3) : 7.787 * x + 16 / 116;
  y = y > 8856e-6 ? y ** (1 / 3) : 7.787 * y + 16 / 116;
  z = z > 8856e-6 ? z ** (1 / 3) : 7.787 * z + 16 / 116;
  const l = 116 * y - 16;
  const a = 500 * (x - y);
  const b = 200 * (y - z);
  return [l, a, b];
};
convert$1.lab.xyz = function(lab) {
  const l = lab[0];
  const a = lab[1];
  const b = lab[2];
  let x;
  let y;
  let z;
  y = (l + 16) / 116;
  x = a / 500 + y;
  z = y - b / 200;
  const y2 = y ** 3;
  const x2 = x ** 3;
  const z2 = z ** 3;
  y = y2 > 8856e-6 ? y2 : (y - 16 / 116) / 7.787;
  x = x2 > 8856e-6 ? x2 : (x - 16 / 116) / 7.787;
  z = z2 > 8856e-6 ? z2 : (z - 16 / 116) / 7.787;
  x *= 95.047;
  y *= 100;
  z *= 108.883;
  return [x, y, z];
};
convert$1.lab.lch = function(lab) {
  const l = lab[0];
  const a = lab[1];
  const b = lab[2];
  let h;
  const hr = Math.atan2(b, a);
  h = hr * 360 / 2 / Math.PI;
  if (h < 0) {
    h += 360;
  }
  const c = Math.sqrt(a * a + b * b);
  return [l, c, h];
};
convert$1.lch.lab = function(lch) {
  const l = lch[0];
  const c = lch[1];
  const h = lch[2];
  const hr = h / 360 * 2 * Math.PI;
  const a = c * Math.cos(hr);
  const b = c * Math.sin(hr);
  return [l, a, b];
};
convert$1.rgb.ansi16 = function(args, saturation = null) {
  const [r, g, b] = args;
  let value = saturation === null ? convert$1.rgb.hsv(args)[2] : saturation;
  value = Math.round(value / 50);
  if (value === 0) {
    return 30;
  }
  let ansi = 30 + (Math.round(b / 255) << 2 | Math.round(g / 255) << 1 | Math.round(r / 255));
  if (value === 2) {
    ansi += 60;
  }
  return ansi;
};
convert$1.hsv.ansi16 = function(args) {
  return convert$1.rgb.ansi16(convert$1.hsv.rgb(args), args[2]);
};
convert$1.rgb.ansi256 = function(args) {
  const r = args[0];
  const g = args[1];
  const b = args[2];
  if (r === g && g === b) {
    if (r < 8) {
      return 16;
    }
    if (r > 248) {
      return 231;
    }
    return Math.round((r - 8) / 247 * 24) + 232;
  }
  const ansi = 16 + 36 * Math.round(r / 255 * 5) + 6 * Math.round(g / 255 * 5) + Math.round(b / 255 * 5);
  return ansi;
};
convert$1.ansi16.rgb = function(args) {
  let color = args % 10;
  if (color === 0 || color === 7) {
    if (args > 50) {
      color += 3.5;
    }
    color = color / 10.5 * 255;
    return [color, color, color];
  }
  const mult = (~~(args > 50) + 1) * 0.5;
  const r = (color & 1) * mult * 255;
  const g = (color >> 1 & 1) * mult * 255;
  const b = (color >> 2 & 1) * mult * 255;
  return [r, g, b];
};
convert$1.ansi256.rgb = function(args) {
  if (args >= 232) {
    const c = (args - 232) * 10 + 8;
    return [c, c, c];
  }
  args -= 16;
  let rem;
  const r = Math.floor(args / 36) / 5 * 255;
  const g = Math.floor((rem = args % 36) / 6) / 5 * 255;
  const b = rem % 6 / 5 * 255;
  return [r, g, b];
};
convert$1.rgb.hex = function(args) {
  const integer = ((Math.round(args[0]) & 255) << 16) + ((Math.round(args[1]) & 255) << 8) + (Math.round(args[2]) & 255);
  const string = integer.toString(16).toUpperCase();
  return "000000".substring(string.length) + string;
};
convert$1.hex.rgb = function(args) {
  const match = args.toString(16).match(/[a-f0-9]{6}|[a-f0-9]{3}/i);
  if (!match) {
    return [0, 0, 0];
  }
  let colorString = match[0];
  if (match[0].length === 3) {
    colorString = colorString.split("").map((char) => {
      return char + char;
    }).join("");
  }
  const integer = parseInt(colorString, 16);
  const r = integer >> 16 & 255;
  const g = integer >> 8 & 255;
  const b = integer & 255;
  return [r, g, b];
};
convert$1.rgb.hcg = function(rgb) {
  const r = rgb[0] / 255;
  const g = rgb[1] / 255;
  const b = rgb[2] / 255;
  const max = Math.max(Math.max(r, g), b);
  const min = Math.min(Math.min(r, g), b);
  const chroma = max - min;
  let grayscale;
  let hue;
  if (chroma < 1) {
    grayscale = min / (1 - chroma);
  } else {
    grayscale = 0;
  }
  if (chroma <= 0) {
    hue = 0;
  } else if (max === r) {
    hue = (g - b) / chroma % 6;
  } else if (max === g) {
    hue = 2 + (b - r) / chroma;
  } else {
    hue = 4 + (r - g) / chroma;
  }
  hue /= 6;
  hue %= 1;
  return [hue * 360, chroma * 100, grayscale * 100];
};
convert$1.hsl.hcg = function(hsl) {
  const s = hsl[1] / 100;
  const l = hsl[2] / 100;
  const c = l < 0.5 ? 2 * s * l : 2 * s * (1 - l);
  let f = 0;
  if (c < 1) {
    f = (l - 0.5 * c) / (1 - c);
  }
  return [hsl[0], c * 100, f * 100];
};
convert$1.hsv.hcg = function(hsv) {
  const s = hsv[1] / 100;
  const v = hsv[2] / 100;
  const c = s * v;
  let f = 0;
  if (c < 1) {
    f = (v - c) / (1 - c);
  }
  return [hsv[0], c * 100, f * 100];
};
convert$1.hcg.rgb = function(hcg) {
  const h = hcg[0] / 360;
  const c = hcg[1] / 100;
  const g = hcg[2] / 100;
  if (c === 0) {
    return [g * 255, g * 255, g * 255];
  }
  const pure = [0, 0, 0];
  const hi = h % 1 * 6;
  const v = hi % 1;
  const w = 1 - v;
  let mg = 0;
  switch (Math.floor(hi)) {
    case 0:
      pure[0] = 1;
      pure[1] = v;
      pure[2] = 0;
      break;
    case 1:
      pure[0] = w;
      pure[1] = 1;
      pure[2] = 0;
      break;
    case 2:
      pure[0] = 0;
      pure[1] = 1;
      pure[2] = v;
      break;
    case 3:
      pure[0] = 0;
      pure[1] = w;
      pure[2] = 1;
      break;
    case 4:
      pure[0] = v;
      pure[1] = 0;
      pure[2] = 1;
      break;
    default:
      pure[0] = 1;
      pure[1] = 0;
      pure[2] = w;
  }
  mg = (1 - c) * g;
  return [
    (c * pure[0] + mg) * 255,
    (c * pure[1] + mg) * 255,
    (c * pure[2] + mg) * 255
  ];
};
convert$1.hcg.hsv = function(hcg) {
  const c = hcg[1] / 100;
  const g = hcg[2] / 100;
  const v = c + g * (1 - c);
  let f = 0;
  if (v > 0) {
    f = c / v;
  }
  return [hcg[0], f * 100, v * 100];
};
convert$1.hcg.hsl = function(hcg) {
  const c = hcg[1] / 100;
  const g = hcg[2] / 100;
  const l = g * (1 - c) + 0.5 * c;
  let s = 0;
  if (l > 0 && l < 0.5) {
    s = c / (2 * l);
  } else if (l >= 0.5 && l < 1) {
    s = c / (2 * (1 - l));
  }
  return [hcg[0], s * 100, l * 100];
};
convert$1.hcg.hwb = function(hcg) {
  const c = hcg[1] / 100;
  const g = hcg[2] / 100;
  const v = c + g * (1 - c);
  return [hcg[0], (v - c) * 100, (1 - v) * 100];
};
convert$1.hwb.hcg = function(hwb) {
  const w = hwb[1] / 100;
  const b = hwb[2] / 100;
  const v = 1 - b;
  const c = v - w;
  let g = 0;
  if (c < 1) {
    g = (v - c) / (1 - c);
  }
  return [hwb[0], c * 100, g * 100];
};
convert$1.apple.rgb = function(apple) {
  return [apple[0] / 65535 * 255, apple[1] / 65535 * 255, apple[2] / 65535 * 255];
};
convert$1.rgb.apple = function(rgb) {
  return [rgb[0] / 255 * 65535, rgb[1] / 255 * 65535, rgb[2] / 255 * 65535];
};
convert$1.gray.rgb = function(args) {
  return [args[0] / 100 * 255, args[0] / 100 * 255, args[0] / 100 * 255];
};
convert$1.gray.hsl = function(args) {
  return [0, 0, args[0]];
};
convert$1.gray.hsv = convert$1.gray.hsl;
convert$1.gray.hwb = function(gray) {
  return [0, 100, gray[0]];
};
convert$1.gray.cmyk = function(gray) {
  return [0, 0, 0, gray[0]];
};
convert$1.gray.lab = function(gray) {
  return [gray[0], 0, 0];
};
convert$1.gray.hex = function(gray) {
  const val = Math.round(gray[0] / 100 * 255) & 255;
  const integer = (val << 16) + (val << 8) + val;
  const string = integer.toString(16).toUpperCase();
  return "000000".substring(string.length) + string;
};
convert$1.rgb.gray = function(rgb) {
  const val = (rgb[0] + rgb[1] + rgb[2]) / 3;
  return [val / 255 * 100];
};
const conversions$1 = conversions$2;
function buildGraph() {
  const graph = {};
  const models2 = Object.keys(conversions$1);
  for (let len = models2.length, i = 0; i < len; i++) {
    graph[models2[i]] = {
      distance: -1,
      parent: null
    };
  }
  return graph;
}
function deriveBFS(fromModel) {
  const graph = buildGraph();
  const queue = [fromModel];
  graph[fromModel].distance = 0;
  while (queue.length) {
    const current = queue.pop();
    const adjacents = Object.keys(conversions$1[current]);
    for (let len = adjacents.length, i = 0; i < len; i++) {
      const adjacent = adjacents[i];
      const node = graph[adjacent];
      if (node.distance === -1) {
        node.distance = graph[current].distance + 1;
        node.parent = current;
        queue.unshift(adjacent);
      }
    }
  }
  return graph;
}
function link(from, to) {
  return function(args) {
    return to(from(args));
  };
}
function wrapConversion(toModel, graph) {
  const path = [graph[toModel].parent, toModel];
  let fn = conversions$1[graph[toModel].parent][toModel];
  let cur = graph[toModel].parent;
  while (graph[cur].parent) {
    path.unshift(graph[cur].parent);
    fn = link(conversions$1[graph[cur].parent][cur], fn);
    cur = graph[cur].parent;
  }
  fn.conversion = path;
  return fn;
}
var route$1 = function(fromModel) {
  const graph = deriveBFS(fromModel);
  const conversion = {};
  const models2 = Object.keys(graph);
  for (let len = models2.length, i = 0; i < len; i++) {
    const toModel = models2[i];
    const node = graph[toModel];
    if (node.parent === null) {
      continue;
    }
    conversion[toModel] = wrapConversion(toModel, graph);
  }
  return conversion;
};
const conversions = conversions$2;
const route = route$1;
const convert = {};
const models = Object.keys(conversions);
function wrapRaw(fn) {
  const wrappedFn = function(...args) {
    const arg0 = args[0];
    if (arg0 === void 0 || arg0 === null) {
      return arg0;
    }
    if (arg0.length > 1) {
      args = arg0;
    }
    return fn(args);
  };
  if ("conversion" in fn) {
    wrappedFn.conversion = fn.conversion;
  }
  return wrappedFn;
}
function wrapRounded(fn) {
  const wrappedFn = function(...args) {
    const arg0 = args[0];
    if (arg0 === void 0 || arg0 === null) {
      return arg0;
    }
    if (arg0.length > 1) {
      args = arg0;
    }
    const result = fn(args);
    if (typeof result === "object") {
      for (let len = result.length, i = 0; i < len; i++) {
        result[i] = Math.round(result[i]);
      }
    }
    return result;
  };
  if ("conversion" in fn) {
    wrappedFn.conversion = fn.conversion;
  }
  return wrappedFn;
}
models.forEach((fromModel) => {
  convert[fromModel] = {};
  Object.defineProperty(convert[fromModel], "channels", { value: conversions[fromModel].channels });
  Object.defineProperty(convert[fromModel], "labels", { value: conversions[fromModel].labels });
  const routes = route(fromModel);
  const routeModels = Object.keys(routes);
  routeModels.forEach((toModel) => {
    const fn = routes[toModel];
    convert[fromModel][toModel] = wrapRounded(fn);
    convert[fromModel][toModel].raw = wrapRaw(fn);
  });
});
var colorConvert = convert;
(function(module) {
  const wrapAnsi16 = (fn, offset) => (...args) => {
    const code = fn(...args);
    return `\x1B[${code + offset}m`;
  };
  const wrapAnsi256 = (fn, offset) => (...args) => {
    const code = fn(...args);
    return `\x1B[${38 + offset};5;${code}m`;
  };
  const wrapAnsi16m = (fn, offset) => (...args) => {
    const rgb = fn(...args);
    return `\x1B[${38 + offset};2;${rgb[0]};${rgb[1]};${rgb[2]}m`;
  };
  const ansi2ansi = (n) => n;
  const rgb2rgb = (r, g, b) => [r, g, b];
  const setLazyProperty = (object, property, get) => {
    Object.defineProperty(object, property, {
      get: () => {
        const value = get();
        Object.defineProperty(object, property, {
          value,
          enumerable: true,
          configurable: true
        });
        return value;
      },
      enumerable: true,
      configurable: true
    });
  };
  let colorConvert$1;
  const makeDynamicStyles = (wrap2, targetSpace, identity, isBackground) => {
    if (colorConvert$1 === void 0) {
      colorConvert$1 = colorConvert;
    }
    const offset = isBackground ? 10 : 0;
    const styles2 = {};
    for (const [sourceSpace, suite] of Object.entries(colorConvert$1)) {
      const name2 = sourceSpace === "ansi16" ? "ansi" : sourceSpace;
      if (sourceSpace === targetSpace) {
        styles2[name2] = wrap2(identity, offset);
      } else if (typeof suite === "object") {
        styles2[name2] = wrap2(suite[targetSpace], offset);
      }
    }
    return styles2;
  };
  function assembleStyles() {
    const codes = /* @__PURE__ */ new Map();
    const styles2 = {
      modifier: {
        reset: [0, 0],
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
    styles2.color.gray = styles2.color.blackBright;
    styles2.bgColor.bgGray = styles2.bgColor.bgBlackBright;
    styles2.color.grey = styles2.color.blackBright;
    styles2.bgColor.bgGrey = styles2.bgColor.bgBlackBright;
    for (const [groupName, group] of Object.entries(styles2)) {
      for (const [styleName, style] of Object.entries(group)) {
        styles2[styleName] = {
          open: `\x1B[${style[0]}m`,
          close: `\x1B[${style[1]}m`
        };
        group[styleName] = styles2[styleName];
        codes.set(style[0], style[1]);
      }
      Object.defineProperty(styles2, groupName, {
        value: group,
        enumerable: false
      });
    }
    Object.defineProperty(styles2, "codes", {
      value: codes,
      enumerable: false
    });
    styles2.color.close = "\x1B[39m";
    styles2.bgColor.close = "\x1B[49m";
    setLazyProperty(styles2.color, "ansi", () => makeDynamicStyles(wrapAnsi16, "ansi16", ansi2ansi, false));
    setLazyProperty(styles2.color, "ansi256", () => makeDynamicStyles(wrapAnsi256, "ansi256", ansi2ansi, false));
    setLazyProperty(styles2.color, "ansi16m", () => makeDynamicStyles(wrapAnsi16m, "rgb", rgb2rgb, false));
    setLazyProperty(styles2.bgColor, "ansi", () => makeDynamicStyles(wrapAnsi16, "ansi16", ansi2ansi, true));
    setLazyProperty(styles2.bgColor, "ansi256", () => makeDynamicStyles(wrapAnsi256, "ansi256", ansi2ansi, true));
    setLazyProperty(styles2.bgColor, "ansi16m", () => makeDynamicStyles(wrapAnsi16m, "rgb", rgb2rgb, true));
    return styles2;
  }
  Object.defineProperty(module, "exports", {
    enumerable: true,
    get: assembleStyles
  });
})(ansiStyles$1);
var browser = {
  stdout: false,
  stderr: false
};
const stringReplaceAll$1 = (string, substring, replacer) => {
  let index2 = string.indexOf(substring);
  if (index2 === -1) {
    return string;
  }
  const substringLength = substring.length;
  let endIndex = 0;
  let returnValue = "";
  do {
    returnValue += string.substr(endIndex, index2 - endIndex) + substring + replacer;
    endIndex = index2 + substringLength;
    index2 = string.indexOf(substring, endIndex);
  } while (index2 !== -1);
  returnValue += string.substr(endIndex);
  return returnValue;
};
const stringEncaseCRLFWithFirstIndex$1 = (string, prefix, postfix, index2) => {
  let endIndex = 0;
  let returnValue = "";
  do {
    const gotCR = string[index2 - 1] === "\r";
    returnValue += string.substr(endIndex, (gotCR ? index2 - 1 : index2) - endIndex) + prefix + (gotCR ? "\r\n" : "\n") + postfix;
    endIndex = index2 + 1;
    index2 = string.indexOf("\n", endIndex);
  } while (index2 !== -1);
  returnValue += string.substr(endIndex);
  return returnValue;
};
var util = {
  stringReplaceAll: stringReplaceAll$1,
  stringEncaseCRLFWithFirstIndex: stringEncaseCRLFWithFirstIndex$1
};
const TEMPLATE_REGEX = /(?:\\(u(?:[a-f\d]{4}|\{[a-f\d]{1,6}\})|x[a-f\d]{2}|.))|(?:\{(~)?(\w+(?:\([^)]*\))?(?:\.\w+(?:\([^)]*\))?)*)(?:[ \t]|(?=\r?\n)))|(\})|((?:.|[\r\n\f])+?)/gi;
const STYLE_REGEX = /(?:^|\.)(\w+)(?:\(([^)]*)\))?/g;
const STRING_REGEX = /^(['"])((?:\\.|(?!\1)[^\\])*)\1$/;
const ESCAPE_REGEX = /\\(u(?:[a-f\d]{4}|{[a-f\d]{1,6}})|x[a-f\d]{2}|.)|([^\\])/gi;
const ESCAPES = /* @__PURE__ */ new Map([
  ["n", "\n"],
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
function unescape(c) {
  const u = c[0] === "u";
  const bracket = c[1] === "{";
  if (u && !bracket && c.length === 5 || c[0] === "x" && c.length === 3) {
    return String.fromCharCode(parseInt(c.slice(1), 16));
  }
  if (u && bracket) {
    return String.fromCodePoint(parseInt(c.slice(2, -1), 16));
  }
  return ESCAPES.get(c) || c;
}
function parseArguments(name2, arguments_) {
  const results = [];
  const chunks = arguments_.trim().split(/\s*,\s*/g);
  let matches;
  for (const chunk of chunks) {
    const number = Number(chunk);
    if (!Number.isNaN(number)) {
      results.push(number);
    } else if (matches = chunk.match(STRING_REGEX)) {
      results.push(matches[2].replace(ESCAPE_REGEX, (m, escape2, character) => escape2 ? unescape(escape2) : character));
    } else {
      throw new Error(`Invalid Chalk template style argument: ${chunk} (in style '${name2}')`);
    }
  }
  return results;
}
function parseStyle(style) {
  STYLE_REGEX.lastIndex = 0;
  const results = [];
  let matches;
  while ((matches = STYLE_REGEX.exec(style)) !== null) {
    const name2 = matches[1];
    if (matches[2]) {
      const args = parseArguments(name2, matches[2]);
      results.push([name2].concat(args));
    } else {
      results.push([name2]);
    }
  }
  return results;
}
function buildStyle(chalk2, styles2) {
  const enabled = {};
  for (const layer of styles2) {
    for (const style of layer.styles) {
      enabled[style[0]] = layer.inverse ? null : style.slice(1);
    }
  }
  let current = chalk2;
  for (const [styleName, styles3] of Object.entries(enabled)) {
    if (!Array.isArray(styles3)) {
      continue;
    }
    if (!(styleName in current)) {
      throw new Error(`Unknown Chalk style: ${styleName}`);
    }
    current = styles3.length > 0 ? current[styleName](...styles3) : current[styleName];
  }
  return current;
}
var templates = (chalk2, temporary) => {
  const styles2 = [];
  const chunks = [];
  let chunk = [];
  temporary.replace(TEMPLATE_REGEX, (m, escapeCharacter, inverse, style, close, character) => {
    if (escapeCharacter) {
      chunk.push(unescape(escapeCharacter));
    } else if (style) {
      const string = chunk.join("");
      chunk = [];
      chunks.push(styles2.length === 0 ? string : buildStyle(chalk2, styles2)(string));
      styles2.push({ inverse, styles: parseStyle(style) });
    } else if (close) {
      if (styles2.length === 0) {
        throw new Error("Found extraneous } in Chalk template literal");
      }
      chunks.push(buildStyle(chalk2, styles2)(chunk.join("")));
      chunk = [];
      styles2.pop();
    } else {
      chunk.push(character);
    }
  });
  chunks.push(chunk.join(""));
  if (styles2.length > 0) {
    const errMessage = `Chalk template literal is missing ${styles2.length} closing bracket${styles2.length === 1 ? "" : "s"} (\`}\`)`;
    throw new Error(errMessage);
  }
  return chunks.join("");
};
const ansiStyles = ansiStyles$1.exports;
const { stdout: stdoutColor, stderr: stderrColor } = browser;
const {
  stringReplaceAll,
  stringEncaseCRLFWithFirstIndex
} = util;
const { isArray: isArray2 } = Array;
const levelMapping = [
  "ansi",
  "ansi",
  "ansi256",
  "ansi16m"
];
const styles = /* @__PURE__ */ Object.create(null);
const applyOptions = (object, options = {}) => {
  if (options.level && !(Number.isInteger(options.level) && options.level >= 0 && options.level <= 3)) {
    throw new Error("The `level` option should be an integer from 0 to 3");
  }
  const colorLevel = stdoutColor ? stdoutColor.level : 0;
  object.level = options.level === void 0 ? colorLevel : options.level;
};
class ChalkClass {
  constructor(options) {
    return chalkFactory(options);
  }
}
const chalkFactory = (options) => {
  const chalk2 = {};
  applyOptions(chalk2, options);
  chalk2.template = (...arguments_) => chalkTag(chalk2.template, ...arguments_);
  Object.setPrototypeOf(chalk2, Chalk.prototype);
  Object.setPrototypeOf(chalk2.template, chalk2);
  chalk2.template.constructor = () => {
    throw new Error("`chalk.constructor()` is deprecated. Use `new chalk.Instance()` instead.");
  };
  chalk2.template.Instance = ChalkClass;
  return chalk2.template;
};
function Chalk(options) {
  return chalkFactory(options);
}
for (const [styleName, style] of Object.entries(ansiStyles)) {
  styles[styleName] = {
    get() {
      const builder = createBuilder(this, createStyler(style.open, style.close, this._styler), this._isEmpty);
      Object.defineProperty(this, styleName, { value: builder });
      return builder;
    }
  };
}
styles.visible = {
  get() {
    const builder = createBuilder(this, this._styler, true);
    Object.defineProperty(this, "visible", { value: builder });
    return builder;
  }
};
const usedModels = ["rgb", "hex", "keyword", "hsl", "hsv", "hwb", "ansi", "ansi256"];
for (const model of usedModels) {
  styles[model] = {
    get() {
      const { level } = this;
      return function(...arguments_) {
        const styler = createStyler(ansiStyles.color[levelMapping[level]][model](...arguments_), ansiStyles.color.close, this._styler);
        return createBuilder(this, styler, this._isEmpty);
      };
    }
  };
}
for (const model of usedModels) {
  const bgModel = "bg" + model[0].toUpperCase() + model.slice(1);
  styles[bgModel] = {
    get() {
      const { level } = this;
      return function(...arguments_) {
        const styler = createStyler(ansiStyles.bgColor[levelMapping[level]][model](...arguments_), ansiStyles.bgColor.close, this._styler);
        return createBuilder(this, styler, this._isEmpty);
      };
    }
  };
}
const proto = Object.defineProperties(() => {
}, {
  ...styles,
  level: {
    enumerable: true,
    get() {
      return this._generator.level;
    },
    set(level) {
      this._generator.level = level;
    }
  }
});
const createStyler = (open, close, parent) => {
  let openAll;
  let closeAll;
  if (parent === void 0) {
    openAll = open;
    closeAll = close;
  } else {
    openAll = parent.openAll + open;
    closeAll = close + parent.closeAll;
  }
  return {
    open,
    close,
    openAll,
    closeAll,
    parent
  };
};
const createBuilder = (self, _styler, _isEmpty) => {
  const builder = (...arguments_) => {
    if (isArray2(arguments_[0]) && isArray2(arguments_[0].raw)) {
      return applyStyle(builder, chalkTag(builder, ...arguments_));
    }
    return applyStyle(builder, arguments_.length === 1 ? "" + arguments_[0] : arguments_.join(" "));
  };
  Object.setPrototypeOf(builder, proto);
  builder._generator = self;
  builder._styler = _styler;
  builder._isEmpty = _isEmpty;
  return builder;
};
const applyStyle = (self, string) => {
  if (self.level <= 0 || !string) {
    return self._isEmpty ? "" : string;
  }
  let styler = self._styler;
  if (styler === void 0) {
    return string;
  }
  const { openAll, closeAll } = styler;
  if (string.indexOf("\x1B") !== -1) {
    while (styler !== void 0) {
      string = stringReplaceAll(string, styler.close, styler.open);
      styler = styler.parent;
    }
  }
  const lfIndex = string.indexOf("\n");
  if (lfIndex !== -1) {
    string = stringEncaseCRLFWithFirstIndex(string, closeAll, openAll, lfIndex);
  }
  return openAll + string + closeAll;
};
let template;
const chalkTag = (chalk2, ...strings) => {
  const [firstString] = strings;
  if (!isArray2(firstString) || !isArray2(firstString.raw)) {
    return strings.join(" ");
  }
  const arguments_ = strings.slice(1);
  const parts = [firstString.raw[0]];
  for (let i = 1; i < firstString.length; i++) {
    parts.push(
      String(arguments_[i - 1]).replace(/[{}\\]/g, "\\$&"),
      String(firstString.raw[i])
    );
  }
  if (template === void 0) {
    template = templates;
  }
  return template(chalk2, parts.join(""));
};
Object.defineProperties(Chalk.prototype, styles);
const chalk = Chalk();
chalk.supportsColor = stdoutColor;
chalk.stderr = Chalk({ level: stderrColor ? stderrColor.level : 0 });
chalk.stderr.supportsColor = stderrColor;
var source = chalk;
const env = {
  stdout: (_a = globalThis == null ? void 0 : globalThis.process) == null ? void 0 : _a.stdout,
  stderr: (_b = globalThis == null ? void 0 : globalThis.process) == null ? void 0 : _b.stderr,
  defaultLogger: console
};
const getPositionByOffset = (str, offset) => {
  const rows = str.split("\n");
  const rowLengthList = rows.map((substr) => substr.length);
  const position2 = {
    offset,
    row: 0,
    column: 0,
    line: ""
  };
  while (position2.offset >= 0 && rows.length) {
    position2.row++;
    position2.column = position2.offset;
    position2.line = rows.shift() || "";
    position2.offset -= (rowLengthList.shift() || 0) + 1;
  }
  return position2;
};
var ValidationTarget = /* @__PURE__ */ ((ValidationTarget2) => {
  ValidationTarget2["VALUE"] = "value";
  ValidationTarget2["START_VALUE"] = "startValue";
  ValidationTarget2["END_VALUE"] = "endValue";
  ValidationTarget2["SPACE_AFTER"] = "spaceAfter";
  ValidationTarget2["INNER_SPACE_BEFORE"] = "innerSpaceBefore";
  return ValidationTarget2;
})(ValidationTarget || {});
const adjustedFullwidthPunctuations = `\u201C\u201D\u2018\u2019`;
const generateMarker = (str, index2) => {
  const prefix = str.substring(0, index2);
  let fullwidthCount = 0;
  let halfwidthCount = 0;
  for (let i = 0; i < prefix.length; i++) {
    const charType = checkCharType(prefix[i]);
    if (charType === CharType.CJK_CHAR || isFullwidthPunctuationType(charType) && adjustedFullwidthPunctuations.indexOf(prefix[i]) === -1) {
      fullwidthCount++;
    } else if (charType === CharType.WESTERN_LETTER || isHalfwidthPunctuationType(charType) && adjustedFullwidthPunctuations.indexOf(prefix[i]) !== -1 || charType === CharType.SPACE) {
      halfwidthCount++;
    }
  }
  return " ".repeat(halfwidthCount) + "\u3000".repeat(fullwidthCount) + `${source.red("^")}`;
};
const reportItem = (file = "", str, validations, logger = env.defaultLogger) => {
  validations.forEach(({ index: index2, length, target, message: message2 }) => {
    const finalIndex = target === "spaceAfter" || target === "endValue" ? index2 + length : index2;
    const { row, column, line } = getPositionByOffset(str, finalIndex);
    const fileDisplay = `${source.blue.bgWhite(file)}${file ? ":" : ""}`;
    const positionDisplay = `${source.yellow(row)}:${source.yellow(column)}`;
    const headline = `${fileDisplay}${positionDisplay} - ${message2}`;
    const displayRange = 20;
    const displayStart = column - displayRange < 0 ? 0 : column - displayRange;
    const displayEnd = column + length + displayRange > line.length - 1 ? line.length : column + length + displayRange;
    const displayFragment = line.substring(displayStart, displayEnd).replace(/\n/g, "\\n");
    const markerBelow = generateMarker(displayFragment, column - displayStart);
    logger.error(`${headline}

${displayFragment}
${markerBelow}
`);
  });
};
const report = (resultList, logger = env.defaultLogger) => {
  let errorCount = 0;
  const invalidFiles = [];
  resultList.filter(({ file, disabled }) => {
    if (disabled) {
      if (file) {
        logger.log(`${source.blue.bgWhite(file)}: disabled`);
      } else {
        logger.log(`disabled`);
      }
      return false;
    }
    return true;
  }).forEach(({ file, origin, validations }) => {
    reportItem(file, origin, validations, logger);
    errorCount += validations.length;
    if (file && validations.length) {
      invalidFiles.push(file);
    }
  });
  if (errorCount) {
    const errors = [];
    errors.push("Invalid files:");
    errors.push("- " + invalidFiles.join("\n- ") + "\n");
    errors.push(`Found ${errorCount} ${errorCount > 1 ? "errors" : "error"}.`);
    logger.error(errors.join("\n"));
    return 1;
  } else {
    logger.log(`No error found.`);
  }
};
const BRACKET_NOT_CLOSED = "\u62EC\u53F7\u672A\u95ED\u5408";
const BRACKET_NOT_OPEN = "\u62EC\u53F7\u672A\u5339\u914D";
const QUOTE_NOT_CLOSED = "\u5F15\u53F7\u672A\u95ED\u5408";
const QUOTE_NOT_OPEN = "\u5F15\u53F7\u672A\u5339\u914D";
const handlePunctuation = (i, char, type, status) => {
  finalizeLastToken(status, i);
  if (isBracketType(type)) {
    if (BRACKET_CHAR_SET.left.indexOf(char) >= 0) {
      initNewMark(status, i, char);
      addBracketToken(status, i, char, MarkSideType.LEFT);
    } else if (BRACKET_CHAR_SET.right.indexOf(char) >= 0) {
      if (!status.lastMark || !status.lastMark.startValue) {
        addUnmatchedToken(status, i, char);
        addError(status, i, BRACKET_NOT_OPEN);
      } else {
        addBracketToken(status, i, char, MarkSideType.RIGHT);
        finalizeCurrentMark(status, i, char);
      }
    }
    return;
  }
  if (isQuotationType(type)) {
    if (QUOTATION_CHAR_SET.neutral.indexOf(char) >= 0) {
      if (status.lastGroup && char === status.lastGroup.startValue) {
        finalizeCurrentGroup(status, i, char);
      } else {
        initNewGroup(status, i, char);
      }
    } else if (QUOTATION_CHAR_SET.left.indexOf(char) >= 0) {
      initNewGroup(status, i, char);
    } else if (QUOTATION_CHAR_SET.right.indexOf(char) >= 0) {
      if (!status.lastGroup || !status.lastGroup.startValue) {
        addUnmatchedToken(status, i, char);
        addError(status, i, QUOTE_NOT_OPEN);
      } else {
        finalizeCurrentGroup(status, i, char);
      }
    }
    return;
  }
  addSinglePunctuationToken(status, i, char, type);
};
const handleLetter = (i, char, type, status) => {
  if (status.lastToken) {
    if (status.lastToken.type !== type) {
      finalizeLastToken(status, i);
      initNewContent(status, i, char, type);
    } else {
      appendValue(status, char);
    }
  } else {
    initNewContent(status, i, char, type);
  }
};
const initNewStatus = (str, hyperMarks) => {
  const tokens = [];
  Object.assign(tokens, {
    type: GroupTokenType.GROUP,
    index: 0,
    spaceAfter: "",
    startIndex: 0,
    endIndex: str.length - 1,
    startValue: "",
    endValue: "",
    innerSpaceBefore: ""
  });
  const status = {
    lastToken: void 0,
    lastGroup: tokens,
    lastMark: void 0,
    tokens,
    marks: [...hyperMarks],
    groups: [],
    markStack: [],
    groupStack: [],
    errors: []
  };
  return status;
};
const finalizeLastToken = (status, index2) => {
  if (status.lastToken) {
    status.lastToken.length = index2 - status.lastToken.index;
    status.lastGroup && status.lastGroup.push(status.lastToken);
    status.lastToken = void 0;
  }
};
const finalizeCurrentToken = (status, token) => {
  status.lastGroup && status.lastGroup.push(token);
  status.lastToken = void 0;
};
const markTypeToTokenType = (type) => {
  switch (type) {
    case MarkType.HYPER:
      return HyperTokenType.HYPER_MARK;
    case MarkType.BRACKETS:
      return HyperTokenType.BRACKET_MARK;
    case MarkType.RAW:
      return HyperTokenType.INDETERMINATED;
  }
};
const addHyperToken = (status, index2, mark, value, markSide) => {
  const token = {
    type: markTypeToTokenType(mark.type),
    index: index2,
    length: value.length,
    value,
    spaceAfter: "",
    mark,
    markSide
  };
  finalizeCurrentToken(status, token);
};
const addRawContent = (status, index2, value) => {
  const token = {
    type: getHyperContentType(value),
    index: index2,
    length: value.length,
    value,
    spaceAfter: ""
  };
  finalizeCurrentToken(status, token);
};
const initNewMark = (status, index2, char, type = MarkType.BRACKETS) => {
  if (status.lastMark) {
    status.markStack.push(status.lastMark);
    status.lastMark = void 0;
  }
  const mark = {
    type,
    startIndex: index2,
    startValue: char,
    endIndex: -1,
    endValue: ""
  };
  status.marks.push(mark);
  status.lastMark = mark;
};
const addBracketToken = (status, index2, char, markSide) => {
  const token = {
    type: HyperTokenType.BRACKET_MARK,
    index: index2,
    length: 1,
    value: char,
    spaceAfter: "",
    mark: status.lastMark,
    markSide
  };
  finalizeCurrentToken(status, token);
};
const finalizeCurrentMark = (status, index2, char) => {
  if (!status.lastMark) {
    return;
  }
  status.lastMark.endIndex = index2;
  status.lastMark.endValue = char;
  if (status.markStack.length > 0) {
    status.lastMark = status.markStack.pop();
  } else {
    status.lastMark = void 0;
  }
};
const addSinglePunctuationToken = (status, index2, char, type) => {
  const token = {
    type,
    index: index2,
    length: 1,
    value: char,
    spaceAfter: ""
  };
  finalizeCurrentToken(status, token);
};
const addUnmatchedToken = (status, i, char) => {
  const token = {
    type: HyperTokenType.UNMATCHED,
    index: i,
    length: 1,
    value: char,
    spaceAfter: ""
  };
  finalizeCurrentToken(status, token);
};
const initNewGroup = (status, index2, char) => {
  status.lastGroup && status.groupStack.push(status.lastGroup);
  const lastGroup = [];
  Object.assign(lastGroup, {
    type: GroupTokenType.GROUP,
    index: index2,
    spaceAfter: "",
    startIndex: index2,
    startValue: char,
    endIndex: -1,
    endValue: "",
    innerSpaceBefore: ""
  });
  status.groupStack[status.groupStack.length - 1].push(lastGroup);
  status.lastGroup = lastGroup;
  status.groups.push(lastGroup);
};
const finalizeCurrentGroup = (status, index2, char) => {
  if (status.lastGroup) {
    status.lastGroup.endIndex = index2;
    status.lastGroup.endValue = char;
  }
  if (status.groupStack.length > 0) {
    status.lastGroup = status.groupStack.pop();
  } else {
    status.lastGroup = void 0;
  }
};
const initNewContent = (status, index2, char, type) => {
  status.lastToken = {
    type,
    index: index2,
    length: 1,
    value: char,
    spaceAfter: ""
  };
};
const appendValue = (status, char) => {
  if (status.lastToken) {
    status.lastToken.value += char;
    status.lastToken.length++;
  }
};
const getConnectingSpaceLength = (str, start) => {
  if (checkCharType(str[start]) !== CharType.SPACE) {
    return 0;
  }
  for (let i = start + 1; i < str.length; i++) {
    const char = str[i];
    const type = checkCharType(char);
    if (type !== CharType.SPACE) {
      return i - start;
    }
  }
  return str.length - start;
};
const getPreviousToken = (status) => {
  if (status.lastGroup) {
    return status.lastGroup[status.lastGroup.length - 1];
  }
};
const getHyperMarkMap = (hyperMarks) => {
  const hyperMarkMap = {};
  hyperMarks.forEach((mark) => {
    hyperMarkMap[mark.startIndex] = mark;
    if (mark.type !== MarkType.RAW) {
      hyperMarkMap[mark.endIndex] = mark;
    }
  });
  return hyperMarkMap;
};
const isShorthand = (str, status, index2, char) => {
  if (SHORTHAND_CHARS.indexOf(char) < 0) {
    return false;
  }
  if (!status.lastToken || status.lastToken.type !== CharType.WESTERN_LETTER) {
    return false;
  }
  const nextChar = str[index2 + 1];
  const nextType = checkCharType(nextChar);
  if (nextType === CharType.WESTERN_LETTER || nextType === CharType.SPACE) {
    if (!status.lastGroup) {
      return true;
    }
    if (status.lastGroup.startValue !== SHORTHAND_PAIR_SET[char]) {
      return true;
    }
  }
  return false;
};
const getHyperContentType = (content) => {
  if (content.match(/\n/)) {
    return HyperTokenType.HYPER_CONTENT;
  }
  if (content.match(/^<code.*>.*<\/code.*>$/)) {
    return HyperTokenType.CODE_CONTENT;
  }
  if (content.match(/^<.+>$/)) {
    return HyperTokenType.HYPER_CONTENT;
  }
  return HyperTokenType.CODE_CONTENT;
};
const addError = (status, index2, message2) => {
  status.errors.push({
    name: "",
    index: index2,
    length: 0,
    message: message2,
    target: ValidationTarget.VALUE
  });
};
const handleErrors = (status) => {
  const lastMark = status.lastMark;
  if (lastMark && lastMark.type === MarkType.BRACKETS && !lastMark.endValue) {
    addError(status, lastMark.startIndex, BRACKET_NOT_CLOSED);
  }
  if (status.markStack.length > 0) {
    status.markStack.forEach((mark) => {
      if (mark !== lastMark) {
        addError(status, mark.startIndex, BRACKET_NOT_CLOSED);
      }
    });
  }
  const lastGroup = status.lastGroup;
  if (lastGroup && lastGroup.startValue && !lastGroup.endValue) {
    addError(status, lastGroup.startIndex, QUOTE_NOT_CLOSED);
  }
  if (status.groupStack.length > 0) {
    status.groupStack.forEach((group) => {
      if (group !== lastGroup && group.startValue && !group.endValue) {
        addError(status, group.startIndex, QUOTE_NOT_CLOSED);
      }
    });
  }
};
const parse = (str, hyperMarks = []) => {
  const status = initNewStatus(str, hyperMarks);
  const hyperMarkMap = getHyperMarkMap(hyperMarks);
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    const type = checkCharType(char);
    const hyperMark = hyperMarkMap[i];
    if (hyperMark) {
      finalizeLastToken(status, i);
      delete hyperMarkMap[i];
      if (hyperMark.type === MarkType.RAW) {
        addRawContent(
          status,
          i,
          str.substring(hyperMark.startIndex, hyperMark.endIndex)
        );
        i = hyperMark.endIndex - 1;
      } else {
        if (i === hyperMark.startIndex) {
          addHyperToken(
            status,
            i,
            hyperMark,
            hyperMark.startValue,
            MarkSideType.LEFT
          );
          i += hyperMark.startValue.length - 1;
        } else if (i === hyperMark.endIndex) {
          addHyperToken(
            status,
            i,
            hyperMark,
            hyperMark.endValue,
            MarkSideType.RIGHT
          );
          i += hyperMark.endValue.length - 1;
        }
      }
    } else if (type === CharType.SPACE) {
      finalizeLastToken(status, i);
      if (status.lastGroup) {
        const spaceLength = getConnectingSpaceLength(str, i);
        const spaces = str.substring(i, i + spaceLength);
        if (status.lastGroup.length) {
          const lastToken = getPreviousToken(status);
          if (lastToken) {
            lastToken.spaceAfter = spaces;
          }
        } else {
          status.lastGroup.innerSpaceBefore = spaces;
        }
        if (spaceLength - 1 > 0) {
          i += spaceLength - 1;
        }
      }
    } else if (isShorthand(str, status, i, char)) {
      appendValue(status, char);
    } else if (isPunctuationType(type)) {
      handlePunctuation(i, char, type, status);
    } else if (isLetterType(type)) {
      handleLetter(i, char, type, status);
    } else if (type === CharType.EMPTY)
      ;
    else {
      handleLetter(i, char, CharType.WESTERN_LETTER, status);
    }
  }
  finalizeLastToken(status, str.length);
  handleErrors(status);
  return {
    tokens: status.tokens,
    groups: status.groups,
    marks: status.marks,
    errors: status.errors
  };
};
const toMutableToken = (token) => {
  if (Array.isArray(token)) {
    const mutableToken = token;
    mutableToken.modifiedType = token.type;
    mutableToken.modifiedValue = token.value;
    mutableToken.modifiedSpaceAfter = token.spaceAfter;
    mutableToken.modifiedStartValue = token.startValue;
    mutableToken.modifiedEndValue = token.endValue;
    mutableToken.modifiedInnerSpaceBefore = token.innerSpaceBefore;
    mutableToken.validations = [];
    token.forEach(toMutableToken);
    return mutableToken;
  } else {
    const mutableToken = token;
    mutableToken.modifiedType = token.type;
    mutableToken.modifiedValue = token.value;
    mutableToken.modifiedSpaceAfter = token.spaceAfter;
    mutableToken.validations = [];
    return mutableToken;
  }
};
const toMutableMark = (mark) => {
  const mutableMark = mark;
  mutableMark.modifiedStartValue = mark.startValue;
  mutableMark.modifiedEndValue = mark.endValue;
  return mutableMark;
};
const toMutableResult = (result, options = {}) => {
  if (!options.noSinglePair) {
    result.errors.length = 0;
  }
  toMutableToken(result.tokens);
  result.marks.forEach(toMutableMark);
  return result;
};
const travel = (group, handler) => {
  for (let i = 0; i < group.length; i++) {
    const token = group[i];
    handler(token, i, group);
    if (Array.isArray(token)) {
      travel(token, handler);
    }
  }
};
const parsePosition = (position2) => {
  var _a2, _b2;
  return {
    start: ((_a2 = position2 == null ? void 0 : position2.start) == null ? void 0 : _a2.offset) || 0,
    end: ((_b2 = position2 == null ? void 0 : position2.end) == null ? void 0 : _b2.offset) || 0
  };
};
const isParent = (node) => {
  return node.children !== void 0;
};
const blockTypes = ["paragraph", "heading", "table-cell"];
const isBlock = (node) => {
  return blockTypes.indexOf(node.type) >= 0;
};
const inlineContentTypes = [
  "emphasis",
  "strong",
  "delete",
  "footnote",
  "link",
  "linkReference"
];
const isInlineContent = (node) => {
  return inlineContentTypes.indexOf(node.type) >= 0;
};
const inlineRawTypes = [
  "inlineCode",
  "break",
  "image",
  "imageReference",
  "footnoteReference",
  "html"
];
const isInlineRaw = (node) => {
  return inlineRawTypes.indexOf(node.type) >= 0;
};
const travelBlocks = (node, blocks) => {
  if (isParent(node)) {
    node.children.forEach((child) => {
      if (child.type === "yaml") {
        return;
      }
      if (isBlock(child)) {
        const blockMark = {
          block: child,
          inlineMarks: [],
          hyperMarks: [],
          value: ""
        };
        blocks.push(blockMark);
        travelInlines(child, blockMark);
      } else {
        travelBlocks(child, blocks);
      }
    });
  }
};
const travelInlines = (node, blockMark) => {
  if (isParent(node)) {
    node.children.forEach((child) => {
      if (isInlineContent(child)) {
        blockMark.inlineMarks.push({ inline: child, raw: false });
        travelInlines(child, blockMark);
      }
      if (isInlineRaw(child)) {
        blockMark.inlineMarks.push({ inline: child, raw: true });
      }
    });
  }
};
const processBlockMark = (blockMark, str) => {
  const { block, inlineMarks } = blockMark;
  if (!block.position) {
    return;
  }
  const offset = block.position.start.offset || 0;
  const marks = [];
  const unresolvedCodeMarks = [];
  inlineMarks.forEach((inlineMark) => {
    const { inline } = inlineMark;
    if (!inline.position) {
      return;
    }
    const startOffset = inline.position.start.offset || 0;
    const endOffset = inline.position.end.offset || 0;
    if (isInlineRaw(inline)) {
      const mark = {
        type: MarkType.RAW,
        meta: inline.type,
        startIndex: startOffset - offset,
        endIndex: endOffset - offset,
        startValue: str.substring(startOffset, endOffset),
        endValue: ""
      };
      if (mark.startValue.match(/<code.*>/)) {
        const rawMark = { ...mark, code: MarkSideType.LEFT };
        unresolvedCodeMarks.push(rawMark);
        marks.push(rawMark);
        return;
      } else if (mark.startValue.match(/<\/code.*>/)) {
        const rawMark = { ...mark, code: MarkSideType.RIGHT };
        const leftCode = unresolvedCodeMarks.pop();
        if (leftCode) {
          leftCode.rightPair = rawMark;
        }
        marks.push(rawMark);
        return;
      }
      marks.push(mark);
    } else {
      const firstChild = inline.children[0];
      const lastChild = inline.children[inline.children.length - 1];
      if (!firstChild.position || !lastChild.position) {
        return;
      }
      const innerStartOffset = firstChild.position.start.offset || 0;
      const innerEndOffset = lastChild.position.end.offset || 0;
      const mark = {
        type: MarkType.HYPER,
        meta: inline.type,
        startIndex: startOffset - offset,
        startValue: str.substring(startOffset, innerStartOffset),
        endIndex: innerEndOffset - offset,
        endValue: str.substring(innerEndOffset, endOffset)
      };
      marks.push(mark);
    }
  });
  blockMark.value = str.substring(
    block.position.start.offset || 0,
    block.position.end.offset || 0
  );
  blockMark.hyperMarks = marks.map((mark) => {
    if (isRawMark(mark)) {
      if (mark.code === MarkSideType.RIGHT) {
        return;
      }
      if (mark.code === MarkSideType.LEFT) {
        const { rightPair } = mark;
        mark.startValue = str.substring(
          mark.startIndex + offset,
          mark.endIndex + offset
        );
        mark.endIndex = (rightPair == null ? void 0 : rightPair.endIndex) || 0;
        mark.endValue = "";
        delete mark.rightPair;
      }
    }
    return mark;
  }).filter(Boolean);
};
const parser = (data) => {
  const value = data.value;
  const modifiedValue = data.modifiedValue;
  const ignoredByParsers = data.ignoredByParsers;
  const blockMarks = [];
  const tree = unified_1().use(remarkParse).use(remarkFrontmatter).parse(modifiedValue);
  travelBlocks(tree, blockMarks);
  blockMarks.forEach((blockMark) => processBlockMark(blockMark, value));
  data.blocks = blockMarks.map((b) => {
    const position2 = parsePosition(b.block.position);
    ignoredByParsers.forEach(({ index: index2, length, originValue: raw, meta }) => {
      if (position2.start <= index2 && position2.end >= index2 + length) {
        if (b.hyperMarks) {
          b.hyperMarks.push({
            type: MarkType.RAW,
            meta,
            startIndex: index2 - position2.start,
            startValue: raw,
            endIndex: index2 - position2.start + length,
            endValue: ""
          });
        }
      }
    });
    return {
      value: b.value || "",
      marks: b.hyperMarks || [],
      ...position2
    };
  });
  data.ignoredByParsers = [];
  return data;
};
const CODE_SPACE_OUTSIDE = "\u6B64\u5904\u5185\u8054\u4EE3\u7801\u7684\u5916\u90E8\u9700\u8981\u4E00\u4E2A\u7A7A\u683C";
const CODE_NOSPACE_OUTSIDE = "\u6B64\u5904\u5185\u8054\u4EE3\u7801\u7684\u5916\u90E8\u4E0D\u9700\u8981\u7A7A\u683C";
const MARKDOWN_NOSPACE_INSIDE = "\u6B64\u5904 Markdown \u6807\u8BB0\u7684\u5185\u90E8\u4E0D\u9700\u8981\u7A7A\u683C";
const PUNCTUATION_UNIFICATION = "\u6B64\u5904\u5B57\u7B26\u9700\u8981\u7EDF\u4E00";
const PUNCTUATION_FULL_WIDTH = "\u6B64\u5904\u6807\u70B9\u7B26\u53F7\u9700\u8981\u4F7F\u7528\u5168\u89D2";
const PUNCTUATION_HALF_WIDTH = "\u6B64\u5904\u6807\u70B9\u7B26\u53F7\u9700\u8981\u4F7F\u7528\u534A\u89D2";
const PUNCTUATION_NOSPACE_BEFORE = "\u6B64\u5904\u6807\u70B9\u7B26\u53F7\u524D\u4E0D\u9700\u8981\u7A7A\u683C";
const PUNCTUATION_NOSPACE_AFTER = "\u6B64\u5904\u6807\u70B9\u7B26\u53F7\u540E\u4E0D\u9700\u8981\u7A7A\u683C";
const PUNCTUATION_SPACE_AFTER = "\u6B64\u5904\u6807\u70B9\u7B26\u53F7\u540E\u9700\u8981\u4E00\u4E2A\u7A7A\u683C";
const BRACKET_NOSPACE_INSIDE = "\u6B64\u5904\u62EC\u53F7\u7684\u5185\u90E8\u4E0D\u9700\u8981\u7A7A\u683C";
const BRACKET_NOSPACE_OUTSIDE = "\u6B64\u5904\u62EC\u53F7\u7684\u5916\u90E8\u4E0D\u9700\u8981\u7A7A\u683C";
const BRACKET_SPACE_OUTSIDE = "\u6B64\u5904\u62EC\u53F7\u7684\u5916\u90E8\u9700\u8981\u4E00\u4E2A\u7A7A\u683C";
const CONTENT_SPACE_HALF_WIDTH = "\u6B64\u5904\u534A\u89D2\u5185\u5BB9\u4E4B\u95F4\u9700\u8981\u4E00\u4E2A\u7A7A\u683C";
const CONTENT_NOSPACE_FULL_WIDTH = "\u6B64\u5904\u5168\u89D2\u5185\u5BB9\u4E4B\u95F4\u4E0D\u9700\u8981\u7A7A\u683C";
const CONTENT_SPACE_MIXED_WIDTH = "\u6B64\u5904\u4E2D\u82F1\u6587\u5185\u5BB9\u4E4B\u95F4\u9700\u8981\u4E00\u4E2A\u7A7A\u683C";
const CONTENT_NOSPACE_MIXED_WIDTH = "\u6B64\u5904\u4E2D\u82F1\u6587\u5185\u5BB9\u4E4B\u95F4\u9700\u8981\u4E00\u4E2A\u7A7A\u683C";
const QUOTE_NOSPACE_INSIDE = "\u6B64\u5904\u5F15\u53F7\u7684\u5185\u90E8\u4E0D\u9700\u8981\u7A7A\u683C";
const QUOTE_NOSPACE_OUTSIDE = "\u6B64\u5904\u5F15\u53F7\u7684\u5916\u90E8\u4E0D\u9700\u8981\u7A7A\u683C";
const QUOTE_SPACE_OUTSIDE = "\u6B64\u5904\u5F15\u53F7\u7684\u5916\u90E8\u9700\u8981\u4E00\u4E2A\u7A7A\u683C";
const TRIM_SPACE = "\u6B64\u5904\u9700\u8981\u53BB\u9664\u5916\u90E8\u7A7A\u683C";
const findTokenBefore = (group, token) => {
  if (!token) {
    return;
  }
  const index2 = group.indexOf(token);
  if (index2 < 0) {
    return;
  }
  return group[index2 - 1];
};
const findTokenAfter = (group, token) => {
  if (!token) {
    return;
  }
  const index2 = group.indexOf(token);
  if (index2 < 0) {
    return;
  }
  return group[index2 + 1];
};
const findNonCodeVisibleTokenBefore = (group, token) => {
  if (!token) {
    return;
  }
  const beforeToken = findTokenBefore(group, token);
  if (!beforeToken) {
    return;
  }
  if (isInvisibleType(beforeToken.type) || getHtmlTagSide(beforeToken)) {
    return findNonCodeVisibleTokenBefore(group, beforeToken);
  }
  if (isNonCodeVisibleType(beforeToken.type)) {
    return beforeToken;
  }
  return;
};
const findNonCodeVisibleTokenAfter = (group, token) => {
  if (!token) {
    return;
  }
  const afterToken = findTokenAfter(group, token);
  if (!afterToken) {
    return;
  }
  if (isInvisibleType(afterToken.type) || getHtmlTagSide(afterToken)) {
    return findNonCodeVisibleTokenAfter(group, afterToken);
  }
  if (isNonCodeVisibleType(afterToken.type)) {
    return afterToken;
  }
  return;
};
const findVisibleTokenBefore = (group, token) => {
  if (!token) {
    return;
  }
  const beforeToken = findTokenBefore(group, token);
  if (!beforeToken) {
    return;
  }
  if (isInvisibleType(beforeToken.type) || getHtmlTagSide(beforeToken)) {
    return findVisibleTokenBefore(group, beforeToken);
  }
  if (isVisibleType(beforeToken.type)) {
    return beforeToken;
  }
  return;
};
const findVisibleTokenAfter = (group, token) => {
  if (!token) {
    return;
  }
  const afterToken = findTokenAfter(group, token);
  if (!afterToken) {
    return;
  }
  if (isInvisibleType(afterToken.type) || getHtmlTagSide(afterToken)) {
    return findVisibleTokenAfter(group, afterToken);
  }
  if (isVisibleType(afterToken.type)) {
    return afterToken;
  }
  return;
};
const isHtmlTag = (token) => {
  if (token.type !== HyperTokenType.HYPER_CONTENT) {
    return false;
  }
  return !!token.value.match(/^<.+>$/);
};
const getHtmlTagSide = (token) => {
  if (!isHtmlTag(token)) {
    return;
  }
  if (token.value.match(/^<code.*>.*<\/code.*>$/)) {
    return;
  }
  if (token.value.match(/^<[^/].+\/\s*>$/)) {
    return;
  }
  if (token.value.match(/^<[^/].+>$/)) {
    return MarkSideType.LEFT;
  }
  if (token.value.match(/^<\/.+>$/)) {
    return MarkSideType.RIGHT;
  }
};
const isWrapper = (token) => {
  return token.type === HyperTokenType.HYPER_MARK || !!getHtmlTagSide(token);
};
const getWrapperSide = (token) => {
  if (token.type === HyperTokenType.HYPER_MARK) {
    return token.markSide;
  }
  return getHtmlTagSide(token);
};
const spreadHyperMarkSeq = (group, token, seq, isBackward) => {
  if (isBackward) {
    const tokenBefore = findTokenBefore(group, token);
    if (tokenBefore && isWrapper(tokenBefore)) {
      seq.unshift(tokenBefore);
      spreadHyperMarkSeq(group, tokenBefore, seq, isBackward);
    }
  } else {
    const tokenAfter = findTokenAfter(group, token);
    if (tokenAfter && isWrapper(tokenAfter)) {
      seq.push(tokenAfter);
      spreadHyperMarkSeq(group, tokenAfter, seq, isBackward);
    }
  }
};
const findConnectedWrappers = (group, token) => {
  const seq = [token];
  spreadHyperMarkSeq(group, token, seq, false);
  spreadHyperMarkSeq(group, token, seq, true);
  return seq;
};
const findSpaceHostInHyperMarkSeq = (group, hyperMarkSeq) => {
  if (!hyperMarkSeq.length) {
    return;
  }
  const firstMark = hyperMarkSeq[0];
  const lastMark = hyperMarkSeq[hyperMarkSeq.length - 1];
  const firstMarkSide = getWrapperSide(firstMark);
  const lastMarkSide = getWrapperSide(lastMark);
  const tokenBefore = findTokenBefore(group, firstMark);
  if (!tokenBefore) {
    return;
  }
  if (!firstMarkSide || !lastMarkSide) {
    return;
  }
  if (firstMarkSide === lastMarkSide) {
    if (firstMarkSide === MarkSideType.LEFT) {
      return tokenBefore;
    }
    return lastMark;
  }
  if (firstMarkSide === MarkSideType.LEFT) {
    return;
  }
  let target = tokenBefore;
  while (target && target !== lastMark) {
    const nextToken = findTokenAfter(group, target);
    if (nextToken && getWrapperSide(nextToken) === MarkSideType.LEFT) {
      return target;
    }
    target = nextToken;
  }
  return tokenBefore;
};
const findWrappersBetween = (group, before, after) => {
  if (!before || !after) {
    return {
      spaceHost: void 0,
      wrappers: [],
      tokens: []
    };
  }
  const firstMark = findTokenAfter(group, before);
  const firstVisible = findVisibleTokenAfter(group, before);
  if (!firstMark || firstVisible !== after) {
    return {
      spaceHost: void 0,
      wrappers: [],
      tokens: []
    };
  }
  if (firstMark === after) {
    return {
      spaceHost: before,
      wrappers: [],
      tokens: [before]
    };
  }
  const markSeq = findConnectedWrappers(group, firstMark);
  const spaceHost = findSpaceHostInHyperMarkSeq(group, markSeq);
  return {
    spaceHost,
    wrappers: markSeq,
    tokens: [before, ...markSeq]
  };
};
const isHalfwidthPunctuationWithoutSpaceAround = (group, token) => {
  const tokenBefore = findTokenBefore(group, token);
  const tokenAfter = findTokenAfter(group, token);
  if (isHalfwidthPunctuationType(token.type) && tokenBefore && tokenBefore.type === CharType.WESTERN_LETTER && tokenAfter && tokenAfter.type === CharType.WESTERN_LETTER) {
    return !tokenBefore.spaceAfter && !token.spaceAfter;
  }
  return false;
};
const isSuccessiveHalfwidthPunctuation = (group, token) => {
  if (isHalfwidthPunctuationType(token.type)) {
    const tokenBefore = findTokenBefore(group, token);
    const tokenAfter = findTokenAfter(group, token);
    if (tokenBefore && isHalfwidthPunctuationType(tokenBefore.type) && !tokenBefore.spaceAfter || tokenAfter && isHalfwidthPunctuationType(tokenAfter.type) && !token.spaceAfter) {
      return true;
    }
  }
  return false;
};
const createValidation = (token, target, message2, name2) => {
  const validation = {
    index: token.index,
    length: token.length,
    target,
    name: name2,
    message: message2
  };
  if (target === ValidationTarget.START_VALUE) {
    validation.index = token.startIndex;
    validation.length = 0;
  } else if (target === ValidationTarget.END_VALUE) {
    validation.index = token.endIndex;
    validation.length = 0;
  } else if (target === ValidationTarget.INNER_SPACE_BEFORE) {
    validation.index = token.startIndex;
    validation.length = token.startValue.length;
  }
  return validation;
};
const setValidationOnTarget = (token, target, message2, name2) => {
  const validation = createValidation(token, target, message2, name2);
  removeValidationOnTarget(token, target);
  token.validations.push(validation);
};
const removeValidationOnTarget = (token, target) => {
  token.validations = token.validations.filter(
    (validation) => validation.target !== target
  );
};
const genChecker = (key, target) => {
  return (token, value, message2) => {
    if (token[key] !== value) {
      token[key] = value;
      setValidationOnTarget(token, target, message2, "");
    }
  };
};
const checkSpaceAfter = genChecker(
  "modifiedSpaceAfter",
  ValidationTarget.SPACE_AFTER
);
const checkStartValue = genChecker(
  "modifiedStartValue",
  ValidationTarget.START_VALUE
);
const checkEndValue = genChecker(
  "modifiedEndValue",
  ValidationTarget.END_VALUE
);
const checkInnerSpaceBefore = genChecker(
  "modifiedInnerSpaceBefore",
  ValidationTarget.INNER_SPACE_BEFORE
);
const checkValue = (token, value, type, message2) => {
  if (token.modifiedValue === value) {
    return;
  }
  token.modifiedValue = value;
  if (type) {
    token.modifiedType = type;
  }
  setValidationOnTarget(token, ValidationTarget.VALUE, message2, "");
};
const generateHandler$c = (options) => {
  const trimSpaceOption = options == null ? void 0 : options.trimSpace;
  return (token, index2, group) => {
    if (!trimSpaceOption) {
      return;
    }
    if (!group.startValue && index2 === 0) {
      if (group.modifiedInnerSpaceBefore) {
        checkInnerSpaceBefore(group, "", TRIM_SPACE);
      }
      if (isWrapper(token)) {
        findConnectedWrappers(group, token).forEach(
          (x) => checkSpaceAfter(x, "", TRIM_SPACE)
        );
      }
      const lastToken = group[group.length - 1];
      if (lastToken) {
        if (isWrapper(lastToken)) {
          const lastContentToken = findVisibleTokenBefore(group, token);
          if (lastContentToken) {
            findConnectedWrappers(group, lastToken).forEach(
              (x) => checkSpaceAfter(x, "", TRIM_SPACE)
            );
            checkSpaceAfter(lastContentToken, "", TRIM_SPACE);
          }
        } else {
          checkSpaceAfter(lastToken, "", TRIM_SPACE);
        }
      }
    }
  };
};
const widthPairList = [
  [`,`, `\uFF0C`],
  [`.`, `\u3002`],
  [`;`, `\uFF1B`],
  [`:`, `\uFF1A`],
  [`?`, `\uFF1F`],
  [`!`, `\uFF01`],
  [`(`, `\uFF08`],
  [`)`, `\uFF09`],
  [`[`, `\uFF3B`],
  [`]`, `\uFF3D`],
  [`{`, `\uFF5B`],
  [`}`, `\uFF5D`]
];
const widthSidePairList = [
  [`"`, `\u201C`, `\u201D`],
  [`'`, `\u2018`, `\u2019`]
];
const checkAdjusted = (token, adjusted) => {
  if (adjusted.indexOf(token.modifiedValue) >= 0) {
    token.modifiedType = getHalfwidthTokenType(token.type);
  }
};
const parseOptions = (options) => {
  const halfwidthOption = (options == null ? void 0 : options.halfwidthPunctuation) || "";
  const fullwidthOption = (options == null ? void 0 : options.fullwidthPunctuation) || "";
  const adjustedFullwidthOption = (options == null ? void 0 : options.adjustedFullwidthPunctuation) || "";
  const halfwidthMap = {};
  const fullwidthMap = {};
  const fullwidthPairMap = {};
  widthPairList.forEach(([halfwidth, fullwidth]) => {
    if (halfwidthOption.indexOf(halfwidth) >= 0) {
      halfwidthMap[fullwidth] = halfwidth;
    }
    if (fullwidthOption.indexOf(fullwidth) >= 0) {
      fullwidthMap[halfwidth] = fullwidth;
    }
  });
  widthSidePairList.forEach(([half, left2, right2]) => {
    if (halfwidthOption.indexOf(half) >= 0) {
      halfwidthMap[left2] = half;
      halfwidthMap[right2] = half;
    }
    if (fullwidthOption.indexOf(left2) >= 0 || fullwidthOption.indexOf(right2) >= 0) {
      fullwidthPairMap[half] = [left2, right2];
    }
  });
  return {
    halfwidthMap,
    fullwidthMap,
    fullwidthPairMap,
    adjusted: adjustedFullwidthOption
  };
};
const generateHandler$b = (options) => {
  const { halfwidthMap, fullwidthMap, fullwidthPairMap, adjusted } = parseOptions(options);
  const handleHyperSpaceOption = (token, _, group) => {
    if (!isSinglePunctuationType(token.type) && token.type !== HyperTokenType.BRACKET_MARK && token.type !== GroupTokenType.GROUP) {
      return;
    }
    if (isHalfwidthPunctuationWithoutSpaceAround(group, token)) {
      return;
    }
    if (isSuccessiveHalfwidthPunctuation(group, token)) {
      return;
    }
    if (isSinglePunctuationType(token.type) || token.type === HyperTokenType.BRACKET_MARK) {
      const value = token.modifiedValue;
      if (fullwidthMap[value]) {
        checkValue(
          token,
          fullwidthMap[value],
          getFullwidthTokenType(token.type),
          PUNCTUATION_FULL_WIDTH
        );
        checkAdjusted(token, adjusted);
      } else if (halfwidthMap[value]) {
        checkValue(
          token,
          halfwidthMap[value],
          getHalfwidthTokenType(token.type),
          PUNCTUATION_HALF_WIDTH
        );
      }
      return;
    }
    const startValue = token.modifiedStartValue;
    const endValue = token.modifiedEndValue;
    if (fullwidthPairMap[startValue]) {
      checkStartValue(
        token,
        fullwidthPairMap[startValue][0],
        PUNCTUATION_FULL_WIDTH
      );
    } else if (halfwidthMap[startValue]) {
      checkStartValue(
        token,
        halfwidthMap[startValue][0],
        PUNCTUATION_HALF_WIDTH
      );
    }
    if (fullwidthPairMap[endValue]) {
      checkEndValue(
        token,
        fullwidthPairMap[endValue][1],
        PUNCTUATION_FULL_WIDTH
      );
    } else if (halfwidthMap[endValue]) {
      checkEndValue(token, halfwidthMap[endValue][1], PUNCTUATION_HALF_WIDTH);
    }
  };
  return handleHyperSpaceOption;
};
const defaultUnifiedMap = {
  "\uFF1F\uFF1F": ["\u2047"],
  "\uFF01\uFF01": ["\u203C"],
  "\uFF1F\uFF01": ["\u2048"],
  "\uFF01\uFF1F": ["\u2049"],
  "/": ["/", "\uFF0F"],
  "~": ["~", "\uFF5E"],
  "\u2026": ["\u2026", "\u22EF"],
  "\xB7": ["\u25CF", "\u2022", "\xB7", "\u2027", "\u30FB"]
};
const simplifiedUnifiedMap = {
  "\u201C": ["\u300C"],
  "\u201D": ["\u300D"],
  "\u2018": ["\u300E"],
  "\u2019": ["\u300F"]
};
const traditionalUnifiedMap = {
  "\u300C": ["\u201C"],
  "\u300D": ["\u201D"],
  "\u300E": ["\u2018"],
  "\u300F": ["\u2019"]
};
const revertUnifiedMap = (unifiedMap) => {
  const result = {};
  for (const key in unifiedMap) {
    const value = unifiedMap[key];
    value.forEach((v) => {
      result[v] = key;
    });
  }
  return result;
};
const getRevertedUnifiedMap = (options) => {
  const unifiedOption = options == null ? void 0 : options.unifiedPunctuation;
  const langType = typeof unifiedOption === "string" ? unifiedOption : void 0;
  const unifiedMap = {};
  if (langType) {
    Object.assign(unifiedMap, defaultUnifiedMap);
    if (langType === "simplified") {
      Object.assign(unifiedMap, simplifiedUnifiedMap);
    } else if (langType === "traditional") {
      Object.assign(unifiedMap, traditionalUnifiedMap);
    }
  } else if (typeof unifiedOption === "object") {
    if (unifiedOption.default) {
      Object.assign(unifiedMap, defaultUnifiedMap);
    }
    Object.entries(unifiedOption).forEach(([key, value]) => {
      if (value === true) {
        unifiedMap[key] = defaultUnifiedMap[key];
      } else if (value === false) {
        delete unifiedMap[key];
      } else {
        unifiedMap[key] = value;
      }
    });
  }
  return revertUnifiedMap(unifiedMap);
};
const generateHandler$a = (options) => {
  const charMap = getRevertedUnifiedMap(options);
  const handlerPunctuationUnified = (token) => {
    if (token.type === GroupTokenType.GROUP) {
      if (charMap[token.modifiedStartValue]) {
        checkStartValue(
          token,
          charMap[token.modifiedStartValue],
          PUNCTUATION_UNIFICATION
        );
      }
      if (charMap[token.modifiedEndValue]) {
        checkEndValue(
          token,
          charMap[token.modifiedEndValue],
          PUNCTUATION_UNIFICATION
        );
      }
      return;
    } else {
      if (charMap[token.modifiedValue]) {
        checkValue(
          token,
          charMap[token.modifiedValue],
          void 0,
          PUNCTUATION_UNIFICATION
        );
      }
    }
  };
  return handlerPunctuationUnified;
};
const reverseAbbrsIntoChars = (abbrs) => {
  return abbrs.map((str) => str.split(".").reverse().slice(1));
};
const matchAbbr = (token, group, reversedAbbrChars) => {
  const tokenBefore = findTokenBefore(group, token);
  if (tokenBefore && !tokenBefore.spaceAfter) {
    const matchedAbbrChars = reversedAbbrChars.filter(
      (abbr) => abbr[0].toLowerCase() === tokenBefore.value.toLowerCase()
    ).map((abbr) => abbr.slice(1));
    if (matchedAbbrChars.length) {
      const lastMatched = matchedAbbrChars[matchedAbbrChars.length - 1];
      if (lastMatched.length) {
        const tokenBeforeBefore = findTokenBefore(group, tokenBefore);
        if (tokenBeforeBefore && !tokenBeforeBefore.spaceAfter && tokenBeforeBefore.value === ".") {
          const result = matchAbbr(tokenBeforeBefore, group, matchedAbbrChars);
          if (result) {
            return true;
          }
        }
      } else {
        return true;
      }
    }
  }
  return false;
};
const generateHandler$9 = (options) => {
  const reversedAbbrChars = reverseAbbrsIntoChars(options.skipAbbrs || []);
  return (token, _, group) => {
    if (token.value !== ".") {
      return;
    }
    const tokenAfter = findTokenAfter(group, token);
    if (tokenAfter && tokenAfter.type === CharType.WESTERN_LETTER && !token.spaceAfter) {
      return;
    }
    if (matchAbbr(token, group, reversedAbbrChars)) {
      token.modifiedValue = ".";
      token.modifiedType = token.type;
      removeValidationOnTarget(token, ValidationTarget.VALUE);
    }
  };
};
const generateHandler$8 = (options) => {
  const noSpaceInsideMarkOption = options == null ? void 0 : options.noSpaceInsideHyperMark;
  return (token, _, group) => {
    if (!noSpaceInsideMarkOption) {
      return;
    }
    const tokenAfter = findTokenAfter(group, token);
    if (!tokenAfter) {
      return;
    }
    if (!isWrapper(token) && !isWrapper(tokenAfter)) {
      return;
    }
    const markSideBefore = getWrapperSide(token);
    const markSideAfter = getWrapperSide(tokenAfter);
    if (markSideBefore === markSideAfter) {
      checkSpaceAfter(token, "", MARKDOWN_NOSPACE_INSIDE);
    } else if (markSideBefore === MarkSideType.LEFT && !isWrapper(tokenAfter)) {
      checkSpaceAfter(token, "", MARKDOWN_NOSPACE_INSIDE);
    } else if (markSideAfter === MarkSideType.RIGHT && !isWrapper(token)) {
      checkSpaceAfter(token, "", MARKDOWN_NOSPACE_INSIDE);
    }
  };
};
const generateHandler$7 = (options) => {
  const needSpaceOption = options == null ? void 0 : options.spaceOutsideCode;
  const spaceAfter = needSpaceOption ? " " : "";
  const message2 = needSpaceOption ? CODE_SPACE_OUTSIDE : CODE_NOSPACE_OUTSIDE;
  const handleHyperSpaceOption = (token, _, group) => {
    if (typeof needSpaceOption === "undefined") {
      return;
    }
    if (token.type !== HyperTokenType.CODE_CONTENT) {
      return;
    }
    const contentTokenBefore = findVisibleTokenBefore(group, token);
    const contentTokenAfter = findVisibleTokenAfter(group, token);
    const { spaceHost: beforeSpaceHost } = findWrappersBetween(
      group,
      contentTokenBefore,
      token
    );
    const { spaceHost: afterSpaceHost } = findWrappersBetween(
      group,
      token,
      contentTokenAfter
    );
    if (contentTokenBefore && isLetterType(contentTokenBefore.type)) {
      beforeSpaceHost && checkSpaceAfter(beforeSpaceHost, spaceAfter, message2);
    }
    if (contentTokenAfter && (isLetterType(contentTokenAfter.type) || contentTokenAfter.type === HyperTokenType.CODE_CONTENT)) {
      afterSpaceHost && checkSpaceAfter(afterSpaceHost, spaceAfter, message2);
    }
  };
  return handleHyperSpaceOption;
};
const generateHandler$6 = (options) => {
  const onlyOneBetweenHalfwidthContentOption = options == null ? void 0 : options.spaceBetweenHalfwidthContent;
  const noBetweenFullwidthContentOption = options == null ? void 0 : options.noSpaceBetweenFullwidthContent;
  const betweenMixedwidthContentOption = options == null ? void 0 : options.spaceBetweenMixedwidthContent;
  return (token, _, group) => {
    if (!isLetterType(token.type)) {
      return;
    }
    const contentTokenAfter = findVisibleTokenAfter(group, token);
    if (!contentTokenAfter || !isLetterType(contentTokenAfter.type)) {
      return;
    }
    const { spaceHost, tokens } = findWrappersBetween(
      group,
      token,
      contentTokenAfter
    );
    if (!spaceHost) {
      return;
    }
    if (contentTokenAfter.type === token.type) {
      if (token.type === CharType.WESTERN_LETTER) {
        if (!onlyOneBetweenHalfwidthContentOption) {
          return;
        }
        if (tokens.length > 1 && tokens.filter((token2) => token2.spaceAfter).length === 0) {
          return;
        }
      } else {
        if (!noBetweenFullwidthContentOption) {
          return;
        }
      }
      const spaceAfter = token.type === CharType.WESTERN_LETTER ? " " : "";
      const message2 = token.type === CharType.WESTERN_LETTER ? CONTENT_SPACE_HALF_WIDTH : CONTENT_NOSPACE_FULL_WIDTH;
      checkSpaceAfter(spaceHost, spaceAfter, message2);
    } else {
      if (typeof betweenMixedwidthContentOption === "undefined") {
        return;
      }
      const spaceAfter = betweenMixedwidthContentOption ? " " : "";
      const message2 = betweenMixedwidthContentOption ? CONTENT_SPACE_MIXED_WIDTH : CONTENT_NOSPACE_MIXED_WIDTH;
      checkSpaceAfter(spaceHost, spaceAfter, message2);
    }
  };
};
const generateHandler$5 = (options) => {
  const noBeforePunctuationOption = options == null ? void 0 : options.noSpaceBeforePauseOrStop;
  const oneAfterHalfWidthPunctuationOption = options == null ? void 0 : options.spaceAfterHalfwidthPauseOrStop;
  const noAfterFullWidthPunctuationOption = options == null ? void 0 : options.noSpaceAfterFullwidthPauseOrStop;
  return (token, _, group) => {
    if (!isPauseOrStopType(token.type)) {
      return;
    }
    if (isHalfwidthPunctuationWithoutSpaceAround(group, token)) {
      return;
    }
    if (isSuccessiveHalfwidthPunctuation(group, token)) {
      return;
    }
    if (noBeforePunctuationOption) {
      const contentTokenBefore = findVisibleTokenBefore(group, token);
      if (contentTokenBefore && (isLetterType(contentTokenBefore.type) || contentTokenBefore.type === GroupTokenType.GROUP || contentTokenBefore.type === HyperTokenType.BRACKET_MARK && contentTokenBefore.markSide === MarkSideType.RIGHT || contentTokenBefore.type === HyperTokenType.CODE_CONTENT)) {
        const { spaceHost } = findWrappersBetween(
          group,
          contentTokenBefore,
          token
        );
        if (spaceHost) {
          checkSpaceAfter(spaceHost, "", PUNCTUATION_NOSPACE_BEFORE);
        }
      }
    }
    if (isFullwidthPunctuationType(token.modifiedType) && noAfterFullWidthPunctuationOption || isHalfwidthPunctuationType(token.modifiedType) && oneAfterHalfWidthPunctuationOption) {
      const spaceAfter = isHalfwidthPunctuationType(token.modifiedType) ? " " : "";
      const message2 = isHalfwidthPunctuationType(token.modifiedType) ? PUNCTUATION_SPACE_AFTER : PUNCTUATION_NOSPACE_AFTER;
      const contentTokenAfter = findVisibleTokenAfter(group, token);
      if (contentTokenAfter && (isLetterType(contentTokenAfter.type) || contentTokenAfter.type === GroupTokenType.GROUP || contentTokenAfter.type === HyperTokenType.BRACKET_MARK && contentTokenAfter.markSide === MarkSideType.LEFT || contentTokenAfter.type === HyperTokenType.CODE_CONTENT)) {
        const { spaceHost } = findWrappersBetween(
          group,
          token,
          contentTokenAfter
        );
        if (spaceHost) {
          checkSpaceAfter(spaceHost, spaceAfter, message2);
        }
      }
    }
  };
};
const isFullWidth$1 = (char, adjusted) => {
  return isFullwidthPair(char) && adjusted.indexOf(char) === -1;
};
const generateHandler$4 = (options) => {
  const noSpaceInsideQuoteOption = options.noSpaceInsideQuotation;
  const spaceOutsideHalfQuoteOption = options.spaceOutsideHalfwidthQuotation;
  const noSpaceOutsideFullQuoteOption = options.noSpaceOutsideFullwidthQuotation;
  const adjustedFullWidthOption = options.adjustedFullwidthPunctuation || "";
  return (token, _, group) => {
    if (token.type !== GroupTokenType.GROUP) {
      return;
    }
    if (noSpaceInsideQuoteOption) {
      const firstInsdieToken = token[0];
      if (firstInsdieToken && firstInsdieToken.markSide !== MarkSideType.RIGHT) {
        checkInnerSpaceBefore(token, "", QUOTE_NOSPACE_INSIDE);
      }
      const lastInsideToken = token[token.length - 1];
      if (lastInsideToken && lastInsideToken.markSide !== MarkSideType.LEFT) {
        checkSpaceAfter(lastInsideToken, "", QUOTE_NOSPACE_INSIDE);
      }
      if (!firstInsdieToken) {
        checkInnerSpaceBefore(token, "", QUOTE_NOSPACE_INSIDE);
      }
    }
    if (typeof spaceOutsideHalfQuoteOption !== "undefined" || noSpaceOutsideFullQuoteOption) {
      const contentTokenAfter = findNonCodeVisibleTokenAfter(group, token);
      if (contentTokenAfter && contentTokenAfter.type === GroupTokenType.GROUP) {
        const { spaceHost } = findWrappersBetween(
          group,
          token,
          contentTokenAfter
        );
        if (spaceHost) {
          const fullWidth = isFullWidth$1(token.modifiedEndValue, adjustedFullWidthOption) || isFullWidth$1(
            contentTokenAfter.modifiedStartValue,
            adjustedFullWidthOption
          );
          if (fullWidth) {
            if (noSpaceOutsideFullQuoteOption) {
              checkSpaceAfter(spaceHost, "", QUOTE_SPACE_OUTSIDE);
            }
          } else {
            if (typeof spaceOutsideHalfQuoteOption !== "undefined") {
              const spaceAfter = spaceOutsideHalfQuoteOption ? " " : "";
              const message2 = spaceOutsideHalfQuoteOption ? QUOTE_SPACE_OUTSIDE : QUOTE_NOSPACE_OUTSIDE;
              checkSpaceAfter(spaceHost, spaceAfter, message2);
            }
          }
        }
      }
      const contentTokenBefore = findNonCodeVisibleTokenBefore(group, token);
      if (contentTokenBefore && (isLetterType(contentTokenBefore.type) || contentTokenBefore.type === HyperTokenType.CODE_CONTENT)) {
        const { spaceHost } = findWrappersBetween(
          group,
          contentTokenBefore,
          token
        );
        if (spaceHost) {
          const fullWidth = isFullWidth$1(
            token.modifiedStartValue,
            adjustedFullWidthOption
          );
          if (fullWidth) {
            if (noSpaceOutsideFullQuoteOption) {
              checkSpaceAfter(spaceHost, "", QUOTE_NOSPACE_OUTSIDE);
            }
          } else {
            if (typeof spaceOutsideHalfQuoteOption !== "undefined") {
              const spaceAfter = spaceOutsideHalfQuoteOption ? " " : "";
              const message2 = spaceOutsideHalfQuoteOption ? QUOTE_SPACE_OUTSIDE : QUOTE_NOSPACE_OUTSIDE;
              checkSpaceAfter(spaceHost, spaceAfter, message2);
            }
          }
        }
      }
      if (contentTokenAfter && (isLetterType(contentTokenAfter.type) || contentTokenAfter.type === HyperTokenType.CODE_CONTENT)) {
        const { spaceHost } = findWrappersBetween(
          group,
          token,
          contentTokenAfter
        );
        if (spaceHost) {
          const fullWidth = isFullWidth$1(
            token.modifiedEndValue,
            adjustedFullWidthOption
          );
          if (fullWidth) {
            if (noSpaceOutsideFullQuoteOption) {
              checkSpaceAfter(spaceHost, "", QUOTE_NOSPACE_OUTSIDE);
            }
          } else {
            if (typeof spaceOutsideHalfQuoteOption !== "undefined") {
              const spaceAfter = spaceOutsideHalfQuoteOption ? " " : "";
              const message2 = spaceOutsideHalfQuoteOption ? QUOTE_SPACE_OUTSIDE : QUOTE_NOSPACE_OUTSIDE;
              checkSpaceAfter(spaceHost, spaceAfter, message2);
            }
          }
        }
      }
    }
  };
};
const isFullWidth = (char, adjusted) => {
  return isFullwidthPair(char) && adjusted.indexOf(char) === -1;
};
const shouldSkip = (before, beforeTokenSeq, token, afterTokenSeq, after) => {
  if (!before || !after) {
    return false;
  }
  if (isFullwidthPair(token.value) || isFullwidthPair(token.modifiedValue)) {
    return false;
  }
  if (beforeTokenSeq.filter((x) => x.spaceAfter).length || afterTokenSeq.filter((x) => x.spaceAfter).length) {
    return false;
  }
  return (before.type === CharType.WESTERN_LETTER || before.value === "(" && token.value === ")") && (after.type === CharType.WESTERN_LETTER || token.value === "(" && after.value === ")");
};
const generateHandler$3 = (options) => {
  const noInsideBracketOption = options.noSpaceInsideBracket;
  const spaceOutsideHalfBracketOption = options.spaceOutsideHalfwidthBracket;
  const noSpaceOutsideFullBracketOption = options.noSpaceOutsideFullwidthBracket;
  const adjustedFullWidthOption = options.adjustedFullwidthPunctuation || "";
  return (token, _, group) => {
    if (token.type !== HyperTokenType.BRACKET_MARK) {
      return;
    }
    if (noInsideBracketOption) {
      if (token.markSide === MarkSideType.LEFT) {
        const tokenAfter = findTokenAfter(group, token);
        if (tokenAfter) {
          checkSpaceAfter(token, "", BRACKET_NOSPACE_INSIDE);
        }
      } else {
        const tokenBefore = findTokenBefore(group, token);
        if (tokenBefore && tokenBefore.markSide !== MarkSideType.LEFT) {
          checkSpaceAfter(tokenBefore, "", BRACKET_NOSPACE_INSIDE);
        }
      }
    }
    const contentTokenBefore = findVisibleTokenBefore(group, token);
    const contentTokenAfter = findVisibleTokenAfter(group, token);
    const { spaceHost: beforeSpaceHost, tokens: beforeTokenSeq } = findWrappersBetween(group, contentTokenBefore, token);
    const { spaceHost: afterSpaceHost, tokens: afterTokenSeq } = findWrappersBetween(group, token, contentTokenAfter);
    if (shouldSkip(
      contentTokenBefore,
      beforeTokenSeq,
      token,
      afterTokenSeq,
      contentTokenAfter
    )) {
      return;
    }
    if (typeof spaceOutsideHalfBracketOption !== "undefined" || noSpaceOutsideFullBracketOption) {
      const fullWidth = isFullWidth(
        token.modifiedValue,
        adjustedFullWidthOption
      );
      if (contentTokenAfter) {
        if (token.markSide === MarkSideType.RIGHT && contentTokenAfter.markSide === MarkSideType.LEFT) {
          if (afterSpaceHost) {
            const hasFullWidth = fullWidth || isFullWidth(
              contentTokenAfter.modifiedValue,
              adjustedFullWidthOption
            );
            if (hasFullWidth) {
              if (noSpaceOutsideFullBracketOption) {
                checkSpaceAfter(token, "", BRACKET_NOSPACE_OUTSIDE);
              }
            } else {
              if (afterTokenSeq.filter((x) => x.spaceAfter).length > 0) {
                if (typeof spaceOutsideHalfBracketOption !== "undefined") {
                  const spaceAfter = spaceOutsideHalfBracketOption ? " " : "";
                  const message2 = spaceOutsideHalfBracketOption ? BRACKET_SPACE_OUTSIDE : BRACKET_NOSPACE_OUTSIDE;
                  checkSpaceAfter(token, spaceAfter, message2);
                }
              }
            }
          }
        }
      }
      if (token.markSide === MarkSideType.LEFT) {
        if (contentTokenBefore && (isLetterType(contentTokenBefore.type) || contentTokenBefore.type === GroupTokenType.GROUP || contentTokenBefore.type === HyperTokenType.CODE_CONTENT)) {
          if (beforeSpaceHost) {
            if (fullWidth || contentTokenBefore.type === GroupTokenType.GROUP && isFullWidth(
              contentTokenBefore.modifiedEndValue,
              adjustedFullWidthOption
            )) {
              if (noSpaceOutsideFullBracketOption) {
                checkSpaceAfter(beforeSpaceHost, "", BRACKET_NOSPACE_OUTSIDE);
              }
            } else {
              if (typeof spaceOutsideHalfBracketOption !== "undefined") {
                const spaceAfter = spaceOutsideHalfBracketOption ? " " : "";
                const message2 = spaceOutsideHalfBracketOption ? BRACKET_SPACE_OUTSIDE : BRACKET_NOSPACE_OUTSIDE;
                checkSpaceAfter(beforeSpaceHost, spaceAfter, message2);
              }
            }
          }
        }
      } else {
        if (contentTokenAfter && (isLetterType(contentTokenAfter.type) || contentTokenAfter.type === GroupTokenType.GROUP || contentTokenAfter.type === HyperTokenType.CODE_CONTENT)) {
          if (afterSpaceHost) {
            if (fullWidth || contentTokenAfter.type === GroupTokenType.GROUP && isFullWidth(
              contentTokenAfter.modifiedStartValue,
              adjustedFullWidthOption
            )) {
              if (noSpaceOutsideFullBracketOption) {
                checkSpaceAfter(afterSpaceHost, "", BRACKET_NOSPACE_OUTSIDE);
              }
            } else {
              if (typeof spaceOutsideHalfBracketOption !== "undefined") {
                const spaceAfter = spaceOutsideHalfBracketOption ? " " : "";
                const message2 = spaceOutsideHalfBracketOption ? BRACKET_SPACE_OUTSIDE : BRACKET_NOSPACE_OUTSIDE;
                checkSpaceAfter(afterSpaceHost, spaceAfter, message2);
              }
            }
          }
        }
      }
    }
  };
};
const generateHandler$2 = (options) => {
  return (token) => {
    if (token.spaceAfter && token.spaceAfter.match(/\n/)) {
      removeValidationOnTarget(token, ValidationTarget.SPACE_AFTER);
      token.modifiedSpaceAfter = token.spaceAfter;
    }
  };
};
const generateHandler$1 = (options) => {
  const skippedZhUnits = (options == null ? void 0 : options.skipZhUnits) || "";
  const matcherStr = skippedZhUnits.split("").filter((x) => checkCharType(x) === CharType.CJK_CHAR).join("");
  const unitMatcher = new RegExp(`^[${matcherStr}]`);
  return (token, _, group) => {
    if (token.type === CharType.WESTERN_LETTER && token.value.match(/^\d+$/)) {
      const tokenAfter = findNonCodeVisibleTokenAfter(group, token);
      if (Array.isArray(tokenAfter))
        return;
      if (tokenAfter && tokenAfter.value.match(unitMatcher)) {
        const { spaceHost: spaceHostAfter, tokens: tokenSeqAfter } = findWrappersBetween(group, token, tokenAfter);
        const hasSpaceAfterOriginally = tokenSeqAfter.some((x) => x.spaceAfter);
        if (hasSpaceAfterOriginally) {
          return;
        }
        const tokenBefore = findNonCodeVisibleTokenBefore(group, token);
        if (tokenBefore) {
          const { spaceHost: spaceHostBefore, tokens: tokenSeqBefore } = findWrappersBetween(group, tokenBefore, token);
          const hasSpaceBeforeOriginally = tokenSeqBefore.some(
            (x) => x.spaceAfter
          );
          if (hasSpaceBeforeOriginally) {
            return;
          }
          if (spaceHostBefore) {
            spaceHostBefore.modifiedSpaceAfter = "";
            removeValidationOnTarget(
              spaceHostBefore,
              ValidationTarget.SPACE_AFTER
            );
          }
        }
        if (spaceHostAfter) {
          spaceHostAfter.modifiedSpaceAfter = "";
          removeValidationOnTarget(spaceHostAfter, ValidationTarget.SPACE_AFTER);
        }
      }
    }
  };
};
const generateHandler = (options) => {
  return (token, _, group) => {
    if (token.value !== "&") {
      return;
    }
    const tokenAfter = findTokenAfter(group, token);
    if (!tokenAfter || tokenAfter.type !== CharType.WESTERN_LETTER || token.spaceAfter) {
      return;
    }
    const thirdToken = findTokenAfter(group, tokenAfter);
    if (!thirdToken || thirdToken.value !== ";" || tokenAfter.spaceAfter) {
      return;
    }
    token.modifiedValue = token.value;
    token.modifiedType = token.type;
    token.modifiedSpaceAfter = token.spaceAfter;
    removeValidationOnTarget(token, ValidationTarget.VALUE);
    removeValidationOnTarget(token, ValidationTarget.SPACE_AFTER);
    tokenAfter.modifiedValue = tokenAfter.value;
    tokenAfter.modifiedType = tokenAfter.type;
    tokenAfter.modifiedSpaceAfter = tokenAfter.spaceAfter;
    removeValidationOnTarget(tokenAfter, ValidationTarget.VALUE);
    removeValidationOnTarget(tokenAfter, ValidationTarget.SPACE_AFTER);
    thirdToken.modifiedValue = thirdToken.value;
    thirdToken.modifiedType = thirdToken.type;
    removeValidationOnTarget(thirdToken, ValidationTarget.VALUE);
    removeValidationOnTarget(thirdToken, ValidationTarget.SPACE_AFTER);
    const nextToken = findNonCodeVisibleTokenAfter(group, thirdToken);
    if (nextToken) {
      const { spaceHost } = findWrappersBetween(group, thirdToken, nextToken);
      if (spaceHost) {
        spaceHost.modifiedSpaceAfter = spaceHost.spaceAfter;
        removeValidationOnTarget(spaceHost, ValidationTarget.SPACE_AFTER);
      }
    }
  };
};
const generateHandlers = (options) => {
  return [
    generateHandler$c(options),
    generateHandler$b(options),
    generateHandler$a(options),
    generateHandler$9(options),
    generateHandler$8(options),
    generateHandler$7(options),
    generateHandler$6(options),
    generateHandler$5(options),
    generateHandler$4(options),
    generateHandler$3(options),
    generateHandler$2(),
    generateHandler$1(options),
    generateHandler()
  ];
};
const defaultConfig = {
  noSinglePair: true,
  halfwidthPunctuation: `()[]{}`,
  fullwidthPunctuation: `\uFF0C\u3002\uFF1A\uFF1B\uFF1F\uFF01\u201C\u201D\u2018\u2019`,
  adjustedFullwidthPunctuation: `\u201C\u201D\u2018\u2019`,
  unifiedPunctuation: "simplified",
  spaceBetweenHalfwidthContent: true,
  noSpaceBetweenFullwidthContent: true,
  spaceBetweenMixedwidthContent: true,
  noSpaceBeforePauseOrStop: true,
  spaceAfterHalfwidthPauseOrStop: true,
  noSpaceAfterFullwidthPauseOrStop: true,
  spaceOutsideHalfwidthQuotation: true,
  noSpaceOutsideFullwidthQuotation: true,
  noSpaceInsideQuotation: true,
  spaceOutsideHalfwidthBracket: true,
  noSpaceOutsideFullwidthBracket: true,
  noSpaceInsideBracket: true,
  spaceOutsideCode: true,
  noSpaceInsideHyperMark: true,
  trimSpace: true,
  skipZhUnits: `\u5E74\u6708\u65E5\u5929\u53F7\u65F6\u5206\u79D2`,
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
  ]
};
const hyperParseInfo = [
  { name: "ignore", value: parser$4 },
  { name: "hexo", value: parser$3 },
  { name: "vuepress", value: parser$2 },
  { name: "markdown", value: parser }
];
const arrToMap = (arr) => arr.reduce((current, { name: name2, value }) => {
  current[name2] = value;
  return current;
}, {});
const hyperParseMap = arrToMap(hyperParseInfo);
const matchCallArray = (calls, map) => calls.map((call) => {
  switch (typeof call) {
    case "function":
      return call;
    case "string":
      return map[call];
    default:
      return null;
  }
}).filter(Boolean);
const DEPRECATED_OPTIONS = {
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
};
const deprecateOptions = (ruleOption, logger) => {
  var _a2;
  for (const oldKey in DEPRECATED_OPTIONS) {
    const newKey = DEPRECATED_OPTIONS[oldKey];
    if (ruleOption[oldKey]) {
      logger.warn(`[deprecate] ${oldKey} is deprecated, use ${newKey} instead`);
      ruleOption[newKey] = (_a2 = ruleOption[newKey]) != null ? _a2 : ruleOption[oldKey];
      delete ruleOption[oldKey];
    }
  }
};
const normalizeOptions = (options) => {
  var _a2, _b2;
  const logger = (_a2 = options.logger) != null ? _a2 : env.defaultLogger;
  const rules = (_b2 = options.rules) != null ? _b2 : {};
  const preset = rules.preset === "default" ? defaultConfig : {};
  deprecateOptions(rules, logger);
  let hyperParse;
  if (typeof options.hyperParse === "function") {
    hyperParse = [options.hyperParse];
  } else {
    hyperParse = options.hyperParse || hyperParseInfo.map((item) => item.name);
  }
  const normoalizedOptions = {
    logger,
    ignoredCases: options.ignoredCases || [],
    rules: { ...preset, ...rules },
    hyperParse: matchCallArray(
      hyperParse,
      hyperParseMap
    )
  };
  return normoalizedOptions;
};
const normalizeConfig = (config, logger = env.defaultLogger) => {
  const options = {
    logger,
    rules: {},
    hyperParse: [],
    ignoredCases: []
  };
  let hyperParse = [];
  if (config.preset === "default") {
    options.rules = { ...defaultConfig };
    hyperParse = hyperParseInfo.map((item) => item.name);
  }
  if (config.rules) {
    options.rules = { ...options.rules, ...config.rules };
  }
  if (Array.isArray(config.hyperParsers)) {
    hyperParse = config.hyperParsers;
  }
  hyperParse.forEach((x) => {
    if (!hyperParseMap[x]) {
      logger.log(`The hyper parser ${x} is invalid.`);
      return;
    }
    options.hyperParse.push(hyperParseMap[x]);
  });
  if (config.ignores) {
    config.ignores.forEach((x) => {
      const ignoredCase = parseIngoredCase(x);
      if (ignoredCase) {
        options.ignoredCases.push(ignoredCase);
      } else {
        logger.log(`The format of ignore case: "${x}" is invalid.`);
      }
    });
  }
  return options;
};
const findIgnoredMarks = (str, ignoredCases = [], logger = env.defaultLogger) => {
  const marks = [];
  ignoredCases.forEach(({ prefix, textStart, textEnd, suffix }) => {
    const start = (prefix || "") + textStart;
    const end = (textEnd || "") + (suffix || "");
    const startOffset = prefix ? prefix.length : 0;
    const endOffset = suffix ? suffix.length : 0;
    const findNextMatch = (currentIndex) => {
      const startIndex = str.substring(currentIndex).indexOf(start);
      if (startIndex === -1) {
        return;
      }
      const possibleStart = currentIndex + startIndex + startOffset;
      const nextPossibleCurrentIndex = possibleStart + textStart.length;
      if (!end) {
        marks.push({
          start: possibleStart,
          end: nextPossibleCurrentIndex
        });
        findNextMatch(nextPossibleCurrentIndex);
      } else {
        const endIndex = str.substring(nextPossibleCurrentIndex).indexOf(end);
        const possibleEnd = nextPossibleCurrentIndex + endIndex + (textEnd || "").length;
        if (endIndex === -1) {
          return;
        } else {
          marks.push({
            start: possibleStart,
            end: possibleEnd
          });
          findNextMatch(possibleEnd + endOffset);
        }
      }
    };
    findNextMatch(0);
  });
  return marks.sort((a, b) => a.start - b.start);
};
const isInRange = (start, end, mark) => {
  return start <= mark.end && end >= mark.start;
};
const isIgnored = (token, marks = []) => {
  const result = {
    ignored: false,
    [ValidationTarget.VALUE]: false,
    [ValidationTarget.SPACE_AFTER]: false,
    [ValidationTarget.START_VALUE]: false,
    [ValidationTarget.END_VALUE]: false,
    [ValidationTarget.INNER_SPACE_BEFORE]: false
  };
  marks.forEach((mark) => {
    if (Array.isArray(token)) {
      const {
        index: index2,
        startValue,
        innerSpaceBefore,
        endIndex = 0,
        endValue,
        spaceAfter
      } = token;
      if (isInRange(index2, index2 + (startValue || "").length, mark)) {
        result[ValidationTarget.SPACE_AFTER] = result.ignored = true;
      }
      if (isInRange(
        index2 + (startValue || "").length,
        index2 + (startValue || "").length + (innerSpaceBefore || "").length,
        mark
      )) {
        result[ValidationTarget.INNER_SPACE_BEFORE] = result.ignored = true;
      }
      if (isInRange(endIndex, endIndex + (endValue || "").length, mark)) {
        result[ValidationTarget.END_VALUE] = result.ignored = true;
      }
      if (isInRange(
        endIndex + (endValue || "").length,
        endIndex + (endValue || "").length + (spaceAfter || "").length,
        mark
      )) {
        result[ValidationTarget.SPACE_AFTER] = result.ignored = true;
      }
    } else {
      const { index: index2, value, spaceAfter } = token;
      if (isInRange(index2, index2 + (value || "").length, mark)) {
        result[ValidationTarget.VALUE] = result.ignored = true;
      }
      if (isInRange(
        index2 + (value || "").length,
        index2 + (value || "").length + (spaceAfter || "").length,
        mark
      )) {
        result[ValidationTarget.SPACE_AFTER] = result.ignored = true;
      }
    }
  });
  return result;
};
const recordValidations = (token, offset = 0, ignoredFlags, validations = [], ignoredValidations = []) => {
  token.validations.forEach((v) => {
    const validationWithOffset = { ...v, index: v.index + offset };
    if (!ignoredFlags[v.target]) {
      validations.push(validationWithOffset);
    } else {
      ignoredValidations.push(validationWithOffset);
    }
  });
};
const join = (tokens, offset = 0, ignoredMarks = [], ignoredTokens = [], validations = [], ignoredValidations = [], isChild) => {
  const ignoredFlags = isIgnored(tokens, ignoredMarks);
  if (!isChild && ignoredFlags.ignored) {
    ignoredTokens.push(tokens);
  }
  if (!isChild) {
    recordValidations(
      tokens,
      offset,
      ignoredFlags,
      validations,
      ignoredValidations
    );
  }
  if (ignoredFlags[ValidationTarget.START_VALUE]) {
    tokens.ignoredStartValue = tokens.modifiedStartValue;
    tokens.modifiedStartValue = tokens.startValue;
  }
  if (ignoredFlags[ValidationTarget.INNER_SPACE_BEFORE]) {
    tokens.ignoredInnerSpaceBefore = tokens.modifiedInnerSpaceBefore;
    tokens.modifiedInnerSpaceBefore = tokens.innerSpaceBefore;
  }
  if (ignoredFlags[ValidationTarget.END_VALUE]) {
    tokens.ignoredEndValue = tokens.modifiedEndValue;
    tokens.modifiedEndValue = tokens.endValue;
  }
  if (ignoredFlags[ValidationTarget.SPACE_AFTER]) {
    tokens.ignoredSpaceAfter = tokens.modifiedSpaceAfter;
    tokens.modifiedSpaceAfter = tokens.spaceAfter;
  }
  return [
    tokens.modifiedStartValue,
    tokens.modifiedInnerSpaceBefore,
    ...tokens.map((token) => {
      const subIgnoredFlags = isIgnored(token, ignoredMarks);
      if (subIgnoredFlags.ignored) {
        ignoredTokens.push(token);
      }
      recordValidations(
        token,
        offset,
        subIgnoredFlags,
        validations,
        ignoredValidations
      );
      if (!Array.isArray(token)) {
        if (subIgnoredFlags[ValidationTarget.VALUE]) {
          token.ignoredValue = token.modifiedValue;
          token.modifiedValue = token.value;
        }
        if (subIgnoredFlags[ValidationTarget.SPACE_AFTER]) {
          token.ignoredSpaceAfter = token.modifiedSpaceAfter;
          token.modifiedSpaceAfter = token.spaceAfter;
        }
        return [token.modifiedValue, token.modifiedSpaceAfter].filter(Boolean).join("");
      }
      return join(
        token,
        offset,
        ignoredMarks,
        ignoredTokens,
        validations,
        ignoredValidations,
        true
      );
    }),
    tokens.modifiedEndValue,
    tokens.modifiedSpaceAfter
  ].filter(Boolean).join("");
};
const replaceBlocks = (str, blocks) => {
  if (blocks.length === 0) {
    return {
      value: str,
      pieces: [{ value: str, start: 0, end: str.length, nonBlock: true }]
    };
  }
  const pieces = blocks.reduce((pieces2, block, index2) => {
    const { start, end } = block;
    const lastPiece = pieces2[pieces2.length - 1];
    const nextStart = lastPiece ? lastPiece.end : 0;
    if (nextStart < start) {
      const nonBlockPiece = {
        nonBlock: true,
        start: nextStart,
        end: start,
        value: ""
      };
      nonBlockPiece.value = str.substring(
        nonBlockPiece.start,
        nonBlockPiece.end
      );
      pieces2.push(nonBlockPiece);
    }
    pieces2.push(block);
    if (index2 === blocks.length - 1 && end !== str.length) {
      const nonBlockPiece = {
        nonBlock: true,
        start: end,
        end: str.length,
        value: ""
      };
      nonBlockPiece.value = str.substring(
        nonBlockPiece.start,
        nonBlockPiece.end
      );
      pieces2.push(nonBlockPiece);
    }
    return pieces2;
  }, []);
  const value = pieces.map(({ value: value2 }) => value2).join("");
  return { value, pieces };
};
const run = (str, options = {}) => {
  const normalizedOptions = normalizeOptions(options);
  return lint(str, normalizedOptions);
};
const runWithConfig = (str, config) => {
  const normalizedOptions = normalizeConfig(config);
  return lint(str, normalizedOptions);
};
const lint = (str, normalizedOptions) => {
  const disabledMatcher = /<!--\s*zhlint\s*disabled\s*-->/g;
  if (str.match(disabledMatcher)) {
    return { origin: str, result: str, validations: [], disabled: true };
  }
  const { logger, ignoredCases, rules, hyperParse } = normalizedOptions;
  const status = {
    value: str,
    modifiedValue: str,
    ignoredByRules: ignoredCases,
    ignoredByParsers: [],
    blocks: [
      {
        value: str,
        marks: [],
        start: 0,
        end: str.length - 1
      }
    ]
  };
  const ignoredTokens = [];
  const parserErrors = [];
  const ruleErrors = [];
  const ignoredRuleErrors = [];
  const parsedStatus = hyperParse.reduce(
    (current, parse22) => parse22(current),
    status
  );
  const ruleHandlers = generateHandlers(rules);
  const modifiedBlocks = parsedStatus.blocks.map(
    ({ value, marks, start, end }) => {
      let lastValue = value;
      const result2 = toMutableResult(parse(value, marks), rules);
      parserErrors.push(...result2.errors);
      const ignoredMarks = findIgnoredMarks(
        value,
        status.ignoredByRules,
        logger
      );
      ruleHandlers.forEach((rule) => {
        travel(result2.tokens, rule);
      });
      lastValue = join(
        result2.tokens,
        start,
        ignoredMarks,
        ignoredTokens,
        ruleErrors,
        ignoredRuleErrors
      );
      return {
        ...result2,
        start,
        end,
        value: lastValue,
        originValue: value
      };
    }
  );
  const result = replaceBlocks(str, modifiedBlocks);
  const debugInfo = {
    pieces: result.pieces,
    blocks: modifiedBlocks,
    ignoredCases: parsedStatus.ignoredByRules,
    ignoredByParsers: parsedStatus.ignoredByParsers,
    ignoredTokens,
    parserErrors,
    ruleErrors,
    ignoredRuleErrors
  };
  return {
    origin: str,
    result: result.value,
    validations: [...parserErrors, ...ruleErrors],
    __debug__: debugInfo
  };
};
function assertPath(path) {
  if (typeof path !== "string") {
    throw new TypeError("Path must be a string. Received " + JSON.stringify(path));
  }
}
function normalizeStringPosix(path, allowAboveRoot) {
  var res2 = "";
  var lastSegmentLength = 0;
  var lastSlash = -1;
  var dots = 0;
  var code;
  for (var i = 0; i <= path.length; ++i) {
    if (i < path.length)
      code = path.charCodeAt(i);
    else if (code === 47)
      break;
    else
      code = 47;
    if (code === 47) {
      if (lastSlash === i - 1 || dots === 1)
        ;
      else if (lastSlash !== i - 1 && dots === 2) {
        if (res2.length < 2 || lastSegmentLength !== 2 || res2.charCodeAt(res2.length - 1) !== 46 || res2.charCodeAt(res2.length - 2) !== 46) {
          if (res2.length > 2) {
            var lastSlashIndex = res2.lastIndexOf("/");
            if (lastSlashIndex !== res2.length - 1) {
              if (lastSlashIndex === -1) {
                res2 = "";
                lastSegmentLength = 0;
              } else {
                res2 = res2.slice(0, lastSlashIndex);
                lastSegmentLength = res2.length - 1 - res2.lastIndexOf("/");
              }
              lastSlash = i;
              dots = 0;
              continue;
            }
          } else if (res2.length === 2 || res2.length === 1) {
            res2 = "";
            lastSegmentLength = 0;
            lastSlash = i;
            dots = 0;
            continue;
          }
        }
        if (allowAboveRoot) {
          if (res2.length > 0)
            res2 += "/..";
          else
            res2 = "..";
          lastSegmentLength = 2;
        }
      } else {
        if (res2.length > 0)
          res2 += "/" + path.slice(lastSlash + 1, i);
        else
          res2 = path.slice(lastSlash + 1, i);
        lastSegmentLength = i - lastSlash - 1;
      }
      lastSlash = i;
      dots = 0;
    } else if (code === 46 && dots !== -1) {
      ++dots;
    } else {
      dots = -1;
    }
  }
  return res2;
}
function _format(sep, pathObject) {
  var dir = pathObject.dir || pathObject.root;
  var base = pathObject.base || (pathObject.name || "") + (pathObject.ext || "");
  if (!dir) {
    return base;
  }
  if (dir === pathObject.root) {
    return dir + base;
  }
  return dir + sep + base;
}
var posix = {
  resolve: function resolve() {
    var resolvedPath = "";
    var resolvedAbsolute = false;
    var cwd2;
    for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
      var path;
      if (i >= 0)
        path = arguments[i];
      else {
        if (cwd2 === void 0)
          cwd2 = process.cwd();
        path = cwd2;
      }
      assertPath(path);
      if (path.length === 0) {
        continue;
      }
      resolvedPath = path + "/" + resolvedPath;
      resolvedAbsolute = path.charCodeAt(0) === 47;
    }
    resolvedPath = normalizeStringPosix(resolvedPath, !resolvedAbsolute);
    if (resolvedAbsolute) {
      if (resolvedPath.length > 0)
        return "/" + resolvedPath;
      else
        return "/";
    } else if (resolvedPath.length > 0) {
      return resolvedPath;
    } else {
      return ".";
    }
  },
  normalize: function normalize2(path) {
    assertPath(path);
    if (path.length === 0)
      return ".";
    var isAbsolute2 = path.charCodeAt(0) === 47;
    var trailingSeparator = path.charCodeAt(path.length - 1) === 47;
    path = normalizeStringPosix(path, !isAbsolute2);
    if (path.length === 0 && !isAbsolute2)
      path = ".";
    if (path.length > 0 && trailingSeparator)
      path += "/";
    if (isAbsolute2)
      return "/" + path;
    return path;
  },
  isAbsolute: function isAbsolute(path) {
    assertPath(path);
    return path.length > 0 && path.charCodeAt(0) === 47;
  },
  join: function join2() {
    if (arguments.length === 0)
      return ".";
    var joined;
    for (var i = 0; i < arguments.length; ++i) {
      var arg = arguments[i];
      assertPath(arg);
      if (arg.length > 0) {
        if (joined === void 0)
          joined = arg;
        else
          joined += "/" + arg;
      }
    }
    if (joined === void 0)
      return ".";
    return posix.normalize(joined);
  },
  relative: function relative(from, to) {
    assertPath(from);
    assertPath(to);
    if (from === to)
      return "";
    from = posix.resolve(from);
    to = posix.resolve(to);
    if (from === to)
      return "";
    var fromStart = 1;
    for (; fromStart < from.length; ++fromStart) {
      if (from.charCodeAt(fromStart) !== 47)
        break;
    }
    var fromEnd = from.length;
    var fromLen = fromEnd - fromStart;
    var toStart = 1;
    for (; toStart < to.length; ++toStart) {
      if (to.charCodeAt(toStart) !== 47)
        break;
    }
    var toEnd = to.length;
    var toLen = toEnd - toStart;
    var length = fromLen < toLen ? fromLen : toLen;
    var lastCommonSep = -1;
    var i = 0;
    for (; i <= length; ++i) {
      if (i === length) {
        if (toLen > length) {
          if (to.charCodeAt(toStart + i) === 47) {
            return to.slice(toStart + i + 1);
          } else if (i === 0) {
            return to.slice(toStart + i);
          }
        } else if (fromLen > length) {
          if (from.charCodeAt(fromStart + i) === 47) {
            lastCommonSep = i;
          } else if (i === 0) {
            lastCommonSep = 0;
          }
        }
        break;
      }
      var fromCode2 = from.charCodeAt(fromStart + i);
      var toCode = to.charCodeAt(toStart + i);
      if (fromCode2 !== toCode)
        break;
      else if (fromCode2 === 47)
        lastCommonSep = i;
    }
    var out = "";
    for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
      if (i === fromEnd || from.charCodeAt(i) === 47) {
        if (out.length === 0)
          out += "..";
        else
          out += "/..";
      }
    }
    if (out.length > 0)
      return out + to.slice(toStart + lastCommonSep);
    else {
      toStart += lastCommonSep;
      if (to.charCodeAt(toStart) === 47)
        ++toStart;
      return to.slice(toStart);
    }
  },
  _makeLong: function _makeLong(path) {
    return path;
  },
  dirname: function dirname2(path) {
    assertPath(path);
    if (path.length === 0)
      return ".";
    var code = path.charCodeAt(0);
    var hasRoot = code === 47;
    var end = -1;
    var matchedSlash = true;
    for (var i = path.length - 1; i >= 1; --i) {
      code = path.charCodeAt(i);
      if (code === 47) {
        if (!matchedSlash) {
          end = i;
          break;
        }
      } else {
        matchedSlash = false;
      }
    }
    if (end === -1)
      return hasRoot ? "/" : ".";
    if (hasRoot && end === 1)
      return "//";
    return path.slice(0, end);
  },
  basename: function basename2(path, ext) {
    if (ext !== void 0 && typeof ext !== "string")
      throw new TypeError('"ext" argument must be a string');
    assertPath(path);
    var start = 0;
    var end = -1;
    var matchedSlash = true;
    var i;
    if (ext !== void 0 && ext.length > 0 && ext.length <= path.length) {
      if (ext.length === path.length && ext === path)
        return "";
      var extIdx = ext.length - 1;
      var firstNonSlashEnd = -1;
      for (i = path.length - 1; i >= 0; --i) {
        var code = path.charCodeAt(i);
        if (code === 47) {
          if (!matchedSlash) {
            start = i + 1;
            break;
          }
        } else {
          if (firstNonSlashEnd === -1) {
            matchedSlash = false;
            firstNonSlashEnd = i + 1;
          }
          if (extIdx >= 0) {
            if (code === ext.charCodeAt(extIdx)) {
              if (--extIdx === -1) {
                end = i;
              }
            } else {
              extIdx = -1;
              end = firstNonSlashEnd;
            }
          }
        }
      }
      if (start === end)
        end = firstNonSlashEnd;
      else if (end === -1)
        end = path.length;
      return path.slice(start, end);
    } else {
      for (i = path.length - 1; i >= 0; --i) {
        if (path.charCodeAt(i) === 47) {
          if (!matchedSlash) {
            start = i + 1;
            break;
          }
        } else if (end === -1) {
          matchedSlash = false;
          end = i + 1;
        }
      }
      if (end === -1)
        return "";
      return path.slice(start, end);
    }
  },
  extname: function extname2(path) {
    assertPath(path);
    var startDot = -1;
    var startPart = 0;
    var end = -1;
    var matchedSlash = true;
    var preDotState = 0;
    for (var i = path.length - 1; i >= 0; --i) {
      var code = path.charCodeAt(i);
      if (code === 47) {
        if (!matchedSlash) {
          startPart = i + 1;
          break;
        }
        continue;
      }
      if (end === -1) {
        matchedSlash = false;
        end = i + 1;
      }
      if (code === 46) {
        if (startDot === -1)
          startDot = i;
        else if (preDotState !== 1)
          preDotState = 1;
      } else if (startDot !== -1) {
        preDotState = -1;
      }
    }
    if (startDot === -1 || end === -1 || preDotState === 0 || preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
      return "";
    }
    return path.slice(startDot, end);
  },
  format: function format2(pathObject) {
    if (pathObject === null || typeof pathObject !== "object") {
      throw new TypeError('The "pathObject" argument must be of type Object. Received type ' + typeof pathObject);
    }
    return _format("/", pathObject);
  },
  parse: function parse2(path) {
    assertPath(path);
    var ret = { root: "", dir: "", base: "", ext: "", name: "" };
    if (path.length === 0)
      return ret;
    var code = path.charCodeAt(0);
    var isAbsolute2 = code === 47;
    var start;
    if (isAbsolute2) {
      ret.root = "/";
      start = 1;
    } else {
      start = 0;
    }
    var startDot = -1;
    var startPart = 0;
    var end = -1;
    var matchedSlash = true;
    var i = path.length - 1;
    var preDotState = 0;
    for (; i >= start; --i) {
      code = path.charCodeAt(i);
      if (code === 47) {
        if (!matchedSlash) {
          startPart = i + 1;
          break;
        }
        continue;
      }
      if (end === -1) {
        matchedSlash = false;
        end = i + 1;
      }
      if (code === 46) {
        if (startDot === -1)
          startDot = i;
        else if (preDotState !== 1)
          preDotState = 1;
      } else if (startDot !== -1) {
        preDotState = -1;
      }
    }
    if (startDot === -1 || end === -1 || preDotState === 0 || preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
      if (end !== -1) {
        if (startPart === 0 && isAbsolute2)
          ret.base = ret.name = path.slice(1, end);
        else
          ret.base = ret.name = path.slice(startPart, end);
      }
    } else {
      if (startPart === 0 && isAbsolute2) {
        ret.name = path.slice(1, startDot);
        ret.base = path.slice(1, end);
      } else {
        ret.name = path.slice(startPart, startDot);
        ret.base = path.slice(startPart, end);
      }
      ret.ext = path.slice(startDot, end);
    }
    if (startPart > 0)
      ret.dir = path.slice(0, startPart - 1);
    else if (isAbsolute2)
      ret.dir = "/";
    return ret;
  },
  sep: "/",
  delimiter: ":",
  win32: null,
  posix: null
};
posix.posix = posix;
var pathBrowserify = posix;
var empty = null;
var empty_1 = empty;
const resolvePath = (dir, config, ignore, logger = env.defaultLogger) => {
  const result = {
    config: void 0,
    ignore: void 0
  };
  dir = pathBrowserify.resolve(dir != null ? dir : ".");
  if (!empty_1.existsSync(dir)) {
    logger.log(`"${dir}" does not exist.`);
    return result;
  }
  config = pathBrowserify.resolve(dir, config != null ? config : ".zhlintrc");
  if (empty_1.existsSync(config)) {
    result.config = config;
  } else {
    logger.log(
      `Config file "${config}" does not exist. Will proceed as default.`
    );
  }
  ignore = pathBrowserify.resolve(dir, ignore != null ? ignore : ".zhlintignore");
  if (empty_1.existsSync(ignore)) {
    result.ignore = ignore;
  } else {
    logger.log(
      `Global ignored cases file "${ignore}" does not exist. Will proceed as none.`
    );
  }
  return result;
};
const readJSONSync = (filepath) => {
  const output = empty_1.readFileSync(filepath, { encoding: "utf8" });
  return JSON.parse(output);
};
const resolveConfig = (normalizedConfigPath, normalizedIgnorePath, logger = env.defaultLogger) => {
  const result = {
    preset: "default"
  };
  if (normalizedConfigPath) {
    try {
      const config = readJSONSync(normalizedConfigPath);
      if (typeof config.preset === "string") {
        result.preset = config.preset;
      }
      if (typeof config.rules === "object") {
        result.rules = config.rules;
      }
      if (Array.isArray(config.hyperParsers)) {
        result.hyperParsers = config.hyperParsers;
      }
      if (Array.isArray(config.ignores)) {
        result.ignores = config.ignores;
      }
    } catch (error) {
      logger.log(
        `Failed to read "${normalizedConfigPath}": ${error.message}`
      );
    }
  }
  if (normalizedIgnorePath) {
    try {
      const ignores = empty_1.readFileSync(normalizedIgnorePath, { encoding: "utf8" });
      ignores.split(/\n/).map((x) => x.trim()).forEach((x) => {
        if (!x) {
          return;
        }
        if (!result.ignores) {
          result.ignores = [];
        }
        if (result.ignores.indexOf(x) === -1) {
          result.ignores.push(x);
        }
      });
    } catch (error) {
      logger.log(
        `Failed to read "${normalizedIgnorePath}": ${error.message}`
      );
    }
  }
  return result;
};
const readRc = (dir, config, ignore, logger = env.defaultLogger) => {
  const { config: normalizedConfigPath, ignore: normalizedIgnorePath } = resolvePath(dir, config, ignore, logger);
  return resolveConfig(normalizedConfigPath, normalizedIgnorePath, logger);
};
export { readRc, report, run, runWithConfig };
//# sourceMappingURL=zhlint.es.js.map
