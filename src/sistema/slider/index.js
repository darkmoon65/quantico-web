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
      //modales
      estadoModalSliders:false
    }
    this.handleChange = this.handleChange.bind(this);
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

  handleChange(e){
      const {name, value} = e.target;
      this.setState({
        [name]: value
      },()=>{

      })
    }

  crearSlider(){
    this.cambiarModalSliders();
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
            console.log("exitoso")
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
  cambiarModalSliders(){

    this.setState({
      estadoModalSliders: !this.state.estadoModalSliders
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
              console.log(fileData.result);
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
                                      <th><button className="btn btn-sm btn-primary ver" type="button" onClick={()=>this.crearSlider()}>Crear Slider</button></th>
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
                                                  <button className="btn btn-sm btn-primary ver" type="button" onClick={()=>this.editarUsers(
                                                      task.id,
                                                      task.titulo,
                                                      task.url,
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
                <Modal
                    size="lg"
                    show={this.state.estadoModalSliders}
                    onHide={() => this.cambiarModalSliders()}
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
            </Aux>


        );
    }
}

export default IndexSlider;
