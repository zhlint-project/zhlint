import { defineConfig } from 'vitepress'

export default defineConfig({
  base: '/zhlint/',
  title: 'zhlint',
  titleTemplate: false,
  description: 'A linting tool for Chinese text content.',

  themeConfig: {
    siteTitle: 'zhlint',
    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/Jinjiang/zhlint'
      }
    ],
    editLink: {
      pattern: 'https://github.com/Jinjiang/zhlint/edit/master/docs/:path',
      text: 'Help us improve this page!'
    }
  }
})
