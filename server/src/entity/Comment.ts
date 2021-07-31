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
import { CommentPoint } from "./CommentPoint";
import { Post } from "./Post";
import { User } from "./User";

@ObjectType()
@Entity()
export class Comment extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn({ type: "bigint" })
  id: number;

  @Field()
  @Column()
  body!: string;

  @OneToMany(() => CommentPoint, (commentPoint) => commentPoint.comment)
  commentPoints: CommentPoint[];

  @ManyToOne(() => User, (user) => user.comments)
  user: User;

  @ManyToOne(() => Post, (post) => post.comments)
  post: Post;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}
