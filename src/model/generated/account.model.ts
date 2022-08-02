import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, OneToMany as OneToMany_} from "typeorm"
import {RmrkNFT} from "./rmrkNft.model"
import {RmrkEvent} from "./rmrkEvent.model"

@Entity_()
export class Account {
  constructor(props?: Partial<Account>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @OneToMany_(() => RmrkNFT, e => e.currentOwner)
  rmrkNfts!: RmrkNFT[]

  @OneToMany_(() => RmrkEvent, e => e.caller)
  rmrkEvents!: RmrkEvent[]
}
