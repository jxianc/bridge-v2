import { Box, HStack, Button } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { usePostsQuery } from "../../generated/graphql";
import { IoMdCreate } from "react-icons/io";
import CategoryDropDown from "../categoryDropDown";
import { PostCard } from "./PostCard";

interface PostSectionProps {}

export const PostSection: React.FC<PostSectionProps> = ({}) => {
  const { data, error } = usePostsQuery();
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
    <Box p={2} pt={0} m="0 auto" maxW="100%" maxH="864px" overflow="scroll">
      <Box
        m={2}
        p={4}
        mb={4}
        bg="white"
        borderRadius={6}
        shadow="2px 2px 6px #bababa"
      >
        <HStack spacing={4}>
          <CategoryDropDown navigate={true} />
          <Button
            bg="#38EBC0"
            color="black"
            _hover={{ bg: "#00B086" }}
            leftIcon={<IoMdCreate />}
            shadow="md"
          >
            Create
          </Button>
        </HStack>
      </Box>
      {renderPosts}
    </Box>
  );
};
