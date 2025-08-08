"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface DashboardOverviewProps {
  role: string;
}

export default function DashboardOverview({ role }: DashboardOverviewProps) {
  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Sales Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to the sales management dashboard
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Sales Order
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Sales Orders</CardTitle>
            <CardDescription>
              Latest sales orders and their status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Sales orders data will be displayed here
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sales Analytics</CardTitle>
            <CardDescription>
              Sales performance and metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Analytics and charts will be displayed here
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks and shortcuts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Quick action buttons will be displayed here
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
