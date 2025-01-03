import { AppLink } from "components/tags/applink";

export const ErrorPage = () => (
	<div id="content" class="fixed-width">
		<h1 style={{ fontSize: "28px", color: "var(--color-hl)" }}>ページが見つかりません</h1>
		<p style={{ marginTop: "10px" }}>お手数ですが、<a href={window.location.href} onClick={reload}>ブラウザのリロード</a>をお試しください。</p>
		<p style={{ marginTop: "10px" }}>それでもこの画面が表示される場合、お探しのページはアドレスが間違っているか、移動もしくは削除された可能性があります。</p>
		<p style={{ marginTop: "10px" }}><AppLink>トップページに戻る</AppLink></p>
	</div>
);

const reload = (e: MouseEvent) => {
	e.preventDefault();
	window.location.reload();
};
