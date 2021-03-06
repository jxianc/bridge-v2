import { Box, HStack, Button } from "@chakra-ui/react";
import React from "react";
import { IoMdCreate } from "react-icons/io";
import CategoryDropDown from "../input/categoryDropDown";
import NextLink from "next/link";
import { PostCategory } from "../../generated/graphql";

interface PostSectionProps {
  preselected?: PostCategory;
}

export const PostSection: React.FC<PostSectionProps> = ({
  children,
  preselected,
}) => {
  return (
    <Box p={2} pt={0} m="0 auto" maxW="100%" maxH="864px" overflow="scroll">
      <Box
        m={2}
        p={4}
        mb={6}
        bg="white"
        borderRadius={6}
        shadow="2px 2px 6px #bababa"
      >
        <HStack spacing={4}>
          <CategoryDropDown navigate={true} preselected={preselected} />
          <NextLink href="/create-post">
            <Button
              bg="#38EBC0"
              color="black"
              _hover={{ bg: "#00B086" }}
              leftIcon={<IoMdCreate />}
              shadow="md"
            >
              Create
            </Button>
          </NextLink>
        </HStack>
      </Box>
      {children}
    </Box>
  );
};
