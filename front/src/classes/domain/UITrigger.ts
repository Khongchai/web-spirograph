import { ReactElement } from "react";

/**
 * An object that has a trigger callback to trigger a UI on or off.
 * The UI itself is the other property. Simply add it to the your render tree.
 * If the UI state is set to not show, the UI will simply disappear -- replaces itself with a fragment.
 */
export interface UITrigger {
    trigger: (show: boolean) => void;
    UI: () => ReactElement
}