import React, {Component} from 'react';
import {Row, Col,Modal} from 'react-bootstrap';

import Aux from "../../hoc/_Aux";
import Card from "../../App/components/MainCard";
import cogoToast from "cogo-toast";
import Config from "../../config"

class IndexBlackList extends Component {
  constructor(){
    super();
    this.state = {
      tb_blackList:[],
      tipoBloqueo:1,
      //modales
      estadoModalBloquear:false,
    }
    this.handleChange = this.handleChange.bind(this);
  }

  cambiarModalBloquear(){
        this.setState({
          estadoModalBloquear: !this.state.estadoModalBloquear
        })
  }

  verResultado(){
    this.cambiarModalBloquear();
  }
  clean(){
      this.setState({
        estadoModalBloquear: false,
      },()=>this.fetchBlacklist())
  }

  desbloquear(id){
    fetch(`${Config.api}usuarios/desbloquear`,
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
          cogoToast.success("desbloqueado");
          this.clean()
        }
        else{
          console.log(data)
          cogoToast.error("Error, no se pudo desbloquear");
        }
    }).catch((error)=> {
      cogoToast.error("Error, no se pudo desbloquear");
      console.log('Hubo un problema con la petición Fetch:' + error.message);
  });
}
  bloquear(id){
    fetch(`${Config.api}usuarios/desbloquear`,
      {
        mode:'cors',
        method: 'GET',
        body: JSON.stringify({
            correo : this.state.correoBloquear,
          }
        ),
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
          cogoToast.success("bloqueado");
          this.clean()
        }
        else{
          cogoToast.error("Error, no se pudo bloquear");
        }
    }).catch((error)=> {
      cogoToast.error("Error, no se pudo bloquear");
      console.log('Hubo un problema con la petición Fetch:' + error.message);
  });
}

  handleChange(e){
    const {name, value} = e.target;
    this.setState({
      [name]: value
    },()=>{
      console.log(value)
    })
  }


  fetchBlacklist(){
      fetch(`${Config.api}usuarios/bloqueados`,
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
          console.log(data)
          if(data.respuesta==true){
            this.setState({
              tb_blackList: data
            },()=>{console.log(this.state.tb_blackList)})
          }
          else{
            console.log(data)
            console.log("hubo un error con la peticion")
          }
      }).catch((error)=> {
        console.log('Hubo un problema con la petición Fetch:' + error.message);
    });  }
  componentDidMount(){
      this.fetchBlacklist();
      console.log(localStorage.getItem('token'));
    }
    render() {
        return (
            <Aux>
                <Row>
                    <Col>
                        <Card title='BlackList' isOption>
                        <table id="tb_membresia" className="table table-striped" style={{width:'100%'}}>
                            <thead>
                                <tr>
                                    <th><button className="btn btn-sm btn-info" type="button" onClick={()=>this.cambiarModalBloquear()}>Bloquear</button></th>
                                    <th><button className="btn btn-sm btn-success" type="button" onClick={()=>this.descargarExcel()}>Descargar excel</button></th>
                                </tr>
                                <tr>
                                    <th>id</th>
                                    <th>Nombres</th>
                                    <th>Apellidos</th>
                                </tr>
                              </thead>
                              <tbody>
                                   {
                                    this.state.tb_blackList.data ?
                                    this.state.tb_blackList.data.map(task =>{
                                        return (
                                            <tr key={task.id}>
                                                <td>{task.nombres}</td>
                                                <td>{task.apellidos}</td>
                                                <td>{task.correos}</td>
                                                <td>
                                                  <button className="btn btn-sm btn-success"  type="button" onClick={()=>this.desbloquear(task.id)}>
                                                    Desbloquear
                                                  </button>

                                                </td>
                                            </tr>
                                        );
                                    } )   : null
                                }
                            </tbody>
                        </table>
                        </Card>
                    </Col>
                </Row>
                <Modal
                    size="lg"
                    show={this.state.estadoModalBloquear}
                    onHide={() => this.cambiarModalBloquear()}
                    >
                    <Modal.Header closeButton>
                      <Modal.Title id="example-custom-modal-styling-title">
                        Bloquear por correo
                      </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                            <div className="card w-100">
                                <div className="modal-body">
                                    <div className="card-body text-center">
                                            <div>
                                              <select name="tipoBloqueo" style={{width: '15%'}} onChange={this.handleChange} value={this.state.tipoBloqueo}>
                                                    <option key={1} value={1}>Por correo</option>
                                                    <option key={2} value={2}>Por DNI</option>
                                              </select>
                                            </div>
                                            {
                                            this.state.tipoBloqueo==1?
                                              <div>
                                                <label>Correo:</label><br/>
                                                <input type="text" name="correoBloquear" className="form-control" onChange={this.handleChange}/>
                                              </div>
                                              :
                                              <div>
                                                <label>DNI:</label><br/>
                                                <input type="text" name="dniBloquear" className="form-control" onChange={this.handleChange}/>
                                              </div>
                                            }
                                            <div className="p-2">
                                              <button type="button" className="btn btn-primary" onClick={()=>this.bloquear()} >Bloquear</button>
                                            </div>
                                      </div>
                                  </div>
                              </div>
                    </Modal.Body>
                  </Modal>
            </Aux>
        );
    }
}

export default IndexBlackList;
