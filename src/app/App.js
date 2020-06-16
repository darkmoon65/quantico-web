import React,{Component} from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Home from './components/home'
import Login from './components/login'
import Dashboard from './components/dashboard'

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
        </Switch>
        </Router> 
    )
  }
}
export default App;
