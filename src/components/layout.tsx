import { PreactDOMAttributes } from "preact";

interface BaseLayoutProps extends PreactDOMAttributes {
	isCentering?: boolean
	scope: string
}

export const BaseLayout = (props: BaseLayoutProps) => {
	return (
		<div id="content" data-scope={props.scope} class={props.isCentering ? "fixed-width" : ""}>
			{props.children}
		</div>
	);
};
