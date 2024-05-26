import { CronValues } from "./components/CronInput";
import { ScriptConfigValues } from "./components/ScriptConfig";

export function generateScript(config: ScriptConfigValues) {
    // TODO: implement
    return JSON.stringify(config, null, 2);
}

export function toCronString(values: CronValues) {
    switch (values.timeOptionId) {
        case 1: // minute
            return "* * * * *";
        case 2: // hour
            return values.minute + " * * * *";
        case 3: // day
            return values.minute + " " + values.hour + " * * *";
        case 4: // week
            return values.minute + " " + values.hour + " * * " + values.dow;
        case 5: // month
            return values.minute + " " + values.hour + " " + values.dom + " * *";
        case 6: // reboot
            return "@reboot";
        default:
            return null;
    }
}
