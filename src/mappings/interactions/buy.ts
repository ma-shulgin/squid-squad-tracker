/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { CallHandlerContext } from '../utils/context'
import assert from 'assert'
import { getEventBase, checkSquidCollection, findReciepent, countNewFloor} from '../utils/common'
import { RmrkEvent, RmrkInteraction, RmrkNFT, RmrkStats } from '../../model'

export async function buy(rmrkObject: Array<string>, ctx: CallHandlerContext): Promise<void> {
    const nftId = rmrkObject[3]
    const eventBase = await getEventBase(ctx)
    const nft = await ctx.store.get(RmrkNFT, {
        where: { id: nftId },
        relations: { currentOwner: true , children: true},
    })
    assert(nft, `NFT ${nft} not found`)
    checkSquidCollection(nft.collection)
    const reciever = rmrkObject[4] ?? eventBase.caller.id
    await findReciepent(ctx,reciever,nft)
    const prevPrice = nft.price
    nft.price = 0n
    nft.updatedAt = eventBase.timestamp
    const event = new RmrkEvent({
        ...eventBase,
        interaction: RmrkInteraction.BUY,
        nft: nft,
        info: prevPrice,
    })
    await ctx.store.save(nft)
    const stats = await ctx.store.get(RmrkStats,"0")
    assert(stats)
    stats.volume += prevPrice
    if (prevPrice > stats.topSale) {
        stats.topSale = prevPrice
        ctx.log.info(`New top sale - ${prevPrice}`)
    } 
    await countNewFloor(ctx, nft, stats)
    await ctx.store.save(stats)
    await ctx.store.save(event)
    ctx.log.info(`Sold nft : ${nft.id}`)
}
