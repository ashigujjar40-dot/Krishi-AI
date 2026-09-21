import React, { useState, useEffect } from 'react';
import {
  UserRole,
  LanguageCode,
  UserProfile,
  CropDiagnosisResult,
  FollowUpRecord,
  DealerStockItem,
  CartItem,
  Order,
  FarmField,
  WeatherAlert,
  OrderStatus,
  DeliveryType,
  PaymentMethod
} from './types.ts';
import { Header } from './components/Header.tsx';
import { BottomNav, FarmerTab } from './components/BottomNav.tsx';
import { FarmerHome } from './components/FarmerHome.tsx';
import { ScanDiagnosis } from './components/ScanDiagnosis.tsx';
import { DealerOrdering } from './components/DealerOrdering.tsx';
import { OrdersView } from './components/OrdersView.tsx';
import { FarmProfileView } from './components/FarmProfileView.tsx';
import { FollowUpModal } from './components/FollowUpModal.tsx';
import { DealerDashboard } from './components/DealerDashboard.tsx';
import { AdminPanel } from './components/AdminPanel.tsx';
import { AuthModal } from './components/AuthModal.tsx';
import { WhatsAppNotificationCenter } from './components/WhatsAppNotificationCenter.tsx';
import { AndroidBuildModal } from './components/AndroidBuildModal.tsx';
import { ReferAppModal } from './components/ReferAppModal.tsx';
import { speakText, stopSpeaking } from './utils/speech.ts';

export default function App() {
  // Authentication & Active Persona
  const [currentUser, setCurrentUser] = useState<UserProfile>({
    id: 'farmer-101',
    phone: '9876543210',
    name: 'Balwant Singh (किसान)',
    role: 'farmer',
    language: 'hi',
    pincode: '444001',
    landSizeAcres: 3.5
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isWhatsAppCenterOpen, setIsWhatsAppCenterOpen] = useState<boolean>(false);
  const [isAndroidModalOpen, setIsAndroidModalOpen] = useState<boolean>(false);
  const [isReferModalOpen, setIsReferModalOpen] = useState<boolean>(false);
  const [farmerTab, setFarmerTab] = useState<FarmerTab>('home');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);

  // PWA Install prompt state
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [canInstallPwa, setCanInstallPwa] = useState<boolean>(false);

  // App Data Stores
  const [weather, setWeather] = useState<WeatherAlert | null>(null);
  const [stockItems, setStockItems] = useState<DealerStockItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [followUps, setFollowUps] = useState<FollowUpRecord[]>([]);
  const [diagnoses, setDiagnoses] = useState<CropDiagnosisResult[]>([]);
  const [fields, setFields] = useState<FarmField[]>([]);
  const [activeFollowUpModal, setActiveFollowUpModal] = useState<FollowUpRecord | null>(null);
  const [dealerSearchProduct, setDealerSearchProduct] = useState<string>('');

  // Listen for PWA install prompt
  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setCanInstallPwa(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallPwa = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setCanInstallPwa(false);
      }
      setDeferredPrompt(null);
    }
  };

  // Load initial backend state
  useEffect(() => {
    fetchWeather();
    fetchStock();
    fetchOrders();
    fetchFollowUps();
    fetchDiagnoses();
    fetchFields();
  }, []);

  const fetchWeather = async () => {
    try {
      const res = await fetch('/api/weather');
      const data = await res.json();
      setWeather(data);
    } catch (err) {
      console.warn('Weather fetch error:', err);
    }
  };

  const fetchStock = async () => {
    try {
      const res = await fetch('/api/dealers');
      const data = await res.json();
      setStockItems(data);
    } catch (err) {
      console.warn('Stock fetch error:', err);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.warn('Orders fetch error:', err);
    }
  };

  const fetchFollowUps = async () => {
    try {
      const res = await fetch('/api/follow-ups');
      const data = await res.json();
      setFollowUps(data);
    } catch (err) {
      console.warn('Follow-ups fetch error:', err);
    }
  };

  const fetchDiagnoses = async () => {
    try {
      const res = await fetch('/api/diagnoses');
      const data = await res.json();
      setDiagnoses(data);
    } catch (err) {
      console.warn('Diagnoses fetch error:', err);
    }
  };

  const fetchFields = async () => {
    try {
      const res = await fetch('/api/farm-profile');
      const data = await res.json();
      setFields(data);
    } catch (err) {
      console.warn('Fields fetch error:', err);
    }
  };

  // Voice Speech Player
  const handlePlaySpeech = (text: string) => {
    setIsAudioPlaying(true);
    speakText(text, currentUser.language, () => {
      setIsAudioPlaying(false);
    });
  };

  const handleStopSpeech = () => {
    stopSpeaking();
    setIsAudioPlaying(false);
  };

  // Cart Management
  const handleAddToCart = (item: DealerStockItem) => {
    setCart(prev => {
      const existing = prev.find(c => c.stockItem.id === item.id);
      if (existing) {
        return prev.map(c => c.stockItem.id === item.id ? { ...c, quantity: c.quantity + 1 } : c);
      }
      return [...prev, { stockItem: item, quantity: 1 }];
    });
  };

  const handleUpdateCartQty = (stockItemId: string, delta: number) => {
    setCart(prev => {
      return prev
        .map(c => {
          if (c.stockItem.id === stockItemId) {
            const newQty = c.quantity + delta;
            return newQty > 0 ? { ...c, quantity: newQty } : null;
          }
          return c;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const handleRemoveFromCart = (stockItemId: string) => {
    setCart(prev => prev.filter(c => c.stockItem.id !== stockItemId));
  };

  // Place Order
  const handlePlaceOrder = async (params: {
    dealerId: string;
    dealerShopName: string;
    dealerPhone: string;
    deliveryType: DeliveryType;
    paymentMethod: PaymentMethod;
    deliveryAddress: string;
  }): Promise<boolean> => {
    try {
      const payload = {
        farmerId: currentUser.id,
        farmerName: currentUser.name,
        farmerPhone: currentUser.phone,
        dealerId: params.dealerId,
        dealerShopName: params.dealerShopName,
        dealerPhone: params.dealerPhone,
        deliveryAddress: params.deliveryAddress,
        deliveryType: params.deliveryType,
        paymentMethod: params.paymentMethod,
        items: cart.map(c => ({
          productId: c.stockItem.productId,
          productName: c.stockItem.productName,
          packSize: c.stockItem.packSize,
          unitPrice: c.stockItem.price,
          quantity: c.quantity
        }))
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success) {
        setCart([]);
        fetchOrders();
        fetchStock();
        return true;
      }
      return false;
    } catch (err) {
      console.error('Order placement error:', err);
      return false;
    }
  };

  // Dealer Action: update order status
  const handleUpdateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      fetchOrders();
    } catch (err) {
      console.error('Update order status error:', err);
    }
  };

  // Dealer Action: update inventory item
  const handleUpdateInventoryItem = async (stockId: string, price: number, inStock: boolean, quantity: number) => {
    try {
      await fetch(`/api/inventory/${stockId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ price, inStock, stockQuantity: quantity })
      });
      fetchStock();
    } catch (err) {
      console.error('Update inventory error:', err);
    }
  };

  // Follow-up submission
  const handleSubmitFollowUpOutcome = async (outcome: 'improved' | 'same' | 'worse', notes?: string, photo?: string) => {
    if (!activeFollowUpModal) return;
    try {
      await fetch(`/api/follow-ups/${activeFollowUpModal.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ outcome, notes, newImageUrl: photo })
      });
      fetchFollowUps();
    } catch (err) {
      console.error('Follow-up error:', err);
    }
  };

  // Agronomist Note
  const handleAddAgronomistNote = async (followUpId: string, note: string) => {
    try {
      await fetch(`/api/follow-ups/${followUpId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agronomistNotes: note })
      });
      fetchFollowUps();
    } catch (err) {
      console.error('Add agronomist note error:', err);
    }
  };

  // Add field
  const handleAddField = async (fieldData: Omit<FarmField, 'id'>) => {
    try {
      await fetch('/api/farm-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fieldData)
      });
      fetchFields();
    } catch (err) {
      console.error('Add field error:', err);
    }
  };

  // Transition from Scan diagnosis to Dealer ordering
  const handleOrderFromDiagnosis = (productName: string) => {
    setDealerSearchProduct(productName);
    setFarmerTab('orders'); // Jump to ordering section
  };

  // Active pending follow-ups for farmer
  const pendingFollowUps = followUps.filter(f => f.status === 'pending');
  const escalatedFollowUps = followUps.filter(f => f.status === 'escalated');

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col items-center">
      {/* Mobile Shell Constraint */}
      <div className="w-full max-w-md bg-stone-50 min-h-screen flex flex-col shadow-2xl relative border-x border-stone-200">
        {/* Sticky Mobile Header */}
        <Header
          role={currentUser.role}
          language={currentUser.language}
          cartCount={cart.reduce((a, b) => a + b.quantity, 0)}
          isAudioPlaying={isAudioPlaying}
          canInstallPwa={canInstallPwa}
          onInstallPwa={handleInstallPwa}
          onStopAudio={handleStopSpeech}
          onOpenCart={() => {
            setFarmerTab('orders');
          }}
          onOpenWhatsApp={() => setIsWhatsAppCenterOpen(true)}
          onOpenAndroidBuild={() => setIsAndroidModalOpen(true)}
          onOpenReferApp={() => setIsReferModalOpen(true)}
          onChangeLanguage={(lang) => {
            setCurrentUser(prev => ({ ...prev, language: lang }));
          }}
          onChangeRole={(newRole) => {
            setCurrentUser(prev => ({
              ...prev,
              role: newRole,
              name: newRole === 'dealer'
                ? 'Ramesh Patel (Kisan Seva Kendra)'
                : newRole === 'agronomist'
                ? 'Dr. Sunita Sharma (ICAR Agronomist)'
                : 'Balwant Singh (किसान भाई)'
            }));
          }}
          userName={currentUser.name}
          onOpenAuth={() => setIsAuthModalOpen(true)}
        />

        {/* Main View Area */}
        <main className="flex-1 p-4 overflow-y-auto">
          {/* 1. Farmer Experience */}
          {currentUser.role === 'farmer' && (
            <>
              {farmerTab === 'home' && (
                <FarmerHome
                  language={currentUser.language}
                  weather={weather}
                  pendingFollowUps={pendingFollowUps}
                  nearbyDealers={stockItems}
                  onStartScan={() => setFarmerTab('scan')}
                  onOpenFollowUp={(rec) => setActiveFollowUpModal(rec)}
                  onSelectDealer={(dealer) => {
                    setDealerSearchProduct(dealer.shopName);
                    setFarmerTab('orders');
                  }}
                  onOpenWhatsApp={() => setIsWhatsAppCenterOpen(true)}
                  onOpenReferApp={() => setIsReferModalOpen(true)}
                  onOpenAndroidBuild={() => setIsAndroidModalOpen(true)}
                  onPlayWeatherAudio={() => {
                    if (weather) {
                      handlePlaySpeech(
                        currentUser.language === 'hi'
                          ? `आज का तापमान इकतीस डिग्री सेल्सियस है। हवा हल्की है। छिड़काव के लिए सुबह सात से साढ़े दस बजे का समय सुरक्षित है।`
                          : weather.sprayAdvisory
                      );
                    }
                  }}
                />
              )}

              {farmerTab === 'scan' && (
                <ScanDiagnosis
                  language={currentUser.language}
                  onDiagnosisComplete={(diag) => {
                    fetchDiagnoses();
                    fetchFollowUps();
                  }}
                  onOrderProduct={(prodName) => {
                    handleOrderFromDiagnosis(prodName);
                  }}
                  onPlaySpeech={handlePlaySpeech}
                  onStopSpeech={handleStopSpeech}
                  isSpeaking={isAudioPlaying}
                />
              )}

              {farmerTab === 'orders' && (
                <div className="space-y-6">
                  {/* Dealer Input Purchasing Section */}
                  <DealerOrdering
                    language={currentUser.language}
                    stockItems={stockItems}
                    cart={cart}
                    onAddToCart={handleAddToCart}
                    onUpdateCartQty={handleUpdateCartQty}
                    onRemoveFromCart={handleRemoveFromCart}
                    onPlaceOrder={handlePlaceOrder}
                    filterProductQuery={dealerSearchProduct}
                  />

                  {/* Past Orders Tracker Section */}
                  <OrdersView
                    orders={orders.filter(o => o.farmerId === currentUser.id)}
                    language={currentUser.language}
                    onRefresh={fetchOrders}
                  />
                </div>
              )}

              {farmerTab === 'profile' && (
                <FarmProfileView
                  language={currentUser.language}
                  fields={fields}
                  diagnosesHistory={diagnoses}
                  ordersHistory={orders.filter(o => o.farmerId === currentUser.id)}
                  onAddField={handleAddField}
                  onOpenWhatsApp={() => setIsWhatsAppCenterOpen(true)}
                  onOpenReferApp={() => setIsReferModalOpen(true)}
                  onSelectPastDiagnosis={(diag) => {
                    setFarmerTab('scan');
                  }}
                />
              )}
            </>
          )}

          {/* 2. Dealer Dashboard Experience */}
          {currentUser.role === 'dealer' && (
            <DealerDashboard
              language={currentUser.language}
              dealerId="dealer-101"
              dealerShopName="Kisan Krishi Seva Kendra"
              orders={orders}
              inventory={stockItems}
              onUpdateOrderStatus={handleUpdateOrderStatus}
              onUpdateInventoryItem={handleUpdateInventoryItem}
            />
          )}

          {/* 3. Admin / Agronomist Experience */}
          {currentUser.role === 'agronomist' && (
            <AdminPanel
              language={currentUser.language}
              diagnoses={diagnoses}
              escalatedFollowUps={escalatedFollowUps}
              onAddAgronomistNote={handleAddAgronomistNote}
            />
          )}
        </main>

        {/* Farmer Bottom Nav Bar (Only in farmer mode) */}
        {currentUser.role === 'farmer' && (
          <BottomNav
            activeTab={farmerTab}
            onSelectTab={setFarmerTab}
            language={currentUser.language}
            orderBadgeCount={orders.filter(o => o.farmerId === currentUser.id && o.status === 'pending').length}
          />
        )}

        {/* Follow-Up Day 3 / 7 Health Checkup Modal */}
        {activeFollowUpModal && (
          <FollowUpModal
            followUp={activeFollowUpModal}
            language={currentUser.language}
            onClose={() => setActiveFollowUpModal(null)}
            onSubmitOutcome={handleSubmitFollowUpOutcome}
          />
        )}

        {/* Phone OTP Login Modal */}
        <AuthModal
          language={currentUser.language}
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onLoginSuccess={(user) => {
            setCurrentUser(user);
          }}
        />

        {/* WhatsApp Notification & Privacy Preferences Modal */}
        <WhatsAppNotificationCenter
          userPhone={currentUser.phone}
          language={currentUser.language}
          isOpen={isWhatsAppCenterOpen}
          onClose={() => setIsWhatsAppCenterOpen(false)}
        />

        {/* Native Android APK & Build Center Modal */}
        <AndroidBuildModal
          isOpen={isAndroidModalOpen}
          onClose={() => setIsAndroidModalOpen(false)}
          canInstallPwa={canInstallPwa}
          onInstallPwa={handleInstallPwa}
          language={currentUser.language}
        />

        {/* Refer App & Earn Modal */}
        <ReferAppModal
          isOpen={isReferModalOpen}
          onClose={() => setIsReferModalOpen(false)}
          language={currentUser.language}
          userPhone={currentUser.phone}
          userName={currentUser.name}
        />
      </div>
    </div>
  );
}
