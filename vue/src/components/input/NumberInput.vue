<template>
    <div class="w-full flex items-center gap-2 bg-white border rounded-lg p-0.5 shadow">
        <label for="width" class="font-medium text-gray-900 whitespace-nowrap block px-2">
            {{ title }} %
        </label>
        <input type="number" id="width" @change="(e: any) => { handleChange(e.target.value) }"
            class="bg-gray-100 text-gray-900 rounded-md w-full pl-3 py-2 focus:outline-none" :min="1" :max="100"
            :maxlength="3" pattern="\b(0*(?:[1-9][0-9]?|100))\b" :value="props.value" />
        <!-- <label for="width" class="font-medium text-gray-900">%</label> -->
    </div>
</template>

<script setup lang="ts">
type Props = { title: string, value: string | undefined, handleChange: (e: any) => void }
const props = defineProps<Props>()
</script>

<style scoped></style>