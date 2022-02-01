import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddReadCount1643493624478 implements MigrationInterface {
  name = 'AddReadCount1643493624478';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`book\` ADD \`read_count\` int NULL DEFAULT '1'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`book\` DROP COLUMN \`read_count\``);
  }
}
