/*
       Licensed to the Apache Software Foundation (ASF) under one
       or more contributor license agreements.  See the NOTICE file
       distributed with this work for additional information
       regarding copyright ownership.  The ASF licenses this file
       to you under the Apache License, Version 2.0 (the
       "License"); you may not use this file except in compliance
       with the License.  You may obtain a copy of the License at

         http://www.apache.org/licenses/LICENSE-2.0

       Unless required by applicable law or agreed to in writing,
       software distributed under the License is distributed on an
       "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
       KIND, either express or implied.  See the License for the
       specific language governing permissions and limitations
       under the License.
 */

package com.wpdating.wpdating;

import android.app.AlertDialog;
import android.app.ProgressDialog;
import android.content.DialogInterface;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.util.Log;
import android.widget.Toast;

import com.android.billingclient.api.BillingClient;
import com.android.billingclient.api.BillingClientStateListener;
import com.android.billingclient.api.BillingFlowParams;
import com.android.billingclient.api.ConsumeResponseListener;
import com.android.billingclient.api.Purchase;
import com.android.billingclient.api.PurchaseHistoryResponseListener;
import com.android.billingclient.api.PurchasesUpdatedListener;
import com.android.billingclient.api.SkuDetails;
import com.android.billingclient.api.SkuDetailsParams;
import com.android.billingclient.api.SkuDetailsResponseListener;
import com.android.volley.AuthFailureError;
import com.android.volley.DefaultRetryPolicy;
import com.android.volley.Request;
import com.android.volley.toolbox.StringRequest;

import org.apache.cordova.*;
import org.apache.cordova.engine.SystemWebChromeClient;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class MainActivity extends CordovaActivity implements PurchasesUpdatedListener {

    private static final int REQUEST_TIME_OUT = 10000;
    public static MainActivity mainActivity;
    private BillingClient mBillingClient;
    private ArrayList<String> skuList;

    private final String CONSOLE_PREFIX = "Inapp:";

    private final String TAG = "wpdating";
    private java.lang.String SITENAME = "sitename:";

    private String siteName;

    private String userId;

    private String memebershipId;
    private String days;
    private String price;
    private String name;
    private boolean userCanBuyItem;

    private boolean setupComplete = false;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        // enable Cordova apps to be started in the background
        Bundle extras = getIntent().getExtras();
        if (extras != null && extras.getBoolean("cdvStartInBackground", false)) {
            moveTaskToBack(true);
        }

        // Set by <content src="index.html" /> in config.xml
        loadUrl(launchUrl);

    }

    @Override
    protected void onStart() {
        Log.d(TAG, "on start");
        setupInAppBilling();
        setupConsoleListener();
        super.onStart();
    }

    private void setupConsoleListener() {
        SystemWebChromeClient.setOnConsoleMessage(consoleMessage -> {
            if (consoleMessage == null) return;
            Log.d(TAG, "console msg =" + consoleMessage.message());
            String msg = consoleMessage.message();

            if (consoleMessage.message().startsWith(CONSOLE_PREFIX)) {
                String purchaseRequest = msg.substring(msg.indexOf(CONSOLE_PREFIX) + CONSOLE_PREFIX.length());

                try {
                    JSONObject jsonObject = new JSONObject(purchaseRequest);
                    Log.d(TAG, "jsonobject=" + jsonObject.toString());
                    userId = jsonObject.getString("userId");
                    memebershipId = jsonObject.getString("membershipId");
                    days = jsonObject.getString("days");
                    price = jsonObject.getString("price");
                    name = jsonObject.getString("name");
                    userCanBuyItem = jsonObject.getString("userCanBuyItem").equals("1");

                    if (userCanBuyItem) {
                        if (setupComplete) {
                            queryPurchase(mBillingClient);
                        } else {
                            new AlertDialog.Builder(MainActivity.this)
                                    .setMessage("Please restart your app. Billing is not setup.")
                                    .setPositiveButton("OK", new DialogInterface.OnClickListener() {
                                        @Override
                                        public void onClick(DialogInterface dialogInterface, int i) {
                                            dialogInterface.dismiss();
                                        }
                                    }).create().show();
                        }
                    } else {
                        new AlertDialog.Builder(MainActivity.this)
                                .setMessage("You have already bought this plan")
                                .setPositiveButton("OK", new DialogInterface.OnClickListener() {
                                    @Override
                                    public void onClick(DialogInterface dialogInterface, int i) {
                                        dialogInterface.dismiss();
                                    }
                                }).create().show();
                    }

                } catch (Exception e) {
                    Log.e(TAG, e.getMessage());
                }

            } else if (consoleMessage.message().startsWith(SITENAME)) {
                siteName = msg.substring(msg.indexOf(SITENAME) + SITENAME.length());
            }
        });
    }

    @Override
    protected void onStop() {
        Log.d(TAG, "on stop");
        if (mBillingClient != null) {
            mBillingClient.endConnection();
            setupComplete = false;
        }
        super.onStop();
    }

    private void setupInAppBilling() {
        mBillingClient = BillingClient.newBuilder(this).setListener(this).build();
        mBillingClient.startConnection(new BillingClientStateListener() {
            @Override
            public void onBillingSetupFinished(@BillingClient.BillingResponse int billingResponseCode) {
                Log.d(TAG, "on billing response code = " + billingResponseCode);

                if (billingResponseCode == BillingClient.BillingResponse.OK) {
                    // The billing client is ready. You can query purchases here.
                    Log.d(TAG, "billing respose ok");
                    setupComplete = true;
                }
            }

            @Override
            public void onBillingServiceDisconnected() {
                // Try to restart the connection on the next request to
                // Google Play by calling the startConnection() method.
                Log.d(TAG, "on billing service disconnected");
                setupComplete = false;
            }

        });
    }

    public void purchasePrompt() {

        if (mBillingClient == null) {
            Log.d(TAG, "billing client is null");
            return;
        }

        Log.d(TAG, "is feature supported = " + mBillingClient.isFeatureSupported(BillingClient.SkuType.INAPP));
        BillingFlowParams.Builder builder = BillingFlowParams.newBuilder()
                .setSku(memebershipId)
                .setType(BillingClient.SkuType.INAPP);
        int responseCode = mBillingClient.launchBillingFlow(this, builder.build());

        Log.d(TAG, "purchasePrompt() response code = " + responseCode);

        if (responseCode == BillingClient.BillingResponse.ITEM_ALREADY_OWNED) {
            Log.d(TAG, "item already purchased");

            mBillingClient.queryPurchaseHistoryAsync(BillingClient.SkuType.INAPP,
                    new PurchaseHistoryResponseListener() {

                        @Override
                        public void onPurchaseHistoryResponse(@BillingClient.BillingResponse int responseCode,
                                                              List<Purchase> purchasesList) {
                            Log.d(TAG, "onPurchaseHistoryResponse() response code = " + responseCode);

                            if (responseCode == BillingClient.BillingResponse.OK
                                    && purchasesList != null) {

                                for (Purchase purchase : purchasesList) {
                                    // Process the result.
                                    if (memebershipId.equals(purchase.getSku())) {

                                        consumeProduct(purchase.getPurchaseToken());

                                    }

                                }
                            }
                        }
                    });
        }

    }

    private void consumeProduct(String purchaseToken) {
        ConsumeResponseListener listener = new ConsumeResponseListener() {
            @Override
            public void onConsumeResponse(@BillingClient.BillingResponse int responseCode, String outToken) {
                Log.d(TAG, "onConsumeResponse() response code = " + responseCode);

                if (responseCode == BillingClient.BillingResponse.OK) {
                    // Handle the success of the consume operation.
                    // For example, increase the number of coins inside the user's basket.
                    Log.d(TAG, "Product consumed");
                    purchasePrompt();
                }
            }
        };
        mBillingClient.consumeAsync(purchaseToken, listener);
    }

    private void queryPurchase(BillingClient billingClient) {
        Log.d(TAG, "query purchase is called");
        skuList = new ArrayList<>();
        skuList.add(memebershipId);

        SkuDetailsParams.Builder params = SkuDetailsParams.newBuilder();
        params.setType(BillingClient.SkuType.INAPP);
        params.setSkusList(skuList);

        if (billingClient == null) {
            Log.d(TAG, "billing client is null, probabily setup billing is not called");
            return;
        }
        billingClient.querySkuDetailsAsync(params.build(), new SkuDetailsResponseListener() {
            @Override
            public void onSkuDetailsResponse(int responseCode, List<SkuDetails> skuDetailsList) {
                Log.d(TAG, "response code in query purchase = " + responseCode + " sku length = " + (skuDetailsList != null ? skuDetailsList.size() + "" : "null"));

                if (responseCode == BillingClient.BillingResponse.OK
                        && skuDetailsList != null) {
                    Log.d(TAG, "getting sku list length = " + skuDetailsList.size());

                 /*   Map<String, String> subscriptionPeriod = new HashMap<>();

                    subscriptionPeriod.put("7", "P1W");
                    subscriptionPeriod.put("30", "P1M");
                    subscriptionPeriod.put("90", "P3M");
                    subscriptionPeriod.put("180", "P6M");
                    subscriptionPeriod.put("365", "P1Y");
*/
                    for (SkuDetails skuDetails : skuDetailsList) {

                        Log.d(TAG, "user id = " + userId + ", sku = " + skuDetails.getSku() + " , price = " + skuDetails.getPrice() + " , subscription period = " + skuDetails.getSubscriptionPeriod() + " name = " + skuDetails.getTitle());

                        if (memebershipId.equals(skuDetails.getSku())) {
                            if (skuDetails.getPrice().contains(price)
                                    /*    && subscriptionPeriod.containsKey(days)*/
                                    && skuDetails.getTitle().contains(name)) {

                                purchasePrompt();
                            } else {
                                new AlertDialog.Builder(MainActivity.this)
                                        .setMessage("Cannot purchase the plan now. Please contact your site administrator for fixing this issue")
                                        .setPositiveButton("OK", new DialogInterface.OnClickListener() {
                                            @Override
                                            public void onClick(DialogInterface dialogInterface, int i) {
                                                dialogInterface.dismiss();
                                            }
                                        })
                                        .create()
                                        .show();
                            }
                            return;
                        }
                    }

                    Log.d(TAG, "no matching product found in inapp, product id:" + memebershipId);

                } else {
                    Log.d(TAG, "sku details is null or product not found in inapp with id:" + memebershipId);

                }

            }
        });
    }


    @Override
    public void onPurchasesUpdated(int responseCode, @Nullable List<Purchase> purchases) {
        Log.d(TAG, "called on purchases updated");

        if (responseCode == BillingClient.BillingResponse.OK
                && purchases != null) {
            for (Purchase purchase : purchases) {
                Log.d(TAG, "purchase = " + purchase.toString());

                if (memebershipId.equals(purchase.getSku())) {
                    handlePurchase(purchase);
                    break;
                }
            }
        } else if (responseCode == BillingClient.BillingResponse.USER_CANCELED) {
            // Handle an error caused by a user cancelling the purchase flow.
            Log.d(TAG, "user cancel billing response");
        } else {
            // Handle any other error codes.
            Log.d(TAG, "billing response code = " + responseCode);//TODO
        }
    }


    private void handlePurchase(Purchase purchase) {

        Log.d(TAG, "called handle purchase " + purchase.getSku());

        String url = "http://" + siteName + "/members?wpdating-api=wpdating_gateway_google";

        ProgressDialog dialog = new ProgressDialog(this);
        dialog.setMessage("Sending purchase response to server...");
        dialog.setCancelable(false);
        dialog.show();

        Log.d(TAG, "url = " + url);
        StringRequest request = new StringRequest(Request.Method.POST, url, response -> {
            Log.d(TAG, "response = " + response);
            Toast.makeText(this, response, Toast.LENGTH_SHORT).show();
            dialog.dismiss();
        }, error -> {
            dialog.dismiss();
            if (error.networkResponse != null) {
                Log.d(TAG, "error response = " + new String(error.networkResponse.data));
            } else {
                Log.d(TAG, "error is null");
            }
            new AlertDialog.Builder(MainActivity.this)
                    .setMessage("Failed to send purchase information. Please contact your site administrator.")
                    .setPositiveButton("OK", new DialogInterface.OnClickListener() {
                        @Override
                        public void onClick(DialogInterface dialogInterface, int i) {
                            dialogInterface.dismiss();
                        }
                    })
                    .create()
                    .show();
        }) {
            @Override
            protected Map<String, String> getParams() throws AuthFailureError {
                Map<String, String> params = new HashMap<>();
              /*  JSONObject paymentStatus = null;
                try {
                    paymentStatus = new JSONObject(purchase.getOriginalJson());
                } catch (JSONException e) {
                    e.printStackTrace();
                }*/

                params.put("pay_user_id", userId);
                params.put("pay_plan_id", memebershipId);
                params.put("pay_plan_amount", price);
                params.put("pay_plan_days", days);
                params.put("pay_plan_name", name);


                //     params.put("pay_plan_name", payPlanName);
                //   params.put("start_date", );
                // params.put("expiration_date", expirationDay);
             /*   if (paymentStatus != null) {
                    try {
                        params.put("payment_status", paymentStatus.getString("purchaseState"));
                    } catch (Exception e) {
                        Log.e(TAG, e.getMessage());
                    }
                }*/

                params.put("type", "android-playstore");
                params.put("order_id", purchase.getOrderId());
                params.put("purchase_token", purchase.getPurchaseToken());
                params.put("receipt", purchase.getOriginalJson());
                params.put("signature", purchase.getSignature());
                params.put("public_key", getString(R.string.public_key));

                Log.d(TAG, "params = " + params);
                return params;
            }
        };

        request.setRetryPolicy(new DefaultRetryPolicy(REQUEST_TIME_OUT,
                0,
                DefaultRetryPolicy.DEFAULT_BACKOFF_MULT));

        MySingleton.getInstance(this).addToRequestQueue(request);
    }
}
