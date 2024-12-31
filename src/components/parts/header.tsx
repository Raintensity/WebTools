import { PreactDOMAttributes } from "preact";

interface GlobalHeaderProps extends PreactDOMAttributes {
	isForceMinimal?: boolean
	isCentering?: boolean
}

const Full = () => (
	<div id="global-header">
		<ul>
			<li><a href="/"><h2>WebTools</h2></a></li>
			<li style="flex:1"></li>
			<li>✕</li>
		</ul>
	</div>
);

const Minimal = () => (
	<div id="global-header-minimal">MinimalHeader</div>
);

export const GlobalHeader = (props: GlobalHeaderProps) => {
	if (props.isForceMinimal) {
		return <Minimal />;
	}
	return <Full />;
};
