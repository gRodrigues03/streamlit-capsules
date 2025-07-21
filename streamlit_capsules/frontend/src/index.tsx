import { Streamlit, RenderData } from "streamlit-component-lib"

const labelDiv = document.body.appendChild(document.createElement("label"))
const label = labelDiv.appendChild(document.createTextNode(""))
let container = document.body.appendChild(document.createElement("div"))
container.classList.add("container")
let options: string[] = []


function adjustOpacity(color: string, opacity: number): string {
  const hex = color.replace('#', '')
  const bigint = parseInt(hex, 16)
  const r = (hex.length === 6 ? (bigint >> 16) & 255 : (bigint >> 8) & 15 * 17)
  const g = (hex.length === 6 ? (bigint >> 8) & 255 : (bigint >> 4) & 15 * 17)
  const b = (hex.length === 6 ? bigint & 255 : bigint & 15 * 17)

  return `rgba(${r}, ${g}, ${b}, ${opacity})`
}

function arraysEqual<T>(a: T[], b: T[]): boolean {
  if (a.length !== b.length) return false;
  return a.every((value, index) => value === b[index]);
}

/**
 * The component's render function. This will be called immediately after
 * the component is initially loaded, and then again every time the
 * component gets new data from Python.
 */
function onRender(event: Event): void {
  // Get the RenderData from the event
  const data = (event as CustomEvent<RenderData>).detail

  // reset the container if the options passed to the component have changed
  // in between reruns (without changing the key)
  if (!arraysEqual(data.args['options'], options)) { container.innerHTML = "" }

  options = data.args["options"]

  label.textContent = data.args["label"]
  let icons = data.args["icons"]
  let label_visibility = data.args["label_visibility"]
  let clearable = data.args["clearable"]
  const select_text = data.args["select_all_labels"] || ['Select All', 'Deselect All']
  const default_values = data.args["default"]
  const show_select_all = data.args["show_select_all"]
  if (label_visibility === "hidden") {
    labelDiv.style.visibility = "hidden"
  }
  if (label_visibility === "collapsed") {
    labelDiv.style.display = "none"
  }

  if (container.childNodes.length === 0) {
    let selectAllBtn: HTMLButtonElement
    let selectedItems: string[]
    let selectedItem: string | null = null

    // Add Select All if in multi mode
    const selectionMode = data.args["selection_mode"]
    if (selectionMode === "multi") {
      selectAllBtn = container.appendChild(document.createElement("button"))
      if (!show_select_all) { selectAllBtn.style.display = "none" }
      if (options.length === default_values.length) {
        selectAllBtn.textContent = select_text[1]
        selectAllBtn.classList.add("selected")
      } else {
        selectAllBtn.textContent = select_text[0]
      }
      selectAllBtn.classList.add("capsule")

      selectAllBtn.onclick = function () {
        if (selectAllBtn.classList.contains("selected")) {
          container.querySelectorAll(".capsule").forEach((capsuleEl) => {
            capsuleEl.classList.remove("selected")
          })
          selectedItems = []
          selectAllBtn.classList.remove("selected")
          selectAllBtn.textContent = select_text[0]
          Streamlit.setComponentValue(selectedItems)
          Streamlit.setFrameHeight()
        } else {
          container.querySelectorAll(".capsule").forEach((capsuleEl) => {
            capsuleEl.classList.add("selected")
          })
          selectedItems = options
          selectAllBtn.classList.add("selected")
          selectAllBtn.textContent = select_text[1]
          Streamlit.setComponentValue(selectedItems)
          Streamlit.setFrameHeight()
        }
      }
    }

    options.forEach((option: string, i: number) => {
      let capsule = container.appendChild(document.createElement("div"))
      capsule.classList.add("capsule")
      capsule.classList.add("option")
      if (data.args["selection_mode"] === 'single') {
        if (default_values === option) {
          capsule.classList.add("selected")
        }
      } else {
        if (default_values.includes(option)) {
          capsule.classList.add("selected")
        }
      }


      if (icons) {
        let icon_span = capsule.appendChild(document.createElement("span"))
        icon_span.classList.add("icon")
        icon_span.textContent = icons[i]
      }

      capsule.appendChild(document.createTextNode(option))

      // if (i === index) {
      //   capsule.classList.add("selected")
      // }

      capsule.onclick = function () {
        const selectionMode = data.args["selection_mode"]
        const isSelected = capsule.classList.contains("selected")

        if (selectionMode === "single") {
          let unselect = clearable && isSelected

          container.querySelectorAll(".capsule").forEach((el) => {
            el.classList.remove("selected")
          })

          if (unselect) {
            selectedItem = null
            Streamlit.setComponentValue(selectedItem)
          } else {
            capsule.classList.add("selected")
            selectedItem = options[i]
            Streamlit.setComponentValue(options[i])
          }

        } else if (selectionMode === "multi") {
          // Toggle selection
          if (isSelected) {
            capsule.classList.remove("selected")
          } else {
            capsule.classList.add("selected")
          }

          // Gather all selected indices
          selectedItems = Array.from(container.querySelectorAll(".option.selected"))
              .map(el => options[Array.from(container.children).indexOf(el) - 1])
          if (selectedItems.length === options.length) {selectAllBtn.textContent = select_text[1]; selectAllBtn.classList.add("selected") }
          else {selectAllBtn.textContent = select_text[0]; selectAllBtn.classList.remove("selected") }
          Streamlit.setComponentValue(selectedItems)
          Streamlit.setFrameHeight()
        }
      }
    })
  }


  // Style according to the app theme.
  if (data.theme) {
    document.documentElement.style.setProperty('--border-color', adjustOpacity(data.theme.textColor, 0.2))
    document.documentElement.style.setProperty('--selected', adjustOpacity(data.theme.primaryColor, 0.1))
    document.documentElement.style.setProperty('--hover-selected', adjustOpacity(data.theme.primaryColor, 0.2))
  }

  // We tell Streamlit to update our frameHeight after each render event, in
  // case it has changed. (This isn't strictly necessary for the example
  // because our height stays fixed, but this is a low-cost function, so
  // there's no harm in doing it redundantly.)
  Streamlit.setFrameHeight()
}

// Attach our `onRender` handler to Streamlit's render event.
Streamlit.events.addEventListener(Streamlit.RENDER_EVENT, onRender)

// Tell Streamlit we're ready to start receiving data. We won't get our
// first RENDER_EVENT until we call this function.
Streamlit.setComponentReady()

// Finally, tell Streamlit to update our initial height. We omit the
// `height` parameter here to have it default to our scrollHeight.
Streamlit.setFrameHeight()
