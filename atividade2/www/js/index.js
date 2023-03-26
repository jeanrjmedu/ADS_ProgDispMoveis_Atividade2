var serviceAddress = 'http://127.0.0.1:8069/';

class CaixaMensagemEnvio {
    criarCaixa(mensagem){
        let canvasMensagem = document.createElement('div');
        canvasMensagem.id = 'canvasMensagens'
        canvasMensagem.classList.add('canvasMensagem');

        let caixaMensagem = document.createElement('div');
        caixaMensagem.id = 'caixaMensagem'
        caixaMensagem.classList.add('caixaMensagem');
        caixaMensagem.classList.add('caixaMensagemNeutra');
        caixaMensagem.innerHTML = mensagem;
        
        let caixaComponente = document.createElement('div');
        caixaComponente.id = 'caixaComponente'
        caixaComponente.classList.add('caixaComponente');
        caixaMensagem.appendChild(caixaComponente);

        canvasMensagem.appendChild(caixaMensagem);
        document.body.appendChild(canvasMensagem);
    }

    atualizarMensagemErro(mensagem){
        let caixaMensagem = document.getElementById('caixaMensagem');
        caixaMensagem.classList.remove('caixaMensagemNeutra');
        caixaMensagem.classList.add('caixaMensagemErro');
        caixaMensagem.innerHTML = mensagem;

        setTimeout(()=> this.destruir(), 1000);
    }

    atualizarMensagemSucesso(mensagem, eventoFechar){
        let caixaMensagem = document.getElementById('caixaMensagem');
        caixaMensagem.classList.remove('caixaMensagemNeutra');
        caixaMensagem.classList.add('caixaMensagemSucesso');
        caixaMensagem.innerHTML = mensagem;
        
        setTimeout(()=> {
            this.destruir().then(()=> window.open('index.php', '_self'));
        }, 1000);
    }

    async destruir(){
        document.getElementById('canvasMensagens').remove();
    }

}

class Servico {
    constructor(){
        this.caixaMensagem = new CaixaMensagemEnvio();
        this.bios = {};
    }

    async cadastraBio(){

        setTimeout(()=>{
            const fotoUpload = document.getElementById('fotoUpload').files[0];
            const nomeForm = document.getElementById('nomeForm').value;
            const idadeForm = document.getElementById('idadeForm').value;
            const profissaoForm = document.getElementById('profissaoForm').value;
            const bioForm = document.getElementById('bioForm').value;

            let formData = new FormData();           
            formData.append('file', fotoUpload);
            formData.append('nome', nomeForm);
            formData.append('idade', idadeForm);
            formData.append('profissao', profissaoForm);
            formData.append('bio', bioForm);

            fetch(serviceAddress+'atividade2/service/cadastrabio.php', {
                method: "POST", 
                body: formData
            }).then(response=>{
                if(response.status == 200){
                    this.obtemBios();
                }
            });   
        }, 2000);
    }

    montarBios(){
        let registrosElement = document.getElementById("registros");
        registrosElement.innerHTML = "";
        
        if(this.bios){
            let bios = this.bios;
            bios.forEach((bio, index) =>{
                let registroElement =  document.createElement('div');
                registroElement.id = 'registro_' + index;
                registroElement.classList.add('registro');	
                
                let fotoElement =  document.createElement('div');
                fotoElement.classList.add('foto');
                fotoElement.style.backgroundImage = 'url("'+serviceAddress+'atividade2/service/'+bio.foto+'")';
                fotoElement.style.backgroundPosition = 'center';
                fotoElement.style.backgroundRepeat = 'no-repeat';
                fotoElement.style.backgroundSize = '120px 140px';
                registroElement.appendChild(fotoElement);
                
                let nomeElement =  document.createElement('div');
                nomeElement.classList.add('txts');
                nomeElement.classList.add('nome');
                nomeElement.innerHTML = bio.nome;
                registroElement.appendChild(nomeElement);
                
                let idadeElement =  document.createElement('div');
                idadeElement.classList.add('txts');
                idadeElement.classList.add('info');
                idadeElement.innerHTML = bio.idade + " anos";
                registroElement.appendChild(idadeElement);
                
                let profissaoElement =  document.createElement('div');
                profissaoElement.classList.add('txts');
                profissaoElement.classList.add('info');
                profissaoElement.innerHTML = bio.profissao;
                registroElement.appendChild(profissaoElement);
                
                let bioElement =  document.createElement('div');
                bioElement.classList.add('txts');
                bioElement.classList.add('bio');
                bioElement.innerHTML = bio.bio;
                registroElement.appendChild(bioElement);
                
                registrosElement.appendChild(registroElement);
            });
        }else{
            registrosElement.innerHTML =  "Nenhum bio cadastrado";
            registrosElement.style.textAlign = 'center';
        }
    }
    
    obtemBios(){
        fetch(serviceAddress+'atividade2/service/obtembios.php').then(async response=>{
            this.bios = await response.json();
            this.montarBios();
        });   
    }

}


var servico = new Servico();
			
function adicionarComportamento(){
    //mudar comportamento
    document.getElementById('botaoAdicionar').addEventListener('click', ()=> {
        document.getElementById('areaCad').classList.remove('areaCadastroOut');
        setTimeout(()=>{
            document.getElementById('canvasCadastro').classList.remove('cadastroHide');
            document.getElementById('areaCad').classList.add('areaCadastroIn');  
        },500)
    });

    document.getElementById('btnCadastra').addEventListener('click', ()=> {
        servico.cadastraBio();
        document.getElementById('areaCad').classList.remove('areaCadastroIn');
        setTimeout(()=>{
            document.getElementById('canvasCadastro').classList.add('cadastroHide');
            document.getElementById('areaCad').classList.add('areaCadastroOut');
        },500)
    });
}

document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    adicionarComportamento();
    servico.obtemBios();
}
