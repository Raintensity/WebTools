import { getAppUrl, goApp } from "lib/history";
import { PreactDOMAttributes } from "preact";

interface AppLinkProps extends PreactDOMAttributes {
	app?: string
}

const clickEvent = (e: Event) => {
	if (!(e.currentTarget instanceof HTMLAnchorElement)) return;
	e.preventDefault();

	const params = new URL(e.currentTarget.href).searchParams;
	goApp(params.get("app") ?? "");
};

export const AppLink = (props: AppLinkProps) => (
	<a href={getAppUrl(props.app)} onClick={clickEvent}>{props.children}</a>
);
