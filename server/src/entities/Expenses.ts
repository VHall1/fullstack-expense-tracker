import { ID, ObjectType, Field } from "type-graphql";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import User from "./User";

@Entity()
@ObjectType()
export default class Expenses {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  transaction_id: number;

  @Field({ nullable: true })
  @Column()
  description: string;

  @Field()
  @Column()
  value: number;

  @Field()
  @Column()
  type: string;

  @Field(() => Date)
  @Column()
  created_at: Date;

  @Field(() => Date)
  @Column()
  updated_at: Date;

  @Field()
  @ManyToOne(() => User, (user) => user.expenses, {
    cascade: true,
  })
  user: User;
}
