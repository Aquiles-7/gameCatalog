# GameCatalog

Aplicacion web para explorar un catalogo de juegos gratuitos, buscar y filtrar titulos, y guardar favoritos en una cuenta personal.

## Funcionalidades

- Consulta el catalogo de juegos mediante la API publica de [FreeToGame](https://www.freetogame.com/api).
- Filtra juegos por categoria y busca por titulo, genero, plataforma, desarrollador o descripcion. La busqueda ignora mayusculas y acentos.
- Registra usuarios y permite iniciar sesion con correo y contrasena o con Google, usando Firebase Authentication.
- Guarda y elimina juegos favoritos por usuario en Cloud Firestore.
- Permite actualizar el nombre visible y la contrasena desde el perfil.
- Protege la ruta del perfil para que solo usuarios autenticados puedan acceder.

## Tecnologias

- Angular 21 y TypeScript.
- Angular Router, Reactive Forms y HttpClient.
- AngularFire y Firebase Authentication/Cloud Firestore.
- RxJS para peticiones y flujos reactivos.
- Angular Material en los controles del formulario de registro.
- Vitest y jsdom para pruebas unitarias.
- Tailwind CSS y PostCSS estan incluidos como dependencias del proyecto.

## Estructura del proyecto

```text
src/
src/app/
src/app/components/          # Tarjeta de juego, busqueda y filtros
src/app/guards/               # Proteccion de rutas autenticadas
src/app/interface/            # Navegacion por pestanas
src/app/models/               # Interfaces de juego, usuario y wishlist
src/app/pages/                # Inicio, login, registro y perfil
src/app/services/             # API de juegos, autenticacion, perfil y favoritos
src/app/app.config.ts         # Proveedores de Angular y Firebase
src/app/app.routes.ts         # Rutas de la aplicacion
src/main.ts                   # Punto de entrada
src/styles.css                # Estilos globales
firestore.rules               # Reglas de acceso a Firestore
```

### Organizacion de la logica

- `GameService` solicita los juegos a FreeToGame y construye parametros para los filtros de API.
- La pagina de inicio mantiene la lista cargada y aplica localmente la busqueda por palabras.
- El componente de busqueda espera 250 ms tras la escritura antes de emitir el texto, evitando busquedas por cada tecla.
- `AuthService` encapsula el registro, acceso, acceso con Google, cierre de sesion y estado de autenticacion.
- `WishlistService` escucha la wishlist del usuario actual y agrega o elimina juegos en `wishlists/{uid}`.
- `ProfileService` obtiene al usuario y actualiza su nombre o contrasena.
- `AuthGuard` impide el acceso al perfil sin iniciar sesion.

## Requisitos

- Node.js y npm compatibles con Angular 21.
- Acceso a internet para consultar FreeToGame y Firebase.
- Un proyecto Firebase configurado con Authentication y Cloud Firestore habilitados. Para el acceso con Google, habilita tambien el proveedor de Google en Firebase Authentication.

La configuracion de Firebase usada por la aplicacion esta en `src/app/app.config.ts`. Las reglas de `firestore.rules` permiten leer y escribir cada wishlist unicamente al usuario autenticado cuyo UID coincide con el ID del documento.

## Instalacion y ejecucion

Instala las dependencias:

```bash
npm install
```

Inicia el servidor de desarrollo:

```bash
npm start
```

Abre `http://localhost:4200/`. El servidor recarga la aplicacion al detectar cambios en el codigo fuente.

## Comandos disponibles

```bash
npm start       # Servidor de desarrollo
npm run build   # Compilacion de produccion
npm test        # Pruebas unitarias con Vitest
npm run watch   # Compilacion de desarrollo en modo watch
```

La compilacion se genera en `dist/`. No hay un script de pruebas end-to-end configurado en `package.json`.
