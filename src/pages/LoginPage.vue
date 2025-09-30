<template>
  <q-page padding class="bg-grey-2 flex flex-center">
    <q-card flat bordered class="bg-white q-pa-lg" style="width: 420px; max-width: 92vw">
      <div class="text-h6 text-center q-mb-md">Iniciar sesión</div>

      <q-form ref="formRef" @submit.prevent="onSubmit">
        <q-input
          v-model="usuario"
          label="Usuario o correo"
          outlined
          rounded
          :rules="[req]"
          class="q-mb-md"
        />

        <q-input
          v-model="password"
          :type="isPwd ? 'password' : 'text'"
          label="Contraseña"
          outlined
          rounded
          :rules="[req]"
        >
          <template #append>
            <q-icon
              :name="isPwd ? 'visibility' : 'visibility_off'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            />
          </template>
        </q-input>

        <div class="row items-center q-mt-sm q-gutter-sm">
          <q-space />
          <q-btn type="submit" label="Entrar" color="primary" unelevated rounded />
        </div>
      </q-form>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter, useRoute } from 'vue-router'

defineOptions({ name: 'LoginPage' })

const $q = useQuasar()
const router = useRouter()
const route = useRoute()

const formRef = ref(null)
const usuario = ref('')
const password = ref('')
const isPwd = ref(true)

const req = (v) => !!v || 'Requerido'

// 👇 Demo: reemplaza por tu verificación real (API)
const mockAuth = (user, pass) => user === 'admin' && pass === '1'

// Si ya hay sesión, salta directo a cupones (o al redirect solicitado)
onMounted(() => {
  const authed = !!localStorage.getItem('auth_token')
  if (authed) {
    router.replace(route.query.redirect || { name: 'demos-dos' })
  }
})

const onSubmit = async () => {
  try {
    // valida con seguridad por si formRef aún es null
    const ok =
      formRef.value && typeof formRef.value.validate === 'function'
        ? await formRef.value.validate()
        : true
    if (!ok) return

    if (!mockAuth(usuario.value.trim(), password.value)) {
      $q.notify({ type: 'negative', message: 'Usuario o contraseña incorrectos' })
      return
    }

    localStorage.setItem('auth_token', 'demo_auth_token')
    $q.notify({ type: 'positive', message: 'Bienvenido' })

    const redirect = route.query.redirect || { name: 'demos-dos' }
    router.push(redirect)
  } catch (err) {
    console.error('[Login onSubmit error]', err)
    $q.notify({ type: 'negative', message: 'Ocurrió un error al iniciar sesión' })
  }
}
</script>

<style scoped>
.q-card {
  border-radius: 20px;
}
</style>
