module.exports = {
  base: "/zhlint/",
  title: "zhlint",
  description: "A linting tool for Chinese text content.",
  patterns: ['README.md'],
  themeConfig: {
    nav: [
      { text: "Home", link: "/" }
    ],

    sidebar: ["/"],
    sidebarDepth: 1,

    repo: "jinjiang/zhlint",
    repoLabel: "GitHub",
    docsDir: ".",
    docsBranch: "master",
    editLinks: true,
    editLinkTest: "Help us improve this page!"
  }
};