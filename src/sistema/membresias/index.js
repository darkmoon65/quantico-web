import React, {Component} from 'react';
import {Row, Col} from 'react-bootstrap';

import Aux from "../../hoc/_Aux";
import Card from "../../App/components/MainCard";

class IndexMembresias extends Component {
    constructor(){
      super();
      this.state = {
        tb_membresias:[],
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

    fetchMembresias(){
      fetch('http://107.23.50.10/membresia/mostrar',
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




    render() {
        return (
            <Aux>
                <Row>
                    <Col>
                        <Card title='Registro de Membresias' isOption>
                            <table id="tb_membresia" className="table table-striped" style={{width:'90%'}}>
                                <thead>
                                    <tr>
                                        <th><h4 className="card-title">Buscar </h4></th>
                                        <th><input type="text" onChange={this.handleChangeBuscador} /></th>
                                        <th><button className="btn btn-sm btn-primary ver" type="button" onClick={()=>this.cambiarModalCrearSliders()}>Crear Membresia</button></th>
                                    </tr>
                                    <tr>
                                        <th>Titulo</th>
                                        <th>Link</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                       {
                                        this.state.tb_membresias ?
                                        this.state.tb_membresias.map(task =>{
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
            </Aux>
        );
    }
}

export default IndexMembresias;
