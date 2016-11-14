import React, { Component } from 'react';
import $ from 'jquery';
import InputCustomizado from './InputCustomizado';
import PubSub from 'pubsub-js';
import TratadorErros from '../TratadorErros';

class FormularioAutor extends Component{

    constructor() {
        super();
        this.state = {nome:'',email:'',senha:''};
        this.enviaForm = this.enviaForm.bind(this);
        this.setNome  = this.setNome.bind(this);
        this.setEmail  = this.setEmail.bind(this);
        this.setSenha  = this.setSenha.bind(this);
    }

    setNome(evento) {
    this.setState({nome:evento.target.value});
    }

    setEmail(evento) {
    this.setState({email:evento.target.value});
    }

    setSenha(evento) {
    this.setState({senha:evento.target.value});
    }

    enviaForm(evento){
        evento.preventDefault();

        $.ajax({
            url:"http://localhost:8080/api/autores",
            contentType:"application/json",
            dataType:"json",    
            type:"post",
            data:JSON.stringify({nome:this.state.nome, email:this.state.email, senha:this.state.senha}),
            success:function(resposta){
                PubSub.publish('atualiza-lista-autores', resposta);
                this.setState({nome:'',email:'',senha:''});
            },
            error:function(resposta){
                if(resposta.status === 400) {
                    new TratadorErros().publicaErros(resposta.responseJSON);
                }
            },
            beforeSend: function(){
                PubSub.publish("limpa-erros",{});
            }
        });
    }

    render() {
        return (
              <div className="pure-form pure-form-aligned">
                <form className="pure-form pure-form-aligned" onSubmit={this.enviaForm} method="post">
                  <InputCustomizado id="nome" type="text" nome="nome" label="Nome" value={this.state.nome} onChange={this.setNome}/> 
                  <InputCustomizado id="email" type="email" nome="email" label="E-mail" value={this.state.email} onChange={this.setEmail}/>
                  <InputCustomizado id="senha" type="password" nome="senha" label="Senha" value={this.state.senha} onChange={this.setSenha}/>
                  <div className="pure-control-group">                                  
                    <label></label> 
                    <button type="submit" className="pure-button pure-button-primary">Gravar</button>                                    
                  </div>
                </form>             
              </div>
        );
    }
}

class TabelaAutores extends Component {

    render() {
        return (
            <div>            
                <table className="pure-table">
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>email</th>
                    </tr>
                  </thead>
                  <tbody>                    
                    {
                      this.props.lista.map(autor =>
                        (
                          <tr key={autor.id}>
                            <td>{autor.nome}</td>
                            <td>{autor.email}</td>
                          </tr>
                          )
                      )
                    }
                  </tbody>
                </table> 
              </div>
        );
    }

}

export default class AutorBox extends Component {

    constructor() {
        super();
        this.state = {lista : []};
    }

    componentDidMount(){
        $.ajax({
            url:"http://localhost:8080/api/autores",
            dataType:"json",
            success:function(resposta){        
            this.setState({lista:resposta});
            }.bind(this)
        }
        );

        PubSub.subscribe('atualiza-lista-autores', function(topico, novaLista) {
            this.setState({lista:novaLista});
        }.bind(this));
    }

    atualizaListagem(novaLista) {
        this.setState({lista:novaLista});
    }

    render() {
        return (
            <div>
                <div className="header">
                    <h1>Cadastro de autores</h1>
                </div>
                <div className="content" id="content">
                    <FormularioAutor/>
                    <TabelaAutores lista={this.state.lista}/>
                </div>
            </div>            
        );
    }
}