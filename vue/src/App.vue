<script setup lang="ts">
import ImageResizer from './components/ImageResizer.vue';
</script>

<template>
  <main :class="['max-w-screen-lg w-full mx-auto p-4 sm:p-8']">
    <div :class="['border border-dashed border-gray-300 rounded-xl p-4 sm:p-6']">
      <ImageResizer :withSeam="false" />
    </div>
    <!-- <p class="text-sm text-center text-gray-700 mt-2">©2023 Copyright. Developed by
      <a href="https://github.com/santokhan/" target="_blank" rel="noopener noreferrer" class="underline hover:text-black">Santo</a>.
    </p> -->
  </main>
</template>

