import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mic, MicOff, Volume2, X, Sparkles, Calendar, Gamepad2, Droplets, Pill, AlertTriangle } from 'lucide-react';

const VoiceAssistantModal = ({ isOpen, onClose }) => {
  const { speakText, language, t, reminders, recommendation } = useAuth();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [responseMsg, setResponseMsg] = useState('');
  const [voiceNotice, setVoiceNotice] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!isOpen) {
      setIsListening(false);
      setTranscript('');
      setResponseMsg('');
      setVoiceNotice('');
    } else {
      // Check if system has a TTS voice for selected language
      if ('speechSynthesis' in window) {
        const voices = window.speechSynthesis.getVoices();
        const langPrefix = (language || 'en').slice(0, 2);
        const hasVoice = voices.some(v => v.lang.toLowerCase().replace('_', '-').startsWith(langPrefix));
        if (!hasVoice && language !== 'en' && voices.length > 0) {
          setVoiceNotice(t('voiceUnavailableNotice') || `Voice speech output for selected language (${language.toUpperCase()}) is not installed on this device.`);
        }
      }
    }
  }, [isOpen, language, t]);

  if (!isOpen) return null;

  const quickCommands = [
    { label: t('voiceCmdToday') || 'What do I have today?', icon: Calendar, action: 'today' },
    { label: t('voiceCmdWater') || 'Remind me to drink water.', icon: Droplets, action: 'water' },
    { label: t('voiceCmdMedicine') || 'When is my medicine?', icon: Pill, action: 'medicine' },
    { label: t('voiceCmdGame') || 'Start my memory game.', icon: Gamepad2, action: 'game' },
    { label: t('voiceCmdNext') || 'What is my next activity?', icon: Sparkles, action: 'next' }
  ];

  const processCommandText = (cmdAction) => {
    let reply = '';
    const pendingCount = reminders.filter(r => r.status === 'pending').length;

    if (cmdAction === 'today') {
      reply = t('voiceReplyToday') || `You have ${pendingCount} pending activities today. Your next recommended exercise is 3D Memory Matrix.`;
    } else if (cmdAction === 'water') {
      reply = t('voiceReplyWater') || 'Hydration is essential for cognitive health. Please drink one glass of fresh water now.';
    } else if (cmdAction === 'medicine') {
      const med = reminders.find(r => r.category === 'medicine');
      reply = med ? `${t('medicationCheck')}: ${med.title} (${med.time})` : (t('voiceReplyMedicine') || 'Your afternoon blood pressure medicine is scheduled for 12:30 PM.');
    } else if (cmdAction === 'game') {
      reply = t('voiceReplyGame') || 'Starting your recommended cognitive memory exercise now.';
      setResponseMsg(reply);
      speakText(reply, language);
      setTimeout(() => {
        onClose();
        navigate('/assessment');
      }, 1500);
      return;
    } else if (cmdAction === 'next') {
      reply = t('voiceReplyNext') || `MemoMate recommends ${recommendation?.recommendedActivity || '3D Target Focus Search'} to strengthen your attention.`;
    } else {
      reply = `${t('voiceHeard') || 'I heard:'} "${cmdAction}". ${t('voiceReplyHelp') || 'MemoMate is here to assist with your daily schedule, medicine reminders, and cognitive exercises.'}`;
    }

    setResponseMsg(reply);
    speakText(reply, language);
  };

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert(t('speechNotSupported') || "Speech recognition is not natively supported in this browser. You can tap any of the quick action buttons below!");
      return;
    }

    try {
      const recognition = new SpeechRecognition();

      const langLocaleMap = {
        en: 'en-US',
        ta: 'ta-IN',
        hi: 'hi-IN',
        as: 'as-IN',
        te: 'te-IN',
        kn: 'kn-IN',
        ml: 'ml-IN',
        mr: 'mr-IN',
        bn: 'bn-IN',
        gu: 'gu-IN',
        pa: 'pa-IN',
        or: 'or-IN'
      };

      recognition.lang = langLocaleMap[language] || 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      setIsListening(true);
      setTranscript(t('voiceListening') || 'Listening... Speak now');

      recognition.onresult = (event) => {
        const text = event.results[0][0].transcript;
        setTranscript(`"${text}"`);
        setIsListening(false);
        processCommandText(text);
      };

      recognition.onerror = (event) => {
        console.warn("Speech recognition error:", event.error);
        setIsListening(false);
        setTranscript(t('voiceCouldNotHear') || "Could not hear clearly. Tap a quick command button below.");
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.warn("Speech recognition error", err);
      setIsListening(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(11, 14, 20, 0.85)',
      backdropFilter: 'blur(10px)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justify: 'center',
      padding: '1.5rem',
      animation: 'fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards'
    }}>
      <div style={{
        backgroundColor: '#161C26',
        border: '1px solid #38BDF8',
        borderRadius: '24px',
        maxWidth: 580,
        width: '100%',
        padding: '2rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        position: 'relative'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <div className="icon-box" style={{
              width: 44,
              height: 44,
              borderRadius: '12px',
              backgroundColor: 'rgba(56, 189, 248, 0.15)',
              border: '1px solid rgba(56, 189, 248, 0.35)'
            }}>
              <Mic size={24} color="#38BDF8" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.4rem', color: '#FFFFFF', fontWeight: 900, fontFamily: 'var(--font-heading)', margin: 0 }}>
                {t('talkToMemoMate') || 'Talk to MemoMate'}
              </h2>
              <p style={{ color: '#94A3B8', fontSize: '0.85rem', margin: 0 }}>
                {t('voiceSubtitle') || 'Voice-First Personal Cognitive Companion'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: '#222B3B',
              border: '1px solid #30363D',
              color: '#94A3B8',
              borderRadius: '10px',
              width: 36,
              height: 36,
              display: 'flex',
              alignItems: 'center',
              justify: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {voiceNotice && (
          <div style={{
            backgroundColor: 'rgba(251, 146, 60, 0.12)',
            border: '1px solid rgba(251, 146, 60, 0.4)',
            color: '#FB923C',
            padding: '0.75rem 1rem',
            borderRadius: '12px',
            fontSize: '0.85rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem'
          }}>
            <AlertTriangle size={18} color="#FB923C" style={{ flexShrink: 0 }} />
            <span>{voiceNotice}</span>
          </div>
        )}

        {/* Listening Circle / Mic Action */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justify: 'center',
          padding: '1.5rem 0',
          gap: '1rem'
        }}>
          <button
            onClick={startListening}
            style={{
              width: 90,
              height: 90,
              borderRadius: '50%',
              backgroundColor: isListening ? 'rgba(239, 68, 68, 0.2)' : 'rgba(56, 189, 248, 0.15)',
              border: isListening ? '2px solid #EF4444' : '2px solid #38BDF8',
              display: 'flex',
              alignItems: 'center',
              justify: 'center',
              cursor: 'pointer',
              boxShadow: isListening ? '0 0 30px rgba(239, 68, 68, 0.4)' : '0 0 30px rgba(56, 189, 248, 0.3)',
              transition: 'all 0.2s ease'
            }}
          >
            {isListening ? (
              <MicOff size={38} color="#EF4444" />
            ) : (
              <Mic size={38} color="#38BDF8" />
            )}
          </button>
          
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.3rem' }}>
              {isListening ? (t('voiceListening') || 'Listening... Speak now') : (t('voiceTapToSpeak') || 'Tap Microphone to Speak')}
            </div>
            <div style={{ fontSize: '0.85rem', color: '#38BDF8', minHeight: '24px' }}>
              {transcript}
            </div>
          </div>
        </div>

        {/* Response Box */}
        {responseMsg && (
          <div style={{
            backgroundColor: '#0D1117',
            border: '1px solid #263142',
            borderRadius: '14px',
            padding: '1rem 1.25rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.85rem'
          }}>
            <Volume2 size={22} color="#38BDF8" style={{ marginTop: 2, flexShrink: 0 }} />
            <div style={{ fontSize: '0.95rem', color: '#F8FAFC', lineHeight: 1.5, fontWeight: 600 }}>
              {responseMsg}
            </div>
          </div>
        )}

        {/* Quick Action Commands */}
        <div>
          <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>
            {t('voiceOrTapQuick') || 'Or Tap Quick Voice Command:'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {quickCommands.map((cmd, idx) => {
              const Icon = cmd.icon;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    setTranscript(`"${cmd.label}"`);
                    processCommandText(cmd.action);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.85rem',
                    padding: '0.75rem 1rem',
                    backgroundColor: '#0D1117',
                    border: '1px solid #263142',
                    borderRadius: '12px',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Icon size={18} color="#38BDF8" />
                  <span>{cmd.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceAssistantModal;
