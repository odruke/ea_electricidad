# Documentación de aprendizaje

Lecciones que explican cómo y por qué funciona el código del proyecto. Cada documento indica en su cabecera qué cambios cubre.

- [001 · Los archivos de configuración ocultos del repositorio](001-dotfiles-del-repositorio.md): qué hacen `.gitignore`, `.dockerignore`, `.nvmrc`, `.prettierrc.json` y `.prettierignore`, y por qué el proyecto no es reproducible sin ellos.
- [002 · Astro y el sitio estático](002-astro-y-el-sitio-estatico.md): qué es un sitio estático, cómo se escriben los componentes `.astro`, el layout común y los estilos con Tailwind 4.
- [003 · Rutas e idiomas (i18n)](003-rutas-e-idiomas.md): cómo un archivo genera una página por idioma, los diccionarios tipados, el selector de idioma y las 404 localizadas.
- [004 · Configuración, entorno y SEO](004-configuracion-entorno-y-seo.md): `SITE_URL` y `SITE_ENV` validadas con Zod, los datos del negocio, canonical/hreflang, `robots.txt` y el sitemap.
- [005 · Contenedores y servidor](005-contenedores-y-servidor.md): el `Dockerfile` multietapa, Compose con `edge` y `web`, los Caddyfile, la CSP estricta y la prueba de humo.
- [006 · La portada](006-la-portada.md): hero, categorías de trabajo, el contrato `data-*` y la aparición al hacer scroll con mejora progresiva.
- [007 · El slideshow en profundidad](007-el-slideshow.md): carrusel nativo con scroll snap, aritmética de páginas, temporizadores, el fundido y los fallos conocidos.
- [008 · Pruebas](008-pruebas.md): Vitest para la lógica pura, Playwright y axe en el navegador, y cómo se protegen las reglas del negocio.
- [009 · El logo nuevo, la fila de categorías y los textos de credencial y urgencias](009-logo-y-fila-de-categorias.md): por qué el logo del hero no puede fijar su altura, cómo se mide la imagen visible con `object-fit: contain`, cómo leer un PNG sin decodificarlo, por qué los SVG en línea no necesitan excepción en la CSP, los enlaces de fragmento con `scroll-margin-top` y movimiento reducido, y el ciclo rojo-verde.
