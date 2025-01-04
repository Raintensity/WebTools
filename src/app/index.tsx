import { BaseLayout } from "components/layout";
import { AppLink } from "components/tags/applink";
import { AppModuleMeta } from "lib/const";

export const meta: AppModuleMeta = {
	hasCSS: true,
	description: "様々な計算ができるツール置き場"
};

export const App = () => (
	<BaseLayout scope="index" isCentering={true}>
		<h1>WebTools</h1>

		<h2>時間系</h2>
		<div class="grid">
			<div>
				<AppLink app="time-clock">
					<h3>時計</h3>
					<p>ウィンドウに合わせたフォントサイズの時計</p>
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
				<AppLink app="transport-jreast-shinkansen">
					<h3>JR東日本 新幹線運賃比較表</h3>
					<p>JR東日本の新幹線の任意の駅を起点とした乗車券・特急券・JREポイント利用の比較計算</p>
				</AppLink>
			</div>
		</div>

		<h2>更新情報</h2>
		<div class="grid-table">
		</div>
	</BaseLayout>
);
