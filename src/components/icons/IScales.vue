<script lang="ts" setup>
withDefaults(defineProps<{ color?: string }>(), {
    color: '#626669'
})
</script>
<template>
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 3.125V16.875" :stroke="color" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M8.125 16.875H11.875" :stroke="color" stroke-width="1.3" stroke-linecap="round"
            stroke-linejoin="round" />
        <path d="M4.375 6.875L15.625 4.375" :stroke="color" stroke-width="1.3" stroke-linecap="round"
            stroke-linejoin="round" />
        <path
            d="M1.875 13.125C1.875 14.5078 3.4375 15 4.375 15C5.3125 15 6.875 14.5078 6.875 13.125L4.375 6.875L1.875 13.125Z"
            :stroke="color" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" />
        <path
            d="M13.125 10.625C13.125 12.0078 14.6875 12.5 15.625 12.5C16.5625 12.5 18.125 12.0078 18.125 10.625L15.625 4.375L13.125 10.625Z"
            :stroke="color" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
</template>