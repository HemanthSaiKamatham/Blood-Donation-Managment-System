'use client';

import { Award, HeartPulse, Star, Users, Zap } from 'lucide-react';
import type { Icon } from 'lucide-react';
import { collection, doc } from 'firebase/firestore';

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

import PageHeader from '@/components/shared/page-header';
import { achievements } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { useCollection, useDoc, useFirestore, useMemoFirebase, useUser } from '@/firebase';

const iconMap: { [key: string]: Icon } = { Award, Star, Zap, HeartPulse, Users };

export default function DonorDashboardPage() {
  const { user } = useUser();
  const firestore = useFirestore();

  const donorDocRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return doc(firestore, `users/${user.uid}/donors/${user.uid}`);
  }, [firestore, user]);
  const { data: donorProfile, isLoading: isDonorLoading } = useDoc(donorDocRef);
  
  const donationsColRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return collection(firestore, `donors/${user.uid}/donations`);
  }, [firestore, user]);
  const { data: donationHistory, isLoading: isDonationsLoading } = useCollection(donationsColRef);

  if (isDonorLoading || isDonationsLoading) {
    return <div>Loading dashboard...</div>;
  }
  
  const profile = donorProfile || { firstName: 'Donor', contributionScore: 0, donorLevel: 'Newbie', donationStreak: 0 };


  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Dashboard"
        description={`Welcome back, ${profile.firstName}! Here's your impact.`}
      />
      <main className="grid gap-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:border-primary/80 transition-all">
            <CardHeader>
              <CardTitle>Contribution Score</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-primary">
                {profile.contributionScore.toLocaleString()}
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
                {profile.donorLevel}
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
                {profile.donationStreak || 0}
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
                    <TableHead className="text-right">Units</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {donationHistory?.slice(0, 5).map((donation) => (
                    <TableRow key={donation.id}>
                      <TableCell>{new Date(donation.donationDate).toLocaleDateString()}</TableCell>
                      <TableCell>{donation.donationCenter}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant="secondary">{donation.unitsDonated}</Badge>
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
      </main>
    </div>
  );
}
