<script setup lang="ts">
import { ref, inject } from "vue";

// Provide and inject
const showCountryCode = inject<any>("showCountryCode");
let selectedCountryCode = inject<any>("selectedCountryCode");

// Method to select country code
// const selectCountryCode = (countryCode: string) => {
//   selectedCountryCode.value = countryCode;
//   showCountryCode.value = false;
// };

// List of countries and their codes
const countryCodes = ref([
  { id: 1, name: "United States", code: "+1" },
  { id: 2, name: "Canada", code: "+1" },
  { id: 3, name: "United Kingdom", code: "+44" },
  { id: 4, name: "Australia", code: "+61" },
  { id: 5, name: "Germany", code: "+49" },
  { id: 6, name: "France", code: "+33" },
  { id: 7, name: "India", code: "+91" },
  { id: 8, name: "Nigeria", code: "+234" },
  { id: 9, name: "South Africa", code: "+27" },
]);
const selectCountryCode = (country: any) => {
  selectedCountryCode[0].value.countryCode = country.code; 
  selectedCountryCode[1].value = country.code; 
  showCountryCode.value = false; 
};
</script>

<template>
  <div class="space-y-5 p-6 shadow-rgba bg-white text-sm cursor-pointer font-bold rounded-lg w-auto">
    <div>
      <div v-if="countryCodes.length > 0">
        <div v-for="country in countryCodes" :key="country.id">
          <p @click="selectCountryCode(country)" class="cursor-pointer">
            {{ country.name }} ({{ country.code }})
          </p>       
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Add any specific styles here */
</style>
