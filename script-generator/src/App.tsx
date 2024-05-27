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
        <div className="inline-flex flex-col gap-4 m-4 ml-[20%]" style={{ maxWidth: "min(75vw, 800px)" }}>
            <h1>Compose Deploy Script Generator</h1>
            <p>TODO: DESCRIPTION</p>

            <ScriptConfig values={configValues} setValues={setConfigValues}></ScriptConfig>
            <br />

            <h2>Install Script</h2>
            <CopyText btnLabel="Copy Script" text={generateScript(configValues)}></CopyText>
        </div>
    );
}
