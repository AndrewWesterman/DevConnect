import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import { getProfile } from '../../actions/profile';
import { Link } from 'react-router-dom';
import ProfileTop from './ProfileTop';
import ProfileAbout from './ProfileAbout';
import ProfileExperience from './ProfileExperience';
import ProfileEducation from './ProfileEducation';

const Profile = ({
    getProfile,
    profile: { profile, loading },
    auth,
    match,
}) => {
    useEffect(() => {
        getProfile(match.params.id);
    }, [getProfile, match.params.id]);

    return (
        <Fragment>
            {profile === null || loading ? (
                <Spinner />
            ) : (
                <Fragment>
                    <Link to='/profiles' className='btn btn-light'>
                        Back to Profiles
                    </Link>
                    {auth.isAuthenticated &&
                        auth.loading === false &&
                        auth.user._id === profile.user._id && (
                            <Link to='/edit-profile' className='btn btn-dark'>
                                Edit Profile
                            </Link>
                        )}

                    {/* Experience */}
                    <div class='profile-grid my-1'>
                        <ProfileTop profile={profile} />
                        <ProfileAbout profile={profile} />

                        <div class='profile-exp bg-white p-2'>
                            <h2 class='text-primary'>Experience</h2>
                            {profile.experience.length > 0 ? (
                                <Fragment>
                                    {profile.experience.map((exp) => (
                                        <ProfileExperience
                                            key={exp._id}
                                            experience={exp}
                                        />
                                    ))}
                                </Fragment>
                            ) : (
                                <h4>No experience credentials</h4>
                            )}
                        </div>

                        {/* Education */}
                        <div class='profile-edu bg-white p-2'>
                            <h2 class='text-primary'>Education</h2>
                            {profile.education.length > 0 ? (
                                <Fragment>
                                    {profile.education.map((exp) => (
                                        <ProfileEducation
                                            key={exp._id}
                                            education={exp}
                                        />
                                    ))}
                                </Fragment>
                            ) : (
                                <h4>No education credentials</h4>
                            )}
                        </div>
                    </div>
                </Fragment>
            )}
        </Fragment>
    );
};

Profile.propTypes = {
    getProfile: PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    profile: state.profile,
    auth: state.auth,
});

export default connect(mapStateToProps, { getProfile })(Profile);
