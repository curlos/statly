// Vite resolves this to the bundled asset URL
const copicTexture = new URL('../assets/themes/ink-marker/copic-texture.png', import.meta.url).href;

/**
 * @description Hidden SVG filter used by the Ink & Marker UI theme. Charts (Recharts, heatmaps) paint
 * the theme color directly in SVG, where CSS background textures can't reach, so ink-marker.css applies
 * `filter: url(#ink-marker-copic)` to them. It tiles the same Copic marker texture (copic-texture.png)
 * and blends it over whatever color the shape already has with soft-light, like the CSS does.
 */
const CopicFilterDefs = () => (
	<svg aria-hidden="true" focusable="false" width="0" height="0" style={{ position: 'absolute' }}>
		<filter id="ink-marker-copic" x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB" primitiveUnits="userSpaceOnUse">
			<feImage href={copicTexture} x="0" y="0" width="800" height="512" preserveAspectRatio="none" result="texture" />
			<feTile in="texture" result="tiled" />
			<feBlend in="tiled" in2="SourceGraphic" mode="soft-light" result="inked" />
			{/* keep the original shape (and its transparency) */}
			<feComposite in="inked" in2="SourceGraphic" operator="in" />
		</filter>
	</svg>
);

export default CopicFilterDefs;
