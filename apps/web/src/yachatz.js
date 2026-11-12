import { seed } from '@mikdash/components';
import { mutation, receptor } from '@mikdash/state';

const backend = "http://localhost:3000/api/";

const SIDES = {
    LEFT: "left",
    RIGHT: "right"
}

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

const tabs = (items, onChange, style = {}) => {
    const container = seed("div", {
        children: items.map((item, index) => seed("button", {
            text: item.text,
            onclick: (e) => onChange(item, index, e),
            style: {
                background: item.active ? "#add8e680" : "white",
                border: "none",
                fontWeight: item.active ? "bold" : "normal",
                cursor: "pointer"
            }
        })),
        style: {
            border: "1px solid lightgrey",
            display: "flex"
        }
    })
    return container
}

const generateTabs = (side) => {
    return tabs(
        [{ text: "karpas" }, { text: "yachatz", active: true }],
        (item) => {
            const event = new CustomEvent("toggle-karpas-yachatz", {
                detail: {
                    value: item.text,
                    side
                }
            });
            document.dispatchEvent(event);
        }
    )
}



const generateAddYachatzEntity = (side) => {
    const container = seed("div", {
        children: [
            seed(
                "button",
                {
                    style: {
                        cursor: "pointer",
                        height: "5rem",
                        width: "90%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "1px dashed lightblue",
                        margin: "0.5rem auto",
                        borderRadius: "0.5rem",
                        background: "white"
                    },
                    text: "+",
                    onclick: () => {
                        console.log("handle on press here..")
                        appendCreateYachatzEntity(side);
                    }
                }
            )],
        style: {
            height: "10%",


        }
    });
    return container;
};

const generateYachatzEntity = (entity, index) => {
    const onCancel = () => {
        editEntityComponent.style.display = "none";
        component.style.display = "block"
    }
    const editEntityComponent = generateWriteYachatzEntity(entity.side, entity, index, onCancel);
    editEntityComponent.style.display = "none";
    const component = seed(
        "div",
        {
            id: "",
            style: {
                border: "1px solid lightblue",
                borderRadius: "0.5rem",
                margin: "0.5rem auto",
                width: "90%",
                maxHeight: "20rem",
                overflow: "scroll",
                minHeight: "7rem"
            },
            children: [
                seed("div",
                    {
                        children: [
                            seed("h4", {
                                text: entity.yachatz,
                                style: {
                                    margin: "0.25rem 0rem",
                                    fontSize: "1.125rem",
                                    fontWeight: "600"
                                }
                            })
                        ],
                        style: {
                            padding: "0rem 0.5rem",
                        }
                    }
                ),
                seed("ul", {
                    style: {
                        padding: "0rem 0.5rem",
                        margin: "0rem"

                    },
                    children: entity?.details?.map(detail => seed("li", { text: detail, style: { marginLeft: "1rem" } }))
                }),
                seed("div", {
                    children: [
                        seed("button", {
                            text: "edit",
                            style: {
                                background: "white",
                                borderRadius: "0.25rem",
                                padding: "0.25rem 0.5rem",
                                fontSize: "0.75rem",
                                border: "1px solid lightblue"

                            },
                            onclick: () => {
                                editEntityComponent.style.display = "block";
                                component.style.display = "none"

                            }
                        })
                    ],
                    style: {
                        display: "flex",
                        justifyContent: "flex-end",
                        padding: "0.5rem",
                    }
                })
            ]
        }
    )
    return [editEntityComponent, component]

}
const generateExistingYachatzEntities = (entities) => {
    if (!entities) return [];
    return entities.reduce((children, entity, index) => ([
        ...children,
        ...generateYachatzEntity(entity, index)
    ]), [])
}

const generateWriteYachatzEntity = (side, yachatzEntity = {}, yachatzIndex = null, onCancel = null) => {
    // RENAME accordingly or create a singule kind of logic and handle accordingly please
    const state = {
        side,
        details: [...(yachatzEntity.details ?? []), ""],
        ...yachatzEntity
    };

    const container = seed("div", {
        style: {
            border: "1px dotted rebeccapurple",
            borderRadius: "0.5rem",
            margin: "0.5rem auto",
            width: "90%",
            maxHeight: "30rem",
            overflow: "scroll",
            minHeight: "20rem"
        }
    });

    const yachatzContainer = seed("div", {
        children: [
            seed("input", {
                id: "yachatz-input-" + side,
                // value: 
                onchange: (e) => {
                    state.yachatz = e.target.value
                    console.log('handle on change here...')
                },
                attributes: {
                    placeholder: "Established Practice",
                    value: yachatzEntity?.yachatz ?? "",

                },
                style: {
                    fontSize: "1.125rem",
                    maxWidth: "90%",
                    maxHeight: "75%",
                    fontWeight: 500
                }
            })
        ],
        parent: container,
        style: {
            margin: "0.5rem",
            height: "25%",
            maxHeight: "4rem",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
        },

    })

    const generateDetailInputItem = (detail, index) => {
        return seed(
            "li",
            {
                children: [
                    seed(
                        "input",
                        {
                            id: "yachatz-detail-input-" + (index + 1),
                            // value: detail,
                            onchange: (e) => {
                                state.details[index] = e.target.value
                                console.log("handle onblur here...! ")
                                if (!e.target.value.length) return null;
                                e.target.parentElement.parentElement.appendChild(generateDetailInputItem("", index + 1))
                            },
                            attributes: {
                                placeholder: "Detail",
                                value: detail ?? ""
                            },
                        }
                    )
                ],
                style: {
                    margin: "0.5rem 0.25rem",
                    listStyleType: "none"
                }
            }

        )
    }

    const detailsContainer = seed("div", {
        style: {
            height: "50%",
            minHeight: "5rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            overflow: "scroll"
        },
        children: [
            seed("ul", {
                style: {
                    padding: "0rem 0.5rem"

                },
                children: state.details.map((detail, index) => generateDetailInputItem(detail, index))
            }),
            seed("button", {
                text: "append",
                onclick: () => {
                    console.log(detailsContainer.children[0])
                    detailsContainer.children[0].appendChild(generateDetailInputItem("", state.details.length + 1))
                },
                style: {
                    background: "white",
                    margin: "0rem 0.5rem",
                    borderRadius: "0.25rem",
                    padding: "0.25rem 0.75rem",
                    height: "1.5rem",
                    cursor: "pointer",
                    fontSize: "0.75rem",
                    border: "1px dotted lightblue",
                    width: "fit-content"

                }
            })

        ],
        parent: container
    });

    const saveContainer = seed("div", {
        children: [
            seed("button", {
                text: "cancel",
                onclick: () => {
                    if (!!karpasEntity.karpas) {
                        onCancel?.()
                    } else {
                        container.remove();
                    }
                },
                style: {
                    background: "white",
                    margin: "0rem 0.5rem",
                    borderRadius: "0.25rem",
                    padding: "0.25rem 0.75rem",
                    height: "1.5rem",
                    fontSize: "0.75rem",
                    cursor: "pointer",
                    border: "1px dotted crimson"
                },
            }),
            seed("button", {
                text: "save",
                onclick: async () => {
                    console.log(state);
                    console.log("saving ", yachatzEntity)
                    state.details = state.details.filter(detail => !!detail?.trim()?.length)
                    let yachatz = [];
                    if (!state?.karpas?.trim()?.length) return null;
                    if (!!yachatzEntity?.yachatz) {
                        yachatz = [
                            ...(Yachatz.entry.yachatz ?? []),
                        ];
                        yachatz[yachatzIndex] = state

                    } else {
                        yachatz = [
                            ...(Yachatz.entry.yachatz ?? []),
                            state
                        ];
                    }
                    await Yachatz.save(yachatz)


                },
                style: {
                    background: "white",
                    borderRadius: "0.25rem",
                    padding: "0.25rem 0.75rem",
                    height: "1.5rem",
                    cursor: "pointer",
                    fontSize: "0.75rem",
                    border: "1px solid lightblue"
                },
            })
        ],
        parent: container,
        style: {
            display: "flex",
            justifyContent: "flex-end",
            margin: "0.5rem",
            height: "25%",
            maxHeight: "4rem"
        }
    });

    return container
}

const appendCreateYachatzEntity = (side, yachatzEntity = {}, yachatzIndex = null, onCancel = null) => {
    const component = generateWriteYachatzEntity(side, yachatzEntity, yachatzIndex, onCancel);
    document.getElementById(`yachatz-${side}-inner-container`).appendChild(component)
}

const renderYachatz = () => {
    const [leftContainer, rightContainer] = [
        document.getElementById("yachatz-left-container"),
        document.getElementById("yachatz-right-container"),
    ];

    const [leftTabsContainer, rightTabsContainer] = [SIDES.LEFT, SIDES.RIGHT].map(side => (
        seed("div", {
            children: [generateTabs(side)],
            style: {
                height: "5rem",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }
        })
    ))


    const [leftAddContainer, rightAddContainer] = [
        generateAddYachatzEntity(SIDES.LEFT),
        generateAddYachatzEntity(SIDES.RIGHT)
    ];

    // handle fetching and splitting of entities according to side.
    const [leftExistingChildren, rightExistingChildren] = [
        generateExistingYachatzEntities(Yachatz.entry?.yachatz?.filter(entry => (entry.side === SIDES.LEFT && entry))),
        generateExistingYachatzEntities(Yachatz.entry?.yachatz?.filter(entry => (entry.side === SIDES.RIGHT && entry)))
    ]

    const [leftInnerContainer, rightInnerContainer] = [
        seed("div", {
            id: "yachatz-left-inner-container",
            style: {
                width: "100%",
                maxHeight: "90%",
                height: "72%",
                display: "flex",
                flexDirection: "column",
                overflow: "scroll"
            },
            children: leftExistingChildren,
        }),
        seed("div", {
            id: "yachatz-right-inner-container",
            style: {
                width: "100%",
                maxHeight: "90%",
                height: "72%",
                display: "flex",
                flexDirection: "column"
            },
            children: rightExistingChildren,
        })
    ]
    leftContainer.appendChild(leftTabsContainer);
    leftContainer.appendChild(leftInnerContainer);
    leftContainer.appendChild(leftAddContainer);

    rightContainer.appendChild(rightTabsContainer);
    rightContainer.appendChild(rightInnerContainer);
    rightContainer.appendChild(rightAddContainer);

    Yachatz.elements = {
        leftTabsContainer,
        leftInnerContainer,
        leftAddContainer,
        rightTabsContainer,
        rightInnerContainer,
        rightAddContainer
    }


}
const Yachatz = {
    entry: {},
    elements: {
        leftContainer: null,
        rightContainer: null
    },
    save: async (yachatz) => {
        console.log(Yachatz.entry)
        console.log(yachatz)
        const res = await requests.write({
            kadeshId: Yachatz.entry?.kadeshId,
            entryId: Yachatz.entry?.entryId,
            yachatz,
        })
        Yachatz.entry.yachatz = yachatz;
        Yachatz.reRender()

        console.log("result....")
        console.log(yachatz)
    },
    reRender: (result) => {
        Object.values(Yachatz.elements).map(element => element.remove())
        // Yachatz.elements.leftContainer.remove()
        // Yachatz.elements.rightContainer.remove()
        Yachatz.render()
    },
    render: () => {
        renderYachatz()
    }
}


const fetchExistingEntry = async (kadeshId, entryId) => {
    const data = await requests.fetch(kadeshId);
    const existingEntry = data.entries?.filter(entry => (entry.entryId === entryId) && entry)[0]

    return existingEntry
};

document.addEventListener("to-outer-courtyard", async (event) => {
    console.log(event.detail)
    Yachatz.entry = event.detail.entry;
    Yachatz.entry = await fetchExistingEntry(event.detail.entry?.kadeshId, event.detail?.entry?.entryId);
    Yachatz.entry.kadeshId = event.detail.entry?.kadeshId
    console.log(Yachatz.entry)

    renderYachatz()

})


document.addEventListener("toggle-karpas-yachatz", (e) => {
    const side = e.detail.side;
    const value = e.detail.value;

    if (value === "yachatz" && document.getElementById(`yachatz-${side}-container`).style.display === "none") {
        // handle toggle here...!
        console.log("inside toggle")
        document.getElementById(`yachatz-${side}-container`).style.display = "block"
        document.getElementById(`karpas-${side}-container`).style.display = "none";
    }
})