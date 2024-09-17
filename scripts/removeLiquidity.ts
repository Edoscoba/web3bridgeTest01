import { ethers } from "hardhat";
const helpers = require("@nomicfoundation/hardhat-network-helpers");

async function main() {
    // const LP_TOKEN_RECIPIENT = "0x9ce826910f5e22A6e22A6a0418033b2677505752";
    const ROUTER_ADDRESS = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D"; //0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D
     const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
  const DAI = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
    const LPTokenAddress = "0xAE461cA67B15dc8dc81CE7615e0320dA1A9aB8D5"
  
    const TOKEN_HOLDER = "0xf584F8728B874a6a5c7A8d4d387C9aae9172D621";

//
    await helpers.impersonateAccount(TOKEN_HOLDER);
    const impersonatedSigner = await ethers.getSigner(TOKEN_HOLDER);
//  The amount of USDC i actually want to deposit
  const usdcAmount = ethers.parseUnits("100", 6);
  //  The amount of DAI i actually want to deposit
  const daiAmount = ethers.parseUnits("100", 18);
  
  //  The minimum amount of usdc i want to deposit.
  const AmountUsdcMin = ethers.parseUnits("50", 6);
  // The minimum amount of DAI i want to deposit.
  const AmountDaiMin = ethers.parseUnits("50", 18);

    const USDC_Contract = await ethers.getContractAt("IERC20", USDC, impersonatedSigner);
  const DAI_Contract = await ethers.getContractAt("IERC20", DAI, impersonatedSigner); 
  const  LPToken_Contract = await ethers.getContractAt("IERC20", LPTokenAddress,  impersonatedSigner);
    
    const ROUTER = await ethers.getContractAt("IUniswapV2Router", ROUTER_ADDRESS, impersonatedSigner);

    await USDC_Contract.approve(ROUTER, usdcAmount);
    await DAI_Contract.approve(ROUTER, daiAmount);

    const usdcBal = await USDC_Contract.balanceOf(impersonatedSigner);
  const daiBal = await DAI_Contract.balanceOf(impersonatedSigner);
  const lpBal = await LPToken_Contract.balanceOf(impersonatedSigner);
    const deadline = Math.floor(Date.now() / 1000) + (60 * 10);

    console.log("usdc balance before liquidity", ethers.formatUnits(usdcBal, 6));
  console.log("DAI balance before liquidity", ethers.formatUnits(daiBal, 18));
  console.log("LPK balance before liquidity", ethers.formatUnits(lpBal, 18));
   console.log("=========================================================");
  

    await ROUTER.addLiquidity(
        USDC,
        DAI,
      usdcAmount,
       daiAmount,
        AmountUsdcMin,
      AmountDaiMin,
        impersonatedSigner.address,
        deadline
    );

    const usdcBalAfter = await USDC_Contract.balanceOf(impersonatedSigner);
  const daiBalAfter = await DAI_Contract.balanceOf(impersonatedSigner);
  const lpBalAfter = await LPToken_Contract.balanceOf(impersonatedSigner);

  
   
    console.log("usdc balance after liquidity", ethers.formatUnits(usdcBalAfter, 6));
  console.log("DAI balance after liquidity", ethers.formatUnits(daiBalAfter, 18));
  console.log("LPK balance after liquidity", ethers.formatUnits(lpBalAfter, 18))
  console.log("=========================================================");
   console.log("=========================================================");
  
  
  // REMOVE LIQUIDITY

  const usdcBalAfterRemove = await USDC_Contract.balanceOf(impersonatedSigner);
  const daiBalAfterRemove = await DAI_Contract.balanceOf(impersonatedSigner);
  const lpBalAfterRemove = await LPToken_Contract.balanceOf(impersonatedSigner);
  
  
  const amountUsdcMin = ethers.parseUnits("50", 6);  // Reduced minimum USDC
  const amountDaiMin = ethers.parseUnits("50", 18); 
  
  const amountLp = ethers.parseUnits("0.00005", 18);
  await LPToken_Contract.approve(ROUTER, amountLp);
  
   const usdcBalbeforeRemove = await USDC_Contract.balanceOf(impersonatedSigner);
   const daiBalbeforeRemove = await DAI_Contract.balanceOf(impersonatedSigner);
  const lpBalbeforeRemove = await LPToken_Contract.balanceOf(impersonatedSigner);
  console.log("Removing liquidity...");
  
  console.log("usdc balance before remove", ethers.formatUnits(usdcBalbeforeRemove, 6));
  console.log("DAI balance before remove", ethers.formatUnits(daiBalbeforeRemove,18));
  console.log("LPK balance before remove", ethers.formatUnits(lpBalbeforeRemove,18));
  await ROUTER.removeLiquidity(
    USDC,
    DAI,
    amountLp,
    amountUsdcMin,
    amountDaiMin,
    impersonatedSigner,
    deadline
);
    



  console.log("=========================================================");

  console.log("usdc balance after remove", ethers.formatUnits(usdcBalAfterRemove));
  console.log("DAI balance after remove", ethers.formatUnits(daiBalAfterRemove));
  console.log("LPK balance after remove", ethers.formatUnits(lpBalAfterRemove));

  
}


        

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});


// 0xdF3e18d64BC6A983f673Ab319CCaE4f1a57C7097 