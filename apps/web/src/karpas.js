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
                background: item.active ? "#ed143d80" : "white",
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
        [{ text: "karpas", active: true }, { text: "yachatz", }],
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


const generateAddKarpasEntity = (side) => {
    const container = seed("div", {
        children: [
            seed(
                "button",
                {
                    style: {
                        cursor: "pointer",
                        height: "7rem",
                        width: "90%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "1px dashed #ed143d40",
                        margin: "0.5rem auto",
                        borderRadius: "0.5rem",
                        background: "white",
                        marginBottom: "1rem"
                    },
                    text: "+",
                    onclick: () => {
                        console.log("handle on press here..")
                        appendCreateKarpasEntity(side);
                    }
                }
            )],
        style: {
            height: "18%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        }
    });
    return container;
};

const generateKarpasEntity = (entity, index) => {
    const onCancel = () => {
        editEntityComponent.style.display = "none";
        component.style.display = "block"
    }
    const editEntityComponent = generateWriteKarpasEntity(entity.side, entity, index, onCancel);
    editEntityComponent.style.display = "none";
    const component = seed(
        "div",
        {
            id: "",
            style: {
                border: "1px solid #ed143d40",
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
                                text: entity.karpas,
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
const generateExistingKarpasEntities = (entities) => {
    if (!entities) return [];
    return entities.reduce((children, entity, index) => ([
        ...children,
        ...generateKarpasEntity(entity, index)
    ]), [])
}

const generateWriteKarpasEntity = (side, karpasEntity = {}, karpasIndex = null, onCancel = null) => {
    // RENAME accordingly or create a singule kind of logic and handle accordingly please
    const state = {
        side,
        details: [...(karpasEntity.details ?? []), ""],
        ...karpasEntity
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

    const karpasContainer = seed("div", {
        children: [
            seed("input", {
                id: "karpas-input-" + side,
                // value: 
                onchange: (e) => {
                    state.karpas = e.target.value
                    console.log('handle on change here...')
                },
                attributes: {
                    placeholder: "Established Practice",
                    value: karpasEntity?.karpas ?? "",

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
                            onchange: (e) => {
                                state.details[index] = e.target.value
                                console.log("handle onblur here...! ")
                            },
                            attributes: {
                                placeholder: "Detail",
                                value: detail ?? ""
                            },
                            style: {

                            }
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
                    width: "fit-content",

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
                    console.log("saving ", karpasEntity)
                    state.details = state.details.filter(detail => !!detail?.trim()?.length)
                    let karpas = [];
                    if (!state?.karpas?.trim()?.length) return null;
                    if (!!karpasEntity?.karpas) {
                        karpas = [
                            ...(Karpas.entry.karpas ?? []),
                        ];
                        karpas[karpasIndex] = state

                    } else {
                        karpas = [
                            ...(Karpas.entry.karpas ?? []),
                            state
                        ];
                    }
                    await Karpas.save(karpas)


                },
                style: {
                    background: "white",
                    borderRadius: "0.25rem",
                    padding: "0.25rem 0.75rem",
                    height: "1.5rem",
                    cursor: "pointer",
                    fontSize: "0.75rem",
                    border: "1px solid lightblue",
                    alignItems: "flex-end"
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

const appendCreateKarpasEntity = (side, karpasEntity = {}, karpasIndex = null, onCancel = null) => {
    const component = generateWriteKarpasEntity(side, karpasEntity, karpasIndex, onCancel);
    document.getElementById(`karpas-${side}-inner-container`).appendChild(component)
}

const renderKarpas = () => {
    const [leftContainer, rightContainer] = [
        document.getElementById("karpas-left-container"),
        document.getElementById("karpas-right-container"),
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
        generateAddKarpasEntity(SIDES.LEFT),
        generateAddKarpasEntity(SIDES.RIGHT)
    ];

    // handle fetching and splitting of entities according to side.
    const [leftExistingChildren, rightExistingChildren] = [
        generateExistingKarpasEntities(Karpas.entry?.karpas?.filter(entry => (entry.side === SIDES.LEFT && entry))),
        generateExistingKarpasEntities(Karpas.entry?.karpas?.filter(entry => (entry.side === SIDES.RIGHT && entry)))
    ]

    const [leftInnerContainer, rightInnerContainer] = [
        seed("div", {
            id: "karpas-left-inner-container",
            style: {
                width: "100%",
                height: "72%",
                display: "flex",
                flexDirection: "column",
                overflow: "scroll"
            },
            children: leftExistingChildren,
        }),
        seed("div", {
            id: "karpas-right-inner-container",
            style: {
                width: "100%",
                height: "72%",
                display: "flex",
                flexDirection: "column",
                overflow: "scroll",

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

    Karpas.elements = {
        leftTabsContainer,
        leftInnerContainer,
        leftAddContainer,
        rightTabsContainer,
        rightInnerContainer,
        rightAddContainer
    }


}
const Karpas = {
    entry: {},
    elements: {
        leftContainer: null,
        rightContainer: null
    },
    save: async (karpas) => {
        const res = await requests.write({
            kadeshId: Karpas.entry?.kadeshId,
            entryId: Karpas.entry?.entryId,
            karpas,
        })
        Karpas.entry.karpas = karpas;
        Karpas.reRender()

    },
    reRender: (result) => {
        Object.values(Karpas.elements).map(element => element.remove())
        Karpas.render()
    },
    render: () => {
        renderKarpas()
    }
}


const fetchExistingEntry = async (kadeshId, entryId) => {
    const data = await requests.fetch(kadeshId);
    const existingEntry = data.entries?.filter(entry => (entry.entryId === entryId) && entry)[0]

    return existingEntry
};

document.addEventListener("to-outer-courtyard", async (event) => {
    Karpas.entry = event.detail.entry;
    Karpas.entry = await fetchExistingEntry(event.detail.entry?.kadeshId, event.detail?.entry?.entryId);
    Karpas.entry.kadeshId = event.detail.entry?.kadeshId

    renderKarpas()

})


document.addEventListener("toggle-karpas-yachatz", (e) => {
    const side = e.detail.side;
    const value = e.detail.value;
    console.log(e.detail)

    if (value === "karpas" && document.getElementById(`karpas-${side}-container`).style.display === "none") {
        document.getElementById(`yachatz-${side}-container`).style.display = "none"
        document.getElementById(`karpas-${side}-container`).style.display = "block";
    }
})