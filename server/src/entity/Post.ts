import { Field, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Comment } from "./Comment";
import { PostCategory } from "./PostCategory";
import { PostPoint } from "./PostPoint";
import { User } from "./User";

@ObjectType()
@Entity()
export class Post extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn({ type: "bigint" })
  id: number;

  @Field()
  @Column()
  title!: string;

  @Field()
  @Column()
  body!: string;

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];

  @OneToMany(() => PostPoint, (postPoint) => postPoint.post)
  postPoints: PostPoint[];

  @ManyToOne(() => User, (user) => user.posts)
  user: User;

  @ManyToOne(() => PostCategory, (postCategory) => postCategory.posts)
  postCategory: PostCategory;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}
