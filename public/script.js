var PRICE = 9.99;
var  LOAD_NUM = 10;

var app = new Vue({
    el: '#app',
    data: {
        //attributes for Vue object
        total: 0,
        items: [],
        cart: [],
        results: [],
        search: 'anime',
        lastSearch: '',
        loading: false,
        price: PRICE
    },
    methods: {
        //methods for Vue object
        appendItems() {
            if (this.items.length < this.results.length) {
                //we have undisplayed items in our search results - add next n of them to our displayed items 
                var newItems = this.results.slice(this.items.length, this.items.length + LOAD_NUM)    //get next n items from results data array
                this.items = this.items.concat(newItems);
            }
        },
        onSubmit: function(){
            if(this.search.length) {
                this.items = [];
                this.loading = true;
                this.$http
                    .get('/search/'.concat(this.search))
                    .then(function(res) {
                        //promise resolved, get data element from results as our items
                        console.log(res);
                        this.results = res.data;
                        this.items = res.data.slice(0, LOAD_NUM); //get first n items from start of data array
                        this.lastSearch = this.search;
                        this.appendItems();
                        this.loading = false;
                    });
            }
           
        },
        addItem: function(index){
            this.total += PRICE; //"this" refers to Vue object
            var item =  this.items[index];
            var found = false;
            for (var i = 0; i < this.cart.length; i++) {
                if (this.cart[i].id === item.id){
                    found = true;
                    this.cart[i].qty++;
                    break;
                }
            }
            if (!found) {
                this.cart.push({
                    id: item.id,
                    title: item.title,
                    qty: 1,
                    price: PRICE
                });
            }
            console.log(this.cart.length);
        },
        inc: function(item){
            item.qty++;
            item.price += PRICE;
        },
        dec: function(item){
            item.qty--;
            item.price -= PRICE;

            if(item.qty <= 0){
                for(var i = 0; i < this.cart.length; i++) {
                    if (this.cart[i].id === item.id) {
                        this.cart.splice(i, 1);  //splice 1 item from the array from position i
                        break;
                    }
                }
            }
        }
    },
    filters: {
        currency: function(price) {
            return '$'.concat(price.toFixed(2));
        }
    },
    computed: {
        //computed properties allow us to keep complex logic out of the template html
        noMoreItems: function () {
            return this.items.length === this.results.length && this.results.length > 0;
        }
    },

    // View instance lifecycle hooks. (Diagram of Vue instance lifecycle at https://vuejs.org/v2/guide/instance.html)
    beforeCreate: function(){

    },
    created: function(){

    },
    beforeMount: function(){

    },
    mounted: function(){
        this.onSubmit();

        var viewInstance = this;
        /**
         * montor position of product-list-bottom
         */
        var elem = document.getElementById('product-list-bottom');
        var watcher = scrollMonitor.create(elem);
        watcher.enterViewport(function(){
            viewInstance.appendItems(); //overcome scope problem in this 3rd party library that can't see our view object via "this"
        });
    },
    beforeDestroy: function(){
        
    },
    destroyed: function(){
        
    }
});
