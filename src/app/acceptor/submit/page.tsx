'use client';

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { aiPoweredRequestFulfillment, AIPoweredRequestFulfillmentOutput } from '@/ai/flows/ai-powered-request-fulfillment';
import { useToast } from '@/hooks/use-toast';

import PageHeader from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Loader2, Users } from 'lucide-react';

const requestSchema = z.object({
  bloodType: z.string().min(1, 'Blood type is required'),
  unitsRequired: z.coerce.number().min(1, 'At least 1 unit is required'),
  urgency: z.string().min(1, 'Urgency level is required'),
  location: z.string().min(1, 'Location is required'),
  requestDetails: z.string().optional(),
});

type RequestFormValues = z.infer<typeof requestSchema>;

export default function SubmitRequestPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showFulfillment, setShowFulfillment] = useState(false);
  const [fulfillmentResult, setFulfillmentResult] = useState<AIPoweredRequestFulfillmentOutput | null>(null);

  const form = useForm<RequestFormValues>({
    resolver: zodResolver(requestSchema),
    defaultValues: {
      bloodType: '',
      unitsRequired: 1,
      urgency: 'Medium',
      location: 'City General Hospital',
      requestDetails: '',
    },
  });

  const onSubmit: SubmitHandler<RequestFormValues> = async (data) => {
    setLoading(true);
    try {
        const aiInput = {
            ...data,
            donorAvailability: 'Find all available donors',
        };
        const result = await aiPoweredRequestFulfillment(aiInput);
        setFulfillmentResult(result);
        setShowFulfillment(true);
        form.reset();
        toast({
            title: 'Request Submitted & AI Analysis Complete!',
            description: 'Potential donors have been identified.',
        });
    } catch (error) {
        console.error(error);
        toast({
            title: 'AI Fulfillment Failed',
            description: 'Could not match donors for this request.',
            variant: 'destructive',
        });
    } finally {
        setLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-8">
        <PageHeader title="Submit a Blood Request" description="Fill out the form below to find matching donors." />
        <main>
          <Card className="max-w-3xl mx-auto">
            <CardHeader>
              <CardTitle>New Request Details</CardTitle>
              <CardDescription>Your request will be matched with available donors by our AI engine.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <FormField
                            control={form.control}
                            name="bloodType"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Blood Type</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger><SelectValue placeholder="Select Type" /></SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(type => 
                                                <SelectItem key={type} value={type}>{type}</SelectItem>
                                            )}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="unitsRequired"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Units Required</FormLabel>
                                    <FormControl><Input type="number" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="urgency"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Urgency</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger><SelectValue placeholder="Select Urgency" /></SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="Low">Low</SelectItem>
                                            <SelectItem value="Medium">Medium</SelectItem>
                                            <SelectItem value="High">High</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Location / Hospital</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="requestDetails"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Additional Details (Optional)</FormLabel>
                                <FormControl><Textarea placeholder="e.g., for scheduled surgery, patient details..." {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" disabled={loading} className="w-full">
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Submit Request & Find Donors
                    </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </main>
      </div>

      <Dialog open={showFulfillment} onOpenChange={setShowFulfillment}>
        <DialogContent className="sm:max-w-md">
            <DialogHeader>
                <DialogTitle className="flex items-center gap-2"><Users className="text-primary"/> AI-Powered Fulfillment Plan</DialogTitle>
                <DialogDescription>
                    Our AI has identified the following potential donors and fulfillment strategy.
                </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto p-1">
                <div className="space-y-1">
                    <h3 className="font-semibold">Matched Donors</h3>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{fulfillmentResult?.matchedDonors || 'No specific donors found.'}</p>
                </div>
                <div className="space-y-1">
                    <h3 className="font-semibold">Fulfillment Summary</h3>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{fulfillmentResult?.fulfillmentSummary || 'Unable to generate summary.'}</p>
                </div>
            </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
