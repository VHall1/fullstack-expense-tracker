import { getRepository } from "typeorm";
import { Arg, Ctx, Field, Mutation, ObjectType, Resolver } from "type-graphql";
import { emailRegexp } from "../constants";
import User from "../entities/User";
import { v4 } from "uuid";
// import { sendEmail } from "../utils/sendEmail";
import argon2 from "argon2";
import { MyContext } from "../types";

@ObjectType()
class UserError {
  @Field()
  field: string;
  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [UserError], { nullable: true })
  errors?: UserError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver(User)
export class UserResolver {
  @Mutation(() => UserResponse)
  async register(
    @Arg("email") email: string,
    @Arg("username") username: string,
    @Arg("password") password: string
  ): Promise<UserResponse> {
    let errors: UserError[] = [];
    const repo = getRepository(User);

    if (!emailRegexp.test(email))
      // Verify email regex
      // https://stackoverflow.com/questions/52456065/how-to-format-and-validate-email-node-js
      errors = [
        ...errors,
        {
          field: "email",
          message: "Invalid email",
        },
      ];

    if (username.length < 3)
      errors = [
        ...errors,
        {
          field: "username",
          message: "Username has to be greater than 3 characters",
        },
      ];

    if (password.length < 3)
      errors = [
        ...errors,
        {
          field: "password",
          message: "Password has to be greater than 3 characters",
        },
      ];

    if (await repo.findOne({ email: email }))
      errors = [
        ...errors,
        {
          field: "email",
          message: "Email is already registered",
        },
      ];

    if (errors.length > 0) return { errors };

    const hashedPassword = await argon2.hash(password);

    const newUserData = {
      email,
      username,
      id: v4(),
      password: hashedPassword,
    };

    const newUser = repo.create(newUserData);
    await repo.save(newUserData);

    // Send login email
    // sendEmail(email, v4());

    return { user: newUser };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() { session }: MyContext
  ): Promise<UserResponse> {
    let errors: UserError[] = [];
    const repo = getRepository(User);

    if (!emailRegexp.test(email))
      // Verify email regex
      // https://stackoverflow.com/questions/52456065/how-to-format-and-validate-email-node-js
      errors = [
        ...errors,
        {
          field: "email",
          message: "Invalid email",
        },
      ];

    if (password.length < 3)
      errors = [
        ...errors,
        {
          field: "password",
          message: "Password has to be greater than 3 characters",
        },
      ];

    const user = await repo.findOne({ where: { email: email } });

    if (!user)
      errors = [
        ...errors,
        {
          field: "email",
          message: "That user doesn't exist",
        },
      ];

    const valid = await argon2.verify(user!.password, password);

    if (!valid)
      errors = [
        ...errors,
        {
          field: "password",
          message: "Incorrect password",
        },
      ];

    if (errors.length > 0) return { errors };

    session.userId = user!.id;

    return { user };
  }
}
