import express from 'express';
import fs from 'fs';
import cors from 'cors';

const app = express();
const PORT = 5000;
const DATABASE_FILE = './banco.json';

const precoPizzas = {
  Calabresa: { Média: 30, Grande: 40, Gigante: 50 },
  Mussarela: { Média: 25, Grande: 35, Gigante: 45 },
  Marguerita: { Média: 28, Grande: 38, Gigante: 48 },
};

app.use(cors());
app.use(express.json());

app.get('/pedidos', (req, res) => {
  fs.readFile(DATABASE_FILE, 'utf8', (err, data) => {
    if (err) {
      console.error('Erro ao ler o arquivo:', err);
      return res.status(500).json({ error: 'Erro ao ler o arquivo.' });
    }
    try {
      const pedidos = JSON.parse(data);
      res.json(pedidos);
    } catch (parseError) {
      console.error('Erro ao parsear o JSON:', parseError);
      res.status(500).json({ error: 'Erro ao parsear o JSON.' });
    }
  });
});

app.post('/pedidos', (req, res) => {
  const novoPedido = req.body;
  const precoPizza = precoPizzas[novoPedido.sabor][novoPedido.tamanho];
  novoPedido.valorTotal = precoPizza * novoPedido.quantidade;

  fs.readFile(DATABASE_FILE, 'utf8', (err, data) => {
    if (err) {
      console.error('Erro ao ler o arquivo:', err);
      return res.status(500).json({ error: 'Erro ao ler o arquivo.' });
    }
    try {
      const pedidos = JSON.parse(data);
      pedidos.push(novoPedido);

      fs.writeFile(DATABASE_FILE, JSON.stringify(pedidos, null, 2), (err) => {
        if (err) {
          console.error('Erro ao salvar o pedido:', err);
          return res.status(500).json({ error: 'Erro ao salvar o pedido.' });
        }
        console.log('Pedido salvo com sucesso:', novoPedido);
        res.status(201).json({ message: 'Pedido salvo com sucesso.', pedido: novoPedido });
      });
    } catch (parseError) {
      console.error('Erro ao parsear o JSON:', parseError);
      res.status(500).json({ error: 'Erro ao parsear o JSON.' });
    }
  });
});

app.delete('/pedidos/:index', (req, res) => {
  const index = parseInt(req.params.index, 10);

  fs.readFile(DATABASE_FILE, 'utf8', (err, data) => {
    if (err) {
      console.error('Erro ao ler o arquivo:', err);
      return res.status(500).json({ error: 'Erro ao ler o arquivo.' });
    }
    try {
      const pedidos = JSON.parse(data);
      if (index >= 0 && index < pedidos.length) {
        pedidos.splice(index, 1);

        fs.writeFile(DATABASE_FILE, JSON.stringify(pedidos, null, 2), (err) => {
          if (err) {
            console.error('Erro ao salvar o arquivo:', err);
            return res.status(500).json({ error: 'Erro ao salvar o arquivo.' });
          }
          console.log('Pedido deletado com sucesso:', index);
          res.status(200).json({ message: 'Pedido deletado com sucesso.' });
        });
      } else {
        res.status(400).json({ error: 'Índice inválido.' });
      }
    } catch (parseError) {
      console.error('Erro ao parsear o JSON:', parseError);
      res.status(500).json({ error: 'Erro ao parsear o JSON.' });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});