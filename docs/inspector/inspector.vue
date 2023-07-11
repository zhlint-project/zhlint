<script setup lang="ts">
import { provide, ref } from 'vue';

import NonBlock from './non-block.vue'
import Block from './block.vue'
import Status from './status.vue'
import Legends from './legends.vue';

const { data } = defineProps<{ data: any }>()

const current = ref()
provide('current', current)
const currentProp = ref('')
provide('currentProp', currentProp)

// TODO:
data.validations
</script>

<template>
  <div id="inspector">
    <h2>Inspector</h2>
    <div>
      <h3>Origin</h3>
      <pre><template v-for="piece in data.__debug__.pieces"
        ><NonBlock v-if="'nonBlock' in piece" :data="piece"
        /><Block v-else :data="piece" /></template
      ></pre>
    </div>
    <div>
      <h3>Modified</h3>
      <pre><template v-for="piece in data.__debug__.pieces"
        ><NonBlock v-if="'nonBlock' in piece" :data="piece"
        /><Block v-else :data="piece" modified /></template
      ></pre>
    </div>
    <Status />
    <Legends />
  </div>
</template>

<style scoped>
#inspector {
  color: var(--vp-custom-block-details-text);
}
</style>
