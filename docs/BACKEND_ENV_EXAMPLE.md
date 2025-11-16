# Variables de Entorno - Backend NestJS

## Archivo .env para el Backend

Crea un archivo `.env` en la raíz de tu proyecto NestJS con estas variables:

```env
# Configuración del servidor
PORT=8000
NODE_ENV=development

# Base de datos PostgreSQL
DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_DATABASE=comedor_db

# CORS - URLs permitidas
CORS_ORIGIN=http://localhost:3000,http://localhost:3001

# JWT (si implementas autenticación)
JWT_SECRET=tu-secreto-super-seguro-aqui
JWT_EXPIRATION=7d

# Opcionales
# Global API prefix
API_PREFIX=api

# Logging
LOG_LEVEL=debug
```

## Uso en app.module.ts

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    // Cargar variables de entorno
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Configurar TypeORM con variables de entorno
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: configService.get('DB_TYPE') as any,
        host: configService.get('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        autoLoadEntities: true,
        synchronize: configService.get('NODE_ENV') === 'development',
      }),
      inject: [ConfigService],
    }),

    // Tus módulos
    PlatosModule,
    InsumosModule,
    MenusModule,
    // ...
  ],
})
export class AppModule {}
```

## Uso en main.ts

```typescript
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Global prefix (opcional)
  const apiPrefix = configService.get('API_PREFIX');
  if (apiPrefix) {
    app.setGlobalPrefix(apiPrefix);
  }

  // CORS
  const corsOrigin = configService.get('CORS_ORIGIN');
  app.enableCors({
    origin: corsOrigin ? corsOrigin.split(',') : '*',
    credentials: true,
  });

  // Validación
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Puerto
  const port = configService.get<number>('PORT') || 8000;
  await app.listen(port);

  console.log(`🚀 Backend NestJS corriendo en http://localhost:${port}`);
  if (apiPrefix) {
    console.log(`📡 API base: http://localhost:${port}/${apiPrefix}`);
  }
}
bootstrap();
```

## Instalar Dependencias

```bash
npm install @nestjs/config
```

## Diferentes Ambientes

### .env.development

```env
NODE_ENV=development
PORT=8000
DB_HOST=localhost
DB_DATABASE=comedor_dev
# ... otras variables
```

### .env.production

```env
NODE_ENV=production
PORT=8000
DB_HOST=tu-servidor-produccion.com
DB_DATABASE=comedor_prod
# ... otras variables
```

### .env.test

```env
NODE_ENV=test
PORT=8001
DB_DATABASE=comedor_test
# ... otras variables
```

## Cargar Archivo Específico

```typescript
// app.module.ts
ConfigModule.forRoot({
  isGlobal: true,
  envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
})
```

## Validación de Variables de Entorno

```typescript
// src/config/env.validation.ts
import { plainToClass } from 'class-transformer';
import { IsEnum, IsNumber, IsString, validateSync } from 'class-validator';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsNumber()
  PORT: number;

  @IsString()
  DB_HOST: string;

  @IsNumber()
  DB_PORT: number;

  @IsString()
  DB_USERNAME: string;

  @IsString()
  DB_PASSWORD: string;

  @IsString()
  DB_DATABASE: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToClass(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
```

```typescript
// app.module.ts
ConfigModule.forRoot({
  isGlobal: true,
  validate,
})
```

## Acceder a Variables en Servicios

```typescript
// platos.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PlatosService {
  constructor(private configService: ConfigService) {}

  someMethod() {
    const nodeEnv = this.configService.get<string>('NODE_ENV');
    const port = this.configService.get<number>('PORT');
    
    // Usar las variables...
  }
}
```

## .gitignore

**IMPORTANTE**: No commitear archivos .env al repositorio

```gitignore
# Variables de entorno
.env
.env.local
.env.*.local
.env.development
.env.production
.env.test

# Crear .env.example para documentación
!.env.example
```

## Crear .env.example

```env
# Configuración del servidor
PORT=8000
NODE_ENV=development

# Base de datos
DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=tu_usuario
DB_PASSWORD=tu_password
DB_DATABASE=comedor_db

# CORS
CORS_ORIGIN=http://localhost:3000

# JWT
JWT_SECRET=cambiar-este-secreto-en-produccion
JWT_EXPIRATION=7d
```

## Sincronización con el Frontend

Si usas un global prefix en el backend:

```env
# Backend .env
API_PREFIX=api
```

Actualiza el frontend:

```env
# Frontend .env.local
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

## Docker Compose (Opcional)

```yaml
# docker-compose.yml
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
      POSTGRES_DB: comedor_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: .
    ports:
      - "8000:8000"
    environment:
      - NODE_ENV=development
      - DB_HOST=postgres
      - DB_PORT=5432
      - DB_USERNAME=postgres
      - DB_PASSWORD=password
      - DB_DATABASE=comedor_db
    depends_on:
      - postgres

volumes:
  postgres_data:
```

Ejecutar:

```bash
docker-compose up -d
```

---

Con esta configuración, tu backend NestJS estará listo para trabajar en diferentes ambientes de manera segura. 🔐
