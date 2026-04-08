const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CrowdFunding", function () {
  let CrowdFunding, crowdFunding, owner, donor;

  beforeEach(async function () {
    [owner, donor] = await ethers.getSigners();
    CrowdFunding = await ethers.getContractFactory("CrowdFunding");
    crowdFunding = await CrowdFunding.deploy();
  });

  describe("Campaign Management", function () {
    it("should create a campaign correctly", async function () {
      const deadline = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
      await crowdFunding.createCampaign(owner.address, "Test Campaign", "A campaign for testing", ethers.parseEther("1"), deadline, "https://example.com/image.jpg");
      
      const campaign = await crowdFunding.campaigns(0);
      expect(campaign.owner).to.equal(owner.address);
      expect(campaign.title).to.equal("Test Campaign");
      expect(Number(await crowdFunding.numberOfCampaigns())).to.equal(1);
    });

    it("should donate to a campaign", async function () {
      const deadline = Math.floor(Date.now() / 1000) + 3600;
      await crowdFunding.createCampaign(owner.address, "Donation Test", "Testing donations", ethers.parseEther("1"), deadline, "https://example.com/image.jpg");

      await crowdFunding.connect(donor).donateToCampaign(0, { value: ethers.parseEther("0.5") });
      
      const campaign = await crowdFunding.campaigns(0);
      expect(campaign.amountCollected).to.equal(ethers.parseEther("0.5"));
      
      const [donors, donations] = await crowdFunding.getdonors(0);
      expect(donors[0]).to.equal(donor.address);
      expect(donations[0]).to.equal(ethers.parseEther("0.5"));
    });

    it("should allow claiming funds after deadline if goal met", async function () {
      const deadline = Math.floor(Date.now() / 1000) + 10; // 10 second deadline
      await crowdFunding.createCampaign(owner.address, "Claim Test", "Testing claiming", ethers.parseEther("0.1"), deadline, "https://example.com/image.jpg");

      await crowdFunding.connect(donor).donateToCampaign(0, { value: ethers.parseEther("0.2") });

      // Fast forward time
      await ethers.provider.send("evm_increaseTime", [5]);
      await ethers.provider.send("evm_mine");

      const balanceBefore = await ethers.provider.getBalance(owner.address);
      await crowdFunding.connect(owner).claimFunds(0);
      const balanceAfter = await ethers.provider.getBalance(owner.address);

      expect(balanceAfter).to.be.gt(balanceBefore);
      const campaign = await crowdFunding.campaigns(0);
      expect(campaign.claimed).to.be.true;
    });
  });
});
