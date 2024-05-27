import { CronValues } from "./components/CronInput";
import { ScriptConfigValues } from "./components/ScriptConfig";
import snippets from "./scriptdata/snippets.json";
import baseScript from "./scriptdata/base.sh?raw";

export function generateScript(config: ScriptConfigValues): string {
    const installDir = !config.installDir.endsWith("/") ? config.installDir + "/" : config.installDir;
    const updateScript = installDir + "update-" + config.projectName + ".sh";

    const files = [
        [updateScript, generateUpdateScript(config)],
        ["/etc/cron.d/" + config.projectName, generateCronFile(config, updateScript)],
    ];

    const commands = [];

    if (config.installEngine) {
        commands.push("echo Installing packages...");
        commands.push(snippets.aptInstall.replace("PACKAGES_HERE", "docker-compose-v2" + config.engine == "podman" ? " podman" : ""));
    }

    for (const file of files) {
        commands.push(snippets.base64ToFile.replace("FILE_HERE", file[0]).replace("BASE64_HERE", btoa(file[1])));
        commands.push("echo Created " + file[0]);
    }

    commands.push("chmod +x " + updateScript);
    commands.push(updateScript);

    commands.push("echo Install complete!");

    return snippets.execBase64.replace("BASE64_HERE", btoa(commands.join("\n")));
}

function generateUpdateScript(config: ScriptConfigValues): string {
    let updateScript = baseScript;
    updateScript = updateScript.replaceAll("GIT_URL_HERE", config.gitURL);
    updateScript = updateScript.replaceAll("GIT_BRANCH_HERE", config.gitBranch);
    updateScript = updateScript.replaceAll("APP_NAME_HERE", config.projectName);

    if (config.engine == "docker") {
        updateScript = updateScript.replace(/#PODMANONLY((.|\n)*?)#END/gm, "");
    } else if (config.engine == "podman") {
        updateScript = updateScript.replace(/#DOCKERONLY((.|\n)*?)#END/gm, "");
    } else {
        return "Error generating script: Unknown engine '" + config.engine + "'.";
    }

    updateScript = updateScript.replace(/#DOCKERONLY|#PODMANONLY|#END/gm, "");
    updateScript = updateScript.replace(/^\s*\n/gm, "\n");

    return updateScript;
}

function generateCronFile(config: ScriptConfigValues, updateScript: string): string {
    let cronFile = "";

    // restart on reboot
    if (config.engine == "docker") {
        cronFile += snippets.cronStartDocker;
    } else if (config.engine == "podman") {
        cronFile += snippets.cronStartPodman;
    } else {
        return "Error generating script: Unknown engine '" + config.engine + "'.";
    }
    cronFile += "\n";

    // update jobs
    for (const cronValue of config.cronValues) {
        const cron = toCronString(cronValue);
        if (cron == null) {
            return "Error generating script: Error parsing cron '" + JSON.stringify(cronValue) + "'.";
        }
        cronFile += snippets.cronUpdate.replace("CRON_HERE", cron) + "\n";
    }

    const installDir = !config.installDir.endsWith("/") ? config.installDir + "/" : config.installDir;

    cronFile = cronFile.replaceAll("USER_HERE", config.updateUser);
    cronFile = cronFile.replaceAll("PROJECT_PATH_HERE", installDir + config.projectName);
    cronFile = cronFile.replaceAll("LOG_FILE_HERE", "/var/log/update-" + config.projectName + ".log");
    cronFile = cronFile.replaceAll("UPDATE_SCRIPT_HERE", updateScript);

    return cronFile;
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
