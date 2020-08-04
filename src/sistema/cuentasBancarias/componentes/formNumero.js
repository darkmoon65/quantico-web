import React, {Component} from 'react';
import {Row, Col,Modal, Table, Form} from 'react-bootstrap';
import Aux from "../../../hoc/_Aux";

class FormNumero extends Component {
  constructor(){
    super();
    this.state = {
      
    }
  }

  componentDidMount()
  {
    
  }

    render() {
        return (
            <Aux>
                <Form.Group controlId="input.numeroTarjeta">
                    {
                        this.props.numero == null
                        ?<Form.Label>Número de Tarjeta</Form.Label>
                        :null
                    }
                    {
                        this.props.numero == null
                        ?<Form.Control
                            type     = "number"
                            onChange = {this.props.handleChange} 
                            name     = "numero"
                        />
                        :<Form.Control
                            type     = "number"
                            onChange = {this.props.handleChange} 
                            name     = "numero"
                            value    = {this.props.numero}
                        />
                    }
                </Form.Group>
            </Aux>
        );
    }
}

export default FormNumero;
