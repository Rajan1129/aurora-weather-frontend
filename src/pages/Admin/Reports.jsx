import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, Download, Calendar, Filter,
  BarChart3, PieChart, Users, DollarSign,
  Cloud, Brain, Activity, Printer,
  Mail, Share2, FileSpreadsheet, Database
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export function AdminReports() {
  const [dateRange, setDateRange] = useState('month');
  const [reportType, setReportType] = useState('overview');

  const reports = [];

  const stats = [
    { label: 'Total Reports', value: '0', icon: FileText, color: 'blue' },
    { label: 'Generated Today', value: '0', icon: Activity, color: 'green' },
    { label: 'Storage Used', value: '0 MB', icon: Database, color: 'purple' },
    { label: 'Downloads', value: '0', icon: Download, color: 'orange' },
  ];

  const getStatusColor = (status) => {
    return status === 'ready' 
      ? 'bg-green-500/10 text-green-500' 
      : 'bg-yellow-500/10 text-yellow-500';
  };

  const generateReport = () => {
    toast.success('Report generation started!');
  };

  const downloadReport = (id) => {
    toast.success('Download started!');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Reports</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Generate and manage reports
          </p>
        </div>
        <button
          onClick={generateReport}
          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:opacity-90 transition-opacity flex items-center gap-2"
        >
          <FileText className="w-4 h-4" />
          Generate Report
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="glass-card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
              <stat.icon className={`w-8 h-8 text-${stat.color}-500/50`} />
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="glass-card p-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="overview">Overview</option>
              <option value="users">Users</option>
              <option value="revenue">Revenue</option>
              <option value="ai">AI Usage</option>
              <option value="weather">Weather Data</option>
            </select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
          </div>
          <button className="glass-card px-4 py-2 flex items-center gap-2 text-sm hover:bg-white/20 transition-colors">
            <Filter className="w-4 h-4" />
            Apply Filters
          </button>
        </div>
      </div>

      {/* Reports Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Report Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {reports.map((report) => (
                <tr key={report.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-medium">{report.name}</td>
                  <td className="px-6 py-4 text-sm capitalize">{report.type}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{report.date}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{report.size}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(report.status)}`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => downloadReport(report.id)}
                        className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      >
                        <Download className="w-4 h-4 text-gray-500" />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                        <Printer className="w-4 h-4 text-gray-500" />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                        <Mail className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}