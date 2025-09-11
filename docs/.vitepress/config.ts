import { defineConfig } from 'vitepress'
import { nav, sidebar } from './config/menu'
import { search } from './config/search'
import { outline } from './config/outline'

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
