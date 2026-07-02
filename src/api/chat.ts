import apiClient from './client';

export async function askQuestion(keyword: string): Promise<string> {
  const response = await apiClient.get<string>('/documents/chat/ask', {
    params: { keyword },
    responseType: 'text',
  });
  return response.data;
}