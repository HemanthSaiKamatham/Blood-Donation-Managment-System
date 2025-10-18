'use client';
import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import PageHeader from '@/components/shared/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Bell, MapPin } from 'lucide-react';

const bloodCenters = [
    { id: 'bc1', name: 'City General Hospital Blood Bank' },
    { id: 'bc2', name: 'Downtown Red Cross Center' },
    { id: 'bc3', name: 'Community Blood Drive HQ' },
];

const timeSlots = ['09:00 AM', '11:00 AM', '01:00 PM', '03:00 PM'];

interface Appointment {
    id: string;
    date: Date;
    time: string;
    center: string;
}

export default function SchedulePage() {
    const { toast } = useToast();
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [center, setCenter] = useState<string>('');
    const [time, setTime] = useState<string>('');
    const [appointments, setAppointments] = useState<Appointment[]>([]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (date && center && time) {
            const newAppointment: Appointment = {
                id: `app_${Date.now()}`,
                date,
                time,
                center: bloodCenters.find(c => c.id === center)?.name || 'Unknown Center',
            };
            setAppointments([newAppointment, ...appointments]);
            toast({
                title: 'Appointment Scheduled!',
                description: `We'll see you on ${date.toLocaleDateString()} at ${time}.`,
            });
            // Reset form
            setDate(new Date());
            setCenter('');
            setTime('');
        } else {
            toast({
                title: 'Incomplete Information',
                description: 'Please select a date, center, and time.',
                variant: 'destructive',
            });
        }
    };

    return (
        <div className="flex flex-col gap-8">
            <PageHeader title="Schedule a Donation" description="Book your next appointment to save lives." />
            <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Book an Appointment</CardTitle>
                        <CardDescription>Select a date, center, and time slot below.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="flex justify-center">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                className="rounded-md border"
                                disabled={(day) => day < new Date(new Date().setDate(new Date().getDate() - 1))}
                            />
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <Select value={center} onValueChange={setCenter}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a Donation Center" />
                                </SelectTrigger>
                                <SelectContent>
                                    {bloodCenters.map(c => (
                                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select value={time} onValueChange={setTime}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a Time Slot" />
                                </SelectTrigger>
                                <SelectContent>
                                    {timeSlots.map(t => (
                                        <SelectItem key={t} value={t}>{t}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Button type="submit" className="w-full">Schedule Now</Button>
                        </form>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Upcoming Appointments</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {appointments.length > 0 ? (
                            appointments.map(app => (
                                <div key={app.id} className="p-4 bg-secondary rounded-lg space-y-2">
                                    <p className="font-semibold">{app.date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                    <p className="text-sm text-muted-foreground flex items-center gap-2"><Bell className="w-4 h-4 text-primary" /> {app.time}</p>
                                    <p className="text-sm text-muted-foreground flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" /> {app.center}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-muted-foreground text-sm text-center py-8">No upcoming appointments.</p>
                        )}
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
