<script setup lang="ts">
import ImageResizer from './components/ImageResizer.vue';
</script>

<template>
  <main :class="['max-w-screen-lg w-full mx-auto p-8']">
    <div :class="['border border-dashed border-gray-300 rounded-xl p-6']">
      <ImageResizer :withSeam="false" />
    </div>
  </main>
</template>

