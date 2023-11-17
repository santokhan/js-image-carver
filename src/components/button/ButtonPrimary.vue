<template>
    <button @click="props.onClick" type="button" :disabled="props.disabled"
        :class="['transition duration-200 ease-in-out flex flex-row items-center uppercase font-medium text-xs tracking-wider']">
        <slot name="startEnhancer"></slot>
        <slot></slot>
    </button>
</template>

<script setup lang="ts">
type ButtonProps = {
    onClick?: () => void,
    disabled?: boolean,
};

const props = defineProps<ButtonProps>()
</script>

<style scoped></style>