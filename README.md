# PLH Robotics — Instrucciones de estructura

## Cómo abrir el proyecto en VS Code

1. Abre VS Code
2. File → Open Folder → selecciona la carpeta `plhrobotics`
3. Instala la extensión **Live Server** (de Ritwick Dey) si no la tienes
4. Clic derecho en `index.html` → "Open with Live Server"

---

## Estructura de carpetas

```
plhrobotics/
│
├── index.html                  ← Página principal
│
├── css/
│   ├── style.css               ← Estilos de la página principal
│   └── project.css             ← Estilos de las páginas de proyectos
│
├── js/
│   ├── main.js                 ← JavaScript de la página principal
│   └── project.js              ← JavaScript de páginas de proyectos
│
├── images/                     ← Aquí van TODAS tus imágenes
│   ├── edgar.jpg               ← Tu foto para la sección "Sobre mí"
│   ├── jerr1-cover.jpg         ← Imagen principal del robot sumo
│   ├── jerr1-1.jpg             ← Fotos para la galería de JERR-1
│   ├── jerr1-2.jpg
│   └── ...
│
└── projects/                   ← Una página HTML por proyecto
    ├── robot-sumo-jerr1.html   ← Ya creada con toda la estructura
    ├── robot-cartesiano.html   ← Copia robot-sumo-jerr1.html y edita
    ├── brazo-robotico.html
    └── ...
```

---

## Cómo agregar un nuevo proyecto

1. Copia el archivo `projects/robot-sumo-jerr1.html`
2. Renómbralo con el nombre de tu nuevo proyecto (ej. `projects/brazo-robotico.html`)
3. Edita el contenido: título, descripción, materiales, specs, link de Cults3D
4. En `index.html`, agrega una nueva tarjeta dentro del `<div id="projects-grid">`:

```html
<a href="projects/tu-proyecto.html" class="project-card">
  <div class="card-image-placeholder">🦾</div>
  <!-- O usa una imagen real: -->
  <!-- <img class="card-image" src="images/tu-proyecto.jpg" alt="Nombre proyecto"> -->
  <div class="card-body">
    <div class="card-tags">
      <span class="tag">Tu Categoría</span>
    </div>
    <div class="card-title">Nombre del proyecto</div>
    <div class="card-desc">Descripción corta de 1-2 líneas.</div>
    <div class="card-footer">
      <span class="card-date">2025</span>
      <span class="card-arrow">→</span>
    </div>
  </div>
</a>
```

5. Si quieres que la tarjeta esté oculta por defecto (aparece al hacer "Ver más"),
   agrega la clase `hidden` a la tarjeta:
   ```html
   <a href="..." class="project-card hidden">
   ```

---

## Cómo reemplazar los placeholders con contenido real

### Tu foto (sección Sobre mí):
En `index.html`, busca el comentario `<!-- Reemplaza con: -->` y cambia:
```html
<div class="about-image-placeholder">👤</div>
```
por:
```html
<img class="about-image" src="images/edgar.jpg" alt="Edgar — PLH Robotics">
```

### Imágenes de proyecto:
En cada página de proyecto, busca los comentarios `<!-- Reemplaza los placeholders con: -->` y agrega tus imágenes reales.

### Links de Cults3D:
Busca `https://cults3d.com/plhrobotics/jerr1` en el HTML y reemplaza con tu link real.

### Redes sociales y correo:
En `index.html`, sección contacto, actualiza los links de TikTok, YouTube, Instagram y el correo.

---

## Cómo publicar la página (hosting gratuito)

Opciones recomendadas:

- **GitHub Pages** (gratis, dominio personalizado disponible):
  1. Sube la carpeta a un repositorio en GitHub
  2. Settings → Pages → Branch: main → Save
  3. Tu página estará en `tuusuario.github.io/plhrobotics`

- **Netlify** (gratis, muy fácil):
  1. Ve a netlify.com → "Deploy from Git" o arrastra la carpeta
  2. Conecta con tu dominio `plhrobotics.com` en los DNS settings

- **Vercel** (gratis):
  Similar a Netlify, muy rápido de configurar.

---

## Formulario de contacto (backend)

El formulario de "Solicitar proyecto" actualmente muestra un mensaje de éxito
pero NO envía correos reales. Para activarlo con envío real, opciones gratuitas:

- **Formspree** (más fácil): Crea cuenta en formspree.io, obtienes un endpoint,
  cambia el `action` del form.
- **EmailJS**: Envía correos directo desde JS, sin backend.
- **Web3Forms**: Igual que Formspree pero más generoso en plan gratuito.

---

*Cualquier duda, revisa los comentarios en el código HTML y CSS — están en español.*
