class HtmlElement {
  constructor(type, className = "") {
    let element = document.createElement(type);
    if (className != "") element.className = className;

    this.element = element;
    console.log(element);
  }

  setID(id) {
    this.element.id = id;
    return this;
  }

  setName(name) {
    this.element.name = name;
    return this;
  }

  setProperty(property, value) {
    this.element.setAttribute(property, value);
    return this;
  }

  addClass(className) {
    this.element.className.add(className);
    return this;
  }

  addChild(...children) {
    children.forEach((child) => {
      this.element.appendChild(child.element);
    });
    return this;
  }

  addText(text) {
    let textNode = document.createTextNode(text);
    this.element.appendChild(textNode);
    return this;
  }

  addEvent(type, event) {
    this.element.addEventListener(type, () => event);
    return this;
  }

  addClick(event) {
    this.addEvent("click", event);
    return this;
  }
}

class LinkElement extends HtmlElement {
  constructor(className, eventOnClick) {
    super("a", className);
    this.addClick(eventOnClick);
  }
}

export { LinkElement, HtmlElement };
