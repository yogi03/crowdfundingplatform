import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ethers } from 'ethers';

import { useStateContext } from '../context';
import { CountBox, Loader } from '../components';
import { daysLeft, getGoogleDriveImage } from '../utils';

const CampaignDetail = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { donate, getDonations, contract, address, claimFunds, refundDonation, getCampaigns, deleteCampaign } = useStateContext();

  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState('');
  const [donators, setDonators] = useState([]);
  const [campaign, setCampaign] = useState(state);

  const hasDonated = donators.some(d => d.donator.toLowerCase() === address?.toLowerCase());

  const fetchDonators = async () => {
    const data = await getDonations(id);
    setDonators(data);
  }

  const fetchCampaign = async () => {
    if(!campaign) {
        setIsLoading(true);
        const allCampaigns = await getCampaigns();
        const foundCampaign = allCampaigns.find((c) => c.pId.toString() === id);
        setCampaign(foundCampaign);
        setIsLoading(false);
    }
  }

  useEffect(() => {
    if(contract) {
        fetchDonators();
        fetchCampaign();
    }
  }, [contract, address, id])

  const handleDonate = async () => {
    setIsLoading(true);

    try {
      await donate(id, amount); 
      navigate('/');
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }

  const handleClaim = async () => {
      setIsLoading(true);
      try {
          await claimFunds(id);
          navigate('/');
          setIsLoading(false);
      } catch (error) {
          console.log(error);
          setIsLoading(false);
      }
  }

  const handleRefund = async () => {
      setIsLoading(true);
      try {
          await refundDonation(id);
          navigate('/');
          setIsLoading(false);
      } catch (error) {
          console.log(error);
          setIsLoading(false);
      }
  }

  const handleDelete = async () => {
      const confirmDelete = window.confirm("Are you sure you want to delete this campaign? All donors will be automatically refunded.");
      if(!confirmDelete) return;

      setIsLoading(true);
      try {
          await deleteCampaign(id);
          navigate('/');
          setIsLoading(false);
      } catch (error) {
          console.log(error);
          setIsLoading(false);
      }
  }

  if(!campaign && !isLoading) return <div className="text-white">Campaign not found</div>;

  return (
    <div>
      {isLoading && <Loader />}

      <div className="w-full flex md:flex-row flex-col mt-10 gap-[30px]">
        <div className="flex-1 flex-col">
          <img src={getGoogleDriveImage(campaign?.image)} alt="campaign" className="w-full h-[410px] object-cover rounded-xl"/>
          <div className="relative w-full h-[5px] bg-[#3a3a43] mt-2">
            <div className="absolute h-full bg-[#4acd8d]" style={{ width: `${Math.min((campaign?.amountCollected / campaign?.target) * 100, 100)}%`, maxWidth: '100%'}}>
            </div>
          </div>
        </div>

        <div className="flex md:w-[150px] w-full flex-wrap justify-between gap-[30px]">
          <CountBox title="Days Left" value={daysLeft(campaign?.deadline)} />
          <CountBox title={`Raised of ${campaign?.target}`} value={campaign?.amountCollected} />
          <CountBox title="Total Donors" value={donators.length} />
        </div>
      </div>

      <div className="mt-[60px] flex lg:flex-row flex-col gap-5">
        <div className="flex-[2] flex flex-col gap-[40px]">
          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">Creator</h4>
            <div className="mt-[20px] flex flex-row items-center flex-wrap gap-[14px]">
              <div className="w-[52px] h-[52px] flex items-center justify-center rounded-full bg-[#2c2f32] cursor-pointer">
                <div className="w-[60%] h-[60%] bg-[#4acd8d] rounded-full" />
              </div>
              <div>
                <h4 className="font-epilogue font-semibold text-[14px] text-white break-all">{campaign?.creatorName || 'Anonymous'} ({campaign?.owner})</h4>
                <p className="mt-[4px] font-epilogue font-normal text-[12px] text-[#808191]">10 Campaigns</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">Story</h4>
              <div className="mt-[20px]">
                <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify">{campaign?.description}</p>
              </div>
          </div>

          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">Donations</h4>
              <div className="mt-[20px] flex flex-col gap-4">
                {donators.length > 0 ? donators.map((item, index) => (
                  <div key={`${item.donator}-${index}`} className="flex justify-between items-center gap-4">
                    <p className="font-epilogue font-normal text-[16px] text-[#b2b3bd] leading-[26px] break-all">{index + 1}. {item.donator}</p>
                    <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] break-all">{item.donation} ETH</p>
                  </div>
                )) : (
                  <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify">No donators yet. Be the first one!</p>
                )}
              </div>
          </div>
        </div>

        <div className="flex-1">
          <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">Fund</h4>   

          <div className="mt-[20px] flex flex-col p-4 bg-[#1c1c24] rounded-[10px]">
            <p className="font-epilogue fount-medium text-[20px] leading-[30px] text-center text-[#808191]">
              Fund the campaign
            </p>
            <div className="mt-[30px]">
              <input 
                type="number"
                placeholder="ETH 0.1"
                step="0.01"
                className="w-full py-[10px] sm:px-[20px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[18px] leading-[30px] placeholder:text-[#4b5264] rounded-[10px]"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />

              <div className="my-[20px] p-4 bg-[#13131a] rounded-[10px]">
                <h4 className="font-epilogue font-semibold text-[14px] leading-[22px] text-white">Back it because you believe in it.</h4>
                <p className="mt-[20px] font-epilogue font-normal leading-[22px] text-[#808191]">Support the project for no reward, just because it speaks to you.</p>
              </div>

              <button
                className="w-full font-epilogue font-semibold text-[16px] leading-[26px] text-white min-h-[52px] px-4 rounded-[10px] bg-[#8c6dfd]"
                onClick={handleDonate}
                disabled={!address}
              >
                {address ? 'Fund Campaign' : 'Connect to Fund'}
              </button>

              {address?.toLowerCase() === campaign?.owner?.toLowerCase() && 
               daysLeft(campaign?.deadline) === 0 && 
               parseFloat(campaign?.amountCollected) >= parseFloat(campaign?.target) && 
               !campaign?.claimed && (
                <button
                  className="w-full mt-4 font-epilogue font-semibold text-[16px] leading-[26px] text-white min-h-[52px] px-4 rounded-[10px] bg-[#1dc071]"
                  onClick={handleClaim}
                >
                  Claim Funds
                </button>
              )}

              {address?.toLowerCase() === campaign?.owner?.toLowerCase() && !campaign?.claimed && (
                <button
                  className="w-full mt-4 font-epilogue font-semibold text-[16px] leading-[26px] text-white min-h-[52px] px-4 rounded-[10px] bg-[#e63c3c]"
                  onClick={handleDelete}
                >
                  Delete Campaign
                </button>
              )}

              {hasDonated && 
               daysLeft(campaign?.deadline) === 0 && 
               parseFloat(campaign?.amountCollected) < parseFloat(campaign?.target) && (
                <button
                  className="w-full mt-4 font-epilogue font-semibold text-[16px] leading-[26px] text-white min-h-[52px] px-4 rounded-[10px] bg-[#e63c3c]"
                  onClick={handleRefund}
                >
                  Request Refund
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CampaignDetail
