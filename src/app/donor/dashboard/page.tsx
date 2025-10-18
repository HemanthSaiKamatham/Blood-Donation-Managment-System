'use client';

import { Award, HeartPulse, Star, Users, Zap } from 'lucide-react';
import type { Icon } from 'lucide-react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import PageHeader from '@/components/shared/page-header';
import { achievements, donationHistory, donorProfile } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const chartData = [
  { month: 'Jan', donations: 186 },
  { month: 'Feb', donations: 305 },
  { month: 'Mar', donations: 237 },
  { month: 'Apr', donations: 273 },
  { month: 'May', donations: 209 },
  { month: 'Jun', donations: 214 },
];

const chartConfig = {
  donations: {
    label: 'Donations',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;


const iconMap: { [key: string]: Icon } = { Award, Star, Zap, HeartPulse, Users };

export default function DonorDashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Dashboard"
        description={`Welcome back, ${donorProfile.name}! Here's your impact.`}
      />
      <main className="grid gap-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:border-primary/80 transition-all">
            <CardHeader>
              <CardTitle>Contribution Score</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-primary">
                {donorProfile.contributionScore.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">Points</p>
            </CardContent>
          </Card>
          <Card className="hover:border-primary/80 transition-all">
            <CardHeader>
              <CardTitle>Donor Level</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-primary">
                {donorProfile.donorLevel}
              </p>
              <p className="text-sm text-muted-foreground">Keep it up!</p>
            </CardContent>
          </Card>
          <Card className="hover:border-primary/80 transition-all">
            <CardHeader>
              <CardTitle>Donation Streak</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-primary">
                {donorProfile.donationStreak}
              </p>
              <p className="text-sm text-muted-foreground">Consecutive Donations</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Donation History</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {donationHistory.slice(0, 5).map((donation) => (
                    <TableRow key={donation.id}>
                      <TableCell>{donation.date}</TableCell>
                      <TableCell>{donation.location}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant="secondary">{donation.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

           <Card>
            <CardHeader>
              <CardTitle>Achievements</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              {achievements.map((achievement) => {
                const Icon = iconMap[achievement.icon];
                return (
                  <div key={achievement.id} className="flex flex-col items-center text-center gap-2 p-4 bg-secondary rounded-lg">
                    <Icon className="w-8 h-8 text-primary" />
                    <span className="text-sm font-medium text-foreground">{achievement.name}</span>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Your Donation Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
              <BarChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                 <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                    allowDecimals={false}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent />}
                />
                <Bar dataKey="donations" fill="var(--color-donations)" radius={8} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

      </main>
    </div>
  );
}
