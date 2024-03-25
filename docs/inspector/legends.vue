<template>
  <div class="legends">
    <h3>Legends</h3>
    <pre><span class="color" style="background-color: #f0f0ff"></span> Selected<br
      /><span class="color" style="background-color: #ff0000"></span> English<br
      /><span class="color" style="background-color: #0000ff"></span> Chinese<br
      /><span class="color" style="background-color: #660066"></span> Punctuation<br
      /><span class="color" style="background-color: #666666"></span> Non-content/code<br
      /><span class="color" style="background-color: #ffff00"></span> Modified<br
      /><span class="color" style="background-color: #f0f0f0"></span> Modification Ignored<br
    /></pre>
  </div>
</template>

<style scoped>
.color {
  display: inline-block;
  width: 1em;
  height: 1em;
  vertical-align: text-bottom;
}
pre {
  background-color: transparent !important;
}
</style>
