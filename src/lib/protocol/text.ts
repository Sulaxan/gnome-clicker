export const DEFAULT_COLOR = "#e2e8f0";
export const SPACE: TextComponent = {
    type: "default",
};

export interface TextComponent {
    // the type of the text component
    type: "default" | "space";
    content?: string;
    // any valid css colour specifier
    color?: string;
    bold?: boolean;
    italic?: boolean;
}

export class TextBuilder {
    private components: TextComponent[] = [];

    constructor(from?: TextComponent[]) {
        if (from !== undefined) {
            this.components = from;
        }
    }

    /**
     * Add text to the builder.
     *
     * @param content The text to add.
     * @returns this.
     */
    public text(content: string): TextBuilder {
        this.components.push({
            type: "default",
            content: content,
        });
        return this;
    }

    /**
     * Sets the last added text's color.
     *
     * @param color The color to set.
     * @returns this
     */
    public color(color: string): TextBuilder {
        if (this.components.length > 0) {
            this.components[this.components.length - 1].color = color;
        }

        return this;
    }

    /**
     * Sets the last added text to be bold.
     *
     * @returns this
     */
    public bold(): TextBuilder {
        if (this.components.length > 0) {
            this.components[this.components.length - 1].bold = true;
        }

        return this;
    }

    /**
     * Sets the last added text to be italic.
     *
     * @returns this
     */
    public italic(): TextBuilder {
        if (this.components.length > 0) {
            this.components[this.components.length - 1].italic = true;
        }

        return this;
    }

    /**
     * Adds a space character.
     * @returns this
     */
    public space(): TextBuilder {
        this.components.push({
            type: "space",
        });
        return this;
    }

    /**
     * Builds the component.
     *
     * @returns The built component.
     */
    public build() {
        return this.components;
    }

    public static new() {
        return new TextBuilder();
    }

    public static from(components: TextComponent[]) {
        return new TextBuilder(components);
    }
}
