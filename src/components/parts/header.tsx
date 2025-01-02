import { PreactDOMAttributes } from "preact";
import { AppLink } from "components/tags/applink";

interface GlobalHeaderProps extends PreactDOMAttributes {
	isForceMinimal?: boolean
	isCentering?: boolean
}

const Full = () => (
	<div id="global-header">
		<ul>
			<li><AppLink><h2>WebTools</h2></AppLink></li>
			<li style="flex:1"></li>
			<li><a href="https://github.com/Raintensity/WebTools" target="_blank" rel="noopener noreferrer"><img src="/assets/img/common/github.svg" alt="GitHub" width="20" height="20" /></a></li>
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
