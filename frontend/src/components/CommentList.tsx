// src/components/CommentList.tsx

import React from "react";
import { Comment } from "../types";
import CommentItem from "./CommentItem";

interface CommentListProps {
  comments: Comment[];
  onCommentAdded: () => void;
  level?: number;
}

const CommentList: React.FC<CommentListProps> = ({
  comments,
  onCommentAdded,
  level = 0,
}) => {
  return (
    <>
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          onCommentAdded={onCommentAdded}
          level={level}
        />
      ))}
    </>
  );
};

export default CommentList;
