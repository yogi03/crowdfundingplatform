import React, { useState, useEffect } from "react";
import { useStateContext } from "../context";
import { Loader } from "../components";
import { daysLeft } from "../utils";

const StatBox = ({ title, value, icon, color }) => (
  <div className="flex-1 dark:bg-[#1c1c24] bg-white rounded-[10px] p-6 flex flex-col items-center justify-center border dark:border-[#3a3a43] border-gray-200 dark:hover:border-[#4cbd8d] hover:border-[#4cbd8d] transition-all cursor-pointer">
    <div
      className={`w-12 h-12 rounded-full ${color} flex items-center justify-center mb-4`}
    >
      <span className="text-white text-xl">{icon}</span>
    </div>
    <h4 className="font-epilogue font-bold text-[28px] dark:text-white text-gray-900">
      {value}
    </h4>
    <p className="font-epilogue font-medium text-[14px] dark:text-[#808191] text-gray-600 uppercase mt-2">
      {title}
    </p>
  </div>
);

const Payment = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [myCampaigns, setMyCampaigns] = useState([]);
  const [stats, setStats] = useState({
    totalRaised: 0,
    activeCampaigns: 0,
    completedCampaigns: 0,
    totalDonations: 0,
  });

  const { address, contract, getCampaigns } = useStateContext();

  const fetchStats = async () => {
    setIsLoading(true);
    const allCampaigns = await getCampaigns();

    const userCampaigns = allCampaigns.filter(
      (c) => c.owner.toLowerCase() === address.toLowerCase(),
    );
    setMyCampaigns(userCampaigns);

    let raised = 0;
    let active = 0;
    let completed = 0;

    userCampaigns.forEach((c) => {
      raised += parseFloat(c.amountCollected);
      if (daysLeft(c.deadline) > 0) {
        active++;
      } else {
        completed++;
      }
    });

    setStats({
      totalRaised: raised.toFixed(4),
      activeCampaigns: active,
      completedCampaigns: completed,
      totalDonations: userCampaigns.length, // Simplified for now
    });

    setIsLoading(false);
  };

  useEffect(() => {
    if (contract && address) fetchStats();
  }, [address, contract]);

  return (
    <div className="flex flex-col gap-10">
      {isLoading && <Loader />}

      <div className="flex flex-col">
        <h1 className="font-epilogue font-bold text-[24px] dark:text-white text-gray-900">
          Payment Statistics
        </h1>
        <p className="mt-2 font-epilogue font-normal text-[16px] dark:text-[#808191] text-gray-600">
          Monitor your campaign performance and financial overview.
        </p>
      </div>

      <div className="flex flex-wrap gap-[20px]">
        <StatBox
          title="Total Raised (ETH)"
          value={stats.totalRaised}
          icon="💰"
          color="bg-[#8c6dfd]"
        />
        <StatBox
          title="Active Projects"
          value={stats.activeCampaigns}
          icon="🚀"
          color="bg-[#1dc071]"
        />
        <StatBox
          title="Completed"
          value={stats.completedCampaigns}
          icon="✅"
          color="bg-[#4acd8d]"
        />
        <StatBox
          title="My Campaigns"
          value={stats.totalDonations}
          icon="📋"
          color="bg-[#3a3a43]"
        />
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="font-epilogue font-semibold text-[18px] dark:text-white text-gray-900 uppercase">
          Your Recent Activity
        </h2>
        <div className="dark:bg-[#1c1c24] bg-white rounded-[10px] overflow-hidden border dark:border-[#3a3a43] border-gray-200">
          <table className="w-full text-left">
            <thead className="dark:bg-[#3a3a43] bg-gray-100 dark:text-[#808191] text-gray-700 font-epilogue font-medium text-[12px] uppercase">
              <tr>
                <th className="px-6 py-4">Campaign Title</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Raised</th>
                <th className="px-6 py-4">Target</th>
                <th className="px-6 py-4">Deadline</th>
              </tr>
            </thead>
            <tbody className="dark:text-white text-gray-900 font-epilogue">
              {myCampaigns.length > 0 ? (
                myCampaigns.map((c, i) => (
                  <tr
                    key={i}
                    className="border-b dark:border-[#3a3a43] border-gray-200 dark:hover:bg-[#2c2f32] hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 font-semibold">{c.title}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-[10px] ${daysLeft(c.deadline) > 0 ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500"}`}
                      >
                        {daysLeft(c.deadline) > 0 ? "Active" : "Closed"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {parseFloat(c.amountCollected).toFixed(4)} ETH
                    </td>
                    <td className="px-6 py-4">{c.target} ETH</td>
                    <td className="px-6 py-4">
                      {new Date(c.deadline * 1000).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-10 text-center dark:text-[#808191] text-gray-600"
                  >
                    No campaigns found. Start one to see stats!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Payment;
