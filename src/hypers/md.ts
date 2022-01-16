import unified from 'unified'
import markdown from 'remark-parse'
import frontmatter from 'remark-frontmatter'
import * as Ast from 'mdast'
import { Node, Position } from 'unist'
import {
  isRawMark,
  Mark,
  MarkSideType,
  MarkType,
  RawMark
} from '../parser/types'
import { Block, Data } from './types'

type NormalizedPosition = {
  start: number
  end: number
}

const parsePosition = (position?: Position): NormalizedPosition => ({
  start: position?.start?.offset || 0,
  end: position?.end?.offset || 0
})

const isParent = (node: Node): node is Ast.Parent => {
  return (node as Ast.Parent).children !== undefined
}

const blockTypes: string[] = ['paragraph', 'heading', 'table-cell']

type BlockType = Ast.Paragraph | Ast.Heading | Ast.TableCell

type BlockMark = {
  block: BlockType
  inlineMarks: InlineMark[]
  hyperMarks?: Mark[]
  value?: string
}

type InlineMark = {
  inline: Node
  raw?: boolean
}

const travelBlocks = (node: Node, blocks: BlockMark[]) => {
  if (isParent(node)) {
    node.children.forEach((child) => {
      if (child.type === 'yaml') {
        return
      }
      if (blockTypes.indexOf(child.type) >= 0) {
        const blockMark: BlockMark = {
          block: child as BlockType,
          inlineMarks: []
        }
        blocks.push(blockMark)
        travelPhrasings(child as BlockType, blockMark)
      } else {
        travelBlocks(child, blocks)
      }
    })
  }
}

const inlineMarkTypes: string[] = [
  'emphasis',
  'strong',
  'delete',
  'footnote',
  'link',
  'linkReference'
]
type InlineType =
  | Ast.Emphasis
  | Ast.Strong
  | Ast.Delete
  | Ast.Footnote
  | Ast.Link
  | Ast.LinkReference

const rawMarkTypes: string[] = [
  'inlineCode',
  'break',
  'image',
  'imageReference',
  'footnoteReference',
  'html'
]
type RawType =
  | Ast.InlineCode
  | Ast.Break
  | Ast.Image
  | Ast.ImageReference
  | Ast.FootnoteDefinition
  | Ast.HTML

const travelPhrasings = (node: BlockType, blockMark: BlockMark) => {
  if (node.children) {
    node.children.forEach((child) => {
      if (inlineMarkTypes.indexOf(child.type) >= 0) {
        // TODO
        blockMark.inlineMarks.push({ inline: child as InlineType })
        travelPhrasings(child as unknown as BlockType, blockMark) // TODO
      }
      if (rawMarkTypes.indexOf(child.type) >= 0) {
        // TODO
        blockMark.inlineMarks.push({ inline: child as RawType, raw: true })
      }
    })
  }
}

const processBlockMark = (blockMark: BlockMark, str) => {
  const { block, inlineMarks } = blockMark
  const offset = block?.position?.start?.offset
  const marks: Mark[] = []
  const unresolvedCodeMarks: RawMark[] = []
  inlineMarks.forEach((inlineMark) => {
    const { inline } = inlineMark
    if (inlineMark.raw) {
      const mark: RawMark = {
        type: MarkType.RAW,
        meta: inline.type,
        startIndex: (inline?.position?.start?.offset || 0) - (offset || 0),
        endIndex: (inline?.position?.end?.offset || 0) - (offset || 0),
        startContent: str.substring(
          inline?.position?.start?.offset,
          inline?.position?.end?.offset
        ),
        endContent: '',
        code: MarkSideType.LEFT
      }
      if (mark.startContent.match(/<code.*>/)) {
        unresolvedCodeMarks.push(mark)
      } else if (mark.startContent.match(/<\/code.*>/)) {
        mark.code = MarkSideType.RIGHT
        const leftCode = unresolvedCodeMarks.pop()
        if (leftCode) {
          leftCode.rightPair = mark
        }
      }
      marks.push(mark)
    } else {
      const parentInline = inline as Ast.Parent
      const mark: Mark = {
        type: MarkType.HYPER,
        meta: inline.type,
        startIndex: (inline?.position?.start?.offset || 0) - (offset || 0),
        startContent: str.substring(
          parentInline?.position?.start?.offset,
          parentInline.children[0]?.position?.start?.offset
        ),
        endIndex:
          (parentInline.children[parentInline.children.length - 1]?.position
            ?.end?.offset || 0) - (offset || 0),
        endContent: str.substring(
          parentInline.children[parentInline.children.length - 1]?.position?.end
            ?.offset,
          parentInline?.position?.end?.offset
        )
      }
      marks.push(mark)
    }
  })
  blockMark.value = str.substring(
    block?.position?.start?.offset,
    block?.position?.end?.offset
  )
  blockMark.hyperMarks = marks
    .map((mark) => {
      if (isRawMark(mark)) {
        if (mark.code === MarkSideType.RIGHT) {
          return
        }
        if (mark.code === MarkSideType.LEFT) {
          const { rightPair: rightCode } = mark
          mark.startContent = str.substring(
            mark.startIndex + (offset || 0),
            mark.endIndex + (offset || 0)
          )
          mark.endIndex = rightCode?.endIndex || 0
          mark.endContent = ''
          delete mark.rightPair
          return mark
        }
      }
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
const parser = (data: Data): Data => {
  const raw = data.content
  const content = data.modifiedContent
  const ignoredByParsers = data.ignoredByParsers

  const blockMarks: BlockMark[] = []

  const tree: Ast.Root = unified()
    .use(markdown)
    .use(frontmatter)
    .parse(content) as Ast.Root

  // - travel and record all paragraphs/headings/table-cells into blocks
  // - for each block, travel and record all
  // - - 'hyper' marks: emphasis/strong/delete/footnote/link/linkRef and continue
  // - - 'raw' marks: inlineCode/break/image/imageRef/footnoteRef/html and stop
  travelBlocks(tree, blockMarks)

  // for each block marks
  // - get block.start.offset
  // - for each marks
  // - - startIndex: mark.start.offset - offset
  // - - startContent: [mark.start.offset - offset, mark.firstChild.start.offset - offset]
  // - - endIndex: mark.lastChild.end.offset - offset
  // - - endContent: [mark.lastChild.end.offset - offset, mark.end.offset]
  blockMarks.forEach((blockMark) => processBlockMark(blockMark, raw))
  data.blocks = blockMarks.map((b): Block => {
    const position = parsePosition(b.block.position)
    ignoredByParsers.forEach(({ index, length, originContent: raw, meta }) => {
      if (position.start <= index && position.end >= index + length) {
        ;(b.hyperMarks || []).push({
          type: MarkType.RAW,
          meta,
          startIndex: index - position.start,
          startContent: raw,
          endIndex: index - position.start + length,
          endContent: ''
        })
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
