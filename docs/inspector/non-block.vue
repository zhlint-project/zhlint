<script setup lang="ts">
import { inject, toRef, computed, Ref } from 'vue'

const props = defineProps<{ data: any }>()
const data = toRef(props, 'data')

const pseudoToken = computed(() => ({
  type: 'non-block',
  modifiedType: 'non-block',
  value: data.value.value,
  modifiedValue: data.value.value,
  index: data.value.start
}))

const current = inject<Ref<any>>('current')
const currentProp = inject<Ref<string>>('currentProp')
const setCurrent = () => {
  // console.log('setCurrent', data)
  if (current) {
    current.value = pseudoToken.value
  }
  if (currentProp) {
    currentProp.value = 'value'
  }
}

console.log('data', data)
</script>

<template>
  <span
    class="non-block"
    :class="{
      current: current?.index === pseudoToken?.index
    }"
    @click="setCurrent"
    >{{ data.value }}</span
  >
</template>

<style scoped src="./labels.css"></style>
