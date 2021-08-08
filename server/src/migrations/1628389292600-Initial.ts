import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1628389292600 implements MigrationInterface {
  name = "Initial1628389292600";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "post_category" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_388636ba602c312da6026dc9dbc" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "post_point" ("id" BIGSERIAL NOT NULL, "value" integer NOT NULL, "userId" integer NOT NULL, "postId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_3b911110c17a677e8b9f1f317fc" PRIMARY KEY ("id", "userId", "postId"))`
    );
    await queryRunner.query(
      `CREATE TABLE "post" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "body" character varying NOT NULL, "points" integer NOT NULL DEFAULT 0, "userId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "postCategoryId" integer, CONSTRAINT "PK_be5fda3aac270b134ff9c21cdee" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "comment_point" ("id" BIGSERIAL NOT NULL, "value" integer NOT NULL, "userId" integer NOT NULL, "commentId" bigint NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f3c52d07527ee3ea2578c47431f" PRIMARY KEY ("id", "userId", "commentId"))`
    );
    await queryRunner.query(
      `CREATE TABLE "comment" ("id" BIGSERIAL NOT NULL, "body" character varying NOT NULL, "points" integer NOT NULL DEFAULT 0, "userId" integer NOT NULL, "postId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_0b0e4bbc8415ec426f87f3a88e2" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "post_point" ADD CONSTRAINT "FK_ffcc12a7fc465ccc7d57bc13538" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "post_point" ADD CONSTRAINT "FK_4f8cd83a87729077172c05e9f45" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "post" ADD CONSTRAINT "FK_5c1cf55c308037b5aca1038a131" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "post" ADD CONSTRAINT "FK_cbeb49c5aeb20144c612817c0cc" FOREIGN KEY ("postCategoryId") REFERENCES "post_category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "comment_point" ADD CONSTRAINT "FK_dc44777dd75c98f08f1590b0019" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "comment_point" ADD CONSTRAINT "FK_fd60e3811d962113f96852cbc73" FOREIGN KEY ("commentId") REFERENCES "comment"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "comment" ADD CONSTRAINT "FK_c0354a9a009d3bb45a08655ce3b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "comment" ADD CONSTRAINT "FK_94a85bb16d24033a2afdd5df060" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(`
        insert into post_category (id, name) values (1, 'Programming');
        insert into post_category (id, name) values (2, 'Science');
        insert into post_category (id, name) values (3, 'Technology');
        insert into post_category (id, name) values (4, 'Food');
        insert into post_category (id, name) values (5, 'Business');
        insert into post_category (id, name) values (6, 'Anime');
        insert into post_category (id, name) values (7, 'Music');
        insert into post_category (id, name) values (8, 'Art');
        insert into post_category (id, name) values (9, 'History');
        insert into post_category (id, name) values (10, 'Games');
        insert into post_category (id, name) values (11, 'Sports');
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "comment" DROP CONSTRAINT "FK_94a85bb16d24033a2afdd5df060"`
    );
    await queryRunner.query(
      `ALTER TABLE "comment" DROP CONSTRAINT "FK_c0354a9a009d3bb45a08655ce3b"`
    );
    await queryRunner.query(
      `ALTER TABLE "comment_point" DROP CONSTRAINT "FK_fd60e3811d962113f96852cbc73"`
    );
    await queryRunner.query(
      `ALTER TABLE "comment_point" DROP CONSTRAINT "FK_dc44777dd75c98f08f1590b0019"`
    );
    await queryRunner.query(
      `ALTER TABLE "post" DROP CONSTRAINT "FK_cbeb49c5aeb20144c612817c0cc"`
    );
    await queryRunner.query(
      `ALTER TABLE "post" DROP CONSTRAINT "FK_5c1cf55c308037b5aca1038a131"`
    );
    await queryRunner.query(
      `ALTER TABLE "post_point" DROP CONSTRAINT "FK_4f8cd83a87729077172c05e9f45"`
    );
    await queryRunner.query(
      `ALTER TABLE "post_point" DROP CONSTRAINT "FK_ffcc12a7fc465ccc7d57bc13538"`
    );
    await queryRunner.query(`DROP TABLE "comment"`);
    await queryRunner.query(`DROP TABLE "comment_point"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "post"`);
    await queryRunner.query(`DROP TABLE "post_point"`);
    await queryRunner.query(`DROP TABLE "post_category"`);
  }
}
