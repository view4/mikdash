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

const Rachtzah = {
    kadeshId: null,
    elements: {},
    renderRachtzah: () => {

        const container = seed("div", {
            id: "rachtzah-container",
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
            id: "rachtzah-portal",
            style: {
                border: "1px solid rebeccapurple",
                height: "18rem",
                width: "18rem",
                borderRadius: "1rem",
                padding: "1rem",
            }
        });

        Rachtzah.elements.portal = portal;

        if (Rachtzah.value) {
            portal.value = Rachtzah.value;
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
                const event = new CustomEvent("to-inner-courtyard", {detail: {kadeshId: Rachtzah.kadeshId}})
                document.dispatchEvent(event);
                container.remove()
            }
        })


    }
}

document.addEventListener("leave-outer-courtyard", (e) => {
    document.getElementById("outer-courtyard-container").remove()
    Rachtzah.kadeshId = e.detail.kadeshId;
    Rachtzah.renderRachtzah()
})