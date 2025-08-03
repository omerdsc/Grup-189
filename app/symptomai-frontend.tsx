import React, { useState } from 'react';
import { Star, MapPin, Phone, Mail, Clock, Activity, Heart, Plus } from 'react-feather';
import { aiService } from './services/ai-service';

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  rating: number;
  experience: string;
  location: string;
  phone: string;
  email: string;
  availableTimes: string[];
  diseases: string[];
}

interface Diagnosis {
  id: number;
  date: string;
  symptoms: string;
  diagnosis: string;
  confidence: string;
}

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  timestamp: string;
}

const SymptomAI = () => {
  const [activeSection, setActiveSection] = useState<'home' | 'diagnosis' | 'doctors' | 'history'>('home');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');

  // Sample doctors data
  const doctorsData: Doctor[] = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      specialty: 'Internal Medicine',
      rating: 4.8,
      experience: '12 years',
      location: 'Downtown Medical Center',
      phone: '+1 (555) 123-4567',
      email: 'sarah.johnson@healthcenter.com',
      availableTimes: ['9:00 AM', '2:00 PM', '4:30 PM'],
      diseases: ['Common Cold', 'Hypertension', 'Diabetes', 'Gastritis']
    },
    {
      id: 2,
      name: 'Dr. Michael Chen',
      specialty: 'Pulmonology',
      rating: 4.9,
      experience: '15 years',
      location: 'Respiratory Health Clinic',
      phone: '+1 (555) 987-6543',
      email: 'michael.chen@resphealth.com',
      availableTimes: ['10:00 AM', '1:00 PM', '3:00 PM'],
      diseases: ['Bronchitis', 'Asthma', 'Pneumonia', 'COPD']
    },
    {
      id: 3,
      name: 'Dr. Emily Rodriguez',
      specialty: 'Cardiology',
      rating: 4.7,
      experience: '18 years',
      location: 'Heart & Vascular Institute',
      phone: '+1 (555) 456-7890',
      email: 'emily.rodriguez@heartinstitute.com',
      availableTimes: ['8:00 AM', '11:00 AM', '5:00 PM'],
      diseases: ['Heart Disease', 'Chest Pain', 'Arrhythmia', 'Hypertension']
    },
    {
      id: 4,
      name: 'Dr. James Wilson',
      specialty: 'Gastroenterology',
      rating: 4.6,
      experience: '10 years',
      location: 'Digestive Health Center',
      phone: '+1 (555) 321-0987',
      email: 'james.wilson@digestivehealth.com',
      availableTimes: ['9:30 AM', '2:30 PM', '4:00 PM'],
      diseases: ['Gastritis', 'IBS', 'Acid Reflux', 'Stomach Pain']
    }
  ];

  // Get chat history for diagnoses
  const getChatHistory = () => {
    const history: Diagnosis[] = [];
    let currentSymptoms = '';
    let currentDiagnosis = '';

    messages.forEach((message, index) => {
      if (message.sender === 'user') {
        currentSymptoms = message.text;
      } else if (message.sender === 'ai' && currentSymptoms) {
        currentDiagnosis = message.text;
        
        if (currentSymptoms && currentDiagnosis) {
          history.push({
            id: index,
            date: new Date().toISOString().split('T')[0],
            symptoms: currentSymptoms,
            diagnosis: currentDiagnosis.split('\n')[0], // First line of AI response
            confidence: '90%' // You can adjust this based on AI response
          });
          
          currentSymptoms = '';
          currentDiagnosis = '';
        }
      }
    });

    return history;
  };

  // Combine sample and chat history
  const pastDiagnoses: Diagnosis[] = [
    ...getChatHistory().reverse(),
    {
      id: 998,
      date: '2024-12-15',
      symptoms: 'Fever, headache, body aches',
      diagnosis: 'Common Cold',
      confidence: '85%'
    },
    {
      id: 999,
      date: '2024-12-10',
      symptoms: 'Stomach pain, nausea, loss of appetite',
      diagnosis: 'Gastritis',
      confidence: '78%'
    }
  ];

  const handleSendMessage = async () => {
    if (inputMessage.trim()) {
      const userMessage: Message = {
        id: Date.now(),
        text: inputMessage,
        sender: 'user',
        timestamp: new Date().toLocaleTimeString()
      };
      
      // Clear input immediately for better UX
      setInputMessage('');
      
      // Add user message
      setMessages(prev => [...prev, userMessage]);
      
      // Show typing indicator
      const typingMessage: Message = {
        id: Date.now() + 1,
        text: "Analyzing your symptoms...",
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, typingMessage]);
      
      try {
        const aiResponseText = await aiService.generateResponse(inputMessage);
        
        // Replace typing indicator with actual response
        setMessages(prev => {
          const withoutTyping = prev.filter(msg => msg.id !== typingMessage.id);
          return [...withoutTyping, {
            id: Date.now() + 2,
            text: aiResponseText,
            sender: 'ai',
            timestamp: new Date().toLocaleTimeString()
          }];
        });
      } catch (error) {
        console.error('Error getting AI response:', error);
        
        // Replace typing indicator with error message
        setMessages(prev => {
          const withoutTyping = prev.filter(msg => msg.id !== typingMessage.id);
          return [...withoutTyping, {
            id: Date.now() + 2,
            text: "I apologize, but I'm having trouble processing your request at the moment. Please try again later.",
            sender: 'ai',
            timestamp: new Date().toLocaleTimeString()
          }];
        });
      }
    }
  };

  const renderHome = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 transform rotate-12">
          <Heart size={120} className="text-blue-600" />
        </div>
        <div className="absolute top-40 right-32 transform -rotate-12">
          <Heart size={80} className="text-red-500" />
        </div>
        <div className="absolute bottom-32 left-40 transform rotate-45">
          <Activity size={100} className="text-green-500" />
        </div>
        <div className="absolute bottom-20 right-20 transform -rotate-45">
          <Plus size={60} className="text-purple-600" />
        </div>
      </div>

      <div className="relative z-10">
        <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <nav className="flex items-center justify-between">
              <div className="flex items-center space-x-8">
                <h1 className="text-2xl font-bold text-gray-900">SymptomAI</h1>
                <div className="hidden md:flex space-x-6">
                  <button 
                    onClick={() => setActiveSection('diagnosis')}
                    className="text-gray-600 hover:text-blue-600"
                  >
                    Start Diagnosis
                  </button>
                  <button 
                    onClick={() => setActiveSection('doctors')}
                    className="text-gray-600 hover:text-blue-600"
                  >
                    Find Doctors
                  </button>
                  <button 
                    onClick={() => setActiveSection('history')}
                    className="text-gray-600 hover:text-blue-600"
                  >
                    History
                  </button>
                </div>
              </div>
            </nav>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-6 py-16">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Your Personal AI Health Assistant
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get instant health insights, connect with qualified doctors, and track your medical history - all in one place.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <Activity className="text-blue-600" size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">AI Diagnosis</h3>
              <p className="text-gray-600 mb-4">
                Get preliminary health insights from our advanced AI system.
              </p>
              <button 
                onClick={() => setActiveSection('diagnosis')}
                className="w-full py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
              >
                Start Diagnosis
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <Heart className="text-purple-600" size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Find Doctors</h3>
              <p className="text-gray-600 mb-4">
                Connect with qualified healthcare professionals in your area.
              </p>
              <button 
                onClick={() => setActiveSection('doctors')}
                className="w-full py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
              >
                Search Doctors
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                <Clock className="text-green-600" size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Medical History</h3>
              <p className="text-gray-600 mb-4">
                Track your health journey and past diagnoses over time.
              </p>
              <button 
                onClick={() => setActiveSection('history')}
                className="w-full py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
              >
                View History
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );

  const renderDiagnosis = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setActiveSection('home')}
              className="text-gray-600 hover:text-blue-600 flex items-center space-x-2"
            >
              <span>← Back</span>
            </button>
            <h1 className="text-xl font-bold text-gray-900">AI Diagnosis</h1>
            <div className="w-16"></div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
            <h2 className="text-white font-semibold">Describe your symptoms</h2>
            <p className="text-blue-100 text-sm">Be as detailed as possible for the most accurate diagnosis</p>
          </div>

          <div className="h-96 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] p-4 rounded-2xl ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p>{message.text}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.sender === 'user' ? 'text-blue-200' : 'text-gray-500'
                    }`}
                  >
                    {message.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 p-4">
            <div className="flex space-x-4">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your symptoms here..."
                className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSendMessage();
                  }
                }}
              />
              <button
                onClick={handleSendMessage}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-200"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDoctors = () => (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setActiveSection('home')}
              className="text-gray-600 hover:text-orange-600 flex items-center space-x-2"
            >
              <span>← Back</span>
            </button>
            <h1 className="text-xl font-bold text-gray-900">Find Doctors</h1>
            <div className="w-16"></div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by disease or specialty..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <button className="px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl hover:shadow-lg transition-all duration-200">
              Search Doctors
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {doctorsData.map((doctor) => (
            <div key={doctor.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center text-white font-bold text-xl">
                    {doctor.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{doctor.name}</h3>
                    <p className="text-orange-600 font-semibold mb-2">{doctor.specialty}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center space-x-1">
                        <Star className="text-yellow-500 fill-current" size={16} />
                        <span>{doctor.rating}</span>
                      </div>
                      <span>•</span>
                      <span>{doctor.experience}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <MapPin size={16} className="text-orange-500" />
                    <span>{doctor.location}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Phone size={16} className="text-orange-500" />
                    <span>{doctor.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Mail size={16} className="text-orange-500" />
                    <span>{doctor.email}</span>
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Specializes in:</h4>
                  <div className="flex flex-wrap gap-2">
                    {doctor.diseases.map((disease, index) => (
                      <span key={index} className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
                        {disease}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                    <Clock size={16} className="mr-1" />
                    Available Times Today:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {doctor.availableTimes.map((time, index) => (
                      <button key={index} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm hover:bg-green-200 transition-colors">
                        {time}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-6 flex space-x-3">
                  <button className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 text-white py-3 rounded-xl hover:shadow-lg transition-all duration-200 font-semibold">
                    Book Appointment
                  </button>
                  <button className="px-6 py-3 border border-orange-600 text-orange-600 rounded-xl hover:bg-orange-50 transition-all duration-200">
                    View Profile
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderHistory = () => (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setActiveSection('home')}
              className="text-gray-600 hover:text-green-600 flex items-center space-x-2"
            >
              <span>← Back</span>
            </button>
            <h1 className="text-xl font-bold text-gray-900">Medical History</h1>
            <div className="w-16"></div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid gap-6">
          {pastDiagnoses.map((diagnosis) => (
            <div key={diagnosis.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-sm text-gray-500">{diagnosis.date}</span>
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                      {diagnosis.confidence} Confidence
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{diagnosis.diagnosis}</h3>
                  <p className="text-gray-600">{diagnosis.symptoms}</p>
                </div>
                <button className="px-4 py-2 border border-green-600 text-green-600 rounded-xl hover:bg-green-50 transition-all duration-200">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="font-sans">
      {activeSection === 'home' && renderHome()}
      {activeSection === 'diagnosis' && renderDiagnosis()}
      {activeSection === 'doctors' && renderDoctors()}
      {activeSection === 'history' && renderHistory()}
    </div>
  );
};

export default SymptomAI;