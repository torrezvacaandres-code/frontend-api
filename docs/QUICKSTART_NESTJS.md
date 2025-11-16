# Quick Start - Backend NestJS

Guía rápida para crear el backend NestJS desde cero si aún no lo tienes.

## 🚀 Crear Proyecto NestJS

```bash
# Instalar NestJS CLI globalmente
npm install -g @nestjs/cli

# Crear nuevo proyecto
nest new backend-comedor

# Entrar al directorio
cd backend-comedor

# Instalar dependencias adicionales
npm install @nestjs/typeorm typeorm pg
npm install class-validator class-transformer
```

## 📦 Configurar Base de Datos

### 1. Instalar PostgreSQL

```bash
# Ubuntu/Debian
sudo apt install postgresql postgresql-contrib

# macOS (con Homebrew)
brew install postgresql

# O usar Docker
docker run --name postgres-comedor -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres
```

### 2. Crear Base de Datos

```sql
-- Conectar a PostgreSQL
psql -U postgres

-- Crear base de datos
CREATE DATABASE comedor_db;

-- Crear usuario (opcional)
CREATE USER comedor_user WITH PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE comedor_db TO comedor_user;
```

## 🔧 Configurar TypeORM

### app.module.ts

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'password',
      database: 'comedor_db',
      autoLoadEntities: true,
      synchronize: true, // ⚠️ Solo en desarrollo
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

## 🏗️ Crear Módulo de Platos (Ejemplo)

```bash
# Crear módulo completo
nest g resource platos
# Selecciona: REST API
# Selecciona: Yes (para generar CRUD)
```

Esto genera:
- `platos.controller.ts`
- `platos.service.ts`
- `platos.module.ts`
- `dto/create-plato.dto.ts`
- `dto/update-plato.dto.ts`
- `entities/plato.entity.ts`

### Configurar Entity

Edita `platos/entities/plato.entity.ts`:

```typescript
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('platos')
export class Plato {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  descripcion: string;

  @Column('decimal', { precision: 10, scale: 2 })
  precio: number;

  @Column()
  categoria: string;

  @Column({ default: true })
  disponible: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
```

### Configurar DTO

Edita `platos/dto/create-plato.dto.ts`:

```typescript
import { IsString, IsNumber, IsBoolean, IsOptional, Min } from 'class-validator';

export class CreatePlatoDto {
  @IsString()
  nombre: string;

  @IsString()
  descripcion: string;

  @IsNumber()
  @Min(0)
  precio: number;

  @IsString()
  categoria: string;

  @IsOptional()
  @IsBoolean()
  disponible?: boolean;
}
```

### Implementar Service

Edita `platos/platos.service.ts`:

```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePlatoDto } from './dto/create-plato.dto';
import { UpdatePlatoDto } from './dto/update-plato.dto';
import { Plato } from './entities/plato.entity';

@Injectable()
export class PlatosService {
  constructor(
    @InjectRepository(Plato)
    private platosRepository: Repository<Plato>,
  ) {}

  async create(createPlatoDto: CreatePlatoDto): Promise<Plato> {
    const plato = this.platosRepository.create(createPlatoDto);
    return await this.platosRepository.save(plato);
  }

  async findAll(): Promise<Plato[]> {
    return await this.platosRepository.find();
  }

  async findOne(id: number): Promise<Plato> {
    const plato = await this.platosRepository.findOne({ where: { id } });
    if (!plato) {
      throw new NotFoundException(`Plato con ID ${id} no encontrado`);
    }
    return plato;
  }

  async update(id: number, updatePlatoDto: UpdatePlatoDto): Promise<Plato> {
    const plato = await this.findOne(id);
    Object.assign(plato, updatePlatoDto);
    return await this.platosRepository.save(plato);
  }

  async remove(id: number): Promise<void> {
    const result = await this.platosRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Plato con ID ${id} no encontrado`);
    }
  }
}
```

## 🌐 Configurar CORS y Validación

Edita `main.ts`:

```typescript
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
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
  console.log('🚀 Backend corriendo en http://localhost:8000');
}
bootstrap();
```

## 🎯 Crear Otros Módulos

Repite el proceso para cada módulo:

```bash
# Insumos
nest g resource insumos

# Menús
nest g resource menus

# Reservas
nest g resource reservas

# Compras
nest g resource compras

# Proveedores
nest g resource proveedores

# Pagos
nest g resource pagos

# Becas
nest g resource becas
```

## 🧪 Probar el Backend

```bash
# Iniciar servidor en desarrollo
npm run start:dev

# El servidor se reiniciará automáticamente con los cambios
```

### Probar con curl

```bash
# Crear un plato
curl -X POST http://localhost:8000/platos \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Arroz con pollo",
    "descripcion": "Arroz blanco con pechuga de pollo",
    "precio": 8.50,
    "categoria": "Principal"
  }'

# Listar platos
curl http://localhost:8000/platos

# Obtener un plato
curl http://localhost:8000/platos/1

# Actualizar plato
curl -X PATCH http://localhost:8000/platos/1 \
  -H "Content-Type: application/json" \
  -d '{"precio": 9.00}'

# Eliminar plato
curl -X DELETE http://localhost:8000/platos/1
```

## 📊 Datos de Prueba (Seed)

Crear un script para poblar la base de datos:

```typescript
// src/seed/seed.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Plato } from '../platos/entities/plato.entity';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(Plato)
    private platosRepository: Repository<Plato>,
  ) {}

  async seed() {
    const platos = [
      {
        nombre: 'Arroz con pollo',
        descripcion: 'Arroz blanco con pechuga de pollo',
        precio: 8.50,
        categoria: 'Principal',
      },
      {
        nombre: 'Ensalada mixta',
        descripcion: 'Lechuga, tomate, cebolla y aderezo',
        precio: 5.00,
        categoria: 'Ensalada',
      },
      {
        nombre: 'Pasta a la carbonara',
        descripcion: 'Pasta italiana con salsa de queso',
        precio: 7.50,
        categoria: 'Principal',
      },
    ];

    for (const platoData of platos) {
      const plato = this.platosRepository.create(platoData);
      await this.platosRepository.save(plato);
    }

    console.log('✅ Datos de prueba creados');
  }
}
```

## 🔍 Swagger (Documentación API)

```bash
npm install @nestjs/swagger swagger-ui-express
```

```typescript
// main.ts
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ... configuración CORS y validación

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Comedor API')
    .setDescription('API del sistema de gestión de comedor universitario')
    .setVersion('1.0')
    .addTag('platos')
    .addTag('insumos')
    .addTag('menus')
    .addTag('reservas')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(8000);
  console.log('🚀 Backend: http://localhost:8000');
  console.log('📚 Docs: http://localhost:8000/api/docs');
}
bootstrap();
```

## ✅ Checklist

- [ ] Proyecto NestJS creado
- [ ] Base de datos PostgreSQL corriendo
- [ ] TypeORM configurado en `app.module.ts`
- [ ] CORS habilitado en `main.ts`
- [ ] Validación global configurada
- [ ] Módulo de platos creado y funcionando
- [ ] Probar endpoints con curl o Postman
- [ ] Crear los demás módulos (insumos, menús, etc.)
- [ ] Agregar datos de prueba
- [ ] Conectar frontend Next.js

## 📚 Recursos

- [Documentación NestJS](https://docs.nestjs.com)
- [TypeORM Documentation](https://typeorm.io)
- [NestJS + TypeORM Tutorial](https://docs.nestjs.com/techniques/database)
- [Class Validator](https://github.com/typestack/class-validator)

## 🆘 Problemas Comunes

### Puerto 8000 en uso

```bash
# Verificar qué proceso usa el puerto
lsof -i :8000

# Matar el proceso
kill -9 <PID>

# O cambiar el puerto en main.ts
await app.listen(3001);
```

### Error de conexión a PostgreSQL

```bash
# Verificar que PostgreSQL esté corriendo
sudo service postgresql status

# Iniciar PostgreSQL
sudo service postgresql start
```

### Error de CORS

Verifica que `enableCors()` esté antes de `app.listen()` en `main.ts`.

---

¡Listo! Con estos pasos tendrás un backend NestJS funcional listo para conectar con el frontend. 🚀
