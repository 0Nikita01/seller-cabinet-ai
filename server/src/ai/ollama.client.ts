type OllamaGenerateParams = {
  model: string;
  systemPrompt: string;
  prompt: string;
  format?: object;
};

type OllamaGenerateResponse = {
  model: string;
  response: string;
  done: boolean;
};

export const ollamaGenerate  = async ({
  model,
  systemPrompt,
  prompt,
  format,
}: OllamaGenerateParams): Promise<OllamaGenerateResponse> => {
  const response = await fetch('http://localhost:11434/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      prompt,
      system: systemPrompt,
      stream: false,
      keep_alive: '10m',
      format,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Ollama request failed: ${response.status} ${errorText}`);
  }

  const data = await response.json();

  return data as OllamaGenerateResponse;
};