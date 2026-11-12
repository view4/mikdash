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


const generateAddKarpasEntity = (side) => {
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
                        border: "1px dashed #ed143d40",
                        margin: "0.5rem auto",
                        borderRadius: "0.5rem",
                        background: "white"
                    },
                    text: "+",
                    onclick: () => {
                        console.log("handle on press here..")
                        appendCreateKarpasEntity(side);
                    }
                }
            )],
        style: {
            height: "10%",


        }
    });
    return container;
};

const generateKarpasEntity = (entity, index) => {
    const editEntityComponent = generateWriteKarpasEntity(entity.side, entity, index);
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

const generateWriteKarpasEntity = (side, karpasEntity = {}, karpasIndex = null) => {
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
            maxHeight: "20rem",
            overflow: "scroll",
            minHeight: "10rem"
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

                }
            })
        ],
        parent: container,
        style: {
            margin: "0.5rem",
            height: "25%",
            maxHeight: "4rem"
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
                            id: "karpas-detail-input-" + (index + 1),
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
            minHeight: "5rem"
        },
        children: [
            seed("ul", {
                style: {
                    padding: "0rem 0.5rem"

                },
                children: state.details.map((detail, index) => generateDetailInputItem(detail, index))
            })
        ],
        parent: container
    });

    const saveContainer = seed("div", {
        children: [
            seed("button", {
                text: "save",
                onclick: async () => {
                    console.log(state);
                    console.log("saving ", karpasEntity)
                    let karpas = [];
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
                    padding: "0.25rem 0.5rem",
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

const appendCreateKarpasEntity = (side, karpasEntity = {}, karpasIndex = null) => {
    const component = generateWriteKarpasEntity(side, karpasEntity, karpasIndex);
    document.getElementById(`karpas-${side}-inner-container`).appendChild(component)
}

const renderKarpas = () => {
    const [leftContainer, rightContainer] = [
        document.getElementById("karpas-left-container"),
        document.getElementById("karpas-right-container"),
    ];

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
                maxHeight: "90%",
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
                maxHeight: "90%",
                display: "flex",
                flexDirection: "column"
            },
            children: rightExistingChildren,
        })
    ]
    leftContainer.appendChild(leftInnerContainer);
    leftContainer.appendChild(leftAddContainer);

    rightContainer.appendChild(rightInnerContainer);
    rightContainer.appendChild(rightAddContainer);
    Karpas.elements = {
        leftInnerContainer,
        leftAddContainer,
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
        console.log(Karpas.entry)
        console.log(karpas)
        const res = await requests.write({
            kadeshId: Karpas.entry?.kadeshId,
            entryId: Karpas.entry?.entryId,
            karpas,
        })
        Karpas.entry.karpas = karpas;
        Karpas.reRender()

        console.log("result....")
        console.log(karpas)
    },
    reRender: (result) => {
        Object.values(Karpas.elements).map(element => element.remove())
        // Karpas.elements.leftContainer.remove()
        // Karpas.elements.rightContainer.remove()
        Karpas.render()
    },
    render: () => {
        renderKarpas()
    }
}


const fetchExistingEntry = async (kadeshId, entryId) => {
    const data = await requests.fetch(kadeshId);
    const existingEntry = data.entries?.filter(entry => (entry.entryId === entryId) && entry)[0]
    console.log({
        entryId, kadeshId
    }, existingEntry)
    return existingEntry
};

document.addEventListener("to-outer-courtyard", async (event) => {
    console.log(event.detail)
    Karpas.entry = event.detail.entry;
    Karpas.entry = await fetchExistingEntry(event.detail.entry?.kadeshId, event.detail?.entry?.entryId);
    Karpas.entry.kadeshId = event.detail.entry?.kadeshId
    console.log(Karpas.entry)

    renderKarpas()

})