import { defineConfig } from 'vitepress'
import { nav, sidebar } from './menu'
import { search } from './search'
import { outline } from './outline'

export default defineConfig({
  lang: 'ru-RU',
  title: 'Документация ЧПУ',
  description: 'Регламенты и инструкции для операторов станков ЧПУ',
  cleanUrls: true,
  lastUpdated: true,
  themeConfig: {
    siteTitle: 'Документация',
    search,
    nav,
    sidebar,
    outline
  }
})
