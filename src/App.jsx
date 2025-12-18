import React, { useState, useEffect } from 'react';
import { 
  Wallet, 
  ShoppingBag, 
  Recycle, 
  User, 
  History, 
  ArrowRight, 
  Plus, 
  Minus, 
  LogOut, 
  TrendingUp, 
  QrCode,
  Search,
  CheckCircle,
  AlertCircle,
  Lock,
  Edit,
  Trash2,
  X,
  Save,
  Store,
  Package, // Import ikon Package
  Users,
  ShieldCheck
} from 'lucide-react';

// --- MOCK DATA (Hardcoded Users) ---
// Password default untuk simulasi: '123456'
const INITIAL_USERS = [
  { id: 'u1', username: 'budi', password: '123', name: 'Budi Santoso', role: 'user', balance: 150, joined: '2023-10-01' },
  { id: 'u2', username: 'siti', password: '123', name: 'Siti Aminah', role: 'user', balance: 50, joined: '2023-11-15' },
  { id: 'a1', username: 'admin', password: 'admin', name: 'Admin Gudang', role: 'admin', balance: 0, joined: '2023-01-01' },
];

const WASTE_TYPES = [
  { id: 'w1', name: 'Kardus Bekas', price: 20, unit: 'kg', icon: '📦' },
  { id: 'w2', name: 'Botol Plastik Bersih', price: 35, unit: 'kg', icon: 'bottle' },
  { id: 'w3', name: 'Kaleng Aluminium', price: 50, unit: 'kg', icon: 'can' },
  { id: 'w4', name: 'Minyak Jelantah', price: 40, unit: 'liter', icon: 'oil' },
];

const DEFAULT_PRODUCTS = [
  { id: 'p1', name: 'Minyak Goreng 1L', price: 100, stock: 20, category: 'Sembako', image: 'oil' },
  { id: 'p2', name: 'Beras Premium 3Kg', price: 250, stock: 15, category: 'Sembako', image: 'rice' },
  { id: 'p3', name: 'Gula Pasir 1Kg', price: 80, stock: 30, category: 'Sembako', image: 'sugar' },
  { id: 'p4', name: 'Telur Ayam 1/2 Kg', price: 120, stock: 10, category: 'Lauk', image: 'egg' },
  { id: 'p5', name: 'Mie Instan (5 Pcs)', price: 40, stock: 100, category: 'Makanan', image: 'noodle' },
  // Produk Baru: Paket Sembako Lite
  { id: 'p6', name: 'Paket Sembako Lite (Beras, Minyak, Gula, Telur)', price: 500, stock: 5, category: 'Paket', image: 'package' },
];

// --- COMPONENTS ---

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('home'); 
  const [users, setUsers] = useState(INITIAL_USERS);
  
  // State Inventory dengan LocalStorage
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('ecoLoopInventory');
    return saved ? JSON.parse(saved) : DEFAULT_PRODUCTS;
  });

  const [transactions, setTransactions] = useState([
    { id: 't1', userId: 'u1', type: 'earn', amount: 50, desc: 'Setor 2.5kg Kardus', date: '2023-12-01' },
    { id: 't2', userId: 'u1', type: 'spend', amount: 100, desc: 'Redeem Minyak Goreng', date: '2023-12-02' },
  ]);
  const [cart, setCart] = useState([]);
  const [notification, setNotification] = useState(null);
  const [showQRModal, setShowQRModal] = useState(false);

  // Sync Products to LocalStorage
  useEffect(() => {
    localStorage.setItem('ecoLoopInventory', JSON.stringify(products));
  }, [products]);

  // --- HELPER FUNCTIONS ---

  const showNotification = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const updateUserBalance = (userId, amount) => {
    setUsers(users.map(u => {
      if (u.id === userId) {
        return { ...u, balance: u.balance + amount };
      }
      return u;
    }));
    if (currentUser && currentUser.id === userId) {
      setCurrentUser(prev => ({ ...prev, balance: prev.balance + amount }));
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCart([]);
    setActiveTab('home');
  };

  // --- AUTH SCREEN (Login & Register) ---

  const AuthScreen = () => {
    const [authTab, setAuthTab] = useState('user'); // 'user' | 'admin'
    const [isRegister, setIsRegister] = useState(false);
    const [formData, setFormData] = useState({ username: '', password: '', name: '' });

    const handleAuth = (e) => {
      e.preventDefault();
      
      // LOGIC REGISTER (Hanya untuk Warga di Tab User)
      if (isRegister && authTab === 'user') {
        if (!formData.username || !formData.password || !formData.name) {
          showNotification('Mohon lengkapi data pendaftaran', 'error');
          return;
        }
        if (users.some(u => u.username === formData.username)) {
          showNotification('Username sudah terpakai', 'error');
          return;
        }

        const newUser = {
          id: 'u' + Date.now(),
          ...formData,
          role: 'user',
          balance: 0,
          joined: new Date().toLocaleDateString('id-ID')
        };

        setUsers([...users, newUser]);
        setCurrentUser(newUser);
        setActiveTab('home');
        showNotification(`Selamat datang, ${newUser.name}!`);
        return;
      }

      // LOGIC LOGIN
      const user = users.find(u => u.username === formData.username && u.password === formData.password);
      
      if (!user) {
        showNotification('Username atau Password salah', 'error');
        return;
      }

      // Validasi Role berdasarkan Tab
      if (authTab === 'admin' && user.role !== 'admin') {
         showNotification('Akun ini bukan akun Admin', 'error');
         return;
      }
      if (authTab === 'user' && user.role !== 'user') {
         showNotification('Silakan login di tab Admin', 'error');
         return;
      }

      setCurrentUser(user);
      setActiveTab(user.role === 'admin' ? 'admin-dashboard' : 'home');
      showNotification('Login Berhasil');
    };

    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-green-50 p-6">
        <div className="bg-white p-4 rounded-full shadow-lg mb-6">
          <Recycle size={64} className="text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-green-800 mb-2">EcoLoop Mart</h1>
        <p className="text-gray-500 text-center mb-8">Ecosystem Tukar Sampah Jadi Sembako</p>

        <div className="bg-white rounded-2xl shadow-md w-full max-w-sm overflow-hidden">
          {/* Tab Header */}
          <div className="flex border-b">
            <button 
                className={`flex-1 py-4 font-bold text-sm ${authTab === 'user' ? 'bg-white text-green-600 border-b-2 border-green-600' : 'bg-gray-50 text-gray-400'}`}
                onClick={() => { setAuthTab('user'); setIsRegister(false); setFormData({username:'', password:'', name:''}); }}
            >
                WARGA
            </button>
            <button 
                className={`flex-1 py-4 font-bold text-sm ${authTab === 'admin' ? 'bg-white text-orange-600 border-b-2 border-orange-600' : 'bg-gray-50 text-gray-400'}`}
                onClick={() => { setAuthTab('admin'); setIsRegister(false); setFormData({username:'', password:'', name:''}); }}
            >
                ADMIN
            </button>
          </div>

          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
                {authTab === 'admin' ? 'Login Admin' : (isRegister ? 'Daftar Warga Baru' : 'Login Warga')}
            </h2>
            
            <form onSubmit={handleAuth} className="space-y-4">
                {isRegister && authTab === 'user' && (
                <div>
                    <label className="text-xs text-gray-500 font-bold ml-1">Nama Lengkap</label>
                    <div className="relative">
                    <User className="absolute left-3 top-3 text-gray-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Contoh: Budi Santoso"
                        className="w-full bg-gray-50 py-2.5 pl-10 pr-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none"
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                    </div>
                </div>
                )}

                <div>
                <label className="text-xs text-gray-500 font-bold ml-1">Username</label>
                <div className="relative">
                    <User className="absolute left-3 top-3 text-gray-400" size={18} />
                    <input 
                    type="text" 
                    placeholder="Username"
                    className="w-full bg-gray-50 py-2.5 pl-10 pr-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none"
                    value={formData.username}
                    onChange={e => setFormData({...formData, username: e.target.value})}
                    />
                </div>
                </div>

                <div>
                <label className="text-xs text-gray-500 font-bold ml-1">Password</label>
                <div className="relative">
                    <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                    <input 
                    type="password" 
                    placeholder="Password"
                    className="w-full bg-gray-50 py-2.5 pl-10 pr-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none"
                    value={formData.password}
                    onChange={e => setFormData({...formData, password: e.target.value})}
                    />
                </div>
                </div>

                <button 
                    type="submit" 
                    className={`w-full text-white py-3 rounded-xl font-bold shadow-md hover:brightness-110 transition mt-4 ${authTab === 'admin' ? 'bg-orange-500' : 'bg-green-600'}`}
                >
                {isRegister && authTab === 'user' ? 'Daftar Sekarang' : 'Masuk'}
                </button>
            </form>

            {/* Toggle Register hanya untuk Tab User */}
            {authTab === 'user' && (
                <div className="mt-6 text-center text-sm">
                    <p className="text-gray-500">
                    {isRegister ? 'Sudah punya akun?' : 'Belum punya akun warga?'}
                    </p>
                    <button 
                    onClick={() => { setIsRegister(!isRegister); setFormData({username:'', password:'', name:''}) }}
                    className="text-green-600 font-bold hover:underline"
                    >
                    {isRegister ? 'Login di sini' : 'Daftar di sini'}
                    </button>
                </div>
            )}
            
            {/* Info Admin */}
            {authTab === 'admin' && (
                <div className="mt-6 text-center text-xs text-gray-400">
                    <p>Hanya petugas yang dapat login di halaman ini.</p>
                </div>
            )}
          </div>
        </div>
        
        <div className="mt-8 p-3 bg-blue-50 text-blue-800 text-xs rounded-lg max-w-xs text-center border border-blue-200">
          <p><strong>Pemrograman Aplikasi Mobile: Kelompok 3</strong></p>
        </div>	
      </div>
    );
  };

  // --- USER SCREENS ---

  const UserHome = () => (
    <div className="p-4 pb-24 space-y-6">
      {/* Header Wallet */}
      <div className="bg-gradient-to-r from-green-600 to-green-500 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-20">
          <Recycle size={100} />
        </div>
        <div className="relative z-10">
          <p className="text-green-100 text-sm mb-1">Halo, {currentUser.name}</p>
          <h2 className="text-4xl font-bold mb-4">{currentUser.balance} <span className="text-lg font-normal">pts</span></h2>
          <div className="flex gap-2 text-sm bg-white/20 p-2 rounded-lg inline-block backdrop-blur-sm">
            ≈ Rp {(currentUser.balance * 150).toLocaleString('id-ID')} (Estimasi)
          </div>
        </div>
      </div>

      {/* QR Code Card */}
      <div 
        onClick={() => setShowQRModal(true)}
        className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center justify-between cursor-pointer active:bg-gray-50 transition"
      >
        <div>
          <h3 className="font-bold text-gray-800">ID Member Digital</h3>
          <p className="text-xs text-gray-500">Ketuk untuk memperbesar QR Code</p>
        </div>
        <div className="bg-gray-100 p-2 rounded-lg">
          <QrCode className="text-gray-800" size={32} />
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-gray-800">Riwayat Terkini</h3>
          <button onClick={() => setActiveTab('history')} className="text-xs text-green-600 font-semibold">Lihat Semua</button>
        </div>
        <div className="space-y-3">
          {transactions.filter(t => t.userId === currentUser.id).slice(0, 3).map(t => (
            <div key={t.id} className="bg-white p-3 rounded-xl shadow-sm flex justify-between items-center border border-gray-50">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${t.type === 'earn' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                  {t.type === 'earn' ? <TrendingUp size={18} /> : <ShoppingBag size={18} />}
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-800">{t.desc}</p>
                  <p className="text-xs text-gray-400">{t.date}</p>
                </div>
              </div>
              <span className={`font-bold ${t.type === 'earn' ? 'text-green-600' : 'text-orange-600'}`}>
                {t.type === 'earn' ? '+' : '-'}{t.amount}
              </span>
            </div>
          ))}
          {transactions.filter(t => t.userId === currentUser.id).length === 0 && (
            <div className="text-center py-8 text-gray-400 text-sm">Belum ada transaksi</div>
          )}
        </div>
      </div>
    </div>
  );

  const Marketplace = () => {
    const addToCart = (product) => {
      const existing = cart.find(c => c.id === product.id);
      if (existing) {
        if(existing.qty >= product.stock) return showNotification('Stok tidak mencukupi', 'error');
        setCart(cart.map(c => c.id === product.id ? { ...c, qty: c.qty + 1 } : c));
      } else {
        setCart([...cart, { ...product, qty: 1 }]);
      }
    };

    const cartTotal = cart.reduce((acc, curr) => acc + (curr.price * curr.qty), 0);

    return (
      <div className="p-4 pb-28 h-full bg-gray-50">
        <div className="sticky top-0 bg-gray-50 pt-2 pb-4 z-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Mart Warga</h2>
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <input type="text" placeholder="Cari sembako..." className="w-full bg-white py-2.5 pl-10 pr-4 rounded-xl border-none shadow-sm focus:ring-2 focus:ring-green-500 outline-none" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {products.map(product => (
            <div key={product.id} className="bg-white p-3 rounded-xl shadow-sm flex flex-col justify-between relative overflow-hidden">
              {product.category === 'Paket' && (
                 <div className="absolute top-0 right-0 bg-orange-500 text-white text-[10px] px-2 py-1 rounded-bl-lg font-bold">
                    HEMAT
                 </div>
              )}
              <div className={`h-24 rounded-lg mb-3 flex items-center justify-center text-4xl ${product.category === 'Paket' ? 'bg-orange-50' : 'bg-gray-100'}`}>
                 {product.image === 'oil' && '🌻'}
                 {product.image === 'rice' && '🍚'}
                 {product.image === 'sugar' && '🧂'}
                 {product.image === 'egg' && '🥚'}
                 {product.image === 'noodle' && '🍜'}
                 {product.image === 'package' && '📦'}
              </div>
              <div>
                <h3 className="font-semibold text-sm text-gray-800 line-clamp-2 leading-tight">{product.name}</h3>
                <p className="text-xs text-gray-500 mb-2 mt-1">Stok: {product.stock}</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="font-bold text-orange-600 text-sm">{product.price} pts</span>
                  <button 
                    onClick={() => addToCart(product)}
                    disabled={product.stock === 0}
                    className="bg-green-600 text-white p-1.5 rounded-lg disabled:bg-gray-300 active:scale-90 transition"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {cart.length > 0 && (
          <div className="fixed bottom-20 left-4 right-4 bg-gray-900 text-white p-4 rounded-xl shadow-xl flex justify-between items-center z-50">
            <div>
              <p className="text-xs text-gray-400">{cart.reduce((a,c)=>a+c.qty,0)} Barang</p>
              <p className="font-bold text-lg">{cartTotal} Poin</p>
            </div>
            <button 
              onClick={() => setActiveTab('cart')}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold text-sm"
            >
              Lihat Keranjang
            </button>
          </div>
        )}
      </div>
    );
  };

  const CartScreen = () => {
    const total = cart.reduce((acc, curr) => acc + (curr.price * curr.qty), 0);

    const handleCheckout = () => {
      if (currentUser.balance < total) {
        showNotification('Saldo poin tidak cukup!', 'error');
        return;
      }

      // 1. Deduct Stock & Sync to State (which syncs to localStorage)
      const newProducts = products.map(p => {
        const itemInCart = cart.find(c => c.id === p.id);
        if (itemInCart) return { ...p, stock: p.stock - itemInCart.qty };
        return p;
      });
      setProducts(newProducts);

      // 2. Deduct Balance
      updateUserBalance(currentUser.id, -total);

      // 3. Add Transaction Log
      const newTx = {
        id: 't' + Date.now(),
        userId: currentUser.id,
        type: 'spend',
        amount: total,
        desc: `Belanja ${cart.length} jenis item`,
        date: new Date().toLocaleDateString('id-ID')
      };
      setTransactions([newTx, ...transactions]);

      setCart([]);
      setActiveTab('home');
      showNotification('Penukaran Berhasil! Silakan ambil barang di loket.');
    };

    return (
      <div className="p-4 h-full bg-white flex flex-col">
        <div className="flex items-center gap-2 mb-6">
           <button onClick={() => setActiveTab('market')} className="p-1"><ArrowRight className="rotate-180"/></button>
           <h2 className="text-2xl font-bold">Keranjang</h2>
        </div>
        
        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
            <ShoppingBag size={48} className="mb-2" />
            <p>Keranjang kosong</p>
            <button onClick={() => setActiveTab('market')} className="mt-4 text-green-600 font-bold">Belanja Sekarang</button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto space-y-4">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between items-center border-b pb-4">
                  <div>
                    <h4 className="font-semibold">{item.name}</h4>
                    <p className="text-orange-500 text-sm font-bold">{item.price} pts</p>
                  </div>
                  <div className="flex items-center gap-3 bg-gray-100 rounded-lg p-1">
                    <button onClick={() => setCart(cart.map(c => c.id === item.id ? {...c, qty: Math.max(0, c.qty - 1)} : c).filter(c => c.qty > 0))} className="p-1"><Minus size={14}/></button>
                    <span className="text-sm font-bold w-4 text-center">{item.qty}</span>
                    <button onClick={() => setCart(cart.map(c => c.id === item.id ? {...c, qty: c.qty + 1} : c))} className="p-1"><Plus size={14}/></button>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t pt-4">
              <div className="flex justify-between mb-2">
                <span>Total Belanja</span>
                <span className="font-bold">{total} Poin</span>
              </div>
              <div className="flex justify-between mb-6 text-sm">
                <span>Saldo Anda</span>
                <span className={`${currentUser.balance < total ? 'text-red-500' : 'text-green-600'} font-bold`}>{currentUser.balance} Poin</span>
              </div>
              <button 
                onClick={handleCheckout}
                disabled={currentUser.balance < total}
                className="w-full bg-green-600 disabled:bg-gray-300 text-white py-3 rounded-xl font-bold shadow-lg"
              >
                Konfirmasi Penukaran
              </button>
            </div>
          </>
        )}
      </div>
    );
  };

  // --- ADMIN SCREENS ---

  const AdminDashboard = () => {
    const [viewMode, setViewMode] = useState('deposit'); // 'deposit', 'inventory', 'users'

    // Deposit Logic
    const [selectedUser, setSelectedUser] = useState('');
    const [weightInput, setWeightInput] = useState('');
    const [selectedWaste, setSelectedWaste] = useState(WASTE_TYPES[0]);

    const handleDeposit = (e) => {
      e.preventDefault();
      if(!selectedUser || !weightInput) return;
      const points = Math.floor(parseFloat(weightInput) * selectedWaste.price);
      updateUserBalance(selectedUser, points);
      const newTx = {
        id: 't' + Date.now(),
        userId: selectedUser,
        type: 'earn',
        amount: points,
        desc: `Setor ${weightInput}${selectedWaste.unit} ${selectedWaste.name}`,
        date: new Date().toLocaleDateString('id-ID')
      };
      setTransactions([newTx, ...transactions]);
      setWeightInput('');
      showNotification(`Berhasil! User +${points} Poin.`);
    };

    // Inventory Logic
    const [editItem, setEditItem] = useState(null); // null = add mode
    const [invForm, setInvForm] = useState({ name: '', stock: '', price: '', image: 'oil' });
    const [showInvForm, setShowInvForm] = useState(false);

    const handleSaveItem = () => {
        if(!invForm.name || !invForm.stock || !invForm.price) return;
        
        const newItem = {
            id: editItem ? editItem.id : 'p' + Date.now(),
            name: invForm.name,
            stock: parseInt(invForm.stock),
            price: parseInt(invForm.price),
            category: invForm.image === 'package' ? 'Paket' : 'Sembako',
            image: invForm.image
        };

        if(editItem) {
            setProducts(products.map(p => p.id === newItem.id ? newItem : p));
            showNotification('Barang berhasil diupdate');
        } else {
            setProducts([...products, newItem]);
            showNotification('Barang baru ditambahkan');
        }
        setShowInvForm(false);
        setEditItem(null);
        setInvForm({ name: '', stock: '', price: '', image: 'oil' });
    };

    const handleDeleteItem = (id) => {
        if(window.confirm('Hapus barang ini dari stok?')) {
            setProducts(products.filter(p => p.id !== id));
            showNotification('Barang dihapus');
        }
    };

    const openEdit = (item) => {
        setEditItem(item);
        setInvForm({ name: item.name, stock: item.stock, price: item.price, image: item.image });
        setShowInvForm(true);
    };

    // --- USER MANAGEMENT LOGIC (NEW) ---
    const [newUserForm, setNewUserForm] = useState({ name: '', username: '', password: '', role: 'user' });

    const handleAddUser = (e) => {
        e.preventDefault();
        if(!newUserForm.username || !newUserForm.password || !newUserForm.name) return;
        
        if (users.some(u => u.username === newUserForm.username)) {
            showNotification('Username sudah digunakan', 'error');
            return;
        }

        const newUser = {
            id: (newUserForm.role === 'admin' ? 'a' : 'u') + Date.now(),
            ...newUserForm,
            balance: 0,
            joined: new Date().toLocaleDateString('id-ID')
        };

        setUsers([...users, newUser]);
        showNotification(`${newUserForm.role === 'admin' ? 'Admin' : 'Warga'} baru berhasil ditambahkan!`);
        setNewUserForm({ name: '', username: '', password: '', role: 'user' });
    };

    return (
      <div className="p-4 pb-24 bg-gray-50 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Admin Panel</h2>
            <p className="text-xs text-gray-500">Halo, {currentUser.name}</p>
          </div>
          <button onClick={handleLogout} className="text-red-500 text-sm font-semibold bg-red-50 px-3 py-1 rounded-lg">Logout</button>
        </div>

        {/* Admin Tabs */}
        <div className="flex bg-white p-1 rounded-xl shadow-sm mb-6">
            <button 
                onClick={() => setViewMode('deposit')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg ${viewMode === 'deposit' ? 'bg-green-100 text-green-700' : 'text-gray-500'}`}
            >
                Setoran
            </button>
            <button 
                onClick={() => setViewMode('inventory')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg ${viewMode === 'inventory' ? 'bg-blue-100 text-blue-700' : 'text-gray-500'}`}
            >
                Stok
            </button>
            <button 
                onClick={() => setViewMode('users')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg ${viewMode === 'users' ? 'bg-orange-100 text-orange-700' : 'text-gray-500'}`}
            >
                User
            </button>
        </div>

        {viewMode === 'deposit' && (
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Recycle className="text-green-600" /> Form Setoran
            </h3>
            <form onSubmit={handleDeposit} className="space-y-4">
                <div>
                <label className="text-xs font-semibold text-gray-500 uppercase">Pilih Warga</label>
                <select 
                    className="w-full mt-1 p-3 bg-gray-50 rounded-lg border border-gray-200"
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e.target.value)}
                    required
                >
                    <option value="">-- Pilih Warga --</option>
                    {users.filter(u => u.role === 'user').map(u => (
                    <option key={u.id} value={u.id}>{u.name} (Saldo: {u.balance})</option>
                    ))}
                </select>
                </div>

                <div>
                <label className="text-xs font-semibold text-gray-500 uppercase">Jenis Sampah</label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                    {WASTE_TYPES.map(w => (
                    <button
                        key={w.id}
                        type="button"
                        onClick={() => setSelectedWaste(w)}
                        className={`p-2 rounded-lg text-sm border ${selectedWaste.id === w.id ? 'bg-green-100 border-green-500 text-green-700 font-bold' : 'bg-white border-gray-200'}`}
                    >
                        {w.name} <br/>
                        <span className="text-xs opacity-70">Rp {w.price}/{w.unit}</span>
                    </button>
                    ))}
                </div>
                </div>

                <div>
                <label className="text-xs font-semibold text-gray-500 uppercase">Berat / Jumlah ({selectedWaste.unit})</label>
                <input 
                    type="number" 
                    step="0.1"
                    className="w-full mt-1 p-3 bg-gray-50 rounded-lg border border-gray-200 font-bold text-lg"
                    placeholder="0.0"
                    value={weightInput}
                    onChange={(e) => setWeightInput(e.target.value)}
                    required
                />
                </div>

                <div className="bg-gray-100 p-3 rounded-lg flex justify-between items-center">
                <span className="text-gray-600">Estimasi Poin:</span>
                <span className="font-bold text-green-600 text-xl">
                    {weightInput ? Math.floor(parseFloat(weightInput) * selectedWaste.price) : 0} Poin
                </span>
                </div>

                <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold shadow-md">
                Konfirmasi
                </button>
            </form>
            </div>
        )}

        {viewMode === 'inventory' && (
            <div>
                {showInvForm ? (
                    <div className="bg-white p-5 rounded-2xl shadow-lg border border-blue-100 mb-6 relative">
                        <button onClick={() => setShowInvForm(false)} className="absolute top-4 right-4 text-gray-400"><X size={20}/></button>
                        <h3 className="font-bold text-gray-800 mb-4">{editItem ? 'Edit Barang' : 'Tambah Barang Baru'}</h3>
                        <div className="space-y-3">
                            <input className="w-full p-2 border rounded-lg" placeholder="Nama Barang" value={invForm.name} onChange={e => setInvForm({...invForm, name: e.target.value})} />
                            <div className="flex gap-2">
                                <input type="number" className="w-1/2 p-2 border rounded-lg" placeholder="Stok" value={invForm.stock} onChange={e => setInvForm({...invForm, stock: e.target.value})} />
                                <input type="number" className="w-1/2 p-2 border rounded-lg" placeholder="Harga (Poin)" value={invForm.price} onChange={e => setInvForm({...invForm, price: e.target.value})} />
                            </div>
                            <select className="w-full p-2 border rounded-lg" value={invForm.image} onChange={e => setInvForm({...invForm, image: e.target.value})}>
                                <option value="oil">Ikon Minyak</option>
                                <option value="rice">Ikon Beras</option>
                                <option value="sugar">Ikon Gula</option>
                                <option value="egg">Ikon Telur</option>
                                <option value="noodle">Ikon Mie</option>
                                <option value="package">Ikon Paket Sembako</option>
                            </select>
                            <button onClick={handleSaveItem} className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold flex items-center justify-center gap-2">
                                <Save size={18} /> Simpan
                            </button>
                        </div>
                    </div>
                ) : (
                    <button onClick={() => { setEditItem(null); setInvForm({name:'', stock:'', price:'', image:'oil'}); setShowInvForm(true); }} className="w-full py-3 mb-4 bg-blue-50 text-blue-600 rounded-xl font-bold border border-blue-200 flex items-center justify-center gap-2">
                        <Plus size={18}/> Tambah Stok Barang
                    </button>
                )}

                <div className="space-y-3">
                    {products.map(p => (
                        <div key={p.id} className="bg-white p-3 rounded-xl shadow-sm flex justify-between items-center">
                            <div>
                                <h4 className="font-bold text-gray-800">{p.name}</h4>
                                <div className="text-xs text-gray-500 flex gap-3 mt-1">
                                    <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded">Stok: {p.stock}</span>
                                    <span className="bg-orange-50 text-orange-600 px-2 py-0.5 rounded">{p.price} Poin</span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => openEdit(p)} className="p-2 bg-gray-100 rounded-lg text-gray-600 hover:bg-gray-200"><Edit size={16}/></button>
                                <button onClick={() => handleDeleteItem(p.id)} className="p-2 bg-red-50 rounded-lg text-red-500 hover:bg-red-100"><Trash2 size={16}/></button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {viewMode === 'users' && (
            <div>
                 <div className="bg-white p-5 rounded-2xl shadow-sm border border-orange-100 mb-6">
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Users className="text-orange-500" /> Tambah User Baru
                    </h3>
                    <div className="space-y-3">
                        <div className="flex gap-2 mb-2">
                            <button 
                                onClick={() => setNewUserForm({...newUserForm, role: 'user'})}
                                className={`flex-1 py-1.5 text-xs font-bold rounded ${newUserForm.role === 'user' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-500'}`}
                            >
                                Warga
                            </button>
                            <button 
                                onClick={() => setNewUserForm({...newUserForm, role: 'admin'})}
                                className={`flex-1 py-1.5 text-xs font-bold rounded ${newUserForm.role === 'admin' ? 'bg-orange-600 text-white' : 'bg-gray-100 text-gray-500'}`}
                            >
                                Admin
                            </button>
                        </div>
                        <input 
                            className="w-full p-2 bg-gray-50 border rounded-lg" 
                            placeholder="Nama Lengkap" 
                            value={newUserForm.name} 
                            onChange={e => setNewUserForm({...newUserForm, name: e.target.value})} 
                        />
                        <div className="flex gap-2">
                            <input 
                                className="w-1/2 p-2 bg-gray-50 border rounded-lg" 
                                placeholder="Username" 
                                value={newUserForm.username} 
                                onChange={e => setNewUserForm({...newUserForm, username: e.target.value})} 
                            />
                            <input 
                                type="text"
                                className="w-1/2 p-2 bg-gray-50 border rounded-lg" 
                                placeholder="Password" 
                                value={newUserForm.password} 
                                onChange={e => setNewUserForm({...newUserForm, password: e.target.value})} 
                            />
                        </div>
                        <button 
                            onClick={handleAddUser}
                            className="w-full bg-orange-500 text-white py-2 rounded-lg font-bold shadow-md hover:bg-orange-600 transition"
                        >
                            <Plus size={16} className="inline mr-1"/> Tambah {newUserForm.role === 'admin' ? 'Admin' : 'Warga'}
                        </button>
                    </div>
                </div>

                <h3 className="font-bold text-gray-600 mb-2 px-1">Daftar Admin Gudang</h3>
                <div className="space-y-2 mb-4">
                    {users.filter(u => u.role === 'admin').map(u => (
                        <div key={u.id} className="bg-white p-3 rounded-xl shadow-sm border-l-4 border-orange-500 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <ShieldCheck size={20} className="text-orange-500"/>
                                <div>
                                    <p className="font-bold text-sm">{u.name}</p>
                                    <p className="text-xs text-gray-400">@{u.username}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <h3 className="font-bold text-gray-600 mb-2 px-1">Daftar Warga Terbaru</h3>
                <div className="space-y-2">
                    {users.filter(u => u.role === 'user').slice(-5).reverse().map(u => (
                        <div key={u.id} className="bg-white p-3 rounded-xl shadow-sm border-l-4 border-green-500 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <User size={20} className="text-green-500"/>
                                <div>
                                    <p className="font-bold text-sm">{u.name}</p>
                                    <p className="text-xs text-gray-400">@{u.username}</p>
                                </div>
                            </div>
                            <span className="text-xs font-bold text-gray-500">{u.balance} Poin</span>
                        </div>
                    ))}
                </div>
            </div>
        )}
      </div>
    );
  };

  // --- MAIN RENDER ---

  if (!currentUser) return <AuthScreen />;

  if (activeTab === 'admin-dashboard') return (
     <>
      <AdminDashboard />
      {notification && (
        <div className={`fixed top-4 left-4 right-4 p-4 rounded-xl shadow-2xl z-50 flex items-center gap-3 text-white ${notification.type === 'error' ? 'bg-red-500' : 'bg-green-600'} animate-bounce`}>
           {notification.type === 'error' ? <AlertCircle/> : <CheckCircle/>}
           {notification.msg}
        </div>
      )}
     </>
  );

  return (
    <div className="max-w-md mx-auto bg-gray-50 h-screen overflow-hidden flex flex-col relative font-sans text-gray-800">
      
      {/* QR Modal Overlay */}
      {showQRModal && (
        <div className="fixed inset-0 z-[60] bg-black/80 flex items-center justify-center p-6 backdrop-blur-sm" onClick={() => setShowQRModal(false)}>
            <div className="bg-white p-8 rounded-3xl w-full max-w-xs text-center shadow-2xl transform scale-100 transition-all" onClick={e => e.stopPropagation()}>
                <h3 className="font-bold text-xl mb-2">ID: {currentUser.username}</h3>
                <p className="text-gray-500 text-sm mb-6">Tunjukkan kepada petugas admin</p>
                <div className="bg-white p-2 rounded-xl border-4 border-gray-800 inline-block mb-4">
                    <QrCode size={200} className="text-black" />
                </div>
                <button onClick={() => setShowQRModal(false)} className="w-full py-3 bg-gray-100 font-bold rounded-xl text-gray-600">Tutup</button>
            </div>
        </div>
      )}

      {/* Notification Toast */}
      {notification && (
        <div className={`fixed top-4 left-4 right-4 p-4 rounded-xl shadow-2xl z-50 flex items-center gap-3 text-white ${notification.type === 'error' ? 'bg-red-500' : 'bg-green-600'} transition-all transform duration-500`}>
           {notification.type === 'error' ? <AlertCircle/> : <CheckCircle/>}
           <p className="text-sm font-semibold">{notification.msg}</p>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'home' && <UserHome />}
        {activeTab === 'market' && <Marketplace />}
        {activeTab === 'cart' && <CartScreen />}
        {activeTab === 'history' && (
           <div className="p-4">
             <div className="flex items-center gap-3 mb-4">
                <button onClick={() => setActiveTab('home')}><ArrowRight className="rotate-180"/></button>
                <h2 className="text-xl font-bold">Riwayat Transaksi</h2>
             </div>
             <div className="space-y-3">
              {transactions.filter(t => t.userId === currentUser.id).map((t, idx) => (
                <div key={idx} className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-green-500 flex justify-between items-center">
                   <div>
                      <p className="font-bold text-gray-800">{t.desc}</p>
                      <p className="text-xs text-gray-400">{t.date}</p>
                   </div>
                   <span className={`font-bold ${t.type === 'earn' ? 'text-green-600' : 'text-orange-600'}`}>
                    {t.type === 'earn' ? '+' : '-'}{t.amount}
                   </span>
                </div>
              ))}
             </div>
           </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="bg-white border-t border-gray-200 px-6 py-3 flex justify-between items-center z-40">
        <button 
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center gap-1 ${activeTab === 'home' ? 'text-green-600' : 'text-gray-400'}`}
        >
          <Wallet size={24} strokeWidth={activeTab === 'home' ? 2.5 : 2} />
          <span className="text-[10px] font-medium">Dompet</span>
        </button>
        <button 
          onClick={() => setActiveTab('market')}
          className={`flex flex-col items-center gap-1 ${activeTab === 'market' ? 'text-green-600' : 'text-gray-400'}`}
        >
          <div className="relative">
             <Store size={24} strokeWidth={activeTab === 'market' ? 2.5 : 2} />
             {cart.length > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white w-3 h-3 rounded-full text-[8px] flex items-center justify-center">{cart.length}</span>}
          </div>
          <span className="text-[10px] font-medium">Mart</span>
        </button>
        
        {/* Floating Center Button (Simulated Scan) */}
        <div className="-mt-8">
          <button 
            onClick={() => setShowQRModal(true)}
            className="bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 active:scale-95 transition ring-4 ring-gray-50"
          >
            <QrCode size={28} />
          </button>
        </div>

        <button 
          onClick={() => setActiveTab('history')}
          className={`flex flex-col items-center gap-1 ${activeTab === 'history' ? 'text-green-600' : 'text-gray-400'}`}
        >
          <History size={24} strokeWidth={activeTab === 'history' ? 2.5 : 2} />
          <span className="text-[10px] font-medium">Riwayat</span>
        </button>
        <button 
          onClick={handleLogout}
          className="flex flex-col items-center gap-1 text-gray-400 hover:text-red-500"
        >
          <LogOut size={24} strokeWidth={2} />
          <span className="text-[10px] font-medium">Keluar</span>
        </button>
      </div>
    </div>
  );
}