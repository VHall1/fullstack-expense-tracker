import { ID, ObjectType, Field } from "type-graphql";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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

  @Field(() => String)
  @Column()
  type: string;

  @Field()
  @Column()
  user_id: string;
}
