import { ethers } from "hardhat";
const helpers = require("@nomicfoundation/hardhat-network-helpers");

async function main() {
    // const LP_TOKEN_RECIPIENT = "0x9ce826910f5e22A6e22A6a0418033b2677505752";
    const ROUTER_ADDRESS = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D"; //0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D
     const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
  const WETH = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
    
const TOKEN_HOLDER = "0xf584F8728B874a6a5c7A8d4d387C9aae9172D621";

//
    await helpers.impersonateAccount(TOKEN_HOLDER);
  const impersonatedSigner = await ethers.getSigner(TOKEN_HOLDER);
  
  const usdcAmountDesired = ethers.parseUnits("100", 6);
  const amountETHDesired = ethers.parseEther("1");
  

  const usdcAmountMin = ethers.parseUnits("50", 6);
  const amountETHMin = ethers.parseEther("0.02");
 
  const USDC_Contract = await ethers.getContractAt("IERC20", USDC, impersonatedSigner);
  const WETH_contract = await ethers.getContractAt("IERC20", WETH, impersonatedSigner);
    
    const ROUTER = await ethers.getContractAt("IUniswapV2Router", ROUTER_ADDRESS, impersonatedSigner);
    
    await USDC_Contract.approve(ROUTER, usdcAmountDesired);
    
    
    const usdcBal = await USDC_Contract.balanceOf(impersonatedSigner);
  const ETHbal = await WETH_contract.balanceOf(impersonatedSigner);

    const deadline = Math.floor(Date.now() / 1000) + (60 * 10);

    console.log("usdc balance before liquidity", ethers.formatUnits(usdcBal, 6));
    console.log("ETH balance before liquidity", ethers.formatUnits(ETHbal, 6));
  

   console.log("=========================================================");
   console.log("=========================================================");
  

    await ROUTER.addLiquidityETH(
        USDC,
        usdcAmountDesired,
        usdcAmountMin,
      amountETHMin,
        impersonatedSigner.address,
        deadline,
        {value : amountETHDesired}
    );

    const usdcBalAfter = await USDC_Contract.balanceOf(impersonatedSigner);
  


  
   
  console.log("usdc balance after liquidity", ethers.formatUnits(usdcBalAfter, 6));
  console.log("ETH balance after liquidity", ethers.formatUnits(ETHbal, 6));
  
  

  
  
  
  
  
}


        

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});


// 0xdF3e18d64BC6A983f673Ab319CCaE4f1a57C7097 