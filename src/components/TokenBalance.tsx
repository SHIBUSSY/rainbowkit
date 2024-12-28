import { useAccount, useContractRead } from 'wagmi';
import { formatUnits } from 'ethers';

interface TokenBalanceProps {
  tokenAddress: `0x${string}`; // Enforces a valid Ethereum address
  tokenDecimals: number;       // Token decimals for formatting
}

const TokenBalance: React.FC<TokenBalanceProps> = ({ tokenAddress, tokenDecimals }) => {
  const { address } = useAccount(); // Get the connected wallet address

  const { data: balance, isLoading, isError } = useContractRead({
    address: tokenAddress,
    abi: [
      // Minimal ABI for ERC-20 balanceOf function
      {
        constant: true,
        inputs: [{ name: '_owner', type: 'address' }],
        name: 'balanceOf',
        outputs: [{ name: 'balance', type: 'uint256' }],
        type: 'function',
      },
    ],
    functionName: 'balanceOf',
    args: [address],
    watch: true, // Automatically refresh on changes
  });

  if (!address) return <div>Please connect your wallet.</div>;
  if (isLoading) return <div>Loading balance...</div>;
  if (isError) return <div>Error fetching balance.</div>;

  // Format balance
  const formattedBalance = parseFloat(formatUnits(balance || 0, tokenDecimals));

  // Define the message
  const message =
    formattedBalance > 0
      ? "Not sure what this is gonna be yet. Stay tired. $SHIBUSSY"
      : "You don't have any $SHIBUSSY, but you are still cool.";

  return (
    <div>
      <h3>$SHIBUSSY Balance</h3>
      <p>
        My Balance: <strong>{formattedBalance}</strong>
      </p>
      <div>
        <strong>{message}</strong>
      </div>
      {formattedBalance > 0 && (
        <div>
          <img src="/assets/project-logo.png" alt="SHIBUSSY logo" />
        </div>
      )}
    </div>
  );
};

export default TokenBalance;
