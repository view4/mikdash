import { seed } from "@mikdash/components";
import { mutation, receptor } from "@mikdash/state";

const SERVICE_STATUSES = {
    ACTIVE: "ACTIVE",
    CLEAR: "CLEAR",
    PENDING_CLEARANCE: "PENDING-CLEARANCE"
};

const backend = " http://localhost:3000/api/";

const requests = {
    fetch: async (payload) => {
        const res = await fetch(backend, {
            method: "POST", body: JSON.stringify({
                route: "kadesh", action: "read", payload: {
                    search: payload?.search?.trim()
                }
            })
        })
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

const utilities = {
    getServiceStatusClassName: (status) => {
        switch (status) {
            case SERVICE_STATUSES.ACTIVE:
                return "active";
            case SERVICE_STATUSES.PENDING_CLEARANCE:
                return "pending-clearance";
        }
        return "clear";
    }
}

const root = document.getElementById("root");

const fetchKadeshEntries = async (payload) => {
    return await requests.fetch(payload);
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
        console.log(Kadesh)
        const event = new CustomEvent("kadesh-entered", { detail: { kadeshId: res.id, direction: Kadesh.direction} });
        document.dispatchEvent(event);
    }).catch((err) => {
        console.log("error....")
        console.log(err)
    })
};

const renderListView = () => {
    const feed = receptor("kadesh.feed");
    const feedContainer = seed("div", {
        id: "kadesh-feed-container",
        parent: kadeshContainer
    })

    const kadeshSearchInputContainer = seed("div", {
        id: "kadesh-search-input-container",
        parent: feedContainer,
    })

    const kadeshSearchInput = seed("input", {
        id: "kadesh-search-input",
        parent: kadeshSearchInputContainer,
        type: "text",
        attributes: {
            placeholder: "Search",
            type: "text"
        },
        onkeyup: async (e) => {
            // add a manual throttle here please...
            const search = e.target.value;
            const res = await fetchKadeshEntries({ search });
            const container = document.getElementById("kadesh-feed-items-container");
            while (container.lastChild) {
                container.removeChild(container.lastChild);
            }
            mutation((state) => {
                state.kadesh = {
                    showList: true,
                    feed: res
                }
            })

            renderList(res)
        }
    });

    const feedItemsContainer = seed("div", {
        id: "kadesh-feed-items-container",
        parent: feedContainer,
    })

    const renderList = (feed) => {
        feed.forEach(kadesh => {

            const kadeshContainer = seed("div", {
                id: "kadesh-feed-item",
                parent: feedItemsContainer,
                children: [
                    seed("div", {
                        children: [
                            seed("p", {
                                text: kadesh.kadesh,
                            }),
                        ]
                    }),
                    seed("div", {
                        children: [
                            seed("div", {
                                className: `service-status ${utilities.getServiceStatusClassName(kadesh?.metadata?.serviceStatus)}`,
                            }),
                        ],
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
                    const event = new CustomEvent("kadesh-entered", { detail: { kadeshId: kadesh.id, direction: Kadesh.direction } });
                    document.dispatchEvent(event);
                }
            })
        });
    }

    renderList(feed)

    return feedContainer;
}

const handleToggleListView = () => {
    const displayingList = receptor("kadesh.showList");
    const showList = !displayingList;

    if (showList) {
        renderListView();
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

const renderTabs = (items, onChange, style = {}, parent = null) => {
    const container = seed("div", {
        children: items.map((item, index) => seed("button", {
            text: item.text,
            onclick: (e) => onChange(item, index, e),
            style: {
                background: item.active ? "#add8e680" : "white",
                border: "none",
                fontWeight: item.active ? "bold" : "normal",
                cursor: "pointer",
                padding: "1rem",
                flex: 1,
                fontSize: "1.125rem",
                borderRadius: "2rem"
            }
        })),
        parent,
        style: {
            border: "1px solid lightgrey",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            position: "absolute",
            bottom: "5rem",
            left: "5rem",
            padding: "0rem",
            borderRadius: "2rem",
            border: "2px double lightblue",
            height: "3rem",
            overflow: "hidden"
        }
    })
    return container
}

const DIRECTIONS = {
    NORTH: "north",
    EAST: "east",
    SOUTH: "south"
}

const defaultTabs = [{ text: "N", value: DIRECTIONS.NORTH }, { text: "E", value: DIRECTIONS.EAST }, { text: "S", value: DIRECTIONS.SOUTH, active: true }];

const onTabSelect = (item) => {
    Kadesh.direction = item.value;
    console.log(item.value)
    const event = new CustomEvent("set-kadesh-direction", {
        detail: {
            value: item.value
        }
    });
    document.dispatchEvent(event);
}
let tabs = renderTabs(
    defaultTabs,
    onTabSelect,
    {},
    container

);

const reRenderTabs = (activeValue) => {
    tabs.remove();
    tabs = renderTabs(
        defaultTabs.map((tab, index) => ({
            ...tab,
            active: tab.value === activeValue
        })),
        onTabSelect,
        {},
        container

    );
}

document.addEventListener("set-kadesh-direction", (e) => {
    console.log(e.detail.value)
    reRenderTabs(e.detail.value)

})

document.addEventListener("to-kadesh", () => {
    // maybe handle in a more full-proof method at some point. 
    const korechPageContainer = document.getElementById("korech-page-container");
    if (korechPageContainer) {
        root.removeChild(korechPageContainer);
    }

    if (container) {
        root.appendChild(container);
    }

    handleToggleListView();
    render();
});


const Kadesh = {
    direction: DIRECTIONS.SOUTH
};
