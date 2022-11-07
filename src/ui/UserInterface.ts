export class UserInterface {

    construct(): void {
        const title = "Kittens Automatic Manager";

        const optionsElement = $("<div />", { id: "kam" });
        const optionsTitleElement = $("<div />", { id: "kam-title", text: title });
        optionsElement.append(optionsTitleElement);

        const right = $("#rightColumn");
        right.prepend(optionsElement.append(optionsElement));
    }
}