import PropTypes from "prop-types";
import { useState, useEffect } from 'react';
import FollowBlock from './FollowBlock';
import CloseIcon from './CloseIcon';

import './PostMetrics.css';

export default function PostMetrics({ usersThatLiked=[], comments=0 }) {

    const [modalOpen, setModalOpen] = useState(false);

    const modalContent = document.querySelector('.modal-content');
    const rect = modalContent?.getBoundingClientRect();
    let height;

    if (rect) {
        height = rect.height;
    } else {
        height = 'auto';
    }

    return (
        <>
        {modalOpen && (
            <div role="dialog">
                <div className="modal-overlay"></div>
                <div className="modal-container">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button
                                type="button"
                                className="close-profile-image"
                                onClick={() => setModalOpen(false)}
                            >
                                <span>Close menu</span>
                                <CloseIcon />
                            </button>
                        </div>
                        <div className="users-that-liked-block default-scrollbar" style={{ maxHeight: height }}>
                            <FollowBlock followUsers={usersThatLiked}/>
                        </div>
                    </div>
                </div>
            </div>
        )}

            <div className='post metrics subtext'>
                <div className='post likes' onClick={() => setModalOpen(true)}>{usersThatLiked.length} Likes</div>
                <div className='post comments'>{comments} Comments</div>
            </div>
        </>
    );
}

PostMetrics.propTypes = {
    usersThatLiked: PropTypes.array,
    comments: PropTypes.number,
};