import { Badge, Box, HStack, Tag } from "@chakra-ui/react";
import React from "react";
import { Post } from "../../generated/graphql";
import { unixToDate } from "../../utils/date";

interface PostCardProps {
  post: Post;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  return (
    <Box m={2} mt={4} mb={4} p={4} shadow="lg" borderRadius={6}>
      <HStack mb={2} spacing={4}>
        <Badge fontSize="md" shadow="md">
          {post.postCategory.name}
        </Badge>
        <Tag colorScheme="whatsapp" shadow="md">
          {post.user.username}
        </Tag>
      </HStack>
      <Box fontSize="xl">
        <strong>{post.title}</strong>
      </Box>
      <Box>{post.body}</Box>
      <Box mt={8} fontSize="sm" fontStyle="italic" color="gray.600">
        <HStack spacing={10}>
          <Box>created at {unixToDate(post.createdAt)}</Box>
          <Box>updated at {unixToDate(post.updatedAt)}</Box>
        </HStack>
      </Box>
    </Box>
  );
};
