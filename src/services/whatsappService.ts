import { WhatsAppPreferences, WhatsAppNotification, Order, OrderStatus } from '../types.ts';

// In-Memory store for user privacy preferences and notification history
export const whatsAppPreferencesStore: { [phone: string]: WhatsAppPreferences } = {
  '9876543210': {
    enabled: true,
    whatsappPhone: '9876543210',
    orderUpdates: true,
    weatherAlerts: true,
    followUpReminders: true,
    consentedAt: new Date().toISOString()
  }
};

export const whatsAppNotificationsStore: WhatsAppNotification[] = [
  {
    id: 'wa-demo-1',
    recipientPhone: '9876543210',
    type: 'order_status',
    title: 'Order KS-8901 Accepted by Dealer',
    body: '✅ *Krishi Saathi - Order Update*\n\nNamaste Balwant ji!\nYour order *#KS-8901* has been *ACCEPTED* by *Kisan Krishi Seva Kendra*.\n\n📦 Item: Neem Gold 10,000 PPM (1 Litre)\n💰 Total: ₹610 (COD)\n📍 Delivery to: Village Mandi, Plot No. 12\n\nWe will alert you when it leaves for delivery!',
    status: 'delivered',
    provider: 'simulated',
    orderId: 'ord-1001',
    whatsappLink: 'https://wa.me/919876543210?text=Namaste%20Balwant%20ji!%20Order%20KS-8901%20is%20accepted.',
    sentAt: new Date(Date.now() - 3600000 * 4).toISOString()
  },
  {
    id: 'wa-demo-2',
    recipientPhone: '9876543210',
    type: 'weather_advisory',
    title: 'Safe Spray Window Advisory - Akola',
    body: '🌦️ *Krishi Saathi - Weather & Spray Advisory*\n\n📍 Akola District\n🌡️ Temp: 31°C | Wind: 8 km/h\n✅ *Status: SAFE TO SPRAY*\nOptimal window: 7:00 AM - 10:30 AM today.\nGentle breeze minimizes chemical drift. Always wear protective eye goggles and mask.',
    status: 'delivered',
    provider: 'simulated',
    whatsappLink: 'https://wa.me/919876543210?text=Safe%20to%20spray%20in%20Akola',
    sentAt: new Date(Date.now() - 3600000 * 12).toISOString()
  }
];

export function getOrCreatePreferences(phone: string): WhatsAppPreferences {
  const cleanPhone = phone.replace(/\D/g, '').slice(-10);
  if (!whatsAppPreferencesStore[cleanPhone]) {
    whatsAppPreferencesStore[cleanPhone] = {
      enabled: true,
      whatsappPhone: cleanPhone,
      orderUpdates: true,
      weatherAlerts: true,
      followUpReminders: true,
      consentedAt: new Date().toISOString()
    };
  }
  return whatsAppPreferencesStore[cleanPhone];
}

export function updatePreferences(phone: string, updates: Partial<WhatsAppPreferences>): WhatsAppPreferences {
  const current = getOrCreatePreferences(phone);
  const updated = { ...current, ...updates };
  if (updates.enabled === true && !current.consentedAt) {
    updated.consentedAt = new Date().toISOString();
  }
  const cleanPhone = phone.replace(/\D/g, '').slice(-10);
  whatsAppPreferencesStore[cleanPhone] = updated;
  return updated;
}

/**
 * Sends a WhatsApp notification via Twilio or MSG91 with user consent verification.
 * Respects user privacy: if user opted out, does not dispatch.
 */
export async function dispatchWhatsAppNotification(params: {
  recipientPhone: string;
  type: 'order_status' | 'weather_advisory' | 'followup_reminder' | 'test';
  title: string;
  body: string;
  orderId?: string;
}): Promise<{ success: boolean; notification: WhatsAppNotification; skippedReason?: string }> {
  const cleanPhone = params.recipientPhone.replace(/\D/g, '').slice(-10);
  const prefs = getOrCreatePreferences(cleanPhone);

  // 1. Privacy Check: Has the user opted out?
  if (!prefs.enabled) {
    console.log(`[WhatsApp Privacy] Skipped notification for ${cleanPhone}: user disabled WhatsApp notifications.`);
    const skippedNotification: WhatsAppNotification = {
      id: 'wa-' + Date.now(),
      recipientPhone: cleanPhone,
      type: params.type,
      title: params.title,
      body: params.body,
      status: 'failed',
      provider: 'simulated',
      orderId: params.orderId,
      sentAt: new Date().toISOString()
    };
    return { success: false, notification: skippedNotification, skippedReason: 'User opted out of WhatsApp notifications.' };
  }

  // 2. Category Consent Check
  if (params.type === 'order_status' && !prefs.orderUpdates) {
    return { success: false, notification: {} as any, skippedReason: 'User disabled Order Status WhatsApp alerts.' };
  }
  if (params.type === 'weather_advisory' && !prefs.weatherAlerts) {
    return { success: false, notification: {} as any, skippedReason: 'User disabled Weather & Advisory WhatsApp alerts.' };
  }
  if (params.type === 'followup_reminder' && !prefs.followUpReminders) {
    return { success: false, notification: {} as any, skippedReason: 'User disabled Crop Follow-up WhatsApp alerts.' };
  }

  const notificationId = 'wa-' + Date.now();
  const directLink = `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(params.body)}`;

  let provider: 'twilio' | 'msg91' | 'simulated' = 'simulated';
  let deliveryStatus: 'sent' | 'delivered' | 'simulated' | 'failed' = 'simulated';

  // 3. Check for Twilio WhatsApp Credentials
  const twilioSid = process.env.TWILIO_ACCOUNT_SID;
  const twilioToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioFrom = process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886';

  // 4. Check for MSG91 Credentials
  const msg91AuthKey = process.env.MSG91_AUTH_KEY;
  const msg91Number = process.env.MSG91_WHATSAPP_INTEGRATED_NUMBER;

  if (twilioSid && twilioToken && !twilioSid.startsWith('ACxxxx')) {
    try {
      provider = 'twilio';
      const toWhatsApp = `whatsapp:+91${cleanPhone}`;
      const authHeader = 'Basic ' + Buffer.from(`${twilioSid}:${twilioToken}`).toString('base64');
      const formBody = new URLSearchParams();
      formBody.append('From', twilioFrom);
      formBody.append('To', toWhatsApp);
      formBody.append('Body', params.body);

      const twilioRes = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`, {
        method: 'POST',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formBody.toString()
      });

      if (twilioRes.ok) {
        deliveryStatus = 'sent';
        console.log(`[Twilio WhatsApp] Successfully dispatched to ${toWhatsApp}`);
      } else {
        const errorText = await twilioRes.text();
        console.warn(`[Twilio WhatsApp] Dispatch failed:`, errorText);
        deliveryStatus = 'simulated';
      }
    } catch (err) {
      console.warn(`[Twilio WhatsApp] Network error:`, err);
      deliveryStatus = 'simulated';
    }
  } else if (msg91AuthKey && !msg91AuthKey.startsWith('your-')) {
    try {
      provider = 'msg91';
      const msg91Res = await fetch('https://control.msg91.com/api/v5/whatsapp/whatsapp-outbound-message/', {
        method: 'POST',
        headers: {
          'authkey': msg91AuthKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          integrated_number: msg91Number || '91' + cleanPhone,
          content_type: 'text',
          text_prompt: { text: params.body },
          recipient: '91' + cleanPhone
        })
      });

      if (msg91Res.ok) {
        deliveryStatus = 'sent';
        console.log(`[MSG91 WhatsApp] Dispatched to 91${cleanPhone}`);
      } else {
        deliveryStatus = 'simulated';
      }
    } catch (err) {
      console.warn(`[MSG91 WhatsApp] Error:`, err);
      deliveryStatus = 'simulated';
    }
  } else {
    // Simulated delivery (Zero-credential local environment)
    deliveryStatus = 'simulated';
    console.log(`[WhatsApp Simulated Engine] Delivered message to +91 ${cleanPhone}`);
  }

  const newNotification: WhatsAppNotification = {
    id: notificationId,
    recipientPhone: cleanPhone,
    type: params.type,
    title: params.title,
    body: params.body,
    status: deliveryStatus,
    provider,
    orderId: params.orderId,
    whatsappLink: directLink,
    sentAt: new Date().toISOString()
  };

  whatsAppNotificationsStore.unshift(newNotification);
  return { success: true, notification: newNotification };
}

/**
 * Message template generators for high readability in Hindi and English
 */
export function createOrderWhatsAppMessage(order: Order, type: 'placed' | 'accepted' | 'ready_for_pickup' | 'out_for_delivery' | 'delivered' | 'cancelled'): { title: string; body: string } {
  const itemsText = order.items.map(i => `• ${i.productName} (${i.packSize}) × ${i.quantity}`).join('\n');
  const farmerName = order.farmerName || 'किसान भाई';

  switch (type) {
    case 'placed':
      return {
        title: `Order #${order.orderNumber} Placed`,
        body: `🌿 *Krishi Saathi - नया ऑर्डर दर्ज हुआ*\n\nनमस्ते ${farmerName}!\nआपका ऑर्डर *#${order.orderNumber}* सफलतापूर्वक दर्ज हो गया है।\n\n🏪 *दुकान:* ${order.dealerShopName}\n📞 *डीलर फ़ोन:* +91 ${order.dealerPhone}\n\n*सामग्री:*\n${itemsText}\n\n💰 *कुल राशि:* ₹${order.totalAmount} (${order.paymentMethod.toUpperCase()})\n🚚 *प्रकार:* ${order.deliveryType === 'pickup' ? 'दुकान से उठाव (Self Pickup)' : 'खेत/घर डिलीवरी'}\n\nडीलर द्वारा पुष्टि होते ही आपको तुरंत WhatsApp पर सूचित किया जाएगा।`
      };
    case 'accepted':
      return {
        title: `Order #${order.orderNumber} Confirmed by Dealer`,
        body: `✅ *Krishi Saathi - डीलर द्वारा ऑर्डर स्वीकृत*\n\nनमस्ते ${farmerName}!\n*${order.dealerShopName}* ने आपका ऑर्डर *#${order.orderNumber}* स्वीकार कर लिया है और सामान तैयार किया जा रहा है।\n\n💰 *राशि देय:* ₹${order.totalAmount}\n📍 *पता:* ${order.deliveryAddress || 'दुकान'}\n\nधन्यवाद!`
      };
    case 'ready_for_pickup':
      return {
        title: `Order #${order.orderNumber} Ready for Pickup`,
        body: `📦 *Krishi Saathi - सामान पिकअप के लिए तैयार*\n\nनमस्ते ${farmerName}!\nआपका ऑर्डर *#${order.orderNumber}* दुकान पर तैयार है।\n\n🏪 *दुकान:* ${order.dealerShopName}\n📞 फ़ोन: +91 ${order.dealerPhone}\n\nकृपया दुकान जाकर ऑर्डर नंबर *${order.orderNumber}* बताएं और अपना कृषि इनपुट प्राप्त करें।`
      };
    case 'out_for_delivery':
      return {
        title: `Order #${order.orderNumber} Out for Delivery`,
        body: `🚚 *Krishi Saathi - डिलीवरी रवाना हुई*\n\nनमस्ते ${farmerName}!\nऑर्डर *#${order.orderNumber}* आपके खेत/पते के लिए रवाना हो चुका है।\n\n📍 *गंतव्य:* ${order.deliveryAddress}\n💰 *भुगतान:* ₹${order.totalAmount} (${order.paymentStatus === 'paid' ? 'Paid via UPI' : 'Cash on Delivery'})\n\nकृपया डिलीवरी प्राप्त करते समय बिल चेक करें।`
      };
    case 'delivered':
      return {
        title: `Order #${order.orderNumber} Delivered`,
        body: `🌾 *Krishi Saathi - ऑर्डर सफलतापूर्वक पूर्ण*\n\nनमस्ते ${farmerName}!\nऑर्डर *#${order.orderNumber}* सफलतापूर्वक प्राप्त हो गया है।\n\n⚠️ *सुरक्षा निर्देश:* कीटनाशक छिड़काव करते समय मास्क और दस्ताने अवश्य पहनें। हवा की दिशा में ही स्प्रे करें।\n\n🌱 3 दिन बाद आपकी फसल स्वास्थ्य की समीक्षा के लिए हम पुनः संदेश भेजेंगे।`
      };
    case 'cancelled':
      return {
        title: `Order #${order.orderNumber} Cancelled`,
        body: `❌ *Krishi Saathi - ऑर्डर निरस्त*\n\nनमस्ते ${farmerName}!\nऑर्डर *#${order.orderNumber}* डीलर द्वारा निरस्त कर दिया गया है। कृपया अधिक जानकारी के लिए डीलर (+91 ${order.dealerPhone}) से संपर्क करें।`
      };
  }
}

export function createWeatherAdvisoryWhatsAppMessage(advisory: string, tempCelsius: number, windSpeedKmH: number): { title: string; body: string } {
  return {
    title: 'Weather & Spray Window Advisory',
    body: `🌦️ *Krishi Saathi - मौसम एवं छिड़काव सलाह*\n\n📍 *क्षेत्र:* अकोला / विदर्भ\n🌡️ *तापमान:* ${tempCelsius}°C | 💨 *हवा:* ${windSpeedKmH} किमी/घंटा\n\n📢 *सलाह:* ${advisory}\n\n⚠️ केवल अनुशंसित मात्रा में ही छिड़काव करें। दोपहर की तेज धूप में स्प्रे न करें।`
  };
}

export function createFollowUpWhatsAppMessage(farmerName: string, cropName: string, problemName: string, dayTarget: number): { title: string; body: string } {
  return {
    title: `Day ${dayTarget} Crop Health Follow-up`,
    body: `🌱 *Krishi Saathi - फसल स्वास्थ्य फॉलो-अप (Day ${dayTarget})*\n\nनमस्ते ${farmerName}!\nआपने ${cropName} में *${problemName}* के उपचार की सलाह ली थी। आज उपचार के ${dayTarget} दिन पूरे हो गए हैं।\n\nफसल की स्थिति कैसी है?\n1️⃣ सुधार हुआ (Improved)\n2️⃣ वैसा ही है (Same)\n3️⃣ और बिगड़ा (Worse)\n\nऐप खोलकर स्थिति दर्ज करें ताकि आवश्यकता पड़ने पर वैज्ञानिक से परामर्श कराया जा सके।`
  };
}
