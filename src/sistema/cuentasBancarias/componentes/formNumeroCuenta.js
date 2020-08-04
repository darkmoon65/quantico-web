import React, {Component} from 'react';
import {Row, Col,Modal, Table, Form} from 'react-bootstrap';
import Aux from "../../../hoc/_Aux";

class FormNumeroCuenta extends Component {
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
                <Form.Group controlId="input.numeroCuenta">
                    {
                        this.props.nroCuenta == null
                        ?<Form.Label>Número de Cuenta</Form.Label>
                        :null
                    }
                    {
                        this.props.nroCuenta == null
                        ?<Form.Control 
                            type="number"
                            onChange={this.props.handleChange} 
                            name="nroCuenta"
                        />
                        :<Form.Control 
                            type     = "number"
                            onChange = {this.props.handleChange} 
                            value    = {this.props.nroCuenta}
                            name     = "nroCuenta"
                        />
                    }
                </Form.Group>
            </Aux>
        );
    }
}

export default FormNumeroCuenta;
