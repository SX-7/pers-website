<script setup>
import { ref } from 'vue';

defineProps({
  title: String
});

const isOpen = ref(false);
</script>

<template>
  <div class="flex w-full flex-col">
    <div 
      class="rounded-lg hover:bg-danube-500 hover:text-opium-950 ease-in-out bg-danube-900 p-2 shadow-md shadow-rangoon_green-700 z-10 text-center opacity-100 transition select-none cursor-pointer"
      @click="isOpen = !isOpen"
    >
      {{ title }}
    </div>

    <div 
      class="grid transition-all duration-500 ease-in-out"
      :class="isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'"
    >
      <div class="overflow-hidden">
        <div class="mx-4 rounded-b-md bg-slate-900 ring-danube-950 ring-2 ring-inset">
          <div class="p-4">
            <slot /> 
          </div>
        </div>
      </div>
    </div>
  </div>
</template>