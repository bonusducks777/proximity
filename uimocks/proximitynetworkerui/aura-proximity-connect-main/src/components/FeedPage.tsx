
import React, { useState } from 'react';
import { Heart, MessageCircle, Share, MoreHorizontal, Clock } from 'lucide-react';

const FeedPage = () => {
  const [posts] = useState([
    {
      id: '1',
      username: 'crypto_dev',
      address: '0x742d...4A2f',
      time: '2m ago',
      content: 'Just deployed my first smart contract on Ethereum! 🚀 The future is decentralized.',
      likes: 12,
      comments: 3,
      mutual: true
    },
    {
      id: '2',
      username: 'blockchain_alice',
      address: '0x891c...7B9e',
      time: '15m ago',
      content: 'Amazing meetup today! Connected with so many Web3 builders in the area.',
      likes: 8,
      comments: 1,
      mutual: true
    },
    {
      id: '3',
      username: 'web3_builder',
      address: '0x123a...9C4d',
      time: '1h ago',
      content: 'Building the next generation of decentralized apps. Who wants to collaborate?',
      likes: 15,
      comments: 5,
      mutual: true
    },
    {
      id: '4',
      username: 'defi_expert',
      address: '0x456b...8E7f',
      time: '3h ago',
      content: 'New DeFi protocol just launched! Early adoption pays off 📈',
      likes: 23,
      comments: 8,
      mutual: false
    }
  ]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="text-center space-y-1">
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Feed
        </h1>
        <p className="text-gray-400 text-xs">Latest from your network</p>
      </div>

      {/* Posts */}
      <div className="space-y-3">
        {posts.map((post) => (
          <div key={post.id} className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-3">
            {/* Post Header */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xs">
                    {post.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <div className="flex items-center space-x-1">
                    <span className="text-white font-medium text-sm">{post.username}</span>
                    {post.mutual && (
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-400 text-xs font-mono">{post.address}</span>
                    <Clock className="w-3 h-3 text-gray-400" />
                    <span className="text-gray-400 text-xs">{post.time}</span>
                  </div>
                </div>
              </div>
              <button className="p-1">
                <MoreHorizontal className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            {/* Post Content */}
            <p className="text-white text-sm mb-3 leading-relaxed">{post.content}</p>

            {/* Post Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-white/5">
              <div className="flex items-center space-x-4">
                <button className="flex items-center space-x-1 text-gray-400 hover:text-red-400 transition-colors">
                  <Heart className="w-4 h-4" />
                  <span className="text-xs">{post.likes}</span>
                </button>
                <button className="flex items-center space-x-1 text-gray-400 hover:text-blue-400 transition-colors">
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-xs">{post.comments}</span>
                </button>
              </div>
              <button className="text-gray-400 hover:text-white transition-colors">
                <Share className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      <button className="w-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-xl py-2 text-white text-sm hover:from-blue-500/30 hover:to-purple-500/30 transition-all">
        Load More Posts
      </button>
    </div>
  );
};

export default FeedPage;
