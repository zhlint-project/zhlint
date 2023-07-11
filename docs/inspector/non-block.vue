<script setup lang="ts">
import { inject } from 'vue'

const { data } = defineProps<{ data: any }>()

const pseudoToken = {
  type: 'non-block',
  modifiedType: 'non-block',
  content: data.value,
  modifiedContent: data.value,
  index: data.start,
}

const current = inject('current')
const currentProp = inject('currentProp')
const setCurrent = () => {
  // console.log('setCurrent', data)
  if (current) {
    current.value = pseudoToken
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
