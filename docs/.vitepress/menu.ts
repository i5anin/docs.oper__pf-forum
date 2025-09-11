import type { DefaultTheme } from 'vitepress'

export const nav: DefaultTheme.NavItem[] = [
  { text: 'Главная', link: '/' },
  { text: 'ЧАВО', link: '/faq' },
  { text: 'Контакты', link: '/contact' }
]

export const sidebar: DefaultTheme.Sidebar = [
  {
    text: 'Основные разделы',
    items: [
      { text: 'Главная', link: '/' },
      { text: 'По приёму и передаче смены операторов станков ЧПУ', link: '/operators/3' },
      { text: 'Регламент прохождения заготовок и полуфабрикатов', link: '/operators/4' },
      { text: 'Выявление и устранению «узких мест»', link: '/operators/5' }
    ]
  },
  {
    text: 'Инструкции оператору',
    items: [
      { text: 'Заполнение маршрутного листа', link: '/operators/6/' },
      { text: 'По операционной установке габаритных деталей на станок', link: '/operators/7' },
      { text: 'По операционной установке габаритных деталей на станок (токарный участок)', link: '/operators/8' },
      { text: 'Маркировка деталей серийного производства', link: '/operators/9' },
      { text: 'Внедрение «Электронной библиотеки учебных видеоматериалов»', link: '/operators/10' },
      { text: 'Меры по снижению рисков забраковки изделий с глухими резьбовыми отверстиями', link: '/operators/11/' },
      { text: 'Снижение риска брака с глухим резьбовым отверстием', link: '/operators/12' },
      { text: 'Заполнение ЭМЛ операторами станков с ЧПУ', link: '/operators/31' },
      { text: 'Оформление документации и работа с ЧПУ', link: '/operators/37' }
    ]
  },
  {
    text: 'Качество и стандарты',
    items: [
      { text: 'Действия оператора и наладчика с калибрами', link: '/quality/13' },
      { text: 'Распределение полуфабрикатов и продукции', link: '/quality/14' },
      { text: 'Использование калибров-пробок', link: '/quality/33' },
      { text: 'Контроль качества продукции', link: '/production/quality-control' },
      { text: '5S стандарты', link: '/production/5s-standard' },
      { text: 'TPM — обслуживание оборудования', link: '/production/tpm-maintenance' }
    ]
  },
  {
    text: 'Логистика и процессы',
    items: [
      { text: 'Движение инструмента в цехе', link: '/logistics/19' },
      { text: 'Использование крепёжной оснастки', link: '/logistics/15' },
      { text: 'Хранение и движение заготовок', link: '/logistics/21' },
      { text: 'Склад и Kanban', link: '/production/warehouse-kanban' },
      { text: 'CAPA: корректирующие действия', link: '/production/incident-capa' }
    ]
  },
  {
    text: 'Инструментальная комната',
    items: [
      { text: 'Использование инструментальной комнаты ТУ', link: '/tools/43' },
      { text: 'Использование инструментальной комнаты ФУ', link: '/tools/44' },
      { text: 'Правила движения управляющей программы', link: '/tools/42' }
    ]
  },
  {
    text: 'Обслуживание и охрана труда',
    items: [
      { text: 'Охрана труда и ТБ', link: '/production/safety-osh' },
      { text: 'Пожарная безопасность', link: '/production/fire-safety' },
      { text: 'Порядок выдачи спецодежды', link: '/safety/46' },
      { text: 'Сбор и экономия СОЖ', link: '/safety/45' }
    ]
  }
]
