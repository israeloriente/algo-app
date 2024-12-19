import { Component, Input, EventEmitter, Output } from "@angular/core";

export type KeyboardType = "alphabet" | "numbers" | KeyboardKey[][];
export type KeyboardKey = string | number | { icon: string; key: string };
/** This component is inside AddPlateModalPage. This component handles the keyboard and license plate creation.
 */
@Component({
  selector: "app-keyboard",
  templateUrl: "./input-keyboard.component.html",
  styleUrls: ["./input-keyboard.component.scss"],
})
export class KeyboardComponent {
  @Input() isAutoToggleKeyboard: boolean = true;
  @Input() keyboard: KeyboardType | KeyboardKey[][] = "alphabet";
  @Output() onClick = new EventEmitter<String>();

  private keyboard_alphabet = [
    ["A", "B", "C", "D", "E"],
    ["F", "G", "H", "I", "J"],
    ["K", "L", "M", "N", "O"],
    ["P", "Q", "R", "S", "T"],
    ["U", "V", "W", "X", "Y"],
    ["123", "Z", { icon: "backspace-outline", key: "delete" }],
  ];

  private keyboard_numbers = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    ["ABC", "0", { icon: "backspace-outline", key: "delete" }],
  ];

  private _KeyboardType: KeyboardType;
  protected _keyboard: KeyboardKey[][] = this.keyboard_alphabet;

  ngOnInit() {
    this._KeyboardType = this.keyboard;
    if (typeof this.keyboard == "object") {
      this._keyboard = this.keyboard;
    } else if (this.keyboard == "numbers") this._keyboard = this.keyboard_numbers;
    else this._keyboard = this.keyboard_alphabet;
  }

  /***
   * @param item
   * @description This function is called when a key is pressed. It emits the key value to the parent component.
   */
  protected click(item: KeyboardKey) {
    if (typeof item == "object") item = item.key;
    if (this.isAutoToggleKeyboard && (item == "ABC" || item == "123")) this.onToggleKeyboard();
    this.onClick.emit(item.toString());
  }

  /***
   * @param keyboard
   * @description sets the keyboard type
   * ***/
  set keyboardType(keyboard: KeyboardType | [][]) {
    this._KeyboardType = keyboard;
    if (typeof keyboard == "object") this._keyboard = keyboard;
    else if (keyboard == "numbers") this._keyboard = this.keyboard_numbers;
    else this._keyboard = this.keyboard_alphabet;
  }

  get keyboardType(): KeyboardType {
    return this._KeyboardType;
  }

  public onToggleKeyboard() {
    if (typeof this._KeyboardType == "string")
      this.keyboardType = this._KeyboardType == "alphabet" ? "numbers" : "alphabet";
  }

  protected getClass() {
    if (typeof this._KeyboardType == "object") return "buttonAlfabetic";
    else if (this._KeyboardType == "alphabet") return "buttonAlfabetic";
    else return "buttonNumber";
  }

  public setKey(keyboard: KeyboardType, searchValue: KeyboardKey, replaceValue: KeyboardKey): void {
    let board: KeyboardKey[][] = [];
    if (typeof keyboard == "object") board = keyboard;
    else if (keyboard == "alphabet") board = this.keyboard_alphabet;
    else board = this.keyboard_numbers;
    const replace = typeof replaceValue == "object" ? replaceValue.key : replaceValue;
    for (let row in board) {
      for (let key in board[row]) {
        const search =
          typeof board[row][key] == "object" ? (board[row][key] as any)?.key : board[row][key];
        if (search == searchValue) {
          board[row][key] = replaceValue;
          if (typeof keyboard == "object") keyboard = board;
          return;
        }
      }
    }
  }
}
