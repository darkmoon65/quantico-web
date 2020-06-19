import React,{Component} from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Home from './components/home'
import Login from './components/login'
import Dashboard from './components/dashboard'
import Users from './components/dashComponents/users'
import Configuracion from './components/dashComponents/config'
import Comprobantes from './components/dashComponents/comprobant'
import BlackList from './components/dashComponents/blacklist'

class App extends Component {

  constructor(){
    super();
    this.state = {
      authed: true
    }
  }


  render(){
    return(
      <Router>
        <Switch>
          <Route path='/' exact component={Home} />
          <Route path='/login' component={Login} />
          <Route
                path="/dashboard"
                render={({ match: { url } }) => (
                    <>
                      <Route path={`${url}/`} component={Dashboard} exact />
                      <Route path={`${url}/users`} component={Users} />
                      <Route path={`${url}/blacklist`} component={BlackList} />
                      <Route path={`${url}/configuracion`} component={Configuracion} />
                      <Route path={`${url}/comprobantes`} component={Comprobantes} />

                    </>
                  )}
          />
        </Switch>
      </Router>
    )
  }
}
export default App;
