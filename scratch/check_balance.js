import { createPublicClient, http, erc20Abi, formatUnits } from 'viem';
import { mezoTestnet } from 'viem/chains';

const VAULT_ADDRESS = '0xb572776cc02E0514227f5d58696F0C4f6647704D';
const TBTC_ADDRESS = '0x419375897576D4021e820134fCA527E4f6157088';
const USER_ADDRESS = '0xe74a13d50900BBbaE6a681936C727073089aB87B';

const client = createPublicClient({
  chain: mezoTestnet,
  transport: http('https://rpc.test.mezo.org')
});

async function check() {
  try {
    const balance = await client.readContract({
      address: TBTC_ADDRESS,
      abi: erc20Abi,
      functionName: 'balanceOf',
      args: [USER_ADDRESS]
    });

    const allowance = await client.readContract({
      address: TBTC_ADDRESS,
      abi: erc20Abi,
      functionName: 'allowance',
      args: [USER_ADDRESS, VAULT_ADDRESS]
    });

    console.log(`User: ${USER_ADDRESS}`);
    console.log(`tBTC Balance: ${formatUnits(balance, 18)}`);
    console.log(`Allowance to Vault: ${formatUnits(allowance, 18)}`);
  } catch (e) {
    console.error(e);
  }
}

check();
