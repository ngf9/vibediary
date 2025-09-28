'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface DashboardCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  color: string;
  trend?: {
    value: number;
    isUp: boolean;
  };
}

export default function DashboardCard({
  title,
  value,
  subtitle,
  icon,
  color,
  trend,
}: DashboardCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg shadow-gray-200/50 border border-gray-100 p-6 hover:shadow-xl hover:shadow-gray-300/50 transition-all duration-300 cursor-pointer"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <div className="mt-2 flex items-baseline">
            <p className="text-3xl font-semibold text-gray-900">{value}</p>
            {trend && (
              <span
                className={`ml-2 text-sm font-medium ${
                  trend.isUp ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {trend.isUp ? '↑' : '↓'} {Math.abs(trend.value)}%
              </span>
            )}
          </div>
          {subtitle && (
            <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
          )}
        </div>
        <div
          className={`p-3 rounded-lg bg-gradient-to-br ${color} bg-opacity-10 shadow-md`}
        >
          <div className={`${color.replace('bg-', 'text-')} drop-shadow-sm`}>
            {icon}
          </div>
        </div>
      </div>
    </motion.div>
  );
}