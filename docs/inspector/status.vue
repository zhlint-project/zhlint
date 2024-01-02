<script setup lang="ts">
import { Ref, computed, inject } from 'vue';

const TOKEN_TYPE_MAP = {
  '': '',
  'letters-half': 'English letters',
  'letters-full': 'Chinese characters',
  'punctuation-half': 'Half-width punctuation',
  'punctuation-full': 'Full-width punctuation',
  'hyper-content': 'Non-content',
  'code-content': 'Code',
  'wrapper-bracket': 'Bracket',
  'group': 'Qutation',
  'non-block': 'Non-content',
}
const PROP_MAP = {
  // type: {
  //   modified: 'modifiedType',
  //   ignored: 'ignoredType',
  //   label: 'Type',
  // },
  value: {
    modified: 'modifiedValue',
    ignored: 'ignoredValue',
    label: 'Value',
  },
  spaceAfter: {
    modified: 'modifiedSpaceAfter',
    ignored: 'ignoredSpaceAfter',
    label: 'Space After',
  },
  startValue: {
    modified: 'modifiedStartValue',
    ignored: 'ignoredStartValue',
    label: 'Left Qutation',
  },
  innerSpaceBefore: {
    modified: 'modifiedInnerSpaceBefore',
    ignored: 'ignoredInnerSpaceBefore',
    label: 'Inner Left Space in Qutations',
  },
  endValue: {
    modified: 'modifiedEndValue',
    ignored: 'ignoredEndValue',
    label: 'Right Qutation',
  },
}

const current = inject<Ref<any>>('current')
const currentProp = inject<Ref<string>>('currentProp')

const checkSpace = prop => prop === 'spaceAfter' || prop === 'innerSpaceBefore'

const checkType = (data, prop) => {
  if (!data || !prop) {
    return 'Nothing selected'
  }
  if (checkSpace(prop)) {
    return 'Space'
  }
  if (data?.type === data?.modifiedType) {
    return TOKEN_TYPE_MAP[data?.type]
  } else {
    return TOKEN_TYPE_MAP[data?.type] + ' is modified into ' + TOKEN_TYPE_MAP[data?.modifiedType]
  }
}

const checkProp = (data, prop) => {
  if (!data || !prop) {
    return { desc: 'click the tokens in "Origin" or "Modified" to see more details' }
  }
  const { modified, ignored } = PROP_MAP[prop]
  console.log(data, prop, modified, ignored, data[modified] === data[prop], ignored in data)
  if (data[modified] !== data[prop]) {
    if (checkSpace(prop)) {
      if (data[modified] && data[prop]) {
        return { desc: 'normalized' }
      }
      return { desc: !data[prop] ? 'added' : 'removed' }
    }
    return { desc: ' is modified into ', original: data[prop], modified: data[modified] }
  } else if (ignored in data) {
    return { desc: 'modification ignored' }
  } else {
    return { desc: 'nothing to modify' }
  }
}

const type = computed(() => checkType(current?.value, currentProp?.value))
const prop = computed(() => checkProp(current?.value, currentProp?.value))
</script>

<template>
  <div class="status">
    <h3>Selected Token</h3>
    <pre>{{ type }} (<span v-if="prop.original" class="string">{{ prop.original }}</span>{{ prop.desc }}<span v-if="prop.modified" class="string">{{ prop.modified }}</span>)</pre>
  </div>
</template>

<style scoped>
.string {
  background-color: #eee;
}
</style>
