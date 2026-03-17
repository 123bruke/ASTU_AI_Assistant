
import React, { useState, useEffect, useRef } from 'react';
import { 
  User, Home, History, Plus, Search, File, Video, Image as ImageIcon, 
  Clapperboard, Send, X, Sun, Moon, Loader2, Book, Utensils, Briefcase, 
  MapPin, Users, Library, Calendar, LogIn, UserPlus, ExternalLink, GraduationCap,
  ChevronDown
} from 'lucide-react';
import WaterBackground from './components/WaterBackground';
import ThreeDButton from './components/ThreeDButton';
import { GoogleGenAI } from "@google/genai";
import { Theme, ChatMessage, HistoryItem } from './types';

interface Department {
  name: string;
  code: string;
  description: string;
  location: string;
  image: string;
}

const DEPARTMENTS: Department[] = [
  { 
    name: 'Computer Science and Engineering', 
    code: 'CSE', 
    description: 'Leading the digital frontier in Ethiopia with high-end research in AI and Software Engineering.',
    location: 'Block 504, North Campus',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800'
  },
  { 
    name: 'Electrical and Computer Engineering', 
    code: 'ECE', 
    description: 'Focusing on power systems, telecommunications, and innovative electronic circuits.',
    location: 'Block 502, East Campus',
    image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800'
  },
  { 
    name: 'Mechanical Engineering', 
    code: 'ME', 
    description: 'The backbone of industrialization, focusing on thermodynamics, mechanics, and design.',
    location: 'Block 301, Engineering Complex',
    image: 'https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?w=800'
  },
  { 
    name: 'Civil Engineering', 
    code: 'CE', 
    description: 'Building the future infrastructure of the nation with sustainable materials.',
    location: 'Block 405, South Campus',
    image: 'https://images.unsplash.com/photo-1503387762-592dea58ef23?w=800'
  },
  { 
    name: 'Applied Science', 
    code: 'AS', 
    description: 'Pure research in Physics, Chemistry, and Math to solve real-world problems.',
    location: 'Science Block 102',
    image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800'
  }
];

interface ServiceSection {
  id: string;
  title: string;
  icon: React.ReactElement;
  image: string;
  description: string;
  action?: () => void;
}

const App: React.FC = () => {
  const [theme, setTheme] = useState<Theme>(Theme.LIGHT);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isTransparent, setIsTransparent] = useState(false);
  const [activeService, setActiveService] = useState<ServiceSection | null>(null);
  const [activeDept, setActiveDept] = useState<Department | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [accountMode, setAccountMode] = useState<'login' | 'signup'>('signup');
  const [userData, setUserData] = useState<{name: string, email: string, id: string} | null>(null);

  // Form states for account creation
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formID, setFormID] = useState('');

  const chatEndRef = useRef<HTMLDivElement>(null);
  const mainScrollRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    document.documentElement.className = theme;
    const savedHistory = localStorage.getItem('astu_history');
    if (savedHistory) setHistory(JSON.parse(savedHistory));
    const savedUser = localStorage.getItem('astu_user');
    if (savedUser) setUserData(JSON.parse(savedUser));
  }, [theme]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  // Enhanced cursor movement motion
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const height = window.innerHeight;
      const width = window.innerWidth;
      
      const xPercent = (clientX / width) - 0.5;
      const yPercent = (clientY / height) - 0.5;
      
      document.documentElement.style.setProperty('--mouse-x', `${clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${clientY}px`);
      document.documentElement.style.setProperty('--tilt-x', `${xPercent * 20}deg`);
      document.documentElement.style.setProperty('--tilt-y', `${-yPercent * 20}deg`);

      // Title color shifting
      const verticalPos = clientY / height;
      let color = '#3b82f6';
      if (verticalPos < 0.2) color = '#ffffff';
      else if (verticalPos > 0.8) color = '#1e3a8a';
      else if (verticalPos > 0.5) color = '#06b6d4';
      
      document.documentElement.style.setProperty('--title-color', color);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleAuth = () => {
    if (!formName || !formID) {
      alert("Please enter both Name and Student ID to create your account.");
      return;
    }
    const newUser = { name: formName, email: formEmail || 'student@astu.edu.et', id: formID };
    setUserData(newUser);
    localStorage.setItem('astu_user', JSON.stringify(newUser));
    setIsAccountOpen(false);
    
    // Celebration message
    handleSendMessage(`Hi ASTU AI, I'm ${formName} (${formID}). I just created my account!`);
  };

  const toggleTheme = () => setTheme(prev => prev === Theme.LIGHT ? Theme.DARK : Theme.LIGHT);

  const handleSendMessage = async (customPrompt?: string) => {
    const text = customPrompt || inputValue;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const isMapQuery = text.toLowerCase().includes('map') || text.toLowerCase().includes('where');
      
      const model = isMapQuery ? 'gemini-2.5-flash-lite-latest' : 'gemini-3-flash-preview';

      const response = await ai.models.generateContent({
        model,
        contents: text,
        config: {
          systemInstruction: "You are ASTU AI, the official assistant for Adama Science and Technology University students. Provide precise info about ASTU programs, buildings, and events. End every response with branding 'Powered by ASTU AI clubs'."
        }
      });

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.text || "Connection lost. Please try again.",
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, aiMsg]);
      
      const newHistory = [{
        id: Date.now().toString(),
        title: text.substring(0, 30) + '...',
        lastMessage: response.text?.substring(0, 50) || '',
        timestamp: Date.now()
      }, ...history].slice(0, 20);
      setHistory(newHistory);
      localStorage.setItem('astu_history', JSON.stringify(newHistory));

    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const SERVICES: ServiceSection[] = [
    { id: 'books', title: 'BOOKS DELIVERY', icon: <Book />, image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400', description: 'Borrow and return textbooks from the library without leaving your dorm.' },
    { id: 'food', title: 'FOOD DELIVERY', icon: <Utensils />, image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400', description: 'Fresh meals delivered from ASTU Student Cafe and Adama favorites.' },
    { id: 'map', title: 'MAP OF ASTU', icon: <MapPin />, image: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=400', description: 'Real-time navigation of the Adama Science and Technology campus.', action: () => handleSendMessage("Show me the map of ASTU.") },
    { id: 'program', title: 'STUDENT PROGRAM', icon: <Calendar />, image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400', description: 'Explore our world-class departments and academic programs.' },
    { id: 'library', title: 'DIGITAL LIBRARY', icon: <Library />, image: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=400', description: 'Access scientific journals and digital resources instantly.', action: () => window.open('http://library.astu.edu.et', '_blank') },
  ];

  const handleScrollDown = () => {
    if (mainScrollRef.current) {
      mainScrollRef.current.scrollTo({
        top: mainScrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className={`min-h-screen relative flex flex-col ${theme === Theme.DARK ? 'text-white' : 'text-slate-900'}`}>
      <WaterBackground theme={theme} />

      {/* Account Creation Modal */}
      {isAccountOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="glass-panel w-full max-w-md rounded-[2.5rem] p-10 relative overflow-hidden interactive-card shadow-2xl">
            <X className="absolute top-8 right-8 cursor-pointer hover:rotate-90 transition-transform" onClick={() => setIsAccountOpen(false)} />
            <div className="text-center mb-10">
              <div className="inline-block p-4 bg-blue-600/20 rounded-full mb-4">
                <UserPlus size={40} className="text-blue-500" />
              </div>
              <h2 className="text-3xl font-black italic">Join ASTU AI</h2>
              <p className="opacity-60 text-sm mt-2">Create your student profile today</p>
            </div>
            
            <div className="space-y-5">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest ml-4 opacity-50">Full Name</label>
                <input 
                  type="text" 
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  placeholder="Enter your name" 
                  className="w-full h-14 px-6 rounded-2xl bg-white/10 border border-white/10 outline-none focus:ring-2 ring-blue-500 transition-all font-semibold" 
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest ml-4 opacity-50">Student ID</label>
                <input 
                  type="text" 
                  value={formID}
                  onChange={e => setFormID(e.target.value)}
                  placeholder="ASTU/XXXX/XX" 
                  className="w-full h-14 px-6 rounded-2xl bg-white/10 border border-white/10 outline-none focus:ring-2 ring-blue-500 transition-all font-semibold" 
                />
              </div>
              <ThreeDButton className="w-full h-14 font-black text-lg mt-4" onClick={handleAuth}>
                CREATE ACCOUNT
              </ThreeDButton>
              <button className="w-full text-center text-xs font-bold opacity-40 hover:opacity-100 transition-opacity" onClick={() => setAccountMode('login')}>
                ALREADY HAVE AN ACCOUNT? LOGIN
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Department Detail Modal */}
      {activeDept && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/70 backdrop-blur-md animate-in zoom-in duration-300">
          <div className="glass-panel w-full max-w-4xl rounded-[3rem] overflow-hidden flex flex-col md:flex-row shadow-2xl">
            <div className="md:w-1/2 relative h-72 md:h-auto overflow-hidden">
              <img src={activeDept.image} className="w-full h-full object-cover scale-110 hover:scale-100 transition-transform duration-1000" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-10">
                <div>
                  <h3 className="text-4xl font-black italic text-white uppercase leading-tight">{activeDept.name}</h3>
                  <div className="flex items-center gap-2 mt-4 text-blue-400 font-bold">
                    <MapPin size={20} />
                    <span>{activeDept.location}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="md:w-1/2 p-12 flex flex-col justify-center gap-8 bg-slate-900 text-white relative">
              <X className="absolute top-8 right-8 cursor-pointer hover:bg-white/10 p-2 rounded-full transition-colors" onClick={() => setActiveDept(null)} />
              <div className="space-y-6">
                <div className="inline-block px-4 py-1 bg-blue-600 rounded-full font-black text-xs">DEPT CODE: {activeDept.code}</div>
                <p className="text-xl font-medium leading-relaxed opacity-90">{activeDept.description}</p>
                <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                  <h4 className="font-black text-xs uppercase tracking-widest text-blue-400 mb-3">Campus Status</h4>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Academic Activity</span>
                    <span className="text-green-400 font-bold flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
                      Ongoing
                    </span>
                  </div>
                </div>
              </div>
              <ThreeDButton className="w-full py-5 font-black text-lg" onClick={() => { handleSendMessage(`Tell me more about the requirements for ${activeDept.name} at ASTU.`); setActiveDept(null); setActiveService(null); }}>
                GET PROGRAM DETAILS
              </ThreeDButton>
            </div>
          </div>
        </div>
      )}

      {/* Header Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 p-6 flex justify-between items-center">
        <div className="flex gap-4">
          <ThreeDButton color={theme === Theme.LIGHT ? 'white' : 'dark'} className="w-12 h-12 rounded-full shadow-lg" onClick={() => window.location.reload()}>
            <Home size={22} />
          </ThreeDButton>
          <ThreeDButton color={theme === Theme.LIGHT ? 'white' : 'dark'} className="w-12 h-12 rounded-full shadow-lg" onClick={() => setIsHistoryOpen(!isHistoryOpen)}>
            <History size={22} />
          </ThreeDButton>
        </div>
        <div className="flex items-center gap-4">
          <ThreeDButton color={theme === Theme.LIGHT ? 'white' : 'dark'} className="w-12 h-12 rounded-full" onClick={toggleTheme}>
            {theme === Theme.LIGHT ? <Moon size={22} /> : <Sun size={22} />}
          </ThreeDButton>
          <ThreeDButton color={theme === Theme.LIGHT ? 'white' : 'dark'} className="px-6 flex gap-2 h-12 rounded-2xl" onClick={() => setIsAccountOpen(true)}>
            <User size={18} />
            <span className="font-bold hidden md:block">{userData ? userData.name.split(' ')[0] : 'Join ASTU'}</span>
          </ThreeDButton>
        </div>
      </header>

      {/* History Side Panel */}
      {isHistoryOpen && (
        <div className="fixed left-6 top-24 bottom-32 w-80 z-40 glass-panel rounded-3xl p-8 overflow-y-auto custom-scroll animate-in slide-in-from-left duration-300">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-black italic">Recent Streams</h2>
            <X className="cursor-pointer opacity-40 hover:opacity-100" onClick={() => setIsHistoryOpen(false)} />
          </div>
          <div className="space-y-4">
            {history.length === 0 ? (
              <p className="text-center opacity-40 py-20 italic">No chat history found.</p>
            ) : history.map(item => (
              <div key={item.id} className="p-5 rounded-2xl bg-white/5 hover:bg-white/10 cursor-pointer border border-white/5 transition-all group" onClick={() => handleSendMessage(item.title)}>
                <h3 className="font-bold text-sm truncate group-hover:text-blue-500 transition-colors">{item.title}</h3>
                <p className="text-[10px] opacity-40 mt-2 font-bold uppercase">{new Date(item.timestamp).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Content Area (Optimized for scrolling) */}
      <main 
        ref={mainScrollRef}
        className="flex-1 max-w-4xl mx-auto w-full pt-32 pb-80 px-6 overflow-y-auto custom-scroll z-10 scroll-smooth"
      >
        {messages.length === 0 ? (
          <div className="text-center py-20 space-y-12">
            <h1 
              ref={titleRef}
              onClick={() => setIsTransparent(!isTransparent)}
              className={`astu-title text-6xl md:text-9xl font-black italic tracking-tighter cursor-pointer ${isTransparent ? 'opacity-10 scale-95 blur-sm' : ''}`}
            >
              ASTUASSISTANT
            </h1>
            <p className="text-2xl font-bold opacity-70 max-w-lg mx-auto leading-tight italic">
              Fluid Artificial Intelligence for the Adama Campus Ecosystem
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto pt-10 px-4">
              {[
                { l: 'Exams', d: 'Academic Calendar', p: 'What are the upcoming exam dates?' },
                { l: 'Nav', d: 'Campus Buildings', p: 'Where is the student registrar office?' },
                { l: 'Grants', d: 'Available Support', p: 'Are there any scholarships for tech students?' },
                { l: 'Library', d: 'Study Resource', p: 'What are the library hours today?' }
              ].map((item, idx) => (
                <div 
                  key={idx} 
                  className="p-6 glass-panel rounded-3xl interactive-card hover:bg-blue-600/10 cursor-pointer text-left border border-white/10"
                  onClick={() => handleSendMessage(item.p)}
                >
                  <span className="text-[10px] font-black uppercase tracking-widest text-blue-500 block mb-2">{item.l}</span>
                  <p className="text-sm font-bold opacity-80">{item.d}</p>
                </div>
              ))}
            </div>
            
            <div className="pt-10 flex flex-col items-center animate-bounce opacity-30">
               <span className="text-[10px] font-black uppercase mb-2">Scroll Down to Explore</span>
               <ChevronDown size={24} />
            </div>
          </div>
        ) : (
          <div className="space-y-12">
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`
                  max-w-[90%] p-8 rounded-[2.5rem] glass-panel relative group
                  ${msg.role === 'user' ? 'bg-blue-600/10 rounded-tr-none' : 'bg-white/5 rounded-tl-none'}
                `}>
                  <div className="absolute -top-4 left-6 px-3 py-1 bg-slate-900 rounded-full text-[8px] font-black uppercase text-white opacity-80">
                    {msg.role === 'user' ? (userData?.name || 'Student') : 'ASTU AI'}
                  </div>
                  <div className="text-xl leading-relaxed whitespace-pre-wrap font-medium">
                    {msg.content}
                  </div>
                  {msg.role === 'assistant' && (
                    <div className="mt-8 pt-4 border-t border-white/5 flex justify-between items-center">
                       <span className="text-[9px] font-black uppercase opacity-30">Powered by ASTU AI clubs</span>
                       <div className="flex gap-2">
                          <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse"></div>
                          <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse delay-75"></div>
                          <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse delay-150"></div>
                       </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start animate-pulse">
                <div className="p-8 glass-panel rounded-[2.5rem] rounded-tl-none flex items-center gap-4">
                  <div className="loading-3d">
                    <div className="absolute inset-0 border-4 border-blue-500/30 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-t-blue-600 rounded-full animate-spin"></div>
                  </div>
                  <span className="text-lg font-black italic text-blue-500">Flowing thoughts...</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} className="h-4" />
          </div>
        )}
      </main>

      {/* Fixed Bottom UI */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex flex-col items-center bg-gradient-to-t from-blue-500/20 via-transparent to-transparent pb-8 pt-20 pointer-events-none">
        
        {/* Horizontal Service Bar */}
        <div className="w-full overflow-x-auto scrollbar-hide flex gap-6 px-12 mb-8 pointer-events-auto">
          <div className="flex gap-4 mx-auto pb-2">
            {SERVICES.map(s => (
              <ThreeDButton 
                key={s.id} 
                color={theme === Theme.LIGHT ? 'white' : 'dark'} 
                className="px-8 h-16 rounded-[1.5rem] whitespace-nowrap group hover:bg-blue-600 hover:text-white transition-all shadow-xl"
                onClick={() => {
                  if (s.id === 'program') {
                    setActiveService(s);
                  } else if (s.action) {
                    s.action();
                  } else {
                    setActiveService(s);
                  }
                }}
              >
                <div className="flex gap-4 items-center">
                  <span className="text-blue-500 group-hover:text-white transition-colors scale-125">
                    {React.cloneElement(s.icon as React.ReactElement<any>, { size: 20 })}
                  </span>
                  <span className="font-black text-sm italic uppercase tracking-tighter">{s.title}</span>
                </div>
              </ThreeDButton>
            ))}
          </div>
        </div>

        {/* Upload Modal (Action Panel) */}
        {isUploading && (
          <div className="glass-panel p-6 rounded-[2.5rem] mb-6 flex gap-8 animate-in slide-in-from-bottom-6 duration-300 pointer-events-auto shadow-2xl">
            {[
              { i: <File />, l: 'File', c: 'bg-orange-500' },
              { i: <Video />, l: 'Video', c: 'bg-red-500' },
              { i: <ImageIcon />, l: 'Image', c: 'bg-blue-500' },
              { i: <Clapperboard />, l: 'Gif', c: 'bg-purple-500' }
            ].map(o => (
              <div key={o.l} className="text-center group cursor-pointer" onClick={() => setIsUploading(false)}>
                <div className={`w-14 h-14 rounded-2xl ${o.c}/20 text-white flex items-center justify-center mb-2 group-hover:scale-110 transition-transform shadow-inner border border-white/10`}>
                  {React.cloneElement(o.i as React.ReactElement<any>, { size: 24, className: 'text-blue-500' })}
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest opacity-60">{o.l}</span>
              </div>
            ))}
          </div>
        )}

        {/* Floating Chat Input */}
        <div className="w-full max-w-4xl px-8 flex gap-6 pointer-events-auto">
          <ThreeDButton className="w-18 h-18 rounded-[2rem] shrink-0 shadow-2xl" onClick={() => setIsUploading(!isUploading)}>
            <Plus size={36} className={`transition-transform duration-500 ${isUploading ? 'rotate-45' : ''}`} />
          </ThreeDButton>
          
          <div className="flex-1 relative group">
            <input 
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
              placeholder="Query ASTU AI..."
              className="w-full h-18 px-10 rounded-[2rem] glass-panel text-xl font-medium outline-none focus:ring-4 ring-blue-500/20 transition-all border-none shadow-2xl placeholder:text-blue-400/30"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
               <ThreeDButton className="w-14 h-14 rounded-2xl" onClick={() => handleSendMessage()}>
                 <Send size={24} />
               </ThreeDButton>
            </div>
          </div>

          <ThreeDButton color="white" className="w-18 h-18 rounded-[2rem] shrink-0 shadow-2xl" onClick={handleScrollDown}>
             <ChevronDown size={32} className={messages.length > 0 ? 'animate-bounce' : ''} />
          </ThreeDButton>
        </div>
      </div>

      {/* Service Modal (for Departments) */}
      {activeService && activeService.id === 'program' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md animate-in zoom-in duration-300">
          <div className="glass-panel w-full max-w-2xl rounded-[3rem] p-12 relative shadow-2xl">
            <X className="absolute top-8 right-8 cursor-pointer opacity-40 hover:opacity-100" onClick={() => setActiveService(null)} />
            <div className="flex items-center gap-4 mb-10">
              <div className="p-4 bg-blue-600 rounded-3xl text-white">
                <GraduationCap size={32} />
              </div>
              <h2 className="text-3xl font-black italic">ASTU Departments</h2>
            </div>
            <div className="grid grid-cols-1 gap-4 max-h-[60vh] overflow-y-auto custom-scroll pr-4">
              {DEPARTMENTS.map(dept => (
                <div 
                  key={dept.code} 
                  className="group p-6 rounded-3xl bg-white/5 border border-white/5 hover:bg-blue-600/10 cursor-pointer transition-all flex justify-between items-center"
                  onClick={() => setActiveDept(dept)}
                >
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-lg border-2 border-white/5">
                      <img src={dept.image} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-black text-lg group-hover:text-blue-500 transition-colors italic">{dept.name}</h4>
                      <p className="text-xs font-bold opacity-40 uppercase tracking-widest">{dept.location}</p>
                    </div>
                  </div>
                  <ChevronDown className="-rotate-90 text-blue-500 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Visual Enhancements (Droplets) */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-[5%] w-80 h-80 bg-blue-500/5 rounded-full blur-[100px] droplet" style={{animationDelay:'-2s'}}></div>
        <div className="absolute top-3/4 right-[5%] w-96 h-96 bg-purple-500/5 rounded-full blur-[120px] droplet" style={{animationDelay:'-5s'}}></div>
      </div>
    </div>
  );
};

export default App;
