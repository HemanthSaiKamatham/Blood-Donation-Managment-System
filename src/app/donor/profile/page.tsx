'use client';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { donorProfile as initialProfile } from '@/lib/data';
import PageHeader from '@/components/shared/page-header';
import { Separator } from '@/components/ui/separator';

export default function DonorProfilePage() {
  const { toast } = useToast();
  const [profile, setProfile] = useState(initialProfile);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log('Updated profile:', profile);
    toast({
      title: 'Profile Updated',
      description: 'Your information has been saved successfully.',
    });
  };

  const handleAvailabilityChange = (checked: boolean) => {
    setProfile({ ...profile, isAvailable: checked });
    toast({
      title: `Availability set to ${checked ? 'Available' : 'Unavailable'}`,
      description: 'Hospitals will be notified of your status.',
    });
  };

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="My Profile"
        description="Manage your personal information and availability."
      />
      <main className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
            <form onSubmit={handleSubmit}>
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Keep your details up to date to ensure smooth coordination.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" value={profile.email} disabled />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="blood-type">Blood Group</Label>
                        <Select
                            value={profile.bloodType}
                            onValueChange={(value) => setProfile({ ...profile, bloodType: value })}
                        >
                            <SelectTrigger id="blood-type">
                            <SelectValue placeholder="Select blood type" />
                            </SelectTrigger>
                            <SelectContent>
                            {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((type) => (
                                <SelectItem key={type} value={type}>
                                {type}
                                </SelectItem>
                            ))}
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="last-donation">Last Donation Date</Label>
                        <Input id="last-donation" type="date" value={profile.lastDonation}
                         onChange={(e) => setProfile({ ...profile, lastDonation: e.target.value })} />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit">Save Changes</Button>
                </CardFooter>
              </Card>
            </form>
        </div>
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Donation Availability</CardTitle>
                    <CardDescription>Let hospitals know if you are available for urgent requests.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center space-x-4 rounded-md border p-4">
                        <div className="flex-1 space-y-1">
                            <p className="text-sm font-medium leading-none">
                            Ready to Donate
                            </p>
                            <p className="text-sm text-muted-foreground">
                            {profile.isAvailable ? "You are marked as available" : "You are marked as unavailable"}
                            </p>
                        </div>
                        <Switch
                            checked={profile.isAvailable}
                            onCheckedChange={handleAvailabilityChange}
                            aria-label="Toggle donation availability"
                        />
                    </div>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>Eligibility Status</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className={`p-4 rounded-lg ${profile.isEligible ? 'bg-green-900/50' : 'bg-destructive/30'}`}>
                        <p className="font-semibold text-lg">{profile.isEligible ? 'You are eligible to donate!' : 'Not currently eligible'}</p>
                        <p className="text-sm text-muted-foreground">{profile.isEligible ? 'Thank you for being a potential lifesaver.' : 'Check again after some time.'}</p>
                    </div>
                </CardContent>
            </Card>
        </div>
      </main>
    </div>
  );
}
