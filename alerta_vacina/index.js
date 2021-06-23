const express = require('express');
const app = express();
app.use(express.json());
const axios = require('axios');
require('dotenv').config();

const baseIdades = {};
const baseAlertas = {};
const baseRG = {};

vacDisp = false;
contador = 0;
id = 0;
id_alerta = 0;

const funcoes = {
    GerarAlerta: (idade_user, idade_vacina) => {
      if (idade_user === idade_vacina){
        return true;
      }
      else{
        return false;
      }
    }
  };

// Printa as idades dos usuários cadastrados
app.get('/idades', (req, res) => {

  res.send(baseIdades);

  })

// Requisição que vai informar aos alertas a faixa etária que vai ser vacinada
app.put('/alertar',  (req, res) => {

  faixa = req.body.idade;

  if(Object.keys(baseAlertas).length !== 0){

    for (id = 0; id < Object.keys(baseIdades).length; id++) {

      baseIdades[id].verificado = "Idade ainda não verificada.";
      baseAlertas[id].status = "A definir";
  
    }
    
  }

  res.status(201).send({msg: "Faixa etária alterada com sucesso!"})

})

// Requisição que vai informar o status dos alertas dos usuários
app.get('/alertas', async (req, res) => {

for (id = 0; id < Object.keys(baseIdades).length; id++) {

  if(baseIdades[id].verificado === "Idade ainda não verificada."){ 

    status = "A definir";
    RG = baseIdades[id].rg;

    baseAlertas[id] = {
      id, RG, status
    }

    msg = funcoes.GerarAlerta(baseIdades[id].idade, faixa);

      if(msg){
        baseAlertas[id].status = "Sua vacina está disponível!"
      }
      else{
        baseAlertas[id].status = "Infelizmente, sua vacina ainda não está disponível."
      }

  baseIdades[id].verificado = "Idade do usuário já verificada.";

  id_alerta++;

  }
 }

res.send(baseAlertas);

})

// Estabelece a conexão entre o MSS e o endpoint do barramento; precisa ter "um em cada lado"
// Percorre um evento de cada vez (o array)

app.post('/eventos', (req, res) => {

  if(req.body.tipo === "UsuarioCadastrado"){
    
    rg = req.body.usuario.dados.RG;
    idade = req.body.usuario.idade;
    verificado = "Idade ainda não verificada.";

    baseIdades[contador] = {
    rg, idade, verificado
   };

    contador++;
  }
})

app.listen(process.env.PORT_ALERTA, async () => {
    
  try {
    const resp = await axios.get(`http://${process.env.MSS_BARRAMENTO}:${process.env.PORT_BARRAMENTO}/eventos`)
    resp.data.forEach((valor, indice, colecao) => {
      try{
        funcoes[valor.tipo](usuarios.usuario)
      } catch (err){}
  })
  }
  catch (err) {
    console.log(err);
  }
   
  console.log(`Microsservico de Alerta de Vacinas. Porta ${process.env.PORT_ALERTA}.`)

});