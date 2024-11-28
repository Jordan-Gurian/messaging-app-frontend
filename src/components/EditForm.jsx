import { useRef } from 'react';
import PropTypes from 'prop-types';

import './EditForm.css';

export default function EditForm({ onSubmit, children, content='', placeholder='', textAreaStyle={} }) {
    
    const textAreaRef = useRef();

    function handleSubmit(event) {
        event.preventDefault();
        const value = textAreaRef.current.value;
        onSubmit(value);
    };

    return (
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
}

EditForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    children: PropTypes.node,
    content: PropTypes.string,
    placeholder: PropTypes.string,
    textAreaStyle: PropTypes.object,
};