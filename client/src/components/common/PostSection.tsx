import { Box, HStack, Button } from "@chakra-ui/react";
import React from "react";
import { IoMdCreate } from "react-icons/io";
import CategoryDropDown from "../categoryDropDown";
import NextLink from "next/link";

interface PostSectionProps {}

export const PostSection: React.FC<PostSectionProps> = ({ children }) => {
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
