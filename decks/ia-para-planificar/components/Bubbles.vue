<script setup lang="ts">
import { computed } from 'vue'

// Fondo decorativo hecho con CSS (styles/bubbles.css). Aquí solo se elige la silueta
// de cada mancha; posición, tamaño y color viven en el CSS de cada variante.
const SHAPES: Record<string, Record<string, number>> = {"cover": {"b1": 1, "b2": 2, "b3": 3}, "cream-a": {"b1": 2, "b2": 1, "b3": 3}, "cream-b": {"b1": 3, "b2": 1, "b3": 2}, "cream-c": {"b1": 2, "b2": 1, "b3": 3}, "dark-a": {"b1": 1, "b2": 2, "b3": 3}, "dark-b": {"b1": 2, "b2": 1}, "dark-c": {"b1": 3, "b2": 1, "b3": 2}, "yellow-a": {"b1": 1, "b2": 2, "b3": 3}, "yellow-b": {"b1": 3, "b2": 1, "b3": 2}, "closing": {"b1": 2, "b2": 1, "b3": 3}, "mint": {"b1": 1, "b2": 2, "b3": 3}}

const props = defineProps<{ v: string }>()
const shape = computed(() => SHAPES[props.v] ?? {})
</script>

<template>
  <div class="bubbles" :class="`bubbles--${v}`" aria-hidden="true">
    <i class="blob blob-1" :class="`shape-${shape.b1 ?? 1}`" />
    <i class="blob blob-2" :class="`shape-${shape.b2 ?? 2}`" />
    <i class="blob blob-3" :class="`shape-${shape.b3 ?? 3}`" />
    <i class="spr spr-1" />
    <i class="spr spr-2" />
  </div>
</template>
