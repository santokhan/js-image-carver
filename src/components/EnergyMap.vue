<template>
    <canvas ref="canvasRef"></canvas>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { EnergyMap as EnergyMapType } from '../utils/contentAwareResizer';
import { setPixel } from '../utils/image';

type EnergyMapProps = {
    energyMap: EnergyMapType | null,
    width: number,
    height: number,
    className?: string,
};

const normalizeEnergy = (
    energy: number,
    maxEnergy: number,
    maxNormalizedEnergy: number,
): number => {
    return Math.floor((energy / maxEnergy) * maxNormalizedEnergy);
};

const getMaxEnergy = (
    energyMap: EnergyMapType,
    width: number,
    height: number,
): number => {
    let maxEnergy = 0;
    for (let y = 0; y < height; y += 1) {
        for (let x = 0; x < width; x += 1) {
            maxEnergy = Math.max(maxEnergy, energyMap[y][x]);
        }
    }

    return maxEnergy;
};

const normalizeEnergyMap = (
    energyMap: EnergyMapType,
    width: number,
    height: number,
    maxNormalizedEnergy = 255,
): number[][] => {
    const maxEnergy = getMaxEnergy(energyMap, width, height);

    const normalizedMap = new Array(height)
        .fill(null)
        .map(() => {
            return new Array(width).fill(Infinity);
        });

    for (let y = 0; y < height; y += 1) {
        for (let x = 0; x < width; x += 1) {
            normalizedMap[y][x] = normalizeEnergy(energyMap[y][x], maxEnergy, maxNormalizedEnergy);
        }
    }

    return normalizedMap;
}

// // // // // // // // // // // // // // //
const props = defineProps<EnergyMapProps>()

const canvasRef = ref<HTMLCanvasElement | null>(null)

watch([props.energyMap, props.width, props.height], () => {
    if (!props.energyMap || !props.energyMap.length || !props.energyMap[0].length) {
        return;
    }
    const energyCanvas: HTMLCanvasElement | null = canvasRef.value;
    if (!energyCanvas) {
        return;
    }
    const energyCtx: CanvasRenderingContext2D | null = energyCanvas.getContext('2d');
    if (!energyCtx) {
        return;
    }

    energyCanvas.width = props.width;
    energyCanvas.height = props.height;

    const imgData: ImageData = energyCtx.getImageData(0, 0, props.width, props.height);

    const normalizedEnergyMap = normalizeEnergyMap(props.energyMap, props.width, props.height);

    for (let y = 0; y < props.height; y += 1) {
        for (let x = 0; x < props.width; x += 1) {
            const norm = normalizedEnergyMap[y][x];
            setPixel(imgData, { x, y }, [norm, norm, norm, 255]);
        }
    }

    energyCtx.putImageData(imgData, 0, 0);
});
</script>

<style scoped></style>