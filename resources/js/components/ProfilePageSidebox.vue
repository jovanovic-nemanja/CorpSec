<template>
    <base-container boxed class="profile-sidebar-wrapper overflow-hidden" min-height>
        <animated-loader :is-loading="isLoading" :loader-color="loaderColor" overlay-color="dark" />
        
        <slot />
    </base-container>
</template>

<script>
    export default {
        props: {
            isLoading: {
                type: Boolean,
                default: false
            },
            loaderColor: {
                type: String,
                default: '#000000'
            },
        },
    }

</script>
