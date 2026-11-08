# Catálogo de vinos: integración IBM i (RPG + DB2) con Node.js y Vue

Proyecto de aprendizaje que conecta una aplicación web moderna con la lógica de negocio de un IBM i real (servidor público [PUB400](https://pub400.com), IBM i 7.5).

```
Vue 3 + TypeScript  →  API REST (Node + Express)  →  Mapepire  →  Procedimiento SQL  →  Programa RPG  →  DB2 for i
```

Cada pedido que se hace desde la web llama a un programa **RPG** que actualiza el stock en **DB2 for i**.

## Estructura

| Carpeta | Contenido |
|---|---|
| `ibmi/` | Código del IBM i: tabla DB2, programas RPG y procedimiento almacenado |
| `catalogo-api/` | API REST con Node.js y Express, conectada a DB2 con Mapepire |
| `catalogo-web/` | Interfaz web con Vue 3 y TypeScript (Vite) |

## Parte IBM i (`ibmi/`)

- **`productos.sql`**: crea la tabla `PRODUCTOS` en DB2 for i, registra el programa RPG como procedimiento almacenado externo (`ACTUALIZAR_STOCK`) y genera JSON con `JSON_ARRAYAGG` / `JSON_OBJECT`.
- **`HOLA.RPGLE`**: primer programa en RPG de formato libre (`**FREE`).
- **`ACTSTOCK.SQLRPGLE`**: programa RPG con SQL embebido que actualiza el stock y controla los errores mediante `SQLSTATE`.

Desarrollado con VS Code (Code for IBM i y Db2 for IBM i), compilado con `CRTBNDRPG` / `CRTSQLRPGI` y verificado desde la pantalla 5250 con `DSPJOBLOG` y `RUNSQL`.

## API (`catalogo-api/`)

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/productos?tipo=Tinto` | Lista los productos (filtro opcional por tipo) |
| GET | `/api/productos/:id` | Devuelve un producto (404 si no existe) |
| POST | `/api/pedidos` | Valida el pedido y llama al procedimiento RPG (201 / 400 / 404 / 409) |

- Consultas parametrizadas, para evitar la inyección SQL.
- Credenciales en variables de entorno, nunca en el código.
- Control de errores con respuesta 500.

```powershell
cd catalogo-api
npm install
$env:IBMI_PASSWORD = '********'
node server.js
```

## Web (`catalogo-web/`)

Catálogo con buscador reactivo (`ref`, `computed`, `v-model`), pedidos contra la API y botón desactivado cuando no hay stock.

```powershell
cd catalogo-web
npm install
npm run dev
```

## Próximos pasos

- Autenticación (JWT) y permisos por rol.
- Comprobación de stock y actualización atómicas dentro del propio procedimiento, con control de compromiso.
- Despliegue con Docker y Nginx como proxy inverso con TLS.
- Tests automatizados de la API.

---
Rafael López · [Portfolio](https://rafalopezzz.github.io/web-site) · [LinkedIn](https://www.linkedin.com/in/rafalopezzz/)
