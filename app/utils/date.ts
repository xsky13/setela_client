export const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    if (isNaN(date.getTime())) return "Fecha no disponible";
    return date.toLocaleString('es-AR', {
        timeZone: 'UTC',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        day: 'numeric',
        month: 'short',
        year: '2-digit'
    });
};

export const getMinutesDifference = (date1: string, date2: string): number => {
    const start = new Date(date1).getTime();
    const end = new Date(date2).getTime();

    const diffInMs = end - start;
    return Math.floor(diffInMs / (1000 * 60));
};