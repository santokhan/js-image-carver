<template>
    <div class="flex flex-col" :style="{ marginTop: `-${props.originalImgViewSize.h}px` }">
        <Mask :width="originalImgViewSize.w" :height="originalImgViewSize.h" :disabled="isResizing" @drawEnd="onMaskDrawEnd"
            :revision="maskRevision" />
        <div class="flex flex-row justify-end" :style="{ marginTop: '-36px', zIndex: 100 }">
            <div class="mr-1">
                <!-- <mask-controls /> -->
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import Mask from './Mask.vue';
import { ImageSize } from '../../utils/contentAwareResizer';

type Props = {
    originalImgViewSize: ImageSize;
    isResizing: boolean;
    onMaskDrawEnd: (imgData: ImageData) => void;
    maskRevision: number;
};
const props = defineProps<Props>();
</script>

<style scoped></style>