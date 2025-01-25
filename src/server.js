import express from 'express';
import fs from 'fs';
import cors from 'cors';

const app = express();
const PORT = 5000;
const DATABASE_FILE = './src/banco.json';

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
      return res.status(500).send('Erro ao ler o arquivo.');
    }
    res.send(JSON.parse(data));
  });
});

app.post('/pedidos', (req, res) => {
  const novoPedido = req.body;

  if (!novoPedido.nome || !novoPedido.endereco || !novoPedido.telefone || !novoPedido.bairro || !novoPedido.sabor || !novoPedido.tamanho || !novoPedido.quantidade) {
    return res.status(400).json({ message: 'Por favor, preencha todos os campos do pedido.' });
  }

  const precoPorPizza = precoPizzas[novoPedido.sabor]?.[novoPedido.tamanho];
  if (!precoPorPizza) {
    return res.status(400).json({ message: 'Sabor ou tamanho inválido.' });
  }

  const valorTotal = precoPorPizza * novoPedido.quantidade;
  novoPedido.valorTotal = valorTotal;

  fs.readFile(DATABASE_FILE, 'utf8', (err, data) => {
    if (err) {
      console.error('Erro ao ler o arquivo:', err);
      return res.status(500).send('Erro ao ler o arquivo.');
    }

    const pedidos = JSON.parse(data);
    pedidos.push(novoPedido);

    fs.writeFile(DATABASE_FILE, JSON.stringify(pedidos, null, 2), (err) => {
      if (err) {
        console.error('Erro ao salvar o pedido:', err);
        return res.status(500).send('Erro ao salvar o pedido.');
      }
      console.log('Pedido salvo com sucesso:', novoPedido);
      res.status(201).json({ message: 'Pedido salvo com sucesso.', pedido: novoPedido });
    });
  });
});

app.delete('/pedidos/:id', (req, res) => {
  const { id } = req.params;

  fs.readFile(DATABASE_FILE, 'utf8', (err, data) => {
    if (err) {
      console.error('Erro ao ler o arquivo:', err);
      return res.status(500).send('Erro ao ler o arquivo.');
    }

    const pedidos = JSON.parse(data);
    const pedidoIndex = pedidos.findIndex((pedido, index) => index === parseInt(id));

    if (pedidoIndex === -1) {
      return res.status(404).send('Pedido não encontrado.');
    }

    pedidos.splice(pedidoIndex, 1);

    fs.writeFile(DATABASE_FILE, JSON.stringify(pedidos, null, 2), (err) => {
      if (err) {
        console.error('Erro ao deletar o pedido:', err);
        return res.status(500).send('Erro ao deletar o pedido.');
      }
      console.log('Pedido deletado com sucesso.');
      res.status(200).json({ message: 'Pedido deletado com sucesso.' });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
