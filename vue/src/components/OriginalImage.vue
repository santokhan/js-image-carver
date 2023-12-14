<template>
    <FadeIn>
      <div className="flex flex-row justify-center items-center mb-1 sm:mb-0">
        <div className="flex-1 sm:flex sm:flex-row sm:items-center">
          <div className="sm:flex-1">
            <b>Original image</b> {originalImageSizeText}
          </div>
          <div className="text-xs text-gray-400 flex flex-row items-center justify-self-end">
            <div className="mr-1">
              <FaRegHandPointer size={12} />
            </div>
            <div>
              Mask to remove
            </div>
          </div>
        </div>
      </div>
      <img src={imageSrc} alt="Original" ref={imgRef} style={{ margin: 0 }} />
      {mask}
      {imgAuthorLink}
    </FadeIn>

    <FadeIn>
    <div class="flex flex-row justify-center items-center mb-1 sm:mb-0">
      <div class="flex-1 sm:flex sm:flex-row sm:items-center">
        <div class="sm:flex-1">
          <b>Original image</b> {{ originalImageSizeText }}
        </div>
        <div class="text-xs text-gray-400 flex flex-row items-center justify-self-end">
          <div class="mr-1">
            <FaRegHandPointer size="12" />
          </div>
          <div>
            Mask to remove
          </div>
        </div>
      </div>
    </div>
    <img :src="imageSrc" alt="Original" ref="imgRef" style="margin: 0" />
    <div v-if="mask">{{ mask }}</div>
    <div v-if="imgAuthorLink">{{ imgAuthorLink }}</div>
  </FadeIn>
</template>

<script setup lang="ts">
import FadeIn from './FadeIn.vue';


</script>

<style scoped>

</style>