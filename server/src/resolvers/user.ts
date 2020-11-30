import { getRepository } from "typeorm";
import {
  Arg,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { emailRegexp } from "../constants";
import User from "../entities/User";
import { v4 } from "uuid";
import { sendEmail } from "../utils/sendEmail";

const sessions = [];

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
    @Arg("username") username: string
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

    if (await repo.findOne({ email: email }))
      errors = [
        ...errors,
        {
          field: "email",
          message: "Email is already registered",
        },
      ];

    if (errors.length > 0) return { errors };

    const newUserData = {
      email,
      username,
      id: v4(),
    };

    const newUser = repo.create(newUserData);
    await repo.save(newUserData);

    // Send login email
    sendEmail(email, v4());

    return { user: newUser };
  }

  // @Query(() => [Expenses])
  // async transactions() {
  //   const transactions = await getRepository(Expenses).find();
  //   return transactions;
  // }

  // @Query(() => Expenses)
  // async transaction(@Arg("id") id: number) {
  //   const transaction = await getRepository(Expenses).findOneOrFail(id);
  //   return transaction;
  // }
}
