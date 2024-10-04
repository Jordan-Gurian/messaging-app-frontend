import PropTypes from 'prop-types';

export default function LoginError(props) {

    return (
        <main>
            {props.currentError}
        </main>
    )
}

LoginError.propTypes = {
    currentError: PropTypes.string.isRequired
};