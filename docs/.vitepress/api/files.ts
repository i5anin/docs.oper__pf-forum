// @api/files.ts
import { handleApiError, handleResponse, axiosInstance } from './config'

type FileKind = 'dir' | 'file'

export interface FileItem {
  name: string
  relativePath: string
  type: FileKind
}

export interface FilesResponse {
  base: string
  path: string
  items: FileItem[]
}

export async function getFiles(path: string = ''): Promise<FilesResponse> {
  return axiosInstance
    .get<FilesResponse>('/files', {
      params: path ? { path } : undefined,
    })
    .then(handleResponse)
    .catch(handleApiError)
}

export async function downloadFile(path: string): Promise<Blob> {
  return axiosInstance
    .get('/files/show', {
      params: { file: path },
      responseType: 'blob',
    })
    .then(response => response.data)
    .catch(handleApiError)
}
