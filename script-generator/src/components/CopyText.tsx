import { useRef } from "react";

export interface CopyTextProps {
    btnLabel: string;
    text: string;
}

export function CopyText({ text, btnLabel }: CopyTextProps) {
    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    function handleCopy() {
        navigator.clipboard.writeText(text);
        textAreaRef.current?.select();
    }

    return (
        <div className="flex flex-col gap-2">
            <textarea
                ref={textAreaRef}
                className="input font-mono"
                value={text}
                onChange={() => null} /* stop react from complaining */
                rows={5}
            ></textarea>
            <div>
                <button className="input" onClick={handleCopy}>
                    {btnLabel}
                </button>
            </div>
        </div>
    );
}
