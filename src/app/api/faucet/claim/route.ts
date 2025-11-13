import { NextRequest, NextResponse } from 'next/server';
import { CdpClient } from '@coinbase/cdp-sdk';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { address } = body;

    if (!address) {
      return NextResponse.json({ error: 'Address is required' }, { status: 400 });
    }

    // Validate address format
    if (!address.startsWith('0x') || address.length !== 42) {
      return NextResponse.json({ error: 'Invalid Ethereum address format' }, { status: 400 });
    }

    // Initialize CDP Client
    // The CDP SDK will use the CDP_API_KEY_NAME and CDP_API_KEY_PRIVATE_KEY environment variables
    const cdp = new CdpClient();

    // Request ETH from faucet for the external address on Base Sepolia
    const faucetResponse = await cdp.evm.requestFaucet({
      address: address,
      network: 'base-sepolia',
      token: 'usdc',
    });

    console.log(
      `ETH faucet transaction: https://sepolia.basescan.org/tx/${faucetResponse.transactionHash}`
    );

    return NextResponse.json({
      transactionHash: faucetResponse.transactionHash,
      success: true,
    });
  } catch (error) {
    console.error('Claim error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to claim funds';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
