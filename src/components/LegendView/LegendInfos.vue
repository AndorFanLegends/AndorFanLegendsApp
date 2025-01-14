<script setup>
    import { ref, defineProps, defineEmits, watch } from 'vue';
    import { storeToRefs } from 'pinia';
    import options from './../../options';
    import {useLegendsStore} from './../../stores';

    //import { useLegendsStore } from '@/stores/legends'; 
    const legendsStore = useLegendsStore();
    const { legend } = storeToRefs(legendsStore);

    const props = defineProps({
        dialogInformations: {
            type: Boolean,
            required: true
        }
    });
    const emit = defineEmits(['update:dialogInformations']);

    // Créer une variable réactive locale pour éviter de muter directement les props
    const localDialogInformations = ref(props.dialogInformations);

    // Synchroniser les changements de props avec la variable locale
    watch(() => props.dialogInformations, (newVal) => {
        localDialogInformations.value = newVal;
    });

    // Fonction pour fermer le dialogue
    function closeDialog() {
        emit('update:dialogInformations', false);
    }
</script>

<template>
    <v-dialog v-model="localDialogInformations" max-width="500">
      <v-card>
        <v-card-title class="text-h5">{{ $t('legend.informations') }}</v-card-title>
        <v-card-text>
          <p><label class="font-weight-bold">{{ $t('legend.name') }} : </label>{{ legend.name }}</p>
          <p><label class="font-weight-bold">{{ $t('legend.author') }} : </label>{{ legend.author }}</p>
          <p><label class="font-weight-bold">{{ $t('legend.description') }} : </label>{{ legend.abstract }}</p>
          <p><label class="font-weight-bold">{{ $t('legend.year') }} : </label>{{ legend.year }}</p>
          <p><label class="font-weight-bold">{{ $t('legend.playersNumber') }} : </label>{{ legend.players }}</p>
          <p>
            <label class="font-weight-bold">{{ $t('legend.difficulty') }} : </label>
            {{ legend.difficulty.map((diff) => { 
                    return $t(options.difficultiesOptions.filter(item => {return item['key'] == diff} )[0].name)
              }).join(' - ') 
            }}
          </p>
          <p>
              <label class="font-weight-bold">{{ $t('legend.board') }} : </label>
              {{ legend.board.map((boardOne) => { 
                    return $t(options.boardOptions.filter(item => {return item['key'] == boardOne} )[0].name)
                }).join(' - ') }}
          </p>
          <p>
            <label class="font-weight-bold">{{ $t('legend.boxExt') }} : </label>
            {{ legend.boxExt.map((boxOne) => { 
                    return $t(options.boxExtOptions.filter(item => {return item['key'] == boxOne} )[0].name)
                }).join(' - ') }}
          </p>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" text @click="closeDialog">{{ $t('close') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  

  