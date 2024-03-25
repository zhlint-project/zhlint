<script>
import { ref, onMounted } from 'vue'
let timer
</script>

<script setup>
// Experimental
import Inspector from './inspector/inspector.vue'

const input = ref('自动在中文和English之间加入空格')
const output = ref('Report:')
const data = ref()

const rows = ref(10)

const lint = async () => {
  const { run, report } = await import('./zhlint.es')

  const result = run(input.value, { rules: { preset: 'default' } })
  const outputValues = []
  report([result], {
    log: (x) => outputValues.push(x),
    error: (x) => outputValues.push(x)
  })
  output.value = 'Report:\n\n' + outputValues.join('\n')
  data.value = result
  globalThis.__result__ = result
}

const resize = () => {
  const lines = input.value.split('\n').length
  rows.value = Math.min(Math.max(10, lines), 30)
}

const inputUpdate = () => {
  resize()
  if (timer) {
    clearTimeout(timer)
  }
  timer = setTimeout(lint, 1000)
}

// const format = () => {
//   input.value = run(input.value, { rules: { preset: 'default' } }).result
//   lint()
// }

onMounted(() => {
  lint()
})
</script>

<template>
  <div id="playground-core" class="container">
    <textarea v-model="input" :rows="rows" @input="inputUpdate"></textarea>
    <!-- <button @click="format">Format</button> -->
    <pre>{{ output }}</pre>
    <!-- Experimental -->
    <Inspector v-if="data" :data="data" />
  </div>
</template>

<style>
#playground-core {
  display: flex;
  flex-direction: column;
  padding: 20px 0;
  gap: 20px;
}
#playground-core textarea {
  padding: 10px 15px;
  font-family: monospace;
  font-size: 1rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  color: var(--vp-c-text-1);
  background-color: var(--vp-c-bg-alt);
  transition:
    background-color 0.5s,
    color 0.5s,
    border-color 0.5s;
}
#playground-core textarea:hover {
  border-color: var(--vp-c-brand);
}
#playground-core pre {
  margin: 0;
  white-space: pre-wrap;
  padding: 10px 15px;
  border: 1px solid transparent;
  border-radius: 8px;
  border-color: var(--vp-custom-block-details-border);
  color: var(--vp-custom-block-details-text);
  background-color: var(--vp-custom-block-details-bg);
}
</style>
