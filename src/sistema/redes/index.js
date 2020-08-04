import React, {Component} from 'react';
import {Row, Col,Modal} from 'react-bootstrap';

import Aux from "../../hoc/_Aux";
import Card from "../../App/components/MainCard";
import cogoToast from "cogo-toast";
import Config from "../../config"
import Files from "../../files"

class IndexRedes extends Component {
  constructor(){
    super();
    this.state = {
      tb_redes:[],
      //modales
      estadoModalCrearRed:false,
      estadoModalVerRed:false
    }
    this.handleChange = this.handleChange.bind(this);
  }
  descargarExcel(){
    Files.exportToCSV(this.state.tb_redes.datos,"redes");
  }
  cambiarModalCrearRed(){
        this.setState({
          estadoModalCrearRed: !this.state.estadoModalCrearRed
        })
  }
  cambiarModalVerRed(){
        this.setState({
          estadoModalVerRed: !this.state.estadoModalVerRed
        })
  }
  verRed(id,nombre,url,imagen){
    this.setState({
        id:id,
        nombreEditar:nombre,
        urlEditar: url,
        imagenVer: imagen
    },()=>this.cambiarModalVerRed())
  }
  clean(){
    this.setState({
      estadoModalCrearRed: false,
      estadoModalVerRed:false,
      nombreCrear:'',
      urlCrear:'',
      imagenCrear:null
    },()=>this.fetchRedes())
  }

  handleChange(e){
    const {name, value} = e.target;
    this.setState({
      [name]: value
    },()=>{
      console.log(value)
    })
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
            this.setState({imagenCrear: fileData.result},
              ()=>{
                  cogoToast.success("Imagen  lista")
                }
              );
            }
    }

  crearRed(){
    fetch(`${Config.api}redSocial/crear`,
      {
        mode:'cors',
        method: 'POST',
        body: JSON.stringify({
              nombre: this.state.nombreCrear,
              url: this.state.urlCrear,
              imagen: this.state.imagenCrear
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
          cogoToast.success("red social creado");
          this.clean();
        }
        else{
          cogoToast.error("Error al crear el red social")
          console.log("hubo un error con la peticion")
        }
    }).catch((error)=> {
      cogoToast.error("Hubo un error al crear el red social")
      console.log('Hubo un problema con la petición Fetch:' + error.message);
  });
}
  editarRed(){
    fetch(`${Config.api}redSocial/editar`,
      {
        mode:'cors',
        method: 'POST',
        body: JSON.stringify({
              id: this.state.id,
              nombre: this.state.nombreEditar,
              url: this.state.urlEditar,
              imagen: this.state.imagenCrear
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
          cogoToast.success("red social creado");
          this.clean();
        }
        else{
          cogoToast.error("Error al crear el red social")
          console.log("hubo un error con la peticion")
        }
    }).catch((error)=> {
      cogoToast.error("Hubo un error al crear el red social")
      console.log('Hubo un problema con la petición Fetch:' + error.message);
  });
}
  eliminarRed(id){
    fetch(`${Config.api}redSocial/eliminar`,
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
          cogoToast.success("red social eliminado");
          this.clean();
        }
        else{
          cogoToast.error("Error al crear el red social")
          console.log("hubo un error con la peticion")
        }
    }).catch((error)=> {
      cogoToast.error("Hubo un error al crear el red social")
      console.log('Hubo un problema con la petición Fetch:' + error.message);
  });
}
  fetchRedes(){
      fetch(`${Config.api}redSocial/mostrar`,
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
              tb_redes: data
            },()=>{console.log(this.state.tb_redes)})
          }
          else{
            console.log(data)
            console.log("hubo un error con la peticion")
          }
      }).catch((error)=> {
        console.log('Hubo un problema con la petición Fetch:' + error.message);
    });  }
  componentDidMount(){
      this.fetchRedes();
      console.log(localStorage.getItem('token'));
    }
    render() {
        return (
            <Aux>
                <Row>
                    <Col>
                        <Card title='Enlaces' isOption>
                        <table id="tb_membresia" className="table table-striped" style={{width:'100%'}}>
                            <thead>
                                <tr>
                                    <th><h4 className="card-title">Buscar </h4></th>
                                    <th><input type="text" onChange={this.handleChangeBuscador} /></th>
                                    <th><button type="button" className="btn btn-primary" onClick={()=>this.cambiarModalCrearRed()}>Crear Enlaces</button></th>
                                    <th><button className="btn btn-sm btn-success" type="button" onClick={()=>this.descargarExcel()}>Descargar excel</button></th>
                                </tr>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Url</th>
                                </tr>
                              </thead>
                              <tbody>
                                   {
                                    this.state.tb_redes.datos ?
                                    this.state.tb_redes.datos.map(task =>{
                                        return (
                                            <tr key={task.id}>
                                                <td>{task.nombre}</td>
                                                <td>{task.url}</td>
                                                <td>
                                                  <button className="btn btn-sm btn-info" type="button" onClick={()=>this.verRed(
                                                    task.id,
                                                    task.nombre,
                                                    task.url,
                                                    task.imagen
                                                  )}>
                                                    <i className="fa fa-pencil" ></i>
                                                  </button>
                                                  <button className="btn btn-sm btn-danger" type="button" onClick={()=>this.eliminarRed(task.id)}>
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
                    show={this.state.estadoModalCrearRed}
                    onHide={() => this.cambiarModalCrearRed()}
                    >
                    <Modal.Header closeButton>
                      <Modal.Title id="example-custom-modal-styling-title">
                        Crear Enlace
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
                                            <label>Url:</label><br/>
                                            <input type="text" name="urlCrear" className="form-control" onChange={this.handleChange}/>
                                          </div>
                                          <div className="input-group p-1">
                                            <label>Imagen:</label><br/>
                                            <input type="file" className="form-control-file" name="imagenCrear" onChange={e =>this.handleChangeFile(e)}/>
                                          </div>
                                          <div className="p-2">
                                            <button type="button" className="btn btn-primary" onClick={()=>this.crearRed()} >Crear Enlace</button>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                    </Modal.Body>
                  </Modal>
                  <Modal
                      size="lg"
                      show={this.state.estadoModalVerRed}
                      onHide={() => this.cambiarModalVerRed()}
                      >
                      <Modal.Header closeButton>
                        <Modal.Title id="example-custom-modal-styling-title">
                          Editar Enlace
                        </Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                              <div className="card w-100">
                                  <div className="modal-body">
                                      <div className="card-body">


                                          <div>
                                            <label>Nombre:</label><br/>
                                            <input type="text" name="nombreEditar" className="form-control" onChange={this.handleChange} defaultValue={this.state.nombreEditar}/>
                                          </div>
                                          <div>
                                            <label>Url:</label><br/>
                                            <input type="text" name="urlEditar" className="form-control" onChange={this.handleChange} defaultValue={this.state.urlEditar}/>
                                          </div>
                                          <div className=" p-1">
                                            <label>Imagen(Actual):</label><br/>
                                            <img src={this.state.imagenVer} width="400" height="400"/>
                                          </div>
                                          <div className="input-group p-1">
                                            <label>Imagen(Nueva):</label><br/>
                                            <input type="file" className="form-control-file" name="imagenCrear" onChange={e =>this.handleChangeFile(e)}/>
                                          </div>
                                          <div className="p-2">
                                            <button type="button" className="btn btn-primary" onClick={()=>this.editarRed()} >Guardar cambios</button>
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

export default IndexRedes;
