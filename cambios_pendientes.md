# Cambios Pendientes - LoveSync 💖 
*(Personalización del Santuario y Foto de Pareja)*

Este documento detalla los cambios locales implementados en la aplicación **LoveSync** que aún no han sido subidos a GitHub. Estas mejoras están enfocadas en enriquecer el **Santuario de Pareja**, ofreciendo una identidad visual compartida mediante una foto de perfil y nuevas opciones de personalización estética (fondos y marcos avanzados).

---

## 🚀 Resumen de Características Implementadas

### 1. Foto de Perfil Compartida (Avatar de Pareja)
Permite a las parejas subir una foto representativa que se muestra en el centro del Santuario y en las previsualizaciones de marcos.
* **Almacenamiento en Cloudflare R2:** Las imágenes se convierten a Base64 en el frontend, se envían al servidor y se almacenan de manera segura en Cloudflare R2.
* **Base de Datos:** Se añadió el campo `profile_avatar_url` a la tabla `couples`.
* **Frontend:** Se integró un control de subida de archivos (límite de 5MB) en el modal de personalización con previsualización inmediata.

### 2. Nuevos Temas de Fondo en el Santuario
Se expandió la galería de fondos visuales con dos nuevas opciones inmersivas:
* **Fondo Cósmico (Estático):** Un fondo espacial romántico (`cosmic_love.jpg`).
* **Flujo de Corazones (Animado):** Una combinación de degradado rosa/rojo con un fondo de corazones (`glowing_hearts.jpg`) animado mediante transiciones CSS (`@keyframes heartsMove`).

### 3. Soporte para Marcos basados en Imágenes (PNG Overlays)
Anteriormente, los marcos sobre el avatar de pareja solo soportaban estilos CSS nativos (como sombras y aureolas). Ahora se añade soporte para imágenes de superposición transparentes:
* **Nuevo Marco:** "Corazón Neón (Imagen)", el cual utiliza el recurso `cyber_frame.png` para superponer un marco de alta calidad sobre la foto de perfil.

---

## 📂 Desglose de Archivos Modificados

### 🖥️ Backend y Base de Datos

* **[supabase_schema.sql](file:///C:/Users/juanp/Documents/Ficheros/Repositorios%20Fullstack/lovesync/supabase_schema.sql)**
  * Se agregó la columna `profile_avatar_url VARCHAR(500) DEFAULT NULL` a la definición de la tabla `couples` para nuevos despliegues.

* **[backend/server.js](file:///C:/Users/juanp/Documents/Ficheros/Repositorios%20Fullstack/lovesync/backend/server.js)**
  * **Migración Automática al Iniciar:** Se actualizó la consulta de inicialización (`initDatabase` y `GET /api/profile`) para ejecutar un `ALTER TABLE couples ADD COLUMN IF NOT EXISTS profile_avatar_url...`, previniendo errores de base de datos en entornos existentes.
  * **Nuevo Endpoint de Subida:** Se creó la ruta `POST /api/profile/steam/avatar` que recibe la imagen en Base64, la procesa mediante `uploadToR2IfBase64` y guarda la URL pública en la base de datos para la pareja del usuario autenticado.
  * **Carga del Perfil:** Se modificó la consulta de `GET /api/profile` para recuperar y retornar `profile_avatar_url` al cliente.

---

### 🎨 Frontend y UI

* **[src/services/api.js](file:///C:/Users/juanp/Documents/Ficheros/Repositorios%20Fullstack/lovesync/src/services/api.js)**
  * Se agregó la función `updateCoupleAvatar(avatar)` al servicio de API para realizar la petición `POST` al nuevo endpoint del backend.

* **[src/views/HomeView.vue](file:///C:/Users/juanp/Documents/Ficheros/Repositorios%20Fullstack/lovesync/src/views/HomeView.vue)**
  * **Modal de Personalización:** Se diseñó la sección "Foto de Perfil Compartida" con un input de archivo oculto, botón de acción con estado de carga animado ("Subiendo...") y validación de tamaño de archivo (máximo 5MB).
  * **Renderizado de Avatar:** Se integró la etiqueta `<img>` para mostrar la foto subida en el perfil del Santuario y en las miniaturas de selección de marcos, manteniendo las iniciales como fallback por defecto.
  * **Soporte de Marcos PNG:** Se añadió la función reactiva `getFrameImageUrl(frameId)` para detectar si el marco seleccionado usa un archivo de imagen en lugar de CSS, aplicando la superposición absoluta correspondiente.
  * **Nuevos Temas y CSS:** Se agregaron los objetos para los temas `cosmic` y `animated`, el marco `neon_heart`, y la regla `@keyframes heartsMove` en la sección `<style>` para dar movimiento fluido al fondo animado.

---

### 🖼️ Nuevos Recursos y Archivos Sin Seguimiento (Untracked)

* **[cosmic_love.jpg](file:///C:/Users/juanp/Documents/Ficheros/Repositorios%20Fullstack/lovesync/public/backgrounds/cosmic_love.jpg)**: Imagen de fondo espacial para el tema Cósmico.
* **[glowing_hearts.jpg](file:///C:/Users/juanp/Documents/Ficheros/Repositorios%20Fullstack/lovesync/public/backgrounds/glowing_hearts.jpg)**: Imagen de corazones utilizada en el tema de corazones animados.
* **[cyber_frame.png](file:///C:/Users/juanp/Documents/Ficheros/Repositorios%20Fullstack/lovesync/public/frames/cyber_frame.png)**: Frame con transparencia de corazones de neón para el avatar de pareja.
