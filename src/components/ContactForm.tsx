/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Phone, MessageCircle, MapPin, Mail, Send, CheckCircle2, Facebook, Instagram, Youtube, HelpCircle } from "lucide-react";
import { motion } from "motion/react";

interface ContactFormProps {
  onSubmitInquiry: (name: string, email: string, message: string) => Promise<boolean>;
}

export default function ContactForm({ onSubmitInquiry }: ContactFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setErrorMsg("All fields are required.");
      return;
    }

    setErrorMsg("");
    setIsSubmitting(true);
    try {
      const isSent = await onSubmitInquiry(name, email, message);
      if (isSent) {
        setSuccess(true);
        setName("");
        setEmail("");
        setMessage("");
      } else {
        setErrorMsg("Failed to deliver your message. Please try again.");
      }
    } catch {
      setErrorMsg("An unexpected network error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const socials = [
    { name: "Facebook", link: "https://facebook.com", handle: "@Simatei Motorworld", color: "hover:text-blue-500 hover:border-blue-500/30" },
    { name: "Instagram", link: "https://instagram.com", handle: "@Simatei Motorworld", color: "hover:text-pink-500 hover:border-pink-500/30" },
    { name: "TikTok", link: "https://tiktok.com", handle: "@simatei_motorworld", color: "hover:text-cyan-400 hover:border-cyan-400/30" },
    { name: "Twitter/X", link: "https://twitter.com", handle: "@Simatei Motorworld", color: "hover:text-sky-400 hover:border-sky-400/30" },
    { name: "YouTube", link: "https://youtube.com", handle: "Simatei Motorworld", color: "hover:text-red-500 hover:border-red-500/30" }
  ];

  return (
    <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#E21E26] font-bold block mb-2">Connect With Us</span>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          How Can We Help You Build Your Legacy?
        </h1>
        <p className="mt-4 text-gray-400 text-sm sm:text-base font-light">
          Whether you’re ready to acquire a premium machine, schedule a customized viewing, or discuss financing options, our automotive executives are here to assist.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Contacts & Socials */}
        <div className="lg:col-span-5 space-y-8">
          {/* Quick Connect Cards */}
          <div className="bg-[#111] border border-white/5 p-8 rounded-2xl shadow-xl space-y-6">
            <h3 className="text-lg font-display font-bold text-white mb-4 border-b border-white/5 pb-2">
              Simatei Contact Information
            </h3>
 
            <div className="flex items-start space-x-4">
              <div className="bg-[#E21E26]/10 p-3 rounded-lg border border-[#E21E26]/20 text-[#E21E26]">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <span className="block text-xs font-mono text-gray-500 uppercase">Direct Hotlines</span>
                <a href="tel:0740892332" className="text-base text-white hover:text-[#E21E26] font-bold transition-colors">
                  0740892332
                </a>
                <span className="block text-xs text-gray-400 mt-0.5 font-light">Mon - Sat: 8:00 AM - 6:00 PM</span>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/20 text-emerald-400">
                <MessageCircle className="h-5 w-5" />
              </div>
              <div>
                <span className="block text-xs font-mono text-gray-500 uppercase">Instant WhatsApp Chat</span>
                <a 
                  href="https://wa.me/254740892332" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-base text-white hover:text-emerald-400 font-bold flex items-center space-x-1.5 transition-colors"
                >
                  <span>Chat at wa.me/254740892332</span>
                </a>
                <span className="block text-xs text-gray-400 mt-0.5 font-light">Get lightning fast responses via WhatsApp.</span>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-[#E21E26]/10 p-3 rounded-lg border border-[#E21E26]/20 text-[#E21E26]">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <span className="block text-xs font-mono text-gray-500 uppercase">Main Showroom Location</span>
                <span className="text-sm font-semibold text-white">
                  Simatei Motorworld, Nairobi Langata Road / Ngong Road showroom complexes
                </span>
                <span className="block text-xs text-gray-400 mt-0.5 font-light">Nairobi, Kenya</span>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="bg-[#E21E26]/10 p-3 rounded-lg border border-[#E21E26]/20 text-[#E21E26]">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <span className="block text-xs font-mono text-gray-500 uppercase">Email Enquiries</span>
                <a href="mailto:info@simatei.example.com" className="text-sm font-semibold text-white hover:text-[#E21E26] transition-colors">
                  info@simateimotorworld.co.ke
                </a>
              </div>
            </div>
          </div>
 
          {/* Social Links Grid */}
          <div className="bg-[#111] border border-white/5 p-8 rounded-2xl shadow-xl">
            <h3 className="text-lg font-display font-bold text-white mb-4 border-b border-white/5 pb-2">
              Follow Our Fleet
            </h3>
            <p className="text-xs text-gray-400 mb-6 font-light">
              Follow Simatei Motorworld on social media to watch walkaround videos, review fresh ship arrivals, and enjoy automotive content!
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {socials.map((social) => (
                <a
                  key={social.name}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center space-x-3 p-3 bg-white/[0.02] border border-white/5 rounded-xl transition-all duration-300 ${social.color}`}
                >
                  <div className="text-[#E21E26]">
                    {social.name === "Facebook" && <Facebook className="h-4 w-4" />}
                    {social.name === "Instagram" && <Instagram className="h-4 w-4" />}
                    {social.name === "YouTube" && <Youtube className="h-4 w-4" />}
                    {(!["Facebook", "Instagram", "YouTube"].includes(social.name)) && <HelpCircle className="h-4 w-4" />}
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-white text-[11px] leading-tight">{social.name}</span>
                    <span className="block text-[10px] text-gray-500 lowercase mt-0.5">{social.handle}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>        {/* Right Column: Interactive Form and Embedded Map */}
        <div className="lg:col-span-7 space-y-8">
          {/* Main Inquiry Form */}
          <div className="bg-[#111] border border-white/10 p-8 rounded-2xl shadow-xl relative overflow-hidden">
            <h3 className="text-xl font-display font-bold text-white mb-6">
              Write Simatei Motorworld Directly
            </h3>
 
            {success ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center text-center py-12"
              >
                <div className="bg-emerald-500/10 p-5 rounded-full border border-emerald-500/30 text-emerald-400 mb-4 animate-pulse">
                  <CheckCircle2 className="h-10 w-10" />
                </div>
                <h4 className="text-2xl font-display font-bold text-white">Message Delivered Successfully!</h4>
                <p className="text-sm text-gray-400 mt-2 max-w-sm font-light">
                  Thank you for reaching out to Simatei Motorworld. One of our regional sales directors will respond to your email shortly.
                </p>
                <button
                  type="button"
                  onClick={() => setSuccess(false)}
                  className="mt-6 px-6 py-2.5 bg-[#E21E26] hover:bg-[#C3141F] text-white font-semibold text-xs uppercase tracking-wider rounded-lg transition-colors select-none"
                >
                  Send another inquiry
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Kevin Kipyegon"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-[#0d0f11] text-sm text-white placeholder-gray-600 px-4 py-3.5 rounded-xl border border-white/10 focus:border-[#E21E26] focus:ring-1 focus:ring-[#E21E26] focus:outline-none transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. kevin@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#0d0f11] text-sm text-white placeholder-gray-600 px-4 py-3.5 rounded-xl border border-white/10 focus:border-[#E21E26] focus:ring-1 focus:ring-[#E21E26] focus:outline-none transition-all"
                      required
                    />
                  </div>
                </div>
 
                <div>
                  <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider mb-2">
                    Message Details
                  </label>
                  <textarea
                    placeholder="Hello Simatei, write standard questions or custom vehicle specifications you would love parsed by our experts here..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={5}
                    className="w-full bg-[#0d0f11] text-sm text-white placeholder-gray-600 px-4 py-3 rounded-xl border border-white/10 focus:border-[#E21E26] focus:ring-1 focus:ring-[#E21E26] focus:outline-none transition-all resize-none"
                    required
                  />
                </div>
 
                {errorMsg && (
                  <p className="text-sm text-red-400 font-mono font-medium">{errorMsg}</p>
                )}
 
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full cursor-pointer flex items-center justify-center space-x-2 py-3.5 bg-[#E21E26] hover:bg-[#C3141F] text-white font-bold text-sm uppercase tracking-wider rounded-xl shadow-lg transition-all active:scale-[0.98]"
                >
                  <Send className="h-4 w-4" />
                  <span>{isSubmitting ? "Sending message..." : "Send Secure Message"}</span>
                </button>
              </form>
            )}
          </div>
 
          {/* Map */}
          <div className="bg-[#111] border border-white/5 p-4 rounded-2xl shadow-xl">
            <h4 className="text-xs uppercase font-mono tracking-wider text-gray-400 mb-3 px-2 flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-[#E21E26]" />
              <span>Simatei Showroom Map Guide (Nairobi)</span>
            </h4>
            <div className="aspect-video w-full rounded-xl overflow-hidden grayscale opacity-80 border border-white/5 focus:grayscale-0 hover:grayscale-0 transition-all duration-300">
              <iframe
                title="Simatei Motorworld Nairobi Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m13!1m4!1m3!1d15955.223847844015!2d36.8219463!3d-1.292158!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f1172d84d4997%3A0xf6e626d705c75bfd!2sNairobi%2C%20Kenya!5e0!3m2!1sen!2ske!4v1700000000000!5m2!1sen!2ske"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
