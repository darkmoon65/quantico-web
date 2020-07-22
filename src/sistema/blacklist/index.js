import React, {Component} from 'react';
import {Row, Col,Modal} from 'react-bootstrap';

import Aux from "../../hoc/_Aux";
import Card from "../../App/components/MainCard";
import cogoToast from "cogo-toast";
import Config from "../../config"

class IndexBlackList extends Component {
  constructor(){
    super();
    this.state = {
      tb_blackList:[],
      //modales
      estadoModalVerVerCompletos:false,
    }
    this.handleChange = this.handleChange.bind(this);
  }

  cambiarModalVerCompletos(){
        this.setState({
          estadoModalVerVerCompletos: !this.state.estadoModalVerVerCompletos
        })
  }

  verResultado(){
    this.cambiarModalVerCompletos();
  }

  eliminar(){

  }
  handleChange(e){
    const {name, value} = e.target;
    this.setState({
      [name]: value
    },()=>{
      console.log(value)
    })
  }


  fetchCompletos(){
      fetch(`${Config.api}verificaciones/mostrar`,
        {
          mode:'cors',
          method: 'GET',
          headers: {
              'Accept' : 'application/json',
              'Content-type' : 'application/json',
              'estado': '3'
          }
        }
      )
        .then(res =>res.json())
        .then(data => {
          if(data){
            this.setState({
              tb_completos: data['data']
            },()=>{console.log(this.state.tb_completos)})
          }
          else{
            console.log(data)
            console.log("hubo un error con la peticion")
          }
      }).catch((error)=> {
        console.log('Hubo un problema con la petición Fetch:' + error.message);
    });  }
  componentDidMount(){
      //this.fetchCompletos();
      console.log(localStorage.getItem('token'));
    }
    render() {
        return (
            <Aux>
                <Row>
                    <Col>
                        <Card title='BlackList' isOption>
                        <table id="tb_membresia" className="table table-striped" style={{width:'100%'}}>
                            <thead>
                                <tr>
                                    <th><button className="btn btn-sm btn-success" type="button" onClick={()=>this.descargarExcel()}>Descargar excel</button></th>
                                </tr>
                                <tr>
                                    <th>id</th>
                                    <th>Nombres</th>
                                    <th>Apellidos</th>
                                </tr>
                              </thead>
                              <tbody>
                                   {
                                    this.state.tb_blackList ?
                                    this.state.tb_blackList.map(task =>{
                                        return (
                                            <tr key={task.id}>
                                                <td>{task.id}</td>
                                                <td>
                                                  <button className="btn btn-sm btn-info"  type="button" onClick={()=>this.eliminar(task.id)}>
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
                    show={this.state.estadoModalVerVerCompletos}
                    onHide={() => this.cambiarModalVerCompletos()}
                    >
                    <Modal.Header closeButton>
                      <Modal.Title id="example-custom-modal-styling-title">
                        Ver registros completos
                      </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                            <div className="card w-100">
                                <div className="modal-body">
                                    <div className="card-body text-center">
                                          <div>
                                            <label>Nombre:</label><br/>
                                            <label>Apellidos:</label><br/>
                                            <label>Total:</label><br/>
                                            <label>Concepto:</label><br/>
                                            <label>Descripcion:</label><br/>
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

export default IndexBlackList;
