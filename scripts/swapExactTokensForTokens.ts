import { ethers } from "hardhat";
const helpers = require("@nomicfoundation/hardhat-network-helpers");

async function main() {
    // const LP_TOKEN_RECIPIENT = "0x9ce826910f5e22A6e22A6a0418033b2677505752";
    const ROUTER_ADDRESS = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D"; //0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D
     const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
  const DAI = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
    
  
    const TOKEN_HOLDER = "0xf584F8728B874a6a5c7A8d4d387C9aae9172D621";

//
    await helpers.impersonateAccount(TOKEN_HOLDER);
    const impersonatedSigner = await ethers.getSigner(TOKEN_HOLDER);
//  The amount of USDC i actually want to deposit
  const usdcAmountIn = ethers.parseUnits("100", 6);
  //  The amount of DAI i actually want to deposit
  const daiAmountOutMax = ethers.parseUnits("100", 18);
  
 
    const USDC_Contract = await ethers.getContractAt("IERC20", USDC, impersonatedSigner);
  const DAI_Contract = await ethers.getContractAt("IERC20", DAI, impersonatedSigner); 
  
    
    const ROUTER = await ethers.getContractAt("IUniswapV2Router", ROUTER_ADDRESS, impersonatedSigner);

    await USDC_Contract.approve(ROUTER, usdcAmountIn);
    // await DAI_Contract.approve(ROUTER, daiAmount);

    const usdcBal = await USDC_Contract.balanceOf(impersonatedSigner);
  const daiBal = await DAI_Contract.balanceOf(impersonatedSigner);

    const deadline = Math.floor(Date.now() / 1000) + (60 * 10);

    console.log("usdc balance before liquidity", ethers.formatUnits(usdcBal, 6));
  console.log("DAI balance before liquidity", ethers.formatUnits(daiBal, 18));

   console.log("=========================================================");
   console.log("=========================================================");
  

    await ROUTER.swapTokensForExactTokens(
        usdcAmountIn,
        daiAmountOutMax,
        [USDC, DAI],
        impersonatedSigner.address,
        deadline
    );

    const usdcBalAfter = await USDC_Contract.balanceOf(impersonatedSigner);
  const daiBalAfter = await DAI_Contract.balanceOf(impersonatedSigner);


  
   
    console.log("usdc balance after liquidity", ethers.formatUnits(usdcBalAfter, 6));
  console.log("DAI balance after liquidity", ethers.formatUnits(daiBalAfter, 18));

  
  
  
  
  
}


        

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});


// 0xdF3e18d64BC6A983f673Ab319CCaE4f1a57C7097 