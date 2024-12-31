import { BaseLayout } from "components/layout";
import { AppModuleMeta } from "lib/const";

export const App = () => (
	<BaseLayout scope="index" isCentering={true}>
		<h1>WebTools</h1>
	</BaseLayout>
);

export const meta: AppModuleMeta = {
	hasCSS: true
};
