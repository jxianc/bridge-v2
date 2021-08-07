import { Badge, Box, Button, Flex, Tag } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import {
  usePostsByCategoryQuery,
  useSingleCategoryQuery,
} from "../../generated/graphql";
import { categoryColor } from "../../utils/categoryColor";
import { Layout } from "../common/Layout";
import { PostCard } from "../common/PostCard";
import { PostSection } from "../common/PostSection";
import NextLink from "next/link";
import { GoChevronLeft } from "react-icons/go";

interface PostsByCategoryProps {
  categoryId: number;
}

export const PostsByCategory: React.FC<PostsByCategoryProps> = ({
  categoryId,
}) => {
  const { data: postCategoryData } = useSingleCategoryQuery({
    variables: { postCategoryId: categoryId },
  });
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
  const [postCategoryHeader, setPostCategoryHeader] = useState<JSX.Element>();

  useEffect(() => {
    if (postCategoryData && postCategoryData.singleCategory) {
      setPostCategoryHeader(
        <Box p={2}>
          <NextLink href="/">
            <Button
              leftIcon={<GoChevronLeft />}
              shadow="2px 2px 6px #bababa"
              mr={4}
            >
              Home
            </Button>
          </NextLink>
          <NextLink href={`/category/${postCategoryData.singleCategory.id}`}>
            <Badge
              fontSize="sm"
              colorScheme={categoryColor[postCategoryData.singleCategory.id]}
              shadow="md"
              _hover={{ shadow: "1px 1px 8px #888888", cursor: "pointer" }}
            >
              {postCategoryData.singleCategory.name}
            </Badge>
          </NextLink>
        </Box>
      );
    }
  }, [postCategoryData]);

  useEffect(() => {
    if (!data) {
      setRenderPosts([<div key="loading">loading...</div>]);
    } else if (data && data.postsByCategory && data.postsByCategory.posts) {
      const posts = data.postsByCategory.posts.map((p) => {
        return <PostCard key={p.id} post={p} hasDetail={true} />;
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
      {postCategoryData && postCategoryData.singleCategory ? (
        <PostSection preselected={postCategoryData.singleCategory}>
          <Box>{postCategoryHeader}</Box>
          <Box>{renderPosts}</Box>
          <Box>{loadMoreButton}</Box>
        </PostSection>
      ) : null}
    </Layout>
  );
};
