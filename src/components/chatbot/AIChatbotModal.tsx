import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Phone,
  Video,
  X,
  Maximize2,
  Minimize2,
  Mic,
  MicOff,
  Send,
  Sparkles,
  Shield,
  FileText,
  Volume2,
  CheckCircle2,
  RefreshCw,
  Search,
  Filter,
  ExternalLink,
} from 'lucide-react';
import { AIChatMessage, GrievanceTicket } from '../../types';
import { api } from '../../services/api';
import { voiceAssistant } from '../../services/voiceAssistant';
import { AIOfficerVoiceCall } from './AIOfficerVoiceCall';
import { AIOfficerVideoCall } from './AIOfficerVideoCall';
import { AITicketCard } from './AITicketCard';
import { AIOfficerAvatar } from './AIOfficerAvatar';

interface AIChatbotModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'chat' | 'audio_call' | 'video_call' | 'tickets';
  initialTopic?: string;
}

export const AIChatbotModal: React.FC<AIChatbotModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'chat',
  initialTopic,
}) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'audio_call' | 'video_call' | 'tickets'>(initialMode);
  const [isMaximized, setIsMaximized] = useState(false);
  const [messages, setMessages] = useState<AIChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListeningMic, setIsListeningMic] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [tickets, setTickets] = useState<GrievanceTicket[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string | undefined>(initialTopic);
  const [language, setLanguage] = useState<'en' | 'hi'>('en');

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Safe Close Handler: stops any running synthesis and mic listeners
  const handleSafeClose = () => {
    voiceAssistant.stopSpeaking();
    voiceAssistant.stopListening();
    setIsListeningMic(false);
    setSpeakingMessageId(null);
    onClose();
  };

  // Keyboard accessibility: ESC key to close modal
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleSafeClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Sync mode when initialMode changes
  useEffect(() => {
    if (initialMode) {
      setActiveTab(initialMode);
    }
  }, [initialMode]);

  // Load initial welcome message & tickets
  useEffect(() => {
    loadTickets();

    const welcomeMsg: AIChatMessage = {
      id: 'msg_welcome',
      sender: 'bot',
      text: `### 🏛️ Ministry of Social Justice & Empowerment\n**Department of Social Justice and Empowerment (DoSJE)**\n\nNamaste! I am **Dr. Aditi Verma / Officer Rajeshwar Sharma**, Senior AI Grievance Resolution & Tele-Inspection Officer.\n\nI can solve your problems in real-time:\n* 💳 **Scholarship & Stipends:** Check PFMS DBT clearance & disburse holds\n* 📹 **CCTV Cameras:** Troubleshoot offline streams & issue compliance waivers\n* 🕒 **Biometric Attendance:** Resolve AEBAS fingerprint sync errors\n* 📞 **Audio & Video Calls:** Communicate directly with oral human voice\n\n*How may I resolve your issue today?*`,
      spokenText: 'Namaste! I am Dr. Aditi Verma from the Ministry of Social Justice and Empowerment. I am here to help solve any issue with your scholarship, CCTV surveillance, biometric attendance, or inspection. How can I help you today?',
      timestamp: new Date().toISOString(),
      quickReplies: [
        'PM-DAKSH Stipend Not Credited',
        'CCTV Offline - Request Waiver',
        'Biometric Sync Anomaly',
        'Schedule Surprise Inspection',
      ],
    };

    setMessages([welcomeMsg]);
  }, []);

  // Auto scroll to bottom
  useEffect(() => {
    if (activeTab === 'chat') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, activeTab]);

  const loadTickets = async () => {
    try {
      const list = await api.getGrievances();
      setTickets(list);
    } catch {
      // fallback
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || isProcessing) return;

    const userMsg: AIChatMessage = {
      id: `msg_user_${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsProcessing(true);

    try {
      const historyPayload = messages
        .filter((m) => m.id !== 'msg_welcome' && m.id !== 'msg_err')
        .slice(-8)
        .map((m) => ({
          role: (m.sender === 'user' ? 'user' : 'assistant') as 'user' | 'assistant',
          content: m.text,
        }));

      const res = await api.sendChatbotMessage({
        message: text.trim(),
        history: historyPayload,
        mode: 'chat',
        language,
      });

      const botMsg: AIChatMessage = {
        id: `msg_bot_${Date.now()}`,
        sender: 'bot',
        text: res.displayText,
        spokenText: res.speechText,
        timestamp: new Date().toISOString(),
        ticket: res.ticket,
        actionTaken: res.actionTaken,
        quickReplies: res.suggestedQuickReplies,
      };

      setMessages((prev) => [...prev, botMsg]);

      if (res.ticket) {
        voiceAssistant.playTone('ticket');
        loadTickets();
      }
    } catch {
      const errorMsg: AIChatMessage = {
        id: `msg_err_${Date.now()}`,
        sender: 'bot',
        text: 'I apologize, there was a momentary disturbance contacting the central grievance gateway. Please try again or switch to an oral audio call.',
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSpeakMessage = (msg: AIChatMessage) => {
    if (speakingMessageId === msg.id) {
      voiceAssistant.stopSpeaking();
      setSpeakingMessageId(null);
      return;
    }

    const text = msg.spokenText || msg.text;
    setSpeakingMessageId(msg.id);

    voiceAssistant.speak(text, {
      onEnd: () => setSpeakingMessageId(null),
      onError: () => setSpeakingMessageId(null),
    });
  };

  const handleToggleMic = () => {
    if (isListeningMic) {
      voiceAssistant.stopListening();
      setIsListeningMic(false);
      return;
    }

    setIsListeningMic(true);
    voiceAssistant.startListening({
      onResult: (transcript, isFinal) => {
        setInputMessage(transcript);
        if (isFinal) {
          setIsListeningMic(false);
          handleSendMessage(transcript);
        }
      },
      onError: () => setIsListeningMic(false),
      onEnd: () => setIsListeningMic(false),
    });
  };

  const handleNewTicketFromCall = (newTicket: GrievanceTicket) => {
    loadTickets();
    const systemNotice: AIChatMessage = {
      id: `msg_ticket_${Date.now()}`,
      sender: 'system',
      text: `Official Docket Generated during Call: **${newTicket.ticketNumber}** (${newTicket.subject})`,
      timestamp: new Date().toISOString(),
      ticket: newTicket,
    };
    setMessages((prev) => [...prev, systemNotice]);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 pointer-events-none flex flex-col justify-end items-center sm:items-end p-0 sm:p-4 md:p-6"
      id="satya-nirakshak-chatbot-overlay"
    >
      {/* Backdrop: translucent dark on mobile for focus, subtle on desktop */}
      <div
        className="fixed inset-0 bg-slate-950/60 sm:bg-slate-950/30 backdrop-blur-xs pointer-events-auto transition-opacity duration-200 animate-fade-in"
        onClick={handleSafeClose}
        aria-label="Close Chatbot Overlay"
        title="Click background to close"
      />

      {/* Responsive Chatbot Window Container */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`pointer-events-auto relative z-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 animate-fade-in ${
          isMaximized
            ? 'fixed inset-2 sm:inset-4 md:inset-6 lg:inset-8 w-auto h-auto max-w-6xl max-h-none rounded-2xl mx-auto'
            : 'w-[calc(100vw-24px)] sm:w-[min(410px,calc(100vw-32px))] md:w-[min(440px,calc(100vw-48px))] max-w-[450px] h-[min(650px,calc(100dvh-24px-env(safe-area-inset-bottom,0px)-env(safe-area-inset-top,0px)))] sm:h-[min(670px,calc(100dvh-32px))] md:h-[min(700px,calc(100dvh-48px))] mb-[max(0.75rem,env(safe-area-inset-bottom,0px))] sm:mb-0'
        }`}
        id="satya-nirakshak-ai-chatbot-window"
      >
        {/* Top Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-3 py-2 sm:px-4 sm:py-2.5 border-b border-slate-700/80 flex items-center justify-between text-white flex-shrink-0 min-w-0">
          <div className="flex items-center space-x-2 sm:space-x-2.5 min-w-0 flex-1 mr-2">
            <div className="p-1.5 sm:p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 shrink-0">
              <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center space-x-1.5 min-w-0">
                <h3 className="text-xs sm:text-sm font-bold text-white tracking-wide truncate">
                  DoSJE AI Resolution Desk
                </h3>
                <span className="hidden xs:inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1 animate-pulse" />
                  <span className="hidden sm:inline">Live Officer</span>
                  <span className="sm:hidden">Live</span>
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-400 truncate">
                Ministry of Social Justice & Empowerment
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1 sm:space-x-1.5 shrink-0">
            {/* Language Switch */}
            <button
              onClick={() => setLanguage((l) => (l === 'en' ? 'hi' : 'en'))}
              className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] sm:text-xs font-semibold text-slate-300 border border-slate-700 transition-colors shrink-0"
              title="Toggle Language"
            >
              {language === 'en' ? 'हिन्दी' : 'EN'}
            </button>

            {/* Maximize / Restore */}
            <button
              onClick={() => setIsMaximized(!isMaximized)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shrink-0"
              title={isMaximized ? 'Restore' : 'Maximize'}
              aria-label={isMaximized ? 'Restore Window' : 'Maximize Window'}
            >
              {isMaximized ? <Minimize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Maximize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
            </button>

            {/* Close Button with Clear Indicator */}
            <button
              onClick={handleSafeClose}
              className="group flex items-center space-x-1 px-2 py-1 rounded-lg bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/40 hover:border-rose-500 transition-all shrink-0 cursor-pointer"
              title="Close Chatbot (बंद करें / Esc)"
              aria-label="Close Chatbot"
              id="chatbot-header-close-btn"
            >
              <X className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:rotate-90" />
              <span className="text-[11px] font-medium hidden sm:inline">Close</span>
            </button>
          </div>
        </div>

        {/* Sub-Navigation Bar (Responsive across all screens) */}
        <div className="grid grid-cols-4 gap-1 p-1 bg-slate-800/95 border-b border-slate-700/80 text-[11px] sm:text-xs text-slate-300 flex-shrink-0">
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-1 sm:px-2 py-1.5 rounded-lg font-semibold transition-all flex items-center justify-center space-x-1 truncate ${
              activeTab === 'chat'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'hover:bg-slate-700/50 text-slate-300 hover:text-white'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Chat</span>
          </button>
          <button
            onClick={() => setActiveTab('audio_call')}
            className={`px-1 sm:px-2 py-1.5 rounded-lg font-semibold transition-all flex items-center justify-center space-x-1 truncate ${
              activeTab === 'audio_call'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'hover:bg-slate-700/50 text-slate-300 hover:text-white'
            }`}
          >
            <Phone className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Voice</span>
          </button>
          <button
            onClick={() => setActiveTab('video_call')}
            className={`px-1 sm:px-2 py-1.5 rounded-lg font-semibold transition-all flex items-center justify-center space-x-1 truncate ${
              activeTab === 'video_call'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'hover:bg-slate-700/50 text-slate-300 hover:text-white'
            }`}
          >
            <Video className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Video</span>
          </button>
          <button
            onClick={() => setActiveTab('tickets')}
            className={`px-1 sm:px-2 py-1.5 rounded-lg font-semibold transition-all flex items-center justify-center space-x-1 truncate ${
              activeTab === 'tickets'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'hover:bg-slate-700/50 text-slate-300 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Tickets{tickets.length > 0 ? ` (${tickets.length})` : ''}</span>
          </button>
        </div>

        {/* Modal Main Content Body */}
        <div className="flex-1 overflow-hidden relative flex flex-col min-h-0">
          {/* TAB 1: SMART CHAT DESK */}
          {activeTab === 'chat' && (
            <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950 min-h-0">
              {/* Call Escalation Action Bar */}
              <div className="bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-3 py-1.5 sm:px-4 sm:py-2 flex items-center justify-between gap-2 text-xs flex-shrink-0">
                <div className="flex items-center space-x-1.5 sm:space-x-2 min-w-0">
                  <AIOfficerAvatar size="sm" />
                  <div className="min-w-0">
                    <span className="font-semibold text-slate-800 dark:text-slate-200 block truncate text-xs">
                      Dr. Aditi Verma, IAS
                    </span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center space-x-1 truncate">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse shrink-0" />
                      <span className="truncate">Ready for instant oral resolution</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-1 sm:space-x-1.5 shrink-0">
                  <button
                    onClick={() => setActiveTab('audio_call')}
                    className="inline-flex items-center space-x-1 px-2 sm:px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-[11px] sm:text-xs shadow-sm transition-colors shrink-0"
                    title="Call Officer (Oral Speech)"
                  >
                    <Phone className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                    <span>Voice</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('video_call')}
                    className="inline-flex items-center space-x-1 px-2 sm:px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold text-[11px] sm:text-xs shadow-sm transition-colors shrink-0"
                    title="Live Video Face-to-Face Call"
                  >
                    <Video className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                    <span>Video</span>
                  </button>
                </div>
              </div>

              {/* Chat Message Stream */}
              <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-3.5 overscroll-contain min-h-0">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.sender === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[86%] sm:max-w-[80%] rounded-2xl p-3 sm:p-3.5 shadow-sm space-y-2 break-words [overflow-wrap:anywhere] min-w-0 ${
                        msg.sender === 'user'
                          ? 'bg-blue-600 text-white rounded-br-none'
                          : msg.sender === 'system'
                          ? 'bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-slate-800 dark:text-slate-200 w-full'
                          : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-none'
                      }`}
                    >
                      {/* Sender Header */}
                      <div className="flex items-center justify-between text-[10px] sm:text-[11px] opacity-75 mb-1 gap-1">
                        <span className="font-semibold truncate">
                          {msg.sender === 'user'
                            ? 'You'
                            : msg.sender === 'system'
                            ? '⚡ System Event'
                            : '🏛️ Officer Verma (DoSJE)'}
                        </span>
                        <span className="shrink-0">
                          {new Date(msg.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>

                      {/* Text / Markdown display */}
                      <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-line break-words [overflow-wrap:anywhere] overflow-x-hidden">
                        {msg.text}
                      </div>

                      {/* Attached Grievance Resolution Card */}
                      {msg.ticket && (
                        <div className="mt-2.5 max-w-full overflow-hidden">
                          <AITicketCard ticket={msg.ticket} compact />
                        </div>
                      )}

                      {/* Listen Aloud Button for Bot message */}
                      {msg.sender === 'bot' && (
                        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between flex-wrap gap-1.5">
                          <button
                            onClick={() => handleSpeakMessage(msg)}
                            className={`inline-flex items-center space-x-1 text-[11px] sm:text-xs font-semibold py-1 px-2 rounded-lg transition-colors shrink-0 ${
                              speakingMessageId === msg.id
                                ? 'bg-emerald-500 text-white animate-pulse'
                                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                            }`}
                          >
                            <Volume2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                            <span>
                              {speakingMessageId === msg.id
                                ? 'Speaking...'
                                : 'Listen 🔊'}
                            </span>
                          </button>

                          {msg.actionTaken && (
                            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium truncate max-w-[180px]">
                              ✓ {msg.actionTaken}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Quick reply chips */}
                      {msg.quickReplies && msg.quickReplies.length > 0 && (
                        <div className="pt-1.5 flex flex-wrap gap-1">
                          {msg.quickReplies.map((q, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleSendMessage(q)}
                              className="text-[10px] sm:text-[11px] px-2 sm:px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-slate-200 dark:border-slate-700 transition-colors text-left break-words max-w-full"
                            >
                              {q}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {isProcessing && (
                  <div className="flex justify-start">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl rounded-bl-none p-2.5 sm:p-3 shadow-sm flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" />
                      <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:0.2s]" />
                      <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:0.4s]" />
                      <span className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 ml-1">
                        Officer researching central PFMS & records...
                      </span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input Box */}
              <div className="p-2 sm:p-2.5 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex-shrink-0 pb-[max(0.5rem,env(safe-area-inset-bottom,0px))]">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex items-center space-x-1.5 sm:space-x-2"
                >
                  {/* Mic Voice to Text button */}
                  <button
                    type="button"
                    onClick={handleToggleMic}
                    className={`p-2 sm:p-2.5 rounded-xl transition-all shrink-0 ${
                      isListeningMic
                        ? 'bg-rose-500 text-white animate-pulse'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                    title={isListeningMic ? 'Stop Listening' : 'Speak your query'}
                    aria-label={isListeningMic ? 'Stop Listening' : 'Speak your query'}
                  >
                    {isListeningMic ? <MicOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Mic className="w-4 h-4 sm:w-5 sm:h-5" />}
                  </button>

                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Type or speak (e.g. stipend delay, CCTV)..."
                    className="flex-1 min-w-0 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 sm:px-3.5 py-2 sm:py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  <button
                    type="submit"
                    disabled={!inputMessage.trim() || isProcessing}
                    className="p-2 sm:p-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-300 dark:disabled:bg-slate-800 text-white rounded-xl transition-colors shadow-sm shrink-0"
                    title="Send message"
                    aria-label="Send message"
                  >
                    <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* TAB 2: AUDIO ORAL TELE-CALL */}
          {activeTab === 'audio_call' && (
            <AIOfficerVoiceCall
              initialTopic={selectedTopic}
              onSwitchToVideo={() => setActiveTab('video_call')}
              onEndCall={() => setActiveTab('chat')}
              onClose={handleSafeClose}
              onTicketCreated={handleNewTicketFromCall}
            />
          )}

          {/* TAB 3: TWO-WAY VIDEO CALL */}
          {activeTab === 'video_call' && (
            <AIOfficerVideoCall
              initialTopic={selectedTopic}
              onSwitchToAudio={() => setActiveTab('audio_call')}
              onEndCall={() => setActiveTab('chat')}
              onClose={handleSafeClose}
              onTicketCreated={handleNewTicketFromCall}
            />
          )}

          {/* TAB 4: RESOLVED TICKETS TRACKER */}
          {activeTab === 'tickets' && (
            <div className="h-full flex flex-col bg-slate-50 dark:bg-slate-950 p-3 sm:p-4 overflow-y-auto min-h-0 overscroll-contain">
              <div className="flex items-center justify-between mb-3 sm:mb-4 flex-wrap gap-2 flex-shrink-0">
                <div className="min-w-0">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">
                    Grievance Resolution Dockets
                  </h3>
                  <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 truncate">
                    Logged & resolved via AI Oral & Video channels
                  </p>
                </div>

                <button
                  onClick={loadTickets}
                  className="inline-flex items-center space-x-1 text-xs px-2.5 sm:px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors shrink-0"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Refresh</span>
                </button>
              </div>

              {tickets.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-4 sm:p-8">
                  <FileText className="w-10 h-10 sm:w-12 sm:h-12 text-slate-400 mb-2" />
                  <h4 className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                    No Grievance Dockets Logged Yet
                  </h4>
                  <p className="text-[11px] sm:text-xs text-slate-500 mt-1 max-w-sm">
                    Start an audio or video call with Officer Verma to automatically resolve any project issue and generate an official docket.
                  </p>
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {tickets.map((t) => (
                    <AITicketCard key={t.id} ticket={t} onResolved={loadTickets} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
