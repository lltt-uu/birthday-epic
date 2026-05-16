import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Database, Globe, Search, Server, Users, Zap } from 'lucide-react';

const SCAN_MESSAGES = [
  '正在连接历史数据库...',
  '正在扫描时间轴...',
  '正在匹配历史人物档案...',
  '正在分析人格特征...',
  '正在生成命运共鸣图谱...',
  '数据整合中...',
];

const ICONS = [Database, Globe, Search, Server, Users, Zap];

export default function ScanningScreen({ birthday, progress }) {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((i) => Math.min(i + 1, SCAN_MESSAGES.length - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const Icon = ICONS[msgIndex % ICONS.length];

  const dateStr = birthday
    ? `${birthday.getFullYear()}年${birthday.getMonth() + 1}月${birthday.getDate()}日`
    : '...';

  return (
    <motion.div
      className="relative z-20 flex flex-col items-center justify-center min-h-screen px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Scanning ring */}
      <motion.div
        className="absolute w-80 h-80 rounded-full border border-gold/10"
        animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute w-64 h-64 rounded-full border border-neon-blue/10"
        animate={{ scale: [1.2, 1, 1.2], rotate: [360, 180, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
      />

      {/* Center icon */}
      <motion.div
        className="mb-8"
        animate={{ scale: [1, 1.1, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <Icon size={48} className="text-gold/60" />
      </motion.div>

      {/* Date display */}
      <motion.p
        className="text-white/40 text-sm font-mono mb-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        TARGET_DATE: {dateStr}
      </motion.p>

      {/* Status message */}
      <motion.p
        key={msgIndex}
        className="text-gold text-xl md:text-2xl font-display tracking-wider mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {SCAN_MESSAGES[msgIndex]}
      </motion.p>

      {/* Progress bar */}
      <div className="w-64 h-1 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-neon-blue via-gold to-neon-cyan rounded-full"
          animate={{ width: `${Math.min(progress, 100)}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
      <p className="text-white/20 text-xs font-mono mt-2">{Math.round(progress)}%</p>

      {/* Scan lines */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{ backgroundPosition: '0 0' }}
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(212,168,83,0.01) 3px, rgba(212,168,83,0.01) 4px)',
        }}
      />
    </motion.div>
  );
}
