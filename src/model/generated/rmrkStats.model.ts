import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_} from "typeorm"
import * as marshal from "./marshal"

@Entity_()
export class RmrkStats {
  constructor(props?: Partial<RmrkStats>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  floor!: bigint | undefined | null

  @Column_("text", {nullable: true})
  floorNft!: string | undefined | null

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  volume!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  topSale!: bigint
}
