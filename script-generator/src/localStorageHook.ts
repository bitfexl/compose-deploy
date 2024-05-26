import { useEffect, useState } from "react";

export function useLocalStorage<S>(key: string, initialValue: S): [S, (val: S) => unknown] {
    const [value, setValue] = useState<S>(() => {
        const storedValue = localStorage.getItem(key);

        if (storedValue == null) {
            return initialValue;
        }

        try {
            return JSON.parse(storedValue);
        } catch (error) {
            console.error(error);
            return initialValue;
        }
    });

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(value));
    }, [key, value]);

    return [value, setValue];
}
