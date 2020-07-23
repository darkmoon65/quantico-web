import React, {Component} from 'react';
import {Row, Col,Modal} from 'react-bootstrap';

import Aux from "../../hoc/_Aux";
import Card from "../../App/components/MainCard";
import cogoToast from "cogo-toast";
import Config from "../../config"
import Files from "../../files"

class IndexInicio extends Component {
  render() {
        return (
            <Aux>
                <Row>
                    <Col>
                        <p>Quantico</p>
                    </Col>
                </Row>
            </Aux>
        );
    }
}

export default IndexInicio;
