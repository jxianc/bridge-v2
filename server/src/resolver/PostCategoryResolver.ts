import { PostCategory } from "../entity/PostCategory";
import { Arg, Field, Int, ObjectType, Query, Resolver } from "type-graphql";
import { Post } from "../entity/Post";

@ObjectType()
class TopPosts {
  @Field()
  category: PostCategory;

  @Field(() => [Post], { nullable: true })
  posts?: Post[];
}

@Resolver()
export class PostCategoryResolver {
  @Query(() => [PostCategory])
  async categories(): Promise<PostCategory[]> {
    const categories = await PostCategory.find();

    return categories;
  }

  @Query(() => [TopPosts])
  async postsByTopCategory(): Promise<Array<TopPosts>> {
    const response: Array<TopPosts> = [];

    const categories = await PostCategory.createQueryBuilder("postCategory")
      .leftJoinAndSelect("postCategory.posts", "post")
      .getMany();

    categories.sort((a: PostCategory, b: PostCategory) => {
      if (a.posts.length > b.posts.length) return -1;
      if (a.posts.length < b.posts.length) return 1;
      return 0;
    });

    const topCategories = categories.slice(0, 3);

    topCategories.forEach((cat) => {
      cat.posts.sort((a: Post, b: Post) => {
        if (a.createdAt > b.createdAt) return -1;
        if (a.createdAt < b.createdAt) return 1;
        return 0;
      });
      // take first 3 posts from each categories
      const p = cat.posts.slice(0, 3);
      const topPosts: TopPosts = {
        category: cat,
        posts: p,
      };
      response.push(topPosts);
    });

    return response;
  }

  @Query(() => PostCategory, { nullable: true })
  async singleCategory(
    @Arg("postCategoryId", () => Int) postCategoryId: number
  ): Promise<PostCategory | null> {
    const postCategory = await PostCategory.findOne({ id: postCategoryId });
    if (!postCategory) {
      return null;
    }

    return postCategory;
  }
}
