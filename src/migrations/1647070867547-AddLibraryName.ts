import {MigrationInterface, QueryRunner} from "typeorm";

export class AddLibraryName1647070867547 implements MigrationInterface {
    name = 'AddLibraryName1647070867547'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`library\` ADD \`name\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`library\` DROP COLUMN \`name\``);
    }

}
