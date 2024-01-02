<script setup lang="ts">
import { inject, toRef, computed, Ref } from 'vue'
import GroupToken from './group.vue'

const props = defineProps<{ data: any; modified: boolean; start: number }>()
const data = toRef(props, 'data')
const start = toRef(props, 'start')
const index = computed(() => start.value + data.value.index)

const current = inject<Ref<any>>('current')
const currentProp = inject<Ref<string>>('currentProp')
const setCurrent = (prop) => {
  // console.log('setCurrent', data, prop)
  if (current) {
    current.value = data.value
  }
  if (currentProp) {
    currentProp.value = prop
  }
}
</script>

<template>
  <GroupToken
    v-if="data.type === 'group'"
    :data="data"
    :modified="modified"
    :start="start"
  /><span
    v-else
    @click="setCurrent('value')"
    :class="{
      [data.modifiedType]: true,
      changed: data.value !== data.modifiedValue,
      ignored: 'ignoredValue' in data,
      [`start-${index}`]: true,
      current: current === data && currentProp === 'value'
    }"
    >{{ modified ? data.modifiedValue : data.value }}</span
  ><span
    v-if="modified ? data.modifiedSpaceAfter : data.spaceAfter"
    @click="setCurrent('spaceAfter')"
    :class="{
      'token-space-after': true,
      changed: data.spaceAfter !== data.modifiedSpaceAfter,
      ignored: 'ignoredSpaceAfter' in data,
      [`start-${index}`]: true,
      current: current === data && currentProp === 'spaceAfter'
    }"
    >{{ modified ? data.modifiedSpaceAfter : data.spaceAfter }}</span
  >
</template>

<style scoped src="./labels.css"></style>
