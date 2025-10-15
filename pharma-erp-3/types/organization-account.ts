export interface OrganizationAccount {
  id: number;
  organizationId: number;
  accountName: string;
  accountNumber?: string;
  bankName?: string;
  branchName?: string;
  ifscCode?: string;
  isActive: boolean;
}

export type CreateOrganizationAccountData = Omit<OrganizationAccount, 'id' | 'isActive'>;

export type UpdateOrganizationAccountData = Partial<CreateOrganizationAccountData>;
