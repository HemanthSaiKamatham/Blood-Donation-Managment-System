'use client';
import Link from 'next/link';
import PageHeader from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertCircle, Hourglass } from 'lucide-react';
import { useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';

const statusConfig: { [key: string]: { icon: React.ElementType, color: string } } = {
    Pending: { icon: Hourglass, color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' },
    Accepted: { icon: CheckCircle2, color: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
    Fulfilled: { icon: CheckCircle2, color: 'bg-green-500/10 text-green-500 border-green-500/20' }
};

export default function AcceptorDashboardPage() {
    const { user } = useUser();
    const firestore = useFirestore();

    const requestsQuery = useMemoFirebase(() => {
        if (!user || !firestore) return null;
        // Corrected path for blood requests
        return query(collection(firestore, `acceptors/${user.uid}/bloodRequests`));
    }, [firestore, user]);
    
    const { data: bloodRequests, isLoading } = useCollection(requestsQuery);

    const pendingRequests = bloodRequests?.filter(r => r.status === 'Pending').length || 0;
    const fulfilledRequests = bloodRequests?.filter(r => r.status === 'Fulfilled').length || 0;
    const totalRequests = bloodRequests?.length || 0;

    if (isLoading) {
        return <div>Loading dashboard...</div>;
    }

    return (
        <div className="flex flex-col gap-8">
            <PageHeader
                title="Acceptor Dashboard"
                description="Monitor and manage your blood supply requests."
                action={
                    <Link href="/acceptor/submit">
                        <Button>Create New Request</Button>
                    </Link>
                }
            />
            <main className="grid gap-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Active Requests</CardTitle>
                            <AlertCircle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{pendingRequests}</div>
                            <p className="text-xs text-muted-foreground">Currently pending fulfillment</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Fulfilled This Month</CardTitle>
                             <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{fulfilledRequests}</div>
                            <p className="text-xs text-muted-foreground">Requests successfully met</p>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
                             <Hourglass className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalRequests}</div>
                            <p className="text-xs text-muted-foreground">All-time request history</p>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Recent Requests</CardTitle>
                        <CardDescription>A summary of your most recent blood requests.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Blood Type</TableHead>
                                    <TableHead>Units</TableHead>
                                    <TableHead>Urgency</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead className="text-right">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {bloodRequests?.slice(0, 5).map(req => {
                                    const statusInfo = statusConfig[req.status as keyof typeof statusConfig] || statusConfig.Pending;
                                    return (
                                        <TableRow key={req.id}>
                                            <TableCell className="font-bold text-primary">{req.bloodGroup}</TableCell>
                                            <TableCell>{req.unitsRequired}</TableCell>
                                            <TableCell>
                                                <Badge variant={req.urgency === 'High' ? 'destructive' : 'secondary'}>{req.urgency}</Badge>
                                            </TableCell>
                                            <TableCell>{new Date(req.requestDate).toLocaleDateString()}</TableCell>
                                            <TableCell className="text-right">
                                                 <Badge className={`capitalize ${statusInfo.color}`}>{req.status}</Badge>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
