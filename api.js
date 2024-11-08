const express = require("express");
const db = require("./db/transactions.json");
// const dbUser = require("./db/user.json");
const bodyParser = require("body-parser");
const swaggerUi = require("swagger-ui-express");
const swaggerDocs = require("./src/swaggerConfig");
const cors = require("cors"); 
require('dotenv').config();
const extrato = require("./db/extrato.json");

const port = 3000;
const app = express();

app.use(bodyParser.json());

// Configuração do CORS
// app.use(cors({ origin: "http://localhost:5173" }));

app.use(cors({
  origin: (origin, callback) => {
    if (origin === "http://localhost:5173" || origin === "https://frontend-case-two.vercel.app") {
      return callback(null, true);
    }
    callback(new Error("Not allowed by CORS"));
  }
}));

const dbUser = {
  cpf: process.env.USER_CPF,
  password: process.env.USER_PASSWORD,
  token: process.env.USER_TOKEN,
};

// Rota do Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
 * @swagger
 * /health-check:
 *   get:
 *     summary: Verifica o status da API
 *     responses:
 *       200:
 *         description: API está ativa
 */
app.get("/health-check", (_, res) => {
  return res.sendStatus(200);
});

/**
 * @swagger
 * /auth:
 *   post:
 *     summary: Autentica o usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cpf:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Autenticado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       401:
 *         description: Não autorizado
 */

app.post("/auth", (req, res) => {
  const { cpf, password } = req.body;

  if (process.env.USER_CPF === cpf && process.env.USER_PASSWORD === password) {
    return res.status(200).json({ token: process.env.USER_TOKEN });
  }
  
  return res.sendStatus(401);  
});

/**
 * @swagger
 * /list:
 *   get:
 *     summary: Lista todas as transações
 *     parameters:
 *       - in: header
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Token de autenticação do usuário
 *     responses:
 *       200:
 *         description: Lista de transações
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   amount:
 *                     type: number
 *                   description:
 *                     type: string
 *                   date:
 *                     type: string
 *                     format: date
 *       401:
 *         description: Não autorizado
 */

app.get("/list", (req, res) => {
  const fixedToken = process.env.USER_TOKEN;
  const authorizationHeader = req.headers.authorization;

  if (authorizationHeader !== `Bearer ${fixedToken}`) {
    return res.sendStatus(401); 
  }

  if (!Array.isArray(extrato.results)) {
    return res.status(500).json({ error: "Transactions data is not available." });
  }

  return res.json({
    results: extrato.results,
    itemsTotal: extrato.itemsTotal
  });
});


app.listen(port, () => {
  console.log(`[api] running on port ${port}`);
  console.log(`Swagger docs available at http://localhost:${port}/api-docs`);
});
