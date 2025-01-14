<script setup>
    import router from './../../router';
    import {useLegendsStore} from './../../stores';
    import {reactive, computed} from 'vue';
    import options from './../../options';

    const store = useLegendsStore();
    store.legends = store.loadLegends2()
    store.legend = null
    
    let navigation = reactive({
        page: 1,
        pageSize: 12,
        //list: [], //[]
        listCount: 0,
        historyList: []
    })

    let searchKeyword = reactive()

    initPage();
    //updatePage();

    function initPage() {
        navigation.listCount = store.legends.length;
        /*if (route.query.page && route.query.page !=1) {
            navigation.page = route.query.page;
            updatePage(route.query.page);
        } else {*/
            //navigation.listCount = store.legends.length;
            if (navigation.listCount < navigation.pageSize) {
                navigation.historyList = store.legends;
            } else {
                navigation.historyList = store.legends.slice(0, navigation.pageSize);
            }
        //}
        //console.log(navigation);
    }

    // a computed ref
    const pages = computed(() => {
        if (navigation.pageSize == null || navigation.listCount == null) {
            return 0;
        }
        //console.log("PAGES (count & size)= " + navigation.listCount  + "-" + navigation.pageSize )
        return Math.ceil(navigation.listCount / navigation.pageSize);
    })

    function updatePage(pageIndex) {
        let _start = (pageIndex - 1) * navigation.pageSize;
        let _end = pageIndex * navigation.pageSize;
        navigation.historyList = store.legends.slice(_start, _end);
        navigation.page = pageIndex;
        router.replace({ query: { page: pageIndex } })
    }

    // METHODS 
    function handleFilter() {
        router.push(`/filter`);
    }

    function onSearch() {
        console.log(searchKeyword)
        store.legends = store.loadLegends2('',searchKeyword);
        initPage()
    }
    
    function changeLegend(slug) {
        router.push({path:`/${slug}` });
    }

    function showYear() {
        if(store.filtering.year.length == options.yearOptions.length) {
            return false;
        }
        return true;
    }
    function resetYear() {
        store.filtering.year = options.yearOptions;
        store.legends = store.loadLegends2();
        initPage();
    }
    function showDifficulty() {
        if(store.filtering.difficulty.length == options.difficultiesOptions.length) {
            return false;
        }
        return true;
    }
    function resetDifficulty() {
        store.filtering.difficulty = options.difficultiesOptions.map(n => {return n.key})
        store.legends = store.loadLegends2();
        initPage();
    }
    function showBoard() {
        if(store.filtering.board.length == options.boardOptions.length) {
            return false;
        }
        return true;
    }
    function resetBoard() {
        store.filtering.board = options.boardOptions.map(n => {return n.key})
        store.legends = store.loadLegends2();
        initPage();
    }
    function showAvailability() {
        if (store.getSelectedAvailability == null) {
            return false;
        }
        return true;
    }
    function resetAvailability() {
        store.filtering.inApp = true;
        store.filtering.onlyPrintable = true;
        store.filtering.withPrintableElement = true;
        store.legends = store.loadLegends2();
        initPage();
    }
</script>

<template>
    <v-container fill-height fluid >
        <v-row>
            <v-col cols="3"  class="d-flex">
                <v-btn prepend-icon="mdi-filter-variant"
                    class="filter"
                    density="confortable"
                    @click="handleFilter">{{$t("list.filter")}}</v-btn>
            </v-col>
            <v-col cols="6" offset="3" class="d-flex" align-self="end"> 
                <v-text-field
                    class="ps-8"
                    density="compact"
                    variant="solo"
                    v-bind:label="$t('search')"
                    append-inner-icon="mdi-magnify"
                    single-line
                    hide-details
                    @keydown.enter="onSearch"
                    v-model="searchKeyword"
                    :value="searchKeyword">
                </v-text-field>
            </v-col>
        </v-row>
        <v-row>
            <v-chip
                v-show="showAvailability()"
                class="ma-2"
                closable
                @click:close="resetAvailability()">
                {{store.getSelectedAvailability}}
            </v-chip>
            <v-chip
                v-show="showDifficulty()"
                class="ma-2"
                closable
                @click:close="resetDifficulty()">
                {{store.getSelectedDifficulty}}
            </v-chip>
            <v-chip
                v-show="showBoard()"
                class="ma-2"
                closable
                @click:close="resetBoard()">
                {{store.getSelectedBoard}}
            </v-chip>
            <v-chip
                v-show="showYear()"
                class="ma-2"
                closable
                @click:close="resetYear()">
                {{store.getSelectedYear}}
            </v-chip>
        </v-row>
        <v-row>
            <v-col md="12">
                <v-expansion-panels>
                    <v-expansion-panel v-for="(legend, index) in navigation.historyList" :key="index">
                        <v-expansion-panel-title>
                            <template v-if="legend.saga">{{ legend.saga }} {{ legend.sagaNumber}} - </template>{{ legend.name }}
                            <v-icon v-if="legend.officialBonus==true" class="only-download" color="red-darken-2" icon="mdi-shield-sword"></v-icon>
                            <v-icon v-if="legend.cardsCount==0" class="only-download" color="red-darken-2" icon="mdi-link"></v-icon>
                            <template v-slot:actions v-if="legend.done">
                                <v-icon color="teal">mdi-check</v-icon>
                            </template>
                        </v-expansion-panel-title>
                        <v-expansion-panel-text>
                            <v-row>
                                <v-col class="features sp-0" sm="12"  justify="center">
                                    <v-chip size="small" >
                                        <!--{{ legend.difficulty}}-->
                                        {{ legend.difficulty.map((diff) => { 
                                            return $t(options.difficultiesOptions.filter(item => {return item['key'] == diff} )[0].name)
                                        }).join(' - ') }}
                                    </v-chip>
                                    <v-chip size="small" >
                                        {{ legend.board.map((boardOne) => { 
                                            return $t(options.boardOptions.filter(item => {return item['key'] == boardOne} )[0].name)
                                        }).join(' - ') }}
                                    </v-chip>
                                    <v-chip size="small">
                                        {{ legend.players }} {{ $t("playersCountText", parseInt(legend.players.charAt(0))) }}
                                    </v-chip>
                                    <v-chip size="small" class="bg-red-accent-3"
                                        download
                                        v-if="legend.additional">
                                        {{ $t("legend.additionalPnp") }}
                                    </v-chip>
                                    <v-chip v-bind="attrs" v-on="on" outlined>
                                        <v-icon left>mdi-toy-brick</v-icon>
                                        <v-tooltip
                                            activator="parent"
                                            location="bottom">
                                            <span v-for="(item, index) in legend.boxExt" :key="index">
                                                {{ options.boxExtOptions.find(option => option.key === item).name }}<br>
                                            </span>
                                        </v-tooltip>
                                    </v-chip>
                                </v-col>
                            </v-row> 
                            <v-row class="details" justify="center">
                                {{ legend.abstract }} <em v-if="legend.author">{{$t("list.createdBy")}} {{ legend.author }}</em> <em>({{ legend.year }})</em>
                                <v-col class="launch" sm="3" align="center" justify="center">
                                        <v-btn 
                                            v-if="legend.cardsCount==0"
                                            :href="legend.download" 
                                            density="comfortable" class="bg-orange-darken-4 float-right rounded mt-3">
                                            {{ $t("list.downloadLegend") }}</v-btn>
                                        <v-btn 
                                            v-if="legend.cardsCount>0"
                                            @click="changeLegend(legend.slug)" 
                                            density="comfortable" class="bg-orange-darken-4 float-right rounded mt-3">
                                            {{ $t("list.startLegend") }}</v-btn>
                                </v-col>
                            </v-row>
                        </v-expansion-panel-text>
                    </v-expansion-panel>
                    <v-pagination class="pagination mb-2" v-model="navigation.page" :length="pages" @update:modelValue="updatePage"></v-pagination>
                </v-expansion-panels>
            </v-col>
        </v-row>
    </v-container>
</template>

<style>
.v-expansion-panel-text__wrapper{
    /*padding: 10px 10px 0px;*/
    font-size: 0.9em;
}
.details{margin-top:0px;}
.features .v-chip{margin-right:10px;}
.launch .v-btn {
    margin:0px !important;
}
.only-download {
    margin: 0 10px;
}
.filter{
    text-transform: none;
}
</style>