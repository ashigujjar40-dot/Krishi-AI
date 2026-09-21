# Kisan Mitra (किसान मित्र) - Native Android APK Build & Installation Guide

यह गाइड आपके **Kisan Mitra AI** वेब प्रोजेक्ट को **Complete Native Android Application** में बदलने, फ़िजिकल एंड्रॉइड फ़ोन पर इनस्टॉल करने और किसी भी बिल्ड एरर को खुद ठीक (troubleshoot & fix) करने के लिए तैयार की गई है।

---

## 📱 प्रोजेक्ट में पहले से तैयार किया गया Native Android सेटअप

आपके प्रोजेक्ट में **Capacitor Android Native Layer** पूरी तरह इंटीग्रेट और सिंक कर दी गई है:
- **Android Root Directory:** `/android` (प्योर Gradle-बेस्ड Android Studio प्रोजेक्ट)
- **Application ID:** `com.kisanmitra.app`
- **App Name:** `Kisan Mitra`
- **Native Permissions Added:**
  - `CAMERA` (फसल रोग स्कैनिंग)
  - `RECORD_AUDIO` & `MODIFY_AUDIO_SETTINGS` (AI वॉइस एडवाइजर)
  - `ACCESS_FINE_LOCATION` & `ACCESS_COARSE_LOCATION` (GPS खेत मैपिंग व स्थानीय मौसम)
  - `INTERNET` & `usesCleartextTraffic="true"` (API सर्वर कनेक्टिविटी)
- **Auto Cloud Build:** `.github/workflows/android-build.yml` (GitHub Actions द्वारा बिना PC के सीधा APK जनरेट करने के लिए)

---

## 🚀 मेथड 1: Android Studio के जरिए Physical Device पर चलाना या APK बनाना (अनुशंसित)

### चरण 1: कोड डाउनलोड या एक्सपोर्ट करें
1. AI Studio के टॉप-राइट मेनू से **Export to GitHub** करें या **Download ZIP** करें।
2. फ़ोल्डर को अपने कंप्यूटर पर अनजिप (Unpack) करें।

### चरण 2: Web Assets बिल्ड करें
अपने टर्मिनल में प्रोजेक्ट फ़ोल्डर खोलें और रन करें:
```bash
npm install
npm run build
npx cap sync android
```

### चरण 3: Android Studio में खोलें
```bash
npx cap open android
```
*(या Android Studio खोलकर `Open Existing Project` में जाकर प्रोजेक्ट का `android/` फ़ोल्डर चुनें)*

### चरण 4: APK जनरेट करें (2 तरीके)
1. **सीधा फ़िजिकल फ़ोन पर इनस्टॉल करने के लिए:**
   - अपने एंड्रॉइड फ़ोन में **Settings > Developer Options > USB Debugging** चालू करें।
   - फ़ोन को USB केबल से PC से कनेक्ट करें।
   - Android Studio के टॉप बार में अपना फ़ोन सेलेक्ट करें और हरे रंग का **▶ Run ('app')** बटन दबाएं।
2. **शेयर करने योग्य `.apk` फ़ाइल निकालने के लिए:**
   - Android Studio के टॉप मेनू में जाएं: **Build > Build Bundle(s) / APK(s) > Build APK(s)**
   - कुछ ही पलों में नीचे नोटिफिकेशन आएगा: *APK(s) generated successfully*.
   - **locate** पर क्लिक करें। आपका `app-debug.apk` तैयार मिलेगा जिसे आप WhatsApp या Google Drive से किसी भी फ़ोन में भेजकर इनस्टॉल कर सकते हैं।

---

## ⚡ मेथड 2: बिना Android Studio के सीधा Terminal / Command Line से APK बिल्ड करना

यदि आपके कंप्यूटर पर Android SDK और Java JDK 17 इनस्टॉल हैं, तो आप बिना भारी Android Studio खोले 1 मिनट में APK बना सकते हैं:

### Windows (PowerShell / CMD):
```powershell
npm run build
npx cap sync android
cd android
.\gradlew.bat assembleDebug
```

### macOS / Linux:
```bash
npm run build
npx cap sync android
cd android
chmod +x gradlew
./gradlew assembleDebug
```

**बिल्ड पूरा होने पर APK यहाँ मिलेगा:**
📁 `android/app/build/outputs/apk/debug/app-debug.apk`

---

## ☁️ मेथड 3: बिना भारी कंप्यूटर के Free Cloud APK जनरेट करना (GitHub Actions)

यदि आपके पास हाई-एंड लैपटॉप या Android Studio नहीं है:
1. इस प्रोजेक्ट को अपने **GitHub** अकाउंट पर पुश (Push) करें।
2. आपके प्रोजेक्ट में पहले से `.github/workflows/android-build.yml` मौजूद है।
3. GitHub रिपॉजिटरी में **Actions** टैब पर जाएं।
4. **"Generate Kisan Mitra Android APK"** वर्कफ़्लो अपने आप रन होगा।
5. रन पूरा होने के बाद **Artifacts** सेक्शन में जाएं और **Kisan-Mitra-Debug-APK** पर क्लिक करके तैयार `.apk` डाउनलोड कर लें!

---

## 📲 मेथड 4: Physical Android Device पर Instant 1-Tap PWA इनस्टॉल (बिना किसी बिल्ड के)

Kisan Mitra में PWA (Progressive Web App) सपोर्ट पहले से मौजूद है:
1. अपने फ़ोन के **Google Chrome** में ऐप की लाइव URL (`https://ais-dev-...` या आपकी डोमेन) खोलें।
2. ऐप के हेडर में **"Install App"** बटन पर टैप करें या Chrome के 3-डॉट्स मेनू पर क्लिक करके **"Add to Home screen / Install app"** चुनें।
3. ऐप आपके फ़ोन के ऐप-ड्रॉअर में एक असली नेटिव ऐप आइकन की तरह इनस्टॉल हो जाएगी और फ़ुलस्क्रीन चलेगी।

---

## 🛠️ सामान्य समस्याएं (Common Build / APK Errors) और उन्हें खुद Fix करने के उपाय

### 🔴 समस्या 1: `SDK location not found. Define location with sdk.dir in local.properties`
- **कारण:** Gradle को नहीं पता कि आपके कंप्यूटर पर Android SDK कहाँ सेव है।
- **समाधान:**
  `android/` फ़ोल्डर के अंदर एक फ़ाइल बनाएं जिसका नाम रखें `local.properties`:
  - **Windows के लिए:**
    ```properties
    sdk.dir=C:\\Users\\YOUR_USERNAME\\AppData\\Local\\Android\\Sdk
    ```
  - **macOS के लिए:**
    ```properties
    sdk.dir=/Users/YOUR_USERNAME/Library/Android/sdk
    ```
  - **Linux के लिए:**
    ```properties
    sdk.dir=/home/YOUR_USERNAME/Android/Sdk
    ```

---

### 🔴 समस्या 2: `Unsupported class file major version` या `Java version mismatch`
- **कारण:** आपके सिस्टम का Java JDK वर्जन Gradle 8 के साथ कम्पैटिबल नहीं है (जैसे Java 8 या 11 बहुत पुराना है, या Java 22 बहुत नया है)।
- **समाधान:**
  - **Java JDK 17** इनस्टॉल करें (Azul Zulu 17 या OpenJDK 17 सबसे स्टेबल है)।
  - Android Studio में: `Settings (Preferences) > Build, Execution, Deployment > Build Tools > Gradle > Gradle JDK` में जाकर **JDK 17** चुनें।
  - टर्मिनल में चेक करें: `java -version` (यह 17.x होना चाहिए)।

---

### 🔴 समस्या 3: फ़ोन में `App Not Installed` या `Installation Blocked` का एरर
- **कारण:** फ़ोन अनवेरिफाइड सोर्सेज से APK इनस्टॉल करने से रोकता है या पहले से कोई पुराना ऐप समान पैकेज नाम से मौजूद है।
- **समाधान:**
  1. अपने फ़ोन में **Settings > Security / Privacy > Install Unknown Apps** में जाकर Chrome / File Manager को परमिशन दें।
  2. यदि पहले कोई पुराना वर्जन इनस्टॉल किया था, तो उसे पहले **Uninstall** करें, फिर नया APK इनस्टॉल करें।
  3. Google Play Protect का पॉप-अप आने पर **"Install anyway (unsafe/unknown)"** पर टैप करें।

---

### 🔴 समस्या 4: ऐप खुलने पर सफ़ेद स्क्रीन (White Screen / Blank Page)
- **कारण:** Web Assets (`dist/`) सिंक नहीं हुए हैं।
- **समाधान:**
  टर्मिनल में दोबारा यह कमांड चलाएं:
  ```bash
  npm run build
  npx cap sync android
  ```
  इसके बाद Android Studio में `Build > Clean Project` और फिर `Build > Rebuild Project` करें।

---

### 🔴 समस्या 5: `CLEARTEXT communication not permitted` (API कनेक्ट न होना)
- **कारण:** Android 9+ डिफ़ॉल्ट रूप से असुरक्षित HTTP कॉल्स ब्लॉक करता है।
- **समाधान:**
  हमने आपके `android/app/src/main/AndroidManifest.xml` में पहले से ही `android:usesCleartextTraffic="true"` जोड़ दिया है। साथ ही `capacitor.config.ts` में `server.cleartext: true` सेट है, जिससे आपकी API कॉल्स बिना रुकावट चलेंगी।

---

### 🔴 समस्या 6: Gradle Out of Memory (`Java heap space`)
- **कारण:** बिल्ड के समय कंप्यूटर की रैम कम पड़ना।
- **समाधान:**
  `android/gradle.properties` फ़ाइल खोलें और यह लाइन जोड़ें:
  ```properties
  org.gradle.jvmargs=-Xmx2048m -XX:MaxMetaspaceSize=512m
  ```

---

## 🔒 Google Play Store या Production Release के लिए Signed APK बनाना

जब आप ऐप को दुनिया भर के किसानों के लिए रिलीज़ करना चाहें:
1. **Keystore बनाएं:**
   ```bash
   keytool -genkey -v -keystore kisan-mitra-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias kisanmitra
   ```
2. **Release APK या AAB बिल्ड करें:**
   ```bash
   cd android
   ./gradlew assembleRelease
   # Play Store के लिए:
   ./gradlew bundleRelease
   ```
3. जनरेटेड AAB फ़ाइल (`android/app/build/outputs/bundle/release/app-release.aab`) को सीधे **Google Play Console** पर अपलोड करें।
