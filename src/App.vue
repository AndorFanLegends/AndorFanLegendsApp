<script setup>
    import { ref, computed, reactive } from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    import { useConfirm, useSnackbar } from 'vuetify-use-dialog'
    import { useI18n } from "vue-i18n";

    import { useHistoriesStore } from "./stores/history.js";
    import { useSettingsStore } from './stores/settings.js';

    import LegendInfos from "./components/LegendView/LegendInfos.vue";

    // APP UPDATER
    import useUpdater from './update.js';
    let updater = useUpdater();
    updater.created()
    
    function refreshApp() {
        //console.log("refrshapp")
        updater.updateData.updateExists = false
        // Make sure we only send a 'skip waiting' message if the SW is waiting
        if (!updater.updateData.registration || !updater.updateData.registration.waiting) return
        // Send message to SW to skip the waiting and activate the new SW
        updater.updateData.registration.waiting.postMessage({ type: 'SKIP_WAITING' })
    }

    // Language INIT
    const { t, locale } = useI18n();
    const userSettings = useSettingsStore();
    let languageSettings = reactive(userSettings.activeLanguage);
    if (languageSettings != null && languageSettings != locale.value) {
        locale.value = languageSettings;
    }
    userSettings.activeLanguage = locale.value;     

    //ROUTING
    const route = useRoute();
    const mainpage = computed(() => {
        return route.path === "/";
    });
    const filter = computed(() => {
        return route.path === "/filter";
    });
    const settings = computed(() => {
        return route.path === "/settings";
    });

    const router = useRouter();
    function historyBack() {
        router.go(-1);
    }

    // ACTIVE LEGEND ?
    var activeLegend= ref("");
    function receiveEmit(legend) {
        activeLegend.value = legend;
    }

    // LEGEND MENU FUNC
    const dialogInformations = ref(false);

    function menuAdditionnalPnp() {
        console.log("additionnal");
    }

    function menuDownloadLegend() {
        console.log("download");
    }

    function menuFinish() {
        let options = {
            title: t('legend.markAsDoneTitle'),
            content: t('legend.markAsDoneText'),
            confirmationText: t('confirmationText'),
            cancellationText: t('cancellationText')
        }
        handleConfirm(options,"finish")
    }

    function menuReset() {
        let options = {
            title: t('legend.resetTitle'),
            content: t('legend.resetText'),
            confirmationText: t('confirmationText'),
            cancellationText: t('cancellationText')
        }
        handleConfirm(options, 'reset')
    }

    const createConfirm = useConfirm()
    const createSnackbar = useSnackbar()

    async function handleConfirm(options, type) {
        const isConfirmed = await createConfirm(options)
        if (!isConfirmed) return
        createSnackbar({ text: 'Confirmed' })
        //console.log(type)
        const history = useHistoriesStore()
        history.doAction(type)
        return true
    }

    function handleSettings() {
        router.push(`/settings`);
    }

    //let updateAvailable = reactive(false)
    function handleUpdate() {
        updater.updateData.snackUpdateExists = true
        //router.push(`/update`);
    }

    /*function handleLoading() {
        this.$store.dispatch("loadLegenden");
    }*/
    //const snackbar = true
</script>

<template>
    <v-app>
        <v-container class="py-0">
            <v-app-bar class="v-theme--dark" :elevation="2">
                <div id="back">
                    <v-btn density="default" icon="mdi-keyboard-backspace"
                        v-show="!mainpage && !settings"
                        @click="historyBack"
                    ></v-btn>
                </div>
                <div id="actions">
                    <!--<ui-icon-button
                        v-show="mainpage"
                        color="black"
                        icon="refresh"
                        :loading="loading"
                        size="large"
                        type="secondary"
                        @click="handleLoading"
                    ></ui-icon-button>-->
                </div>
                <img src="./assets/logo-menu.png"
                    v-if="mainpage" 
                    alt style="max-height: 100%">
                <div
                    v-if="mainpage">Fan Legends
                </div>
                <div
                    v-if="!mainpage && !filter">{{activeLegend.name}}
                </div>
                <template v-slot:append>
                    <v-btn v-show="updater.updateData.updateExists" icon="mdi-bell"  @click="handleUpdate"></v-btn>
                    <v-menu class="align-content-end" v-if="mainpage">
                        <template  v-slot:activator="{ props }">
                            <v-btn icon="mdi-cog" v-bind="props" @click="handleSettings"></v-btn>
                        </template>
                    </v-menu>
                    
                    <v-menu class="align-content-end" v-if="!mainpage && !filter && !settings">
                        <template v-slot:activator="{ props }">
                        <v-btn icon="mdi-dots-vertical" v-bind="props"></v-btn>
                        </template>
                        
                        <v-list>
                            <v-list-item @click="dialogInformations = true">
                                <v-list-item-title>{{ $t('legend.informations') }}</v-list-item-title>
                            </v-list-item>
                            <v-list-item v-if="activeLegend.additionaldownload" @click="menuAdditionnalPnp()">
                                <v-list-item-title>{{ $t('legend.downloadPnpContent') }}</v-list-item-title>
                            </v-list-item>
                            <v-list-item @click="menuDownloadLegend()">
                                <v-list-item-title>{{ $t('legend.downloadLegend') }}</v-list-item-title>
                            </v-list-item>
                            <v-list-item @click="menuFinish()">
                                <v-list-item-title>{{ $t('legend.markAsDone') }}</v-list-item-title>
                            </v-list-item>
                            <v-list-item @click="menuReset()">
                                <v-list-item-title>{{ $t('legend.reset') }}</v-list-item-title>
                            </v-list-item>
                        </v-list>
                    </v-menu>
                </template>    
            </v-app-bar>
        </v-container>
        <v-main class="d-flex justify-center" style="min-height: 300px;"><!--align-center -->
            <router-view @activeLegend="receiveEmit"></router-view>
            <v-snackbar bottom right v-model="updater.updateData.snackUpdateExists" :timeout="5000" color="primary">
                An update is available
                <v-btn text @click="refreshApp">
                    Update
                </v-btn>
            </v-snackbar>
        </v-main>
        <LegendInfos :dialogInformations="dialogInformations" @update:dialogInformations="dialogInformations = $event" ></LegendInfos>
    </v-app>
</template>

<style>
.v-toolbar__content{
    background: #5f5f5f;
}

.add-to-homescreen-container {
    background-color: #33691e !important;
    color: #fff !important;
    
    .icon{
        background-size: 60% !important;
    }

    .btn-container{
        float: none !important;

        .add-button{
            border-radius: 25px;
            :hover{
                background-color:#f1f2f5;
            }
        }

    }
}
</style>
