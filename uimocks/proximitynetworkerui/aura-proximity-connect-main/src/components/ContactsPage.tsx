
import React, { useState } from 'react';
import { MessageCircle, Eye, UserCheck, Search, Wifi } from 'lucide-react';

const ContactsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [contacts] = useState([
    { 
      id: '1', 
      username: 'crypto_dev', 
      address: '0x742d...4A2f', 
      lastSeen: '2m ago', 
      online: true,
      mutual: true,
      profileVerified: true,
      messages: 3
    },
    { 
      id: '2', 
      username: 'blockchain_alice', 
      address: '0x891c...7B9e', 
      lastSeen: '1h ago', 
      online: false,
      mutual: true,
      profileVerified: true,
      messages: 0
    },
    { 
      id: '3', 
      username: 'web3_builder', 
      address: '0x123a...9C4d', 
      lastSeen: '3h ago', 
      online: true,
      mutual: true,
      profileVerified: false,
      messages: 1
    },
  ]);

  const filteredContacts = contacts.filter(contact =>
    contact.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="text-center space-y-1">
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Contacts
        </h1>
        <p className="text-gray-400 text-xs">{contacts.length} proximity connections</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search contacts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl pl-10 pr-4 py-2 text-white text-sm placeholder-gray-400 focus:outline-none focus:border-blue-500/50"
        />
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-black/20 backdrop-blur-sm border border-green-500/20 rounded-xl p-3 text-center">
          <div className="flex items-center justify-center space-x-1 mb-1">
            <Wifi className="w-4 h-4 text-green-400" />
            <span className="text-green-400 text-sm font-medium">Online</span>
          </div>
          <div className="text-lg font-bold text-green-400">{contacts.filter(c => c.online).length}</div>
        </div>
        <div className="bg-black/20 backdrop-blur-sm border border-blue-500/20 rounded-xl p-3 text-center">
          <div className="flex items-center justify-center space-x-1 mb-1">
            <UserCheck className="w-4 h-4 text-blue-400" />
            <span className="text-blue-400 text-sm font-medium">Mutual</span>
          </div>
          <div className="text-lg font-bold text-blue-400">{contacts.filter(c => c.mutual).length}</div>
        </div>
      </div>

      {/* Contacts List */}
      <div className="space-y-2">
        {filteredContacts.map((contact) => (
          <div 
            key={contact.id} 
            className={`backdrop-blur-sm border rounded-xl p-3 ${
              contact.online 
                ? 'bg-green-500/5 border-green-500/20' 
                : 'bg-black/20 border-white/10'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    contact.online 
                      ? 'bg-gradient-to-br from-green-500/30 to-blue-500/30' 
                      : 'bg-gradient-to-br from-blue-500/30 to-purple-500/30'
                  }`}>
                    <span className="text-white font-bold text-sm">
                      {contact.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  {contact.online && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-black"></div>
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-white font-medium text-sm">{contact.username}</span>
                    {contact.profileVerified && (
                      <UserCheck className="w-3 h-3 text-blue-400" />
                    )}
                    {contact.online && (
                      <Wifi className="w-3 h-3 text-green-400" />
                    )}
                  </div>
                  <div className="text-xs text-gray-400 font-mono">{contact.address}</div>
                  <div className="text-xs text-gray-500">Last seen {contact.lastSeen}</div>
                </div>
              </div>

              <div className="flex space-x-2">
                <button className="p-1.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-lg hover:from-blue-500/30 hover:to-purple-500/30 transition-all">
                  <Eye className="w-3 h-3 text-white" />
                </button>
                <button className="relative p-1.5 bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/30 rounded-lg hover:from-green-500/30 hover:to-blue-500/30 transition-all">
                  <MessageCircle className="w-3 h-3 text-white" />
                  {contact.messages > 0 && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-xs text-white">
                      {contact.messages}
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredContacts.length === 0 && (
        <div className="text-center py-6">
          <div className="text-gray-400 text-sm">No contacts found</div>
          <div className="text-xs text-gray-500 mt-1">Try scanning for nearby devices</div>
        </div>
      )}
    </div>
  );
};

export default ContactsPage;
