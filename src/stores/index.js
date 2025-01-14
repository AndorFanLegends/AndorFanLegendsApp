/* eslint-disable */
import i18n from "./../locales/i18n";
import options from './../options';
import { defineStore, storeToRefs } from 'pinia';
import {useHistoriesStore} from "./history.js";
import { useRoute } from "vue-router";

export const useLegendsStore = defineStore('legends', {
    //TODO: ADD OPTIONS FILE TO INIT filtering with all 
    state: () => ({
        legends: [],
        legend: null,
        filtering: {
            inApp: true,
            withPrintableElement: true,
            onlyPrintable: true,
            officialLegends: true,
            fanLegends: true,
            difficulty: options.difficultiesOptions.map(n => {return n.key}),
            board: options.boardOptions.map(n => {return n.key}),
            players: [1,2,3,4,5,6],
            year: options.yearOptions,
        }
    }),

    // getters return data from the data store
    getters: {
        getNumberOfLegends: (state) => {
            return state.legends.length
        },
        getCurrentLegend: (state) => {
            return state.legend
        },
        getSelectedYear(state) {
            if (state.filtering.year.length == 1) {
                return state.filtering.year[0];
            } else {
                return "Années (" + state.filtering.year.length + ")"
            }
        },
        getSelectedDifficulty(state) {
            if(state.filtering.difficulty.length == 1) {
                return options.difficultiesOptions.filter(item => item['key'] == state.filtering.difficulty)[0].name;
            } else {
                return "Difficulté (" + state.filtering.difficulty.length + ")"
            }
        },
        getSelectedBoard(state) {
            if (state.filtering.board.length == 1) {
                return options.boardOptions.filter(item => item['key'] == state.filtering.board)[0].name;
            } else {
                return "Plateau (" + state.filtering.board.length + ")"
            }
        },
        getSelectedAvailability(state) {
            if (!state.filtering.withPrintableElement && !state.filtering.onlyPrintable) {
                return "Not additional print";
            }
            if (state.filtering.inApp &&  !state.filtering.onlyPrintable) {
                return "In-App";    
            }
            if (state.filtering.onlyPrintable && !state.filtering.inApp) {
                return  "Only PnP";
            }
            if (!state.filtering.withPrintableElement) {
                return "Not additional print";
            }
            if (state.filtering.inApp &&  state.filtering.onlyPrintable) {
                return null;    
            }
            
            return "No legends";
        },
        getSelectedType(state) {
            return true;
        },
    },
    actions: {
        fetchLegend() {
            const route = useRoute();
            this.legend = null;
            this.legend = require('./../../public/legends/' + i18n.global.locale.value + "/" + route.params.legendSlug + '.json');
            
            // Sort cards by name
            this.legend.cards = sort_by_key(this.legend.cards, 'name');

            // Get the Legend's History
            const history = useHistoriesStore();
            
            history.loadHistory(this.legend.slug)
        },
        loadLegends2(state, searchKey) {

            let legends = require('./../../public/legends/legends-'+i18n.global.locale.value+'.json');
            // TODO : REPLACE internal func by using the history Store
            let history = getHistory().value;
        
            // FILTERING
            let filter = this.filtering;
            legends = legends.filter(function (n) { // YEARS
                return filter.year.includes(n.year)
            });

            /*legends = legends.filter(function (n) { // NUMBER OF PLAYERS
                //return n.difficulty.map(String).some(difficultyOne => filter.difficulty.includes(difficultyOne));
                let playersVal = n.players.split("-"); playersVal = playersVal.length === 1 ? [playersVal[0], playersVal[0]] : playersVal;
                console.log(playersVal);
                if (filter.players>= playersVal[0] && filter.players <= playersVal[1]){
                    return true;
                }
                return false;
                //filter.players
            });*/
            legends = legends.filter(function (n) { 
                const [debut, fin] = n.players.split("-").map(Number);
                return filter.players.some(valeur => fin ? valeur >= debut && valeur <= fin : valeur === debut); });
            
            legends = legends.filter(function (n) { // DIFFICULTY
                return n.difficulty.map(String).some(difficultyOne => filter.difficulty.includes(difficultyOne));
            });
            legends = legends.filter(function (n) { // BOARD
                return n.board.map(String).some(boardOne => filter.board.includes(boardOne));
            });
            legends = legends.filter(function (n) { // Only Printable False
                if (filter.onlyPrintable && n.cardsCount == 0) { //"Only PnP" && !filter.inApp
                    //console.log("only pnp");
                    return  true;
                }
                if ( filter.withPrintableElement && ( n.hasOwnProperty("additional")  && n.additional != null) ) { 
                    return true;
                }
                if( filter.inApp && filter.onlyPrintable && filter.withPrintableElement) { //ALL
                    return true;
                }
                if( filter.inApp && filter.onlyPrintable ) { //ALL
                    return true;
                }
                if ( (filter.inApp && !filter.onlyPrintable) && n.cardsCount > 0) { // "In-App";
                    //console.log("in app");
                    return true;
                }
                
                return false;
            });
            /*legends = legends.filter(function (n) { // Printable Element
                if ( !filter.withPrintableElement && ( n.hasOwnProperty("additional")  && n.additional != "") ) { 
                    return false;
                }
                return true;
            });*/
            // filter official and fan legends
            legends = legends.filter(function (n) { // Official bonus or Fan Legends
                if ( !filter.officialLegends && ( n.hasOwnProperty("officialBonus")  && n.officialBonus == true) ) { 
                    return false;
                }
                if ( !filter.fanLegends && ( n.officialBonus != true) ) { 
                    return false;
                }
                return true;
            });

            // SEARCHING
            if(searchKey) {
                //var userQuery = 'Ombre' //user input
                var myRegex = new RegExp('.*' + searchKey.trim() + '.*','gi'); //We create a new regular expression, this one tests if the text is contained within a string.
                legends = legends.filter(function(item){
                    return (myRegex.test(item.name) || myRegex.test(item.saga) || myRegex.test(item.author))
                });
            } 
        
            // get history
            legends = legends.map(legend => {
                let doneState = history.find(i => {
                    if( i.slug === legend.slug) {
                        //console.log("DONE = " + i.done);
                        return i.done;
                    }
                    return false;
                }) || false;
                let done =  doneState.done || false;
                return {...legend, done: done };
              });
            
            return legends;
        }
    },
})

function getHistory() {
    const {history} = storeToRefs(useHistoriesStore());
    return history;
}

/*function createLegendHistory(legend) {
    //console.log("1-" + legend.name);
    let history = {
        "name": legend.name,
        "slug": legend.slug,
        "cards": legend.cards.map(card => {
            return {
                "slug": card.slug,
                "seen": false
            }
        })
    };
    //console.log(history);
    // Add to History Store
    const store = useHistoriesStore();
    store.addHistory(history);
}*/

function sort_by_key(array, key) {
    return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}