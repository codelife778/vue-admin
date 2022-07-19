import BfCollapse from '@/components/BfCollapse/index'
import OrderTable from '@/components/OrderTable/index'
import BfProgress from '@/components/BfProgress/index'

const bfComponent = {
    install: function(Vue) {
        Vue.component('BfCollapse', BfCollapse)
        Vue.component('OrderTable', OrderTable)
        Vue.component('BfProgress', BfProgress)
    }
}

export default bfComponent
