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
