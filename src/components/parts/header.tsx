import { PreactDOMAttributes } from "preact";
import { useState } from "preact/hooks";
import { AppLink } from "components/tags/applink";

const stateStorageKey = "global:header-state";

interface GlobalHeaderProps extends PreactDOMAttributes {
	isForceMinimal?: boolean
	isCentering?: boolean
}
export const GlobalHeader = (props: GlobalHeaderProps) => {
	const storageState = window.localStorage.getItem(stateStorageKey) ? true : false;
	const [initialState, setInitialState] = useState(props.isForceMinimal);
	const [isMinimal, setMinimal] = useState(storageState);

	if (initialState !== props.isForceMinimal) {
		setInitialState(props.isForceMinimal);
		setMinimal(props.isForceMinimal ? true : storageState);
	}

	const changeState = (e?: Event) => {
		e?.preventDefault();
		setMinimal(prev => {
			if (props.isForceMinimal) return !prev;
			if (prev) {
				window.localStorage.removeItem(stateStorageKey);
			} else {
				window.localStorage.setItem(stateStorageKey, "1")
			}
			return !prev;
		});
	};

	if (isMinimal) {
		return <Minimal changeState={changeState} />;
	}
	return <Full changeState={changeState} isLayered={props.isForceMinimal} />;
};

interface HeaderProps extends PreactDOMAttributes {
	changeState: () => void
	isLayered?: boolean
}
const Full = (props: HeaderProps) => (
	<div id="global-header" class={props.isLayered ? "layered" : ""}>
		<ul>
			<li><AppLink><h2>Web道具箱</h2></AppLink></li>
			<li style="flex:1"></li>
			<li><a href="https://github.com/Raintensity/WebTools" target="_blank" rel="noopener noreferrer"><img src="/assets/img/common/github.svg" alt="GitHub" width="20" height="20" /></a></li>
			<li><a href="#" onClick={props.changeState}>&#x23f5;</a></li>
		</ul>
	</div>
);
const Minimal = (props: HeaderProps) => (
	<div id="global-header-minimal"><p><a href="#" onClick={props.changeState}>&#x23f4;</a></p></div>
);
