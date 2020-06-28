import React, {Component} from 'react';
import {Row, Col,Modal} from 'react-bootstrap';

import Aux from "../../hoc/_Aux";
import Card from "../../App/components/MainCard";
import cogoToast from "cogo-toast";
import Config from "../../config"

class IndexSocios extends Component {
  constructor(){
    super();
    this.state = {
      tb_socios:[],
      //modales
      estadoModalCrearSocios:false,
    }
    this.handleChange = this.handleChange.bind(this);
  }

  cambiarModalCrearSocios(){
        this.setState({
          estadoModalCrearSocios: !this.state.estadoModalCrearSocios
        })
  }

  clean(){
    this.setState({
      estadoModalCrearSocios: false,
      nombreCrear:'',
      numeroCrear:''
    },()=>this.fetchSocios())
  }

  eliminarSocio(id){
    fetch(`${Config.api}aliados/eliminar`,
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
          cogoToast.success("Socio eliminado");
          this.clean();
        }
        else{
          cogoToast.error("Error al eliminar el socio")
          console.log("hubo un error con la peticion")
        }
    }).catch((error)=> {
      cogoToast.error("Hubo un error al eliminar el socio")
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

  crearSocio(){
    fetch(`${Config.api}aliados/crear`,
      {
        mode:'cors',
        method: 'POST',
        body: JSON.stringify({
              nombre: this.state.nombreCrear,
              imagen: this.state.imagen,
              url: this.state.link
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
          cogoToast.success("Socio creado");
          this.clean();
        }
        else{
          cogoToast.error("Error al crear el socio")
          console.log("hubo un error con la peticion")
        }
    }).catch((error)=> {
      cogoToast.error("Hubo un error al crear el socio")
      console.log('Hubo un problema con la petición Fetch:' + error.message);
  });
}

  fetchSocios(){
      fetch(`${Config.api}aliados/mostrar`,
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
          if(data){
            this.setState({
              tb_socios: data
            },()=>{console.log(this.state.tb_socios)})
          }
          else{
            console.log(data)
            console.log("hubo un error con la peticion")
          }
      }).catch((error)=> {
        console.log('Hubo un problema con la petición Fetch:' + error.message);
    });  }
  componentDidMount(){
      this.fetchSocios();
      console.log(localStorage.getItem('token'));
    }
    render() {
        return (
            <Aux>
                <Row>
                    <Col>
                        <Card title='Socios' isOption>
                        <table id="tb_membresia" className="table table-striped" style={{width:'100%'}}>
                            <thead>
                                <tr>
                                    <th><h4 className="card-title">Buscar </h4></th>
                                    <th><input type="text" onChange={this.handleChangeBuscador} /></th>
                                    <th><button type="button" className="btn btn-primary" onClick={()=>this.cambiarModalCrearSocios()}>Crear Socios</button></th>
                                </tr>
                                <tr>
                                    <th>Nombres</th>
                                    <th>link</th>
                                </tr>
                              </thead>
                              <tbody>
                                   {
                                    this.state.tb_socios ?
                                    this.state.tb_socios.map(task =>{
                                        return (
                                            <tr key={task.id}>
                                                <td>{task.nombre}</td>
                                                <td>{task.url}</td>
                                                <td>
                                                  <button className="btn btn-sm btn-danger" type="button" onClick={()=>this.eliminarSocio(task.id)}>
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
                    show={this.state.estadoModalCrearSocios}
                    onHide={() => this.cambiarModalCrearSocios()}
                    >
                    <Modal.Header closeButton>
                      <Modal.Title id="example-custom-modal-styling-title">
                        Crear Socios
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
                                            <input type="file" className="form-control-file" name="imagen" onChange={e =>this.handleChangeFile(e)}/>
                                          </div>
                                          <div>
                                            <label>Link:</label><br/>
                                            <input type="text" name="link" className="form-control" onChange={this.handleChange}/>
                                          </div>
                                          <div className="p-2">
                                            <button type="button" className="btn btn-primary" onClick={()=>this.crearSocio()} >Crear Socio</button>
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

export default IndexSocios;
