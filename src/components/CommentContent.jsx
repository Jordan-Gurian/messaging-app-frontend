import PropTypes from "prop-types";
import EditForm from './EditForm';
import EditButton from './EditButton';
import DeleteIcon from './../assets/delete.png'

export default function CommentContent({ onEditFormSubmit, comment, closeButtonOnClick, isActiveEdit }) {

    let content;

    if (comment.isDeleted) {
        content = '[deleted]';
    } else {
        content = comment.content;
    }
    
    return (
        (isActiveEdit ? (
            <EditForm
                onSubmit={onEditFormSubmit}
                content={comment.content}
                textAreaStyle={{maxLength: 250}}
            >
                <EditButton type='submit' width='28px'/>
                <EditButton icon={DeleteIcon} onClick={() => closeButtonOnClick()} width='28px'/>
            </EditForm>
        ) : (
            <span className='comment content'>{content}</span>
        ))
    );
}

CommentContent.propTypes = {
    onEditFormSubmit: PropTypes.func.isRequired,
    comment: PropTypes.object.isRequired,
    closeButtonOnClick: PropTypes.func.isRequired,
    isActiveEdit: PropTypes.bool,
};