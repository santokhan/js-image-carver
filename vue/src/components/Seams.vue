<template>
    <canvas ref="canvasRef"></canvas>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { Seam } from '../utils/contentAwareResizer';
import { Coordinate } from '../utils/image';

type SeamProps = {
    seams: Seam[];
    width: number;
    height: number;
    className?: string;
};

const props = defineProps<SeamProps>()
const canvasRef = ref<HTMLCanvasElement | null>(null)

watchEffect(() => {
    if (!props.seams || !props.seams.length || !props.seams[0]) return;

    const seamsCanvas: HTMLCanvasElement | null = canvasRef.value;
    if (!seamsCanvas) return;

    const seamsCtx: CanvasRenderingContext2D | null = seamsCanvas.getContext('2d');
    if (!seamsCtx) return;

    seamsCanvas.width = props.width;
    seamsCanvas.height = props.height;

    seamsCtx.fillStyle = 'rgba(255, 255, 255, 1)';
    props.seams[0].forEach(({ x, y }: Coordinate) => {
        seamsCtx.fillRect(x, y, 1, 1);
    });
});
</script>
