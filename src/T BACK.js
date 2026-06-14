import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const dbPath = path.join(__dirname, 'db.json');

// Helper functions to read/write JSON file db
const readDB = () => {
  try {
    const data = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading db.json, returning empty defaults:', err);
    return { users: [], products: [], orders: [] };
  }
};

const writeDB = (data) => {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing to db.json:', err);
  }
};

// ═════════════════════════════════════════════════════════════════
// AUTH ENDPOINTS
// ═════════════════════════════════════════════════════════════════

// Login User
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Please provide email and password' });
  }
  
  const db = readDB();
  const user = db.users.find(u => u.email === email && u.password === password);
  
  if (user) {
    return res.json({
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      avatar: user.avatar
    });
  } else {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Update User Profile
app.put('/api/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const { name, avatar } = req.body;
  
  const db = readDB();
  const userIndex = db.users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  db.users[userIndex] = { ...db.users[userIndex], name, avatar };
  writeDB(db);
  
  res.json(db.users[userIndex]);
});

// ═════════════════════════════════════════════════════════════════
// PRODUCT CATALOG ENDPOINTS
// ═════════════════════════════════════════════════════════════════

// Get All Products
app.get('/api/products', (req, res) => {
  const db = readDB();
  res.json(db.products);
});

// Add New Product (Admin)
app.post('/api/products', (req, res) => {
  const { name, brand, cat, price, orig, stock, desc, img, color } = req.body;
  if (!name || !brand || !desc) {
    return res.status(400).json({ error: 'Please fill in Name, Brand and Description' });
  }
  
  const db = readDB();
  const newProduct = {
    id: Date.now(),
    name,
    brand,
    cat: cat || 'Electronics',
    price: Number(price) || 0,
    orig: Number(orig) || 0,
    stock: Number(stock) || 0,
    desc,
    img: img || '💻',
    color: color || 'rgba(255, 184, 0, 0.15)',
    rating: 4.5,
    reviews: 1
  };
  
  db.products.unshift(newProduct);
  writeDB(db);
  
  res.status(201).json(newProduct);
});

// Update Existing Product (Admin)
app.put('/api/products/:id', (req, res) => {
  const productId = parseInt(req.params.id);
  const { name, brand, cat, price, orig, stock, desc, img, color } = req.body;
  
  const db = readDB();
  const productIndex = db.products.findIndex(p => p.id === productId);
  
  if (productIndex === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }
  
  const updatedProduct = {
    ...db.products[productIndex],
    name: name !== undefined ? name : db.products[productIndex].name,
    brand: brand !== undefined ? brand : db.products[productIndex].brand,
    cat: cat !== undefined ? cat : db.products[productIndex].cat,
    price: price !== undefined ? Number(price) : db.products[productIndex].price,
    orig: orig !== undefined ? Number(orig) : db.products[productIndex].orig,
    stock: stock !== undefined ? Number(stock) : db.products[productIndex].stock,
    desc: desc !== undefined ? desc : db.products[productIndex].desc,
    img: img !== undefined ? img : db.products[productIndex].img,
    color: color !== undefined ? color : db.products[productIndex].color
  };
  
  db.products[productIndex] = updatedProduct;
  writeDB(db);
  
  res.json(updatedProduct);
});

// Delete Product (Admin)
app.delete('/api/products/:id', (req, res) => {
  const productId = parseInt(req.params.id);
  const db = readDB();
  
  const initialLength = db.products.length;
  db.products = db.products.filter(p => p.id !== productId);
  
  if (db.products.length === initialLength) {
    return res.status(404).json({ error: 'Product not found' });
  }
  
  writeDB(db);
  res.json({ message: 'Product deleted successfully from ledger' });
});

// ═════════════════════════════════════════════════════════════════
// ORDERS ENDPOINTS
// ═════════════════════════════════════════════════════════════════

// Get All Orders (Admin or User Analytics)
app.get('/api/orders', (req, res) => {
  const db = readDB();
  res.json(db.orders);
});

// Place Order
app.post('/api/orders', (req, res) => {
  const { userId, total, items, address, phone, payment } = req.body;
  if (!userId || !items || !items.length || !address || !phone || !payment) {
    return res.status(400).json({ error: 'Missing required checkout information' });
  }
  
  const db = readDB();
  
  // Verify inventory levels
  for (const item of items) {
    const product = db.products.find(p => p.id === item.pid);
    if (!product) {
      return res.status(400).json({ error: `Product not found: ${item.name}` });
    }
    if (product.stock < item.qty) {
      return res.status(400).json({ error: `Insufficient stock for product: ${item.name}` });
    }
  }
  
  // Deduct stock levels in db
  db.products = db.products.map(p => {
    const item = items.find(i => i.pid === p.id);
    if (item) {
      return { ...p, stock: Math.max(0, p.stock - item.qty) };
    }
    return p;
  });
  
  const newOrder = {
    id: `TZ${Date.now().toString().slice(-4)}`,
    userId: Number(userId),
    date: new Date().toISOString().slice(0, 10),
    status: 'Processing',
    total: Number(total),
    items: items.map(i => ({
      pid: Number(i.pid),
      name: i.name,
      qty: Number(i.qty),
      price: Number(i.price)
    })),
    address,
    phone,
    payment,
    tracking: `TRK-${Math.random().toString(36).slice(2, 8).toUpperCase()}`
  };
  
  db.orders.unshift(newOrder);
  writeDB(db);
  
  res.status(201).json(newOrder);
});

// Update Order Status (Admin upgrade status loop)
app.put('/api/orders/:id/status', (req, res) => {
  const orderId = req.params.id;
  const db = readDB();
  
  const orderIndex = db.orders.findIndex(o => o.id === orderId);
  if (orderIndex === -1) {
    return res.status(404).json({ error: 'Order not found' });
  }
  
  const currentStatus = db.orders[orderIndex].status;
  let nextStatus = 'Processing';
  if (currentStatus === 'Processing') nextStatus = 'Shipped';
  else if (currentStatus === 'Shipped') nextStatus = 'Delivered';
  else nextStatus = 'Processing';
  
  db.orders[orderIndex].status = nextStatus;
  writeDB(db);
  
  res.json(db.orders[orderIndex]);
});

// Serve static frontend files in production
const distPath = path.join(__dirname, '..', 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) {
      res.status(404).json({ error: 'API Endpoint not found' });
    } else {
      res.sendFile(path.join(distPath, 'index.html'));
    }
  });
}

app.listen(PORT, () => {
  console.log(`⚡ Thunder Zone API Server running at http://localhost:${PORT}`);
});
