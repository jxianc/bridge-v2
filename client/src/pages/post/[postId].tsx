import { Box, Button, Flex, VStack } from "@chakra-ui/react";
import { NextPage } from "next";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { BrowserHead } from "../../components/BrowserHead";
import { CommentCard } from "../../components/common/CommentCard";
import { PostCard } from "../../components/common/PostCard";
import { Wrapper } from "../../components/Wrapper";
import {
  useCommentsByPostQuery,
  useSinglePostQuery,
} from "../../generated/graphql";
import { withApollo } from "../../utils/withApollo";

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
      console.log(post);
      setRenderPost(<PostCard post={post} hasDetail={false} />);
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
        return <CommentCard key={c.id} comment={c} />;
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
            mb={4}
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
      <Box m="0 auto" maxH="500px" overflow="scroll">
        {renderComment ? renderComment : null}
        <Box>{loadMoreButton}</Box>
      </Box>
    </Wrapper>
  );
};

export default withApollo({ ssr: true })(Post);
