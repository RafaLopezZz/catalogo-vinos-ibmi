import mapepire from "@ibm/mapepire-js";
const { Pool } = mapepire;

const pool = new Pool({
  creds: {
    host: "pub400.com",
    port: 8076,
    user: "RAFALOPEZ",
    password: process.env.IBMI_PASSWORD, // nunca escrita en el código
    rejectUnauthorized: false, // PUB400 usa un certificado autofirmado; solo para pruebas
  },
  maxSize: 3,
  startingSize: 1,
});

await pool.init();

export async function query(sql, parameters = []) {
  const res = await pool.query(sql, { parameters }).execute();
  return res.data ?? [];
}
