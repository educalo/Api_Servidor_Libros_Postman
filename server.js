const express = require('express');
const mysql = require('mysql');
const cors = require('cors');


const app = express();
app.use(cors());
app.use(express.json());

//conexion con la bd
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password:'', 
    database: 'libros'
});

//req es un objeto que contiene información sobre la solicitud HTTP que generó el evento. En respuesta a req, utiliza respara enviar la respuesta HTTP deseada.
app.get('/', (re, res) => {
    return res.json("Lado servidor");
})

app.get('/libros', (req, res) => {
    const sql ="SELECT * FROM libro";
    db.query(sql, (err, data) => {
        if(err) return req.json(err);
        return res.json(data);
    })
})

//Mostrar un SOLO libro
//????????????mirar
app.get('/:id', (req,res)=>{
    db.query('SELECT * FROM libro WHERE isbn = ?', [req.params.id], (error, fila)=>{
        if(error){
            throw error
        }else{
            res.send(fila)
        }
    })
})

//Crear un libro
app.post('/insert', (req,res)=>{
    if (req.body && Object.keys(req.body).length > 0) {
        //let isbn = req.body.isbn;
        //let titulo = req.body.titulo;
        //let autor = req.body.autor;
        //let genero = req.body.genero;
        //let resumen = req.body.resumen;
        let data = {isbn: req.body.isbn, titulo: req.body.titulo, autor: req.body.autor, genero: req.body.genero, resumen: req.body.resumen}
        let sql = "INSERT INTO libro SET ?"
    
            db.query(sql, [data], function(error, filas){
                if(error){
                    throw error
                }else{                    
                    res.send(filas) //enviamos los valores                         
            }
        })
    } else {
        res.status(400).send('El cuerpo de la solicitud está vacío o no tiene los datos esperados.');
     }
    
    
})
//Editar articulo
//lo puedo pasar como parametro de la url o desde el body directamente
app.put('/update', (req, res)=>{
    if (req.body && Object.keys(req.body).length > 0) {
        let isbn = req.body.isbn;
        let titulo = req.body.titulo;
        let autor = req.body.autor;
        let genero = req.body.genero;
        let resumen = req.body.resumen;
        console.log(req.body.titulo);
        // Continuar con el procesamiento de los datos

        let sql = "UPDATE libro SET titulo = ?, autor = ?, genero = ?, resumen= ? WHERE isbn = ?"
                db.query(sql, [titulo,autor, genero, resumen, isbn], function(error, filas){
        if(error){
            throw error
        }else{              
            res.send(filas)
        }
    })
    } else {
       res.status(400).send('El cuerpo de la solicitud está vacío o no tiene los datos esperados.');
    }
    
    
})
//Eliminar articulo
app.delete('/delete/:id', (req,res)=>{
    db.query('DELETE FROM libro WHERE isbn = ?', [req.params.id], function(error, filas){
        if(error){
            throw error
        }else{              
            res.send(filas)
        }
    })
})



app.listen(3000, () =>{
    console.log("escuchando");
})