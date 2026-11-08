<script setup lang="ts">
import { ref, computed, onMounted } from "vue";

interface Producto {
  id: number;
  nombre: string;
  tipo: string;
  precio: number;
  stock: number;
}

const API = "http://localhost:3000/api";
const productos = ref<Producto[]>([]);
const busqueda = ref("");
const error = ref("");

const filtrados = computed(() =>
  productos.value.filter((p) =>
    p.nombre.toLowerCase().includes(busqueda.value.toLowerCase()),
  ),
);

async function cargar() {
  try {
    const r = await fetch(`${API}/productos`);
    productos.value = await r.json();
  } catch {
    error.value = "No se pudo conectar con la API";
  }
}

async function pedir(p: Producto) {
  error.value = "";
  const r = await fetch(`${API}/pedidos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productoId: p.id, cantidad: 1 }),
  });
  const data = await r.json();
  if (r.ok) p.stock = data.producto.stock;
  else error.value = data.error;
}

onMounted(cargar);
</script>

<template>
  <h1>Catálogo de vinos</h1>
  <input v-model="busqueda" placeholder="Buscar..." />
  <p v-if="error" style="color: red">{{ error }}</p>
  <ul>
    <li v-for="p in filtrados" :key="p.id">
      {{ p.nombre }} · {{ p.tipo }} · {{ p.precio.toFixed(2) }} € · stock:
      {{ p.stock }}
      <button :disabled="p.stock === 0" @click="pedir(p)">Pedir 1</button>
    </li>
  </ul>
</template>
