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



export const seed = (tag, { id, onclick, text, className, attributes = {}, children = [], parent, style, onchange, onkeyup, onfocus, onfocusout } = {}) => {

    const element = document.createElement(tag.trim());
    Object.entries(attributes).forEach(([key, value]) => {
        element.setAttribute(key, value);
    });

    if (id) {
        element.setAttribute("id", id)

    }

    if (className) {
        element.classList.add(className)
    }

    if (onclick) {
        element.addEventListener('click', onclick)
    }

    if (onchange) {
        console.log("setting onchange", onchange, tag)
        element.addEventListener('change', (e) => {
            onchange(e)
        })
    }

    if(onkeyup) {
        element.addEventListener('keyup', (e) => {
            onkeyup(e)
        })
    }

    if (onfocus) {
        element.addEventListener('focus', (e) => {
            onfocus(e)
        })
    }

    if (onfocusout) {
        element.addEventListener('focusout', (e) => {
            onfocusout(e)
        })
    }

    if (parent) {
        parent.appendChild(element)
    }

    if (text) {
        element.innerHTML = text
    }

    if (style) {
        Object.entries(style).forEach(([key, value]) => {
            element.style[key] = value;
        });
    }

    children.forEach(child => {
        element.appendChild(child);
    });

    return element;
}
