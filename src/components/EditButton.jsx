import PropTypes from 'prop-types';
import IconImage from './../components/IconImage';
import EditIcon from './../assets/edit.png';

export default function EditButton({ type = 'button', onClick, icon = EditIcon, width='auto', title=null, hoverToggle=false }) {
    return (
        (
            <button
                className={hoverToggle ? "edit-button hover-toggle" : "edit-button"}
                type={type}
                onClick={type === 'button' ? onClick : null}
                title={title}
            >
                <IconImage icon={icon} width={width} />
            </button>
        )
    )
}

EditButton.propTypes = {
    type: PropTypes.oneOf(['button', 'submit', 'reset']),
    onClick: PropTypes.func,
    icon: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    width: PropTypes.string,
    title: PropTypes.string,
    hoverToggle: PropTypes.bool,
};