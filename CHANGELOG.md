# Changelog

Todos los cambios notables en este proyecto serán documentados en este archivo.

## [0.1.0] - 2025-11-15

### 🎉 Agregado

#### Backend NestJS
- Sistema diseñado para integrarse con backend NestJS REST API
- Documentación completa de integración con NestJS (`docs/NESTJS_INTEGRATION.md`)
- Ejemplos de controllers, services y DTOs para NestJS
- Configuración de CORS específica para NestJS
- Guía de implementación de endpoints REST

#### Estructura de Rutas
- Sistema de rutas con Next.js App Router
- Rutas separadas por rol: `/admin`, `/staff`, `/student`
- Página principal con selector de rol
- Navegación entre roles

#### Integración con Backend
- Cliente HTTP centralizado con manejo de errores (`lib/api/client.ts`)
- Tipos TypeScript para todas las entidades (`lib/api/types.ts`)
- Servicios API organizados por módulo:
  - `platosApi` - Gestión de platos
  - `insumosApi` - Gestión de insumos
  - `menusApi` - Gestión de menús
  - `reservasApi` - Gestión de reservas

#### Estados de Carga y Error
- Hook personalizado `useApi` para data fetching con estados de carga y error
- Componente `Loading` reutilizable con animación
- Componente `ErrorMessage` con opción de retry
- Manejo consistente de estados vacíos en todos los módulos

#### Componentes UI
- Componente de carga (`components/ui/loading.tsx`)
- Componente de error (`components/ui/error-message.tsx`)

#### Configuración
- Variables de entorno para configuración del backend
- Archivo `.env.example` con documentación
- Archivo `.env.local` para desarrollo local
- `.gitignore` actualizado

#### Documentación
- README completo con instrucciones de instalación
- Documentación de la estructura del proyecto
- Documentación de endpoints del backend
- Lista de características implementadas y pendientes

### 🔄 Modificado

#### Módulos de Gestión
- **Platos**: Integrado con API real, estados de carga/error
- **Insumos**: Integrado con API real, tabla con indicador de stock bajo
- **Menús**: Integrado con API real, visualización de menús semanales
- **Reservas**: Integrado con API real, estados de confirmación

#### Vistas
- **Vista de Estudiante**: 
  - Integrada con API para menús y reservas
  - Tabs para menús, reservas y pagos
  - Estados de carga para cada sección
  - Información actualizada desde el backend

#### Configuración de la Aplicación
- Metadata del layout actualizada con información del proyecto
- Título y descripción relevantes
- Keywords para SEO
- Nombre del paquete actualizado

### 🐛 Corregido
- Tipos TypeScript correctos en todos los componentes
- Manejo seguro de datos nulos en renderizado
- Estados de carga sincronizados con fetching de datos

### 📝 Notas Técnicas

#### Arquitectura
El proyecto sigue una arquitectura en capas:
1. **Capa de Presentación**: Componentes React con Tailwind CSS
2. **Capa de Lógica**: Hooks personalizados para manejo de estado
3. **Capa de Servicios**: Cliente HTTP y servicios API
4. **Capa de Tipos**: TypeScript para type safety

#### Decisiones de Diseño
- Uso de Next.js App Router para mejor SEO y performance
- Separación de rutas por rol para mejor organización
- Cliente HTTP reutilizable con interceptores de error
- Hook personalizado para simplificar data fetching
- Componentes de UI reutilizables para consistencia

#### Próximas Iteraciones
Ver la sección "Próximas Mejoras" en el README.md
