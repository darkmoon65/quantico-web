import React, {Component} from 'react';
import {Row, Col,Modal,Pagination} from 'react-bootstrap';

import Aux from "../../hoc/_Aux";
import Card from "../../App/components/MainCard";
import cogoToast from "cogo-toast";
import Config from "../../config"
import Files from "../../files";
import Paginar from "../../paginate"

class IndexRegalos extends Component {
  constructor(){
    super();
    this.state = {
      tb_regalos:[],
      estadoEditar:'',
      var_texto_numeroPagina:1,
      valor:'',
      //modales
      estadoModalEnviarRegalos:false,
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeBuscador  = this.handleChangeBuscador.bind(this);
  }
  descargarExcel(){
    Files.exportToCSV(this.state.tb_regalos.datos.data,"regalos");
  }
  cambiarModalEnviarRegalos(){
        this.setState({
          estadoModalEnviarRegalos: !this.state.estadoModalEnviarRegalos
        })
  }

  clean(){
    this.setState({
      estadoModalEnviarRegalos: false,
      id:'',
      estadoEditar:''
    },()=>this.fetchRegalos())
  }

  handleChange(e){
    const {name, value} = e.target;
    this.setState({
      [name]: value
    },()=>{
      console.log(value)
    })
  }
  handleChangeBuscador(e){
    const value = e.target.value;
    this.setState({
      valor: value
    },()=>{
      console.log(value);
      this.fetchRegalos();
    })
  }

  sendRegalo(){
    fetch(`${Config.api}regalos/enviar`,
      {
        mode:'cors',
        method: 'POST',
        body: JSON.stringify({
              id: this.state.id,
              regalo: this.state.regaloEnviar,
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
          cogoToast.success("Regalo enviado");
          this.clean();
        }
        else{
          cogoToast.error("Error al enviar")
          console.log("hubo un error con la peticion")
        }
    }).catch((error)=> {
      cogoToast.error("Hubo un error al enviar regalo")
      console.log('Hubo un problema con la petición Fetch:' + error.message);
  });
}
  enviarRegalo(id){
    this.setState({
        id: id,
    },()=>this.cambiarModalEnviarRegalos())
  }
  fetchRegalos(boleano,numero){
      fetch(`${Config.api}regalos/buscar?page=${numero}&buscar=${this.state.valor}`,
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
              tb_regalos: data['datos'],
              var_texto_numeroPagina:numero
            },()=>{console.log(this.state.tb_regalos)})
          }
          else{
            console.log(data)
            console.log("hubo un error con la peticion")
          }
      }).catch((error)=> {
        console.log('Hubo un problema con la petición Fetch:' + error.message);
    });  }
  componentDidMount(){
      this.fetchRegalos(true,1);
      console.log(localStorage.getItem('token'));
    }
    render() {
        return (
            <Aux>
                <Row>
                    <Col>
                        <Card title='Regalos' isOption>
                        <table id="tb_regalos" className="table table-striped" style={{width:'100%'}}>
                            <thead>
                                <tr>
                                    <th><h4 className="card-title">Buscar </h4></th>
                                    <th><input type="text" onChange={this.handleChangeBuscador} /></th>
                                    <th><button className="btn btn-sm btn-success" type="button" onClick={()=>this.descargarExcel()}>Descargar excel</button></th>
                                </tr>
                                <tr>
                                    <th>Nombres</th>
                                    <th>Apellidos</th>
                                    <th>Numero de tarjeta</th>
                                </tr>
                              </thead>
                              <tbody>
                                   {
                                    this.state.tb_regalos.data ?
                                    this.state.tb_regalos.data.map(task =>{
                                        return (
                                            <tr key={task.id}>
                                                <td>{task.nombres}</td>
                                                <td>{task.apellidos}</td>
                                                <td>{task.nroTarjeta}</td>
                                                <td>
                                                  <button className="btn btn-sm btn-primary" type="button" onClick={()=>this.enviarRegalo(task.id)}>
                                                    <i className="fa fa-pencil" ></i>
                                                  </button>
                                                </td>
                                            </tr>
                                        );
                                    } )   : null
                                }
                            </tbody>
                        </table>
                            <div className="float-right">
                            <Pagination  >
                              <Pagination.Prev
                                  onClick={() => {
                                    this.fetchRegalos(
                                      true,
                                      this.state.var_texto_numeroPagina-1,
                                  )
                                }}
                              />
                                  {
                                      <Paginar data={this.state.tb_regalos} fetch={(bolean,numero)=>this.fetchRegalos(bolean,numero)} ></Paginar>
                                  }
                              <Pagination.Next
                                  onClick={() => {
                                    this.fetchRegalos(
                                      true,
                                      this.state.var_texto_numeroPagina+1,

                                    )
                                  }}
                              />
                          </Pagination>
                          </div>
                        </Card>
                    </Col>
                </Row>
                <Modal
                    size="lg"
                    show={this.state.estadoModalEnviarRegalos}
                    onHide={() => this.cambiarModalEnviarRegalos()}
                    >
                    <Modal.Header closeButton>
                      <Modal.Title id="example-custom-modal-styling-title">
                        Enviar Regalos
                      </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                            <div className="card w-100">
                                <div className="modal-body">
                                    <div className="card-body">
                                          <div>
                                            <label>Regalo:</label><br/>
                                            <input type="text" className="form-control" name="regaloEnviar" onChange={this.handleChange}  />
                                          </div>

                                          <div className="p-2">
                                            <button type="button" className="btn btn-primary" onClick={()=>this.sendRegalo()} >Enviar Regalo</button>
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

export default IndexRegalos;
