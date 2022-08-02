module.exports = class Data1659443902713 {
  name = 'Data1659443902713'

  async up(db) {
    await db.query(`CREATE TABLE "rmrk_event" ("id" character varying NOT NULL, "block_number" integer NOT NULL, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, "info" numeric, "interaction" character varying(4) NOT NULL, "caller_id" character varying, "nft_id" character varying, CONSTRAINT "PK_4c7c7fafd9d549b2721433e4ca2" PRIMARY KEY ("id"))`)
    await db.query(`CREATE INDEX "IDX_ca6c8068db0faf160ed3151b25" ON "rmrk_event" ("caller_id") `)
    await db.query(`CREATE INDEX "IDX_74ee1e5e6e55432b8d2ee6e9ec" ON "rmrk_event" ("nft_id") `)
    await db.query(`CREATE TABLE "rmrk_nft" ("symbol" text, "transferable" integer, "collection" text NOT NULL, "issuer" text, "sn" text, "id" character varying NOT NULL, "price" numeric NOT NULL, "burned" boolean NOT NULL, "block_number" integer NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL, "metadata" text, "current_owner_id" character varying, "parent_id" character varying, CONSTRAINT "PK_06cea93e5f3a8e395f5f7b29521" PRIMARY KEY ("id"))`)
    await db.query(`CREATE INDEX "IDX_cda6a32ad2a3dc585593fbd241" ON "rmrk_nft" ("current_owner_id") `)
    await db.query(`CREATE INDEX "IDX_a68b9fbdaf722454f644c86aa3" ON "rmrk_nft" ("price") `)
    await db.query(`CREATE INDEX "IDX_9cc70a982d1f4bec7435d1e7e4" ON "rmrk_nft" ("burned") `)
    await db.query(`CREATE INDEX "IDX_53927fb20d7fdde2dc4eb2c497" ON "rmrk_nft" ("parent_id") `)
    await db.query(`CREATE TABLE "account" ("id" character varying NOT NULL, CONSTRAINT "PK_54115ee388cdb6d86bb4bf5b2ea" PRIMARY KEY ("id"))`)
    await db.query(`CREATE TABLE "rmrk_stats" ("id" character varying NOT NULL, "floor" numeric, "floor_nft" text, "volume" numeric NOT NULL, "top_sale" numeric NOT NULL, CONSTRAINT "PK_fcc1e3be4d5a20831b17166bd66" PRIMARY KEY ("id"))`)
    await db.query(`ALTER TABLE "rmrk_event" ADD CONSTRAINT "FK_ca6c8068db0faf160ed3151b259" FOREIGN KEY ("caller_id") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    await db.query(`ALTER TABLE "rmrk_event" ADD CONSTRAINT "FK_74ee1e5e6e55432b8d2ee6e9ecb" FOREIGN KEY ("nft_id") REFERENCES "rmrk_nft"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    await db.query(`ALTER TABLE "rmrk_nft" ADD CONSTRAINT "FK_cda6a32ad2a3dc585593fbd241d" FOREIGN KEY ("current_owner_id") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    await db.query(`ALTER TABLE "rmrk_nft" ADD CONSTRAINT "FK_53927fb20d7fdde2dc4eb2c4974" FOREIGN KEY ("parent_id") REFERENCES "rmrk_nft"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
  }

  async down(db) {
    await db.query(`DROP TABLE "rmrk_event"`)
    await db.query(`DROP INDEX "public"."IDX_ca6c8068db0faf160ed3151b25"`)
    await db.query(`DROP INDEX "public"."IDX_74ee1e5e6e55432b8d2ee6e9ec"`)
    await db.query(`DROP TABLE "rmrk_nft"`)
    await db.query(`DROP INDEX "public"."IDX_cda6a32ad2a3dc585593fbd241"`)
    await db.query(`DROP INDEX "public"."IDX_a68b9fbdaf722454f644c86aa3"`)
    await db.query(`DROP INDEX "public"."IDX_9cc70a982d1f4bec7435d1e7e4"`)
    await db.query(`DROP INDEX "public"."IDX_53927fb20d7fdde2dc4eb2c497"`)
    await db.query(`DROP TABLE "account"`)
    await db.query(`DROP TABLE "rmrk_stats"`)
    await db.query(`ALTER TABLE "rmrk_event" DROP CONSTRAINT "FK_ca6c8068db0faf160ed3151b259"`)
    await db.query(`ALTER TABLE "rmrk_event" DROP CONSTRAINT "FK_74ee1e5e6e55432b8d2ee6e9ecb"`)
    await db.query(`ALTER TABLE "rmrk_nft" DROP CONSTRAINT "FK_cda6a32ad2a3dc585593fbd241d"`)
    await db.query(`ALTER TABLE "rmrk_nft" DROP CONSTRAINT "FK_53927fb20d7fdde2dc4eb2c4974"`)
  }
}
