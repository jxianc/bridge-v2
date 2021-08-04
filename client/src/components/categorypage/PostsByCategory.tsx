import { Box, Button, Flex } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Post, usePostsByCategoryQuery } from "../../generated/graphql";
import { Layout } from "../common/Layout";
import { PostCard } from "../common/PostCard";
import { PostSection } from "../common/PostSection";

interface PostsByCategoryProps {
  categoryId: number;
}

export const PostsByCategory: React.FC<PostsByCategoryProps> = ({
  categoryId,
}) => {
  const { data, loading, fetchMore, variables } = usePostsByCategoryQuery({
    variables: {
      categoryId,
      limit: 1,
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
    } else if (data && data.postsByCategory && data.postsByCategory.posts) {
      const posts = data.postsByCategory.posts.map((p) => {
        return <PostCard key={p.id} post={p as Post} />;
      });
      setRenderPosts(posts);
    }
  }, [data]);

  useEffect(() => {
    if (data && data.postsByCategory && data.postsByCategory.hasMore) {
      setLoadMoreButton(
        <Flex>
          <Button
            onClick={() => {
              fetchMore({
                variables: {
                  limits: variables.limit,
                  cursor:
                    data.postsByCategory.posts[
                      data.postsByCategory.posts.length - 1
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
