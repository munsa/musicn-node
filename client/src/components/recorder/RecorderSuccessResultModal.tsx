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

  const Source = ({ source: { artists, track, album } }) => {
    return (
      <div>
        {/* Artists */}
        <div className='row'>
          <b className='col text-right'>Artist</b>
          <div className='col-9 text-left'>
            {artists.map((a, j) => (
              <a key={j}>
                {j > 0 && ', '}
                {a.name}
              </a>
            ))}
          </div>
        </div>
        {/* Track */}
        <div className='row'>
          <b className='col text-right'>Track</b>
          <div className='col-9 text-left'>{track.name}</div>
        </div>
        {/* Album */}
        <div className='row'>
          <b className='col text-right'>Album</b>
          <div className='col-9 text-left'>{album.name}</div>
        </div>
      </div>
    );
  };

  return result ? (
    <MDBContainer>
      <MDBModal isOpen={isOpen} toggle={toggle} centered>
        <MDBModalHeader toggle={toggle()}>Song found!</MDBModalHeader>
        <MDBModalBody>
          <div>
            {result.metadata.music.map((m, i) => (
              <div key={i}>
                <Source source={m.external_metadata.spotify} />
                <hr />
                <Source source={m.external_metadata.deezer} />
              </div>
            ))}
          </div>
        </MDBModalBody>
        <MDBModalFooter>
          <MDBBtn color='primary' onClick={toggle()}>
            Done
          </MDBBtn>
        </MDBModalFooter>
      </MDBModal>
    </MDBContainer>
  ) : (
    ''
  );
};

export default connect()(RecorderSuccessResultModal);
