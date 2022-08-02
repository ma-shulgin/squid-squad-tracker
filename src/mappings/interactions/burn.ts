/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { CallHandlerContext } from '../utils/context'
import assert from 'assert'
import { getEventBase, countNewFloor} from '../utils/common'
import { RmrkEvent, RmrkInteraction, RmrkNFT, RmrkStats } from '../../model'

export async function burn(rmrkObject: Array<string>, ctx: CallHandlerContext): Promise<void> {
    const nftId = rmrkObject[3]
    const eventBase = await getEventBase(ctx)
    const nft = await ctx.store.get(RmrkNFT, {
        where: { id: nftId },
    })
    assert(nft)
    nft.price = 0n
    nft.burned = true
    nft.updatedAt = eventBase.timestamp
    const event = new RmrkEvent({
        ...eventBase,
        interaction: RmrkInteraction.BURN,
        nft: nft,
    })
    await ctx.store.save(nft)
    const stats = await ctx.store.get(RmrkStats,"0")
    assert(stats)
    await countNewFloor(ctx,nft,stats)
    await ctx.store.save(stats)
    await ctx.store.save(event)
    ctx.log.info(`Consumed nft : ${nft.id}`)
}
