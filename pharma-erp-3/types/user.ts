export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  employeeId?: string;
  phone?: string;
  dob?: string;
  gender?: string;
  department: string;
  designation: string;
  reportingManagerId?: number;
  isActive: boolean;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  createdAt?: string;
  updatedAt?: string;
  lastLogin?: string;
  password: string;
  avatar?:string;
  status?: string,
  roles?:any
}

export interface UserRole {
  id : number
  userId:number
  roleId:number
  assignedAt:string
  assignedBy:string
}

export interface UserActivity {
  id: number
  userId: number
  activityType: string
  description: string
  timestamp: string
  ipAddress?: string
  userAgent?: string
}



export type CreateUserData = Omit<User, 'id'>;

export type UpdateUserData = Partial<Omit<User, 'id'>> & {
  isActive: boolean;
};
