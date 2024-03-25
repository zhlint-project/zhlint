export default {
  base: '/',
  title: 'zhlint',
  titleTemplate: false,
  description: 'A linting tool for Chinese text content.',
  head: [
    ['link', { rel: 'icon', href: '/zhlint.svg' }]
  ],

  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Playground', link: '/playground' }
    ],
    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/zhlint-project/zhlint'
      }
    ],
    editLink: {
      pattern:
        'https://github.com/zhlint-project/zhlint/edit/master/docs/:path',
      text: 'Help us improve this page!'
    }
  }
}
