import {
  Box,
  Button,
  Flex,
  HStack,
  SimpleGrid,
  Spacer,
  Tag,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import { BsCaretDownFill, BsCaretUpFill } from "react-icons/bs";
import { Comment } from "../../generated/graphql";
import { unixToDate } from "../../utils/date";
import NextLink from "next/link";
import { FaRegEdit } from "react-icons/fa";

interface CommentCardProps {
  comment: Comment;
}

export const CommentCard: React.FC<CommentCardProps> = ({ comment }) => {
  return (
    <Flex m={2} mb={4} ml={12}>
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
          {comment.points}
          <Box _hover={{ color: "red", cursor: "pointer" }}>
            <BsCaretDownFill />
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
            <Box mb={2} spacing={4}>
              <Tag colorScheme="whatsapp" shadow="md">
                {comment.user.username}
              </Tag>
            </Box>
            <Box>{comment.body}</Box>
          </Box>
          <Box>
            <Box fontSize="sm" fontStyle="italic" color="gray.600">
              <HStack spacing={10}>
                <Box>created at {unixToDate(comment.createdAt)}</Box>
                {comment.createdAt === comment.updatedAt ? null : (
                  <Box>updated at {unixToDate(comment.updatedAt)}</Box>
                )}
              </HStack>
            </Box>
            <Box position="absolute" bottom={0} right={0} mr={4} mb={4}>
              {/* <NextLink href={`/post/${post.id}`}> */}
              <Button
                size="sm"
                shadow="md"
                leftIcon={<FaRegEdit />}
                colorScheme="gray"
              >
                edit
              </Button>
              {/* </NextLink> */}
            </Box>
          </Box>
        </SimpleGrid>
      </Box>
    </Flex>
  );
};
