export function generateMarketing(product: any) {

  return {

    tiktokHook:
      `🔥 This ${product.name} is selling out everywhere!`,

    tiktokScript:
      `Problem ➜ Show ${product.name} ➜ Demonstration ➜ Benefits ➜ Social proof ➜ Buy now.`,

    facebookHeadline:
      `${product.name} Everyone Wants`,

    facebookText:
      `Upgrade your life with ${product.name}. Limited stock available.`,

    googleTitle:
      `Buy ${product.name} Online`,

    googleDescription:
      `Best price for ${product.name}. Fast shipping worldwide.`,

    emailSubject:
      `Your next winning product is waiting`,

    emailBody:
      `Start selling ${product.name} today and maximize your profit.`,

    seoKeywords: [

      product.name,

      "Winning Product",

      "Shopify",

      "TikTok Shop",

      "AliExpress",

      "Amazon",

      "Dropshipping"

    ],

    hashtags: [

      "#shopify",

      "#dropshipping",

      "#tiktokshop",

      "#amazonfba",

      "#viralproduct"

    ]
  };

}