import React from "react";
import { NextPage } from "next";
import NextLink from "next/link";
import { useRouter } from "next/router";
import {
  Comment,
  useCommentsByPostQuery,
  useSinglePostQuery,
} from "../../generated/graphql";
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
  SimpleGrid,
  Spacer,
  Tag,
  VStack,
} from "@chakra-ui/react";
import { BsCaretUpFill, BsCaretDownFill, BsReplyAllFill } from "react-icons/bs";
import { categoryColor } from "../../utils/categoryColor";
import { unixToDate } from "../../utils/date";
import { FaRegEdit } from "react-icons/fa";
import { CommentCard } from "../../components/common/CommentCard";

const Post: NextPage<{ postId: string }> = () => {
  const [renderError, setRenderError] = useState<JSX.Element>();
  const [renderPost, setRenderPost] = useState<JSX.Element>();
  const [renderComment, setRenderComment] = useState<Array<JSX.Element>>();
  const [loadMoreButton, setLoadMoreButton] = useState<JSX.Element | null>();
  const router = useRouter();
  const { data } = useSinglePostQuery({
    variables: {
      postId: parseInt(
        typeof router.query.postId === "string" ? router.query.postId : ""
      ),
    },
  });
  const {
    data: commentData,
    loading,
    fetchMore,
    variables,
  } = useCommentsByPostQuery({
    variables: {
      postId: parseInt(
        typeof router.query.postId === "string" ? router.query.postId : ""
      ),
      limit: 1,
      cursor: null,
    },
  });

  useEffect(() => {
    if (data && data.singlePost && data.singlePost.errors) {
      if (data.singlePost.errors[0].field === "postId") {
        setRenderError(
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
            <SimpleGrid columns={1} spacing={10}>
              <Box>
                <HStack mb={2} spacing={4}>
                  <NextLink href={`/category/${post.postCategory.id}`}>
                    <Badge
                      fontSize="sm"
                      colorScheme={categoryColor[post.postCategory.id]}
                      shadow="md"
                      _hover={{
                        shadow: "1px 1px 8px #888888",
                        cursor: "pointer",
                      }}
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
            </SimpleGrid>
          </Box>
        </Flex>
      );
    }
  }, [data]);

  useEffect(() => {
    if (!commentData && loading) {
      setRenderComment([<div key="loading">loading...</div>]);
    } else if (
      commentData &&
      commentData.commentsByPost &&
      commentData.commentsByPost.comments
    ) {
      const comments = commentData.commentsByPost.comments.map((c) => {
        return <CommentCard key={c.id} comment={c as Comment} />;
      });
      setRenderComment(comments);
    }
  }, [commentData]);

  useEffect(() => {
    if (
      commentData &&
      commentData.commentsByPost &&
      commentData.commentsByPost.hasMore
    ) {
      setLoadMoreButton(
        <Flex>
          <Button
            onClick={() => {
              fetchMore({
                variables: {
                  limits: variables.limit,
                  cursor:
                    commentData.commentsByPost.comments[
                      commentData.commentsByPost.comments.length - 1
                    ].createdAt,
                },
              });
            }}
            isLoading={loading}
            shadow="md"
            m="auto"
          >
            Load More
          </Button>
        </Flex>
      );
    } else {
      setLoadMoreButton(
        <Flex>
          <Box m="auto" fontStyle="italic" color="gray.500">
            end of comments
          </Box>
        </Flex>
      );
    }
  }, [commentData]);

  return (
    <Wrapper variant="regular" title="Post">
      <BrowserHead title="Post" />
      {renderError ? renderError : null}
      {renderPost ? renderPost : null}
      {renderComment ? renderComment : null}
      <Box>{loadMoreButton}</Box>
    </Wrapper>
  );
};

export default withApollo({ ssr: true })(Post);
