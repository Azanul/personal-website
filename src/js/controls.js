export default class Controls {
    constructor(_options) {
        this.camera = _options.camera
        this.setActions()
        this.setKeyboard()
    }

    setActions() {
        this.actions = {}
        this.actions.up = false
        this.actions.right = false
        this.actions.down = false
        this.actions.left = false
        this.actions.brake = false
        this.actions.boost = false
    }

    setKeyboard() {
        this.keyboard = {}
        this.keyboard.events = {}

        this.keyboard.events.keyDown = (_event) => {
            switch (_event.code) {
                case "ArrowUp":
                case "KeyW":
                    this.actions.up = true
                    break

                case "ArrowRight":
                case "KeyD":
                    this.actions.right = true
                    break

                case "ArrowDown":
                case "KeyS":
                    this.actions.down = true
                    break

                case "ArrowLeft":
                case "KeyA":
                    this.actions.left = true
                    break

                case "ControlLeft":
                case "ControlRight":
                case "Space":
                    this.actions.brake = true
                    break

                case "ShiftLeft":
                case "ShiftRight":
                    this.actions.boost = true
                    break
            }
        }

        this.keyboard.events.keyUp = (_event) => {
            switch (_event.code) {
                case "ArrowUp":
                case "KeyW":
                    this.actions.up = false
                    break

                case "ArrowRight":
                case "KeyD":
                    this.actions.right = false
                    break

                case "ArrowDown":
                case "KeyS":
                    this.actions.down = false
                    break

                case "ArrowLeft":
                case "KeyA":
                    this.actions.left = false
                    break

                case "ControlLeft":
                case "ControlRight":
                case "Space":
                    this.actions.brake = false
                    break

                case "ShiftLeft":
                case "ShiftRight":
                    this.actions.boost = false
                    break

                case "KeyR":
                    this.trigger("action", ["reset"])
                    break
            }
        }

        document.addEventListener("keydown", this.keyboard.events.keyDown)
        document.addEventListener("keyup", this.keyboard.events.keyUp)
    }
}
