import { readFileSync, writeFileSync } from 'fs'
import { isAbsolute, relative, resolve } from 'path'
import { unified } from 'unified'
import markdown from 'remark-parse'
import frontmatter from 'remark-frontmatter'
import { toMarkdown } from 'mdast-util-to-markdown'

const travelInlines = (node) => {
  if (node.type === 'image' && !isAbsolute(node.url)) {
    node.url = relative('.', resolve('docs', node.url))
  }
}

const travelBlocks = (node) => {
  if (node.children) {
    node.children = node.children.filter(
      (child) => child.type !== 'html' && child.type !== 'yaml'
    )
    node.children.forEach((child) => {
      travelBlocks(child)
    })
  } else {
    travelInlines(node)
  }
}

const content = readFileSync('docs/index.md', 'utf8')

const tree = unified().use(markdown).use(frontmatter).parse(content)

travelBlocks(tree)

writeFileSync('README.md', toMarkdown(tree, { bullet: '-' }))
