import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';

const ProfileEducation = ({
    education: { school, current, to, from, degree, fieldofstudy, description },
}) => {
    return (
        <div>
            <h3>{school}</h3>
            <p>
                <Moment format='MMM YYYY'>{from}</Moment> -{' '}
                {current ? 'Now' : <Moment format='MMM YYYY'>{to}</Moment>}
            </p>
            <p>
                <strong>Degree: </strong>
                {degree}
            </p>
            <p>
                <strong>Field Of Study: </strong>
                {fieldofstudy}
            </p>
            <p>
                <strong>Description: </strong>
                {description}
            </p>
        </div>
    );
};

ProfileEducation.propTypes = {
    education: PropTypes.object.isRequired,
};

export default ProfileEducation;
