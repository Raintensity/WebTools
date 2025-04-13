import { BaseLayout } from "components/layout";
import { AppLink } from "components/tags/applink";
import { CATEGORY_LIST } from "lib/appinfo";
import { AppMeta } from "lib/const";

export const meta: AppMeta = {
	hasCSS: true
};

export const App = () => (
	<BaseLayout scope="index" isCentering={true}>
		<h1>Web道具箱</h1>

		{CATEGORY_LIST.map(category => (
			<>
				<h2>{category.name}</h2>
				<div class="grid">
					{category.apps.map(app => (
						<div>
							<AppLink app={app.slug}>
								<h3>{app.name}</h3>
								<p>{app.description}</p>
							</AppLink>
						</div>
					))}
				</div>
			</>
		))}


		<h2>当サイトについて</h2>
		<p>ジャンルを問わず、様々な計算ができるツール置き場です。すべてWebブラウザで動作し、入力内容はサーバへ送信されません。</p>
		<p>万が一動作がおかしくなってしまった場合は、ページのリロードをお試しください。</p>
		<p>すべてのソースコードは<a href="https://github.com/Raintensity/WebTools" target="_blank" rel="noopener noreferrer">GitHub</a>上に公開しており、自由にソースを閲覧できます(ライセンスはMIT)。</p>
		<p><a href="https://blog.usx.jp/">管理者のブログはこちら</a></p>

		<h2>更新情報</h2>
		<div class="grid-table">
			<p>2025/04/14</p>
			<p><AppLink app="convert-hash">ハッシュ計算</AppLink>&nbsp;公開</p>
			<p>2025/04/06</p>
			<p><AppLink app="convert-unit">単位変換</AppLink>&nbsp;公開</p>
			<p>2025/03/25</p>
			<p><AppLink app="generate-calendar">カレンダー生成</AppLink>、<AppLink app="table-year">年情報</AppLink>&nbsp;公開</p>
			<p>2025/03/20</p>
			<p><AppLink app="convert-datetime">日時フォーマット変換</AppLink>&nbsp;公開</p>
			<p>2025/03/10</p>
			<p><AppLink app="viewer-binary">バイナリビューア</AppLink>&nbsp;公開</p>
			<p>2025/03/05</p>
			<p><AppLink app="table-unicode">Unicode文字早見表</AppLink>&nbsp;公開</p>
			<p>2025/03/03</p>
			<p><AppLink app="convert-encdec-string">文字列エンコーダ・デコーダ</AppLink>&nbsp;公開</p>
			<p>2025/03/01</p>
			<p><AppLink app="table-age">年齢早見表</AppLink>&nbsp;公開</p>
			<p>2025/02/15</p>
			<p><AppLink app="generate-random-string">ランダム文字列生成</AppLink>&nbsp;公開</p>
			<p>2025/02/01</p>
			<p><AppLink app="time-clock">時計</AppLink>、<AppLink app="transport-commuter-pass">普通乗車券と定期券の比較計算</AppLink>、<AppLink app="transport-inner-yamanote">山手線内運賃表</AppLink>(<AppLink app="transport-inner-yamanote-2026">2026春～</AppLink>)、<AppLink app="transport-jreast-shinkansen">JR東日本 新幹線運賃比較表</AppLink>&nbsp;公開</p>
		</div>
	</BaseLayout>
);
