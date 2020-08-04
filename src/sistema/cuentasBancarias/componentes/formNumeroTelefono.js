import React, {Component} from 'react';
import {Row, Col,Modal, Table, Form} from 'react-bootstrap';
import Aux from "../../../hoc/_Aux";

class FormNumeroTelefono extends Component {
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
                <Form.Group controlId="input.numeroTelefono">
                    {
                        this.props.telefono == null
                        ?<Form.Label>Número de Télefono</Form.Label>
                        :null
                    }
                    {
                        this.props.telefono == null
                        ?<Form.Control
                            type="number"
                            onChange={this.props.handleChange} 
                            name="telefono"
                        />
                        :<Form.Control
                            type="number"
                            onChange={this.props.handleChange} 
                            name="telefono"
                            value ={this.props.telefono}
                        />
                    }
                </Form.Group>
            </Aux>
        );
    }
}

export default FormNumeroTelefono;
