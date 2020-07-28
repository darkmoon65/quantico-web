import React, {Component} from 'react';
import {Row, Col,Modal} from 'react-bootstrap';

import Aux from "../../hoc/_Aux";
import Card from "../../App/components/MainCard";
import cogoToast from "cogo-toast";
import Config from "../../config"
import Files from "../../files"

class IndexInversiones extends Component {
  constructor(){
    super();
    this.state = {
      tb_inversiones:[],
      tipoInversionesId: 1,
      descrip:false,
      //modales
      estadoModalEditarInversiones:false,
      estadoModalCrearInversiones:false
    }
    this.handleChange = this.handleChange.bind(this);
  }
  descargarExcel(){
    Files.exportToCSV(this.state.tb_inversiones.datos,"inversiones");
  }
  cambiarModalEditarInversiones(){
        this.setState({
          estadoModalEditarInversiones: !this.state.estadoModalEditarInversiones
        })
  }
  cambiarModalCrearInversiones(){
        this.setState({
          estadoModalCrearInversiones: !this.state.estadoModalCrearInversiones
        })
  }


  clean(){
    this.setState({
      estadoModalEditarInversiones: false,
      estadoModalCrearInversiones:false,
      tipoInversionesId:1,
      cargoCrear:''
    },()=>this.fetchInversiones())
  }

  handleChange(e){
    const {name, value} = e.target;
    if (name == "tipoInversionesId" && value == 1){
      this.setState({
        descrip: false,
        descripcionCrear: null
      })
    }
    if (name == "tipoInversionesId" && value == 2){
      this.setState({
        descrip: true,
      })
    }

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
                  cogoToast.success("Imagen lista")
                }
              );
          }
    }

  editarInversiones(id,tipoInversion_id,titulo,imagen,linkVideo,linkDetalles,descripcion){
    let estado
    if (tipoInversion_id == 1){
      estado = false
    }
    else{
      estado = true
    }

    this.setState({
      id:id,
      descrip: estado,
      tipoInversionesId:tipoInversion_id,
      tituloEditar:titulo,
      linkImagenEditar: imagen,
      linkVideoEditar: linkVideo,
      linkDetallesEditar: linkDetalles,
      descripcionEditar: descripcion
    },()=>this.cambiarModalEditarInversiones())
  }

  crearInversiones(){
    fetch(`${Config.api}inversiones/crear`,
      {
        mode:'cors',
        method: 'POST',
        body: JSON.stringify({
              tipoInversion: this.state.tipoInversionesId,
              titulo: this.state.TituloCrear,
              imagen: this.state.imagenCrear,
              linkVideo: this.state.linkVideoCrear,
              linkDetalles: this.state.linkDetallesCrear,
              descripcion: this.state.descripcionCrear
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
          cogoToast.success("Inversion creada");
          this.clean();
        }
        else{
          cogoToast.error("Error al crear la inversion")
          console.log("hubo un error con la peticion")
        }
    }).catch((error)=> {
      cogoToast.error("Hubo un error al crear la inversion")
      console.log('Hubo un problema con la petición Fetch:' + error.message);
  });
}
  enviarEditarInversiones(){
    fetch(`${Config.api}inversiones/editar`,
      {
        mode:'cors',
        method: 'POST',
        body: JSON.stringify({
              id: this.state.id,
              tipoInversion: this.state.tipoInversionesId,
              titulo: this.state.tituloEditar,
              imagen: this.state.imagenCrear,
              linkVideo: this.state.linkVideoEditar,
              linkDetalles: this.state.linkDetallesEditar,
              descripcion: this.state.descripcionEditar
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
          cogoToast.success("Inversion editada");
          this.clean();
        }
        else{
          cogoToast.error("Error al editar la inversion")
          console.log("hubo un error con la peticion")
        }
    }).catch((error)=> {
      cogoToast.error("Hubo un error al editar la inversion")
      console.log('Hubo un problema con la petición Fetch:' + error.message);
  });
}

  eliminarInversiones(id){
    fetch(`${Config.api}inversiones/eliminar`,
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
          cogoToast.success("Inversion eliminada");
          this.clean();
        }
        else{
          cogoToast.error("Error al crear la inversion")
          console.log("hubo un error con la peticion")
        }
    }).catch((error)=> {
      cogoToast.error("Hubo un error al crear la inversion")
      console.log('Hubo un problema con la petición Fetch:' + error.message);
  });
}
  fetchInversiones(){
      fetch(`${Config.api}inversiones/mostrar`,
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
              tb_inversionesH: data
            },()=>{
              console.log(this.state.tb_inversionesH)
              this.limpiarInversiones()
            })
          }
          else{
            console.log(data)
            console.log("hubo un error con la peticion")
          }
      }).catch((error)=> {
        console.log('Hubo un problema con la petición Fetch:' + error.message);
    });  }

    limpiarInversiones(){
      let array = this.state.tb_inversionesH
      let newArray = []
      array.datos.map((data)=>{
        let integracion
        if (data.tipoInversion_id == 1){
            integracion = "Público"
        }else{
            integracion= "Inversiones Quantico"
        }
        newArray.push({
          id:data.id,
          texto:data.texto,
          tipoInversion_id:data.tipoInversion_id,
          tipoInversionNombre: integracion,
          nombre: data.nombre,
          titulo: data.titulo,
          imagen: data.imagen,
          linkVideo:data.linkVideo,
          linkDetalles: data.linkDetalles,
          descripcion: data.descripcion

        })
      })
      this.setState({
        tb_inversiones: newArray
      },()=>console.log(this.state.tb_inversiones))
    }

  componentDidMount(){
      this.fetchInversiones();
      console.log(localStorage.getItem('token'));
    }
    render() {
        return (
            <Aux>
                <Row>
                    <Col>
                        <Card title='Inversiones' isOption>
                        <table id="tb_membresia" className="table table-striped" style={{ width:'100%'}}>
                            <thead>
                                <tr>
                                    <th><button type="button" className="btn btn-primary" onClick={()=>this.cambiarModalCrearInversiones()}>Crear Inversiones</button></th>
                                    <th><button className="btn btn-sm btn-success" type="button" onClick={()=>this.descargarExcel()}>Descargar excel</button></th>
                                </tr>
                                <tr>
                                    <th>Titulo</th>
                                    <th>Tipo de inversion</th>
                                </tr>
                              </thead>
                              <tbody>
                                   {
                                    this.state.tb_inversiones ?
                                    this.state.tb_inversiones.map(task =>{
                                        return (
                                            <tr key={task.id}>
                                                <td>{task.titulo}</td>
                                                <td>{task.tipoInversionNombre}</td>
                                                <td>
                                                  <button className="btn btn-sm btn-primary" type="button" onClick={()=>this.editarInversiones(
                                                    task.id,
                                                    task.tipoInversion_id,
                                                    task.titulo,
                                                    task.imagen,
                                                    task.linkVideo,
                                                    task.linkDetalles,
                                                    task.descripcion
                                                  )}>
                                                    <i className="fa fa-pencil" ></i>
                                                  </button>
                                                  <button className="btn btn-sm btn-danger" type="button" onClick={()=>this.eliminarInversiones(task.id)}>
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
                    show={this.state.estadoModalCrearInversiones}
                    onHide={() => this.cambiarModalCrearInversiones()}
                    >
                    <Modal.Header closeButton>
                      <Modal.Title id="example-custom-modal-styling-title">
                        Crear Inversiones
                      </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                            <div className="card w-100">
                                <div className="modal-body">
                                    <div className="card-body">

                                          <div>
                                            <label>Tipo de inversiones:</label><br/>
                                            <select className="form-control" name="tipoInversionesId" onChange={this.handleChange} value={this.state.tipoInversionesId}>
                                                <option key={1} value={1}>Publico</option>
                                                <option key={2} value={2}>Quantico Inversiones</option>
                                            </select>
                                          </div>
                                          <div>
                                            <label>Titulo:</label><br/>
                                            <input type="text" name="TituloCrear" className="form-control" onChange={this.handleChange}/>
                                          </div>
                                          {
                                          this.state.descrip ?
                                            <div>
                                              <label>Descripcion:</label><br/>
                                              <input type="text" name="descripcionCrear" className="form-control" onChange={this.handleChange}/>
                                            </div> : null
                                          }
                                          <div>
                                            <label>Imagen:</label><br/>
                                            <input type="file" className="form-control-file" name="imagenCrear" onChange={e =>this.handleChangeFile(e)}/>
                                          </div>
                                          <div>
                                            <label>Link de video:</label><br/>
                                            <input type="text" name="linkVideoCrear" className="form-control" onChange={this.handleChange}/>
                                          </div>
                                          <div>
                                            <label>Link de detalles:</label><br/>
                                            <input type="text" name="linkDetallesCrear" className="form-control" onChange={this.handleChange}/>
                                          </div>
                                          <div className="p-2">
                                            <button type="button" className="btn btn-primary" onClick={()=>this.crearInversiones()} >Crear inversion</button>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                    </Modal.Body>
                  </Modal>
                  <Modal
                      size="lg"
                      show={this.state.estadoModalEditarInversiones}
                      onHide={() => this.cambiarModalEditarInversiones()}
                      >
                      <Modal.Header closeButton>
                        <Modal.Title id="example-custom-modal-styling-title">
                          Editar Inversiones
                        </Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                              <div className="card w-100">
                                  <div className="modal-body">
                                      <div className="card-body">
                                            <div>
                                              <label>Tipo de inversiones:</label><br/>
                                              <select className="form-control" name="tipoInversionesId" onChange={this.handleChange} value={this.state.tipoInversionesId}>
                                                  <option key={1} value={1}>Publico</option>
                                                  <option key={2} value={2}>Quantico Inversiones</option>
                                              </select>
                                            </div>
                                            <div>
                                              <label>Titulo:</label><br/>
                                              <input type="text" name="tituloEditar" className="form-control" onChange={this.handleChange} value={this.state.tituloEditar}/>
                                            </div>
                                            {
                                            this.state.descrip ?
                                              <div>
                                                <label>Descripcion:</label><br/>
                                                <input type="text" name="descripcionEditar" className="form-control" onChange={this.handleChange} defaultValue={this.state.descripcionEditar}/>
                                              </div>
                                            :null
                                          }
                                            <div>
                                              <label>Imagen actual:</label><br/>
                                              <img src={this.state.linkImagenEditar} width="400" height="400"/>
                                              <div>
                                                <label>Nueva imagen:</label><br/>
                                                <input type="file" className="form-control-file" name="imagenCrear" onChange={e =>this.handleChangeFile(e)}/>
                                              </div>
                                            </div>
                                            <div>
                                              <label>Link de video:</label><br/>
                                              <input type="text" name="linkVideoEditar" className="form-control" onChange={this.handleChange} value={this.state.linkVideoEditar}/>
                                            </div>
                                            <div>
                                              <label>Link de detalles:</label><br/>
                                              <input type="text" name="linkDetallesEditar" className="form-control" onChange={this.handleChange} value={this.state.linkDetallesEditar}/>
                                            </div>

                                            <div className="p-2">
                                              <button type="button" className="btn btn-primary" onClick={()=>this.enviarEditarInversiones()} >Guardar</button>
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

export default IndexInversiones;
