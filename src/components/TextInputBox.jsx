import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import IconImage from './../components/IconImage';
import SendIcon from './../assets/send.png';

import './TextInputBox.css';

export default function TextInputBox({ sendText }) {
    
    const [text, setText] = useState("");
    const [rows, setRows] = useState(1);
    const textareaRef = useRef(null);

    const [formWidth, setFormWidth] = useState(0);
    const formContainerRef = useRef(null); 

    const handleChange = (e) => {
        const lineHeight = 24; // Adjust based on your styling
        setText(e.target.value);

        // Reset the height to auto to let it shrink when content is removed
        textareaRef.current.style.height = 'auto';

        // Calculate the new rows based on content height and limit it to maxRows
        const newRows = Math.floor(textareaRef.current.scrollHeight / lineHeight)
        setRows(newRows);

        // Set the height to the calculated rows
        textareaRef.current.style.height = `${newRows * lineHeight}px`;
    };

    function handleSubmit(event) {
        sendText(event, text);
        setText('');
    }

    useEffect(() => {
        if (formContainerRef.current) {
            setFormWidth(formContainerRef.current.offsetWidth);
        }
    }, []);

    return (            
        <form className="new-message-form" id="form" ref={formContainerRef} onSubmit={handleSubmit}>
            <textarea 
                ref={textareaRef}
                id="message"
                className="default-input-format" 
                rows={rows}
                cols="30"
                value={text}
                onChange={handleChange}
                onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                        handleSubmit(event); // Submit form
                    }
                }}
                placeholder="Enter your message here..."
                style={{
                    overflowY: "hidden",
                    lineHeight: "1.5",
                }}
            />
            <button className="search-button send-button" type="submit">
                <IconImage className="icon-image" icon={SendIcon} width="28px" />
            </button>
        </form>
    )
}

TextInputBox.propTypes = {
    sendText: PropTypes.func.isRequired,
};