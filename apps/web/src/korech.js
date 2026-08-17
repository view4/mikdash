import { seed } from "@mikdash/components";
import { mutation, receptor } from "@mikdash/state";

const backend = " http://localhost:3000/api/";

const requests = {
    fetch: async (kadeshId) => {
        const res = await fetch(backend, { method: "POST", body: JSON.stringify({ route: "korech", action: "read", payload: { kadeshId } }) })
        const body = await res.json();
        return body;
    },
    create: async (korech) => {
        const res = await fetch(backend, { method: "POST", body: JSON.stringify({ route: "korech", action: "write", payload: { ...korech } }) })
        const body = await res.json();
        return body;
    }
};

const root = document.getElementById("root");

const fetchOnLoad = async (kadeshId) => {
    const korech = await requests.fetch(kadeshId);
    mutation((state) => {
        state.korech = korech?.altar ? {
            ...korech,
            kadeshId: kadeshId,
        } : {
            altar: {
                content: "",
                sides: {
                    north: "",
                    east: "",
                    south: "",
                    west: ""
                },
            },
            kadeshId: kadeshId,
        };
    });
};

const toggleDisplaySave = () => {
    const korech = receptor("korech");
    if (korech.meta.isSaved) {
        saveButton.style.display = "none";
    } else {
        saveButton.style.display = "block";
    }
}

const displaySave = () => {
    saveButton.style.display = "block";
}
const hideSave = () => {
    saveButton.style.display = "none";
}

const onSave = () => {
    const korech = receptor("korech");
    requests.create(korech).then((res) => {
        if(res.id) {
            hideSave();
        } else {
            alert("Failed to save correctly?");
        }
    });

    


};

const onBack = () => {
    mutation((state) => {
        state.korech = null;
    });
    const event = new CustomEvent("to-kadesh", { detail: { } });
    document.dispatchEvent(event);
}

const container = seed("div", {
    id: "korech-page-container",
    // parent: root,
    style: {
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
    }
});

const altarContainer = seed("div", {
    id: "altar-container",
    parent: container,
    style: {
        display: "grid",
        gridTemplateColumns: "repeat(10, 1fr)",
        gridTemplateRows: "repeat(10, 1fr)",
        gridTemplateAreas: `
            "north-west north-west north north north north north north north-east north-east"
            "north-west north-west north north north north north north north-east north-east"
            "west west center center center center center center east east"
            "west west center center center center center center east east"
            "west west center center center center center center east east"
            "west west center center center center center center east east"
            "west west center center center center center center east east"
            "west west center center center center center center east east"
            "south-west south-west south south south south south south south-east south-east"
            "south-west south-west south south south south south south south-east south-east"
        `,
        height: "30rem",
        width: "30rem"
    }
});

const altarCenter = seed("div", {
    id: "altar-center",
    parent: altarContainer,
    style: {
        gridArea: "center"
    }
});

const altarEastSide = seed("div", {
    id: "altar-east-side",
    parent: altarContainer,
    style: {
        gridArea: "east"
    }
});

const altarCenterContent = seed("textarea", {
    id: "altar-center-content",
    parent: altarCenter,
    onkeyup: (event) => {
        mutation((state) => {
            state.korech.altar.content = event.target.value;
        });
        displaySave();
    },
    style: {
        height: "100%",
        width: "100%"
    }
});

const altarEasternSideFocusedContentContainer = seed("div", {
    id: "altar-east-side-focused-content-container",
    parent: altarEastSide,
    style: {
        position: "absolute",
        display: "relative",
        bottom: 0,
        right: 0,
        height: "calc(100% - 5rem)",
        backgroundColor: "transparent",
        color: "white",
        fontSize: "18px",
        fontWeight: "600",
        letterSpacing: "0.05rem",
        zIndex: 1000,
        transition: "all 0.3s ease-in-out",
        overflow: "hidden",
        width: "0",
    }
});

const altarEasternSideFocusedContentContainerText = seed("textarea", {
    id: "altar-east-side-focused-content-container-text",
    parent: altarEasternSideFocusedContentContainer,
    style: {
        padding: "1rem",
        height: "90%",
        marginTop: "10%",
    },
    onkeyup: (event) => {
        mutation((state) => {
            state.korech.altar.sides.east = event.target.value;
        });
        altarEastSideContent.value = event.target.value;
        displaySave();
    },

});

const closeEasternSideFocusedContentContainer = seed("div", {
    id: "close-eastern-side-focused-content-container",
    parent: altarEasternSideFocusedContentContainer,
    text: "✕",
    style: {
        position: "absolute",
        top: "1rem",
        left: "1rem",
        border: "1px solid lightgrey",
        borderRadius: "50%",
        height: "1rem",
        width: "1rem",
        padding: "0.5rem",
        cursor: "pointer",
        zIndex: 1001,
        backgroundColor: "white",
        color: "black",
        fontSize: "10px",
        fontWeight: "500",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    onclick: (event) => {
        console.log("onclick called", event)
        altarEasternSideFocusedContentContainer.style.width = "0";
    }
});

const altarEastSideContent = seed("textarea", {
    id: "altar-east-side-content",
    parent: altarEastSide,
    onkeyup: (event) => {
        mutation((state) => {
            state.korech.altar.sides.east = event.target.value;
        });

        if (event.target.value) {
            console.log("inside here..... ")
            altarEasternSideFocusedContentContainerText.value = event.target.value;
        } else {
            altarEasternSideFocusedContentContainerText.value = "";
        }

        displaySave();
    },
    onfocus: (event) => {
        console.log("onfocus called", event)
        altarEasternSideFocusedContentContainer.style.width = "20vw";
    },
    onfocusout: (event) => {
        console.log("onfocusout called", event)
        // altarEasternSideFocusedContentContainer.style.width = "0";
    }
});

const altarNorthSide = seed("div", {
    id: "altar-north-side",
    parent: altarContainer,
    style: {
        gridArea: "north"
    }
});

const altarNorthSideContent = seed("textarea", {
    id: "altar-north-side-content",
    parent: altarNorthSide,
    onchange: (event) => {
        mutation((state) => {
            state.korech.altar.sides.north = event.target.value;
        });
    }
});

const altarSouthSide = seed("div", {
    id: "altar-south-side",
    parent: altarContainer,
    style: {
        gridArea: "south"
    }
});

const altarSouthSideContent = seed("textarea", {
    id: "altar-south-side-content",
    parent: altarSouthSide,
    onchange: (event) => {
        mutation((state) => {
            state.korech.altar.sides.south = event.target.value;
        });
    }
});

const altarWestSide = seed("div", {
    id: "altar-west-side",
    parent: altarContainer,
    style: {
        gridArea: "west"
    }
});

const altarWestSideContent = seed("textarea", {
    id: "altar-west-side-content",
    parent: altarWestSide,
    onchange: (event) => {
        mutation((state) => {
            state.korech.altar.sides.west = event.target.value;
        });
    }
});

const northEastCorner = seed("div", {
    id: "north-east-corner",
    parent: altarContainer,
    style: {
        gridArea: "north-east"
    }
});

const southWestCorner = seed("div", {
    id: "south-west-corner",
    parent: altarContainer,
    style: {
        gridArea: "south-west"
    }
});

const northWestCorner = seed("div", {
    id: "north-west-corner",
    parent: altarContainer,
    style: {
        gridArea: "north-west"
    }
});

const southEastCorner = seed("div", {
    id: "south-east-corner",
    parent: altarContainer,
    style: {
        gridArea: "south-east"
    }
});

const backButtonContainer = seed("div", {
    id: "back-button-container",
    parent: container,
});

const backButton = seed("button", {
    id: "back-button",
    parent: backButtonContainer,
    text: "← Back",
    onclick: () => {
        onBack();
    },
    style: {}
});

const saveButtonContainer = seed("div", {
    id: "save-button-container",
    parent: container,
});

const saveButton = seed("button", {
    id: "save-button",
    parent: saveButtonContainer,
    text: "Save",
    onclick: () => {
        onSave();   
    },

});

const kadeshHeaderContainer = seed("div", {
    id: "kadesh-header-container",
    parent: container,

});

const kadeshHeader = seed("h1", {
    id: "kadesh-header",
    parent: kadeshHeaderContainer,
    style: {
    }
});



const setAltarValues = () => {
    const altar = receptor("korech.altar");
    altarCenterContent.value = altar.content;
    altarEastSideContent.value = altar.sides.east;
    altarNorthSideContent.value = altar.sides.north;
    altarSouthSideContent.value = altar.sides.south;
    altarWestSideContent.value = altar.sides.west;
    altarEasternSideFocusedContentContainerText.value = altar.sides.east;
}

const setKadeshHeaderText = () => {
    const kadesh = receptor("kadesh.kadesh");
    kadeshHeader.innerHTML = kadesh;
}

const Korech = {
    render: (kadeshId) => {
        
        fetchOnLoad(kadeshId).then((res) => {
            setAltarValues();
            setKadeshHeaderText();
        });
        const kadeshContainer = document.getElementById("kadesh-page-container");
        kadeshContainer.remove();
        root.appendChild(container);
        
    }
}

document.addEventListener("kadesh-selected", (event) => {
    const kadeshId = event.detail.kadeshId;
    Korech.render(kadeshId);
});