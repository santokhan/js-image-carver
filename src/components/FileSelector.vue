<template>
    <ButtonPrimary>
        <label :class="[`cursor-pointer py-2 px-3 flex uppercase font-medium text-xs tracking-wider`]">
            <input type="file" :accept="props.accept" :capture="props.capture" @change="onChange" :multiple="props.multiple" />
            {icon}
            <slot></slot>
        </label>
    </ButtonPrimary>
</template>

<script setup lang="ts">
import ButtonPrimary from './button/ButtonPrimary.vue';

type FileSelectorProps = {
  onSelect: (files: FileList | null) => void;
  accept?: string, // i.e. 'image/png,image/jpeg'
  capture?: 'user' | 'environment',
  multiple?: boolean,
  disabled?: boolean,
}

const props=defineProps<FileSelectorProps>()

const onChange = (event: any): void => {
    const { files } = (event.target as HTMLInputElement);
    props.onSelect(files);
  };
</script>

<style scoped></style>