/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Gauge, Fuel, Snowflake, Eye, MessageCircle, DollarSign, Calendar } from "lucide-react";
import { Car } from "../types";
import { motion } from "motion/react";

interface CarCardProps {
  car: Car;
  onViewDetails: (car: Car) => void;
}

export default function CarCard({ car, onViewDetails }: CarCardProps) {
  // Format price helper
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formattedMileage = new Intl.NumberFormat("en-KE").format(car.mileage);

  // Prefilled WhatsApp message
  const whatsappUrl = `https://wa.me/254740892332?text=${encodeURIComponent(
    `Hello Simatei Motorworld, I'm inquiring about the ${car.year} ${car.make} ${car.model} listed at ${formatPrice(car.price)}. Is it still available?`
  )}`;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className="relative flex flex-col h-full bg-[#111] border border-white/5 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 hover:border-white/10"
    >
      {/* Visual Badge/Overlay */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5 pointer-events-none">
        {car.status === "Sold" ? (
          <div className="bg-red-600 text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-md uppercase tracking-wider w-fit">
            Sold Done
          </div>
        ) : (
          <>
            {car.dutyStatus && (
              <div className="bg-[#D4AF37] text-black text-[9px] font-extrabold px-2 py-0.5 rounded shadow-md uppercase tracking-wider w-fit">
                {car.dutyStatus}
              </div>
            )}
            {car.importStatus && (
              <div className="bg-white/10 backdrop-blur-md text-white border border-white/10 text-[9px] font-semibold px-2 py-0.5 rounded shadow-md uppercase tracking-wider w-fit">
                {car.importStatus}
              </div>
            )}
          </>
        )}
      </div>
      
      <div className="absolute top-4 right-4 z-10 bg-black/80 backdrop-blur-md px-2.5 py-1 text-[10px] font-mono text-[#D4AF37] rounded-md border border-white/10 font-bold uppercase tracking-wider">
        {car.year}
      </div>

      {/* Car Image Preview */}
      <div className="relative aspect-video w-full overflow-hidden bg-black/40 group">
        <img
          src={car.images[0]}
          alt={`${car.make} ${car.model}`}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[rgba(5,5,5,0.4)] to-transparent" />
      </div>

      {/* Card Content */}
      <div className="flex flex-col flex-grow p-4 gap-1">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[10px] font-mono tracking-wider text-[#D4AF37]/80 uppercase block">
              {car.make}
            </span>
            <h3 className="font-display text-base font-bold text-white line-clamp-1">
              {car.model}
            </h3>
          </div>
          <span className="text-[#D4AF37] text-base font-bold font-display whitespace-nowrap">
            {formatPrice(car.price)}
          </span>
        </div>

        {/* Specs Highlights */}
        <div className="flex flex-wrap gap-2 mt-3 mb-4 text-[10px] text-white/70 uppercase font-semibold tracking-tighter">
          <span className="bg-white/5 px-2 py-1 rounded">{formattedMileage} km</span>
          <span className="bg-white/5 px-2 py-1 rounded">{car.fuelType}</span>
          <span className="bg-white/5 px-2 py-1 rounded">{car.transmission}</span>
          {car.driveType && <span className="bg-white/5 px-2 py-1 rounded border border-[#D4AF37]/10 text-[#D4AF37]/90">{car.driveType}</span>}
          {car.location && <span className="bg-white/5 px-2 py-1 rounded text-gray-300 font-mono">{car.location}</span>}
          {car.conditionGrade && <span className="bg-white/5 px-2 py-1 rounded text-emerald-400">{car.conditionGrade}</span>}
        </div>

        {/* Primary Call to Actions */}
        <div className="mt-auto grid grid-cols-2 gap-2">
          <button
            id={`view-details-${car.id}`}
            onClick={() => onViewDetails(car)}
            className="flex items-center justify-center space-x-1 px-3 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-xs font-semibold select-none cursor-pointer transition-colors duration-200"
          >
            <Eye className="h-3.5 w-3.5 text-[#D4AF37]" />
            <span>Details</span>
          </button>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center space-x-1 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold select-none cursor-pointer duration-200 shadow-md shadow-emerald-700/10"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>
    </motion.div>
  );
}
