
import React, { useState } from 'react';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';
import CreateMultisigPage from '../components/CreateMultisigPage';
import MainPage from '../components/MainPage';
import WalletPage from '../components/WalletPage';
import DebugPage from '../components/DebugPage';
import StatusPage from '../components/StatusPage';

interface User {
  id: string;
  username: string;
  address: string;
  distance: number;
  added: boolean;
}

const Index = () => {
  const [mode, setMode] = useState<'proxhost' | 'user'>('proxhost');
  const [activeTab, setActiveTab] = useState('create');
  const [members, setMembers] = useState<User[]>([]);
  const [memberPresence, setMemberPresence] = useState<{ [key: string]: boolean }>({});

  // User mode states
  const [isInProximity] = useState(true);

  const handleModeToggle = () => {
    setMode(prev => prev === 'proxhost' ? 'user' : 'proxhost');
    setActiveTab(mode === 'proxhost' ? 'status' : 'create');
  };

  const handleCreateMultisig = (newMembers: User[]) => {
    setMembers(newMembers);
    const initialPresence: { [key: string]: boolean } = {};
    newMembers.forEach(member => {
      initialPresence[member.id] = true; // Start with all members present
    });
    setMemberPresence(initialPresence);
    setActiveTab('main');
  };

  const handleTogglePresence = (userId: string) => {
    setMemberPresence(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  const presentMembers = members.filter(member => memberPresence[member.id]);
  const isMultisigActive = members.length > 0 && presentMembers.length === members.length;
  const isWalletUnlocked = isMultisigActive && isInProximity;

  const renderContent = () => {
    if (mode === 'user') {
      return (
        <StatusPage
          isInProximity={isInProximity}
          isWalletUnlocked={isWalletUnlocked}
          members={members}
          memberPresence={memberPresence}
        />
      );
    }

    switch (activeTab) {
      case 'create':
        return <CreateMultisigPage onCreateMultisig={handleCreateMultisig} />;
      case 'main':
        return (
          <MainPage
            members={members}
            memberPresence={memberPresence}
            onTogglePresence={handleTogglePresence}
          />
        );
      case 'wallet':
        return <WalletPage isMultisigActive={isMultisigActive} />;
      case 'debug':
        return <DebugPage />;
      default:
        return <CreateMultisigPage onCreateMultisig={handleCreateMultisig} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 relative overflow-hidden">
      {/* Background Effects */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Ccircle cx='10' cy='10' r='1'/%3E%3C/g%3E%3C/svg%3E")`
        }}
      ></div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-purple-500/5 to-transparent"></div>
      
      {/* Container with mobile constraints */}
      <div className="relative max-w-sm mx-auto min-h-screen bg-black/20 backdrop-blur-sm border-x border-white/10">
        <TopBar mode={mode} onModeToggle={handleModeToggle} />
        
        {/* Main Content */}
        <div className="pt-24 pb-20">
          {renderContent()}
        </div>
        
        <BottomNav
          activeTab={activeTab}
          onTabChange={setActiveTab}
          mode={mode}
        />
      </div>
    </div>
  );
};

export default Index;
