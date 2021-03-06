import React, {useEffect, Fragment} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Spinner from "../layout/Spinner";
import PostItem from "../posts/PostItem";
import {getPost} from "../../actions/post";
import {Link} from "react-router-dom";
import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";

const Post = ({getPost, post: {post, loading}, match}) => {
  useEffect(() => {
    getPost(match.params.id)
  }, [getPost])
  return loading || post === null ? <Spinner />: <Fragment>
    <Link to='/post' className='btn'>Back to post</Link>
    <PostItem post={post} showAction='false' />
    <CommentForm post={post._id}/>
    {post.comments.map(comment => (
      <CommentItem key={comment._id} comment={comment} postId={post._id}/>
    ))}
  </Fragment>;
};

Post.propTypes = {
  getPost: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  post: state.post
})

export default connect(mapStateToProps, {getPost})(Post);