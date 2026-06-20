// ============================================================
// Booking Jharkhand — Chiti Console API Service
// Backend integration for vendor CRUD, enquiry inbox,
// Listing management, user management, and analytics
// ============================================================

var API = (function () {
  var API_BASE = (function () {
    var stored = localStorage.getItem('bj_api_base');
    if (stored) return stored + '/api';
    return 'https://chiti-console.vercel.app/api';
  })();

  // ─── Auth Token Management ──────────────────────────────
  var TOKEN_KEY = 'bj_auth_token';
  var USER_KEY = 'bj_user';

  function getToken() { return localStorage.getItem(TOKEN_KEY); }

  function setToken(token) { localStorage.setItem(TOKEN_KEY, token); }

  function getUser() {
    try { return JSON.parse(localStorage.getItem(USER_KEY)); } catch (e) { return null; }
  }

  function setUser(user) { localStorage.setItem(USER_KEY, JSON.stringify(user)); }

  function clearAuth() { localStorage.removeItem(TOKEN_KEY); localStorage.removeItem(USER_KEY); }

  function isAuthenticated() { return !!getToken(); }

  // ─── HTTP Helpers ───────────────────────────────────────
  function headers(extra) {
    var h = { 'Content-Type': 'application/json' };
    if (extra) Object.assign(h, extra);
    var token = getToken();
    if (token) h['Authorization'] = 'Bearer ' + token;
    return h;
  }

  function handleResponse(resp) {
    return resp.json().then(function (data) {
      if (!resp.ok) {
        var err = new Error(data.message || data.error || 'API request failed');
        err.status = resp.status;
        err.data = data;
        throw err;
      }
      return data;
    }).catch(function (err) {
      if (err.name === 'SyntaxError') {
        if (!resp.ok) {
          var e = new Error('API request failed with status ' + resp.status);
          e.status = resp.status;
          throw e;
        }
        return {};
      }
      throw err;
    });
  }

  function apiGet(path) {
    return fetch(API_BASE + path, { method: 'GET', headers: headers() }).then(handleResponse);
  }

  function apiPost(path, body) {
    return fetch(API_BASE + path, { method: 'POST', headers: headers(), body: JSON.stringify(body) }).then(handleResponse);
  }

  function apiPut(path, body) {
    return fetch(API_BASE + path, { method: 'PUT', headers: headers(), body: JSON.stringify(body) }).then(handleResponse);
  }

  function apiPatch(path, body) {
    return fetch(API_BASE + path, { method: 'PATCH', headers: headers(), body: JSON.stringify(body) }).then(handleResponse);
  }

  function apiDelete(path) {
    return fetch(API_BASE + path, { method: 'DELETE', headers: headers() }).then(handleResponse);
  }

  // ─── Mock Data (development/demo fallback) ──────────────
  var MOCK = {
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
    dashboard: {
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
    }
  };

  function withMock(fn) {
    return function () {
      var args = arguments;
      return fn.apply(null, args).catch(function (err) {
        if (err.name === 'TypeError' && err.message.indexOf('fetch') !== -1) {
          console.warn('API unavailable, using mock data');
          return null;
        }
        throw err;
      });
    };
  }

  // ============================================================
  //  PUBLIC API
  // ============================================================

  return {
    // ─── Auth ──────────────────────────────────────────────
    auth: {
      isAuthenticated: isAuthenticated,
      getUser: getUser,
      getToken: getToken,

      login: function (email, password) {
        return apiPost('/auth/login', { email: email, password: password }).then(function (data) {
          setToken(data.token);
          setUser(data.user);
          return data;
        }).catch(function () {
          if (email === 'admin@bookingjharkhand.com' && password === 'admin123') {
            var mockUser = { id: 'U-003', name: 'Admin User', email: email, role: 'admin' };
            setToken('mock-jwt-token-' + Date.now());
            setUser(mockUser);
            return { token: getToken(), user: mockUser };
          }
          if (email === 'vendor@test.com' && password === 'vendor123') {
            var mockVendor = { id: 'V-001', name: 'Anjali Mahato', email: email, role: 'vendor' };
            setToken('mock-jwt-token-' + Date.now());
            setUser(mockVendor);
            return { token: getToken(), user: mockVendor };
          }
          throw new Error('Invalid email or password');
        });
      },

      register: function (userData) {
        return apiPost('/auth/register', userData);
      },

      logout: function () {
        clearAuth();
      }
    },

    // ─── Vendors ───────────────────────────────────────────
    vendors: {
      list: function (params) {
        var q = params ? '?' + new URLSearchParams(params).toString() : '';
        return apiGet('/vendors' + q).catch(function () {
          var result = MOCK.vendors;
          if (params) {
            if (params.status) result = result.filter(function (v) { return v.status === params.status; });
            if (params.category) result = result.filter(function (v) { return v.category === params.category; });
            if (params.district) result = result.filter(function (v) { return v.district === params.district; });
            if (params.search) {
              var s = params.search.toLowerCase();
              result = result.filter(function (v) { return v.businessName.toLowerCase().indexOf(s) !== -1 || v.ownerName.toLowerCase().indexOf(s) !== -1 || v.phone.indexOf(s) !== -1; });
            }
          }
          return { data: result, total: result.length, page: 1, limit: 50 };
        });
      },

      getById: function (id) {
        return apiGet('/vendors/' + id).catch(function () {
          var vendor = MOCK.vendors.find(function (v) { return v.id === id; });
          if (!vendor) throw new Error('Vendor not found');
          return vendor;
        });
      },

      create: function (data) {
        return apiPost('/vendors', data);
      },

      update: function (id, data) {
        return apiPut('/vendors/' + id, data);
      },

      approve: function (id) {
        return apiPatch('/vendors/' + id, { status: 'active' });
      },

      reject: function (id, reason) {
        return apiPatch('/vendors/' + id, { status: 'rejected', rejectionReason: reason });
      },

      suspend: function (id, reason) {
        return apiPatch('/vendors/' + id, { status: 'suspended', suspensionReason: reason });
      },

      register: function (data) {
        return apiPost('/vendors/register', data);
      }
    },

    // ─── Enquiries ─────────────────────────────────────────
    enquiries: {
      list: function (params) {
        var q = params ? '?' + new URLSearchParams(params).toString() : '';
        return apiGet('/enquiries' + q).catch(function () {
          var result = MOCK.enquiries;
          if (params) {
            if (params.status) result = result.filter(function (e) { return e.status === params.status; });
            if (params.type) result = result.filter(function (e) { return e.type === params.type; });
            if (params.vendorId) result = result.filter(function (e) { return e.vendorId === params.vendorId; });
            if (params.search) {
              var s = params.search.toLowerCase();
              result = result.filter(function (e) { return e.customerName.toLowerCase().indexOf(s) !== -1 || e.id.toLowerCase().indexOf(s) !== -1 || e.customerPhone.indexOf(s) !== -1; });
            }
          }
          return { data: result, total: result.length, page: 1, limit: 50 };
        });
      },

      getById: function (id) {
        return apiGet('/enquiries/' + id).catch(function () {
          var enq = MOCK.enquiries.find(function (e) { return e.id === id; });
          if (!enq) throw new Error('Enquiry not found');
          return enq;
        });
      },

      create: function (data) {
        return apiPost('/enquiries', data);
      },

      updateStatus: function (id, status) {
        return apiPatch('/enquiries/' + id, { status: status });
      },

      assign: function (id, userId) {
        return apiPatch('/enquiries/' + id, { assignedTo: userId });
      },

      addNote: function (id, note) {
        return apiPost('/enquiries/' + id + '/notes', { text: note });
      },

      sendMessage: function (id, message) {
        return apiPost('/enquiries/' + id + '/messages', message);
      }
    },

    // ─── Listings ──────────────────────────────────────────
    listings: {
      list: function (params) {
        var q = params ? '?' + new URLSearchParams(params).toString() : '';
        return apiGet('/listings' + q).catch(function () {
          var result = MOCK.listings;
          if (params) {
            if (params.type) result = result.filter(function (l) { return l.type === params.type; });
            if (params.vendorId) result = result.filter(function (l) { return l.vendorId === params.vendorId; });
            if (params.status) result = result.filter(function (l) { return l.status === params.status; });
          }
          return { data: result, total: result.length, page: 1, limit: 50 };
        });
      },

      getById: function (id) {
        return apiGet('/listings/' + id);
      },

      create: function (data) { return apiPost('/listings', data); },

      update: function (id, data) { return apiPut('/listings/' + id, data); },

      delete: function (id) { return apiDelete('/listings/' + id); }
    },

    // ─── Users ─────────────────────────────────────────────
    users: {
      list: function (params) {
        var q = params ? '?' + new URLSearchParams(params).toString() : '';
        return apiGet('/users' + q).catch(function () {
          var result = MOCK.users;
          if (params) {
            if (params.role) result = result.filter(function (u) { return u.role === params.role; });
            if (params.status) result = result.filter(function (u) { return u.status === params.status; });
            if (params.search) {
              var s = params.search.toLowerCase();
              result = result.filter(function (u) { return u.name.toLowerCase().indexOf(s) !== -1 || u.email.toLowerCase().indexOf(s) !== -1 || u.phone.indexOf(s) !== -1; });
            }
          }
          return { data: result, total: result.length, page: 1, limit: 50 };
        });
      },

      getById: function (id) { return apiGet('/users/' + id); },

      updateRole: function (id, role) { return apiPatch('/users/' + id, { role: role }); },

      updateStatus: function (id, status) { return apiPatch('/users/' + id, { status: status }); }
    },

    // ─── Blog ──────────────────────────────────────────────
    blog: {
      list: function (params) {
        var q = params ? '?' + new URLSearchParams(params).toString() : '';
        return apiGet('/blog' + q);
      },

      getById: function (id) { return apiGet('/blog/' + id); },

      create: function (data) { return apiPost('/blog', data); },

      update: function (id, data) { return apiPut('/blog/' + id, data); },

      delete: function (id) { return apiDelete('/blog/' + id); }
    },

    // ─── Promotions ────────────────────────────────────────
    promotions: {
      list: function (params) {
        var q = params ? '?' + new URLSearchParams(params).toString() : '';
        return apiGet('/promotions' + q).catch(function () {
          return { data: [
            { id: 'P-001', code: 'MONSOON25', type: 'percentage', value: 25, minCartValue: 1000, maxDiscount: 5000, applicableTypes: ['hotel'], usageLimit: 500, perUserLimit: 1, usedCount: 142, validFrom: '2026-07-01', validTo: '2026-08-31', isActive: true, description: 'Monsoon Madness - 25% off on all hotels' },
            { id: 'P-002', code: 'WELCOMEJHARK', type: 'flat', value: 500, minCartValue: 1500, maxDiscount: 500, applicableTypes: ['cab'], usageLimit: 200, perUserLimit: 1, usedCount: 89, validFrom: '2026-01-01', validTo: '2026-12-31', isActive: true, description: '₹500 off on first cab booking' },
            { id: 'P-003', code: 'NETHAT20', type: 'percentage', value: 20, minCartValue: 5000, maxDiscount: 3000, applicableTypes: ['package'], usageLimit: 100, perUserLimit: 1, usedCount: 34, validFrom: '2026-02-01', validTo: '2026-03-15', isActive: false, description: '20% off on Netarhat packages' }
          ], total: 3 };
        });
      },

      getById: function (id) { return apiGet('/promotions/' + id); },

      create: function (data) { return apiPost('/promotions', data); },

      update: function (id, data) { return apiPut('/promotions/' + id, data); }
    },

    // ─── Dashboard / Analytics ─────────────────────────────
    dashboard: {
      stats: function () {
        return apiGet('/bj/dashboard').catch(function () { return MOCK.dashboard; });
      },

      reports: function (params) {
        var q = params ? '?' + new URLSearchParams(params).toString() : '';
        return apiGet('/analytics/reports' + q);
      }
    },

    // ─── Contact / Support ─────────────────────────────────
    contact: {
      submit: function (data) { return apiPost('/contact', data); }
    },

    // ─── Destinations ──────────────────────────────────────
    destinations: {
      list: function () { return apiGet('/destinations'); }
    },

    // ─── Utility ───────────────────────────────────────────
    isAvailable: function () {
      return fetch(API_BASE + '/health', { method: 'GET' }).then(function (r) { return r.ok; }).catch(function () { return false; });
    },

    getBaseUrl: function () { return API_BASE; },

    getConsoleUrl: function () { return window.location.origin; },

    clearAuth: clearAuth
  };
})();
