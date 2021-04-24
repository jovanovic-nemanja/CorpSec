<template>
    <div class="custom-control custom-checkbox" :class="[classes, {disabled: disabled}]">
        <input :id="cbId" class="custom-control-input" type="checkbox" :disabled="disabled" :value="value" v-model="model" @change="onChange" />

        <template v-if="clickStop">
            <label :for="cbId" class="custom-control-label" @click.stop.prevent="model=!model">
                <slot>
                    <span v-if="inline">&nbsp;</span>
                </slot>
            </label>
        </template>

        <template v-else>
            <label :for="cbId" class="custom-control-label">
                <slot>
                    <span v-if="inline">&nbsp;</span>
                </slot>
            </label>
        </template>
    </div>
</template>
<script>
    export default {
        name: "base-checkbox",
        model: {
            prop: "checked"
        },
        props: {
            checked: {
                type: [Array, Boolean, String],
                description: "Whether checkbox is checked"
            },
            disabled: {
                type: Boolean,
                description: "Whether checkbox is disabled"
            },
            inline: {
                type: Boolean,
                description: "Whether checkbox is inline"
            },
            clickStop: {
                type: Boolean,
                default: false
            },
            design: {
                type: String,
                default: "default",
                description: "Button design (e,g primary, danger etc)"
            },
            value: {
                type: [Array, String, Number, Boolean],
                default: true,
                description: "Value to check in an array"
            },
        },
        data() {
            return {
                cbId: "",
                touched: false,
                checkedProxy: false
            };
        },
        computed: {
            model: {
                get() {
                    return this.checked !== 'false' && this.checked !== '' ? this.checked : false
                },
                set(v) {
                    if (!this.touched) {
                        this.touched = true
                    }
                    this.checkedProxy = v
                    if(this.clickStop) {
                        this.$emit('input', this.checkedProxy)
                    }
                }
            },
            classes() {
                let classes = [
                    { "form-check-inline": this.inline },
                    this.design && !this.disabled ? `control-${this.design}` : "",
                ];
                return classes;
            }
        },
        methods: {
            onChange: function(e) {
                this.$emit('input', this.checkedProxy)
            }
        },
        created() {
            this.cbId = Math.random()
                .toString(16)
                .slice(2);
        }
    };

</script>
