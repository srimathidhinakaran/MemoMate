import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mic, MicOff, Volume2, X, Sparkles, Calendar, Gamepad2, Droplets, Pill } from 'lucide-react';

const VoiceAssistantModal = ({ isOpen, onClose }) => {
  const { speakText, language, t, reminders, recommendation, setVoiceModalOpen } = useAuth();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [responseMsg, setResponseMsg] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!isOpen) {
      setIsListening(false);
      setTranscript('');
      setResponseMsg('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const quickCommands = [
    { label: t('voiceCmdToday') || 'What do I have today?', icon: Calendar, action: 'today' },
    { label: t('voiceCmdWater') || 'Remind me to drink water.', icon: Droplets, action: 'water' },
    { label: t('voiceCmdMedicine') || 'When is my medicine?', icon: Pill, action: 'medicine' },
    { label: t('voiceCmdGame') || 'Start my memory game.', icon: Gamepad2, action: 'game' },
    { label: t('voiceCmdNext') || 'What is my next activity?', icon: Sparkles, action: 'next' }
  ];

  const processCommandText = (cmd) => {
    const text = cmd.toLowerCase();
    let reply = '';

    if (text.includes('today') || text.includes('schedule') || text.includes('have')) {
      const pendingCount = reminders.filter(r => r.status === 'pending').length;
      reply = `You have ${pendingCount} pending activities today. Your next activity is ${recommendation?.recommendedActivity || '3D Memory Exercise'}.`;
      setResponseMsg(reply);
      speakText(reply);
    } else if (text.includes('water') || text.includes('drink') || text.includes('hydration')) {
      reply = 'Hydration is essential for cognitive health. Please drink one glass of fresh water now.';
      setResponseMsg(reply);
      speakText(reply);
    } else if (text.includes('medicine') || text.includes('pill') || text.includes('medication')) {
      const med = reminders.find(r => r.category === 'medicine');
      if (med) {
        reply = `Your medication ${med.title} is scheduled for ${med.time}.`;
      } else {
        reply = 'Your afternoon blood pressure medicine is scheduled for 12:30 PM.';
      }
      setResponseMsg(reply);
      speakText(reply);
    } else if (text.includes('game') || text.includes('play') || text.includes('start')) {
      reply = 'Starting your recommended cognitive memory exercise now.';
      setResponseMsg(reply);
      speakText(reply);
      setTimeout(() => {
        onClose();
        navigate('/assessment');
      }, 1500);
    } else if (text.includes('next') || text.includes('recommend') || text.includes('activity')) {
      reply = `MemoMate recommends ${recommendation?.recommendedActivity || '3D Target Focus Search'}. Target area: ${recommendation?.weakArea || 'attention'}.`;
      setResponseMsg(reply);
      speakText(reply);
    } else {
      reply = `I heard: "${cmd}". MemoMate is here to assist with your daily schedule, medicine reminders, and cognitive exercises.`;
      setResponseMsg(reply);
      speakText(reply);
    }
  };

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not natively supported in this browser. You can tap any of the quick action buttons below!");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = language === 'hi' ? 'hi-IN' : (language === 'as' ? 'as-IN' : 'en-US');
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      setIsListening(true);
      setTranscript('Listening to your voice...');

      recognition.onresult = (event) => {
        const text = event.results[0][0].transcript;
        setTranscript(`"${text}"`);
        setIsListening(false);
        processCommandText(text);
      };

      recognition.onerror = (event) => {
        console.warn("Speech recognition error:", event.error);
        setIsListening(false);
        setTranscript("Could not hear clearly. Tap a quick command button below.");
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
      justifyContent: 'center',
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
                Voice-First Personal Cognitive Companion
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
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={20} />
          </button>
        </div>

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
              justifyContent: 'center',
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
              {isListening ? 'Listening... Speak now' : 'Tap Microphone to Speak'}
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
            Or Tap Quick Voice Command:
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
