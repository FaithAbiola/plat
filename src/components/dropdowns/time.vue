<!-- TimeDropdown.vue -->
<script setup lang="ts">
import { ref, inject } from "vue";

// Define time slots
const timeSlots = ref<string[]>([]);

// Populate time slots from 00:00am to 11:30pm
for (let hour = 0; hour < 24; hour++) {
  for (let minute = 0; minute < 60; minute += 30) {
    const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
    const ampm = hour < 12 ? 'am' : 'pm';
    const time = `${String(formattedHour).padStart(2, '0')}:${String(minute).padStart(2, '0')}${ampm}`;
    timeSlots.value.push(time);
  }
}

// Inject parent component's references
const showTimeDropdown = inject<any>("showTimeDropdown");
const selectedTime = inject<any>("selectedTime");

// Method to select time
const selectTime = (time: string) => {
  selectedTime.value = time;
  showTimeDropdown.value = false;
};
</script>

<template>
  <div class="space-y-5 p-6 shadow-rgba bg-white text-sm font-bold rounded-lg">
    <p class="text-[#003b3d]">Select Time</p>
    <p v-for="time in timeSlots" :key="time" @click="selectTime(time)">
      {{ time }}
    </p>
  </div>
</template>

<style scoped>
/* Add any specific styles for the time dropdown here */
</style>
