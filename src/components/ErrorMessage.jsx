import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';

export default function ErrorMessage({ currentError }) {

    if (Array.isArray(currentError)) {
        return (
            <div className='error-msg-container'>
                {currentError.map((error) => {
                    return (
                        <div key={uuidv4()} className='error-msg'>
                            {error.msg}
                        </div>
                    )
                })}
            </div>
        )
    } else {
        return (
            <div className='error-msg'>
                {currentError}
            </div>
        )
    }

}

ErrorMessage.propTypes = {
    currentError: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.array
    ]).isRequired
};