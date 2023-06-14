const express = require('express')
const { Pool } = require('pg')

const app = express();
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'movies_database',
    password: 'root',
    port: 5432,
});

app.use(express.json());

app.post('/new_movies', async (req, res) => {
    try{
        const {movie_id, name, genre, director} = req.body;
        const query = 'INSERT INTO movies (movies_id, name, genre, director) VALUES($1, $2, $3, $4) RETURNING *';
        const values = [movie_id, name, genre, director];

        const result = await pool.query(query, values);
        res.json(result.rows[0]);        
    } catch(err){
        console.error(err);
        res.status(500).send('Erro no servidor');
    }
});

app.get('/movies/:name', async (req, res) => {
    try{
        const { name } = req.params;
        const query = 'SELECT * FROM movies WHERE name = $1';
        const result = await pool.query(query, [name]);

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

app.put('/movies/:name', async (req, res) => {
    try{
        const { name } = req.params;
        const { genre, director } = req.body;
        const query = 'UPDATE movies SET genre = $1, director = $2 WHERE name = $3 RETURNING *';
        const values = [genre, director, name];

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

app.delete('/movies/:name', async (req, res) => {
    try{
        const { name } = req.params;
        const query = 'DELETE FROM movies WHERE name = $1';
        await pool.query(query, [name]);
        res.sendStatus(204);
    }catch(err){
        console.error(err);
        res.status(500).send('Erro no servidor');
    }
})

app.listen(3000, () => {
    console.log('Servidor iniciado na porta 3000')
});