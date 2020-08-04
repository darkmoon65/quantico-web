import React, {Component} from 'react';
import {Row, Col,Modal, Table, Form} from 'react-bootstrap';
import Aux from "../../../hoc/_Aux";

class FormCci extends Component {
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
                        this.props.cci == null
                        ?<Form.Label>CCI</Form.Label>
                        :null
                    }
                    {
                        this.props.cci == null
                        ?<Form.Control
                            type="number"
                            onChange={this.props.handleChange} 
                            name="cci"
                        />
                        :<Form.Control
                            type     = "number"
                            onChange = {this.props.handleChange} 
                            value    = {this.props.cci}
                            name     = "cci"
                        />
                    }
                </Form.Group>
            </Aux>
        );
    }
}

export default FormCci;
