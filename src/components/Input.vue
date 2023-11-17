<template>
    <div className="flex flex-row justify-center items-center">
        <input :disabled="props.disabled" @change="onInputChange" :value="props.value" />
    </div>
</template>

<script setup lang="ts">
type InputProps = {
    onChange?: (value: string) => void,
    disabled?: boolean,
    value?: string | ReadonlyArray<string> | number,
};

const props = defineProps<InputProps>()

const onInputChange = (event: any): void => {
    if (typeof props.onChange === 'function') {
        props.onChange(event.target.value)
    }
};
</script>

<style scoped></style>