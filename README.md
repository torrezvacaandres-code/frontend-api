# Sistema de Gestión de Comedor Universitario

Sistema web completo para la gestión de comedores universitarios construido con Next.js 16, TypeScript, y TailwindCSS. Integrado con backend NestJS REST API.

## 🚀 Características

### Roles de Usuario

- **Administrador**: Acceso completo a todos los módulos de gestión
- **Personal (Staff)**: Gestión de reservas, menús e insumos
- **Estudiante**: Ver menús disponibles, hacer reservas y consultar pagos

### Módulos Principales

- **Dashboard**: Resumen general del sistema con estadísticas
- **Platos**: Gestión de platos disponibles en el menú
- **Insumos**: Control de inventario de ingredientes
- **Menús**: Planificación de menús semanales
- **Compras**: Registro de compras de insumos
- **Proveedores**: Gestión de proveedores
- **Reservas**: Sistema de reservas de comidas
- **Pagos**: Control de pagos de estudiantes
- **Becas**: Gestión de becas alimentarias

## 🛠️ Tecnologías

- **Framework**: Next.js 16 (App Router)
- **Lenguaje**: TypeScript
- **Estilos**: TailwindCSS + shadcn/ui
- **Iconos**: Lucide React
- **Validación**: Zod + React Hook Form
- **Gráficos**: Recharts

## 📦 Instalación

1. Clonar el repositorio:
```bash
git clone <tu-repositorio>
cd code
```

2. Instalar dependencias:
```bash
pnpm install
```

3. Configurar variables de entorno:
```bash
cp .env.example .env.local
```

Editar `.env.local` y configurar la URL del backend:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000   
```

4. Ejecutar en modo desarrollo:
```bash
pnpm dev
```

La aplicación estará disponible en `http://localhost:3000`

## 🏗️ Estructura del Proyecto

```
.
├── app/                    # App Router de Next.js
│   ├── admin/             # Página de administrador
│   ├── staff/             # Página de personal
│   ├── student/           # Página de estudiante
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Página de inicio (selector de rol)
├── components/
│   ├── modules/           # Módulos de gestión
│   │   ├── platos.tsx
│   │   ├── insumos.tsx
│   │   ├── menus.tsx
│   │   ├── reservas.tsx
│   │   └── ...
│   ├── views/             # Vistas por rol
│   │   ├── student-view.tsx
│   │   └── staff-view.tsx
│   └── ui/                # Componentes de UI reutilizables
├── lib/
│   └── api/               # Servicios de API
│       ├── client.ts      # Cliente HTTP
│       ├── types.ts       # Tipos TypeScript
│       ├── platos.ts      # API de platos
│       ├── insumos.ts     # API de insumos
│       ├── menus.ts       # API de menús
│       ├── reservas.ts    # API de reservas
│       └── index.ts       # Exports
└── hooks/
    └── use-api.ts         # Hook personalizado para llamadas API
```

## 🔌 Backend NestJS

El frontend está configurado para comunicarse con un backend NestJS REST API. NestJS utiliza decoradores y controladores para definir endpoints RESTful.

### Estructura Esperada del Backend NestJS

El backend debería tener controladores (Controllers) con los siguientes endpoints:

#### Endpoints Principales

- **Platos**
  - `GET /platos` - Listar todos los platos
  - `POST /platos` - Crear nuevo plato
  - `PUT /platos/:id` - Actualizar plato
  - `DELETE /platos/:id` - Eliminar plato

- **Insumos**
  - `GET /insumos` - Listar todos los insumos
  - `GET /insumos/bajo-stock` - Listar insumos con stock bajo
  - `POST /insumos` - Crear nuevo insumo
  - `PUT /insumos/:id` - Actualizar insumo
  - `DELETE /insumos/:id` - Eliminar insumo

- **Menús**
  - `GET /menus` - Listar todos los menús
  - `GET /menus/semanal` - Obtener menús de la semana
  - `POST /menus` - Crear nuevo menú
  - `PUT /menus/:id` - Actualizar menú
  - `DELETE /menus/:id` - Eliminar menú

- **Reservas**
  - `GET /reservas` - Listar todas las reservas
  - `GET /reservas/usuario/:id` - Reservas de un usuario
  - `POST /reservas` - Crear nueva reserva
  - `PUT /reservas/:id` - Actualizar reserva
  - `DELETE /reservas/:id` - Eliminar reserva
  - `POST /reservas/:id/confirmar` - Confirmar reserva
  - `POST /reservas/:id/cancelar` - Cancelar reserva

### Ejemplo de Controller en NestJS

```typescript
// platos.controller.ts
import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';

@Controller('platos')
export class PlatosController {
  @Get()
  findAll() {
    // Devuelve array de platos
    return this.platosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.platosService.findOne(+id);
  }

  @Post()
  create(@Body() createPlatoDto: CreatePlatoDto) {
    return this.platosService.create(createPlatoDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updatePlatoDto: UpdatePlatoDto) {
    return this.platosService.update(+id, updatePlatoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.platosService.remove(+id);
  }
}
```

### CORS en NestJS

Asegúrate de habilitar CORS en tu `main.ts` de NestJS:

```typescript
// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Habilitar CORS para el frontend
  app.enableCors({
    origin: 'http://localhost:3000', // URL del frontend Next.js
    credentials: true,
  });
  
  await app.listen(8000);
}
bootstrap();
```

### Formato de Respuesta

NestJS devuelve directamente los objetos sin wrapping adicional por defecto:

```typescript
// Respuesta esperada de GET /platos
[
  {
    "id": 1,
    "nombre": "Arroz con pollo",
    "descripcion": "Arroz blanco con pechuga de pollo",
    "precio": 8.50,
    "categoria": "Principal"
  }
]
```

Si tu backend usa un formato de respuesta envuelto, actualiza el cliente API en `lib/api/client.ts` para extraer los datos correctamente.

### 📖 Documentación Adicional de NestJS

- **[Guía de Integración NestJS](docs/NESTJS_INTEGRATION.md)**: Documentación completa sobre cómo implementar el backend NestJS con ejemplos de código
- **[Quick Start NestJS](docs/QUICKSTART_NESTJS.md)**: Guía paso a paso para crear el backend desde cero si aún no lo tienes

## 🎨 Características Implementadas

### ✅ Sistema de Rutas
- Rutas separadas por rol (`/admin`, `/staff`, `/student`)
- Navegación con Next.js App Router
- Selector de rol en página principal

### ✅ Integración con Backend
- Cliente HTTP reutilizable con TypeScript
- Servicios API por módulo
- Manejo de errores centralizado

### ✅ Estados de Carga y Error
- Hook personalizado `useApi` para data fetching
- Componentes de Loading y Error reutilizables
- Retry automático en caso de errores

### ✅ UI/UX Moderna
- Diseño responsive
- Componentes de shadcn/ui
- Estados vacíos bien definidos
- Feedback visual en todas las acciones

## 🚧 Próximas Mejoras

- [ ] Autenticación y autorización
- [ ] Formularios completos para crear/editar
- [ ] Paginación en listados
- [ ] Filtros y búsqueda
- [ ] Exportación de reportes
- [ ] Notificaciones en tiempo real
- [ ] Modo offline

## 📝 Scripts Disponibles

```bash
# Desarrollo
pnpm dev

# Build para producción
pnpm build

# Iniciar servidor de producción
pnpm start

# Linting
pnpm lint
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.
