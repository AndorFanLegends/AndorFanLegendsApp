import { defineStore } from 'pinia'
import {useLegendsStore} from './index.js';  
//import { useRoute } from "vue-router";

export const useHistoriesStore = defineStore('history', {
    persist: true,
    state: () => ({
        history: [],
        activeHistory: null
    }),

    getters: {
        getCurrentLegendHistory: (state) => {
            return state.activeHistory 
        },
        currentCardHistory () {

        }
    },

    actions: {
        setCurrentHistory() {
            const legends = useLegendsStore()
            if (legends.getCurrentLegend) {
                this.activeHistory = this.history.find(i => i.slug === legends.getCurrentLegend.slug)
            }
        },
        loadHistory(slug) {
            let legendHistory = this.history.find(i => i.slug === slug);
            if (!legendHistory) {
                console.log("Creation de l'historique")
                this.createLegendHistory();
            }
            return legendHistory;
        },
        createLegendHistory() {
            const legends = useLegendsStore()
            //console.log(legends.getCurrentLegend)
            const legend = legends.getCurrentLegend
            let history = {
                "name": legend.name,
                "slug": legend.slug,
                "done": false,
                "cards": legend.cards.map(card => {
                    return {
                        "slug": card.slug,
                        "seen": false
                    }
                })
            };
            // Add to History Store
            const store = useHistoriesStore();
            store.addHistory(history);
        },
        seenCard(currentCard) {
            this.getCurrentLegendHistory.cards.find(i => i.slug === currentCard).seen = true            
        },
        doAction(type){
            switch(type){
                case 'finish':
                    console.log('finish')
                    this.activeHistory.cards.map(card => {
                            card.seen = true
                    })
                    this.activeHistory.done = true
                    break;
                case 'reset':
                    this.activeHistory.cards.map(card => {
                        card.seen = false
                    })
                    this.activeHistory.done = false
                    break;
            }
        },
        /*legendReset() {

        },

        legendDone() {

        },

        cardsDone() {

        },*/

        legendHistory(slug) {
/*            console.log("legendHistory")
            console.log(this.history.find(i => {
                console.log("SLUG" + slug + ' VS ' + i.slug)
                console.log(i.slug)
                console.log(i.slug === slug)
                return i.slug === slug

            }))*/
            //{{ areaName.area.find(({id}) => id === 1 ).name }}
            return this.history.find(i => i.slug === slug) || false;
        },

        addHistory(history) {
            this.history.push(history);
        }
    }
});