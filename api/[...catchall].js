// Booking Jharkhand — Vercel Serverless API
// Single catch-all route for all /api/* endpoints
// In-memory store with seed data; resets on cold start

const DATA = {
  vendors: [
    { id: 'V-001', businessName: 'The Forest Homestay', ownerName: 'Anjali Mahato', category: 'hotel', gst: '20ABCDE1234F1Z5', phone: '+91-9876543210', email: 'anjali@foresthomestay.com', district: 'Latehar', address: '3 km from Netarhat Main Gate', status: 'active', documents: [{ name: 'GST Certificate', status: 'verified' }, { name: 'Aadhaar Card', status: 'verified' }, { name: 'Property Proof', status: 'pending' }], listingsCount: 3, totalBookings: 42, responseRate: 98, avgResponseTime: '1.2h', createdAt: '2026-06-10T08:00:00Z', updatedAt: '2026-06-18T14:30:00Z' },
    { id: 'V-002', businessName: 'Raj Cab Service', ownerName: 'Rajesh Kumar', category: 'cab', gst: '20FGHIJ5678K1L0', phone: '+91-8765432109', email: 'rajesh@rajcabs.com', district: 'Ranchi', address: 'Ratu Road, Ranchi', status: 'active', documents: [{ name: 'GST Certificate', status: 'verified' }, { name: 'Aadhaar Card', status: 'verified' }], listingsCount: 1, totalBookings: 38, responseRate: 95, avgResponseTime: '0.8h', createdAt: '2026-06-12T10:00:00Z', updatedAt: '2026-06-19T09:15:00Z' },
    { id: 'V-003', businessName: 'Jungle Cafe & Kitchen', ownerName: 'Suman Toppo', category: 'restaurant', gst: '', phone: '+91-7654321098', email: 'suman@junglecafe.com', district: 'Latehar', address: 'Netarhat Main Road', status: 'suspended', documents: [{ name: 'GST Certificate', status: 'not_uploaded' }, { name: 'Aadhaar Card', status: 'verified' }], listingsCount: 1, totalBookings: 12, responseRate: 70, avgResponseTime: '4.5h', createdAt: '2026-06-08T12:00:00Z', updatedAt: '2026-06-17T16:00:00Z' },
    { id: 'V-004', businessName: 'Saranda Eco Resort', ownerName: 'Mohan Lakra', category: 'hotel', gst: '20KLMNO9012P3Q4', phone: '+91-6543210987', email: 'mohan@sarandaresort.com', district: 'West Singhbhum', address: 'Saranda Forest, West Singhbhum', status: 'pending', documents: [{ name: 'GST Certificate', status: 'pending' }, { name: 'Aadhaar Card', status: 'verified' }, { name: 'Fire Safety', status: 'not_uploaded' }], listingsCount: 0, totalBookings: 0, responseRate: 0, avgResponseTime: '0h', createdAt: '2026-06-18T08:00:00Z', updatedAt: '2026-06-18T08:00:00Z' },
    { id: 'V-005', businessName: 'Betla Jungle Lodge', ownerName: 'Suman Tigga', category: 'hotel', gst: '20PQRST3456U7V8', phone: '+91-5432109876', email: 'suman@betlalodge.com', district: 'Palamu', address: 'Betla National Park Road', status: 'active', documents: [{ name: 'GST Certificate', status: 'verified' }, { name: 'Aadhaar Card', status: 'verified' }, { name: 'Wildlife Clearance', status: 'verified' }], listingsCount: 2, totalBookings: 18, responseRate: 88, avgResponseTime: '2.0h', createdAt: '2026-06-05T09:00:00Z', updatedAt: '2026-06-15T11:00:00Z' },
    { id: 'V-006', businessName: 'Patratu Lake Boating', ownerName: 'Vikram Oraon', category: 'experience', gst: '', phone: '+91-4321098765', email: 'vikram@patratuboats.com', district: 'Ramgarh', address: 'Patratu Lake, Ramgarh', status: 'pending', documents: [{ name: 'Aadhaar Card', status: 'verified' }], listingsCount: 0, totalBookings: 0, responseRate: 0, avgResponseTime: '0h', createdAt: '2026-06-19T14:00:00Z', updatedAt: '2026-06-19T14:00:00Z' }
  ],
  enquiries: [
    { id: 'ENQ-3421', type: 'hotel', customerName: 'Rahul Sharma', customerPhone: '+91-9876543210', customerEmail: 'rahul@email.com', customerCity: 'Mumbai', listingName: 'Netarhat Forest Retreat', vendorName: 'The Forest Homestay', vendorId: 'V-001', details: { checkIn: '2026-06-25', checkOut: '2026-06-27', guests: '2 Adults, 1 Child', roomType: 'Deluxe', budget: '₹3,000-4,000/night', specialRequests: 'Prefer ground floor' }, status: 'assigned', assignedTo: 'Anjali Mahato', priority: 'medium', source: '/hotel-netarhat.html', language: 'Hindi', messages: [{ from: 'customer', text: 'Is the deluxe room available for 25-27 June? We are a family of 3.', time: '2026-06-20T10:42:00' }, { from: 'vendor', text: 'Yes, deluxe room is available. ₹4,000/night incl. breakfast.', time: '2026-06-20T11:15:00' }, { from: 'agent', text: 'Sent confirmation to customer via WhatsApp.', time: '2026-06-20T12:30:00' }], createdAt: '2026-06-20T10:42:00Z', updatedAt: '2026-06-20T12:30:00Z' },
    { id: 'ENQ-3420', type: 'cab', customerName: 'Priya Mukherjee', customerPhone: '+91-8765432109', customerEmail: 'priya@email.com', customerCity: 'Kolkata', listingName: 'Ranchi to Deoghar', vendorName: 'Raj Cab Service', vendorId: 'V-002', details: { pickup: 'Ranchi Airport', dropoff: 'Deoghar', date: '2026-06-28', time: '08:00', cabType: 'Sedan', passengers: '2' }, status: 'confirmed', assignedTo: 'Rajesh Kumar', priority: 'medium', source: '/cab-booking.html', language: 'English', messages: [{ from: 'customer', text: 'Need a sedan from Ranchi Airport to Deoghar on 28 June.', time: '2026-06-20T09:15:00' }, { from: 'vendor', text: 'Confirmed. Sedan at ₹3,500. Driver will wait at arrival gate.', time: '2026-06-20T09:45:00' }], createdAt: '2026-06-20T09:15:00Z', updatedAt: '2026-06-20T09:45:00Z' },
    { id: 'ENQ-3419', type: 'package', customerName: 'Amit Kumar', customerPhone: '+91-7654321098', customerEmail: 'amit@email.com', customerCity: 'Delhi', listingName: 'Betla Wildlife Safari', vendorName: '', vendorId: '', details: { duration: '2 Days / 1 Night', adults: '4', accommodation: 'Jungle Lodge', preferredDate: '2026-07-10' }, status: 'new', assignedTo: '', priority: 'high', source: '/packages.html', language: 'Hindi', messages: [], createdAt: '2026-06-19T18:30:00Z', updatedAt: '2026-06-19T18:30:00Z' },
    { id: 'ENQ-3418', type: 'restaurant', customerName: 'Deepak Sinha', customerPhone: '+91-6543210987', customerEmail: 'deepak@email.com', customerCity: 'Jamshedpur', listingName: 'Jungle Cafe & Kitchen', vendorName: 'Jungle Cafe & Kitchen', vendorId: 'V-003', details: { date: '2026-06-22', time: '19:00', guests: '6', occasion: 'Birthday dinner', cuisine: 'Tribal' }, status: 'in_discussion', assignedTo: 'Suman Toppo', priority: 'low', source: '/restaurants.html', language: 'English', messages: [{ from: 'customer', text: 'Table for 6 on 22 June for birthday dinner.', time: '2026-06-19T14:00:00' }, { from: 'vendor', text: 'We can accommodate. Available slots: 7 PM or 8:30 PM.', time: '2026-06-19T15:30:00' }], createdAt: '2026-06-19T14:00:00Z', updatedAt: '2026-06-19T15:30:00Z' },
    { id: 'ENQ-3417', type: 'hotel', customerName: 'Neha Gupta', customerPhone: '+91-5432109876', customerEmail: 'neha@email.com', customerCity: 'Patna', listingName: 'Betla Jungle Lodge', vendorName: 'Betla Jungle Lodge', vendorId: 'V-005', details: { checkIn: '2026-07-05', checkOut: '2026-07-07', guests: '2 Adults', roomType: 'Standard', budget: '₹2,000-2,500/night' }, status: 'confirmed', assignedTo: 'Suman Tigga', priority: 'low', source: '/hotels.html', language: 'Hindi', messages: [{ from: 'customer', text: 'Standard room available for 5-7 July?', time: '2026-06-18T16:00:00' }, { from: 'vendor', text: 'Yes, ₹2,200/night. Confirmed.', time: '2026-06-18T16:30:00' }], createdAt: '2026-06-18T16:00:00Z', updatedAt: '2026-06-18T16:30:00Z' },
    { id: 'ENQ-3416', type: 'contact', customerName: 'Vikas Pandey', customerPhone: '+91-4321098765', customerEmail: 'vikas@travelagency.com', customerCity: 'Lucknow', listingName: '', vendorName: '', vendorId: '', details: { message: 'I want to partner with Booking Jharkhand. We are a travel agency based in Lucknow organizing group tours.' }, status: 'new', assignedTo: '', priority: 'medium', source: '/contact.html', language: 'English', messages: [], createdAt: '2026-06-18T11:00:00Z', updatedAt: '2026-06-18T11:00:00Z' }
  ],
  users: [
    { id: 'U-001', name: 'Rahul Sharma', email: 'rahul@email.com', role: 'customer', phone: '+91-9876543210', status: 'active', enquiries: 3, joinedAt: '2026-06-12' },
    { id: 'U-002', name: 'Anjali Mahato', email: 'anjali@foresthomestay.com', role: 'vendor', phone: '+91-9876543210', status: 'active', enquiries: 42, joinedAt: '2026-06-10' },
    { id: 'U-003', name: 'Admin User', email: 'admin@bookingjharkhand.com', role: 'admin', phone: '+91-9972934937', status: 'active', enquiries: 0, joinedAt: '2026-01-01' },
    { id: 'U-004', name: 'Priya Mukherjee', email: 'priya@email.com', role: 'customer', phone: '+91-8765432109', status: 'active', enquiries: 1, joinedAt: '2026-06-15' },
    { id: 'U-005', name: 'Mohan Lakra', email: 'mohan@sarandaresort.com', role: 'vendor', phone: '+91-6543210987', status: 'pending_verification', enquiries: 0, joinedAt: '2026-06-18' }
  ],
  listings: [
    { id: 'L-001', vendorId: 'V-001', type: 'hotel', name: 'Netarhat Forest Retreat', description: 'Premium cottages amidst pine forests with bonfire and organic dining.', images: [], pricing: [{ name: 'Standard Room', price: 2500, qty: 3 }, { name: 'Deluxe Room', price: 4000, qty: 2 }, { name: 'Dormitory', price: 800, qty: 8 }], location: { district: 'Latehar', address: 'Netarhat' }, amenities: ['WiFi', 'Bonfire', 'Parking', 'Restaurant'], tags: ['forest', 'netarhat', 'budget'], status: 'published', rating: 4.5, reviewCount: 23, createdAt: '2026-06-10' },
    { id: 'L-002', vendorId: 'V-002', type: 'cab', name: 'Raj Cab Service', description: 'Sedan, SUV and Tempo Traveller for local and outstation trips.', images: [], pricing: [{ name: 'Sedan', price: 12, unit: 'km' }, { name: 'SUV', price: 18, unit: 'km' }, { name: 'Tempo Traveller', price: 25, unit: 'km' }], location: { district: 'Ranchi', address: 'Ratu Road' }, amenities: ['GPS', 'AC', 'Music System'], tags: ['cab', 'taxi', 'ranchi'], status: 'published', rating: 4.3, reviewCount: 38, createdAt: '2026-06-12' }
  ],
  promotions: [
    { id: 'P-001', code: 'MONSOON25', type: 'percentage', value: 25, minCartValue: 1000, maxDiscount: 5000, applicableTypes: ['hotel'], usageLimit: 500, perUserLimit: 1, usedCount: 142, validFrom: '2026-07-01', validTo: '2026-08-31', isActive: true, description: 'Monsoon Madness - 25% off on all hotels' },
    { id: 'P-002', code: 'WELCOMEJHARK', type: 'flat', value: 500, minCartValue: 1500, maxDiscount: 500, applicableTypes: ['cab'], usageLimit: 200, perUserLimit: 1, usedCount: 89, validFrom: '2026-01-01', validTo: '2026-12-31', isActive: true, description: '₹500 off on first cab booking' },
    { id: 'P-003', code: 'NETHAT20', type: 'percentage', value: 20, minCartValue: 5000, maxDiscount: 3000, applicableTypes: ['package'], usageLimit: 100, perUserLimit: 1, usedCount: 34, validFrom: '2026-02-01', validTo: '2026-03-15', isActive: false, description: '20% off on Netarhat packages' }
  ]
};

const DASHBOARD = {
  totalEnquiries: 342,
  pendingVendors: { count: 2, items: ['V-004', 'V-006'] },
  activeListings: 156,
  openTickets: 8,
  monthlyRevenue: 240000,
  enquiriesThisWeek: [12, 18, 8, 22, 15, 10, 5],
  enquiriesByCategory: { hotel: 45, cab: 28, package: 18, restaurant: 9 },
  topDestinations: ['Netarhat', 'Deoghar', 'Ranchi', 'Betla', 'Patratu'],
  vendorGrowth: { vendorsThisMonth: 12, listingsThisMonth: 8, usersThisMonth: 342 },
  avgResponseTime: '2.4h',
  conversionRate: 27.4
};

function json(res, data, status = 200) {
  res.status(status).setHeader('Content-Type', 'application/json').end(JSON.stringify(data));
}

function parseUrl(reqUrl) {
  const url = new URL(reqUrl, 'http://localhost');
  const parts = url.pathname.replace('/api/', '').split('/').filter(Boolean);
  const params = Object.fromEntries(url.searchParams);
  return { parts, params };
}

function filterList(arr, params) {
  if (!params || Object.keys(params).length === 0) return arr;
  return arr.filter(item => {
    for (const key of Object.keys(params)) {
      if (key === 'search') {
        const s = params.search.toLowerCase();
        const haystack = JSON.stringify(Object.values(item)).toLowerCase();
        if (!haystack.includes(s)) return false;
      } else if (key === 'limit' || key === 'page') {
        continue;
      } else if (item[key] !== undefined) {
        if (String(item[key]).toLowerCase() !== params[key].toLowerCase()) return false;
      }
    }
    return true;
  });
}

function getNextId(items, prefix) {
  const nums = items.map(i => parseInt(i.id.replace(prefix, ''), 10)).filter(n => !isNaN(n));
  const max = nums.length ? Math.max(...nums) : 0;
  return prefix + String(max + 1).padStart(3, '0');
}

module.exports = async (req, res) => {
  const { parts, params } = parseUrl(req.url);
  const method = req.method.toUpperCase();

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (method === 'OPTIONS') return res.status(200).end();

  if (parts.length === 0) {
    if (method === 'GET') return json(res, { status: 'ok', service: 'Booking Jharkhand API', version: '1.0' });
    return json(res, { error: 'Not found' }, 404);
  }

  const resource = parts[0];
  const id = parts[1];

  // ─── Auth ──────────────────────────────────────────────
  if (resource === 'auth') {
    const sub = parts[1];
    if (sub === 'login' && method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', () => {
        try {
          const { email, password } = JSON.parse(body);
          if (email === 'admin@bookingjharkhand.com' && password === 'admin123') {
            return json(res, { token: 'jwt-admin-' + Date.now(), user: { id: 'U-003', name: 'Admin User', email, role: 'admin' } });
          }
          if (email === 'vendor@test.com' && password === 'vendor123') {
            return json(res, { token: 'jwt-vendor-' + Date.now(), user: { id: 'U-002', name: 'Anjali Mahato', email, role: 'vendor' } });
          }
          return json(res, { error: 'Invalid email or password' }, 401);
        } catch { return json(res, { error: 'Invalid request body' }, 400); }
      });
      return;
    }
    if (sub === 'register' && method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', () => {
        try {
          const data = JSON.parse(body);
          const vendor = { id: getNextId(DATA.vendors, 'V-'), ...data, status: 'pending', documents: [], listingsCount: 0, totalBookings: 0, responseRate: 0, avgResponseTime: '0h', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
          DATA.vendors.push(vendor);
          return json(res, { success: true, vendor, message: 'Application received! Our team will review within 48 hours.' }, 201);
        } catch { return json(res, { error: 'Invalid request body' }, 400); }
      });
      return;
    }
    return json(res, { error: 'Not found' }, 404);
  }

  // ─── Vendors ────────────────────────────────────────────
  if (resource === 'vendors') {
    if (!id && method === 'GET') {
      let result = filterList(DATA.vendors, params);
      return json(res, { data: result, total: result.length, page: 1, limit: 50 });
    }
    if (id && method === 'GET') {
      const v = DATA.vendors.find(x => x.id === id);
      return v ? json(res, v) : json(res, { error: 'Not found' }, 404);
    }
    if (id && method === 'PATCH') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', () => {
        try {
          const updates = JSON.parse(body);
          const idx = DATA.vendors.findIndex(x => x.id === id);
          if (idx === -1) return json(res, { error: 'Not found' }, 404);
          Object.assign(DATA.vendors[idx], updates, { updatedAt: new Date().toISOString() });
          return json(res, DATA.vendors[idx]);
        } catch { return json(res, { error: 'Invalid body' }, 400); }
      });
      return;
    }
    if (!id && method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', () => {
        try {
          const data = JSON.parse(body);
          const vendor = { id: getNextId(DATA.vendors, 'V-'), ...data, status: 'pending', documents: [], listingsCount: 0, totalBookings: 0, responseRate: 0, avgResponseTime: '0h', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
          DATA.vendors.push(vendor);
          return json(res, vendor, 201);
        } catch { return json(res, { error: 'Invalid body' }, 400); }
      });
      return;
    }
    // POST /api/vendors/register
    if (!id && parts[1] === 'register' && method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', () => {
        try {
          const data = JSON.parse(body);
          const vendor = { id: getNextId(DATA.vendors, 'V-'), ...data, status: 'pending', documents: [], listingsCount: 0, totalBookings: 0, responseRate: 0, avgResponseTime: '0h', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
          DATA.vendors.push(vendor);
          return json(res, { success: true, vendor, message: 'Application received! Our team will review within 48 hours.' }, 201);
        } catch { return json(res, { error: 'Invalid body' }, 400); }
      });
      return;
    }
    return json(res, { error: 'Method not allowed' }, 405);
  }

  // ─── Enquiries ──────────────────────────────────────────
  if (resource === 'enquiries') {
    if (!id && method === 'GET') {
      let result = filterList(DATA.enquiries, params);
      return json(res, { data: result, total: result.length, page: 1, limit: 50 });
    }
    if (id && method === 'GET') {
      const e = DATA.enquiries.find(x => x.id === id);
      return e ? json(res, e) : json(res, { error: 'Not found' }, 404);
    }
    if (id && method === 'PATCH') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', () => {
        try {
          const updates = JSON.parse(body);
          const idx = DATA.enquiries.findIndex(x => x.id === id);
          if (idx === -1) return json(res, { error: 'Not found' }, 404);
          Object.assign(DATA.enquiries[idx], updates, { updatedAt: new Date().toISOString() });
          return json(res, DATA.enquiries[idx]);
        } catch { return json(res, { error: 'Invalid body' }, 400); }
      });
      return;
    }
    if (!id && method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', () => {
        try {
          const data = JSON.parse(body);
          const enq = { id: getNextId(DATA.enquiries, 'ENQ-'), ...data, status: 'new', messages: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
          DATA.enquiries.push(enq);
          return json(res, enq, 201);
        } catch { return json(res, { error: 'Invalid body' }, 400); }
      });
      return;
    }
    // POST /api/enquiries/:id/messages
    if (id && parts[2] === 'messages' && method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', () => {
        try {
          const msg = JSON.parse(body);
          const idx = DATA.enquiries.findIndex(x => x.id === id);
          if (idx === -1) return json(res, { error: 'Not found' }, 404);
          DATA.enquiries[idx].messages.push({ ...msg, time: new Date().toISOString() });
          DATA.enquiries[idx].updatedAt = new Date().toISOString();
          return json(res, DATA.enquiries[idx]);
        } catch { return json(res, { error: 'Invalid body' }, 400); }
      });
      return;
    }
    // POST /api/enquiries/:id/notes
    if (id && parts[2] === 'notes' && method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', () => {
        try {
          const { text } = JSON.parse(body);
          const idx = DATA.enquiries.findIndex(x => x.id === id);
          if (idx === -1) return json(res, { error: 'Not found' }, 404);
          if (!DATA.enquiries[idx].notes) DATA.enquiries[idx].notes = [];
          DATA.enquiries[idx].notes.push({ text, time: new Date().toISOString() });
          DATA.enquiries[idx].updatedAt = new Date().toISOString();
          return json(res, DATA.enquiries[idx]);
        } catch { return json(res, { error: 'Invalid body' }, 400); }
      });
      return;
    }
    return json(res, { error: 'Method not allowed' }, 405);
  }

  // ─── Users ──────────────────────────────────────────────
  if (resource === 'users') {
    if (!id && method === 'GET') {
      let result = filterList(DATA.users, params);
      return json(res, { data: result, total: result.length, page: 1, limit: 50 });
    }
    if (id && method === 'GET') {
      const u = DATA.users.find(x => x.id === id);
      return u ? json(res, u) : json(res, { error: 'Not found' }, 404);
    }
    if (id && method === 'PATCH') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', () => {
        try {
          const updates = JSON.parse(body);
          const idx = DATA.users.findIndex(x => x.id === id);
          if (idx === -1) return json(res, { error: 'Not found' }, 404);
          Object.assign(DATA.users[idx], updates);
          return json(res, DATA.users[idx]);
        } catch { return json(res, { error: 'Invalid body' }, 400); }
      });
      return;
    }
    return json(res, { error: 'Method not allowed' }, 405);
  }

  // ─── Listings ───────────────────────────────────────────
  if (resource === 'listings') {
    if (!id && method === 'GET') {
      let result = filterList(DATA.listings, params);
      return json(res, { data: result, total: result.length, page: 1, limit: 50 });
    }
    if (id && method === 'GET') {
      const l = DATA.listings.find(x => x.id === id);
      return l ? json(res, l) : json(res, { error: 'Not found' }, 404);
    }
    if (!id && method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', () => {
        try {
          const data = JSON.parse(body);
          const listing = { id: getNextId(DATA.listings, 'L-'), ...data, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
          DATA.listings.push(listing);
          return json(res, listing, 201);
        } catch { return json(res, { error: 'Invalid body' }, 400); }
      });
      return;
    }
    if (id && method === 'PUT') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', () => {
        try {
          const data = JSON.parse(body);
          const idx = DATA.listings.findIndex(x => x.id === id);
          if (idx === -1) return json(res, { error: 'Not found' }, 404);
          Object.assign(DATA.listings[idx], data, { updatedAt: new Date().toISOString() });
          return json(res, DATA.listings[idx]);
        } catch { return json(res, { error: 'Invalid body' }, 400); }
      });
      return;
    }
    if (id && method === 'DELETE') {
      const idx = DATA.listings.findIndex(x => x.id === id);
      if (idx === -1) return json(res, { error: 'Not found' }, 404);
      DATA.listings.splice(idx, 1);
      return json(res, { success: true });
    }
    return json(res, { error: 'Method not allowed' }, 405);
  }

  // ─── Promotions ─────────────────────────────────────────
  if (resource === 'promotions') {
    if (!id && method === 'GET') {
      let result = filterList(DATA.promotions, params);
      return json(res, { data: result, total: result.length, page: 1, limit: 50 });
    }
    if (id && method === 'GET') return json(res, DATA.promotions.find(x => x.id === id) || { error: 'Not found' }, 404);
    if (!id && method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', () => {
        try {
          const data = JSON.parse(body);
          const promo = { id: getNextId(DATA.promotions, 'P-'), ...data, createdAt: new Date().toISOString() };
          DATA.promotions.push(promo);
          return json(res, promo, 201);
        } catch { return json(res, { error: 'Invalid body' }, 400); }
      });
      return;
    }
    return json(res, { error: 'Method not allowed' }, 405);
  }

  // ─── Dashboard ──────────────────────────────────────────
  if (resource === 'dashboard') {
    if (parts[1] === 'stats' && method === 'GET') return json(res, DASHBOARD);
    return json(res, { error: 'Not found' }, 404);
  }

  // ─── Contact ────────────────────────────────────────────
  if (resource === 'contact' && method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        const enq = { id: getNextId(DATA.enquiries, 'ENQ-'), type: 'contact', ...data, status: 'new', messages: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
        DATA.enquiries.push(enq);
        return json(res, { success: true, message: 'Thank you! We will get back to you shortly.' }, 201);
      } catch { return json(res, { error: 'Invalid body' }, 400); }
    });
    return;
  }

  // ─── Health ─────────────────────────────────────────────
  if (resource === 'health' && method === 'GET') {
    return json(res, { status: 'ok', uptime: process.uptime() });
  }

  return json(res, { error: 'Not found' }, 404);
};
