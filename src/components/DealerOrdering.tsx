import React, { useState } from 'react';
import {
  Store,
  MapPin,
  Phone,
  ShieldCheck,
  CheckCircle2,
  Plus,
  Minus,
  ShoppingBag,
  CreditCard,
  QrCode,
  Truck,
  ArrowRight,
  X,
  MessageSquare
} from 'lucide-react';
import { DealerStockItem, CartItem, LanguageCode, DeliveryType, PaymentMethod } from '../types.ts';
import { I18N_TEXTS } from '../i18n.ts';

interface DealerOrderingProps {
  language: LanguageCode;
  stockItems: DealerStockItem[];
  cart: CartItem[];
  onAddToCart: (item: DealerStockItem) => void;
  onUpdateCartQty: (stockItemId: string, delta: number) => void;
  onRemoveFromCart: (stockItemId: string) => void;
  onPlaceOrder: (params: {
    dealerId: string;
    dealerShopName: string;
    dealerPhone: string;
    deliveryType: DeliveryType;
    paymentMethod: PaymentMethod;
    deliveryAddress: string;
  }) => Promise<boolean>;
  filterProductQuery?: string;
}

export const DealerOrdering: React.FC<DealerOrderingProps> = ({
  language,
  stockItems,
  cart,
  onAddToCart,
  onUpdateCartQty,
  onRemoveFromCart,
  onPlaceOrder,
  filterProductQuery
}) => {
  const t = I18N_TEXTS[language];

  const [pincodeFilter, setPincodeFilter] = useState('444001');
  const [searchQuery, setSearchQuery] = useState(filterProductQuery || '');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [deliveryType, setDeliveryType] = useState<DeliveryType>('delivery');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [deliveryAddress, setDeliveryAddress] = useState('Village Mandi, Plot 14, Farm Road, Dist Akola');
  const [whatsAppOptIn, setWhatsAppOptIn] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccessId, setOrderSuccessId] = useState<string | null>(null);

  // Filter stock items
  const filteredStock = stockItems.filter(item => {
    const matchesSearch = !searchQuery ||
      item.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.shopName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  // Calculate cart total
  const cartTotal = cart.reduce((acc, c) => acc + (c.stockItem.price * c.quantity), 0);

  const handleCheckoutSubmit = async () => {
    if (cart.length === 0) return;
    setIsSubmitting(true);
    try {
      const primaryDealer = cart[0].stockItem;
      const success = await onPlaceOrder({
        dealerId: primaryDealer.dealerId,
        dealerShopName: primaryDealer.shopName,
        dealerPhone: primaryDealer.phone,
        deliveryType,
        paymentMethod,
        deliveryAddress
      });
      if (success) {
        setOrderSuccessId('KS-' + Math.floor(1000 + Math.random() * 9000));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 pb-24">
      {/* Header & Pincode Locator */}
      <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Store className="w-5 h-5 text-emerald-700" />
            <h3 className="text-base font-bold text-stone-900">
              {t.findDealers}
            </h3>
          </div>
          <div className="flex items-center gap-1 text-xs bg-stone-100 text-stone-700 px-2.5 py-1 rounded-lg">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            <input
              type="text"
              value={pincodeFilter}
              onChange={(e) => setPincodeFilter(e.target.value)}
              className="w-16 bg-transparent outline-none font-bold"
              placeholder="Pincode"
            />
          </div>
        </div>

        {/* Search / Filter input */}
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search products (Neem, Coragen, Trichoderma, NPK)..."
          className="w-full text-xs p-2.5 rounded-xl border border-stone-200 bg-stone-50 outline-none focus:ring-2 focus:ring-emerald-500"
        />

        {searchQuery && (
          <div className="flex items-center justify-between text-xs text-stone-500 bg-stone-50 px-2.5 py-1.5 rounded-lg">
            <span>Filtered for: <strong>{searchQuery}</strong></span>
            <button onClick={() => setSearchQuery('')} className="text-emerald-700 font-bold">Clear</button>
          </div>
        )}
      </div>

      {/* Product Stock List */}
      <div className="space-y-3">
        {filteredStock.map((item) => {
          const cartItem = cart.find(c => c.stockItem.id === item.id);
          return (
            <div
              key={item.id}
              className="bg-white border border-stone-200 rounded-2xl p-4 shadow-sm hover:border-emerald-300 transition-all space-y-2.5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                    {item.brand} • {item.packSize}
                  </span>
                  <h4 className="text-sm font-extrabold text-stone-900 leading-snug">
                    {item.productName}
                  </h4>
                  <div className="flex items-center gap-1 text-xs text-stone-600 mt-1">
                    <Store className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                    <span className="font-semibold text-stone-800 truncate max-w-[190px]">
                      {item.shopName}
                    </span>
                    {item.verifiedDealer && (
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    )}
                  </div>
                </div>

                {/* Price Pill */}
                <div className="text-right">
                  <div className="text-base font-extrabold text-emerald-900">
                    ₹{item.price}
                  </div>
                  <span className="text-[10px] text-stone-400">incl. GST</span>
                </div>
              </div>

              {/* Proximity & Stock status */}
              <div className="flex items-center justify-between text-xs text-stone-500 pt-1 border-t border-stone-100">
                <div className="flex items-center gap-2">
                  <span className="text-stone-700 font-medium">📍 {item.distanceKm} km</span>
                  <span className="text-stone-400">|</span>
                  <span className={`font-semibold ${item.inStock ? 'text-emerald-700' : 'text-rose-600'}`}>
                    {item.inStock ? `In Stock (${item.stockQuantity} available)` : t.outOfStock}
                  </span>
                </div>

                {/* Cart Action Buttons */}
                {cartItem ? (
                  <div className="flex items-center space-x-2 bg-emerald-50 border border-emerald-200 rounded-lg p-1">
                    <button
                      onClick={() => onUpdateCartQty(item.id, -1)}
                      className="w-6 h-6 rounded bg-white text-emerald-800 font-bold flex items-center justify-center shadow-sm"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-extrabold text-xs text-emerald-900 px-1">
                      {cartItem.quantity}
                    </span>
                    <button
                      onClick={() => onUpdateCartQty(item.id, 1)}
                      className="w-6 h-6 rounded bg-emerald-700 text-white font-bold flex items-center justify-center shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => onAddToCart(item)}
                    disabled={!item.inStock}
                    className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${
                      item.inStock
                        ? 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-sm'
                        : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                    }`}
                  >
                    + {t.addToCart}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Bottom Cart Bar */}
      {cart.length > 0 && !isCheckoutOpen && !orderSuccessId && (
        <div className="fixed bottom-18 left-0 right-0 z-20 px-4">
          <div className="max-w-md mx-auto bg-stone-900 text-white rounded-2xl p-3.5 shadow-xl flex items-center justify-between">
            <div>
              <span className="text-xs text-stone-400 block font-medium">
                {cart.reduce((a, b) => a + b.quantity, 0)} Items in Cart
              </span>
              <span className="text-base font-extrabold text-white">
                ₹{cartTotal}
              </span>
            </div>
            <button
              onClick={() => setIsCheckoutOpen(true)}
              className="bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-extrabold text-xs py-2.5 px-4 rounded-xl flex items-center gap-1.5 shadow"
            >
              <span>{t.checkout}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Checkout Drawer / Modal */}
      {isCheckoutOpen && !orderSuccessId && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-end justify-center p-0 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-t-3xl max-h-[90vh] overflow-y-auto p-5 space-y-4 animate-in slide-in-from-bottom">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-emerald-700" />
                <span>Confirm Order</span>
              </h3>
              <button
                onClick={() => setIsCheckoutOpen(false)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items Review */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wide">Selected Items</span>
              {cart.map((c) => (
                <div key={c.stockItem.id} className="flex items-center justify-between text-xs bg-stone-50 p-2.5 rounded-xl border border-stone-200/80">
                  <div>
                    <h5 className="font-bold text-stone-900">{c.stockItem.productName}</h5>
                    <p className="text-stone-500 text-[11px]">{c.stockItem.packSize} • Qty: {c.quantity}</p>
                  </div>
                  <span className="font-extrabold text-stone-900">₹{c.stockItem.price * c.quantity}</span>
                </div>
              ))}
            </div>

            {/* Delivery Type Option */}
            <div>
              <span className="text-xs font-bold text-stone-700 block mb-1.5">Delivery Preference</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setDeliveryType('delivery')}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    deliveryType === 'delivery'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                      : 'border-stone-200 text-stone-600'
                  }`}
                >
                  <Truck className="w-4 h-4" />
                  <span>Field / Home Delivery</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDeliveryType('pickup')}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    deliveryType === 'pickup'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                      : 'border-stone-200 text-stone-600'
                  }`}
                >
                  <Store className="w-4 h-4" />
                  <span>Pickup from Shop</span>
                </button>
              </div>
            </div>

            {deliveryType === 'delivery' && (
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Delivery Address / Village
                </label>
                <textarea
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  rows={2}
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-200 bg-stone-50 outline-none"
                />
              </div>
            )}

            {/* Payment Method Option */}
            <div>
              <span className="text-xs font-bold text-stone-700 block mb-1.5">Payment Method</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all ${
                    paymentMethod === 'upi'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                      : 'border-stone-200 text-stone-600'
                  }`}
                >
                  <QrCode className="w-5 h-5 text-emerald-700" />
                  <span>UPI / QR Code</span>
                  <span className="text-[10px] text-emerald-700 font-normal">Instant GPay/PhonePe</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                      : 'border-stone-200 text-stone-600'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-stone-600" />
                  <span>Cash on Delivery</span>
                  <span className="text-[10px] text-stone-500 font-normal">Pay on delivery</span>
                </button>
              </div>

              {/* Dynamic Simulated UPI QR Code */}
              {paymentMethod === 'upi' && (
                <div className="mt-3 bg-stone-50 border border-stone-200 rounded-xl p-3 text-center space-y-2">
                  <div className="inline-block bg-white p-2.5 rounded-lg border border-stone-200 shadow-xs">
                    {/* SVG generated clean UPI QR representation */}
                    <svg viewBox="0 0 120 120" className="w-24 h-24 mx-auto">
                      <rect width="120" height="120" fill="white" />
                      <rect x="10" y="10" width="30" height="30" fill="#14532d" />
                      <rect x="15" y="15" width="20" height="20" fill="white" />
                      <rect x="20" y="20" width="10" height="10" fill="#14532d" />
                      <rect x="80" y="10" width="30" height="30" fill="#14532d" />
                      <rect x="85" y="15" width="20" height="20" fill="white" />
                      <rect x="90" y="20" width="10" height="10" fill="#14532d" />
                      <rect x="10" y="80" width="30" height="30" fill="#14532d" />
                      <rect x="15" y="85" width="20" height="20" fill="white" />
                      <rect x="20" y="90" width="10" height="10" fill="#14532d" />
                      <rect x="50" y="20" width="10" height="20" fill="#14532d" />
                      <rect x="65" y="15" width="10" height="10" fill="#14532d" />
                      <rect x="50" y="50" width="20" height="20" fill="#14532d" />
                      <rect x="80" y="55" width="25" height="10" fill="#14532d" />
                      <rect x="80" y="80" width="15" height="25" fill="#14532d" />
                    </svg>
                  </div>
                  <p className="text-[11px] text-stone-600 font-mono font-medium">
                    UPI ID: <strong>krishisaathi@yesbank</strong>
                  </p>
                  <p className="text-[10px] text-emerald-700">Scan using any UPI App (PhonePe, Paytm, GooglePay)</p>
                </div>
              )}
            </div>

            {/* WhatsApp Notifications Consent Card */}
            <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-3 flex items-start gap-2.5">
              <MessageSquare className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <div className="flex-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-950">Receive WhatsApp Order Alerts</span>
                  <input
                    type="checkbox"
                    checked={whatsAppOptIn}
                    onChange={(e) => setWhatsAppOptIn(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                  />
                </div>
                <p className="text-[11px] text-emerald-800 mt-0.5">
                  Get real-time alerts when dealer accepts, packs, and dispatches your order. Respects privacy, zero promotional spam.
                </p>
              </div>
            </div>

            {/* Total Amount & Submit */}
            <div className="pt-2 border-t border-stone-200 flex items-center justify-between">
              <div>
                <span className="text-xs text-stone-500 block">Total Payable:</span>
                <span className="text-lg font-extrabold text-stone-900">₹{cartTotal}</span>
              </div>

              <button
                onClick={handleCheckoutSubmit}
                disabled={isSubmitting}
                className="bg-emerald-700 hover:bg-emerald-800 active:scale-[0.98] text-white text-xs font-extrabold py-3 px-6 rounded-xl shadow-md flex items-center gap-2"
              >
                {isSubmitting ? 'Placing Order...' : 'Place Order Now'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Success Confirmation Banner */}
      {orderSuccessId && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 text-center space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-stone-900">
                Order Placed Successfully!
              </h3>
              <p className="text-xs text-stone-600 mt-1 font-mono">
                Order ID: <strong>{orderSuccessId}</strong>
              </p>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-900 text-left space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <span>📱 WhatsApp & SMS Notification Sent</span>
              </div>
              <p className="text-[11px] text-emerald-800">
                Dealer has received your order and will confirm within 15 minutes.
              </p>
            </div>

            <button
              onClick={() => {
                setOrderSuccessId(null);
                setIsCheckoutOpen(false);
              }}
              className="w-full bg-emerald-700 text-white font-bold text-xs py-3 rounded-xl shadow"
            >
              Back to Store
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
