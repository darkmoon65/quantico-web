import React, {Component} from 'react';
import {Row, Col, Modal} from 'react-bootstrap';

import Aux from "../../hoc/_Aux";
import Card from "../../App/components/MainCard";
import cogoToast from "cogo-toast";
import Config from "../../config"
import Files from "../../files"

class IndexSlider extends Component {

  constructor(){
    super();
    this.state = {
      tb_sliders:[],
      tituloCrear:'',
      linkCrear:'',
      imagen:'',
      idEditar: '',
      tituloEditar: '',
      linkEditar: '',
      imagenEditar: '',
      //modales
      estadoModalCrearSliders:false,
      estadoModalEditarSliders:false
    }
    this.handleChange = this.handleChange.bind(this);
  }

  clean(){
    this.setState({
      estadoModalCrearSliders: false,
      estadoModalEditarSliders:false,
      imagen: '',
      tituloCrear: '',
      linkCrear: ''
    },()=>this.fetchSliders())
  }

  fetchSliders(){
    fetch(`${Config.api}slider/mostrar`,
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
        if(data){
          this.setState({
            tb_sliders: data
          })
        }

    }).catch((error)=> {

  });
}

  editarSlider(id,titulo,url,imagen){

    this.setState({
       idEditar: id,
       tituloEditar: titulo,
       linkEditar: url,
       imagenEditar: imagen
    },()=>{
      this.cambiarModalEditarSliders();
    })
  }
  descargarExcel(){
    Files.exportToCSV(this.state.tb_sliders,"slider");
  }

  cambiarModalCrearSliders(){
        this.setState({
          estadoModalCrearSliders: !this.state.estadoModalCrearSliders
        })
  }

  cambiarModalEditarSliders(){
    this.setState({
      estadoModalEditarSliders: !this.state.estadoModalEditarSliders
      })
  }

  enviarCrearSlider(){
    if(this.state.imagen && this.state.tituloCrear && this.state.linkCrear){
      fetch(`${Config.api}slider/crear` ,
        {
          mode:'cors',
          method: 'POST',
          body: JSON.stringify({
              imagen: this.state.imagen,
              titulo: this.state.tituloCrear,
              url: this.state.linkCrear
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
            cogoToast.success("Slider creado");
            this.clean();
          }
          else{
            cogoToast.error("Hubo un error, no se creo slider")
          }
      }).catch((error)=> {
        cogoToast.error("Hubo un error, no se creo Slider")
    });
  }
}

  eliminarSlider(idS){
  fetch(`${Config.api}slider/eliminar`,
    {
      mode:'cors',
      method: 'POST',
      body: JSON.stringify({
          id: idS
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
        cogoToast.success("eliminado exitosamente");
        this.fetchSliders();
      }
      else{
        cogoToast.error("hubo un error, no se pudo eliminar")
      }
  }).catch((error)=> {
    cogoToast.error("hubo un error, no se pudo eliminar");
  });
}

  enviarEditarSlider(){
  if(this.state.imagen && this.state.tituloEditar && this.state.linkEditar){
    fetch(`${Config.api}slider/editar`,
      {
        mode:'cors',
        method: 'POST',
        body: JSON.stringify({
                id: this.state.idEditar,
            imagen: this.state.imagen,
            titulo: this.state.tituloEditar,
            url: this.state.linkEditar
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
          cogoToast.success("Slider modificado");
          this.clean();
        }
        else{
          cogoToast.error("hubo un error, no se pudo editar")
        }
    }).catch((error)=> {
      cogoToast.error("hubo un error, no se pudo editar")
  });
 }
}

  handleChange(e){
    const {name, value} = e.target;
    this.setState({
      [name]: value
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
              cogoToast.success("Imagen Lista")
              }
            );

            /*const canvas = this.refs.canvas
            const ctx = canvas.getContext("2d")
            let myImage = new Image();
            myImage.src = this.state.imagen;

            myImage.onload = function() {
              ctx.drawImage(myImage, 0, 0);
            };*/
          }
    }



  componentDidMount(){
    this.fetchSliders();
  }

    render() {
        return (
            <Aux>
                <Row>
                    <Col>
                        <Card title='Editar sliders' isOption>
                          <table id="tb_sliders" className="table table-striped" style={{width:'90%'}}>
                              <thead>
                                  <tr>
                                      <th><button className="btn btn-sm btn-primary ver" type="button" onClick={()=>this.cambiarModalCrearSliders()}>Crear Slider</button></th>
                                      <th><button className="btn btn-sm btn-success" type="button" onClick={()=>this.descargarExcel()}>Descargar excel</button></th>
                                  </tr>
                                  <tr>
                                      <th>Titulo</th>

                                  </tr>
                                </thead>
                                <tbody>
                                     {
                                      this.state.tb_sliders ?
                                      this.state.tb_sliders.map(task =>{
                                          return (
                                              <tr key={task.id}>
                                                  <td>{task.titulo}</td>
                                                  <th>
                                                    <button className="btn btn-sm btn-primary ver" type="button" onClick={()=>this.editarSlider(
                                                        task.id,
                                                        task.titulo,
                                                        task.url,
                                                        task.imagen
                                                    )}><i className="fa fa-pencil"/></button>
                                                    <button className="btn btn-sm btn-danger "  type="button" onClick={()=>this.eliminarSlider(task.id)}>
                                                      <i className="fa fa-trash" ></i>
                                                    </button>
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
                <Modal
                    size="lg"
                    show={this.state.estadoModalCrearSliders}
                    onHide={() => this.cambiarModalCrearSliders()}
                    >
                    <Modal.Header closeButton>
                      <Modal.Title id="example-custom-modal-styling-title">
                        Crear Slider
                      </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                            <div className="card w-75">
                                <div className="modal-body">
                                    <div className="card-body">
                                          <div>
                                            <label>Titulo:</label>
                                            <input type="text" className="form-control" name="tituloCrear" onChange={this.handleChange} />
                                          </div>
                                          <div>
                                            <label>Link:</label>
                                            <input type="text" className="form-control" name="linkCrear" onChange={this.handleChange}/>
                                          </div>
                                          <label>Imagen: </label>
                                          <div className="input-group">
                                           <input type="file" className="form-control-file" onChange={e =>this.handleChangeFile(e)}/>
                                             {
                                              // <canvas ref="canvas" width={500} height={500} />
                                             }
                                          </div>
                                          <div className="mx-auto p-2">
                                            <button type="button" className="btn btn-sm btn-primary ver" onClick={()=>this.enviarCrearSlider()}>Crear Slider</button>
                                          </div>
                                        </div>
                                  </div>
                                </div>

                    </Modal.Body>
                  </Modal>
                  <Modal
                      size="lg"
                      show={this.state.estadoModalEditarSliders}
                      onHide={() => this.cambiarModalEditarSliders()}
                      >
                      <Modal.Header closeButton>
                        <Modal.Title id="example-custom-modal-styling-title">
                          Editar Slider
                        </Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                              <div className="card w-75">
                                  <div className="modal-body">
                                      <div className="card-body">
                                            <div>
                                              <label>Titulo:</label>
                                              <input type="text" className="form-control" value={this.state.tituloEditar} name="tituloEditar" onChange={this.handleChange} />
                                            </div>
                                            <div>
                                              <label>Link:</label>
                                              <input type="text" className="form-control" value={this.state.linkEditar} name="linkEditar" onChange={this.handleChange}/>
                                            </div>
                                            <label>Imagen actual: </label>
                                            <div className="p-2">
                                              <img src={this.state.imagenEditar} width="400" height="400"/>
                                            </div>
                                            <label>Imagen nueva: </label>
                                            <div className="p-2">
                                              <input type="file" className="form-control-file" onChange={e =>this.handleChangeFile(e)}/>
                                            </div>
                                            <div className="mx-auto p-2">
                                              <button type="button" className="btn btn-sm btn-primary ver" onClick={()=>this.enviarEditarSlider()}>Guardar</button>
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

export default IndexSlider;
