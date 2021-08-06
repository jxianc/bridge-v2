import { Box, HStack } from "@chakra-ui/react";
import { GoChevronLeft } from "react-icons/go";
import React from "react";
import { useRouter } from "next/dist/client/router";

export type WrapperVariant = "small" | "regular";

interface WrapperProps {
  variant?: WrapperVariant;
  title: string;
}

export const Wrapper: React.FC<WrapperProps> = ({
  variant = "regular",
  title,
  children,
}) => {
  const router = useRouter();

  return (
    <Box
      maxW={variant === "regular" ? "800px" : "500px"}
      mt={12}
      mx="auto"
      w="100%"
      shadow="2xl"
      borderRadius={10}
    >
      <HStack
        bg="facebook.900"
        color="white"
        fontSize="lg"
        fontWeight="bold"
        p={4}
      >
        <Box _hover={{ color: "#1BD3A7", cursor: "pointer" }}>
          <GoChevronLeft size="2em" onClick={() => router.push("/")} />
        </Box>
        <Box>{title}</Box>
      </HStack>
      <Box p={8} pt={6}>
        {children}
      </Box>
    </Box>
  );
};
