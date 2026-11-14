# talks

Slides de mis charlas y talleres, publicadas en **https://talks.kireku.dev**.

Cada charla es un deck de [Slidev](https://sli.dev) en su propia carpeta, con URL fija:

```
decks/<slug>/slides.md          → https://talks.kireku.dev/<slug>/
talks.json                      → charlas sin deck (enlaces externos)
site/index.template.html        → plantilla de la portada
```

La portada (`talks.kireku.dev`) se genera sola al compilar: lee el bloque `talk:` de cada
deck y `talks.json`, ordena por fecha, agrupa por año y usa la primera slide como miniatura.

## Uso

```bash
npm install
npx slidev decks/ia-para-planificar/slides.md   # editar con recarga en vivo
npm run build                                   # todos los decks + portada en dist/
npm run build -- ia-para-planificar             # solo uno
SKIP_COVERS=1 npm run build                     # sin miniaturas (no usa Chromium)
```

En la presentación: `P` modo presentador (con notas), `O` vista general, `F` pantalla completa.

## Nueva charla

1. Copia la carpeta de un deck existente a `decks/<slug>/` y edita `slides.md`.
2. Llena el bloque `talk:` del headmatter:

   ```yaml
   talk:
     date: 2027-03-10        # obligatorio, AAAA-MM-DD
     kind: Charla            # Charla, Taller…
     place: Lugar
     summary: Una línea sobre de qué va.
   ```

3. Push a `main`: GitHub Actions compila, genera la portada y publica.

Fondos estilo Shibainu (solo CSS): `<Bubbles v="cream-a" />` como primera línea de la
slide; las variantes están en `styles/bubbles.css`.
