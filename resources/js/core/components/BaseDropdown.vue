<template>
    <component :class="['dropdown', {show: isOpen}, {'dropdown': direction === 'down'}, {'dropup': direction ==='up'}]" :is="tag" aria-haspopup="true" :aria-expanded="isOpen" @click="componentClicked" @mouseover="handleMouseover" @mouseout="handleMouseout" v-click-outside="closeDropDown">

        <slot name="title">
            <a class="dropdown-toggle nav-link"
               :class="{'no-caret': hideArrow}"
               data-toggle="dropdown">
                <i :class="icon"></i>
                <span class="no-icon">{{title}}</span>
            </a>
        </slot>
        
        <component :is="dropdownMenuTag" :class="['dropdown-menu', {'dropdown-menu-right': position === 'right'}, {show: isOpen}, 'dropdown-' + size , menuClasses,`dropdown-${design}`]">

            <div :class="['dropdown-menu-items-wrapper', {'scroll': hasScroll}]">
                <div class="dropdown-menu-items-content">
                    <vue-scroll :ref="`vue-scroll-${cbId}`" :id="`vue-scroll-${cbId}`">
                        <slot name="withScope" :isOpen="isOpen" />
                        <slot />
                    </vue-scroll>
                </div>
            </div>
        </component>
    </component>
</template>
<script>
    export default {
        name: "base-dropdown",
        props: {
            direction: {
                type: String,
                default: "down"
            },
            title: {
                type: String,
                description: "Dropdown title"
            },
            icon: {
                type: String,
                description: "Icon for dropdown title"
            },
            position: {
                type: String,
                description: "Position of dropdown menu (e.g right|left)"
            },
            menuClasses: {
                type: [String, Object],
                description: "Dropdown menu classes"
            },
            hideArrow: {
                type: Boolean,
                description: "Whether dropdown arrow should be hidden"
            },
            toggleOnClick: {
                type: Boolean,
                default: true
            },
            hasScroll: {
                type: Boolean,
                default: false
            },
            open: {
                type: [Boolean, String],
            },
            size: {
                type: String,
                default: "sm",
            },
            tag: {
                type: String,
                default: "li",
            },
            dropdownMenuTag: {
                type: String,
                default: "ul",
            },
            trigger: {
                type: String,
                default: "click",
            },
            design: {
                type: String,
                default: "",
            },
        },
        data() {
            return {
                cbId: "",
                isOpen: false
            }
        },
        watch: {
            open(val, oldVal) {
                if (val !== oldVal) {
                    this.isOpen = val
                }
            }
        },
        methods: {
            openDropDown() {
                this.isOpen = true
                this.$emit("change", this.isOpen)
                this.$emit('update:open', this.isOpen)
            },
            toggleDropDown() {
                this.isOpen = !this.isOpen
                this.$emit("change", this.isOpen)
                this.$emit('update:open', this.isOpen)
            },
            closeDropDown() {
                this.isOpen = false
                this.$emit("change", this.isOpen)
                this.$emit('update:open', this.isOpen)
            },
            handleMouseover() {
                if(this.trigger === 'hover') {
                    this.openDropDown()
                }
            },
            handleMouseout() {
                if(this.trigger === 'hover') {
                    this.closeDropDown()
                }
            },
            componentClicked() {
                if(this.toggleOnClick) {
                    this.toggleDropDown()
                } else {
                    if(!this.isOpen) {
                        this.toggleDropDown()
                    }
                }
            }
        },
        created() {
            this.cbId = Math.random()
                .toString(16)
                .slice(2);
        }
    }

</script>
<style lang="scss">
    @import '~@js/core/assets/scss/imports.scss';

    .dropdown {
        list-style-type: none;
    }

    .dropdown .dropdown-toggle {
        cursor: pointer;
    }

    .dropdown-menu-items-wrapper.scroll {
        height: 60vh;
        overflow: hidden;

        .dropdown-menu-items-content {
            height: 100%;
        }
    }

    @include media-breakpoint-up(md) {
        .dropdown-menu-items-wrapper.scroll {
            height: 55vh;
        }
    }

    @include media-breakpoint-up(lg) {
        .dropdown-menu-items-wrapper.scroll {
            height: 45vh;
        }
    }
</style>
