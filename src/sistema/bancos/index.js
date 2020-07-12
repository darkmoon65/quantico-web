import React, {Component} from 'react';
import {Row, Col,Modal} from 'react-bootstrap';

import Aux from "../../hoc/_Aux";
import Card from "../../App/components/MainCard";
import cogoToast from "cogo-toast";
import Config from "../../config"

class IndexBancos extends Component {
  constructor(){
    super();
    this.state = {
      tb_bancos:[],
      //modales
      estadoModalCrearBancos:false,
    }
    this.handleChange = this.handleChange.bind(this);
  }

  cambiarModalCrearBancos(){
        this.setState({
          estadoModalCrearBancos: !this.state.estadoModalCrearBancos
        })
  }

  clean(){
    this.setState({
      estadoModalCrearBancos: false,
    },()=>this.fetchContactos())
  }

  handleChange(e){
    const {name, value} = e.target;
    this.setState({
      [name]: value
    },()=>{
      console.log(value)
    })
  }
  
  crearBancos(){
    fetch(`${Config.api}contactos/crear`,
      {
        mode:'cors',
        method: 'POST',
        body: JSON.stringify({
              nombre: this.state.nombreCrear,
              numero: this.state.numeroCrear,
              cargo: this.state.cargoCrear
          }
        ),
        headers: {
            'Accept' : 'application/json',
            'Content-type' : 'application/json'
        }
      }
    )
      .then(res =>res.json())
      .then(data => {
        if(data.respuesta==true){
          cogoToast.success("Contacto creado");
          this.clean();
        }
        else{
          cogoToast.error("Error al crear el contacto")
          console.log("hubo un error con la peticion")
        }
    }).catch((error)=> {
      cogoToast.error("Hubo un error al crear el contacto")
      console.log('Hubo un problema con la petición Fetch:' + error.message);
  });
}
  eliminarContacto(id){
    fetch(`${Config.api}contactos/eliminar`,
      {
        mode:'cors',
        method: 'POST',
        body: JSON.stringify({
              id:id
          }
        ),
        headers: {
            'Accept' : 'application/json',
            'Content-type' : 'application/json'
        }
      }
    )
      .then(res =>res.json())
      .then(data => {
        if(data.respuesta==true){
          cogoToast.success("Contacto eliminado");
          this.clean();
        }
        else{
          cogoToast.error("Error al crear el contacto")
          console.log("hubo un error con la peticion")
        }
    }).catch((error)=> {
      cogoToast.error("Hubo un error al crear el contacto")
      console.log('Hubo un problema con la petición Fetch:' + error.message);
  });
}
  fetchContactos(){
      fetch(`${Config.api}contactos/mostrar`,
        {
          mode:'cors',
          method: 'GET',
          headers: {
              'Accept' : 'application/json',
              'Content-type' : 'application/json',
          }
        }
      )
        .then(res =>res.json())
        .then(data => {
          if(data.respuesta==true){
            this.setState({
              tb_bancos: data
            },()=>{console.log(this.state.tb_bancos)})
          }
          else{
            console.log(data)
            console.log("hubo un error con la peticion")
          }
      }).catch((error)=> {
        console.log('Hubo un problema con la petición Fetch:' + error.message);
    });  }
  componentDidMount(){
      this.fetchContactos();
      console.log(localStorage.getItem('token'));
    }
    render() {
        return (
            <Aux>
                <Row>
                    <Col>
                        <Card title='Bancos' isOption>
                        <table id="tb_membresia" className="table table-striped" style={{width:'100%'}}>
                            <thead>
                                <tr>
                                    <th><button type="button" className="btn btn-primary" onClick={()=>this.cambiarModalCrearBancos()}>Crear banco</button></th>
                                </tr>
                                <tr>
                                    <th>Nombre</th>
                                </tr>
                              </thead>
                              <tbody>
                                   {
                                    this.state.tb_bancos.datos ?
                                    this.state.tb_bancos.datos.map(task =>{
                                        return (
                                            <tr key={task.id}>
                                                <td>{task.nombre}</td>
                                                <td>
                                                  <button className="btn btn-sm btn-danger" type="button" onClick={()=>this.eliminarContacto(task.id)}>
                                                    <i className="fa fa-trash" ></i>
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
                    show={this.state.estadoModalCrearBancos}
                    onHide={() => this.cambiarModalCrearBancos()}
                    >
                    <Modal.Header closeButton>
                      <Modal.Title id="example-custom-modal-styling-title">
                        Crear Contactos
                      </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                            <div className="card w-100">
                                <div className="modal-body">
                                    <div className="card-body">
                                          <div>
                                            <label>Nombre:</label><br/>
                                            <input type="text" name="nombreCrear" className="form-control" onChange={this.handleChange}/>
                                          </div>
                                          <div>
                                            <label>Numero:</label><br/>
                                            <input type="number" name="numeroCrear" className="form-control" onChange={this.handleChange}/>
                                          </div>
                                          <div>
                                            <label>Cargo:</label><br/>
                                            <input type="text" name="cargoCrear" className="form-control" onChange={this.handleChange}/>
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

export default IndexBancos;
