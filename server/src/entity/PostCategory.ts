import { Field, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Post } from "./Post";

@ObjectType()
@Entity()
export class PostCategory extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn({ type: "bigint" })
  id: number;

  @Field()
  @Column()
  name!: string;

  @OneToMany(() => Post, (post) => post.postCategory)
  posts: Post[];
}
