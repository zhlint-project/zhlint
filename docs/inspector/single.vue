<script setup lang="ts">
import { inject } from 'vue'
import GroupToken from './group.vue'

const { data, start } = defineProps<{ data: any, modified: boolean, start: number }>()
const index = start + data.index

const current = inject('current')
const currentProp = inject('currentProp')
const setCurrent = (prop) => {
  // console.log('setCurrent', data, prop)
  if (current) {
    current.value = data
  }
  if (currentProp) {
    currentProp.value = prop
  }
}
</script>

<template
  ><GroupToken v-if="data.type === 'group'" :data="data" :modified="modified" :start="start"
  /><span v-else @click="setCurrent('content')" :class="{
    [data.modifiedType]: true,
    changed: data.content !== data.modifiedContent,
    ignored: 'ignoredContent' in data,
    [`start-${index}`]: true,
    current: current === data && currentProp === 'content'
  }">{{
    modified ? data.modifiedContent : data.content
  }}</span
  ><span v-if="modified ? data.modifiedSpaceAfter : data.spaceAfter" @click="setCurrent('spaceAfter')" :class="{
    'token-space-after': true,
    changed: data.spaceAfter !== data.modifiedSpaceAfter,
    ignored: 'ignoredSpaceAfter' in data,
    [`start-${index}`]: true,
    current: current === data && currentProp === 'spaceAfter'
  }">{{
    modified ? data.modifiedSpaceAfter : data.spaceAfter
  }}</span
></template>

<style scoped src="./labels.css"></style>
