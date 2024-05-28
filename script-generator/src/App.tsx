import { CopyText } from "./components/CopyText";
import { ScriptConfig, ScriptConfigValues } from "./components/ScriptConfig";
import { generateScript } from "./generateScript";
import { useLocalStorage } from "./localStorageHook";

const defaultConfigValues: ScriptConfigValues = {
    projectName: "my-app",
    gitURL: "",
    gitBranch: "deploy",
    installDir: "/opt/compose-deploy",
    engine: "docker",
    installEngine: true,
    updateUser: "root",
    cronValues: [
        {
            timeOptionId: 3,
            minute: 30,
            hour: 0,
            dom: 1,
            dow: 0,
        },
        {
            timeOptionId: 6,
            minute: 0,
            hour: 0,
            dom: 1,
            dow: 0,
        },
    ],
};

export default function App() {
    const [configValues, setConfigValues] = useLocalStorage<ScriptConfigValues>("config", defaultConfigValues);

    return (
        <div>
            <div className="inline-flex flex-col gap-4 m-4 ml-[20%] mb-32" style={{ maxWidth: "min(75vw, 800px)" }}>
                <h1>Compose Deploy Script Generator</h1>
                <div className="flex flex-col gap-2">
                    <p className="text-justify">
                        This tool generates a script for installing a Compose application along with an automatic update mechanism. It pulls
                        the latest commits from a specified Git repository and branch. The branch must contain a{" "}
                        <pre className="inline">compose.yml</pre> file at the root level, which will be used to build and run the
                        application. Note that SSH keys must be configured in advance.
                    </p>
                    <p>The script will generate the following files and directories (green values are configurable):</p>
                    <table className="border-separate border-spacing-4 border-spacing-x-12 text-justify -ml-12 -mr-12">
                        <tr>
                            <td>
                                <pre>
                                    /etc/cron.d/<span className="text-green-700">{configValues.projectName}</span>
                                </pre>
                            </td>
                            <td>This cron file will handle the restart of the application on reboot and all the configured updates.</td>
                        </tr>
                        <tr>
                            <td>
                                <pre>
                                    /var/log/update-<span className="text-green-700">{configValues.projectName}</span>.log
                                </pre>
                            </td>
                            <td>This file will contain the log output from updates by cron jobs.</td>
                        </tr>
                        <tr>
                            <td>
                                <pre>
                                    <span className="text-green-700">{configValues.installDir}</span>/update-
                                    <span className="text-green-700">{configValues.projectName}</span>.sh
                                </pre>
                            </td>
                            <td>
                                This is the main update file. It is executed by the cron jobs but can also be executed manually. It pulls
                                the latest commits from git, and if a change is detected, rebuilds and restarts the Compose app.
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <pre>
                                    <span className="text-green-700">{configValues.installDir}</span>/
                                    <span className="text-green-700">{configValues.projectName}</span>/
                                </pre>
                            </td>
                            <td>
                                This is the git repo which contains the app and <pre className="inline">compose.yml</pre> file. It will be
                                pulled by the update script.
                            </td>
                        </tr>
                    </table>
                </div>

                <ScriptConfig values={configValues} setValues={setConfigValues}></ScriptConfig>
                <br />

                <h2>Install Script</h2>
                <p>Execute this command as root to install the application and set up automatic updates:</p>
                <CopyText btnLabel="Copy Script" text={generateScript(configValues)}></CopyText>
            </div>
            <hr className="ml-[20%] mr-[20%]" />
            <div className="text-center mt-4 mb-8">
                <a className="linklike" href="https://github.com/bitfexl/compose-deploy">
                    GitHub
                </a>
            </div>
        </div>
    );
}
