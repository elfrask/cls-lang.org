# cls-lang.org

Sitio web oficial de [CLS](https://github.com/elfrask/cls), un lenguaje de programación de propósito general, de tipado estático, con un intérprete JIT que corre a la velocidad de C y Rust.

Construido con **Next.js 16 (App Router)**, **Tailwind CSS v4**, **next-intl** para internacionalización y **Shiki** para resaltado de sintaxis.

## Secciones

- **Docs** — documentación del lenguaje (guía, referencia del runtime, arquitectura y roadmap) servida desde `public/docs`.
- **Blog** — devlogs y anuncios de releases en español e inglés (`public/blog`).
- **Playground** — editor con resaltado de sintaxis de CLS y una terminal interactiva para probar el lenguaje desde el navegador.
- **Download** — descargas de releases con soporte multi-plataforma, canales estable y de desarrollo, y un archivo de todas las versiones.
- **Showcase** — proyectos construidos con CLS.
- **Comunidad** — enlaces a GitHub y Discord.
- **Search** — búsqueda de paquetes del registry (en desarrollo).

## Empezar

```bash
npm install
npm run dev
```

El servidor de desarrollo corre en [http://localhost:8087](http://localhost:8087).

## Scripts

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Servidor de desarrollo (puerto 8087) |
| `npm run build` | Build de producción |
| `npm run start` | Sirve el build de producción |
| `npm run lint` | ESLint |
| `npm run sync-docs` | Sincroniza la documentación desde el repo de CLS |
| `npm run build-docs-index` | Regenera el índice de la documentación |

## Estructura

```
src/
├── app/[locale]/        # Rutas i18n (docs, blog, playground, download, …)
├── components/          # UI, navbar, footer, playground, blog, docs, download
├── data/releases/       # Metadatos de releases (estable y de desarrollo)
├── lib/                 # releases, blog, docs, highlighter (Shiki), i18n
└── i18n/                # Configuración de next-intl
public/
├── blog/                # Devlogs (es/en) + índices
├── docs/                # Documentación del lenguaje (es/en)
└── releases/            # Binarios de releases
```

## Internacionalización

Los textos viven en `messages/es.json` y `messages/en.json`. Cada idioma tiene sus propios docs y blog en `public/docs` y `public/blog`.

## Licencia

MIT
