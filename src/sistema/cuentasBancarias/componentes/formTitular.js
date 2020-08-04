import React, {Component} from 'react';
import {Row, Col,Modal, Table, Form} from 'react-bootstrap';
import Aux from "../../../hoc/_Aux";

class FormTitular extends Component {
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
                <Form.Group controlId="input.titular">
                    {
                        this.props.titular == null
                        ?<Form.Label>Titular</Form.Label>
                        :null
                    }
                    {
                        this.props.titular == null
                        ?<Form.Control 
                            type="text"
                            name="titular"
                            onChange={this.props.handleChange} 
                        />
                        :<Form.Control 
                            type="text"
                            name="titular"
                            value = {this.props.titular}
                            onChange={this.props.handleChange} 
                        />
                    }
                </Form.Group>
            </Aux>
        );
    }
}

export default FormTitular;
