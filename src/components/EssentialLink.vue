<template>
  <!-- Ruta interna -->
  <q-item
    v-if="to"
    clickable
    :to="to"
    v-ripple
    active-class="bg-primary text-white"
    exact-active-class="bg-primary text-white"
    @click="$emit('navigate')"
  >
    <q-item-section avatar>
      <q-icon :name="icon || 'chevron_right'" />
    </q-item-section>
    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
      <q-item-label caption>{{ caption }}</q-item-label>
    </q-item-section>
  </q-item>

  <!-- Enlace externo -->
  <q-item
    v-else
    clickable
    tag="a"
    :href="link"
    target="_blank"
    rel="noopener noreferrer"
    v-ripple
    @click="$emit('navigate')"
  >
    <q-item-section avatar>
      <q-icon :name="icon || 'open_in_new'" />
    </q-item-section>
    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
      <q-item-label caption>{{ caption }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  caption: { type: String, default: '' },
  icon: { type: String, default: '' },
  to: { type: [String, Object], default: null }, // rutas internas
  link: { type: String, default: '' }, // enlaces externos
})
defineEmits(['navigate'])
</script>
