import { createStore, mutation, receptor } from "@mikdash/state";
import { seed } from "@mikdash/components";

const backend = " http://localhost:3001/api/";

export const createExample = async () => {
    const res = await fetch(backend + "example", "POST", {action: "write", payload: {
        title: "Example Item", done: false
    }});
    console.log("res.....")
    console.log(res)
    return res
}

export const readExamples = async () => {
    const res = await fetch({
        url: backend,
        method: "POST",
        pathname: "/api/example",
                body: {
            action: "read", 
            payload: {}
        }

    });
    console.log("res.....")
    console.log(res)
    return res
}

const root = document.getElementById("root");


const renderButton = () => {
    document.getElementById("button")?.remove()

    let text = "Hello";
    const isClicked = receptor("isClicked");
    if (isClicked) {
        text += " is clicked!"
    } else {
        text += " click me!"
    }
    seed("button", {
        onclick: () => {
            mutation((state) => {
                state.isClicked = !state.isClicked

            })
            renderButton();
        },
        parent: root,
        text: text,
        id: "button"
    });
}

const render = () => {
    readExamples()
    renderButton()
}

render();
