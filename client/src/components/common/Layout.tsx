import { Grid, GridItem } from "@chakra-ui/react";
import React from "react";
import { CategorySection } from "./CategorySection";

interface LayooutProps {}

export const Layout: React.FC<LayooutProps> = ({ children }) => {
  return (
    <Grid
      m="0 auto"
      maxW="70%"
      minH="870px"
      templateColumns="repeat(10, 1fr)"
      templateRows="repeat(1, 1fr)"
    >
      <>
        <GridItem colSpan={7} rowSpan={55}>
          {children}
        </GridItem>
        <GridItem colSpan={3} rowSpan={55} bg="beige">
          <CategorySection />
        </GridItem>
      </>
    </Grid>
  );
};
