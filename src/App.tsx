import { useState, useEffect, useMemo, ReactNode } from 'react';
import { 
  MessageCircle, 
  Sun, 
  BookOpen, 
  Utensils, 
  ShoppingCart, 
  HandHelping, 
  Heart, 
  ShieldCheck, 
  Volume2, 
  Search, 
  ChevronRight, 
  X,
  BookA,
  Library,
  ArrowRight,
  Hash,
  Navigation,
  AlertTriangle,
  Plane,
  Hotel,
  Building,
  ShieldAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CATEGORIES, ALPHABET, DICTIONARY, type Category, type Phrase } from './data';

const iconMap: Record<string, any> = {
  MessageCircle,
  Sun,
  BookOpen,
  Utensils,
  ShoppingCart,
  HandHelping,
  Heart,
  ShieldCheck,
  Hash,
  Navigation,
  AlertTriangle,
  Plane,
  Hotel,
  Building,
  ShieldAlert
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'alphabet' | 'dictionary'>('home');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'fav' | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [dictSearchQuery, setDictSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('ru_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  // Auto-set the "Tech" category if user wants to see their specialty quickly
  const techCategory = useMemo(() => CATEGORIES.find(c => c.id === 'tech'), []);

  useEffect(() => {
    localStorage.setItem('ru_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (ru: string) => {
    setFavorites(prev => 
      prev.includes(ru) ? prev.filter(f => f !== ru) : [...prev, ru]
    );
  };

  const allPhrases = useMemo(() => {
    return CATEGORIES.flatMap(cat => cat.phrases.map(p => ({ ...p, categoryId: cat.id, categoryTitle: cat.title })));
  }, []);

  const favoritePhrases = useMemo(() => {
    return allPhrases.filter(p => favorites.includes(p.ru));
  }, [favorites, allPhrases]);

  useEffect(() => {
    // Hint browser to load voices
    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
    }
  }, []);

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ru-RU';
      
      // Try to find a high-quality Russian voice
      const voices = window.speechSynthesis.getVoices();
      const russianVoice = voices.find(v => v.lang.toLowerCase().includes('ru')) || 
                           voices.find(v => v.lang.toLowerCase().includes('ru_ru'));
      
      if (russianVoice) {
        utterance.voice = russianVoice;
      }
      
      utterance.rate = 0.85; // Slightly slower for clarity
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  const filteredPhrases = useMemo(() => {
    if (!searchQuery) return [];
    return allPhrases.filter(p => 
      p.ru.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.vi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.pron.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, allPhrases]);

  const filteredDictionary = useMemo(() => {
    if (!dictSearchQuery) return DICTIONARY;
    return DICTIONARY.filter(entry => 
      entry.ru.toLowerCase().includes(dictSearchQuery.toLowerCase()) || 
      entry.vi.toLowerCase().includes(dictSearchQuery.toLowerCase())
    );
  }, [dictSearchQuery]);

  return (
    <div className="flex flex-col h-screen bg-white font-sans text-gray-900 overflow-hidden">
      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-24 scroll-smooth">
        {/* Flag Top Border */}
        <div className="h-1 flex lg:h-2">
          <div className="flex-1 bg-white"></div>
          <div className="flex-1 bg-[#0039A6]"></div>
          <div className="flex-1 bg-[#D52B1E]"></div>
        </div>

        {/* Header - Not sticky anymore */}
        <header className="bg-white border-b border-gray-100 px-6 py-4 flex flex-col gap-4 z-10 transition-transform">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-8 relative rounded-md border border-gray-100 overflow-hidden shadow-sm flex flex-col">
                <div className="flex-1 bg-white"></div>
                <div className="flex-1 bg-[#0039A6]"></div>
                <div className="flex-1 bg-[#D52B1E]"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-base font-black text-white mix-blend-difference">RU</span>
                </div>
              </div>
              <h1 className="text-xl font-black tracking-tight flex items-center">
                <span className="text-gray-400">Tiếng</span>
                <span className="text-[#0039A6] mx-1">Nga</span>
                <span className="text-[#D52B1E]">Vỡ Lòng</span>
              </h1>
            </div>
            <button 
              onClick={() => setSelectedCategory("fav")}
              className={`p-2 rounded-full transition-colors ${selectedCategory === "fav" ? 'bg-red-50 text-red-500' : 'text-gray-400 hover:bg-gray-50'}`}
            >
              <Heart className={`w-6 h-6 ${selectedCategory === "fav" ? 'fill-current' : ''}`} />
            </button>
          </div>

        </header>

        <div className="px-4 pt-4">
          <AnimatePresence mode="wait">
            {activeTab === 'home' && (
              <motion.div 
                key="home"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="space-y-6"
              >
                {/* Search Bar on Home - Sticky */}
                {!selectedCategory && (
                  <div className="sticky top-0 z-20 -mx-4 px-4 py-3 bg-white mb-2 border-b border-gray-50 shadow-sm">
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input 
                        type="text"
                        placeholder="Tìm câu giao tiếp..."
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3.5 pl-11 pr-4 focus:ring-2 focus:ring-[#0039A6] focus:bg-white focus:outline-none shadow-sm transition-all text-sm font-medium"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      {searchQuery && (
                        <button 
                          onClick={() => setSearchQuery('')}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 p-1 hover:bg-gray-100 rounded-full"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                )}

              {/* Search Results Overlay Style */}
              {searchQuery && !selectedCategory ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  <div className="flex items-center justify-between px-2">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Kết quả ({filteredPhrases.length})</p>
                    <button onClick={() => setSearchQuery('')} className="text-xs font-bold text-[#D52B1E] uppercase">Xóa</button>
                  </div>
                  {filteredPhrases.length > 0 ? (
                    filteredPhrases.map((phrase, idx) => (
                      <PhraseCard 
                        key={idx} 
                        phrase={phrase} 
                        onSpeak={() => speak(phrase.ru)} 
                        isFavorite={favorites.includes(phrase.ru)}
                        onToggleFavorite={() => toggleFavorite(phrase.ru)}
                      />
                    ))
                  ) : (
                    <div className="text-center py-10 text-gray-400 italic">
                      Không tìm thấy câu nào phù hợp...
                    </div>
                  )}
                </motion.div>
              ) : selectedCategory === 'fav' ? (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between mb-4">
                    <button 
                      onClick={() => setSelectedCategory(null)}
                      className="flex items-center gap-1.5 text-xs font-black text-[#D52B1E] uppercase tracking-widest hover:opacity-80 transition-opacity"
                    >
                      <X size={14} strokeWidth={3} /> Quay lại
                    </button>
                    {favorites.length > 0 && (
                      <button 
                        onClick={() => {
                          if (confirm('Xóa tất cả mục yêu thích?')) setFavorites([]);
                        }}
                        className="text-[10px] font-black text-gray-400 uppercase tracking-widest"
                      >
                        Xóa tất cả
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-4 mb-8">
                    <div className="p-4 bg-red-500 rounded-2xl text-white shadow-md">
                      <Heart size={28} fill="currentColor" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-gray-900 tracking-tight">Mục yêu thích</h2>
                      <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">{favoritePhrases.length} câu đã lưu</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {favoritePhrases.length > 0 ? (
                      favoritePhrases.map((phrase, idx) => (
                        <PhraseCard 
                          key={idx} 
                          phrase={phrase} 
                          onSpeak={() => speak(phrase.ru)} 
                          isFavorite={true}
                          onToggleFavorite={() => toggleFavorite(phrase.ru)}
                        />
                      ))
                    ) : (
                      <div className="text-center py-20 text-gray-300 italic">
                        Chưa có câu nào được lưu...
                      </div>
                    )}
                  </div>
                </motion.div>
              ) : !selectedCategory ? (
                <>
                  <section>
                    <div className="flex items-center justify-between mb-4 px-2">
                       <h2 className="text-xs font-black uppercase tracking-widest text-[#0039A6]">Chủ đề giao tiếp</h2>
                    </div>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {CATEGORIES.map((cat, idx) => {
                        const Icon = iconMap[cat.icon];
                        return (
                          <motion.button
                            key={cat.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            onClick={() => setSelectedCategory(cat)}
                            className="bg-white p-5 rounded-2xl border border-gray-100 shadow-[0_4px_12px_rgba(0,0,0,0.03)] flex flex-col items-center justify-center gap-3 active:scale-95 transition-all text-left group"
                          >
                            <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-[#0039A6] group-hover:bg-[#0039A6] group-hover:text-white transition-colors">
                              <Icon size={24} />
                            </div>
                            <span className="text-sm font-bold text-gray-800 text-center leading-tight">{cat.title}</span>
                          </motion.button>
                        );
                      })}
                    </div>
                  </section>
                  
                  {techCategory && (
                     <section className="bg-gradient-to-br from-[#0039A6] to-[#002d84] rounded-3xl p-6 text-white overflow-hidden relative shadow-lg">
                        <div className="relative z-10">
                          <div className="bg-[#D52B1E] inline-block px-2 py-0.5 rounded text-[10px] font-black tracking-widest mb-3 uppercase shadow-md">Chuyên ngành</div>
                          <h3 className="text-xl font-black mb-1 leading-tight">An Ninh & CNTT</h3>
                          <p className="text-blue-100/80 text-xs mb-5 font-medium max-w-[200px]">Học thuật ngữ bảo mật, mạng và an toàn thông tin.</p>
                          <button 
                            onClick={() => setSelectedCategory(techCategory)}
                            className="bg-white text-[#0039A6] px-5 py-2.5 rounded-xl font-black text-xs flex items-center gap-2 hover:bg-gray-100 transition-colors uppercase tracking-wider"
                          >
                            Học ngay <ArrowRight size={14} />
                          </button>
                        </div>
                        <ShieldCheck className="absolute -right-6 -bottom-6 text-white opacity-10" size={160} />
                     </section>
                  )}
                </>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-4"
                >
                  <button 
                    onClick={() => setSelectedCategory(null)}
                    className="flex items-center gap-1.5 text-xs font-black text-[#D52B1E] uppercase tracking-widest mb-4 hover:opacity-80 transition-opacity"
                  >
                    <X size={14} strokeWidth={3} /> Quay lại
                  </button>
                  <div className="flex items-center gap-4 mb-8">
                    <div className="p-4 bg-[#0039A6] rounded-2xl text-white shadow-md">
                      {(() => {
                        const Icon = iconMap[selectedCategory.icon];
                        return <Icon size={28} />;
                      })()}
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-gray-900 tracking-tight">{selectedCategory.title}</h2>
                      <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">{selectedCategory.phrases.length} câu giao tiếp</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {selectedCategory.phrases.map((phrase, idx) => (
                      <PhraseCard 
                        key={idx} 
                        phrase={phrase} 
                        onSpeak={() => speak(phrase.ru)} 
                        isFavorite={favorites.includes(phrase.ru)}
                        onToggleFavorite={() => toggleFavorite(phrase.ru)}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {activeTab === 'dictionary' && (
            <motion.div 
              key="dictionary"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative"
            >
              <div className="px-2 mb-4">
                <h2 className="text-2xl font-black mb-1 text-gray-900">Từ điển Nga-Việt</h2>
                <p className="text-gray-400 text-sm font-medium">Tra cứu nhanh từ vựng thông dụng.</p>
              </div>

              {/* Fixed Search Bar within main scroll area */}
              <div className="sticky top-0 z-20 -mx-4 px-4 py-3 bg-white border-b border-gray-50 shadow-sm">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="text"
                    placeholder="Tìm từ vựng..."
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3.5 pl-11 pr-4 focus:ring-2 focus:ring-[#0039A6] focus:bg-white focus:outline-none transition-all text-sm font-medium"
                    value={dictSearchQuery}
                    onChange={(e) => setDictSearchQuery(e.target.value)}
                  />
                  {dictSearchQuery && (
                    <button 
                      onClick={() => setDictSearchQuery('')}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 p-1 hover:bg-gray-100 rounded-full"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2 mt-4">
                {filteredDictionary.length > 0 ? (
                  filteredDictionary.map((entry, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: Math.min(idx * 0.02, 0.5) }}
                      className="bg-white p-4 rounded-xl border border-gray-50 flex items-center justify-between hover:bg-gray-50 group transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-bold text-gray-900 text-lg">{entry.ru}</span>
                          <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-black uppercase">{entry.type}</span>
                        </div>
                        <span className="text-[10px] text-[#0039A6] font-bold italic block mb-0.5 opacity-70">/{entry.pron}/</span>
                        <span className="text-sm text-gray-600 font-bold">{entry.vi}</span>
                      </div>
                      <button 
                        onClick={() => speak(entry.ru)}
                        className="p-2 text-gray-300 hover:text-[#0039A6] group-hover:scale-110 transition-transform"
                      >
                        <Volume2 size={20} />
                      </button>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-20 text-gray-300 italic">
                    Không tìm thấy từ này...
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'alphabet' && (
            <motion.div 
              key="alphabet"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="px-2">
                <h2 className="text-2xl font-black mb-1 text-gray-900">Bảng chữ cái</h2>
                <p className="text-gray-400 text-sm font-medium">Làm quen với 33 âm tiết Kirin.</p>
              </div>

              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
                {ALPHABET.map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.02 }}
                    className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center text-center cursor-pointer active:bg-blue-50 hover:border-blue-100 transition-all group"
                    onClick={() => {
                      const letter = item.letter.split(' ')[0];
                      if (letter !== 'Ъ' && letter !== 'Ь') {
                        speak(letter);
                      }
                    }}
                  >
                    <span className="text-3xl font-black text-[#0039A6] mb-1 group-hover:scale-110 transition-transform">{item.letter}</span>
                    <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">/{item.name}/</span>
                    <span className="text-sm font-bold text-gray-800 mt-2">{item.pron}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
          </AnimatePresence>
        </div>
      </main>

      {/* Navigation Footer */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-100 px-6 py-3 flex items-center justify-around z-30 shadow-[0_-10px_30px_rgba(0,0,0,0.04)] pb-safe">
        <NavButton 
          active={activeTab === 'home'} 
          onClick={() => { setActiveTab('home'); setSelectedCategory(null); }} 
          label="Giao tiếp" 
          icon={<MessageCircle size={24} />} 
        />
        <NavButton 
          active={activeTab === 'dictionary'} 
          onClick={() => setActiveTab('dictionary')} 
          label="Từ điển" 
          icon={<Library size={24} />} 
        />
        <NavButton 
          active={activeTab === 'alphabet'} 
          onClick={() => setActiveTab('alphabet')} 
          label="Chữ cái" 
          icon={<BookA size={24} />} 
        />
      </nav>
    </div>
  );
}

function PhraseCard({ phrase, onSpeak, isFavorite, onToggleFavorite }: { phrase: any, onSpeak: () => void, isFavorite: boolean, onToggleFavorite: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-5 rounded-2xl border border-gray-50 shadow-[0_8px_20px_rgba(0,0,0,0.03)] flex items-center gap-4 hover:shadow-md transition-all active:scale-[0.98]"
    >
      <div className="flex-1">
        <h3 className="text-lg font-black text-gray-900 leading-tight mb-0.5 tracking-tight">{phrase.ru}</h3>
        <p className="text-[11px] text-[#0039A6] font-bold italic mb-2 tracking-wide uppercase opacity-70">/{phrase.pron}/</p>
        <p className="text-sm text-gray-600 font-bold leading-relaxed">{phrase.vi}</p>
      </div>
      <div className="flex flex-col gap-2">
        <button 
          onClick={onSpeak}
          className="w-10 h-10 rounded-xl bg-gray-50 text-[#0039A6] flex items-center justify-center hover:bg-[#0039A6] hover:text-white transition-all shadow-sm active:scale-90"
        >
          <Volume2 size={20} />
        </button>
        <button 
          onClick={onToggleFavorite}
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${isFavorite ? 'bg-red-50 text-red-500 border border-red-100' : 'bg-gray-50 text-gray-300 hover:text-red-400'}`}
        >
          <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
        </button>
      </div>
    </motion.div>
  );
}

function NavButton({ active, onClick, label, icon }: { active: boolean, onClick: () => void, label: string, icon: ReactNode }) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center gap-1.5 transition-all w-16 ${active ? 'text-[#0039A6]' : 'text-gray-300'}`}
    >
      <div className={`transition-all duration-300 ${active ? 'scale-110 -translate-y-1' : 'scale-100'}`}>
        {icon}
      </div>
      <span className={`text-[10px] font-black uppercase tracking-tighter ${active ? 'opacity-100' : 'opacity-40'}`}>{label}</span>
      {active && (
        <motion.div 
          layoutId="nav-pill"
          className="w-1.5 h-1.5 bg-[#D52B1E] rounded-full mt-1"
        />
      )}
    </button>
  );
}
