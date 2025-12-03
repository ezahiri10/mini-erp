'use client';

import { useState } from 'react';

interface Operator {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  status: 'active' | 'inactive' | 'on-leave';
  joinDate: string;
  assignedClaims: number;
}

export default function OperatorsPage() {
  const [operators, setOperators] = useState<Operator[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@company.com',
      phone: '555-0101',
      department: 'Claims',
      status: 'active',
      joinDate: '2024-01-15',
      assignedClaims: 12,
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane.smith@company.com',
      phone: '555-0102',
      department: 'Customer Service',
      status: 'active',
      joinDate: '2024-02-20',
      assignedClaims: 8,
    },
    {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike.johnson@company.com',
      phone: '555-0103',
      department: 'Claims',
      status: 'on-leave',
      joinDate: '2023-11-10',
      assignedClaims: 0,
    },
    {
      id: '4',
      name: 'Sarah Williams',
      email: 'sarah.williams@company.com',
      phone: '555-0104',
      department: 'Verification',
      status: 'active',
      joinDate: '2024-03-05',
      assignedClaims: 15,
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      case 'on-leave':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const activeOperators = operators.filter(op => op.status === 'active').length;
  const totalClaims = operators.reduce((sum, op) => sum + op.assignedClaims, 0);
  const avgClaimsPerOperator = operators.length > 0 ? (totalClaims / activeOperators).toFixed(1) : 0;

  return (
    <div className="p-8 bg-gray-900 min-h-screen">
      <div className="mb-8 bg-gray-800 p-6 rounded-lg shadow-sm">
        <h1 className="text-3xl font-bold mb-2 text-white">Operators</h1>
        <p className="text-gray-400">Manage and monitor your operations team</p>
      </div>



      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-800 p-4 rounded-lg shadow-sm border-l-4 border-blue-400">
          <p className="text-gray-400 text-sm">Total Operators</p>
          <p className="text-2xl font-bold text-blue-400">{operators.length}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg shadow-sm border-l-4 border-green-400">
          <p className="text-gray-400 text-sm">Active</p>
          <p className="text-2xl font-bold text-green-400">{activeOperators}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg shadow-sm border-l-4 border-orange-400">
          <p className="text-gray-400 text-sm">Total Claims Assigned</p>
          <p className="text-2xl font-bold text-orange-400">{totalClaims}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg shadow-sm border-l-4 border-purple-400">
          <p className="text-gray-400 text-sm">Avg Claims/Operator</p>
          <p className="text-2xl font-bold text-purple-400">{avgClaimsPerOperator}</p>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-700 border-b border-gray-600">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-200">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-200">Email</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-200">Phone</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-200">Department</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-200">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-200">Assigned Claims</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-200">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {operators.map((operator) => (
              <tr key={operator.id} className="hover:bg-gray-700">
                <td className="px-6 py-4 font-medium text-white">{operator.name}</td>
                <td className="px-6 py-4 text-gray-300">{operator.email}</td>
                <td className="px-6 py-4 text-gray-300">{operator.phone}</td>
                <td className="px-6 py-4 text-gray-300">{operator.department}</td>
                <td className="px-6 py-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(operator.status)}`}>
                    {operator.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-block px-3 py-1 rounded-full bg-blue-900 text-blue-300 text-sm font-medium">
                    {operator.assignedClaims}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button className="text-blue-400 hover:text-blue-300 text-sm font-medium mr-4">
                    Edit
                  </button>
                  <button className="text-red-400 hover:text-red-300 text-sm font-medium">
                    Delete
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
