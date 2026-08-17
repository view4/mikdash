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
    const res = await fetch(backend + "example", "POST", {action: "read", payload: {
    }});
    console.log("res.....")
    console.log(res)
    return res
}