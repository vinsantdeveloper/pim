


function upgradeMembership(userId,membershipId,price,name,days,userCanBuyItem) {

   var paymentRequest = {
        "userId":userId,
        "membershipId":membershipId,
        "price":price,
        "name":name,
        "days":days,
        "userCanBuyItem":userCanBuyItem
   };

  console.log("Inapp:"+JSON.stringify(paymentRequest));

}