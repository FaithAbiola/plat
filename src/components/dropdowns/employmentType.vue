<script setup lang="ts">
import { ref, inject } from "vue";

// Provide and inject
const showEmploymentType = inject<any>("showEmploymentType");
let selectedEmploymentType = inject<any>("selectedEmploymentType");


const employmentTypes = ref([
  { id: 1, type: "Full Time" },

]);
const selectEmploymentType = (employmentType: any) => {
  selectedEmploymentType[0].value.employmentType = employmentType.type; 
  selectedEmploymentType[1].value = employmentType.type; 
  showEmploymentType.value = false; 
};
</script>

<template>
  <div class="space-y-5 p-6 shadow-rgba bg-white text-black text-sm cursor-pointer font-bold rounded-lg w-auto">
    <div>
      <div v-if="employmentTypes.length > 0">
        <div v-for="employmentType in employmentTypes" :key="employmentType.id">
          <p @click="selectEmploymentType(employmentType)" class="cursor-pointer">
            {{ employmentType.type }}
          </p>       
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Add any specific styles here */
</style>
