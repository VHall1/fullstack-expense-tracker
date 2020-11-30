import Expenses from "../entities/Expenses";
import { getRepository } from "typeorm";
import {
  Arg,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";

@ObjectType()
class ExpensesError {
  @Field()
  field: string;
  @Field()
  message: string;
}

@ObjectType()
class ExpensesResponse {
  @Field(() => [ExpensesError], { nullable: true })
  errors?: ExpensesError[];

  @Field(() => Expenses, { nullable: true })
  expenses?: Expenses;
}

@Resolver(Expenses)
export class ExpensesResolver {
  @Mutation(() => ExpensesResponse)
  async addExpense(
    @Arg("value") value: number,
    @Arg("user_id") user_id: string,
    @Arg("description") description: string,
    @Arg("type") type: string
  ): Promise<ExpensesResponse> {
    const newTransactionData = {
      description,
      user_id,
      value,
      type,
    };

    if (type !== "expense" && type !== "income") {
      return {
        errors: [
          {
            field: "type",
            message: 'Type must be "expense" or "income"',
          },
        ],
      };
    }

    const repo = getRepository(Expenses);
    const newTransaction = repo.create(newTransactionData);
    await repo.save(newTransactionData);

    return { expenses: newTransaction };
  }

  @Query(() => [Expenses])
  async transactions() {
    const transactions = await getRepository(Expenses).find();
    return transactions;
  }

  @Query(() => Expenses)
  async transaction(@Arg("id") id: number) {
    const transaction = await getRepository(Expenses).findOneOrFail(id);
    return transaction;
  }
}
