export function generateMarketing(product: any) {
    return {
      tiktokHook: `🔥 Everyone is buying ${product.name}... here's why!`,
  
      facebookHeadline: `${product.name} is changing the game!`,
  
      facebookText: `Discover why thousands of customers love ${product.name}. Limited stock available.`,
  
      emailSubject: `The next winning product is here`,
  
      emailBody: `Start selling ${product.name} today and maximize your profits with this trending product.`,
  
      cta: "Start Selling Now",
  
      seoKeywords: [
        product.name,
        "Winning Product",
        "Dropshipping",
        "TikTok Product",
        "Shopify Product"
      ]
    };
  }