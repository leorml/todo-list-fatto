const express = require("express");
const router = express.Router();
const tarefasController = require("../controllers/tarefasController");

router.post("/", tarefasController.criarTarefa);

router.get("/", tarefasController.listarTarefas);

router.get("/:id", tarefasController.buscarTarefaPorId);

router.put("/:id", tarefasController.atualizarTarefa);

router.delete("/:id", tarefasController.excluirTarefa);


module.exports = router;
