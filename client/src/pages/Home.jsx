import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { useStateContext } from '../context'
import { CampaignCard, Loader } from '../components';

const Home = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]);

  const { address, contract, getCampaigns } = useStateContext();

  const fetchCampaigns = async () => {
    setIsLoading(true);
    const data = await getCampaigns();
    setCampaigns(data);
    setIsLoading(false);
  }

  useEffect(() => {
    if(contract) fetchCampaigns();
  }, [address, contract]);

  return (
    <div>
      <h1 className="font-epilogue font-bold text-[18px] text-white text-left">All Campaigns ({campaigns.length})</h1>

      <div className="flex flex-wrap mt-[20px] gap-[26px]">
        {isLoading && (
          <Loader title="Loading campaigns..." />
        )}

        {!isLoading && campaigns.length === 0 && (
          <p className="font-epilogue font-semibold text-[14px] leading-[30px] text-[#818183]">
            No campaigns yet. Why not create one?
          </p>
        )}

        {!isLoading && campaigns.length > 0 && campaigns.map((campaign) => <CampaignCard 
          key={campaign.pId}
          {...campaign}
          handleClick={() => navigate(`/campaign-details/${campaign.pId}`, { state: campaign })}
        />)}
      </div>
    </div>
  )
}

export default Home
