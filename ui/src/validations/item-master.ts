import z from "zod"

export const itemTypeSchema = z.object({
  code: z.string().min(1, "Code is required"),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  parentTypeId: z.string()
  .optional()
  .transform((val) => {
    if (!val || val === "") return undefined;
    const num = parseFloat(val);
    return isNaN(num) ? undefined : num;
  }),
  isActive: z.coerce.boolean().default(true),
});

export const hsnMasterSchema = z.object({
  code: z.string().min(1, "Code is required"),
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  hsnType: z.string().optional(),
  uqc: z.string().optional(),
  igstRate: z.string()
    .optional()
    .transform((val) => {
      if (!val || val === "") return undefined;
      const num = parseFloat(val);
      return isNaN(num) ? undefined : num;
    }),
  cgstRate: z.string()
    .optional()
    .transform((val) => {
      if (!val || val === "") return undefined;
      const num = parseFloat(val);
      return isNaN(num) ? undefined : num;
    }),
  sgstRate: z.string()
    .optional()
    .transform((val) => {
      if (!val || val === "") return undefined;
      const num = parseFloat(val);
      return isNaN(num) ? undefined : num;
    }),
  cessRate: z.string()
    .optional()
    .transform((val) => {
      if (!val || val === "") return undefined;
      const num = parseFloat(val);
      return isNaN(num) ? undefined : num;
    }),
  isReverseCharges: z.coerce.boolean().default(false),
  isActive: z.coerce.boolean().default(true),
});

export type ItemTypeFormData = z.infer<typeof itemTypeSchema>;
export type HsnMasterFormData = z.infer<typeof hsnMasterSchema>;