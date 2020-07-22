import React, {Component} from 'react';
import {Row, Col,Modal} from 'react-bootstrap';

import Aux from "../../hoc/_Aux";
import Card from "../../App/components/MainCard";
import cogoToast from "cogo-toast";
import Config from "../../config"
import Files from "../../files"

class IndexCuentas extends Component {
  constructor(){
    super();
    this.state = {
      tb_cuentasBancarias:[],
      tb_bancos:[],

      //modales
      estadoModalCrearCuentaBancaria:false,
    }
    this.handleChange = this.handleChange.bind(this);
  }

  descargarExcel(){
    Files.exportToCSV(this.state.tb_cuentasBancarias.datos,"cuentas-Bancarias");
  }
  cambiarModalCrearCuentaBancaria(){
        this.setState({
          estadoModalCrearCuentaBancaria: !this.state.estadoModalCrearCuentaBancaria
        })
  }

  clean(){
    this.setState({
      estadoModalCrearCuentaBancaria: false,
      banco: '',
      titular:'',
      cuenta:'' ,
      cci: ''
    },()=>this.fetchCuentasBancarias())
  }

  handleChange(e){
    const {name, value} = e.target;
    this.setState({
      [name]: value
    },()=>{
      console.log(value)
    })
  }

  crearCuentaBancaria(){
    fetch(`${Config.api}cuentaBancaria/crear`,
      {
        mode:'cors',
        method: 'POST',
        body: JSON.stringify({
              banco: this.state.bancoCrearId,
              titular: this.state.titularCrear,
              cuenta: this.state.cuentaCrear,
              cci: this.state.cciCrear
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
          cogoToast.success("Cuenta bancaria creada");
          this.clean();
        }
        else{
          cogoToast.error("Error al crear la cuenta bancaria")
          console.log("hubo un error con la peticion")
        }
    }).catch((error)=> {
      cogoToast.error("Hubo un error al crear la cuenta bancaria")
      console.log('Hubo un problema con la petición Fetch:' + error.message);
  });
}
  eliminarCuentaBancaria(id){
    fetch(`${Config.api}cuentaBancaria/eliminar`,
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
          cogoToast.success("Cuenta bancaria eliminada");
          this.clean();
        }
        else{
          cogoToast.error("Error al crear la cuenta bancaria")
          console.log("hubo un error con la peticion")
        }
    }).catch((error)=> {
      cogoToast.error("Hubo un error al crear la cuenta bancaria")
      console.log('Hubo un problema con la petición Fetch:' + error.message);
  });
}
  fetchCuentasBancarias(){
      fetch(`${Config.api}cuentaBancaria/mostrar`,
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
              tb_cuentasBancarias: data
            },()=>{console.log(this.state.tb_cuentasBancarias)})
          }
          else{
            console.log(data)
            console.log("hubo un error con la peticion")
          }
      }).catch((error)=> {
        console.log('Hubo un problema con la petición Fetch:' + error.message);
    });  }

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
  componentDidMount(){
      this.fetchCuentasBancarias();
      this.fetchBancos();
      console.log(localStorage.getItem('token'));
    }
    render() {
        return (
            <Aux>
                <Row>
                    <Col>
                        <Card title='Cuentas Bancarias' isOption>
                        <table id="tb_membresia" className="table table-striped" style={{width:'100%'}}>
                            <thead>
                                <tr>
                                    <th><button type="button" className="btn btn-primary" onClick={()=>this.cambiarModalCrearCuentaBancaria()}>Crear cuenta bancaria</button></th>
                                    <th><button className="btn btn-sm btn-success" type="button" onClick={()=>this.descargarExcel()}>Descargar excel</button></th>
                                </tr>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Titular</th>
                                    <th>Numero de cuenta</th>
                                    <th>cci</th>
                                </tr>
                              </thead>
                              <tbody>
                                   {
                                    this.state.tb_cuentasBancarias.datos ?
                                    this.state.tb_cuentasBancarias.datos.map(task =>{
                                        return (
                                            <tr key={task.id}>
                                                <td>{task.banco}</td>
                                                <td>{task.titular}</td>
                                                <td>{task.nroCuenta}</td>
                                                <td>{task.cci}</td>
                                                <td>
                                                  <button className="btn btn-sm btn-danger" type="button" onClick={()=>this.eliminarCuentaBancaria(task.id)}>
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
                    show={this.state.estadoModalCrearCuentaBancaria}
                    onHide={() => this.cambiarModalCrearCuentaBancaria()}
                    >
                    <Modal.Header closeButton>
                      <Modal.Title id="example-custom-modal-styling-title">
                        Crear Cuenta bancaria
                      </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                            <div className="card w-100">
                                <div className="modal-body">
                                    <div className="card-body">
                                          <div>
                                            <label>Banco:</label><br/>
                                            <select className="form-control" name="bancoCrearId" style={{width: '50%'}} onChange={this.handleChange} value={this.state.bancoCrearId}>
                                                <option key={0} value={''}>--Escoje una opcion--</option>
                                                {
                                                this.state.tb_bancos.datos?
                                                this.state.tb_bancos.datos.map((data,index)=>{
                                                 return(
                                                    <option key={data.id} value={data.id}>{data.nombre}</option>
                                                 )
                                               }):null
                                                }

                                            </select>
                                          </div>
                                          <div>
                                            <label>Titular:</label><br/>
                                            <input type="text" name="titularCrear" className="form-control" onChange={this.handleChange}/>
                                          </div>
                                          <div>
                                            <label>Cuenta:</label><br/>
                                            <input type="text" name="cuentaCrear" className="form-control" onChange={this.handleChange}/>
                                          </div>
                                          <div>
                                            <label>cci:</label><br/>
                                            <input type="text" name="cciCrear" className="form-control" onChange={this.handleChange}/>
                                          </div>
                                          <div className="p-2">
                                            <button type="button" className="btn btn-primary" onClick={()=>this.crearCuentaBancaria()} >Crear cuenta bancaria</button>
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

export default IndexCuentas;
