import { useEffect, useMemo, useState } from 'react'
import {
  ArrowDown, ArrowRight, BadgeCheck, Check, ChevronDown, Headphones,
  Menu, Minus, Plus, Search, ShieldCheck, ShoppingBag, ShoppingCart,
  Smartphone, Truck, X, Zap, MessageCircle, PackageCheck, Trash2,
} from 'lucide-react'
import { products } from './data/products.js'

const WHATSAPP_NUMBER = '94740785016' // Sri Lanka country code; digits only.
const DELIVERY_FEE = 350 // Edit this amount to change the standard delivery fee.
const CURRENCY = 'LKR'

const money = (amount) =>
  new Intl.NumberFormat('en-LK', { style: 'currency', currency: CURRENCY, maximumFractionDigits: 0 }).format(amount)

function BrandMark() {
  return (
    <a href="#home" className="flex items-center gap-3" aria-label="VEN-DENS home">
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-500 text-white shadow-lg shadow-blue-500/25">
        <Zap size={23} fill="currentColor" />
      </span>
      <span className="leading-tight">
        <span className="block text-lg font-black tracking-[.18em] text-white">VEN-DENS</span>
        <span className="block text-[9px] font-semibold uppercase tracking-[.27em] text-slate-500">Electronics & accessories</span>
      </span>
    </a>
  )
}

function ProductCard({ product, addToCart }) {
  return (
    <article className="product-card group overflow-hidden rounded-2xl border border-white/[.07] bg-[#11151d] transition duration-300 hover:-translate-y-1 hover:border-blue-400/40 hover:shadow-glow">
      <div className="relative aspect-[4/3] overflow-hidden bg-[#171d28]">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="product-image h-full w-full object-cover"
          onError={(event) => {
            event.currentTarget.style.display = 'none'
            event.currentTarget.parentElement.classList.add('image-fallback')
          }}
        />
        {product.badge && (
          <span className="absolute left-3 top-3 rounded-md border border-blue-300/20 bg-blue-500/15 px-2.5 py-1 text-[10px] font-bold tracking-[.12em] text-blue-300 backdrop-blur">
            {product.badge}
          </span>
        )}
        {!product.available && (
          <div className="absolute inset-0 grid place-items-center bg-black/65">
            <span className="rounded-full border border-white/15 bg-black/50 px-4 py-2 text-xs font-semibold text-white">Currently unavailable</span>
          </div>
        )}
        <span className="absolute bottom-3 right-3 rounded-full border border-white/10 bg-black/50 px-2.5 py-1 text-[10px] text-slate-200 backdrop-blur">
          {product.category}
        </span>
      </div>
      <div className="p-4 sm:p-5">
        <h3 className="min-h-11 text-sm font-semibold leading-5 text-white sm:text-base">{product.name}</h3>
        <p className="mt-2 min-h-10 text-xs leading-5 text-slate-400">{product.description}</p>
        <div className="mt-4 flex flex-wrap items-baseline gap-2">
          <span className="text-lg font-extrabold tracking-tight text-white">{money(product.price)}</span>
          {product.oldPrice && <span className="text-xs text-slate-500 line-through">{money(product.oldPrice)}</span>}
        </div>
        <button
          onClick={() => addToCart(product)}
          disabled={!product.available}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-blue-400/30 bg-blue-500/10 px-3 py-3 text-sm font-bold text-blue-300 transition hover:border-blue-400 hover:bg-blue-500 hover:text-white disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-white/5 disabled:text-slate-500"
        >
          <Plus size={16} /> {product.available ? 'Add to cart' : 'Out of stock'}
        </button>
      </div>
    </article>
  )
}

function CartDrawer({ open, onClose, cart, updateQty, removeItem, subtotal, onCheckout }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50">
      <button aria-label="Close cart overlay" onClick={onClose} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-white/10 bg-[#0d1017] shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.2em] text-blue-400">Your selection</p>
            <h2 className="mt-1 text-xl font-bold">Shopping cart</h2>
          </div>
          <button onClick={onClose} aria-label="Close cart" className="rounded-xl border border-white/10 p-2 text-slate-300 hover:bg-white/5"><X size={20} /></button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {cart.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <span className="grid h-16 w-16 place-items-center rounded-2xl bg-white/5 text-slate-400"><ShoppingBag size={28} /></span>
              <h3 className="mt-4 font-bold">Your cart is empty</h3>
              <p className="mt-2 max-w-xs text-sm text-slate-400">Find something you love and add it to your cart.</p>
              <button onClick={onClose} className="mt-5 rounded-xl bg-blue-500 px-5 py-3 text-sm font-bold text-white hover:bg-blue-400">Explore products</button>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map(({ product, qty }) => (
                <div key={product.id} className="flex gap-3 rounded-2xl border border-white/[.07] bg-white/[.025] p-3">
                  <img src={product.image} alt="" className="h-20 w-20 rounded-xl bg-[#171d28] object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-sm font-semibold text-white">{product.name}</p>
                    <p className="mt-1 text-sm font-bold text-blue-300">{money(product.price)}</p>
                    <div className="mt-3 flex items-center gap-2">
                      <button onClick={() => updateQty(product.id, qty - 1)} aria-label="Decrease quantity" className="rounded-lg border border-white/10 p-1.5 hover:bg-white/10"><Minus size={13} /></button>
                      <span className="w-5 text-center text-sm">{qty}</span>
                      <button onClick={() => updateQty(product.id, qty + 1)} aria-label="Increase quantity" className="rounded-lg border border-white/10 p-1.5 hover:bg-white/10"><Plus size={13} /></button>
                      <button onClick={() => removeItem(product.id)} aria-label={`Remove ${product.name}`} className="ml-auto rounded-lg p-1.5 text-slate-500 hover:bg-red-500/10 hover:text-red-300"><Trash2 size={15} /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {cart.length > 0 && (
          <div className="border-t border-white/10 p-5">
            <div className="flex items-center justify-between text-sm text-slate-400"><span>Subtotal</span><span className="font-semibold text-white">{money(subtotal)}</span></div>
            <p className="mt-2 text-xs leading-5 text-slate-500">Delivery fee is confirmed at checkout. Pickup has no delivery fee.</p>
            <button onClick={onCheckout} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-500 px-4 py-4 text-sm font-extrabold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-400">
              Continue to checkout <ArrowRight size={17} />
            </button>
          </div>
        )}
      </aside>
    </div>
  )
}

function CheckoutModal({ open, onClose, cart, subtotal, onOrderSent }) {
  const [form, setForm] = useState({ name: '', phone: '', address: '', fulfilment: 'Delivery', note: '' })
  const [error, setError] = useState('')
  if (!open) return null

  const setField = (field, value) => setForm((current) => ({ ...current, [field]: value }))
  const deliveryFee = form.fulfilment === 'Delivery' ? DELIVERY_FEE : 0
  const total = subtotal + deliveryFee

  const submitOrder = (event) => {
    event.preventDefault()
    setError('')
    if (!form.name.trim()) return setError('Please enter your name.')
    if (!/^[0-9+\s()-]{7,16}$/.test(form.phone.trim())) return setError('Please enter a valid contact number.')
    if (form.fulfilment === 'Delivery' && !form.address.trim()) return setError('Please enter your delivery address.')
    if (cart.length === 0) return setError('Your cart is empty.')

    const orderId = `VD-${Date.now().toString().slice(-7)}`
    const orderLines = cart.map(({ product, qty }) => `• ${product.name} × ${qty} — ${money(product.price * qty)}`).join('\n')
    const message = [
      '🛍️ *NEW ORDER — VEN-DENS*',
      `Order reference: ${orderId}`,
      '',
      '*Customer details*',
      `Name: ${form.name.trim()}`,
      `Phone: ${form.phone.trim()}`,
      `Fulfilment: ${form.fulfilment}`,
      ...(form.fulfilment === 'Delivery' ? [`Address: ${form.address.trim()}`] : []),
      '',
      '*Order items*',
      orderLines,
      '',
      `Subtotal: ${money(subtotal)}`,
      `Delivery fee: ${money(deliveryFee)}`,
      `*TOTAL: ${money(total)}*`,
      ...(form.note.trim() ? ['', `Note: ${form.note.trim()}`] : []),
      '',
      'Please confirm availability and delivery details. Thank you!',
    ].join('\n')

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank', 'noopener,noreferrer')
    onOrderSent()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center overflow-y-auto bg-black/75 backdrop-blur-sm sm:items-center sm:p-4">
      <div className="my-auto w-full max-w-xl rounded-t-3xl border border-white/10 bg-[#0e121a] shadow-2xl sm:rounded-3xl">
        <div className="flex items-start justify-between border-b border-white/10 p-5 sm:p-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.2em] text-blue-400">Almost there</p>
            <h2 className="mt-1 text-xl font-extrabold sm:text-2xl">Checkout details</h2>
            <p className="mt-1 text-sm text-slate-400">Your order will open in WhatsApp for you to send.</p>
          </div>
          <button onClick={onClose} aria-label="Close checkout" className="rounded-xl border border-white/10 p-2 text-slate-300 hover:bg-white/5"><X size={20} /></button>
        </div>
        <form onSubmit={submitOrder} className="space-y-4 p-5 sm:p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium text-slate-300">Full name
              <input value={form.name} onChange={(e) => setField('name', e.target.value)} autoComplete="name" placeholder="Your name" className="mt-2 w-full rounded-xl border border-white/10 bg-[#090c12] px-3.5 py-3 text-white outline-none placeholder:text-slate-600 focus:border-blue-400" />
            </label>
            <label className="block text-sm font-medium text-slate-300">Contact number
              <input value={form.phone} onChange={(e) => setField('phone', e.target.value)} autoComplete="tel" type="tel" placeholder="07X XXX XXXX" className="mt-2 w-full rounded-xl border border-white/10 bg-[#090c12] px-3.5 py-3 text-white outline-none placeholder:text-slate-600 focus:border-blue-400" />
            </label>
          </div>
          <fieldset>
            <legend className="mb-2 text-sm font-medium text-slate-300">How would you like to receive your order?</legend>
            <div className="grid grid-cols-2 gap-3">
              {['Delivery', 'Customer pickup'].map((option) => (
                <button type="button" key={option} onClick={() => setField('fulfilment', option)} className={`rounded-xl border px-3 py-3 text-sm font-semibold transition ${form.fulfilment === option ? 'border-blue-400 bg-blue-500/10 text-blue-300' : 'border-white/10 bg-white/[.02] text-slate-400 hover:bg-white/5'}`}>
                  {option === 'Delivery' ? <Truck size={16} className="mr-2 inline" /> : <PackageCheck size={16} className="mr-2 inline" />}{option}
                </button>
              ))}
            </div>
          </fieldset>
          {form.fulfilment === 'Delivery' && (
            <label className="block text-sm font-medium text-slate-300">Delivery address
              <textarea value={form.address} onChange={(e) => setField('address', e.target.value)} rows={2} autoComplete="street-address" placeholder="House number, street, town" className="mt-2 w-full resize-y rounded-xl border border-white/10 bg-[#090c12] px-3.5 py-3 text-white outline-none placeholder:text-slate-600 focus:border-blue-400" />
            </label>
          )}
          <label className="block text-sm font-medium text-slate-300">Order note <span className="text-slate-600">(optional)</span>
            <textarea value={form.note} onChange={(e) => setField('note', e.target.value)} rows={2} placeholder="Colour, model, or delivery instructions" className="mt-2 w-full resize-y rounded-xl border border-white/10 bg-[#090c12] px-3.5 py-3 text-white outline-none placeholder:text-slate-600 focus:border-blue-400" />
          </label>
          <div className="rounded-2xl border border-white/[.07] bg-white/[.025] p-4">
            <div className="flex justify-between text-sm text-slate-400"><span>Subtotal</span><span>{money(subtotal)}</span></div>
            <div className="mt-2 flex justify-between text-sm text-slate-400"><span>{form.fulfilment === 'Delivery' ? 'Delivery fee' : 'Pickup fee'}</span><span>{money(deliveryFee)}</span></div>
            <div className="mt-3 flex justify-between border-t border-white/10 pt-3"><span className="font-semibold">Total</span><span className="text-xl font-extrabold text-white">{money(total)}</span></div>
          </div>
          {error && <p role="alert" className="rounded-lg border border-red-400/20 bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</p>}
          <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#22c55e] px-4 py-4 text-sm font-extrabold text-[#04140a] transition hover:bg-[#4ade80]">
            <MessageCircle size={19} /> Send order through WhatsApp
          </button>
          <p className="text-center text-[11px] leading-5 text-slate-500">No online payment is collected on this website. Your order is submitted only when you send the message in WhatsApp.</p>
        </form>
      </div>
    </div>
  )
}

export default function App() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [sort, setSort] = useState('featured')
  const [cart, setCart] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('ven-dens-cart') || '[]')
      return Array.isArray(saved) ? saved.filter((item) => products.some((p) => p.id === item.id) && Number.isInteger(item.qty) && item.qty > 0).map((item) => ({ product: products.find((p) => p.id === item.id), qty: item.qty })) : []
    } catch {
      return []
    }
  })
  const [cartOpen, setCartOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [mobileMenu, setMobileMenu] = useState(false)
  const [toast, setToast] = useState('')

  useEffect(() => {
    localStorage.setItem('ven-dens-cart', JSON.stringify(cart.map(({ product, qty }) => ({ id: product.id, qty }))))
  }, [cart])

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(''), 2600)
    return () => window.clearTimeout(timer)
  }, [toast])

  const categories = useMemo(() => ['All', ...new Set(products.map((p) => p.category))], [])
  const filteredProducts = useMemo(() => {
    let result = products.filter((p) => {
      const matchesCategory = category === 'All' || p.category === category
      const term = search.trim().toLowerCase()
      const matchesSearch = !term || `${p.name} ${p.category} ${p.description}`.toLowerCase().includes(term)
      return matchesCategory && matchesSearch
    })
    if (sort === 'price-low') result = [...result].sort((a, b) => a.price - b.price)
    if (sort === 'price-high') result = [...result].sort((a, b) => b.price - a.price)
    if (sort === 'name') result = [...result].sort((a, b) => a.name.localeCompare(b.name))
    return result
  }, [category, search, sort])

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0)
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.qty, 0)

  const addToCart = (product) => {
    if (!product.available) return
    setCart((current) => {
      const existing = current.find((item) => item.product.id === product.id)
      return existing
        ? current.map((item) => item.product.id === product.id ? { ...item, qty: item.qty + 1 } : item)
        : [...current, { product, qty: 1 }]
    })
    setToast(`${product.name} added to cart`)
  }

  const updateQty = (id, qty) => {
    if (qty <= 0) return setCart((current) => current.filter((item) => item.product.id !== id))
    setCart((current) => current.map((item) => item.product.id === id ? { ...item, qty } : item))
  }
  const removeItem = (id) => setCart((current) => current.filter((item) => item.product.id !== id))
  const openCheckout = () => {
    setCartOpen(false)
    setCheckoutOpen(true)
  }

  return (
    <div className="min-h-screen overflow-hidden bg-[#090b10] text-slate-100">
      <div className="border-b border-blue-400/10 bg-blue-500/[.07]">
        <div className="container-wide flex min-h-9 items-center justify-center gap-2 py-2 text-center text-[10px] font-semibold tracking-wide text-blue-100 sm:text-xs">
          <Zap size={13} className="text-blue-300" /> ELECTRONICS THAT KEEP YOU CONNECTED <span className="hidden text-blue-300/60 sm:inline">•</span><span className="hidden sm:inline">Order directly through WhatsApp</span>
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b border-white/[.07] bg-[#090b10]/90 backdrop-blur-xl">
        <div className="container-wide flex h-[76px] items-center justify-between gap-4">
          <BrandMark />
          <nav className="hidden items-center gap-8 text-sm text-slate-400 md:flex">
            <a href="#home" className="transition hover:text-white">Home</a>
            <a href="#products" className="transition hover:text-white">Shop all</a>
            <a href="#why-us" className="transition hover:text-white">Why VEN-DENS</a>
          </nav>
          <div className="flex items-center gap-2">
            <button onClick={() => { setCartOpen(true); setMobileMenu(false) }} className="relative flex items-center gap-2 rounded-xl border border-white/10 bg-white/[.04] px-3.5 py-2.5 text-sm font-semibold transition hover:border-blue-400/40 hover:bg-blue-500/10" aria-label={`Open cart, ${cartCount} items`}>
              <ShoppingCart size={18} /><span className="hidden sm:inline">Cart</span>
              <span className="grid h-5 min-w-5 place-items-center rounded-full bg-blue-500 px-1 text-[10px] font-extrabold text-white">{cartCount}</span>
            </button>
            <button className="rounded-xl border border-white/10 p-2.5 md:hidden" aria-label="Toggle menu" onClick={() => setMobileMenu((v) => !v)}>{mobileMenu ? <X size={19} /> : <Menu size={19} />}</button>
          </div>
        </div>
        {mobileMenu && <nav className="container-wide grid gap-1 border-t border-white/10 py-3 text-sm text-slate-300 md:hidden"><a className="rounded-lg px-3 py-2 hover:bg-white/5" href="#home" onClick={() => setMobileMenu(false)}>Home</a><a className="rounded-lg px-3 py-2 hover:bg-white/5" href="#products" onClick={() => setMobileMenu(false)}>Shop all</a><a className="rounded-lg px-3 py-2 hover:bg-white/5" href="#why-us" onClick={() => setMobileMenu(false)}>Why VEN-DENS</a></nav>}
      </header>

      <main>
        <section id="home" className="blue-grid relative isolate">
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_70%_35%,rgba(37,99,235,.18),transparent_48%),linear-gradient(180deg,rgba(9,11,16,.05),#090b10)]" />
          <div className="container-wide grid min-h-[510px] items-center gap-8 py-14 md:grid-cols-[1.05fr_.95fr] md:py-20">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-blue-300/20 bg-blue-400/[.08] px-3.5 py-2 text-[10px] font-bold uppercase tracking-[.18em] text-blue-300 sm:text-xs"><span className="h-1.5 w-1.5 rounded-full bg-blue-400" /> Your tech. Your way.</span>
              <h1 className="mt-6 text-4xl font-black leading-[1.08] tracking-[-.045em] text-white sm:text-5xl lg:text-6xl">Upgrade your world.<br /><span className="bg-gradient-to-r from-blue-300 via-blue-500 to-cyan-300 bg-clip-text text-transparent">Power your day.</span></h1>
              <p className="mt-5 max-w-lg text-sm leading-7 text-slate-400 sm:text-base">Discover everyday electronics and must-have accessories. Find your next favourite tech and order directly with VEN-DENS on WhatsApp.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#products" className="inline-flex items-center gap-2 rounded-xl bg-blue-500 px-5 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-400">Explore products <ArrowRight size={17} /></a>
                <a href="#why-us" className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[.03] px-5 py-3.5 text-sm font-bold text-slate-200 transition hover:bg-white/[.07]">Why shop with us?</a>
              </div>
              <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-xs text-slate-400">
                <span className="flex items-center gap-2"><Check size={15} className="text-blue-400" /> Easy WhatsApp ordering</span>
                <span className="flex items-center gap-2"><Check size={15} className="text-blue-400" /> Delivery or pickup</span>
              </div>
            </div>
            <div className="relative mx-auto w-full max-w-lg">
              <div className="absolute inset-10 rounded-full bg-blue-500/20 blur-3xl" />
              <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-[#1c2638] via-[#111722] to-[#0a0d13] p-3 shadow-2xl shadow-blue-950/40">
                <img src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1100&q=85" alt="Modern electronics and technology workspace" className="h-[290px] w-full rounded-[1.5rem] object-cover opacity-85 sm:h-[360px]" />
                <div className="absolute inset-x-6 bottom-6 rounded-2xl border border-white/10 bg-[#0b0f17]/90 p-4 backdrop-blur-xl sm:inset-x-8 sm:bottom-8 sm:p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div><p className="text-[10px] font-bold uppercase tracking-[.2em] text-blue-300">Discover your next upgrade</p><p className="mt-1 text-base font-bold text-white sm:text-lg">Tech essentials. One place.</p></div>
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-blue-500 text-white"><Headphones size={22} /></span>
                  </div>
                </div>
              </div>
              <div className="absolute -right-2 top-8 hidden items-center gap-2 rounded-xl border border-white/10 bg-[#141a25]/95 px-3 py-2.5 text-xs font-semibold shadow-xl sm:flex"><ShieldCheck size={16} className="text-blue-300" /> Simple & direct ordering</div>
            </div>
          </div>
        </section>

        <section className="border-y border-white/[.06] bg-[#0d1017]">
          <div className="container-wide grid grid-cols-1 gap-4 py-5 sm:grid-cols-3 sm:gap-6">
            <div className="flex items-center justify-center gap-3 py-2 sm:justify-start"><span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-500/10 text-blue-300"><MessageCircle size={19} /></span><div><p className="text-sm font-bold">Order on WhatsApp</p><p className="mt-0.5 text-xs text-slate-500">Talk to us directly</p></div></div>
            <div className="flex items-center justify-center gap-3 py-2 sm:justify-center"><span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-500/10 text-blue-300"><Truck size={19} /></span><div><p className="text-sm font-bold">Flexible fulfilment</p><p className="mt-0.5 text-xs text-slate-500">Delivery or customer pickup</p></div></div>
            <div className="flex items-center justify-center gap-3 py-2 sm:justify-end"><span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-500/10 text-blue-300"><BadgeCheck size={19} /></span><div><p className="text-sm font-bold">Personal service</p><p className="mt-0.5 text-xs text-slate-500">Confirm details with our team</p></div></div>
          </div>
        </section>

        <section id="products" className="container-wide scroll-mt-24 py-16 sm:py-20">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[.22em] text-blue-400">The collection</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">Find your next favourite.</h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400">Explore practical tech, everyday accessories and upgrades worth adding to your setup.</p>
            </div>
            <span className="text-sm text-slate-500">{filteredProducts.length} product{filteredProducts.length === 1 ? '' : 's'} found</span>
          </div>

          <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-sm">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..." aria-label="Search products" className="w-full rounded-xl border border-white/10 bg-[#11151d] py-3.5 pl-11 pr-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-blue-400/60" />
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
                {categories.map((item) => <button key={item} onClick={() => setCategory(item)} className={`shrink-0 rounded-full border px-4 py-2.5 text-xs font-bold transition ${category === item ? 'border-blue-400 bg-blue-500 text-white' : 'border-white/10 bg-white/[.025] text-slate-400 hover:border-white/20 hover:text-white'}`}>{item}</button>)}
              </div>
              <label className="flex shrink-0 items-center gap-2 text-xs text-slate-400">Sort by
                <span className="relative"><select value={sort} onChange={(e) => setSort(e.target.value)} className="appearance-none rounded-xl border border-white/10 bg-[#11151d] py-2.5 pl-3 pr-8 text-xs font-semibold text-slate-200 outline-none focus:border-blue-400"><option value="featured">Featured</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option><option value="name">Name</option></select><ChevronDown size={13} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2" /></span>
              </label>
            </div>
          </div>

          {filteredProducts.length ? (
            <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
              {filteredProducts.map((product) => <ProductCard key={product.id} product={product} addToCart={addToCart} />)}
            </div>
          ) : (
            <div className="mt-8 rounded-2xl border border-white/10 bg-[#11151d] px-5 py-14 text-center">
              <Search className="mx-auto text-slate-500" size={30} /><h3 className="mt-4 font-bold">No products found</h3><p className="mt-2 text-sm text-slate-400">Try another search term or category.</p>
              <button onClick={() => { setSearch(''); setCategory('All') }} className="mt-4 text-sm font-bold text-blue-300 hover:text-blue-200">Clear filters</button>
            </div>
          )}
        </section>

        <section id="why-us" className="scroll-mt-24 border-y border-white/[.06] bg-[#0d1017]">
          <div className="container-wide py-16 sm:py-20">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-extrabold uppercase tracking-[.22em] text-blue-400">Why VEN-DENS</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">Shopping made straightforward.</h2>
              <p className="mt-4 text-sm leading-7 text-slate-400">Browse at your own pace, build your order, and send it to us through WhatsApp. We can confirm stock, delivery arrangements and payment details with you directly.</p>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/[.07] bg-[#11151d] p-6"><span className="grid h-11 w-11 place-items-center rounded-xl bg-blue-500/10 text-blue-300"><Search size={21} /></span><h3 className="mt-5 font-bold">Easy to explore</h3><p className="mt-2 text-sm leading-6 text-slate-400">Search by name, browse categories and compare prices before ordering.</p></div>
              <div className="rounded-2xl border border-white/[.07] bg-[#11151d] p-6"><span className="grid h-11 w-11 place-items-center rounded-xl bg-blue-500/10 text-blue-300"><ShoppingBag size={21} /></span><h3 className="mt-5 font-bold">A clear order summary</h3><p className="mt-2 text-sm leading-6 text-slate-400">Your chosen products, quantities, subtotal and delivery fee are included.</p></div>
              <div className="rounded-2xl border border-white/[.07] bg-[#11151d] p-6"><span className="grid h-11 w-11 place-items-center rounded-xl bg-blue-500/10 text-blue-300"><MessageCircle size={21} /></span><h3 className="mt-5 font-bold">Direct communication</h3><p className="mt-2 text-sm leading-6 text-slate-400">Send your order and confirm stock, payment and delivery with our team.</p></div>
            </div>
          </div>
        </section>

        <section className="container-wide py-14">
          <div className="relative overflow-hidden rounded-3xl border border-blue-300/15 bg-gradient-to-br from-[#15213a] via-[#111927] to-[#0d1017] px-6 py-10 sm:px-10 sm:py-12">
            <div className="absolute -right-10 -top-20 h-64 w-64 rounded-full bg-blue-500/15 blur-3xl" />
            <div className="relative flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
              <div><p className="text-xs font-bold uppercase tracking-[.2em] text-blue-300">Ready when you are</p><h2 className="mt-3 text-2xl font-black text-white sm:text-3xl">Your next tech upgrade starts here.</h2><p className="mt-2 text-sm text-slate-400">Pick your products and send us your order.</p></div>
              <a href="#products" className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-blue-500 px-5 py-3.5 text-sm font-extrabold text-white transition hover:bg-blue-400">Shop the collection <ArrowDown size={16} /></a>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/[.07] bg-[#07090d]">
        <div className="container-wide flex flex-col gap-5 py-8 sm:flex-row sm:items-center sm:justify-between">
          <BrandMark />
          <p className="text-xs leading-5 text-slate-500">© {new Date().getFullYear()} VEN-DENS. All rights reserved.</p>
          <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-300 transition hover:text-green-300"><MessageCircle size={17} /> Chat with us</a>
        </div>
      </footer>

      {toast && <div role="status" className="fixed bottom-5 left-1/2 z-[70] flex max-w-[calc(100%-32px)] -translate-x-1/2 items-center gap-2 rounded-xl border border-blue-300/20 bg-[#151d2a] px-4 py-3 text-sm font-semibold text-white shadow-2xl"><Check size={17} className="shrink-0 text-green-400" />{toast}</div>}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} cart={cart} updateQty={updateQty} removeItem={removeItem} subtotal={subtotal} onCheckout={openCheckout} />
      <CheckoutModal open={checkoutOpen} onClose={() => setCheckoutOpen(false)} cart={cart} subtotal={subtotal} onOrderSent={() => { setCart([]); setToast('WhatsApp opened. Send the message to place your order.') }} />
      <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer" aria-label="Chat with VEN-DENS on WhatsApp" className="fixed bottom-5 right-4 z-30 grid h-12 w-12 place-items-center rounded-full bg-[#22c55e] text-[#06210f] shadow-lg shadow-green-950/40 transition hover:scale-105 hover:bg-[#4ade80] sm:bottom-6 sm:right-6"><MessageCircle size={23} /></a>
    </div>
  )
}
