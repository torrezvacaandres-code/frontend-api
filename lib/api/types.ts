// Tipos compartidos para la API

export interface Plato {
  id: number | string
  nombre: string
  descripcion?: string | null
  precio?: number
  categoria?: string | null
  disponible?: boolean
  imagen?: string
}

export interface Insumo {
  id: number | string
  nombre: string
  unidad: string
  sku?: string | null
  vidaUtilDias?: number | null
  // Campos solo de UI (no existen en backend, por eso opcionales)
  cantidad?: number
  precio?: number
  stock_minimo?: number
  proveedor_id?: number | string
}

export interface Menu {
  id: number | string
  fecha: string
  comida: 'DESAYUNO' | 'ALMUERZO' | 'CENA'
  // Opcionales para UI
  dia?: string
  items?: string[]
  descripcion?: string
  platos?: Plato[]
  precio_total?: number
}

export interface Compra {
  id: number | string
  nroFactura?: string | null
  total: number | string
  fechaCompra: string
  proveedor?: { id: string | number; nombre: string } | string
  items?: CompraItem[]
}

export interface CompraItem {
  id: number
  insumo_id: number
  cantidad: number
  precio_unitario: number
  subtotal: number
}

export interface Proveedor {
  id: number | string
  nombre: string
  nit?: string | null
  contacto?: string | null
}

export interface Reserva {
  id: number | string
  estado: string
  creadoEn?: string
  // Opcionales/derivados para UI
  usuario?: string
  usuario_id?: number | string
  fecha?: string
  cantidad?: number
  menu_id?: number | string
  hora?: string
}

export interface Pago {
  id: number | string
  personaId: number | string
  monto: number | string
  moneda?: string
  proveedor?: string | null
  referencia?: string | null
  estado: 'PENDIENTE' | 'APROBADO' | 'RECHAZADO' | 'ANULADO'
  creadoEn?: string
}

export interface Beca {
  id: number | string
  personaId?: number | string
  tipo: string
  estado: string
  vigenteDesde: string
  vigenteHasta?: string | null
  cuotaDiaria: number
}

export interface DashboardStats {
  total_platos: number
  total_insumos: number
  total_menus: number
  total_compras: number
  total_proveedores: number
  total_reservas: number
  total_pagos: string
  total_becas: number
  reservas_hoy?: number
  insumos_bajo_stock?: number
}

export interface PaginationMeta {
  page: number
  limit: number
  totalRecords: number
  totalPages: number
  hasPreviousPage: boolean
  hasNextPage: boolean
}

export interface Paginated<T> {
  data: T
  meta: PaginationMeta
}
