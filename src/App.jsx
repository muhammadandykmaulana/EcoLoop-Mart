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
  ArrowDown,
  Calendar,
  CreditCard,
  BarChart3,
  PieChart,
  Truck,
  Activity,
  Box,
  Hammer,
  Store as StoreIcon,
  ChevronLeft
} from 'lucide-react';

// --- INITIAL DATA ---
const INITIAL_USERS = [
  { id: 'u1', username: 'budi', password: '123', name: 'Budi Santoso', role: 'user', balance: 150, joined: '01/10/2025', status: 'active', isNew: false },
  { id: 'u2', username: 'siti', password: '123', name: 'Siti Aminah', role: 'user', balance: 0, joined: '15/11/2025', status: 'active', isNew: true },
  { id: 'a1', username: 'admin', password: 'admin', name: 'Admin IndoApril', role: 'admin', balance: 0, joined: '01/10/2025', status: 'active', isNew: false },
];

// Added 'weight' property to transactions for analytics
const INITIAL_TRANSACTIONS = [
  { id: 't1', userId: 'u1', type: 'earn', amount: 50, category: 'Kardus Bekas', desc: 'Setor 2.5kg Kardus', weight: 2.5, date: '01/12/2023' },
  { id: 't2', userId: 'u1', type: 'spend', amount: 100, category: 'Belanja', desc: 'Tukar Minyak Goreng', weight: 0, date: '02/12/2023' },
  { id: 't3', userId: 'u2', type: 'earn', amount: 35, category: 'Botol Plastik', desc: 'Setor 1.0kg Botol', weight: 1.0, date: '03/12/2023' },
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

// --- SUB-COMPONENTS ---

const AnalyticsDetailModal = ({ isOpen, onClose, transactions, users, products }) => {
  const [partnerView, setPartnerView] = useState(null); // null, 'craftsman', 'supplier'

  if (!isOpen) return null;

  // 1. Total Sampah (Kg/Ton)
  const totalWeight = transactions.reduce((acc, t) => acc + (t.weight || 0), 0);
  const weightDisplay = totalWeight >= 1000 
    ? `${(totalWeight/1000).toFixed(2)} Ton` 
    : `${totalWeight.toFixed(1)} Kg`;

  // 2. Jumlah Setor Sampah Per Bulan (Simple count for now based on current data)
  const monthlyDeposits = transactions.filter(t => t.type === 'earn').length; 

  // 3. Jenis Sampah Terbanyak
  const wasteCount = {};
  transactions.filter(t => t.type === 'earn').forEach(t => {
    wasteCount[t.category] = (wasteCount[t.category] || 0) + (t.weight || 0);
  });
  const topWaste = Object.keys(wasteCount).length > 0 ? Object.keys(wasteCount).reduce((a, b) => wasteCount[a] > wasteCount[b] ? a : b) : '-';

  // 4. Poin Beredar & Ditukar
  const totalEarned = transactions.filter(t => t.type === 'earn').reduce((acc, t) => acc + t.amount, 0);
  const totalRedeemed = transactions.filter(t => t.type === 'spend').reduce((acc, t) => acc + t.amount, 0);
  const circulating = totalEarned - totalRedeemed;

  // 5. Perputaran Stok Sembako (Transaksi Spend)
  const stockTurnover = transactions.filter(t => t.type === 'spend').length;

  // 6. Pertumbuhan User (Mock Calculation based on array)
  const totalUsers = users.filter(u => u.role === 'user').length;
  const newUsersThisMonth = users.filter(u => u.role === 'user' && u.isNew).length;

  // --- DUMMY DATA MITRA ---
  const CRAFTSMEN_DATA = [
    { name: "CV Kreasi Plastik", product: "Paving Block & Bata", loc: "Tangerang" },
    { name: "Bank Sampah Kreatif", product: "Tas & Dompet Daur Ulang", loc: "Jakarta Selatan" },
    { name: "Studio Pot Botol", product: "Pot Tanaman Hias", loc: "Depok" }
  ];

  const SUPPLIER_DATA = [
    { name: "Toko H. Slamet", desc: "Agen Sembako Grosir", loc: "Ps. Kramat Jati" },
    { name: "Agen Beras Makmur Jaya", desc: "Spesialis Beras Premium", loc: "Ps. Induk Cipinang" },
    { name: "Grosir Telur Sumber Rejeki", desc: "Suplier Telur Ayam", loc: "Ps. Minggu" }
  ];

  return (
    <div className="fixed inset-0 z-[150] bg-gray-50 flex flex-col animate-in slide-in-from-bottom duration-300">
      <div className="bg-white p-4 border-b shadow-sm flex justify-between items-center sticky top-0 z-10">
        <h2 className="font-bold text-lg flex items-center gap-2"><BarChart3 className="text-blue-600"/> Laporan Analitik Lengkap</h2>
        <button onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"><X size={20}/></button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        
        {/* SECTION 1: CORE METRICS */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-green-500 to-green-600 p-4 rounded-2xl text-white shadow-lg">
            <div className="flex items-center gap-2 mb-2 opacity-80"><Trash2 size={16}/><span className="text-xs font-bold uppercase">Total Sampah</span></div>
            <p className="text-2xl font-black">{weightDisplay}</p>
            <p className="text-[10px] opacity-80 mt-1">Akumulasi seumur hidup</p>
          </div>
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-2xl text-white shadow-lg">
            <div className="flex items-center gap-2 mb-2 opacity-80"><Activity size={16}/><span className="text-xs font-bold uppercase">Transaksi Digital</span></div>
            <p className="text-2xl font-black">{transactions.length}</p>
            <p className="text-[10px] opacity-80 mt-1">Setoran & Penukaran</p>
          </div>
        </div>

        {/* SECTION 2: WASTE INSIGHTS */}
        <div className="bg-white p-5 rounded-2xl border shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4 text-sm uppercase tracking-wide">Analisis Sampah</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b pb-3 border-gray-100">
              <div className="flex items-center gap-3">
                <div className="bg-orange-100 p-2 rounded-lg text-orange-600"><TrendingUp size={18}/></div>
                <div>
                  <p className="text-xs text-gray-500">Jenis Terbanyak</p>
                  <p className="font-bold text-gray-800">{topWaste}</p>
                </div>
              </div>
              <span className="text-xs font-bold bg-gray-100 px-2 py-1 rounded">Dominan</span>
            </div>
            <div className="flex justify-between items-center border-b pb-3 border-gray-100">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-lg text-green-600"><Calendar size={18}/></div>
                <div>
                  <p className="text-xs text-gray-500">Setoran Bulan Ini</p>
                  <p className="font-bold text-gray-800">{monthlyDeposits} Transaksi</p>
                </div>
              </div>
              <span className="text-xs font-bold bg-green-50 text-green-600 px-2 py-1 rounded">+12% vs lalu</span>
            </div>
             <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-lg text-blue-600"><CheckCircle size={18}/></div>
                <div>
                  <p className="text-xs text-gray-500">Konsistensi Warga</p>
                  <p className="font-bold text-gray-800">85% Rutin</p>
                </div>
              </div>
              <span className="text-[10px] text-gray-400">Dummy Data</span>
            </div>
          </div>
        </div>

        {/* SECTION 3: FINANCE & STOCK */}
        <div className="bg-white p-5 rounded-2xl border shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4 text-sm uppercase tracking-wide">Ekosistem Poin & Stok</h3>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-gray-50 p-3 rounded-xl border">
              <p className="text-[10px] text-gray-500 mb-1">Poin Beredar</p>
              <p className="text-lg font-bold text-blue-600">{circulating}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-xl border">
              <p className="text-[10px] text-gray-500 mb-1">Poin Ditukar</p>
              <p className="text-lg font-bold text-orange-600">{totalRedeemed}</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Perputaran Stok</span>
              <span className="font-bold">{stockTurnover}x Restock Keluar</span>
            </div>
            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
               <div className="bg-orange-400 h-full w-[70%]"></div>
            </div>
            <div className="flex justify-between text-sm pt-2">
              <span className="text-gray-500">Akurasi Data Stok</span>
              <span className="font-bold text-green-600">99.2% (Valid)</span>
            </div>
             <p className="text-[10px] text-gray-400 italic">*Berdasarkan selisih stok fisik vs sistem</p>
          </div>
        </div>

        {/* SECTION 4: PARTNERSHIP & GROWTH (INTERACTIVE) */}
        <div className="bg-white p-5 rounded-2xl border shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wide">Mitra & Ekosistem</h3>
            {partnerView && (
              <button onClick={() => setPartnerView(null)} className="text-xs text-blue-600 flex items-center gap-1 font-bold">
                <ChevronLeft size={14}/> Kembali
              </button>
            )}
          </div>
          
          {partnerView === null ? (
            <>
              <div className="flex items-center gap-4 mb-6 bg-purple-50 p-4 rounded-xl">
                 <div className="bg-purple-100 p-3 rounded-full text-purple-600"><Users size={24}/></div>
                 <div className="flex-1">
                   <p className="text-xs text-gray-500">Pertumbuhan User</p>
                   <p className="font-bold text-lg text-gray-800">{totalUsers} Warga <span className="text-green-500 text-xs">(+{newUsersThisMonth} Baru)</span></p>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => setPartnerView('craftsman')}
                  className="border border-dashed border-gray-300 p-3 rounded-xl bg-gray-50 hover:bg-green-50 hover:border-green-300 transition text-left group"
                >
                   <div className="flex items-center gap-2 mb-2">
                     <Hammer size={14} className="text-gray-500 group-hover:text-green-600"/>
                     <span className="text-[10px] font-bold uppercase text-gray-500 group-hover:text-green-700">Pengrajin Sampah</span>
                   </div>
                   <p className="font-bold text-gray-800 text-sm">3 Mitra Aktif</p>
                   <p className="text-[10px] text-green-600 mt-1">Produk Bernilai Tambah</p>
                   <p className="text-[9px] text-gray-400 mt-2">Klik untuk detail</p>
                </button>
                <button 
                  onClick={() => setPartnerView('supplier')}
                  className="border border-dashed border-gray-300 p-3 rounded-xl bg-gray-50 hover:bg-blue-50 hover:border-blue-300 transition text-left group"
                >
                   <div className="flex items-center gap-2 mb-2">
                     <StoreIcon size={14} className="text-gray-500 group-hover:text-blue-600"/>
                     <span className="text-[10px] font-bold uppercase text-gray-500 group-hover:text-blue-700">Agen Grosir Pasar</span>
                   </div>
                   <p className="font-bold text-gray-800 text-sm">3 Toko Mitra</p>
                   <p className="text-[10px] text-blue-600 mt-1">Support UMKM Lokal</p>
                   <p className="text-[9px] text-gray-400 mt-2">Klik untuk detail</p>
                </button>
              </div>
            </>
          ) : partnerView === 'craftsman' ? (
            <div className="space-y-3 animate-in fade-in zoom-in duration-200">
               <div className="bg-green-100 p-3 rounded-xl mb-2 text-green-800 text-xs font-bold flex items-center gap-2">
                 <Hammer size={16}/> Daftar Mitra Pengrajin (Upcycling)
               </div>
               {CRAFTSMEN_DATA.map((item, idx) => (
                 <div key={idx} className="border p-3 rounded-xl bg-gray-50 flex justify-between items-start">
                    <div>
                      <p className="font-bold text-sm text-gray-800">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.loc}</p>
                    </div>
                    <div className="bg-green-200 text-green-800 text-[10px] px-2 py-1 rounded font-bold">
                      {item.product}
                    </div>
                 </div>
               ))}
            </div>
          ) : (
             <div className="space-y-3 animate-in fade-in zoom-in duration-200">
               <div className="bg-blue-100 p-3 rounded-xl mb-2 text-blue-800 text-xs font-bold flex items-center gap-2">
                 <StoreIcon size={16}/> Daftar Agen Grosir Pasar Tradisional
               </div>
               {SUPPLIER_DATA.map((item, idx) => (
                 <div key={idx} className="border p-3 rounded-xl bg-gray-50 flex justify-between items-start">
                    <div>
                      <p className="font-bold text-sm text-gray-800">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.loc}</p>
                    </div>
                    <div className="bg-blue-200 text-blue-800 text-[10px] px-2 py-1 rounded font-bold max-w-[100px] text-right">
                      {item.desc}
                    </div>
                 </div>
               ))}
            </div>
          )}

        </div>
        
        <div className="text-center pb-8 opacity-50">
          <p className="text-[10px] font-mono">System Report Generated Automatically</p>
        </div>

      </div>
    </div>
  );
};


const AdminUserManagement = ({ users, setUsers, showNotification }) => {
  const [editUser, setEditUser] = useState(null);
  const [userForm, setUserForm] = useState({ name: '', username: '', password: '', role: 'user' });

  const handleSaveUser = () => {
    if (!userForm.name || !userForm.username || !userForm.password) return;
    
    if (editUser) {
      setUsers(users.map(u => u.id === editUser.id ? { ...u, ...userForm } : u));
      showNotification('Data akun berhasil diperbarui');
    } else {
      if (users.find(u => u.username === userForm.username)) {
        return showNotification('Username sudah digunakan', 'error');
      }
      const newUser = { 
        id: (userForm.role === 'admin' ? 'a' : 'u') + Date.now(), 
        ...userForm, 
        balance: 0, 
        status: 'active', 
        joined: new Date().toLocaleDateString('id-ID'), 
        isNew: false 
      };
      setUsers([...users, newUser]);
      showNotification('Akun baru berhasil ditambahkan');
    }
    setEditUser(null);
    setUserForm({ name: '', username: '', password: '', role: 'user' });
  };

  const toggleStatus = (userId) => {
    setUsers(users.map(u => u.id === userId ? { ...u, status: u.status === 'active' ? 'disabled' : 'active' } : u));
    showNotification('Status akun berhasil diubah');
  };

  const startEdit = (user) => {
    setEditUser(user);
    setUserForm({ 
      name: user.name, 
      username: user.username, 
      password: user.password, 
      role: user.role 
    });
  };

  return (
    <div className="p-4 space-y-6 pb-24">
      <div className="bg-white p-5 rounded-3xl shadow-sm border">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          {editUser ? <Edit size={18}/> : <Plus size={18}/>} {editUser ? 'Edit Akun' : 'Tambah Akun'}
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
            <button onClick={handleSaveUser} className="flex-[2] py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-md active:scale-95 transition">Simpan</button>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="font-bold text-gray-500 text-xs uppercase px-1">Daftar Akun</h3>
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
              <button onClick={() => startEdit(u)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"><Edit size={16}/></button>
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

const AdminInventoryManagement = ({ products, setProducts, showNotification }) => {
  const [editItem, setEditItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [invForm, setInvForm] = useState({ name: '', stock: '', price: '', image: 'oil' });

  const handleSaveItem = () => {
    if (!invForm.name || !invForm.stock || !invForm.price) return;
    const newItem = {
      id: editItem ? editItem.id : 'p' + Date.now(),
      name: invForm.name,
      stock: parseInt(invForm.stock),
      price: parseInt(invForm.price),
      category: invForm.image === 'package' ? 'Paket' : 'Sembako',
      image: invForm.image
    };

    if (editItem) {
      setProducts(products.map(p => p.id === newItem.id ? newItem : p));
      showNotification('Barang berhasil diupdate');
    } else {
      setProducts([...products, newItem]);
      showNotification('Barang baru ditambahkan');
    }
    setShowForm(false);
    setEditItem(null);
    setInvForm({ name: '', stock: '', price: '', image: 'oil' });
  };

  const handleDeleteItem = (id) => {
    if(window.confirm('Hapus barang ini?')) {
      setProducts(products.filter(p => p.id !== id));
      showNotification('Barang dihapus');
    }
  };

  return (
    <div className="p-4 space-y-6 pb-24">
      {showForm ? (
        <div className="bg-white p-5 rounded-3xl shadow-lg border relative">
           <button onClick={() => setShowForm(false)} className="absolute top-4 right-4 text-gray-400"><X size={20}/></button>
           <h3 className="font-bold text-gray-800 mb-4">{editItem ? 'Edit Barang' : 'Tambah Barang'}</h3>
           <div className="space-y-3">
             <input className="w-full p-2.5 bg-gray-50 border rounded-xl text-sm" placeholder="Nama Barang" value={invForm.name} onChange={e => setInvForm({...invForm, name: e.target.value})} />
             <div className="flex gap-2">
               <input type="number" className="w-1/2 p-2.5 bg-gray-50 border rounded-xl text-sm" placeholder="Stok" value={invForm.stock} onChange={e => setInvForm({...invForm, stock: e.target.value})} />
               <input type="number" className="w-1/2 p-2.5 bg-gray-50 border rounded-xl text-sm" placeholder="Harga (Poin)" value={invForm.price} onChange={e => setInvForm({...invForm, price: e.target.value})} />
             </div>
             <select className="w-full p-2.5 bg-gray-50 border rounded-xl text-sm" value={invForm.image} onChange={e => setInvForm({...invForm, image: e.target.value})}>
               <option value="oil">Ikon Minyak</option>
               <option value="rice">Ikon Beras</option>
               <option value="sugar">Ikon Gula</option>
               <option value="egg">Ikon Telur</option>
               <option value="noodle">Ikon Mie</option>
               <option value="package">Ikon Paket Sembako</option>
             </select>
             <button onClick={handleSaveItem} className="w-full bg-blue-600 text-white py-2.5 rounded-xl font-bold flex items-center justify-center gap-2"><Save size={18}/> Simpan</button>
           </div>
        </div>
      ) : (
        <button onClick={() => { setEditItem(null); setInvForm({name:'', stock:'', price:'', image:'oil'}); setShowForm(true); }} className="w-full py-3 bg-blue-50 text-blue-600 rounded-xl font-bold border border-blue-200 flex items-center justify-center gap-2">
          <Plus size={18}/> Tambah Stok Barang
        </button>
      )}

      <div className="space-y-3">
        {products.map(p => (
          <div key={p.id} className="bg-white p-3 rounded-2xl shadow-sm border flex justify-between items-center">
            <div>
              <h4 className="font-bold text-gray-800 text-sm">{p.name}</h4>
              <div className="text-xs text-gray-500 flex gap-2 mt-1">
                 <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded">Stok: {p.stock}</span>
                 <span className="bg-orange-50 text-orange-600 px-2 py-0.5 rounded">{p.price} Poin</span>
              </div>
            </div>
            <div className="flex gap-1">
              <button onClick={() => { setEditItem(p); setInvForm(p); setShowForm(true); }} className="p-2 bg-gray-100 rounded-lg text-gray-600"><Edit size={16}/></button>
              <button onClick={() => handleDeleteItem(p.id)} className="p-2 bg-red-50 rounded-lg text-red-500"><Trash2 size={16}/></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const AdminDashboard = ({ users, products, updateUserBalance, setTransactions, transactions, showNotification }) => {
  const [depositUser, setDepositUser] = useState('');
  const [depositWeight, setDepositWeight] = useState('');
  const [selectedWaste, setSelectedWaste] = useState(WASTE_TYPES[0]);
  const [showAnalytics, setShowAnalytics] = useState(false);

  // Analytics Calculation
  const totalEarnedPoints = transactions.filter(t => t.type === 'earn').reduce((acc, curr) => acc + curr.amount, 0);
  const totalSpentPoints = transactions.filter(t => t.type === 'spend').reduce((acc, curr) => acc + curr.amount, 0);
  const wasteDistribution = {};
  
  transactions.filter(t => t.type === 'earn').forEach(t => {
    // Fallback if category not set (for old data compatibility)
    const cat = t.category || 'Lainnya'; 
    wasteDistribution[cat] = (wasteDistribution[cat] || 0) + 1;
  });

  const maxWasteCount = Math.max(...Object.values(wasteDistribution), 1);

  const handleDeposit = (e) => {
    e.preventDefault();
    if (!depositUser || !depositWeight) return;
    const points = Math.floor(parseFloat(depositWeight) * selectedWaste.price);
    
    updateUserBalance(depositUser, points);
    
    const newTx = {
      id: 't' + Date.now(),
      userId: depositUser,
      type: 'earn',
      amount: points,
      category: selectedWaste.name, 
      weight: parseFloat(depositWeight), // Save weight for analytics
      desc: `Setor ${depositWeight}${selectedWaste.unit} ${selectedWaste.name}`,
      date: new Date().toLocaleDateString('id-ID')
    };
    setTransactions([newTx, ...transactions]);
    
    setDepositWeight('');
    setDepositUser('');
    showNotification(`Berhasil! User +${points} Poin.`);
  };

  return (
    <div className="p-4 space-y-6 pb-24">
      {/* Analytics Modal */}
      <AnalyticsDetailModal 
        isOpen={showAnalytics} 
        onClose={() => setShowAnalytics(false)}
        transactions={transactions}
        users={users}
        products={products}
      />

      {/* 1. SIMPLE ANALYTICS DASHBOARD (SUMMARY) */}
      <div className="bg-gray-900 rounded-3xl p-5 text-white shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="flex items-center gap-2 font-bold text-sm text-gray-300"><BarChart3 size={16}/> Ringkasan Performa</h3>
          <button onClick={() => setShowAnalytics(true)} className="text-xs bg-gray-700 hover:bg-gray-600 px-3 py-1.5 rounded-full flex items-center gap-1 transition">
             Detail <ChevronRight size={12}/>
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-gray-800 p-3 rounded-2xl">
            <p className="text-[10px] text-gray-400 mb-1">Poin Dihasilkan</p>
            <p className="text-xl font-bold text-green-400">+{totalEarnedPoints}</p>
          </div>
          <div className="bg-gray-800 p-3 rounded-2xl">
            <p className="text-[10px] text-gray-400 mb-1">Poin Ditukar</p>
            <p className="text-xl font-bold text-orange-400">-{totalSpentPoints}</p>
          </div>
        </div>
        
        {/* Small trend bar */}
        <div className="flex items-center gap-2 text-xs text-gray-400 mt-2">
          <Activity size={14} className="text-blue-400"/>
          <span>{transactions.length} transaksi tercatat bulan ini</span>
        </div>
      </div>

      <div className="bg-white p-5 rounded-3xl border shadow-sm">
        <h3 className="font-bold mb-4 flex items-center gap-2 text-gray-800"><Recycle size={18} className="text-green-600"/> Input Setoran (Manual)</h3>
        <form onSubmit={handleDeposit} className="space-y-4">
          <div>
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Pilih Warga</label>
            <select className="w-full mt-1 p-3 bg-gray-50 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-500" value={depositUser} onChange={e => setDepositUser(e.target.value)}>
              <option value="">-- Pilih Akun --</option>
              {users.filter(u => u.role === 'user' && u.status === 'active').map(u => <option key={u.id} value={u.id}>{u.name} (@{u.username})</option>)}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Jenis Sampah</label>
            <div className="grid grid-cols-2 gap-2 mt-1">
              {WASTE_TYPES.map(w => (
                <button type="button" key={w.id} onClick={() => setSelectedWaste(w)} className={`p-2 rounded-xl text-xs font-bold border transition ${selectedWaste.id === w.id ? 'bg-green-100 border-green-500 text-green-700' : 'bg-white border-gray-200 text-gray-600'}`}>
                  {w.name}
                  <span className="block text-[10px] opacity-70 mt-1">Rp {w.price}/{w.unit}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Berat / Jumlah ({selectedWaste.unit})</label>
            <input type="number" step="0.1" className="w-full mt-1 p-3 bg-gray-50 border rounded-xl text-lg font-bold outline-none focus:ring-2 focus:ring-green-500" placeholder="0.0" value={depositWeight} onChange={e => setDepositWeight(e.target.value)}/>
          </div>

          <div className="bg-green-50 p-3 rounded-xl flex justify-between items-center border border-green-100">
            <span className="text-xs font-bold text-green-800">Estimasi:</span>
            <span className="text-xl font-black text-green-600">{depositWeight ? Math.floor(parseFloat(depositWeight) * selectedWaste.price) : 0} Poin</span>
          </div>

          <button type="submit" className="w-full bg-green-600 text-white py-3 rounded-xl font-bold shadow-md hover:bg-green-700 transition">Proses Setoran</button>
        </form>
      </div>
    </div>
  );
};

// --- MAIN APP ---

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
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('ecoLoopTransactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });
  const [cart, setCart] = useState([]);
  const [notification, setNotification] = useState(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    localStorage.setItem('ecoLoopUsers', JSON.stringify(users));
    localStorage.setItem('ecoLoopInventory', JSON.stringify(products));
    localStorage.setItem('ecoLoopTransactions', JSON.stringify(transactions));
  }, [users, products, transactions]);

  // Sync currentUser if Admin updates their own profile
  useEffect(() => {
    if (currentUser) {
      const updatedUser = users.find(u => u.id === currentUser.id);
      if (updatedUser && JSON.stringify(updatedUser) !== JSON.stringify(currentUser)) {
        setCurrentUser(updatedUser);
      }
    }
  }, [users]);

  const showNotification = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const updateUserBalance = (userId, amount) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, balance: u.balance + amount } : u));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCart([]);
    setActiveTab('home');
    setShowOnboarding(false);
  };

  // --- INTERNAL USER TABS ---

  const OnboardingOverlay = ({ onClose }) => {
    const [step, setStep] = useState(0);
    const slides = [
      { 
        title: "Selamat Datang!", 
        text: "EcoLoop Mart bantu kamu tukar sampah jadi sembako gratis. Gampang dan berkah!", 
        icon: <Recycle size={60} className="text-green-600"/> 
      },
      { 
        title: "Pilah Sampahmu", 
        content: (
          <div className="w-full space-y-3 mt-2">
            <div className="bg-green-50 p-3 rounded-xl border border-green-100 flex items-center gap-3">
              <CheckCircle size={20} className="text-green-600 flex-shrink-0"/>
              <div className="text-left">
                <p className="text-xs font-bold text-green-800">DITERIMA (CUAN)</p>
                <p className="text-[10px] text-green-700">Kardus, Botol Plastik Bersih, Kaleng, Minyak Jelantah.</p>
              </div>
            </div>
            <div className="bg-red-50 p-3 rounded-xl border border-red-100 flex items-center gap-3">
              <Ban size={20} className="text-red-500 flex-shrink-0"/>
              <div className="text-left">
                <p className="text-xs font-bold text-red-800">DITOLAK</p>
                <p className="text-[10px] text-red-700">Sampah Basah, Sisa Makanan, Popok, Kaca Pecah.</p>
              </div>
            </div>
          </div>
        ),
        icon: <Package size={60} className="text-orange-500"/> 
      },
      { 
        title: "Gimana Caranya?",
        content: (
          <div className="text-left space-y-3 mt-2 text-sm text-gray-600">
             <div className="flex gap-2"><div className="bg-green-100 w-6 h-6 rounded-full flex items-center justify-center text-green-700 font-bold text-xs shrink-0">1</div><p>Pisahkan sampah kering & bersih.</p></div>
             <div className="flex gap-2"><div className="bg-green-100 w-6 h-6 rounded-full flex items-center justify-center text-green-700 font-bold text-xs shrink-0">2</div><p>Bawa ke admin, tunjukkan QR Code.</p></div>
             <div className="flex gap-2"><div className="bg-green-100 w-6 h-6 rounded-full flex items-center justify-center text-green-700 font-bold text-xs shrink-0">3</div><p>Terima Poin & Tukar Sembako!</p></div>
          </div>
        ),
        icon: <HelpCircle size={60} className="text-blue-500"/>
      },
      // SLIDE BARU: BANTUAN AKUN
      {
        title: "Bantuan Akun",
        content: (
          <div className="text-center space-y-3 mt-2 text-gray-600">
             <p className="text-sm font-bold text-gray-800">Lupa Password / Akun Terkunci?</p>
             <div className="bg-orange-50 p-4 rounded-xl border border-orange-200 text-xs leading-relaxed text-orange-800">
                <p>⚠️ Jangan panik! Demi keamanan, reset password hanya bisa dilakukan oleh <strong>Petugas Admin</strong>.</p>
                <p className="mt-2 font-bold">Silakan kunjungi loket EcoLoop Mart terdekat.</p>
             </div>
          </div>
        ),
        icon: <Lock size={60} className="text-red-500"/>
      }
    ];

    const handleNext = () => {
      if (step < slides.length - 1) setStep(step + 1);
      else {
        if(onClose) onClose();
      }
    };

    return (
      <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-6 backdrop-blur-md">
        <div className="bg-white rounded-3xl p-8 max-w-xs w-full text-center space-y-6 animate-in zoom-in duration-300 relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-300 hover:text-gray-500"><X size={20}/></button>
          <div className="flex justify-center">{slides[step].icon}</div>
          <h2 className="text-2xl font-bold text-gray-800">{slides[step].title}</h2>
          
          {slides[step].content ? slides[step].content : <p className="text-gray-500 text-sm leading-relaxed">{slides[step].text}</p>}
          
          <div className="flex justify-center gap-1.5 pt-2">
            {slides.map((_, i) => <div key={i} className={`h-1.5 rounded-full transition-all ${step === i ? 'w-6 bg-green-600' : 'w-2 bg-gray-200'}`} />)}
          </div>
          <button onClick={handleNext} className="w-full bg-green-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 active:scale-95 transition">
            {step === slides.length - 1 ? "Saya Mengerti" : "Lanjut"} <ChevronRight size={18}/>
          </button>
        </div>
      </div>
    );
  };

  const AuthScreen = () => {
    const [authTab, setAuthTab] = useState('user');
    const [isRegister, setIsRegister] = useState(false);
    const [formData, setFormData] = useState({ username: '', password: '', name: '' });
    const [showFaq, setShowFaq] = useState(false);

    const handleAuth = (e) => {
      e.preventDefault();
      if (isRegister && authTab === 'user') {
        if (!formData.username || !formData.password || !formData.name) return showNotification('Data harus lengkap!', 'error');
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
        {showFaq && <OnboardingOverlay onClose={() => setShowFaq(false)} />}
        
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
              <div className="space-y-3 mt-4 text-center">
                <button onClick={() => setIsRegister(!isRegister)} className="text-sm text-green-600 font-bold underline block w-full">
                  {isRegister ? 'Sudah punya akun? Login' : 'Baru di sini? Daftar Warga'}
                </button>
                <div className="pt-2 border-t">
                  <button onClick={() => setShowFaq(true)} className="text-xs text-gray-400 hover:text-green-600 flex items-center justify-center gap-1 w-full py-2">
                    <HelpCircle size={14}/> HowTo & FAQs
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="w-full max-w-sm opacity-50 text-center">
          <p className="text-[10px] text-gray-400">© 2025 EcoLoop Mart System. Ver 2.1</p>
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

  const UserHistoryTab = () => {
    const myTransactions = transactions.filter(t => t.userId === currentUser.id);
    return (
      <div className="p-4 pb-24">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setActiveTab('home')} className="p-1"><ArrowRight className="rotate-180"/></button>
          <h2 className="text-xl font-bold">Riwayat Transaksi</h2>
        </div>
        {myTransactions.length === 0 ? (
          <div className="text-center py-20 text-gray-400">Belum ada riwayat transaksi.</div>
        ) : (
          <div className="space-y-3">
            {myTransactions.map((t, idx) => (
              <div key={idx} className="bg-white p-4 rounded-2xl shadow-sm border flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-full ${t.type === 'earn' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                    {t.type === 'earn' ? <TrendingUp size={20}/> : <ShoppingBag size={20}/>}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-gray-800">{t.desc}</p>
                    <p className="text-xs text-gray-400">{t.date}</p>
                  </div>
                </div>
                <span className={`font-bold text-sm ${t.type === 'earn' ? 'text-green-600' : 'text-orange-600'}`}>
                  {t.type === 'earn' ? '+' : '-'}{t.amount}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const UserProfileTab = () => (
    <div className="p-4 space-y-6 pb-24">
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 text-green-600">
          <User size={40}/>
        </div>
        <h2 className="text-lg font-bold text-gray-800">{currentUser.name}</h2>
        <p className="text-sm text-gray-500">@{currentUser.username}</p>
        <span className="inline-block mt-2 px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full">Member Warga</span>
      </div>

      <div className="space-y-3">
        <div className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3 text-sm font-bold text-gray-600">
            <Calendar size={18} className="text-gray-400"/> Bergabung
          </div>
          <span className="text-sm text-gray-800 font-medium">{currentUser.joined}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3 text-sm font-bold text-gray-600">
            <Wallet size={18} className="text-gray-400"/> Sisa Saldo
          </div>
          <span className="text-sm text-green-600 font-bold">{currentUser.balance} Poin</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3 text-sm font-bold text-gray-600">
            <CreditCard size={18} className="text-gray-400"/> Status Akun
          </div>
          <span className="text-sm text-blue-600 font-bold uppercase">{currentUser.status}</span>
        </div>
      </div>

      <button onClick={handleLogout} className="w-full py-3 bg-red-50 text-red-600 font-bold rounded-xl flex items-center justify-center gap-2 mt-8">
        <LogOut size={18}/> Keluar Aplikasi
      </button>
    </div>
  );

  // --- RENDER ---

  if (!currentUser) return <AuthScreen />;

  return (
    <div className="max-w-md mx-auto bg-gray-50 h-screen flex flex-col relative font-sans text-gray-800 overflow-hidden shadow-2xl border-x">
      
      {showOnboarding && <OnboardingOverlay onClose={() => setShowOnboarding(false)}/>}

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
            {activeTab === 'admin-dashboard' && <AdminDashboard users={users} products={products} updateUserBalance={updateUserBalance} setTransactions={setTransactions} transactions={transactions} showNotification={showNotification} />}
            {activeTab === 'admin-users' && <AdminUserManagement users={users} setUsers={setUsers} showNotification={showNotification} />}
            {activeTab === 'admin-inventory' && <AdminInventoryManagement products={products} setProducts={setProducts} showNotification={showNotification} />}
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
                        const newTx = {
                          id: 't' + Date.now(),
                          userId: currentUser.id,
                          type: 'spend',
                          amount: total,
                          desc: `Belanja ${cart.length} jenis item`,
                          date: new Date().toLocaleDateString('id-ID')
                        };
                        setTransactions([newTx, ...transactions]);
                        setCart([]); setActiveTab('home'); showNotification('Sembako siap diambil di loket Admin!');
                      }} className="w-full bg-green-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-green-200 active:scale-95 transition tracking-widest uppercase">Konfirmasi Sekarang</button>
                    </div>
                  ) : <div className="text-center py-20 text-gray-400">Keranjang kosong</div>}
                </div>
              </div>
            )}
            {activeTab === 'history' && <UserHistoryTab />}
            {activeTab === 'profile' && <UserProfileTab />}
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
            <button onClick={() => setActiveTab('profile')} className={`flex flex-col items-center gap-1 ${activeTab === 'profile' ? 'text-green-600' : 'text-gray-400'}`}>
              <User size={24} strokeWidth={activeTab === 'profile' ? 2.5 : 2}/><span className="text-[10px] font-bold">Profil</span>
            </button>
          </>
        ) : (
          <>
            <button onClick={() => setActiveTab('admin-dashboard')} className={`flex-1 flex flex-col items-center gap-1 ${activeTab === 'admin-dashboard' ? 'text-orange-500' : 'text-gray-400'}`}>
              <ShieldCheck size={24} strokeWidth={activeTab === 'admin-dashboard' ? 2.5 : 2}/><span className="text-[10px] font-bold">Dashboard</span>
            </button>
            <button onClick={() => setActiveTab('admin-users')} className={`flex-1 flex flex-col items-center gap-1 ${activeTab === 'admin-users' ? 'text-orange-500' : 'text-gray-400'}`}>
              <Users size={24} strokeWidth={activeTab === 'admin-users' ? 2.5 : 2}/><span className="text-[10px] font-bold">Akun</span>
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