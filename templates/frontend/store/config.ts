export interface ConfigState {
  appName: string,
  companyName: string
}

export const state: () => ConfigState = () => ({
  appName: process.env.appName || 'App Name',
  companyName: process.env.companyName || 'Company Name'
})

export const getters = {
  appName: (state: ConfigState) => state.appName
}
