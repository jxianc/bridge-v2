import { Select } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { FC, useEffect, useState } from "react";
import { PostCategory, useCategoriesQuery } from "../generated/graphql";

const defaultOption = {
  id: 0,
  value: "Select category",
};

interface Option {
  id: number;
  value: string;
}

interface CategoryDropDownProps {
  preselected?: PostCategory;
  navigate?: boolean;
}

const CategoryDropDown: FC<CategoryDropDownProps> = ({
  preselected,
  navigate,
}) => {
  const { data } = useCategoriesQuery();
  const [categoryOptions, setCategoryOptions] = useState<Array<Option>>([
    defaultOption,
  ]);
  const [selectedOption, setSelectedOption] = useState<string>(
    preselected ? preselected.name : defaultOption.value
  );
  const router = useRouter();

  useEffect(() => {
    if (data && data.categories) {
      const catOptions: Array<Option> = data.categories.map(
        (cat: PostCategory) => {
          return {
            id: cat.id,
            value: cat.name,
          };
        }
      );
      setCategoryOptions(catOptions);
    }
  }, [data]);

  const onChangeDropDown = (e: any) => {
    const selected = e.target.value;
    setSelectedOption(selected);

    if (navigate) {
      if (!selected) {
        router.push("/");
      } else {
        router.push(`/category/${selected}`);
      }
    }
  };

  return (
    <Select
      placeholder={defaultOption.value}
      value={selectedOption}
      onChange={onChangeDropDown}
      bg="white"
      shadow="md"
    >
      {categoryOptions.map((cat) => {
        return (
          <option key={cat.id} value={cat.id}>
            {cat.value}
          </option>
        );
      })}
    </Select>
  );
};

export default CategoryDropDown;
