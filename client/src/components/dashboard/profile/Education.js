import React, { Fragment } from 'react';
import Moment from 'react-moment';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const Education = ({ education }) => {
    const educations = education.map((exp) => (
        <tr key={exp.id}>
            <td>{exp.school}</td>
            <td className='hide-sm'>{exp.degree}</td>
            <td className='hide-sm'>{exp.fieldofstudy}</td>
            <td>
                <Moment format='YYYY/MM/DD'>{exp.from}</Moment> -{' '}
                {exp.to == null ? (
                    ' Now'
                ) : (
                    <Moment format='YYYY/MM/DD'>{exp.to}</Moment>
                )}
            </td>
            <td>
                <button className='btn btn-danger'>Delete</button>
            </td>
        </tr>
    ));

    return (
        <Fragment>
            <h2 className='my-2'>Education Credentials</h2>
            <table className='table'>
                <thead>
                    <tr>
                        <th>School</th>
                        <th className='hide-sm'>Degree</th>
                        <th className='hide-sm'>Field of Study</th>
                        <th className='hide-sm'>Years</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>{educations}</tbody>
            </table>
        </Fragment>
    );
};

Education.propTypes = {
    education: PropTypes.array.isRequired,
};

export default Education;
