import streamlit as st

from streamlit_capsules import capsules

st.set_page_config("Demo for streamlit-capsules", "💊")
#st.warning("This component is deprecated. It's now available in Streamlit itself via st.pills, see docs. This component will not be updated anymore.")
st.write(
    f'<span style="font-size: 78px; line-height: 1">💊</span>',
    unsafe_allow_html=True,
)

"# Demo for [streamlit-capsules](https://github.com/gRodrigues03/streamlit-capsules)"
"based on [streamlit-pills](https://github.com/jrieke/streamlit-pills) by [jrieke](https://github.com/jrieke)"
"## Example"

options = [
    "General widgets",
    "Charts",
    "Images",
    "Video",
    "Text",
    "Maps & geospatial",
    "Dataframes & tables",
    "Molecules & genes",
    "Graphs",
    "3D",
    "Code & editors",
    "Page navigation",
    "Authentication",
    "Style & layout",
    "Developer tools",
    "App builders",
    "Integrations with other tools",
    "Collections of components",
]

icons = [
    "🧰",
    "📊",
    "🌇",
    "🎥",
    "📝",
    "🗺️",
    "🧮",
    "🧬",
    "🪢",
    "🧊",
    "✏️",
    "📃",
    "🔐",
    "🎨",
    "🛠️",
    "🏗️",
    "🔌",
    "📦",
]

"default options: ['3D', 'Authentication']"

selected = capsules("Select a category", options, default=['3D', 'Authentication'], icons=icons, selection_mode='multi')
st.write("You selected:", selected)

"## API reference"
st.help(capsules)
