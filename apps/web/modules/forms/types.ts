export interface FieldConfig {
  options?: string[];
  maxLength?: number;
  min?: number | string;
  max?: number | string;
  pattern?: string;
  step?: number;
  [key: string]: unknown;
}

export interface FieldData {
  id: string;
  type: string;
  label: string;
  required: boolean;
  config: FieldConfig;
  order: number;
}
