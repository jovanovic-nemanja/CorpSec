<template>
    <div class="guest-layout">
        <transition-page>
            <router-view></router-view>
        </transition-page>
        <!-- <notifications group="guest" /> -->
    </div>
</template>

<script>
    export default {}
</script>

<style lang="scss">
    @import '~@js/core/assets/scss/imports.scss';

    .guest-layout {
        width: 100%;
        min-height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        background-position: center bottom;
        background: darken($primary, 15%);
        background: radial-gradient(ellipse at bottom, $primary 0%, #030617 80%);
        position: relative;

        &:before {
            content: "";
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            background: linear-gradient(135deg, #ff005d 12px, darken($primary, 15%) 22px, darken($primary, 15%) 22px, transparent 22px, transparent 62px, darken($primary, 15%) 64px, darken($primary, 15%) 69px, transparent 69px), linear-gradient(225deg, #ff005d 22px, darken($primary, 15%) 22px, darken($primary, 15%) 24px, transparent 24px, transparent 67px, darken($primary, 15%) 67px, darken($primary, 15%) 69px, transparent 69px) 0 65px;
            background-color: #ff005d;
            background-size: 64px 128px;
            opacity: 0.05;
        }


        &>>>.guest-page {
            display: flex;
            flex: 1 1 auto;
            flex-direction: column;
            min-height: 100vh;
            width: 100%;
            justify-content: center;
        }
    }

</style>
