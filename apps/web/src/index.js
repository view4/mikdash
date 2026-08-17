import { createStore, mutation, receptor } from "@mikdash/state";
import { seed } from "@mikdash/components";
import { readExamples, createExample } from "./middleware.js";

// Initialize state
const store = createStore({
    title: "Mikdash Web",
    message: "Welcome to Mikdash!"
});

let Korech = null;