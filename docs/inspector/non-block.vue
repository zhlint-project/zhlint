<script setup lang="ts">
import { inject, toRef, computed } from 'vue'

const props = defineProps<{ data: any }>()
const data = toRef(props, 'data')

const pseudoToken = computed(() =>({
  type: 'non-block',
  modifiedType: 'non-block',
  content: data.value.value,
  modifiedContent: data.value.value,
  index: data.value.start,
}))

const current = inject('current')
const currentProp = inject('currentProp')
const setCurrent = () => {
  // console.log('setCurrent', data)
  if (current) {
    current.value = pseudoToken.value
  }
  if (currentProp) {
    currentProp.value = 'content'
  }
}
</script>

<template
  ><span class="non-block" :class="{
    current: current?.index === pseudoToken?.index,
  }" @click="setCurrent">{{ data.value }}</span
></template>

<style scoped src="./labels.css"></style>
