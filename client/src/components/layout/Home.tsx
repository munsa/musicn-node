import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { startRecordingMicrophone } from '../../actions/recording';

function record() {
  console.log('Start recording...');
}

const Home = ({ startRecordingMicrophone }) => {
  return (
    <div>
      <button className='btn' onClick={startRecordingMicrophone}>
        <i className='fa fa-microphone' title='Record' />
      </button>
    </div>
  );
};

Home.proTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { startRecordingMicrophone }
)(Home);
