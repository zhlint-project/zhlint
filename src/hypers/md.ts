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
const isInlineRaw = (node: Node): node is InlineRawType => {
  return inlineRawTypes.indexOf(node.type) >= 0
}

// Marks related

type BlockMark = {
  block: BlockType
  inlineMarks: InlineMark[]
  hyperMarks: Mark[]
  value: string
}

type InlineMark = {
  inline: InlineContentType | InlineRawType
  raw: boolean
}

const travelBlocks = (node: Node, blocks: BlockMark[]): void => {
  if (isParent(node)) {
    node.children.forEach((child) => {
      if (child.type === 'yaml') {
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
        travelInlines(child, blockMark)
      } else {
        travelBlocks(child, blocks)
      }
    })
  }
}

const travelInlines = (node: Node, blockMark: BlockMark): void => {
  if (isParent(node)) {
    node.children.forEach((child) => {
      if (isInlineContent(child)) {
        blockMark.inlineMarks.push({ inline: child, raw: false })
        travelInlines(child, blockMark)
      }
      if (isInlineRaw(child)) {
        blockMark.inlineMarks.push({ inline: child, raw: true })
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

  // Generate all the marks includes hyper (inline) and raw.
  inlineMarks.forEach((inlineMark) => {
    const { inline } = inlineMark
    if (!inline.position) {
      return
    }
    const startOffset = inline.position.start.offset || 0
    const endOffset = inline.position.end.offset || 0

    if (isInlineRaw(inline)) {
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
    } else {
      const firstChild = inline.children[0]
      const lastChild = inline.children[inline.children.length - 1]
      if (!firstChild.position || !lastChild.position) {
        return
      }
      const innerStartOffset = firstChild.position.start.offset || 0
      const innerEndOffset = lastChild.position.end.offset || 0
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
    }
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

/**
  - travel all blocks/lists/tables/rows/cells
    - content: paragraph/heading/table-cell
    - no content: thematic break/code/html
  - for all phrasings:
    - no text: inline code/break/image/image ref/footnote ref/html
    - marks: emphasis/strong/delete/footnote/link/link ref
 */
const parser = (data: ParsedStatus): ParsedStatus => {
  const value = data.value
  const modifiedValue = data.modifiedValue
  const ignoredByParsers = data.ignoredByParsers

  const blockMarks: BlockMark[] = []

  const tree: Ast.Root = unified()
    .use(markdown)
    .use(gfm)
    .use(frontmatter)
    .parse(modifiedValue) as Ast.Root

  // - travel and record all paragraphs/headings/table-cells into blocks
  // - for each block, travel and record all
  // - - 'hyper' marks: emphasis/strong/delete/footnote/link/linkRef and continue
  // - - 'raw' marks: inlineCode/break/image/imageRef/footnoteRef/html and stop
  travelBlocks(tree, blockMarks)

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

export default parser
