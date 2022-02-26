import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCoverImage1645351972453 implements MigrationInterface {
  name = 'AddCoverImage1645351972453';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`book\` ADD \`cover_image\` varchar(100) NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`book\` DROP COLUMN \`cover_image\``);
  }
}
