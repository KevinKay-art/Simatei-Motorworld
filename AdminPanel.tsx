/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { X, ChevronLeft, ChevronRight, MessageCircle, Mail, MapPin, Calendar, Compass, ShieldAlert, Award, Send, CheckCircle2 } from "lucide-react";
import { Car } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface CarDetailModalProps {
  car: Car;
  onClose: () => void;
  onSubmitInquiry: (name: string, email: string, message: string, carId: string, carName: string) => Promise<boolean>;
}

export default function CarDetailModal({ car, onClose, onSubmitInquiry }: CarDetailModalProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [inquiryName, setInquiryName] = useState("");
  const [inquiryEmail, setInquiryEmail] = useState("");
  const [inquiryMessage, setInquiryMessage] = useState(
    `Hello Simatei Motorworld, I am highly interested in the ${car.year} ${car.make} ${car.model}. Please contact me with further details or payment/financing information.`
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [errorText, setErrorText] = useState("");

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev === car.images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev === 0 ? car.images.length - 1 : prev - 1));
  };

  const formattedMileage = new Intl.NumberFormat("en-KE").format(car.mileage);

  // Form handle
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryName.trim() || !inquiryEmail.trim() || !inquiryMessage.trim()) {
      setErrorText("Please complete all fields.");
      return;
    }
    setErrorText("");
    setIsSubmitting(true);
    try {
      const success = await onSubmitInquiry(
        inquiryName,
        inquiryEmail,
        inquiryMessage,
        car.id,
        `${car.make} ${car.model}`
      );
      if (success) {
        setSubmissionSuccess(true);
        setInquiryName("");
        setInquiryEmail("");
      } else {
        setErrorText("Failed to send your inquiry. Please try again.");
      }
    } catch (err) {
      setErrorText("A network error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Hello Simatei Motorworld! I am inquiring about the ${car.year} ${car.make} ${car.model} which is listed for ${formatPrice(car.price)} on your website. Is it still available to view?`
  );
  const whatsappUrl = `https://wa.me/254740892332?text=${whatsappMessage}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 30 }}
        transition={{ type: "spring", damping: 25, stiffness: 180 }}
        className="relative w-full max-w-5xl bg-[#111] border border-white/10 rounded-2xl overflow-hidden shadow-2xl my-8"
      >
        {/* Close Button Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-40 bg-black/60 hover:bg-black/80 text-white p-2.5 rounded-full border border-white/10 hover:border-[#E21E26]/30 transition-all duration-200"
          title="Close details drawer"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* Left Column: Image Center */}
          <div className="lg:col-span-7 bg-zinc-950 flex flex-col justify-between relative min-h-[300px] md:min-h-[400px]">
            {/* Main Image Slider */}
            <div className="relative flex-grow flex items-center justify-center group overflow-hidden">
              <img
                src={car.images[activeImageIndex]}
                alt={`${car.make} ${car.model}`}
                className="w-full h-full object-cover max-h-[500px]"
                referrerPolicy="no-referrer"
              />
              
              {car.status === "Sold" && (
                <div className="absolute top-6 left-6 z-20 bg-red-600 px-4 py-1.5 text-xs font-mono font-bold uppercase tracking-wider rounded border border-red-500/50 shadow-md">
                  SOLD OUT
                </div>
              )}

              {/* Slider Controls */}
              {car.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-[#E21E26] hover:text-white text-white p-2.5 rounded-full border border-white/5 transition-all"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-[#E21E26] hover:text-white text-white p-2.5 rounded-full border border-white/5 transition-all"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Navigation */}
            {car.images.length > 1 && (
              <div className="flex space-x-2 p-4 overflow-x-auto bg-black/40 border-t border-white/5 scrollbar-thin">
                {car.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImageIndex(index)}
                    className={`relative w-20 h-14 rounded-md overflow-hidden flex-shrink-0 transition-all ${
                      activeImageIndex === index
                        ? "ring-2 ring-[#E21E26] border-transparent opacity-100"
                        : "opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt="Thumbnail preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Key Details & Booking Option */}
          <div className="lg:col-span-5 flex flex-col justify-between p-6 sm:p-8 bg-gradient-to-b from-[#111] to-[#050505] max-h-[85vh] overflow-y-auto border-t lg:border-t-0 lg:border-l border-white/5">
            <div>
              {/* Header Details */}
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-xs font-mono uppercase text-[#E21E26] font-semibold tracking-widest bg-[#E21E26]/10 px-2.5 py-1 rounded">
                    {car.make}
                  </span>
                  <span className="text-xs font-mono text-gray-400 bg-white/5 px-2.5 py-1 rounded">
                    YOM: {car.year}
                  </span>
                </div>
                <h2 className="font-display text-2xl font-bold text-white leading-tight">
                  {car.model}
                </h2>
                <div className="mt-3 flex items-baseline space-x-2">
                  <span className="text-gray-400 text-sm">Asking Price:</span>
                  <span className="text-2xl font-display font-medium text-[#E21E26] tracking-tight font-bold">
                    {formatPrice(car.price)}
                  </span>
                </div>
              </div>

              {/* Specs parameters */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                <div className="p-2.5 bg-white/[0.02] border border-white/5 rounded-lg">
                  <span className="block text-[9px] font-mono text-gray-500 uppercase">Engine Size</span>
                  <span className="text-xs font-semibold text-white mt-0.5 block">{car.engine}</span>
                </div>
                <div className="p-2.5 bg-white/[0.02] border border-white/5 rounded-lg">
                  <span className="block text-[9px] font-mono text-gray-500 uppercase">Mileage</span>
                  <span className="text-xs font-semibold text-white mt-0.5 block">{formattedMileage} km</span>
                </div>
                <div className="p-2.5 bg-white/[0.02] border border-white/5 rounded-lg">
                  <span className="block text-[9px] font-mono text-gray-500 uppercase">Fuel Source</span>
                  <span className="text-xs font-semibold text-white mt-0.5 block">{car.fuelType}</span>
                </div>
                <div className="p-2.5 bg-white/[0.02] border border-white/5 rounded-lg">
                  <span className="block text-[9px] font-mono text-gray-500 uppercase">Transmission</span>
                  <span className="text-xs font-semibold text-white mt-0.5 block">{car.transmission}</span>
                </div>
                <div className="p-2.5 bg-white/[0.02] border border-white/5 rounded-lg">
                  <span className="block text-[9px] font-mono text-gray-500 uppercase">Exterior Color</span>
                  <span className="text-xs font-semibold text-white mt-0.5 block">{car.color}</span>
                </div>
                <div className="p-2.5 bg-white/[0.02] border border-white/5 rounded-lg">
                  <span className="block text-[9px] font-mono text-gray-500 uppercase">Interior Cabin</span>
                  <span className="text-xs font-semibold text-white mt-0.5 block">{car.interiorColor || "Black Leather"}</span>
                </div>
                <div className="p-2.5 bg-white/[0.02] border border-white/5 rounded-lg">
                  <span className="block text-[9px] font-mono text-gray-500 uppercase">Drive Train</span>
                  <span className="text-xs font-semibold text-[#E21E26] mt-0.5 block">{car.driveType || "AWD"}</span>
                </div>
                <div className="p-2.5 bg-white/[0.02] border border-white/5 rounded-lg">
                  <span className="block text-[9px] font-mono text-gray-500 uppercase">Duty Status</span>
                  <span className="text-xs font-semibold text-white mt-0.5 block">{car.dutyStatus || "Duty Paid"}</span>
                </div>
                <div className="p-2.5 bg-white/[0.02] border border-white/5 rounded-lg">
                  <span className="block text-[9px] font-mono text-gray-500 uppercase">Import Type</span>
                  <span className="text-xs font-semibold text-white mt-0.5 block">{car.importStatus || "Foreign Used"}</span>
                </div>
                <div className="p-2.5 bg-white/[0.02] border border-white/5 rounded-lg">
                  <span className="block text-[9px] font-mono text-gray-500 uppercase">Body Style</span>
                  <span className="text-xs font-semibold text-white mt-0.5 block">{car.bodyType || "SUV"}</span>
                </div>
                <div className="p-2.5 bg-white/[0.02] border border-white/5 rounded-lg">
                  <span className="block text-[9px] font-mono text-gray-500 uppercase">Showroom Location</span>
                  <span className="text-xs font-semibold text-[#E21E26] mt-0.5 block">{car.location || "Nairobi"}</span>
                </div>
                {car.conditionGrade && (
                  <div className="p-2.5 bg-white/[0.02] border border-white/5 rounded-lg">
                    <span className="block text-[9px] font-mono text-gray-500 uppercase">Condition Grade</span>
                    <span className="text-xs font-semibold text-emerald-400 mt-0.5 block">{car.conditionGrade}</span>
                  </div>
                )}
                <div className="col-span-2 sm:col-span-3 p-2.5 bg-white/[0.02] border border-white/5 rounded-lg flex items-center justify-between">
                  <span className="text-[9px] font-mono text-gray-500 uppercase">Listing Status</span>
                  <span className={`text-xs font-bold ${car.status === 'Available' ? 'text-emerald-400' : 'text-red-400'}`}>
                    ● {car.status}
                  </span>
                </div>
              </div>

              {/* Description section */}
              <div className="mb-6">
                <h4 className="text-xs uppercase font-mono tracking-wider text-gray-400 mb-2 border-b border-white/10 pb-1">
                  Owner's Notes
                </h4>
                <p className="text-sm text-gray-300 leading-relaxed font-light">
                  {car.description}
                </p>
              </div>

              {/* Features Array */}
              {car.features && car.features.length > 0 && (
                <div className="mb-8">
                  <h4 className="text-xs uppercase font-mono tracking-wider text-gray-400 mb-2 border-b border-white/10 pb-1">
                    Equipped Features
                  </h4>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {car.features.map((feat, i) => (
                      <span
                        key={i}
                        className="text-xs text-gray-300 px-3 py-1 bg-white/[0.03] border border-white/5 rounded-full hover:bg-white/[0.05] transition-colors"
                      >
                        ✓ {feat}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Inquiry Contacts */}
            <div className="mt-auto border-t border-white/5 pt-6">
              <h4 className="text-[#E21E26] font-semibold text-sm xl:text-base mb-3.5 flex items-center space-x-1.5">
                <Compass className="h-4.5 w-4.5" />
                <span>Arrange Booking & Inquiry</span>
              </h4>

              {/* WhatsApp Quick Link */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-2.5 w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-emerald-700/15 duration-300"
              >
                <MessageCircle className="h-5 w-5" />
                <span>Inquire directly on WhatsApp (0740892332)</span>
              </a>

              <div className="relative my-6 flex py-1 items-center">
                <div className="flex-grow border-t border-white/5"></div>
                <span className="flex-shrink mx-3 text-[10px] font-mono uppercase text-gray-500 tracking-widest">or send email inquiry</span>
                <div className="flex-grow border-t border-white/5"></div>
              </div>

              {/* Direct Booking Email Form */}
              <div className="bg-[#181a20] p-4.5 border border-white/5 rounded-xl">
                {submissionSuccess ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center text-center py-4"
                  >
                    <CheckCircle2 className="h-10 w-10 text-emerald-400 mb-2" />
                    <h5 className="text-white font-bold text-sm">Inquiry Sent Successfully!</h5>
                    <p className="text-xs text-gray-400 mt-1 max-w-[250px]">
                      Your details have been saved. Simatei Motorworld will contact you shortly.
                    </p>
                    <button
                      onClick={() => setSubmissionSuccess(false)}
                      className="mt-3 text-xs text-[#E21E26] font-mono hover:underline"
                    >
                      Send another message
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleFormSubmit} className="space-y-3">
                    <div>
                      <input
                        type="text"
                        placeholder="Your full name"
                        value={inquiryName}
                        onChange={(e) => setInquiryName(e.target.value)}
                        className="w-full bg-[#0d0f11] text-sm text-white placeholder-gray-500 px-3.5 py-2.5 rounded-lg border border-white/10 focus:border-[#E21E26] focus:ring-1 focus:ring-[#E21E26] focus:outline-none transition-all"
                        required
                      />
                    </div>
                    <div>
                      <input
                        type="email"
                        placeholder="Your email address"
                        value={inquiryEmail}
                        onChange={(e) => setInquiryEmail(e.target.value)}
                        className="w-full bg-[#0d0f11] text-sm text-white placeholder-gray-500 px-3.5 py-2.5 rounded-lg border border-white/10 focus:border-[#E21E26] focus:ring-1 focus:ring-[#E21E26] focus:outline-none transition-all"
                        required
                      />
                    </div>
                    <div>
                      <textarea
                        placeholder="Your message details..."
                        value={inquiryMessage}
                        onChange={(e) => setInquiryMessage(e.target.value)}
                        rows={3}
                        className="w-full bg-[#0d0f11] text-sm text-white placeholder-gray-500 px-3.5 py-2 rounded-lg border border-white/10 focus:border-[#E21E26] focus:ring-1 focus:ring-[#E21E26] focus:outline-none transition-all resize-none"
                        required
                      />
                    </div>

                    {errorText && (
                      <p className="text-xs text-red-400 font-medium font-mono">{errorText}</p>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full cursor-pointer flex items-center justify-center space-x-2 py-2.5 bg-[#E21E26] hover:bg-[#C3141F] text-white font-semibold text-xs uppercase tracking-wider rounded-lg transition-colors duration-200"
                    >
                      <Send className="h-3.5 w-3.5" />
                      <span>{isSubmitting ? "Sending..." : "Submit Inquiry"}</span>
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
