<template>
    <button @click="onClick" type="button" :disabled="disabled"
        :class="['transition duration-200 ease-in-out flex flex-row items-center uppercase font-medium text-xs tracking-wider']">
        <slot name="startEnhancer"></slot>
        <slot></slot>
    </button>
</template>

<script setup lang="ts">
type ButtonKind = 'primary' | 'secondary';

type ButtonProps = {
    onClick?: () => void,
    disabled?: boolean,
    kind?: ButtonKind,
};

const props = defineProps<ButtonProps>()
</script>

<style scoped></style>