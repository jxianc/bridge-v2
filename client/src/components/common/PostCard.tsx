import {
  Badge,
  Box,
  Flex,
  HStack,
  Spacer,
  Tag,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import { Post } from "../../generated/graphql";
import { unixToDate } from "../../utils/date";
import { BsCaretDownFill, BsCaretUpFill, BsReplyAllFill } from "react-icons/bs";
import { categoryColor } from "../../utils/categoryColor";
import NextLink from "next/link";

interface PostCardProps {
  post: Post;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  return (
    <Flex m={2} mb={8}>
      <VStack
        p={4}
        bg="white"
        textAlign="center"
        fontSize="x-large"
        w="6%"
        borderRadius={6}
        shadow="2px 2px 6px #bababa"
      >
        <Box>
          <Box _hover={{ color: "#00c43e", cursor: "pointer" }}>
            <BsCaretUpFill />
          </Box>
          {post.points}
          <Box _hover={{ color: "red", cursor: "pointer" }}>
            <BsCaretDownFill />
          </Box>
        </Box>
        <Spacer />

        <Box>
          {post.comments ? post.comments.length : 0}
          <Box _hover={{ color: "gray", cursor: "pointer" }}>
            <BsReplyAllFill />
          </Box>
        </Box>
      </VStack>
      <Box
        p={4}
        w="100%"
        shadow="2px 2px 6px #bababa"
        borderRadius={6}
        bg="white"
        position="relative"
      >
        <HStack mb={2} spacing={4}>
          <NextLink href={`/category/${post.postCategory.id}`}>
            <Badge
              fontSize="sm"
              colorScheme={categoryColor[post.postCategory.id]}
              shadow="md"
              _hover={{ shadow: "1px 1px 8px #888888", cursor: "pointer" }}
            >
              {post.postCategory.name}
            </Badge>
          </NextLink>

          <Tag colorScheme="whatsapp" shadow="md">
            {post.user.username}
          </Tag>
        </HStack>
        <Box fontSize="xl">
          <strong>{post.title}</strong>
        </Box>
        <Box>{post.body}</Box>
        <Box
          position="absolute"
          bottom={0}
          mb={4}
          fontSize="sm"
          fontStyle="italic"
          color="gray.600"
        >
          <HStack spacing={10}>
            <Box>created at {unixToDate(post.createdAt)}</Box>
            {post.createdAt === post.updatedAt ? null : (
              <Box>updated at {unixToDate(post.updatedAt)}</Box>
            )}
          </HStack>
        </Box>
      </Box>
    </Flex>
  );
};
