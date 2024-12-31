import { render } from "components/render";

export const getAppUrl = (app?: string | null) => {
	if (app) return "/?app=" + app;
	return "/";
};

export const goApp = (app?: string) => {
	window.history.pushState(null, "", getAppUrl(app));
	render();
};

window.addEventListener("popstate", e => {
	render();
});
