import axios from 'axios';

export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const serverMessage = error.response?.data?.error;

    if (typeof serverMessage === 'string' && serverMessage.trim()) {
      return serverMessage;
    }

    if (!error.response) {
      return 'Не удалось связаться с сервером. Проверьте подключение и попробуйте снова.';
    }

    if (error.response.status >= 500) {
      return 'На сервере произошла ошибка. Попробуйте позже.';
    }

    if (error.response.status === 404) {
      return 'Запрашиваемые данные не найдены.';
    }

    if (error.response.status === 400) {
      return 'Некорректный запрос. Проверьте введённые данные.';
    }

    return 'Не удалось выполнить запрос. Попробуйте снова.';
  }

  return 'Произошла непредвиденная ошибка. Попробуйте позже.';
};
