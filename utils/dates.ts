import { DateRange } from "react-day-picker";

export const comercialDate = (ISOdate: Date) => {
  const day = String(ISOdate.getDate()).padStart(2, "0");
  const month = String(ISOdate.getMonth() + 1).padStart(2, "0");
  const year = ISOdate.getFullYear();

  return `${day}/${month}/${year}`;
};

export const convertToLargeDate = (ISOdate: Date) => {
  const date = new Date(ISOdate);

  const months = [
    "janeiro",
    "fevereiro",
    "março",
    "abril",
    "maio",
    "junho",
    "julho",
    "agosto",
    "setembro",
    "outubro",
    "novembro",
    "dezembro",
  ];

  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${day} de ${month} de ${year}, às ${hours}:${minutes}`;
};

export const convertToShortDate = (ISOdate: Date) => {
  const date = new Date(ISOdate);

  const months = [
    "janeiro",
    "fevereiro",
    "março",
    "abril",
    "maio",
    "junho",
    "julho",
    "agosto",
    "setembro",
    "outubro",
    "novembro",
    "dezembro",
  ];

  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `${month} de ${year}`;
};

export const convertDateToYouTubeLike = (ISOdate: Date) => {
  const date = new Date(ISOdate);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInSeconds = Math.floor(diffInMs / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInMonths = Math.floor(diffInDays / 30);

  if (diffInSeconds < 60) {
    return `${diffInSeconds <= 1 ? "agora" : `há ${diffInSeconds} segundos`}`;
  }

  if (diffInMinutes < 60) {
    return `há ${diffInMinutes} ${diffInMinutes === 1 ? "minuto" : "minutos"}`;
  }

  if (diffInHours < 24) {
    return `há ${diffInHours} ${diffInHours === 1 ? "hora" : "horas"}`;
  }

  if (diffInDays < 30) {
    return `há ${diffInDays} ${diffInDays === 1 ? "dia" : "dias"}`;
  }

  return `há ${diffInMonths} ${diffInMonths === 1 ? "mês" : "meses"}`;
};

export const formatDateRange = (
  dateRange: DateRange | undefined,
  options?: Intl.DateTimeFormatOptions
) => {
  const from = dateRange?.from?.toLocaleDateString("pt-BR", options);
  const to = dateRange?.to?.toLocaleDateString("pt-BR", options);
  return `${from} — ${to}`;
};
