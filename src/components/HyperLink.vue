<template>
    <a v-if="props.link.url" :href="props.link.url" @click="onClick" :style="{ fontWeight: 400 }"
        :class="['transition duration-200 ease-in-out whitespace-nowrap flex flex-row items-center', 'hover:text-red-600']">
        <!-- {{formatted && startEnhancer}} -->
        <span v-if="formatted" class="w-1"></span>
        <slot></slot>
    </a>
</template>

<script setup lang="ts">
import type { Link as LinkType } from '../types/Link';

type HyperLinkProps = {
    link: LinkType,
    hoverClassName?: string | null | undefined,
    startEnhancer?: any,
    formatted?: boolean,
    onClick?: (event: any) => void,
};

const props = defineProps<HyperLinkProps>()
// const caption = props.link?.caption || undefined;
</script>