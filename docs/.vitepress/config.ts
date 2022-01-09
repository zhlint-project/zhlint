import { defineConfig } from 'vitepress'

export default defineConfig({
  base: '/zhlint/',
  title: 'zhlint',
  description: 'A linting tool for Chinese text content.',

  themeConfig: {
    nav: [
      { text: 'Home', link: '/' }
    ],

    sidebar: [{ link: '/', text: 'zhlint'}],

    repo: 'jinjiang/zhlint',
    repoLabel: 'GitHub',
    docsDir: 'docs',
    docsBranch: 'master',
    editLinks: true,
    editLinkText: 'Help us improve this page!'
  }
})
