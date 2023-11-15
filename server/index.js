const express = require('express');
const app = express();
const cors = require('cors')
const pool = require('./db')


//middlewares

app.use(cors());
app.use(express.json());


//routes

//post  requests

app.post('/todos', async (req, res) => {
    try {
        const { description } = req.body

        const newTodo = await pool.query(
            "INSERT INTO todo (description) VALUES ($1) RETURNING *",
            [description]
        );
        res.json(newTodo.rows[0])
    } catch (err) {
        console.log(err)
    }
})

//get request

app.get('/allTodo', async (req, res) => {
    try {
        const allTodo = await pool.query("SELECT * FROM todo")
        res.json(allTodo.rows)
    } catch (err) {
        console.log(err)
    }
})

//get request for particular item

app.get('/todo/:id', async (req, res) => {
    try {
        const { id } = req.params
        const todo = await pool.query("SELECT * FROM todo WHERE todo_id = $1", [id])
        res.json(todo.rows[0])

    } catch (err) {
        console.log(err)
    }
})


//PUT & PATCH requests

app.put('/updateTodo/:id', async (req, res) => {
    try {
        const { id } = req.params
        const { description } = req.body

        const updateTodo = await pool.query("UPDATE todo SET description = $1 WHERE todo_id = $2", [description, id])

        res.json('todo updated')
    } catch (err) {
        console.log(err)
    }
})

app.delete('/deleteTodo/:id',async(req,res)=>{
    try{
       const {id} = req.params

       const  deleteTodo = await pool.query("DELETE FROM todo WHERE todo_id=$1",[id])
       res.json('todo deleted successfully!')
    }catch(err){
        console.log(err)
    }
})








app.listen(5001, () => {
    console.log(`server started at PORT:5001`)
})