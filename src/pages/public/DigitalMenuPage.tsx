import React, { useEffect, useState, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Business, MenuCategory, MenuItem } from '@/types'
import {
  getBusinessBySlug,
  getMenuCategories,
  getMenuItems,
  trackEvent
} from '@/services/dataService'
import { formatCurrency } from '@/lib/utils'
import {
  Search,
  ArrowLeft,
  Flame,
  Leaf,
  Plus,
  Minus,
  ShoppingBag,
  X,
  Info,
  CheckCircle2,
  Sparkles,
  Share2
} from 'lucide-react'

export const DigitalMenuPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const [business, setBusiness] = useState<Business | null>(null)
  const [categories, setCategories] = useState<MenuCategory[]>([])
  const [items, setItems] = useState<MenuItem[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterVegOnly, setFilterVegOnly] = useState(false)
  const [filterPopularOnly, setFilterPopularOnly] = useState(false)
  const [loading, setLoading] = useState(true)

  // Item detail modal
  const [activeItemModal, setActiveItemModal] = useState<MenuItem | null>(null)

  // Simulated Order Tray / Cart
  const [cart, setCart] = useState<{ item: MenuItem; count: number }[]>([])
  const [cartOpen, setCartOpen] = useState(false)

  useEffect(() => {
    async function loadMenu() {
      if (!slug) return
      setLoading(true)
      try {
        const biz = await getBusinessBySlug(slug)
        setBusiness(biz)
        if (biz) {
          const [catsData, itemsData] = await Promise.all([
            getMenuCategories(biz.id),
            getMenuItems(biz.id)
          ])
          setCategories(catsData.filter((c) => c.is_active))
          setItems(itemsData)

          // Track menu view event
          await trackEvent({
            business_id: biz.id,
            event_type: 'menu_view'
          })
        }
      } catch (err) {
        console.error('Error loading digital menu:', err)
      } finally {
        setLoading(false)
      }
    }
    loadMenu()
  }, [slug])

  // Filter items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (selectedCategory !== 'all' && item.category_id !== selectedCategory) {
        return false
      }
      if (filterVegOnly && !item.is_vegetarian) {
        return false
      }
      if (filterPopularOnly && !item.is_popular) {
        return false
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchName = item.name.toLowerCase().includes(q)
        const matchDesc = item.description?.toLowerCase().includes(q)
        return matchName || matchDesc
      }
      return true
    })
  }, [items, selectedCategory, filterVegOnly, filterPopularOnly, searchQuery])

  // Cart operations
  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.item.id === item.id)
      if (existing) {
        return prev.map((i) =>
          i.item.id === item.id ? { ...i, count: i.count + 1 } : i
        )
      }
      return [...prev, { item, count: 1 }]
    })
  }

  const removeFromCart = (itemId: string) => {
    setCart((prev) =>
      prev
        .map((i) => (i.item.id === itemId ? { ...i, count: i.count - 1 } : i))
        .filter((i) => i.count > 0)
    )
  }

  const totalCartPrice = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.item.price * item.count, 0)
  }, [cart])

  const totalCartCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.count, 0)
  }, [cart])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F8FC] flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-[#087BEE] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-semibold text-slate-600">Preparing digital menu...</p>
        </div>
      </div>
    )
  }

  if (!business) {
    return (
      <div className="min-h-screen bg-[#F5F8FC] flex items-center justify-center p-6 text-center">
        <div className="max-w-md bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 mb-2">Menu Not Found</h2>
          <p className="text-sm text-slate-600 mb-4">The menu could not be loaded.</p>
          <Link to="/" className="text-sm font-semibold text-[#087BEE]">Back to home</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F5F8FC] text-slate-900 flex justify-center pb-24">
      <div className="w-full max-w-md bg-white min-h-screen shadow-xl relative border-x border-slate-200/80 flex flex-col">
        {/* Sticky Header with Back Button & Search */}
        <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-3 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <Link
              to={`/b/${business.slug}`}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-[#087BEE] p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Profile</span>
            </Link>

            <div className="text-center">
              <h2 className="text-sm font-black text-[#071321] tracking-tight truncate max-w-[180px]">
                {business.name}
              </h2>
              <span className="text-[10px] font-semibold text-emerald-600 uppercase tracking-wider">
                Live Digital Menu
              </span>
            </div>

            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: `${business.name} Menu`, url: window.location.href })
                } else {
                  navigator.clipboard.writeText(window.location.href)
                  alert('Menu URL copied!')
                }
              }}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
              title="Share Menu"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dishes, drinks, ingredients..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-100 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#087BEE] focus:bg-white transition-all border border-transparent focus:border-slate-200"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Dietary Quick Filter Pills */}
          <div className="flex items-center gap-2 mt-2.5 overflow-x-auto pb-1 no-scrollbar text-xs">
            <button
              onClick={() => setFilterVegOnly(!filterVegOnly)}
              className={`flex-shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all ${
                filterVegOnly
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
              }`}
            >
              <Leaf className="w-3 h-3" /> Veg Only
            </button>

            <button
              onClick={() => setFilterPopularOnly(!filterPopularOnly)}
              className={`flex-shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all ${
                filterPopularOnly
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
              }`}
            >
              <Flame className="w-3 h-3" /> Popular Picks
            </button>
          </div>
        </div>

        {/* Category Horizontal Navigation */}
        <div className="bg-slate-50 border-b border-slate-200 px-4 py-2.5 overflow-x-auto flex gap-2 sticky top-[108px] z-20">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`flex-shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedCategory === 'all'
                ? 'bg-[#071321] text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-200/70 border border-slate-200'
            }`}
          >
            All Items ({items.length})
          </button>
          {categories.map((cat) => {
            const count = items.filter((i) => i.category_id === cat.id).length
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex-shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-[#087BEE] text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-slate-200/70 border border-slate-200'
                }`}
              >
                {cat.name} ({count})
              </button>
            )
          })}
        </div>

        {/* Menu Items List */}
        <div className="p-4 space-y-3.5 flex-1">
          {filteredItems.length === 0 ? (
            <div className="text-center py-12 px-4">
              <Info className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-700">No items match your criteria</p>
              <p className="text-xs text-slate-500 mt-1">Try resetting your search query or dietary filters.</p>
              <button
                onClick={() => {
                  setSelectedCategory('all')
                  setSearchQuery('')
                  setFilterVegOnly(false)
                  setFilterPopularOnly(false)
                }}
                className="mt-4 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            filteredItems.map((item) => {
              const inCart = cart.find((c) => c.item.id === item.id)

              return (
                <div
                  key={item.id}
                  className={`p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex gap-3.5 relative overflow-hidden ${
                    !item.is_available ? 'opacity-60 grayscale-[30%]' : ''
                  }`}
                >
                  {/* Left: Text & Details */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      {/* Dietary indicator dot & popular badge */}
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`w-3.5 h-3.5 border flex items-center justify-center p-0.5 rounded-xs ${
                            item.is_vegetarian
                              ? 'border-emerald-600'
                              : 'border-rose-600'
                          }`}
                          title={item.is_vegetarian ? 'Vegetarian' : 'Non-Vegetarian'}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              item.is_vegetarian ? 'bg-emerald-600' : 'bg-rose-600'
                            }`}
                          />
                        </span>

                        {item.is_popular && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">
                            <Sparkles className="w-2.5 h-2.5" /> Chef's Favorite
                          </span>
                        )}
                      </div>

                      <h3
                        onClick={() => setActiveItemModal(item)}
                        className="text-sm font-bold text-slate-900 cursor-pointer hover:text-[#087BEE] transition-colors leading-snug"
                      >
                        {item.name}
                      </h3>

                      {item.description && (
                        <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                          {item.description}
                        </p>
                      )}
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-sm font-extrabold text-[#071321]">
                        {formatCurrency(item.price, business.currency)}
                      </span>

                      {item.is_available ? (
                        inCart ? (
                          <div className="flex items-center gap-2 bg-[#071321] text-white px-2 py-1 rounded-xl shadow-xs">
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="p-1 hover:text-cyan-400"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-bold w-4 text-center">
                              {inCart.count}
                            </span>
                            <button
                              onClick={() => addToCart(item)}
                              className="p-1 hover:text-cyan-400"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => addToCart(item)}
                            className="px-3 py-1.5 rounded-xl bg-blue-50 text-[#087BEE] hover:bg-[#087BEE] hover:text-white text-xs font-bold border border-blue-200 hover:border-transparent transition-all flex items-center gap-1 shadow-xs"
                          >
                            <Plus className="w-3.5 h-3.5" /> Add
                          </button>
                        )
                      ) : (
                        <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                          Sold Out
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right: Item Image */}
                  <div
                    onClick={() => setActiveItemModal(item)}
                    className="w-24 h-24 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 cursor-pointer relative shadow-inner"
                  >
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      loading="lazy"
                    />
                    {item.calories && (
                      <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-xs text-[9px] font-bold text-white">
                        {item.calories} kcal
                      </span>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Floating Cart Pill (if items in cart) */}
        {totalCartCount > 0 && (
          <div className="fixed bottom-4 left-0 right-0 z-40 px-4 max-w-md mx-auto">
            <button
              onClick={() => setCartOpen(true)}
              className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-[#071321] via-[#0b2447] to-[#071321] text-white shadow-xl shadow-navy-950/30 flex items-center justify-between border border-blue-500/30 animate-in slide-in-from-bottom-4 duration-300"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#087BEE] flex items-center justify-center font-bold text-xs text-white">
                  {totalCartCount}
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-white leading-none">View Table Order</p>
                  <p className="text-[10px] text-cyan-300 mt-0.5">Ready to order</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm font-extrabold text-white">
                  {formatCurrency(totalCartPrice, business.currency)}
                </span>
                <ShoppingBag className="w-4 h-4 text-cyan-400" />
              </div>
            </button>
          </div>
        )}

        {/* ============================================================== */}
        {/* MODAL: ITEM DETAILS                                            */}
        {/* ============================================================== */}
        {activeItemModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-white w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl relative border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
              <button
                onClick={() => setActiveItemModal(null)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 backdrop-blur-md"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative h-48 w-full bg-slate-900">
                <img
                  src={activeItemModal.image_url}
                  alt={activeItemModal.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span
                      className={`w-3.5 h-3.5 border flex items-center justify-center p-0.5 rounded-xs ${
                        activeItemModal.is_vegetarian
                          ? 'border-emerald-600'
                          : 'border-rose-600'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          activeItemModal.is_vegetarian
                            ? 'bg-emerald-600'
                            : 'bg-rose-600'
                        }`}
                      />
                    </span>
                    <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                      {activeItemModal.is_vegetarian ? 'Vegetarian' : 'Non-Vegetarian'}
                    </span>
                    {activeItemModal.is_popular && (
                      <span className="ml-auto inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">
                        <Sparkles className="w-2.5 h-2.5" /> Popular
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-[#071321]">{activeItemModal.name}</h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {activeItemModal.description}
                  </p>
                </div>

                {activeItemModal.allergens && activeItemModal.allergens.length > 0 && (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                    <span className="font-bold text-slate-700">Allergens:</span>{' '}
                    <span className="text-slate-600">
                      {activeItemModal.allergens.join(', ')}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">Price</span>
                    <span className="text-lg font-black text-[#071321]">
                      {formatCurrency(activeItemModal.price, business.currency)}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      addToCart(activeItemModal)
                      setActiveItemModal(null)
                    }}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#087BEE] to-[#13C8F4] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all"
                  >
                    Add to Order
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* DRAWER: TABLE CART & ORDER SUMMARY                             */}
        {/* ============================================================== */}
        {cartOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs">
            <div className="bg-white w-full max-w-md rounded-t-3xl p-6 shadow-2xl relative border-t border-slate-200 animate-in slide-in-from-bottom duration-300 max-h-[85vh] flex flex-col">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-[#087BEE]" />
                  <h3 className="text-base font-bold text-[#071321]">Your Table Order</h3>
                </div>
                <button
                  onClick={() => setCartOpen(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto py-3 space-y-3">
                {cart.map(({ item, count }) => (
                  <div key={item.id} className="flex items-center justify-between text-xs">
                    <div className="flex-1 pr-3">
                      <p className="font-bold text-slate-900">{item.name}</p>
                      <p className="text-slate-500">
                        {formatCurrency(item.price, business.currency)} × {count}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-1">
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-1 text-slate-600 hover:text-red-600"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-bold text-slate-800 w-4 text-center">{count}</span>
                      <button
                        onClick={() => addToCart(item)}
                        className="p-1 text-slate-600 hover:text-[#087BEE]"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order total & confirmation info */}
              <div className="pt-4 border-t border-slate-200 space-y-3">
                <div className="flex justify-between text-sm font-bold text-[#071321]">
                  <span>Total Amount</span>
                  <span>{formatCurrency(totalCartPrice, business.currency)}</span>
                </div>
                <p className="text-[11px] text-slate-500 text-center">
                  Show your selected items to your table server or place directly.
                </p>
                <button
                  onClick={() => {
                    alert('Order requested! Present your screen to the waiter or cashier.')
                    setCart([])
                    setCartOpen(false)
                  }}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#087BEE] to-[#13C8F4] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" /> Confirm Order with Server
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

