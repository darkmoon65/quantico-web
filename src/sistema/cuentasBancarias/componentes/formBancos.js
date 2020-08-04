import React, {Component} from 'react';
import {Row, Col,Modal, Table, Form} from 'react-bootstrap';
import Aux from "../../../hoc/_Aux";
import Config from "../../../config"

class FormBancos extends Component {
  constructor(){
    super();
    this.state = {
        tb_bancos : []
    }
    this.fetchBancos = this.fetchBancos.bind(this);
  }

  fetchBancos(){
    fetch(`${Config.api}banco/mostrar`,
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
        if(this.props.idBancosSeleccionado != null)
        {
            let nuevoArray = []
            let tienePosicionCero = false
            data.datos.map((task, posicion)=>{
                if(posicion == 0)
                {
                    if(task.id == this.props.idBancosSeleccionado)
                    {
                        nuevoArray.push({
                            id      : task.id,
                            nombre  : task.nombre
                        })
                    }else{
                        nuevoArray.push({
                            id      : task.id,
                            nombre  : task.nombre
                        })
                        tienePosicionCero = true
                    }
                }else{
                    if(task.id == this.props.idBancosSeleccionado)
                    {
                        if(tienePosicionCero == true)
                        {
                            nuevoArray.push({
                                id      : nuevoArray[0]['id'],
                                nombre  : nuevoArray[0]['nombre']
                            })
                            nuevoArray[0]['id']     = task.id
                            nuevoArray[0]['nombre'] = task.nombre
                        }
                    }else{
                        nuevoArray.push({
                            id      : task.id,
                            nombre  : task.nombre
                        })
                    }
                }
            })
            this.setState({
                tb_bancos : nuevoArray
            })
        }else{
            this.setState({
                tb_bancos : data.datos
            })
        }
      }
      else
      {
        
      }
    }).catch((error)=> {
        
    });  
  }

  componentDidMount()
  {
    this.fetchBancos();
  }

    render() {
        return (
            <Aux>
                <Form.Group controlId="select.bancos">
                    {
                      this.props.idBancosSeleccionado != null
                      ?null
                      :<Form.Label> Selecciona un Banco </Form.Label>
                    }
                    <Form.Control as="select" onChange={this.props.handleChange} name="banco_id" >
                        {
                        this.state.tb_bancos
                        ?this.state.tb_bancos.map((task, posicion) => {
                            return (
                            <option value={task.id} key={task.id}  > {task.nombre} </option>
                            );
                        })
                        :null
                        }
                    </Form.Control>
                </Form.Group>
            </Aux>
        );
    }
}

export default FormBancos;
