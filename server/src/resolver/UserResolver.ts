import { User } from "../entity/User";
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { MyContext } from "../MyContext";
import { registerValidator } from "../utils/registerValidator";
import bcrypt, { compare } from "bcryptjs";

@ObjectType()
class FieldError {
  @Field()
  field: string;

  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@InputType()
export class UserInput {
  @Field()
  username: string;

  @Field()
  email: string;

  @Field()
  password: string;

  @Field()
  confirmPassword: string;
}

@Resolver()
export class UserResolver {
  @Query(() => User, { nullable: true })
  async me(@Ctx() { req }: MyContext): Promise<User | null> {
    if (!req.session!.userId) {
      return null;
    }

    const user = await User.findOne({ id: req.session!.userId });
    if (!user) {
      return null;
    }
    return user;
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("userInput") { username, email, password, confirmPassword }: UserInput,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const errors = registerValidator({
      username,
      email,
      password,
      confirmPassword,
    });
    if (errors) {
      return { errors };
    }

    const existUser = await User.findOne({ where: { username } });
    if (existUser) {
      return {
        errors: [
          {
            field: "username",
            message: "username already be used",
          },
        ],
      };
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);
    password = "";

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    }).save();

    req.session!.userId = user.id;

    return {
      user,
    };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("usernameOrEmail") usernameOrEmail: string,
    @Arg("password") password: string,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const user = await User.findOne({
      where: usernameOrEmail.includes("@")
        ? { email: usernameOrEmail }
        : { username: usernameOrEmail },
    });
    if (!user) {
      return {
        errors: [
          {
            field: "usernameOrEmail",
            message: "invalid username or email",
          },
        ],
      };
    }

    const valid = await compare(password, user.password);
    if (!valid) {
      return {
        errors: [
          {
            field: "password",
            message: "invalid password",
          },
        ],
      };
    }

    req.session!.userId = user.id;

    return {
      user,
    };
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: MyContext): Promise<Boolean> {
    return new Promise((resolve) =>
      req.session?.destroy((err) => {
        if (err) {
          console.log(err);
          resolve(false);
          return;
        }
        res.clearCookie("bid");
        resolve(true);
      })
    );
  }
}
