export type DonationFrequency = 'ONE_TIME' | 'MONTHLY';

export type DonationCause =
  | 'ALL'
  | 'EDUCATION'
  | 'NUTRITION'
  | 'HEALTHCARE'
  | 'COMMUNITY_DEV';

export interface DonationTier {
  amount: number;
  label: string;
  impactText: string;
  popular?: boolean;
}

export interface DonorInfo {
  name: string;
  email: string;
  phone: string;
  panNumber?: string;
  address?: string;
  city?: string;
  state?: string;
  pinCode?: string;
  isAnonymous: boolean;
  requires80GReceipt: boolean;
}

export interface DonationSubmission {
  id: string;
  timestamp: string;
  amount: number;
  frequency: DonationFrequency;
  cause: DonationCause;
  donor: DonorInfo;
  paymentMethod: 'UPI' | 'CARD' | 'NETBANKING';
  receiptNumber: string;
  status: 'PENDING_GATEWAY' | 'COMPLETED' | 'PLEDGED';
}

export interface ImpactStatistic {
  id: string;
  value: number;
  suffix: string;
  label: string;
  description: string;
  iconName: string;
}

export interface SuccessStory {
  id: string;
  name: string;
  age: number;
  location: string;
  program: string;
  quote: string;
  story: string;
  imageUrl: string;
  impactMetric: string;
}
