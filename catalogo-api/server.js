import express from "express";
import cors from "cors";
import { query } from "./db.js";

const app = express();
app.use(cors());
app.use(express.json());

// DB2 devuelve las columnas en mayúsculas; las convertimos al formato que espera Vue
const aJson = (r) => ({
  id: r.ID,
  nombre: r.NOMBRE,
  tipo: r.TIPO,
  precio: Number(r.PRECIO),
  stock: r.STOCK,
});

app.get("/api/productos", async (req, res) => {
  try {
    const { tipo } = req.query;
    const filas = tipo
      ? await query("SELECT * FROM RAFALOPEZ1.PRODUCTOS WHERE TIPO = ?", [tipo])
      : await query("SELECT * FROM RAFALOPEZ1.PRODUCTOS");
    res.json(filas.map(aJson));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al consultar la base de datos" });
  }
});

app.get("/api/productos/:id", async (req, res) => {
  try {
    const [p] = await query("SELECT * FROM RAFALOPEZ1.PRODUCTOS WHERE ID = ?", [
      Number(req.params.id),
    ]);
    if (!p) return res.status(404).json({ error: "Producto no encontrado" });
    res.json(aJson(p));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al consultar la base de datos" });
  }
});

app.post("/api/pedidos", async (req, res) => {
  try {
    const { productoId, cantidad } = req.body;
    if (!Number.isInteger(cantidad) || cantidad <= 0)
      return res.status(400).json({ error: "Cantidad no válida" });

    const [p] = await query("SELECT * FROM RAFALOPEZ1.PRODUCTOS WHERE ID = ?", [
      productoId,
    ]);
    if (!p) return res.status(404).json({ error: "Producto no encontrado" });
    if (p.STOCK < cantidad)
      return res
        .status(409)
        .json({ error: "Stock insuficiente", disponible: p.STOCK });

    // Aquí se llama a tu programa RPG en el IBM i
    await query("CALL RAFALOPEZ1.ACTUALIZAR_STOCK(?, ?)", [
      productoId,
      -cantidad,
    ]);

    const [actualizado] = await query(
      "SELECT * FROM RAFALOPEZ1.PRODUCTOS WHERE ID = ?",
      [productoId],
    );
    res.status(201).json({ ok: true, producto: aJson(actualizado) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al procesar el pedido" });
  }
});

app.listen(3000, () =>
  console.log("API en http://localhost:3000 conectada a DB2 en PUB400"),
);
