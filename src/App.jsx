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
  Package,
  Users,
  ShieldCheck,
  ChevronRight,
  Ban,
  HelpCircle,
  ArrowDown
} from 'lucide-react';

// --- INITIAL DATA ---
const INITIAL_USERS = [
  { id: 'u1', username: 'budi', password: '123', name: 'Budi Santoso', role: 'user', balance: 150, joined: '2023-10-01', status: 'active', isNew: false },
  { id: 'u2', username: 'siti', password: '123', name: 'Siti Aminah', role: 'user', balance: 0, joined: '2023-11-15', status: 'active', isNew: true },
  { id: 'a1', username: 'admin', password: 'admin', name: 'Admin IndoApril', role: 'admin', balance: 0, joined: '2023-01-01', status: 'active', isNew: false },
];

const WASTE_TYPES = [
  { id: 'w1', name: 'Kardus Bekas', price: 20, unit: 'kg' },
  { id: 'w2', name: 'Botol Plastik', price: 35, unit: 'kg' },
  { id: 'w3', name: 'Kaleng Aluminium', price: 50, unit: 'kg' },
  { id: 'w4', name: 'Minyak Jelantah', price: 40, unit: 'liter' },
];

const DEFAULT_PRODUCTS = [
  { id: 'p1', name: 'Minyak Goreng 1L', price: 100, stock: 20, category: 'Sembako', image: 'oil' },
  { id: 'p2', name: 'Beras Premium 3Kg', price: 250, stock: 15, category: 'Sembako', image: 'rice' },
  { id: 'p3', name: 'Gula Pasir 1Kg', price: 80, stock: 30, category: 'Sembako', image: 'sugar' },
  { id: 'p4', name: 'Telur Ayam 1/2 Kg', price: 120, stock: 10, category: 'Lauk', image: 'egg' },
  { id: 'p5', name: 'Mie Instan (5 Pcs)', price: 40, stock: 100, category: 'Makanan', image: 'noodle' },
  { id: 'p6', name: 'Paket Sembako Lite (Beras, Minyak, Gula, Telur)', price: 500, stock: 5, category: 'Paket', image: 'package' },
];

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('home'); 
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('ecoLoopUsers');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('ecoLoopInventory');
    return saved ? JSON.parse(saved) : DEFAULT_PRODUCTS;
  });
  const [transactions, setTransactions] = useState([]);
  const [cart, setCart] = useState([]);
  const [notification, setNotification] = useState(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    localStorage.setItem('ecoLoopUsers', JSON.stringify(users));
    localStorage.setItem('ecoLoopInventory', JSON.stringify(products));
  }, [users, products]);

  const showNotification = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const updateUserBalance = (userId, amount) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, balance: u.balance + amount } : u));
    if (currentUser?.id === userId) {
      setCurrentUser(prev => ({ ...prev, balance: prev.balance + amount }));
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCart([]);
    setActiveTab('home');
    setShowOnboarding(false);
  };

  // --- UI COMPONENTS ---

  const OnboardingOverlay = () => {
    const [step, setStep] = useState(0);
    const slides = [
      { title: "Selamat Datang!", text: "EcoLoop Mart bantu kamu tukar sampah jadi sembako gratis. Gampang dan berkah!", icon: <Recycle size={60} className="text-green-600"/> },
      { title: "Kumpulin Sampah", text: "Kumpulin kardus, botol, atau minyak jelantah. Jangan dibuang, karena itu CUAN!", icon: <Package size={60} className="text-orange-500"/> },
      { title: "Tukar ke Admin", text: "Bawa ke loket, scan QR Code kamu, dan saldo poin bakal langsung masuk!", icon: <QrCode size={60} className="text-blue-500"/> },
      { title: "Belanja Sepuasnya", text: "Pake poin buat ambil Beras, Minyak, atau Paket Lite. Dapur ngepul terus!", icon: <ShoppingBag size={60} className="text-pink-500"/> }
    ];

    const handleNext = () => {
      if (step < slides.length - 1) setStep(step + 1);
      else {
        setShowOnboarding(false);
        setUsers(users.map(u => u.id === currentUser.id ? { ...u, isNew: false } : u));
      }
    };

    return (
      <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-6 backdrop-blur-md">
        <div className="bg-white rounded-3xl p-8 max-w-xs w-full text-center space-y-6 animate-in zoom-in duration-300">
          <div className="flex justify-center">{slides[step].icon}</div>
          <h2 className="text-2xl font-bold text-gray-800">{slides[step].title}</h2>
          <p className="text-gray-500 text-sm leading-relaxed">{slides[step].text}</p>
          <div className="flex justify-center gap-1.5">
            {slides.map((_, i) => <div key={i} className={`h-1.5 rounded-full transition-all ${step === i ? 'w-6 bg-green-600' : 'w-2 bg-gray-200'}`} />)}
          </div>
          <button onClick={handleNext} className="w-full bg-green-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 active:scale-95 transition">
            {step === slides.length - 1 ? "Mulai Belanja" : "Lanjut"} <ChevronRight size={18}/>
          </button>
        </div>
      </div>
    );
  };

  const AuthScreen = () => {
    const [authTab, setAuthTab] = useState('user');
    const [isRegister, setIsRegister] = useState(false);
    const [formData, setFormData] = useState({ username: '', password: '', name: '' });

    const handleAuth = (e) => {
      e.preventDefault();
      if (isRegister && authTab === 'user') {
        if (!formData.username || !formData.password || !formData.name) return showNotification('Mohon lengkapi Data Pendaftaran!', 'error');
        if (users.some(u => u.username === formData.username)) return showNotification('Username sudah dipakai', 'error');
        const newUser = { id: 'u' + Date.now(), ...formData, role: 'user', balance: 0, joined: new Date().toLocaleDateString('id-ID'), status: 'active', isNew: true };
        setUsers([...users, newUser]);
        setCurrentUser(newUser);
        setShowOnboarding(true);
        return;
      }

      const user = users.find(u => u.username === formData.username && u.password === formData.password);
      if (!user) return showNotification('Username/Password salah', 'error');
      if (user.status === 'disabled') return showNotification('Akun Anda dinonaktifkan Admin!', 'error');
      if (authTab === 'admin' && user.role !== 'admin') return showNotification('Hanya admin yang bisa login di sini', 'error');

      setCurrentUser(user);
      if (user.role === 'user' && user.isNew) setShowOnboarding(true);
      setActiveTab(user.role === 'admin' ? 'admin-dashboard' : 'home');
    };

    return (
      <div className="min-h-screen bg-green-50 flex flex-col items-center p-6 overflow-y-auto">
        <div className="bg-white p-4 rounded-full shadow-lg mb-4 mt-8">
          <Recycle size={60} className="text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-green-800 mb-1">EcoLoop Mart</h1>
        <p className="text-gray-500 text-center mb-8">Ekosistem Tukar Sampah Jadi Sembako</p>

        <div className="bg-white rounded-3xl shadow-xl w-full max-w-sm overflow-hidden mb-8">
          <div className="flex border-b">
            <button onClick={() => setAuthTab('user')} className={`flex-1 py-4 font-bold text-sm ${authTab === 'user' ? 'text-green-600 border-b-2 border-green-600' : 'bg-gray-50 text-gray-400'}`}>WARGA</button>
            <button onClick={() => setAuthTab('admin')} className={`flex-1 py-4 font-bold text-sm ${authTab === 'admin' ? 'text-orange-600 border-b-2 border-orange-600' : 'bg-gray-50 text-gray-400'}`}>ADMIN</button>
          </div>
          <div className="p-8">
            <form onSubmit={handleAuth} className="space-y-4">
              {isRegister && <input className="w-full p-3 bg-gray-50 border rounded-xl" placeholder="Nama Lengkap" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />}
              <input className="w-full p-3 bg-gray-50 border rounded-xl" placeholder="Username" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} />
              <input type="password" className="w-full p-3 bg-gray-50 border rounded-xl" placeholder="Password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
              <button type="submit" className={`w-full py-3 rounded-xl font-bold text-white transition ${authTab === 'admin' ? 'bg-orange-500' : 'bg-green-600'}`}>{isRegister ? 'Daftar Sekarang' : 'Masuk'}</button>
            </form>
            {authTab === 'user' && (
              <button onClick={() => setIsRegister(!isRegister)} className="w-full mt-4 text-sm text-green-600 font-bold underline">
                {isRegister ? 'Sudah punya akun? Login' : 'Baru di sini? Daftar Warga'}
              </button>
            )}
          </div>
        </div>

        {/* HOW TO SECTION */}
        <div className="w-full max-w-sm space-y-8 mb-12">
          <div className="text-center">
            <h3 className="text-lg font-bold text-gray-800">Gimana Caranya Biar Cuan?</h3>
            <p className="text-xs text-gray-500 italic">Gak ribet, cuma 3 langkah doang!</p>
          </div>

          <div className="space-y-4 relative">
            <div className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-green-100">
              <div className="bg-green-100 p-3 rounded-full text-green-600 font-bold">1</div>
              <div>
                <p className="font-bold text-sm">Kumpulin & Pilah</p>
                <p className="text-xs text-gray-500">Pisahin kardus, botol plastik, atau minyak jelantah bekas dapur.</p>
              </div>
            </div>
            <div className="flex justify-center text-green-300"><ArrowDown size={20}/></div>
            <div className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-green-100">
              <div className="bg-green-100 p-3 rounded-full text-green-600 font-bold">2</div>
              <div>
                <p className="font-bold text-sm">Setor ke Petugas</p>
                <p className="text-xs text-gray-500">Tunjukin QR Code member kamu ke admin buat nambah poin.</p>
              </div>
            </div>
            <div className="flex justify-center text-green-300"><ArrowDown size={20}/></div>
            <div className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-green-100">
              <div className="bg-green-100 p-3 rounded-full text-green-600 font-bold">3</div>
              <div>
                <p className="font-bold text-sm">Belanja Sembako</p>
                <p className="text-xs text-gray-500">Pake poinmu buat ambil beras, minyak, atau telur di Mart/Merchant.</p>
              </div>
            </div>
          </div>

          <div className="bg-green-100/50 p-6 rounded-3xl space-y-4 border border-green-100">
            <h4 className="font-bold text-green-800 flex items-center gap-2 text-sm"><HelpCircle size={16}/> Ada Kendala?</h4>
            <div className="text-xs text-green-700 space-y-3">
              <p><strong>Lupa Password?</strong> Tenang, jangan panik. Langsung hubungi Admin/Petugas di loket Merchant terdekat buat reset ya!</p>
              <p><strong>Sampah apa aja?</strong> Fokus kita ke barang kering (Kardus, Plastik, Kaleng) & Minyak Jelantah.</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const AdminUserTab = () => {
    const [editUser, setEditUser] = useState(null);
    const [userForm, setUserForm] = useState({ name: '', username: '', password: '', role: 'user' });

    const handleSaveUser = () => {
      if (!userForm.name || !userForm.username || !userForm.password) return;
      if (editUser) {
        setUsers(users.map(u => u.id === editUser.id ? { ...u, ...userForm } : u));
        showNotification('User berhasil diperbarui');
      } else {
        if (users.find(u => u.username === userForm.username)) return showNotification('Username sudah ada', 'error');
        setUsers([...users, { id: 'u' + Date.now(), ...userForm, balance: 0, status: 'active', joined: new Date().toLocaleDateString('id-ID'), isNew: false }]);
        showNotification('User baru ditambahkan');
      }
      setEditUser(null);
      setUserForm({ name: '', username: '', password: '', role: 'user' });
    };

    const toggleStatus = (userId) => {
      setUsers(users.map(u => u.id === userId ? { ...u, status: u.status === 'active' ? 'disabled' : 'active' } : u));
      showNotification('Status user diubah');
    };

    return (
      <div className="p-4 space-y-6 pb-24">
        <div className="bg-white p-5 rounded-3xl shadow-sm border">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            {editUser ? <Edit size={18}/> : <Plus size={18}/>} {editUser ? 'Edit Akun' : 'Tambah User'}
          </h3>
          <div className="space-y-3">
            <div className="flex gap-2 p-1 bg-gray-50 rounded-xl mb-2">
              <button onClick={() => setUserForm({...userForm, role: 'user'})} className={`flex-1 py-1.5 text-xs font-bold rounded-lg ${userForm.role === 'user' ? 'bg-green-600 text-white shadow' : 'text-gray-400'}`}>Warga</button>
              <button onClick={() => setUserForm({...userForm, role: 'admin'})} className={`flex-1 py-1.5 text-xs font-bold rounded-lg ${userForm.role === 'admin' ? 'bg-orange-500 text-white shadow' : 'text-gray-400'}`}>Admin</button>
            </div>
            <input className="w-full p-2.5 bg-gray-50 border rounded-xl text-sm" placeholder="Nama Lengkap" value={userForm.name} onChange={e => setUserForm({...userForm, name: e.target.value})} />
            <input className="w-full p-2.5 bg-gray-50 border rounded-xl text-sm" placeholder="Username" value={userForm.username} onChange={e => setUserForm({...userForm, username: e.target.value})} />
            <input className="w-full p-2.5 bg-gray-50 border rounded-xl text-sm" placeholder="Password" value={userForm.password} onChange={e => setUserForm({...userForm, password: e.target.value})} />
            <div className="flex gap-2 pt-2">
              {editUser && <button onClick={() => { setEditUser(null); setUserForm({name:'', username:'', password:'', role:'user'}); }} className="flex-1 py-2.5 bg-gray-100 text-gray-600 rounded-xl font-bold text-sm">Batal</button>}
              <button onClick={handleSaveUser} className="flex-[2] py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-md active:scale-95 transition">Simpan User</button>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="font-bold text-gray-500 text-xs uppercase px-1">Daftar Pengguna</h3>
          {users.map(u => (
            <div key={u.id} className={`bg-white p-4 rounded-2xl shadow-sm border flex items-center justify-between ${u.status === 'disabled' ? 'bg-gray-50 grayscale opacity-60' : ''}`}>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${u.role === 'admin' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>
                  {u.role === 'admin' ? <ShieldCheck size={20}/> : <User size={20}/>}
                </div>
                <div>
                  <p className="font-bold text-sm text-gray-800">{u.name} {u.status === 'disabled' && <span className="text-[9px] bg-red-100 text-red-600 px-1 rounded ml-1 font-black">DISABLED</span>}</p>
                  <p className="text-xs text-gray-400">@{u.username} • {u.balance} pts</p>
                </div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => { setEditUser(u); setUserForm(u); }} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"><Edit size={16}/></button>
                {u.role === 'user' && (
                  <button onClick={() => toggleStatus(u.id)} className={`p-2 rounded-lg ${u.status === 'disabled' ? 'text-green-600' : 'text-red-400'}`}>
                    {u.status === 'disabled' ? <CheckCircle size={16}/> : <Ban size={16}/>}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const UserHomeTab = () => (
    <div className="p-4 space-y-6 pb-24">
      <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <Recycle className="absolute -right-8 -bottom-8 opacity-10" size={160} />
        <p className="text-green-100 text-xs font-bold uppercase tracking-wider mb-1">Saldo EcoPoin</p>
        <h2 className="text-5xl font-bold mb-4">{currentUser.balance} <span className="text-lg font-normal opacity-70">pts</span></h2>
        <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl inline-block text-sm border border-white/20">
          ≈ Rp {(currentUser.balance * 150).toLocaleString('id-ID')}
        </div>
      </div>

      {currentUser.balance === 0 && (
        <div className="bg-orange-50 p-6 rounded-3xl border border-orange-200 text-center space-y-3">
          <div className="bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto text-orange-600"><Recycle size={24}/></div>
          <p className="font-bold text-orange-800">Saldo kamu masih kosong!</p>
          <p className="text-xs text-orange-700 leading-relaxed">Yuk, bawa sampah plastik atau kardusmu ke petugas Admin biar dapet poin dan bisa borong sembako!</p>
          <button onClick={() => setShowQRModal(true)} className="bg-orange-600 text-white text-xs px-4 py-2 rounded-lg font-bold shadow-md">Tunjukkin QR Member</button>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <button onClick={() => setShowQRModal(true)} className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center gap-3 active:scale-95 transition">
          <QrCode size={32} className="text-gray-700"/>
          <span className="text-xs font-bold text-gray-600">ID Member</span>
        </button>
        <button onClick={() => setActiveTab('market')} className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center gap-3 active:scale-95 transition">
          <Store size={32} className="text-green-600"/>
          <span className="text-xs font-bold text-gray-600">Tukar Poin</span>
        </button>
      </div>
    </div>
  );

  const MarketplaceTab = () => {
    const totalPoints = cart.reduce((a, c) => a + (c.price * c.qty), 0);

    return (
      <div className="p-4 pb-28">
        <h2 className="text-xl font-bold mb-4 px-1">Mart Warga</h2>
        
        {currentUser.balance === 0 && (
          <div className="bg-blue-50 p-4 rounded-2xl mb-6 border border-blue-100 flex items-start gap-3">
            <InfoIcon className="text-blue-500 mt-0.5" size={18}/>
            <p className="text-xs text-blue-700 leading-relaxed font-medium">Pengen belanja tapi poin masih nol? Langsung setor sampah keringmu ke <strong>IndoApril Mart</strong> buat isi saldo ya!</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          {products.map(p => (
            <div key={p.id} className="bg-white p-3 rounded-2xl border flex flex-col justify-between shadow-sm relative overflow-hidden">
              {p.category === 'Paket' && <div className="absolute top-0 right-0 bg-orange-500 text-white text-[9px] font-bold px-2 py-1 rounded-bl-lg">PAKET LITE</div>}
              <div className={`h-28 rounded-xl mb-3 flex items-center justify-center text-4xl ${p.category === 'Paket' ? 'bg-orange-50' : 'bg-gray-50'}`}>
                {p.image === 'oil' && '🌻'}{p.image === 'rice' && '🍚'}{p.image === 'package' && '📦'}{p.image === 'egg' && '🥚'}{p.image === 'noodle' && '🍜'}{p.image === 'sugar' && '🧂'}
              </div>
              <h3 className="text-sm font-bold line-clamp-2 leading-tight">{p.name}</h3>
              <div className="mt-3 flex justify-between items-center">
                <span className="text-orange-600 font-black text-sm">{p.price} pts</span>
                <button onClick={() => {
                  const exist = cart.find(c => c.id === p.id);
                  if (p.stock <= (exist?.qty || 0)) return showNotification('Stok Habis!', 'error');
                  setCart(exist ? cart.map(c => c.id === p.id ? {...c, qty: c.qty + 1} : c) : [...cart, {...p, qty: 1}]);
                }} className="bg-green-600 text-white p-1 rounded-lg shadow-sm"><Plus size={16}/></button>
              </div>
            </div>
          ))}
        </div>

        {cart.length > 0 && (
          <div className="fixed bottom-24 left-4 right-4 bg-gray-900 text-white p-4 rounded-2xl flex justify-between items-center shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div>
              <p className="text-[10px] opacity-60 font-bold uppercase">{cart.length} Item dipilih</p>
              <p className="font-bold text-lg">{totalPoints} pts</p>
            </div>
            <button onClick={() => setActiveTab('cart')} className="bg-orange-500 px-5 py-2 rounded-xl font-bold text-sm shadow-lg active:scale-95 transition">Checkout</button>
          </div>
        )}
      </div>
    );
  };

  // --- MAIN RENDER ---

  if (!currentUser) return <AuthScreen />;

  return (
    <div className="max-w-md mx-auto bg-gray-50 h-screen flex flex-col relative font-sans text-gray-800 overflow-hidden shadow-2xl border-x">
      
      {showOnboarding && <OnboardingOverlay />}

      {showQRModal && (
        <div className="fixed inset-0 z-[110] bg-black/80 flex items-center justify-center p-6 backdrop-blur-sm" onClick={() => setShowQRModal(false)}>
          <div className="bg-white p-8 rounded-3xl w-full max-w-xs text-center animate-in zoom-in duration-200" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-xl mb-1">ID: {currentUser.username}</h3>
            <p className="text-xs text-gray-400 mb-6">Tunjukkan QR ke petugas loket</p>
            <div className="bg-white p-4 rounded-xl border-4 border-gray-900 inline-block mb-6 shadow-sm"><QrCode size={180}/></div>
            <button onClick={() => setShowQRModal(false)} className="w-full py-3 bg-gray-100 font-bold rounded-xl text-gray-600 active:scale-95 transition">Tutup</button>
          </div>
        </div>
      )}

      {notification && (
        <div className={`fixed top-4 left-4 right-4 p-4 rounded-2xl shadow-2xl z-[120] flex items-center gap-3 text-white transform transition-all animate-in slide-in-from-top duration-300 ${notification.type === 'error' ? 'bg-red-500' : 'bg-green-600'}`}>
          {notification.type === 'error' ? <AlertCircle/> : <CheckCircle/>}
          <p className="text-sm font-semibold">{notification.msg}</p>
        </div>
      )}

      <div className="p-4 bg-white border-b flex justify-between items-center sticky top-0 z-40 shadow-sm">
        <div>
          <h2 className="font-bold text-lg leading-tight">{currentUser.role === 'admin' ? 'Admin IndoApril' : 'EcoLoop Mart'}</h2>
          <p className="text-[11px] text-gray-400">Halo, {currentUser.name}</p>
        </div>
        <button onClick={handleLogout} className="p-2 text-red-400 hover:bg-red-50 rounded-xl transition"><LogOut size={20}/></button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {currentUser.role === 'admin' ? (
          <>
            {activeTab === 'admin-dashboard' && (
              <div className="p-4 space-y-6 pb-24">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-600 p-5 rounded-3xl text-white shadow-lg">
                    <p className="text-[10px] font-bold opacity-70 uppercase mb-1">Total Warga</p>
                    <h3 className="text-3xl font-bold">{users.filter(u => u.role === 'user').length}</h3>
                  </div>
                  <div className="bg-orange-500 p-5 rounded-3xl text-white shadow-lg">
                    <p className="text-[10px] font-bold opacity-70 uppercase mb-1">Barang Mart</p>
                    <h3 className="text-3xl font-bold">{products.length}</h3>
                  </div>
                </div>
                <div className="bg-white p-5 rounded-3xl border shadow-sm">
                  <h3 className="font-bold mb-4 flex items-center gap-2 text-gray-800"><Recycle size={18} className="text-green-600"/> Input Setoran</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Pilih Nama Warga</label>
                      <select className="w-full mt-1 p-3 bg-gray-50 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-500" onChange={e => {
                        if (!e.target.value) return;
                        updateUserBalance(e.target.value, 50);
                        showNotification('Berhasil tambah 50 poin!');
                      }}>
                        <option value="">-- Pilih Akun Warga --</option>
                        {users.filter(u => u.role === 'user' && u.status === 'active').map(u => <option key={u.id} value={u.id}>{u.name} (@{u.username})</option>)}
                      </select>
                    </div>
                    <p className="text-[10px] text-gray-400 italic font-medium leading-relaxed">*Fitur cepat admin: Default nambah +50 poin per klik untuk tes.</p>
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'admin-users' && <AdminUserTab />}
            {activeTab === 'admin-inventory' && (
              <div className="p-4 space-y-4 pb-24 text-center py-20 text-gray-400">
                <Package size={48} className="mx-auto opacity-20 mb-2"/>
                <p className="text-sm font-medium">Fitur manajemen stok sedang dimaintenance.</p>
              </div>
            )}
          </>
        ) : (
          <>
            {activeTab === 'home' && <UserHomeTab />}
            {activeTab === 'market' && <MarketplaceTab />}
            {activeTab === 'cart' && (
              <div className="p-4 pb-24">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><button onClick={() => setActiveTab('market')}><ArrowRight className="rotate-180"/></button> Konfirmasi Penukaran</h2>
                <div className="space-y-4">
                  {cart.map(item => (
                    <div key={item.id} className="flex items-center justify-between border-b pb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-xl">{item.image === 'oil' ? '🌻' : item.image === 'rice' ? '🍚' : '📦'}</div>
                        <div>
                          <p className="font-bold text-sm leading-tight">{item.name}</p>
                          <p className="text-xs text-orange-500 font-bold">{item.price} pts x {item.qty}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 bg-gray-100 px-2 py-1.5 rounded-xl">
                        <button onClick={() => setCart(cart.map(c => c.id === item.id ? {...c, qty: Math.max(0, c.qty - 1)} : c).filter(c => c.qty > 0))}><Minus size={14}/></button>
                        <span className="font-bold text-sm w-4 text-center">{item.qty}</span>
                        <button onClick={() => setCart(cart.map(c => c.id === item.id ? {...c, qty: c.qty + 1} : c))}><Plus size={14}/></button>
                      </div>
                    </div>
                  ))}
                  {cart.length > 0 ? (
                    <div className="pt-6 space-y-4">
                      <div className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl">
                        <span className="text-sm font-bold text-gray-500 uppercase tracking-wide">Total Bayar</span>
                        <span className="text-xl font-black text-gray-800">{cart.reduce((a,c) => a + (c.price*c.qty), 0)} pts</span>
                      </div>
                      <button onClick={() => {
                        const total = cart.reduce((a,c) => a + (c.price*c.qty), 0);
                        if(currentUser.balance < total) return showNotification('Poin kamu nggak cukup!', 'error');
                        updateUserBalance(currentUser.id, -total);
                        setCart([]); setActiveTab('home'); showNotification('Sembako siap diambil di loket Admin!');
                      }} className="w-full bg-green-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-green-200 active:scale-95 transition tracking-widest uppercase">Konfirmasi Sekarang</button>
                    </div>
                  ) : <div className="text-center py-20 text-gray-400">Keranjang kosong</div>}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <div className="bg-white border-t px-8 py-3 flex justify-between items-center fixed bottom-0 left-0 right-0 max-w-md mx-auto z-50">
        {currentUser.role === 'user' ? (
          <>
            <button onClick={() => setActiveTab('home')} className={`flex flex-col items-center gap-1 ${activeTab === 'home' ? 'text-green-600' : 'text-gray-400'}`}>
              <Wallet size={24} strokeWidth={activeTab === 'home' ? 2.5 : 2}/><span className="text-[10px] font-bold">Dompet</span>
            </button>
            <button onClick={() => setActiveTab('market')} className={`flex flex-col items-center gap-1 ${activeTab === 'market' || activeTab === 'cart' ? 'text-green-600' : 'text-gray-400'}`}>
              <Store size={24} strokeWidth={activeTab === 'market' ? 2.5 : 2}/><span className="text-[10px] font-bold">Mart</span>
            </button>
            <div className="-mt-12 bg-white p-1 rounded-full"><button onClick={() => setShowQRModal(true)} className="bg-green-600 text-white p-4 rounded-full shadow-lg shadow-green-200 active:scale-90 transition"><QrCode size={28}/></button></div>
            <button onClick={() => setActiveTab('history')} className={`flex flex-col items-center gap-1 ${activeTab === 'history' ? 'text-green-600' : 'text-gray-400'}`}>
              <History size={24} strokeWidth={activeTab === 'history' ? 2.5 : 2}/><span className="text-[10px] font-bold">Riwayat</span>
            </button>
            <button className="flex flex-col items-center gap-1 text-gray-400"><User size={24}/><span className="text-[10px] font-bold">Profil</span></button>
          </>
        ) : (
          <>
            <button onClick={() => setActiveTab('admin-dashboard')} className={`flex-1 flex flex-col items-center gap-1 ${activeTab === 'admin-dashboard' ? 'text-orange-500' : 'text-gray-400'}`}>
              <ShieldCheck size={24} strokeWidth={activeTab === 'admin-dashboard' ? 2.5 : 2}/><span className="text-[10px] font-bold">Dashboard</span>
            </button>
            <button onClick={() => setActiveTab('admin-users')} className={`flex-1 flex flex-col items-center gap-1 ${activeTab === 'admin-users' ? 'text-orange-500' : 'text-gray-400'}`}>
              <Users size={24} strokeWidth={activeTab === 'admin-users' ? 2.5 : 2}/><span className="text-[10px] font-bold">Warga</span>
            </button>
            <button onClick={() => setActiveTab('admin-inventory')} className={`flex-1 flex flex-col items-center gap-1 ${activeTab === 'admin-inventory' ? 'text-orange-500' : 'text-gray-400'}`}>
              <Package size={24} strokeWidth={activeTab === 'admin-inventory' ? 2.5 : 2}/><span className="text-[10px] font-bold">Gudang</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function InfoIcon({ size, className }) {
  return <div className={`flex items-center justify-center rounded-full bg-blue-100 text-blue-600 p-1 ${className}`} style={{ width: size, height: size }}><AlertCircle size={size * 0.8}/></div>;
}