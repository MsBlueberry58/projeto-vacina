const express = require('express');
const app = express();
app.use(express.json());
const axios = require('axios');
// require('dotenv').config({path: __dirname + '/../.env'});
require('dotenv').config();

const eventos = [];


app.post('/eventos', (req, res) => {

    const evento = req.body;
    eventos.push(evento);

    // Envia o evento para o mss de alerta de vacinas
    axios.post(`http://${process.env.MSS_ALERTA}:${process.env.PORT_ALERTA}/eventos`, evento);

    // Envia o evento para o mss de cadastro
    axios.post(`http://${process.env.MSS_CADASTRO}:${process.env.PORT_CADASTRO}/eventos`, evento);

    res.status(200).send({msg: 'Deu tudo certo'});
});

app.get('/eventos', (req, res) => {
    res.send(eventos);
})

app.listen(process.env.PORT_BARRAMENTO, () => console.log(`Microsservico de Barramento de Eventos. Porta ${process.env.PORT_BARRAMENTO}.`));