import { Box, Button, Flex } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { usePostsQuery } from "../../generated/graphql";
import { Layout } from "../common/Layout";
import { PostCard } from "../common/PostCard";
import { PostSection } from "../common/PostSection";

interface PostsProps {}

export const Posts: React.FC<PostsProps> = ({}) => {
  const { data, loading, fetchMore, variables } = usePostsQuery({
    variables: {
      limit: 5,
      cursor: null,
    },
  });
  const [renderPosts, setRenderPosts] = useState<Array<JSX.Element>>([
    <div key="loading">loading...</div>,
  ]);
  const [loadMoreButton, setLoadMoreButton] = useState<JSX.Element | null>();

  useEffect(() => {
    if (!data) {
      setRenderPosts([<div key="loading">loading...</div>]);
    } else if (data && data.posts && data.posts.posts) {
      const posts = data.posts.posts.map((p) => {
        return <PostCard key={p.id} post={p} hasDetail={true} />;
      });
      setRenderPosts(posts);
    }
  }, [data]);

  useEffect(() => {
    if (data && data.posts && data.posts.hasMore) {
      setLoadMoreButton(
        <Flex>
          <Button
            onClick={() => {
              fetchMore({
                variables: {
                  limits: variables.limit,
                  cursor:
                    data.posts.posts[data.posts.posts.length - 1].createdAt,
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
            end of posts
          </Box>
        </Flex>
      );
    }
  }, [data]);

  return (
    <Layout>
      <PostSection>
        <Box>{renderPosts}</Box>
        <Box>{loadMoreButton}</Box>
      </PostSection>
    </Layout>
  );
};
