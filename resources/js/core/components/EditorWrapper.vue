<template>
    <div :class="['editor-wrapper', {'not-empty': !!value}, {'required': required}, height ? `height-${height}` : '']">
        <label class="input-group-material-label">{{ label }} <span class="required-asterix" v-if="required">*</span></label>

        <slot>
            <wysiwyg v-model="content" :options="computedConfig" />
        </slot>

        <slot name="errorBlock">
            <div class="text-danger invalid-feedback" style="display: block; margin-top: 0.5rem;" v-if="error">
                {{ error }}
            </div>
        </slot>
    </div>
</template>

<script>
    import { getToken } from '@core/utils/auth'
    const token = getToken()

    export default {
        name: "editor-wrapper",
        props: {
            disabled: {
                type: Boolean,
                default: false,
                description: "Whether input is required (adds an asterix *)"
            },
            required: {
                type: Boolean,
                default: false,
                description: "Whether input is required (adds an asterix *)"
            },
            config: {
                type: [String, Object],
            },
            height: {
                type: String,
                default: '',
            },
            label: {
                type: String,
                default: 'Enter content',
            },
            value: {
                type: String,
                description: "Selected value"
            },
            error: {
                type: String,
                description: "Select error (below select)"
            },
        },
        data() {
            return {
                configObj: {
                },
            }
        },
        computed: {
            content: {
                get() {
                    return this.value
                },
                set(value) {
                    this.$emit('input', value)
                    this.$emit('update:error', '')
                },
            },
            computedConfig() {
                return this.config ? (this.config.hasOwnProperty('btnsDef') ? this.config : this.configObj) : this.configObj
            }
        },
        methods: {},
        mounted() {
        }
    }

</script>
