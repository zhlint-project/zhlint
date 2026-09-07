import { unified } from 'unified'
import markdown from 'remark-parse'
import gfm from 'remark-gfm'
import frontmatter from 'remark-frontmatter'
import * as Ast from 'mdast'
import { Node, Position } from 'unist'
import {
  isRawMark,
  Mark,
  MarkSideType,
  MarkType,
  RawMark
} from '../parser/index.js'
import { Block, ParsedStatus } from './types.js'

// Position related

type NormalizedPosition = {
  start: number
  end: number
}

const parsePosition = (position?: Position): NormalizedPosition => ({
  start: position?.start?.offset || 0,
  end: position?.end?.offset || 0
})

// AST related

const isParent = (node: Node): node is Ast.Parent => {
  return (node as Ast.Parent).children !== undefined
}

type BlockType = Ast.Paragraph | Ast.Heading | Ast.TableCell
const blockTypes: string[] = ['paragraph', 'heading', 'table-cell']
const isBlock = (node: Node): node is BlockType => {
  return blockTypes.indexOf(node.type) >= 0
}

type InlineContentType =
  | Ast.Emphasis
  | Ast.Strong
  | Ast.Delete
  | Ast.Link
  | Ast.LinkReference
const inlineContentTypes: string[] = [
  'emphasis',
  'strong',
  'delete',
  'link',
  'linkReference'
]
const isInlineContent = (node: Node): node is InlineContentType => {
  return inlineContentTypes.indexOf(node.type) >= 0
}

type InlineRawType =
  | Ast.InlineCode
  | Ast.Break
  | Ast.Image
  | Ast.ImageReference
  | Ast.FootnoteDefinition
  | Ast.Html
const inlineRawTypes: string[] = [
  'inlineCode',
  'break',
  'image',
  'imageReference',
  'footnoteDefinition',
  'html'
]
// Marks related

type BlockMark = {
  block: BlockType
  inlineMarks: InlineMark[]
  hyperMarks: Mark[]
  value: string
}

export type InlineMarkKind = 'raw' | 'hyper' | 'wrapper'

type InlineMark = {
  inline: InlineContentType | InlineRawType
  kind: InlineMarkKind
}

export type MarkdownDialect = {
  /** produce the AST, e.g. plain markdown or mdx with fallback */
  parse: (value: string) => Ast.Root
  /** extra block-level node types to skip entirely besides markdown's,
      e.g. ['mdxjsEsm'] */
  extraSkipBlockTypes?: string[]
  /** extra inline node types to protect as raw marks besides markdown's */
  extraInlineRawTypes?: string[]
  /** classify unknown inline nodes: 'raw' protects the whole node,
      'wrapper' protects the open/close parts and keeps linting children */
  classifyInline?: (node: Node) => 'raw' | 'wrapper' | undefined
}

type NormalizedDialect = {
  parse: (value: string) => Ast.Root
  skipBlockTypes: string[]
  inlineRawTypes: string[]
  classifyInline?: (node: Node) => 'raw' | 'wrapper' | undefined
}

const travelBlocks = (
  node: Node,
  blocks: BlockMark[],
  spec: NormalizedDialect
): void => {
  if (isParent(node)) {
    node.children.forEach((child) => {
      if (spec.skipBlockTypes.indexOf(child.type as string) >= 0) {
        return
      }
      if (isBlock(child)) {
        const blockMark: BlockMark = {
          block: child,
          inlineMarks: [],
          hyperMarks: [],
          value: '' // to be initialzed
        }
        blocks.push(blockMark)
        travelInlines(child, blockMark, spec)
      } else {
        travelBlocks(child, blocks, spec)
      }
    })
  }
}

const travelInlines = (
  node: Node,
  blockMark: BlockMark,
  spec: NormalizedDialect
): void => {
  if (isParent(node)) {
    node.children.forEach((child) => {
      const classified = spec.classifyInline?.(child)
      if (classified === 'raw') {
        blockMark.inlineMarks.push({ inline: child as InlineRawType, kind: 'raw' })
        return
      }
      if (classified === 'wrapper') {
        blockMark.inlineMarks.push({ inline: child as InlineContentType, kind: 'wrapper' })
        travelInlines(child, blockMark, spec)
        return
      }
      if (isInlineContent(child)) {
        blockMark.inlineMarks.push({ inline: child, kind: 'hyper' })
        travelInlines(child, blockMark, spec)
      }
      if (spec.inlineRawTypes.indexOf(child.type) >= 0) {
        blockMark.inlineMarks.push({ inline: child as InlineRawType, kind: 'raw' })
      }
    })
  }
}

const processBlockMark = (blockMark: BlockMark, str: string): void => {
  const { block, inlineMarks } = blockMark
  if (!block.position) {
    return
  }
  const offset = block.position.start.offset || 0

  const marks: Mark[] = []
  const unresolvedCodeMarks: RawMark[] = []

  // Generate all the marks includes hyper (inline), raw and wrapper.
  inlineMarks.forEach((inlineMark) => {
    const { inline, kind } = inlineMark
    if (!inline.position) {
      return
    }
    const startOffset = inline.position.start.offset || 0
    const endOffset = inline.position.end.offset || 0

    if (kind === 'raw') {
      const mark: Mark = {
        type: MarkType.RAW,
        // TODO: typeof RawMark.meta
        meta: inline.type,
        startIndex: startOffset - offset,
        endIndex: endOffset - offset,
        startValue: str.substring(startOffset, endOffset),
        endValue: ''
      }
      // TODO: Ast.InlineCode?
      if (mark.startValue.match(/<code.*>/)) {
        const rawMark: RawMark = { ...mark, code: MarkSideType.LEFT }
        unresolvedCodeMarks.push(rawMark)
        marks.push(rawMark)
        return
      } else if (mark.startValue.match(/<\/code.*>/)) {
        const rawMark: RawMark = { ...mark, code: MarkSideType.RIGHT }
        const leftCode = unresolvedCodeMarks.pop()
        if (leftCode) {
          leftCode.rightPair = rawMark
        }
        marks.push(rawMark)
        return
      }
      marks.push(mark)
      return
    }
    const parentInline = inline as InlineContentType
    const firstChild = parentInline.children[0]
    const lastChild = parentInline.children[parentInline.children.length - 1]
    if (!firstChild.position || !lastChild.position) {
      return
    }
    const innerStartOffset = firstChild.position.start.offset || 0
    const innerEndOffset = lastChild.position.end.offset || 0
    if (kind === 'wrapper') {
      // Protect the open/close parts as two raw marks (legacy inline-html
      // semantics); the children are linted as normal inline content.
      marks.push({
        type: MarkType.RAW,
        meta: `${inline.type}-open`,
        startIndex: startOffset - offset,
        endIndex: innerStartOffset - offset,
        startValue: str.substring(startOffset, innerStartOffset),
        endValue: ''
      })
      marks.push({
        type: MarkType.RAW,
        meta: `${inline.type}-close`,
        startIndex: innerEndOffset - offset,
        endIndex: endOffset - offset,
        startValue: str.substring(innerEndOffset, endOffset),
        endValue: ''
      })
      return
    }
    const mark: Mark = {
      type: MarkType.HYPER,
      // TODO: typeof RawMark.meta
      meta: inline.type,
      startIndex: startOffset - offset,
      startValue: str.substring(startOffset, innerStartOffset),
      endIndex: innerEndOffset - offset,
      endValue: str.substring(innerEndOffset, endOffset)
    }
    marks.push(mark)
  })

  blockMark.value = str.substring(
    block.position.start.offset || 0,
    block.position.end.offset || 0
  )

  blockMark.hyperMarks = marks
    .map((mark) => {
      if (isRawMark(mark)) {
        if (mark.code === MarkSideType.RIGHT) {
          return
        }
        if (mark.code === MarkSideType.LEFT) {
          const { rightPair } = mark
          mark.startValue = str.substring(
            mark.startIndex + offset,
            mark.endIndex + offset
          )
          mark.endIndex = rightPair?.endIndex || 0
          mark.endValue = ''
          delete mark.rightPair
        }
      }
      return mark
    })
    .filter(Boolean) as Mark[]
}

const parseMarkdown = (value: string): Ast.Root =>
  unified().use(markdown).use(gfm).use(frontmatter).parse(value) as Ast.Root

/**
  - travel all blocks/lists/tables/rows/cells
    - content: paragraph/heading/table-cell
    - no content: thematic break/code/html
  - for all phrasings:
    - no text: inline code/break/image/image ref/footnote ref/html
    - marks: emphasis/strong/delete/footnote/link/link ref
 */
const processWithTree = (
  data: ParsedStatus,
  tree: Ast.Root,
  spec: NormalizedDialect
): ParsedStatus => {
  const value = data.value
  const ignoredByParsers = data.ignoredByParsers

  const blockMarks: BlockMark[] = []

  // - travel and record all paragraphs/headings/table-cells into blocks
  // - for each block, travel and record all
  // - - 'hyper' marks: emphasis/strong/delete/footnote/link/linkRef and continue
  // - - 'raw' marks: inlineCode/break/image/imageRef/footnoteRef/html and stop
  travelBlocks(tree, blockMarks, spec)

  // for each block marks
  // - get block.start.offset
  // - for each marks
  // - - startIndex: mark.start.offset - offset
  // - - startValue: [mark.start.offset - offset, mark.firstChild.start.offset - offset]
  // - - endIndex: mark.lastChild.end.offset - offset
  // - - endValue: [mark.lastChild.end.offset - offset, mark.end.offset]
  blockMarks.forEach((blockMark) => processBlockMark(blockMark, value))
  data.blocks = blockMarks.map((b): Block => {
    const position = parsePosition(b.block.position)
    ignoredByParsers.forEach(({ index, length, originValue: raw, meta }) => {
      if (position.start <= index && position.end >= index + length) {
        if (b.hyperMarks) {
          b.hyperMarks.push({
            type: MarkType.RAW,
            meta,
            startIndex: index - position.start,
            startValue: raw,
            endIndex: index - position.start + length,
            endValue: ''
          })
        }
      }
    })
    return {
      value: b.value || '',
      marks: b.hyperMarks || [],
      ...position
    }
  })
  data.ignoredByParsers = []
  return data
}

export const createParser = (spec: MarkdownDialect) => {
  const normalized: NormalizedDialect = {
    parse: spec.parse,
    skipBlockTypes: ['yaml', ...(spec.extraSkipBlockTypes ?? [])],
    inlineRawTypes: [...inlineRawTypes, ...(spec.extraInlineRawTypes ?? [])],
    classifyInline: spec.classifyInline
  }
  return (data: ParsedStatus): ParsedStatus =>
    processWithTree(data, normalized.parse(data.modifiedValue), normalized)
}

const parser = createParser({ parse: parseMarkdown })

export default parser
