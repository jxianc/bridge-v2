import React from "react";
import { NextPage } from "next";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useSinglePostQuery } from "../../generated/graphql";
import { useEffect } from "react";
import { withApollo } from "../../utils/withApollo";
import { Wrapper } from "../../components/Wrapper";
import { BrowserHead } from "../../components/BrowserHead";
import { useState } from "react";
import {
  Badge,
  Box,
  Button,
  Flex,
  HStack,
  Spacer,
  Tag,
  VStack,
} from "@chakra-ui/react";
import { BsCaretUpFill, BsCaretDownFill, BsReplyAllFill } from "react-icons/bs";
import { categoryColor } from "../../utils/categoryColor";
import { unixToDate } from "../../utils/date";
import { FaRegEdit } from "react-icons/fa";

const Post: NextPage<{ postId: string }> = () => {
  const [renderPost, setRenderPost] = useState<JSX.Element>();
  const router = useRouter();
  const { data } = useSinglePostQuery({
    variables: {
      postId: parseInt(
        typeof router.query.postId === "string" ? router.query.postId : ""
      ),
    },
  });

  useEffect(() => {
    if (data && data.singlePost && data.singlePost.errors) {
      if (data.singlePost.errors[0].field === "postId") {
        setRenderPost(
          <VStack>
            <strong>{data.singlePost.errors[0].message}</strong>
            <Box>
              <NextLink href="/">
                <Button
                  mt={10}
                  bg="#38EBC0"
                  color="black"
                  _hover={{ bg: "#32d1ab" }}
                >
                  back to home page
                </Button>
              </NextLink>
            </Box>
          </VStack>
        );
      }
    }
  }, [data]);

  useEffect(() => {
    if (data && data.singlePost && data.singlePost.post) {
      const post = data.singlePost.post;
      setRenderPost(
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
            <Box position="absolute" bottom={0} right={0} mr={4} mb={4}>
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
            </Box>
          </Box>
        </Flex>
      );
    }
  }, [data]);

  return (
    <Wrapper variant="regular" title="Post">
      <BrowserHead title="Post" />
      {renderPost}
    </Wrapper>
  );
};

export default withApollo({ ssr: true })(Post);
