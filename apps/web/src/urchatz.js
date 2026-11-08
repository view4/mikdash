import { seed } from '@mikdash/components';
import { mutation, receptor } from '@mikdash/state';

const backend = "http://localhost:3000/api/";

const requests = {
    fetch: async (kadeshId) => {
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
        parent: root,
        style: {
            width: "100vw",
            height: "100vh",
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        }
    });

    const portal = seed("textarea", {
        parent: container,
        id: "urchatz-portal",
        style: {
            border: "1px solid lightgrey",
            height: "6rem",
            width: "6rem",
        }
    });

    const button = seed("button", {
        style: {
            position: "absolute",
            bottom: "6rem",
            right: "6rem",
            
        },
        parent: "container",
        text: "Enter",
        onclick: () => {
            console.log(portal.value)
            console.log(document.getElementById("urchatz-portal").value)
            // get the value save it in the backend, and enter the outer courtyard with the relevant prefilled values if it exists.
        }
    })

}

