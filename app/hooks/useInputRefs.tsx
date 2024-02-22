import { useRef, useCallback } from "react";

type TRefType = HTMLElement | null;

export default function useInputRefs() {
    const inputRefs = useRef<Record<string, TRefType>>({});

    const setInputRef = useCallback((name: string, ref: TRefType) => {
        inputRefs.current[name] = ref;
    }, []);

    return { inputRefs, setInputRef };
}
