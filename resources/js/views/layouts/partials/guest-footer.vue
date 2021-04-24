<template>
    <footer class="guest-footer mt-2">
        <p class="text-center text-white mb-0 py-3">{{ footerCredit }} {{ $t('product.version') }} {{ version }}</p>
    </footer>
</template>

<script>
    export default { 
        props: ['footerCredit', 'version']
    }
</script>
<style lang="scss" scoped>
    .guest-footer {
        p {
            opacity: 0.3;
        }
    }
</style>