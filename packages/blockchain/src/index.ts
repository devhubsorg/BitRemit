import { startIndexer } from './indexer.js';
import { startWorker } from './workers/offramp.worker.js';

/**
 * Main entry point for the BitRemit Blockchain Package.
 * Starts both the Event Indexer and the Off-ramp Worker.
 */

async function main() {
    console.log('--- BitRemit Blockchain Service ---');
    
    try {
        // 1. Start the Event Indexer (Syncs on-chain data to DB)
        startIndexer();
        
        // 2. Start the Off-ramp Worker (Processes payout jobs from BullMQ)
        await startWorker();
        
        console.log('[Main] All services running.');
    } catch (error) {
        console.error('[Main] Critical failure during startup:', error);
        process.exit(1);
    }
}

main();
