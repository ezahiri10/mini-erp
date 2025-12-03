'use client';

import { useState } from 'react';
import { CheckCircle, Trash2 } from 'lucide-react';
import PageHeader from '../components/PageHeader';

interface CompletedItem {
  id: string;
  title: string;
  type: 'lead' | 'claim' | 'task';
  completedDate: string;
  details: string;
}

export default function CompletedPage() {
  const [items, setItems] = useState<CompletedItem[]>([
    {
      id: '1',
      title: 'XYZ Corp - Lead Conversion',
      type: 'lead',
      completedDate: '2025-12-02',
      details: 'Successfully converted lead to client account'
    },
    {
      id: '2',
      title: 'Claim #CLM-2025-001 Resolved',
      type: 'claim',
      completedDate: '2025-12-01',
      details: 'Claim processed and approved for payment'
    },
    {
      id: '3',
      title: 'Follow-up Call Task',
      type: 'task',
      completedDate: '2025-11-30',
      details: 'Client follow-up call completed successfully'
    },
    {
      id: '4',
      title: 'ABC Industries - Claim #CLM-2025-002',
      type: 'claim',
      completedDate: '2025-11-28',
      details: 'Claim approved and processed'
    },
    {
      id: '5',
      title: 'Tech Solutions - Lead Conversion',
      type: 'lead',
      completedDate: '2025-11-25',
      details: 'Lead qualified and converted to opportunity'
    },
    {
      id: '6',
      title: 'Document Review Task',
      type: 'task',
      completedDate: '2025-11-20',
      details: 'All required documents reviewed and approved'
    },
  ]);

  const handleDelete = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'lead':
        return 'bg-blue-500/20 text-blue-300';
      case 'claim':
        return 'bg-green-500/20 text-green-300';
      case 'task':
        return 'bg-purple-500/20 text-purple-300';
      default:
        return 'bg-gray-500/20 text-gray-300';
    }
  };

  const typeStats = {
    leads: items.filter(i => i.type === 'lead').length,
    claims: items.filter(i => i.type === 'claim').length,
    tasks: items.filter(i => i.type === 'task').length,
  };

  return (
    <div className="p-8 bg-gray-900 min-h-screen">
      <PageHeader title="Completed" description="Your completed leads, claims, and tasks" />

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-800 p-6 rounded-lg border-l-4 border-blue-400">
          <p className="text-gray-400 text-sm mb-2">Converted Leads</p>
          <p className="text-4xl font-bold text-white">{typeStats.leads}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg border-l-4 border-green-400">
          <p className="text-gray-400 text-sm mb-2">Resolved Claims</p>
          <p className="text-4xl font-bold text-white">{typeStats.claims}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg border-l-4 border-purple-400">
          <p className="text-gray-400 text-sm mb-2">Completed Tasks</p>
          <p className="text-4xl font-bold text-white">{typeStats.tasks}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg border-l-4 border-yellow-400">
          <p className="text-gray-400 text-sm mb-2">Total Completed</p>
          <p className="text-4xl font-bold text-white">{items.length}</p>
        </div>
      </div>

      {/* Completed Items */}
      <div className="space-y-4">
        {items.length === 0 ? (
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <CheckCircle className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No completed items yet</p>
          </div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700/50 transition border border-gray-700">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <CheckCircle className="w-6 h-6 text-green-400 mt-1 shrink-0" />
                  <div className="flex-1">
                    <h3 className="text-white font-medium text-lg mb-1">{item.title}</h3>
                    <p className="text-gray-400 text-sm mb-3">{item.details}</p>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(item.type)}`}>
                        {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                      </span>
                      <span className="text-gray-500 text-xs">
                        Completed {new Date(item.completedDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-gray-400 hover:text-red-400 transition ml-4"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
