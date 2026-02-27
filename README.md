# 🏗️ Reto Técnico IDBI

Proyecto de inventario con arquitectura separada en Backend (Laravel) y Frontend (React).

---

## 🛠️ Tecnologías utilizadas

| Capa | Tecnología |
|------|-----------|
| Backend | PHP 8.2, Laravel |
| Frontend | React |
| Base de datos | MySQL 8.0 |
| Contenedores | Docker, Docker Compose |

---

## 🚀 Instalación y ejecución


### 🐳 Opción 1: Con Docker (recomendado)

**1. Clonar el repositorio**
```bash
git clone 
cd retoTecnico-idbi
```

**2. Levantar los contenedores**
```bash
docker-compose up -d
```

**3. Realizar los siguientes comandos para el backend en Docker**
```bash
docker exec inventory_backend cp .env.example .env
docker exec inventory_backend php artisan key:generate
docker exec inventory_backend php artisan migrate
```

✅ Con solo estos pasos el proyecto estará disponible en:
- **Backend:** http://localhost:8000
- **Frontend:** http://localhost:5173


### 💻 Opción 2: Local (sin Docker)

**Requisitos:**
- PHP 8.2+
- Composer
- Node.js 18+
- MySQL 8.0

**Backend:**
```bash
cd backend
cp .env.example .env
composer install
php artisan key:generate
php artisan migrate
php artisan serve
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

> Asegúrate de configurar las variables de base de datos en `backend/.env` apuntando a tu MySQL local.
---

## ⚙️ Decisiones técnicas

### Backend

**Repository Pattern**
Se implementó una capa de repositorios para desacoplar la lógica de negocio del ORM (Eloquent). Esto permite cambiar la fuente de datos sin afectar los servicios ni los controladores, y facilita el testing unitario.

**Services**
La lógica de negocio se encapsuló en clases de servicio, manteniendo los controladores delgados y con una única responsabilidad: recibir la petición y delegar al servicio correspondiente.

**Events, Listeners y Observers**
Para la actualización de stock se utilizaron eventos y listeners, desacoplando el efecto secundario del flujo principal. Los observers reaccionan automáticamente a cambios en los modelos sin necesidad de lógica explícita en los controladores, siguiendo el principio de responsabilidad única.

**Autenticación**
Se utilizó Laravel Sanctum para la autenticación mediante tokens, apropiado para APIs consumidas por SPAs.

---

### Frontend

**Context API (AuthContext)**
Se utilizó Context API de React para el manejo del estado global de autenticación (usuario, token, login, logout), evitando el uso de librerías externas como Redux para un caso de uso acotado.

**Custom Hooks**
La lógica de estado y efectos se encapsuló en hooks personalizados, separándola de los componentes visuales para mejorar la reutilización y legibilidad.

**Centralización de llamadas HTTP**
Todas las llamadas a la API se concentraron en la carpeta `api/`, usando Axios con interceptores para adjuntar automáticamente el token de autenticación en cada petición.

**TypeScript**
Se usó TypeScript para tipar los modelos del dominio (User, tipos de credenciales, respuestas de la API), reduciendo errores en tiempo de desarrollo.

**Separación por componentes y páginas**
Se separaron los componentes reutilizables (UI genérica) de las páginas (vistas completas), siguiendo una estructura escalable.

---


## 🔄 Flujo del sistema

```
Usuario → Frontend (React :5173)
              ↓ Axios
        API REST (Laravel :8000)
              ↓
        Base de datos (MySQL :3306)
```

### 🔐 Flujo de autenticación (Login / Registro)
1. El usuario llena el formulario en React con sus credenciales
2. React valida los campos en el frontend antes de enviar
3. Axios envía la petición a `/api/login` o `/api/register`
4. Laravel valida, crea el usuario y devuelve un token (Sanctum)
5. El token se almacena en el **AuthContext** y se adjunta automáticamente en todas las peticiones siguientes

### 📦 Flujo de gestión de productos
1. Al ingresar a la vista de productos, Axios consulta `/api/products`
2. El backend devuelve el listado con el stock actual de cada producto
3. El usuario puede crear o editar un producto mediante formularios
4. Los cambios se persisten vía POST/PUT y la lista se actualiza en pantalla
5. El usuario puede eliminar un producto con el botón eliminar, se carga una alerta y decide si desea o no eliminarlo.

### 🔁 Flujo de registro de movimiento (entrada/salida)
1. El usuario selecciona un producto, tipo (entrada/salida), cantidad y motivo
2. Axios envía el movimiento a `/api/movements`
3. El controlador delega al **Service** correspondiente
4. El Service usa el **Repository** para persistir el movimiento
5. Se dispara un **Event** de movimiento registrado
6. El **Listener** captura el evento y actualiza automáticamente el stock del producto
7. El frontend refleja el nuevo stock sin necesidad de recargar la página

### 📋 Flujo de listado de movimientos
1. El usuario accede a la vista de movimientos con filtros opcionales (tipo, rango de fechas)
2. Axios envía los filtros como parámetros a `/api/movements`
3. El backend filtra y devuelve los movimientos paginados
4. El usuario puede exportar el reporte con el botón de exportar
5. El frontend consulta a `/api/movements/export` y le envía los parámetros necesarios.
6. El backend devuelve el excel para que el frontend lo procese y proceda descargarlo.
7. El frontend realizar la descarga del archivo excel.