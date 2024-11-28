import PropTypes from "prop-types";
import EditForm from './EditForm';
import EditButton from './EditButton';
import DeleteIcon from './../assets/delete.png'

export default function PostContent({ onEditFormSubmit, post, closeButtonOnClick, isActiveEdit }) {
    return (
        (isActiveEdit ? (
            <EditForm
                onSubmit={onEditFormSubmit}
                content={post.content}
                textAreaStyle={{height: "4em", maxLength: 500}}
            >
                <EditButton type='submit' width='28px'/>
                <EditButton icon={DeleteIcon} onClick={() => closeButtonOnClick()} width='28px'/>
            </EditForm>
        ) : (
            <div className='post content'>{post.content}</div>
        ))
    );
}

PostContent.propTypes = {
    onEditFormSubmit: PropTypes.func.isRequired,
    post: PropTypes.object.isRequired,
    closeButtonOnClick: PropTypes.func.isRequired,
    isActiveEdit: PropTypes.bool,
};