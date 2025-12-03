'use client';

import { useState } from 'react';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';
import PageHeader from '../components/PageHeader';

interface Task {
  id: string;
  title: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
  assignee: string;
}

export default function TasksPage() {
  const [tasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Follow up with ABC Corp',
      status: 'in-progress',
      priority: 'high',
      dueDate: '2025-12-05',
      assignee: 'You'
    },
    {
      id: '2',
      title: 'Prepare claim documents',
      status: 'pending',
      priority: 'high',
      dueDate: '2025-12-06',
      assignee: 'You'
    },
    {
      id: '3',
      title: 'Review client agreement',
      status: 'pending',
      priority: 'medium',
      dueDate: '2025-12-08',
      assignee: 'You'
    },
    {
      id: '4',
      title: 'Update lead status',
      status: 'completed',
      priority: 'low',
      dueDate: '2025-12-03',
      assignee: 'You'
    },
  ]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'in-progress':
        return <Clock className="w-5 h-5 text-blue-400" />;
      default:
        return <AlertCircle className="w-5 h-5 text-yellow-400" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/20 text-red-300';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-300';
      case 'low':
        return 'bg-green-500/20 text-green-300';
      default:
        return 'bg-gray-500/20 text-gray-300';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'in-progress':
        return 'In Progress';
      case 'pending':
        return 'Pending';
      case 'completed':
        return 'Completed';
      default:
        return status;
    }
  };

  const pendingCount = tasks.filter(t => t.status === 'pending').length;
  const inProgressCount = tasks.filter(t => t.status === 'in-progress').length;
  const completedCount = tasks.filter(t => t.status === 'completed').length;

  return (
    <div className="p-8 bg-gray-900 min-h-screen">
      <PageHeader title="My Tasks" description="Track your assigned tasks and deadlines" />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-800 p-6 rounded-lg border-l-4 border-yellow-400">
          <p className="text-gray-400 text-sm mb-2">Pending Tasks</p>
          <p className="text-4xl font-bold text-white">{pendingCount}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg border-l-4 border-blue-400">
          <p className="text-gray-400 text-sm mb-2">In Progress</p>
          <p className="text-4xl font-bold text-white">{inProgressCount}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg border-l-4 border-green-400">
          <p className="text-gray-400 text-sm mb-2">Completed</p>
          <p className="text-4xl font-bold text-white">{completedCount}</p>
        </div>
      </div>

      {/* Tasks Table */}
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Task</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Priority</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Due Date</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Assignee</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id} className="border-b border-gray-700 hover:bg-gray-700/50 transition">
                <td className="px-6 py-4 font-medium text-white">{task.title}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(task.status)}
                    <span className="text-gray-300">{getStatusLabel(task.status)}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-400">
                  {new Date(task.dueDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm text-gray-400">{task.assignee}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
