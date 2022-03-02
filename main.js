Vue.component("product-review", {
  template: `
    <form @submit.prevent="onSubmit">
      <p v-if="errors.length">
        <b>Por favor, revisa los siguientes errores:</b>
          <ul>
            <li v-for="error in errors">{{error}}</li>
          </ul>
      </p>
      <div class="form-group">
        <label>Nombre</label>
          <input v-model="name" class="form-control" placeholder="Nombre">
      </div>
      <div class="form-group">
        <label>Opinión</label>
          <textarea v-model="review"  class="form-control"></textarea>
      </div>
      <div class="form-group">
        <label>Puntuación</label>
          <select v-model.number ="rating"  class="form-control">
          <option>5</option>
          <option>4</option>
          <option>3</option>
          <option>2</option>
          <option>1</option>
          </select>
      </div>
        <button type="submit" class="btn btn-primary">Enviar</button>
    </form>
  `,
  data() {
    return {
      name: null,
      review: null,
      rating: null,
      errors: []
    };
  },
  methods: {
    onSubmit() {
      this.errors = [];

      if (this.name && this.review && this.rating) {
        let productReview = {
          name: this.name,
          review: this.review,
          rating: this.rating
        };
        this.$emit("review-submitted", productReview);

        this.name=null;
        this.review=null;
        this.rating=null;
      }else{
        if (!this.name) this.errors.push("El nombre es obligatorio");
        if (!this.review) this.errors.push("La opinión es obligatoria");
        if (!this.rating) this.errors.push("La puntuación es obligatoria");
      }

    }
  }
});

Vue.component("product", {
    props: {
        oneDayShipping: {
            type: Boolean,
            required: true,
            default: true
        }
    },

    template: `
      <div>
        <div class="card">
          <div class="row">
            <div class="col-sm-5 border-end">
              <div class="gallery-wrap">
                <div class="img-big-wrap">
                  <img v-bind:src="image" /> <!-- no es necesario el escribir v-bind para que haga el bind -->
                </div>
                <hr/>
                <div class="img-small-wrap">
                  <div v-for="(variant, index) in variants" :key="variant.id" :style="variant.style"  class="item-gallery">
                    <img :src="variant.image" @mouseover="updateProduct(index)"/> <!-- hago un v-bind -->
                    <!-- <img src="assets/camiseta-BBT-M-blanca.jpg"> -->
                    <!--  algunos otros eventos de vue son @submit, @keyup, o @keyup.enter (que significa que el evento se lanza luego de soltar la tecla enter especificamente) -->
                  </div> 
                    <!-- <div class="item-gallery">
                          <img src="assets/camiseta-BBT-M-blanca.jpg">              
                         </div>
                        <div class="item-gallery">
                          <img src="assets/camiseta-BBT-F-blanca.jpg">              
                        </div>
                        <div class="item-gallery">
                          <img src="assets/camiseta-BBT-F-gris.jpg">              
                        </div>
                        <div class="item-gallery">
                          <img src="assets/camiseta-BBT-M-negra.jpg">             
                        </div> --> 
                  <!-- Lo dejo comentado de forma didactica, el div de arriba hace esto mismo pero llamando al metodo vue -->
                </div>
              </div>
            </div>
            <div class="col-sm-7">
              <div class="card-body p-5">
                <h3 class="mb-3">{{ title }} </h3>
                <p v-if="inStock">En stock</p>
                <!-- <p v-else-if="inventory > 0 && inventory <=5">¡Quedan pocas!</p> --> 
                <p v-else>Agotado</p> <!-- Es menos eficiente porque modifica el DOM -->
                <p v-show="oneDayShipping">Envío en un día </p>
                <!-- Es mas eficiente porque solo modifica el estilo -->

                <div>
                  <h5>Descripción del producto</h5>
                  <ul>
                    <li v-for="detail in details">{{ detail }}</li>
                  </ul>
                </div>

                <div v-if="variants.length > 1">
                  <h5>Modelos disponibles</h5>
                  <div v-for="variant in variants" :key="variant.id">
                    <p>{{ variant.tipo + " - " + variant.edad }} </p>
                  </div>
                </div>
                <hr/>
                <div class="addcarro">
                <button v-on:click="addToCart" :disabled="!inStock" :class="{'btn-disabled': !inStock}" class="btn btn-md btn-outline-primary" >Añadir al carrito</button>
                <!-- El evento v-on:click aca tambien puede ser @click -->
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="reviews-container"> 
          <div class="row">
            <div class="col-12">
              <h3>Opiniones de los clientes</h3>
            </div>
          </div>
          <div class="row">
            <div class="col-6">
              <product-review @review-submitted="addReview"></product-review>
            </div>
            <div v-if="!reviews.length" class="col-6">
              <p>Este producto no tiene reviews</p>
            </div>          
            <div v-else class="col-6">
              <div v-for="review in reviews" class="row">
                <div class="col-12">
                  <div>
                    <button class="btn btn-sm btn-warning"></button>
                    <button class="btn btn-sm" :class="{'btn-warning': review.rating >=2, 'btn-light': review.rating < 2 }"></button>
                    <button class="btn btn-sm" :class="{'btn-warning': review.rating >=3, 'btn-light': review.rating < 3 }"></button>
                    <button class="btn btn-sm" :class="{'btn-warning': review.rating >=4, 'btn-light': review.rating < 4 }"></button>
                    <button class="btn btn-sm" :class="{'btn-warning': review.rating ==5, 'btn-light': review.rating < 5 }"></button>
                  </div>
                  <div>
                    <strong> {{review.name}} </strong>
                  </div>
                  <div>
                    {{review.review}}
                  </div>
                  </hr>
                  </hr>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    `,
  
      data() {

        return {
          brand: "Purina Dog Show",
          product: 'Alimentos para perros',
          reviews: [],
          selectedVariant: 0,
          // inStock: false,
          // inventory: 10, Se reemplaza por quantity > 0 = inStock
          details: ["100% Balanceado", "Surtidos sabores", "Para todas las edades"],
          variants: [
          { id: 1,
            tipo: "perro",
            edad: "cachorros", 
            image: "assets/purinadogshowImage1.jpg",
            quantity: 10,
            style: {
              borderColor: "white",
              border: "1px solid"
            }
          },
          { id: 2,
            tipo: "perro",
            edad: "adultos",
            image: "assets/purinadogshowImage2.jpg",
            quantity: 8,
            style: {
              borderColor: "white",
              border: "1px solid"
            }
          },
          // { id: 3,
          //   color: "Gris",
          //   gender: "Mujer",
          //   image: "assets/camiseta-BBT-F-gris.jpg",
          //   quantity: 5,
          //   style: {
          //     borderColor: "grey",
          //     border: "1px solid"
          //   }
          // },
          // { id: 4,
          //   color: "Negra",
          //   gender: "Hombre",
          //   image: "assets/camiseta-BBT-M-negra.jpg",
          //   quantity: 0,
          //   style: {
          //     borderColor: "black",
          //     border: "1px solid"
          //   }
          // } 
          ]
        }
    },
    methods: {
      addToCart: function () {
        this.$emit('add-to-cart', this.variants[this.selectedVariant].id);
      },
      updateProduct: function(index){
        this.selectedVariant=index;
      },
      addReview (review) {
        this.reviews.push(review);
      }
    },
    computed: {
      title() {
        return this.product + " " + this.brand;
      },
      image() {
        return this.variants[this.selectedVariant].image;
      },
      inStock() {
        return this.variants[this.selectedVariant].quantity > 0;
      }

    }
    });

var app = new Vue({ 
  el: '#app',
  data: {
    cart: []
  },
  methods: {
    updateCart(id) {
      this.cart.push(id);
    }
  }

});