'use client';

import { useState } from 'react';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  assignee: string;
  dueDate: string;
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Process claim #123',
      description: 'Review and process insurance claim',
      status: 'in-progress',
      priority: 'high',
      assignee: 'John Doe',
      dueDate: '2025-12-05',
    },
    {
      id: '2',
      title: 'Follow up with client',
      description: 'Call client to confirm details',
      status: 'pending',
      priority: 'medium',
      assignee: 'Jane Smith',
      dueDate: '2025-12-04',
    },
    {
      id: '3',
      title: 'Document review',
      description: 'Review submitted documents',
      status: 'completed',
      priority: 'low',
      assignee: 'Mike Johnson',
      dueDate: '2025-12-01',
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 font-bold';
      case 'medium':
        return 'text-orange-600 font-semibold';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="p-8 bg-gray-900 min-h-screen">
      <div className="mb-8 bg-gray-800 p-6 rounded-lg shadow-sm">
        <h1 className="text-3xl font-bold mb-2 text-white">Tasks</h1>
        <p className="text-gray-400">Manage and track all supervisor tasks</p>
      </div>

      <div className="bg-gray-800 rounded-lg shadow-sm overflow-hidden mb-6">
        <table className="w-full">
          <thead className="bg-gray-700 border-b border-gray-600">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-200">Title</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-200">Assignee</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-200">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-200">Priority</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-200">Due Date</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-200">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {tasks.map((task) => (
              <tr key={task.id} className="hover:bg-gray-700">
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium text-white">{task.title}</p>
                    <p className="text-sm text-gray-400">{task.description}</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-300">{task.assignee}</td>
                <td className="px-6 py-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                    {task.status}
                  </span>
                </td>
                <td className={`px-6 py-4 text-sm ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </td>
                <td className="px-6 py-4 text-gray-300">{task.dueDate}</td>
                <td className="px-6 py-4">
                  <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gray-800 p-4 rounded-lg border-l-4 border-blue-400">
          <p className="text-gray-400 text-sm">Pending Tasks</p>
          <p className="text-2xl font-bold text-blue-400">2</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg border-l-4 border-orange-400">
          <p className="text-gray-400 text-sm">In Progress</p>
          <p className="text-2xl font-bold text-orange-400">1</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg border-l-4 border-green-400">
          <p className="text-gray-400 text-sm">Completed</p>
          <p className="text-2xl font-bold text-green-400">1</p>
        </div>
      </div>
    </div>
  );
}
