<script setup>
    import {useLegendsStore} from './../../stores';
    import options from './../../options';
    import {reactive, watch } from 'vue';

    // TODO : Delete route and historyback and place result button in main APP.vue ????
    import { useRouter } from 'vue-router';
    const router = useRouter();

    const store = useLegendsStore();
    let selected = reactive(store.filtering);
    watch(selected, () => {
        store.legends = store.loadLegends2();
    });

    // TODO : Delete route and historyback and place result button in main APP.vue ????
    function historyBack() {
        router.go(-1);
    }
</script>

<template>
    <v-container>
    <section class="page">
        <v-row class="center">
            <v-col >
                <p class="text-h5">{{ $t("filter.availabilityType") }}</p>
                <v-switch
                    color="light-green-darken-4"
                    v-bind:label="$t('filter.playableInApp')"
                    v-model="selected.inApp"
                    name="inApp"
                    hide-details
                    ></v-switch>
                <v-switch
                    color="light-green-darken-4"
                    v-model="selected.withPrintableElement"
                    name="withPrintableElement"
                    v-bind:label="$t('filter.printableElement')"
                    hide-details>
                    <template v-slot:label>
                        {{ $t('filter.printableElement') }}<v-chip size="small" class="bg-red-accent-3 only-download"
                            download>
                            {{ $t("legend.additionalPnp") }}
                        </v-chip>
                    </template>
                    
                </v-switch>
                <v-switch
                    color="light-green-darken-4"
                    v-model="selected.onlyPrintable"
                    name="onlyPrintable"
                    hide-details>
                    <template v-slot:label>
                        {{ $t('filter.printOnly') }}<v-icon class="only-download" color="red-darken-2" icon="mdi-link"></v-icon>
                    </template>
                </v-switch>
                <p class="text-h5">{{ $t('filter.legendType') }}</p>
                <v-switch
                    color="light-green-darken-4"
                    v-model="selected.officialLegends"
                    name="officialLegends"
                    hide-details>
                    <template v-slot:label>{{ $t('filter.officialLegends') }}
                        <v-icon class="only-download" color="red-darken-2" icon="mdi-shield-sword"></v-icon>
                    </template>
                </v-switch>
                <v-switch
                    color="light-green-darken-4"
                    v-model="selected.fanLegends"
                    name="fanLegends"
                    v-bind:label="$t('filter.fanLegends')"
                    hide-details
                    ></v-switch>
                <p class="text-h5">{{ $t('filter.difficulty') }}</p>
                <v-chip-group
                    v-model="selected.difficulty"
                    selected-class="bg-light-green-darken-4"
                    column multiple>
                    <v-chip
                        color="grey-lighten-3"
                        v-for="difficulty in options.difficultiesOptions" 
                            :key="difficulty.key"
                            :value="difficulty.key">
                        {{ $t(difficulty.name) }}
                    </v-chip>
                </v-chip-group>
                

                <p class="text-h5">{{ $t('filter.board') }}</p>
                <v-chip-group
                    v-model="selected.board"
                    selected-class="bg-light-green-darken-4"
                    column multiple>
                    <v-chip
                        color="grey-lighten-3"
                        v-for="board in options.boardOptions" 
                            :key="board.key"
                            :value="board.key">
                        {{ $t(board.name) }}
                    </v-chip>
                </v-chip-group>

                <p class="text-h5">{{ $t('filter.playersNumber') }}</p>
                <v-chip-group
                    v-model="selected.players"
                    selected-class="bg-light-green-darken-4"
                    column multiple>
                    <v-chip
                        color="grey-lighten-3"
                        v-for="players in [1,2,3,4,5,6]" 
                            :key="players"
                            :value="players">
                        {{ players }}
                    </v-chip>
                </v-chip-group>

                <p class="text-h5">{{ $t('filter.year') }}</p>
                <v-chip-group
                    v-model="selected.year"
                    selected-class="bg-light-green-darken-4"
                    column multiple>
                    <v-chip
                        color="grey-lighten-3"
                        v-for="year in options.yearOptions" 
                            :key="year"
                            :value="year">
                        {{ year }}
                    </v-chip>
                </v-chip-group>
            <!--    
            <p class="text-h5">Nombre de héros</p>
            <span>difficulté selectionnée : {{selected.difficulty}}</span>
            <span>Plateau selectionnée : {{selected.board}}</span>
            -->
            </v-col>
        </v-row>
        <v-bottom-navigation active>
            <v-btn @click="historyBack"  block>{{ $t("filter.displayResults", store.getNumberOfLegends) }}</v-btn>
        </v-bottom-navigation>
    </section>
</v-container>

</template>

<style>
.page {
    margin: 2rem;
}

.text-h5{
    margin:15px 0 0 0;
}

.v-bottom-navigation .v-bottom-navigation__content > .v-btn {
    max-width: 100%;
}
</style>