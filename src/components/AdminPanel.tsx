/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { KeyRound, ShieldAlert, Plus, Edit2, Trash2, Mail, CheckCircle2, X, UploadCloud, PlusCircle, BookmarkCheck, LogOut, Loader2, RefreshCw, Car as CarIcon, AlertCircle } from "lucide-react";
import { Car, Inquiry } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface AdminPanelProps {
  cars: Car[];
  inquiries: Inquiry[];
  onRefreshCars: () => Promise<void>;
  onRefreshInquiries: () => Promise<void>;
  onAddCar: (carData: Partial<Car>) => Promise<boolean>;
  onEditCar: (id: string, carData: Partial<Car>) => Promise<boolean>;
  onDeleteCar: (id: string) => Promise<boolean>;
  onUpdateInquiryStatus: (id: string, status: string) => Promise<boolean>;
  onDeleteInquiry: (id: string) => Promise<boolean>;
  token: string | null;
  onLogin: (password: string) => Promise<boolean>;
  onLogout: () => void;
}

export default function AdminPanel({
  cars,
  inquiries,
  onRefreshCars,
  onRefreshInquiries,
  onAddCar,
  onEditCar,
  onDeleteCar,
  onUpdateInquiryStatus,
  onDeleteInquiry,
  token,
  onLogin,
  onLogout
}: AdminPanelProps) {
  // Authentication status
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Listing creation / edit form
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);

  // Form states
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState(2021);
  const [price, setPrice] = useState(3000000);
  const [mileage, setMileage] = useState(15000);
  const [fuelType, setFuelType] = useState<'Petrol' | 'Diesel' | 'Hybrid' | 'Electric'>("Petrol");
  const [transmission, setTransmission] = useState<'Automatic' | 'Manual'>("Automatic");
  const [engine, setEngine] = useState("");
  const [color, setColor] = useState("");
  const [interiorColor, setInteriorColor] = useState("");
  const [driveType, setDriveType] = useState<'AWD' | '4WD' | '2WD' | 'RWD' | 'FWD'>("AWD");
  const [dutyStatus, setDutyStatus] = useState<'Duty Paid' | 'Duty Free' | 'On Transit'>("Duty Paid");
  const [importStatus, setImportStatus] = useState<'Locally Used' | 'Foreign Used' | 'Brand New' | 'Direct Import'>("Foreign Used");
  const [bodyType, setBodyType] = useState<'SUV' | 'Sedan' | 'Hatchback' | 'Station Wagon' | 'Coupe' | 'Convertible' | 'Pickup'>("SUV");
  const [location, setLocation] = useState<'Nairobi' | 'Mombasa' | 'Transit'>("Nairobi");
  const [conditionGrade, setConditionGrade] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<'Available' | 'Sold'>("Available");
  const [featuresInput, setFeaturesInput] = useState("");
  const [imageUrl1, setImageUrl1] = useState("");
  const [imageUrl2, setImageUrl2] = useState("");
  const [imageUrl3, setImageUrl3] = useState("");
  const [formError, setFormError] = useState("");
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  
  // Local upload state
  const [uploadProgress, setUploadProgress] = useState("");

  // Switch tab for listings vs inquiries
  const [adminTab, setAdminTab] = useState<"listings" | "inquiries">("listings");

  useEffect(() => {
    if (token) {
      onRefreshCars();
      onRefreshInquiries();
    }
  }, [token]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setIsLoading(true);
    try {
      const loggedIn = await onLogin(passwordInput);
      if (!loggedIn) {
        setAuthError("Incorrect password. Please try again.");
      } else {
        setPasswordInput("");
      }
    } catch {
      setAuthError("Server communication details error.");
    } finally {
      setIsLoading(false);
    }
  };

  const openAddForm = () => {
    setEditingCar(null);
    setMake("Toyota");
    setModel("");
    setYear(2020);
    setPrice(4500000);
    setMileage(35000);
    setFuelType("Petrol");
    setTransmission("Automatic");
    setEngine("2.5L VVT-i");
    setColor("Black Pearl");
    setInteriorColor("Black Leather");
    setDriveType("AWD");
    setDutyStatus("Duty Paid");
    setImportStatus("Foreign Used");
    setBodyType("SUV");
    setLocation("Nairobi");
    setConditionGrade("Grade 4.5");
    setDescription("");
    setStatus("Available");
    setFeaturesInput("Leather Seats, Reverse Camera, Push-start button, Panoramic Sunroof, Power boot");
    setImageUrl1("");
    setImageUrl2("");
    setImageUrl3("");
    setFormError("");
    setIsFormOpen(true);
  };

  const openEditForm = (car: Car) => {
    setEditingCar(car);
    setMake(car.make);
    setModel(car.model);
    setYear(car.year);
    setPrice(car.price);
    setMileage(car.mileage);
    setFuelType(car.fuelType);
    setTransmission(car.transmission);
    setEngine(car.engine);
    setColor(car.color);
    setInteriorColor(car.interiorColor || "Black Leather");
    setDriveType(car.driveType || "AWD");
    setDutyStatus(car.dutyStatus || "Duty Paid");
    setImportStatus(car.importStatus || "Foreign Used");
    setBodyType(car.bodyType || "SUV");
    setLocation(car.location || "Nairobi");
    setConditionGrade(car.conditionGrade || "Grade 4.5");
    setDescription(car.description);
    setStatus(car.status);
    setFeaturesInput(car.features.join(", "));
    setImageUrl1(car.images[0] || "");
    setImageUrl2(car.images[1] || "");
    setImageUrl3(car.images[2] || "");
    setFormError("");
    setIsFormOpen(true);
  };

  // Image Upload helper converting base64 standard
  const handleLocalUpload = async (e: React.ChangeEvent<HTMLInputElement>, imageSlot: 1 | 2 | 3) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      alert("Selected file is too large. Choose an image under 8MB.");
      return;
    }

    setUploadProgress("Reading image parameters...");
    const reader = new FileReader();
    reader.onload = async (uploadEvent) => {
      const base64Data = uploadEvent.target?.result as string;
      setUploadProgress("Uploading file safely to backend uploads/ directory...");
      try {
        const response = await fetch("/api/upload", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ image: base64Data })
        });
        
        const resData = await response.json();
        if (response.ok && resData.url) {
          if (imageSlot === 1) setImageUrl1(resData.url);
          else if (imageSlot === 2) setImageUrl2(resData.url);
          else if (imageSlot === 3) setImageUrl3(resData.url);
          setUploadProgress("Image successfully uploaded!");
          setTimeout(() => setUploadProgress(""), 2000);
        } else {
          setUploadProgress(`Upload error: ${resData.message || 'unknown'}`);
          setTimeout(() => setUploadProgress(""), 4000);
        }
      } catch (err) {
        setUploadProgress("Network error uploaded file.");
        setTimeout(() => setUploadProgress(""), 4000);
      }
    };
    reader.onerror = () => {
      setUploadProgress("Failed to parse file.");
    };
    reader.readAsDataURL(file);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    
    if (!make.trim() || !model.trim() || !engine.trim() || !color.trim() || !description.trim()) {
      setFormError("All base automotive specification parameters are required.");
      return;
    }

    const imagesArray = [imageUrl1, imageUrl2, imageUrl3].filter((url) => url.trim() !== "");
    if (imagesArray.length === 0) {
      setFormError("Provide at least one premium vehicle photo URL or upload file.");
      return;
    }

    const featuresArray = featuresInput
      .split(",")
      .map((feat) => feat.trim())
      .filter((feat) => feat !== "");

    const payload: Partial<Car> = {
      make,
      model,
      year: Number(year),
      price: Number(price),
      mileage: Number(mileage),
      fuelType,
      transmission,
      engine,
      color,
      interiorColor,
      driveType,
      dutyStatus,
      importStatus,
      bodyType,
      location,
      conditionGrade,
      status,
      description,
      features: featuresArray,
      images: imagesArray
    };

    setIsSubmittingForm(true);
    try {
      let isSuccess = false;
      if (editingCar) {
        isSuccess = await onEditCar(editingCar.id, payload);
      } else {
        isSuccess = await onAddCar(payload);
      }

      if (isSuccess) {
        setIsFormOpen(false);
        setEditingCar(null);
      } else {
        setFormError("An error occurred during submission. Verify credentials and backend logs.");
      }
    } catch {
      setFormError("Network error transmitting payload.");
    } finally {
      setIsSubmittingForm(false);
    }
  };

  const handleDeleteClick = async (id: string, name: string) => {
    if (window.confirm(`Are you absolutely sure you want to delete "${name}" from your active Simatei inventory? This cannot be undone.`)) {
      await onDeleteCar(id);
    }
  };

  const toggleCarStatus = async (car: Car) => {
    const nextStatus = car.status === "Available" ? "Sold" : "Available";
    await onEditCar(car.id, { status: nextStatus });
  };

  const handleInquiryStatus = async (id: string, curStatus: string) => {
    const nextStatus = curStatus === "Unread" ? "Read" : "Unread";
    await onUpdateInquiryStatus(id, nextStatus);
  };

  const handleInquiryDelete = async (id: string, name: string) => {
    if (window.confirm(`Delete inquiry log from ${name}?`)) {
      await onDeleteInquiry(id);
    }
  };

  // Helper formatter
  const formatKEPrice = (val: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      maximumFractionDigits: 0
    }).format(val);
  };

  // 1. Password Gateway Login screen UI
  if (!token) {
    return (
      <section className="py-24 max-w-md mx-auto px-4 select-none">
        <div className="bg-[#111] border border-white/10 rounded-2xl shadow-2xl p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-[#D4AF37] to-[#F27D26]" />
          
          <div className="inline-flex bg-[#D4AF37]/10 p-3.5 rounded-full border border-[#D4AF37]/20 text-[#D4AF37] mb-5">
            <KeyRound className="h-6 w-6 stroke-[2.2]" />
          </div>

          <h1 className="font-display text-2xl font-bold text-white tracking-tight">
            Simatei Staff Portal
          </h1>
          <p className="text-gray-400 text-xs font-mono mt-1 uppercase tracking-widest text-[#D4AF37]/70">
            Secure Gateway Authentication
          </p>

          <form onSubmit={handleLoginSubmit} className="mt-8 text-left space-y-4">
            <div>
              <label className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-1.5">
                Portal Password
              </label>
              <input
                type="password"
                placeholder="Enter Staff Password (default: admin123)"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full bg-[#0d0f11] text-sm text-white placeholder-gray-600 px-4 py-3.5 rounded-xl border border-white/10 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] focus:outline-none transition-all text-center tracking-normal placeholder:tracking-normal"
                required
                autoFocus
              />
            </div>

            {authError && (
              <div className="flex items-center space-x-2 text-xs text-red-400 bg-red-400/5 p-3 rounded-lg border border-red-500/10 font-mono font-medium">
                <ShieldAlert className="h-4 w-4" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full cursor-pointer flex items-center justify-center space-x-2 py-3.5 bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-black font-semibold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-[#D4AF37]/10 active:scale-95 transition-all"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Configuring Terminal...</span>
                </>
              ) : (
                <span>Authenticate Credentials</span>
              )}
            </button>
          </form>

          <div className="mt-8 text-[11px] text-gray-500 font-mono flex items-center justify-center space-x-1">
            <AlertCircle className="h-3 w-3 text-[#D4AF37]/50" />
            <span>Authorized administrators only. IP logs active.</span>
          </div>
        </div>
      </section>
    );
  }

  // 2. Full Admin Dashboard
  return (
    <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Title Controls Header */}
      <div className="bg-[#111] border border-white/5 rounded-2xl p-6 mb-10 shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#D4AF37] font-semibold block bg-[#D4AF37]/10 px-2.5 py-1 rounded w-fit mb-2">
            Administrator Office
          </span>
          <h1 className="font-display text-2xl font-bold tracking-tight text-white">
            Dealer Panel Workspace
          </h1>
          <p className="text-gray-400 text-xs font-light mt-0.5">
            Logged in as <span className="text-white font-semibold">Simatei Administrator</span>. You can manage vehicle listings and read guest inquiry emails.
          </p>
        </div>

        {/* Buttons / Tab Toggles */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Refresh Action */}
          <button
            onClick={async () => {
              await onRefreshCars();
              await onRefreshInquiries();
            }}
            className="p-2.5 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg hover:text-[#D4AF37] transition-colors cursor-pointer"
            title="Reload backend data stores"
          >
            <RefreshCw className="h-4.5 w-4.5" />
          </button>
          
          <button
            onClick={() => setAdminTab("listings")}
            className={`px-4.5 py-2.5 rounded-lg text-xs uppercase font-mono tracking-wider font-semibold select-none cursor-pointer transition-colors duration-200 ${
              adminTab === "listings"
                ? "bg-[#D4AF37] text-black"
                : "bg-white/5 text-gray-300 hover:bg-white/10"
            }`}
          >
            Vehicles ({cars.length})
          </button>
          
          <button
            onClick={() => setAdminTab("inquiries")}
            className={`px-4.5 py-2.5 rounded-lg text-xs uppercase font-mono tracking-wider font-semibold select-none cursor-pointer relative transition-colors duration-200 ${
              adminTab === "inquiries"
                ? "bg-[#D4AF37] text-black"
                : "bg-white/5 text-gray-300 hover:bg-white/10"
            }`}
          >
            Inquiries ({inquiries.length})
            {inquiries.some((i) => i.status === "Unread") && (
              <span className="absolute -top-1.5 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
            )}
          </button>

          <button
            onClick={onLogout}
            className="px-4.5 py-2.5 bg-white/5 hover:bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg text-xs uppercase font-mono tracking-wider font-medium select-none cursor-pointer transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Main workspace container */}
      <div className="space-y-8">
        {/* Listings Section */}
        {adminTab === "listings" && (
          <div className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
            {/* Inner Header */}
            <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between flex-wrap gap-4">
              <div>
                <h3 className="text-lg font-display font-semibold text-white">
                  Active Vehicle Fleet
                </h3>
                <p className="text-gray-400 text-xs font-light">
                  Click 'Add New Car' to insert a fresh listing with specifications, custom photos, and tag list.
                </p>
              </div>

              <button
                onClick={openAddForm}
                className="flex items-center space-x-1.5 px-4.5 py-2.5 bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-black font-bold text-xs uppercase tracking-wider rounded-lg shadow-lg shadow-[#D4AF37]/15 cursor-pointer select-none"
              >
                <Plus className="h-4 w-4 stroke-[2.2]" />
                <span>Add New Car</span>
              </button>
            </div>

            {/* Empty check */}
            {cars.length === 0 ? (
              <div className="py-20 px-4 text-center">
                <CarIcon className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                <h4 className="text-white font-bold text-base">No listings in data store.</h4>
                <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
                  Click 'Add New Car' to populate Simatei Motorworld with luxury machines.
                </p>
              </div>
            ) : (
              /* Desktop and Mobile list representation of cars */
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-black/30 border-b border-white/5 text-[10px] font-mono text-gray-400 uppercase tracking-wider">
                      <th className="px-6 py-4.5">Car Info</th>
                      <th className="px-6 py-4.5">Specs & Transmission</th>
                      <th className="px-6 py-4.5">Price</th>
                      <th className="px-6 py-4.5">Status</th>
                      <th className="px-6 py-4.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.03]">
                    {cars.map((car) => (
                      <tr key={car.id} className="hover:bg-white/[0.01]">
                        <td className="px-6 py-4.5">
                          <div className="flex items-center space-x-4">
                            <img
                              src={car.images[0]}
                              alt={`${car.make} ${car.model}`}
                              className="w-14 h-10 object-cover rounded-md border border-white/10"
                              referrerPolicy="no-referrer"
                            />
                            <div>
                              <span className="block text-xs font-mono text-[#D4AF37]/80 font-medium">
                                {car.make} • {car.year}
                              </span>
                              <span className="block text-sm font-bold text-white leading-tight">
                                {car.model}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4.5">
                          <div className="flex flex-col text-xs font-mono text-gray-400">
                            <span>{car.engine} | {car.transmission}</span>
                            <span className="text-[10px] text-gray-500 mt-0.5">{car.fuelType} • {car.mileage.toLocaleString("en-KE")} km</span>
                          </div>
                        </td>
                        <td className="px-6 py-4.5 font-display font-medium text-[#D4AF37] text-sm">
                          {formatKEPrice(car.price)}
                        </td>
                        <td className="px-6 py-4.5">
                          <button
                            onClick={() => toggleCarStatus(car)}
                            type="button"
                            className={`cursor-pointer inline-flex items-center space-x-1 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border transition-all ${
                              car.status === "Available"
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20"
                                : "bg-red-500/10 text-red-400 border-red-500/20 hover:bg-neutral-500/20"
                            }`}
                            title="Click to toggle Available/Sold"
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
                            <span>{car.status}</span>
                          </button>
                        </td>
                        <td className="px-6 py-4.5 text-right whitespace-nowrap">
                          <div className="inline-flex space-x-1.5">
                            <button
                              onClick={() => openEditForm(car)}
                              className="p-2 bg-white/5 hover:bg-[#D4AF37] hover:text-black rounded-lg text-gray-300 transition-colors cursor-pointer"
                              title="Edit listing details"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(car.id, `${car.year} ${car.make} ${car.model}`)}
                              className="p-2 bg-white/5 hover:bg-red-600 hover:text-white rounded-lg text-red-400 transition-white cursor-pointer"
                              title="Delete listing permanently"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Inquiries Section */}
        {adminTab === "inquiries" && (
          <div className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
            {/* Header */}
            <div className="px-6 py-5 border-b border-white/5">
              <h3 className="text-lg font-display font-semibold text-white">
                Customer Inquiries & Messages
              </h3>
              <p className="text-gray-400 text-xs font-light">
                These are messages sent by customers directly from vehicles or contact forms. You can respond via their email listed.
              </p>
            </div>

            {inquiries.length === 0 ? (
              <div className="py-20 px-4 text-center">
                <Mail className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                <h4 className="text-white font-bold text-base">Inquiry mailbox empty.</h4>
                <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
                  When users fill contact sheets or request call-backs, details appear here in real time.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-white/[0.04]">
                {inquiries.map((inq) => (
                  <div key={inq.id} className={`p-6 transition-all ${inq.status === 'Unread' ? 'bg-[#D4AF37]/[0.015] border-l-2 border-l-[#D4AF37]' : 'opacity-85'}`}>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                      <div>
                        <div className="flex items-center space-x-2 flex-wrap gap-1.5">
                          <h4 className="text-sm font-bold text-white">{inq.name}</h4>
                          <span className="text-xs text-[#D4AF37]/80 font-mono font-medium">&lt;{inq.email}&gt;</span>
                          <span className="text-[10px] font-mono text-gray-500">
                            {new Date(inq.createdAt).toLocaleString("en-KE")}
                          </span>
                        </div>
                        {inq.carName && (
                          <span className="inline-block mt-1.5 text-xs text-[#D4AF37] bg-[#D4AF37]/5 border border-[#D4AF37]/10 px-2 py-0.5 rounded-md">
                            Car of Interest: <span className="text-white font-medium">{inq.carName}</span>
                          </span>
                        )}
                      </div>

                      {/* Controls */}
                      <div className="flex items-center space-x-1.5 self-start sm:self-auto">
                        <button
                          onClick={() => handleInquiryStatus(inq.id, inq.status)}
                          className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg border text-xs font-medium cursor-pointer transition-all uppercase font-mono tracking-wider ${
                            inq.status === "Unread"
                              ? "bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/20 hover:bg-[#D4AF37]/20"
                              : "bg-white/5 text-gray-400 border-white/5 hover:bg-white/10"
                          }`}
                        >
                          <BookmarkCheck className="h-3.5 w-3.5" />
                          <span>Mark {inq.status === "Unread" ? "Read" : "Unread"}</span>
                        </button>
                        <button
                          onClick={() => handleInquiryDelete(inq.id, inq.name)}
                          className="p-1.5 bg-white/5 hover:bg-red-600/20 text-red-400 rounded-lg hover:text-white transition-colors cursor-pointer"
                          title="Delete inquiry"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="bg-black/20 border border-white/5 p-4 rounded-xl">
                      <p className="text-sm text-gray-300 font-light leading-relaxed whitespace-pre-wrap">
                        {inq.message}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Floating Modal for Add/Edit Car */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto select-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="relative w-full max-w-4xl bg-[#111317] border border-white/10 rounded-2xl overflow-hidden shadow-2xl my-6"
            >
              {/* Form Title */}
              <div className="px-6 py-5 bg-[#171a1f] border-b border-white/5 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-display font-bold text-white">
                    {editingCar ? "Edit Active Simatei Listing" : "Add Luxury Machine to Fleet"}
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Specify real values. Use upload buttons to convert photos to our servers easily.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-full"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Form body */}
              <form onSubmit={handleFormSubmit} className="p-6 md:p-8 space-y-5 max-h-[75vh] overflow-y-auto">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-gray-400 uppercase mb-1.5">Brand / Manufacturer *</label>
                    <select
                      value={make}
                      onChange={(e) => setMake(e.target.value)}
                      className="w-full bg-[#0d0f11] text-sm text-white px-3 py-2.5 rounded-lg border border-white/10 focus:border-[#D4AF37] focus:outline-none"
                    >
                      <option value="Toyota">Toyota</option>
                      <option value="Mercedes-Benz">Mercedes-Benz</option>
                      <option value="BMW">BMW</option>
                      <option value="Subaru">Subaru</option>
                      <option value="Ford">Ford</option>
                      <option value="Audi">Audi</option>
                      <option value="Land Rover">Land Rover</option>
                      <option value="Lexus">Lexus</option>
                      <option value="Honda">Honda</option>
                      <option value="Nissan">Nissan</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-gray-400 uppercase mb-1.5">Model name (e.g. Prado TX) *</label>
                    <input
                      type="text"
                      placeholder="e.g. Prado TX-L"
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      className="w-full bg-[#0d0f11] text-sm text-white px-3.5 py-2.5 rounded-lg border border-white/10 focus:border-[#D4AF37] focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-gray-400 uppercase mb-1.5">YOM (Year of production) *</label>
                    <input
                      type="number"
                      value={year}
                      onChange={(e) => setYear(Number(e.target.value))}
                      className="w-full bg-[#0d0f11] text-sm text-white px-3.5 py-2.5 rounded-lg border border-white/10 focus:border-[#D4AF37] focus:outline-none"
                      min={1990}
                      max={2027}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-gray-400 uppercase mb-1.5">Asking Price (KES) *</label>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className="w-full bg-[#0d0f11] text-sm text-white px-3.5 py-2.5 rounded-lg border border-white/10 focus:border-[#D4AF37] focus:outline-none"
                      min={10000}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-gray-400 uppercase mb-1.5">Actual Odo Mileage (km) *</label>
                    <input
                      type="number"
                      value={mileage}
                      onChange={(e) => setMileage(Number(e.target.value))}
                      className="w-full bg-[#0d0f11] text-sm text-white px-3.5 py-2.5 rounded-lg border border-white/10 focus:border-[#D4AF37] focus:outline-none"
                      min={0}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-gray-400 uppercase mb-1.5">Displacement / Engine (e.g. 2.0L V6) *</label>
                    <input
                      type="text"
                      placeholder="e.g. 2.8L D-4D diesel"
                      value={engine}
                      onChange={(e) => setEngine(e.target.value)}
                      className="w-full bg-[#0d0f11] text-sm text-white px-3.5 py-2.5 rounded-lg border border-white/10 focus:border-[#D4AF37] focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-gray-400 uppercase mb-1.5">Fuel Source *</label>
                    <select
                      value={fuelType}
                      onChange={(e) => setFuelType(e.target.value as any)}
                      className="w-full bg-[#0d0f11] text-sm text-white px-3 py-2.5 rounded-lg border border-white/10 focus:border-[#D4AF37] focus:outline-none"
                    >
                      <option value="Petrol">Petrol</option>
                      <option value="Diesel">Diesel</option>
                      <option value="Hybrid">Hybrid</option>
                      <option value="Electric">Electric</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-gray-400 uppercase mb-1.5">Gearbox Transmission *</label>
                    <select
                      value={transmission}
                      onChange={(e) => setTransmission(e.target.value as any)}
                      className="w-full bg-[#0d0f11] text-sm text-white px-3 py-2.5 rounded-lg border border-white/10 focus:border-[#D4AF37] focus:outline-none"
                    >
                      <option value="Automatic">Automatic</option>
                      <option value="Manual">Manual</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-gray-400 uppercase mb-1.5">Exterior Color Shading *</label>
                    <input
                      type="text"
                      placeholder="e.g. Pearl White"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="w-full bg-[#0d0f11] text-sm text-white px-3.5 py-2.5 rounded-lg border border-white/10 focus:border-[#D4AF37] focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-gray-400 uppercase mb-1.5">Listing Status *</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as any)}
                      className="w-full bg-[#0d0f11] text-sm text-white px-3 py-2.5 rounded-lg border border-white/10 focus:border-[#D4AF37] focus:outline-none"
                    >
                      <option value="Available">Available</option>
                      <option value="Sold">Sold</option>
                    </select>
                  </div>
                </div>

                {/* Kai & Karo Premium Spec Fields */}
                <div className="border-t border-white/5 pt-5 pb-1 space-y-4">
                  <h4 className="text-xs font-mono uppercase text-[#D4AF37] tracking-wider font-bold">Kai & Karo Specification Structure</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-gray-400 uppercase mb-1.5">Interior Cabin Trim *</label>
                      <input
                        type="text"
                        placeholder="e.g. Beige Leather"
                        value={interiorColor}
                        onChange={(e) => setInteriorColor(e.target.value)}
                        className="w-full bg-[#0d0f11] text-sm text-white px-3.5 py-2.5 rounded-lg border border-white/10 focus:border-[#D4AF37] focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-gray-400 uppercase mb-1.5">Drive Train Configuration *</label>
                      <select
                        value={driveType}
                        onChange={(e) => setDriveType(e.target.value as any)}
                        className="w-full bg-[#0d0f11] text-sm text-white px-3 py-2.5 rounded-lg border border-white/10 focus:border-[#D4AF37] focus:outline-none"
                      >
                        <option value="AWD">AWD (All-Wheel Drive)</option>
                        <option value="4WD">4WD (Four-Wheel Drive)</option>
                        <option value="2WD">2WD (Two-Wheel Drive)</option>
                        <option value="FWD">FWD (Front-Wheel Drive)</option>
                        <option value="RWD">RWD (Rear-Wheel Drive)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-gray-400 uppercase mb-1.5 font-bold text-[#D4AF37]">Physical Location *</label>
                      <select
                        value={location}
                        onChange={(e) => setLocation(e.target.value as any)}
                        className="w-full bg-[#0d0f11] text-sm text-white px-3 py-2.5 rounded-lg border border-white/10 focus:border-[#D4AF37] focus:outline-none font-bold"
                      >
                        <option value="Nairobi">Nairobi Showroom</option>
                        <option value="Mombasa">Mombasa Port/Yard</option>
                        <option value="Transit">On Transit from Japan/UK</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-gray-400 uppercase mb-1.5">Duty Status *</label>
                      <select
                        value={dutyStatus}
                        onChange={(e) => setDutyStatus(e.target.value as any)}
                        className="w-full bg-[#0d0f11] text-sm text-white px-3 py-2.5 rounded-lg border border-white/10 focus:border-[#D4AF37] focus:outline-none"
                      >
                        <option value="Duty Paid">Duty Paid</option>
                        <option value="Duty Free">Duty Free (Tax Exempt)</option>
                        <option value="On Transit">On Transit</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-gray-400 uppercase mb-1.5">Import Status *</label>
                      <select
                        value={importStatus}
                        onChange={(e) => setImportStatus(e.target.value as any)}
                        className="w-full bg-[#0d0f11] text-sm text-white px-3 py-2.5 rounded-lg border border-white/10 focus:border-[#D4AF37] focus:outline-none"
                      >
                        <option value="Foreign Used">Foreign Used (Import)</option>
                        <option value="Locally Used">Locally Used (Kenyan)</option>
                        <option value="Brand New">Brand New</option>
                        <option value="Direct Import">Direct Import order</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-gray-400 uppercase mb-1.5">Body Styling *</label>
                      <select
                        value={bodyType}
                        onChange={(e) => setBodyType(e.target.value as any)}
                        className="w-full bg-[#0d0f11] text-sm text-white px-3 py-2.5 rounded-lg border border-white/10 focus:border-[#D4AF37] focus:outline-none"
                      >
                        <option value="SUV">SUV / Crossover</option>
                        <option value="Sedan">Sedan</option>
                        <option value="Hatchback">Hatchback</option>
                        <option value="Station Wagon">Station Wagon</option>
                        <option value="Coupe">Coupe</option>
                        <option value="Convertible">Convertible</option>
                        <option value="Pickup">Pickup Truck</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-[#D4AF37] uppercase mb-1.5 font-semibold">Condition Rating *</label>
                      <input
                        type="text"
                        placeholder="e.g. Grade 4.5 / Pristine"
                        value={conditionGrade}
                        onChange={(e) => setConditionGrade(e.target.value)}
                        className="w-full bg-[#0d0f11] text-sm text-white px-3.5 py-2.5 rounded-lg border border-white/10 focus:border-[#D4AF37] focus:outline-none"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-400 uppercase mb-1.5">Equipped Specifications Tag list (comma-separated)</label>
                  <input
                    type="text"
                    placeholder="Sunroof, Leather Seats, Reverse Camera, Harman Kardon"
                    value={featuresInput}
                    onChange={(e) => setFeaturesInput(e.target.value)}
                    className="w-full bg-[#0d0f11] text-sm text-white px-3.5 py-2.5 rounded-lg border border-white/10 focus:border-[#D4AF37] focus:outline-none"
                  />
                  <span className="text-[10px] text-gray-500 font-mono mt-1 block">Separate features using a standard comma (e.g. A, B, C)</span>
                </div>

                {/* Car Photo Management with File Upload capabilities! */}
                <div className="bg-black/30 border border-white/5 p-5 rounded-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs uppercase font-mono tracking-wider text-gray-300">
                      Vehicle Photos Management
                    </h5>
                    {uploadProgress && (
                      <span className="text-xs text-[#D4AF37] font-mono font-medium animate-pulse">{uploadProgress}</span>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Image Slot 1 */}
                    <div className="p-3 bg-[#0d0f11] border border-white/10 rounded-lg space-y-2.5">
                      <span className="block text-[11px] font-mono text-[#D4AF37]">Image Slot 1 *</span>
                      <input
                        type="text"
                        placeholder="Paste image URL..."
                        value={imageUrl1}
                        onChange={(e) => setImageUrl1(e.target.value)}
                        className="w-full bg-zinc-950 text-xs text-white px-2 py-2 rounded border border-white/5 focus:outline-none"
                      />
                      <label className="flex items-center justify-center space-x-1 border border-dashed border-white/20 hover:border-[#D4AF37]/50 p-2 rounded cursor-pointer text-[10px] font-mono hover:text-white transition-colors">
                        <UploadCloud className="h-3.5 w-3.5 text-gray-400" />
                        <span>Upload Custom file</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleLocalUpload(e, 1)}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {/* Image Slot 2 */}
                    <div className="p-3 bg-[#0d0f11] border border-white/10 rounded-lg space-y-2.5">
                      <span className="block text-[11px] font-mono text-[#D4AF37]">Image Slot 2</span>
                      <input
                        type="text"
                        placeholder="Paste image URL..."
                        value={imageUrl2}
                        onChange={(e) => setImageUrl2(e.target.value)}
                        className="w-full bg-zinc-950 text-xs text-white px-2 py-2 rounded border border-white/5 focus:outline-none"
                      />
                      <label className="flex items-center justify-center space-x-1 border border-dashed border-white/20 hover:border-[#D4AF37]/50 p-2 rounded cursor-pointer text-[10px] font-mono hover:text-white transition-colors">
                        <UploadCloud className="h-3.5 w-3.5 text-gray-400" />
                        <span>Upload Custom file</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleLocalUpload(e, 2)}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {/* Image Slot 3 */}
                    <div className="p-[#121418] border border-white/10 rounded-lg space-y-2.5 bg-[#0d0f11]">
                      <span className="block text-[11px] font-mono text-[#D4AF37]">Image Slot 3</span>
                      <input
                        type="text"
                        placeholder="Paste image URL..."
                        value={imageUrl3}
                        onChange={(e) => setImageUrl3(e.target.value)}
                        className="w-full bg-zinc-950 text-xs text-white px-2 py-2 rounded border border-white/5 focus:outline-none"
                      />
                      <label className="flex items-center justify-center space-x-1 border border-dashed border-white/20 hover:border-[#D4AF37]/50 p-2 rounded cursor-pointer text-[10px] font-mono hover:text-white transition-colors">
                        <UploadCloud className="h-3.5 w-3.5 text-gray-400" />
                        <span>Upload Custom file</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleLocalUpload(e, 3)}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-400 uppercase mb-1.5">Vehicle Narrative Description *</label>
                  <textarea
                    placeholder="Enter comprehensive notes describing this vehicle's conditions, past service, and value propositions..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="w-full bg-[#0d0f11] text-sm text-white px-3.5 py-3 rounded-lg border border-white/10 focus:border-[#D4AF37] focus:outline-none"
                    required
                  />
                </div>

                {formError && (
                  <p className="text-sm text-red-400 font-mono font-medium">{formError}</p>
                )}

                <div className="flex items-center justify-end space-x-3 pt-4 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-lg text-xs font-bold font-mono uppercase cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingForm}
                    className="px-6 py-2.5 bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-black font-bold text-xs uppercase tracking-wider rounded-lg shadow-lg cursor-pointer flex items-center space-x-2"
                  >
                    {isSubmittingForm ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>{editingCar ? "Update Listing" : "Create Listing"}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
