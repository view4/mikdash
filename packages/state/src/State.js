import { getIn } from "./utils/object.js";

const state = {};

const mutation = (handler, payload) => {
    handler(state, payload);
    return state;
};

const receptor = (path) => {
    console.log({
        state, path
    })
    return getIn(state, path);
};

const effect = async (handler, payload) => {
    const res = await handler(payload);
    return res;
};

const unifyState = (cells = []) => {
    cells.forEach(cell => {
        state[cell.name] = {
            receptor: cell.receptor,
            mutation: cell.mutation,
            effect: cell.effect,
        }
    });
    return state;
}

export {
    unifyState,
    mutation,
    receptor,
    effect,
}

// const State = {};

// const registerCell = (cell) => {
//     State[cell.name] = cell;
//     return cell;
// };

// const unifyState = (cells = []) => {
//     cells.forEach(registerCell);
//     return State;
// }

// export const cell = (properties) => {
//     return {
//         receptor: (...args) => properties.receptor(State, ...args),
//         signal: (payload) => {
//             // handled action which does 
//         }
//     }

// };

// const kadesh = cell({
//     name: "kadesh.submit",
//     mutation: (state, payload) => {
//         state.kadesh = payload.value;
//     },
//     effect: async (payload) => {
//         const res = await fetch("");
//     }, 
//     receptor: (state) => state.kadesh, 
// });

