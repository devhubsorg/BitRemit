import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const srcOut = path.join(__dirname, 'packages', 'contracts', 'out');
const destAbis = path.join(__dirname, 'packages', 'web3', 'src', 'abis');

fs.mkdirSync(destAbis, { recursive: true });

function extractABI(contractName) {
    const filePath = path.join(srcOut, `${contractName}.sol`, `${contractName}.json`);
    if (!fs.existsSync(filePath)) {
        console.error(`Build artifact for ${contractName} not found! Did you run forge build?`);
        return;
    }
    const json = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    fs.writeFileSync(path.join(destAbis, `${contractName}.json`), JSON.stringify(json.abi, null, 2));
    console.log(`✅ Extracted ABI for ${contractName}`);
}

extractABI('BitRemitVault');
extractABI('RemittanceRouter');
extractABI('RecipientRegistry');

console.log("ABIs safely exported directly to packages/web3/src/abis!");
