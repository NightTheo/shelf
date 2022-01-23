import {MigrationInterface, QueryRunner} from "typeorm";

export class BookMigration1642924824438 implements MigrationInterface {
    name = 'BookMigration1642924824438'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`book\` (\`isbn\` varchar(13) NOT NULL, \`title\` varchar(200) NOT NULL, \`author\` varchar(150) NOT NULL, \`overview\` varchar(1500) NULL, PRIMARY KEY (\`isbn\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`book\``);
    }

}
