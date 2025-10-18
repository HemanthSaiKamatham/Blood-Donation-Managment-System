import PageHeader from '@/components/shared/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { campaigns } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function CampaignsPage() {
    return (
        <div className="flex flex-col gap-8">
            <PageHeader
                title="Campaign Management"
                description="Schedule donation campaigns and track their performance."
            />
            <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>All Campaigns</CardTitle>
                            <CardDescription>A list of all active and past donation campaigns.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Campaign Name</TableHead>
                                        <TableHead>Start Date</TableHead>
                                        <TableHead>End Date</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Donations</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {campaigns.map(c => (
                                        <TableRow key={c.id}>
                                            <TableCell className="font-medium">{c.name}</TableCell>
                                            <TableCell>{c.startDate}</TableCell>
                                            <TableCell>{c.endDate}</TableCell>
                                            <TableCell>
                                                <Badge variant={c.status === 'Active' ? 'default' : 'secondary'}>{c.status}</Badge>
                                            </TableCell>
                                            <TableCell className="text-right font-semibold text-primary">{c.donations}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Create New Campaign</CardTitle>
                            <CardDescription>Launch a new drive to boost donations.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="campaign-name">Campaign Name</Label>
                                <Input id="campaign-name" placeholder="e.g., Winter Holiday Drive" />
                            </div>
                             <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="start-date">Start Date</Label>
                                    <Input id="start-date" type="date" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="end-date">End Date</Label>
                                    <Input id="end-date" type="date" />
                                </div>
                             </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Description & Target</Label>
                                <Textarea id="description" placeholder="Describe the campaign goals and target audience..." />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full">Schedule Campaign</Button>
                        </CardFooter>
                    </Card>
                </div>
            </main>
        </div>
    );
}
