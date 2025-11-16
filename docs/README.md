# Documentación del Sistema de Gestión de Comedor

Documentación completa para el desarrollo e integración del sistema.

## 📚 Índice de Documentación

### Para Desarrolladores Frontend

- **[README Principal](../README.md)**: Documentación general del proyecto Next.js
- Instalación y configuración
- Estructura del proyecto
- Comandos disponibles
- Características implementadas

### Para Desarrolladores Backend

- **[Guía de Integración NestJS](NESTJS_INTEGRATION.md)**: Documentación completa sobre la integración con NestJS
  - Estructura de módulos recomendada
  - Configuración de CORS
  - Ejemplos de Controllers y Services
  - DTOs y Entities
  - Endpoints específicos (bajo stock, menú semanal, etc.)
  - Manejo de errores
  - Autenticación JWT (opcional)
  - Testing

- **[Quick Start NestJS](QUICKSTART_NESTJS.md)**: Guía paso a paso para crear el backend desde cero
  - Crear proyecto NestJS
  - Configurar base de datos PostgreSQL
  - Implementar módulos básicos
  - Configurar TypeORM
  - Validación y CORS
  - Swagger (documentación API)
  - Datos de prueba (seed)

- **[Variables de Entorno Backend](BACKEND_ENV_EXAMPLE.md)**: Configuración de variables de entorno
  - Archivo .env de ejemplo
  - Configuración por ambiente
  - Validación de variables
  - Docker Compose

## 🔗 Enlaces Rápidos

### Documentación Oficial

- [Next.js Documentation](https://nextjs.org/docs)
- [NestJS Documentation](https://docs.nestjs.com)
- [TypeORM Documentation](https://typeorm.io)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)

### Recursos Útiles

- [shadcn/ui Components](https://ui.shadcn.com)
- [Lucide Icons](https://lucide.dev)
- [React Hook Form](https://react-hook-form.com)
- [Zod Validation](https://zod.dev)

## 🎯 Flujo de Trabajo Recomendado

### 1. Setup Inicial

```bash
# Frontend
cd frontend
pnpm install
cp .env.example .env.local

# Backend
cd backend
npm install
cp .env.example .env
```

### 2. Desarrollo Paralelo

```bash
# Terminal 1: Frontend
cd frontend
pnpm dev
# Corre en http://localhost:3000

# Terminal 2: Backend
cd backend
npm run start:dev
# Corre en http://localhost:8000

# Terminal 3: Base de datos (si usas Docker)
docker-compose up postgres
```

### 3. Crear un Módulo Completo

#### Backend (NestJS)

```bash
# Crear recurso completo
nest g resource insumos

# Editar:
# - entities/insumo.entity.ts
# - dto/create-insumo.dto.ts
# - dto/update-insumo.dto.ts
# - insumos.service.ts
# - insumos.controller.ts
```

#### Frontend (Next.js)

```typescript
// 1. Agregar tipos en lib/api/types.ts
export interface Insumo {
  id: number;
  nombre: string;
  cantidad: number;
  // ...
}

// 2. Crear servicio en lib/api/insumos.ts
export const insumosApi = {
  getAll: () => apiClient.get<Insumo[]>('/insumos'),
  // ...
}

// 3. Usar en componente con useApi hook
const { data, loading, error } = useApi(() => insumosApi.getAll(), []);
```

## 🧪 Testing

### Backend

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

### Frontend

```bash
# Lint
pnpm lint

# Type check
pnpm type-check
```

## 📦 Deployment

### Frontend (Vercel)

```bash
# Build local
pnpm build

# Deploy en Vercel
vercel --prod
```

### Backend (Render/Railway/Heroku)

```bash
# Build
npm run build

# Start production
npm run start:prod
```

## 🆘 Troubleshooting

### Problemas Comunes

#### CORS Error

**Síntoma**: Error de CORS en consola del navegador

**Solución**:
```typescript
// Backend main.ts
app.enableCors({
  origin: 'http://localhost:3000',
  credentials: true,
});
```

#### No conecta con backend

**Síntoma**: "Network error or NestJS server is not reachable"

**Verificar**:
1. Backend está corriendo: `http://localhost:8000`
2. Variable de entorno correcta: `.env.local` → `NEXT_PUBLIC_API_URL=http://localhost:8000`
3. CORS habilitado en backend

#### Error de validación en DTOs

**Síntoma**: Error 400 con mensaje "validation failed"

**Verificar**:
1. Los datos enviados coinciden con el DTO
2. class-validator instalado: `npm install class-validator class-transformer`
3. ValidationPipe configurado en `main.ts`

#### Base de datos no conecta

**Síntoma**: Error "Connection refused" o "ECONNREFUSED"

**Verificar**:
1. PostgreSQL está corriendo: `sudo service postgresql status`
2. Credenciales correctas en `.env`
3. Base de datos existe: `psql -l`

## 📋 Checklist de Producción

### Backend

- [ ] Variables de entorno en servidor
- [ ] `synchronize: false` en TypeORM
- [ ] CORS configurado con dominio real
- [ ] HTTPS habilitado
- [ ] Rate limiting implementado
- [ ] Logs configurados
- [ ] Backups de base de datos automatizados
- [ ] Migraciones de base de datos

### Frontend

- [ ] Variables de entorno de producción
- [ ] Build optimizado
- [ ] Imágenes optimizadas
- [ ] SEO configurado
- [ ] Analytics integrado
- [ ] Error tracking (ej: Sentry)
- [ ] HTTPS habilitado

## 🤝 Contribuir

### Convenciones de Código

#### Frontend
- Usar TypeScript estricto
- Componentes funcionales con hooks
- CSS con TailwindCSS
- Nombres en inglés para código, español para UI

#### Backend
- Usar decoradores de NestJS
- DTOs para validación
- Services para lógica de negocio
- Controllers solo para routing
- Documentar con JSDoc

### Git Workflow

```bash
# Crear rama para feature
git checkout -b feature/nombre-feature

# Commits semánticos
git commit -m "feat: agregar módulo de insumos"
git commit -m "fix: corregir error en reservas"
git commit -m "docs: actualizar README"

# Push y crear PR
git push origin feature/nombre-feature
```

## 📞 Soporte

Para preguntas o problemas:

1. Revisa la documentación relevante
2. Busca en los issues del repositorio
3. Crea un nuevo issue con:
   - Descripción del problema
   - Pasos para reproducir
   - Logs de error
   - Ambiente (OS, versiones, etc.)

---

**Última actualización**: Noviembre 2025
