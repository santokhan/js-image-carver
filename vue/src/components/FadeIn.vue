<template>
    <div class="custom-fade-in-opacity">
        <slot></slot>
    </div>
</template>

<script setup lang="ts">

</script>

<style scoped>
.custom-fade-in-opacity {
    opacity: 1;
    animation-name: customFadeInOpacity;
    animation-iteration-count: 1;
    animation-timing-function: ease-out;
    animation-duration: .8s;
}

@keyframes customFadeInOpacity {
    0% {
        opacity: 0;
    }

    100% {
        opacity: 1;
    }
}
</style>