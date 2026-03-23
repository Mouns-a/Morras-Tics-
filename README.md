# 💜 Morras TICs - Plataforma Web

Sitio web interactivo desarrollado para el club **Morras TICs**, donde se pueden gestionar y visualizar:

- 📢 Avisos
- 📰 Noticias
- 🧠 Artículos

Todo con una interfaz moderna, dinámica y estilo futurista ✨


## 🚀 Tecnologías utilizadas

- HTML5
- CSS3 (Glassmorphism + efectos visuales)
- JavaScript (Vanilla)
- LocalStorage (simulación de base de datos)

## 🧠 Funcionalidades principales

### 📢 Avisos
- Crear avisos desde panel admin
- Filtros por categoría
- Buscador en tiempo real
- Contador regresivo ⏳
- Etiquetas: urgente 🔥 y destacado ⭐

---

### 📰 Noticias
- Publicación con imagen
- Vista tipo cards
- Eliminación desde admin
- Orden automático por fecha

---

### 🧠 Artículos
- Sistema tipo blog
- Likes ❤️ en tiempo real
- Comentarios 💬
- Estadísticas dinámicas
- Tiempo relativo (ej: "hace 2 horas")

---

## 🔐 Panel de administración

Incluye paneles independientes para:

- Admin Avisos
- Admin Noticias
- Admin Artículos

Permite:
- Crear
- Editar
- Eliminar contenido

---

## ⚠️ Importante

Este proyecto utiliza **localStorage**, por lo que:

- Los datos NO se comparten entre usuarios
- Cada navegador guarda su propia información
- No es una base de datos real (por ahora)

## 1. El Motor de Datos: `LocalStorage` + `JSON`
Tu aplicación no usa una base de datos externa (como MySQL o MongoDB). En su lugar, utiliza el **LocalStorage** del navegador.

* **¿Cómo funciona?**: Los datos se guardan como un *string* gigante. Cuando la página carga, usamos `JSON.parse()` para convertir ese string en un **Array de Objetos** de JavaScript con el que podemos trabajar.
* **Persistencia**: Si cierras el navegador y vuelves a entrar, los artículos, noticias y likes siguen ahí porque están grabados en el disco duro del usuario.


## 2. Los Módulos de Administración (CRUD)
Cada archivo `admin.js` (noticias, avisos, artículos) cumple con las 4 funciones básicas de un sistema de gestión: **C**reate, **R**ead, **U**pdate, **D**elete.

### A. Función `guardar()` y el uso de `FileReader`
Esta es la función más compleja. Permite subir imágenes sin tener un servidor.
1.  **Captura**: Detecta el archivo en el `input type="file"`.
2.  **Conversión**: Usa `reader.readAsDataURL(file)` para transformar la imagen en una cadena **Base64** (un texto muy largo que representa los píxeles).
3.  **Almacenamiento**: Guarda ese texto en el objeto del artículo.
4.  **Render**: Al mostrar la noticia, el navegador lee ese texto y lo vuelve a dibujar como imagen.

### B. Función `render()`
Es el corazón visual. Limpia el contenedor (`innerHTML = ""`) y recorre el Array de datos con un `.forEach()`. Por cada elemento, crea una "Card" de HTML dinámicamente.
* **Reverse Rendering**: Usas `[...datos].reverse()` para que lo último que publicaste aparezca primero (orden cronológico inverso).

### C. Función `editar(index)` y `eliminar(index)`
* **Eliminar**: Usa `.splice(index, 1)` para quitar el elemento del array y luego vuelve a llamar a `render()` para actualizar la pantalla.
* **Editar**: Es un truco inteligente. Toma los datos del objeto, los "regresa" a los campos del formulario para que los cambies y, al dar click en "Guardar", sobrescribe la posición original.

---

## 3. Lógica de Interacción Social (Artículos)

### El Sistema de Likes
```javascript
window.like = function(index) {
  articulos[index].likes++; // Aumenta el contador en la memoria
  guardar(); // Lo graba en LocalStorage
  render(articulos); // Actualiza la vista
}
```
* **Animación**: Se dispara una clase CSS `.liked` que escala el corazón un 20% y cambia el color a magenta por unos milisegundos para dar "feedback" al usuario.

### Sistema de Comentarios
Cada artículo tiene un array interno llamado `comentarios`. La función `comentar()` captura el nombre y el texto, los añade al array del artículo específico y vuelve a renderizar solo los comentarios de ese bloque.



---

## 4. Efectos Visuales y Experiencia de Usuario (UX)

### El Fondo de Circuitos (Canvas API)
En tu `global.js` (o index), usas el elemento `<canvas>`. JavaScript dibuja líneas y puntos que se mueven.
* **Cálculo de Distancia**: El código mide la distancia entre puntos. Si están cerca, dibuja una línea. Esto crea la sensación de una "Red Neuronal" o un sistema de ciberseguridad activo.

### El Cursor de Luz (Smoothing)
No es un simple cursor. Sigue al mouse con un ligero retraso (interpolación lineal) para que se sienta suave.
* **CSS Blend Mode**: Usa `mix-blend-mode: screen`, lo que hace que los colores del cursor se sumen a los del fondo, creando un efecto de brillo neón real.

---

## 5. El Sistema de Avisos y Urgencia

### Filtros en Tiempo Real
La función `filtrar(categoria)` usa el método `.filter()` de JavaScript. Crea una copia temporal de los avisos que coinciden con la categoría (ej: "Talleres") y se los pasa a la función `render()`.

### Badges de Urgencia
```javascript
${aviso.urgente ? '<span class="badge urgente">URGENTE</span>' : ''}
```
Es un **Operador Ternario**. Si el administrador marcó la casilla "Urgente", el HTML inyecta automáticamente una clase CSS que tiene una animación de "Pulso" neón rojo.

---

## 6. Seguridad (Login Simple)
Has incluido un `prompt("Acceso restringido")`.
* **Lógica**: Compara la entrada del usuario con la variable fija (`morras123`). Si no coincide, usa `document.body.innerHTML` para borrar toda la página y mostrar un mensaje de error, impidiendo que se carguen los scripts de administración.
Enlaces y Rutas

* **Estilos**: Cada página HTML llama primero a `global.css` (colores y cursor) y luego a su CSS específico (noticias, avisos, etc.).
* **Scripts**: Los archivos de administración están separados de los públicos para que el código sea más ligero y fácil de depurar.
