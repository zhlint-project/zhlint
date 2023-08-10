<script setup lang="ts">
import { inject, toRef, computed } from 'vue'
import SingleToken from './single.vue'

const props = defineProps<{ data: any, modified: boolean, start: number }>()
const data = toRef(props, 'data')
const start = toRef(props, 'start')
const startIndex = computed(() => start.value + data.value.startIndex)
const endIndex = computed(() => start.value + data.value.endIndex)

const current = inject('current')
const currentProp = inject('currentProp')
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

<template
  ><span @click="setCurrent('startContent')" :class="{
    'quote-start-content': true,
    changed: data.startContent !== data.modifiedStartContent,
    ignored: 'ignoredStartContent' in data,
    [`start-${startIndex}`]: true,
    current: current === data && currentProp === 'startContent'
  }">{{
    modified ? data.modifiedStartContent : data.startContent
  }}</span
  ><span v-if="modified ? data.modifiedInnerSpaceBefore : data.innerSpaceBefore" @click="setCurrent('innerSpaceBefore')" :class="{
    'quote-inner-space-before': true,
    changed: data.innerSpaceBefore !== data.modifiedInnerSpaceBefore,
    ignored: 'ignoredInnerSpaceBefore' in data,
    [`start-${startIndex}`]: true,
    current: current === data && currentProp === 'innerSpaceBefore'
  }">{{
    modified ? data.modifiedInnerSpaceBefore : data.innerSpaceBefore
  }}</span
  ><SingleToken v-for="(token, i) in data.map(x => x)" :key="i" :data="token" :modified="modified" :start="start"
  /><span @click="setCurrent('endContent')" :class="{
    'quote-end-content': true,
    changed: data.endContent !== data.modifiedEndContent,
    ignored: 'ignoredEndContent' in data,
    [`start-${endIndex}`]: true,
    current: current === data && currentProp === 'endContent'
  }">{{
    modified ? data.modifiedEndContent : data.endContent
  }}</span
></template>

<style scoped src="./labels.css"></style>
