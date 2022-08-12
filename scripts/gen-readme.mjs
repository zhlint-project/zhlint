import fs from 'fs'
import path from 'path'
import unified from 'unified'
import markdown from 'remark-parse'
import frontmatter from 'remark-frontmatter'
import { toMarkdown } from 'mdast-util-to-markdown'

const travelInlines = node => {
  if (node.type === 'image' && !path.isAbsolute(node.url)) {
    node.url = path.relative('.', path.resolve('docs', node.url))
  }
}

const travelBlocks = node => {
  if (node.type === 'html') {
    node.value = ''
  }
  if (node.children) {
    node.children.forEach((child) => {
      travelBlocks(child)
    })
  } else {
    travelInlines(node)
  }
}

const content = fs.readFileSync('docs/index.md', 'utf8')

const tree = unified().use(markdown).use(frontmatter).parse(content)

travelBlocks(tree)

fs.writeFileSync('README.md', toMarkdown(tree, { bullet: '-' }))
