<script setup lang="ts">
import Group from './group.vue'
import Single from './single.vue'

defineProps<{ data: any; modified?: boolean }>()
</script>

<template>
  <template v-for="token in data.tokens"
    ><template v-if="token.type === 'group'"
      ><Group
        :data="token"
        :modified="modified"
        :start="data.start" /></template
    ><template v-else
      ><Single
        :data="token"
        :modified="modified"
        :start="data.start" /></template
  ></template>
</template>
