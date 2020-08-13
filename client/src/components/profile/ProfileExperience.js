import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';

const ProfileExperience = ({
    experience: { title, company, current, from, to, description },
}) => {
    return (
        <div>
            <h3 class='text-dark'>{company}</h3>
            <p>
                <Moment format='MMM YYYY'>{from}</Moment> -{' '}
                {current ? 'Now' : <Moment format='MMM YYYY'>{to}</Moment>}
            </p>
            <p>
                <strong>Position: </strong>
                {title}
            </p>
            <p>
                <strong>Description: </strong>
                {description}
            </p>
        </div>
    );
};

ProfileExperience.propTypes = {
    experience: PropTypes.object.isRequired,
};

export default ProfileExperience;
