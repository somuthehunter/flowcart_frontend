import type { Remote } from "comlink";

const remoteLogger: Remote<typeof import("./remote-logger/worker")> =
    new ComlinkWorker<typeof import("./remote-logger/worker")>(
        new URL("./remote-logger/worker", import.meta.url)
    );
export { remoteLogger };
