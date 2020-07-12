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
      nombreCrear:'',
      imagen:''
    },()=>this.fetchBancos())
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
            'Content-type' : 'application/json'
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
          console.log("hubo un error con la peticion")
        }
    }).catch((error)=> {
      cogoToast.error("Hubo un error al crear el Banco")
      console.log('Hubo un problema con la petición Fetch:' + error.message);
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
            'Content-type' : 'application/json'
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
          cogoToast.error("Error al crear el banco")
          console.log("hubo un error con la peticion")
        }
    }).catch((error)=> {
      cogoToast.error("Hubo un error al crear el banco")
      console.log('Hubo un problema con la petición Fetch:' + error.message);
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
                cogoToast.success("Imagen de tarjeta lista")
              }
            );
          }
      
  }
  
  componentDidMount(){
      this.fetchBancos();
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
            </Aux>
        );
    }
}

export default IndexBancos;
