import { BaseLayout } from "components/layout";
import { AppLink } from "components/tags/applink";
import { AppModuleMeta } from "lib/const";

export const meta: AppModuleMeta = {
	hasCSS: true,
	description: "様々な計算ができるツール置き場"
};

export const App = () => (
	<BaseLayout scope="index" isCentering={true}>
		<h1>Web道具箱</h1>

		<h2>時間系</h2>
		<div class="grid">
			<div>
				<AppLink app="time-clock">
					<h3>時計</h3>
					<p>ウィンドウに合わせたフォントサイズの時計</p>
				</AppLink>
			</div>
		</div>

		<h2>変換系</h2>
		<div class="grid">
			<div>
				<AppLink app="convert-encdec-string">
					<h3>文字列エンコーダ・デコーダ</h3>
					<p>Base64やURL形式等にエンコード・デコード</p>
				</AppLink>
			</div>
		</div>

		<h2>生成系</h2>
		<div class="grid">
			<div>
				<AppLink app="generate-random-string">
					<h3>ランダム文字列生成</h3>
					<p>任意の文字でランダムな文字列を生成</p>
				</AppLink>
			</div>
		</div>

		<h2>早見表</h2>
		<div class="grid">
			<div>
				<AppLink app="table-age">
					<h3>年齢早見表</h3>
					<p>基準日から年齢の早見表を生成</p>
				</AppLink>
			</div>
		</div>

		<h2>交通系</h2>
		<div class="grid">
			<div>
				<AppLink app="transport-commuter-pass">
					<h3>普通乗車券と定期券の比較計算</h3>
					<p>何回以上の利用で定期券の方がお得になるのかを計算</p>
				</AppLink>
			</div>
			<div>
				<AppLink app="transport-inner-yamanote">
					<h3>山手線内運賃表</h3>
					<p>東京山手線内相互の運賃表(券売機の上に掲示されているやつ)を自動生成</p>
				</AppLink>
			</div>
			<div>
				<AppLink app="transport-inner-yamanote-2026">
					<h3>山手線内運賃表(2026春～)</h3>
					<p>東京山手線内相互の運賃表(券売機の上に掲示されているやつ)を自動生成 ※2026春以降の運賃</p>
				</AppLink>
			</div>
			<div>
				<AppLink app="transport-jreast-shinkansen">
					<h3>JR東日本 新幹線運賃比較表</h3>
					<p>JR東日本の新幹線の任意の駅を起点とした乗車券・特急券・JREポイント利用の比較計算</p>
				</AppLink>
			</div>
		</div>

		<h2>当サイトについて</h2>
		<p>ジャンルを問わず、様々な計算ができるツール置き場です。すべてWebブラウザで動作し、入力内容はサーバへ送信されません。</p>
		<p>万が一動作がおかしくなってしまった場合は、ページのリロードをお試しください。</p>
		<p>すべてのソースコードは<a href="https://github.com/Raintensity/WebTools" target="_blank" rel="noopener noreferrer">GitHub</a>上に公開しており、自由にソースを閲覧できます(ライセンスはMIT)。</p>
		<p><a href="https://blog.usx.jp/">管理者のブログはこちら</a></p>

		<h2>更新情報</h2>
		<div class="grid-table">
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
