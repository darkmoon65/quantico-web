import React, {Component} from 'react';
import {Row, Col,Modal} from 'react-bootstrap';

import Aux from "../../hoc/_Aux";
import Card from "../../App/components/MainCard";
import cogoToast from "cogo-toast";
import Config from "../../config"
import Files from "../../files"

class IndexHerramientas extends Component {
  constructor(){
    super();
    this.state = {
      tb_herramientas:[],
      //modales
      estadoModalCrearHerramientas:false,
      estadoModalEditarHerramientas:false
    }
    this.handleChange = this.handleChange.bind(this);
  }

  descargarExcel(){
    Files.exportToCSV(this.state.tb_herramientas.datos,"herramientas");
  }
  cambiarModalCrearHerramientas(){
        this.setState({
          estadoModalCrearHerramientas: !this.state.estadoModalCrearHerramientas
        })
  }
  cambiarModalEditarHerramientas(){
        this.setState({
          estadoModalEditarHerramientas: !this.state.estadoModalEditarHerramientas
        })
  }

  clean(){
    this.setState({
      estadoModalCrearHerramientas: false,
      estadoModalEditarHerramientas: false,
      tituloCrear:'',
      linkCrear:'',
      descripcionCrear:'',
      imagen:''
    },()=>this.fetchHerramientas())
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
            this.setState({imagen: fileData.result},
              ()=>{
                  cogoToast.success("Imagen lista")
                }
              );
        }
    }

  editarHerramienta(id,titulo,url,descripcion,imagen){

    this.setState({
      id:id,
      tituloEditar:titulo,
      linkEditar:url,
      descripcionEditar:descripcion,
      linkImagenEditar:imagen
    },()=>this.cambiarModalEditarHerramientas())
  }

  enviarEditarHerramienta(){
    fetch(`${Config.api}herramientas/editar`,
      {
        mode:'cors',
        method: 'POST',
        body: JSON.stringify({
              id:this.state.id,
              titulo: this.state.tituloEditar,
              url: this.state.linkEditar,
              descripcion: this.state.descripcionEditar,
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
          cogoToast.success("Herramienta editada");
          this.clean();
        }
        else{
          cogoToast.error("Error al editar la herramienta")
          console.log("hubo un error con la peticion")
        }
    }).catch((error)=> {
      cogoToast.error("Hubo un error al editar la herramienta")
      console.log('Hubo un problema con la petición Fetch:' + error.message);
  });
}
  crearHerramienta(){
    fetch(`${Config.api}herramientas/crear`,
      {
        mode:'cors',
        method: 'POST',
        body: JSON.stringify({
              titulo: this.state.tituloCrear,
              url: this.state.linkCrear,
              descripcion: this.state.descripcionCrear,
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
          cogoToast.success("Herramienta creada");
          this.clean();
        }
        else{
          cogoToast.error("Error al crear la herramienta")
          console.log("hubo un error con la peticion")
        }
    }).catch((error)=> {
      cogoToast.error("Hubo un error al crear la herramienta")
      console.log('Hubo un problema con la petición Fetch:' + error.message);
  });
}
  eliminarHerramienta(id){
    fetch(`${Config.api}herramientas/eliminar`,
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
          cogoToast.success("Herramienta eliminada");
          this.clean();
        }
        else{
          cogoToast.error("Error al crear la herramienta")
          console.log("hubo un error con la peticion")
        }
    }).catch((error)=> {
      cogoToast.error("Hubo un error al crear la herramienta")
      console.log('Hubo un problema con la petición Fetch:' + error.message);
  });
}
  fetchHerramientas(){
      fetch(`${Config.api}herramientas/mostrar`,
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
              tb_herramientas: data
            },()=>{console.log(this.state.tb_herramientas)})
          }
          else{
            console.log(data)
            console.log("hubo un error con la peticion")
          }
      }).catch((error)=> {
        console.log('Hubo un problema con la petición Fetch:' + error.message);
    });  }
  componentDidMount(){
      this.fetchHerramientas();
      console.log(localStorage.getItem('token'));
    }
    render() {
        return (
            <Aux>
                <Row>
                    <Col>
                        <Card title='Herramientas' isOption>
                        <table className="table table-striped" style={{width:'100%'}}>
                            <thead>
                                <tr>
                                    <th><button type="button" className="btn btn-primary" onClick={()=>this.cambiarModalCrearHerramientas()}>Crear herramienta</button></th>
                                    <th><button className="btn btn-sm btn-success" type="button" onClick={()=>this.descargarExcel()}>Descargar excel</button></th>
                                </tr>
                                <tr>
                                    <th>Titulo</th>
                                    <th>url</th>
                                </tr>
                              </thead>
                              <tbody>
                                   {
                                    this.state.tb_herramientas.datos ?
                                    this.state.tb_herramientas.datos.map(task =>{
                                        return (
                                            <tr key={task.id}>
                                                <td>{task.titulo}</td>
                                                <td>{task.url}</td>
                                                <td>
                                                  <button className="btn btn-sm btn-primary" type="button" onClick={()=>this.editarHerramienta(
                                                    task.id,
                                                    task.titulo,
                                                    task.url,
                                                    task.descripcion,
                                                    task.imagen
                                                  )}>
                                                    <i className="fa fa-pencil" ></i>
                                                  </button>
                                                  <button className="btn btn-sm btn-danger" type="button" onClick={()=>this.eliminarHerramienta(task.id)}>
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
                    show={this.state.estadoModalCrearHerramientas}
                    onHide={() => this.cambiarModalCrearHerramientas()}
                    >
                    <Modal.Header closeButton>
                      <Modal.Title id="example-custom-modal-styling-title">
                        Crear Herramienta
                      </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                            <div className="card w-100">
                                <div className="modal-body">
                                    <div className="card-body">
                                          <div>
                                            <label>Titulo:</label><br/>
                                            <input type="text" name="tituloCrear" className="form-control" onChange={this.handleChange}/>
                                          </div>
                                          <div>
                                            <label>Link:</label><br/>
                                            <input type="text" name="linkCrear" className="form-control" onChange={this.handleChange}/>
                                          </div>
                                          <div>
                                            <label>Descripcion:</label><br/>
                                            <input type="text" name="descripcionCrear" className="form-control" onChange={this.handleChange}/>
                                          </div>
                                          <div>
                                            <label>Imagen:</label><br/>
                                            <input type="file" className="form-control-file" name="imagenCrear" onChange={e =>this.handleChangeFile(e)}/>
                                          </div>
                                          <div className="p-2">
                                            <button type="button" className="btn btn-primary" onClick={()=>this.crearHerramienta()} >Crear herramienta</button>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                    </Modal.Body>
                  </Modal>
                  <Modal
                      size="lg"
                      show={this.state.estadoModalEditarHerramientas}
                      onHide={() => this.cambiarModalEditarHerramientas()}
                      >
                      <Modal.Header closeButton>
                        <Modal.Title id="example-custom-modal-styling-title">
                          Editar Herramienta
                        </Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                              <div className="card w-100">
                                  <div className="modal-body">
                                      <div className="card-body">
                                            <div>
                                              <label>Titulo:</label><br/>
                                              <input type="text" name="tituloEditar" className="form-control" onChange={this.handleChange} value={this.state.tituloEditar} />
                                            </div>
                                            <div>
                                              <label>Link:</label><br/>
                                              <input type="text" name="linkEditar" className="form-control" onChange={this.handleChange} defaultValue={this.state.linkEditar}/>
                                            </div>
                                            <div>
                                              <label>Descripcion:</label><br/>
                                              <input type="text" name="descripcionEditar" className="form-control" onChange={this.handleChange} defaultValue={this.state.descripcionEditar}/>
                                            </div>
                                            <div>
                                              <label>Imagen actual:</label><br/>
                                              <img src={this.state.linkImagenEditar} width="400" height="400"/>
                                              <div>
                                                <label>Nueva imagen:</label><br/>
                                                <input type="file" className="form-control-file" name="imagen" onChange={e =>this.handleChangeFile(e)}/>
                                              </div>
                                            </div>
                                            <div className="p-2">
                                              <button type="button" className="btn btn-primary" onClick={()=>this.enviarEditarHerramienta()} >Guardar</button>
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

export default IndexHerramientas;
