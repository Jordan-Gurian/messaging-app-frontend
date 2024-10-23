import PropTypes from "prop-types";

export default function IconImage({icon, height="auto", width="auto"}) {
    return (
        <img
            src={icon}
            height={height}
            width={width}
            alt="404 not found"
        />
    )
}

IconImage.propTypes = {
    icon: PropTypes.string.isRequired,
    height: PropTypes.string,
    width: PropTypes.string,
};