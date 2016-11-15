import React, { Component } from 'react';
import InputCustomizado from './InputCustomizado';
import $ from 'jquery';
import PubSub from 'pubsub-js';
import TratadorErros from '../TratadorErros';

class FormularioLivro extends Component {

    constructor() {
        super();
        this.state = {titulo:'', preco:0, autorId:''};
        this.enviaForm = this.enviaForm.bind(this);
        this.setTitulo = this.setTitulo.bind(this);
        this.setPreco = this.setPreco.bind(this);
        this.setAutorId = this.setAutorId.bind(this); 
    }

    setTitulo(evento) {
        this.setState({titulo:evento.target.value});
    }

    setPreco(evento) {
        this.setState({preco:evento.target.value});
    }

    setAutorId(evento) {
        this.setState({autorId:evento.target.value});
    }

    enviaForm(evento){
        evento.preventDefault();
        console.log('enviando dados livro');
        $.ajax({
            url:"http://localhost:8080/api/livros",
            contentType:"application/json",
            dataType:"json",    
            type:"post",
            data:JSON.stringify({titulo:this.state.titulo, preco:this.state.preco, autorId:this.state.autorId}),
            success:function(resposta){
                PubSub.publish('atualiza-lista-livros', resposta);
                this.setState({titulo:'',preco:'',autorId:''});
            }.bind(this),
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
                    <InputCustomizado id="titulo" type="text" nome="titulo" label="Título" value={this.state.titulo} onChange={this.setTitulo}/> 
                    <InputCustomizado id="preco" type="text" nome="preco" label="Preço" value={this.state.preco} onChange={this.setPreco}/>
                    <div className="pure-control-group">
                        <label htmlFor="autorId">Autor</label>
                        <select value={this.state.autorId} name="autorId" id="autorID" onChange={this.setAutorId}>
                            <option value="">Selecione o autor</option>
                            {
                                this.props.autores.map(autor => <option key={autor.id} value={autor.id}>{autor.nome}</option>)
                            }
                        </select>
                    </div>
                    <div className="pure-control-group">                                  
                        <label></label> 
                        <button type="submit" className="pure-button pure-button-primary">Gravar</button>                                    
                    </div>
                </form>             
              </div>
        );
    }
}

class TabelaLivros extends Component {

    render() {
        return (
            <div>            
                <table className="pure-table">
                  <thead>
                    <tr>
                      <th>Titulo</th>
                      <th>Preço</th>
                      <th>Autor</th>
                    </tr>
                  </thead>
                  <tbody>                    
                    {
                      this.props.lista.map(livro =>
                        (
                          <tr key={livro.id}>
                            <td>{livro.titulo}</td>
                            <td>{livro.preco}</td>
                            <td>{livro.autor.nome}</td>
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


export default class LivroBox extends Component {

    constructor() {
        super();
        this.state = {lista : [], autores: []};
    }

    componentDidMount(){
        $.ajax({
            url:"http://localhost:8080/api/livros",
            dataType:"json",
            success:function(resposta){        
            this.setState({lista:resposta});
            }.bind(this)
        });

        $.ajax({
            url:"http://localhost:8080/api/autores",
            dataType:"json",
            success:function(resposta){        
            this.setState({autores:resposta});
            }.bind(this)
        });

        PubSub.subscribe('atualiza-lista-livros', function(topico, novaLista) {
            this.setState({lista:novaLista});
        }.bind(this));
    }

    render() {
        return (
            <div>
                <div className="header">
                    <h1>Cadastro de livros</h1>
                </div>
                <div className="content" id="content">
                    <FormularioLivro autores={this.state.autores}/>
                    <TabelaLivros lista={this.state.lista}/>
                </div>
            </div>
        );
    }
}