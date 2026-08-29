# La Canasta — sitio web

Página estática lista para GitHub Pages.

## Archivos

- `index.html` — estructura de la página.
- `style.css` — diseño responsive.
- `script.js` — productos, carrito y pedidos por WhatsApp.

## Antes de publicar

Abrí `script.js` y cambiá:

```js
const WHATSAPP_NUMBER = "5490000000000";
```

por tu número real, usando formato internacional y sin `+`, espacios ni guiones.

También podés modificar precios y productos dentro del arreglo `products`.

## Publicar en GitHub Pages

1. Creá un repositorio nuevo en GitHub.
2. Subí `index.html`, `style.css` y `script.js`.
3. En el repositorio entrá a **Settings → Pages**.
4. En **Build and deployment**, seleccioná **Deploy from a branch**.
5. Elegí la rama `main` y la carpeta `/ (root)`.
6. Guardá y esperá a que GitHub publique el sitio.

La página no necesita servidor ni base de datos.
