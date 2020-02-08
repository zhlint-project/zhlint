const unified = require('unified')
const markdown = require('remark-parse')

const positionToString = position => `${position.start.offset}:${position.end.offset}`

const blockTypes = [
  'paragraph',
  'heading',
  'table-cell'
]
const travelBlocks = (node, blocks) => {
  if (node.children) {
    node.children.forEach(child => {
      if (blockTypes.indexOf(child.type) >= 0) {
        const blockMark = { block: child, inlineMarks: [] }
        blocks.push(blockMark)
        travelPhrasings(child, blockMark)
      } else {
        travelBlocks(child, blocks)
      }
    })
  }
}

const inlineMarkTypes = [
  'emphasis',
  'strong',
  'delete',
  'footnote',
  'link',
  'linkReference'
]
const rawMarkTypes = [
  'inlineCode',
  'break',
  'image',
  'imageReference',
  'footnoteReference',
  'html'
]
const travelPhrasings = (node, blockMark) => {
  if (node.children) {
    node.children.forEach(child => {
      if (inlineMarkTypes.indexOf(child.type) >= 0) {
        blockMark.inlineMarks.push({ inline: child })
        travelPhrasings(child, blockMark)
      }
      if (rawMarkTypes.indexOf(child.type) >= 0) {
        blockMark.inlineMarks.push({ inline: child, raw: true })
      }
    })
  }
}

const processBlockMark = (blockMark, str) => {
  const { block, inlineMarks } = blockMark
  const offset = block.position.start.offset
  const marks = []
  inlineMarks.forEach(inlineMark => {
    const mark = {}
    const { inline } = inlineMark
    if (inlineMark.raw) {
      mark.type = 'raw'
      mark.meta = inline.type
      mark.startIndex = inline.position.start.offset - offset
      mark.endIndex = inline.position.end.offset - offset
      mark.startContent = str.substring(
        inline.position.start.offset,
        inline.position.end.offset
      )
      mark.endContent = ''
    } else {
      mark.type = 'hyper'
      mark.meta = inline.type
      mark.startIndex = inline.position.start.offset - offset
      mark.startContent = str.substring(
        inline.position.start.offset,
        inline.children[0].position.start.offset
      )
      mark.endIndex = inline.children[inline.children.length - 1].position.end.offset - offset
      mark.endContent = str.substring(
        inline.children[inline.children.length - 1].position.end.offset,
        inline.position.end.offset
      )
    }
    marks.push(mark)
  })
  blockMark.value = str.substring(block.position.start.offset, block.position.end.offset)
  blockMark.hyperMarks = marks
}

/**
  - travel all blocks/lists/tables/rows/cells
    - content: paragraph/heading/table-cell
    - no content: thematic break/code/html
  - for all phrasings:
    - no text: inline code/break/image/image ref/footnote ref/html
    - marks: emphasis/strong/delete/footnote/link/link ref
 */
module.exports = str => {
  const blockMarks = []

  const tree = unified().use(markdown).parse(str)

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
  blockMarks.forEach(blockMark => processBlockMark(blockMark, str))

  return blockMarks.map(b => ({ value: b.value, marks: b.hyperMarks }))
}
