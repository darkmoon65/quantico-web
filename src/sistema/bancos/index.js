import React, {Component} from 'react';
import {Row, Col,Modal} from 'react-bootstrap';

import Aux from "../../hoc/_Aux";
import Card from "../../App/components/MainCard";
import cogoToast from "cogo-toast";
import Config from "../../config"
import Files from "../../files"

class IndexBancos extends Component {
  constructor(){
    super();
    this.state = {
      tb_bancos:[],
      //modales
      estadoModalCrearBancos:false,
      estadoModalVerBancos:false
    }
    this.handleChange = this.handleChange.bind(this);
  }

  descargarExcel(){
    Files.exportToCSV(this.state.tb_bancos.datos,"bancos");
  }

  cambiarModalCrearBancos(){
        this.setState({
          estadoModalCrearBancos: !this.state.estadoModalCrearBancos
        })
  }
  cambiarModalVerBancos(){
        this.setState({
          estadoModalVerBancos: !this.state.estadoModalVerBancos
        })
  }
  verBancos(imagen){
    this.setState({
      imagenVer:imagen
    },()=>this.cambiarModalVerBancos())
  }

  clean(){
    this.setState({
      estadoModalCrearBancos: false,
      nombreCrear:'',
      imagen:''
    },()=>this.fetchBancos())
  }

  handleChange(e){
    const {name, value} = e.target;
    this.setState({
      [name]: value
    })
  }

  crearBancos(){
    fetch(`${Config.api}banco/crear`,
      {
        mode:'cors',
        method: 'POST',
        body: JSON.stringify({
              nombre: this.state.nombreCrear,
              imagen: this.state.imagen
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
          cogoToast.success("Banco creado");
          this.clean();
        }
        else{
          cogoToast.error("Error al crear el Banco")
        }
    }).catch((error)=> {
      cogoToast.error("Hubo un error al crear el Banco")
  });
}
  eliminarBanco(id){
    fetch(`${Config.api}banco/eliminar`,
      {
        mode:'cors',
        method: 'POST',
        body: JSON.stringify({
              id:id
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
          cogoToast.success("Banco eliminado");
          this.clean();
        }
        else{
          cogoToast.error("Error al eliminar el banco")
        }
    }).catch((error)=> {
      cogoToast.error("Hubo un error al eliminar el banco")
  });
}
  fetchBancos(){
      fetch(`${Config.api}banco/mostrar`,
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
            this.setState({
              tb_bancos: data
            })
          }
      }).catch((error)=> {

    });
  }

  handleChangeFile (e){
      var file = e.target.files[0];
      var fileData = new FileReader();
      if(file){
        fileData.readAsDataURL(file);
      }
      else{
        cogoToast.warn("Se quito la imagen");
      }
      fileData.onload = (event)=> {
          this.setState({imagen: fileData.result},
            ()=>{
                cogoToast.success("Imagen lista")
              }
            );
          }

  }

  componentDidMount(){
      this.fetchBancos();
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
                                    <th><button className="btn btn-sm btn-success" type="button" onClick={()=>this.descargarExcel()}>Descargar excel</button></th>
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
                                                  <button className="btn btn-sm btn-info" type="button" onClick={()=>this.verBancos(task.imagen)}>
                                                    <i className="fa fa-eye" ></i>
                                                  </button>
                                                  <button className="btn btn-sm btn-danger" type="button" onClick={()=>this.eliminarBanco(task.id)}>
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
                        Crear Bancos
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
                                            <label>Imagen:</label><br/>
                                            <div className="input-group p-1">
                                              <input type="file" className="form-control-file" name="imagen" onChange={e =>this.handleChangeFile(e)}/>
                                            </div>
                                          </div>
                                          <div className="p-2">
                                            <button type="button" className="btn btn-primary" onClick={()=>this.crearBancos()}>Crear Banco</button>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                    </Modal.Body>
                  </Modal>
                  <Modal
                      size="lg"
                      show={this.state.estadoModalVerBancos}
                      onHide={() => this.cambiarModalVerBancos()}
                      >
                      <Modal.Header closeButton>
                        <Modal.Title id="example-custom-modal-styling-title">
                          Ver Socio
                        </Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                              <div className="card w-100">
                                  <div className="modal-body">
                                      <div className="card-body">
                                          <label>Imagen:</label><br/>
                                          <div className=" p-1">
                                            <img src={this.state.imagenVer} width="500" height="400"/>
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
