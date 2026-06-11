/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Car as CarIcon, 
  Search, 
  MessageCircle, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  HelpCircle, 
  Check, 
  SlidersHorizontal, 
  ChevronRight, 
  Sparkles, 
  Wrench, 
  ShieldAlert, 
  Facebook, 
  Instagram, 
  Youtube 
} from "lucide-react";
import { Car, Inquiry } from "./types";
import Navbar from "./components/Navbar";
import CarCard from "./components/CarCard";
import CarDetailModal from "./components/CarDetailModal";
import ContactForm from "./components/ContactForm";
import AdminPanel from "./components/AdminPanel";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>("home");
  const [cars, setCars] = useState<Car[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [isAppLoading, setIsAppLoading] = useState(true);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMake, setSelectedMake] = useState("all");
  const [selectedFuel, setSelectedFuel] = useState("all");
  const [selectedTransmission, setSelectedTransmission] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedDuty, setSelectedDuty] = useState("all");
  const [selectedImport, setSelectedImport] = useState("all");
  const [selectedBodyType, setSelectedBodyType] = useState("all");
  const [maxPrice, setMaxPrice] = useState<number>(15000000);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [sortBy, setSortBy] = useState("latest");

  // Authentication state
  const [adminToken, setAdminToken] = useState<string | null>(
    localStorage.getItem("simatei_admin_token")
  );

  // Load cars first
  const fetchCars = async () => {
    try {
      const res = await fetch("/api/cars");
      if (res.ok) {
        const data = await res.json();
        setCars(data);
      }
    } catch (error) {
      console.error("Failed to load car fleet:", error);
    }
  };

  // Load inquiries
  const fetchInquiries = async () => {
    if (!adminToken) return;
    try {
      const res = await fetch("/api/admin/inquiries", {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setInquiries(data);
      }
    } catch (error) {
      console.error("Failed to load customer messages:", error);
    }
  };

  // Check login on load
  useEffect(() => {
    const initializeApp = async () => {
      setIsAppLoading(true);
      await fetchCars();
      if (adminToken) {
        // Verify token with backend
        try {
          const check = await fetch("/api/auth/verify", {
            headers: { Authorization: `Bearer ${adminToken}` },
          });
          const data = await check.json();
          if (!data.loggedIn) {
            handleLogout();
          } else {
            await fetchInquiries();
          }
        } catch {
          handleLogout();
        }
      }
      setIsAppLoading(false);
    };
    initializeApp();
  }, [adminToken]);

  // Login handler
  const handleLogin = async (password: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: "admin", password }),
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("simatei_admin_token", data.token);
        setAdminToken(data.token);
        return true;
      }
    } catch (err) {
      console.error("Authentication error:", err);
    }
    return false;
  };

  const handleLogout = () => {
    localStorage.removeItem("simatei_admin_token");
    setAdminToken(null);
    setInquiries([]);
    if (currentTab === "admin") {
      setCurrentTab("home");
    }
  };

  // Listings operations
  const handleAddCar = async (carData: Partial<Car>): Promise<boolean> => {
    if (!adminToken) return false;
    try {
      const res = await fetch("/api/cars", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(carData),
      });
      if (res.ok) {
        await fetchCars();
        return true;
      }
    } catch (err) {
      console.error("Failed to append car listing:", err);
    }
    return false;
  };

  const handleEditCar = async (id: string, carData: Partial<Car>): Promise<boolean> => {
    if (!adminToken) return false;
    try {
      const res = await fetch(`/api/cars/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(carData),
      });
      if (res.ok) {
        await fetchCars();
        // Update selected car if open
        if (selectedCar && selectedCar.id === id) {
          const updated = { ...selectedCar, ...carData } as Car;
          setSelectedCar(updated);
        }
        return true;
      }
    } catch (err) {
      console.error("Failed to modify car listing:", err);
    }
    return false;
  };

  const handleDeleteCar = async (id: string): Promise<boolean> => {
    if (!adminToken) return false;
    try {
      const res = await fetch(`/api/cars/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });
      if (res.ok) {
        await fetchCars();
        if (selectedCar && selectedCar.id === id) {
          setSelectedCar(null);
        }
        return true;
      }
    } catch (err) {
      console.error("Failed to remove car listing:", err);
    }
    return false;
  };

  // Inquiry submission
  const handleInquirySubmit = async (
    name: string,
    email: string,
    message: string,
    carId?: string,
    carName?: string
  ): Promise<boolean> => {
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message, carId, carName }),
      });
      if (res.ok) {
        if (adminToken) {
          fetchInquiries();
        }
        return true;
      }
    } catch (err) {
      console.error("Inquiry network error:", err);
    }
    return false;
  };

  const handleUpdateInquiryStatus = async (id: string, status: string): Promise<boolean> => {
    if (!adminToken) return false;
    try {
      const res = await fetch(`/api/admin/inquiries/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        await fetchInquiries();
        return true;
      }
    } catch (err) {
      console.error("Failed to modify inquiry label:", err);
    }
    return false;
  };

  const handleDeleteInquiry = async (id: string): Promise<boolean> => {
    if (!adminToken) return false;
    try {
      const res = await fetch(`/api/admin/inquiries/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });
      if (res.ok) {
        await fetchInquiries();
        return true;
      }
    } catch (err) {
      console.error("Failed to delete inquiry log:", err);
    }
    return false;
  };

  // Filter Logic
  const filteredCars = cars.filter((car) => {
    const matchesSearch = 
      car.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesMake = selectedMake === "all" || car.make.toLowerCase() === selectedMake.toLowerCase();
    const matchesFuel = selectedFuel === "all" || car.fuelType.toLowerCase() === selectedFuel.toLowerCase();
    const matchesTransmission = selectedTransmission === "all" || car.transmission.toLowerCase() === selectedTransmission.toLowerCase();
    const matchesLocation = selectedLocation === "all" || (car.location && car.location.toLowerCase() === selectedLocation.toLowerCase());
    const matchesDuty = selectedDuty === "all" || (car.dutyStatus && car.dutyStatus.toLowerCase() === selectedDuty.toLowerCase());
    const matchesImport = selectedImport === "all" || (car.importStatus && car.importStatus.toLowerCase() === selectedImport.toLowerCase());
    const matchesBodyType = selectedBodyType === "all" || (car.bodyType && car.bodyType.toLowerCase() === selectedBodyType.toLowerCase());
    const matchesPrice = car.price <= maxPrice;
    const matchesStatus = selectedStatus === "all" || car.status.toLowerCase() === selectedStatus.toLowerCase();

    return matchesSearch && matchesMake && matchesFuel && matchesTransmission && matchesPrice && matchesStatus && matchesLocation && matchesDuty && matchesImport && matchesBodyType;
  }).sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    if (sortBy === "year-new") return b.year - a.year;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  // Featured cars (latest 3 available)
  const featuredCars = cars
    .filter((c) => c.status === "Available")
    .slice(0, 3);

  // Get distinct makes
  const allBrands = Array.from(new Set(cars.map((c) => c.make))) as string[];

  return (
    <div className="min-h-screen bg-[#0b0c0e] flex flex-col justify-between selection:bg-[#E21E26] selection:text-white">
      {/* Dynamic SEO Meta title changes */}
      <Navbar 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab} 
        isAdmin={!!adminToken} 
        logout={handleLogout} 
      />

      <main className="flex-grow">
        {isAppLoading ? (
          <div className="flex flex-col items-center justify-center py-48 text-center space-y-4">
            <div className="h-10 w-10 border-2 border-[#E21E26] border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-400 font-mono text-xs uppercase tracking-widest">
              Connecting Simatei Showrooms...
            </p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {/* HOMEPAGE VIEW */}
            {currentTab === "home" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-16"
              >
                {/* 1. Hero banner with premium pitch gold theme */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
                  <section className="relative h-[480px] md:h-[420px] rounded-3xl overflow-hidden group border border-white/10 shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent z-10 animate-fade"></div>
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1200')] bg-cover bg-center opacity-75 group-hover:scale-[1.01] transition-transform duration-700"></div>
                    
                    <div className="relative z-20 h-full flex flex-col justify-center px-6 sm:px-12 max-w-3xl">
                      <span className="text-[#E21E26] text-xs font-bold uppercase tracking-[0.3em] mb-3 block">
                        Motion Reimagined
                      </span>
                      <h1 className="font-display text-4xl sm:text-5xl font-extrabold leading-tight text-white mb-4">
                        Find Your Perfect Drive at <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E21E26] via-[#E21E26] to-[#C3141F]">
                          Simatei Motorworld
                        </span>
                      </h1>
                      <p className="text-white/70 text-sm sm:text-base font-light leading-relaxed mb-8 max-w-xl">
                        Browse, compare, and acquire top-tier imported and local vehicles. From absolute luxury SUVs to fuel-efficient family crossovers — Simatei is the premium standard of Nairobi automobile sourcing.
                      </p>
                      
                      <div className="flex flex-wrap gap-4 items-center">
                        <button
                          onClick={() => setCurrentTab("cars")}
                          className="px-6 py-3.5 bg-[#E21E26] hover:bg-[#C3141F] text-white font-extrabold text-xs uppercase tracking-widest rounded-full shadow-lg transition-all duration-300 transform active:scale-95 shadow-[#E21E26]/25 hover:shadow-[#E21E26]/40"
                        >
                          Explore Inventory
                        </button>
                        <button
                          onClick={() => setCurrentTab("contact")}
                          className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-widest rounded-full border border-white/10 hover:border-[#E21E26]/30 transition-all duration-300"
                        >
                          Book Appointment
                        </button>
                      </div>
                    </div>
                  </section>
                </div>                    {/* Quick Horizontal Search Bar */}
                  <div className="max-w-4xl mx-auto px-4 mt-16 md:mt-20">
                    <div className="bg-[#111] border border-white/5 shadow-2xl p-4 sm:p-5 rounded-2xl relative">
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-sm">
                        
                        {/* Search Input */}
                        <div className="relative col-span-1 sm:col-span-2">
                          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
                          <input
                            type="text"
                            placeholder="Search make or model (e.g. Prado, Mercedes)..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-[#0d0f11] placeholder-gray-500 text-white pl-10 pr-4 py-3.5 rounded-xl border border-white/10 focus:border-[#E21E26]/40 focus:outline-none focus:ring-1 focus:ring-[#E21E26]/30 transition-all text-xs"
                          />
                        </div>

                        {/* Brand Select */}
                        <div>
                          <select
                            value={selectedMake}
                            onChange={(e) => setSelectedMake(e.target.value)}
                            className="w-full bg-[#0d0f11] text-gray-300 py-3.5 px-3 rounded-xl border border-white/10 focus:border-[#E21E26]/40 focus:outline-none transition-all text-xs"
                          >
                            <option value="all">All Brands</option>
                            {allBrands.map((b) => (
                              <option key={b} value={b.toLowerCase()}>{b}</option>
                            ))}
                          </select>
                        </div>

                        {/* Search Button redirects to Inventory */}
                        <button
                          onClick={() => setCurrentTab("cars")}
                          className="w-full bg-[#E21E26] hover:bg-[#C3141F] text-white font-extrabold text-xs uppercase tracking-wider py-3 rounded-xl select-none cursor-pointer duration-200 shadow-md shadow-[#E21E26]/10"
                        >
                          Filter Vehicles
                        </button>
                      </div>
                    </div>
                  </div>

                {/* 2. Featured cars with badge overlays */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-4 mb-8">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#E21E26]/90 block">Fresh Arrivals</span>
                      <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
                        Simatei Premium Collection
                      </h2>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedStatus("available");
                        setCurrentTab("cars");
                      }}
                      className="text-sm font-mono text-[#E21E26] hover:text-[#C3141F] flex items-center space-x-1 outline-none font-bold"
                    >
                      <span>View full inventory</span>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>

                  {featuredCars.length === 0 ? (
                    <div className="py-12 bg-white/[0.02] border border-white/5 rounded-2xl text-center">
                      <p className="text-gray-400 text-sm">No cars marked as 'Available' found.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                      {featuredCars.map((car) => (
                        <div key={car.id}>
                          <CarCard car={car} onViewDetails={setSelectedCar} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 3. Dealership highlights (Nairobi context) */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 select-none">
                  <div className="bg-[#111] border border-white/5 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 h-64 w-64 bg-[#E21E26]/5 rounded-full blur-3xl -mr-16 -mt-16" />
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                      <div>
                        <span className="text-xs font-mono uppercase tracking-widest text-[#E21E26] block">Uncompromising Standards</span>
                        <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-white mt-2 leading-tight">
                          Why buy from Simatei Motorworld?
                        </h3>
                        <p className="mt-4 text-gray-400 text-sm font-light leading-relaxed">
                          We believe in full disclosure, pristine physical inspections, and authentic mileage certification. Your automotive journey should be seamless and completely transparent.
                        </p>
                        
                        <div className="mt-8 space-y-4">
                          <div className="flex items-start space-x-3 text-sm">
                            <div className="bg-[#E21E26]/10 p-1.5 rounded text-[#E21E26] mt-0.5"><Check className="h-4 w-4 stroke-[2.5]" /></div>
                            <div>
                              <span className="block font-bold text-white leading-tight">Authentic Certified Odometer Mileage</span>
                              <span className="block text-xs text-gray-400 mt-0.5 font-light">Zero rollbacks, fully verifiable import sheets provided.</span>
                            </div>
                          </div>
                          
                          <div className="flex items-start space-x-3 text-sm">
                            <div className="bg-[#E21E26]/10 p-1.5 rounded text-[#E21E26] mt-0.5"><Check className="h-4 w-4 stroke-[2.5]" /></div>
                            <div>
                              <span className="block font-bold text-white leading-tight">Custom Sourcing & Logistics</span>
                              <span className="block text-xs text-gray-400 mt-0.5 font-light">Can’t find your dream spec? We import pre-inspected units directly on order.</span>
                            </div>
                          </div>

                          <div className="flex items-start space-x-3 text-sm">
                            <div className="bg-[#E21E26]/10 p-1.5 rounded text-[#E21E26] mt-0.5"><Check className="h-4 w-4 stroke-[2.5]" /></div>
                            <div>
                              <span className="block font-bold text-white leading-tight">Saturdays Trade-In Support</span>
                              <span className="block text-xs text-gray-400 mt-0.5 font-light">Bring your current vehicle for clean evaluation and trade-up opportunities.</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-5.5 text-center font-display">
                        <div className="bg-black/30 border border-white/5 p-6 rounded-2xl">
                          <span className="block text-3xl font-bold text-[#E21E26]">100%</span>
                          <span className="block text-xs text-gray-400 font-mono uppercase tracking-wider mt-1">Pre-Inspected Fleet</span>
                        </div>
                        <div className="bg-black/30 border border-white/5 p-6 rounded-2xl">
                          <span className="block text-3xl font-bold text-[#E21E26]">24 Hour</span>
                          <span className="block text-xs text-gray-400 font-mono uppercase tracking-wider mt-1">Inquiry Turnaround</span>
                        </div>
                        <div className="bg-black/30 border border-white/5 p-6 rounded-2xl">
                          <span className="block text-3xl font-bold text-[#E21E26]">95%</span>
                          <span className="block text-xs text-gray-400 font-mono uppercase tracking-wider mt-1">Nairobi Retention</span>
                        </div>
                        <div className="bg-black/30 border border-white/5 p-6 rounded-2xl">
                          <span className="block text-3xl font-bold text-[#E21E26]">0%</span>
                          <span className="block text-xs text-gray-400 font-mono uppercase tracking-wider mt-1">Odometer Rollbacks</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* CAR INVENTORY PAGE VIEW */}
            {currentTab === "cars" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
              >
                {/* Title */}
                <div className="mb-10 text-center sm:text-left select-none">
                  <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#E21E26] font-bold block mb-1">Modern Showroom</span>
                  <h1 className="font-display text-3xl font-bold text-white">
                    Simatei Motorworld Inventory
                  </h1>
                  <p className="text-gray-400 text-sm mt-1 font-light">
                    Filter and discover your perfect high-performance SUV, sedan, or rugged double-cab.
                  </p>
                </div>

                {/* Grid layout containing filters sidebar & cars list */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Filters Sidebar Column */}
                  <div className="lg:col-span-3 bg-[#111] border border-white/5 p-6 rounded-2xl shadow-xl space-y-6 select-none sticky top-24">
                    <div className="flex items-center justify-between border-b border-white/5 pb-3">
                      <h3 className="text-sm uppercase font-mono tracking-wider text-gray-300 font-bold flex items-center space-x-1.5">
                        <SlidersHorizontal className="h-4 w-4 text-[#E21E26]" />
                        <span>Filter Fleet</span>
                      </h3>
                      <button
                        onClick={() => {
                          setSearchTerm("");
                          setSelectedMake("all");
                          setSelectedFuel("all");
                          setSelectedTransmission("all");
                          setSelectedLocation("all");
                          setSelectedDuty("all");
                          setSelectedImport("all");
                          setSelectedBodyType("all");
                          setMaxPrice(15000000);
                          setSelectedStatus("all");
                          setSortBy("latest");
                        }}
                        className="text-[10px] font-mono text-[#E21E26]/80 hover:text-[#E21E26] hover:underline"
                      >
                        Reset All
                      </button>
                    </div>

                    {/* Search Field */}
                    <div>
                      <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider mb-2">Search Input</label>
                      <input
                        type="text"
                        placeholder="Type model, spec, brand..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[#0d0f11] text-xs text-white placeholder-gray-600 px-3 py-2.5 rounded-lg border border-white/10 focus:border-[#E21E26] focus:outline-none"
                      />
                    </div>

                    {/* Brand Selection */}
                    <div>
                      <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider mb-2">Manufacturer Brand</label>
                      <select
                        value={selectedMake}
                        onChange={(e) => setSelectedMake(e.target.value)}
                        className="w-full bg-[#0d0f11] text-xs text-white px-3 py-2.5 rounded-lg border border-white/10 focus:border-[#E21E26] focus:outline-none"
                      >
                        <option value="all">All Brands</option>
                        {allBrands.map((b) => (
                          <option key={b} value={b.toLowerCase()}>{b}</option>
                        ))}
                      </select>
                    </div>

                    {/* Fuel Source Selection */}
                    <div>
                      <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider mb-2">Fuel Source</label>
                      <select
                        value={selectedFuel}
                        onChange={(e) => setSelectedFuel(e.target.value)}
                        className="w-full bg-[#0d0f11] text-xs text-white px-3 py-2.5 rounded-lg border border-white/10 focus:border-[#E21E26] focus:outline-none"
                      >
                        <option value="all">All Fuel Types</option>
                        <option value="petrol">Petrol ONLY</option>
                        <option value="diesel">Diesel ONLY</option>
                        <option value="hybrid">Hybrid ONLY</option>
                        <option value="electric">Electric ONLY</option>
                      </select>
                    </div>

                    {/* Gearbox selection */}
                    <div>
                      <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider mb-2">Gearbox Transmission</label>
                      <select
                        value={selectedTransmission}
                        onChange={(e) => setSelectedTransmission(e.target.value)}
                        className="w-full bg-[#0d0f11] text-xs text-white px-3 py-2.5 rounded-lg border border-white/10 focus:border-[#E21E26] focus:outline-none"
                      >
                        <option value="all">Any Transmission</option>
                        <option value="automatic">Automatic (Auto)</option>
                        <option value="manual">Manual (Shift)</option>
                      </select>
                    </div>

                    {/* Status selection */}
                    <div>
                      <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider mb-2">Availability Status</label>
                      <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="w-full bg-[#0d0f11] text-xs text-white px-3 py-2.5 rounded-lg border border-white/10 focus:border-[#E21E26] focus:outline-none"
                      >
                        <option value="all">Show All Inventory</option>
                        <option value="available">Available ONLY</option>
                        <option value="sold">Sold Out Listings</option>
                      </select>
                    </div>

                    {/* Location Selection */}
                    <div>
                      <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider mb-2">Physical Location</label>
                      <select
                        value={selectedLocation}
                        onChange={(e) => setSelectedLocation(e.target.value)}
                        className="w-full bg-[#0d0f11] text-xs text-white px-3 py-2.5 rounded-lg border border-white/10 focus:border-[#E21E26] focus:outline-none"
                      >
                        <option value="all">Any Location</option>
                        <option value="nairobi">Nairobi Showroom</option>
                        <option value="mombasa">Mombasa Port/Yard</option>
                        <option value="transit">On Transit</option>
                      </select>
                    </div>

                    {/* Duty Status Selection */}
                    <div>
                      <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider mb-2">Duty Clearance</label>
                      <select
                        value={selectedDuty}
                        onChange={(e) => setSelectedDuty(e.target.value)}
                        className="w-full bg-[#0d0f11] text-xs text-white px-3 py-2.5 rounded-lg border border-white/10 focus:border-[#E21E26] focus:outline-none"
                      >
                        <option value="all">Any Clearance</option>
                        <option value="duty paid">Duty Paid</option>
                        <option value="duty free">Duty Free (Tax Exempt)</option>
                        <option value="on transit">On Transit</option>
                      </select>
                    </div>

                    {/* Import Category */}
                    <div>
                      <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider mb-2">Import / Ownership</label>
                      <select
                        value={selectedImport}
                        onChange={(e) => setSelectedImport(e.target.value)}
                        className="w-full bg-[#0d0f11] text-xs text-white px-3 py-2.5 rounded-lg border border-white/10 focus:border-[#E21E26] focus:outline-none"
                      >
                        <option value="all">Any Category</option>
                        <option value="foreign used">Foreign Used (Import)</option>
                        <option value="locally used">Locally Used (Kenyan)</option>
                        <option value="brand new">Brand New</option>
                        <option value="direct import">On-demand Import</option>
                      </select>
                    </div>

                    {/* Body Type */}
                    <div>
                      <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider mb-2">Body Style</label>
                      <select
                        value={selectedBodyType}
                        onChange={(e) => setSelectedBodyType(e.target.value)}
                        className="w-full bg-[#0d0f11] text-xs text-white px-3 py-2.5 rounded-lg border border-white/10 focus:border-[#E21E26] focus:outline-none"
                      >
                        <option value="all">Any Body Style</option>
                        <option value="suv">SUV / Crossover</option>
                        <option value="sedan">Sedan</option>
                        <option value="hatchback">Hatchback</option>
                        <option value="station wagon">Station Wagon</option>
                        <option value="coupe">Coupe</option>
                        <option value="convertible">Convertible</option>
                        <option value="pickup">Pickup Truck</option>
                      </select>
                    </div>

                    {/* Max Price slider */}
                    <div>
                      <div className="flex justify-between items-baseline mb-2">
                        <label className="text-xs font-mono text-gray-400 uppercase tracking-wider">Max Price</label>
                        <span className="text-xs text-[#E21E26] font-bold font-mono">
                          {maxPrice >= 15000000 ? "Any Price" : `${(maxPrice / 1000000).toFixed(1)}M KES`}
                        </span>
                      </div>
                      <input
                        type="range"
                        min={1000000}
                        max={15000000}
                        step={250000}
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(Number(e.target.value))}
                        className="w-full accent-[#E21E26] h-1 bg-[#0d0f11] rounded-lg cursor-pointer"
                      />
                    </div>

                    {/* Sort orders */}
                    <div>
                      <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider mb-2">Order By</label>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="w-full bg-[#0d0f11] text-xs text-white px-3 py-2.5 rounded-lg border border-white/10 focus:border-[#E21E26] focus:outline-none"
                      >
                        <option value="latest">Latest In Showroom</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                        <option value="year-new">YOM: Modern First</option>
                      </select>
                    </div>
                  </div>

                  {/* Active Grid Listings Column */}
                  <div className="lg:col-span-9">
                    {filteredCars.length === 0 ? (
                      <div className="py-24 bg-[#111] border border-white/5 rounded-3xl text-center space-y-4">
                        <CarIcon className="h-12 w-12 text-gray-500 mx-auto" />
                        <h4 className="text-white font-bold text-lg">No Matching Machines Found</h4>
                        <p className="text-gray-400 text-xs font-light max-w-sm mx-auto">
                          Try adjustments inside your filter categories, or reset them using the controls to recover options.
                        </p>
                        <button
                          onClick={() => {
                            setSearchTerm("");
                            setSelectedMake("all");
                            setSelectedFuel("all");
                            setSelectedTransmission("all");
                            setSelectedLocation("all");
                            setSelectedDuty("all");
                            setSelectedImport("all");
                            setSelectedBodyType("all");
                            setMaxPrice(15000000);
                            setSelectedStatus("all");
                          }}
                          className="px-5 py-2.5 bg-[#E21E26] hover:bg-[#C3141F] text-white rounded-lg text-xs font-bold uppercase tracking-wider select-none outline-none mt-2 cursor-pointer transition-colors shadow-md shadow-[#E21E26]/10"
                        >
                          Clear Active Filters
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                        <AnimatePresence>
                          {filteredCars.map((car) => (
                            <div key={car.id}>
                              <CarCard car={car} onViewDetails={setSelectedCar} />
                            </div>
                          ))}
                        </AnimatePresence>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* CONTACT PAGE VIEW */}
            {currentTab === "contact" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ContactForm 
                  onSubmitInquiry={(name, email, message) => 
                    handleInquirySubmit(name, email, message)
                  } 
                />
              </motion.div>
            )}

            {/* ADMIN PROTECTION PORTAL DASHBOARD */}
            {currentTab === "admin" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <AdminPanel
                  cars={cars}
                  inquiries={inquiries}
                  onRefreshCars={fetchCars}
                  onRefreshInquiries={fetchInquiries}
                  onAddCar={handleAddCar}
                  onEditCar={handleEditCar}
                  onDeleteCar={handleDeleteCar}
                  onUpdateInquiryStatus={handleUpdateInquiryStatus}
                  onDeleteInquiry={handleDeleteInquiry}
                  token={adminToken}
                  onLogin={handleLogin}
                  onLogout={handleLogout}
                />
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </main>

      {/* 4. Core Details Overlay drawer modal */}
      <AnimatePresence>
        {selectedCar && (
          <CarDetailModal
            car={selectedCar}
            onClose={() => setSelectedCar(null)}
            onSubmitInquiry={handleInquirySubmit}
          />
        )}
      </AnimatePresence>

      {/* Floating fixed green-to-emerald responsive bounce WhatsApp click-to-chat button */}
      <a
        href="https://wa.me/254740892332"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 flex items-center justify-center bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white p-4 rounded-full shadow-2xl hover:scale-105 active:scale-95 duration-300 animate-bounce cursor-pointer border border-emerald-400/20"
        title="Chat on WhatsApp Simatei Motorworld"
        id="floating-wa"
      >
        <MessageCircle className="h-6 w-6" />
      </a>

      {/* 5. FOOTER COMPONENT */}
      <footer className="bg-[#090b0d] border-t border-white/5 py-12 select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start mb-8 text-sm">
            
            {/* Logo, title & slogan */}
            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center">
                <div className="bg-white rounded-lg p-1.5 px-4 shadow-lg inline-block">
                  <img 
                    src="/simatei-logo.jpg" 
                    alt="Simatei Motorworld" 
                    className="h-9 w-auto object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500 font-light leading-relaxed max-w-sm">
                Simatei Motorworld is a professional car dealership in Nairobi built to assist vehicle buyers find luxury, longevity, and durability in their automotive selections.
              </p>
            </div>

            {/* Navigation links */}
            <div className="md:col-span-3 space-y-3.5">
              <span className="block text-[10px] font-mono uppercase tracking-[0.2em] text-gray-400 font-semibold">Quick Splay Navigation</span>
              <ul className="space-y-2 text-xs text-gray-400">
                <li>
                  <button onClick={() => setCurrentTab("home")} className="hover:text-[#E21E26] transition-colors">
                    Home Frontpage
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentTab("cars")} className="hover:text-[#E21E26] transition-colors">
                    Simatei Inventory Fleet
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentTab("contact")} className="hover:text-[#E21E26] transition-colors">
                    Contact Simatei Directors
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentTab("admin")} className="hover:text-[#E21E26] transition-colors flex items-center space-x-1">
                    <span>Staff Portal Control</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Contacts Footer block */}
            <div className="md:col-span-4 space-y-3.5">
              <span className="block text-[10px] font-mono uppercase tracking-[0.2em] text-gray-400 font-semibold">Dealership Outlets</span>
              <div className="space-y-2 text-xs text-gray-400 font-light">
                <p className="flex items-start">
                  <MapPin className="h-4 w-4 text-[#E21E26] mr-2 flex-shrink-0 mt-0.5" />
                  <span>Langata Road, Nairobi City, Kenya</span>
                </p>
                <p className="flex items-center">
                  <Phone className="h-4 w-4 text-[#E21E26] mr-2 flex-shrink-0" />
                  <a href="tel:0740892332" className="hover:text-[#E21E26] font-bold">0740892332</a>
                </p>
                <p className="flex items-center">
                  <MessageCircle className="h-4 w-4 text-emerald-400 mr-2 flex-shrink-0" />
                  <a href="https://wa.me/254740892332" target="_blank" rel="noopener noreferrer" className="hover:text-[#E21E26] font-bold">wa.me/254740892332</a>
                </p>
              </div>

              {/* Social links icons */}
              <div className="flex px-1 space-x-3.5 pt-1.5">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[#E21E26] transition-colors">
                  <Facebook className="h-4.5 w-4.5" />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[#E21E26] transition-colors">
                  <Instagram className="h-4.5 w-4.5" />
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[#E21E26] transition-colors">
                  <Youtube className="h-4.5 w-4.5" />
                </a>
              </div>
            </div>

          </div>

          {/* Copyright Row */}
          <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-gray-600 font-mono">
            <span>© 2025 Simatei Motorworld. All Rights Reserved.</span>
            <span className="mt-2 sm:mt-0">Motion Reimagined.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
