import { AnyComponent } from "preact";

export interface AppModule {
	App: AnyComponent
	meta?: AppMeta
}

export interface AppMeta {
	hasCSS?: boolean
	minimalGlobalHeader?: boolean
}
