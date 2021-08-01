import { PostCategory } from "../entity/PostCategory";
import { Query, Resolver } from "type-graphql";

@Resolver()
export class PostCategoryResolver {
  @Query(() => [PostCategory])
  async categories(): Promise<PostCategory[]> {
    const categories = await PostCategory.find();

    return categories;
  }
}
