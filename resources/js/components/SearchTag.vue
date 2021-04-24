<template>
    <multiselect-wrapper :is-selected="!!tags" :label="label" :value="tags" :error.sync="tagError" :required="required" :class="[wrapperClasses]">
        <multiselect :ref="`multiselect${cbId}`" :options="options" v-model="tags" :placeholder="label" :track-by="selectTrackBy" :label="selectName" :searchable="true" :show-labels="false" :allow-empty="allowEmpty" :multiple="multiple" :close-on-select="false" :taggable="true" @tag="addTag" :tag-placeholder="$t('general.enter_a_tag')" :class="['input-group-material', inputClasses]" :disabled="disabled" :loading="loading" />
    </multiselect-wrapper>
</template>
<script>
    import { mapGetters, mapActions } from 'vuex'
    
    export default {
        name: "search-tag",
        props: {
            value: {
                type: Array,
            },
            label: {
                type: String,
                default: 'Enter a tag'
            },
            selectTrackBy: {
                type: String,
                default: 'slug'
            },
            selectName: {
                type: String,
                default: 'name'
            },
            options: {
                type: Array,
                default() {
                    return []
                }
            },
            error: {
                type: String,
                default: null
            },
            allowEmpty: {
                type: Boolean,
                default: true
            },
            disabled: {
                type: Boolean,
                default: false
            },
            required: {
                type: Boolean,
                default: false
            },
            multiple: {
                type: Boolean,
                default: true
            },
            loading: {
                type: Boolean,
                default: false
            },
            autoFocus: {
                type: Boolean,
                default: false
            },
            tabindex: {
                type: Number,
                default: 0
            },
            wrapperClasses: {
                type: String,
            },
            inputClasses: {
                type: String,
                default: 'mb-4'
            },
        },
        data() {
            return {
                cbId: "",
            }
        },
        computed: {
            tags: {
                get() {
                    return this.value
                },
                set(v) {
                    this.$emit('input', v)
                }
            },
            tagError: {
                get() {
                    return this.error
                },
                set(v) {
                    this.$emit('update:error', v)
                }
            },
        },
        methods: {
            ...mapActions('common', [
                'Custom',
            ]),
            addTag(newTag) {
                this.$emit('tag', newTag)
            },
        },
        mounted() {
            if(this.autoFocus) {
                this.$refs[`multiselect${this.cbId}`].activate()
            }
        },
        created() {
            this.cbId = Math.random()
                .toString(16)
                .slice(2);
        }
    }

</script>