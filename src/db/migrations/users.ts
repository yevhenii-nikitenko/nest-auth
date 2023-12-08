import { MigrationInterface, QueryRunner } from 'typeorm';

export default class CreateUsersTable1701968296868
    implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE IF NOT EXISTS users (
                id serial PRIMARY KEY,
                email text,
                first_name text,
                last_name text,
                password text
            )`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> { }
}
