export type FormType = 'standard' | 'quiz' | 'assessment';

export type FormFieldType = 
  | 'text' 
  | 'textarea' 
  | 'radio' 
  | 'checkbox' 
  | 'dropdown' 
  | 'linear_scale' 
  | 'date';

export interface FormOption {
  label: string;
  value: string;
}

export interface FormFieldModel {
  id: string;
  form_id: string;
  type: FormFieldType;
  label: string;
  description?: string | null;
  is_required: boolean;
  order_index: number;
  options?: FormOption[] | null;
  scale_min?: number | null;
  scale_max?: number | null;
  scale_min_label?: string | null;
  scale_max_label?: string | null;
  correct_answer?: string | null;
  points?: number | null;
  created_at?: string;
}

export type PublicFormField = Omit<FormFieldModel, 'correct_answer'>;

export interface FormModel {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  type: FormType;
  is_active: boolean;
  header_image_url?: string | null;
  theme_color?: string | null;
  created_by?: string | null;
  created_at: string;
  updated_at?: string;
}

export interface FormResponseModel {
  id: string;
  form_id: string;
  respondent_name?: string | null;
  respondent_meta?: Record<string, any>;
  answers: Record<string, any>;
  score?: number;
  max_score?: number;
  created_at: string;
}

export interface FormSubmitPayload {
  form_id: string;
  respondent_name?: string;
  respondent_meta?: Record<string, any>;
  answers: Record<string, any>;
}

export interface FormSubmitResult {
  success: boolean;
  response_id?: string;
  score?: number;
  max_score?: number;
  message?: string;
}
