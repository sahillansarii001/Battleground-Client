"use client";

import { useState, useRef, useEffect } from 'react';
import api from '@/lib/api';
import Link from 'next/link';
import { 
  UploadCloud, CheckCircle2, AlertOctagon, Target, 
  ChevronRight, ChevronLeft, Image as ImageIcon,
  User, Mail, Users, Gamepad2, Crosshair, ChevronDown, ArrowLeft
} from 'lucide-react';

const CustomSelect = ({ value, onChange, options, icon: Icon, placeholder, className="py-3 px-3 bg-[#080A0C] border-white/10 text-sm" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find(o => o.value === value);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div 
        className={`w-full text-white font-inter cursor-pointer flex items-center justify-between border hover:border-[#FF6A00] transition-colors ${className}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center min-w-0">
          {Icon && <Icon className="h-4 w-4 text-[#B8C0C2] mr-3 shrink-0" />}
          <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
        </div>
        <ChevronDown className={`w-4 h-4 text-[#B8C0C2] shrink-0 ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>
      
      {isOpen && (
        <div className="absolute top-full left-0 w-full mt-1 bg-[#080A0C] border border-white/10 shadow-xl z-50 max-h-32 overflow-y-auto custom-scrollbar">
          {options.map((opt) => (
            <div 
              key={opt.value}
              className={`px-4 py-3 text-sm cursor-pointer hover:bg-[#FF6A00]/20 hover:text-[#FF6A00] transition-colors ${value === opt.value ? 'bg-[#FF6A00]/10 text-[#FF6A00] border-l-2 border-[#FF6A00]' : 'text-white border-l-2 border-transparent'}`}
              onClick={() => {
                onChange({ target: { value: opt.value } });
                setIsOpen(false);
              }}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function Register() {
  const [formData, setFormData] = useState({
    teamName: '',
    teamType: 'SQUAD',
    email: '',
    logo: null,
    players: []
  });
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [preview, setPreview] = useState(null);

  // OTP Verification States
  const [otpSent, setOtpSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [verifying, setVerifying] = useState(false);

  const getPlayerCount = (type) => {
    switch(type) {
      case 'SOLO': return 1;
      case 'DUO': return 2;
      case 'TRIO': return 3;
      case 'SQUAD': return 4;
      default: return 4;
    }
  };

  const [players, setPlayers] = useState(
    Array.from({ length: 4 }, () => ({ playerName: '', inGameName: '', bgmiId: '', role: '' }))
  );

  const handleTypeChange = (e) => {
    const newType = e.target.value;
    const count = getPlayerCount(newType);
    setFormData({ ...formData, teamType: newType });
    
    const newPlayers = [...players];
    while(newPlayers.length < count) {
      newPlayers.push({ playerName: '', inGameName: '', bgmiId: '', role: '' });
    }
    setPlayers(newPlayers.slice(0, count));
  };

  const handlePlayerChange = (index, field, value) => {
    const updated = [...players];
    updated[index][field] = value;
    setPlayers(updated);
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, logo: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendOtp = async () => {
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("PLEASE ENTER A VALID EMAIL ADDRESS TO VERIFY");
      return;
    }
    setError('');
    setVerifying(true);
    try {
      const res = await api.post('/auth/send-registration-otp', { email: formData.email });
      if (res.success) {
        setOtpSent(true);
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError(err.message || 'Failed to send OTP');
    } finally {
      setVerifying(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otpInput) {
      setError("PLEASE ENTER THE OTP");
      return;
    }
    setError('');
    setVerifying(true);
    try {
      const res = await api.post('/auth/verify-otp', { email: formData.email, otp: otpInput });
      if (res.success) {
        setEmailVerified(true);
        setOtpSent(false); // Hide OTP input after success
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError(err.message || 'Invalid OTP');
    } finally {
      setVerifying(false);
    }
  };

  const validateStep1 = () => {
    if (!formData.teamName || !formData.email || !formData.logo) {
      setError("ALL SQUAD INTEL REQUIRED (INCLUDING INSIGNIA)");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("PLEASE ENTER A VALID EMAIL ADDRESS (E.G. @GMAIL.COM)");
      return false;
    }
    if (!emailVerified) {
      setError("PLEASE VERIFY YOUR EMAIL TO PROCEED");
      return false;
    }
    setError('');
    return true;
  };

  const validateStep2 = () => {
    for (let i = 0; i < players.length; i++) {
      if (!players[i].playerName || !players[i].inGameName || !players[i].bgmiId || !players[i].role) {
        setError(`OPERATOR 0${i + 1} DATA INCOMPLETE`);
        return false;
      }
      if (!/^\d{10}$/.test(players[i].bgmiId)) {
        setError(`OPERATOR 0${i + 1} BGMI ID MUST BE EXACTLY 10 DIGITS`);
        return false;
      }
    }
    setError('');
    return true;
  };

  const nextStep = () => {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep2()) return;
    
    setError('');
    setLoading(true);

    try {
      const data = new FormData();
      data.append('teamName', formData.teamName);
      data.append('teamType', formData.teamType);
      data.append('email', formData.email);
      if (formData.logo) {
        data.append('logo', formData.logo);
      }
      data.append('players', JSON.stringify(players));

      const res = await api.post('/team/register', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (res.success) {
        setSuccess(true);
      }
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="h-screen w-screen flex flex-col justify-center items-center px-4 relative bg-[#080A0C] overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] bg-[#39B54A]/5 rounded-full blur-[100px]"></div>
        
        <div className="bg-[#111518]/90 backdrop-blur-md border border-[#39B54A]/30 p-12 max-w-lg w-full text-center relative shadow-[0_0_50px_rgba(57,181,74,0.1)]">
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-[#39B54A]/10 border border-[#39B54A]/50 mb-6">
            <CheckCircle2 className="h-10 w-10 text-[#39B54A]" />
          </div>
          <h2 className="font-rajdhani text-4xl font-bold text-white mb-2 uppercase tracking-wide">Deployment <span className="text-[#39B54A]">Received</span></h2>
          <p className="font-inter text-[#B8C0C2] mb-4">
            Squad <strong className="text-white tracking-widest">{formData.teamName}</strong> is locked in. Please wait for high command approval.
          </p>
          <div className="bg-[#39B54A]/10 border border-[#39B54A]/30 p-4 mb-8 text-sm text-[#39B54A] font-inter">
            Your login credentials will be dispatched to <strong>{formData.email}</strong> once your squad is approved by an admin.
          </div>
          <Link href="/" className="inline-flex w-full justify-center bg-white hover:bg-[#39B54A] px-6 py-4 font-rajdhani font-bold text-black text-xl transition-colors uppercase tracking-widest transform skew-x-[-10deg]">
            <span className="transform skew-x-10">Return to Base</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen lg:h-screen w-full bg-[#080A0C] flex flex-col lg:flex-row overflow-x-hidden lg:overflow-hidden selection:bg-[#FF6A00]/30 selection:text-[#FF6A00]">
      
      {/* LEFT SPLIT - BRANDING (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/3 relative bg-[#111518] flex-col justify-between p-12 border-r border-white/5 shadow-2xl z-20">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
        <div className="absolute top-1/4 right-[-20vw] w-[40vw] h-[40vw] bg-[#FF6A00]/10 rounded-full blur-[120px] pointer-events-none"></div>
        
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-3">
            <img src="/BattlegroundLogo.png" alt="Battlegrounds" className="h-12 w-auto md:h-16 object-contain transform skew-x-[-10deg]" />
          </Link>
          
          <h1 className="font-rajdhani text-6xl font-bold text-white uppercase leading-[0.9] mt-20">
            Form<br/>Your<br/><span className="text-[#FF6A00]">Squad.</span>
          </h1>
          <p className="font-inter text-[#B8C0C2] mt-6 max-w-sm">
            Enter the ultimate BGMI competitive experience. Secure your slot and dominate the battleground.
          </p>
        </div>

        <div className="relative z-10 font-orbitron text-[10px] text-[#B8C0C2] uppercase tracking-widest">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-[#FF6A00] animate-pulse"></span>
            System Online // Secure Connection
          </div>
        </div>
      </div>

      {/* RIGHT SPLIT - FORM AREA */}
      <div className="w-full lg:w-2/3 min-h-screen lg:min-h-0 lg:h-full relative flex flex-col items-center justify-center py-12 px-4 sm:px-8 md:px-12 z-10">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>
        
        <Link href="/" className="absolute top-6 left-6 sm:top-8 sm:left-8 z-50 flex items-center gap-2 font-orbitron text-[10px] text-[#B8C0C2] hover:text-[#FF6A00] transition-colors uppercase tracking-widest">
          <ArrowLeft className="w-4 h-4" /> Abort Registry
        </Link>

        <div className="w-full max-w-3xl flex flex-col h-full justify-center mt-8 lg:mt-0">
          
          {/* Step Indicator (Compact) */}
          <div className="mb-8 relative shrink-0">
            <div className="absolute top-1/2 left-0 w-full h-px bg-white/10 -translate-y-1/2 z-0"></div>
            <div className="absolute top-1/2 left-0 h-px bg-[#FF6A00] -translate-y-1/2 z-0 transition-all duration-500" style={{ width: `${(step - 1) * 50}%` }}></div>
            
            <div className="relative z-10 flex justify-between">
              {[
                { num: 1, label: 'Squad Intel' },
                { num: 2, label: 'Operators' },
                { num: 3, label: 'Deploy' }
              ].map((s) => (
                <div key={s.num} className="flex flex-col items-center bg-[#080A0C] px-2">
                  <div className={`w-8 h-8 flex items-center justify-center font-rajdhani font-bold text-sm transform skew-x-[-10deg] transition-all duration-300 ${step >= s.num ? 'bg-[#FF6A00] text-black shadow-[0_0_15px_rgba(255,106,0,0.4)]' : 'bg-[#111518] text-[#B8C0C2] border border-white/20'}`}>
                    <span className="transform skew-x-10">{s.num}</span>
                  </div>
                  <span className={`mt-2 font-orbitron text-[9px] tracking-widest uppercase ${step >= s.num ? 'text-[#FF6A00]' : 'text-[#B8C0C2]'}`}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {error && (
            <div className="bg-red-950/40 border-l-4 border-red-500 text-red-400 p-3 mb-6 shrink-0 flex items-center gap-3">
              <AlertOctagon className="h-4 w-4 shrink-0" />
              <span className="font-orbitron text-[10px] font-bold uppercase tracking-widest">{error}</span>
            </div>
          )}

          {/* Form Container (No external scrolling needed due to compact design) */}
          <div className="w-full bg-[#111518]/90 backdrop-blur-md border border-white/10 p-6 md:p-8 hud-border relative shadow-2xl shrink-0">
            
            {/* Step 1: Team Intel */}
            {step === 1 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block font-orbitron text-[9px] text-[#B8C0C2] tracking-widest uppercase mb-1">Squad Designation</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Target className="h-4 w-4 text-[#B8C0C2]" />
                        </div>
                        <input type="text" value={formData.teamName} onChange={e => setFormData({...formData, teamName: e.target.value})} className="w-full pl-10 pr-3 py-3 bg-[#080A0C] border border-white/10 text-white font-inter text-sm focus:outline-none focus:border-[#FF6A00] focus:ring-1 focus:ring-[#FF6A00]" placeholder="e.g. TEAM SOUL" />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block font-orbitron text-[9px] text-[#B8C0C2] tracking-widest uppercase mb-1">Comms Email</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className="h-4 w-4 text-[#B8C0C2]" />
                        </div>
                        <input 
                          type="email" 
                          value={formData.email} 
                          onChange={e => {
                            setFormData({...formData, email: e.target.value});
                            setEmailVerified(false);
                            setOtpSent(false);
                          }} 
                          disabled={emailVerified}
                          className={`w-full pl-10 pr-3 py-3 bg-[#080A0C] border ${emailVerified ? 'border-[#39B54A] text-[#39B54A]' : 'border-white/10 text-white'} font-inter text-sm focus:outline-none focus:border-[#FF6A00] focus:ring-1 focus:ring-[#FF6A00] transition-colors`} 
                          placeholder="ADMIN@SQUAD.COM" 
                        />
                        {emailVerified && (
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <CheckCircle2 className="h-4 w-4 text-[#39B54A]" />
                          </div>
                        )}
                      </div>
                      
                      {!emailVerified && !otpSent && (
                        <button 
                          type="button" 
                          onClick={handleSendOtp}
                          disabled={verifying || !formData.email}
                          className="mt-2 w-full bg-[#111518] hover:bg-white/10 border border-white/10 text-[#FF6A00] font-orbitron text-[10px] uppercase tracking-widest py-2 transition-colors disabled:opacity-50"
                        >
                          {verifying ? 'SENDING...' : 'VERIFY EMAIL'}
                        </button>
                      )}

                      {!emailVerified && otpSent && (
                        <div className="mt-2">
                          <div className="flex gap-2">
                            <input 
                              type="text" 
                              value={otpInput} 
                              onChange={e => setOtpInput(e.target.value)} 
                              placeholder="ENTER OTP" 
                              className="w-full px-3 py-2 bg-[#080A0C] border border-white/10 text-white font-inter text-sm focus:outline-none focus:border-[#FF6A00]" 
                            />
                            <button 
                              type="button" 
                              onClick={handleVerifyOtp}
                              disabled={verifying || !otpInput}
                              className="bg-[#FF6A00] text-black hover:bg-white px-4 py-2 font-rajdhani font-bold text-sm uppercase tracking-widest transition-colors transform skew-x-[-10deg] disabled:opacity-50"
                            >
                              <span className="transform skew-x-10">{verifying ? '...' : 'CONFIRM'}</span>
                            </button>
                          </div>
                          <p className="mt-2 text-[10px] text-[#B8C0C2] font-inter">
                            Note: OTPs expire in 5 minutes. If the email doesn't appear in your inbox, please verify your spam or junk folder.
                          </p>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block font-orbitron text-[9px] text-[#B8C0C2] tracking-widest uppercase mb-1">Tactical Size</label>
                      <CustomSelect 
                        value={formData.teamType} 
                        onChange={handleTypeChange} 
                        icon={Users}
                        placeholder="SELECT SIZE"
                        options={[
                          { value: 'SOLO', label: 'Solo Operation (1)' },
                          { value: 'DUO', label: 'Duo Operation (2)' },
                          { value: 'TRIO', label: 'Trio Operation (3)' },
                          { value: 'SQUAD', label: 'Squad Operation (4)' }
                        ]}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col h-full">
                    <label className="block font-orbitron text-[9px] text-[#B8C0C2] tracking-widest uppercase mb-1">Squad Insignia</label>
                    <div className="flex-1 bg-[#080A0C] border-2 border-dashed border-white/10 hover:border-[#FF6A00]/50 relative flex flex-col items-center justify-center p-4 cursor-pointer min-h-40">
                      <input type="file" accept="image/*" onChange={handleLogoChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                      {preview ? (
                        <img src={preview} alt="Preview" className="h-24 w-24 object-cover border border-[#FF6A00]" />
                      ) : (
                        <div className="text-center">
                          <UploadCloud className="h-6 w-6 text-[#FF6A00] mx-auto mb-2 opacity-80" />
                          <span className="font-rajdhani text-sm font-bold text-white uppercase tracking-widest">Select Image</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Operators (Compact Grid Layout) */}
            {step === 2 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="space-y-4 lg:max-h-[50vh] lg:overflow-y-auto pr-2 custom-scrollbar">
                  {players.map((player, index) => (
                    <div key={index} className="bg-[#080A0C] border border-white/5 p-3 sm:p-4 relative group">
                      <div className="absolute top-0 left-0 w-1 h-full bg-[#FF6A00] opacity-50"></div>
                      
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-rajdhani text-sm font-bold text-white uppercase tracking-wider">
                          Operator 0{index + 1} {index === 0 && <span className="text-[#FF6A00] ml-2 font-orbitron text-[8px] border border-[#FF6A00]/20 px-1 py-0.5">IGL</span>}
                        </h4>
                      </div>
                      
                      {/* Responsive Grid for inputs to save vertical space */}
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
                        <input 
                          type="text" placeholder="LEGAL NAME" value={player.playerName} onChange={e => handlePlayerChange(index, 'playerName', e.target.value)} 
                          className="w-full bg-[#111518] border border-white/5 px-3 py-2 text-white font-inter text-xs placeholder-[#4A5568] focus:border-[#FF6A00] focus:outline-none" 
                        />
                        <input 
                          type="text" placeholder="IGN" value={player.inGameName} onChange={e => handlePlayerChange(index, 'inGameName', e.target.value)} 
                          className="w-full bg-[#111518] border border-white/5 px-3 py-2 text-white font-inter text-xs placeholder-[#4A5568] focus:border-[#FF6A00] focus:outline-none" 
                        />
                        <input 
                          type="text" placeholder="BGMI ID" value={player.bgmiId} 
                          onChange={e => {
                            const val = e.target.value.replace(/\D/g, ''); // Remove non-digits
                            if (val.length <= 10) {
                              handlePlayerChange(index, 'bgmiId', val);
                            }
                          }}
                          className="w-full bg-[#111518] border border-white/5 px-3 py-2 text-white font-inter text-xs placeholder-[#4A5568] focus:border-[#FF6A00] focus:outline-none" 
                        />
                        <CustomSelect 
                          value={player.role} 
                          onChange={e => handlePlayerChange(index, 'role', e.target.value)} 
                          placeholder="ROLE"
                          className="bg-[#111518] border-white/5 px-3 py-2 text-xs"
                          options={[
                            { value: 'IGL', label: 'IGL' },
                            { value: 'Assaulter', label: 'Assaulter' },
                            { value: 'Sniper', label: 'Sniper' },
                            { value: 'Support', label: 'Support' }
                          ]}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="flex flex-col md:flex-row gap-6 mb-4">
                  {/* Squad Intel Summary */}
                  <div className="flex-1 bg-[#080A0C] border border-white/5 p-4 flex items-center gap-4">
                    {preview ? (
                      <img src={preview} alt="Squad Insignia" className="w-16 h-16 object-cover border border-[#FF6A00]/30 shadow-[0_0_10px_rgba(255,106,0,0.2)]" />
                    ) : (
                      <div className="w-16 h-16 bg-[#111518] flex items-center justify-center border border-white/10">
                        <Users className="w-6 h-6 text-[#B8C0C2]" />
                      </div>
                    )}
                    <div>
                      <span className="font-orbitron text-[9px] text-[#B8C0C2] uppercase block mb-1">Squad Designation</span>
                      <h3 className="font-rajdhani text-2xl font-bold text-white uppercase">{formData.teamName}</h3>
                      <span className="font-inter text-xs text-[#FF6A00] uppercase block">{formData.teamType} OPERATION // {formData.email}</span>
                    </div>
                  </div>
                </div>

                {/* Operators Summary */}
                <div className="bg-[#080A0C] border border-white/5 p-4">
                  <h4 className="font-orbitron text-[9px] text-[#B8C0C2] uppercase mb-3 pb-2 border-b border-white/5 tracking-widest">Operators Locked: {players.length}</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:max-h-[30vh] lg:overflow-y-auto custom-scrollbar pr-2">
                    {players.map((p, i) => (
                      <div key={i} className="flex items-center justify-between bg-[#111518] p-2 border-l-2 border-[#FF6A00]">
                        <div>
                          <div className="font-rajdhani font-bold text-white uppercase text-sm">{p.inGameName} {i === 0 && <span className="text-[#FF6A00] ml-1 text-[10px]">[IGL]</span>}</div>
                          <div className="font-inter text-[10px] text-[#B8C0C2] uppercase mt-0.5">ID: {p.bgmiId}</div>
                        </div>
                        {p.role && (
                          <div className="font-orbitron text-[8px] text-[#FF6A00] border border-[#FF6A00]/20 px-1.5 py-0.5 bg-[#FF6A00]/5">
                            {p.role}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="mt-8 pt-4 border-t border-white/5 flex justify-between shrink-0">
              {step > 1 ? (
                <button type="button" onClick={prevStep} className="px-5 py-2 bg-[#080A0C] hover:bg-white/5 text-white font-rajdhani font-bold text-sm uppercase tracking-widest border border-white/10 flex items-center gap-1 transform skew-x-[-10deg]">
                  <span className="transform skew-x-10 flex items-center"><ChevronLeft className="w-4 h-4"/> Back</span>
                </button>
              ) : <div></div>}
              
              {step < 3 ? (
                <button type="button" onClick={nextStep} className="px-6 py-2 bg-[#FF6A00] hover:bg-white hover:text-black text-black font-rajdhani font-bold text-sm uppercase tracking-widest transform skew-x-[-10deg] shadow-[0_0_10px_rgba(255,106,0,0.3)] flex items-center gap-1 transition-colors">
                  <span className="transform skew-x-10 flex items-center">Next <ChevronRight className="w-4 h-4"/></span>
                </button>
              ) : (
                <button type="button" onClick={handleSubmit} disabled={loading} className="px-8 py-2 bg-[#FF6A00] hover:bg-white text-black font-rajdhani font-bold text-sm uppercase tracking-widest transform skew-x-[-10deg] shadow-[0_0_15px_rgba(255,106,0,0.4)] transition-colors disabled:opacity-50">
                  <span className="transform skew-x-10">{loading ? 'Deploying...' : 'Deploy'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
