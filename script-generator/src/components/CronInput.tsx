const timeOptions = [
    {
        name: "",
        show: [],
    },
    {
        name: "minute",
        show: [],
    },
    {
        name: "hour",
        show: ["m"],
    },
    {
        name: "day",
        show: ["m", "h"],
    },
    {
        name: "week",
        show: ["m", "h", "dow"],
    },
    {
        name: "month",
        show: ["m", "h", "dom"],
    },
    {
        name: "reboot",
        show: [],
    },
];

export interface CronValues {
    timeOptionId: number;
    minute: number;
    hour: number;
    dow: number;
    dom: number;
}

export interface CronInputProps {
    values: CronValues;
    setValues: (values: CronValues) => unknown;
}

export function CronInput({ values, setValues }: CronInputProps) {
    function handleMinuteChange(m: number) {
        if (isNaN(m) || (m >= 0 && m < 60)) {
            setValues({ ...values, minute: m });
        }
    }

    function handleHourChange(h: number) {
        if (isNaN(h) || (h >= 0 && h < 24)) {
            setValues({ ...values, hour: h });
        }
    }

    function handleDOWChange(dow: number) {
        if (dow >= 0 && dow < 7) {
            setValues({ ...values, dow });
        }
    }

    function handleDOMChange(dom: number) {
        if (isNaN(dom) || (dom > 0 && dom <= 31)) {
            setValues({ ...values, dom });
        }
    }

    return (
        <div>
            {"Every "}

            <select
                className="input"
                value={values.timeOptionId}
                onChange={(e) => setValues({ ...values, timeOptionId: parseInt(e.target.value) })}
            >
                {timeOptions.map((option, i) => (
                    <option key={i} value={i} hidden={i == 0}>
                        {option.name}
                    </option>
                ))}
            </select>

            {timeOptions[values.timeOptionId].show.length > 0 && " at "}

            <label hidden={!timeOptions[values.timeOptionId].show.includes("m")}>
                {"minute "}
                <input
                    className="input"
                    type="number"
                    min={0}
                    max={59}
                    value={values.minute}
                    onChange={(e) => handleMinuteChange(parseInt(e.target.value))}
                />
            </label>

            <label hidden={!timeOptions[values.timeOptionId].show.includes("h")}>
                {", hour "}
                <input
                    className="input"
                    type="number"
                    min={0}
                    max={23}
                    value={values.hour}
                    onChange={(e) => handleHourChange(parseInt(e.target.value))}
                />
            </label>

            <label hidden={!timeOptions[values.timeOptionId].show.includes("dow")}>
                {", day of week "}
                <select className="input" value={values.dow} onChange={(e) => handleDOWChange(parseInt(e.target.value))}>
                    <option value={-1} hidden></option>
                    <option value={1}>monday</option>
                    <option value={2}>tuesday</option>
                    <option value={3}>wednesday</option>
                    <option value={4}>thursday</option>
                    <option value={5}>friday</option>
                    <option value={6}>saturday</option>
                    <option value={0}>sunday</option>
                </select>
            </label>

            <label hidden={!timeOptions[values.timeOptionId].show.includes("dom")}>
                {", day of month "}
                <input
                    className="input"
                    type="number"
                    min={1}
                    max={31}
                    value={values.dom}
                    onChange={(e) => handleDOMChange(parseInt(e.target.value))}
                />
            </label>
        </div>
    );
}
