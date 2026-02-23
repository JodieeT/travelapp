import { useEffect, useRef } from 'react';

const BASE = import.meta.env.VITE_API_URL || '';

export function usePriceStream(onPriceUpdate) {
  const eventSourceRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);

  useEffect(() => {
    const connect = () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }

      const url = BASE + '/api/prices/stream';
      const eventSource = new EventSource(url);
      eventSourceRef.current = eventSource;

      eventSource.addEventListener('connected', (e) => {
        console.log('[PriceStream] connected', JSON.parse(e.data));
      });

      eventSource.addEventListener('price_update', (e) => {
        const data = JSON.parse(e.data);
        console.log('[PriceStream] price_update', data);
        onPriceUpdate?.(data);
      });

      eventSource.onerror = () => {
        eventSource.close();
        reconnectTimeoutRef.current = setTimeout(connect, 3000);
      };
    };

    connect();

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [onPriceUpdate]);
}
