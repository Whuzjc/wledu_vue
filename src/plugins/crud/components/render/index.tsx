import { defineComponent, } from 'vue';

export default defineComponent({
	name: 'cl-render',

	props: {
		modelValue: null,
		scope: Object,
		prop: String,
		disabled: Boolean,
		isDisabled: Boolean,
		row: Object,
		column: Object,
		placeholder: String
	},

	setup(props, { slots, }) {
		return () => {
			return slots.default?.(props);
		};
	}
});
