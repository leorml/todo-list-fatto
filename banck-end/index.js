const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const port = 3000;

// Importar rotas
const tarefasRoutes = require("./routes/tarefas");


// Middleware
app.use(
  cors({
    origin: "http://localhost:4200", 
    credentials: true,
  })
);
app.use(bodyParser.json());

// Usar rotas
app.use("/api/tarefas", tarefasRoutes);

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
