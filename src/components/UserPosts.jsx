import PropTypes from 'prop-types';
import Post from './Post';

export default function UserPosts({ posts, postsLabel = 'Posts' }) {

    return (
        <div className='posts-section-container'>
            <div className='profile-page-section-label'>{postsLabel}</div>
            <div className='posts-content-container'>
                {posts.map((post) => {
                    return (
                        <Post 
                            key={post.id}
                            postId={post.id}
                        />
                    )
                })}
            </div>
        </div>
    )
} 

UserPosts.propTypes = {
    user: PropTypes.object,
    posts: PropTypes.array,
    postsLabel: PropTypes.string,
};