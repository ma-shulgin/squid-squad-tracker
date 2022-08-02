import { SubstrateProcessor } from '@subsquid/substrate-processor'
import mappings from './mappings'
import { Store, TypeormDatabase } from '@subsquid/typeorm-store'
import { RmrkStats } from './model'


const database = new TypeormDatabase()
const processor = new SubstrateProcessor(database)

processor.setTypesBundle("kusama")
processor.setBatchSize(500)
processor.setDataSource({
    archive: 'https://kusama.archive.subsquid.io/graphql',
    chain: 'wss://kusama-rpc.polkadot.io',
})

const START_BLOCK = 13660000
processor.setBlockRange({ from: START_BLOCK })
processor.addPreHook({range: {from: START_BLOCK, to: START_BLOCK}}, async (ctx) => {
    await ctx.store.save(new RmrkStats(
        {
            id: "0",
            topSale: 0n,
            volume: 0n
        }
    ))
})


processor.addCallHandler('System.remark', mappings.handleRemark)

processor.run()
