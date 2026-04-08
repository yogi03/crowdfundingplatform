import React, { useContext, createContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import detectEthereumProvider from '@metamask/detect-provider';
import { ABI, CONTRACT_ADDRESS } from '../constants';

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  const [address, setAddress] = useState('');
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);

  const connect = async () => {
    const detectedProvider = await detectEthereumProvider();
    
    if (!detectedProvider) {
      return alert('Please install MetaMask or another Web3 wallet, or check if it is enabled.');
    }

    try {
      const accounts = await detectedProvider.request({ method: 'eth_requestAccounts' });
      setAddress(accounts[0]);
      
      const _provider = new ethers.BrowserProvider(detectedProvider);
      const _signer = await _provider.getSigner();
      const _contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, _signer);
      
      setProvider(_provider);
      setContract(_contract);
    } catch (error) {
      console.log("Error connecting to wallet: ", error);
    }
  }

  const createCampaign = async (form) => {
    try {
      const deadline = new Date(form.deadline);
      deadline.setHours(23, 59, 59, 999);

      const data = await contract.createCampaign(
        address, // owner
        form.name, // creatorName
        form.title, // title
        form.description, // description
        form.target, // target
        Math.floor(deadline.getTime() / 1000), // deadline
        form.image // image
      );

      await data.wait();
      console.log("Contract call success", data);
    } catch (error) {
      console.log("Contract call failure", error);
      throw error;
    }
  }

  const getCampaigns = async () => {
    if (!contract) return [];
    
    try {
      const campaigns = await contract.getCampaigns();

      const parsedCampaigns = campaigns.map((campaign, i) => ({
        owner: campaign.owner,
        creatorName: campaign.creatorName,
        title: campaign.title,
        description: campaign.description,
        target: ethers.formatEther(campaign.target.toString()),
        deadline: Number(campaign.deadline),
        amountCollected: ethers.formatEther(campaign.amountCollected.toString()),
        image: campaign.image,
        pId: i,
        claimed: campaign.claimed,
        isActive: campaign.isActive
      }));

      return parsedCampaigns.filter((campaign) => campaign.isActive);
    } catch (error) {
      console.log("Error fetching campaigns: ", error);
      return [];
    }
  }

  const getUserCampaigns = async () => {
    const allCampaigns = await getCampaigns();
    const filteredCampaigns = allCampaigns.filter((campaign) => campaign.owner.toLowerCase() === address.toLowerCase());
    return filteredCampaigns;
  }

  const donate = async (pId, amount) => {
    try {
      const data = await contract.donateToCampaign(pId, { value: ethers.parseEther(amount) });
      await data.wait();
      return data;
    } catch (error) {
      console.log("Donation error: ", error);
      throw error;
    }
  }

  const getDonations = async (pId) => {
    try {
      const donations = await contract.getdonors(pId);
      const numberOfDonations = donations[0].length;

      const parsedDonations = [];

      for (let i = 0; i < numberOfDonations; i++) {
        parsedDonations.push({
          donator: donations[0][i],
          donation: ethers.formatEther(donations[1][i].toString())
        })
      }

      return parsedDonations;
    } catch (error) {
      console.log("Error fetching donations: ", error);
      return [];
    }
  }

  const claimFunds = async (pId) => {
    try {
      const data = await contract.claimFunds(pId);
      await data.wait();
      return data;
    } catch (error) {
      console.log("Claim funds error: ", error);
      throw error;
    }
  }

  const refundDonation = async (pId) => {
    try {
      const data = await contract.refund(pId);
      await data.wait();
      return data;
    } catch (error) {
      console.log("Refund error: ", error);
      throw error;
    }
  }

  const deleteCampaign = async (pId) => {
    try {
      const data = await contract.deleteCampaign(pId);
      await data.wait();
      return data;
    } catch (error) {
      console.log("Delete campaign error: ", error);
      throw error;
    }
  }

  // Check if wallet is already connected and setup event listeners
  useEffect(() => {
    const handleAccountsChanged = (accounts) => {
      if (accounts.length > 0) {
        setAddress(accounts[0]);
        connect(); // Refresh contract/signer
      } else {
        setAddress('');
        setContract(null);
      }
    };

    const setupProvider = async () => {
      const detectedProvider = await detectEthereumProvider();
      if (detectedProvider) {
        detectedProvider.on('accountsChanged', handleAccountsChanged);
      }
    };

    setupProvider();
  }, []);

  return (
    <StateContext.Provider
      value={{
        address,
        contract,
        connect,
        createCampaign,
        getCampaigns,
        getUserCampaigns,
        donate,
        getDonations,
        claimFunds,
        refundDonation,
        deleteCampaign,
      }}
    >
      {children}
    </StateContext.Provider>
  )
}

export const useStateContext = () => useContext(StateContext);
