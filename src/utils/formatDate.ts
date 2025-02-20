// utils/formatDate.ts

export const formatDate = (
  date: string | Date,
  locale: string = 'es-ES',
  options?: Intl.DateTimeFormatOptions
): string => {
  if (!date) return 'N/A'; // Verifica si date es undefined o null
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return 'N/A'; // Si la fecha no es válida
  return d.toLocaleDateString(locale, options ?? {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};
