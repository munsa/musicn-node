import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const LoginAlert = ({ loginAlerts }) =>
  loginAlerts !== null &&
  loginAlerts.length > 0 &&
  loginAlerts.map(loginAlert => {
    return (
      <div
        key={loginAlert.id}
        className={`alert alert-${loginAlert.loginAlertType}`}
      >
        {loginAlert.msg}
      </div>
    );
  });

LoginAlert.propTypes = {
  loginAlerts: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
  loginAlerts: state.loginAlert
});

export default connect(mapStateToProps)(LoginAlert);
