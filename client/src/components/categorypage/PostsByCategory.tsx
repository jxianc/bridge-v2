import React, { useEffect, useState } from "react";
import { PostCategory, usePostsByCategoryQuery } from "../../generated/graphql";
import { Layout } from "../common/Layout";
import { PostCard } from "../common/PostCard";
import { PostSection } from "../common/PostSection";

interface PostsByCategoryProps {
  categoryId: number;
}

export const PostsByCategory: React.FC<PostsByCategoryProps> = ({
  categoryId,
}) => {
  const { data } = usePostsByCategoryQuery({
    variables: {
      categoryId,
    },
  });
  const [renderPosts, setRenderPosts] = useState<Array<JSX.Element>>([
    <div key="loading">loading...</div>,
  ]);

  useEffect(() => {
    if (!data) {
      setRenderPosts([<div key="loading">loading...</div>]);
    } else if (data && data.postsByCategory) {
      const posts = data.postsByCategory.map((p) => {
        return <PostCard key={p.id} post={p} />;
      });
      setRenderPosts(posts);
    }
  }, [data]);

  return (
    <Layout>
      <PostSection>{renderPosts}</PostSection>
    </Layout>
  );
};
