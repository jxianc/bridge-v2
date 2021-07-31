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
import { User } from "./User";
import { Comment } from "./Comment";

@ObjectType()
@Entity()
export class CommentPoint extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn({ type: "bigint" })
  id: number;

  @Field()
  @Column()
  isDecrement!: boolean;

  @ManyToOne(() => User, (user) => user.commentPoints)
  user: User;

  @ManyToOne(() => Comment, (comment) => comment.commentPoints)
  comment: Comment;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}
