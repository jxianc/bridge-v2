import { Field, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Post } from "./Post";
import { User } from "./User";

@ObjectType()
@Entity()
export class PostPoint extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn({ type: "bigint" })
  id: number;

  @Field()
  @Column()
  isDecrement!: boolean;

  @ManyToOne(() => User, (user) => user.postPoints)
  user: User;

  @ManyToOne(() => Post, (post) => post.postPoints)
  post: Post;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}
