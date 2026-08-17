import { seed } from "@mikdash/components";
import { mutation, receptor } from "@mikdash/state";


const backend = " http://localhost:3000/api/";

const requests = {
    fetch: async () => {
        const res = await fetch(backend, { method: "POST", body: JSON.stringify({ route: "kadesh", action: "read", payload: {} }) })
        const body = await res.json();
        return body;
    },
    create: async (kadesh) => {
        const res = await fetch(backend,
            { method: "POST", body: JSON.stringify({ route: "kadesh", action: "write", payload: { kadesh } }) });
        const body = await res.json();
        return body;
    }
}

const root = document.getElementById("root");

const fetchKadeshEntries = async () => {
    return await requests.fetch();
};


const handleSubmit = () => {
    requests.create(kadeshInput.value).then(async (res) => {
        mutation((state) => {
            state.kadesh = {
                ...state.kadesh,
                kadesh: res.kadesh,
                feed: [...state.kadesh.feed, res]
            }
        })

        // await Korech.render();

        const event = new CustomEvent("kadesh-selected", { detail: { kadeshId: res.id } });
        document.dispatchEvent(event);

        // todo: handle success here... e.g. navigate to page, display message or something... 
    }).catch((err) => {
        console.log("error....")
        console.log(err)
    })
};

const renderList = () => {
    const feed = receptor("kadesh.feed");
    const feedContainer = seed("div", {
        id: "kadesh-feed-container",
        parent: kadeshContainer
    })


    feed.forEach(kadesh => {
        const kadeshContainer = seed("div", {
            id: "kadesh-feed-item",
            parent: feedContainer,
            children: [
                seed("p", {
                    text: kadesh.kadesh,
                })
            ],
            onclick: async () => {
                mutation((state) => {
                    state.kadesh = {
                        ...state.kadesh,
                        kadesh: kadesh.kadesh,
                        id: kadesh.id,
                    }
                })
                // emit a synthatic event called "kadesh-selected" with the kadesh id as the payload
                const event = new CustomEvent("kadesh-selected", { detail: { kadeshId: kadesh.id } });
                document.dispatchEvent(event);
                // await Korech.render();
            }
        })
    });
    return feedContainer;
}

const handleToggleListView = () => {
    const displayingList = receptor("kadesh.showList");
    const showList = !displayingList;

    if (showList) {
        renderList();
        toggleListButton.classList.remove("closed");
        toggleListButton.classList.add("open");
    } else {
        document.getElementById("kadesh-feed-container")?.remove();
        toggleListButton.classList.remove("open");
        toggleListButton.classList.add("closed");
    }

    mutation((state) => {
        state.kadesh = {
            ...state.kadesh,
            showList
        }
    })
}

const container = seed("div", {
    id: "kadesh-page-container",
    parent: root
});

const kadeshContainer = seed("div", {
    id: "kadesh-container",
    parent: container
})

const kadeshInput = seed("input", {
    id: "kadesh-input",
    parent: kadeshContainer,
    type: "text",
    attributes: {
        placeholder: "Kadesh",
        type: "text"
    }
})

const submitButton = seed("button", {
    id: "submit-button",
    text: "submit",
    parent: container,
    onclick: () => handleSubmit()
})

const toggleListButton = seed("button", {
    id: "toggle-list-button",
    className: "closed",
    // make within it be three lines please stacked vertically.. 
    children: [
        seed("div", {
            id: "open-kadesh-list-button-lines",
            children: [
                seed("span"),
                seed("span"),
                seed("span")
            ],
        }),
        seed("div", {
            id: "close-kadesh-list-button-lines",
            children: [
                seed("span", {
                    text: "✕"
                })
            ]
        })
    ],
    parent: kadeshContainer,
    onclick: () => handleToggleListView()
})

const render = async () => {
    const kadeshEntries = await fetchKadeshEntries();
    mutation((state) => {
        state.kadesh = {
            showList: false,
            feed: kadeshEntries
        }
    })
}

render()

document.addEventListener("to-kadesh", () => {
    // maybe handle in a more full-proof method at some point. 
    const korechPageContainer = document.getElementById("korech-page-container");
    if (korechPageContainer) {
        root.removeChild(korechPageContainer);
    }

    // const kadeshContainer = document.getElementById("kadesh-container");
    if (container) {
        root.appendChild(container);
    }

    handleToggleListView();
    render();
});