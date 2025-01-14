import { defineStore } from 'pinia'

export const useSettingsStore = defineStore('settings', {
    persist: true,
    state: () => ({
        settings: [
        ],
        activeLanguage: null
    }),
    getters: {
        getCurrentLanguage: (state) => {
            return state.activeLanguage
        }
    } 
});