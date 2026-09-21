import React from 'react';
import { Package, Clock, CheckCircle2, Truck, Phone, MessageSquare, AlertCircle } from 'lucide-react';
import { Order, LanguageCode } from '../types.ts';
import { I18N_TEXTS } from '../i18n.ts';

interface OrdersViewProps {
  orders: Order[];
  language: LanguageCode;
  onRefresh: () => void;
}

export const OrdersView: React.FC<OrdersViewProps> = ({
  orders,
  language,
  onRefresh
}) => {
  const t = I18N_TEXTS[language];

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1"><Clock className="w-3 h-3" /> Awaiting Dealer Confirmation</span>;
      case 'accepted':
        return <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Accepted & Packing</span>;
      case 'ready_for_pickup':
        return <span className="bg-indigo-100 text-indigo-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1"><Package className="w-3 h-3" /> Ready for Pickup</span>;
      case 'out_for_delivery':
        return <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1"><Truck className="w-3 h-3" /> Out for Delivery</span>;
      case 'delivered':
        return <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Delivered</span>;
      case 'cancelled':
        return <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Cancelled</span>;
    }
  };

  return (
    <div className="space-y-4 pb-24">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-stone-900">
          {t.myOrders}
        </h3>
        <button
          onClick={onRefresh}
          className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200"
        >
          Refresh
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white border border-stone-200 rounded-2xl p-8 text-center space-y-3">
          <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center mx-auto text-stone-400">
            <Package className="w-6 h-6" />
          </div>
          <p className="text-xs text-stone-500">No orders placed yet. Diagnose your crop and order registered inputs from nearby shops.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((ord) => (
            <div
              key={ord.id}
              className="bg-white border border-stone-200 rounded-2xl p-4 shadow-sm space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-mono font-bold text-emerald-800">
                    #{ord.orderNumber}
                  </span>
                  <h4 className="text-sm font-bold text-stone-900 mt-0.5">
                    {ord.dealerShopName}
                  </h4>
                  <p className="text-[11px] text-stone-500">
                    {new Date(ord.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-sm font-extrabold text-stone-900">
                    ₹{ord.totalAmount}
                  </div>
                  <span className="text-[10px] text-stone-500 uppercase font-semibold">
                    {ord.paymentMethod.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Status pill */}
              <div>
                {getStatusBadge(ord.status)}
              </div>

              {/* Order Items list */}
              <div className="bg-stone-50 rounded-xl p-2.5 space-y-1.5 border border-stone-100 text-xs">
                {ord.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-stone-700">
                    <span>{item.productName} ({item.packSize}) × {item.quantity}</span>
                    <span className="font-semibold">₹{item.unitPrice * item.quantity}</span>
                  </div>
                ))}
              </div>

              {/* Dealer contact & WhatsApp Alert */}
              <div className="flex items-center justify-between text-xs pt-1 border-t border-stone-100">
                <a
                  href={`tel:${ord.dealerPhone}`}
                  className="flex items-center gap-1 text-emerald-800 font-bold hover:underline"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Call Dealer (+91 {ord.dealerPhone})</span>
                </a>

                {ord.whatsappNotified && (
                  <a
                    href={`https://wa.me/91${ord.dealerPhone}?text=${encodeURIComponent(`Namaste Dealer Ji, regarding Krishi Saathi Order #${ord.orderNumber} for ₹${ord.totalAmount}: please confirm status.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1 font-medium transition-colors"
                  >
                    <MessageSquare className="w-3 h-3 text-emerald-600" />
                    <span>WhatsApp Chat</span>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
