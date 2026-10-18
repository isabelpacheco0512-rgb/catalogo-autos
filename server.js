const express = require("express");
const app = express();

// Archivos de diseño (carpeta public).
// index:false evita que un index.html viejo tape la página de inicio.
app.use(express.static("public", { index: false }));

// Catálogo de autos (nuestros datos)
const autos = [
  { id: 1, marca: "Toyota", modelo: "Corolla", anio: 2022, precio: 350000, color: "Blanco" },
  { id: 2, marca: "Nissan", modelo: "Versa", anio: 2021, precio: 280000, color: "Gris" },
  { id: 3, marca: "Mazda", modelo: "Mazda 3", anio: 2023, precio: 420000, color: "Rojo" },
  { id: 4, marca: "Honda", modelo: "Civic", anio: 2020, precio: 330000, color: "Negro" },
  { id: 5, marca: "Volkswagen", modelo: "Jetta", anio: 2022, precio: 390000, color: "Azul" }
];

const colores = {
  Blanco: "#ffffff",
  Gris: "#9ca3af",
  Rojo: "#ff1e3c",
  Negro: "#6b7280",
  Azul: "#3b82f6",
  Verde: "#22c55e",
  Amarillo: "#facc15",
  Plata: "#d1d5db"
};

const dinero = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN"
});

// Plantilla común: todas las páginas usan este mismo diseño
function pagina(titulo, contenido) {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${titulo} | Catálogo de Autos</title>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@500;700&family=Orbitron:wght@600;900&family=Rajdhani:wght@500;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/estilo.css">
</head>
<body>
  <div class="petalos">
    <span></span><span></span><span></span><span></span>
    <span></span><span></span><span></span><span></span>
  </div>
  <header>
    <div class="kanji">車</div>
    <div class="etiqueta">TOKYO NIGHTS • STREET CULTURE</div>
    <h1>Catálogo de Autos</h1>
    <p class="sub">🌸 自動車カタログ 🌸</p>
    <div class="raya"></div>
    <nav>
      <a href="/">Inicio</a>
      <a href="/autos">Catálogo</a>
      <a href="/datos">Datos</a>
    </nav>
  </header>
  <main>${contenido}</main>
  <footer>🏁 Microservicio web con Node.js y Express 🏁</footer>
</body>
</html>`;
}

function tarjeta(auto) {
  const color = colores[auto.color] || "#999999";
  return `
    <a class="tarjeta" href="/autos/${auto.id}">
      <div class="barra" style="background:${color}; box-shadow:0 0 18px ${color}"></div>
      <div class="cuerpo">
        <div class="placa">JDM-0${auto.id}</div>
        <div class="marca">${auto.marca}</div>
        <div class="modelo">${auto.modelo}</div>
        <div class="dato">Año: <b>${auto.anio}</b></div>
        <div class="dato">Color: <b>${auto.color}</b></div>
        <div class="precio">${dinero.format(auto.precio)}</div>
      </div>
    </a>`;
}

// ---------- PÁGINAS ----------

// Inicio
app.get("/", (req, res) => {
  res.send(pagina("Inicio", `
    <section class="bienvenida">
      <h2>Bienvenido</h2>
      <div class="chips">
        <span>${autos.length} AUTOS</span>
        <span>API JSON</span>
        <span>NODE + EXPRESS</span>
      </div>
      <p>Este microservicio web entrega un catálogo básico de autos con su
      marca, modelo, año, precio y color. Explora el catálogo o consulta
      los datos en formato JSON.</p>
      <a class="boton" href="/autos">Ver catálogo</a>
    </section>`));
});

// Catálogo completo
app.get("/autos", (req, res) => {
  res.send(pagina("Catálogo", `
    <h2>Nuestros autos</h2>
    <div class="grid">${autos.map(tarjeta).join("")}</div>`));
});

// Detalle de un auto
app.get("/autos/:id", (req, res) => {
  const auto = autos.find((a) => a.id === parseInt(req.params.id));
  if (!auto) {
    return res.status(404).send(pagina("No encontrado", `
      <section class="bienvenida">
        <h2>Auto no encontrado</h2>
        <p>El auto que buscas no existe en el catálogo.</p>
        <a class="boton" href="/autos">Volver al catálogo</a>
      </section>`));
  }
  const color = colores[auto.color] || "#999999";
  res.send(pagina(auto.modelo, `
    <section class="detalle">
      <div class="barra" style="background:${color}; box-shadow:0 0 22px ${color}"></div>
      <div class="placa">JDM-0${auto.id}</div>
      <div class="marca">${auto.marca}</div>
      <div class="modelo">${auto.modelo}</div>
      <div class="dato">Año: <b>${auto.anio}</b></div>
      <div class="dato">Color: <b>${auto.color}</b></div>
      <div class="precio">${dinero.format(auto.precio)}</div>
      <a class="boton" href="/autos">Volver al catálogo</a>
    </section>`));
});

// Datos: tabla, rutas y JSON con el mismo diseño
app.get("/datos", (req, res) => {
  const filas = autos.map((a) => `
        <tr>
          <td>${a.id}</td>
          <td>${a.marca}</td>
          <td>${a.modelo}</td>
          <td>${a.anio}</td>
          <td>${dinero.format(a.precio)}</td>
          <td>${a.color}</td>
        </tr>`).join("");

  res.send(pagina("Datos", `
    <h2>Datos del catálogo</h2>

    <div class="caja-tabla">
      <table>
        <thead>
          <tr><th>ID</th><th>Marca</th><th>Modelo</th><th>Año</th><th>Precio</th><th>Color</th></tr>
        </thead>
        <tbody>${filas}
        </tbody>
      </table>
    </div>

    <h2>Rutas del servicio</h2>
    <div class="caja-tabla">
      <table>
        <thead>
          <tr><th>Método</th><th>Ruta</th><th>Qué devuelve</th></tr>
        </thead>
        <tbody>
          <tr><td>GET</td><td>/api/autos</td><td>Todo el catálogo en JSON</td></tr>
          <tr><td>GET</td><td>/api/autos/:id</td><td>Un auto en JSON (404 si no existe)</td></tr>
          <tr><td>GET</td><td>/autos</td><td>Catálogo en página web</td></tr>
          <tr><td>GET</td><td>/autos/:id</td><td>Detalle de un auto en página web</td></tr>
        </tbody>
      </table>
    </div>

    <h2>Respuesta JSON</h2>
    <pre class="json">${JSON.stringify(autos, null, 2)}</pre>
    <p class="centro"><a class="boton" href="/api/autos">Ver JSON puro</a></p>`));
});

// ---------- API (datos en JSON) ----------

app.get("/api/autos", (req, res) => {
  res.json(autos);
});

app.get("/api/autos/:id", (req, res) => {
  const auto = autos.find((a) => a.id === parseInt(req.params.id));
  if (!auto) {
    return res.status(404).json({ mensaje: "Auto no encontrado" });
  }
  res.json(auto);
});

// Cualquier otra dirección: página 404 con el mismo diseño
app.use((req, res) => {
  res.status(404).send(pagina("No encontrado", `
    <section class="bienvenida">
      <h2>Página no encontrada</h2>
      <a class="boton" href="/">Ir al inicio</a>
    </section>`));
});

// Render nos asigna el puerto; si no, usamos el 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servicio activo en el puerto " + PORT);
});