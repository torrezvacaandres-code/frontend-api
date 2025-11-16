# Integración con Backend NestJS

Esta documentación explica cómo integrar el frontend Next.js con un backend NestJS REST API.

## 🏗️ Estructura del Backend NestJS

### Módulos Recomendados

```
backend/
├── src/
│   ├── platos/
│   │   ├── platos.controller.ts
│   │   ├── platos.service.ts
│   │   ├── platos.module.ts
│   │   ├── entities/plato.entity.ts
│   │   └── dto/
│   │       ├── create-plato.dto.ts
│   │       └── update-plato.dto.ts
│   ├── insumos/
│   │   ├── insumos.controller.ts
│   │   ├── insumos.service.ts
│   │   └── ...
│   ├── menus/
│   ├── reservas/
│   ├── compras/
│   ├── proveedores/
│   ├── pagos/
│   ├── becas/
│   └── main.ts
```

## 🔧 Configuración del Backend

### 1. CORS en main.ts

```typescript
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global prefix para todas las rutas (opcional)
  app.setGlobalPrefix('api');

  // Habilitar CORS
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Validación global de DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(8000);
  console.log(`Application is running on: http://localhost:8000`);
}
bootstrap();
```

**Nota**: Si usas `app.setGlobalPrefix('api')`, actualiza `NEXT_PUBLIC_API_URL=http://localhost:8000/api` en `.env.local`

### 2. DTOs (Data Transfer Objects)

Los DTOs definen la estructura de datos que espera cada endpoint:

```typescript
// create-plato.dto.ts
import { IsString, IsNumber, IsOptional, Min } from 'class-validator';

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
  @IsString()
  imagen?: string;
}
```

### 3. Entities

Define tus entidades según la base de datos que uses:

```typescript
// plato.entity.ts (TypeORM ejemplo)
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

  @Column({ nullable: true })
  imagen?: string;

  @Column({ default: true })
  disponible: boolean;
}
```

## 🎯 Implementación de Controllers

### Controller Completo - Platos

```typescript
// platos.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PlatosService } from './platos.service';
import { CreatePlatoDto } from './dto/create-plato.dto';
import { UpdatePlatoDto } from './dto/update-plato.dto';

@Controller('platos')
export class PlatosController {
  constructor(private readonly platosService: PlatosService) {}

  @Get()
  async findAll() {
    return this.platosService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.platosService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createPlatoDto: CreatePlatoDto) {
    return this.platosService.create(createPlatoDto);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePlatoDto: UpdatePlatoDto,
  ) {
    return this.platosService.update(id, updatePlatoDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.platosService.remove(id);
  }
}
```

### Service Ejemplo

```typescript
// platos.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Plato } from './entities/plato.entity';
import { CreatePlatoDto } from './dto/create-plato.dto';
import { UpdatePlatoDto } from './dto/update-plato.dto';

@Injectable()
export class PlatosService {
  constructor(
    @InjectRepository(Plato)
    private platosRepository: Repository<Plato>,
  ) {}

  async findAll(): Promise<Plato[]> {
    return this.platosRepository.find();
  }

  async findOne(id: number): Promise<Plato> {
    const plato = await this.platosRepository.findOne({ where: { id } });
    if (!plato) {
      throw new NotFoundException(`Plato con ID ${id} no encontrado`);
    }
    return plato;
  }

  async create(createPlatoDto: CreatePlatoDto): Promise<Plato> {
    const plato = this.platosRepository.create(createPlatoDto);
    return this.platosRepository.save(plato);
  }

  async update(id: number, updatePlatoDto: UpdatePlatoDto): Promise<Plato> {
    await this.findOne(id); // Verifica que existe
    await this.platosRepository.update(id, updatePlatoDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.platosRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Plato con ID ${id} no encontrado`);
    }
  }
}
```

## 🔄 Endpoints Específicos

### Insumos - Bajo Stock

```typescript
@Controller('insumos')
export class InsumosController {
  // ... otros métodos

  @Get('bajo-stock')
  async getBajoStock() {
    return this.insumosService.findBajoStock();
  }
}

// En el service
async findBajoStock(): Promise<Insumo[]> {
  return this.insumosRepository
    .createQueryBuilder('insumo')
    .where('insumo.cantidad <= insumo.stock_minimo')
    .getMany();
}
```

### Menús - Menú Semanal

```typescript
@Controller('menus')
export class MenusController {
  // ... otros métodos

  @Get('semanal')
  async getMenuSemanal() {
    return this.menusService.findMenuSemanal();
  }
}

// En el service
async findMenuSemanal(): Promise<Menu[]> {
  const hoy = new Date();
  const finSemana = new Date();
  finSemana.setDate(hoy.getDate() + 7);

  return this.menusRepository
    .createQueryBuilder('menu')
    .where('menu.fecha >= :hoy', { hoy })
    .andWhere('menu.fecha <= :finSemana', { finSemana })
    .orderBy('menu.fecha', 'ASC')
    .getMany();
}
```

### Reservas - Por Usuario

```typescript
@Controller('reservas')
export class ReservasController {
  // ... otros métodos

  @Get('usuario/:id')
  async findByUsuario(@Param('id', ParseIntPipe) usuarioId: number) {
    return this.reservasService.findByUsuario(usuarioId);
  }

  @Post(':id/confirmar')
  async confirmar(@Param('id', ParseIntPipe) id: number) {
    return this.reservasService.confirmar(id);
  }

  @Post(':id/cancelar')
  async cancelar(@Param('id', ParseIntPipe) id: number) {
    return this.reservasService.cancelar(id);
  }
}
```

## 🛡️ Manejo de Errores

### Exception Filters Globales

```typescript
// main.ts
import { AllExceptionsFilter } from './filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Filtro global de excepciones
  app.useGlobalFilters(new AllExceptionsFilter());
  
  // ... resto de configuración
}
```

### Exception Filter Personalizado

```typescript
// all-exceptions.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }
}
```

## 🔐 Autenticación (Opcional)

Si implementas autenticación JWT:

### Backend NestJS

```typescript
// auth.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];
    
    if (!token) return false;
    
    try {
      const payload = this.jwtService.verify(token);
      request.user = payload;
      return true;
    } catch {
      return false;
    }
  }
}

// Uso en controller
@Controller('platos')
@UseGuards(JwtAuthGuard)
export class PlatosController {
  // ...
}
```

### Frontend - Actualizar Cliente API

```typescript
// lib/api/client.ts
private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  // Obtener token del localStorage o contexto de autenticación
  const token = localStorage.getItem('auth_token');
  
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
  };

  // ... resto del código
}
```

## 📊 Base de Datos

### TypeORM Configuration

```typescript
// app.module.ts
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres', // o 'mysql', 'sqlite', etc.
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'password',
      database: 'comedor_db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Solo en desarrollo
    }),
    PlatosModule,
    InsumosModule,
    // ... otros módulos
  ],
})
export class AppModule {}
```

## 🧪 Testing

### Probar Endpoints

```bash
# Listar platos
curl http://localhost:8000/platos

# Crear plato
curl -X POST http://localhost:8000/platos \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Arroz con pollo",
    "descripcion": "Delicioso arroz con pollo",
    "precio": 8.50,
    "categoria": "Principal"
  }'

# Actualizar plato
curl -X PUT http://localhost:8000/platos/1 \
  -H "Content-Type: application/json" \
  -d '{"precio": 9.00}'

# Eliminar plato
curl -X DELETE http://localhost:8000/platos/1
```

## 🚀 Comandos NestJS Útiles

```bash
# Crear un nuevo módulo
nest g module platos

# Crear un controller
nest g controller platos

# Crear un service
nest g service platos

# Crear todo el CRUD a la vez
nest g resource platos

# Iniciar en modo desarrollo
npm run start:dev

# Build para producción
npm run build

# Iniciar en producción
npm run start:prod
```

## 📝 Checklist de Integración

- [ ] Backend NestJS corriendo en puerto 8000
- [ ] CORS habilitado en `main.ts`
- [ ] Todos los controllers implementados
- [ ] DTOs con validación configurados
- [ ] Entities configuradas con TypeORM/Prisma
- [ ] Base de datos conectada
- [ ] `.env.local` configurado en frontend
- [ ] Frontend probando conexión con backend
- [ ] Manejo de errores implementado
- [ ] Documentación API (Swagger opcional)

## 🔍 Swagger (Opcional)

Para documentación automática de la API:

```bash
npm install @nestjs/swagger swagger-ui-express
```

```typescript
// main.ts
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Comedor API')
    .setDescription('API del sistema de gestión de comedor universitario')
    .setVersion('1.0')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // ... resto de configuración
}
```

Accede a la documentación en: `http://localhost:8000/api/docs`
