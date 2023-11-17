<template>
    <div :style="props.style"
        :class="[props.responsive ? 'flex flex-col sm:flex-row items-center' : 'flex flex-row items-center']">
        <slot></slot>
    </div>
</template>

<script setup lang="ts">
import { CSSProperties } from 'vue';

type RowProps = {
    className?: string,
    responsive?: boolean,
    style?: CSSProperties,
};

const props = defineProps<RowProps>()
</script>

<style scoped></style>