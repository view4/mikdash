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

const renderUrchatz = () => {
    renderOuterCourtyard();

    const container = seed("div", {
        id: "urchatz-container",
        parent: root,
        style: {
            width: "100vw",
            height: "100vh",
            width: "-webkit-fill-available",
            height: "-webkit-fill-available",
            position: "absolute",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            top: "0rem",
            left: "0rem",
            border: "3px solid rebeccapurple",
            background: "white",
            zIndex: 7,
            borderRadius: "3rem",
            margin: "1rem"
        }
    });

    const portal = seed("textarea", {
        parent: container,
        id: "urchatz-portal",
        style: {
            border: "1px solid rebeccapurple",
            height: "18rem",
            width: "18rem",
            borderRadius: "1rem",
            padding: "1rem",
        }
    });

    Urchatz.elements.portal = portal;

    if (Urchatz.value) {
        portal.value = Urchatz.value;
    }

    const button = seed("button", {
        style: {
            position: "absolute",
            // bottom: "6rem",
            // right: "6rem",
            bottom: "10%",
            right: "10%",
            background: "white",
            fontWeight: 600,
            letterSpacing: "0.25rem",
            padding: "0.5rem 1rem",
            borderRadius: "1rem",
            border: "2px solid rebeccapurple",
            cursor: "pointer"
        },
        parent: container,
        text: "Enter",
        onclick: () => {
            requests.write({
                kadeshId: Urchatz.kadeshId,
                direction: Urchatz.direction,
                entryId: Urchatz.entryId,
                urchatz: portal.value
            })
            Urchatz.unrender()
        }
    })
}

const renderOuterCourtyard = () => {
    const container = seed("div", {
        style: {
            height: "100vh",
            width: "100vw",
            display: "grid"
        },
        parent: root,
        text: "courtyard.."
    });

    const kadeshContainer = seed("div", {});
    const karpasContainers = [
        seed("div", {}),
        seed("div", {}),
    ]
    const yachatzContainers = [
        seed("div", {}),
        seed("div", {})
    ]
    const maggidContainer = seed("div", {})
}

const Urchatz = {
    kadeshId: null,
    direction: "south", //temp default set...
    entryId: null,
    value: null,
    elements: {
        portal: null
    },
    render: (kadeshId) => {
        Urchatz.kadeshId = kadeshId
        const kadeshContainer = document.getElementById("kadesh-page-container");
        kadeshContainer.remove();
        renderUrchatz();
    },
    unrender: () => {
        document.getElementById("urchatz-container").remove();
    }
}

const onLoad = async (kadeshId) => {
    const data = await requests.fetch(kadeshId);
    const existingEntry = data.entries?.filter(entry => (entry.direction === Urchatz.direction) && entry)[0]
    if (!existingEntry) return null;
    Urchatz.entryId;
    document.getElementById("urchatz-portal").value = existingEntry.urchatz
    Urchatz.value = existingEntry.urchatz
}

document.addEventListener("kadesh-entered", (event) => {
    const kadeshId = event.detail.kadeshId;
    onLoad(kadeshId);
    Urchatz.render(kadeshId);
});
