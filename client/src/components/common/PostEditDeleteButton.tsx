import { Box, HStack, IconButton } from "@chakra-ui/react";
import NextLink from "next/link";
import React, { useEffect, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useDeletePostMutation, useMeQuery } from "../../generated/graphql";
import { isServer } from "../../utils/isServer";

interface PostEditDeleteButtonProps {
  postId: number;
  userId: number;
}

export const PostEditDeleteButton: React.FC<PostEditDeleteButtonProps> = ({
  userId,
  postId,
}) => {
  const { data } = useMeQuery({ skip: isServer() });
  const [renderEditButton, setRenderEditButton] =
    useState<JSX.Element | null>();
  const [deletePost] = useDeletePostMutation();

  useEffect(() => {
    if (!data) {
      setRenderEditButton(null);
    } else if (data?.me?.id !== userId) {
      setRenderEditButton(null);
    } else if (data?.me?.id === userId) {
      setRenderEditButton(
        <HStack spacing={4}>
          <NextLink href={`/post/edit-post/${postId}`}>
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
              deletePost({
                variables: {
                  postId,
                },
                update: (cache) => {
                  cache.evict({ id: "Post:" + postId }); // Post:69
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
