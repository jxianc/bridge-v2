import {
  Badge,
  Box,
  Button,
  Flex,
  HStack,
  SimpleGrid,
  Spacer,
  Tag,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import { Post, PostsQuery } from "../../generated/graphql";
import { unixToDate } from "../../utils/date";
import { BsCaretDownFill, BsCaretUpFill, BsReplyAllFill } from "react-icons/bs";
import { categoryColor } from "../../utils/categoryColor";
import NextLink from "next/link";
import { BiDetail } from "react-icons/bi";
import { FaRegEdit } from "react-icons/fa";

interface PostCardProps {
  post: PostsQuery["posts"]["posts"][0];
  hasDetail: boolean;
}

export const PostCard: React.FC<PostCardProps> = ({ post, hasDetail }) => {
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
          <NextLink href={`/create-comment/${post.id}`}>
            <Box _hover={{ color: "gray", cursor: "pointer" }}>
              <BsReplyAllFill />
            </Box>
          </NextLink>
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
        <SimpleGrid columns={1} spacing={10}>
          <Box>
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
          </Box>
          <Box>
            <Box fontSize="sm" fontStyle="italic" color="gray.600" mt={3}>
              <HStack spacing={10}>
                <Box>created at {unixToDate(post.createdAt)}</Box>
                {post.createdAt === post.updatedAt ? null : (
                  <Box>updated at {unixToDate(post.updatedAt)}</Box>
                )}
              </HStack>
            </Box>
            <Box position="absolute" bottom={0} right={0} mr={4} mb={4}>
              <HStack spacing={4}>
                <NextLink href={`/post/${post.id}`}>
                  <Button
                    size="sm"
                    shadow="md"
                    leftIcon={<FaRegEdit />}
                    colorScheme="gray"
                  >
                    edit
                  </Button>
                </NextLink>
                {hasDetail ? (
                  <NextLink href={`/post/${post.id}`}>
                    <Button
                      size="sm"
                      shadow="md"
                      leftIcon={<BiDetail />}
                      colorScheme="gray"
                    >
                      detail
                    </Button>
                  </NextLink>
                ) : null}
              </HStack>
            </Box>
          </Box>
        </SimpleGrid>
      </Box>
    </Flex>
  );
};
