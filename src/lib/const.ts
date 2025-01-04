import { AnyComponent } from "preact";

export interface AppModule {
	App: AnyComponent
	meta?: AppModuleMeta
}

export interface AppModuleMeta {
	hasCSS?: boolean
	minimalGlobalHeader?: boolean
	title?: string
	description?: string
}
