import { render } from "components/render";
import { getAppUrl } from "lib/history";

const url = getAppUrl("transport-inner-yamanote");
window.history.replaceState(null, "", url);
render();
