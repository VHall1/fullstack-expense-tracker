import Expenses from "../entities/Expenses";
import { getRepository } from "typeorm";
import * as yup from "yup";
import { Arg, Mutation, Query, Resolver } from "type-graphql";

@Resolver(Expenses)
export class ExpensesResolver {
  // async create(req: Request, res: Response) {
  //   const { description, value, type } = req.body as Transaction;
  //   const { user_id } = req.headers;

  //   if (typeof user_id !== "string" || user_id === "")
  //     return res.status(400).json({ message: "No user_id or invalid user_id" });

  //   const newTransactionData = {
  //     description,
  //     user_id,
  //     value,
  //     type,
  //   };

  //   const schema = yup.object().shape({
  //     type: yup
  //       .string()
  //       .required('The "Type" field is required.')
  //       .test(
  //         "type",
  //         "Type format is invalid",
  //         (val) => val === "income" || val === "expense"
  //       ),
  //     value: yup.number().required('The "Value" field is required.'),
  //     description: yup.string(),
  //   });

  //   await schema.validate(newTransactionData, { abortEarly: false });

  //

  //   return res.status(201).json(newTransaction);
  // }

  @Mutation(() => Expenses)
  async addExpense(
    @Arg("value") value: number,
    @Arg("user_id") user_id: string,
    @Arg("description") description: string,
    @Arg("type") type: string
  ): Promise<Expenses> {
    const newTransactionData = {
      description,
      user_id,
      value,
      type,
    };

    const repo = getRepository(Expenses);
    const newTransaction = repo.create(newTransactionData);
    await repo.save(newTransactionData);

    return newTransaction;
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
