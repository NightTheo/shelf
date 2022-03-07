import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddLibrary1646594695255 implements MigrationInterface {
  name = 'AddLibrary1646594695255';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`library\` (\`id\` varchar(36) NOT NULL, \`books\` varchar(255) NOT NULL DEFAULT '[]', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`library\``);
  }
}
