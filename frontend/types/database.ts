// Database types matching Java backend models

export enum UserRole {
  ADMIN = 'BUILDING_MANAGER',
  RESIDENT = 'RESIDENT'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

export interface User {
  id: number;
  fullName: string;
  email: string;
  role: UserRole;
  createdAt?: string;
  updatedAt?: string;
}

export interface Building {
  id: number;
  name: string;
  address: string;
  createdAt: string;
  updatedAt: string;
  units?: Unit[];
}

export interface UnitBalance {
  id: number;
  unitId: number;
  balance: number;
  createdAt: string;
  updatedAt: string;
}

export interface Unit {
  id: number;
  buildingId: number;
  unitNumber: string;
  area: number;
  residents: number;
  floor: number | null;
  createdAt: string;
  updatedAt: string;
  building?: Building;
  balance?: UnitBalance;
  fees?: UnitFee[];
}

export interface UnitFee {
  id: number;
  unitId: number;
  month: string; // LocalDate as ISO string
  amount: number;
  dueFrom: string; // LocalDate as ISO string
  dueTo: string; // LocalDate as ISO string
  isPaid: boolean;
  createdAt: string;
  updatedAt: string;
  unit?: Unit;
}

export interface Payment {
  id: number;
  unitFeeId: number;
  userId: number | null;
  amount: number;
  paymentDate: string | null;
  bankReference: string;
  status: PaymentStatus;
  createdAt: string;
  updatedAt: string;
  unitFee?: UnitFee;
  user?: User;
}

export interface Receipt {
  id: number;
  paymentId: number;
  receiptNumber: string;
  generatedAt: string;
  pdfUrl: string | null;
  payment?: Payment;
}

export interface Budget {
  id: number;
  year: number;
  maintenanceAmount: number;
  repairAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface MaintenanceService {
  id: number;
  name: string;
  provider: string;
  monthlyCost: number;
  startDate: string; // LocalDate
  endDate: string | null; // LocalDate
  createdAt: string;
  updatedAt: string;
}

export interface VotesOption {
  id: number;
  pollId: number;
  optionText: string;
}

export interface VotesPoll {
  id: number;
  title: string;
  description: string | null;
  startAt: string; // LocalDateTime
  endAt: string; // LocalDateTime
  createdBy: User | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  options?: VotesOption[];
}

export interface UserVote {
  id: number;
  pollId: number;
  userId: number;
  optionId: number;
  votedAt: string;
  poll?: VotesPoll;
  user?: User;
  option?: VotesOption;
}

// Extended types with additional computed fields
export interface UnitFeeWithDetails extends UnitFee {
  unit?: Unit & { building?: Building };
  payment?: Payment;
}

export interface PaymentWithDetails extends Payment {
  unitFee?: UnitFeeWithDetails;
  user?: User;
  receipt?: Receipt;
}

export interface VotesPollWithResults extends VotesPoll {
  options?: (VotesOption & { voteCount?: number })[];
  totalVotes?: number;
  userVote?: UserVote;
}