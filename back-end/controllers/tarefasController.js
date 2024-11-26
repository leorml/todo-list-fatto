const db = require("../database.js");


// Criar tarefa
exports.criarTarefa = (req, res) => {
  const { text, price, deadline } = req.body;

  // Verificar se já existe uma tarefa com o mesmo nome
  const sqlCheckExistence =
    "SELECT COUNT(*) AS count FROM tarefas WHERE text = ?";
  db.get(sqlCheckExistence, [text], (err, row) => {
    if (err) {
      return res.status(400).json({ erro: err.message });
    }

    if (row.count > 0) {
      return res
        .status(400)
        .json({ erro: "Já existe uma tarefa com esse nome" });
    }

    // Buscar a maior posição existente
    const sqlMaxPosition = "SELECT MAX(position) AS max_position FROM tarefas";
    db.get(sqlMaxPosition, (err, row) => {
      if (err) {
        return res.status(400).json({ erro: err.message });
      }

      // Define a posição como a maior posição + 1, ou 1 se não houver tarefas
      const position = row.max_position ? row.max_position + 1 : 1;

      // Inserir a nova tarefa com a posição
      const sql =
        "INSERT INTO tarefas (text, price, deadline, position) VALUES (?, ?, ?, ?)";
      const params = [text, price, deadline, position];

      db.run(sql, params, function (err) {
        if (err) {
          return res.status(400).json({ erro: err.message });
        }
        res.json({
          message: "Tarefa criada com sucesso",
          data: { id: this.lastID, text, price, deadline, position },
        });
      });
    });
  });
};



// Listar todas as tarefas
exports.listarTarefas = (req, res) => {
  const sql = "SELECT * FROM tarefas ORDER BY position ASC"; 

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

  // Verificar se já existe uma tarefa com o mesmo nome (e que não seja a tarefa sendo atualizada)
  const sqlCheckExistence =
    "SELECT COUNT(*) AS count FROM tarefas WHERE text = ? AND id != ?";
  db.get(sqlCheckExistence, [text, id], (err, row) => {
    if (err) {
      return res.status(400).json({ erro: err.message });
    }

    if (row.count > 0) {
      return res
        .status(400)
        .json({ erro: "Já existe uma tarefa com esse nome" });
    }

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

exports.trocarPosicaoTarefas = (req, res) => {
  const { id1, id2 } = req.body;

  if (!id1 || !id2) {
    return res.status(400).json({ mensagem: "IDs de tarefas não fornecidos" });
  }

  const sql1 = "SELECT position FROM tarefas WHERE id = ?";
  db.get(sql1, [id1], (err, row1) => {
    if (err) return res.status(400).json({ erro: err.message });
    if (!row1)
      return res.status(404).json({ mensagem: "Tarefa 1 não encontrada" });

    const sql2 = "SELECT position FROM tarefas WHERE id = ?";
    db.get(sql2, [id2], (err, row2) => {
      if (err) return res.status(400).json({ erro: err.message });
      if (!row2)
        return res.status(404).json({ mensagem: "Tarefa 2 não encontrada" });

      const pos1 = row1.position;
      const pos2 = row2.position;

      const updateSql1 = "UPDATE tarefas SET position = ? WHERE id = ?";
      const updateSql2 = "UPDATE tarefas SET position = ? WHERE id = ?";

      db.run(updateSql1, [pos2, id1], function (err) {
        if (err) return res.status(400).json({ erro: err.message });

        db.run(updateSql2, [pos1, id2], function (err) {
          if (err) return res.status(400).json({ erro: err.message });

          res.json({
            message: "Posições das tarefas trocadas com sucesso",
            data: { id1, id2 },
          });
        });
      });
    });
  });
};
