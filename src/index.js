import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import AutorBox from './componentes/Autor'
import LivroBox from './componentes/Livro'
import Home from './componentes/Home'
import {Router,Route, browserHistory, IndexRoute} from 'react-router';

ReactDOM.render(
  (<Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Home}/>
      <Route path="/autor" component={AutorBox}/>
      <Route path="/livro" component={LivroBox}/>
    </Route>  
  </Router>),
  document.getElementById('root')
);
