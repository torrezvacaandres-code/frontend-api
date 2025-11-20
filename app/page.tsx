import Link from 'next/link'
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Brain,
  CalendarCheck,
  ClipboardList,
  Coins,
  Gauge,
  Layers,
  LayoutDashboard,
  ShieldCheck,
  Sparkles,
  Truck,
  Users,
  UtensilsCrossed,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

const metrics = [
  {
    label: 'Cobertura operativa',
    value: '3 roles · 8 módulos',
    detail: 'Administra catálogos, operación diaria y analítica en un solo panel.',
    icon: LayoutDashboard,
  },
  {
    label: 'Decisiones informadas',
    value: 'BI en vivo',
    detail:
      'Dashboards con ventas, raciones servidas, costos e indicadores de becas.',
    icon: BarChart3,
  },
  {
    label: 'Experiencia estudiante',
    value: 'Reservas en minutos',
    detail: 'Menús visibles, reservas confirmadas y pagos en línea.',
    icon: CalendarCheck,
  },
  {
    label: 'Operación confiable',
    value: 'Inventario y compras',
    detail: 'Control de insumos, proveedores y rotación para evitar quiebres.',
    icon: Truck,
  },
]

const pillars = [
  {
    title: 'Operación diaria sin fricción',
    description:
      'Planes de menú, reservas, confirmaciones y control de comedor en tiempo real.',
    icon: UtensilsCrossed,
  },
  {
    title: 'Inventario y abastecimiento',
    description:
      'Insumos, compras y proveedores conectados para asegurar stock y costos saludables.',
    icon: ClipboardList,
  },
  {
    title: 'Finanzas y becas',
    description:
      'Pagos, becas y seguimiento de asistencia con trazabilidad completa.',
    icon: Coins,
  },
  {
    title: 'Business Intelligence integrado',
    description:
      'Recharts + react-query para métricas listas con filtros y KPIs accionables.',
    icon: Brain,
  },
]

const modules = [
  {
    title: 'Menús y platos',
    description: 'Define platos, menús diarios/semanales y visibilidad por rol.',
    icon: Layers,
  },
  {
    title: 'Reservas',
    description: 'Reserva, confirma, cancela y controla asistencia por usuario.',
    icon: CalendarCheck,
  },
  {
    title: 'Pagos y becas',
    description:
      'Registra pagos, aplica becas alimentarias y controla beneficios activos.',
    icon: ShieldCheck,
  },
  {
    title: 'Insumos e inventario',
    description:
      'Stock, rotación de insumos y alertas de bajo inventario listos para operar.',
    icon: Gauge,
  },
  {
    title: 'Compras y proveedores',
    description:
      'Órdenes de compra y trazabilidad de proveedores para abastecimiento continuo.',
    icon: Truck,
  },
  {
    title: 'BI de operación',
    description:
      'Visualiza ingresos, raciones, costos y asistencia de becados en dashboards listos.',
    icon: BarChart3,
  },
]

const roles = [
  {
    name: 'Administración',
    description:
      'Configura catálogos, becas, costos y supervisa indicadores estratégicos.',
    icon: LayoutDashboard,
    cta: '/admin',
    actions: ['Platos, menús, proveedores', 'Pagos y becas', 'KPIs centralizados'],
  },
  {
    name: 'Equipo de comedor',
    description:
      'Opera reservas, confirma asistencia y gestiona insumos día a día.',
    icon: Users,
    cta: '/staff',
    actions: ['Reservas y servicio diario', 'Recepción de insumos', 'Alertas de stock'],
  },
  {
    name: 'Estudiantes',
    description: 'Consulta menús, reserva en minutos y paga desde el mismo portal.',
    icon: BookOpen,
    cta: '/student',
    actions: ['Ver menú semanal', 'Reservar y pagar', 'Historial y becas'],
  },
]

const highlights = [
  { title: 'Interfaz moderna', detail: 'Experiencia web clara y rápida, pensada para equipos operativos.', icon: Sparkles },
  { title: 'Flujos multirol', detail: 'Accesos separados para administración, staff y estudiantes.', icon: ShieldCheck },
  { title: 'Datos en vivo', detail: 'Dashboards con métricas listas para tomar decisiones diarias.', icon: BarChart3 },
  { title: 'Control total', detail: 'Trazabilidad de reservas, pagos, becas e insumos en un solo lugar.', icon: Gauge },
  { title: 'Operación confiable', detail: 'Alertas, estados y componentes listos para la operación diaria.', icon: ClipboardList },
]

const steps = [
  {
    title: 'Activa los roles',
    description: 'Administra quién ve y opera cada módulo: administración, staff y estudiantes.',
  },
  {
    title: 'Carga tu catálogo',
    description: 'Platos, menús, insumos, proveedores y becas listos para publicar.',
  },
  {
    title: 'Abre reservas y cobros',
    description: 'Define horarios, cupos, precios y confirma asistencia en vivo.',
  },
  {
    title: 'Mide y mejora',
    description: 'Revisa KPIs diarios de ingresos, raciones, costos y becas para optimizar.',
  },
]

export default function Home() {
  return (
    <div className="relative overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 blur-3xl">
        <div className="absolute left-10 top-10 h-40 w-40 rounded-full bg-primary/15" />
        <div className="absolute right-0 top-32 h-56 w-56 rounded-full bg-chart-2/10" />
        <div className="absolute bottom-0 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-chart-3/10" />
      </div>

      <div className="relative mx-auto flex max-w-6xl flex-col gap-16 px-6 pb-20 pt-12">
        <header className="space-y-10 pt-6">
          <div className="flex items-center justify-between">
            <div className="font-semibold">Sistema de Gestión de Comedor</div>
            <Button asChild size="sm" variant="outline" className="gap-2">
              <Link href="/iniciar">
                Iniciar
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="inline-flex items-center gap-3 rounded-full border bg-white/70 px-4 py-2 text-sm text-foreground shadow-sm backdrop-blur dark:bg-white/5">
            <Badge variant="secondary" className="bg-foreground text-background">
              Nuevo
            </Badge>
            <span className="text-muted-foreground">
              Suite completa para comedores universitarios
            </span>
          </div>

          <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-6">
              <h1 className="text-balance text-4xl font-semibold leading-[1.1] sm:text-5xl">
                Control operativo, reservas y BI para tu comedor universitario en un solo lugar
              </h1>
              <p className="text-pretty text-lg text-muted-foreground">
                Gestiona menús, insumos, pagos y becas con roles claros para administración,
                personal y estudiantes. Todo en una experiencia web que une operación y analítica
                en tiempo real.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg" className="gap-2">
                  <Link href="/dashboard">
                    Ver dashboard BI
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="gap-2">
                  <Link href="/iniciar">
                    Entrar según rol
                    <Users className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="ghost" className="gap-2">
                  <Link href="#modules">
                    Explorar módulos
                    <UtensilsCrossed className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-2 rounded-full bg-muted px-4 py-2">
                  <ShieldCheck className="h-4 w-4" />
                  Roles: Admin, Staff, Estudiante
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-muted px-4 py-2">
                  <BarChart3 className="h-4 w-4" />
                  Dashboards listos
                </span>
              </div>
            </div>

            <Card className="border-foreground/10 bg-gradient-to-br from-primary/5 via-card to-card shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-primary/10 p-3">
                    <BarChart3 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      Visión Ejecutiva
                    </p>
                    <CardTitle className="text-lg">Indicadores clave</CardTitle>
                  </div>
                </div>
                <CardDescription>
                  Ejemplo de métricas listas para los equipos directivos y operativos.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Ingresos últimos 30 días', value: '$48.2k' },
                  { label: 'Raciones servidas', value: '12.4k' },
                  { label: 'Costo promedio insumo', value: '$1.82' },
                  { label: 'Asistencia becados', value: '3.1k' },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-xl border bg-background/80 p-4 shadow-sm"
                  >
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      {item.label}
                    </p>
                    <p className="mt-2 text-2xl font-semibold">{item.value}</p>
                  </div>
                ))}
                <div className="col-span-2 rounded-xl border bg-background/80 p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Menús confirmados hoy</p>
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-50">
                      +12% vs ayer
                    </span>
                  </div>
                  <div className="mt-3 h-2 w-full rounded-full bg-muted">
                    <div className="h-2 w-[68%] rounded-full bg-primary" />
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Reservas confirmadas / Capacidad total
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </header>

        <section className="grid gap-4 rounded-3xl border bg-card/60 p-6 shadow-sm backdrop-blur sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((item) => (
            <div key={item.label} className="flex gap-3">
              <div className="mt-1 rounded-lg bg-primary/10 p-2">
                <item.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  {item.label}
                </p>
                <p className="text-lg font-semibold">{item.value}</p>
                <p className="text-sm text-muted-foreground">{item.detail}</p>
              </div>
            </div>
          ))}
        </section>

        <section className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-semibold">Lo que resuelve</h2>
              <p className="text-muted-foreground">
                Unificar operación, pagos y analítica en una sola experiencia.
              </p>
            </div>
            <Badge className="bg-primary/10 text-primary">Listo para producción</Badge>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {pillars.map((item) => (
              <Card key={item.title}>
                <CardHeader className="flex flex-row items-start gap-3">
                  <div className="rounded-lg bg-muted p-3">
                    <item.icon className="h-5 w-5 text-foreground" />
                  </div>
                  <div className="space-y-1.5">
                    <CardTitle>{item.title}</CardTitle>
                    <CardDescription>{item.description}</CardDescription>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        <section id="modules" className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-semibold">Módulos incluidos</h2>
              <p className="text-muted-foreground">
                Cada módulo está diseñado para operar de inmediato y mantener la experiencia consistente.
              </p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {modules.map((item) => (
              <Card key={item.title} className="h-full">
                <CardHeader className="flex flex-row items-start gap-3">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="space-y-1.5">
                    <CardTitle>{item.title}</CardTitle>
                    <CardDescription>{item.description}</CardDescription>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        <section id="roles" className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-semibold">Experiencia por rol</h2>
              <p className="text-muted-foreground">
                Accesos separados para administración, operación y estudiantes.
              </p>
            </div>
            <Badge className="bg-primary/10 text-primary">Roles activos</Badge>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {roles.map((role) => (
              <Card key={role.name} className="flex h-full flex-col">
                <CardHeader className="flex flex-row items-start gap-3">
                  <div className="rounded-lg bg-muted p-3">
                    <role.icon className="h-5 w-5 text-foreground" />
                  </div>
                  <div className="space-y-1.5">
                    <CardTitle>{role.name}</CardTitle>
                    <CardDescription>{role.description}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col justify-between gap-4">
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {role.actions.map((action) => (
                      <li key={action} className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                  <Button asChild variant="outline" className="w-full">
                    <Link href={role.cta}>Entrar como {role.name}</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="grid gap-6 rounded-3xl border bg-card/70 p-8 shadow-sm backdrop-blur lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            <h2 className="text-3xl font-semibold">Experiencia del producto</h2>
            <p className="text-muted-foreground">
              Diseño centrado en equipos de comedor: flujos ágiles, datos claros y estados listos para operar.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {highlights.map((item) => (
                <div
                  key={item.title}
                  className="flex items-start gap-3 rounded-xl border bg-background/80 p-4"
                >
                  <div className="rounded-lg bg-primary/10 p-2">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">{item.title}</p>
                    <p className="text-sm text-muted-foreground">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-4 rounded-2xl border bg-gradient-to-br from-primary/5 via-card to-card p-6 shadow-inner">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <BarChart3 className="h-4 w-4" />
              Flujo de adopción
            </div>
            <div className="relative ml-2 border-l border-dashed border-muted pl-5">
              {steps.map((step, index) => (
                <div key={step.title} className="relative pb-6 last:pb-0">
                  <div className="absolute -left-[9px] top-1 h-4 w-4 rounded-full border-2 border-background bg-primary shadow" />
                  <p className="text-sm font-semibold text-foreground">
                    Paso {index + 1}. {step.title}
                  </p>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-3xl border bg-gradient-to-r from-primary/90 via-primary to-primary/80 px-8 py-10 text-background shadow-lg">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              <p className="text-sm uppercase tracking-wide text-primary-foreground/80">
                Listo para operar
              </p>
              <h3 className="text-3xl font-semibold">
                Activa tu equipo, publica el menú y empieza a servir hoy mismo.
              </h3>
              <p className="text-primary-foreground/80">
                Roles separados, módulos completos y dashboards en un solo despliegue.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" variant="secondary" className="gap-2 text-primary">
                <Link href="/iniciar">
                  Iniciar ahora
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="ghost" className="gap-2 text-background">
                <Link href="/dashboard">
                  Ver analítica
                  <BarChart3 className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section
          id="contacto"
          className="rounded-3xl border bg-card/70 px-8 py-10 shadow-sm backdrop-blur"
        >
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-3">
              <p className="text-sm uppercase tracking-wide text-muted-foreground">
                Contáctanos
              </p>
              <h3 className="text-3xl font-semibold">
                ¿Listo para llevar tu comedor al siguiente nivel?
              </h3>
              <p className="text-muted-foreground">
                Cuéntanos sobre tu operación y lo que necesitas. Responderemos con una propuesta
                ajustada a tus roles, módulos y objetivos.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Button asChild size="lg" variant="outline" className="gap-2">
                  <Link href="/iniciar">
                    Ver roles y entrar
                    <Users className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Envíanos tus datos</CardTitle>
                <CardDescription>
                  Completa el formulario y te contactamos con la información que necesitas.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="nombre">Nombre</Label>
                    <Input id="nombre" name="nombre" placeholder="Tu nombre" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="apellido">Apellido</Label>
                    <Input id="apellido" name="apellido" placeholder="Tu apellido" />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="correo">Correo</Label>
                    <Input id="correo" name="correo" type="email" placeholder="tu@email.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="telefono">Teléfono</Label>
                    <Input id="telefono" name="telefono" type="tel" placeholder="+54 11 1234 5678" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="direccion">Dirección (opcional)</Label>
                  <Input id="direccion" name="direccion" placeholder="Calle, número, ciudad" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mensaje">Mensaje</Label>
                  <Textarea
                    id="mensaje"
                    name="mensaje"
                    placeholder="Cuéntanos sobre tu comedor, cantidad de usuarios, objetivos..."
                    rows={4}
                  />
                </div>
                <Button className="w-full gap-2">
                  Enviar mensaje
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  )
}
