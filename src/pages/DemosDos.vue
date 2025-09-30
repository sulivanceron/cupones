<template>
  <q-page padding class="bg-grey-2">
    <div class="q-mx-auto q-pa-md" style="max-width: 900px">
      <div class="text-h5 text-weight-bold text-center q-mb-md">CUPONES SOTANO</div>


      <q-card flat bordered class="bg-white q-pa-md">
        <q-form ref="formRef" @submit.prevent="onSubmit">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <q-select
                v-model="formulario.store"
                :options="stores"
                option-label="label"
                option-value="label"
                emit-value
                map-options
                label="Tienda"
                outlined
                rounded
                :rules="[req]"
              />
            </div>

            <div class="col-12 col-md-6">
              <q-input
                v-model="formulario.ticket"
                label="Ticket de compra"
                outlined
                rounded
                :rules="[req, min1, uniqueStoreTicket]"
              />
            </div>

            <div class="col-12 col-md-6">
              <q-select
                v-model="formulario.tipo"
                :options="tipos"
                label="Tipo de cupón"
                outlined
                rounded
                :rules="[req]"
              />
            </div>

            <div class="col-12 col-md-6">
              <q-input
                v-model.number="formulario.monto"
                type="number"
                min="0"
                label="Monto"
                outlined
                rounded
                :rules="[req, positive]"
              />
            </div>

            <!-- NUEVOS CAMPOS: después de Monto -->
            <div class="col-12 col-md-6">
              <q-input
                v-model="formulario.numCupon"
                label="Num de cupón"
                outlined
                rounded
                :rules="[req, min1]"
              />
            </div>

            <div class="col-12 col-md-6">
              <q-input
                v-model="formulario.producto"
                label="Producto"
                outlined
                rounded
                :rules="[req]"
              />
            </div>
          </div>

          <!-- Aviso en span cuando existe duplicado -->
          <span v-if="dupExists" class="text-negative text-caption q-mt-xs block">
            Ya existe un cupón con esa Tienda, Ticket y Monto.
          </span>

          <div class="q-mt-md flex q-gutter-sm items-center">
            <q-btn type="submit" label="Registrar" color="primary" unelevated rounded />
            <q-btn
              label="Deshacer último"
              color="warning"
              outline
              rounded
              :disable="cupon.length === 0"
              @click="reset"
            />
            <q-space />
            <q-btn label="Limpiar" color="grey-7" flat rounded @click="clearForm" />
          </div>
        </q-form>
      </q-card>

      <q-card flat bordered class="bg-white q-pa-md q-mt-lg" v-if="cupon.length">
        <div class="text-subtitle1 q-mb-md">Cupones Registrados</div>
        <q-table
          :rows="cupon"
          :columns="columns"
          row-key="id"
          flat
          bordered
          :rows-per-page-options="[5, 10, 20]"
          no-data-label="Ya no hay registros"
        >
          <template #body-cell-actions="props">
            <q-td :props="props">
              <q-btn
                dense
                round
                flat
                icon="delete"
                color="negative"
                @click="eliminar(props.row.id)"
              />
            </q-td>
          </template>
        </q-table>
      </q-card>

      <div v-else class="text-grey-6 text-center q-mt-xl">Ya no hay registros</div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'

defineOptions({ name: 'DemosDos' })

const $q = useQuasar()
const formRef = ref(null)

const cupon = ref([])

const blank = () => ({
  id: Date.now(),
  store: null,
  ticket: null,
  tipo: null,
  monto: null,
  numCupon: null, // <-- nuevo
  producto: null, // <-- nuevo
})

const formulario = ref(blank())

const stores = [
  { label: 'SP2' },
  { label: 'RA1' },
  { label: 'CO1' },
  { label: 'CRG' },
  { label: 'AP1' },
]

const tipos = ['500-1000', '1001-2000', '3001-5000', '5001-8000', '8001-10000', '10001-999999']

const columns = [
  { name: 'id', label: 'Id cupón', field: 'id', align: 'center', sortable: true },
  { name: 'TIENDA', label: 'Tienda', field: 'store', align: 'center' },
  { name: 'ticket', label: 'Tickett', field: 'ticket', align: 'center' },
  { name: 'tipo', label: 'Tipo', field: 'tipo', align: 'center' },
  { name: 'monto', label: 'Monto', field: 'monto', align: 'center' },
  { name: 'numCupon', label: 'Num de cupón', field: 'numCupon', align: 'center' }, // nuevo
  { name: 'producto', label: 'Producto', field: 'producto', align: 'center' }, // nuevo
  { name: 'actions', label: '', field: 'actions', align: 'center' },
]

// ------- Reglas -------
const req = (v) => !!v || 'Requerido'
const min1 = (v) => String(v ?? '').length >= 1 || 'Mínimo 1 carácter'
const positive = (v) => Number(v) > 0 || 'Debe ser mayor a 0'

// Detección de duplicado (misma Tienda + mismo Ticket)
const dupExists = computed(() => {
  const { store, ticket } = formulario.value
  if (!store || !ticket) return false
  const t = String(ticket).trim().toUpperCase()
  return cupon.value.some((c) => c.store === store && String(c.ticket).trim().toUpperCase() === t)
})

// Regla de unicidad (úsala en el campo Ticket)
const uniqueStoreTicket = () =>
  !dupExists.value || 'Ya existe un cupón con esa Tienda y ese Ticket.'

// ------- Submit -------
const onSubmit = async () => {
  const ok = await formRef.value.validate()
  if (!ok) return
  if (dupExists.value) {
    $q.notify({ type: 'warning', message: 'Duplicado: ya existe esa Tienda + Ticket.' })
    return
  }

  cupon.value.push({ ...formulario.value })
  clearForm()
  $q.notify({ type: 'positive', message: 'Cupón registrado' })
}

// ------- Utilidades -------
const clearForm = () => {
  formulario.value = blank()
  formRef.value?.resetValidation()
}

const reset = () => {
  if (cupon.value.length > 0) cupon.value.pop()
}

const eliminar = (id) => {
  const i = cupon.value.findIndex((c) => c.id === id)
  if (i >= 0) cupon.value.splice(i, 1)
}
</script>

<style scoped>
.q-card {
  border-radius: 20px;
}
.block {
  display: inline-block;
}
</style>
