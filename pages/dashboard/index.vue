<template>
    <div class="grid-stack ma-2 ml-1 mr-1">
        <div class="grid-stack-item" gs-w="4" gs-h="2">
            <div class="grid-stack-item-content">Item 1</div>
        </div>
        <div class="grid-stack-item" gs-w="4" gs-h="2">
            <div class="grid-stack-item-content">Item 2</div>
        </div>
        <div class="grid-stack-item" gs-w="7" gs-h="4">
            <div class="grid-stack-item-content">
                <temp />
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { GridStack } from 'gridstack';

definePageMeta({
    layout: 'dashboard',
});

onMounted(() => {
    GridStack.init(
        {
            margin: 5,
            column: 12,
            cellHeight: '150px',
        },
        '.grid-stack'
    );
});
</script>

<style>
.grid-stack-item-content {
    background-color: rgba(255, 255, 255, 0.3);
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 10px;
}
</style>
