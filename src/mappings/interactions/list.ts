/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { CallHandlerContext } from '../utils/context'
import assert from 'assert'
import { getEventBase, checkSquidCollection, countNewFloor } from '../utils/common'
import { RmrkEvent, RmrkInteraction, RmrkNFT, RmrkStats } from '../../model'

export async function list(rmrkObject: Array<string>, ctx: CallHandlerContext): Promise<void> {
    const [nftId, price] = rmrkObject.slice(3)
    const eventBase = await getEventBase(ctx)
    const nft = await ctx.store.get(RmrkNFT, {
        where: { id: nftId },
    })
    assert(nft)
    checkSquidCollection(nft.collection)
    nft.price = BigInt(price)
    nft.updatedAt = eventBase.timestamp
    const event = new RmrkEvent({
        ...eventBase,
        interaction:  RmrkInteraction.LIST,
        nft: nft,
        info: nft.price,
    })
    await ctx.store.save(nft)
    const stats = await ctx.store.get(RmrkStats,"0")
    assert(stats)
    await countNewFloor(ctx,nft,stats)
    await ctx.store.save(stats)
    await ctx.store.save(event)
    ctx.log.info(`(Listed nft : ${nft.id}`)
}
