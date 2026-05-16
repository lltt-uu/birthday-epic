import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Share2, User, ExternalLink, Calendar, Users, Globe, Clock, Sparkles } from 'lucide-react';

export default function ResultView({ birthday, figures = [], personality = null, error = null, onReset }) {
  const [expanded, setExpanded] = useState(null);
  const [shared, setShared] = useState(false);

  const dateStr = birthday
    ? `${birthday.getFullYear()}年${birthday.getMonth() + 1}月${birthday.getDate()}日`
    : '';

  const handleShare = async () => {
    const name = personality?.mostLike?.name || '传奇人物';
    const text = `我与 ${name} 同一天生日 🎂 在时间的长河中，我们共享同一天降临这个世界。`;
    try {
      await navigator.clipboard.writeText(text);
    } catch {}
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

  const report = personality || {
    era: '时间的迷雾',
    keywords: ['神秘', '独特'],
    essence: '你的故事正在书写中。',
    prefix: '时间的长河静静流淌——',
    suffix: '也许，你就是那个将要被铭记的名字。',
    mostLike: null,
  };

  const safeFigures = Array.isArray(figures) ? figures : [];

  return (
    <motion.div
      className="relative z-20 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-16">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <button onClick={onReset} className="flex items-center gap-2 text-white/40 hover:text-amber-300 transition-colors text-sm">
            <ArrowLeft size={16} /> 重新搜索
          </button>
          <button onClick={handleShare} className="flex items-center gap-2 px-4 py-2 border border-amber-500/20 text-amber-300/80 hover:bg-amber-500/10 transition-all text-sm">
            <Share2 size={14} /> 分享档案
          </button>
        </div>

        {/* Error banner */}
        {error && (
          <div className="mb-8 p-4 bg-red-500/5 border border-red-500/20 text-red-300/70 text-sm text-center">
            ⚠ {error} — 已生成模拟报告
          </div>
        )}

        {/* Personality Report */}
        <motion.div
          className="mb-16 p-8 md:p-12 text-center relative overflow-hidden"
          style={{
            background: 'rgba(10,16,36,0.7)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(212,168,83,0.15)',
            borderRadius: 16,
          }}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.7 }}
        >
          <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />

          <p className="text-amber-500/40 text-xs tracking-[0.3em] mb-6">HISTORICAL RESONANCE REPORT</p>

          <p className="text-white/40 text-sm italic mb-4">{report.prefix}</p>

          <h2 className="text-3xl md:text-5xl mb-6 tracking-wider" style={{
            background: 'linear-gradient(135deg, #d4a853, #f0d878, #d4a853)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            {report.era}
          </h2>

          {report.mostLike && (
            <p className="text-white/50 text-lg mb-6">
              你与 <span className="text-amber-300 text-xl font-bold">{report.mostLike.name}</span> 共享了同一天的灵魂印记
            </p>
          )}

          <div className="flex flex-wrap justify-center gap-3 mb-6">
            {(report.keywords || []).map((kw) => (
              <span key={kw} className="px-4 py-2 text-sm border border-amber-500/20 text-amber-300/70">
                {kw}
              </span>
            ))}
          </div>

          <p className="text-white/40 text-sm italic max-w-lg mx-auto leading-relaxed">"{report.essence}"</p>
          <p className="text-white/30 text-xs mt-6 italic">{report.suffix}</p>
        </motion.div>

        {/* Date & count */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 text-white/30 text-sm">
            <Calendar size={14} />
            <span>{dateStr}</span>
            <span className="text-amber-500/30">|</span>
            <Users size={14} />
            <span>{safeFigures.length} 位历史共鸣者</span>
          </div>
        </div>

        {/* Timeline */}
        {safeFigures.length > 0 && (
          <div className="mb-20">
            <h3 className="text-xs tracking-[0.3em] text-amber-500/40 mb-10 text-center">HISTORICAL TIMELINE</h3>

            <div className="relative">
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-amber-500/30 via-blue-400/20 to-transparent" />

              <div className="space-y-8">
                {safeFigures.slice(0, 20).map((f, idx) => {
                  const isLeft = idx % 2 === 0;
                  const isOpen = expanded === idx;

                  return (
                    <motion.div
                      key={f.name + idx}
                      className={`relative flex items-center gap-6 ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}
                      initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: '-50px' }}
                      transition={{ delay: idx * 0.04, duration: 0.5 }}
                    >
                      {/* Dot */}
                      <div className="absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full border-2 border-amber-500/50 bg-[#020308] z-10" />

                      {/* Card */}
                      <div
                        className="w-[42%] p-4 cursor-pointer transition-all"
                        style={{
                          background: 'rgba(16,24,48,0.5)',
                          backdropFilter: 'blur(12px)',
                          border: `1px solid ${isOpen ? 'rgba(212,168,83,0.4)' : 'rgba(212,168,83,0.1)'}`,
                          borderRadius: 12,
                        }}
                        onClick={() => setExpanded(isOpen ? null : idx)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
                            {f.thumbnail ? (
                              <img src={f.thumbnail} alt="" className="w-8 h-8 rounded-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
                            ) : (
                              <User size={16} className="text-amber-500/40" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-white/90 font-bold truncate">{f.name}</h4>
                            <p className="text-amber-500/50 text-xs">{f.year}</p>
                            <p className="text-white/30 text-xs mt-1 line-clamp-2">
                              {typeof f.description === 'string' ? f.description.slice(0, 80) : ''}
                            </p>
                          </div>
                        </div>

                        <AnimatePresence>
                          {isOpen && (
                            <motion.div
                              className="mt-3 pt-3 border-t border-white/5 overflow-hidden"
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <p className="text-white/50 text-sm leading-relaxed mb-2">
                                {typeof f.description === 'string' ? f.description.slice(0, 300) : '暂无详细信息'}
                              </p>
                              {f.wikiUrl && (
                                <a
                                  href={f.wikiUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-blue-400/60 text-xs hover:text-blue-400 transition-colors"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <ExternalLink size={12} /> Wikipedia
                                </a>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Empty */}
        {safeFigures.length === 0 && (
          <div
            className="p-12 text-center"
            style={{ background: 'rgba(10,16,36,0.7)', backdropFilter: 'blur(20px)', border: '1px solid rgba(212,168,83,0.15)', borderRadius: 16 }}
          >
            <Sparkles size={48} className="text-amber-500/30 mx-auto mb-4" />
            <p className="text-white/50 text-lg mb-2">未找到同一天生日的历史人物</p>
            <p className="text-white/20 text-sm">但这也意味着——你注定要成为被历史记住的那一个。</p>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-20 pb-12">
          <div className="flex items-center justify-center gap-2 text-white/10 text-xs mb-2">
            <Globe size={12} /><span>DATA: WIKIPEDIA</span>
            <Clock size={12} className="ml-2" /><span>REALTIME</span>
          </div>
          <p className="text-white/5 text-xs">历史人格档案 v2.4 — 在时间的长河中，寻找你的共鸣</p>
        </div>
      </div>

      {/* Share toast */}
      <AnimatePresence>
        {shared && (
          <motion.div
            className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-amber-500/20 border border-amber-500/40 text-amber-300 px-6 py-3 text-sm z-50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            已复制分享文案到剪贴板
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
