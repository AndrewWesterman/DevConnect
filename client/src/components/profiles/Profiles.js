import React, { useEffect } from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getProfiles } from '../../actions/profile';

const Profiles = ({ profiles, getProfiles }) => {
    useEffect(() => getProfiles(), [getProfiles]);

    return <div>{profiles.length} Profiles Found</div>;
};

Profiles.propTypes = {
    getProfiles: PropTypes.func.isRequired,
    profiles: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
    profiles: state.profile.profiles,
});

export default connect(mapStateToProps, { getProfiles })(Profiles);
