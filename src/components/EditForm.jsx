import { useRef } from 'react';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useAuth } from './../hooks/AuthContext'
import { useLoggedInUser } from './../hooks/useLoggedInUser';

import './EditForm.css';

export default function EditForm({ onSubmit, children, content='', placeholder='', textAreaStyle={} }) {
    
    const textAreaRef = useRef();
    const usernameObj = useParams()
    const username = usernameObj.username;
    const loggedInUser = useLoggedInUser();

    let isUser = false;

    if (loggedInUser) {
        isUser = username === loggedInUser.username;
    }

    const { isAuthenticated } = useAuth();

    function handleSubmit(event) {
        event.preventDefault();
        const value = textAreaRef.current.value;
        onSubmit(value);
    };

    return (
        isUser && isAuthenticated && (
            <form className="active-edit-form" id="form" onSubmit={handleSubmit}>
                <textarea
                    ref={textAreaRef}
                    className="active-edit-text-area default-input-format default-scrollbar"
                    defaultValue={content}
                    placeholder={placeholder}
                    style={textAreaStyle}
                />
                {children}
            </form>
        )
    )
}

EditForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    children: PropTypes.node,
    content: PropTypes.string,
    placeholder: PropTypes.string,
    textAreaStyle: PropTypes.object,
};