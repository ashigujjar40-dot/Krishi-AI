var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_genai = require("@google/genai");
var import_dotenv = __toESM(require("dotenv"), 1);

// src/data/agriData.ts
var BANNED_PESTICIDES_INDIA = [
  "Endosulfan",
  "Monocrotophos (vegetables)",
  "Carbofuran",
  "Phorate",
  "Triazophos",
  "DDT",
  "Aldrin",
  "Chlordane",
  "Heptachlor",
  "Lindane",
  "Paraquat dichloride (prohibited in several states)",
  "Dichlorvos"
];
var REGISTERED_AGRI_PRODUCTS = [
  {
    id: "prod-neem-10000",
    name: "Neem Gold 10,000 PPM",
    brand: "GreenBio Agrotech",
    category: "bio_pesticide",
    activeIngredient: "Azadirachtin 1% (10,000 PPM) EC",
    packSize: "1 Litre",
    mrp: 650,
    cibrcRegistrationNumber: "CIR-89412/2018-Azadirachtin-941",
    isBannedInIndia: false,
    suitableCrops: ["Cotton", "Tomato", "Chilli", "Paddy", "Soybean", "Onion"],
    targetPestsDiseases: ["Whitefly", "Thrips", "Aphids", "Bollworm larvae (early instar)"],
    safetyWear: ["Cloth mask", "Rubber gloves", "Wash hands after spray"],
    imageUrl: "https://images.unsplash.com/photo-1592417817098-8f3d69102353?w=500&auto=format&fit=crop&q=80"
  },
  {
    id: "prod-tricho-viride",
    name: "Sanjiwani Trichoderma Viride 1% WP",
    brand: "Multiplex Biotech",
    category: "bio_pesticide",
    activeIngredient: "Trichoderma viride 1% WP (Bio-fungicide)",
    packSize: "1 Kg",
    mrp: 280,
    cibrcRegistrationNumber: "CIR-65123/2016-Trichoderma-201",
    isBannedInIndia: false,
    suitableCrops: ["Cotton", "Chilli", "Tomato", "Soybean", "Groundnut", "Potato"],
    targetPestsDiseases: ["Root rot", "Damping off", "Fusarium wilt", "Collar rot"],
    safetyWear: ["Dust mask", "Wash eyes if exposed"],
    imageUrl: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=500&auto=format&fit=crop&q=80"
  },
  {
    id: "prod-azoxy-mancozeb",
    name: "Custodia / Azoxystrobin + Mancozeb",
    brand: "ADAMA India",
    category: "fungicide",
    activeIngredient: "Azoxystrobin 8.3% + Mancozeb 66.7% WDG",
    packSize: "600 gm",
    mrp: 850,
    cibrcRegistrationNumber: "CIR-112344/2020-Azoxystrobin-189",
    isBannedInIndia: false,
    suitableCrops: ["Tomato", "Chilli", "Paddy", "Potato", "Onion"],
    targetPestsDiseases: ["Early Blight", "Late Blight", "Blast", "Dieback / Fruit rot", "Anthracnose"],
    safetyWear: ["Chemical mask", "Nitrile gloves", "Protective eyewear"],
    imageUrl: "https://images.unsplash.com/photo-1589923188900-85dae523342b?w=500&auto=format&fit=crop&q=80"
  },
  {
    id: "prod-coragen",
    name: "Coragen (Chlorantraniliprole 18.5% SC)",
    brand: "FMC India",
    category: "insecticide",
    activeIngredient: "Chlorantraniliprole 18.5% SC (Rynaxypyr)",
    packSize: "60 ml",
    mrp: 980,
    cibrcRegistrationNumber: "CIR-54910/2009-Chlorantraniliprole-101",
    isBannedInIndia: false,
    suitableCrops: ["Cotton", "Paddy", "Sugarcane", "Tomato", "Soybean", "Maize"],
    targetPestsDiseases: ["Pink Bollworm", "Stem Borer", "Fruit Borer", "Fall Armyworm", "Leaf Folder"],
    safetyWear: ["Full sleeve apron", "Face mask", "Gloves"],
    imageUrl: "https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?w=500&auto=format&fit=crop&q=80"
  },
  {
    id: "prod-emamectin",
    name: "Proclaim / Emamectin Benzoate 5% SG",
    brand: "Syngenta India",
    category: "insecticide",
    activeIngredient: "Emamectin Benzoate 5% SG",
    packSize: "100 gm",
    mrp: 440,
    cibrcRegistrationNumber: "CIR-48722/2007-Emamectin-88",
    isBannedInIndia: false,
    suitableCrops: ["Cotton", "Chilli", "Tomato", "Soybean", "Cabbage"],
    targetPestsDiseases: ["Helicoverpa", "Spodoptera", "Fruit Borer", "Thrips"],
    safetyWear: ["Face shield", "Gloves", "Wash clothes after spray"],
    imageUrl: "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?w=500&auto=format&fit=crop&q=80"
  },
  {
    id: "prod-hexaconazole",
    name: "Contaf Plus (Hexaconazole 5% SC)",
    brand: "Tata Rallis India",
    category: "fungicide",
    activeIngredient: "Hexaconazole 5% SC",
    packSize: "500 ml",
    mrp: 420,
    cibrcRegistrationNumber: "CIR-31902/2001-Hexaconazole-44",
    isBannedInIndia: false,
    suitableCrops: ["Paddy", "Groundnut", "Soybean", "Cotton", "Chilli"],
    targetPestsDiseases: ["Sheath Blight", "Tikka Leaf Spot", "Powdery Mildew", "Rust"],
    safetyWear: ["Cloth mask", "Rubber gloves"],
    imageUrl: "https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?w=500&auto=format&fit=crop&q=80"
  },
  {
    id: "prod-npk-191919",
    name: "Water Soluble NPK 19:19:19 + TE",
    brand: "IFFCO / MahaAgro",
    category: "fertilizer",
    activeIngredient: "Total Nitrogen 19%, P2O5 19%, K2O 19% with Micronutrients",
    packSize: "1 Kg",
    mrp: 195,
    cibrcRegistrationNumber: "FCO-Schedule-1-Grade-19",
    isBannedInIndia: false,
    suitableCrops: ["Cotton", "Paddy", "Wheat", "Tomato", "Chilli", "Soybean", "Onion"],
    targetPestsDiseases: ["General vegetative & foliar nutrient deficiency", "Stunted growth", "Yellowing"],
    safetyWear: ["Handle with dry hands"],
    imageUrl: "https://images.unsplash.com/photo-1585314062604-1a357de8b000?w=500&auto=format&fit=crop&q=80"
  }
];
var INITIAL_DEALER_STOCKS = [
  {
    id: "stock-1",
    dealerId: "dealer-101",
    dealerName: "Ramesh Patel",
    shopName: "Kisan Krishi Seva Kendra",
    phone: "9822012345",
    pincode: "444001",
    distanceKm: 2.4,
    productId: "prod-neem-10000",
    productName: "Neem Gold 10,000 PPM",
    brand: "GreenBio Agrotech",
    packSize: "1 Litre",
    price: 610,
    inStock: true,
    stockQuantity: 28,
    rating: 4.8,
    verifiedDealer: true
  },
  {
    id: "stock-2",
    dealerId: "dealer-101",
    dealerName: "Ramesh Patel",
    shopName: "Kisan Krishi Seva Kendra",
    phone: "9822012345",
    pincode: "444001",
    distanceKm: 2.4,
    productId: "prod-coragen",
    productName: "Coragen (Chlorantraniliprole 18.5% SC)",
    brand: "FMC India",
    packSize: "60 ml",
    price: 940,
    inStock: true,
    stockQuantity: 15,
    rating: 4.8,
    verifiedDealer: true
  },
  {
    id: "stock-3",
    dealerId: "dealer-102",
    dealerName: "Santosh Deshmukh",
    shopName: "Shree Balaji Agro Inputs & Fertilizers",
    phone: "9423145678",
    pincode: "444001",
    distanceKm: 3.8,
    productId: "prod-azoxy-mancozeb",
    productName: "Custodia / Azoxystrobin + Mancozeb",
    brand: "ADAMA India",
    packSize: "600 gm",
    price: 820,
    inStock: true,
    stockQuantity: 40,
    rating: 4.9,
    verifiedDealer: true
  },
  {
    id: "stock-4",
    dealerId: "dealer-102",
    dealerName: "Santosh Deshmukh",
    shopName: "Shree Balaji Agro Inputs & Fertilizers",
    phone: "9423145678",
    pincode: "444001",
    distanceKm: 3.8,
    productId: "prod-tricho-viride",
    productName: "Sanjiwani Trichoderma Viride 1% WP",
    brand: "Multiplex Biotech",
    packSize: "1 Kg",
    price: 260,
    inStock: true,
    stockQuantity: 35,
    rating: 4.9,
    verifiedDealer: true
  },
  {
    id: "stock-5",
    dealerId: "dealer-103",
    dealerName: "Venkatesh Rao",
    shopName: "Jai Kisan Seeds & Crop Protection",
    phone: "9848099887",
    pincode: "500001",
    distanceKm: 5.1,
    productId: "prod-emamectin",
    productName: "Proclaim / Emamectin Benzoate 5% SG",
    brand: "Syngenta India",
    packSize: "100 gm",
    price: 420,
    inStock: true,
    stockQuantity: 19,
    rating: 4.7,
    verifiedDealer: true
  },
  {
    id: "stock-6",
    dealerId: "dealer-103",
    dealerName: "Venkatesh Rao",
    shopName: "Jai Kisan Seeds & Crop Protection",
    phone: "9848099887",
    pincode: "500001",
    distanceKm: 5.1,
    productId: "prod-hexaconazole",
    productName: "Contaf Plus (Hexaconazole 5% SC)",
    brand: "Tata Rallis India",
    packSize: "500 ml",
    price: 395,
    inStock: true,
    stockQuantity: 22,
    rating: 4.7,
    verifiedDealer: true
  },
  {
    id: "stock-7",
    dealerId: "dealer-101",
    dealerName: "Ramesh Patel",
    shopName: "Kisan Krishi Seva Kendra",
    phone: "9822012345",
    pincode: "444001",
    distanceKm: 2.4,
    productId: "prod-npk-191919",
    productName: "Water Soluble NPK 19:19:19 + TE",
    brand: "IFFCO / MahaAgro",
    packSize: "1 Kg",
    price: 185,
    inStock: true,
    stockQuantity: 50,
    rating: 4.8,
    verifiedDealer: true
  }
];

// src/services/whatsappService.ts
var whatsAppPreferencesStore = {
  "9876543210": {
    enabled: true,
    whatsappPhone: "9876543210",
    orderUpdates: true,
    weatherAlerts: true,
    followUpReminders: true,
    consentedAt: (/* @__PURE__ */ new Date()).toISOString()
  }
};
var whatsAppNotificationsStore = [
  {
    id: "wa-demo-1",
    recipientPhone: "9876543210",
    type: "order_status",
    title: "Order KS-8901 Accepted by Dealer",
    body: "\u2705 *Krishi Saathi - Order Update*\n\nNamaste Balwant ji!\nYour order *#KS-8901* has been *ACCEPTED* by *Kisan Krishi Seva Kendra*.\n\n\u{1F4E6} Item: Neem Gold 10,000 PPM (1 Litre)\n\u{1F4B0} Total: \u20B9610 (COD)\n\u{1F4CD} Delivery to: Village Mandi, Plot No. 12\n\nWe will alert you when it leaves for delivery!",
    status: "delivered",
    provider: "simulated",
    orderId: "ord-1001",
    whatsappLink: "https://wa.me/919876543210?text=Namaste%20Balwant%20ji!%20Order%20KS-8901%20is%20accepted.",
    sentAt: new Date(Date.now() - 36e5 * 4).toISOString()
  },
  {
    id: "wa-demo-2",
    recipientPhone: "9876543210",
    type: "weather_advisory",
    title: "Safe Spray Window Advisory - Akola",
    body: "\u{1F326}\uFE0F *Krishi Saathi - Weather & Spray Advisory*\n\n\u{1F4CD} Akola District\n\u{1F321}\uFE0F Temp: 31\xB0C | Wind: 8 km/h\n\u2705 *Status: SAFE TO SPRAY*\nOptimal window: 7:00 AM - 10:30 AM today.\nGentle breeze minimizes chemical drift. Always wear protective eye goggles and mask.",
    status: "delivered",
    provider: "simulated",
    whatsappLink: "https://wa.me/919876543210?text=Safe%20to%20spray%20in%20Akola",
    sentAt: new Date(Date.now() - 36e5 * 12).toISOString()
  }
];
function getOrCreatePreferences(phone) {
  const cleanPhone = phone.replace(/\D/g, "").slice(-10);
  if (!whatsAppPreferencesStore[cleanPhone]) {
    whatsAppPreferencesStore[cleanPhone] = {
      enabled: true,
      whatsappPhone: cleanPhone,
      orderUpdates: true,
      weatherAlerts: true,
      followUpReminders: true,
      consentedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
  }
  return whatsAppPreferencesStore[cleanPhone];
}
function updatePreferences(phone, updates) {
  const current = getOrCreatePreferences(phone);
  const updated = { ...current, ...updates };
  if (updates.enabled === true && !current.consentedAt) {
    updated.consentedAt = (/* @__PURE__ */ new Date()).toISOString();
  }
  const cleanPhone = phone.replace(/\D/g, "").slice(-10);
  whatsAppPreferencesStore[cleanPhone] = updated;
  return updated;
}
async function dispatchWhatsAppNotification(params) {
  const cleanPhone = params.recipientPhone.replace(/\D/g, "").slice(-10);
  const prefs = getOrCreatePreferences(cleanPhone);
  if (!prefs.enabled) {
    console.log(`[WhatsApp Privacy] Skipped notification for ${cleanPhone}: user disabled WhatsApp notifications.`);
    const skippedNotification = {
      id: "wa-" + Date.now(),
      recipientPhone: cleanPhone,
      type: params.type,
      title: params.title,
      body: params.body,
      status: "failed",
      provider: "simulated",
      orderId: params.orderId,
      sentAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    return { success: false, notification: skippedNotification, skippedReason: "User opted out of WhatsApp notifications." };
  }
  if (params.type === "order_status" && !prefs.orderUpdates) {
    return { success: false, notification: {}, skippedReason: "User disabled Order Status WhatsApp alerts." };
  }
  if (params.type === "weather_advisory" && !prefs.weatherAlerts) {
    return { success: false, notification: {}, skippedReason: "User disabled Weather & Advisory WhatsApp alerts." };
  }
  if (params.type === "followup_reminder" && !prefs.followUpReminders) {
    return { success: false, notification: {}, skippedReason: "User disabled Crop Follow-up WhatsApp alerts." };
  }
  const notificationId = "wa-" + Date.now();
  const directLink = `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(params.body)}`;
  let provider = "simulated";
  let deliveryStatus = "simulated";
  const twilioSid = process.env.TWILIO_ACCOUNT_SID;
  const twilioToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioFrom = process.env.TWILIO_WHATSAPP_NUMBER || "whatsapp:+14155238886";
  const msg91AuthKey = process.env.MSG91_AUTH_KEY;
  const msg91Number = process.env.MSG91_WHATSAPP_INTEGRATED_NUMBER;
  if (twilioSid && twilioToken && !twilioSid.startsWith("ACxxxx")) {
    try {
      provider = "twilio";
      const toWhatsApp = `whatsapp:+91${cleanPhone}`;
      const authHeader = "Basic " + Buffer.from(`${twilioSid}:${twilioToken}`).toString("base64");
      const formBody = new URLSearchParams();
      formBody.append("From", twilioFrom);
      formBody.append("To", toWhatsApp);
      formBody.append("Body", params.body);
      const twilioRes = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`, {
        method: "POST",
        headers: {
          "Authorization": authHeader,
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: formBody.toString()
      });
      if (twilioRes.ok) {
        deliveryStatus = "sent";
        console.log(`[Twilio WhatsApp] Successfully dispatched to ${toWhatsApp}`);
      } else {
        const errorText = await twilioRes.text();
        console.warn(`[Twilio WhatsApp] Dispatch failed:`, errorText);
        deliveryStatus = "simulated";
      }
    } catch (err) {
      console.warn(`[Twilio WhatsApp] Network error:`, err);
      deliveryStatus = "simulated";
    }
  } else if (msg91AuthKey && !msg91AuthKey.startsWith("your-")) {
    try {
      provider = "msg91";
      const msg91Res = await fetch("https://control.msg91.com/api/v5/whatsapp/whatsapp-outbound-message/", {
        method: "POST",
        headers: {
          "authkey": msg91AuthKey,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          integrated_number: msg91Number || "91" + cleanPhone,
          content_type: "text",
          text_prompt: { text: params.body },
          recipient: "91" + cleanPhone
        })
      });
      if (msg91Res.ok) {
        deliveryStatus = "sent";
        console.log(`[MSG91 WhatsApp] Dispatched to 91${cleanPhone}`);
      } else {
        deliveryStatus = "simulated";
      }
    } catch (err) {
      console.warn(`[MSG91 WhatsApp] Error:`, err);
      deliveryStatus = "simulated";
    }
  } else {
    deliveryStatus = "simulated";
    console.log(`[WhatsApp Simulated Engine] Delivered message to +91 ${cleanPhone}`);
  }
  const newNotification = {
    id: notificationId,
    recipientPhone: cleanPhone,
    type: params.type,
    title: params.title,
    body: params.body,
    status: deliveryStatus,
    provider,
    orderId: params.orderId,
    whatsappLink: directLink,
    sentAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  whatsAppNotificationsStore.unshift(newNotification);
  return { success: true, notification: newNotification };
}
function createOrderWhatsAppMessage(order, type) {
  const itemsText = order.items.map((i) => `\u2022 ${i.productName} (${i.packSize}) \xD7 ${i.quantity}`).join("\n");
  const farmerName = order.farmerName || "\u0915\u093F\u0938\u093E\u0928 \u092D\u093E\u0908";
  switch (type) {
    case "placed":
      return {
        title: `Order #${order.orderNumber} Placed`,
        body: `\u{1F33F} *Krishi Saathi - \u0928\u092F\u093E \u0911\u0930\u094D\u0921\u0930 \u0926\u0930\u094D\u091C \u0939\u0941\u0906*

\u0928\u092E\u0938\u094D\u0924\u0947 ${farmerName}!
\u0906\u092A\u0915\u093E \u0911\u0930\u094D\u0921\u0930 *#${order.orderNumber}* \u0938\u092B\u0932\u0924\u093E\u092A\u0942\u0930\u094D\u0935\u0915 \u0926\u0930\u094D\u091C \u0939\u094B \u0917\u092F\u093E \u0939\u0948\u0964

\u{1F3EA} *\u0926\u0941\u0915\u093E\u0928:* ${order.dealerShopName}
\u{1F4DE} *\u0921\u0940\u0932\u0930 \u092B\u093C\u094B\u0928:* +91 ${order.dealerPhone}

*\u0938\u093E\u092E\u0917\u094D\u0930\u0940:*
${itemsText}

\u{1F4B0} *\u0915\u0941\u0932 \u0930\u093E\u0936\u093F:* \u20B9${order.totalAmount} (${order.paymentMethod.toUpperCase()})
\u{1F69A} *\u092A\u094D\u0930\u0915\u093E\u0930:* ${order.deliveryType === "pickup" ? "\u0926\u0941\u0915\u093E\u0928 \u0938\u0947 \u0909\u0920\u093E\u0935 (Self Pickup)" : "\u0916\u0947\u0924/\u0918\u0930 \u0921\u093F\u0932\u0940\u0935\u0930\u0940"}

\u0921\u0940\u0932\u0930 \u0926\u094D\u0935\u093E\u0930\u093E \u092A\u0941\u0937\u094D\u091F\u093F \u0939\u094B\u0924\u0947 \u0939\u0940 \u0906\u092A\u0915\u094B \u0924\u0941\u0930\u0902\u0924 WhatsApp \u092A\u0930 \u0938\u0942\u091A\u093F\u0924 \u0915\u093F\u092F\u093E \u091C\u093E\u090F\u0917\u093E\u0964`
      };
    case "accepted":
      return {
        title: `Order #${order.orderNumber} Confirmed by Dealer`,
        body: `\u2705 *Krishi Saathi - \u0921\u0940\u0932\u0930 \u0926\u094D\u0935\u093E\u0930\u093E \u0911\u0930\u094D\u0921\u0930 \u0938\u094D\u0935\u0940\u0915\u0943\u0924*

\u0928\u092E\u0938\u094D\u0924\u0947 ${farmerName}!
*${order.dealerShopName}* \u0928\u0947 \u0906\u092A\u0915\u093E \u0911\u0930\u094D\u0921\u0930 *#${order.orderNumber}* \u0938\u094D\u0935\u0940\u0915\u093E\u0930 \u0915\u0930 \u0932\u093F\u092F\u093E \u0939\u0948 \u0914\u0930 \u0938\u093E\u092E\u093E\u0928 \u0924\u0948\u092F\u093E\u0930 \u0915\u093F\u092F\u093E \u091C\u093E \u0930\u0939\u093E \u0939\u0948\u0964

\u{1F4B0} *\u0930\u093E\u0936\u093F \u0926\u0947\u092F:* \u20B9${order.totalAmount}
\u{1F4CD} *\u092A\u0924\u093E:* ${order.deliveryAddress || "\u0926\u0941\u0915\u093E\u0928"}

\u0927\u0928\u094D\u092F\u0935\u093E\u0926!`
      };
    case "ready_for_pickup":
      return {
        title: `Order #${order.orderNumber} Ready for Pickup`,
        body: `\u{1F4E6} *Krishi Saathi - \u0938\u093E\u092E\u093E\u0928 \u092A\u093F\u0915\u0905\u092A \u0915\u0947 \u0932\u093F\u090F \u0924\u0948\u092F\u093E\u0930*

\u0928\u092E\u0938\u094D\u0924\u0947 ${farmerName}!
\u0906\u092A\u0915\u093E \u0911\u0930\u094D\u0921\u0930 *#${order.orderNumber}* \u0926\u0941\u0915\u093E\u0928 \u092A\u0930 \u0924\u0948\u092F\u093E\u0930 \u0939\u0948\u0964

\u{1F3EA} *\u0926\u0941\u0915\u093E\u0928:* ${order.dealerShopName}
\u{1F4DE} \u092B\u093C\u094B\u0928: +91 ${order.dealerPhone}

\u0915\u0943\u092A\u092F\u093E \u0926\u0941\u0915\u093E\u0928 \u091C\u093E\u0915\u0930 \u0911\u0930\u094D\u0921\u0930 \u0928\u0902\u092C\u0930 *${order.orderNumber}* \u092C\u0924\u093E\u090F\u0902 \u0914\u0930 \u0905\u092A\u0928\u093E \u0915\u0943\u0937\u093F \u0907\u0928\u092A\u0941\u091F \u092A\u094D\u0930\u093E\u092A\u094D\u0924 \u0915\u0930\u0947\u0902\u0964`
      };
    case "out_for_delivery":
      return {
        title: `Order #${order.orderNumber} Out for Delivery`,
        body: `\u{1F69A} *Krishi Saathi - \u0921\u093F\u0932\u0940\u0935\u0930\u0940 \u0930\u0935\u093E\u0928\u093E \u0939\u0941\u0908*

\u0928\u092E\u0938\u094D\u0924\u0947 ${farmerName}!
\u0911\u0930\u094D\u0921\u0930 *#${order.orderNumber}* \u0906\u092A\u0915\u0947 \u0916\u0947\u0924/\u092A\u0924\u0947 \u0915\u0947 \u0932\u093F\u090F \u0930\u0935\u093E\u0928\u093E \u0939\u094B \u091A\u0941\u0915\u093E \u0939\u0948\u0964

\u{1F4CD} *\u0917\u0902\u0924\u0935\u094D\u092F:* ${order.deliveryAddress}
\u{1F4B0} *\u092D\u0941\u0917\u0924\u093E\u0928:* \u20B9${order.totalAmount} (${order.paymentStatus === "paid" ? "Paid via UPI" : "Cash on Delivery"})

\u0915\u0943\u092A\u092F\u093E \u0921\u093F\u0932\u0940\u0935\u0930\u0940 \u092A\u094D\u0930\u093E\u092A\u094D\u0924 \u0915\u0930\u0924\u0947 \u0938\u092E\u092F \u092C\u093F\u0932 \u091A\u0947\u0915 \u0915\u0930\u0947\u0902\u0964`
      };
    case "delivered":
      return {
        title: `Order #${order.orderNumber} Delivered`,
        body: `\u{1F33E} *Krishi Saathi - \u0911\u0930\u094D\u0921\u0930 \u0938\u092B\u0932\u0924\u093E\u092A\u0942\u0930\u094D\u0935\u0915 \u092A\u0942\u0930\u094D\u0923*

\u0928\u092E\u0938\u094D\u0924\u0947 ${farmerName}!
\u0911\u0930\u094D\u0921\u0930 *#${order.orderNumber}* \u0938\u092B\u0932\u0924\u093E\u092A\u0942\u0930\u094D\u0935\u0915 \u092A\u094D\u0930\u093E\u092A\u094D\u0924 \u0939\u094B \u0917\u092F\u093E \u0939\u0948\u0964

\u26A0\uFE0F *\u0938\u0941\u0930\u0915\u094D\u0937\u093E \u0928\u093F\u0930\u094D\u0926\u0947\u0936:* \u0915\u0940\u091F\u0928\u093E\u0936\u0915 \u091B\u093F\u0921\u093C\u0915\u093E\u0935 \u0915\u0930\u0924\u0947 \u0938\u092E\u092F \u092E\u093E\u0938\u094D\u0915 \u0914\u0930 \u0926\u0938\u094D\u0924\u093E\u0928\u0947 \u0905\u0935\u0936\u094D\u092F \u092A\u0939\u0928\u0947\u0902\u0964 \u0939\u0935\u093E \u0915\u0940 \u0926\u093F\u0936\u093E \u092E\u0947\u0902 \u0939\u0940 \u0938\u094D\u092A\u094D\u0930\u0947 \u0915\u0930\u0947\u0902\u0964

\u{1F331} 3 \u0926\u093F\u0928 \u092C\u093E\u0926 \u0906\u092A\u0915\u0940 \u092B\u0938\u0932 \u0938\u094D\u0935\u093E\u0938\u094D\u0925\u094D\u092F \u0915\u0940 \u0938\u092E\u0940\u0915\u094D\u0937\u093E \u0915\u0947 \u0932\u093F\u090F \u0939\u092E \u092A\u0941\u0928\u0903 \u0938\u0902\u0926\u0947\u0936 \u092D\u0947\u091C\u0947\u0902\u0917\u0947\u0964`
      };
    case "cancelled":
      return {
        title: `Order #${order.orderNumber} Cancelled`,
        body: `\u274C *Krishi Saathi - \u0911\u0930\u094D\u0921\u0930 \u0928\u093F\u0930\u0938\u094D\u0924*

\u0928\u092E\u0938\u094D\u0924\u0947 ${farmerName}!
\u0911\u0930\u094D\u0921\u0930 *#${order.orderNumber}* \u0921\u0940\u0932\u0930 \u0926\u094D\u0935\u093E\u0930\u093E \u0928\u093F\u0930\u0938\u094D\u0924 \u0915\u0930 \u0926\u093F\u092F\u093E \u0917\u092F\u093E \u0939\u0948\u0964 \u0915\u0943\u092A\u092F\u093E \u0905\u0927\u093F\u0915 \u091C\u093E\u0928\u0915\u093E\u0930\u0940 \u0915\u0947 \u0932\u093F\u090F \u0921\u0940\u0932\u0930 (+91 ${order.dealerPhone}) \u0938\u0947 \u0938\u0902\u092A\u0930\u094D\u0915 \u0915\u0930\u0947\u0902\u0964`
      };
  }
}
function createWeatherAdvisoryWhatsAppMessage(advisory, tempCelsius, windSpeedKmH) {
  return {
    title: "Weather & Spray Window Advisory",
    body: `\u{1F326}\uFE0F *Krishi Saathi - \u092E\u094C\u0938\u092E \u090F\u0935\u0902 \u091B\u093F\u0921\u093C\u0915\u093E\u0935 \u0938\u0932\u093E\u0939*

\u{1F4CD} *\u0915\u094D\u0937\u0947\u0924\u094D\u0930:* \u0905\u0915\u094B\u0932\u093E / \u0935\u093F\u0926\u0930\u094D\u092D
\u{1F321}\uFE0F *\u0924\u093E\u092A\u092E\u093E\u0928:* ${tempCelsius}\xB0C | \u{1F4A8} *\u0939\u0935\u093E:* ${windSpeedKmH} \u0915\u093F\u092E\u0940/\u0918\u0902\u091F\u093E

\u{1F4E2} *\u0938\u0932\u093E\u0939:* ${advisory}

\u26A0\uFE0F \u0915\u0947\u0935\u0932 \u0905\u0928\u0941\u0936\u0902\u0938\u093F\u0924 \u092E\u093E\u0924\u094D\u0930\u093E \u092E\u0947\u0902 \u0939\u0940 \u091B\u093F\u0921\u093C\u0915\u093E\u0935 \u0915\u0930\u0947\u0902\u0964 \u0926\u094B\u092A\u0939\u0930 \u0915\u0940 \u0924\u0947\u091C \u0927\u0942\u092A \u092E\u0947\u0902 \u0938\u094D\u092A\u094D\u0930\u0947 \u0928 \u0915\u0930\u0947\u0902\u0964`
  };
}

// server.ts
import_dotenv.default.config();
var app = (0, import_express.default)();
var PORT = 3e3;
app.use(import_express.default.json({ limit: "25mb" }));
var diagnosesStore = [
  {
    id: "diag-demo-1",
    farmerId: "farmer-101",
    farmerPhone: "9876543210",
    cropName: "Cotton",
    problemName: "Early Pink Bollworm Infestation",
    problemNameTranslated: "\u0917\u0941\u0932\u093E\u092C\u0940 \u0938\u0941\u0902\u0921\u0940 (\u092A\u093F\u0902\u0915 \u092C\u094B\u0932\u0935\u0930\u094D\u092E)",
    scientificName: "Pectinophora gossypiella",
    problemType: "pest",
    confidence: 89,
    severity: "moderate",
    symptomsObserved: [
      "Rosette flowers with petals twisted together",
      "Small entrance holes on tender green bolls",
      "Larva feeding inside the seeds/lint"
    ],
    imageUrls: ["https://images.unsplash.com/photo-1592417817098-8f3d69102353?w=500&auto=format&fit=crop&q=80"],
    treatments: [
      {
        type: "organic",
        title: "Pheromone Traps & Neem Spray",
        productName: "Neem Gold 10,000 PPM + Pheromone Lure",
        activeIngredient: "Azadirachtin 1% (10,000 PPM) EC",
        dosePerAcre: "400-500 ml in 200 Litres water. Install 5 pheromone traps per acre.",
        applicationTiming: "Early morning or dusk. Repeat after 7-10 days.",
        safetyPrecautions: ["Use cloth mask", "Spray with wind direction", "Avoid direct skin contact"],
        waitingPeriodDays: 3,
        cibrcRegistered: true,
        estimatedCostInr: 610
      },
      {
        type: "chemical",
        title: "Approved Insecticide Spray",
        productName: "Coragen (Chlorantraniliprole 18.5% SC)",
        activeIngredient: "Chlorantraniliprole 18.5% SC",
        dosePerAcre: "60 ml in 200 Litres water per acre",
        applicationTiming: "At initial flowering to boll formation stage.",
        safetyPrecautions: [
          "Wear full protective clothes, gloves and mask",
          "Do not spray against wind",
          "Do not graze livestock in field for 7 days"
        ],
        waitingPeriodDays: 14,
        cibrcRegistered: true,
        estimatedCostInr: 940
      }
    ],
    needsExpertReview: false,
    audioSummaryText: "\u0915\u092A\u093E\u0938 \u092E\u0947\u0902 \u0917\u0941\u0932\u093E\u092C\u0940 \u0938\u0941\u0902\u0921\u0940 \u0915\u0947 \u0936\u0941\u0930\u0941\u0906\u0924\u0940 \u0932\u0915\u094D\u0937\u0923 \u0939\u0948\u0902\u0964 \u092A\u0939\u0932\u0947 \u0928\u0940\u092E 10000 \u092A\u0940\u092A\u0940\u090F\u092E \u0915\u093E \u091B\u093F\u0921\u093C\u0915\u093E\u0935 \u0915\u0930\u0947\u0902 \u092F\u093E \u0915\u094B\u0930\u093E\u091C\u0928 60 \u092E\u093F\u0932\u0940 \u092A\u094D\u0930\u0924\u093F \u090F\u0915\u0921\u093C \u0921\u093E\u0932\u0947\u0902\u0964 3 \u0926\u093F\u0928 \u092C\u093E\u0926 \u0938\u094D\u0925\u093F\u0924\u093F \u091C\u093E\u0902\u091A\u0947\u0902\u0964",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1e3).toISOString()
  }
];
var followUpsStore = [
  {
    id: "fup-1",
    diagnosisId: "diag-demo-1",
    farmerId: "farmer-101",
    cropName: "Cotton",
    problemName: "Early Pink Bollworm Infestation",
    dayTarget: 3,
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1e3).toISOString().split("T")[0],
    status: "pending",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1e3).toISOString()
  }
];
var dealerStockStore = [...INITIAL_DEALER_STOCKS];
var ordersStore = [
  {
    id: "ord-1001",
    orderNumber: "KS-8901",
    farmerId: "farmer-101",
    farmerName: "Balwant Singh",
    farmerPhone: "9876543210",
    deliveryAddress: "Village Mandi, Plot No. 12, Dist Akola",
    pincode: "444001",
    dealerId: "dealer-101",
    dealerShopName: "Kisan Krishi Seva Kendra",
    dealerPhone: "9822012345",
    items: [
      {
        productId: "prod-neem-10000",
        productName: "Neem Gold 10,000 PPM",
        packSize: "1 Litre",
        unitPrice: 610,
        quantity: 1
      }
    ],
    totalAmount: 610,
    status: "accepted",
    deliveryType: "delivery",
    paymentMethod: "cod",
    paymentStatus: "cash_on_delivery",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1e3).toISOString(),
    whatsappNotified: true
  }
];
var farmFieldsStore = [
  {
    id: "field-1",
    name: "North Canal Field (\u0909\u0924\u094D\u0924\u0930 \u0936\u0947\u0924)",
    crop: "Cotton",
    areaAcres: 3.5,
    sowingDate: "2026-06-15",
    soilType: "Medium Black Clay",
    irrigationType: "drip",
    pincode: "444001",
    lastSprayDate: "2026-09-18"
  }
];
var genAIClient = null;
function getGenAI() {
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "MY_GEMINI_API_KEY") {
    return null;
  }
  if (!genAIClient) {
    genAIClient = new import_genai.GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return genAIClient;
}
app.get("/api/health", (req, res) => {
  const hasKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY");
  res.json({
    status: "ok",
    geminiConfigured: hasKey,
    time: (/* @__PURE__ */ new Date()).toISOString()
  });
});
app.post("/api/auth/send-otp", (req, res) => {
  const { phone } = req.body;
  if (!phone || phone.length < 10) {
    return res.status(400).json({ error: "Valid 10-digit mobile number required" });
  }
  res.json({
    success: true,
    message: `OTP sent successfully to +91 ${phone}`,
    testOtp: "4321"
  });
});
app.post("/api/auth/verify-otp", (req, res) => {
  const { phone, otp, role, name, pincode } = req.body;
  if (otp !== "4321" && otp !== "1234") {
    return res.status(400).json({ error: "Invalid OTP. For demo/testing use 4321" });
  }
  const user = {
    id: role === "dealer" ? "dealer-101" : role === "agronomist" ? "agro-101" : "farmer-101",
    phone,
    name: name || (role === "dealer" ? "Ramesh Patel" : role === "agronomist" ? "Dr. Sunita Sharma" : "Balwant Singh"),
    role: role || "farmer",
    language: "hi",
    pincode: pincode || "444001",
    shopName: role === "dealer" ? "Kisan Krishi Seva Kendra" : void 0
  };
  res.json({ success: true, user });
});
app.post("/api/diagnose", async (req, res) => {
  try {
    const { crop, symptoms, images, language = "hi", farmerPhone = "9876543210" } = req.body;
    const ai = getGenAI();
    if (ai) {
      try {
        const parts = [];
        if (Array.isArray(images) && images.length > 0) {
          for (const img of images.slice(0, 3)) {
            const match = img.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
            if (match) {
              parts.push({
                inlineData: {
                  mimeType: match[1],
                  data: match[2]
                }
              });
            }
          }
        }
        const promptText = `
You are an expert Indian Agronomist AI for "Krishi Saathi".
Analyze the provided crop leaf/plant images and/or farmer description for Indian agricultural conditions.

Input:
Crop: ${crop || "Unknown"}
Farmer's Reported Symptoms: ${symptoms || "Visual examination of uploaded photos"}
Preferred Language: ${language} (en=English, hi=Hindi, mr=Marathi, te=Telugu)

CRITICAL SAFETY & REGULATORY RULES:
1. STRICTLY RECOMMEND ONLY registered products under CIBRC (Central Insecticides Board & Registration Committee of India).
2. NEVER RECOMMEND BANNED or UNREGISTERED chemicals (Strictly Banned: Endosulfan, Monocrotophos, Carbofuran, Phorate, Triazophos, Paraquat, etc.).
3. Always suggest Organic/Cultural / Bio-control options first, followed by safe chemical options.
4. Include exact dosage per acre, application timing, waiting period (PHI in days before harvest), and safety PPE precautions.
5. If confidence is below 70%, set needsExpertReview = true and list follow-up clarifying questions.

Return STRICT JSON only matching this exact structure:
{
  "problemName": "Standard English Problem/Disease/Pest name",
  "problemNameTranslated": "Name in ${language} (e.g. Hindi/Marathi/Telugu script)",
  "scientificName": "Latin scientific name if applicable",
  "problemType": "disease" | "pest" | "nutrient_deficiency" | "healthy" | "unknown",
  "confidence": number (between 40 and 99),
  "severity": "mild" | "moderate" | "severe",
  "symptomsObserved": ["symptom 1", "symptom 2", "symptom 3"],
  "needsExpertReview": boolean,
  "expertQuestions": ["question 1", "question 2"] (if low confidence),
  "audioSummaryText": "Short, clear 2-3 sentence summary in ${language} suitable for reading aloud to the farmer",
  "treatments": [
    {
      "type": "organic",
      "title": "Organic / Bio-control Measure",
      "productName": "Commercial bio product name (e.g. Neem Gold 10,000 PPM / Trichoderma viride)",
      "activeIngredient": "Active biological ingredient & concentration",
      "dosePerAcre": "Dose per acre / water quantity",
      "applicationTiming": "Spray timing (early morning or evening)",
      "safetyPrecautions": ["PPE item 1", "PPE item 2"],
      "waitingPeriodDays": 1-3,
      "cibrcRegistered": true,
      "estimatedCostInr": number
    },
    {
      "type": "chemical",
      "title": "Approved CIBRC Chemical Control",
      "productName": "CIBRC registered brand name (e.g. Coragen / Custodia / Proclaim)",
      "activeIngredient": "Chemical active ingredient & formulation",
      "dosePerAcre": "Exact dosage per acre with water volume",
      "applicationTiming": "Timing & frequency",
      "safetyPrecautions": ["Wear mask", "Gloves", "Spray with wind direction"],
      "waitingPeriodDays": number,
      "cibrcRegistered": true,
      "estimatedCostInr": number
    }
  ]
}
`;
        parts.push({ text: promptText });
        const response = await ai.models.generateContent({
          model: "gemini-3.8-flash",
          contents: parts,
          config: {
            responseMimeType: "application/json"
          }
        });
        const rawText = response.text || "{}";
        const parsed = JSON.parse(rawText);
        const newDiagnosis = {
          id: "diag-" + Date.now(),
          farmerId: "farmer-101",
          farmerPhone,
          cropName: crop || "General Crop",
          problemName: parsed.problemName || "Identified Plant Condition",
          problemNameTranslated: parsed.problemNameTranslated || parsed.problemName,
          scientificName: parsed.scientificName,
          problemType: parsed.problemType || "disease",
          confidence: parsed.confidence || 85,
          severity: parsed.severity || "moderate",
          symptomsObserved: parsed.symptomsObserved || ["Leaf discoloration", "Wilting spots"],
          imageUrls: images && images.length > 0 ? images : ["https://images.unsplash.com/photo-1592417817098-8f3d69102353?w=500&auto=format&fit=crop&q=80"],
          treatments: parsed.treatments && parsed.treatments.length > 0 ? parsed.treatments : [
            {
              type: "organic",
              title: "Neem & Cultural Protection",
              productName: "Neem Gold 10,000 PPM",
              activeIngredient: "Azadirachtin 1% EC",
              dosePerAcre: "500 ml in 200 L water",
              applicationTiming: "Cool morning or dusk hours",
              safetyPrecautions: ["Wear face cloth", "Wash hands after use"],
              waitingPeriodDays: 3,
              cibrcRegistered: true,
              estimatedCostInr: 610
            }
          ],
          needsExpertReview: Boolean(parsed.needsExpertReview || parsed.confidence && parsed.confidence < 70),
          expertQuestions: parsed.expertQuestions,
          audioSummaryText: parsed.audioSummaryText,
          createdAt: (/* @__PURE__ */ new Date()).toISOString()
        };
        diagnosesStore.unshift(newDiagnosis);
        const d3Date = /* @__PURE__ */ new Date();
        d3Date.setDate(d3Date.getDate() + 3);
        const d7Date = /* @__PURE__ */ new Date();
        d7Date.setDate(d7Date.getDate() + 7);
        followUpsStore.push({
          id: "fup-" + Date.now() + "-3",
          diagnosisId: newDiagnosis.id,
          farmerId: newDiagnosis.farmerId,
          cropName: newDiagnosis.cropName,
          problemName: newDiagnosis.problemName,
          dayTarget: 3,
          dueDate: d3Date.toISOString().split("T")[0],
          status: "pending",
          createdAt: (/* @__PURE__ */ new Date()).toISOString()
        });
        followUpsStore.push({
          id: "fup-" + Date.now() + "-7",
          diagnosisId: newDiagnosis.id,
          farmerId: newDiagnosis.farmerId,
          cropName: newDiagnosis.cropName,
          problemName: newDiagnosis.problemName,
          dayTarget: 7,
          dueDate: d7Date.toISOString().split("T")[0],
          status: "pending",
          createdAt: (/* @__PURE__ */ new Date()).toISOString()
        });
        return res.json({ success: true, diagnosis: newDiagnosis });
      } catch (geminiError) {
        console.warn("Gemini API call warning, falling back to Agronomy Engine:", geminiError?.message || geminiError);
      }
    }
    const cropLower = (crop || "").toLowerCase();
    const symptomsLower = (symptoms || "").toLowerCase();
    let matchedProblem = "Early Leaf Spot & Blight";
    let matchedProblemHi = "\u092A\u0924\u094D\u0924\u093F\u092F\u094B\u0902 \u092A\u0930 \u0927\u092C\u094D\u092C\u0947 \u0914\u0930 \u091D\u0941\u0932\u0938\u093E";
    let matchedProblemMr = "\u092A\u093E\u0928\u093E\u0935\u0930\u0940\u0932 \u0915\u0930\u092A\u093E \u0906\u0923\u093F \u0920\u093F\u092A\u0915\u0947";
    let matchedProblemTe = "\u0C06\u0C15\u0C41 \u0C2E\u0C1A\u0C4D\u0C1A \u0C2E\u0C30\u0C3F\u0C2F\u0C41 \u0C24\u0C46\u0C17\u0C41\u0C32\u0C41";
    let matchedType = "disease";
    let severity = "moderate";
    let confidence = 87;
    if (cropLower.includes("cotton") || symptomsLower.includes("bollworm") || symptomsLower.includes("sundi") || symptomsLower.includes("flower")) {
      matchedProblem = "Pink Bollworm & Sucking Pest Complex";
      matchedProblemHi = "\u0917\u0941\u0932\u093E\u092C\u0940 \u0938\u0941\u0902\u0921\u0940 \u0935 \u0930\u0938 \u091A\u0942\u0938\u0915 \u0915\u0940\u091F";
      matchedProblemMr = "\u0917\u0941\u0932\u093E\u092C\u0940 \u092C\u094B\u0902\u0921\u0905\u0933\u0940 \u0935 \u0930\u0938\u0936\u094B\u0937\u0915 \u0915\u093F\u0921\u0940";
      matchedProblemTe = "\u0C17\u0C41\u0C32\u0C3E\u0C2C\u0C40 \u0C30\u0C02\u0C17\u0C41 \u0C15\u0C3E\u0C2F \u0C24\u0C4A\u0C32\u0C3F\u0C1A\u0C47 \u0C2A\u0C41\u0C30\u0C41\u0C17\u0C41";
      matchedType = "pest";
      severity = "moderate";
      confidence = 91;
    } else if (cropLower.includes("tomato") || symptomsLower.includes("rot") || symptomsLower.includes("blight")) {
      matchedProblem = "Early Blight & Fruit Rot (Alternaria solani)";
      matchedProblemHi = "\u091F\u092E\u093E\u091F\u0930 \u0915\u093E \u0905\u0917\u0947\u0924\u0940 \u091D\u0941\u0932\u0938\u093E \u0914\u0930 \u092B\u0932 \u0938\u0921\u093C\u0928";
      matchedProblemMr = "\u091F\u094B\u092E\u0945\u091F\u094B\u0935\u0930\u0940\u0932 \u0932\u0935\u0915\u0930 \u092F\u0947\u0923\u093E\u0930\u093E \u0915\u0930\u092A\u093E";
      matchedProblemTe = "\u0C1F\u0C2E\u0C4B\u0C1F\u0C3E \u0C2E\u0C41\u0C02\u0C26\u0C38\u0C4D\u0C24\u0C41 \u0C0E\u0C02\u0C21\u0C41 \u0C24\u0C46\u0C17\u0C41\u0C32\u0C41";
      matchedType = "disease";
      severity = "moderate";
      confidence = 88;
    } else if (symptomsLower.includes("yellow") || symptomsLower.includes("\u092A\u0940\u0932\u093E") || symptomsLower.includes("\u0935\u093E\u0922")) {
      matchedProblem = "Nitrogen & Zinc Deficiency Chlorosis";
      matchedProblemHi = "\u0928\u093E\u0907\u091F\u094D\u0930\u094B\u091C\u0928 \u0935 \u091C\u093F\u0902\u0915 \u0915\u0940 \u0915\u092E\u0940 (\u092A\u0940\u0932\u093E\u092A\u0928)";
      matchedProblemMr = "\u0928\u0924\u094D\u0930 \u0935 \u091C\u0938\u094D\u0924 \u091A\u0940 \u0915\u092E\u0924\u0930\u0924\u093E";
      matchedProblemTe = "\u0C28\u0C24\u0C4D\u0C30\u0C1C\u0C28\u0C3F & \u0C1C\u0C3F\u0C02\u0C15\u0C4D \u0C32\u0C4B\u0C2A\u0C02";
      matchedType = "nutrient_deficiency";
      severity = "mild";
      confidence = 84;
    }
    let translatedName = matchedProblemHi;
    if (language === "mr") translatedName = matchedProblemMr;
    if (language === "te") translatedName = matchedProblemTe;
    if (language === "en") translatedName = matchedProblem;
    const fallbackDiagnosis = {
      id: "diag-" + Date.now(),
      farmerId: "farmer-101",
      farmerPhone,
      cropName: crop || "General Crop",
      problemName: matchedProblem,
      problemNameTranslated: translatedName,
      scientificName: matchedType === "pest" ? "Pectinophora gossypiella" : "Alternaria solani",
      problemType: matchedType,
      confidence,
      severity,
      symptomsObserved: [
        "Concentric brown circular rings on foliage",
        "Chlorotic yellow halo surrounding affected tissue",
        "Stunted vigor on lower canopy leaves"
      ],
      imageUrls: images && images.length > 0 ? images : ["https://images.unsplash.com/photo-1592417817098-8f3d69102353?w=500&auto=format&fit=crop&q=80"],
      treatments: [
        {
          type: "organic",
          title: "Neem Bio-pesticide + Trichoderma",
          productName: "Neem Gold 10,000 PPM",
          activeIngredient: "Azadirachtin 1% (10,000 PPM) EC",
          dosePerAcre: "400-500 ml in 200 Litres water",
          applicationTiming: "Spraying during morning 7-10 AM or dusk 4-6 PM",
          safetyPrecautions: ["Wear standard cloth mask", "Wash hands and face with soap"],
          waitingPeriodDays: 3,
          cibrcRegistered: true,
          estimatedCostInr: 610
        },
        {
          type: "chemical",
          title: "CIBRC Registered Fungicide Spray",
          productName: "Custodia (Azoxystrobin + Mancozeb)",
          activeIngredient: "Azoxystrobin 8.3% + Mancozeb 66.7% WDG",
          dosePerAcre: "600 gm per acre in 200 Litres clean water",
          applicationTiming: "At first sign of spread. Ensure underside of leaves is covered.",
          safetyPrecautions: [
            "Wear protective mask and rubber gloves",
            "Do not spray against the direction of wind",
            "Keep away from apiaries and water reservoirs"
          ],
          waitingPeriodDays: 10,
          cibrcRegistered: true,
          estimatedCostInr: 820
        }
      ],
      needsExpertReview: false,
      audioSummaryText: language === "hi" ? `\u0906\u092A\u0915\u0940 ${crop || "\u092B\u0938\u0932"} \u092E\u0947\u0902 ${translatedName} \u0915\u0940 \u092A\u0939\u091A\u093E\u0928 \u0939\u0941\u0908 \u0939\u0948\u0964 \u092A\u0939\u0932\u0947 \u0928\u0940\u092E 10000 \u092A\u0940\u092A\u0940\u090F\u092E \u0915\u093E \u091B\u093F\u0921\u093C\u0915\u093E\u0935 \u0915\u0930\u0947\u0902\u0964 \u092F\u0926\u093F \u0938\u092E\u0938\u094D\u092F\u093E \u0905\u0927\u093F\u0915 \u0939\u0948 \u0924\u094B \u0915\u0938\u094D\u091F\u094B\u0921\u093F\u092F\u093E 600 \u0917\u094D\u0930\u093E\u092E \u092A\u094D\u0930\u0924\u093F \u090F\u0915\u0921\u093C \u0915\u093E \u0907\u0938\u094D\u0924\u0947\u092E\u093E\u0932 \u0915\u0930\u0947\u0902\u0964` : `Identified ${matchedProblem} on your ${crop || "crop"}. Recommended to start with Neem Gold 10,000 PPM bio spray, followed by approved CIBRC fungicide if spreading.`,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    diagnosesStore.unshift(fallbackDiagnosis);
    const d3 = /* @__PURE__ */ new Date();
    d3.setDate(d3.getDate() + 3);
    followUpsStore.push({
      id: "fup-" + Date.now() + "-3",
      diagnosisId: fallbackDiagnosis.id,
      farmerId: "farmer-101",
      cropName: fallbackDiagnosis.cropName,
      problemName: fallbackDiagnosis.problemName,
      dayTarget: 3,
      dueDate: d3.toISOString().split("T")[0],
      status: "pending",
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    });
    res.json({ success: true, diagnosis: fallbackDiagnosis });
  } catch (error) {
    console.error("Diagnosis error:", error);
    res.status(500).json({ error: "Diagnosis processing failed: " + error.message });
  }
});
app.get("/api/diagnoses", (req, res) => {
  const { farmerId } = req.query;
  if (farmerId) {
    return res.json(diagnosesStore.filter((d) => d.farmerId === farmerId));
  }
  res.json(diagnosesStore);
});
app.get("/api/dealers", (req, res) => {
  const { pincode, productId } = req.query;
  let list = [...dealerStockStore];
  if (productId) {
    list = list.filter((item) => item.productId === productId);
  }
  res.json(list);
});
app.patch("/api/inventory/:id", (req, res) => {
  const { id } = req.params;
  const { price, inStock, stockQuantity } = req.body;
  const item = dealerStockStore.find((s) => s.id === id);
  if (!item) {
    return res.status(404).json({ error: "Stock item not found" });
  }
  if (price !== void 0) item.price = Number(price);
  if (inStock !== void 0) item.inStock = Boolean(inStock);
  if (stockQuantity !== void 0) item.stockQuantity = Number(stockQuantity);
  res.json({ success: true, item });
});
app.get("/api/orders", (req, res) => {
  const { farmerId, dealerId } = req.query;
  if (dealerId) {
    return res.json(ordersStore.filter((o) => o.dealerId === dealerId));
  }
  if (farmerId) {
    return res.json(ordersStore.filter((o) => o.farmerId === farmerId));
  }
  res.json(ordersStore);
});
app.post("/api/orders", (req, res) => {
  const {
    farmerId = "farmer-101",
    farmerName = "Balwant Singh",
    farmerPhone = "9876543210",
    deliveryAddress = "Village Farm, Plot 12",
    pincode = "444001",
    dealerId,
    dealerShopName,
    dealerPhone,
    items,
    deliveryType = "pickup",
    paymentMethod = "cod",
    diagnosisId
  } = req.body;
  if (!items || items.length === 0) {
    return res.status(400).json({ error: "Cart is empty" });
  }
  const totalAmount = items.reduce((acc, cur) => acc + cur.unitPrice * cur.quantity, 0);
  const newOrder = {
    id: "ord-" + Date.now(),
    orderNumber: "KS-" + Math.floor(1e3 + Math.random() * 9e3),
    farmerId,
    farmerName,
    farmerPhone,
    deliveryAddress,
    pincode,
    dealerId: dealerId || "dealer-101",
    dealerShopName: dealerShopName || "Kisan Krishi Seva Kendra",
    dealerPhone: dealerPhone || "9822012345",
    items,
    totalAmount,
    status: "pending",
    deliveryType,
    paymentMethod,
    paymentStatus: paymentMethod === "upi" ? "paid" : "cash_on_delivery",
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    diagnosisId,
    whatsappNotified: true
  };
  ordersStore.unshift(newOrder);
  for (const it of items) {
    const stockItem = dealerStockStore.find((s) => s.productId === it.productId && s.dealerId === newOrder.dealerId);
    if (stockItem) {
      stockItem.stockQuantity = Math.max(0, stockItem.stockQuantity - it.quantity);
      if (stockItem.stockQuantity === 0) {
        stockItem.inStock = false;
      }
    }
  }
  const orderMsg = createOrderWhatsAppMessage(newOrder, "placed");
  dispatchWhatsAppNotification({
    recipientPhone: newOrder.farmerPhone,
    type: "order_status",
    title: orderMsg.title,
    body: orderMsg.body,
    orderId: newOrder.id
  }).catch((err) => console.warn("WhatsApp dispatch warning:", err));
  res.json({ success: true, order: newOrder });
});
app.patch("/api/orders/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const order = ordersStore.find((o) => o.id === id);
  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }
  order.status = status;
  if (["accepted", "ready_for_pickup", "out_for_delivery", "delivered", "cancelled"].includes(status)) {
    const statusMsg = createOrderWhatsAppMessage(order, status);
    await dispatchWhatsAppNotification({
      recipientPhone: order.farmerPhone,
      type: "order_status",
      title: statusMsg.title,
      body: statusMsg.body,
      orderId: order.id
    }).catch((err) => console.warn("WhatsApp status dispatch error:", err));
  }
  res.json({ success: true, order });
});
app.get("/api/follow-ups", (req, res) => {
  const { farmerId, escalatedOnly } = req.query;
  let records = [...followUpsStore];
  if (farmerId) {
    records = records.filter((f) => f.farmerId === farmerId);
  }
  if (escalatedOnly === "true") {
    records = records.filter((f) => f.status === "escalated");
  }
  res.json(records);
});
app.patch("/api/follow-ups/:id", (req, res) => {
  const { id } = req.params;
  const { outcome, notes, newImageUrl } = req.body;
  const fup = followUpsStore.find((f) => f.id === id);
  if (!fup) {
    return res.status(404).json({ error: "Follow-up not found" });
  }
  fup.outcome = outcome;
  fup.notes = notes;
  if (newImageUrl) fup.newImageUrl = newImageUrl;
  fup.status = outcome === "worse" ? "escalated" : "completed";
  if (outcome === "worse") {
    fup.agronomistNotes = "High Priority: Condition worsened after Day " + fup.dayTarget + ". Assigned to Dr. Sunita Sharma (Senior Agronomist).";
  }
  res.json({ success: true, followUp: fup });
});
app.get("/api/farm-profile", (req, res) => {
  res.json(farmFieldsStore);
});
app.post("/api/farm-profile", (req, res) => {
  const { name, crop, areaAcres, sowingDate, soilType, irrigationType, pincode } = req.body;
  const newField = {
    id: "field-" + Date.now(),
    name: name || "Main Crop Plot",
    crop: crop || "Cotton",
    areaAcres: Number(areaAcres) || 2,
    sowingDate: sowingDate || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
    soilType: soilType || "Black Cotton Soil",
    irrigationType: irrigationType || "drip",
    pincode: pincode || "444001",
    lastSprayDate: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
  };
  farmFieldsStore.push(newField);
  res.json({ success: true, field: newField });
});
app.get("/api/weather", (req, res) => {
  const weather = {
    location: "Akola / Vidarbha District (MH)",
    tempCelsius: 31,
    condition: "Partly Cloudy with Mild Breeze",
    humidityPercent: 62,
    rainProbabilityPercent: 15,
    windSpeedKmH: 8,
    sprayAdvisory: "Safe to spray today between 7:00 AM - 10:30 AM or 4:30 PM - 6:30 PM. Wind speed is gentle (8 km/h).",
    sprayFeasible: true
  };
  res.json(weather);
});
app.get("/api/admin/overview", (req, res) => {
  res.json({
    totalDiagnoses: diagnosesStore.length,
    escalatedCases: followUpsStore.filter((f) => f.status === "escalated").length,
    activeDealers: 3,
    totalOrders: ordersStore.length,
    registeredProductsCount: REGISTERED_AGRI_PRODUCTS.length,
    bannedPesticidesBlocked: BANNED_PESTICIDES_INDIA.length
  });
});
app.get("/api/whatsapp/preferences", (req, res) => {
  const phone = req.query.phone || "9876543210";
  const prefs = getOrCreatePreferences(phone);
  res.json(prefs);
});
app.post("/api/whatsapp/preferences", (req, res) => {
  const { phone = "9876543210", enabled, whatsappPhone, orderUpdates, weatherAlerts, followUpReminders } = req.body;
  const updated = updatePreferences(phone, {
    ...enabled !== void 0 && { enabled },
    ...whatsappPhone !== void 0 && { whatsappPhone },
    ...orderUpdates !== void 0 && { orderUpdates },
    ...weatherAlerts !== void 0 && { weatherAlerts },
    ...followUpReminders !== void 0 && { followUpReminders }
  });
  res.json({ success: true, preferences: updated });
});
app.get("/api/whatsapp/notifications", (req, res) => {
  const phone = req.query.phone || "9876543210";
  const cleanPhone = phone.replace(/\D/g, "").slice(-10);
  const userNotifications = whatsAppNotificationsStore.filter((n) => n.recipientPhone === cleanPhone);
  res.json(userNotifications);
});
app.post("/api/whatsapp/send-test", async (req, res) => {
  const { phone = "9876543210", customNote } = req.body;
  const cleanPhone = phone.replace(/\D/g, "").slice(-10);
  const testBody = `\u{1F33E} *Krishi Saathi WhatsApp Alert Service*

Namaste Farmer!
Your WhatsApp notification integration is active and verified.

\u2022 Order status tracking: \u2705 Active
\u2022 Weather & Spray alerts: \u2705 Active
\u2022 Day 3/7 Follow-up reminders: \u2705 Active

${customNote ? `Note: ${customNote}

` : ""}You can modify your notification preferences or opt-out at any time from your Farm Profile.`;
  const result = await dispatchWhatsAppNotification({
    recipientPhone: cleanPhone,
    type: "test",
    title: "WhatsApp Notification Setup Verified",
    body: testBody
  });
  res.json(result);
});
app.post("/api/whatsapp/broadcast-advisory", async (req, res) => {
  const { phone = "9876543210", advisory = "Safe to spray today between 7:00 AM - 10:30 AM." } = req.body;
  const cleanPhone = phone.replace(/\D/g, "").slice(-10);
  const advisoryMsg = createWeatherAdvisoryWhatsAppMessage(advisory, 31, 8);
  const result = await dispatchWhatsAppNotification({
    recipientPhone: cleanPhone,
    type: "weather_advisory",
    title: advisoryMsg.title,
    body: advisoryMsg.body
  });
  res.json(result);
});
app.get("/api/download-apk", (req, res) => {
  const apkPath = import_path.default.join(process.cwd(), "public", "kisan-mitra.apk");
  res.download(apkPath, "kisan-mitra.apk", (err) => {
    if (err) {
      console.error("Error downloading APK:", err);
      if (!res.headersSent) {
        res.status(404).send("APK file not found or still generating.");
      }
    }
  });
});
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Krishi Saathi server running on port ${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
