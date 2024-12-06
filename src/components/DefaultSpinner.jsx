import PropTypes from "prop-types";
import SyncLoader from "react-spinners/SyncLoader";

export default function DefaultSpinner({ color="#12E091", loading=true, size=50 }) {
    const override = {
        display: "block",
        margin: "0 auto",
      };

      return (
        <SyncLoader
            color={color}
            loading={loading}
            cssOverride={override}
            size={size}
            aria-label="Loading Spinner"
            data-testid="loader"
        />
      ) 
}

DefaultSpinner.propTypes = {
    color: PropTypes.string,
    loading: PropTypes.bool,
    size: PropTypes.number,
};

