<template>
    <button @click="props.onClick" type="button" :disabled="props.disabled" :class="[
        'w-8 h-8 rounded-full border',
        'bg-white hover:bg-white',
        'text-black hover:text-black',
        'grid place-items-center',
        'transition duration-200 ease-in-out text-xs'
    ]">
        <MdLayersClear />
    </button>
</template>

<script setup lang="ts">
import MdLayersClear from '../mask/MdLayersClear.vue';

const props = defineProps<{
    onClick: () => void,
    disabled: boolean,
}>()
</script>
