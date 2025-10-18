'use client';

import { useState } from 'react';
import { smartNotificationsForMatchingRequests, SmartNotificationsForMatchingRequestsOutput } from '@/ai/flows/smart-notifications-for-matching-requests';
import PageHeader from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useDoc, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { AlertTriangle, Info, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { doc } from 'firebase/firestore';

export default function NotificationsPage() {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState<SmartNotificationsForMatchingRequestsOutput | null>(null);

    const { user } = useUser();
    const firestore = useFirestore();
    const donorDocRef = useMemoFirebase(() => {
        if (!user || !firestore) return null;
        return doc(firestore, `donors/${user.uid}`);
    }, [firestore, user]);
    const { data: donorProfile } = useDoc(donorDocRef);

    const handleGenerateNotification = async () => {
        if (!donorProfile) {
            toast({ title: 'Profile not loaded', description: 'Please wait for your profile to load.', variant: 'destructive' });
            return;
        }
        setLoading(true);
        setNotification(null);
        try {
            const input = {
                bloodType: donorProfile.bloodGroup,
                urgency: 'High',
                unitsRequired: 2,
                donorAvailability: donorProfile.availability,
            };
            const result = await smartNotificationsForMatchingRequests(input);
            setNotification(result);
            toast({
                title: 'New Smart Notification',
                description: 'An urgent request matches your profile.',
            });
        } catch (error) {
            console.error(error);
            toast({
                title: 'Error',
                description: 'Could not generate notification.',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-8">
            <PageHeader
                title="Notifications"
                description="Urgent requests and updates matching your profile."
                action={<Button onClick={handleGenerateNotification} disabled={loading || !donorProfile}>
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Check for Urgent Alerts
                </Button>}
            />

            <main className="space-y-6">
                {notification && (
                    <Card className="border-primary bg-primary/10">
                        <CardHeader className="flex flex-row items-start gap-4">
                            <AlertTriangle className="w-8 h-8 text-primary mt-1" />
                            <div>
                                <CardTitle className="text-primary">New Urgent Request!</CardTitle>
                                <CardDescription className="text-primary/80">A new high-priority request matches your blood type.</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent>
                             <p className="text-lg font-medium">{notification.notificationMessage}</p>
                        </CardContent>
                    </Card>
                )}

                <Card>
                    <CardHeader>
                        <CardTitle>Recent Alerts</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                       <div className="p-4 rounded-lg bg-secondary flex items-start gap-4">
                            <AlertTriangle className="w-5 h-5 text-yellow-500 mt-1" />
                            <div>
                                <div className="flex items-center gap-2">
                                  <p className="font-semibold">Urgent Request for A-</p>
                                  <Badge variant="destructive">High</Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">Mercy Hospital requires 3 units of A- blood for an emergency surgery. If you are available, please respond.</p>
                                <Button size="sm" className="mt-2">View Details</Button>
                            </div>
                        </div>
                         <div className="p-4 rounded-lg bg-secondary flex items-start gap-4">
                            <Info className="w-5 h-5 text-accent mt-1" />
                            <div>
                                <div className="flex items-center gap-2">
                                  <p className="font-semibold">Blood Drive this Weekend</p>
                                  <Badge variant="secondary">Event</Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">Join our community blood drive at City Hall this Saturday from 9 AM to 5 PM. All blood types are welcome!</p>
                                <Button size="sm" variant="outline" className="mt-2">Learn More</Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}