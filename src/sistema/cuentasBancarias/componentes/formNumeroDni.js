import React, {Component} from 'react';
import {Row, Col,Modal, Table, Form} from 'react-bootstrap';
import Aux from "../../../hoc/_Aux";

class FormNumeroDocumentoIdentidad extends Component {
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
                <Form.Group controlId="input.documentoIdentidad">
                    {
                        this.props.nroDocumentoIdentidad == null
                        ?<Form.Label>Documento de Identidad</Form.Label>
                        :null
                    }
                    {
                        this.props.nroDocumentoIdentidad == null
                        ?<Form.Control 
                            type     = "number"
                            onChange = {this.props.handleChange} 
                            name     = "nroDocumentoIdentidad"
                        />
                        :<Form.Control 
                            type     = "number"
                            onChange = {this.props.handleChange} 
                            name     = "nroDocumentoIdentidad"
                            value    = {this.props.nroDocumentoIdentidad}
                        />
                    }
                </Form.Group>
            </Aux>
        );
    }
}

export default FormNumeroDocumentoIdentidad;
