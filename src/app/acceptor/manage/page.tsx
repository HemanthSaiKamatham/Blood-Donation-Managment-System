import PageHeader from '@/components/shared/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { bloodRequests } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';

const statusStyles: { [key: string]: string } = {
  Pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  Accepted: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  Fulfilled: 'bg-green-500/10 text-green-500 border-green-500/20',
};

export default function ManageRequestsPage() {
    return (
        <div className="flex flex-col gap-8">
            <PageHeader
                title="Manage Requests"
                description="View, update, and track all your blood requests."
            />
            <main>
                <Card>
                    <CardHeader>
                        <CardTitle>All Submitted Requests</CardTitle>
                        <CardDescription>A complete history of all blood requests from your institution.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Request ID</TableHead>
                                    <TableHead>Blood Type</TableHead>
                                    <TableHead>Units</TableHead>
                                    <TableHead>Urgency</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead><span className="sr-only">Actions</span></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {bloodRequests.map(req => (
                                    <TableRow key={req.id}>
                                        <TableCell className="font-mono text-xs">{req.id}</TableCell>
                                        <TableCell className="font-bold text-primary">{req.bloodType}</TableCell>
                                        <TableCell>{req.units}</TableCell>
                                        <TableCell>
                                            <Badge variant={req.urgency === 'High' ? 'destructive' : 'secondary'}>{req.urgency}</Badge>
                                        </TableCell>
                                        <TableCell>{req.date}</TableCell>
                                        <TableCell>
                                            <Badge className={`capitalize ${statusStyles[req.status]}`}>{req.status}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <span className="sr-only">Open menu</span>
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem>View Details</DropdownMenuItem>
                                                    <DropdownMenuItem>Update Request</DropdownMenuItem>
                                                    <DropdownMenuItem className="text-destructive">Cancel Request</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
