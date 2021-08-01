import { Box } from "@chakra-ui/react";
import React from "react";

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
  return (
    <Box
      maxW={variant === "regular" ? "800px" : "500px"}
      mt={12}
      mx="auto"
      w="100%"
      shadow="2xl"
      borderRadius={10}
    >
      <Box
        bg="facebook.900"
        color="white"
        fontSize="lg"
        fontWeight="bold"
        p={4}
      >
        {title}
      </Box>
      <Box p={8} pt={6}>
        {children}
      </Box>
    </Box>
  );
};
