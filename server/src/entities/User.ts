import { ID, ObjectType, Field } from "type-graphql";
import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import Expenses from "./Expenses";

@Entity()
@ObjectType()
export default class User {
  @Field(() => ID)
  @PrimaryColumn()
  id: string;

  @Field()
  @Column()
  email: string;

  @Field()
  @Column()
  username: string;

  @Field()
  @Column()
  password: string;

  @Field(() => Date)
  @Column()
  created_at: Date;

  @Field(() => Date)
  @Column()
  updated_at: Date;

  @Field(() => [Expenses])
  @OneToMany(() => Expenses, (expenses) => expenses.user)
  expenses: Expenses[];
}
