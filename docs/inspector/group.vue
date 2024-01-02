<script setup lang="ts">
import { inject, toRef, computed, Ref } from 'vue'
import SingleToken from './single.vue'

const props = defineProps<{ data: any; modified: boolean; start: number }>()
const data = toRef(props, 'data')
const start = toRef(props, 'start')
const startIndex = computed(() => start.value + data.value.startIndex)
const endIndex = computed(() => start.value + data.value.endIndex)

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
  <span
    @click="setCurrent('startValue')"
    :class="{
      'qutation-start-value': true,
      changed: data.startValue !== data.modifiedStartValue,
      ignored: 'ignoredStartValue' in data,
      [`start-${startIndex}`]: true,
      current: current === data && currentProp === 'startValue'
    }"
    >{{ modified ? data.modifiedStartValue : data.startValue }}</span
  ><span
    v-if="modified ? data.modifiedInnerSpaceBefore : data.innerSpaceBefore"
    @click="setCurrent('innerSpaceBefore')"
    :class="{
      'qutation-inner-space-before': true,
      changed: data.innerSpaceBefore !== data.modifiedInnerSpaceBefore,
      ignored: 'ignoredInnerSpaceBefore' in data,
      [`start-${startIndex}`]: true,
      current: current === data && currentProp === 'innerSpaceBefore'
    }"
    >{{
      modified ? data.modifiedInnerSpaceBefore : data.innerSpaceBefore
    }}</span
  ><SingleToken
    v-for="(token, i) in data.map((x) => x)"
    :key="i"
    :data="token"
    :modified="modified"
    :start="start"
  /><span
    @click="setCurrent('endValue')"
    :class="{
      'qutation-end-value': true,
      changed: data.endValue !== data.modifiedEndValue,
      ignored: 'ignoredEndValue' in data,
      [`start-${endIndex}`]: true,
      current: current === data && currentProp === 'endValue'
    }"
    >{{ modified ? data.modifiedEndValue : data.endValue }}</span
  >
</template>

<style scoped src="./labels.css"></style>
