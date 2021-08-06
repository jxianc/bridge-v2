import { ApolloCache, gql } from "@apollo/client";
import {
  Badge,
  Box,
  Flex,
  HStack,
  IconButton,
  SimpleGrid,
  Spacer,
  Tag,
  VStack,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { BiDetail } from "react-icons/bi";
import { BsCaretDownFill, BsCaretUpFill, BsReplyAllFill } from "react-icons/bs";
import {
  PostsQuery,
  useVotePostMutation,
  VotePostMutation,
} from "../../generated/graphql";
import { categoryColor } from "../../utils/categoryColor";
import { unixToDate } from "../../utils/date";
import { EditButton } from "./EditDeleteButton";

interface PostCardProps {
  post: PostsQuery["posts"]["posts"][0];
  hasDetail: boolean;
}

export const PostCard: React.FC<PostCardProps> = ({ post, hasDetail }) => {
  const [votePost] = useVotePostMutation();
  const router = useRouter();

  const updateAfterVote = (
    value: number,
    postId: number,
    cache: ApolloCache<VotePostMutation>
  ) => {
    const data = cache.readFragment<{
      id: number;
      points: number;
      voteStatus: number | null;
    }>({
      id: "Post:" + postId,
      fragment: gql`
        fragment _ on Post {
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
        id: "Post:" + postId,
        fragment: gql`
          fragment __ on Post {
            points
            voteStatus
          }
        `,
        data: { points: newPoints, voteStatus: value },
      });
    }
  };

  return (
    <Flex m={2} mb={8}>
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
            color={post.voteStatus === 1 ? "#00c73f" : undefined}
            onClick={async () => {
              if (post.voteStatus === 1) {
                return;
              }
              try {
                await votePost({
                  variables: { postId: post.id, isUpvote: true },
                  update: (cache) => updateAfterVote(1, post.id, cache),
                });
              } catch (err) {
                router.replace(`/login?next=/post/${post.id}`);
              }
            }}
          >
            <BsCaretUpFill />
          </Box>
          {post.points}
          <Box
            _hover={{ color: "red", cursor: "pointer" }}
            color={post.voteStatus === -1 ? "red" : undefined}
            onClick={async () => {
              if (post.voteStatus === -1) {
                return;
              }
              try {
                await votePost({
                  variables: { postId: post.id, isUpvote: false },
                  update: (cache) => updateAfterVote(-1, post.id, cache),
                });
              } catch (err) {
                router.replace(`/login?next=/post/${post.id}`);
              }
            }}
          >
            <BsCaretDownFill />
          </Box>
        </Box>
        <Spacer />
        <Box>
          {post.comments ? post.comments.length : 0}
          <NextLink href={`/post/create-comment/${post.id}`}>
            <Box title="Comment" _hover={{ color: "gray", cursor: "pointer" }}>
              <BsReplyAllFill />
            </Box>
          </NextLink>
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
            <HStack mb={2} spacing={4}>
              <NextLink href={`/category/${post.postCategory.id}`}>
                <Badge
                  fontSize="sm"
                  colorScheme={categoryColor[post.postCategory.id]}
                  shadow="md"
                  _hover={{ shadow: "1px 1px 8px #888888", cursor: "pointer" }}
                >
                  {post.postCategory.name}
                </Badge>
              </NextLink>
              <Tag colorScheme="whatsapp" shadow="md">
                {post.user.username}
              </Tag>
            </HStack>
            <Box fontSize="xl">
              <strong>{post.title}</strong>
            </Box>
            <Box>{post.body}</Box>
          </Box>
          <Box>
            <Box fontSize="sm" fontStyle="italic" color="gray.600" mt={3}>
              <HStack spacing={10}>
                <Box>created at {unixToDate(post.createdAt)}</Box>
                {post.createdAt === post.updatedAt ? null : (
                  <Box>updated at {unixToDate(post.updatedAt)}</Box>
                )}
              </HStack>
            </Box>
            <Box position="absolute" bottom={0} right={0} mr={4} mb={4}>
              <HStack spacing={4}>
                <EditButton postId={post.id} userId={post.userId} />
                {hasDetail ? (
                  <NextLink href={`/post/${post.id}`}>
                    <IconButton
                      colorScheme="gray"
                      aria-label="detail"
                      size="md"
                      shadow="md"
                      title="Detail"
                      icon={<BiDetail />}
                    />
                  </NextLink>
                ) : null}
              </HStack>
            </Box>
          </Box>
        </SimpleGrid>
      </Box>
    </Flex>
  );
};
