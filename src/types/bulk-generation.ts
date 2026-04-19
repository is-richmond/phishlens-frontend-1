// Bulk Generation Types

export interface BulkGenerationUploadResponse {
  bulk_generation_id: string;
  total_rows: number;
  column_headers: string[];
  auto_mapping: Record<string, string>;
  preview_rows: Record<string, any>[];
}

export interface FieldMapping {
  [column_index: string]: string;
}

export interface BulkGenerationProgressResponse {
  bulk_generation_id: string;
  status: "uploaded" | "mapped" | "processing" | "completed" | "failed";
  total_rows: number;
  generated_count: number;
  failed_count: number;
  progress_percent: number;
}

export interface BulkGenerationResultItem {
  id: string;
  row_index: number;
  input_data: Record<string, any>;
  generated_subject: string | null;
  generated_message: string | null;
  status: "pending" | "generated" | "failed";
  error_message: string | null;
  created_at: string;
}

export interface BulkGenerationResultsResponse {
  results: BulkGenerationResultItem[];
  pagination: {
    page: number;
    per_page: number;
    total: number;
  };
}

export interface BulkGenerationDetail {
  id: string;
  title: string;
  original_filename: string;
  description: string | null;
  status: string;
  scenario_id: string;
  template_id: string | null;
  field_mapping: Record<string, string>;
  total_rows: number;
  generated_count: number;
  failed_count: number;
  temperature: string;
  max_tokens: number;
  model_variant: string;
  created_at: string;
  updated_at: string;
}
