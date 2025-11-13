import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/common';
import { Wallet, TrendingUp, ArrowUpRight, PiggyBank } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Welcome back! Here's your savings overview
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card hover>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Savings
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  ₦0.00
                </p>
                <p className="text-sm text-green-600 mt-2 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +0% from last month
                </p>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <Wallet className="h-6 w-6 text-primary-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card hover>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Active Plans
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-2">0</p>
                <p className="text-sm text-gray-500 mt-2">No active plans</p>
              </div>
              <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center">
                <PiggyBank className="h-6 w-6 text-secondary-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card hover>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  This Month
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  ₦0.00
                </p>
                <p className="text-sm text-gray-500 mt-2">Amount saved</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <ArrowUpRight className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card hover>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Savings Streak
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-2">0 days</p>
                <p className="text-sm text-gray-500 mt-2">Keep it going!</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🔥</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-4 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors">
                <div className="flex items-center space-x-3">
                  <PiggyBank className="h-5 w-5 text-primary-600" />
                  <span className="font-medium text-gray-900">
                    Create Savings Plan
                  </span>
                </div>
                <ArrowUpRight className="h-5 w-5 text-primary-600" />
              </button>

              <button className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                <div className="flex items-center space-x-3">
                  <Wallet className="h-5 w-5 text-gray-600" />
                  <span className="font-medium text-gray-900">
                    Make Deposit
                  </span>
                </div>
                <ArrowUpRight className="h-5 w-5 text-gray-600" />
              </button>

              <button className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="h-5 w-5 text-gray-600" />
                  <span className="font-medium text-gray-900">
                    View Analytics
                  </span>
                </div>
                <ArrowUpRight className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <PiggyBank className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-600">No activity yet</p>
              <p className="text-sm text-gray-500 mt-1">
                Start saving to see your activity here
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
