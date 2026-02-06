import { PaymentTermEnum } from "../../api/openapi";


export interface PaymentTermOption {
  value: PaymentTermEnum;
  label: string;
}

export const PAYMENT_TERMS: PaymentTermOption[] = [
  { value: PaymentTermEnum.Gg30, label: "30 Tage" },
  { value: PaymentTermEnum.Gg14, label: "14 Tage" },
  { value: PaymentTermEnum.OnSight, label: "Bei Sicht" },
];
