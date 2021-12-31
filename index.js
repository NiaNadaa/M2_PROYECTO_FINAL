const express = require("express");
const app = express();
const mongodb = require("mongodb");

app.use(express.static('public'));
app.use(express.urlencoded({extended: false}))
app.use(express.json())


let MongoClient = mongodb.MongoClient;

MongoClient.connect( "mongodb://localhost:27017", function(err, client){
    if(err!=null) {
        console.log(err);
        console.log("No se ha podido conectar con MongoDB");
    }
    else {
        app.locals.db= client.db("proyecto");
        console.log("MongoDB conectado");
    }});


//ROUTES

app.get("/api", async (req, res) => {
  app.locals.db.collection('libros').find().toArray(
    function(err, data){
        if(err) {
        res.send({error: err});
        } else {
        res.send(data);
    }
  });
});

app.post("/api/uploadBook", (req, res) => {
  let titulo = req.body.titulo
  let autor = req.body.autor
  let year = req.body.year
  let libro={
    "titulo":titulo,
    "autor":autor,
    "year":year
  }

  app.locals.db.collection('libros').insertOne( libro,
    function(err,data){
      if(err) {
        res.send({error:err });
      } else {
        res.send({ result: data });
      }
  });
});

app.delete("/api/deleteBook", function(req, res) {
    app.locals.db.collection('libros').deleteMany({ titulo:req.body.titulo},
    function(err, data) {
      if(err) {
        res.send({ error:err });
      }
    else {
      res.send({result: data});
    }
  });
});

app.put("/api/editBook", function(req, res) {
  app.locals.db.collection('libros').updateOne({ titulo:req.body.titulo},
  { $set: req.body },
    function(err, data) {
        if(err) {
          res.send({ error:err });
        }
        else {
          res.send({result: data});
      }
  });
});

app.listen(process.env.PORT || 3000)
