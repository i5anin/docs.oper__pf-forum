import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import { createApi } from './api'

export const ApiKey = Symbol('ApiClient')

const theme: Theme = {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    const api = createApi()
    app.provide(ApiKey, api)
    // @ts-expect-error
    app.config.globalProperties.$api = api
  }
}

export default theme
