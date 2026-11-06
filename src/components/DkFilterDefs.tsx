/**
 * @description Hidden SVG filter used by the Donkey Kong Bananza UI theme. dk-bananza.css draws every
 * border as a thin layer and applies `filter: url(#dk-hand)`, which bends the line into a smooth,
 * slightly uneven, hand-drawn stroke (the blur + alpha step keeps the edges anti-aliased).
 */
const DkFilterDefs = () => (
	<svg aria-hidden="true" focusable="false" width="0" height="0" style={{ position: 'absolute' }}>
		<filter id="dk-hand" x="-4%" y="-10%" width="108%" height="120%" colorInterpolationFilters="sRGB">
			<feTurbulence type="fractalNoise" baseFrequency="0.011 0.018" numOctaves="1" seed="4" result="warp" />
			<feDisplacementMap
				in="SourceGraphic"
				in2="warp"
				scale="6"
				xChannelSelector="R"
				yChannelSelector="G"
				result="wobble"
			/>
			<feGaussianBlur in="wobble" stdDeviation="0.75" result="soft" />
			<feComponentTransfer in="soft">
				<feFuncA type="linear" slope="2" intercept="-0.25" />
			</feComponentTransfer>
		</filter>
	</svg>
);

export default DkFilterDefs;
