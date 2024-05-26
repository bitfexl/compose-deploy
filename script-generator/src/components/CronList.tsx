import { CronInput, CronValues } from "./CronInput";

export interface CronListProps {
    values: CronValues[];
    setValues: (values: CronValues[]) => unknown;
}

const defaultCronValue: CronValues = {
    timeOptionId: 0,
    minute: 0,
    hour: 0,
    dom: 1,
    dow: 0,
};

export function CronList({ values, setValues }: CronListProps) {
    function updateValues(i: number, val: CronValues) {
        const newValues = [...values];
        newValues[i] = val;
        setValues(newValues);
    }

    function deleteCron(index: number) {
        setValues(values.filter((_, i) => i != index));
    }

    return (
        <div>
            <div key={values.length} className="flex flex-col gap-4">
                {values.map((val, i) => (
                    <div key={i} className="flex flex-col gap-2">
                        <CronInput values={val} setValues={(val) => updateValues(i, val)}></CronInput>
                        <div>
                            <button className="linklike text-red-500" onClick={() => deleteCron(i)} hidden={values.length == 1}>
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="-ml-[1px] pt-4">
                <button className="input" onClick={() => setValues([...values, { ...defaultCronValue }])}>
                    Add Entry
                </button>
            </div>
        </div>
    );
}
