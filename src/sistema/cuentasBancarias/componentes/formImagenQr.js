import React, {Component} from 'react';
import {Row, Col,Modal, Table, Form} from 'react-bootstrap';
import Aux from "../../../hoc/_Aux";

class FormImagenQr extends Component {
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
                <Form.Group controlId="input.imagenQr">
                    <Form.Label>Imagen Qr</Form.Label><br/>
                    <input 
                        type="file"
                        onChange={this.props.handleChange} 
                        name="imagenQr"
                    />
                </Form.Group>
            </Aux>
        );
    }
}

export default FormImagenQr;
