'use client';

import { useState } from 'react';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted';
  source: string;
  assignedTo: string;
  createdDate: string;
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([
    {
      id: '1',
      name: 'Alice Johnson',
      email: 'alice@company.com',
      phone: '555-0101',
      company: 'Tech Corp',
      status: 'qualified',
      source: 'LinkedIn',
      assignedTo: 'John Doe',
      createdDate: '2025-11-28',
    },
    {
      id: '2',
      name: 'Bob Wilson',
      email: 'bob@startup.io',
      phone: '555-0102',
      company: 'StartUp Inc',
      status: 'contacted',
      source: 'Email Campaign',
      assignedTo: 'Jane Smith',
      createdDate: '2025-11-30',
    },
    {
      id: '3',
      name: 'Carol Davis',
      email: 'carol@enterprise.com',
      phone: '555-0103',
      company: 'Enterprise LLC',
      status: 'new',
      source: 'Referral',
      assignedTo: 'Mike Johnson',
      createdDate: '2025-12-02',
    },
    {
      id: '4',
      name: 'David Brown',
      email: 'david@solutions.com',
      phone: '555-0104',
      company: 'Solutions Group',
      status: 'converted',
      source: 'Website',
      assignedTo: 'John Doe',
      createdDate: '2025-11-15',
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'converted':
        return 'bg-green-100 text-green-800';
      case 'qualified':
        return 'bg-blue-100 text-blue-800';
      case 'contacted':
        return 'bg-purple-100 text-purple-800';
      case 'new':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSourceColor = (source: string) => {
    switch (source) {
      case 'LinkedIn':
        return 'bg-blue-50 text-blue-700';
      case 'Email Campaign':
        return 'bg-green-50 text-green-700';
      case 'Referral':
        return 'bg-purple-50 text-purple-700';
      case 'Website':
        return 'bg-orange-50 text-orange-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  return (
    <div className="p-8 bg-gray-900 min-h-screen">
      <div className="mb-8 bg-gray-800 p-6 rounded-lg shadow-sm">
        <h1 className="text-3xl font-bold mb-2 text-white">Leads</h1>
        <p className="text-gray-400">Manage and track sales leads</p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-800 p-4 rounded-lg shadow-sm border-l-4 border-gray-500">
          <p className="text-gray-400 text-sm">Total Leads</p>
          <p className="text-2xl font-bold text-gray-300">4</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg shadow-sm border-l-4 border-yellow-400">
          <p className="text-gray-400 text-sm">New</p>
          <p className="text-2xl font-bold text-yellow-400">1</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg shadow-sm border-l-4 border-purple-400">
          <p className="text-gray-400 text-sm">Contacted</p>
          <p className="text-2xl font-bold text-purple-400">1</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg shadow-sm border-l-4 border-green-400">
          <p className="text-gray-400 text-sm">Converted</p>
          <p className="text-2xl font-bold text-green-400">1</p>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-700 border-b border-gray-600">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-200">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-200">Company</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-200">Contact</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-200">Source</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-200">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-200">Assigned To</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-200">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-gray-700">
                <td className="px-6 py-4 font-medium text-white">{lead.name}</td>
                <td className="px-6 py-4 text-gray-300">{lead.company}</td>
                <td className="px-6 py-4">
                  <div className="text-sm">
                    <p className="text-white">{lead.email}</p>
                    <p className="text-gray-400">{lead.phone}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getSourceColor(lead.source)}`}>
                    {lead.source}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                    {lead.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-300">{lead.assignedTo}</td>
                <td className="px-6 py-4">
                  <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
