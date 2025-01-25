import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [cliente, setCliente] = useState({ nome: '', endereco: '', telefone: '', bairro: '' });
  const [pizza, setPizza] = useState({ sabor: '', tamanho: '', quantidade: 1 });
  const [pedidos, setPedidos] = useState<Array<{ nome: string; endereco: string; telefone: string; bairro: string; sabor: string; tamanho: string; quantidade: number; valorTotal: number }>>([]);

  useEffect(() => {
    fetch('http://localhost:5000/pedidos')
      .then(response => response.json())
      .then(data => {
        console.log('Pedidos recebidos:', data);
        setPedidos(data);
      })
      .catch(error => console.error('Erro ao buscar pedidos:', error));
  }, []);

  function handleClienteChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setCliente({ ...cliente, [name]: value });
  }

  function handlePizzaChange(event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) {
    const { name, value } = event.target;
    setPizza({ ...pizza, [name]: value });
  }

  function fetchPedidos() {
    fetch('http://localhost:5000/pedidos')
      .then(response => response.json())
      .then(data => {
        console.log('Pedidos atualizados:', data);
        setPedidos(data);
      })
      .catch(error => console.error('Erro ao buscar pedidos:', error));
  }

  function adicionarPedido(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!pizza.sabor || !pizza.tamanho || !pizza.quantidade) {
      alert('Por favor, selecione o sabor, o tamanho e a quantidade da pizza.');
      return;
    }

    const novoPedido = { ...cliente, ...pizza };

    fetch('http://localhost:5000/pedidos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(novoPedido),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Pedido adicionado:', data);
        fetchPedidos();
        setPizza({ sabor: '', tamanho: '', quantidade: 1 });
      })
      .catch(error => console.error('Erro ao adicionar pedido:', error.message));
  }

  function deletarPedido(id: number) {
    fetch(`http://localhost:5000/pedidos/${id}`, {
      method: 'DELETE',
    })
      .then(response => response.json())
      .then(data => {
        console.log('Pedido removido:', data);
        fetchPedidos();
      })
      .catch(error => console.error('Erro ao deletar pedido:', error.message));
  }

  return (
    <div className="pizzaria-wrapper">
      <h1>Painel da Pizzaria da Hora</h1>
      <form className="cliente-form">
        <h2>Cliente</h2>
        <input
          type="text"
          name="nome"
          placeholder="Nome do cliente"
          value={cliente.nome}
          onChange={handleClienteChange}
        />
        <input
          type="text"
          name="endereco"
          placeholder="Endereço do cliente"
          value={cliente.endereco}
          onChange={handleClienteChange}
        />
        <input
          type="text"
          name="telefone"
          placeholder="Telefone do cliente"
          value={cliente.telefone}
          onChange={handleClienteChange}
        />
        <input
          type="text"
          name="bairro"
          placeholder="Bairro do cliente"
          value={cliente.bairro}
          onChange={handleClienteChange}
        />
      </form>

      <form className="pizza-form" onSubmit={adicionarPedido}>
        <h2>Pizza</h2>
        <select name="sabor" value={pizza.sabor} onChange={handlePizzaChange}>
          <option value="">Selecione o sabor</option>
          <option value="Calabresa">Calabresa</option>
          <option value="Mussarela">Mussarela</option>
          <option value="Marguerita">Marguerita</option>
        </select>
        <select name="tamanho" value={pizza.tamanho} onChange={handlePizzaChange}>
          <option value="">Selecione o tamanho</option>
          <option value="Média">Média</option>
          <option value="Grande">Grande</option>
          <option value="Gigante">Gigante</option>
        </select>
        <input
          type="number"
          name="quantidade"
          value={pizza.quantidade}
          onChange={handlePizzaChange}
          min="1"
        />
        <button type="submit">Adicionar Pedido</button>
        
      </form>

      <ul className="pedidos-list">
        <h2>Pedidos</h2>
        {pedidos.map((pedido, index) => (
          <li key={index}>
            <strong>Cliente:</strong> {pedido.nome} | <strong>Endereço:</strong> {pedido.endereco} |
            <strong> Telefone:</strong> {pedido.telefone} | <strong>Bairro:</strong> {pedido.bairro} |
            <strong> Pizza:</strong> {pedido.sabor} ({pedido.tamanho}) | <strong>Quantidade:</strong> {pedido.quantidade} |
            <strong> Total:</strong> R${pedido.valorTotal.toFixed(2)}
            <button className="delete-button" onClick={() => deletarPedido(index)}>Deletar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
