import { FormInput } from "@/components/shared/forms/form-input"
import { FormCustom } from "@/components/shared/forms/form-custom"
import { Control } from "react-hook-form";
import { User } from "@/types/user";
import { FormSelect } from "@/components/shared/forms/form-select";
import { UserSelector } from "@/components/shared/user-selector";

interface UserInformationFormProps {
  control: Control<User>
}

export function UserInformationForm({ control }: UserInformationFormProps) {

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormInput
        control={control}
        name="username"
        label="Username"
        placeholder="Enter username"
        inputProps={{
          type: "text",
          autoComplete: "name",
        }}
        disabled={false}
      />
      <FormInput
        control={control}
        name="password"
        label="Password"
        placeholder="Enter password"
        inputProps={{
          type: "password",
          autoComplete: "password",
        }}
        disabled={false}
      />

      <FormInput
        control={control}
        name="email"
        label="Email"
        placeholder="Enter email"
        inputProps={{
          type: "email",
          autoComplete: "email",
        }}
        disabled={false}
      />
      <FormInput
        control={control}
        name="firstName"
        label="First Name"
        placeholder="Enter first name"
        inputProps={{
          type: "text",
          autoComplete: "name",
        }}
        disabled={false}
      />
      <FormInput
        control={control}
        name="lastName"
        label="Last Name"
        placeholder="Enter last name"
        inputProps={{
          type: "text",
          autoComplete: "name",
        }}
        disabled={false}
      />

      <FormSelect
        control={control}
        name="gender"
        label="Gender"
        options={[
          { value: 'M', label: 'Male' },
          { value: 'F', label: 'Female' },
          { value: 'O', label: 'Other' },
        ]}
        placeholder="Select gender"
      />

      <FormInput
        control={control}
        name="employeeId"
        label="Employee ID"
        placeholder="Enter employee ID"
        inputProps={{
          type: "text",
          autoComplete: "employee-id",
        }}
        disabled={false}
      />

      <FormCustom
        control={control}
        name="reportingManagerId"
        label="Reporting Manager"
        className="w-full"
        containerClassName="w-full"
      >
        {({ field }) => (
          <UserSelector
            value={field.value?.toString()}
            onChange={(value) => field.onChange(Number(value))}
            disabled={field.disabled}
          />
        )}
      </FormCustom>

      <FormInput
        control={control}
        name="phone"
        label="Phone"
        placeholder="Enter phone number"
        inputProps={{
          type: "tel",
          autoComplete: "phone",
        }}
        disabled={false}
      />

      <FormInput
        control={control}
        name="dob"
        label="Date of Birth"
        placeholder="Enter date of birth"
        inputProps={{
          type: "date",
          autoComplete: "dob",
        }}
        disabled={false}
      />
    </div>
  );
}
