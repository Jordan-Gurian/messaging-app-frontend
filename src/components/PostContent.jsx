import PropTypes from "prop-types";
import EditForm from './EditForm';
import EditButton from './EditButton';

export default function PostMetrics({ onEditFormSubmit, post, closeButtonOnClick, isActiveEdit }) {
    return (
        (isActiveEdit ? (
            <EditForm
                onSubmit={onEditFormSubmit}
                content={post.content}
                textAreaStyle={{height: "4em"}}
            >
                <EditButton type='submit' width='28px'/>
                <button className="close-button" onClick={() => closeButtonOnClick()}>
                    X
                </button>
            </EditForm>
        ) : (
            <div className='post content'>{post.content}</div>
        ))
    );
}

PostMetrics.propTypes = {
    onEditFormSubmit: PropTypes.func.isRequired,
    post: PropTypes.object.isRequired,
    closeButtonOnClick: PropTypes.func.isRequired,
    isActiveEdit: PropTypes.bool,
};