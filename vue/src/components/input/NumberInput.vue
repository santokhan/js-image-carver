<template>
    <div class="w-full flex items-center gap-2">
        <label for="width" class="font-medium text-gray-900">
            {{ title }}
        </label>
        <input type="number" id="width"
            class="bg-gray-50 border border-gray-200 text-gray-900 rounded-lg w-full pl-3 py-1 focus:outline-none" :min="1"
            :max="100" :maxlength="3" pattern="\b(0*(?:[1-9][0-9]?|100))\b" :value="props.value"/>
        <label for="width" class="font-medium text-gray-900">%</label>
    </div>
</template>

<script setup lang="ts">
type Props = { title: string, value: string | undefined }
const props = defineProps<Props>()
</script>

<style scoped></style>