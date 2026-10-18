const express = require("express");
const app = express();

// Catálogo de autos (nuestros datos)
const autos = [
  { id: 1, marca: "Toyota", modelo: "Corolla", anio: 2022, precio: 350000, color: "Blanco" },
  { id: 2, marca: "Nissan", modelo: "Versa", anio: 2021, precio: 280000, color: "Gris" },
  { id: 3, marca: "Mazda", modelo: "Mazda 3", anio: 2023, precio: 420000, color: "Rojo" },
  { id: 4, marca: "Honda", modelo: "Civic", anio: 2020, precio: 330000, color: "Negro" },
  { id: 5, marca: "Volkswagen", modelo: "Jetta", anio: 2022, precio: 390000, color: "Azul" }
];

// Ruta principal: mensaje de bienvenida
app.get("/", (req, res) => {
  res.send("Servicio web de catálogo de autos. Visita /autos");
});

// Ruta 1: devuelve todos los autos
app.get("/autos", (req, res) => {
  res.json(autos);
});

// Ruta 2: devuelve un auto según su id
app.get("/autos/:id", (req, res) => {
  const auto = autos.find((a) => a.id === parseInt(req.params.id));
  if (!auto) {
    return res.status(404).json({ mensaje: "Auto no encontrado" });
  }
  res.json(auto);
});

// Render nos asigna el puerto; si no, usamos el 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servicio activo en el puerto " + PORT);
});