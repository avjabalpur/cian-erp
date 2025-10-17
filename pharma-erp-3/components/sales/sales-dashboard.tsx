'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  FileCheck, 
  FileSpreadsheet, 
  FileText, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

export function SalesDashboard() {
  const metrics = [
    {
      title: 'Pending Approvals',
      value: '24',
      change: '+3 from yesterday',
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Approved Orders',
      value: '156',
      change: '+12 this week',
      icon: CheckCircle2,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Pending Action',
      value: '8',
      change: 'Requires attention',
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      title: 'Total Revenue',
      value: '₹2.4M',
      change: '+18% from last month',
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
  ];

  const quickActions = [
    {
      title: 'Sales Order Approvals',
      description: 'Review and approve pending sales orders',
      icon: FileCheck,
      href: '/sales/order-approvals',
      color: 'bg-blue-50 text-blue-700',
      count: 24,
    },
    {
      title: 'Quotations',
      description: 'Manage customer quotations',
      icon: FileSpreadsheet,
      href: '/sales/quotations',
      color: 'bg-purple-50 text-purple-700',
      count: 12,
    },
    {
      title: 'Invoices',
      description: 'View and manage invoices',
      icon: FileText,
      href: '/sales/invoices',
      color: 'bg-green-50 text-green-700',
      count: 45,
    },
  ];

  const recentActivities = [
    {
      type: 'Approval',
      message: 'SO-2024-001 approved by Costing Team',
      time: '5 minutes ago',
      status: 'success',
    },
    {
      type: 'Pending',
      message: 'SO-2024-002 awaiting QA approval',
      time: '15 minutes ago',
      status: 'warning',
    },
    {
      type: 'Created',
      message: 'SO-2024-003 created for ABC Pharma',
      time: '1 hour ago',
      status: 'info',
    },
    {
      type: 'Rejected',
      message: 'SO-2024-004 rejected by Designer',
      time: '2 hours ago',
      status: 'error',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-orange-100 text-orange-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Sales Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Overview of your sales operations and pending approvals
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                  <Icon className={`h-4 w-4 ${metric.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{metric.change}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

  {/* Approval Pipeline */}
  <div>
        <h2 className="text-xl font-semibold mb-4">Approval Pipeline</h2>
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { stage: 'Costing', count: 5, color: 'bg-blue-100 text-blue-700' },
                { stage: 'QA', count: 8, color: 'bg-purple-100 text-purple-700' },
                { stage: 'Designer', count: 3, color: 'bg-pink-100 text-pink-700' },
                { stage: 'PM', count: 4, color: 'bg-orange-100 text-orange-700' },
                { stage: 'Final QA', count: 2, color: 'bg-green-100 text-green-700' },
                { stage: 'Final Auth', count: 2, color: 'bg-emerald-100 text-emerald-700' },
              ].map((stage) => (
                <div key={stage.stage} className={`p-4 rounded-lg ${stage.color}`}>
                  <div className="text-2xl font-bold">{stage.count}</div>
                  <div className="text-sm font-medium mt-1">{stage.stage}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Card key={action.title} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className={`p-3 rounded-lg ${action.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    {action.count > 0 && (
                      <Badge variant="secondary">{action.count}</Badge>
                    )}
                  </div>
                  <CardTitle className="mt-4">{action.title}</CardTitle>
                  <CardDescription>{action.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href={action.href}>
                    <Button variant="outline" className="w-full group">
                      Go to {action.title}
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Recent Activities */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Activities</h2>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start gap-4 pb-4 border-b last:border-0 last:pb-0">
                  <Badge className={getStatusColor(activity.status)} variant="secondary">
                    {activity.type}
                  </Badge>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

