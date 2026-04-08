import React, { useState, useEffect } from "react";
import { useStateContext } from "../context";
import { Loader } from "../components";
import { daysLeft } from "../utils";
import { ethers } from "ethers";

const Withdraw = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [claimableCampaigns, setClaimableCampaigns] = useState([]);
  const [balance, setBalance] = useState("0");
  const { address, contract, getCampaigns, claimFunds } = useStateContext();

  const fetchData = async () => {
    if (!address || !contract) return;
    setIsLoading(true);

    try {
      // Get wallet balance
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const bal = await provider.getBalance(address);
        setBalance(parseFloat(ethers.formatEther(bal)).toFixed(4));
      }

      const allCampaigns = await getCampaigns();
      const claimable = allCampaigns.filter(
        (c) =>
          c.owner.toLowerCase() === address.toLowerCase() &&
          daysLeft(c.deadline) === 0 &&
          parseFloat(c.amountCollected) >= parseFloat(c.target) &&
          !c.claimed,
      );
      setClaimableCampaigns(claimable);
    } catch (error) {
      console.log("Error fetching withdrawal data:", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [address, contract]);

  const handleClaim = async (pId) => {
    setIsLoading(true);
    try {
      await claimFunds(pId);
      await fetchData();
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col gap-10">
      {isLoading && <Loader />}

      <div className="flex flex-col">
        <h1 className="font-epilogue font-bold text-[24px] dark:text-white text-gray-900">
          Wallet & Withdrawals
        </h1>
        <p className="mt-2 font-epilogue font-normal text-[16px] dark:text-[#808191] text-gray-600">
          Manage your funds and withdraw earnings from successful campaigns.
        </p>
      </div>

      <div className="flex flex-wrap gap-[20px]">
        <div className="flex-1 dark:bg-[#1c1c24] bg-white rounded-[10px] p-8 flex flex-col items-center justify-center border dark:border-[#3a3a43] border-gray-200">
          <h4 className="font-epilogue font-bold text-[14px] dark:text-[#808191] text-gray-600 uppercase mb-2">
            Connected Wallet
          </h4>
          <p className="font-epilogue font-semibold text-[18px] dark:text-white text-gray-900 truncate max-w-full mb-4">
            {address}
          </p>
          <div className="w-full flex justify-between items-center dark:bg-[#13131a] bg-gray-100 p-4 rounded-[10px]">
            <span className="dark:text-[#808191] text-gray-600">
              Current Balance
            </span>
            <span className="dark:text-[#1dc071] text-[#1dc071] font-bold text-[20px]">
              {balance} ETH
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <h2 className="font-epilogue font-semibold text-[18px] dark:text-white text-gray-900 uppercase">
          Claimable Funds
        </h2>
        {claimableCampaigns.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {claimableCampaigns.map((c, i) => (
              <div
                key={i}
                className="dark:bg-[#1c1c24] bg-white rounded-[10px] p-6 border dark:border-[#3a3a43] border-gray-200 flex flex-col gap-4"
              >
                <div>
                  <h3 className="font-epilogue font-bold text-[18px] dark:text-white text-gray-900 truncate">
                    {c.title}
                  </h3>
                  <p className="dark:text-[#808191] text-gray-600 text-[12px] mt-1">
                    Goal: {c.target} ETH | Raised: {c.amountCollected} ETH
                  </p>
                </div>
                <div className="flex items-center gap-2 text-green-500 text-[14px] font-medium bg-green-500/10 p-2 rounded-md">
                  <span>✓ Campaign successful and deadline reached!</span>
                </div>
                <button
                  onClick={() => handleClaim(c.pId)}
                  className="w-full bg-[#1dc071] py-3 rounded-[10px] font-epilogue font-bold text-white hover:bg-[#15a361] transition-colors"
                >
                  Withdraw {c.amountCollected} ETH
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="dark:bg-[#1c1c24] bg-white rounded-[10px] p-10 flex flex-col items-center justify-center border dark:border-[#3a3a43] border-gray-200 text-center">
            <div className="w-16 h-16 dark:bg-[#3a3a43] bg-gray-100 rounded-full flex items-center justify-center mb-4 text-2xl">
              💰
            </div>
            <h4 className="font-epilogue font-bold text-[18px] dark:text-white text-gray-900">
              No funds to withdraw
            </h4>
            <p className="dark:text-[#808191] text-gray-600 mt-2 max-w-[400px]">
              You don't have any funds currently available for withdrawal. Funds
              become claimable once a campaign reaches its target and the
              deadline passes.
            </p>
          </div>
        )}
      </div>

      <div className="dark:bg-yellow-500/10 bg-yellow-50 border dark:border-yellow-500/20 border-yellow-200 p-6 rounded-[10px]">
        <h4 className="font-epilogue font-bold text-[16px] dark:text-yellow-500 text-yellow-700 mb-2 font-epilogue">
          ⚠️ Important Note
        </h4>
        <p className="dark:text-[#b2b3bd] text-gray-600 text-[14px] font-epilogue">
          Funds are held securely within the smart contract. You can only claim
          them if the campaign target is met and the deadline has passed. If the
          target is not met, donors can potentially request refunds (if
          supported by the contract version).
        </p>
      </div>
    </div>
  );
};

export default Withdraw;
