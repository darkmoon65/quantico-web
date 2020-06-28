import React, {Component} from 'react';
import {Row, Col, Card} from 'react-bootstrap';
import Aux from "../../hoc/_Aux";
import cogoToast from "cogo-toast";

class IndexComprobantes extends Component {
  constructor(){
    super();
    this.state = {
        tb_users:[],
    }
  }

    componentDidMount(){
    //   this.fetchComprobantes();
      console.log(localStorage.getItem('token'));
    }

    render() {
        return (
            <Aux>
                <Row>
                    <Col>
                        <Card title='Registro de usuarios' isOption>
                              <table id="tb_users" className="table table-striped" style={{width:'100%'}}>
                                  <thead>
                                      <tr>
                                          <th><h4 className="card-title">Buscar</h4></th>
                                          <th><input type="text" onChange={this.handleChangeBuscador} /></th>
                                      </tr>
                                      <tr>
                                          <th>Nombres</th>
                                          <th>Apellidos</th>
                                          <th>Membresia</th>
                                          <th>Rol</th>
                                          <th>Bloqueado</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                         {
                                          this.state.tb_users.data ?
                                          this.state.tb_users.data.map(task =>{
                                              return (
                                                  <tr key={task.id}>
                                                      <td>{task.nombres}</td>
                                                      <td>{task.apellidos}</td>
                                                      <td>{task.membresia}</td>
                                                      <td>{task.rol}</td>
                                                      {task.bloqueado ?
                                                         <td>si</td>
                                                       : <td>No</td>}
                                                      <th>
                                                      <button className="btn btn-sm btn-primary ver" type="button" onClick={()=>this.editarUsers(
                                                          task.id,
                                                          task.nombres,
                                                          task.apellidos,
                                                          task.membresia,
                                                          task.membresiaId,
                                                          task.rol,
                                                          task.rolId,
                                                          task.bloqueado,
                                                      )}><i className="feather icon-trending-up"/></button>
                                                      </th>
                                                  </tr>
                                              );
                                          } )   : null
                                      }
                                  </tbody>
                                </table>

                        </Card>
                    </Col>
                </Row>
            </Aux>
        );
    }
}

export default IndexComprobantes;
