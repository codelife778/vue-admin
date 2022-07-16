import BfCollapse from '@/components/BfCollapse/index'
import OrderTable from '@/components/OrderTable/index'

const bfComponent = {
    install: function(Vue) {
        Vue.component('BfCollapse', BfCollapse)
        Vue.component('OrderTable', OrderTable)
    }
}

export default bfComponent
