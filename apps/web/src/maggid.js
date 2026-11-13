import { seed } from '@mikdash/components';
import { mutation, receptor } from '@mikdash/state';

const backend = "http://localhost:3000/api/";

const requests = {
    fetch: async (kadeshId) => {
        // handle fetching and loading outer courtyard to state here... 
        const res = await fetch(backend, { method: "POST", body: JSON.stringify({ route: "kadesh-urchatz", action: "read", payload: { kadeshId } }) })
        const body = await res.json();
        return body;
    },
    write: async (data) => {
        const res = await fetch(backend, { method: "POST", body: JSON.stringify({ route: "kadesh-urchatz", action: "write", payload: { ...data } }) })
        const body = await res.json();
        return body;
    }
};

const root = document.getElementById("root");

const Maggid = {
    maggid: "",
    entry: {},
    save: async (value) => {
        const res = await requests.write({
            kadeshId: Maggid.entry?.kadeshId,
            entryId: Maggid.entry?.entryId,
            maggid: value
        })
    },
    continue: async () => {

    },
    renderMaggid: () => {
        const container = document.getElementById("maggid-container");

        const input = seed("textarea", {
            parent: container,
            id: "maggid-input",
            style: {
                height: "100%",
                width: "100%",
            },
            text: Maggid.entry.maggid,
            attributes: {
                value: Maggid.entry.maggid,
            },
            onkeyup: () => {
                if (saveButton.style.display === "none") saveButton.style.display = "block"
            }
        });

        const saveButton = seed("button", {
            style: {
                background: "white",
                height: "2rem",
                width: "7rem",
                border: "1px dotted lightblue",
                position: "absolute",
                bottom: "1rem",
                right: "9rem",
                borderRadius: "1rem",
                fontWeight: 600,
                cursor: "pointer"
            },
            parent: container,
            text: "save",
            onclick: async (e) => {
                await Maggid.save(input.value)
                e.target.style.display = "none"
            },
        })

        const continueButton = seed("button", {
            style: {
                background: "white",
                height: "2rem",
                width: "7rem",
                border: "1px dotted rebeccapurple",
                position: "absolute",
                bottom: "1rem",
                right: "1rem",
                borderRadius: "1rem",
                fontWeight: 600,
                cursor: "pointer"
            },
            parent: container,
            text: "continue",
            onclick: async () => {
                const event = new CustomEvent("leave-outer-courtyard", {
                    detail: {
                        kadeshId: Maggid.entry.kadeshId,
                    }
                });
                document.dispatchEvent(event)
            },
        })
    },
    onLoad: async (kadeshId, entryId) => {
        const entry = await fetchExistingEntry(kadeshId, entryId);
        Maggid.entry = entry;
        Maggid.entry.kadeshId = kadeshId;
    }
};

const fetchExistingEntry = async (kadeshId, entryId) => {
    const data = await requests.fetch(kadeshId);
    const existingEntry = data.entries?.filter(entry => (entry.entryId === entryId) && entry)[0]

    return existingEntry ?? {};
};

document.addEventListener("to-outer-courtyard", async (event) => {
    Maggid.entry = event.detail.entry;
    await Maggid.onLoad(event.detail.entry.kadeshId, event.detail.entry.entryId);
    Maggid.renderMaggid()
})

