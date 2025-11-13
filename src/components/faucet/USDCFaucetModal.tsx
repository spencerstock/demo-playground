'use client';

import { useState } from 'react';
import Image from 'next/image';
import { createBaseAccountSDK } from '@base-org/account';

type FaucetStage = 'idle' | 'signIn' | 'claiming' | 'success' | 'error';

interface USDCFaucetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function USDCFaucetModal({ isOpen, onClose }: USDCFaucetModalProps) {
  const [faucetStage, setFaucetStage] = useState<FaucetStage>('signIn');
  const [userAddress, setUserAddress] = useState<string>('');
  const [txHash, setTxHash] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleClose = () => {
    setFaucetStage('signIn');
    setUserAddress('');
    setTxHash('');
    setErrorMessage('');
    onClose();
  };

  const handleSignIn = async () => {
    try {
      setFaucetStage('signIn');

      // Initialize the Base Account SDK
      const sdk = createBaseAccountSDK({
        appName: 'Base Demo Playground',
        appChainIds: [84532], // Base Sepolia
      });

      const provider = sdk.getProvider();

      // Request wallet connection
      const response = (await provider.request({
        method: 'wallet_connect',
        params: [{ version: '1', capabilities: {} }],
      })) as { accounts?: Array<{ address: string }> };

      if (response && response.accounts && response.accounts.length > 0) {
        const address = response.accounts[0].address;
        setUserAddress(address);
        setFaucetStage('claiming');
      } else {
        throw new Error('No accounts returned from wallet_connect');
      }
    } catch (error) {
      console.error('Sign in failed:', error);
      setErrorMessage(
        error instanceof Error ? error.message : 'Failed to sign in. Please try again.'
      );
      setFaucetStage('error');
    }
  };

  const handleClaimFaucet = async () => {
    try {
      setFaucetStage('claiming');
      const response = await fetch('/api/faucet/claim', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address: userAddress }),
      });
      const data = await response.json();
      if (data.transactionHash) {
        setTxHash(data.transactionHash);
        setFaucetStage('success');
      } else {
        throw new Error(data.error || 'Failed to claim funds');
      }
    } catch (error) {
      console.error('Claim failed:', error);
      setErrorMessage(
        error instanceof Error ? error.message : 'Failed to claim funds. Please try again.'
      );
      setFaucetStage('error');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-8 relative shadow-2xl">
        <button
          onClick={handleClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Get Sepolia USDC</h2>
        </div>

        {faucetStage === 'signIn' && (
          <div className="space-y-6">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                <Image src="/usdc-logo.png" alt="USDC" width={40} height={40} />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Sign in to claim your funds
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                You need (testnet asset) in order to use this demo. Sign in or create an account so
                we can send you funds.
              </p>
            </div>
            <button
              onClick={handleSignIn}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors"
            >
              Sign in
            </button>
          </div>
        )}

        {faucetStage === 'claiming' && (
          <div className="space-y-6">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                <Image src="/usdc-logo.png" alt="USDC" width={40} height={40} />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Claim your Sepolia USDC</h3>
              <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                Now that you&apos;ve signed in, you can claim your assets and use them to pay for
                the demo transaction.
              </p>
              {userAddress && (
                <p className="text-xs text-gray-500 font-mono bg-gray-50 p-2 rounded break-all">
                  {userAddress}
                </p>
              )}
            </div>
            <button
              onClick={handleClaimFaucet}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors"
            >
              Claim Now
            </button>
          </div>
        )}

        {faucetStage === 'success' && (
          <div className="space-y-6">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                USDC claimed successfully!
              </h3>
              <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                Your testnet USDC has been sent to your wallet. You can now use it in the demo.
              </p>
              {txHash && (
                <a
                  href={`https://sepolia.basescan.org/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:text-blue-700 font-mono bg-blue-50 p-2 rounded block break-all hover:bg-blue-100 transition-colors"
                >
                  View transaction →
                </a>
              )}
            </div>
            <button
              onClick={handleClose}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 px-4 rounded-xl transition-colors"
            >
              Done
            </button>
          </div>
        )}

        {faucetStage === 'error' && (
          <div className="space-y-6">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Something went wrong</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {errorMessage || 'An error occurred. Please try again.'}
              </p>
            </div>
            <button
              onClick={handleClose}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 px-4 rounded-xl transition-colors"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
