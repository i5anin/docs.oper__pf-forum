import { defineConfig } from 'vitepress'
import { pagefindPlugin } from 'vitepress-plugin-pagefind'
import { nav, sidebar } from './menu'

export default defineConfig({
  lang: 'ru-RU',
  title: 'Документация ЧПУ',
  description: 'Регламенты и инструкции для операторов станков ЧПУ',
  cleanUrls: true,
  lastUpdated: true,
  themeConfig: {
    siteTitle: 'Документация',
    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
            translations: {
              button: {
                buttonText: 'Поиск',
                buttonAriaLabel: 'Открыть поиск'
              },
              modal: {
                displayDetails: 'Показать подробности',
                resetButtonTitle: 'Очистить',
                backButtonTitle: 'Назад',
                noResultsText: 'Ничего не найдено',
                footer: {
                  selectText: 'выбрать',
                  navigateText: 'навигация',
                  closeText: 'закрыть'
                }
              },
            }
          }
        }
      }
    },
    nav,
    sidebar,
    outline: {
      level: [2, 3],
      label: 'Содержание'
    }
  }
})
