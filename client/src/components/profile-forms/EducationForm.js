import React, { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import { addEducation } from '../../actions/profile';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const initialState = {
    school: '',
    degree: '',
    fieldofstudy: '',
    from: '',
    to: '',
    current: false,
    description: '',
};

const EducationForm = ({ addEducation, history }) => {
    // Init state variables
    const [formData, setFormData] = useState(initialState);

    // Deconstruct object props for easier use in JSX
    const {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description,
    } = formData;

    // Prop change handler
    const onChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    // Form submit handler
    const onSubmit = (e) => {
        e.preventDefault();
        addEducation(formData, history);
    };

    return (
        <Fragment>
            <h1 className='large text-primary'>Add Your Education</h1>
            <p className='lead'>
                <i className='fas fa-graduation-cap'></i> Add any school,
                bootcamp, etc that you have attended
            </p>
            <small>* = required field</small>
            <form className='form' onSubmit={onSubmit}>
                <div className='form-group'>
                    <input
                        type='text'
                        placeholder='* School or Bootcamp'
                        name='school'
                        value={school}
                        onChange={onChange}
                        required
                    />
                </div>
                <div className='form-group'>
                    <input
                        type='text'
                        placeholder='* Degree or Certificate'
                        name='degree'
                        value={degree}
                        onChange={onChange}
                        required
                    />
                </div>
                <div className='form-group'>
                    <input
                        type='text'
                        placeholder='Field Of Study'
                        name='fieldofstudy'
                        value={fieldofstudy}
                        onChange={onChange}
                    />
                </div>
                <div className='form-group'>
                    <h4>From Date</h4>
                    <input
                        type='date'
                        name='from'
                        value={from}
                        onChange={onChange}
                    />
                </div>
                <div className='form-group'>
                    <p>
                        <input
                            type='checkbox'
                            name='current'
                            value={current}
                            onChange={(e) =>
                                setFormData({ ...formData, current: !current })
                            }
                        />{' '}
                        Current School or Bootcamp
                    </p>
                </div>
                {!current && (
                    <div className='form-group'>
                        <h4>To Date</h4>
                        <input
                            type='date'
                            name='to'
                            value={to}
                            onChange={onChange}
                            disabled={current}
                        />
                    </div>
                )}
                <div className='form-group'>
                    <textarea
                        name='description'
                        cols='30'
                        rows='5'
                        placeholder='Program Description'
                        value={description}
                        onChange={onChange}
                    ></textarea>
                </div>
                <input type='submit' className='btn btn-primary my-1' />
                <Link className='btn btn-light my-1' to='/dashboard'>
                    Go Back
                </Link>
            </form>
        </Fragment>
    );
};

EducationForm.propTypes = {
    addEducation: PropTypes.func.isRequired,
};

export default connect(null, { addEducation })(EducationForm);
