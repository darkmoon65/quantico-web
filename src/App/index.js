import React, { Component, Suspense } from 'react';
import { Switch, Route } from 'react-router-dom';
import Loadable from 'react-loadable';

import '../../node_modules/font-awesome/scss/font-awesome.scss';

import Loader from './layout/Loader'
import Aux from "../hoc/_Aux";
import ScrollToTop from './layout/ScrollToTop';
import routes from "../route";
import IndexLogin from '../sistema/login/index';
import Config from "../config"

const AdminLayout = Loadable({
    loader: () => import('./layout/AdminLayout'),
    loading: Loader
});



class App extends Component {

    constructor(){
      super();
      this.state={
        logged: localStorage.getItem('token')
      }
    }
    agregarNumeros(verificaciones,comprobantes,completos,usuarios){
        localStorage.setItem('verificaciones',verificaciones);
        localStorage.setItem('comprobantes',comprobantes);
        localStorage.setItem('completos',completos);
        localStorage.setItem('usuarios',usuarios);
    }
    fetchNumeros(){
         fetch(`${Config.api}verificaciones/totales`,
              {
                mode:'cors',
                method: 'GET',
                headers: {
                    'Accept' : 'application/json',
                    'Content-type' : 'application/json',
                    'api_token': localStorage.getItem('token')
                }
              }
            )
              .then(res =>res.json())
              .then(data => {
                if(data.respuesta==true){
                  this.agregarNumeros(data.sinVerificar,data.sinComprobante,data.completos,data.usuarios)
                }
                else{
                  console.log(data)
                  console.log("hubo un error con la peticion")
                }
            }).catch((error)=> {
              console.log('Hubo un problema con la petición Fetch:' + error.message);
          });  }
    componentDidMount(){
        this.fetchNumeros()
    }

    render() {
        const menu = routes.map((route, index) => {
          return (route.component) ? (
              <Route
                  key={index}
                  path={route.path}
                  exact={route.exact}
                  name={route.name}
                  render={props => (
                      <route.component {...props} />
                  )} />
          ) : (null);
        });

        return (
            localStorage.getItem('token') === null
            ?<IndexLogin/>
            :<Aux>
                <ScrollToTop>
                    <Suspense fallback={<Loader/>}>
                        <Switch>
                            {menu}
                            <Route path="/" component={AdminLayout} />
                        </Switch>
                    </Suspense>
                </ScrollToTop>
            </Aux>
        );
    }
}

export default App;
