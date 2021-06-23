// require('dotenv').config({path: __dirname + '/../.env'});
require('dotenv').config();
const express = require('express');
const app = express();
app.use(express.json());
const axios = require('axios');

// Zerando o contador (cada cadastro vai ter um id)
contador = 0;

// Banco de dados (volátil)
const baseUsuarios = [];

const funcoes = {
    CalcularIdade: (aniversario) => {

        var data = new Date();
        var idade = 0;
        var niver_formatado = aniversario.split('/');
  
        var dia = Number(niver_formatado[0]);
        var mes = Number(niver_formatado[1]);
        var ano = Number(niver_formatado[2]);
  
        var dif_ano = data.getFullYear() - ano;
        var dif_mes = data.getMonth() - mes;
        var dif_dia = data.getDay() - dia;
        
       if (dif_mes < 0){
           idade = dif_ano - 1;
       }
       else if (dif_mes === 0){
          if (dif_dia < 0){
            idade = dif_ano - 1;
        } else{
          idade = dif_ano;
        }
       }
       else if (dif_mes > 0){
         idade = dif_ano;
       };
  
       return idade;
  
      },
}


// Apresentando os dados pro cliente
app.get('/usuarios', (req, res) => {
    res.send(baseUsuarios);
});

app.put('/cadastrar', async (req, res) => {

    let rg_existe = false;

    // Tratamento necessário para evitar usuários duplicados no banco de dados
    baseUsuarios.forEach(usuario => {
        if(usuario.usuario.RG === req.body.RG){
            rg_existe = true;
            return res.status(403).send({msg: "O usuário já existe no banco de dados."});
        }
    });

    if(!rg_existe){

        idade_usuario = funcoes.CalcularIdade(req.body.aniversario);

        baseUsuarios[contador] = {
            contador, usuario: req.body
        }

      
    // Enviando para o barramento de eventos
    await axios.post(`http://${process.env.MSS_BARRAMENTO}:${process.env.PORT_BARRAMENTO}/eventos`, {
        tipo: "UsuarioCadastrado",
        usuario: { id: contador, idade: idade_usuario, dados: req.body}
    });
    
    contador++;

    res.status(201).send({msg: "Usuário criado com sucesso!"});
    }

});

// Por enquanto, não faz nada com o evento, só recebe e printa
app.post('/eventos', (req, res) => {
    console.log("Evento ok");
  });
  
app.listen(process.env.PORT_CADASTRO, () => console.log(`Microsservico de Cadastro. Porta ${process.env.PORT_CADASTRO}.`));