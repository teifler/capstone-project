import { useEffect } from 'react';

export const APP_NAME = 'Crypto Cloud';

// `undefined` leaves the title alone (a child such as the 404 page may be
// setting it).
export function useDocumentTitle(title) {
  useEffect(() => {
    if (title === undefined) return;
    document.title = title ? `${title} – ${APP_NAME}` : APP_NAME;
  }, [title]);
}
