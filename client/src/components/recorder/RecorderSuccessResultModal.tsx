import React, { useImperativeHandle, forwardRef } from 'react';
import {
  MDBContainer,
  MDBBtn,
  MDBModal,
  MDBModalBody,
  MDBModalHeader,
  MDBModalFooter
} from 'mdbreact';

const RecorderSuccessResultModal = forwardRef((props, ref) => {
  const [modal, setModal] = React.useState(false);

  useImperativeHandle(ref, () => ({
    openModal: () => {
      setModal(!modal);
    }
  }));

  const toggle = () => () => {
    setModal(!modal);
  };

  return (
    <MDBContainer>
      <MDBModal isOpen={modal} toggle={toggle()} centered>
        <MDBModalHeader toggle={toggle()}>Song found!</MDBModalHeader>
        <MDBModalBody>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit.
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
});

export default RecorderSuccessResultModal;
