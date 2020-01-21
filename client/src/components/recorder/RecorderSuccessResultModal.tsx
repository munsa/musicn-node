import React, { useEffect, forwardRef } from 'react';
import { connect } from 'react-redux';
import {
  MDBContainer,
  MDBBtn,
  MDBModal,
  MDBModalBody,
  MDBModalHeader,
  MDBModalFooter
} from 'mdbreact';

const RecorderSuccessResultModal = ({ result }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  useEffect(() => {
    if (result) {
      setIsOpen(!isOpen);
    }
  }, [result]);

  const toggle = () => () => {
    setIsOpen(!isOpen);
  };

  return (
    <MDBContainer>
      <MDBModal isOpen={isOpen} toggle={toggle} centered>
        <MDBModalHeader toggle={toggle()}>Song found!</MDBModalHeader>
        <MDBModalBody>
          {result ? result.metadata.timestamp_utc : ''}
        </MDBModalBody>
        <MDBModalFooter>
          <MDBBtn color='secondary' onClick={toggle()}>
            Close
          </MDBBtn>
          <MDBBtn color='primary'>Save changes</MDBBtn>
        </MDBModalFooter>
      </MDBModal>
    </MDBContainer>
  );
};

export default connect()(RecorderSuccessResultModal);
