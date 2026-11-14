# talks

Slides de mis charlas y talleres, publicadas en **https://talks.kireku.dev**.

Cada charla es un deck de [Slidev](https://sli.dev) en su propia carpeta:

```
decks/<slug>/slides.md      → https://talks.kireku.dev/<slug>/
site/index.html             → portada con la lista de charlas
```

## Uso

```bash
npm install
npx slidev decks/ia-para-planificar/slides.md   # editar con recarga en vivo
npm run build                                   # compila todos los decks en dist/
npm run build -- ia-para-planificar             # compila solo uno
```

En la presentación: `P` abre el modo presentador (con notas), `O` la vista general, `F` pantalla completa.

## Nueva charla

1. Crea `decks/<slug>/slides.md` (puedes copiar la carpeta de otro deck como base).
2. Agrega su tarjeta en `site/index.html`.
3. Push a `main`: GitHub Actions compila y publica.
