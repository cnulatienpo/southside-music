export class TextInput {
  private text = "";

  setText(text: string): void {
    this.text = text;
  }

  getText(): string {
    return this.text;
  }
}
