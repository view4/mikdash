export const create = (tag, { attributes = {}, children = [] }) => {

    const element = document.createElement(tag);
    Object.entries(attributes).forEach(([key, value]) => {
        element.setAttribute(key, value);
    });

    children.forEach(child => {
        element.appendChild(child);
    });

    return element;
}



export const seed = (tag, { onclick, attributes = {}, children = [], parent }) => {

    const element = document.createElement(tag);
    Object.entries(attributes).forEach(([key, value]) => {
        element.setAttribute(key, value);
    });

    if (onclick) {
        element.addEventListener('onclick', onclick)
    }

    if (parent) {
        parent.appendChild(element)
    }

    children.forEach(child => {
        element.appendChild(child);
    });

    return element;
}
