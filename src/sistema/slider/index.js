import React, {Component} from 'react';
import {Row, Col, Modal} from 'react-bootstrap';

import Aux from "../../hoc/_Aux";
import Card from "../../App/components/MainCard";
import cogoToast from "cogo-toast";


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
      imagen: '',
      tituloCrear: '',
      linkCrear: ''
    },()=>this.fetchSliders())
  }

  fetchSliders(){
    fetch('http://107.23.50.10/slider/mostrar',
      {
        mode:'cors',
        method: 'GET',
        headers: {
            'Accept' : 'application/json',
            'Content-type' : 'application/json'
        }
      }
    )
      .then(res =>res.json())
      .then(data => {
        if(data){
          this.setState({
            tb_sliders: data
          },()=>{console.log(this.state.tb_sliders)})
        }
        else{
          console.log(data)
          console.log("hubo un error con la peticion")
        }
    }).catch((error)=> {
      console.log('Hubo un problema con la petición Fetch:' + error.message);
  });  }

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
      fetch('http://107.23.50.10/slider/crear',
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
              'Content-type' : 'application/json'
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
            console.log(data)
            console.log("hubo un error con la peticion")
          }
      }).catch((error)=> {
        console.log('Hubo un problema con la petición Fetch:' + error.message);
    });
  }
}

  eliminarSlider(idS){
  fetch('http://107.23.50.10/slider/eliminar',
    {
      mode:'cors',
      method: 'POST',
      body: JSON.stringify({
          id: idS
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
        cogoToast.success("eliminado exitosamente");
        this.fetchSliders();
      }
      else{
        console.log(data)
        console.log("hubo un error con la peticion")
      }
  }).catch((error)=> {
    console.log('Hubo un problema con la petición Fetch:' + error.message);
  });
}

  enviarEditarSlider(){
  if(this.state.imagen && this.state.tituloEditar && this.state.linkEditar){
    fetch('http://107.23.50.10/slider/editar',
      {
        mode:'cors',
        method: 'POST',
        body: JSON.stringify({
            imagen: this.state.imagen,
            titulo: this.state.tituloEditar,
            url: this.state.linkEditar
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
          cogoToast.success("Slider modificado");
          this.clean();
        }
        else{
          console.log(data)
          console.log("hubo un error con la peticion")
        }
    }).catch((error)=> {
      console.log('Hubo un problema con la petición Fetch:' + error.message);
  });
}
}

  handleChange(e){
    const {name, value} = e.target;
    this.setState({
      [name]: value
    },()=>{

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
    console.log(localStorage.getItem('token'));
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
                                      <th><h4 className="card-title">Buscar </h4></th>
                                      <th><input type="text" onChange={this.handleChangeBuscador} /></th>
                                      <th><button className="btn btn-sm btn-primary ver" type="button" onClick={()=>this.cambiarModalCrearSliders()}>Crear Slider</button></th>
                                  </tr>
                                  <tr>
                                      <th>Titulo</th>
                                      <th>Link</th>
                                  </tr>
                                </thead>
                                <tbody>
                                     {
                                      this.state.tb_sliders ?
                                      this.state.tb_sliders.map(task =>{
                                          return (
                                              <tr key={task.id}>
                                                  <td>{task.titulo}</td>
                                                  <td>{task.url}</td>
                                                  <th>
                                                    <button className="btn btn-sm btn-primary ver" type="button" onClick={()=>this.editarSlider(
                                                        task.id,
                                                        task.titulo,
                                                        task.url,
                                                        task.imagen
                                                    )}><i className="feather icon-trending-up"/></button>
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
                                          <div className="mx-auto" style={{padding:'4'}}>
                                            <button type="button" className="btn btn-sm btn-primary ver" onClick={()=>this.enviarCrearSlider()}>Crear</button>
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
                                              <button type="button" className="btn btn-sm btn-primary ver" onClick={()=>this.enviarEditarSlider()}>Editar</button>
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
