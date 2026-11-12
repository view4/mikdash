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
        onclick: async () => {
            let entryId = Urchatz.entryId;
            console.log(entryId)
            const res = await requests.write({
                kadeshId: Urchatz.kadeshId,
                direction: Urchatz.direction,
                entryId,
                urchatz: portal.value
            });
            console.log("...")
            console.log(res)
            if (!entryId) {
                const existingEntry = await fetchExistingEntry(Urchatz.kadeshId);
                Urchatz.entryId = existingEntry.id;
                Urchatz.entry = existingEntry;
            }
            // perhaps unify into a single handleTransition handler or emit an event - whichever feels suitable there - thanks. 
            Urchatz.unrender()
            Urchatz.renderOuterCourtyard()

        }
    })
}

const renderOuterCourtyard = () => {
    const container = seed("div", {
        style: {
            height: "100vh",
            width: "100vw",
            display: "flex"


        },
        parent: root,
    });

    const kadeshContainer = seed("div", {

    });

    const karpasContainers = [
        seed("div", {
            parent: container,
            // text: "left component",
            id: "karpas-left-container",
            style: {
                height: "100%",
                width: "20rem",
                border: "1px solid purple",
                overflow: "scroll"
            }
        }),
        seed("div", {
            parent: container,
            id: "karpas-right-container",
            style: {
                height: "100%",
                width: "20rem",
                border: "1px solid purple",
            }
        }),
    ]
    const yachatzContainers = [
        seed("div", {
            parent: container,
            style: {
                display: "none"
            }
        }),
        seed("div", {
            parent: container,
            style: {
                display: "none"
            }
        })
    ]
    const maggidContainer = seed("div", {
        text: "maggid",
        style: {
            height: "100%",
            width: "-webkit-fill-available",
        }
    });

    container.insertBefore(maggidContainer, karpasContainers[1]);

    const event = new CustomEvent("to-outer-courtyard", {
        detail: {
            entry: {
                ...Urchatz.entry,
                entryId: Urchatz.entryId,
                kadeshId: Urchatz.kadeshId
            }
        }
    });

    document.dispatchEvent(event)
}

const Urchatz = {
    kadeshId: null,
    direction: "south", //temp default set...
    entryId: null,
    value: null,
    entry: {},
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
    },
    renderOuterCourtyard: () => {
        renderOuterCourtyard();
    }
}
const fetchExistingEntry = async (kadeshId) => {
    const data = await requests.fetch(kadeshId);
    const existingEntry = data.entries?.filter(entry => (entry.direction === Urchatz.direction) && entry)[0]
    return existingEntry
}


const onLoad = async (kadeshId) => {
    const existingEntry = await fetchExistingEntry(kadeshId)
    if (!existingEntry) return null;
    document.getElementById("urchatz-portal").value = existingEntry.urchatz
    Urchatz.value = existingEntry?.urchatz;
    Urchatz.entryId = existingEntry?.entryId;
}

document.addEventListener("kadesh-entered", (event) => {
    const kadeshId = event.detail.kadeshId;
    onLoad(kadeshId);
    Urchatz.render(kadeshId);
});





