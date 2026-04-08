// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

contract CrowdFunding {
    struct Campaign {
        address owner;
        string creatorName;
        string title;
        string description;
        uint256 target;
        uint256 deadline;
        uint256 amountCollected;
        string image;
        address[] donors;
        uint256[] donations;
        bool claimed;
        bool isActive;
    }

    mapping(uint256 => Campaign) public campaigns;
    uint256 public numberOfCampaigns = 0;

    function createCampaign(
        address _owner,
        string memory _creatorName,
        string memory _title,
        string memory _description,
        uint256 _target,
        uint256 _deadline,
        string memory _image
    ) public returns (uint256) {
        Campaign storage campaign = campaigns[numberOfCampaigns];

        require(_deadline > block.timestamp, "The deadline should be a date in the future.");

        campaign.owner = _owner;
        campaign.creatorName = _creatorName;
        campaign.title = _title;
        campaign.description = _description;
        campaign.target = _target;
        campaign.deadline = _deadline;
        campaign.amountCollected = 0;
        campaign.image = _image;
        campaign.claimed = false;
        campaign.isActive = true;

        numberOfCampaigns++;

        return numberOfCampaigns - 1;
    }

    function donateToCampaign(uint256 _id) public payable {
        uint256 amount = msg.value;
        Campaign storage campaign = campaigns[_id];

        require(campaign.isActive, "Campaign is no longer active.");
        require(block.timestamp < campaign.deadline, "Cannot donate after deadline.");
        require(amount > 0, "Donation amount must be greater than 0.");

        campaign.donors.push(msg.sender);
        campaign.donations.push(amount);
        campaign.amountCollected = campaign.amountCollected + amount;
    }

    function claimFunds(uint256 _id) public {
        Campaign storage campaign = campaigns[_id];

        require(campaign.isActive, "Campaign is no longer active.");
        require(msg.sender == campaign.owner, "Only the campaign owner can claim funds.");
        require(block.timestamp >= campaign.deadline, "Cannot claim funds before deadline.");
        require(campaign.amountCollected >= campaign.target, "Target goal has not been reached.");
        require(!campaign.claimed, "Funds have already been claimed.");

        campaign.claimed = true;
        
        (bool sent, ) = payable(campaign.owner).call{value: campaign.amountCollected}("");
        require(sent, "Failed to send Ether.");
    }

    function refund(uint256 _id) public {
        Campaign storage campaign = campaigns[_id];

        require(block.timestamp >= campaign.deadline || !campaign.isActive, "Cannot refund yet.");
        if (campaign.isActive) {
            require(campaign.amountCollected < campaign.target, "Target goal has been reached, cannot refund.");
        }

        uint256 refundAmount = 0;

        for (uint256 i = 0; i < campaign.donors.length; i++) {
            if (campaign.donors[i] == msg.sender) {
                refundAmount += campaign.donations[i];
                campaign.donations[i] = 0; // Prevent double refund
            }
        }

        require(refundAmount > 0, "No funds to refund for this address.");

        (bool sent, ) = payable(msg.sender).call{value: refundAmount}("");
        require(sent, "Failed to send Ether.");
    }

    function deleteCampaign(uint256 _id) public {
        Campaign storage campaign = campaigns[_id];

        require(msg.sender == campaign.owner, "Only the campaign owner can delete the campaign.");
        require(campaign.isActive, "Campaign is already deleted.");
        require(!campaign.claimed, "Funds already claimed, cannot delete.");

        // Automatically refund all donors
        for (uint256 i = 0; i < campaign.donors.length; i++) {
            uint256 amount = campaign.donations[i];
            if (amount > 0) {
                address donor = campaign.donors[i];
                campaign.donations[i] = 0;
                (bool sent, ) = payable(donor).call{value: amount}("");
                // We don't require(sent) here to ensure one failing donor doesn't block the whole deletion
                // If it fails, the donor can still use the manual refund() function later
            }
        }

        campaign.isActive = false;
        campaign.amountCollected = 0;
    }

    function getdonors(uint256 _id) public view returns (address[] memory, uint256[] memory) {
        return (campaigns[_id].donors, campaigns[_id].donations);
    }

    function getCampaigns() public view returns (Campaign[] memory) {
        Campaign[] memory allCampaigns = new Campaign[](numberOfCampaigns);

        for(uint i = 0; i < numberOfCampaigns; i++) {
            Campaign storage item = campaigns[i];
            allCampaigns[i] = item;
        }

        return allCampaigns;
    }
}
