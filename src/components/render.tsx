import { PreactDOMAttributes, render as preactRender } from "preact";
import { Dispatch, Suspense, useState } from "preact/compat";
import { StateUpdater } from "preact/hooks";
import { GlobalHeader } from "./parts/header";
import { GlobalLoading } from "./parts/loading";
import { AppModule } from "lib/const";
// import "preact/debug";

interface AppRouterProps extends PreactDOMAttributes {
	setMinimalHeader: Dispatch<StateUpdater<boolean>>
}

const AppRouter = (props: AppRouterProps) => {
	const params = new URL(window.location.href).searchParams;
	const page = params.get("app") ?? "index";

	let appModule: AppModule | null | undefined = undefined;
	let appStyle: string | null | undefined = undefined;
	const Application = () => {
		if (appModule === undefined) {
			throw import("../app/" + page + ".tsx")
				.then(e => appModule = e)
				.catch(_ => appModule = null);
		}
		if (appModule === null) return <p>Error</p>;//TODO

		const App = appModule.App;
		props.setMinimalHeader(appModule.meta?.minimalGlobalHeader ?? false);
		if (appModule.meta?.hasCSS && appStyle === undefined) {
			throw fetch("../app/" + page + ".css")
				.then(e => e.ok ? e.text() : Promise.reject())
				.then(e => appStyle = e)
				.catch(() => appStyle = null);
		}

		return (
			<>
				{appStyle && <style>{appStyle}</style>}
				<App />
			</>
		);
	};

	return (
		<Suspense fallback={<GlobalLoading />}>
			<Application />
		</Suspense>
	);
};

const Wrapper = () => {
	const [isMinimalHeader, setMinimalHeader] = useState(false);
	return (
		<>
			<GlobalHeader isForceMinimal={isMinimalHeader} />
			<AppRouter setMinimalHeader={setMinimalHeader} />
		</>
	);
};

export const render = () => {
	const root = document.getElementById("root");
	if (root) {
		preactRender(<Wrapper />, root);
	}
};
