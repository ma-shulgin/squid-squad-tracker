import { SystemRemarkCall } from '../types/calls'
import { RmrkInteraction } from '../model'
import * as InteractionsMaps from './interactions'
import { CallHandlerContext } from './utils/context'

const RMRK2_REG_EXP = /^RMRK::\w{3,}::2\.0\.0::.*$/

async function handleRemark(ctx: CallHandlerContext): Promise<void> {
    const rmrkStr = new SystemRemarkCall(ctx).asV1020.remark.toString()
    if (!RMRK2_REG_EXP.test(rmrkStr)) {
        ctx.log.debug(`NOT RMRKv2 message : ${rmrkStr}`)
        return
    }
    try {
        const rmrkObject = rmrkStr.split('::')
        // Looking for interaction
        switch (rmrkObject[1]) {
            case RmrkInteraction.BUY:
                await InteractionsMaps.buy(rmrkObject, ctx)
                break
            case RmrkInteraction.BURN:
                await InteractionsMaps.burn(rmrkObject, ctx)
                break
            case RmrkInteraction.LIST:
                await InteractionsMaps.list(rmrkObject, ctx)
                break
            case RmrkInteraction.MINT:
                await InteractionsMaps.mint(rmrkObject, ctx)
                break
            case RmrkInteraction.SEND:
                await InteractionsMaps.send(rmrkObject, ctx)
                break
            default:
                ctx.log.debug(`Wrong RMRK interaction : ${rmrkStr}`)
                break
        }
    } catch (e) {
        ctx.log.debug(e as string)
        ctx.log.debug(`Unable to decode string : ${rmrkStr}`)
    }
}
export default { handleRemark }
