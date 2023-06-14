const express = require('express')
const { Pool } = require('pg')

const app = express();
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'cliente_db',
    password: 'root',
    port: 5432,
});

app.use(express.json());

app.post('/novo_cliente', async (req, res) => {
    try{
        const {nome, nascimento, cpf, endereco, email} = req.body;
        const query = 'INSERT INTO clientes (nome, nascimento, cpf, endereco, email) VALUES($1, $2, $3, $4, $5) RETURNING *';
        const values = [nome, nascimento, cpf, endereco, email];

        const result = await pool.query(query, values);
        res.json(result.rows[0]);        
    } catch(err){
        console.error(err);
        res.status(500).send('Erro no servidor');
    }
});

app.get('/clientes/:cpf', async (req, res) => {
    try{
        const { cpf } = req.params;
        const query = 'SELECT * FROM clientes WHERE cpf = $1';
        const result = await pool.query(query, [cpf]);

        if (result.rows.length === 0){
            res.status(404).send('Registro não encontrado');
        } else {
            res.json(result.rows[0]);
        }
    }catch(err){
        console.error(err);
        res.status(500).send('Erro no servidor');
    }
});

app.put('/clientes/:cpf', async (req, res) => {
    try{
        const { cpf } = req.params;
        const { nome, nascimento, endereco, email} = req.body;
        const query = 'UPDATE clientes SET nome = $1, nascimento = $2, endereco = $3, email = $4 WHERE cpf = $5 RETURNING *';
        const values = [nome, nascimento, endereco, email, cpf];

        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            res.status(404).send('Registro não encontrado');
        } else {
            res.json(result.rows[0]);
        }
    }catch(err){
        console.error(err);
        res.status(500).send('Erro no servidor');
    }
});

app.delete('/clientes/:cpf', async (req, res) => {
    try{
        const { cpf } = req.params;
        const query = 'DELETE FROM clientes WHERE cpf = $1';
        await pool.query(query, [cpf]);
        res.sendStatus(204);
    }catch(err){
        console.error(err);
        res.status(500).send('Erro no servidor');
    }
})

app.listen(3000, () => {
    console.log('Servidor iniciado na porta 3000')
});