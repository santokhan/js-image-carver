<template>
    <div class="bg-gray-100 h-0.5 overflow-hidden flex flex-row justify-start items-center rounded">
        <div class="bg-black w-36 h-full transition duration-500 ease-in-out rounded transition" :style="barStyle"></div>
    </div>
</template>

<script setup lang="ts">
import { CSSProperties } from 'vue';

type ZeroToOne = number;

export type CheckboxProps = {
    progress: ZeroToOne,
};

const props = defineProps<CheckboxProps>()

const progressPercentage = Math.min(Math.ceil(100 * props.progress), 100);
const barStyle: CSSProperties = {
    width: `${progressPercentage}%`,
    transition: 'width 0.5s',
};
</script>
