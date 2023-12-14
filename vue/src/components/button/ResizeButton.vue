<template>
    <button type="submit"
        class="text-gray-100 text-sm font-medium bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center gap-1 px-3 py-2 disabled:bg-gray-600 shadow">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
            class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round"
                d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
        </svg>
        Resize
    </button>
</template>

<script setup lang="ts">
type Props = {
    handleClick: () => void
}
// const props = defineProps<Props>()
</script>

<style scoped></style>