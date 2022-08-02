import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {Account} from "./account.model"
import {RmrkInteraction} from "./_rmrkInteraction"
import {RmrkNFT} from "./rmrkNft.model"

@Entity_()
export class RmrkEvent {
  constructor(props?: Partial<RmrkEvent>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Column_("int4", {nullable: false})
  blockNumber!: number

  @Column_("timestamp with time zone", {nullable: false})
  timestamp!: Date

  @Index_()
  @ManyToOne_(() => Account, {nullable: true})
  caller!: Account

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  info!: bigint | undefined | null

  @Column_("varchar", {length: 4, nullable: false})
  interaction!: RmrkInteraction

  @Index_()
  @ManyToOne_(() => RmrkNFT, {nullable: true})
  nft!: RmrkNFT | undefined | null
}
