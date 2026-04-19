/**
 * Bulk Generation API Functions
 */

import { api } from "./api";
import type {
  BulkGenerationUploadResponse,
  BulkGenerationProgressResponse,
  BulkGenerationResultsResponse,
  BulkGenerationDetail,
  FieldMapping,
} from "@/types/bulk-generation";

export const bulkGenerationApi = {
  /**
   * Upload Excel file for bulk generation
   */
  async uploadFile(
    file: File,
    title: string,
    scenarioId: string,
    templateId?: string,
    description?: string,
  ): Promise<BulkGenerationUploadResponse> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("scenario_id", scenarioId);
    if (templateId) formData.append("template_id", templateId);
    if (description) formData.append("description", description);

    return api.uploadFile<BulkGenerationUploadResponse>(
      "/bulk-generations/upload",
      formData,
    );
  },

  /**
   * Get bulk generation details
   */
  async getDetails(bulkGenerationId: string): Promise<BulkGenerationDetail> {
    return api.get<BulkGenerationDetail>(
      `/bulk-generations/${bulkGenerationId}`,
    );
  },

  /**
   * Update field mapping
   */
  async updateFieldMapping(
    bulkGenerationId: string,
    fieldMapping: FieldMapping,
  ): Promise<BulkGenerationDetail> {
    return api.patch<BulkGenerationDetail>(
      `/bulk-generations/${bulkGenerationId}/field-mapping`,
      { field_mapping: fieldMapping },
    );
  },

  /**
   * Start bulk generation
   */
  async startGeneration(
    bulkGenerationId: string,
    temperature?: number,
    maxTokens?: number,
    modelVariant?: string,
  ): Promise<{ status: string; message: string; bulk_generation_id: string }> {
    return api.post(
      `/bulk-generations/${bulkGenerationId}/generate`,
      {
        temperature,
        max_tokens: maxTokens,
        model_variant: modelVariant,
      },
    );
  },

  /**
   * Get generation progress
   */
  async getProgress(
    bulkGenerationId: string,
  ): Promise<BulkGenerationProgressResponse> {
    return api.get<BulkGenerationProgressResponse>(
      `/bulk-generations/${bulkGenerationId}/progress`,
    );
  },

  /**
   * Get paginated results
   */
  async getResults(
    bulkGenerationId: string,
    page: number = 1,
    perPage: number = 20,
  ): Promise<BulkGenerationResultsResponse> {
    return api.get<BulkGenerationResultsResponse>(
      `/bulk-generations/${bulkGenerationId}/results`,
      { page, per_page: perPage },
    );
  },

  /**
   * Export results as Excel
   */
  async exportResults(bulkGenerationId: string): Promise<void> {
    return api.downloadFile(
      `/bulk-generations/${bulkGenerationId}/results/export`,
      `bulk_results_${bulkGenerationId}.xlsx`,
    );
  },

  /**
   * Delete bulk generation campaign
   */
  async delete(bulkGenerationId: string): Promise<{ message: string }> {
    return api.delete(`/bulk-generations/${bulkGenerationId}`);
  },

  /**
   * Create distributions and campaign from bulk generation
   */
  async distribute(
    bulkGenerationId: string,
    options: {
      campaign_name?: string;
      send_immediately?: boolean;
    },
  ): Promise<{
    campaign_id: string;
    distributions_created: number;
    distributions_pending: number;
    status: string;
    message: string;
  }> {
    return api.post(
      `/bulk-generations/${bulkGenerationId}/distribute`,
      options,
    );
  },
};
