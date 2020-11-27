import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateExpense1606510142461 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "expenses",
        columns: [
          {
            name: "transaction_id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "description",
            type: "varchar",
          },
          {
            name: "value",
            type: "numeric",
          },
          {
            name: "type",
            type: "varchar",
          },
          {
            name: "user_id",
            type: "varchar",
          },
        ],
      }),
      true
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.dropTable("expenses");
  }
}
