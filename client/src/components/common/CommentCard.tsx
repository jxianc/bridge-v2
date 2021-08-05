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
import {
  Comment,
  CommentsByPostQuery,
  useVoteCommentMutation,
  VoteCommentMutation,
} from "../../generated/graphql";
import { unixToDate } from "../../utils/date";
import NextLink from "next/link";
import { FaRegEdit } from "react-icons/fa";
import { ApolloCache, gql } from "@apollo/client";

interface CommentCardProps {
  comment: CommentsByPostQuery["commentsByPost"]["comments"][0];
}

export const CommentCard: React.FC<CommentCardProps> = ({ comment }) => {
  const [voteComment] = useVoteCommentMutation();

  const updateAfterVote = (
    value: number,
    commentId: number,
    cache: ApolloCache<VoteCommentMutation>
  ) => {
    const data = cache.readFragment<{
      id: number;
      points: number;
      voteStatus: number | null;
    }>({
      id: "Comment:" + commentId,
      fragment: gql`
        fragment _ on Comment {
          id
          points
          voteStatus
        }
      `,
    });
    if (data) {
      if (data.voteStatus === value) {
        return;
      }
      const newPoints = data.points + (!data.voteStatus ? 1 : 2) * value;
      cache.writeFragment({
        id: "Comment:" + commentId,
        fragment: gql`
          fragment __ on Comment {
            points
            voteStatus
          }
        `,
        data: { points: newPoints, voteStatus: value },
      });
    }
  };

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
          <Box
            _hover={{ color: "#00c73f", cursor: "pointer" }}
            color={comment.voteStatus === 1 ? "#00c73f" : undefined}
            onClick={async () => {
              if (comment.voteStatus === 1) {
                return;
              }
              await voteComment({
                variables: { commentId: comment.id, isUpvote: true },
                update: (cache) => updateAfterVote(1, comment.id, cache),
              });
            }}
          >
            <BsCaretUpFill />
          </Box>
          {comment.points}
          <Box
            _hover={{ color: "red", cursor: "pointer" }}
            color={comment.voteStatus === -1 ? "red" : undefined}
            onClick={async () => {
              if (comment.voteStatus === -1) {
                return;
              }
              await voteComment({
                variables: { commentId: comment.id, isUpvote: false },
                update: (cache) => updateAfterVote(-1, comment.id, cache),
              });
            }}
          >
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
