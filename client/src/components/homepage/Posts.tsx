import React, { useEffect, useState } from "react";
import { usePostsQuery } from "../../generated/graphql";
import { Layout } from "../common/Layout";
import { PostCard } from "../common/PostCard";
import { PostSection } from "../common/PostSection";

interface PostsProps {}

export const Posts: React.FC<PostsProps> = ({}) => {
  const { data } = usePostsQuery();
  const [renderPosts, setRenderPosts] = useState<Array<JSX.Element>>([
    <div key="loading">loading...</div>,
  ]);

  useEffect(() => {
    if (!data) {
      setRenderPosts([<div key="loading">loading...</div>]);
    } else if (data && data.posts) {
      const posts = data.posts.map((p) => {
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
