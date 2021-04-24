export default {
    bind: function(el, binding, vnode) {
        el.scrollToThis = function(event) {
            // event.target.scrollIntoView();
            // window.scrollBy({
            //    top: event.target.getBoundingClientRect().top,
            //    behavior: 'smooth'
            // })
        }

        if(binding.value) {
            // el.addEventListener("focus", el.scrollToThis)
        }
    },
    unbind: function(el) {
        // el.removeEventListener("focus", el.scrollToThis)
    }
}
