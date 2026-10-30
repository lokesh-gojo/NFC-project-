import React, { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import {
  getMenuCategories,
  getMenuItems,
  saveMenuCategory,
  deleteMenuCategory,
  saveMenuItem,
  deleteMenuItem
} from '@/services/dataService'
import { MenuCategory, MenuItem } from '@/types'
import { formatCurrency } from '@/lib/utils'
import {
  UtensilsCrossed,
  Plus,
  Edit2,
  Trash2,
  Search,
  Sparkles,
  Flame,
  Leaf,
  X,
  Check,
  FolderPlus,
  Eye,
  EyeOff
} from 'lucide-react'

export const MenuManagementPage: React.FC = () => {
  const { currentBusiness } = useAuth()
  const [categories, setCategories] = useState<MenuCategory[]>([])
  const [items, setItems] = useState<MenuItem[]>([])
  const [activeCategoryId, setActiveCategoryId] = useState<string>('all')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  // Modals state
  const [itemModalOpen, setItemModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [categoryModalOpen, setCategoryModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(null)

  // Category Form State
  const [catName, setCatName] = useState('')
  const [catDesc, setCatDesc] = useState('')

  // Item Form State
  const [itemName, setItemName] = useState('')
  const [itemCategory, setItemCategory] = useState('')
  const [itemPrice, setItemPrice] = useState<number | ''>(250)
  const [itemDesc, setItemDesc] = useState('')
  const [itemImage, setItemImage] = useState('')
  const [itemIsVeg, setItemIsVeg] = useState(true)
  const [itemIsPopular, setItemIsPopular] = useState(false)
  const [itemIsAvailable, setItemIsAvailable] = useState(true)
  const [itemCalories, setItemCalories] = useState<number | ''>('')
  const [itemAllergens, setItemAllergens] = useState('')

  useEffect(() => {
    loadData()
  }, [currentBusiness])

  async function loadData() {
    if (!currentBusiness) return
    setLoading(true)
    try {
      const [cats, its] = await Promise.all([
        getMenuCategories(currentBusiness.id),
        getMenuItems(currentBusiness.id)
      ])
      setCategories(cats)
      setItems(its)
      if (cats.length > 0 && !itemCategory) {
        setItemCategory(cats[0].id)
      }
    } catch (err) {
      console.error('Error loading menu:', err)
    } finally {
      setLoading(false)
    }
  }

  // Open item modal for Create or Edit
  const handleOpenItemModal = (item?: MenuItem) => {
    if (item) {
      setEditingItem(item)
      setItemName(item.name)
      setItemCategory(item.category_id)
      setItemPrice(item.price)
      setItemDesc(item.description || '')
      setItemImage(item.image_url || '')
      setItemIsVeg(item.is_vegetarian)
      setItemIsPopular(item.is_popular)
      setItemIsAvailable(item.is_available)
      setItemCalories(item.calories || '')
      setItemAllergens(item.allergens ? item.allergens.join(', ') : '')
    } else {
      setEditingItem(null)
      setItemName('')
      setItemCategory(categories[0]?.id || '')
      setItemPrice(250)
      setItemDesc('')
      setItemImage('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80')
      setItemIsVeg(true)
      setItemIsPopular(false)
      setItemIsAvailable(true)
      setItemCalories('')
      setItemAllergens('')
    }
    setItemModalOpen(true)
  }

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentBusiness || !itemName.trim() || itemPrice === '') return

    const allergensList = itemAllergens
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)

    await saveMenuItem({
      id: editingItem?.id,
      business_id: currentBusiness.id,
      category_id: itemCategory,
      name: itemName,
      description: itemDesc,
      price: Number(itemPrice),
      image_url: itemImage,
      is_vegetarian: itemIsVeg,
      is_popular: itemIsPopular,
      is_available: itemIsAvailable,
      calories: itemCalories ? Number(itemCalories) : undefined,
      allergens: allergensList
    })

    setItemModalOpen(false)
    await loadData()
  }

  const handleDeleteItem = async (id: string) => {
    if (confirm('Are you sure you want to delete this menu item?')) {
      await deleteMenuItem(id)
      await loadData()
    }
  }

  const handleToggleAvailability = async (item: MenuItem) => {
    if (!currentBusiness) return
    await saveMenuItem({
      ...item,
      is_available: !item.is_available
    })
    await loadData()
  }

  // Category handlers
  const handleOpenCatModal = (cat?: MenuCategory) => {
    if (cat) {
      setEditingCategory(cat)
      setCatName(cat.name)
      setCatDesc(cat.description || '')
    } else {
      setEditingCategory(null)
      setCatName('')
      setCatDesc('')
    }
    setCategoryModalOpen(true)
  }

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentBusiness || !catName.trim()) return

    await saveMenuCategory({
      id: editingCategory?.id,
      business_id: currentBusiness.id,
      name: catName,
      description: catDesc,
      sort_order: editingCategory?.sort_order ?? categories.length + 1
    })

    setCategoryModalOpen(false)
    await loadData()
  }

  const handleDeleteCategory = async (id: string) => {
    const itemsInCat = items.filter((i) => i.category_id === id).length
    if (itemsInCat > 0) {
      alert(`Cannot delete this category because it contains ${itemsInCat} menu items. Move or delete them first.`)
      return
    }
    if (confirm('Delete this menu category?')) {
      await deleteMenuCategory(id)
      await loadData()
    }
  }

  const filteredItems = items.filter((item) => {
    if (activeCategoryId !== 'all' && item.category_id !== activeCategoryId) {
      return false
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      return item.name.toLowerCase().includes(q) || item.description?.toLowerCase().includes(q)
    }
    return true
  })

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[#071321] tracking-tight flex items-center gap-2">
            <UtensilsCrossed className="w-6 h-6 text-[#087BEE]" /> Digital Menu Manager
          </h2>
          <p className="text-xs text-slate-500">
            Organize dishes, update prices in real-time and toggle item availability.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => handleOpenCatModal()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all border border-slate-300/80"
          >
            <FolderPlus className="w-4 h-4 text-slate-600" /> Add Category
          </button>

          <button
            onClick={() => handleOpenItemModal()}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#087BEE] to-[#13C8F4] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all"
          >
            <Plus className="w-4 h-4" /> Add Menu Item
          </button>
        </div>
      </div>

      {/* Categories Bar & Search */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 flex-1 no-scrollbar">
            <button
              onClick={() => setActiveCategoryId('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex-shrink-0 transition-all ${
                activeCategoryId === 'all'
                  ? 'bg-[#071321] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Items ({items.length})
            </button>
            {categories.map((cat) => (
              <div key={cat.id} className="relative group flex-shrink-0 flex items-center">
                <button
                  onClick={() => setActiveCategoryId(cat.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    activeCategoryId === cat.id
                      ? 'bg-[#087BEE] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat.name} ({items.filter((i) => i.category_id === cat.id).length})
                </button>
                <div className="hidden group-hover:flex items-center gap-1 ml-1 bg-white p-1 rounded-lg shadow border border-slate-200 absolute -top-8 left-0 z-10">
                  <button
                    onClick={() => handleOpenCatModal(cat)}
                    className="p-1 text-slate-500 hover:text-blue-600"
                    title="Edit Category"
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(cat.id)}
                    className="p-1 text-slate-500 hover:text-red-600"
                    title="Delete Category"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search dishes..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-100 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#087BEE] border border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Menu Items Table / Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => {
          const cat = categories.find((c) => c.id === item.category_id)
          return (
            <div
              key={item.id}
              className={`bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs hover:shadow-md transition-all flex flex-col justify-between ${
                !item.is_available ? 'opacity-60 bg-slate-50/50' : ''
              }`}
            >
              <div>
                <div className="relative h-40 w-full rounded-xl overflow-hidden bg-slate-100 mb-3">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute top-2 left-2 flex gap-1.5">
                    <span
                      className={`w-4 h-4 rounded-xs border flex items-center justify-center p-0.5 bg-white shadow-xs ${
                        item.is_vegetarian ? 'border-emerald-600' : 'border-rose-600'
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          item.is_vegetarian ? 'bg-emerald-600' : 'bg-rose-600'
                        }`}
                      />
                    </span>
                    {item.is_popular && (
                      <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                        <Flame className="w-3 h-3" /> Popular
                      </span>
                    )}
                  </div>

                  <span className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-xs text-white text-xs font-black px-2 py-1 rounded-lg">
                    {formatCurrency(item.price, currentBusiness?.currency)}
                  </span>
                </div>

                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                      {cat?.name || 'Menu'}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 leading-tight">{item.name}</h4>
                  </div>
                </div>

                {item.description && (
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                    {item.description}
                  </p>
                )}
              </div>

              {/* Action Controls */}
              <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <button
                  onClick={() => handleToggleAvailability(item)}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold text-[11px] transition-colors ${
                    item.is_available
                      ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                      : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                  }`}
                  title="Toggle In-Stock / Sold-Out"
                >
                  {item.is_available ? (
                    <>
                      <Eye className="w-3 h-3" /> Available
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-3 h-3" /> Sold Out
                    </>
                  )}
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenItemModal(item)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                    title="Edit Item"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Delete Item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* ============================================================== */}
      {/* MODAL: ITEM ADD / EDIT                                         */}
      {/* ============================================================== */}
      {itemModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl relative border border-slate-100 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setItemModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-[#071321] mb-4">
              {editingItem ? 'Edit Menu Product' : 'Add New Menu Product'}
            </h3>

            <form onSubmit={handleSaveItem} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  placeholder="e.g. Signature Velvet Flat White"
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#087BEE]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category *</label>
                  <select
                    value={itemCategory}
                    onChange={(e) => setItemCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#087BEE] bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Price ({currentBusiness?.currency || 'INR'}) *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    step={1}
                    value={itemPrice}
                    onChange={(e) => setItemPrice(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#087BEE]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Image URL</label>
                <input
                  type="text"
                  value={itemImage}
                  onChange={(e) => setItemImage(e.target.value)}
                  placeholder="https://..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#087BEE]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={itemDesc}
                  onChange={(e) => setItemDesc(e.target.value)}
                  placeholder="Flavour notes, ingredients or preparation technique..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#087BEE]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Calories (kcal)</label>
                  <input
                    type="number"
                    value={itemCalories}
                    onChange={(e) => setItemCalories(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="e.g. 140"
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#087BEE]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Allergens (comma separated)</label>
                  <input
                    type="text"
                    value={itemAllergens}
                    onChange={(e) => setItemAllergens(e.target.value)}
                    placeholder="Dairy, Gluten, Nuts"
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#087BEE]"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={itemIsVeg}
                    onChange={(e) => setItemIsVeg(e.target.checked)}
                    className="rounded text-[#087BEE] focus:ring-[#087BEE] w-4 h-4"
                  />
                  <span className="font-semibold text-slate-700">Vegetarian Dish</span>
                </label>

                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={itemIsPopular}
                    onChange={(e) => setItemIsPopular(e.target.checked)}
                    className="rounded text-[#087BEE] focus:ring-[#087BEE] w-4 h-4"
                  />
                  <span className="font-semibold text-slate-700">Mark as Popular / Chef's Pick</span>
                </label>

                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={itemIsAvailable}
                    onChange={(e) => setItemIsAvailable(e.target.checked)}
                    className="rounded text-[#087BEE] focus:ring-[#087BEE] w-4 h-4"
                  />
                  <span className="font-semibold text-slate-700">In-Stock / Available</span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setItemModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-bold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#087BEE] to-[#13C8F4] text-white font-bold shadow-md hover:shadow-lg transition-all"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: CATEGORY ADD / EDIT                                     */}
      {/* ============================================================== */}
      {categoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl relative border border-slate-100 animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setCategoryModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-[#071321] mb-3">
              {editingCategory ? 'Edit Menu Category' : 'Create Category'}
            </h3>

            <form onSubmit={handleSaveCategory} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Category Title *</label>
                <input
                  type="text"
                  required
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  placeholder="e.g. Specialty Coffees, Desserts"
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#087BEE]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description (Optional)</label>
                <textarea
                  rows={2}
                  value={catDesc}
                  onChange={(e) => setCatDesc(e.target.value)}
                  placeholder="Brief note about this category..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#087BEE]"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCategoryModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-bold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#087BEE] text-white font-bold shadow hover:bg-blue-600"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

