<script lang="ts" setup>
withDefaults(defineProps<{ color?: string }>(), {
    color: '#626669'
})
</script>
<template>
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5.9375 8.125H14.0625" :stroke="color" stroke-width="1.3" stroke-linecap="round"
            stroke-linejoin="round" />
        <path d="M5.9375 10.625H14.0625" :stroke="color" stroke-width="1.3" stroke-linecap="round"
            stroke-linejoin="round" />
        <path
            d="M2.5 16.25V4.375C2.5 4.20924 2.56585 4.05027 2.68306 3.93306C2.80027 3.81585 2.95924 3.75 3.125 3.75H16.875C17.0408 3.75 17.1997 3.81585 17.3169 3.93306C17.4342 4.05027 17.5 4.20924 17.5 4.375V16.25L15 15L12.5 16.25L10 15L7.5 16.25L5 15L2.5 16.25Z"
            :stroke="color" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" />
    </svg>

</template>