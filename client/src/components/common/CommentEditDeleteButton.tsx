import { Box, HStack, IconButton } from "@chakra-ui/react";
import NextLink from "next/link";
import React, { useEffect, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useDeleteCommentMutation, useMeQuery } from "../../generated/graphql";
import { isServer } from "../../utils/isServer";

interface CommentEditDeleteButtonProps {
  postId: number;
  userId: number;
  commentId: number;
}

export const CommentEditDeleteButton: React.FC<CommentEditDeleteButtonProps> =
  ({ userId, postId, commentId }) => {
    const { data } = useMeQuery({ skip: isServer() });
    const [renderEditButton, setRenderEditButton] =
      useState<JSX.Element | null>();
    const [deleteComment] = useDeleteCommentMutation();

    useEffect(() => {
      if (!data) {
        setRenderEditButton(null);
      } else if (data?.me?.id !== userId) {
        setRenderEditButton(null);
      } else if (data?.me?.id === userId) {
        setRenderEditButton(
          <HStack spacing={4}>
            <NextLink href={`/post/edit-comment/${commentId}/${postId}`}>
              <IconButton
                colorScheme="gray"
                aria-label="edit"
                size="md"
                shadow="md"
                title="Edit Post"
                icon={<FaRegEdit />}
              />
            </NextLink>
            <IconButton
              colorScheme="gray"
              aria-label="delete"
              size="md"
              shadow="md"
              title="Delete Post"
              icon={<RiDeleteBin6Line />}
              onClick={() => {
                deleteComment({
                  variables: {
                    commentId,
                  },
                  update: (cache) => {
                    cache.evict({ id: "Comment:" + commentId }); // Comment:69
                  },
                });
              }}
            />
          </HStack>
        );
      }
    }, [data]);

    return <Box>{renderEditButton}</Box>;
  };
