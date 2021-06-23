// ========== Dependencias ========== \\
const express = require ('express')
const app = express()
app.use(express.json())

const axios = require ('axios')

const dotenv = require('dotenv')
// dotenv.config({path:__dirname+'/../../.env'})
dotenv.config()

const moment = require('moment')



// ========== Funcoes ========== \\
function getIdade(nascimento) { // birthday is a date
    nascimento = moment(nascimento, "DD/MM/YYYY")
    let momentDif = moment().diff(nascimento, 'years')
    return momentDif
}



// ========== Variaveis ========== \\
const rotaBarramento = `${process.env.PROTOCOLO}://${process.env.MSS_BARRAMENTO}:${process.env.PORT_BARRAMENTO}`

const pingRes = {
    'nome' : process.env.MSS_CENSO,
    'protocolo' : process.env.PROTOCOLO,
    'host' : process.env.HOST,
    'porta' : process.env.PORT_CENSO
}



// ========== Rotas ========== \\
app.get(`/${process.env.MSS_CENSO}/ping`, (req, res) => {
    console.log(pingRes);
    res.send(pingRes)
})

app.get(`/${process.env.MSS_CENSO}/getCenso`, async (req, res) => {
    /*
        MODELO DO CENSO:
        censo = {
            'idade 1' : {
                'quantidade' : 3,
                'usuarios' : [
                    {usuario 1},
                    {usuario 2},
                    {usuario 3}
                ]
            },
            'idade 2' : {
                'quantidade' : 1,
                'usuarios' : [
                    {usuario 1}
                ]
            }
        }
    */

    let eventos;
    let censo = {}

    // Buscando base de usuarios
    await axios.get(rotaBarramento + '/eventos')
        .then((promisse) => {
            eventos = promisse.data
        })
        .catch((err) => {
            console.log(err)
            res.send(err)
        })
    
    // Montando censo com as idades
    eventos.forEach((evento) => {
        if(evento.tipo === 'UsuarioCadastrado') {
            let usr = evento.usuario.dados
            let idade = getIdade(usr.aniversario)
            usr.idade = idade
            if (typeof censo[idade] === 'undefined') { // Primeiro usuario com essa idade
                censo[idade] = {} // inicializando campo idade com nova idade
                console.log(usr);
                censo[idade].usuarios = [usr]
                censo[idade].quantidade = 1
            }
            else{
                censo[idade].usuarios.push(usr)
                censo[idade].quantidade++
            }
        }
    });

    // Enviando resposta
    let bodyRes = {
        'dataCensoCriado' : moment(),
        censo
    }
    console.log(bodyRes)
    res.send(bodyRes)
})

app.get(`/${process.env.MSS_CENSO}/externalRequest`, async (req, res) => {
    console.log('fazendo requisicao');
    await axios.get('http://barramento:1000/eventos')
        .then((prom) => { res.send(prom.data) })
        .catch(() => { console.log('catch'); })
    console.log('fim da requisicao');
})



// ========== Listen ========== \\
app.listen(process.env.PORT_CENSO, () => {
    console.log('MSS no ar:');
    console.log(pingRes)
});