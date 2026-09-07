import { unified } from 'unified'
import markdown from 'remark-parse'
import gfm from 'remark-gfm'
import frontmatter from 'remark-frontmatter'
import mdx from 'remark-mdx'
import * as Ast from 'mdast'
import { Node } from 'unist'
import { createParser } from './md.js'

// MDX node types produced by remark-mdx
const MDX_ESM_TYPE = 'mdxjsEsm'
const MDX_FLOW_EXPRESSION_TYPE = 'mdxFlowExpression'
const MDX_TEXT_EXPRESSION_TYPE = 'mdxTextExpression'
const MDX_JSX_TEXT_ELEMENT_TYPE = 'mdxJsxTextElement'

// Try MDX first to protect ESM/JSX/expressions; fall back to plain
// markdown parsing on MDX syntax errors so the lint process never aborts.
const parseMdx = (value: string): Ast.Root => {
  const plain = () => unified().use(markdown).use(gfm).use(frontmatter)
  try {
    return plain().use(mdx).parse(value) as Ast.Root
  } catch {
    return plain().parse(value) as Ast.Root
  }
}

// With remark-mdx, inline html/JSX tags become JSX elements wrapping their
// children. Reproduce the legacy inline-html handling:
// - `<code>...</code>` / self-closing elements: protect the whole element
// - other elements with children: protect the open/close tags (wrapper)
//   and keep linting the children
const classifyInline = (node: Node): 'raw' | 'wrapper' | undefined => {
  if ((node.type as string) !== MDX_JSX_TEXT_ELEMENT_TYPE) {
    return undefined
  }
  const el = node as Node & { name?: string; children?: Node[] }
  const children = el.children ?? []
  return children.length === 0 || el.name === 'code' ? 'raw' : 'wrapper'
}

/**
 * An mdx-compatible markdown parser.
 *
 * Besides everything the markdown parser does, it also recognizes MDX
 * syntax (ESM statements, JSX elements and expressions) and protects
 * them from being linted as plain text. When the content is not valid
 * MDX, it falls back to plain markdown parsing so the lint process
 * never aborts.
 */
const parser = createParser({
  parse: parseMdx,
  extraSkipBlockTypes: [MDX_ESM_TYPE, MDX_FLOW_EXPRESSION_TYPE],
  extraInlineRawTypes: [MDX_TEXT_EXPRESSION_TYPE],
  classifyInline
})

export default parser
