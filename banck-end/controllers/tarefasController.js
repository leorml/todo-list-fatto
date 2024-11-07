const db = require("../database.js");

// Criar tarefa
exports.criarTarefa = (req, res) => {
  const { text, price, deadline } = req.body;

  const sql = "INSERT INTO tarefas (text, price, deadline) VALUES (?, ?, ?)";
  const params = [text, price, deadline];

  db.run(sql, params, function (err) {
    if (err) {
      return res.status(400).json({ erro: err.message });
    }
    res.json({
      message: "Tarefa criada com sucesso",
      data: { id: this.lastID, text, price, deadline },
    });
  });
};

// Listar todas as tarefas
exports.listarTarefas = (req, res) => {
  const sql = "SELECT * FROM tarefas";

  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(400).json({ erro: err.message });
    }
    res.json({ data: rows });
  });
};

// Buscar tarefa por ID
exports.buscarTarefaPorId = (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM tarefas WHERE id = ?";

  db.get(sql, [id], (err, row) => {
    if (err) {
      return res.status(400).json({ erro: err.message });
    }
    if (!row) {
      return res.status(404).json({ mensagem: "Tarefa não encontrada" });
    }
    res.json({ data: row });
  });
};

// Atualizar tarefa
exports.atualizarTarefa = (req, res) => {
  const { id } = req.params;
  const { text, price, deadline } = req.body;

  const sql =
    "UPDATE tarefas SET text = ?, price = ?, deadline = ? WHERE id = ?";
  const params = [text, price, deadline, id];

  db.run(sql, params, function (err) {
    if (err) {
      return res.status(400).json({ erro: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ mensagem: "Tarefa não encontrada" });
    }
    res.json({
      message: "Tarefa atualizada",
      data: { id, text, price, deadline },
    });
  });
};

// Excluir tarefa
exports.excluirTarefa = (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM tarefas WHERE id = ?";

  db.run(sql, [id], function (err) {
    if (err) {
      return res.status(400).json({ erro: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ mensagem: "Tarefa não encontrada" });
    }
    res.json({ message: "Tarefa excluída com sucesso" });
  });
};
