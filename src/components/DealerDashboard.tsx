import React, { useState } from 'react';
import { Store, Package, IndianRupee, TrendingUp, CheckCircle2, XCircle, Clock, Truck, Edit3, Save } from 'lucide-react';
import { Order, DealerStockItem, LanguageCode, OrderStatus } from '../types.ts';
import { I18N_TEXTS } from '../i18n.ts';

interface DealerDashboardProps {
  language: LanguageCode;
  dealerId: string;
  dealerShopName: string;
  orders: Order[];
  inventory: DealerStockItem[];
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  onUpdateInventoryItem: (stockId: string, price: number, inStock: boolean, quantity: number) => Promise<void>;
}

export const DealerDashboard: React.FC<DealerDashboardProps> = ({
  language,
  dealerId,
  dealerShopName,
  orders,
  inventory,
  onUpdateOrderStatus,
  onUpdateInventoryItem
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'inventory' | 'sales'>('orders');
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editQty, setEditQty] = useState<number>(0);
  const [editInStock, setEditInStock] = useState<boolean>(true);

  // Filter orders for this specific dealer (multi-tenant)
  const dealerOrders = orders.filter(o => o.dealerId === dealerId);
  const dealerInventory = inventory.filter(i => i.dealerId === dealerId);

  // Sales Summary
  const totalSalesRevenue = dealerOrders
    .filter(o => o.status !== 'cancelled')
    .reduce((acc, o) => acc + o.totalAmount, 0);

  const pendingOrdersCount = dealerOrders.filter(o => o.status === 'pending').length;
  const completedOrdersCount = dealerOrders.filter(o => o.status === 'delivered').length;

  const startEditItem = (item: DealerStockItem) => {
    setEditingItemId(item.id);
    setEditPrice(item.price);
    setEditQty(item.stockQuantity);
    setEditInStock(item.inStock);
  };

  const saveEditItem = async (itemId: string) => {
    await onUpdateInventoryItem(itemId, editPrice, editInStock, editQty);
    setEditingItemId(null);
  };

  return (
    <div className="space-y-4 pb-24">
      {/* Dealer Header Card */}
      <div className="bg-emerald-800 text-white rounded-2xl p-4 shadow-sm space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-700 flex items-center justify-center text-emerald-200">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white leading-tight">
                {dealerShopName}
              </h2>
              <span className="text-[11px] text-emerald-200">
                Dealer ID: {dealerId} • Akola Mandi
              </span>
            </div>
          </div>
          <span className="text-[10px] bg-emerald-600 px-2 py-0.5 rounded-full font-bold text-emerald-100">
            GST Verified
          </span>
        </div>

        {/* Subscription Plan Badge */}
        <div className="bg-emerald-900/60 border border-emerald-700/60 rounded-xl p-2.5 flex items-center justify-between text-xs">
          <div>
            <span className="text-[10px] text-emerald-300 block uppercase font-medium">Dealer Plan</span>
            <span className="font-bold text-white">Monthly Active Plan (₹499/mo)</span>
          </div>
          <span className="text-[10px] bg-emerald-500 text-emerald-950 font-bold px-2 py-1 rounded-lg">
            0% Commission Tier
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-3 p-1 bg-stone-100 rounded-xl text-xs font-bold">
        <button
          onClick={() => setActiveTab('orders')}
          className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1 ${
            activeTab === 'orders'
              ? 'bg-white text-emerald-900 shadow-sm'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <span>Orders</span>
          {pendingOrdersCount > 0 && (
            <span className="w-4 h-4 bg-amber-500 text-white text-[9px] rounded-full flex items-center justify-center font-bold">
              {pendingOrdersCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('inventory')}
          className={`py-2 rounded-lg transition-all ${
            activeTab === 'inventory'
              ? 'bg-white text-emerald-900 shadow-sm'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          Inventory & Price
        </button>

        <button
          onClick={() => setActiveTab('sales')}
          className={`py-2 rounded-lg transition-all ${
            activeTab === 'sales'
              ? 'bg-white text-emerald-900 shadow-sm'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          Sales Summary
        </button>
      </div>

      {/* Tab 1: Orders Management */}
      {activeTab === 'orders' && (
        <div className="space-y-3">
          {dealerOrders.length === 0 ? (
            <p className="text-xs text-stone-400 text-center py-6">No incoming orders yet.</p>
          ) : (
            dealerOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white border border-stone-200 rounded-2xl p-4 shadow-sm space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-mono font-bold text-emerald-800">
                      #{order.orderNumber}
                    </span>
                    <h4 className="text-sm font-bold text-stone-900">
                      Farmer: {order.farmerName}
                    </h4>
                    <p className="text-[11px] text-stone-500">
                      Phone: +91 {order.farmerPhone} • {order.deliveryType.toUpperCase()}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-extrabold text-stone-900 block">
                      ₹{order.totalAmount}
                    </span>
                    <span className="text-[10px] text-stone-500 uppercase">
                      {order.paymentMethod} ({order.paymentStatus})
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div className="bg-stone-50 p-2.5 rounded-xl text-xs space-y-1 border border-stone-100">
                  {order.items.map((it, i) => (
                    <div key={i} className="flex justify-between text-stone-700">
                      <span>{it.productName} ({it.packSize}) × {it.quantity}</span>
                      <span className="font-semibold">₹{it.unitPrice * it.quantity}</span>
                    </div>
                  ))}
                  {order.deliveryAddress && (
                    <p className="text-[10px] text-stone-500 pt-1 border-t border-stone-200">
                      Address: {order.deliveryAddress}
                    </p>
                  )}
                </div>

                {/* Status Update Action Buttons */}
                <div className="pt-1 flex items-center justify-between gap-1.5 flex-wrap">
                  <span className="text-xs font-bold text-stone-500">
                    Status: <strong className="text-stone-900 capitalize">{order.status.replace(/_/g, ' ')}</strong>
                  </span>

                  <div className="flex items-center gap-1">
                    {order.status === 'pending' && (
                      <>
                        <button
                          onClick={() => onUpdateOrderStatus(order.id, 'accepted')}
                          className="bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-sm"
                        >
                          Accept Order
                        </button>
                        <button
                          onClick={() => onUpdateOrderStatus(order.id, 'cancelled')}
                          className="bg-rose-100 hover:bg-rose-200 text-rose-800 text-[11px] font-bold px-2.5 py-1.5 rounded-lg"
                        >
                          Reject
                        </button>
                      </>
                    )}

                    {order.status === 'accepted' && (
                      <button
                        onClick={() => onUpdateOrderStatus(order.id, order.deliveryType === 'pickup' ? 'ready_for_pickup' : 'out_for_delivery')}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-1"
                      >
                        <Package className="w-3.5 h-3.5" />
                        <span>{order.deliveryType === 'pickup' ? 'Mark Ready' : 'Dispatch'}</span>
                      </button>
                    )}

                    {(order.status === 'ready_for_pickup' || order.status === 'out_for_delivery') && (
                      <button
                        onClick={() => onUpdateOrderStatus(order.id, 'delivered')}
                        className="bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Mark Delivered</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 2: Inventory & Price List Management */}
      {activeTab === 'inventory' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-stone-500 px-1">
            <span>Manage live product prices & stock availability</span>
            <span className="font-bold text-stone-800">{dealerInventory.length} Products</span>
          </div>

          {dealerInventory.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-stone-200 rounded-2xl p-4 shadow-sm space-y-2.5"
            >
              {editingItemId === item.id ? (
                <div className="space-y-2.5 text-xs">
                  <h4 className="font-bold text-stone-900">{item.productName}</h4>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-stone-500 font-semibold block">Selling Price (₹)</label>
                      <input
                        type="number"
                        value={editPrice}
                        onChange={(e) => setEditPrice(Number(e.target.value))}
                        className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg outline-none font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-stone-500 font-semibold block">Stock Quantity</label>
                      <input
                        type="number"
                        value={editQty}
                        onChange={(e) => setEditQty(Number(e.target.value))}
                        className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg outline-none font-bold"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id={`instock-${item.id}`}
                      checked={editInStock}
                      onChange={(e) => setEditInStock(e.target.checked)}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <label htmlFor={`instock-${item.id}`} className="font-semibold text-stone-700">
                      Product In Stock
                    </label>
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      onClick={() => setEditingItemId(null)}
                      className="px-3 py-1.5 rounded-lg border border-stone-300 text-stone-600 font-bold"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => saveEditItem(item.id)}
                      className="px-4 py-1.5 rounded-lg bg-emerald-700 text-white font-bold flex items-center gap-1"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Changes</span>
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] text-stone-400 font-bold uppercase">{item.brand} • {item.packSize}</span>
                      <h4 className="text-sm font-bold text-stone-900">{item.productName}</h4>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-extrabold text-stone-900">₹{item.price}</span>
                      <span className="text-[10px] text-stone-400 block">{item.packSize}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1 border-t border-stone-100">
                    <span className={`font-semibold ${item.inStock ? 'text-emerald-700' : 'text-rose-600'}`}>
                      {item.inStock ? `Available (${item.stockQuantity} units)` : 'Out of Stock'}
                    </span>
                    <button
                      onClick={() => startEditItem(item)}
                      className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Edit Price & Stock</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Sales Summary */}
      {activeTab === 'sales' && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2 text-center text-xs">
            <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-sm">
              <span className="text-[10px] text-stone-400 uppercase font-bold block">Total Revenue</span>
              <span className="text-xl font-extrabold text-stone-900 mt-1 block">
                ₹{totalSalesRevenue}
              </span>
              <span className="text-[10px] text-emerald-600 font-medium">All completed & accepted</span>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-sm">
              <span className="text-[10px] text-stone-400 uppercase font-bold block">Total Orders</span>
              <span className="text-xl font-extrabold text-stone-900 mt-1 block">
                {dealerOrders.length}
              </span>
              <span className="text-[10px] text-stone-500 font-medium">{completedOrdersCount} Delivered</span>
            </div>
          </div>

          <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-sm text-xs space-y-2">
            <h4 className="font-bold text-stone-900">Dealer Settlement & Billing</h4>
            <p className="text-stone-600 text-[11px] leading-relaxed">
              Payments collected via UPI QR go straight into your registered bank account. Cash on Delivery is collected by your delivery staff or upon in-store pickup.
            </p>
            <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 flex items-center justify-between text-emerald-900 font-semibold">
              <span>Platform Fee:</span>
              <span>₹0.00 (Included in monthly subscription)</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
