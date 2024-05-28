import { CronValues } from "./CronInput";
import { CronList } from "./CronList";

export interface ScriptConfigValues {
    projectName: string;
    gitURL: string;
    gitBranch: string;
    installDir: string;
    engine: "docker" | "podman";
    installEngine: boolean;
    updateUser: string;
    cronValues: CronValues[];
}

export interface ScriptConfigProps {
    values: ScriptConfigValues;
    setValues: (values: ScriptConfigValues) => unknown;
}

export function ScriptConfig({ values, setValues }: ScriptConfigProps) {
    return (
        <div className="inline-flex flex-col gap-8">
            <h2>Script Config</h2>

            <div className="flex flex-col gap-2">
                <h3>Source</h3>
                <hr />

                <label className="flex flex-row gap-2">
                    <p className="w-32">Project name</p>
                    <input
                        className="input w-96"
                        type="text"
                        placeholder="my-app"
                        value={values.projectName}
                        onChange={(e) => setValues({ ...values, projectName: e.target.value })}
                    />
                </label>

                <label className="flex flex-row gap-2">
                    <p className="w-32">Git URL</p>
                    <input
                        className="input w-96"
                        type="text"
                        placeholder="https://github.com/user/repo.git"
                        value={values.gitURL}
                        onChange={(e) => setValues({ ...values, gitURL: e.target.value })}
                    />
                </label>

                <label className="flex flex-row gap-2">
                    <p className="w-32">Branch</p>
                    <input
                        className="input w-96"
                        type="text"
                        placeholder="deploy"
                        value={values.gitBranch}
                        onChange={(e) => setValues({ ...values, gitBranch: e.target.value })}
                    />
                </label>
            </div>

            <div className="flex flex-col gap-2">
                <h3>Install</h3>
                <hr />

                <label className="flex flex-row gap-2">
                    <p className="w-32">Directory</p>
                    <div>
                        <input
                            className="input w-96"
                            type="text"
                            placeholder="/opt/compose-deploy"
                            value={values.installDir}
                            onChange={(e) => setValues({ ...values, installDir: e.target.value })}
                        />
                        {/* <i className="text-orange-300">TODO: USE CURRENT WORKING DIRECTORY</i> */}
                    </div>
                </label>

                <div className="flex flex-row gap-2">
                    <p className="w-32">Engine</p>
                    <div className="flex flex-col gap-1">
                        <label className="flex flex-row gap-2">
                            <input
                                type="checkbox"
                                checked={values.engine == "docker"}
                                onChange={() => setValues({ ...values, engine: "docker" })}
                            />
                            Docker
                        </label>
                        <label className="flex flex-row gap-2">
                            <input
                                type="checkbox"
                                checked={values.engine == "podman"}
                                onChange={() => setValues({ ...values, engine: "podman" })}
                            />
                            Podman
                        </label>
                    </div>
                </div>

                <label className="flex flex-row gap-2">
                    <p className="w-32">Install Engine</p>
                    <div className="flex flex-row gap-2">
                        <input
                            type="checkbox"
                            checked={values.installEngine}
                            onChange={() => setValues({ ...values, installEngine: !values.installEngine })}
                        />
                        Add install <i>(git, docker-compose-v2{values.engine == "podman" && ", podman"})</i>
                    </div>
                </label>
            </div>

            <div className="flex flex-col gap-2">
                <h3>Update</h3>
                <hr />

                <label className="flex flex-row gap-2">
                    <p className="w-32">User</p>
                    <input
                        className="input"
                        type="text"
                        placeholder="root"
                        value={values.updateUser}
                        onChange={(e) => setValues({ ...values, updateUser: e.target.value })}
                    />
                </label>

                <div className="flex flex-row gap-2">
                    <p className="min-w-32">Update at</p>
                    <div>
                        <CronList values={values.cronValues} setValues={(val) => setValues({ ...values, cronValues: val })}></CronList>
                    </div>
                </div>
            </div>
        </div>
    );
}
