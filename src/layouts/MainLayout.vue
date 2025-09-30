<template>
  <q-layout view="lHh Lpr lFf ">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>Quasar App</q-toolbar-title>

        <q-space />
        <div class="q-mr-md">Quasar v{{ $q.version }}</div>

        <!-- Botón Salir -->
        <q-btn v-if="isAuthed" flat icon="logout" label="Salir" @click="logout" />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <EssentialLink
          v-for="link in linksList"
          :key="link.title"
          v-bind="link"
          @navigate="handleNavigate"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import EssentialLink from 'components/EssentialLink.vue'

defineOptions({ name: 'MainLayout' })

const router = useRouter()
const $q = useQuasar()

// Drawer
const leftDrawerOpen = ref(false)
const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

// Links del menú lateral (ruta interna a DemosDos)
const linksList = [
  {
    title: 'Cupones',
    caption: 'Demos Dos',
    icon: 'local_offer',
    to: { name: 'demos-dos' }, // también puedes usar: to: '/demos-dos'
  },
]

// Estado simple de sesión
const isAuthed = ref(!!localStorage.getItem('auth_token'))

// Mantener isAuthed sincronizado si cambia el token en otra pestaña
const onStorage = (e) => {
  if (e.key === 'auth_token') {
    isAuthed.value = !!localStorage.getItem('auth_token')
  }
}
onMounted(() => window.addEventListener('storage', onStorage))
onBeforeUnmount(() => window.removeEventListener('storage', onStorage))

// Cerrar sesión
const logout = () => {
  localStorage.removeItem('auth_token')
  isAuthed.value = false
  $q.notify({ type: 'info', message: 'Sesión cerrada' })
  router.push({ name: 'login' })
}

// Cerrar drawer en móvil al navegar
const handleNavigate = () => {
  if ($q.platform.is.mobile) leftDrawerOpen.value = false
}
</script>
