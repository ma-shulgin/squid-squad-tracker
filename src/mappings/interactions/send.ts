import { RmrkEvent, RmrkInteraction, RmrkNFT, RmrkStats } from '../../model'
import { CallHandlerContext } from '../utils/context'
import { getEventBase, findReciepent,checkSquidCollection, countNewFloor} from '../utils/common'
import assert from 'assert'

export async function send(rmrkObject: Array<string>, ctx: CallHandlerContext): Promise<void> {
    const [nftId, recipient] = rmrkObject.slice(3)
    const eventBase = await getEventBase(ctx)
    const nft = await ctx.store.get(RmrkNFT, {
        where: { id: nftId },
        relations: { children: true },
    })
    assert(nft)
    checkSquidCollection(nft.collection)
    await findReciepent(ctx,recipient,nft)
    nft.price = 0n
   
    nft.updatedAt = eventBase.timestamp
    const event = new RmrkEvent({
        ...eventBase,
        interaction: RmrkInteraction.SEND,
        nft: nft,
    })
    await ctx.store.save(nft)
    const stats = await ctx.store.get(RmrkStats,"0")
    assert(stats)
    await countNewFloor(ctx,nft,stats)
    await ctx.store.save(stats)
    await ctx.store.save(event)
    ctx.log.info(`Sent nft : ${nft.id}`)
}
