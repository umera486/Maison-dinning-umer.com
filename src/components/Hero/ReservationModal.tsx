"use client";
import { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ReservationModal({ isOpen, onClose }: ReservationModalProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    guests: "2 Persons",
    date: "",
    time: "19:30",
    name: "",
    phone: "",
    notes: "",
  });
  const [isCompleted, setIsCompleted] = useState(false);

  // Full-Screen Cinematic Slide-Up Variants
  const pageVariants: Variants = {
    hidden: { opacity: 0, y: "100%" },
    visible: {
      opacity: 1,
      y: "0%",
      transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] },
    },
    exit: {
      opacity: 0,
      y: "100%",
      transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] },
    },
  };

  // Step-by-Step Horizontal Slide Variants
  const stepSlideVariants: Variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 50 : -50,
      opacity: 0,
      transition: { duration: 0.4, ease: [0.76, 0, 0.24, 1] },
    }),
  };

  const [[page, direction], setPage] = useState([1, 0]);

  const paginate = (newDirection: number) => {
    if (newDirection > 0 && step === 1 && (!formData.date || !formData.guests)) return;
    if (newDirection > 0 && step === 2 && (!formData.name || !formData.phone)) return;

    const nextStep = step + newDirection;
    if (nextStep >= 1 && nextStep <= 3) {
      setPage([nextStep, newDirection]);
      setStep(nextStep);
    }
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCompleted(true);
    setTimeout(() => {
      setIsCompleted(false);
      setStep(1);
      setPage([1, 0]);
      onClose();
    }, 3000);
  };

  const guestOptions = ["1 Person", "2 Persons", "4 Persons", "6+ VIP"];
  const timeSlots = ["18:00", "19:30", "21:00", "22:15"];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={pageVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 z-50 bg-[#0D0D0F] flex flex-col justify-between px-4 sm:px-8 md:px-20 py-6 sm:py-10 overflow-y-auto"
        >
          {/* Top Header Navigation (Super Responsive) */}
          <div className="flex items-center justify-between border-b border-[#F5EFEB]/10 pb-4 sm:pb-6">
            <div className="flex items-center gap-2 sm:gap-4">
              <span className="font-heading text-lg sm:text-2xl tracking-widest text-[#F5EFEB]">
                MAISON
              </span>
              <span className="hidden md:inline-block w-px h-4 bg-[#F5EFEB]/20" />
              <span className="hidden md:inline-block font-body text-xs uppercase tracking-[0.3em] text-[#E5A93C]">
                Digital Concierge / Step 0{step} of 03
              </span>
            </div>
            
            {/* Aesthetic Breathing Animated Close Button */}
            <motion.button
              onClick={onClose}
              animate={{
                scale: [1, 1.03, 1],
                borderColor: ["rgba(245,239,235,0.15)", "rgba(229,169,60,0.5)", "rgba(245,239,235,0.15)"],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="font-body text-[10px] sm:text-xs uppercase tracking-widest text-[#9E988F] hover:text-[#E5A93C] transition-colors cursor-pointer px-3.5 sm:px-5 py-2 rounded-full border bg-[#131316]/50 backdrop-blur-md shadow-lg shadow-black/40"
            >
              [ Close ✕ ]
            </motion.button>
          </div>

          {/* Main Wizard Area */}
          <div className="relative w-full max-w-2xl mx-auto my-auto py-6 sm:py-10">
            {isCompleted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-6 py-12"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#E5A93C]/10 text-[#E5A93C] border border-[#E5A93C] rounded-full flex items-center justify-center mx-auto text-2xl sm:text-3xl shadow-[0_0_30px_rgba(229,169,60,0.25)]">
                  ✓
                </div>
                <h2 className="font-heading text-3xl sm:text-5xl text-[#F5EFEB] italic font-light">
                  Table Secured.
                </h2>
                <p className="font-body text-[#9E988F] text-xs sm:text-base max-w-sm sm:max-w-md mx-auto leading-relaxed">
                  Thank you, <span className="text-[#F5EFEB] font-medium">{formData.name}</span>. Your reservation for <span className="text-[#E5A93C]">{formData.guests}</span> on <span className="text-[#F5EFEB]">{formData.date}</span> at <span className="text-[#F5EFEB]">{formData.time}</span> has been confirmed.
                </p>
              </motion.div>
            ) : (
              <div className="relative overflow-hidden min-h-[350px] sm:min-h-[400px]">
                <AnimatePresence initial={false} custom={direction} mode="wait">
                  
                  {/* STEP 1 */}
                  {step === 1 && (
                    <motion.div
                      key={1}
                      custom={direction}
                      variants={stepSlideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      className="space-y-6 sm:space-y-8"
                    >
                      <div className="space-y-1.5">
                        <span className="font-body text-[10px] sm:text-xs uppercase tracking-[0.3em] text-[#E5A93C]">
                          Phase One
                        </span>
                        <h2 className="font-heading text-2xl sm:text-4xl md:text-5xl text-[#F5EFEB] italic font-light">
                          Select Party Size & Schedule
                        </h2>
                      </div>

                      <div className="space-y-2.5 font-body">
                        <label className="text-[10px] sm:text-xs uppercase tracking-widest text-[#9E988F]">Party Size</label>
                        <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                          {guestOptions.map((opt) => (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => setFormData({ ...formData, guests: opt })}
                              className={`py-3 sm:py-4 rounded-xl border text-[11px] sm:text-xs uppercase tracking-widest transition-all cursor-pointer ${
                                formData.guests === opt
                                  ? "bg-[#E5A93C] text-[#0D0D0F] border-[#E5A93C] font-semibold shadow-lg shadow-[#E5A93C]/20"
                                  : "bg-[#131316] text-[#F5EFEB] border-[#F5EFEB]/10 hover:border-[#E5A93C]/50"
                              }`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 font-body">
                        <div className="space-y-2.5">
                          <label className="text-[10px] sm:text-xs uppercase tracking-widest text-[#9E988F]">Reservation Date</label>
                          <input
                            type="date"
                            required
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            className="w-full bg-[#131316] border border-[#F5EFEB]/15 rounded-xl px-4 sm:px-5 py-3.5 sm:py-4 text-xs sm:text-sm text-[#F5EFEB] focus:outline-none focus:border-[#E5A93C] transition-colors"
                          />
                        </div>

                        <div className="space-y-2.5">
                          <label className="text-[10px] sm:text-xs uppercase tracking-widest text-[#9E988F]">Time Slot</label>
                          <div className="grid grid-cols-2 gap-2">
                            {timeSlots.map((slot) => (
                              <button
                                key={slot}
                                type="button"
                                onClick={() => setFormData({ ...formData, time: slot })}
                                className={`py-3 sm:py-3.5 rounded-xl border text-[11px] sm:text-xs tracking-widest transition-all cursor-pointer ${
                                  formData.time === slot
                                    ? "bg-[#E5A93C] text-[#0D0D0F] border-[#E5A93C] font-semibold"
                                    : "bg-[#131316] text-[#F5EFEB] border-[#F5EFEB]/10 hover:border-[#E5A93C]/50"
                                }`}
                              >
                                {slot}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 2 */}
                  {step === 2 && (
                    <motion.div
                      key={2}
                      custom={direction}
                      variants={stepSlideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      className="space-y-6 sm:space-y-8 font-body"
                    >
                      <div className="space-y-1.5">
                        <span className="font-body text-[10px] sm:text-xs uppercase tracking-[0.3em] text-[#E5A93C]">
                          Phase Two
                        </span>
                        <h2 className="font-heading text-2xl sm:text-4xl md:text-5xl text-[#F5EFEB] italic font-light">
                          Guest Credentials
                        </h2>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] sm:text-xs uppercase tracking-widest text-[#9E988F]">Full Name</label>
                          <input
                            type="text"
                            required
                            placeholder="Umer Ali Chaudhary"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-[#131316] border border-[#F5EFEB]/15 rounded-xl px-4 sm:px-5 py-3.5 sm:py-4 text-xs sm:text-sm text-[#F5EFEB] focus:outline-none focus:border-[#E5A93C] transition-colors"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] sm:text-xs uppercase tracking-widest text-[#9E988F]">Phone Number</label>
                          <input
                            type="tel"
                            required
                            placeholder="+92 300 0000000"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full bg-[#131316] border border-[#F5EFEB]/15 rounded-xl px-4 sm:px-5 py-3.5 sm:py-4 text-xs sm:text-sm text-[#F5EFEB] focus:outline-none focus:border-[#E5A93C] transition-colors"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] sm:text-xs uppercase tracking-widest text-[#9E988F]">Dietary Specifications / Special Requests</label>
                        <textarea
                          rows={3}
                          placeholder="Allergies or special requests..."
                          value={formData.notes}
                          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                          className="w-full bg-[#131316] border border-[#F5EFEB]/15 rounded-xl px-4 sm:px-5 py-3.5 sm:py-4 text-xs sm:text-sm text-[#F5EFEB] focus:outline-none focus:border-[#E5A93C] transition-colors resize-none"
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 3 */}
                  {step === 3 && (
                    <motion.div
                      key={3}
                      custom={direction}
                      variants={stepSlideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      className="space-y-6 sm:space-y-8 font-body"
                    >
                      <div className="space-y-1.5">
                        <span className="font-body text-[10px] sm:text-xs uppercase tracking-[0.3em] text-[#E5A93C]">
                          Final Phase
                        </span>
                        <h2 className="font-heading text-2xl sm:text-4xl md:text-5xl text-[#F5EFEB] italic font-light">
                          Review Experience
                        </h2>
                      </div>

                      <div className="bg-[#131316] border border-[#E5A93C]/20 rounded-2xl p-4 sm:p-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4 border-b border-[#F5EFEB]/10 pb-4">
                          <div>
                            <span className="block text-[9px] sm:text-[10px] uppercase tracking-widest text-[#9E988F]">Guests</span>
                            <span className="text-sm sm:text-base font-heading text-[#F5EFEB]">{formData.guests}</span>
                          </div>
                          <div>
                            <span className="block text-[9px] sm:text-[10px] uppercase tracking-widest text-[#9E988F]">Date</span>
                            <span className="text-sm sm:text-base font-heading text-[#F5EFEB]">{formData.date || "Not Selected"}</span>
                          </div>
                          <div>
                            <span className="block text-[9px] sm:text-[10px] uppercase tracking-widest text-[#9E988F]">Time</span>
                            <span className="text-sm sm:text-base font-heading text-[#F5EFEB]">{formData.time}</span>
                          </div>
                          <div>
                            <span className="block text-[9px] sm:text-[10px] uppercase tracking-widest text-[#9E988F]">Guest</span>
                            <span className="text-sm sm:text-base font-heading text-[#F5EFEB]">{formData.name || "Guest"}</span>
                          </div>
                        </div>

                        {formData.notes && (
                          <div className="text-xs sm:text-sm text-[#9E988F]">
                            <span className="block text-[9px] sm:text-[10px] uppercase tracking-widest text-[#E5A93C] mb-1">Notes</span>
                            <p className="text-[#F5EFEB] italic">"{formData.notes}"</p>
                          </div>
                        )}
                      </div>

                      <form onSubmit={handleFinalSubmit}>
                        <button
                          type="submit"
                          className="w-full py-3.5 sm:py-4 rounded-xl bg-[#E5A93C] text-[#0D0D0F] font-body text-xs uppercase tracking-[0.25em] font-bold transition-all duration-300 hover:bg-[#f3b647] shadow-xl shadow-[#E5A93C]/20 cursor-pointer"
                        >
                          Confirm & Lock Reservation
                        </button>
                      </form>
                    </motion.div>
                  )}

                </AnimatePresence>
              </div>
            )}

            {!isCompleted && (
              <div className="flex items-center justify-between border-t border-[#F5EFEB]/10 pt-4 sm:pt-6 mt-6 sm:mt-8 font-body">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={() => paginate(-1)}
                    className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl border border-[#F5EFEB]/15 text-[#F5EFEB] text-[11px] sm:text-xs uppercase tracking-widest hover:border-[#E5A93C] transition-colors cursor-pointer"
                  >
                    Back
                  </button>
                ) : (
                  <div />
                )}

                {step < 3 ? (
                  <button
                    type="button"
                    onClick={() => paginate(1)}
                    className="px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl bg-[#E5A93C] text-[#0D0D0F] text-[11px] sm:text-xs uppercase tracking-[0.2em] font-bold hover:bg-[#f3b647] transition-all cursor-pointer shadow-lg shadow-[#E5A93C]/20 ml-auto"
                  >
                    Proceed to Next
                  </button>
                ) : null}
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4 border-t border-[#F5EFEB]/10 pt-4 sm:pt-6 text-[#9E988F] font-body text-[10px] sm:text-xs tracking-widest uppercase text-center sm:text-left">
            <p>Maison Dining Concierge Desk — Paris / Lahore</p>
            <p className="text-[#E5A93C]">Secure SSL Encrypted Protocol</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}