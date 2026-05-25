import { defineConfig } from 'vitepress'
import { nav, sidebar } from './config/menu'
import { search } from './config/search'
import { i18n } from './config/i18n'

export default defineConfig({
  lang: 'ru-RU',
  title: 'Документация ЧПУ',
  description: 'Регламенты и инструкции для операторов станков ЧПУ',
  cleanUrls: true,
  lastUpdated: true,
  vite: {
    envDir: '../'
  },
  themeConfig: {
    siteTitle: 'Документация',
    search,
    nav,
    sidebar,
    ...i18n
  }
})
