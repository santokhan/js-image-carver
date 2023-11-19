<script setup lang="ts">
import InteractivePostArea from './layout/InteractivePostArea.vue'
import ImageResizer from './components/ImageResizer.vue';
</script>

<template>
  <main class="max-w-screen-xl mx-auto px-4 grid place-items-center">
    <div :class="['p-6 border border-dashed border-gray-300 rounded-md overflow-hidden']">
      <ImageResizer :withSeam="false" />
    </div>
  </main>
</template>

