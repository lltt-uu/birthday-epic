import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Calendar } from 'lucide-react';

/**
 * Epic birthday input screen — like a game login / star gate.
 */
export default function BirthdayInput({ onSubmit }) {
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const [focused, setFocused] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const y = parseInt(year) || 2000;
    const m = parseInt(month);
    const d = parseInt(day);
    if (!m || !d || m < 1 || m > 12 || d < 1 || d > 31) return;
    const date = new Date(y, m - 1, d);
    onSubmit(date);
  };

  const isValid = month && day && parseInt(month) >= 1 && parseInt(month) <= 12 && parseInt(day) >= 1 && parseInt(day) <= 31;

  return (
    <motion.div
      className="relative z-20 flex flex-col items-center justify-center min-h-screen px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.8 }}
    >
      {/* Central celestial motif */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none"
        animate={{ rotate: 360 }}
        transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
      >
        <div className="absolute inset-0 rounded-full border border-gold/5" />
        <div className="absolute inset-8 rounded-full border border-gold/8" />
        <div className="absolute inset-20 rounded-full border border-gold/10" />
      </motion.div>

      {/* Title */}
      <motion.div
        className="text-center mb-12"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 1 }}
      >
        <h2 className="text-xs tracking-[0.3em] text-gold/60 uppercase mb-4 font-mono">
          Historical Resonance Archive
        </h2>
        <h1 className="text-5xl md:text-7xl font-display gold-text mb-3 tracking-wide">
          历史人格档案
        </h1>
        <p className="text-white/30 text-sm md:text-base max-w-md mx-auto leading-relaxed">
          输入你的出生日期，探寻时间长河中与你的灵魂共享同一天降临的传奇人物
        </p>
      </motion.div>

      {/* Input Form */}
      <motion.form
        onSubmit={handleSubmit}
        className="glass p-8 md:p-10 w-full max-w-md"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        <div className="flex items-center gap-2 mb-6 text-white/40 text-xs font-mono tracking-wider">
          <Calendar size={14} />
          <span>ENTER_BIRTH_DATE</span>
          <span className="ml-auto animate-pulse text-gold/60">■</span>
        </div>

        <div className="flex gap-3">
          {/* Year */}
          <div className="flex-1">
            <label className="block text-[10px] text-white/30 font-mono mb-2 tracking-wider">
              YYYY
            </label>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value.slice(0, 4))}
              onFocus={() => setFocused('year')}
              onBlur={() => setFocused(null)}
              placeholder="2000"
              className="w-full bg-transparent border-b-2 border-white/10 focus:border-gold/60 outline-none text-white text-2xl py-2 text-center font-mono transition-colors placeholder:text-white/10"
            />
          </div>

          {/* Month */}
          <div className="flex-1">
            <label className="block text-[10px] text-white/30 font-mono mb-2 tracking-wider">
              MM
            </label>
            <input
              type="number"
              value={month}
              onChange={(e) => setMonth(e.target.value.slice(0, 2))}
              onFocus={() => setFocused('month')}
              onBlur={() => setFocused(null)}
              placeholder="01"
              className="w-full bg-transparent border-b-2 border-white/10 focus:border-gold/60 outline-none text-white text-2xl py-2 text-center font-mono transition-colors placeholder:text-white/10"
            />
          </div>

          {/* Day */}
          <div className="flex-1">
            <label className="block text-[10px] text-white/30 font-mono mb-2 tracking-wider">
              DD
            </label>
            <input
              type="number"
              value={day}
              onChange={(e) => setDay(e.target.value.slice(0, 2))}
              onFocus={() => setFocused('day')}
              onBlur={() => setFocused(null)}
              placeholder="01"
              className="w-full bg-transparent border-b-2 border-white/10 focus:border-gold/60 outline-none text-white text-2xl py-2 text-center font-mono transition-colors placeholder:text-white/10"
            />
          </div>
        </div>

        {/* Submit */}
        <motion.button
          type="submit"
          disabled={!isValid}
          className="mt-8 w-full py-3 bg-gradient-to-r from-gold/20 to-gold/10 border border-gold/30 text-gold hover:bg-gold/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all font-display text-lg tracking-wider flex items-center justify-center gap-3"
          whileHover={isValid ? { scale: 1.02 } : {}}
          whileTap={isValid ? { scale: 0.98 } : {}}
        >
          <Search size={18} />
          <span>扫描时间长河</span>
        </motion.button>

        <p className="text-center text-white/15 text-xs mt-4 font-mono">
          数据来源: Wikipedia · Wikidata
        </p>
      </motion.form>

      {/* Bottom quote */}
      <motion.p
        className="mt-10 text-white/10 text-xs italic text-center max-w-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        "在无限的时间线中，每一个日期都是一道门。"
      </motion.p>
    </motion.div>
  );
}
