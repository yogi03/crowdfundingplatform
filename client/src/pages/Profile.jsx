import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStateContext } from "../context";
import { CampaignCard, Loader } from "../components";

const Profile = ({ searchQuery = "" }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]);

  const { address, contract, getUserCampaigns } = useStateContext();

  const fetchCampaigns = async () => {
    setIsLoading(true);
    const data = await getUserCampaigns();
    setCampaigns(data);
    setIsLoading(false);
  };

  useEffect(() => {
    if (contract) fetchCampaigns();
  }, [address, contract]);

  // Filter campaigns based on search query
  const filteredCampaigns = campaigns.filter((campaign) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      campaign.title.toLowerCase().includes(searchLower) ||
      campaign.description.toLowerCase().includes(searchLower) ||
      campaign.creatorName.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div>
      <h1 className="font-epilogue font-bold text-[18px] dark:text-white text-gray-900 text-left text-foreground">
        Your Campaigns ({filteredCampaigns.length})
      </h1>

      <div className="flex flex-wrap mt-[20px] gap-[26px]">
        {isLoading && <Loader title="Fetching your campaigns..." />}

        {!isLoading &&
          filteredCampaigns.length === 0 &&
          campaigns.length > 0 && (
            <p className="font-epilogue font-semibold text-[14px] leading-[30px] dark:text-[#818183] text-gray-500">
              No campaigns match your search. Try a different search term.
            </p>
          )}

        {!isLoading && campaigns.length === 0 && (
          <p className="font-epilogue font-semibold text-[14px] leading-[30px] dark:text-[#818183] text-gray-500">
            You have not created any campaigns yet
          </p>
        )}

        {!isLoading &&
          filteredCampaigns.length > 0 &&
          filteredCampaigns.map((campaign) => (
            <CampaignCard
              key={campaign.pId}
              {...campaign}
              handleClick={() =>
                navigate(`/campaign-details/${campaign.pId}`, {
                  state: campaign,
                })
              }
            />
          ))}
      </div>
    </div>
  );
};

export default Profile;
