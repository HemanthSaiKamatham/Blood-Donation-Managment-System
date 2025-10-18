// This file contains mock data. It's recommended to remove this file
// and fetch data from a real backend service.
export const donorProfile = {
  name: 'Alex Doe',
  email: 'alex.doe@example.com',
  bloodType: 'O+',
  isEligible: true,
  lastDonation: '2024-03-15',
  isAvailable: true,
  contributionScore: 1250,
  donorLevel: 'Platinum Donor',
  donationStreak: 5,
};

export const donationHistory = [
  { id: 'd1', date: '2024-03-15', location: 'City General Hospital', units: 1, status: 'Completed' },
  { id: 'd2', date: '2023-11-20', location: 'Red Cross Center', units: 1, status: 'Completed' },
  { id: 'd3', date: '2023-07-10', location: 'Community Blood Bank', units: 1, status: 'Completed' },
  { id: 'd4', date: '2023-03-05', location: 'City General Hospital', units: 1, status: 'Completed' },
  { id: 'd5', date: '2022-10-18', location: 'Red Cross Center', units: 1, status: 'Completed' },
];

export const achievements = [
  { id: 'a1', name: 'First Donation', icon: 'Award' },
  { id: 'a2', name: 'Five-Timer', icon: 'Star' },
  { id: 'a3', name: 'Streak Keeper', icon: 'Zap' },
  { id: 'a4', name: 'Life Saver', icon: 'HeartPulse' },
  { id: 'a5', name: 'Community Hero', icon: 'Users' },
];

export const bloodRequests = [
  { id: 'r1', bloodType: 'A+', units: 2, urgency: 'High', hospital: 'City General Hospital', status: 'Pending', date: '2024-07-20' },
  { id: 'r2', bloodType: 'O-', units: 4, urgency: 'High', hospital: 'Mercy Medical Center', status: 'Fulfilled', date: '2024-07-19' },
  { id: 'r3', bloodType: 'B+', units: 1, urgency: 'Medium', hospital: 'St. Jude\'s Clinic', status: 'Accepted', date: '2024-07-18' },
  { id: 'r4', bloodType: 'AB+', units: 3, urgency: 'Low', hospital: 'City General Hospital', status: 'Pending', date: '2024-07-17' },
];

export const adminStats = {
  totalDonors: 1245,
  activeRequests: 8,
  totalDonations: 4502,
  fulfillmentRate: 92.5,
};

export const bloodTypeDistribution = [
  { name: 'O+', value: 38 },
  { name: 'O-', value: 7 },
  { name: 'A+', value: 34 },
  { name: 'A-', value: 6 },
  { name: 'B+', value: 9 },
  { name: 'B-', value: 2 },
  { name: 'AB+', value: 3 },
  { name: 'AB-', value: 1 },
];

export const donationTrends = [
    { month: 'Jan', donations: 350 },
    { month: 'Feb', donations: 380 },
    { month: 'Mar', donations: 410 },
    { month: 'Apr', donations: 390 },
    { month: 'May', donations: 420 },
    { month: 'Jun', donations: 450 },
];

export const campaigns = [
    { id: 'c1', name: 'Summer Drive 2024', startDate: '2024-06-01', endDate: '2024-08-31', status: 'Active', donations: 120 },
    { id: 'c2', name: 'Winter Holidays Appeal', startDate: '2023-12-01', endDate: '2023-12-31', status: 'Completed', donations: 250 },
    { id: 'c3', name: 'World Blood Donor Day', startDate: '2024-06-14', endDate: '2024-06-14', status: 'Completed', donations: 85 },
];
