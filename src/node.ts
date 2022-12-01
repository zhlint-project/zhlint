// TODO: for further potential usage

/* eslint-disable @typescript-eslint/no-var-requires */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const r: (str: string) => Record<string, () => any> = () => ({
  resolve: () => '',
  existsSync: () => false,
  readFileSync: () => '',
  readJSONSync: () => ({})
})

if (typeof require === 'undefined') {
  require = r as NodeRequire
}

// import { resolve } from 'path';
export const resolve = r('path').resolve

// import { existsSync, readFileSync, readJSONSync } from 'fs-extra';
export const existsSync = r('fs-extra').existsSync
export const readFileSync = r('fs-extra').readFileSync
export const readJSONSync = r('fs-extra').readJSONSync
