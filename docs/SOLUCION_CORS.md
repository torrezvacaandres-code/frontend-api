# Solución del Error CORS

## 🔴 Problema

El error de CORS ocurre cuando el frontend (desplegado en `https://frontend-api-rouge.vercel.app`) intenta hacer peticiones al backend (en `https://presocial-hilton-despisingly.ngrok-free.dev`), pero el backend no está configurado para permitir peticiones desde ese origen.

**Error en consola:**
```
Access to fetch at 'https://presocial-hilton-despisingly.ngrok-free.dev/api/v1//platos?page=1&limit=9' 
from origin 'https://frontend-api-rouge.vercel.app' has been blocked by CORS policy: 
Response to preflight request doesn't pass access control check: 
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

## ✅ Solución: Configurar CORS en el Backend NestJS

### Opción 1: Permitir múltiples orígenes (Recomendado para producción)

En el archivo `main.ts` del backend NestJS, actualiza la configuración de CORS:

```typescript
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global prefix
  app.setGlobalPrefix('api/v1');

  // CORS - Permitir múltiples orígenes
  app.enableCors({
    origin: [
      'http://localhost:3000',                    // Desarrollo local
      'http://localhost:3001',                    // Desarrollo local alternativo
      'https://frontend-api-rouge.vercel.app',    // Producción Vercel
      // Agrega otros orígenes según sea necesario
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
    allowedHeaders: [
      'Content-Type', 
      'Authorization',
      'ngrok-skip-browser-warning',  // Necesario para ngrok
    ],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
  });

  // Validación global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(8000);
  console.log(`🚀 Backend corriendo en http://localhost:8000`);
  console.log(`📡 API base: http://localhost:8000/api/v1`);
}

bootstrap();
```

### Opción 2: Usar variables de entorno (Más flexible)

```typescript
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Global prefix
  const apiPrefix = configService.get('API_PREFIX') || 'api/v1';
  app.setGlobalPrefix(apiPrefix);

  // CORS desde variables de entorno
  const corsOrigins = configService.get('CORS_ORIGINS')?.split(',') || [
    'http://localhost:3000',
    'https://frontend-api-rouge.vercel.app',
  ];

  app.enableCors({
    origin: corsOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
    allowedHeaders: [
      'Content-Type', 
      'Authorization',
      'ngrok-skip-browser-warning',
    ],
  });

  // Validación global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = configService.get<number>('PORT') || 8000;
  await app.listen(port);
  console.log(`🚀 Backend corriendo en http://localhost:${port}`);
  console.log(`📡 API base: http://localhost:${port}/${apiPrefix}`);
}

bootstrap();
```

**Variables de entorno en `.env` del backend:**
```env
CORS_ORIGINS=http://localhost:3000,https://frontend-api-rouge.vercel.app
PORT=8000
API_PREFIX=api/v1
```

### Opción 3: Permitir todos los orígenes (Solo para desarrollo/testing)

⚠️ **NO usar en producción**

```typescript
app.enableCors({
  origin: '*',  // Permite todos los orígenes
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  credentials: false,  // Debe ser false cuando origin es '*'
});
```

## 🔧 Solución Adicional: Headers para ngrok

Si estás usando ngrok, asegúrate de incluir el header `ngrok-skip-browser-warning` en las peticiones. Esto ya está configurado en el frontend (`lib/api/client.ts`).

## 📝 Checklist

- [ ] CORS configurado en `main.ts` del backend
- [ ] Origen de Vercel (`https://frontend-api-rouge.vercel.app`) agregado a la lista de orígenes permitidos
- [ ] Headers necesarios incluidos (`ngrok-skip-browser-warning` si usas ngrok)
- [ ] Métodos HTTP permitidos configurados
- [ ] Backend reiniciado después de los cambios

## 🧪 Verificar que funciona

Después de actualizar el backend:

1. Reinicia el servidor NestJS
2. Abre la consola del navegador en tu frontend
3. Intenta hacer una petición
4. Verifica que no aparezca el error de CORS

Puedes probar manualmente con curl:

```bash
curl -H "Origin: https://frontend-api-rouge.vercel.app" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     https://presocial-hilton-despisingly.ngrok-free.dev/api/v1/platos \
     -v
```

Deberías ver el header `Access-Control-Allow-Origin: https://frontend-api-rouge.vercel.app` en la respuesta.

## 📚 Referencias

- [Documentación oficial de CORS en NestJS](https://docs.nestjs.com/security/cors)
- [MDN - CORS](https://developer.mozilla.org/es/docs/Web/HTTP/CORS)

