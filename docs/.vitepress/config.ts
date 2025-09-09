import { defineConfig } from 'vitepress'
import { pagefindPlugin } from 'vitepress-plugin-pagefind'

export default defineConfig({
  lang: 'ru-RU',
  title: 'Документация ЧПУ',
  description: 'Регламенты и инструкции для операторов станков ЧПУ',
  cleanUrls: true,
  lastUpdated: true,

  // если сайт хостится не в корне домена — обязательно укажите base
  // base: '/docs.pfforum/',

  vite: {
    plugins: [
      pagefindPlugin({
        locales: 'ru',
        snippetLength: 60
      })
    ]
  },

  themeConfig: {
    siteTitle: 'Документация ЧПУ',
    nav: [
      { text: 'Главная', link: '/' },
      { text: 'ЧАВО', link: '/faq' }, // файл docs/faq.md
      { text: 'Контакты', link: '/contact' }
    ],
    sidebar: [
      {
        text: 'Основные разделы',
        items: [
          { text: 'Главная', link: '/' },
          { text: 'ЧАВО', link: '/faq' },
          { text: 'Организация Завода №5', link: '/production/plant5-organization' }
        ]
      },
      {
        text: 'Инструкции оператору',
        items: [
          { text: 'Действия при браке (ЧПУ)', link: '/production/cnc-defect' },
          { text: 'Регламент смены', link: '/production/shift-regulations' },
          { text: 'Охрана труда и ТБ', link: '/production/safety-osh' },
          { text: 'Пожарная безопасность', link: '/production/fire-safety' }
        ]
      },
      {
        text: 'Качество и стандарты',
        items: [
          { text: 'Контроль качества', link: '/production/quality-control' },
          { text: '5S стандарты', link: '/production/5s-standard' },
          { text: 'TPM — обслуживание оборудования', link: '/production/tpm-maintenance' }
        ]
      },
      {
        text: 'Логистика и улучшения',
        items: [
          { text: 'Склад и Kanban', link: '/production/warehouse-kanban' },
          { text: 'CAPA: корректирующие действия', link: '/production/incident-capa' },
          { text: 'Глоссарий', link: '/production/glossary' }
        ]
      }
    ],
    outline: { level: [2, 3], label: 'Содержание' }
  }
})
