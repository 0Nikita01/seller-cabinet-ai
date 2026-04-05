type OllamaChatRequest = {
  model: string;
  systemPrompt: string;
  userPrompt: string;
  format: object;
};

export const ollamaChat = async ({
  model,
  systemPrompt,
  userPrompt,
  format,
}: OllamaChatRequest) => {
  const response = await fetch('http://localhost:11434/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      stream: false,
      keep_alive: '10m',
      format,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Ollama request failed: ${response.status} ${errorText}`);
  }

  const data = await response.json();

  return data;
};