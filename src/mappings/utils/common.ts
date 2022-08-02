import { RmrkEvent, Account, RmrkNFT, RmrkStats } from '../../model'
import { CallHandlerContext, CommonHandlerContext } from '../utils/context'
import { decodeHex } from '@subsquid/util-internal-hex'
import * as ss58 from '@subsquid/ss58'
import { SQUID_COLLECTIONS } from './consts'
import assert from 'assert'

function encodeId(id: Uint8Array) {
    return ss58.codec('kusama').encode(id)
}

export function checkSquidCollection(collection: string) {
    assert(SQUID_COLLECTIONS.includes(collection), `Not a SQUID collection - ${collection}`)
}

function isLessOrUndefined(val:bigint, goal:bigint|null|undefined) {
    if (!goal || val < (goal as bigint)) return true
    else return false
}

export async function countNewFloor(ctx: CallHandlerContext, nft: RmrkNFT, stats: RmrkStats): Promise<void> {
        if ((0n < nft.price) && (isLessOrUndefined(nft.price,stats.floor))) {
            stats.floor = nft.price
            stats.floorNft = nft.id
        }
        else if ((nft.id === stats.floorNft) && (nft.price !== stats.floor)) {
            stats.floor = null
            const allNfts = await ctx.store.find(RmrkNFT)
            allNfts.forEach(curNft => {
                if ((0n < curNft.price) && (isLessOrUndefined(curNft.price,stats.floor))) {
                    stats.floor = curNft.price
                    stats.floorNft = curNft.id
                }
            });
        }
        ctx.log.info(`NEW FLOOR - ${stats.floor}`)
    }

export async function findReciepent(ctx: CallHandlerContext, id: string, nft: RmrkNFT) : Promise<void> {
    const parentNFT = await ctx.store.get(RmrkNFT,id)
    if (parentNFT) {
        nft.parent = parentNFT
        nft.currentOwner = parentNFT.currentOwner
    }
    else {
        const account = await getOrCreateAccount(ctx, id)
        nft.currentOwner = account
        if (nft.children.length>0) {
            for (const child of nft.children) {
                child.currentOwner = account
            }
            ctx.store.save(nft.children)
        }
    }
}


export async function getEventBase(ctx: CallHandlerContext): Promise<RmrkEvent> {
    const callerId = getOriginAccountId(ctx.call.origin)
    assert(callerId, `Can't decode caller`)
    const caller = await getOrCreateAccount(ctx, callerId)
    return new RmrkEvent({
        id: ctx.call.id,
        blockNumber: ctx.block.height,
        timestamp: new Date(ctx.block.timestamp),
        caller: caller,
    })
}

export async function getOrCreateAccount(ctx: CommonHandlerContext, id: string): Promise<Account> {
    let account = await ctx.store.get(Account, id)
    if (!account) {
        account = new Account({
            id,
        })
        await ctx.store.insert(account)
    }

    return account
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getOriginAccountId(origin: any) {
    if (!origin) return undefined
    switch (origin.__kind) {
        case 'system':
            // eslint-disable-next-line sonarjs/no-nested-switch, sonarjs/no-small-switch
            switch (origin.value.__kind) {
                case 'Signed':
                    return encodeId(decodeHex(origin.value.value))
                default:
                    return undefined
            }
        default:
            return undefined
    }
}

