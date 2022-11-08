import { stringify } from "querystring";

export class QoLSettingsUi {
    private _element: JQuery<HTMLElement>;

    private readonly idPrefix = "qolsettings-";
    private readonly title = "Quality of Life";
    private readonly options = [ "Auto Gathering", "Auto Observing" ];

    constructor()
    {
        this.constructElement();
    }

    public get element(): JQuery<HTMLElement>
    {
        return this._element;
    }

    private set element(val: JQuery<HTMLElement>)
    {
        this._element = val;
    }

    constructElement(): void 
    {
        const panelElement = $("<li />");

        const collapsibleButton = $("<button />", { class: "kam-collapsible", text: this.title });
        

        collapsibleButton.on("click", event => this._collapseOrExpand(event));

        const optionsList = $("<ul />", { style: "display: none"});
        
        for (var i in this.options) {
            const node = $("<li />")
            const checkbox = $("<input />", { type: "checkbox", id: this.idPrefix + i});
            const label = $("<label />", { for: this.idPrefix + i });
            label.text(this.options[i]);

            node.append(checkbox);
            node.append(label);
            optionsList.append(node);
        }

        panelElement.append(collapsibleButton);
        panelElement.append(optionsList);

        this.element = panelElement;     
    }

    private _collapseOrExpand(event: JQuery.ClickEvent<HTMLElement, undefined, HTMLElement, HTMLElement>)
    {
        event.target.classList.toggle("active");
        var content = event.target.nextElementSibling;

        if (content.getAttribute("style") == "display: block")
        {
            content.setAttribute("style", "display: none");
        }
        else
        {
            content.setAttribute("style", "display: block");
        }
    }
}
