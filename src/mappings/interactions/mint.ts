/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { CallHandlerContext } from '../utils/context'
import { RmrkEvent } from '../../model'
import { getEventBase, checkSquidCollection, findReciepent } from '../utils/common'
import { RmrkInteraction, RmrkNFT, RmrkStats} from '../../model/generated'
import assert from 'assert'
import { stat } from 'fs'

interface MintNFTData {
    collection: string
    symbol: string
    transferable: number
    sn: string
    metadata: string
}

export async function mint(rmrkObject: Array<string>, ctx: CallHandlerContext): Promise<void> {
    const payloadStr = decodeURIComponent(rmrkObject[3])
    const payload = JSON.parse(payloadStr) as MintNFTData
    checkSquidCollection(payload.collection)
    const eventBase = await getEventBase(ctx)
    const id = `${ctx.block.height}-${payload.collection}-${payload.symbol}-${payload.sn}`
    const nft = new RmrkNFT({
        symbol: payload.symbol,
        sn: payload.sn,
        id: id,
        issuer: eventBase.caller.id,
        metadata: payload.metadata,
        createdAt: eventBase.timestamp,
        updatedAt: eventBase.timestamp,
        collection: payload.collection,
        blockNumber: eventBase.blockNumber,
        price: 0n,
        burned: false,
        transferable: payload.transferable,
        children: []
    })
    const receipent = rmrkObject[4] ?? eventBase.caller.id
    await findReciepent(ctx, receipent, nft)
    const event = new RmrkEvent({
        ...eventBase,
        interaction: RmrkInteraction.MINT,
        nft: nft,
    })
    await ctx.store.save(nft)
    await ctx.store.save(event)
    ctx.log.info(`Saved nft : ${nft.id}`)
}
