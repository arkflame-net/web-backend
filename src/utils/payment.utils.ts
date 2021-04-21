export function createSale (total: number, description: string) {
  return {
    intent: "sale",
    payer: {
        payment_method: "paypal"
    },
    redirect_urls: {
        return_url: process.env.URL_CALLBACK_SUCCESS,
        cancel_url: process.env.URL_CALLBACK_CANCEL
    },
    transactions: [{
        amount: {
            total,
            currency: "USD"
        },

        description
    }]
  }
}

export function createSaleFromPurchase (purchase) {
  let total = 0;
  let description = "";

  for (const item of purchase.items) {
    const price = item.product.price;
    total += price * item.amount;

    if (description) {
      description = description + ", x" + item.amount + item.product.name;
    } else {
      description = "x" + item.amount + item.product.name;
    }
  }

  return createSale(total, description);
}
