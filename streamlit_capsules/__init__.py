from pathlib import Path
from typing import Iterable, Union, Callable, Literal

import streamlit.components.v1 as components

_RELEASE = True

if not _RELEASE:
    _component_func = components.declare_component("capsules", url="http://localhost:3001")
else:
    path = (Path(__file__).parent / "frontend" / "build").resolve()
    _component_func = components.declare_component("capsules", path=path)


def capsules(
    label: str,
    options: Iterable[str],
    icons: Iterable[str] = None,
    default: Iterable[str] | str=(),
    *,
    format_func: Callable = None,
    label_visibility: str = "visible",
    clearable: bool = None,
    selection_mode: Literal['single', 'multi'] ='single',
    key: str = None,
):
    """Shows clickable capsules.

    Args:
        label (str): The label shown above the capsules.
        options (iterable of str): The texts shown inside of the capsules.
        icons (iterable of str, optional): The emoji icons shown on the left side of the
            capsules. Each item must be a single emoji. Default to None.
        default (list, str or None, optional): The value or list of values that are selected by default.
            If None, no pill is selected. Defaults to None.
        format_func (callable, optional): A function that is applied to the pill text 
            before rendering. Defaults to None.
        label_visibility ("visible" or "hidden" or "collapsed", optional): The visibility 
            of the label. Use this instead of `label=""` for accessibility. Defaults to 
            "visible".
        clearable (bool, optional): Whether the user can unselect the selected pill by
            clicking on it. If None, this is possible if `index` is set to None.
            Defaults to None.
        key (str, optional): The key of the component. Defaults to None.

    Returns:
        (any): The text of the pill selected by the user (same value as in `options`).
    """

    # Do some checks to verify the input.
    if len(options) < 1:
        raise ValueError("At least one option must be passed but `options` is empty.")
    if icons is not None and len(options) != len(icons):
        raise ValueError(
            "The number of options and icons must be equal but `options` has "
            f"{len(options)} elements and `icons` has {len(icons)} elements."
        )
    # TODO: Handle invalid defaults.
    if isinstance(default, str) and default not in options:
        raise ValueError(
            f"The default value '{default}' is not included in the options."
        )
#     if index is not None and index >= len(options):
#         raise ValueError(
#             f"`index` must be smaller than the number of options ({len(options)}) "
#             f"but it is {index}."
#         )
    if label_visibility not in ["visible", "hidden", "collapsed"]:
        raise ValueError(
            f"`label_visibility` must be one of 'visible', 'hidden' or 'collapsed' "
            f"but it is {label_visibility}."
        )
    # TODO: Verify that icons are actually emoji icons.
        
    if format_func:
        formatted_options = [format_func(option) for option in options]
    else:
        formatted_options = options

    # Pass everything to the frontend.
    component_value = _component_func(
        label=label,
        options=formatted_options,
        icons=icons,
        default=default,
        value=default,
        label_visibility=label_visibility,
        clearable=clearable,
        selection_mode=selection_mode,
        key=key,
    )

    # The frontend component returns the index of the selected pill but we want to
    # return the actual value of it.
    return component_value
