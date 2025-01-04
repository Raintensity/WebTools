import { render } from "components/render";

export const getAppUrl = (app?: string | null) => {
	if (app) return "/?app=" + app;
	return "/";
};

export const goApp = (app?: string) => {
	const currentUrl = new URL(window.location.href);
	const url = getAppUrl(app);
	if (currentUrl.pathname + currentUrl.search === url) return;
	window.history.pushState(null, "", url);
	render();
};

window.addEventListener("popstate", e => {
	render();
});
