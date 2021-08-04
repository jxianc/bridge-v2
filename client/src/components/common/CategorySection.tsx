import { Badge, Box, HStack } from "@chakra-ui/react";
import React, { useState } from "react";
import { useEffect } from "react";
import { FaLayerGroup } from "react-icons/fa";
import { usePostsByTopCategoryQuery } from "../../generated/graphql";
import NextLink from "next/link";

interface CategorySectionProps {}

export const CategorySection: React.FC<CategorySectionProps> = ({}) => {
  const { data } = usePostsByTopCategoryQuery();
  const [renderPart, setRenderPart] = useState<Array<JSX.Element>>();

  useEffect(() => {
    if (data && data.postsByTopCategory) {
      const part = data.postsByTopCategory.map((obj) => {
        return (
          <Box
            key={obj.category.id}
            bg="#FF8AA6"
            p={2}
            mb={6}
            borderRadius={6}
            shadow="2px 2px 6px #bababa"
          >
            <NextLink href={`/category/${obj.category.id}`}>
              <Box
                bg="#FFABBF"
                borderRadius={6}
                p={1}
                pl={2}
                _hover={{ bg: "#ff9cb3", color: "white", cursor: "pointer" }}
              >
                <strong>{obj.category.name}</strong>
              </Box>
            </NextLink>
            {obj.posts.map((p) => {
              return (
                <NextLink href={`/post/${p.id}`}>
                  <Box
                    key={p.id}
                    bg="#FFABBF"
                    borderRadius={6}
                    p={1}
                    pl={2}
                    mt={2}
                    _hover={{
                      bg: "#ff9cb3",
                      color: "white",
                      cursor: "pointer",
                    }}
                  >
                    {p.title}
                  </Box>
                </NextLink>
              );
            })}
          </Box>
        );
      });
      setRenderPart(part);
    }
  }, [data]);

  return (
    <Box p={2}>
      <Box
        mb={6}
        bg="#FF8AA6"
        p={2}
        borderRadius={6}
        shadow="2px 2px 6px #bababa"
      >
        <HStack spacing={2} p={3}>
          <FaLayerGroup size="2em" />
          <strong>Top Categories</strong>
        </HStack>
      </Box>
      {renderPart}
    </Box>
  );
};
