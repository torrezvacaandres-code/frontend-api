# Manual de Usuario - Sistema de Comedor Universitario

Este documento describe las funcionalidades disponibles para los roles de **Personal del Comedor** y **Estudiante** en el sistema.

---

## 1. Rol: Personal del Comedor

El personal del comedor tiene acceso a herramientas para la gestión diaria del servicio, control de inventario básico y punto de venta.

### 1.1. Acceso

Al iniciar sesión como **Personal del Comedor**, serás dirigido al **Panel Principal**.

### 1.2. Dashboard (Panel Principal)

Esta es la vista por defecto. Aquí puedes ver un resumen operativo del día:

- **Tarjetas de Estado:**
  - **Estudiantes hoy:** Número total de reservas para el día actual.
  - **Reservas confirmadas:** Cantidad de reservas que ya han sido confirmadas.
  - **Menús disponibles:** Cantidad de tipos de menús ofertados.
  - **Insumos críticos:** Alerta de productos con stock bajo o próximos a vencer.
- **Horario de hoy:** Muestra las actividades programadas (ej. "Servicio principal") y el conteo de reservas esperadas.
- **Estado de insumos:** Lista rápida de insumos con su estado de vida útil (Crítico, Bajo, Suficiente).
- **Ventas recientes:** Tabla con las últimas transacciones, mostrando el estudiante, menú, hora y estado.

### 1.3. Punto de Venta (POS)

Utiliza esta sección para registrar ventas en el momento (por ejemplo, para estudiantes sin reserva previa o compras adicionales).

1.  **Navegación:** Haz clic en la pestaña **"Punto de Venta"** en la barra superior.
2.  **Seleccionar Menú:**
    - Verás una lista de los menús disponibles para la semana.
    - Haz clic en un menú para ver sus platos.
3.  **Seleccionar Platos:**
    - Aparecerán los platos correspondientes al menú seleccionado.
    - Verás el precio y las raciones disponibles.
    - Haz clic en **"Agregar al carrito"** para añadir un ítem. Si no hay stock, el botón estará deshabilitado.
4.  **Carrito de Compras:**
    - A la derecha verás el resumen de tu pedido.
    - Puedes aumentar la cantidad de un ítem o eliminarlo (botón "X").
    - Verás el **Subtotal** y **Total** a pagar.
    - **Completar venta:** Finaliza la transacción.
    - **Limpiar carrito:** Borra todos los ítems seleccionados.

### 1.4. Ventas

Consulta el historial de transacciones.

1.  **Navegación:** Haz clic en la pestaña **"Ventas"** en la barra superior.
2.  **Tabla de Registros:**
    - Muestra ID, Cliente, Monto, Estado (Aprobado, Pendiente) y Fecha.
    - Usa el botón **"Ver detalles"** para más información sobre una venta específica.

---

## 2. Rol: Estudiante

Los estudiantes pueden gestionar su alimentación, reservar menús y consultar su historial.

### 2.1. Acceso

Al iniciar sesión como **Estudiante**, accederás a tu portal personal.

### 2.2. Menús Disponibles

Esta es la vista principal donde puedes planificar tus comidas.

- **Visualización:** Verás tarjetas con los menús de la semana (Lunes, Martes, etc.).
- **Detalles del Menú:** Cada tarjeta muestra:
  - Día y fecha.
  - Tipo de comida (ej. Almuerzo).
  - Lista de platos incluidos.
  - Precio total.
- **Reservar:** Haz clic en el botón **"Reservar"** en la tarjeta del menú deseado para asegurar tu comida.

### 2.3. Mis Reservas

Consulta el estado de tus solicitudes de comida.

1.  **Navegación:** Haz clic en la pestaña **"Mis reservas"**.
2.  **Listado:** Tabla con tu historial de reservas.
    - **Fecha:** Día para el cual es la reserva.
    - **Menú:** Descripción del menú reservado.
    - **Estado:**
      - <span style="color:green">CONFIRMADA</span>: Tu reserva está lista.
      - <span style="color:orange">PENDIENTE</span>: Esperando confirmación o pago.
      - <span style="color:red">CANCELADA</span>: La reserva fue anulada.

### 2.4. Mis Pagos

Lleva un control de tus gastos en el comedor.

1.  **Navegación:** Haz clic en la pestaña **"Mis pagos"**.
2.  **Historial:** Lista de tarjetas con tus pagos realizados.
    - Monto pagado.
    - Fecha de la transacción.
    - Estado del pago (Aprobado, Pendiente).
