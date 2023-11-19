<script setup lang="ts"></script>

<template>
  <main className="flex flex-col items-center">
    <div className="max-w-screen-xl self-stretch m-auto w-full">
      <article className="px-6 sm:px-12 pt-6 pb-12">
        <slot></slot>
      </article>
    </div>
  </main>
</template>

