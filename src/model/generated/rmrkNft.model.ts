import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, OneToMany as OneToMany_} from "typeorm"
import * as marshal from "./marshal"
import {Account} from "./account.model"
import {RmrkEvent} from "./rmrkEvent.model"

@Entity_()
export class RmrkNFT {
  constructor(props?: Partial<RmrkNFT>) {
    Object.assign(this, props)
  }

  @Column_("text", {nullable: true})
  symbol!: string | undefined | null

  @Column_("int4", {nullable: true})
  transferable!: number | undefined | null

  @Column_("text", {nullable: false})
  collection!: string

  @Column_("text", {nullable: true})
  issuer!: string | undefined | null

  @Column_("text", {nullable: true})
  sn!: string | undefined | null

  @PrimaryColumn_()
  id!: string

  @Index_()
  @ManyToOne_(() => Account, {nullable: true})
  currentOwner!: Account | undefined | null

  @Index_()
  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  price!: bigint

  @Index_()
  @Column_("bool", {nullable: false})
  burned!: boolean

  @Column_("int4", {nullable: false})
  blockNumber!: number

  @OneToMany_(() => RmrkEvent, e => e.nft)
  events!: RmrkEvent[]

  @Column_("timestamp with time zone", {nullable: false})
  createdAt!: Date

  @Column_("timestamp with time zone", {nullable: false})
  updatedAt!: Date

  @Column_("text", {nullable: true})
  metadata!: string | undefined | null

  @Index_()
  @ManyToOne_(() => RmrkNFT, {nullable: true})
  parent!: RmrkNFT | undefined | null

  @OneToMany_(() => RmrkNFT, e => e.parent)
  children!: RmrkNFT[]
}
