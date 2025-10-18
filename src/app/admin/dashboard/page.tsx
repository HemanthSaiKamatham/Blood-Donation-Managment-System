'use client';

import { useState } from 'react';
import { Bar, BarChart, Line, LineChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { generateSupplyDemandInsights, SupplyDemandOutput } from '@/ai/flows/ai-driven-insights-on-supply-demand';

import PageHeader from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from '@/components/ui/chart';
import { useToast } from '@/hooks/use-toast';
import { adminStats, bloodTypeDistribution, donationTrends } from '@/lib/data';
import { Loader2, Droplets, Users, HeartHandshake, Percent } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const bloodTypeChartConfig = {
  value: { label: 'Percentage', color: 'hsl(var(--primary))' },
} satisfies ChartConfig;

const trendsChartConfig = {
  donations: { label: 'Donations', color: 'hsl(var(--accent))' },
} satisfies ChartConfig;

export default function AdminDashboardPage() {
    const { toast } = useToast();
    const [loadingInsights, setLoadingInsights] = useState(false);
    const [insights, setInsights] = useState<SupplyDemandOutput | null>(null);

    const handleGenerateInsights = async () => {
        setLoadingInsights(true);
        setInsights(null);
        try {
            const result = await generateSupplyDemandInsights({
                donorData: '1245 total donors, 60% active in last 6 months.',
                requestData: '4502 requests, 92.5% fulfillment rate, high demand for O- and A+.',
                regionalData: 'Shortage reported in North District due to seasonal flu.'
            });
            setInsights(result);
            toast({
                title: 'AI Insights Generated',
                description: 'Supply, demand, and engagement analysis is ready.',
            });
        } catch (error) {
            console.error(error);
            toast({ title: 'Error', description: 'Could not generate AI insights.', variant: 'destructive' });
        } finally {
            setLoadingInsights(false);
        }
    };

    return (
        <div className="flex flex-col gap-8">
            <PageHeader
                title="Admin Analytics"
                description="Comprehensive overview of platform activity and trends."
            />
            <main className="grid gap-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Total Donors</CardTitle><Users className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{adminStats.totalDonors.toLocaleString()}</div></CardContent></Card>
                    <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Total Donations</CardTitle><Droplets className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{adminStats.totalDonations.toLocaleString()}</div></CardContent></Card>
                    <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Active Requests</CardTitle><HeartHandshake className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{adminStats.activeRequests}</div></CardContent></Card>
                    <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Fulfillment Rate</CardTitle><Percent className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{adminStats.fulfillmentRate}%</div></CardContent></Card>
                </div>
                
                <Card>
                    <CardHeader>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <div>
                                <CardTitle>AI-Driven Insights</CardTitle>
                                <CardDescription>Analysis of supply, demand, and donor engagement.</CardDescription>
                            </div>
                            <Button onClick={handleGenerateInsights} disabled={loadingInsights}>
                                {loadingInsights && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Generate Insights
                            </Button>
                        </div>
                    </CardHeader>
                    {insights && (
                        <CardContent className="grid md:grid-cols-3 gap-6">
                            <div className="p-4 bg-secondary rounded-lg space-y-1"><h4 className="font-semibold">Supply/Demand Analysis</h4><p className="text-sm text-muted-foreground">{insights.supplyDemandAnalysis}</p></div>
                            <div className="p-4 bg-secondary rounded-lg space-y-1"><h4 className="font-semibold">Regional Shortages</h4><p className="text-sm text-muted-foreground">{insights.regionalShortages}</p></div>
                            <div className="p-4 bg-secondary rounded-lg space-y-1"><h4 className="font-semibold">Donor Engagement</h4><p className="text-sm text-muted-foreground">{insights.donorEngagementInsights}</p></div>
                        </CardContent>
                    )}
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    <Card className="lg:col-span-2">
                        <CardHeader><CardTitle>Blood Type Distribution</CardTitle></CardHeader>
                        <CardContent>
                            <ChartContainer config={bloodTypeChartConfig} className="h-[300px] w-full">
                                <BarChart accessibilityLayer data={bloodTypeDistribution} layout="vertical" margin={{ left: 10 }}>
                                    <CartesianGrid horizontal={false} />
                                    <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} tickMargin={10} className="text-xs" />
                                    <XAxis type="number" hide />
                                    <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                                    <Bar dataKey="value" layout="vertical" fill="var(--color-value)" radius={4}>
                                    </Bar>
                                </BarChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>
                    <Card className="lg:col-span-3">
                        <CardHeader><CardTitle>Donation Trends</CardTitle></CardHeader>
                        <CardContent>
                            <ChartContainer config={trendsChartConfig} className="h-[300px] w-full">
                                <LineChart accessibilityLayer data={donationTrends}>
                                    <CartesianGrid vertical={false} />
                                    <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={10} />
                                    <YAxis tickLine={false} axisLine={false} tickMargin={10} />
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                    <Line type="monotone" dataKey="donations" stroke="var(--color-donations)" strokeWidth={3} dot={false} />
                                </LineChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
