<script lang="ts" setup>
withDefaults(defineProps<{ color?: string }>(), {
    color: 'black'
})
</script>
<template>
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M6.37 2.51C6.19 3.15 6.1 3.82 6.1 4.5C6.1 8.58 9.42 11.9 13.5 11.9C14.18 11.9 14.85 11.81 15.49 11.63C14.45 14.19 11.93 16 9 16C5.14 16 2 12.86 2 9C2 6.07 3.81 3.55 6.37 2.51ZM9 0C4.03 0 0 4.03 0 9C0 13.97 4.03 18 9 18C13.97 18 18 13.97 18 9C18 8.54 17.96 8.08 17.9 7.64C16.92 9.01 15.32 9.9 13.5 9.9C10.52 9.9 8.1 7.48 8.1 4.5C8.1 2.69 8.99 1.08 10.36 0.0999999C9.92 0.0399999 9.46 0 9 0Z"
            :fill="color" fill-opacity="0.87" />
    </svg>
</template>