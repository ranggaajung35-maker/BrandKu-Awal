import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Star, 
  ShoppingBag, 
  Filter, 
  ArrowUpDown, 
  Code2, 
  Eye, 
  RefreshCw, 
  BarChart3, 
  X, 
  SlidersHorizontal, 
  Sparkles, 
  TrendingUp, 
  Tag, 
  Copy, 
  Check,
  AlertCircle
} from 'lucide-react';

export default function App() {
  // Data States
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter & Sort States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('default'); // 'default', 'price-low', 'price-high', 'rating-high'

  // UI Interactive States
  const [selectedProduct, setSelectedProduct] = useState(null); // Detail Modal
  const [showCodeModal, setShowCodeModal] = useState(false); // Code Snippet Modal
  const [copiedCodeTab, setCopiedCodeTab] = useState(false);
  const [activeCodeTab, setActiveCodeTab] = useState('fetch'); // 'fetch' or 'process'

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('https://fakestoreapi.com/products');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      console.error("Error fetching product data:", err);
      setError("Gagal mengambil data produk dari server FakeStoreAPI. Periksa koneksi internet Anda.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Pipeline Pemrosesan Data Produk (Search, Filter Kategori, Filter Rating, Sorting)
  const filteredProducts = useMemo(() => {
    return products
      .filter((item) => {
        // 1. Search Query Filter
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              item.description.toLowerCase().includes(searchQuery.toLowerCase());
        
        // 2. Category Filter
        const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;

        // 3. Minimum Rating Filter
        const matchesRating = item.rating?.rate >= minRating;

        return matchesSearch && matchesCategory && matchesRating;
      })
      .sort((a, b) => {
        // 4. Sorting Logic
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'rating-high') return (b.rating?.rate || 0) - (a.rating?.rate || 0);
        return 0; // Default order
      });
  }, [products, searchQuery, selectedCategory, minRating, sortBy]);

  // Statistik Produk untuk Dashboard Card
  const stats = useMemo(() => {
    if (filteredProducts.length === 0) {
      return { total: 0, avgPrice: 0, topProduct: null };
    }

    const total = filteredProducts.length;
    const totalPrice = filteredProducts.reduce((sum, item) => sum + item.price, 0);
    const avgPrice = (totalPrice / total).toFixed(2);
    
    const topProduct = [...filteredProducts].sort((a, b) => (b.rating?.rate || 0) - (a.rating?.rate || 0))[0];

    return { total, avgPrice, topProduct };
  }, [filteredProducts]);

  // Daftar Kategori Unik
  const categories = [
    { id: 'all', label: 'Semua Kategori' },
    { id: "men's clothing", label: "Pakaian Pria" },
    { id: "women's clothing", label: "Pakaian Wanita" },
    { id: "jewelery", label: "Perhiasan" },
    { id: "electronics", label: "Elektronik" }
  ];

  const handleCopyCode = (codeText) => {
    navigator.clipboard.writeText(codeText);
    setCopiedCodeTab(true);
    setTimeout(() => setCopiedCodeTab(false), 2000);
  };

  const fetchCodeSnippet = `// 1. STATE MANAGEMENT & API FETCH DATA
const [products, setProducts] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

// Fungsi untuk Ambil Data dari API Open Source FakeStore
const fetchProducts = async () => {
  setLoading(true);
  try {
    const response = await fetch('https://fakestoreapi.com/products');
    if (!response.ok) throw new Error("Gagal mengambil data API");
    const data = await response.json();
    setProducts(data); // Simpan hasil response ke State
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  fetchProducts(); // Jalankan saat komponen pertama kali dirender
}, []);`;

  const processCodeSnippet = `// 2. LOGIKA PEMROSESAN & FILTERING DATA PRODUK
const filteredProducts = useMemo(() => {
  return products
    // Filter Berdasarkan Pencarian Teks, Kategori, & Minimal Rating
    .filter((item) => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesRating = item.rating?.rate >= minRating;
      
      return matchesSearch && matchesCategory && matchesRating;
    })
    // Pengurutan (Sorting) Harga & Rating
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;      // Termurah
      if (sortBy === 'price-high') return b.price - a.price;     // Termahal
      if (sortBy === 'rating-high') return b.rating.rate - a.rating.rate; // Rating Tertinggi
      return 0;
    });
}, [products, searchQuery, selectedCategory, minRating, sortBy]);`;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-indigo-500 selection:text-white">
      {/* Top Notification / Header Banner */}
      <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-md border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-tr from-indigo-600 to-violet-500 p-2.5 rounded-xl shadow-lg shadow-indigo-500/20">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-white leading-none flex items-center gap-2">
                Store Analytics <span className="text-xs bg-indigo-500/20 text-indigo-400 font-mono px-2 py-0.5 rounded-full border border-indigo-500/30">API Live</span>
              </h1>
              <p className="text-xs text-slate-400 mt-0.5 hidden sm:block">Dashboard Filter Rating & Harga Produk</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowCodeModal(true)}
              className="flex items-center gap-2 bg-indigo-600/90 hover:bg-indigo-500 text-white text-xs sm:text-sm font-medium px-3.5 py-2 rounded-lg transition-all shadow-md shadow-indigo-600/20 hover:shadow-indigo-500/30 active:scale-95"
              title="Lihat potongan kode fetch API untuk di-screenshot"
            >
              <Code2 className="w-4 h-4 text-indigo-200" />
              <span className="hidden xs:inline">Lihat Kode Program</span>
              <span className="xs:hidden">Kode</span>
            </button>

            <button
              onClick={fetchProducts}
              disabled={loading}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg border border-slate-700 transition-all active:scale-95 disabled:opacity-50"
              title="Muat Ulang Data API"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-indigo-400' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* Hero & Title Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800/60 pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>FakeStore Open Source API</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Katalog Produk & Filter Real-Time
            </h2>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Gunakan kontrol di bawah untuk memfilter data berdasarkan harga, rating bintang, kategori, dan kata kunci pencarian.
            </p>
          </div>
        </div>

        {}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          {/* Card 1: Total Products */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-sm flex items-center justify-between shadow-sm hover:border-slate-700 transition">
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Tampil</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl sm:text-3xl font-bold text-white">{stats.total}</span>
                <span className="text-xs text-slate-500">dari {products.length} item</span>
              </div>
            </div>
            <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
              <BarChart3 className="w-6 h-6" />
            </div>
          </div>

          {/* Card 2: Average Price */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-sm flex items-center justify-between shadow-sm hover:border-slate-700 transition">
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Rata-Rata Harga</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl sm:text-3xl font-bold text-emerald-400">${stats.avgPrice}</span>
                <span className="text-xs text-slate-500">USD</span>
              </div>
            </div>
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>

          {/* Card 3: Top Rated Item */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-sm flex items-center justify-between shadow-sm hover:border-slate-700 transition">
            <div className="min-w-0 flex-1 pr-2">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Top Rated Product</p>
              <p className="text-sm font-semibold text-white truncate mt-1">
                {stats.topProduct ? stats.topProduct.title : '-'}
              </p>
              <div className="flex items-center gap-1 mt-0.5 text-xs text-amber-400 font-medium">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>{stats.topProduct ? stats.topProduct.rating?.rate : 0} / 5.0</span>
              </div>
            </div>
            <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20 shrink-0">
              <Star className="w-6 h-6 fill-amber-400/20" />
            </div>
          </div>
        </div>

        {}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 space-y-5 shadow-xl">
          
          {/* Row 1: Search & Price Sort */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            
            {/* Search Input */}
            <div className="md:col-span-7 relative">
              <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari berdasarkan nama barang atau deskripsi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-11 pr-10 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="md:col-span-5 flex items-center gap-2">
              <div className="relative w-full">
                <ArrowUpDown className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-8 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 appearance-none cursor-pointer"
                >
                  <option value="default">Urutan Default</option>
                  <option value="price-low">Harga: Murah ke Mahal</option>
                  <option value="price-high">Harga: Mahal ke Murah</option>
                  <option value="rating-high">Rating: Tertinggi ke Terendah</option>
                </select>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">▼</div>
              </div>
            </div>
          </div>

          {/* Row 2: Category Pills & Rating Filter */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pt-2 border-t border-slate-800/80">
            
            {/* Categories */}
            <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
              <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 mr-1">
                <Tag className="w-3.5 h-3.5" /> Kategori:
              </span>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-indigo-600 text-white border-indigo-500 font-medium shadow-sm'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Rating Filter Buttons */}
            <div className="flex items-center gap-2 w-full lg:w-auto justify-between lg:justify-end">
              <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-amber-400" /> Min. Rating:
              </span>
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                {[0, 1, 2, 3, 4].map((star) => (
                  <button
                    key={star}
                    onClick={() => setMinRating(star)}
                    className={`text-xs px-2.5 py-1 rounded-lg flex items-center gap-1 font-medium transition ${
                      minRating === star
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>{star === 0 ? 'Semua' : `${star}★`}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Active Filter Indicators / Reset */}
          {(searchQuery || selectedCategory !== 'all' || minRating > 0 || sortBy !== 'default') && (
            <div className="flex items-center justify-between pt-2 text-xs text-slate-400">
              <span className="italic">Filter aktif diterapkan</span>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setMinRating(0);
                  setSortBy('default');
                }}
                className="text-indigo-400 hover:text-indigo-300 underline font-medium"
              >
                Reset Semua Filter
              </button>
            </div>
          )}
        </div>

        {}
        {/* ERROR STATE */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 text-center max-w-lg mx-auto space-y-3">
            <AlertCircle className="w-10 h-10 text-red-400 mx-auto" />
            <h3 className="text-lg font-bold text-white">Terjadi Kesalahan Data</h3>
            <p className="text-sm text-slate-300">{error}</p>
            <button
              onClick={fetchProducts}
              className="mt-2 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition"
            >
              Coba Lagi
            </button>
          </div>
        )}

        {/* LOADING STATE - SKELETON CARDS */}
        {loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, idx) => (
              <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4 animate-pulse">
                <div className="w-full h-48 bg-slate-800 rounded-xl"></div>
                <div className="h-4 bg-slate-800 rounded w-3/4"></div>
                <div className="h-3 bg-slate-800 rounded w-1/2"></div>
                <div className="flex justify-between items-center pt-2">
                  <div className="h-6 bg-slate-800 rounded w-1/3"></div>
                  <div className="h-6 bg-slate-800 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && !error && filteredProducts.length === 0 && (
          <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-slate-800/60 max-w-md mx-auto space-y-3">
            <div className="p-3 bg-slate-800/80 rounded-full w-fit mx-auto text-slate-500">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white">Produk Tidak Ditemukan</h3>
            <p className="text-sm text-slate-400 px-6">
              Tidak ada produk yang cocok dengan kombinasi pencarian atau filter yang Anda pilih.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setMinRating(0);
                setSortBy('default');
              }}
              className="mt-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition"
            >
              Reset Filter
            </button>
          </div>
        )}

        {/* PRODUCT GRID */}
        {!loading && !error && filteredProducts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="group bg-slate-900/80 hover:bg-slate-900 border border-slate-800/80 hover:border-indigo-500/50 rounded-2xl p-4 flex flex-col justify-between transition-all duration-200 hover:shadow-xl hover:shadow-indigo-500/5 relative"
              >
                {/* Category Badge */}
                <div className="absolute top-6 left-6 z-10">
                  <span className="text-[10px] font-semibold tracking-wide uppercase bg-slate-950/80 text-slate-300 border border-slate-700/80 px-2.5 py-1 rounded-md backdrop-blur-md">
                    {product.category}
                  </span>
                </div>

                {/* Image Box */}
                <div className="w-full h-52 bg-white rounded-xl p-4 flex items-center justify-center overflow-hidden mb-4 group-hover:scale-[1.02] transition-transform">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="max-h-full max-w-full object-contain mix-blend-multiply"
                    loading="lazy"
                  />
                </div>

                {/* Content Details */}
                <div className="space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-100 text-sm line-clamp-2 group-hover:text-indigo-400 transition-colors" title={product.title}>
                      {product.title}
                    </h3>
                  </div>

                  {/* Rating & Price */}
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between mt-auto">
                    <div>
                      <span className="text-xs text-slate-400 block">Harga</span>
                      <span className="text-lg font-bold text-emerald-400">
                        ${product.price.toFixed(2)}
                      </span>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center justify-end gap-1 text-amber-400 font-semibold text-xs">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{product.rating?.rate || 0}</span>
                      </div>
                      <span className="text-[10px] text-slate-500">
                        ({product.rating?.count || 0} ulasan)
                      </span>
                    </div>
                  </div>

                  {/* Quick View Button */}
                  <button
                    onClick={() => setSelectedProduct(product)}
                    className="w-full mt-3 bg-slate-800 hover:bg-indigo-600 text-slate-200 hover:text-white text-xs font-medium py-2 rounded-xl border border-slate-700 hover:border-indigo-500 flex items-center justify-center gap-1.5 transition-all active:scale-95"
                  >
                    <Eye className="w-3.5 h-3.5" /> Detail Produk
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl relative">
            
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              <div className="bg-white rounded-xl p-6 flex items-center justify-center h-64">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.title}
                  className="max-h-full max-w-full object-contain mix-blend-multiply"
                />
              </div>

              <div className="space-y-4">
                <span className="text-xs font-semibold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 px-2.5 py-1 rounded-md border border-indigo-500/20">
                  {selectedProduct.category}
                </span>

                <h3 className="text-lg font-bold text-white leading-snug">
                  {selectedProduct.title}
                </h3>

                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-emerald-400">
                    ${selectedProduct.price.toFixed(2)}
                  </span>
                  <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs px-2.5 py-1 rounded-lg">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="font-semibold">{selectedProduct.rating?.rate}</span>
                    <span className="text-slate-400">({selectedProduct.rating?.count} reviews)</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed max-h-36 overflow-y-auto pr-1 border-t border-b border-slate-800 py-3">
                  {selectedProduct.description}
                </p>

                <div className="pt-2 flex gap-3">
                  <button
                    onClick={() => setSelectedProduct(null)}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold py-2.5 rounded-xl transition"
                  >
                    Tutup Preview
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {}
      {showCodeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
              <div className="flex items-center gap-2.5">
                <Code2 className="w-5 h-5 text-indigo-400" />
                <div>
                  <h3 className="font-bold text-white text-base">Kode Program Fetch & Process API</h3>
                  <p className="text-xs text-slate-400">Gunakan tampilan ini untuk di-screenshot sebagai bukti tugas</p>
                </div>
              </div>
              <button
                onClick={() => setShowCodeModal(false)}
                className="p-1.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Code Tabs */}
            <div className="flex border-b border-slate-800 bg-slate-950 px-4 pt-2 gap-2">
              <button
                onClick={() => setActiveCodeTab('fetch')}
                className={`text-xs font-medium px-4 py-2.5 rounded-t-lg border-t border-x transition-all ${
                  activeCodeTab === 'fetch'
                    ? 'bg-slate-900 text-indigo-400 border-slate-800 font-semibold'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                1. Kode Fetch API (useEffect)
              </button>
              <button
                onClick={() => setActiveCodeTab('process')}
                className={`text-xs font-medium px-4 py-2.5 rounded-t-lg border-t border-x transition-all ${
                  activeCodeTab === 'process'
                    ? 'bg-slate-900 text-indigo-400 border-slate-800 font-semibold'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                2. Pemrosesan Data & Filter
              </button>
            </div>

            {/* Code Display Area */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-slate-950 relative font-mono text-xs text-slate-300">
              
              <button
                onClick={() => handleCopyCode(activeCodeTab === 'fetch' ? fetchCodeSnippet : processCodeSnippet)}
                className="absolute top-6 right-6 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3 py-1.5 rounded-lg border border-slate-700 flex items-center gap-1.5 transition"
              >
                {copiedCodeTab ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCodeTab ? 'Tersalin!' : 'Salin Kode'}</span>
              </button>

              <pre className="p-4 bg-slate-900 rounded-xl border border-slate-800 overflow-x-auto text-emerald-300 leading-relaxed">
                <code>{activeCodeTab === 'fetch' ? fetchCodeSnippet : processCodeSnippet}</code>
              </pre>

              <div className="mt-4 p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-300 text-xs">
                💡 <strong>Tips Tugas:</strong> Anda bisa langsung melakukan <em>Screenshot / Snipping Tool</em> pada modal ini untuk memperlihatkan bagian kodenya.
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-900 flex justify-end">
              <button
                onClick={() => setShowCodeModal(false)}
                className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition"
              >
                Selesai
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-800/80 mt-16 py-8 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-500 space-y-1">
          <p>Dashboard Aplikasi React JS — Terintegrasi dengan FakeStore API Open Source</p>
          <p>© {new Date().getFullYear()} Modern E-Commerce Analytics</p>
        </div>
      </footer>
    </div>
  );
}