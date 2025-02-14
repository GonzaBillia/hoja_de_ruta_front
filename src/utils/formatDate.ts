// utils/formatDate.ts

export const formatDate = (
    date: string | Date,
    locale: string = 'es-ES',
    options?: Intl.DateTimeFormatOptions
  ): string => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString(locale, options ?? {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  